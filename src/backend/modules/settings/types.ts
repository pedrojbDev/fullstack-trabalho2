export interface AgendaSettings {
  id: string;
  user_id: string;
  opening_time: string;
  closing_time: string;
  appointment_duration_minutes: number;
  interval_minutes: number;
  default_view: "day" | "week" | "month";
  created_at: string;
  updated_at: string;
}
