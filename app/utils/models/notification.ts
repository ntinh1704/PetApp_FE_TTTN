export type NotificationRole = "admin" | "user";

export type NotificationItem = {
  id: string;
  booking_id?: number | null;
  role?: NotificationRole;
  user_id?: number | null;
  email?: string;
  title?: string | null;
  message: string;
  is_read: boolean;
  created_at?: string | null;
  booking_date?: string | null;
};

export type NotificationsQueryParams = {
  role: NotificationRole;
  user_id?: number;
  email?: string;
};

export type UnreadCountQueryParams = {
  role: NotificationRole;
  user_id?: number;
  email?: string;
};

