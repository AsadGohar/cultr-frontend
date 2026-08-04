import { type RefObject, useEffect } from "react";

type UseDismissOptions = {
  refs: RefObject<HTMLElement | null>[];
  onDismiss: () => void;
  enabled?: boolean;
};

export function useDismiss({ refs, onDismiss, enabled = true }: UseDismissOptions) {
  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      const isInsideAny = refs.some((ref) => {
        const node = ref.current;
        return !!node && node.contains(target);
      });

      if (!isInsideAny) {
        onDismiss();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onDismiss();
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [enabled, onDismiss, refs]);
}
