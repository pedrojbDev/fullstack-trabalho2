import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex animate-fade-in flex-col items-center justify-center gap-3 px-6 py-14 text-center">
      <span className="grid h-12 w-12 animate-pop place-items-center rounded-full bg-brand-50 text-brand-600">
        <Icon size={22} />
      </span>
      <div>
        <p className="text-base font-semibold text-slate-900">{title}</p>
        {description && (
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
