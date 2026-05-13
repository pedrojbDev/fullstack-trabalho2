import type { LucideIcon } from "lucide-react";
import { cn } from "@/frontend/lib/utils/cn";

export function SummaryCard({
  title,
  value,
  icon: Icon,
  accent = "bg-brand-50 text-brand-600",
  hint,
}: {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  accent?: string;
  hint?: string;
}) {
  return (
    <div className="group hover-lift relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {title}
          </p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 transition-colors group-hover:text-brand-700">
            {value}
          </p>
          {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
        </div>
        {Icon && (
          <span
            className={cn(
              "grid h-10 w-10 place-items-center rounded-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3",
              accent,
            )}
          >
            <Icon size={18} />
          </span>
        )}
      </div>
    </div>
  );
}
