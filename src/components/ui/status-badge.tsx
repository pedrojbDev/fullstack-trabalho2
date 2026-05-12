import { statusColor, statusLabel } from "@/lib/utils";

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusColor[status] || "bg-slate-100 text-slate-700"}`}>
      {statusLabel[status] || status}
    </span>
  );
}

