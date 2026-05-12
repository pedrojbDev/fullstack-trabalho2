import { statusColor, statusLabel } from "@/shared/lib/utils/status";
import { Badge } from "./badge";
import { cn } from "@/shared/lib/utils/cn";

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge
      className={cn(
        statusColor[status] || "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
      )}
    >
      {statusLabel[status] || status}
    </Badge>
  );
}
