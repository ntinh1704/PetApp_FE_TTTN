import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createServiceApi,
  deleteServiceApi,
  getServicesApi,
  updateServiceApi,
} from "../../../services/authService";
import { ServiceCreate, ServiceUpdate } from "../../models/service";

export const useServicesQuery = () => {
  return useQuery({
    queryKey: ["services"],
    queryFn: getServicesApi,
  });
};

export const useCreateServiceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ServiceCreate) => createServiceApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
};

export const useUpdateServiceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ServiceUpdate) => updateServiceApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
};

export const useDeleteServiceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteServiceApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
};
