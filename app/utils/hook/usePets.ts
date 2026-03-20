import {
  useCreatePetMutation,
  useDeletePetMutation,
  usePetsQuery,
  useUpdatePetMutation,
} from "./tanstack-query/petQueries";

export const usePets = () => {
  return usePetsQuery();
};

export const useCreatePet = () => {
  return useCreatePetMutation();
};

export const useUpdatePet = () => {
  return useUpdatePetMutation();
};

export const useDeletePet = () => {
  return useDeletePetMutation();
};
