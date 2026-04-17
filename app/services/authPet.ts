import { Pet, PetCreate, PetUpdate } from "../utils/models/pet";
import { api } from "./api";

export async function uploadPetImageApi(imageUri: string) {
  const extension = imageUri.split(".").pop()?.toLowerCase() || "jpg";
  const mimeType = extension === "png" ? "image/png" : "image/jpeg";

  const formData = new FormData();
  formData.append("file", {
    uri: imageUri,
    name: `pet_${Date.now()}.${extension}`,
    type: mimeType,
  } as any);

  const res = await api.post<{ url: string }>("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
}

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
  const res = await api.delete<Pet>("/pets/", { params: { pet_id: id } });
  return res.data;
}
