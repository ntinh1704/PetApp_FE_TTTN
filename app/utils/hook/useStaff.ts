import {
  useStaffQuery,
  useActiveStaffQuery,
  useCreateStaffMutation,
  useUpdateStaffMutation,
  useDeleteStaffMutation,
} from "./tanstack-query/staffQueries";

export const useStaff = () => {
  return useStaffQuery();
};

export const useActiveStaff = () => {
  return useActiveStaffQuery();
};

export const useCreateStaff = () => {
  return useCreateStaffMutation();
};

export const useUpdateStaff = () => {
  return useUpdateStaffMutation();
};

export const useDeleteStaff = () => {
  return useDeleteStaffMutation();
};
