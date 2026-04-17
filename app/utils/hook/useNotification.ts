import { NotificationsQueryParams, UnreadCountQueryParams } from "../models/notification";
import {
  useMarkNotificationReadMutation,
  useNotificationsQuery,
  useUnreadCountQuery,
} from "./tanstack-query/notificationQueries";

export const useNotifications = (params: NotificationsQueryParams, enabled = true) => {
  return useNotificationsQuery(params, enabled);
};

export const useUnreadCount = (params: UnreadCountQueryParams, enabled = true) => {
  return useUnreadCountQuery(params, enabled);
};

export const useMarkNotificationRead = () => {
  return useMarkNotificationReadMutation();
};

