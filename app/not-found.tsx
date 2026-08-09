import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center text-center">
      <span className="eyebrow">404</span>
      <h1 className="mt-2 font-display text-3xl font-medium text-ink">Page not found</h1>
      <p className="mt-2 max-w-sm text-ink2">
        The page you&apos;re looking for doesn&apos;t exist, or may have been unpublished.
      </p>
      <Link href="/" className="btn-primary mt-6">Back to home</Link>
    </div>
  );
}
