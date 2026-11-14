/**
 * Paleta kolorów ze strony https://www.ochotnicywolnosci.org
 * Źródło: motyw Astra + style Elementora (pobrane 2026-11-06).
 * NIE ZMIENIAĆ bez decyzji klienta.
 */
export const brandColors = {
  /** Główny akcent: linki, przyciski, zaznaczenie */
  accent: "#d94948",
  /** Hover przycisku / outline */
  accentHover: "rgba(217, 73, 72, 0.85)",
  /** Jaśniejsza czerwień (Elementor) */
  accentLight: "#FA5151",
  /** Ciemniejsza czerwień (Elementor) */
  accentDark: "#CC4F4F",
  /** Mocna czerwień (Elementor) */
  accentDeep: "#C50000",

  /** Tekst body (75% navy) */
  text: "rgba(1, 22, 39, 0.75)",
  /** Pełny navy */
  navy: "#011627",
  /** Nagłówki */
  heading: "#3a3a3a",
  /** Tekst przygaszony */
  muted: "#4B4F58",
  /** Hover linku */
  linkHover: "#4c4848",
  /** Szary tekst (Elementor) */
  gray: "#7A7A7A",

  /** Błękit Astra (global color 0) */
  blue: "#0170B9",
  /** Błękit Elementor */
  blueBright: "#0A87BB",
  /** Granat Elementor */
  blueDark: "#0a2941",

  background: "#FFFFFF",
  surface: "#F5F5F5",
  surfaceAlt: "#EEEEEE",
  surfaceMenu: "#F9F8F8",
  border: "#E5E5E5",
  borderSubtle: "#EAEAEA",
  black: "#000000",
  white: "#FFFFFF",
} as const;

export const brandFont = {
  family: "Montserrat, sans-serif",
  weightRegular: 400,
  weightMedium: 500,
  weightSemibold: 600,
} as const;
