"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

/**
 * Sekcja centralna — pełny viewport, kompozycja na środku.
 * Wejście: zoom tła (jak W1) + mask reveal napisów.
 * Tło jest rodzeństwem sekcji (w main), żeby overflow-x-clip nie ucinał dołu.
 * Menu jest w layoutcie (SiteMenu).
 */
export function ManifestSection() {
  const [animating, setAnimating] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setReady(true);
      return;
    }
    setAnimating(true);
    const t = window.setTimeout(() => setReady(true), 40);
    return () => window.clearTimeout(t);
  }, []);

  const animClass = [
    animating ? "manifest--anim" : "",
    ready ? "is-ready" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      {/* W main: nie w h-[100svh], żeby dół z maską wchodził w sekcję 2 */}
      <div className={["manifest__bg", animClass].filter(Boolean).join(" ")} aria-hidden>
        <Image
          src="/brand/manifest-bg-march.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="manifest__bg-img object-cover object-center brightness-[1.28] contrast-[0.92] saturate-[0.4]"
        />
        <div className="manifest__bg-wash absolute inset-0 bg-[#fafaf7]/58" />
      </div>

      <section
        aria-labelledby="manifest-heading"
        className={[
          "manifest relative grid h-[100svh] w-full max-w-[100vw] bg-transparent",
          animClass,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <div className="manifest__grid relative z-10 w-full">
          <div className="manifest__eyebrow manifest__reveal manifest__reveal--eyebrow">
            <Image
              src="/brand/logo-mark.png"
              alt=""
              width={160}
              height={160}
              className="manifest__mark pointer-events-none object-contain"
              aria-hidden
            />
            <p className="manifest__eyebrow-text relative z-10">
              Upowszechnianie wiedzy historycznej
            </p>
          </div>

          <h1 id="manifest-heading" className="manifest__title">
            <span className="manifest__reveal manifest__reveal--title-a block">
              Stowarzyszenie
            </span>
            <span className="manifest__title-line manifest__reveal manifest__reveal--title-b block">
              <span className="manifest__title-word">Ochotnicy</span>
              <span className="manifest__title-word">Wolności</span>
            </span>
          </h1>

          <p className="manifest__lead manifest__reveal manifest__reveal--lead">
            Przywracamy pamięć o osobach, organizacjach i ruchach, które zostały
            pominięte lub wyparte z głównego nurtu narracji historycznej.
          </p>
        </div>
      </section>
    </>
  );
}
