/* eslint-disable react-refresh/only-export-components */
import React, { useCallback, useMemo } from "react";

import ToastContainer from "./Toast";
import { type ToastContextType, type ToastOptions } from "./types";

const ToastContext = React.createContext<ToastContextType | undefined>(
  undefined
);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastOptions[]>([]);

  const addToast = useCallback((options: ToastOptions) => {
    // eslint-disable-next-line sonarjs/pseudo-random
    const id = options.id || Math.random().toString(36).substring(7);

    setToasts(prevToasts => {
      const hasDuplicate = prevToasts.some(
        existingToast => existingToast.message === options.message
      );

      if (hasDuplicate) {
        return prevToasts;
      }

      return [...prevToasts, { ...options, id }];
    });

    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  }, []);

  const contextValue = useMemo(
    () => ({
      addToast,
      removeToast,
    }),
    [addToast, removeToast]
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
