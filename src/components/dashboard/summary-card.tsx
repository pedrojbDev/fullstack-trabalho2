import { ReactNode } from "react";

export function SummaryCard({ title, value, icon }: { title: string; value: string | number; icon?: ReactNode }) {
  return (
    <div className="card p-4">
      <div className="mb-2 flex items-center justify-between text-sm text-slate-500">
        <span>{title}</span>
        {icon}
      </div>
      <div className="text-2xl font-bold text-slate-800">{value}</div>
    </div>
  );
}

