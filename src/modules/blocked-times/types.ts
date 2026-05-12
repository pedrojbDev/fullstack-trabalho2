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
