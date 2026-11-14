# Aktualności

## Dla klienta (łatwy sposób)

1. Otwórz stronę **`/admin`** (link „Dodaj wpis” jest też w stopce).
2. Wpisz tytuł, datę i treść.
3. Opcjonalnie dodaj zdjęcie z dysku albo wklej URL.
4. Kliknij **Opublikuj wpis**.

Wpis od razu pojawia się na liście i (jeśli nie jest „krótkim artykułem”) na stronie głównej.  
Panel działa po zalogowaniu do prywatnej aplikacji Cursor.

## Dla dewelopera (pliki Markdown)

Stare / zaimportowane wpisy nadal leżą w tym folderze: jeden plik `.md` = jedna aktualność. Szablon: `_SZABLON.md`. Wpisy z `/admin` są w bazie Postgres aplikacji i mają pierwszeństwo przy tym samym `slug`.
