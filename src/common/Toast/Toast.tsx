/* eslint-disable react-hooks/exhaustive-deps */
import { AnimatePresence, motion } from "framer-motion";
import React, { type ReactElement } from "react";
import { createPortal } from "react-dom";

import AlertIcon from "@/assets/icon/AlertIcon.svg?react";
import CheckmarkIcon from "@/assets/icon/CheckmarkIcon.svg?react";
import ErrorShieldIcon from "@/assets/icon/ErrorShieldIcon.svg?react";
import InfoIcon from "@/assets/icon/InfoIcon.svg?react";
import StopIcon from "@/assets/icon/StopIcon.svg?react";
import { Typography } from "@/common/Typography/Typography";

import { type ToastOptions, type ToastType } from "./types";

function ToastContainer({ toasts, removeToast }: ToastContainerProps) {
  const groupedToasts = toasts.reduce(
    (acc, toast) => {
      const position = toast.position || "top-center";

      if (!acc[position]) {
        acc[position] = [];
      }
      acc[position].push(toast);
      return acc;
    },
    {} as Record<string, ToastOptions[]>
  );

  const toastContent = (
    <AnimatePresence>
      {Object.entries(groupedToasts).map(([position, positionToasts]) => (
        <motion.div
          key={position}
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
          transition={{ duration: 0.3 }}
          className={`pointer-events-none fixed z-[9999] flex flex-col justify-start p-4 ${getPositionClasses(position as ToastOptions["position"])}`}
        >
          {positionToasts.map(toast => (
            <motion.div
              layout
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              transition={{ duration: 0.3 }}
              key={toast.id}
              className="pointer-events-auto mb-2 last:mb-0"
            >
              <Toast {...toast} onRemove={removeToast} />
            </motion.div>
          ))}
        </motion.div>
      ))}
    </AnimatePresence>
  );

  // Use portal to render toasts at document body level, ensuring they appear above everything
  if (typeof document !== "undefined") {
    return createPortal(toastContent, document.body);
  }

  return toastContent;
}

function Toast({
  id,
  message,
  type,
  duration = 3500,
  onRemove,
}: ToastOptions & { onRemove: (id: string) => void }) {
  React.useEffect(() => {
    if (id) {
      const timer = setTimeout(() => {
        onRemove(id);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, []);

  const toastIcon = {
    success: (
      <CheckmarkIcon className="size-3" style={{ color: "var(--success)" }} />
    ),
    error: (
      <ErrorShieldIcon className="size-3" style={{ color: "var(--error)" }} />
    ),
    info: (
      <InfoIcon className="size-5" style={{ color: "var(--toast-info)" }} />
    ),
    warning: (
      <AlertIcon className="size-3" style={{ color: "var(--toast-warning)" }} />
    ),
  } satisfies Record<ToastType, ReactElement>;

  return (
    <div
      className={`toast-container font-circularStd pointer-events-auto relative w-fit min-w-[250px] overflow-hidden text-[var(--text-default)]`}
      aria-live="assertive"
      role="alert"
    >
      <div className="relative flex">
        <div
          className="flex flex-1 items-center rounded-[5px] px-4 py-4"
          style={{
            backgroundColor: toastBgColors[type] || "var(--background-subtle)",
          }}
        >
          <div>{toastIcon[type] ?? ""}</div>
          <div className="mr-8 ml-2 flex-grow">
            {typeof message === "string" ? (
              <Typography
                variant="body-sm"
                weight="semibold"
                className="text-[var(--text-default)]"
              >
                {message}
              </Typography>
            ) : (
              message
            )}
          </div>
          <button
            type="button"
            className="inline-flex cursor-pointer pl-1.5 text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
            onClick={() => {
              if (id) {
                onRemove(id);
              }
            }}
          >
            <Typography as="span" className="sr-only">
              Close
            </Typography>
            <StopIcon className="size-3 text-[var(--text-secondary)]" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ToastContainer;

const getPositionClasses = (position: ToastOptions["position"]) => {
  switch (position) {
    case "top-left":
      return "top-0 left-0";
    case "top-center":
      return "inset-0 flex items-center";
    case "top-right":
      return "top-0 right-0";
    case "bottom-left":
      return "bottom-0 left-0";
    case "bottom-center":
      return "bottom-0 flex items-center left-0 right-0";
    case "bottom-right":
    default:
      return "bottom-0 right-0";
  }
};

const toastBgColors = {
  success: "var(--toast-success-bg)",
  error: "var(--toast-error-bg)",
  info: "var(--toast-info-bg)",
  warning: "var(--toast-warning-bg)",
} satisfies Record<ToastType, string>;

type ToastContainerProps = {
  toasts: ToastOptions[];
  removeToast: (id: string) => void;
};
