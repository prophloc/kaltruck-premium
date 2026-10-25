# KALTRUCK Premium — port layoutu Die Glanzies v13

## Cel
Pełne przeniesienie wizualnego układu landing page z dostarczonej paczki `dieglanzies_www_premium_v13.zip`, **nie tylko inspiracja stylistyczna**.

Przeniesiono jasny układ dwóch kolumn, niebiesko-zielone napisy z białym obrysem, szkło, perspektywicznie ułożone karty 3D, dolny rząd czterech wyróżników, sekcję ofertową i dwukolumnowy kontakt.

## Wymienione elementy
- marka i logo → KALTRUCK z `/brand/kaltruck-logo.svg`;
- główne hasła → Kontenery / Maszyny / inne ładunki;
- usługi i zdjęcia karuzeli → kontenery, prefabrykaty, maszyny;
- tło → existing responsive Kaltruck HDS imagery;
- kontakt → rzeczywisty telefon, adres e-mail i dane KALTRUCK;
- linki → istniejące podstrony Astro, formularz wyceny i realizacje.

## Źródła
- `src/pages/index.astro` — HTML / SEO landing page;
- `public/dieglanzies-kaltruck.css` — przeniesiony układ i style, z mobilnymi poprawkami;
- `public/dieglanzies-kaltruck.js` — mechanika karuzeli z danymi Kaltruck.

## Zakres i świadomie zachowane funkcje
- Ten PR zmienia **całą stronę główną** zgodnie z układem v13.
- Podstrony usług i formularz zachowują dotychczasowy wygląd i logikę, żeby nie zepsuć ich funkcjonalności ani SEO. Dalszy port wnętrza witryny wymaga osobnej adaptacji i akceptacji nowego landing page.
- Karty realizacji wykorzystują istniejące adresy zdjęć `hdsplock.pl`. Przed produkcją warto pobrać zdjęcia do własnego `public/images/` i przygotować WebP/AVIF oraz stałe źródła.
- Nie wdrażać automatycznie na produkcję; sprawdzić widoki mobilne i desktopowe oraz pełne CI.

## Lokalne uruchomienie
```sh
npm install
npm run dev
```
Otwórz `http://localhost:4321`.

## Testy
`npm run test:run`, `npm run check` (jeśli dostępne), `npm run build`, `npm run test:e2e`. Na PR GitHub Actions testuje Astro, PHP, Vitest i Playwright.
