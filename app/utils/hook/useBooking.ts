import {
    useBookingByIdQuery,
    useBookingsQuery,
    useCreateBookingMutation,
    useDeleteBookingMutation,
    useUpdateBookingMutation,
} from "./tanstack-query/bookingQueries";

export const useBookings = () => {
  return useBookingsQuery();
};

export const useBookingById = (bookingId: number) => {
  return useBookingByIdQuery(bookingId);
};

export const useCreateBooking = () => {
  return useCreateBookingMutation();
};

export const useUpdateBooking = () => {
  return useUpdateBookingMutation();
};

export const useDeleteBooking = () => {
  return useDeleteBookingMutation();
};
