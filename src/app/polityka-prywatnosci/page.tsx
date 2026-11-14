import { SiteFooter } from "@/components/SiteFooter";

export const metadata = {
  title: "Polityka prywatności — Stowarzyszenie Ochotnicy Wolności",
  description:
    "Informacje o plikach cookies i przetwarzaniu danych na stronie ochotnicywolnosci.org.",
};

export default function PolitykaPrywatnosciPage() {
  return (
    <main className="legal-page">
      <div className="legal-page__inner">
        <header className="home-head">
          <div className="home-head__bar">
            <h1 className="home-head__title">Polityka prywatności</h1>
          </div>
        </header>

        <p className="legal-page__eyebrow">Pliki cookies</p>

        <ol className="legal-page__list">
          <li>
            Witryna www.ochotnicywolnosci.org używa cookies. Są to niewielkie
            pliki tekstowe wysyłane przez serwer www i przechowywane przez
            oprogramowanie komputera przeglądarki. Kiedy przeglądarka ponownie
            połączy się ze stroną, witryna rozpoznaje rodzaj urządzenia, z
            którego łączy się użytkownik. Parametry pozwalają na odczytanie
            informacji w nich zawartych jedynie serwerowi, który je utworzył.
            Cookies ułatwiają więc korzystanie z wcześniej odwiedzonych witryn.
          </li>
          <li>
            Gromadzone informacje dotyczą adresu IP, typu wykorzystywanej
            przeglądarki, języka, rodzaju systemu operacyjnego, dostawcy usług
            internetowych, informacji o czasie i dacie, lokalizacji oraz
            informacji przesyłanych do witryny za pośrednictwem formularza
            kontaktowego.
          </li>
          <li>
            Zebrane dane służą do monitorowania i sprawdzenia, w jaki sposób
            użytkownicy korzystają z naszych witryn, aby usprawniać
            funkcjonowanie serwisu zapewniając bardziej efektywną i
            bezproblemową nawigację. Monitorowania informacji o użytkownikach
            dokonujemy korzystając z narzędzia Google Analytics, które rejestruje
            zachowanie użytkownika na stronie.
          </li>
          <li>
            Cookies identyfikuje użytkownika/użytkowniczkę, co pozwala na
            dopasowanie treści witryny, z której korzysta, do jego/jej potrzeb.
            Zapamiętując wybrane preferencje, umożliwia odpowiednie dopasowanie
            skierowanych do niego/niej reklam. Stosujemy pliki cookies, aby
            zagwarantować najwyższy standard wygody naszego serwisu, a zebrane
            dane są wykorzystywane jedynie w celu optymalizacji działań.
          </li>
          <li>
            Na naszej witrynie mogą być wykorzystywane następujące pliki
            cookies:
            <ul>
              <li>
                „niezbędne” pliki cookies, umożliwiające korzystanie z usług
                dostępnych w ramach serwisu, np. uwierzytelniające pliki cookies
                wykorzystywane do usług wymagających uwierzytelniania w ramach
                serwisu;
              </li>
              <li>
                pliki cookies służące do zapewnienia bezpieczeństwa, np.
                wykorzystywane do wykrywania nadużyć w zakresie uwierzytelniania
                w ramach serwisu;
              </li>
              <li>
                „wydajnościowe” pliki cookies, umożliwiające zbieranie
                informacji o sposobie korzystania ze stron internetowych
                serwisu;
              </li>
              <li>
                „funkcjonalne” pliki cookies, umożliwiające „zapamiętanie”
                wybranych przez użytkownika/użytkowniczkę ustawień i
                personalizację interfejsu, np. w zakresie wybranego języka lub
                regionu, z którego pochodzi użytkownik/użytkowniczka, rozmiaru
                czcionki, wyglądu strony internetowej itp.;
              </li>
              <li>
                „reklamowe” pliki cookies, umożliwiające dostarczanie
                użytkownikom/użytkowniczkom treści reklamowych bardziej
                dostosowanych do ich zainteresowań.
              </li>
            </ul>
          </li>
          <li>
            Użytkownik/użytkowniczka w każdej chwili ma możliwość wyłączenia lub
            przywrócenia opcji gromadzenia cookies poprzez zmianę ustawień w
            przeglądarce internetowej. Instrukcja zarządzania plikami cookies
            jest dostępna na stronie{" "}
            <a
              href="http://www.allaboutcookies.org/manage-cookies"
              target="_blank"
              rel="noopener noreferrer"
            >
              http://www.allaboutcookies.org/manage-cookies
            </a>
            .
          </li>
          <li>
            Dodatkowe dane osobowe (takie jak np. adres e-mail) zbierane są
            jedynie w miejscach, w których użytkownik/użytkowniczka wypełniając
            formularz wyraźnie wyraził/a na to zgodę. Powyższe dane zachowujemy
            i wykorzystujemy tylko do potrzeb niezbędnych do wykonania danej
            funkcji.
          </li>
        </ol>
      </div>
      <SiteFooter />
    </main>
  );
}
