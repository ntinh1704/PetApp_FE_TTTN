import { useQuery } from "@tanstack/react-query";
import { getServicesApi } from "../../../services/authService";

export const useServicesQuery = () => {
  return useQuery({
    queryKey: ["services"],
    queryFn: getServicesApi,
  });
};
