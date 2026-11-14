/**
 * Stopka: Nawigacja (+ Admin) → Przyjaciele Brygad → Zaprzyjaźnione | Kontakt.
 * Na mobile (≤900px) zostaje sam blok Kontakt.
 */

const NAV = [
  { href: "/#dabrowszczacy", label: "O nas" },
  { href: "/aktualnosci", label: "Aktualności" },
  { href: "/#historia", label: "Dąbrowszczacy" },
  { href: "/#projekty", label: "Projekty" },
  { href: "/kampania", label: "„Łapy precz…”" },
  { href: "#kontakt", label: "Kontakt" },
] as const;

const MEDIA = [
  {
    href: "https://www.facebook.com/Bohaterowie1936",
    label: "Facebook",
    icon: "facebook",
  },
  {
    href: "https://www.youtube.com/@ochotnicywolnosci",
    label: "YouTube",
    icon: "youtube",
  },
  {
    href: "https://www.instagram.com/",
    label: "Instagram",
    icon: "instagram",
  },
] as const;

function MediaIcon({ name }: { name: (typeof MEDIA)[number]["icon"] }) {
  if (name === "facebook") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path
          fill="currentColor"
          d="M14 8.2h2.1V5H14c-2.3 0-3.8 1.5-3.8 3.9V11H8.2v3.2h2V19h3.2v-4.8h2.1l.4-3.2h-2.5V9.1c0-.6.3-.9.9-.9Z"
        />
      </svg>
    );
  }

  if (name === "youtube") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path
          fill="currentColor"
          d="M21.6 7.8a2.7 2.7 0 0 0-1.9-1.9C17.9 5.5 12 5.5 12 5.5s-5.9 0-7.7.4A2.7 2.7 0 0 0 2.4 7.8 28 28 0 0 0 2 12a28 28 0 0 0 .4 4.2 2.7 2.7 0 0 0 1.9 1.9c1.8.4 7.7.4 7.7.4s5.9 0 7.7-.4a2.7 2.7 0 0 0 1.9-1.9A28 28 0 0 0 22 12a28 28 0 0 0-.4-4.2ZM10.2 14.8V9.2L15.1 12l-4.9 2.8Z"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M12 7.2A4.8 4.8 0 1 0 12 16.8 4.8 4.8 0 0 0 12 7.2Zm0 7.9a3.1 3.1 0 1 1 0-6.2 3.1 3.1 0 0 1 0 6.2Zm5.1-8.2a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0ZM12 3.6c-2.3 0-2.6 0-3.5.1-.9 0-1.5.2-2 .4a4 4 0 0 0-1.5 1 4 4 0 0 0-1 1.5c-.2.5-.3 1.1-.4 2-.1.9-.1 1.2-.1 3.5s0 2.6.1 3.5c0 .9.2 1.5.4 2a4 4 0 0 0 1 1.5 4 4 0 0 0 1.5 1c.5.2 1.1.3 2 .4.9.1 1.2.1 3.5.1s2.6 0 3.5-.1c.9 0 1.5-.2 2-.4a4 4 0 0 0 1.5-1 4 4 0 0 0 1-1.5c.2-.5.3-1.1.4-2 .1-.9.1-1.2.1-3.5s0-2.6-.1-3.5c0-.9-.2-1.5-.4-2a4 4 0 0 0-1-1.5 4 4 0 0 0-1.5-1c-.5-.2-1.1-.3-2-.4-.9-.1-1.2-.1-3.5-.1Zm0 1.5c2.2 0 2.5 0 3.4.1.8 0 1.3.2 1.6.3.4.2.7.3 1 .6.3.3.5.6.6 1 .1.3.3.8.3 1.6.1.9.1 1.2.1 3.4s0 2.5-.1 3.4c0 .8-.2 1.3-.3 1.6-.2.4-.3.7-.6 1-.3.3-.6.5-1 .6-.3.1-.8.3-1.6.3-.9.1-1.2.1-3.4.1s-2.5 0-3.4-.1c-.8 0-1.3-.2-1.6-.3-.4-.2-.7-.3-1-.6a2.7 2.7 0 0 1-.6-1c-.1-.3-.3-.8-.3-1.6-.1-.9-.1-1.2-.1-3.4s0-2.5.1-3.4c0-.8.2-1.3.3-1.6.2-.4.3-.7.6-1 .3-.3.6-.5 1-.6.3-.1.8-.3 1.6-.3.9-.1 1.2-.1 3.4-.1Z"
      />
    </svg>
  );
}

const BRIGADE_FRIENDS = [
  {
    href: "https://www.brigadasinternacionales.org/",
    label: "Asociación de Amigos de las Brigadas Internacionales (Hiszpania)",
  },
  {
    href: "https://spanje3639.org",
    label: "Stichting Spanje 1936 – 1939 (Holandia)",
  },
  {
    href: "http://www.spanienfrivilligasvanner.se/",
    label: "Svenska Spanienfrivilligas Vänner (Szwecja)",
  },
  {
    href: "http://www.aicvas.org/",
    label:
      "Associazione Italiana Combattenti Volontari Antifascisti di Spagna (Włochy)",
  },
  {
    href: "http://fibi-ireland.com/",
    label: "Friends of the International Brigades in Ireland (Irlandia)",
  },
  {
    href: "http://www.international-brigades.org.uk",
    label: "The International Brigade Memorial Trust (Wielka Brytania)",
  },
  {
    href: "http://acer-aver.com/",
    label: "Les Amis des Combattants en Espagne Républicaine (Francja)",
  },
  {
    href: "http://www.kfsr.info",
    label:
      "Kämpfer und Freunde der Spanischen Republik 1936–1939 e. V. (Niemcy)",
  },
  {
    href: "https://alba-valb.org/",
    label: "The Abraham Lincoln Brigade Archives (USA)",
  },
] as const;

const FRIENDS = [
  {
    href: "https://www.facebook.com/przywrocmypamiecopatronachwykletych",
    label: "Przywróćmy pamięć o Patronach Wyklętych",
  },
  {
    href: "https://www.facebook.com/pg/RazemwWarszawie/",
    label: "Partia Razem – Okręg Warszawski",
  },
  {
    href: "https://www.facebook.com/warkomsrod",
    label: "Inicjatywa Pracownicza Warszawska",
  },
  {
    href: "https://www.facebook.com/slaskzbuntowany/",
    label: "Zbuntowany Śląsk",
  },
  {
    href: "http://www.a-filmfest.org",
    label: "Anarchistyczny Festiwal Filmowy",
  },
] as const;

export function SiteFooter() {
  return (
    <footer
      id="kontakt"
      className="site-footer"
      aria-labelledby="kontakt-heading"
    >
      <div className="site-footer__inner">
        <div className="site-footer__layout">
          <div className="site-footer__col">
            <p className="site-footer__col-name">Nawigacja</p>
            <ul className="site-footer__links">
              {NAV.map((item) => (
                <li key={item.href}>
                  <a href={item.href}>{item.label}</a>
                </li>
              ))}
            </ul>

            <p className="site-footer__col-name site-footer__col-name--stack">
              Admin
            </p>
            <ul className="site-footer__links">
              <li>
                <a href="/admin">Dodaj wpis</a>
              </li>
            </ul>
          </div>

          <div className="site-footer__col site-footer__col--friends">
            <p className="site-footer__col-name">Przyjaciele Brygad</p>
            <ul className="site-footer__links site-footer__links--friends">
              {BRIGADE_FRIENDS.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="site-footer__col site-footer__col--friends">
            <p className="site-footer__col-name">Zaprzyjaźnione organizacje</p>
            <ul className="site-footer__links site-footer__links--friends">
              {FRIENDS.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="site-footer__divider" aria-hidden />

          <div className="site-footer__contact site-footer__col--wide">
            <h2 id="kontakt-heading" className="site-footer__contact-title">
              <span className="site-footer__kontakt-mark" aria-hidden />
              <span className="site-footer__kontakt-label">Kontakt</span>
            </h2>

            <div className="site-footer__contact-body">
              <a
                className="site-footer__mail"
                href="mailto:ochotnicywolnosci@gmail.com"
              >
                ochotnicywolnosci@gmail.com
              </a>

              <address className="site-footer__address">
                <span className="site-footer__org">
                  Stowarzyszenie&nbsp;Ochotnicy&nbsp;Wolności
                </span>
                <br />
                ul. Świeradowska 47
                <br />
                02-662 Warszawa
              </address>
            </div>

            <ul className="site-footer__media">
              {MEDIA.map((item) => (
                <li key={item.label}>
                  <a
                    className="site-footer__media-link"
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.label}
                  >
                    <MediaIcon name={item.icon} />
                  </a>
                </li>
              ))}
            </ul>

            <div className="site-footer__legal">
              <a className="site-footer__legal-link" href="/polityka-prywatnosci">
                Polityka prywatności
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
