"use client";
import { useEffect, useMemo, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

const colorByStatus: Record<string, string> = {
  scheduled: "#2563EB",
  confirmed: "#10B981",
  pending: "#F59E0B",
  cancelled: "#EF4444",
  completed: "#4B5563",
  blocked: "#9CA3AF",
};

export default function CalendarPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [blocked, setBlocked] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    fetch("/api/appointments").then((r) => r.json()).then((d) => setAppointments(Array.isArray(d) ? d : []));
    fetch("/api/blocked-times").then((r) => r.json()).then((d) => setBlocked(Array.isArray(d) ? d : []));
  }, []);

  const events = useMemo(() => {
    const a = appointments
      .filter((x) => !statusFilter || x.status === statusFilter)
      .map((x) => ({ id: x.id, title: x.title, start: `${x.date}T${x.start_time}`, end: `${x.date}T${x.end_time}`, color: colorByStatus[x.status] }));
    const b = blocked.map((x) => ({ id: x.id, title: `Bloqueio: ${x.title}`, start: `${x.date}T${x.start_time}`, end: `${x.date}T${x.end_time}`, color: colorByStatus.blocked }));
    return [...a, ...b];
  }, [appointments, blocked, statusFilter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Calendário</h1>
        <select className="input max-w-xs" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">Todos os status</option>
          <option value="scheduled">Agendado</option><option value="confirmed">Confirmado</option><option value="pending">Pendente</option><option value="cancelled">Cancelado</option><option value="completed">Concluído</option>
        </select>
      </div>
      <div className="card p-3"><FullCalendar plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]} initialView="dayGridMonth" headerToolbar={{ left: "prev,next today", center: "title", right: "dayGridMonth,timeGridWeek,timeGridDay" }} events={events} dateClick={(arg) => (window.location.href = `/appointments/new?date=${arg.dateStr}`)} eventClick={(arg) => alert(`Evento: ${arg.event.title}`)} /></div>
      <div className="card p-4"><h2 className="mb-2 font-semibold">Legenda</h2><div className="grid gap-2 sm:grid-cols-3">{Object.entries(colorByStatus).map(([k,v])=><div key={k} className="flex items-center gap-2"><span className="h-3 w-3 rounded-full" style={{backgroundColor:v}} /><span className="text-sm">{k}</span></div>)}</div></div>
    </div>
  );
}

