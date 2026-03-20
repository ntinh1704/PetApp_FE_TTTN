import { useMutation, useQuery } from "@tanstack/react-query";
import {
    createBookingApi,
    deleteBookingApi,
    getBookingByIdApi,
    getBookingsApi,
    updateBookingApi,
} from "../../../services/authBooking";
import { BookingCreate, BookingUpdate } from "../../models/booking";

export const useBookingsQuery = () => {
  return useQuery({
    queryKey: ["bookings"],
    queryFn: getBookingsApi,
  });
};

export const useBookingByIdQuery = (bookingId: number) => {
  return useQuery({
    queryKey: ["bookings", bookingId],
    queryFn: () => getBookingByIdApi(bookingId),
    enabled: Number.isFinite(bookingId),
  });
};

export const useCreateBookingMutation = () => {
  return useMutation({
    mutationFn: (payload: BookingCreate) => createBookingApi(payload),
  });
};

export const useUpdateBookingMutation = () => {
  return useMutation({
    mutationFn: (payload: BookingUpdate) => updateBookingApi(payload),
  });
};

export const useDeleteBookingMutation = () => {
  return useMutation({
    mutationFn: (id: number) => deleteBookingApi(id),
  });
};
