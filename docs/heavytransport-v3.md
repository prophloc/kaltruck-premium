# KALTRUCK Premium — struktura podstrony HeavyTransport

Wzorzec wskazany przez użytkownika: https://www.heavytransport.pl/with-a-crane-across-poland/

## Korekta po ocenie V3

Pierwotna propozycja `HeavyTransportLanding.astro` okazała się zbyt podobna do starego layoutu Premium. Została wycofana **w ramach tego samego brancha**.

W nowej wersji odtworzona została kolejność i hierarchia faktycznej podstrony referencyjnej:

1. Kompaktowa linia informacji i poziome menu.
2. Stosunkowo niski baner zdjęciowy z tytułem i breadcrumb.
3. Czterokolumnowy pas liczb/parametrów.
4. Biała sekcja artykułowa z nagłówkiem, kilkuakapitowym opisem i zdjęciem.
5. Krótka galeria zdjęć realizacji i linki do usług.
6. Trzy informacyjne kontakty KALTRUCK zamiast fałszywych profili pracowników.
7. Minimalistyczna stopka.

Nie wykorzystano żadnych obrazów, logo ani kodu konkurencyjnej strony. Używamy własnych zdjęć i danych KALTRUCK. To adaptacja układu, nie kopia piksel w piksel.

## Pliki

- `src/pages/index.astro` — oddzielny dokument strony głównej z canonical, OpenGraph, JSON-LD, lokalnym stylem.
- `src/components/HeavyTransportReference.astro` — struktura strona główna.
- `public/heavytransport-layout.css` — styling responsywny bez poprzedniego hero.
- Pozostałe podstrony i formularz wyceny nie są naruszane.

## Sprawdzanie lokalnie / jeden folder / jeden branch

```powershell
cd "SCIEZKA_DO_TWOJEGO_JUZ_ISTNIEJACEGO_FOLDERU_KALTRUCK"
git fetch origin
git switch feature/heavytransport-editorial-v3
git pull --ff-only
npm run dev
```

Po `npm run dev` podgląd: http://localhost:4321.

**Nie klonować ponownie repo i nie tworzyć nowego folderu.**

## Przed produkcją

- Ocena przez użytkownika wyglądu desktop/mobile.
- Własna kopia zdjęć realizacji i ewentualna konwersja do WebP/AVIF zamiast odwołań do `hdsplock.pl`.
- Ujednolicenie podstron wewnętrznych z nową stroną główną po akceptacji.
- PR pozostaje Draft; produkcja pozostaje bez zmian.
