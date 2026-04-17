import {
  NotificationItem,
  NotificationsQueryParams,
  UnreadCountQueryParams,
} from "../utils/models/notification";
import { api } from "./api";

type UnreadCountResponse = {
  unread?: number;
  count?: number;
};

const normalizeNotification = (item: any): NotificationItem => {
  const fallbackMessage =
    item?.message ?? item?.text ?? item?.title ?? "Bạn có thông báo mới";

  return {
    id: String(item?.id ?? item?.booking_id ?? Math.random()),
    booking_id: item?.booking_id != null ? Number(item.booking_id) : null,
    role: item?.role,
    user_id: item?.user_id != null ? Number(item.user_id) : null,
    email: item?.email ?? item?.user_name ?? null,
    title: item?.title ?? null,
    message: String(fallbackMessage),
    is_read: Boolean(item?.is_read ?? item?.isRead),
    created_at: item?.created_at ?? null,
    booking_date: item?.booking_date ?? null,
  };
};

export async function getNotificationsApi(params: NotificationsQueryParams) {
  const res = await api.get<any>("/notifications", { params });
  const rawList = Array.isArray(res.data)
    ? res.data
    : res.data?.records ?? res.data?.data ?? [];

  return (rawList as any[]).map(normalizeNotification);
}

export async function markNotificationReadApi(id: string) {
  const res = await api.patch(`/notifications/${id}/read`, { is_read: true });
  return res.data;
}

export async function getUnreadCountApi(params: UnreadCountQueryParams) {
  const res = await api.get<UnreadCountResponse>("/notifications/unread-count", {
    params,
  });

  return Number(res.data?.unread ?? res.data?.count ?? 0);
}
