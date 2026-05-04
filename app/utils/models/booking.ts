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
  staff_id?: number | null;
  staff_name?: string | null;
  services_detail?: BookingServiceDetail[];
}

export interface BookingServiceDetail {
  id: number;
  service_id: number;
  service_name: string;
  price: number;
  quantity: number;
  is_addon: boolean;
  subtotal: number;
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
  staff_id?: number | null;
}

export interface BookingUpdate {
  id: number;
  status?: string;
  note?: string | null;
  cancel_reason?: string | null;
  staff_id?: number | null;
}
