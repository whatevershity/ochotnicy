import Image from "next/image";

/**
 * Sekcja darowizn — desktop: Darowizny + lead + karta ze zdjęciem;
 * mobile: Wesprzyj nas! + sama karta.
 * Dane ze https://www.ochotnicywolnosci.org/kontakt/
 */
export function DarowiznySection() {
  return (
    <section
      id="darowizny"
      aria-labelledby="darowizny-heading"
      className="darowizny"
    >
      <div className="darowizny__inner">
        <header className="home-head darowizny__head darowizny__head--desktop">
          <div className="home-head__bar">
            <h2 id="darowizny-heading" className="home-head__title">
              Darowizny
            </h2>
          </div>
        </header>

        <p className="darowizny__lead">
          Jeśli chcesz wesprzeć opiekę nad dziedzictwem&nbsp;Dąbrowszczaków —
          badania archiwalne, uroczystości i codzienną pracę Stowarzyszenia —
          możesz przekazać darowiznę przelewem na konto poniżej.
        </p>

        <header className="home-head darowizny__head darowizny__head--mobile">
          <div className="home-head__bar">
            <h2 className="home-head__title">Wesprzyj nas!</h2>
          </div>
        </header>

        <aside className="darowizny__card" aria-label="Dane do przelewu">
          <div className="darowizny__card-main">
            <div className="darowizny__card-head">
              <p className="darowizny__badge">Przelew</p>
              <p className="darowizny__org">Stowarzyszenie Ochotnicy Wolności</p>
            </div>

            <div className="darowizny__fields">
              <div className="darowizny__field">
                <p className="darowizny__label">Numer konta</p>
                <p className="darowizny__value darowizny__value--account">
                  79&nbsp;1750&nbsp;0012&nbsp;0000&nbsp;0000&nbsp;3781&nbsp;8399
                </p>
              </div>

              <div className="darowizny__field">
                <p className="darowizny__label">IBAN</p>
                <p className="darowizny__value darowizny__value--account">
                  PL79&nbsp;1750&nbsp;0012&nbsp;0000&nbsp;0000&nbsp;3781&nbsp;8399
                </p>
              </div>

              <div className="darowizny__row">
                <div className="darowizny__field">
                  <p className="darowizny__label">Bank</p>
                  <p className="darowizny__value">
                    BNP Paribas Bank Polska S.A.
                    <span className="darowizny__sub">
                      Kasprzaka 2, 01-211 Warszawa
                    </span>
                  </p>
                </div>

                <div className="darowizny__field">
                  <p className="darowizny__label">BIC (SWIFT)</p>
                  <p className="darowizny__value">PPABPLPKXXX</p>
                </div>
              </div>
            </div>

            <p className="darowizny__callout">
              W tytule przelewu napisz: <strong>Darowizna</strong>
            </p>
          </div>

          <div className="darowizny__card-media">
            <Image
              src="/darowizny/piec-kobiet.jpg"
              alt="Pięć kobiet w białych fartuchach — historyczne zdjęcie archiwalne"
              fill
              sizes="(max-width: 900px) 100vw, 26rem"
              className="darowizny__photo"
            />
          </div>
        </aside>
      </div>
    </section>
  );
}
