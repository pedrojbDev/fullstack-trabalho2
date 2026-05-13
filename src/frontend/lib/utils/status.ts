export const statusLabel: Record<string, string> = {
  scheduled: "Agendado",
  confirmed: "Confirmado",
  pending: "Pendente",
  cancelled: "Cancelado",
  completed: "Concluído",
  blocked: "Bloqueado",
};

export const statusColor: Record<string, string> = {
  scheduled: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  confirmed: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  pending: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  cancelled: "bg-red-50 text-red-700 ring-1 ring-red-200",
  completed: "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
  blocked: "bg-gray-100 text-gray-700 ring-1 ring-gray-200",
};

export const statusHex: Record<string, string> = {
  scheduled: "#2563EB",
  confirmed: "#10B981",
  pending: "#F59E0B",
  cancelled: "#EF4444",
  completed: "#4B5563",
  blocked: "#9CA3AF",
};
