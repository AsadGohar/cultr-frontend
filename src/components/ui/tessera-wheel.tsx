"use client";

import { useEffect, useRef, type KeyboardEvent, type PointerEvent } from "react";

/*
  WheelColumn — an iOS-style drum picker column, built on the fluid-
  interface recipe from Apple's Designing Fluid Interfaces:

    • 1:1 pointer tracking (setPointerCapture, grab offset respected)
    • velocity from a short move history — handed to the spring on release
    • momentum projection picks the snap target from where the flick is
      GOING (v/1000·d/(1−d)), not where the finger stopped
    • critically-damped spring settle (no overshoot: a picker is precise)
    • infinite loop by default — hours / minutes wrap like UIDatePicker
    • rubber-banding only when loop=false (finite lists)
    • interruptible: grabbing mid-spring starts from the live offset
    • drum look: items rotate away and fade with distance from center
    • wheel/trackpad scroll then snaps; ↑/↓ keys step (spinbutton)
    • prefers-reduced-motion: no momentum or spring — instant snap

  All per-frame work writes styles directly to DOM nodes; React renders
  only when the committed index changes.
*/

export const WHEEL_ITEM_H = 36;
const VISIBLE = 5;
export const WHEEL_H = WHEEL_ITEM_H * VISIBLE;
const RADIUS = (WHEEL_ITEM_H * VISIBLE) / 2 / Math.sin(Math.PI / VISIBLE);
const DECEL = 0.99;
const RESPONSE = 0.35;

function project(velocity: number, decel = DECEL) {
  return ((velocity / 1000) * decel) / (1 - decel);
}

function rubberband(overshoot: number, dimension: number, constant = 0.55) {
  return (
    (overshoot * dimension * constant) /
    (dimension + constant * Math.abs(overshoot))
  );
}

function wrapIndex(i: number, n: number) {
  if (n <= 0) return 0;
  return ((i % n) + n) % n;
}

/** Shortest signed distance on a circular period. */
function modDist(pos: number, center: number, period: number) {
  if (period <= 0) return pos - center;
  let d = pos - center;
  const half = period / 2;
  d = ((d % period) + period + half) % period - half;
  return d;
}

export function WheelColumn<T extends string | number>({
  values,
  index,
  onIndexChange,
  format,
  ariaLabel,
  className = "",
  /** Wrap endlessly (Apple default). Set false for finite lists. */
  loop = true,
}: {
  values: readonly T[];
  index: number;
  onIndexChange: (index: number) => void;
  format: (v: T) => string;
  ariaLabel: string;
  className?: string;
  loop?: boolean;
}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const valuesRef = useRef(values);
  valuesRef.current = values;
  const loopRef = useRef(loop);
  loopRef.current = loop;

  const n = values.length;

  const state = useRef({
    offset: index * WHEEL_ITEM_H,
    velocity: 0,
    target: null as number | null,
    dragging: false,
    raf: 0,
    lastT: 0,
    committed: index,
    history: [] as { y: number; t: number }[],
    wheelTimer: 0 as ReturnType<typeof setTimeout> | 0,
  });
  const cb = useRef(onIndexChange);
  cb.current = onIndexChange;

  const reduceMotion = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const paint = () => {
    const s = state.current;
    const list = valuesRef.current;
    const count = list.length;
    if (count === 0) return;
    const per = count * WHEEL_ITEM_H;
    const looping = loopRef.current && count > 1;
    const maxOffset = (count - 1) * WHEEL_ITEM_H;

    let display = s.offset;
    if (!looping) {
      if (display < 0) display = -rubberband(-display, WHEEL_H);
      else if (display > maxOffset)
        display = maxOffset + rubberband(display - maxOffset, WHEEL_H);
    }

    itemRefs.current.forEach((el, i) => {
      if (!el || i >= count) return;
      const dist = looping
        ? modDist(i * WHEEL_ITEM_H, display, per)
        : i * WHEEL_ITEM_H - display;
      const angle = Math.max(
        -88,
        Math.min(88, (dist / RADIUS) * (180 / Math.PI)),
      );
      const abs = Math.abs(angle);
      const faded = Math.abs(dist) > WHEEL_H * 0.55;
      el.style.transform = `translate3d(0, ${dist}px, 0) rotateX(${-angle}deg)`;
      el.style.opacity = faded
        ? "0"
        : String(Math.max(0.18, Math.cos((abs * Math.PI) / 180) ** 1.35));
      el.style.fontWeight = Math.abs(dist) < WHEEL_ITEM_H * 0.45 ? "600" : "400";
      el.style.visibility = faded ? "hidden" : "visible";
    });
  };

  const commitNearest = (offset: number) => {
    const s = state.current;
    const count = valuesRef.current.length;
    if (count === 0) return 0;
    const looping = loopRef.current && count > 1;
    const raw = Math.round(offset / WHEEL_ITEM_H);
    const idx = looping
      ? wrapIndex(raw, count)
      : Math.max(0, Math.min(count - 1, raw));
    if (idx !== s.committed) {
      s.committed = idx;
      cb.current(idx);
    }
    return idx;
  };

  const tick = (now: number) => {
    const s = state.current;
    const dt = Math.min((now - s.lastT) / 1000, 1 / 30);
    s.lastT = now;

    if (!s.dragging && s.target != null) {
      const omega = (2 * Math.PI) / RESPONSE;
      const x = s.offset - s.target;
      const accel = -(omega * omega) * x - 2 * omega * s.velocity;
      s.velocity += accel * dt;
      s.offset += s.velocity * dt;
      if (Math.abs(s.offset - s.target) < 0.3 && Math.abs(s.velocity) < 4) {
        s.offset = s.target;
        s.target = null;
        s.velocity = 0;
        // Keep unbounded offsets from growing forever while looping.
        const count = valuesRef.current.length;
        if (loopRef.current && count > 1) {
          s.offset = wrapIndex(Math.round(s.offset / WHEEL_ITEM_H), count) * WHEEL_ITEM_H;
        }
      }
    }
    paint();
    if (s.dragging || s.target != null) s.raf = requestAnimationFrame(tick);
    else s.raf = 0;
  };

  const ensureLoop = () => {
    const s = state.current;
    if (!s.raf) {
      s.lastT = performance.now();
      s.raf = requestAnimationFrame(tick);
    }
  };

  /** Snap toward a absolute slot index (may be outside 0..n-1 while looping). */
  const snapToRaw = (raw: number, velocity = 0) => {
    const s = state.current;
    const count = valuesRef.current.length;
    if (count === 0) return;
    const looping = loopRef.current && count > 1;
    const clamped = looping
      ? raw
      : Math.max(0, Math.min(count - 1, raw));
    commitNearest(clamped * WHEEL_ITEM_H);
    if (reduceMotion()) {
      s.offset = looping
        ? wrapIndex(clamped, count) * WHEEL_ITEM_H
        : clamped * WHEEL_ITEM_H;
      s.target = null;
      s.velocity = 0;
      paint();
      return;
    }
    s.target = clamped * WHEEL_ITEM_H;
    s.velocity = velocity;
    ensureLoop();
  };

  const snapToIndex = (idx: number, velocity = 0) => {
    const s = state.current;
    const count = valuesRef.current.length;
    if (count === 0) return;
    const looping = loopRef.current && count > 1;
    if (!looping) {
      snapToRaw(idx, velocity);
      return;
    }
    const cur = Math.round(s.offset / WHEEL_ITEM_H);
    const curIdx = wrapIndex(cur, count);
    let delta = wrapIndex(idx, count) - curIdx;
    if (delta > count / 2) delta -= count;
    if (delta < -count / 2) delta += count;
    snapToRaw(cur + delta, velocity);
  };

  const onPointerDown = (e: PointerEvent) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    const s = state.current;
    e.currentTarget.setPointerCapture(e.pointerId);
    // Kill browser scroll chaining while the drum is grabbed.
    e.preventDefault();
    s.dragging = true;
    s.target = null;
    s.velocity = 0;
    s.history = [{ y: e.clientY, t: performance.now() }];
    ensureLoop();
  };

  const onPointerMove = (e: PointerEvent) => {
    const s = state.current;
    if (!s.dragging) return;
    e.preventDefault();
    const now = performance.now();
    const last = s.history[s.history.length - 1];
    s.offset -= e.clientY - last.y;
    s.history.push({ y: e.clientY, t: now });
    if (s.history.length > 6) s.history.shift();
  };

  const onPointerUp = (e: PointerEvent) => {
    const s = state.current;
    if (!s.dragging) return;
    s.dragging = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* already released */
    }
    const now = performance.now();
    const recent = s.history.filter((h) => now - h.t < 100);
    let v = 0;
    if (recent.length >= 2) {
      const a = recent[0];
      const b = recent[recent.length - 1];
      const dt = (b.t - a.t) / 1000;
      if (dt > 0) v = -(b.y - a.y) / dt;
    }
    const projected = s.offset + project(v);
    snapToRaw(Math.round(projected / WHEEL_ITEM_H), v);
  };

  const onWheel = (e: WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const s = state.current;
    const count = valuesRef.current.length;
    const looping = loopRef.current && count > 1;
    const maxOffset = (count - 1) * WHEEL_ITEM_H;
    s.target = null;
    if (looping) {
      s.offset += e.deltaY;
    } else {
      s.offset = Math.max(
        -WHEEL_ITEM_H,
        Math.min(maxOffset + WHEEL_ITEM_H, s.offset + e.deltaY),
      );
    }
    paint();
    if (s.wheelTimer) clearTimeout(s.wheelTimer);
    s.wheelTimer = setTimeout(() => {
      snapToRaw(Math.round(s.offset / WHEEL_ITEM_H));
    }, 90);
  };
  const onWheelRef = useRef(onWheel);
  onWheelRef.current = onWheel;

  const onKeyDown = (e: KeyboardEvent) => {
    const s = state.current;
    const count = valuesRef.current.length;
    const looping = loopRef.current && count > 1;
    const cur = Math.round((s.target ?? s.offset) / WHEEL_ITEM_H);
    if (e.key === "ArrowUp") {
      e.preventDefault();
      snapToRaw(cur - 1);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      snapToRaw(cur + 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      if (looping) snapToIndex(0);
      else snapToRaw(0);
    } else if (e.key === "End") {
      e.preventDefault();
      if (looping) snapToIndex(count - 1);
      else snapToRaw(count - 1);
    }
  };

  useEffect(() => {
    const s = state.current;
    if (s.dragging) return;
    const count = valuesRef.current.length;
    if (count === 0) return;
    if (index === s.committed) return;
    s.committed = index;
    if (reduceMotion()) {
      s.offset = wrapIndex(index, count) * WHEEL_ITEM_H;
      s.target = null;
      paint();
    } else {
      snapToIndex(index);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  useEffect(() => {
    paint();
    const s = state.current;
    return () => {
      if (s.raf) cancelAnimationFrame(s.raf);
      if (s.wheelTimer) clearTimeout(s.wheelTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /*
    React's onWheel is passive — preventDefault is ignored and the page
    scrolls. Bind a non-passive listener so the drum owns the gesture.
  */
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const handle = (e: WheelEvent) => onWheelRef.current(e);
    el.addEventListener("wheel", handle, { passive: false });
    return () => el.removeEventListener("wheel", handle);
  }, []);

  // Re-paint when the option list length/format changes.
  useEffect(() => {
    const s = state.current;
    s.offset = wrapIndex(index, Math.max(1, values.length)) * WHEEL_ITEM_H;
    s.committed = index;
    s.target = null;
    paint();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.length, loop]);

  return (
    <div
      ref={viewportRef}
      role="spinbutton"
      tabIndex={0}
      aria-label={ariaLabel}
      aria-valuenow={index}
      aria-valuemin={0}
      aria-valuemax={Math.max(0, n - 1)}
      aria-valuetext={n ? format(values[index]) : undefined}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onKeyDown={onKeyDown}
      style={{
        height: WHEEL_H,
        perspective: "520px",
        overscrollBehavior: "contain",
        touchAction: "none",
      }}
      className={`relative min-w-0 flex-1 cursor-grab overflow-hidden outline-none select-none active:cursor-grabbing focus-visible:rounded-[var(--radius-md)] focus-visible:ring-2 focus-visible:ring-primary-500/40 ${className}`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-10 bg-gradient-to-b from-[var(--elevated)] to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-10 bg-gradient-to-t from-[var(--elevated)] to-transparent"
      />
      <div
        ref={trackRef}
        className="absolute inset-0"
        style={{
          transformStyle: "preserve-3d",
          perspectiveOrigin: "50% 50%",
        }}
      >
        {values.map((v, i) => (
          <button
            key={`${String(v)}-${i}`}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            type="button"
            tabIndex={-1}
            aria-hidden
            onClick={() => snapToIndex(i)}
            style={{
              height: WHEEL_ITEM_H,
              top: "50%",
              marginTop: -WHEEL_ITEM_H / 2,
            }}
            className="num absolute inset-x-0 flex items-center justify-center text-[17px] leading-none text-fg"
          >
            {format(v)}
          </button>
        ))}
      </div>
    </div>
  );
}

