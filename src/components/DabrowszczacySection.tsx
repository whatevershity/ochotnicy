import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";

const LEAD =
  "W centrum naszego zainteresowania znajdują się Dąbrowszczacy – antyfaszystki i antyfaszyści z Polski, którzy jako ochotniczki i ochotnicy wzięli udział w hiszpańskiej wojnie domowej (1936-1939) walcząc z faszyzmem w obronie Republiki Hiszpańskiej.";

const ASIDE = [
  "Nasza działalność rozpoczęła się w 2015 roku od inicjatywy „Łapy precz od ul. Dąbrowszczaków”, której celem było powstrzymanie zmiany nazwy ulicy w ramach tzw. dekomunizacji. Organizowaliśmy protesty, debaty, pokazy filmowe, wydarzenia rocznicowe, zbiórki podpisów oraz działania na rzecz przywracania pamięci o Dąbrowszczakach, współpracując również z organizacjami zagranicznymi.",
  "W 2017 roku powołaliśmy Stowarzyszenie Ochotnicy Wolności, poszerzając zakres naszej działalności. Realizowaliśmy m.in. projekty wydawnicze, komiks o Dąbrowszczakach, publikację pamiętników polskich ochotników, mural w Warszawie oraz międzynarodowe projekty badawcze.",
  "Pamięć o ochotnikach Brygad Międzynarodowych, ich odwadze i wartościach, pozostaje dla nas szczególnie ważna wobec narastającego nacjonalizmu, uprzedzeń i nierówności. Wierzymy, że historia Dąbrowszczaków i ich walki „za wolność waszą i naszą” zasługuje na pamięć i pielęgnowanie.",
] as const;

const HISTORIA_LEAD =
  "Dąbrowszczacy to polskie ochotniczki i ochotnicy, którzy w latach 1936–1939 wzięli udział w hiszpańskiej wojnie domowej. Po wybuchu buntu faszystowskich generałów przeciwko Republice Hiszpańskiej do Hiszpanii przybyły dziesiątki tysięcy antyfaszystów z całego świata. Wśród nich znalazło się około 5 tysięcy osób z Polski – jedna z najliczniejszych grup narodowych w Brygadach Międzynarodowych.";

const HISTORIA_BODY = [
  "Polscy ochotnicy utworzyli własny batalion, a później XIII Brygadę Międzynarodową imienia Jarosława Dąbrowskiego. Od nazwiska patrona zaczęto ich nazywać Dąbrowszczakami. Walczyli w niemal wszystkich najważniejszych bitwach wojny – pod Madrytem, nad Jaramą, pod Brunete czy nad Ebro. Wierzyli, że jeśli padnie Madryt, padnie też Warszawa, i że ich walka jest walką „za wolność waszą i naszą”.",
  "W szeregach Brygad Międzynarodowych znaleźli się ludzie o różnych poglądach – komuniści, socjaliści, anarchiści, demokraci i inni. Łączyła ich przede wszystkim chęć obrony Republiki przed faszyzmem. Wielu z nich nie mogło później wrócić do Polski, bo władze pozbawiły ich obywatelstwa za udział w wojnie w Hiszpanii.",
  "Dziś Stowarzyszenie Ochotnicy Wolności przypomina ich historię i postawy, uznając, że pamięć o tych antyfaszystowskich ochotnikach zasługuje na to, by była pielęgnowana i przywracana.",
] as const;

const HISTORIA_PHOTOS = [
  {
    src: "/brand/historia/historia-1.jpg",
    alt: "Grupa Dąbrowszczaków w terenie",
  },
  {
    src: "/brand/historia/historia-2.jpg",
    alt: "Uroczystość przy fladze batalionu",
  },
  {
    src: "/brand/historia/historia-3.jpg",
    alt: "Trzech Dąbrowszczaków z uniesionymi pięściami",
  },
  {
    src: "/brand/historia/historia-4.jpg",
    alt: "Grupa ochotników na tle wzgórza",
  },
] as const;

/**
 * Desktop: asymetryczne „O nas” + granatowa Historia.
 * Mobile: jasny ekran z obrysem + czerwono-jasny split z falą 1:1 jak we wzorze.
 */
export function DabrowszczacySection() {
  return (
    <section
      id="dabrowszczacy"
      aria-labelledby="dabrowszczacy-heading"
      className="dabrow"
    >
      {/* —— Desktop „O nas” —— */}
      <div className="dabrow__inner dabrow__inner--desktop">
        <Reveal>
          <div className="dabrow__intro">
            <header className="home-head">
              <div className="home-head__bar">
                <h2 id="dabrowszczacy-heading" className="home-head__title">
                  Ochotnicy Wolności
                </h2>
              </div>
            </header>

            <div className="dabrow__prose">
              <div className="dabrow__lead-block">
                <p className="dabrow__label">o nas</p>
                <p className="dabrow__lead">{LEAD}</p>
              </div>

              <div className="dabrow__aside-wrap">
                <div className="dabrow__obrys" aria-hidden="true">
                  <Image
                    src="/brand/historia/obrys.png"
                    alt=""
                    width={420}
                    height={900}
                    className="dabrow__obrys-img"
                    unoptimized
                  />
                </div>
                <div className="dabrow__aside">
                  {ASIDE.map((paragraph) => (
                    <p key={paragraph.slice(0, 32)}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={90}>
          <figure className="dabrow__photo">
            <div className="dabrow__photo-frame">
              <Image
                src="/brand/onas.jpg"
                alt="Odsłonięcie muralu — flaga republikańska i race na dachu"
                width={1600}
                height={1200}
                className="dabrow__photo-img"
                sizes="(max-width: 900px) 94vw, 1100px"
                priority={false}
              />
            </div>
            <figcaption className="dabrow__photo-cap">
              Odsłonięcie muralu, Warszawa 2025.
            </figcaption>
          </figure>
        </Reveal>
      </div>

      {/* —— Mobile „O nas”: tło zawsze, tekst wjeżdża —— */}
      <div className="dabrow-m" aria-labelledby="dabrowszczacy-heading-m">
        <div className="dabrow-m__bg" aria-hidden="true">
          <div className="dabrow-m__obrys-wrap">
            <Image
              src="/brand/historia/obrys-light-red.png"
              alt=""
              fill
              sizes="80vw"
              className="dabrow-m__obrys"
              unoptimized
            />
          </div>
        </div>
        <Reveal>
          <div className="dabrow-m__copy">
            <p className="dabrow-m__eyebrow">O nas</p>
            <h2 id="dabrowszczacy-heading-m" className="dabrow-m__title">
              Ochotnicy <span>Wolności</span>
            </h2>
            <p className="dabrow-m__lead">
              W centrum naszej działalności znajdują się Dąbrowszczacy – polskie
              ochotniczki i ochotnicy, którzy walczyli z faszyzmem w obronie
              Republiki Hiszpańskiej podczas wojny domowej w latach 1936–1939.
            </p>
            <p className="dabrow-m__lead">
              Działamy od 2015 roku, kiedy powstała inicjatywa „Łapy precz od ul.
              Dąbrowszczaków”, sprzeciwiająca się zmianie nazwy ulicy w ramach tzw.
              dekomunizacji. Organizowaliśmy protesty, debaty, pokazy filmowe i
              wydarzenia rocznicowe, angażując się w przywracanie pamięci o
              Dąbrowszczakach także we współpracy z organizacjami zagranicznymi.
            </p>
            <p className="dabrow-m__lead dabrow-m__lead--last">
              Pamięć o Dąbrowszczakach, ich odwadze i zaangażowaniu, wyrażonym w
              haśle „za wolność waszą i naszą”, pozostaje dla nas ważna i zasługuje
              na pielęgnowanie.
            </p>
            <Link href="/#projekty" className="ow-btn ow-btn--sweep">
              <span className="ow-btn__label">NASZE PROJEKTY</span>
            </Link>
          </div>
        </Reveal>
      </div>

      <div id="historia">
        {/* —— Historia desktop: tło zawsze, karta wjeżdża —— */}
        <div className="historia historia--desktop">
          <div className="historia__bg" aria-hidden="true">
            <div className="historia__bg-shade" />
          </div>

          <Reveal>
            <div className="historia__inner">
              <div className="historia__card">
                <header className="home-head home-head--on-dark">
                  <div className="home-head__bar">
                    <h2 id="historia-heading" className="home-head__title">
                      Kim byli Dąbrowszczacy?
                    </h2>
                  </div>
                </header>

                <div className="historia__stage">
                  <ul className="historia__photos">
                    {HISTORIA_PHOTOS.map((photo) => (
                      <li key={photo.src} className="historia__photo">
                        <Image
                          src={photo.src}
                          alt={photo.alt}
                          fill
                          className="historia__photo-img"
                          sizes="14rem"
                        />
                      </li>
                    ))}
                  </ul>

                  <div className="historia__copy">
                    <div className="historia__copy-inner">
                      <div className="historia__lead-block">
                        <p className="historia__label">HISTORIA</p>
                        <h3 className="historia__lead">{HISTORIA_LEAD}</h3>
                      </div>
                      <div className="historia__body">
                        {HISTORIA_BODY.map((paragraph) => (
                          <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* —— Historia mobile: czerwone tło zawsze, treść wjeżdża —— */}
        <div className="historia-m" aria-labelledby="historia-heading-m">
          <Reveal>
            <p className="historia-m__eyebrow">Historia</p>
            <h2 id="historia-heading-m" className="historia-m__title">
              Kim byli Dąbrowszczacy?
            </h2>
            <p className="historia-m__text">{HISTORIA_LEAD}</p>
            <p className="historia-m__text">{HISTORIA_BODY[0]}</p>
            <Link
              href="/aktualnosci#artykuly"
              className="ow-btn ow-btn--sweep historia-m__btn"
            >
              <span className="ow-btn__label">DOWIEDZ SIĘ WIĘCEJ</span>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
