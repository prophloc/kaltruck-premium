# KALTRUCK Premium V3 — editorial HeavyTransport

Źródło inspiracji układu: https://www.heavytransport.pl/with-a-crane-across-poland/

## Założenia

Kierunek wybrany przez właściciela KALTRUCK zamiast wcześniejszych wariantów Die Glanzies. Strona główna bazuje na kompozycji fotograficzno-redakcyjnej: duży banner, czteroelementowy pas parametrów, obszerna sekcja o firmie z fotografią, trzy duże usługi, sekcja pokazująca rozładunek, argumenty i kontakt.

Kolorystyka pozostaje firmowa, grafitowo-złota. Implementacja jest autorska w Astro/CSS, bez pobierania kodu, logo i zdjęć z HeavyTransport.

## Zakres

- `src/components/HeavyTransportLanding.astro` — treść i struktura.
- `public/heavytransport-layout.css` — wygląd i responsywność.
- `src/pages/index.astro` — podłączenie nowej strony.
- Wszystkie poprzednie podstrony SEO, formularz wyceny, galerie, logika map i opinii są zachowane na osobnych stronach.
- Parametry KALTRUCK: 10+ lat, udźwig do 12 t, zasięg do 14 m, zasięg działalności Polska, zgodnie z istniejącymi komponentami.
- Fotografie realizacji są na `hdsplock.pl`, tak jak poprzednio. Przed wdrożeniem warto lokalizować/konwertować zasoby i sprawdzić prawa użycia.

## Podgląd Windows / PowerShell

```powershell
cd "$HOME\Desktop"
git clone -b feature/heavytransport-editorial-v3 https://github.com/prophloc/kaltruck-premium.git Kaltruck-Heavy-V3
cd Kaltruck-Heavy-V3
npm install
npm run dev
```

Otwórz http://localhost:4321.

## Przed wdrożeniem

1. Zatwierdzić desktop i mobile oraz zgodność ze wskazanym wzorcem.
2. Sprawdzić obrazy w działającej przeglądarce; ewentualnie przechowywać lokalnie i zoptymalizować do WebP/AVIF.
3. Rozważyć spójny styl nagłówka/stopki i podstron wewnętrznych z nowym landingiem.
4. Scalać branch dopiero po akceptacji.
