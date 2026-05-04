import {
    useBookingByIdQuery,
    useBookingsQuery,
    useCreateBookingMutation,
    useDeleteBookingMutation,
    useUpdateBookingMutation,
    useAddServiceToBookingMutation,
    useStaffAvailabilityQuery,
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

export const useAddServiceToBooking = () => {
  return useAddServiceToBookingMutation();
};

export const useStaffAvailability = (date: string, time: string, endTime: string) => {
  return useStaffAvailabilityQuery(date, time, endTime);
};
