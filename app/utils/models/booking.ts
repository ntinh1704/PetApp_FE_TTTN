export interface Booking {
  id: number;
  user_id: number;
  pet_id: number;
  booking_date: string;
  booking_time: string;
  status: string;
  note?: string | null;
  total_price: number;
  created_at?: string | null;
}

export interface BookingServiceCreate {
  service_id: number;
}

export interface BookingCreate {
  user_id: number;
  pet_id: number;
  booking_date: string;
  booking_time: string;
  status: string;
  note?: string | null;
  services: BookingServiceCreate[];
}

export interface BookingUpdate {
  id: number;
  status?: string;
  note?: string | null;
}
