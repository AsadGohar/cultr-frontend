import type { StateCreator } from "zustand";

import { type ThemeMode } from "./types";

export interface UiSliceState {
  globalLoading: boolean;
  theme: ThemeMode;
  isMobileMenuOpen: boolean;
  activeModalId: string | null;
}

export interface UiSliceActions {
  setGlobalLoading: (loading: boolean) => void;
  toggleGlobalLoading: () => void;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  setMobileMenuOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;
  openModal: (id: string | null) => void;
  closeModal: () => void;
}

export type UiSlice = UiSliceState & UiSliceActions;

export const createUiSlice: StateCreator<UiSlice> = (set) => ({
  globalLoading: false,
  theme: "system",
  isMobileMenuOpen: false,
  activeModalId: null,
  setGlobalLoading: (loading: boolean) => {
    set({ globalLoading: loading });
  },
  toggleGlobalLoading: () => {
    set((state) => ({
      globalLoading: !state.globalLoading,
    }));
  },
  setTheme: (theme: ThemeMode) => {
    set({ theme });
  },
  toggleTheme: () => {
    set((state) => ({
      theme: state.theme === "light" ? "dark" : "light",
    }));
  },
  setMobileMenuOpen: (open: boolean) => {
    set({ isMobileMenuOpen: open });
  },
  toggleMobileMenu: () => {
    set((state) => ({
      isMobileMenuOpen: !state.isMobileMenuOpen,
    }));
  },
  openModal: (id: string | null) => {
    set({ activeModalId: id });
  },
  closeModal: () => {
    set({ activeModalId: null });
  },
});
