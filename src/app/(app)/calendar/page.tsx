"use client";

import { useEffect, useMemo, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Select } from "@/shared/components/ui/select";
import { PageHeader } from "@/shared/components/ui/page-header";
import { statusHex, statusLabel } from "@/shared/lib/utils/status";

type Appt = {
  id: string;
  title: string;
  date: string;
  start_time: string;
  end_time: string;
  status: string;
};

type Blocked = Omit<Appt, "status">;

export default function CalendarPage() {
  const [appointments, setAppointments] = useState<Appt[]>([]);
  const [blocked, setBlocked] = useState<Blocked[]>([]);
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    fetch("/api/appointments")
      .then((r) => r.json())
      .then((d) => setAppointments(Array.isArray(d) ? d : []));
    fetch("/api/blocked-times")
      .then((r) => r.json())
      .then((d) => setBlocked(Array.isArray(d) ? d : []));
  }, []);

  const events = useMemo(() => {
    const a = appointments
      .filter((x) => !statusFilter || x.status === statusFilter)
      .map((x) => ({
        id: x.id,
        title: x.title,
        start: `${x.date}T${x.start_time}`,
        end: `${x.date}T${x.end_time}`,
        color: statusHex[x.status],
      }));
    const b = blocked.map((x) => ({
      id: x.id,
      title: `Bloqueio: ${x.title}`,
      start: `${x.date}T${x.start_time}`,
      end: `${x.date}T${x.end_time}`,
      color: statusHex.blocked,
    }));
    return [...a, ...b];
  }, [appointments, blocked, statusFilter]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Calendário"
        description="Visualize todos os compromissos e bloqueios."
        actions={
          <Select
            className="w-48"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Todos os status</option>
            <option value="scheduled">Agendado</option>
            <option value="confirmed">Confirmado</option>
            <option value="pending">Pendente</option>
            <option value="cancelled">Cancelado</option>
            <option value="completed">Concluído</option>
          </Select>
        }
      />

      <Card>
        <CardContent>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            locale="pt-br"
            buttonText={{
              today: "Hoje",
              month: "Mês",
              week: "Semana",
              day: "Dia",
            }}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            events={events}
            height="auto"
            dateClick={(arg) =>
              (window.location.href = `/appointments/new?date=${arg.dateStr}`)
            }
            eventClick={(arg) => alert(`Evento: ${arg.event.title}`)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">
            Legenda
          </h2>
          <div className="stagger grid gap-2 sm:grid-cols-3">
            {Object.entries(statusHex).map(([k, v]) => (
              <div
                key={k}
                className="flex items-center gap-2 text-sm text-slate-700"
              >
                <span
                  className="h-3 w-3 rounded-full transition-transform duration-200 hover:scale-150"
                  style={{ backgroundColor: v }}
                />
                {statusLabel[k] || k}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
