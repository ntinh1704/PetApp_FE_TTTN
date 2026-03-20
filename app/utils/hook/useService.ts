import { useServicesQuery } from "./tanstack-query/serviceQueries";

export const useServices = () => {
  return useServicesQuery();
};
