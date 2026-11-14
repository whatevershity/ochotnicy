import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata = {
  title: "O nas — Ochotnicy Wolności",
  description:
    "Kim jesteśmy i dlaczego przypominamy historię Dąbrowszczaków.",
};

const LEAD =
  "W centrum naszego zainteresowania znajdują się Dąbrowszczacy – antyfaszystki i antyfaszyści z Polski, którzy jako ochotniczki i ochotnicy wzięli udział w hiszpańskiej wojnie domowej (1936-1939) walcząc z faszyzmem w obronie Republiki Hiszpańskiej.";

const BODY = [
  "Nasza działalność rozpoczęła się w 2015 roku od inicjatywy „Łapy precz od ul. Dąbrowszczaków”, której celem było powstrzymanie zmiany nazwy ulicy w ramach tzw. dekomunizacji. Organizowaliśmy protesty, debaty, pokazy filmowe, wydarzenia rocznicowe, zbiórki podpisów oraz działania na rzecz przywracania pamięci o Dąbrowszczakach, współpracując również z organizacjami zagranicznymi.",
  "W 2017 roku powołaliśmy Stowarzyszenie Ochotnicy Wolności, poszerzając zakres naszej działalności. Realizowaliśmy m.in. projekty wydawnicze, komiks o Dąbrowszczakach, publikację pamiętników polskich ochotników, mural w Warszawie oraz międzynarodowe projekty badawcze.",
  "Pamięć o ochotnikach Brygad Międzynarodowych, ich odwadze i wartościach, pozostaje dla nas szczególnie ważna wobec narastającego nacjonalizmu, uprzedzeń i nierówności. Wierzymy, że historia Dąbrowszczaków i ich walki „za wolność waszą i naszą” zasługuje na pamięć i pielęgnowanie.",
] as const;

export default function ONasPage() {
  return (
    <main className="post-page">
      <article className="post">
        <header className="post__header">
          <p className="post__category">O nas</p>
          <h1 className="post__title">Ochotnicy Wolności</h1>
          <p className="post__lead">{LEAD}</p>
        </header>
        <div className="post__body">
          {BODY.map((p) => (
            <p key={p.slice(0, 40)}>{p}</p>
          ))}
        </div>
        <p className="post__back">
          <Link href="/#dabrowszczacy" className="post__back-link">
            Wróć do strony głównej
          </Link>
        </p>
      </article>
      <SiteFooter />
    </main>
  );
}
