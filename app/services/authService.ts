import { Service } from "../utils/models/service";
import { api } from "./api";

export async function getServicesApi() {
    const res = await api.get<Service[]>("/services");
    return res.data;
  }