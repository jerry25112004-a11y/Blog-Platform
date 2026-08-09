"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center text-center">
      <span className="eyebrow !text-clay">Something went wrong</span>
      <h1 className="mt-2 font-display text-3xl font-medium text-ink">We hit a snag</h1>
      <p className="mt-2 max-w-sm text-ink2">
        That request didn&apos;t go through. You can try again, or head back to the homepage.
      </p>
      <button onClick={reset} className="btn-primary mt-6">Try again</button>
    </div>
  );
}
