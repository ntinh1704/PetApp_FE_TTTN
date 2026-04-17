export interface Booking {
  id: number;
  user_id: number;
  user_name?: string | null;
  pet_id: number;
  pet_name?: string | null;
  service_name?: string | null;
  service_icon?: string | null;
  service_names?: string[];
  booking_date: string;
  booking_time: string;
  booking_end_time?: string | null;
  status: string;
  note?: string | null;
  cancel_reason?: string | null;
  total_price: number;
  payment_method?: string | null;
  created_at?: string | null;
}

export interface BookingCreate {
  pet_id: number;
  service_ids: number[];
  booking_date: string;
  booking_time: string;
  booking_end_time?: string | null;
  status: string;
  note?: string | null;
  total_price?: number | null;
  payment_method?: string | null;
}

export interface BookingUpdate {
  id: number;
  status?: string;
  note?: string | null;
  cancel_reason?: string | null;
}
