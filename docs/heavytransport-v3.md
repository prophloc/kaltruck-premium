# KALTRUCK Premium — gotowa adaptacja referencyjnego layoutu HeavyTransport

Wzorzec wskazany i zaakceptowany przez użytkownika: https://www.heavytransport.pl/with-a-crane-across-poland/

## Zakres całej witryny

Ostatnia poprawka stanowi domknięcie nowego layoutu na jednym branchu `feature/heavytransport-editorial-v3` i PR #6.

- **Strona główna:** kompaktowy pasek kontaktowy i nawigacja, baner fotograficzny, cztery parametry firmy, treść o transporcie HDS, przykładowe realizacje, kontakt, stopka.
- **Sześć podstron usług:** `transport-hds`, `wynajem-hds`, `transport-kontenerow`, `transport-prefabrykatow`, `transport-maszyn`, `rozladunek-hds`. Spójny krótki baner, rozwinięty od razu kompletny opis SEO, zdjęcie z realizacji, powiązane usługi, kontakt.
- **Katalog usług:** wszystkie 31 obsługiwanych zadań, 5 grup, zachowane przełączanie.
- **Realizacje:** 5 grup, filtrowana galeria, oryginalne źródła zdjęć i lightbox.
- **Sprzęt:** zweryfikowane parametry HDS z kontekstem ich zależności od promienia i warunków podnoszenia.
- **O nas:** historia firmy i zakres usług.
- **Kontakt:** telefon, e-mail, adres i narzędzie sprawdzania trasy.
- **Wycena:** zachowany oryginalny `QuoteForm`, walidacja pól, statusy i backend `wycena-wyslij.php`.
- **Wspólne elementy:** jeden `ReferenceHeader` i `ReferenceFooter`, otwierane na żądanie narzędzie trasy i panel opinii Google, aktywne linki menu.
- **SEO:** zachowane canonical, OpenGraph, robots, sitemap, JSON-LD typu Organization/Breadcrumb/Service i polskie treści wszystkich podstron.

## Główne pliki

- `src/components/HeavyTransportReference.astro` — strona główna.
- `src/components/ReferenceHeader.astro`, `ReferenceFooter.astro` — wspólny wygląd całej strony.
- `src/components/ReferenceBanner.astro` i `ReferenceContactStrip.astro` — spójne nagłówki oraz kontakty.
- `src/layouts/BaseLayout.astro`, `ServiceLayout.astro` — wszystkie podstrony i SEO.
- `src/pages/*.astro` — realizacje, sprzęt, kontakt, o nas, wycena.
- `public/heavytransport-layout.css` — kompletny responsywny motyw.

Kod i grafiki wzorca HeavyTransport nie były kopiowane. Kolor akcentu i struktura zostały zaadaptowane; fotografie i logo pochodzą z zasobów KALTRUCK. **Linki zewnętrzne do zdjęć na hdsplock.pl** wymagają przed wdrożeniem weryfikacji i najlepiej migracji do własnych zoptymalizowanych plików, by ograniczyć zależność od zewnętrznej strony.

## Jak aktualizować w tym samym folderze na Windowsie

```powershell
git fetch origin
git switch feature/heavytransport-editorial-v3
git pull --ff-only origin feature/heavytransport-editorial-v3
npm run dev
```

Otwórz: http://localhost:4321.

Nie twórz nowego folderu ani brancha.

## Produkcja

Zmiany są w **Draft PR #6** i nie zostały wdrożone na serwer. Nie scalać z `main` i nie deployować przed akceptacją użytkownika wyglądu na desktopie i telefonie oraz zakończeniem CI.
