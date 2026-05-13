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
