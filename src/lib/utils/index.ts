import { clsx } from "clsx";

export const cn = (...classes: Array<string | false | null | undefined>) => clsx(classes);

export const statusLabel: Record<string, string> = {
  scheduled: "Agendado",
  confirmed: "Confirmado",
  pending: "Pendente",
  cancelled: "Cancelado",
  completed: "Concluído",
  blocked: "Bloqueado",
};

export const statusColor: Record<string, string> = {
  scheduled: "bg-blue-100 text-blue-700",
  confirmed: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  cancelled: "bg-red-100 text-red-700",
  completed: "bg-slate-200 text-slate-700",
  blocked: "bg-gray-200 text-gray-700",
};

