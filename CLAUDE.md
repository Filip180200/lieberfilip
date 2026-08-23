# Instrukcje dla AI — lieberfilip.pl

Ten plik opisuje, jak dodawać nowe wpisy treści (doświadczenie, publikacje, projekty) na tej stronie na podstawie zmian w CV Filipa. Ogólny opis projektu i struktury repo jest w [README.md](README.md).

## Źródło prawdy: CV.md

Filip prowadzi swoje CV w Obsidianie: `C:\Users\liebe\Desktop\obsidian\10 Me\CV.md` (plik poza tym repo). Gdy użytkownik prosi o dodanie/zaktualizowanie wpisu "na podstawie CV" albo wkleja fragment CV.md, przeczytaj ten plik i przełóż wskazaną sekcję na fragment HTML w odpowiedniej podstronie wg tabeli niżej. CV.md jest źródłem faktów (daty, stanowiska, oceny, numery grantów) — kopiuj je dokładnie, tłumacząc na polski (strona jest po polsku, CV jest po angielsku).

## Mapowanie sekcji CV.md → podstrony

| Sekcja w CV.md | Podstrona (PL) | Odpowiednik EN | Wrapper | Logo/okładka |
|---|---|---|---|---|
| Teaching Experience, Professional Experience, Grants and Research Projects (rola wykonawcza), Leadership/Memberships | `doswiadczenie.html` | `en/experience.html` | `.job-wrapper` | `.job-logo` |
| Key Publications, Conference Presentations (referaty/postery) | `publikacje.html` | `en/publications.html` | `.publication-wrapper` | `.publication-cover` |
| Grants and Research Projects (duże projekty), Conference and Event Organization | `projekty.html` | `en/projects.html` | `.project-wrapper` | `.project-logo` |
| (książki/filmy polecane — nie ma odpowiednika w CV.md) | `rekomendacje.html` | `en/recommendations.html` | `.publication-wrapper` | `.publication-cover` |
| (podstrony "Zajęcia") | `zajecia.html` | `en/classes.html` | — | — |
| (strona główna) | `index.html` | `en.html` | — | — |

Każda z tych stron ma tę samą architekturę: `.main_content.list-layout` → `.scroll-list-container` → `.scroll-list` → seria `.list-item[data-category="..."]`. Przyciski filtrowania nad listą (`.filter-btn[data-filter="..."]`) muszą zgadzać się z wartościami `data-category` używanymi w `.list-item` — **nie wymyślaj nowej kategorii bez pytania użytkownika**, bo zepsujesz filtrowanie (obsługiwane przez `js/list.js`).

Dozwolone `data-category` na dziś:
- `doswiadczenie.html`, zakładka "Działalność" (`data-panel="praca"`): `naukowe`, `dydaktyczne`, `inne`
- `doswiadczenie.html`, zakładka "Wykształcenie" (`data-panel="edukacja"`): `studia`, `podyplomowe`, `szkolenia`
- `publikacje.html`: `artykul`, `prezentacje`, `plakaty`
- `projekty.html`: `spoleczne`, `analityczne`, `badawcze` (uwaga: ta strona ma kategorie w danych, ale nie ma obecnie widocznych przycisków filtrowania — sprawdź `<div class="filter-container">` zanim założysz, że jest)
- `rekomendacje.html`: `naukowe`, `psychologiczne`, `filmy`

## Wersja angielska (en/)

Strona ma angielski odpowiednik dla każdej z głównych podstron (patrz kolumna "Odpowiednik EN" w tabeli wyżej), pod `<html lang="en">`, w plikach `en/*.html` (oraz `en.html` w katalogu głównym dla strony startowej). **Od kiedy dodano tłumaczenie, każdy nowy wpis dodany po polsku (doświadczenie, publikacja, projekt, rekomendacja) trzeba też dodać w analogicznym pliku angielskim** — to nie jest opcjonalne rozszerzenie, tylko stały obowiązek przy edycji treści:

- Tłumaczenie przygotowuje AI (nie trzeba pytać użytkownika o angielski tekst), sięgając do CV.md, jeśli fragment stamtąd pochodzi (np. tytuły publikacji/referatów po angielsku są już w CV.md — kopiuj je dokładnie zamiast tłumaczyć od nowa).
- Nazwy własne (uczelnie, instytucje, tytuły polskich książek/filmów w `rekomendacje.html`) zostają w oryginale; ewentualny angielski glosariusz dodaj jako `<span style="font-weight:400; opacity:0.7;">(...)</span>` obok tytułu — tak jak w istniejących wpisach `en/recommendations.html`.
- `data-category` w `en/*.html` używa **tych samych identyfikatorów co po polsku** (np. `naukowe`, `dydaktyczne`, `artykul`) — tłumaczone jest tylko widoczne `data-filter`-owe etykietki przycisków, nie same wartości atrybutu.
- Ścieżki zasobów w `en/*.html` mają prefiks `../` (np. `../styles.css`, `../images/...`, `../js/list.js`), bo pliki leżą w podkatalogu `en/`.
- `doswiadczenie.html` / `en/experience.html` mają dodatkowo dwie zakładki (`.tab-switcher` / `.tab-btn` / `.tab-panel[data-panel="praca"|"edukacja"]`) — polskie etykiety to "Działalność"/"Wykształcenie", angielskie to "Work"/"Education" (same `data-tab` wewnętrznie). Nowy wpis trzeba dodać do właściwej zakładki w OBU wersjach językowych.
- Każda strona PL i jej odpowiednik EN mają wzajemny link z flagą (`.pill-logo` + `<span class="flag-icon">🇬🇧</span>` / `🇵🇱`) w nawigacji (desktop `.pill-list` i mobile `.mobile-menu-list`) — nowa podstrona wymaga tego linku w obie strony.
- Po dodaniu wpisu w obu wersjach zweryfikuj filtrowanie/zakładki na obu stronach (PL i EN) przed zgłoszeniem zadania jako zakończone.

## Szablon wpisu — doswiadczenie.html

```html
<div class="list-item" data-category="dydaktyczne">
    <div class="job-wrapper">
        <img src="images/images_experience/NAZWA.png" alt="X Logo" class="job-logo" onerror="this.style.display='none'">
        <div>
            <span class="date">Październik 2024 – Obecnie</span>
            <h3>Nazwa instytucji</h3>
            <div class="role">Stanowisko</div>
            <p>Opis obowiązków po polsku, 1-3 zdania.</p>
        </div>
    </div>
</div>
```

## Szablon wpisu — publikacje.html / rekomendacje.html

```html
<div class="list-item" data-category="artykul">
    <div class="publication-wrapper">
        <img src="images/images_publikacje/OKLADKA.png" alt="Okładka" class="publication-cover">
        <div class="publication-content">
            <span class="date">2025</span>
            <h3>Tytuł publikacji / wystąpienia</h3>
            <div class="role">Autorzy: Imię Nazwisko, Imię Nazwisko, ...</div>
            <p>Krótki opis / abstrakt po polsku.</p>
            <!-- opcjonalny link -->
            <p style="margin-top: 10px;">
                <a href="URL" target="_blank" style="color: #8ecae6; text-decoration: underline;">
                    <i class="fa-solid fa-link"></i> Link do artykułu
                </a>
            </p>
        </div>
    </div>
</div>
```

## Szablon wpisu — projekty.html

```html
<div class="list-item" data-category="spoleczne">
    <div class="project-wrapper">
        <img src="images/images_projekty/LOGO.png" alt="X Icon" class="project-logo" onerror="this.style.display='none'">
        <div>
            <span class="date">Grudzień 2025</span>
            <h3>Nazwa projektu</h3>
            <div class="role">Rola / numer grantu</div>
            <p>Opis.</p>
        </div>
    </div>
</div>
```

## Zasady ogólne

- **Kolejność**: nowy wpis dodawaj na górze `.scroll-list` (listy są ułożone od najnowszych do najstarszych).
- **Obrazy/logo**: nowe pliki trafiają do właściwego podfolderu (`images/images_experience/`, `images/images_publikacje/`, `images/images_projekty/`, `images/images_books/`), nigdy bezpośrednio do `images/`. Jeśli nie ma logo danej instytucji, albo użyj `images/logo.png` (jak w przypadku wpisu "Działalność własna"), albo zapytaj użytkownika o grafikę — nie zmyślaj/nie pobieraj obcych logo bez pytania.
- **Kompresja**: nowe zdjęcia/logo kompresuj przed dodaniem — loga wyświetlają się w ~80-90px, okładki publikacji w kilkaset px szerokości. Nie wrzucaj plików z telefonu/aparatu bez zmniejszenia (patrz commit historii tego repo, jak to zrobiono narzędziami systemowymi Windows przez PowerShell + System.Drawing, gdy nie ma ImageMagick/Pythona).
- **`onerror="this.style.display='none'"`** na obrazkach logo/ikon jest celowe — jeśli plik nie istnieje, ikonka po prostu znika zamiast pokazywać złamany obrazek. Zachowuj ten atrybut w nowych wpisach.
- **Weryfikacja**: po dodaniu wpisu sprawdź w przeglądarce, czy działa filtrowanie (`.filter-btn`) i czy obrazek się ładuje, zanim zgłosisz zadanie jako zakończone.
- **Nie zmieniaj** istniejących wpisów bez wyraźnej prośby — CV.md może się różnić od strony celowo (strona bywa skrócona/spolszczona względem pełnego CV).
