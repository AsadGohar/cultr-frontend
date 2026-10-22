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
    const visualViewport = window.visualViewport;
    const viewportLeft = visualViewport?.offsetLeft ?? 0;
    const viewportTop = visualViewport?.offsetTop ?? 0;
    const viewportRight = viewportLeft + (visualViewport?.width ?? window.innerWidth);
    const viewportBottom = viewportTop + (visualViewport?.height ?? window.innerHeight);
    const dialog = triggerRef.current.closest('[role="dialog"]');
    const dialogRect = dialog?.getBoundingClientRect();
    const boundaryTop = Math.max(viewportTop + 8, dialogRect?.top ?? viewportTop + 8);
    const boundaryBottom = Math.min(viewportBottom - 8, dialogRect?.bottom ?? viewportBottom - 8);

    const width = Math.max(minWidth, trigger.width);
    const constrainedWidth = Math.min(width, viewportRight - viewportLeft - 16);

    const leftStart = alignment === "end" ? trigger.right - constrainedWidth : trigger.left;
    const left = Math.min(
      Math.max(viewportLeft + 8, leftStart + alignOffset),
      Math.max(viewportLeft + 8, viewportRight - constrainedWidth - 8),
    );

    const fitsBelow = trigger.bottom + sideOffset + menuHeight <= boundaryBottom;
    const preferTop = side === "top" || !fitsBelow;

    const top =
      preferTop
        ? Math.max(boundaryTop, trigger.top - sideOffset - menuHeight)
        : Math.min(trigger.bottom + sideOffset, Math.max(boundaryTop, boundaryBottom - menuHeight));

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
    window.visualViewport?.addEventListener("scroll", run);
    window.visualViewport?.addEventListener("resize", run);

    return () => {
      window.removeEventListener("scroll", run, true);
      window.removeEventListener("resize", run);
      window.visualViewport?.removeEventListener("scroll", run);
      window.visualViewport?.removeEventListener("resize", run);
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
