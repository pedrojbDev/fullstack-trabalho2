export type AppointmentStatus =
  | "scheduled"
  | "confirmed"
  | "pending"
  | "cancelled"
  | "completed"
  | "blocked";

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
