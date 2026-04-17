import { Booking, BookingCreate, BookingUpdate } from "../utils/models/booking";
import { api } from "./api";

export async function getBookingsApi() {
  const res = await api.get<Booking[]>("/bookings", {
    params: { all: true },
  });
  return res.data;
}

export async function getBookingsByDateApi(date: string) {
  const res = await api.get<Booking[]>("/bookings", {
    params: { all: true, booking_date: date },
  });
  return res.data;
}

export async function getBookingByIdApi(bookingId: number) {
  const res = await api.get<Booking>(`/bookings/${bookingId}`);
  return res.data;
}

export async function createBookingApi(payload: BookingCreate) {
  const res = await api.post<Booking>("/bookings/", payload);
  return res.data;
}

export async function updateBookingApi(payload: BookingUpdate) {
  const res = await api.put<Booking>("/bookings/", payload);
  return res.data;
}

export async function deleteBookingApi(id: number) {
  const res = await api.delete<Booking>("/bookings/", { data: { id } });
  return res.data;
}
