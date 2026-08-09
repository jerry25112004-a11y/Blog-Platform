export default function LoadingSpinner({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-16 text-ink2">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink/20 border-t-forest" />
      <span className="text-sm">{label}…</span>
    </div>
  );
}
