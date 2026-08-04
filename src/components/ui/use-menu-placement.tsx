import { type RefObject, useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";

type MenuPlacement = {
  top: number;
  left: number;
  width: number;
};

type MenuAlignment = "start" | "end";
type MenuSide = "top" | "bottom";

type UseMenuPlacement = {
  isOpen: boolean;
  triggerRef: RefObject<HTMLElement | null>;
  menuRef: RefObject<HTMLElement | null>;
  alignment?: MenuAlignment;
  side?: MenuSide;
  sideOffset?: number;
  alignOffset?: number;
  minWidth?: number;
};

const DEFAULT_SIDE_OFFSET = 8;
const DEFAULT_ALIGN_OFFSET = 0;
const DEFAULT_MIN_WIDTH = 280;

export function useMenuPlacement({
  isOpen,
  triggerRef,
  menuRef,
  alignment = "start",
  side = "bottom",
  sideOffset = DEFAULT_SIDE_OFFSET,
  alignOffset = DEFAULT_ALIGN_OFFSET,
  minWidth = DEFAULT_MIN_WIDTH,
}: UseMenuPlacement) {
  const [placement, setPlacement] = useState<MenuPlacement | null>(null);

  const update = useCallback(() => {
    if (!isOpen || !triggerRef.current || typeof window === "undefined") {
      return;
    }

    const trigger = triggerRef.current.getBoundingClientRect();
    const menuHeight = menuRef.current?.getBoundingClientRect().height ?? 272;

    const width = Math.max(minWidth, trigger.width);
    const constrainedWidth = Math.min(width, window.innerWidth - 16);

    const leftStart = alignment === "end" ? trigger.right - constrainedWidth : trigger.left;
    const left = Math.min(
      Math.max(8, leftStart + alignOffset),
      Math.max(8, window.innerWidth - constrainedWidth - 8),
    );

    const fitsBelow = trigger.bottom + sideOffset + menuHeight <= window.innerHeight - 8;
    const fitsAbove = trigger.top - sideOffset - menuHeight >= 8;
    const preferTop = side === "top" || (!fitsBelow && fitsAbove);

    const top =
      preferTop
        ? Math.max(8, trigger.top - sideOffset - menuHeight)
        : trigger.bottom + sideOffset;

    setPlacement({
      top,
      left,
      width: constrainedWidth,
    });
  }, [alignment, isOpen, menuRef, minWidth, side, sideOffset, alignOffset, triggerRef]);

  useEffect(() => {
    if (!isOpen) {
      setPlacement(null);
      return undefined;
    }

    const run = () => {
      window.requestAnimationFrame(update);
    };

    run();
    window.addEventListener("scroll", run, true);
    window.addEventListener("resize", run);

    return () => {
      window.removeEventListener("scroll", run, true);
      window.removeEventListener("resize", run);
    };
  }, [isOpen, update]);

  return {
    style: placement
      ? ({
          position: "fixed",
          top: placement.top,
          left: placement.left,
          width: placement.width,
        } as const)
      : null,
  };
}

export function MenuPortal({
  children,
}: {
  children: React.ReactNode;
}) {
  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(children, document.body);
}
