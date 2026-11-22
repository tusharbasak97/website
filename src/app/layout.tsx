import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono, Kaushan_Script } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { LenisProvider } from "@/components/providers/lenis-provider";
import { FontAwesomeProvider } from "@/components/providers/fontawesome-provider";
import { Preloader } from "@/components/preloader";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
  display: "swap",
});

const kaushanScript = Kaushan_Script({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-kaushan",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "oklch(1 0 0)" },
    { media: "(prefers-color-scheme: dark)", color: "oklch(0.12 0.015 260)" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://tusharbasak97.github.io/website/"),
  title: {
    default: "Tushar Basak - Cybersecurity Analyst & Web Developer",
    template: "%s | Tushar Basak",
  },
  description:
    "Portfolio of Tushar Basak, an accomplished Cybersecurity Analyst and Web Developer. Specialized in penetration testing, ethical hacking, and building secure tools like the Strongest Password Generator (PassG) and TodoPomo.",
  keywords: [
    "Cybersecurity Analyst",
    "Web Developer",
    "Password Generator",
    "PassG",
    "Secure Password Tool",
    "SOC Analyst",
    "Penetration Tester",
    "Ethical Hacker",
    "Frontend Developer",
    "Tushar Basak",
    "TodoPomo",
    "React",
    "JavaScript",
  ],
  authors: [{ name: "Tushar Basak", url: "https://tusharbasak97.github.io/website/" }],
  creator: "Tushar Basak",
  publisher: "Tushar Basak",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "profile",
    locale: "en_US",
    url: "https://tusharbasak97.github.io/website/",
    siteName: "Tushar Basak Cybersecurity Portfolio",
    title: "Tushar Basak - Expert Cybersecurity Analyst | SOC Analyst | Penetration Tester | Ethical Hacker",
    description:
      "Expert Cybersecurity Analyst & SOC Analyst specializing in penetration testing, ethical hacking, threat hunting, vulnerability management, SIEM, incident response, cloud security (AWS, Azure, GCP), and security compliance. Certified in CEH, OSCP, CISSP, CompTIA Security+.",
    images: [
      {
        url: "https://tusharbasak97.github.io/website/assets/images/hero.webp",
        width: 1200,
        height: 630,
        alt: "Tushar Basak - Cybersecurity Analyst Profile Picture",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tushar Basak - Expert Cybersecurity Analyst | SOC Analyst | Penetration Tester",
    description:
      "Expert Cybersecurity Analyst & SOC Analyst specializing in penetration testing, ethical hacking, threat hunting, vulnerability management, SIEM, incident response, cloud security (AWS, Azure, GCP), and security compliance.",
    creator: "@tusharbasak97",
    images: ["https://tusharbasak97.github.io/website/assets/images/hero.webp"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/assets/images/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/assets/images/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/assets/images/apple-touch-icon-180x180.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/assets/site.webmanifest",
  verification: {
    google: "96vruK8SQFp_p8aIZS2Cd0PoBn6Tsb-FA3s1y_-TiNs",
  },
  alternates: {
    canonical: "https://tusharbasak97.github.io/website/",
  },
};

const jsonLdData = [
  {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Tushar Basak",
    "alternateName": "CyberBasak",
    "jobTitle": "Cybersecurity Analyst | SOC Analyst | Penetration Tester | Ethical Hacker",
    "description":
      "Expert Cybersecurity Analyst and SOC Analyst specializing in penetration testing, ethical hacking, threat hunting, vulnerability management, SIEM operations, incident response, malware analysis, digital forensics, cloud security (AWS, Azure, GCP), network security, application security, and security compliance (HIPAA, GDPR, ISO 27001, PCI-DSS, NIST)",
    "url": "https://tusharbasak97.github.io/website/",
    "image": "https://tusharbasak97.github.io/website/assets/images/hero.webp",
    "birthDate": "1997-10-02",
    "nationality": "Indian",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IN",
      "addressRegion": "India",
    },
    "email": "tushar.basak97@gmail.com",
    "telephone": "+91-8299312126",
    "knowsAbout": [
      "Cybersecurity Analyst",
      "Penetration Testing",
      "Ethical Hacking",
      "Threat Hunting",
      "Vulnerability Management",
      "SIEM Operations",
      "Incident Response",
      "Network Security",
      "Cloud Security",
      "Web Application Security",
      "Python",
      "Bash",
      "React",
      "Next.js",
      "JavaScript",
      "Wireshark",
      "Nmap",
      "Burp Suite",
      "Splunk"
    ],
    "hasCredential": [
      {
        "@type": "EducationalOccupationalCredential",
        "name": "Master of Computer Applications (MCA)",
        "recognizedBy": {
          "@type": "Organization",
          "name": "Manipal University Jaipur"
        },
        "dateCreated": "2023"
      },
      {
        "@type": "EducationalOccupationalCredential",
        "name": "Bachelor of Science",
        "recognizedBy": {
          "@type": "Organization",
          "name": "Swami Vivekananda Subharti University"
        },
        "dateCreated": "2020"
      },
      {
        "@type": "EducationalOccupationalCredential",
        "name": "Cybersecurity Trainee",
        "recognizedBy": {
          "@type": "Organization",
          "name": "Tata Strive | SAP India"
        },
        "dateCreated": "2024-09-15"
      }
    ],
    "worksFor": [
      {
        "@type": "Organization",
        "name": "Secure Life HR Service Private Ltd",
        "jobTitle": "IT Support Engineer"
      }
    ],
    "sameAs": [
      "https://www.linkedin.com/in/tusharbasak97/",
      "https://github.com/tusharbasak97/",
      "https://tryhackme.com/p/tusharbasak97",
      "https://medium.com/@tusharbasak97/",
      "https://bit.ly/m/DataBasak",
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Tushar Basak Portfolio",
    "alternateName": "Tushar Basak Cybersecurity Portfolio",
    "url": "https://tusharbasak97.github.io/website/",
    "description":
      "Professional portfolio of Tushar Basak, Cybersecurity Analyst and Web Developer specializing in ethical hacking, penetration testing, and secure modern web development",
    "inLanguage": "en-US",
  },
  {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Tushar Basak Cybersecurity Services",
    "description": "Professional cybersecurity consulting services including penetration testing, vulnerability assessment, and security analysis",
    "provider": {
      "@type": "Person",
      "name": "Tushar Basak"
    },
    "areaServed": "India",
    "serviceType": [
      "Cybersecurity Consulting",
      "Penetration Testing",
      "Vulnerability Assessment",
      "Security Auditing",
      "Web Application Security",
      "Network Hardening"
    ]
  }
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${jakarta.variable} ${jetbrainsMono.variable} ${kaushanScript.variable}`}>
      <head>
        <script
          id="theme-color-initializer"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var c=localStorage.getItem('portfolio-color-theme');if(c&&['color-1','color-2','color-3'].indexOf(c)!==-1){document.documentElement.setAttribute('data-theme-color',c);}else{document.documentElement.setAttribute('data-theme-color','color-1');}}catch(e){}})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
        />
      </head>
      <body className="w-full min-h-screen font-sans antialiased bg-[var(--bg-black-900)] text-[var(--text-black-900)] transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          <Preloader />
          <FontAwesomeProvider>
            <LenisProvider>
              <div className="w-full min-h-screen">
                {children}
              </div>
            </LenisProvider>
          </FontAwesomeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}