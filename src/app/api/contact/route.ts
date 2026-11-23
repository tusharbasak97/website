import { NextResponse } from "next/server";
import { Resend } from "resend";

// In-memory sliding window rate limiter
// Limits submissions to max 5 requests per 10 minutes per IP address
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const clientData = rateLimitMap.get(ip);

  // Clean up stale entries periodically
  if (rateLimitMap.size > 1000) {
    for (const [key, val] of rateLimitMap.entries()) {
      if (now > val.resetTime) {
        rateLimitMap.delete(key);
      }
    }
  }

  if (!clientData || now > clientData.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (clientData.count >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }

  clientData.count += 1;
  return false;
}

export async function POST(request: Request) {
  try {
    // 1. IP extraction for rate limiting & abuse tracking
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a few minutes before trying again." },
        { status: 429 }
      );
    }

    // 2. Parse payload (supports JSON & FormData)
    let body: {
      name?: unknown;
      email?: unknown;
      subject?: unknown;
      message?: unknown;
      _gotcha?: unknown;
      turnstileToken?: unknown;
    } = {};

    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      body = await request.json().catch(() => ({}));
    } else {
      const formData = await request.formData().catch(() => new FormData());
      body = {
        name: formData.get("name"),
        email: formData.get("email"),
        subject: formData.get("subject"),
        message: formData.get("message"),
        _gotcha: formData.get("_gotcha"),
        turnstileToken: formData.get("turnstileToken"),
      };
    }

    const { name, email, subject, message, _gotcha, turnstileToken } = body;

    // 3. Anti-bot honeypot check:
    // If the hidden honeypot field is filled, silently discard to trick bots without exposing status
    if (_gotcha) {
      return NextResponse.json({ success: true, message: "Inquiry received." });
    }

    // 4. Input sanitization & boundary enforcement
    const trimmedName = typeof name === "string" ? name.trim() : "";
    const trimmedEmail = typeof email === "string" ? email.trim() : "";
    const trimmedSubject = typeof subject === "string" ? subject.trim() : "";
    const trimmedMessage = typeof message === "string" ? message.trim() : "";

    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;

    if (!trimmedName || trimmedName.length > 100) {
      return NextResponse.json(
        { error: "Please provide a valid name (maximum 100 characters)." },
        { status: 400 }
      );
    }

    if (!trimmedEmail || !emailRegex.test(trimmedEmail) || trimmedEmail.length > 120) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    if (!trimmedSubject || trimmedSubject.length > 150) {
      return NextResponse.json(
        { error: "Please provide a valid subject line (maximum 150 characters)." },
        { status: 400 }
      );
    }

    if (!trimmedMessage || trimmedMessage.length > 3000) {
      return NextResponse.json(
        { error: "Please provide a message (maximum 3000 characters)." },
        { status: 400 }
      );
    }

    // 5. Cloudflare Turnstile token verification (active if secret key is configured)
    const turnstileSecret = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY;
    if (turnstileSecret) {
      if (!turnstileToken || typeof turnstileToken !== "string") {
        return NextResponse.json(
          { error: "Security check failed. Turnstile verification token missing." },
          { status: 400 }
        );
      }

      try {
        const verifyRes = await fetch(
          "https://challenges.cloudflare.com/turnstile/v0/siteverify",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              secret: turnstileSecret,
              response: turnstileToken,
              remoteip: ip,
            }),
          }
        );
        const verifyData = await verifyRes.json();
        if (!verifyData.success) {
          return NextResponse.json(
            { error: "Automated verification failed. Please try again." },
            { status: 403 }
          );
        }
      } catch (err) {
        console.error("Turnstile verification service error:", err);
        return NextResponse.json(
          { error: "Verification service temporarily unavailable. Please try again later." },
          { status: 500 }
        );
      }
    }

    // 6. Recipient address kept strictly server-side (never exposed to client bundle)
    const recipientEmail = process.env.CONTACT_RECIPIENT_EMAIL || "tusharbasak97@gmail.com";
    const resendApiKey = process.env.RESEND_API_KEY;

    if (resendApiKey) {
      const resend = new Resend(resendApiKey);
      const { error } = await resend.emails.send({
        from: "Portfolio Contact <onboarding@resend.dev>",
        to: recipientEmail,
        replyTo: trimmedEmail,
        subject: `[Portfolio Inquiry] ${trimmedSubject}`,
        text: `You have received a new contact submission from your portfolio website:

Name: ${trimmedName}
Email: ${trimmedEmail}
Subject: ${trimmedSubject}

Message:
${trimmedMessage}

----------------------------------------
Sent at: ${new Date().toUTCString()}
Client IP: ${ip}
`,
      });

      if (error) {
        console.error("Failed to send email via Resend:", error);
        return NextResponse.json(
          { error: "Failed to deliver email. Please try again or reach out directly." },
          { status: 500 }
        );
      }
    } else {
      // Local development / testing mode fallback
      console.log(`[Contact Form Received -> ${recipientEmail}]:`, {
        from: trimmedEmail,
        name: trimmedName,
        subject: trimmedSubject,
        message: trimmedMessage,
        ip,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Your message has been sent successfully. Thank you!",
    });
  } catch (error) {
    console.error("Contact API route unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}
