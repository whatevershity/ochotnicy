/** Długie teksty — układ jak /kampania (sekcje + nagłówki). */
export const LONGFORM_AKTUALNOSCI_SLUGS = new Set([
  "walki-nad-jarama-wspomnienia-dabrowszczaka",
  "sant-pere-de-torrello",
  "krwawe-walka-pod-wzgorzem-sierra-quemada",
  "opor-wobec-dekomunizacji-punkt-zwrotny-w-lewicowej-polityce-historycznej",
]);

export function isLongformAktualnosc(slug: string): boolean {
  return LONGFORM_AKTUALNOSCI_SLUGS.has(slug);
}
