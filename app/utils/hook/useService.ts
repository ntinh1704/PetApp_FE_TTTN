import {
  useCreateServiceMutation,
  useDeleteServiceMutation,
  useServicesQuery,
  useUpdateServiceMutation,
} from "./tanstack-query/serviceQueries";

export const useServices = () => {
  return useServicesQuery();
};

export const useCreateService = () => {
  return useCreateServiceMutation();
};

export const useUpdateService = () => {
  return useUpdateServiceMutation();
};

export const useDeleteService = () => {
  return useDeleteServiceMutation();
};
