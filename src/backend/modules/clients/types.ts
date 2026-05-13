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
