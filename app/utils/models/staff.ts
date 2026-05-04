export interface Staff {
  id: number;
  name: string;
  phone?: string | null;
  avatar?: string | null;
  specialty?: string | null;
  is_active?: boolean;
  created_at?: string | null;
}

export interface StaffCreate {
  name: string;
  phone?: string | null;
  avatar?: string | null;
  specialty?: string | null;
}

export interface StaffUpdate {
  id: number;
  name?: string | null;
  phone?: string | null;
  avatar?: string | null;
  specialty?: string | null;
  is_active?: boolean | null;
}
