import type { StateCreator } from "zustand";

import { type NotificationKind, type NotificationMessage } from "./types";

export interface NotificationSliceState {
  notifications: NotificationMessage[];
}

export interface NotificationSliceActions {
  addNotification: (notification: {
    kind: NotificationKind;
    title: string;
    message: string;
  }) => void;
  dismissNotification: (id: string) => void;
  dismissAllNotifications: () => void;
}

export type NotificationSlice = NotificationSliceState & NotificationSliceActions;

let notificationSeed = 0;

const createNotificationId = () => `notification-${++notificationSeed}`;

export const createNotificationSlice: StateCreator<NotificationSlice> = (set) => ({
  notifications: [],
  addNotification: (payload) => {
    const now = Date.now();
    const notification = {
      id: createNotificationId(),
      kind: payload.kind,
      title: payload.title,
      message: payload.message,
      createdAt: now,
    };

    set((state) => ({
      notifications: [notification, ...state.notifications].slice(0, 20),
    }));
  },
  dismissNotification: (id: string) => {
    set((state) => ({
      notifications: state.notifications.filter((notification) => notification.id !== id),
    }));
  },
  dismissAllNotifications: () => {
    set({ notifications: [] });
  },
});
