export type AppointmentStatus =
  | "scheduled"
  | "confirmed"
  | "pending"
  | "cancelled"
  | "completed"
  | "blocked";

export interface Client {
  id: string;
  user_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  notes: string | null;
  is_archived?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Space {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  capacity: number | null;
  location: string | null;
  is_active: boolean;
  is_archived?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  user_id: string;
  client_id: string;
  space_id: string;
  title: string;
  description: string | null;
  date: string;
  start_time: string;
  end_time: string;
  status: AppointmentStatus;
  category_color: string | null;
  created_at: string;
  updated_at: string;
}

export interface BlockedTime {
  id: string;
  user_id: string;
  space_id: string | null;
  title: string;
  reason: string | null;
  date: string;
  start_time: string;
  end_time: string;
  created_at: string;
  updated_at: string;
}

export interface Reminder {
  id: string;
  appointment_id: string;
  type: "email";
  scheduled_for: string;
  status: "pending" | "sent" | "failed";
  sent_at?: string | null;
  message?: string | null;
  created_at: string;
  updated_at: string;
}

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

