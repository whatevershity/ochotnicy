import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { readingTimeMinutes } from "@/lib/aktualnosci";

export const metadata = {
  title: "Kampania „Łapy precz od ul. Dąbrowszczaków” — Ochotnicy Wolności",
  description:
    "Historia kampanii w obronie nazwy ulicy Dąbrowszczaków w Warszawie (2015–2019).",
};

type TimelineItem = {
  date: string;
  text: string;
  image?: string;
  imageAlt?: string;
  links?: { href: string; label: string }[];
};

const FACTS = [
  {
    label: "Lata działania",
    value: "2015–2019",
    note: "od pierwszej komisji do powrotu tabliczek",
  },
  {
    label: "Podpisy mieszkańców",
    value: "ok. 1700",
    note: "petycja z ul. Dąbrowszczaków i okolic",
  },
  {
    label: "Finał",
    value: "NSA 2019",
    note: "prawomocne przywrócenie nazwy ulicy",
  },
] as const;

const INTRO = [
  "Inicjatywa „Łapy Precz od ul. Dąbrowszczaków” działała w latach 2015–2019. Jej celem było uchronienie przed tzw. dekomunizacją nazwy warszawskiej ulicy Dąbrowszczaków upamiętniającej antyfaszystów i antyfaszystki z Polski walczących w hiszpańskiej wojnie domowej w ramach Brygad Międzynarodowych.",
  "Przez pierwsze dwa lata kampania funkcjonowała nieformalnie, a w roku 2017 jej członkinie i członkowie utworzyli Stowarzyszenie Ochotnicy Wolności, aby sformalizować i usystematyzować dotychczasową działalność oraz poszerzyć zakres działań na polu lewicowej pamięci historycznej. Tym samym inicjatywa „Łapy precz od ul. Dąbrowszczaków” przekształciła się w kampanię Stowarzyszenia. W kwietniu 2019 roku Naczelny Sąd Administracyjny przywrócił nazwę ul. Dąbrowszczaków na mapę Warszawy, w związku z czym Stowarzyszenie kampanię zakończyło.",
] as const;

const HOW = [
  "Na przestrzeni prawie czterech lat inicjatywa przyczyniła się do przywrócenia społecznej pamięci o Dąbrowszczakach i do publicznej dyskusji o wymazywaniu tej pamięci z przestrzeni miejskiej. Przypomniała wartości i postawy antyfaszystowskich ochotników i ochotniczek z Polski — i sprawiła, że ich walka została uznana przez współczesne ruchy lewicowe i antyfaszystowskie za element lewicowej tradycji.",
  "Udało się to dzięki różnorodnym działaniom: petycjom, udziałowi w posiedzeniach komisji miejskich, pikietom, uroczystościom rocznicowym i wydarzeniom artystycznym, a także tekstom publicystycznym.",
  "Kampania skupiła uwagę mediów warszawskich i ogólnopolskich jako jedna z pierwszych inicjatyw sprzeciwiających się tzw. dekomunizacji. W 2017 roku wygrała „Stołek” — nagrodę czytelników Gazety Stołecznej; w tym samym roku jej przedstawiciele trafili na okładkę gazety. Przez lata aktywności członkowie i członkinie udzielili kilkudziesięciu wypowiedzi w prasie, radiu i telewizji.",
] as const;

const COURT = [
  "W 2018 roku, gdy wojewoda mazowiecki — zgodnie z wytycznymi IPN — nakazał zmianę nazwy ul. Dąbrowszczaków, spór przeszedł na drogę administracyjną między Miastem Stołecznym Warszawa a władzą centralną. Działalność inicjatywy skupiła się wówczas na przekonaniu radnych do działań na rzecz przywrócenia nazwy.",
  "Decyzja wojewody została przez władze Warszawy zaskarżona do Wojewódzkiego Sądu Administracyjnego, który przywrócił nazwę ulicy. W kwietniu 2019 roku potwierdził to Naczelny Sąd Administracyjny. Działalność inicjatywy niewątpliwie przyczyniła się do podjęcia przez miasto tych kroków.",
  "Dalsza praca na rzecz pamięci o Dąbrowszczakach trwa pod szyldem Stowarzyszenia Ochotnicy Wolności.",
] as const;

const TIMELINE: TimelineItem[] = [
  {
    date: "24 czerwca 2015",
    text: "Zespół ds. Nazewnictwa Miejskiego pozytywnie zaopiniował zmianę nazwy ul. Dąbrowszczaków. Temat ten był dyskutowany na Komisji ds. Nazewnictwa Miejskiego. Po opisaniu sprawy przez lokalne media zawiązuje się inicjatywa „Łapy precz od ulicy Dąbrowszczaków\".",
    image: "/kampania/timeline-2015.jpg",
    imageAlt: "Ulica Dąbrowszczaków — początek kampanii",
  },
  {
    date: "9 lipca 2015",
    text: "Przedstawiciele inicjatywy „Łapy precz od ul. Dąbrowszczaków\" uczestniczą w posiedzeniu Rady Miasta i przekazują przewodniczącej Ewie Malinowskiej-Grupińskiej apel o zachowanie ul. Dąbrowszczaków.",
  },
  {
    date: "28 stycznia 2016",
    text: "Udział przedstawicieli inicjatywy w posiedzeniu Komisji ds. Nazewnictwa Miejskiego. Przekazano radnym apel z podpisem ponad tysiąca osób w obronie nazwy ul. Dąbrowszczaków.",
    links: [
      {
        href: "https://www.ipetitions.com/petition/NoPasaran",
        label: "Apel z podpisami",
      },
    ],
  },
  {
    date: "5 kwietnia 2016",
    text: "Sejm jednogłośnie przyjmuje tzw. „ustawę dekomunizacyjną” — ustawę „o zakazie propagowania komunizmu lub innego ustroju totalitarnego przez nazwy jednostek organizacyjnych, jednostek pomocniczych gminy, budowli, obiektów i urządzeń użyteczności publicznej oraz pomniki\".",
  },
  {
    date: "24 kwietnia 2016",
    text: "Inicjatywa „Łapy precz…” inicjuje akcję wysyłania apeli do warszawskich radnych o zachowanie ulicy Dąbrowszczaków w obliczu przegłosowania przez Sejm tzw. ustawy dekomunizacyjnej.",
  },
  {
    date: "11 maja 2016",
    text: "Udział przedstawicieli inicjatywy w posiedzeniu Komisji ds. Nazewnictwa Miejskiego.",
  },
  {
    date: "Wrzesień 2016",
    text: "Przepisy ustawy dekomunizacyjnej wchodzą w życie. Władze samorządowe mają 12 miesięcy na zmiany nazw ulic.",
  },
  {
    date: "8 września 2016",
    text: "Akcja protestacyjna pod „Przystankiem Historia” Instytutu Pamięci Narodowej. „¡No pasarán! Dość zakłamywania historii!”. Wydarzenie zorganizowane przez „Łapy precz…” wspólnie z Warszawskim Chórem Rewolucyjnym „Warszawianka” w 80. rocznicę utworzenia „Grupy 36-ściu im. J. Dąbrowskiego”.",
    image: "/kampania/foto-7.jpg",
    imageAlt: "Protest pod Przystankiem Historia IPN",
  },
  {
    date: "14 września 2016",
    text: "Udział przedstawicieli inicjatywy w posiedzeniu Komisji ds. Nazewnictwa Miejskiego.",
  },
  {
    date: "Październik–listopad 2016",
    text: "Zbiórka podpisów wśród mieszkańców ulicy Dąbrowszczaków i okolic pod petycją do Rady m.st. Warszawy z apelem o nie wpisywanie ul. Dąbrowszczaków na listę nazw do tzw. dekomunizacji. Petycję podpisuje blisko 1700 mieszkanek i mieszkańców. Złożeniu petycji towarzyszy konferencja prasowa. Zbiórkę przeprowadziły Inicjatywa Łapy Precz oraz warszawski oddział Partii Razem.",
    image: "/kampania/foto-3.jpg",
    imageAlt: "Zbiórka podpisów na ulicy Dąbrowszczaków",
  },
  {
    date: "Maj 2017",
    text: "Formalizacja działalności — na bazie inicjatywy powstaje Stowarzyszenie Ochotnicy Wolności. Równocześnie klub radnych PO przedstawia listę ulic do „dekomunizacji”. Nie ma wśród nich ul. Dąbrowszczaków.",
  },
  {
    date: "6 września 2017",
    text: "Przekazanie Wojewodzie Mazowieckiemu listu otwartego ws. zachowania nazwy ul. Dąbrowszczaków. Pod apelem Stowarzyszenia / inicjatywy podpisało się ponad 100 osób ze świata nauki i kultury z Polski i zagranicy. Przekazaniu listu towarzyszyła konferencja prasowa.",
  },
  {
    date: "27 listopada 2017",
    text: "Wojewoda Mazowiecki wydaje decyzję o zmianie nazw 47 warszawskich ulic. Wśród nich jest ul. Dąbrowszczaków, która od tej pory staje się ul. Sawinkowa.",
  },
  {
    date: "Grudzień 2017",
    text: "Wystąpienie członków Stowarzyszenia na sesji Rady m.st. Warszawy przed głosowaniem ws. zaskarżenia decyzji wojewody. Na wniosek inicjatywy Komisja Infrastruktury Rady Dzielnicy Praga Północ zajmuje stanowisko za zachowaniem nazwy. Rada m.st. Warszawy uchwala zaskarżenie zarządzeń zastępczych wojewody do WSA.",
  },
  {
    date: "20 stycznia 2018",
    text: "Tabliczki z nazwą ulicy Dąbrowszczaków zostają zdemontowane. Od tego momentu obowiązuje nazwa narzucona przez Wojewodę Mazowieckiego — ul. Borysa Sawinkowa.",
  },
  {
    date: "30 maja 2018",
    text: "Wojewódzki Sąd Administracyjny w Warszawie uchyla decyzję Wojewody Mazowieckiego o zmianie nazwy ul. Dąbrowszczaków. Wyrok nie jest jeszcze prawomocny — wojewoda odwołuje się do NSA. Do ostatecznej decyzji miasto wstrzymuje się z przywróceniem tabliczek.",
  },
  {
    date: "10 kwietnia 2019",
    text: "Naczelny Sąd Administracyjny oddala skargę kasacyjną Wojewody Mazowieckiego i przywraca nazwę ulicy Dąbrowszczaków na mapę Warszawy. Przedstawiciele i przedstawicielki Stowarzyszenia oraz inicjatywy są obecni na sali podczas odczytywania decyzji.",
  },
  {
    date: "25 kwietnia 2019",
    text: "Tabliczki z nazwą ulicy Dąbrowszczaków wracają na swoje miejsce. Kampania „Łapy precz od ul. Dąbrowszczaków” dobiega końca.",
    image: "/kampania/timeline-2019-tablice.jpg",
    imageAlt: "Powrót tabliczek ulicy Dąbrowszczaków",
  },
];

/**
 * Podstrona kampanii — treść ze
 * https://www.ochotnicywolnosci.org/kampania/
 * Kalendarium w układzie osi czasu jak na starej stronie.
 */
export default function KampaniaPage() {
  const readingSource = [
    ...INTRO,
    ...HOW,
    ...COURT,
    ...TIMELINE.map((item) => item.text),
  ].join(" ");
  const minutes = readingTimeMinutes(readingSource);

  return (
    <main className="kampania">
      <div className="kampania__inner">
        <header className="kampania__header">
          <p className="news__eyebrow">Kampania 2015–2019</p>
          <h1 className="kampania__title">
            Łapy precz od ul. Dąbrowszczaków
          </h1>
          <p className="post__meta">
            <time dateTime="2019-04-25">25 kwietnia 2019</time>
            <span className="post__meta-sep" aria-hidden>
              ·
            </span>
            <span>{minutes} min czytania</span>
          </p>
          <p className="kampania__lead">
            Cztery lata obrony pamięci na warszawskiej Pradze — od pierwszej
            komisji, przez petycje i sądy, aż do powrotu tabliczek.
          </p>
        </header>

        <figure className="kampania__hero-fig">
          <Image
            src="/kampania/podpisy.jpg"
            alt="Zbiórka podpisów w obronie ulicy Dąbrowszczaków"
            width={1200}
            height={800}
            className="kampania__hero-img"
            priority
          />
          <figcaption className="kampania__hero-cap">
            Zbiórka podpisów wśród mieszkańców ulicy i okolic
          </figcaption>
        </figure>

        <section className="kampania__facts" aria-label="W skrócie">
          {FACTS.map((fact) => (
            <div key={fact.label} className="kampania__fact">
              <p className="kampania__fact-value">{fact.value}</p>
              <p className="kampania__fact-label">{fact.label}</p>
              <p className="kampania__fact-note">{fact.note}</p>
            </div>
          ))}
        </section>

        <section className="kampania__section" aria-labelledby="o-kampanii">
          <h2 id="o-kampanii" className="kampania__subtitle">
            O kampanii
          </h2>
          <div className="kampania__prose">
            {INTRO.map((p) => (
              <p key={p.slice(0, 48)}>{p}</p>
            ))}
          </div>
        </section>

        <section className="kampania__section" aria-labelledby="jak-dzialalismy">
          <h2 id="jak-dzialalismy" className="kampania__subtitle">
            Jak działaliśmy
          </h2>
          <div className="kampania__prose">
            {HOW.map((p) => (
              <p key={p.slice(0, 48)}>{p}</p>
            ))}
          </div>
        </section>

        <div className="kampania__gallery" aria-hidden>
          <Image
            src="/kampania/dabrowszczakow.jpg"
            alt=""
            width={800}
            height={600}
            className="kampania__gallery-img"
          />
          <Image
            src="/kampania/foto-7.jpg"
            alt=""
            width={800}
            height={600}
            className="kampania__gallery-img"
          />
          <Image
            src="/kampania/foto-3.jpg"
            alt=""
            width={768}
            height={512}
            className="kampania__gallery-img"
          />
        </div>

        <section className="kampania__section" aria-labelledby="droga-sadowa">
          <h2 id="droga-sadowa" className="kampania__subtitle">
            Droga sądowa
          </h2>
          <div className="kampania__prose">
            {COURT.map((p) => (
              <p key={p.slice(0, 48)}>{p}</p>
            ))}
          </div>
        </section>

        <section
          className="kampania__timeline"
          aria-labelledby="kalendarium"
        >
          <h2 id="kalendarium" className="kampania__subtitle">
            Kalendarium wydarzeń
          </h2>

          <ol className="kampania__axis">
            {TIMELINE.map((item, index) => {
              const side = index % 2 === 0 ? "left" : "right";
              return (
                <li
                  key={item.date + item.text.slice(0, 24)}
                  className={`kampania__axis-item kampania__axis-item--${side}`}
                >
                  <span className="kampania__axis-dot" aria-hidden />
                  <article className="kampania__axis-panel">
                    <h3 className="kampania__event-date">{item.date}</h3>
                    {item.image ? (
                      <div className="kampania__axis-media">
                        <Image
                          src={item.image}
                          alt={item.imageAlt ?? ""}
                          width={930}
                          height={551}
                          className="kampania__axis-img"
                        />
                      </div>
                    ) : null}
                    <p className="kampania__event-text">{item.text}</p>
                    {item.links?.length ? (
                      <p className="kampania__axis-links">
                        {item.links.map((link) => (
                          <a
                            key={link.href}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {link.label}
                          </a>
                        ))}
                      </p>
                    ) : null}
                  </article>
                </li>
              );
            })}
          </ol>
        </section>

        <aside className="kampania__follow">
          <h2 className="kampania__subtitle">Śledź archiwum kampanii</h2>
          <p className="kampania__section-lead">
            Relacje, zdjęcia i komentarze z lat 2015–2019 — na Facebooku
            inicjatywy.
          </p>
          <p className="kampania__follow-actions">
            <a
              className="kampania__follow-link"
              href="https://www.facebook.com/lapyprecz/"
              target="_blank"
              rel="noopener noreferrer"
            >
              FB: Łapy precz…
            </a>
            <Link className="kampania__follow-link kampania__follow-link--ghost" href="/aktualnosci">
              Aktualności stowarzyszenia
            </Link>
          </p>
        </aside>
      </div>
      <SiteFooter />
    </main>
  );
}
