export interface Service {
  id: number;
  name: string;
  description?: string | null;
  icon?: string | null;
  price?: number | null;
  duration?: number | null;
  images?: string[] | null;
  created_at?: string | null;
}

export interface ServiceCreate {
  name: string;
  description?: string | null;
  icon?: string | null;
  price?: number | null;
  duration?: number | null;
  images?: string[] | null;
}

export interface ServiceUpdate {
  id: number;
  name?: string | null;
  description?: string | null;
  icon?: string | null;
  price?: number | null;
  duration?: number | null;
  images?: string[] | null;
}

