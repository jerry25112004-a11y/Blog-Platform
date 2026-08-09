export default function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-hairline bg-white/50 px-6 py-16 text-center">
      <div className="mb-3 text-3xl">✦</div>
      <h3 className="font-display text-lg font-medium text-ink">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-ink2">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
