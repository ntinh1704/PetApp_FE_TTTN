import { Staff, StaffCreate, StaffUpdate } from "../utils/models/staff";
import { api } from "./api";

export async function getStaffListApi() {
  const res = await api.get<Staff[]>("/staff", {
    params: { all: true },
  });
  return res.data;
}

export async function getActiveStaffApi() {
  const res = await api.get<Staff[]>("/staff/active");
  return res.data;
}

export async function getStaffByIdApi(staffId: number) {
  const res = await api.get<Staff>(`/staff/${staffId}`);
  return res.data;
}

export async function createStaffApi(payload: StaffCreate) {
  const res = await api.post<Staff>("/staff/", payload);
  return res.data;
}

export async function updateStaffApi(payload: StaffUpdate) {
  const res = await api.put<Staff>("/staff/", payload);
  return res.data;
}

export async function deleteStaffApi(staffId: number) {
  const res = await api.delete("/staff/", {
    params: { staff_id: staffId },
  });
  return res.data;
}
