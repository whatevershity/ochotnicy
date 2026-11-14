import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata = {
  title: "Kim byli Dąbrowszczacy? — Ochotnicy Wolności",
  description:
    "Historia polskich ochotników w Brygadach Międzynarodowych podczas hiszpańskiej wojny domowej 1936–1939.",
};

const LEAD =
  "Dąbrowszczacy to polskie ochotniczki i ochotnicy, którzy w latach 1936–1939 wzięli udział w hiszpańskiej wojnie domowej. Po wybuchu buntu faszystowskich generałów przeciwko Republice Hiszpańskiej do Hiszpanii przybyły dziesiątki tysięcy antyfaszystów z całego świata. Wśród nich znalazło się około 5 tysięcy osób z Polski – jedna z najliczniejszych grup narodowych w Brygadach Międzynarodowych.";

const BODY = [
  "Polscy ochotnicy utworzyli własny batalion, a później XIII Brygadę Międzynarodową imienia Jarosława Dąbrowskiego. Od nazwiska patrona zaczęto ich nazywać Dąbrowszczakami. Walczyli w niemal wszystkich najważniejszych bitwach wojny – pod Madrytem, nad Jaramą, pod Brunete czy nad Ebro. Wierzyli, że jeśli padnie Madryt, padnie też Warszawa, i że ich walka jest walką „za wolność waszą i naszą”.",
  "W szeregach Brygad Międzynarodowych znaleźli się ludzie o różnych poglądach – komuniści, socjaliści, anarchiści, demokraci i inni. Łączyła ich przede wszystkim chęć obrony Republiki przed faszyzmem. Wielu z nich nie mogło później wrócić do Polski, bo władze pozbawiły ich obywatelstwa za udział w wojnie w Hiszpanii.",
  "Dziś Stowarzyszenie Ochotnicy Wolności przypomina ich historię i postawy, uznając, że pamięć o tych antyfaszystowskich ochotnikach zasługuje na to, by była pielęgnowana i przywracana.",
] as const;

export default function HistoriaPage() {
  return (
    <main className="post-page">
      <article className="post">
        <header className="post__header">
          <p className="post__category">Historia</p>
          <h1 className="post__title">Kim byli Dąbrowszczacy?</h1>
          <p className="post__lead">{LEAD}</p>
        </header>
        <div className="post__body">
          {BODY.map((p) => (
            <p key={p.slice(0, 40)}>{p}</p>
          ))}
        </div>
        <p className="post__back">
          <Link href="/#historia" className="post__back-link">
            Wróć do strony głównej
          </Link>
        </p>
      </article>
      <SiteFooter />
    </main>
  );
}
