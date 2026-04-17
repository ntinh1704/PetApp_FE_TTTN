import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getNotificationsApi,
  getUnreadCountApi,
  markNotificationReadApi,
} from "../../../services/authNotification";
import { NotificationsQueryParams, UnreadCountQueryParams } from "../../models/notification";

export const notificationQueryKeys = {
  notifications: (params: NotificationsQueryParams) => ["notifications", params] as const,
  unreadCount: (params: UnreadCountQueryParams) => ["notifications", "unread-count", params] as const,
};

export const useNotificationsQuery = (params: NotificationsQueryParams, enabled = true) => {
  return useQuery({
    queryKey: notificationQueryKeys.notifications(params),
    queryFn: () => getNotificationsApi(params),
    enabled,
  });
};

export const useUnreadCountQuery = (params: UnreadCountQueryParams, enabled = true) => {
  return useQuery({
    queryKey: notificationQueryKeys.unreadCount(params),
    queryFn: () => getUnreadCountApi(params),
    enabled,
  });
};

export const useMarkNotificationReadMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => markNotificationReadApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};

