import { Service, ServiceCreate, ServiceUpdate } from "../utils/models/service";
import { api } from "./api";

export async function getServicesApi() {
  const res = await api.get<Service[]>("/services", {
    params: { all: true },
  });
  return res.data;
}

export async function createServiceApi(payload: ServiceCreate) {
  const res = await api.post<Service>("/services/", payload);
  return res.data;
}

export async function updateServiceApi(payload: ServiceUpdate) {
  const res = await api.put<Service>("/services/", payload);
  return res.data;
}

export async function deleteServiceApi(id: number) {
  const res = await api.delete<Service>("/services/", {
    params: { service_id: id },
  });
  return res.data;
}
