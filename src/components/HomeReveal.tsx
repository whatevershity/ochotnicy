"use client";

import { useEffect, useState, type ReactNode } from "react";

/**
 * Lekkie wejście sekcji poniżej hero — ten sam rytm co manifest
 * (opacity + lekki rise), bez przesady. Po oknie animacji
 * `.is-settled` zostawia treść widoczną (m.in. Suspense aktualności).
 */
export function HomeReveal({ children }: { children: ReactNode }) {
  const [animating, setAnimating] = useState(false);
  const [ready, setReady] = useState(false);
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setReady(true);
      setSettled(true);
      return;
    }
    setAnimating(true);
    const readyT = window.setTimeout(() => setReady(true), 40);
    const settleT = window.setTimeout(() => setSettled(true), 5600);
    return () => {
      window.clearTimeout(readyT);
      window.clearTimeout(settleT);
    };
  }, []);

  const className = [
    "home-below",
    animating ? "home-below--anim" : "",
    ready ? "is-ready" : "",
    settled ? "is-settled" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return <div className={className}>{children}</div>;
}
