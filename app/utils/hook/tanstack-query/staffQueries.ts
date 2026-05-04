import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getStaffListApi,
  getActiveStaffApi,
  createStaffApi,
  updateStaffApi,
  deleteStaffApi,
} from "../../../services/authStaff";
import { StaffCreate, StaffUpdate } from "../../models/staff";

export const useStaffQuery = () => {
  return useQuery({
    queryKey: ["staff"],
    queryFn: getStaffListApi,
  });
};

export const useActiveStaffQuery = () => {
  return useQuery({
    queryKey: ["staff", "active"],
    queryFn: getActiveStaffApi,
  });
};

export const useCreateStaffMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: StaffCreate) => createStaffApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
    },
  });
};

export const useUpdateStaffMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: StaffUpdate) => updateStaffApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
    },
  });
};

export const useDeleteStaffMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteStaffApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
    },
  });
};
