export type Projekt = {
  id: string;
  title: string;
  /** Krótki podpis na miniaturze */
  teaser: string;
  /** Pełny opis pod dużym zdjęciem (akapity ze strony) */
  body: string[];
  /**
   * Ścieżka do zdjęcia. `null` = puste miejsce (slot zostaje).
   * Źródła: https://www.ochotnicywolnosci.org/projekty/
   */
  image: string | null;
  imageAlt: string;
  /** contain = cała strona/dokument widać (np. Archiwum / Karta) */
  imageFit?: "cover" | "contain";
  /** Opcjonalny CTA */
  cta?: { href: string; label: string; external?: boolean };
};

/**
 * Treść i zdjęcia z https://www.ochotnicywolnosci.org/projekty/
 * Kolejność pasków: Mural → Dziennik → Obchody → …
 */
export const STATIC_PROJEKTY: Projekt[] = [
  {
    id: "mural",
    title: "Mural",
    teaser:
      "Mural na elewacji Skłotu Przychodnia — 85. rocznica wybuchu wojny w Hiszpanii.",
    body: [
      "Mural poświęcony Dąbrowszczakom stworzyliśmy w 85. rocznicę wybuchu hiszpańskiej wojny domowej, w lipcu 2021 roku, na elewacji Skłotu Przychodnia w Warszawie, na ul. Skorupki 6a.",
      "Autorem muralu jest Adam Walas, grafik, muralista i członek stowarzyszenia.",
      "Mural powstał dzięki ponad 90 osobom, które wpłaciły na zrzutkę zorganizowaną na pokrycie kosztów jego powstania.",
    ],
    image: "/projekty/mural.png",
    imageAlt: "Mural Dąbrowszczaków na Skłocie Przychodnia w Warszawie",
  },
  {
    id: "dziennik",
    title: "Dziennik",
    teaser:
      "Praca nad wydaniem niepublikowanego dziennika „Bobrusia” z frontu.",
    body: [
      "Od 2019 roku pracujemy nad wydaniem dziennika Borucha Nysenbauma „Bobrusia”, Dąbrowszczaka z Warszawy, który poległ podczas walk w Hiszpanii.",
      "Dziennik przechowywany w Archiwum Akt Nowych, dotychczas nigdzie nie publikowany, jest cennym zapisem obserwacji i przemyśleń nastoletniego żydowsko-polskiego komunisty, który postanowił wyruszyć do Hiszpanii, by dołączyć do Brygad Międzynarodowych.",
      "W przeciwieństwie do dotychczas wydanych wspomnień byłych Dąbrowszczaków „Bobruś” zapisywał swoje przemyślenia bezpośrednio we frontowych okopach, co czyni jego dziennik autentycznym i pozbawionym zewnętrznej ingerencji cenzorskiej lub redaktorskiej.",
      "Publikacja będzie opatrzona przypisami, objaśnieniami oraz materiałami uzupełniającymi.",
    ],
    image: "/projekty/dziennik-bobrus.png",
    imageAlt: "Cytat z dziennika „Bobrusia”",
  },
  {
    id: "obchody",
    title: "Obchody",
    teaser:
      "Coroczne upamiętnienie Dąbrowszczaków w rocznicę wybuchu wojny w Hiszpanii.",
    body: [
      "Od 2016 roku organizujemy coroczne obchody upamiętniające Dąbrowszczaków w rocznicę wybuchu hiszpańskiej wojny domowej.",
      "Głównym punktem wydarzeń jest uroczystość przy kwaterze Dąbrowszczaków na Cmentarzu Wojskowy na Powązkach, gdzie razem z rodzinami polskich interbrygadzistów oraz przedstawicielami i przedstawicielkami organizacji lewicowych składamy kwiaty.",
      "Stałym elementem obchodów jest także różnorodny program wydarzeń obejmujący dyskusje, prezentacje oraz pokazy filmów, organizowany we współpracy z lokalnymi klubokawiarniami i kinami.",
      "W 2020 roku wydarzenie rocznicowe wyjątkowo nie odbyło się z powodu epidemii Covid-19.",
    ],
    image: "/projekty/obchody.jpg",
    imageAlt: "Obchody rocznicowe przy kwaterze Dąbrowszczaków",
  },
  {
    id: "kwerendy",
    title: "Kwerendy",
    teaser:
      "Kwerendy dla rodzin Dąbrowszczaków — uzupełnianie informacji i dokumentów.",
    body: [
      "Przeprowadzamy regularne kwerendy archiwalne na zlecenie krewnych Dąbrowszczaków, umożliwiające uzupełnienie informacji i odnalezienie dokumentów dotyczących poszczególnych interbrygadzistów.",
      "Dzięki naszym kwerendom pomogliśmy dotychczas kilkudziesięciu krewnym Dąbrowszczaków w uzupełnieniu rodzinnych informacji i odkryciu wcześniej nieznanych losów hiszpańskich.",
      "Jeśli Twój krewny lub krewna walczyli w Hiszpanii w szeregach Dąbrowszczaków, napisz do nas: ochotnicywolnosci@gmail.com.",
    ],
    image: "/projekty/kwerendy.jpg",
    imageAlt: "Materiały z kwerend archiwalnych",
    cta: {
      href: "mailto:ochotnicywolnosci@gmail.com",
      label: "Napisz do nas",
    },
  },
  {
    id: "koszulki",
    title: "Koszulki",
    teaser:
      "Seria grafik Adama Walasa we współpracy z Lewacką Szmatą.",
    body: [
      "W 2021 roku podjęliśmy współpracę z Lewacką Szmatą, firmą produkującą ubrania zawierające lewicowy przekaz.",
      "W ramach współpracy powstały oryginalne grafiki autorstwa Adama Walasa, członka naszego stowarzyszenia, nawiązujące do Dąbrowszczaków.",
      "Obecnie dostępne są trzy wzory:",
      "– wzór nawiązujący do naszego muralu w Warszawie",
      "– wzór upamiętniający XIII Brygadę Międzynarodową im. J. Dąbrowskiego",
      "– wzór upamiętniający żydowsko-polskich ochotników z kompanii im. N. Botwina.",
      "Wszystkie koszulki i inne produkty z serii “Dąbrowszczacy” dostępne są w sklepie internetowym [Lewackiej Szmaty](https://lewackaszmata.pl/?s=D%C4%84BROWSZCZACY&post_type=product).",
    ],
    image: "/projekty/koszulki.jpg",
    imageAlt: "Koszulka z serii Dąbrowszczacy",
  },
  {
    id: "archiwum",
    title: "Archiwum",
    teaser:
      "Zasób archiwalny Dąbrowszczaków we współpracy z Fundacją Ośrodek KARTA.",
    body: [
      "Dzięki współpracy z Fundacją Ośrodek Karta otworzyliśmy zasób archiwalny poświęcony Dąbrowszczakom w ramach archiwum fundacji.",
      "Jeśli dysponujesz oryginalnymi dokumentami lub fotografiami związanymi z Dąbrowszczakami i chciałbyś/chciałabyś przekazać je do naszego zasobu archiwalnego, gdzie zostaną one poddane profesjonalnej archiwizacji – napisz do nas!",
      "Jeśli posiadasz materiały, które chcesz zachować, również zachęcamy do kontaktu – zajmujemy się digitalizacją fotografii oraz dokumentów.",
    ],
    image: "/projekty/archiwum-karta.jpg",
    imageAlt: "Dąbrowszczacy w Archiwum KARTY — strona z pisma Karta",
    cta: {
      href: "mailto:ochotnicywolnosci@gmail.com",
      label: "Napisz do nas",
    },
  },
];

/** Lista projektów (stała; rozszerzenia z bazy tylko po stronie serwera). */
export const PROJEKTY = STATIC_PROJEKTY;

/** Na stronie głównej: tylko te trzy (z listy stałej). */
export const HOME_PROJEKTY_IDS = ["mural", "obchody", "koszulki"] as const;

export const HOME_PROJEKTY: Projekt[] = HOME_PROJEKTY_IDS.map(
  (id) => STATIC_PROJEKTY.find((p) => p.id === id)!,
);

export const PROJEKTY_DEFAULT_ID = HOME_PROJEKTY_IDS[0];

export function getProjekt(id: string): Projekt | undefined {
  return PROJEKTY.find((p) => p.id === id);
}
