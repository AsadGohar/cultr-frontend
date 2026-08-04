export type ThemeMode = "light" | "dark" | "system";

export type NotificationKind = "info" | "success" | "warning" | "error";

export interface NotificationMessage {
  id: string;
  kind: NotificationKind;
  title: string;
  message: string;
  createdAt: number;
}

export interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  role?: string;
}
