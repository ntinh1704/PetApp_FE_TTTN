import { Pet, PetCreate, PetUpdate } from "../utils/models/pet";
import { api } from "./api";

export async function getPetsApi() {
  const res = await api.get<Pet[]>("/pets");
  return res.data;
}

export async function createPetApi(payload: PetCreate) {
  const res = await api.post<Pet>("/pets/", payload);
  return res.data;
}

export async function updatePetApi(payload: PetUpdate) {
  const res = await api.put<Pet>("/pets/", payload);
  return res.data;
}

export async function deletePetApi(id: number) {
  const res = await api.delete<Pet>("/pets/", { data: { id } });
  return res.data;
}
