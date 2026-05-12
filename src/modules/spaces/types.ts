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
