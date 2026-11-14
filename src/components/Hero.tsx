/**
 * Live hero — powrót do klimatu Wersji 1 (zdjęcie + overlay),
 * z napisami / typografią z Wersji 2 i logo transparentnym.
 * Pełny snapshot W1: `src/versions/v1/` (tag `wersja-1`).
 */
import Image from "next/image";

const EYEBROW = "„Jeśli padnie Madryt, padnie też Warszawa”";
const PURPOSE =
  "Celem Stowarzyszenia Ochotnicy Wolności jest upowszechnianie wiedzy historycznej, działanie na rzecz przywracania pamięci o osobach, organizacjach i ruchach wykluczonych z dominującej narracji historycznej, dbanie o miejsca pamięci oraz budowanie pola do dyskusji na temat pamięci historycznej.";

export function Hero() {
  return (
    <section
      aria-label="Wprowadzenie"
      className="hero-cinematic relative isolate flex min-h-[100svh] w-full max-w-[100vw] items-center overflow-hidden bg-[var(--ow-navy)]"
    >
      <div className="hero-bg absolute inset-0" aria-hidden>
        <Image
          src="/brand/hero-bg-march.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="hero-bg__img object-cover object-[center_35%]"
        />
        <div className="hero-bg__shade absolute inset-0" />
      </div>

      <div className="relative z-10 w-full px-[clamp(2rem,7vw,6rem)] py-[clamp(2rem,6svh,4rem)]">
        <div className="max-w-4xl">
          <div className="mb-[clamp(1.5rem,4svh,2.75rem)] size-[clamp(5.25rem,10vw,7.25rem)]">
            <Image
              src="/brand/logo-white.png"
              alt="Logo Stowarzyszenia Ochotnicy Wolności"
              width={184}
              height={184}
              priority
              className="size-full object-contain"
            />
          </div>

          <p className="max-w-xl text-[clamp(1rem,1.4vw,1.125rem)] font-normal leading-snug text-white/80">
            {EYEBROW}
          </p>

          <h1 className="mt-[clamp(0.85rem,2svh,1.25rem)] text-balance text-[clamp(1.85rem,4.2vw,3.35rem)] font-medium uppercase leading-[1.08] tracking-[0.02em] text-white sm:tracking-[0.04em]">
            <span className="block">Stowarzyszenie</span>
            <span className="block sm:whitespace-nowrap">
              Ochotnicy Wolności
            </span>
          </h1>

          <div
            aria-hidden
            className="mt-[clamp(1.1rem,2.8svh,1.65rem)] h-px w-14 bg-[var(--ow-accent)]"
          />

          <p className="mt-[clamp(1.15rem,2.8svh,1.75rem)] max-w-[38rem] text-pretty text-[clamp(1.05rem,1.45vw,1.175rem)] leading-[1.7] text-white/90">
            {PURPOSE}
          </p>

          <div className="mt-[clamp(1.5rem,3.5svh,2.25rem)] flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.88rem] font-medium uppercase tracking-[0.1em] text-white sm:text-[0.95rem] sm:tracking-[0.12em]">
            <a href="#dabrowszczacy" className="hero-text-cta hero-text-cta--on-dark">
              Kim byli Dąbrowszczacy?
            </a>
            <span aria-hidden className="text-white/45">
              ||
            </span>
            <a href="#co-robimy" className="hero-text-cta hero-text-cta--on-dark">
              Zobacz, co robimy
            </a>
          </div>
        </div>
      </div>

      <span id="co-robimy" className="absolute bottom-0 left-0 h-0 w-0" />
    </section>
  );
}
