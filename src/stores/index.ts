import { useAppStore } from "./createAppStore";

export { initializeAppStore, useAppStore } from "./createAppStore";

export const useTheme = () => useAppStore((state) => state.theme);
export const useGlobalLoading = () => useAppStore((state) => state.globalLoading);
export const useMobileMenuOpen = () => useAppStore((state) => state.isMobileMenuOpen);
export const useActiveModalId = () => useAppStore((state) => state.activeModalId);
export const useIsSessionInitialized = () => useAppStore((state) => state.initialized);
export const useSessionUser = () => useAppStore((state) => state.user);
export const useNotificationQueue = () => useAppStore((state) => state.notifications);

export const useAuthState = () => {
  const initialized = useIsSessionInitialized();
  const user = useSessionUser();

  return {
    initialized,
    user,
    isAuthenticated: Boolean(user),
  };
};
