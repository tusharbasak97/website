import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-8xl font-black text-[var(--skin-color)]">404</h1>
      <h2 className="mt-4 text-2xl font-bold">Page Not Found</h2>
      <p className="mt-2 text-[var(--text-black-700)]">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center px-6 py-3 rounded-full bg-[var(--skin-color)] text-white font-medium hover:opacity-90 transition-opacity"
      >
        Return Home
      </Link>
    </main>
  );
}
