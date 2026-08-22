# lieberfilip.pl

Strona osobista Filipa Liebersbacha — psychologa, asystenta dydaktycznego i analityka danych. Statyczna strona HTML/CSS/JS bez procesu budowania, hostowana na GitHub Pages pod domeną `lieberfilip.pl` (patrz plik `CNAME`).

## Styl

Ciemny motyw glassmorphism: font Montserrat, tło `#111` z animowaną siatką kwadratów (`js/background.js` rysujący na `<canvas id="squares-canvas">`), zaokrąglony pill-nav w nagłówku obsługiwany przez `js/nav.js` (GSAP z CDN), karty treści w klasie `.glass-effect`. Wspólne style w `styles.css`.

## Struktura repo

```
index.html, doswiadczenie.html, projekty.html,      - główne podstrony wizytówki (menu główne)
publikacje.html, rekomendacje.html, kontakt.html

zajecia.html                                        - hub podstron z menu "Zajęcia"
zajecia/                                             - materiały dydaktyczne, Dixit, przydatne linki
  statystyka/                                        - podsekcja "Statystyka": kalkulator opisowy,
                                                        interaktywny wybór testu statystycznego,
                                                        szczegółowe porównania testów (wybory/)

narzedzia/                                           - samodzielne aplikacje dla innych odbiorców
                                                        (poza głównym menu, np. PubQuiz dla EFPSA)

styles.css                                           - wspólne style całej strony
js/                                                  - wspólne skrypty:
  background.js                                        animowane tło (siatka kwadratów)
  nav.js                                                pill-nav + menu mobilne (GSAP)
  list.js                                               filtrowanie/animacja list (doświadczenie, projekty...)

images/                                              - obrazy współdzielone (logo, zdjęcie profilowe, tło)
  images_books/, images_experience/,                   oraz podfoldery ze zdjęciami do poszczególnych
  images_projekty/, images_publikacje/,                sekcji wizytówki i kart gry Dixit
  images_dixit/
```

Każda podstrona jest samodzielnym plikiem `.html` — brak frameworka i procesu budowania, więc ścieżki do zasobów (`styles.css`, `images/`, `js/`) są względne i zależą od głębokości folderu danego pliku.

## Uruchomienie lokalne

To statyczna strona — wystarczy dowolny serwer plików. Repo ma skonfigurowany port dla rozszerzenia Live Server w VS Code (`.vscode/settings.json`, port 5511), albo można użyć np.:

```bash
npx serve .
```

## Wdrożenie

Strona jest hostowana na GitHub Pages i wpięta pod własną domenę przez plik `CNAME` (`lieberfilip.pl`). Wypchnięcie zmian na branch `main` publikuje je automatycznie.
