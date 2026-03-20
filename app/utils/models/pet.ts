export interface Pet {
  id: number;
  user_id: number;
  name: string;
  breed?: string | null;
  gender?: string | null;
  age?: number | null;
  color?: string | null;
  height?: number | null;
  weight?: number | null;
  image?: string | null;
  created_at?: string | null;
}

export interface PetCreate {
  user_id: number;
  name: string;
  breed?: string | null;
  gender?: string | null;
  age?: number | null;
  color?: string | null;
  height?: number | null;
  weight?: number | null;
  image?: string | null;
}

export interface PetUpdate {
  id: number;
  name?: string | null;
  breed?: string | null;
  gender?: string | null;
  age?: number | null;
  color?: string | null;
  height?: number | null;
  weight?: number | null;
  image?: string | null;
}
