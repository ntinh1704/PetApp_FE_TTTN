import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createPetApi,
  deletePetApi,
  getPetsApi,
  updatePetApi,
} from "../../../services/authPet";
import { PetCreate, PetUpdate } from "../../models/pet";

export const usePetsQuery = () => {
  return useQuery({
    queryKey: ["pets"],
    queryFn: getPetsApi,
  });
};

export const useCreatePetMutation = () => {
  return useMutation({
    mutationFn: (payload: PetCreate) => createPetApi(payload),
  });
};

export const useUpdatePetMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: PetUpdate) => updatePetApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pets"] });
    },
  });
};

export const useDeletePetMutation = () => {
  return useMutation({
    mutationFn: (id: number) => deletePetApi(id),
  });
};
