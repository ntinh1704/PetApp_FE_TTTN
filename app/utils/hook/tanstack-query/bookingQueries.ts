import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createBookingApi,
  deleteBookingApi,
  getBookingByIdApi,
  getBookingsApi,
  updateBookingApi,
  addServiceToBookingApi,
  getStaffAvailabilityApi,
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: BookingCreate) => createBookingApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
};

export const useUpdateBookingMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: BookingUpdate) => updateBookingApi(payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      if (variables.id) {
        queryClient.invalidateQueries({ queryKey: ["bookings", variables.id] });
      }
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unreadCount"] });
    },
  });
};

export const useDeleteBookingMutation = () => {
  return useMutation({
    mutationFn: (id: number) => deleteBookingApi(id),
  });
};

export const useAddServiceToBookingMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ bookingId, serviceId, quantity }: { bookingId: number, serviceId: number, quantity: number }) => 
      addServiceToBookingApi(bookingId, serviceId, quantity),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["bookings", variables.bookingId] });
    },
  });
};

export const useStaffAvailabilityQuery = (date: string, time: string, endTime: string) => {
  return useQuery({
    queryKey: ["staff-availability", date, time, endTime],
    queryFn: () => getStaffAvailabilityApi(date, time, endTime),
    enabled: !!date && !!time,
  });
};
