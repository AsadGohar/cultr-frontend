import type { StateCreator } from "zustand";

import type { UserProfile } from "./types";

export interface SessionSliceState {
  initialized: boolean;
  user: UserProfile | null;
}

export interface SessionSliceActions {
  initializeSession: () => void;
  signIn: (user: UserProfile) => void;
  signOut: () => void;
}

export type SessionSlice = SessionSliceState & SessionSliceActions;

const defaultUser: UserProfile = {
  id: "demo-user-id",
  displayName: "Lorem Placeholder",
  email: "lorem@example.dev",
  role: "admin",
};

export const createSessionSlice: StateCreator<SessionSlice> = (set) => ({
  initialized: false,
  user: null,
  initializeSession: () => {
    set((state) => ({
      ...state,
      initialized: true,
      user: state.user ?? defaultUser,
    }));
  },
  signIn: (user: UserProfile) => {
    set({ initialized: true, user });
  },
  signOut: () => {
    set({ initialized: false, user: null });
  },
});
