import { cx } from "@/lib/utils";
import type { BlogStatus } from "@/types";

const STYLES: Record<BlogStatus, string> = {
  DRAFT: "bg-ink/5 text-ink2",
  PENDING: "bg-gold-light/60 text-[#8A6A1F]",
  APPROVED: "bg-forest-light/15 text-forest-dark",
  PUBLISHED: "bg-forest/10 text-forest-dark",
  REJECTED: "bg-clay/10 text-clay",
  UNPUBLISHED: "bg-ink/5 text-ink2",
};

const LABELS: Record<BlogStatus, string> = {
  DRAFT: "Draft",
  PENDING: "Pending review",
  APPROVED: "Approved",
  PUBLISHED: "Published",
  REJECTED: "Rejected",
  UNPUBLISHED: "Unpublished",
};

export default function StatusBadge({ status }: { status: BlogStatus }) {
  return (
    <span className={cx("status-pill", STYLES[status])}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {LABELS[status]}
    </span>
  );
}
