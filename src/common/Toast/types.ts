import React from "react";

export type ToastType = "success" | "error" | "info" | "warning";

export type ToastOptions = {
  id?: string;
  message: string | React.ReactNode;
  type: ToastType;
  duration?: number;
  position?:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"
    | "top-center"
    | "bottom-center";
};

export type ToastContextType = {
  addToast: (options: ToastOptions) => string;
  removeToast: (id: string) => void;
};
