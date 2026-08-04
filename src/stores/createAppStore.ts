import { create } from "zustand";
import { devtools, type StateCreator } from "zustand/middleware";

import { createNotificationSlice, type NotificationSlice } from "./notificationsStore";
import { createSessionSlice, type SessionSlice } from "./sessionStore";
import { createUiSlice, type UiSlice } from "./uiStore";

export type AppStore = UiSlice & SessionSlice & NotificationSlice;

const createBaseStore: StateCreator<AppStore> = (set, get, api) => ({
  ...createUiSlice(set, get, api),
  ...createSessionSlice(set, get, api),
  ...createNotificationSlice(set, get, api),
});

const isDevtoolsEnabled = () => {
  if (!import.meta.env.DEV || typeof window === "undefined") {
    return false;
  }

  const windowWithFlag = window as Window & { __DEVTOOLS__?: boolean };
  return Boolean(windowWithFlag.__DEVTOOLS__);
};

const storeCreator = isDevtoolsEnabled()
  ? devtools(createBaseStore, {
      name: "project-boilerplate-store",
      enabled: true,
    })
  : createBaseStore;

export const useAppStore = create<AppStore>()(storeCreator);

export const initializeAppStore = () => {
  const { initializeSession } = useAppStore.getState();
  initializeSession();
  return useAppStore.getState();
};
