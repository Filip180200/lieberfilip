document.addEventListener("DOMContentLoaded", () => {

    const lists = document.querySelectorAll('.scroll-list');
    if (!lists.length) return;

    // --- 1. KONFIGURACJA DAT I SORTOWANIE ---

    const monthsMap = {
        'styczeń': 0, 'stycznia': 0, 'luty': 1, 'lutego': 1, 'marzec': 2, 'marca': 2,
        'kwiecień': 3, 'kwietnia': 3, 'maj': 4, 'maja': 4, 'czerwiec': 5, 'czerwca': 5,
        'lipiec': 6, 'lipca': 6, 'sierpień': 7, 'sierpnia': 7, 'wrzesień': 8, 'września': 8,
        'październik': 9, 'października': 9, 'listopad': 10, 'listopada': 10, 'grudzień': 11, 'grudnia': 11
    };

    function parseDateFromText(text) {
        const cleanText = text.toLowerCase().trim();
        const monthYearRegex = /([a-ząćęłńóśźż]+)\s+(\d{4})/;
        const matchMonthYear = cleanText.match(monthYearRegex);

        if (matchMonthYear) {
            const monthName = matchMonthYear[1];
            const year = parseInt(matchMonthYear[2]);
            const monthIndex = monthsMap[monthName] !== undefined ? monthsMap[monthName] : 0;
            return new Date(year, monthIndex);
        }

        const yearRegex = /(\d{4})/;
        const matchYear = cleanText.match(yearRegex);
        if (matchYear) {
            return new Date(parseInt(matchYear[1]), 0);
        }
        return new Date(1970, 0, 1);
    }

    // Sortuje jedna, konkretna liste (kazdy .scroll-list na stronie jest niezalezny)
    function sortListItems(list) {
        const items = Array.from(list.querySelectorAll('.list-item'));

        items.sort((a, b) => {
            const dateTextA = a.querySelector('.date').textContent.toLowerCase();
            const dateTextB = b.querySelector('.date').textContent.toLowerCase();

            // 1. PRIORYTET: "OBECNIE"
            const isCurrentA = dateTextA.includes('obecnie');
            const isCurrentB = dateTextB.includes('obecnie');

            if (isCurrentA && !isCurrentB) return -1; // A idzie na górę
            if (!isCurrentA && isCurrentB) return 1;  // B idzie na górę

            // 2. SORTOWANIE PO DACIE (Malejąco)
            const dateA = parseDateFromText(dateTextA);
            const dateB = parseDateFromText(dateTextB);

            return dateB - dateA;
        });

        list.innerHTML = '';
        items.forEach(item => list.appendChild(item));
    }

    lists.forEach(sortListItems);

    // --- 2. ANIMACJE WEJŚCIA (osobny obserwator per lista) ---

    const refreshFns = new Map();

    lists.forEach(list => {
        const observerOptions = { root: list, threshold: 0.1 };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                }
            });
        }, observerOptions);

        function refreshAnimations() {
            const visibleItems = list.querySelectorAll('.list-item:not(.hidden)');
            visibleItems.forEach((item, index) => {
                item.classList.remove('in-view');
                item.style.transitionDelay = `${index * 0.05}s`;
                observer.observe(item);
                setTimeout(() => item.classList.add('in-view'), 50);
            });
        }

        refreshFns.set(list, refreshAnimations);
        refreshAnimations();
    });

    // --- 3. FILTROWANIE (kazdy .filter-container dziala tylko na liste w swoim zakresie) ---

    function scopeOf(el) {
        // Zasieg filtrowania: najblizszy .tab-panel, a jesli go nie ma - najblizszy .main_content
        return el.closest('.tab-panel') || el.closest('.main_content') || document;
    }

    document.querySelectorAll('.filter-container').forEach(container => {
        const scope = scopeOf(container);
        const scopedList = scope.querySelector('.scroll-list');
        const btns = container.querySelectorAll('.filter-btn');

        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                btns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const selectedCategory = btn.getAttribute('data-filter');
                const items = scope.querySelectorAll('.list-item');

                items.forEach(item => {
                    const itemCategory = item.getAttribute('data-category');
                    if (selectedCategory === 'all' || itemCategory === selectedCategory) {
                        item.classList.remove('hidden');
                    } else {
                        item.classList.add('hidden');
                        item.classList.remove('in-view');
                    }
                });

                if (scopedList) {
                    setTimeout(() => refreshFns.get(scopedList)?.(), 10);
                }
            });
        });
    });

    // --- 4. ZAKLADKI (opcjonalne - np. Praca / Edukacja na doswiadczenie.html) ---

    const tabBtns = document.querySelectorAll('.tab-btn');
    if (tabBtns.length) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const target = btn.getAttribute('data-tab');
                document.querySelectorAll('.tab-panel').forEach(panel => {
                    panel.classList.toggle('active', panel.getAttribute('data-panel') === target);
                });

                const shownList = document.querySelector(`.tab-panel[data-panel="${target}"] .scroll-list`);
                if (shownList) {
                    setTimeout(() => refreshFns.get(shownList)?.(), 10);
                }
            });
        });
    }

    // --- 5. GRADIENTY ---

    lists.forEach(list => {
        const container = list.closest('.scroll-list-container') || list.parentElement;
        const topGrad = container ? container.querySelector('.list-gradient-top') : null;
        const botGrad = container ? container.querySelector('.list-gradient-bottom') : null;
        if (topGrad && botGrad) {
            const handleScroll = () => {
                const scrollTop = list.scrollTop;
                const scrollHeight = list.scrollHeight;
                const clientHeight = list.clientHeight;
                const distanceToBottom = scrollHeight - (scrollTop + clientHeight);
                topGrad.style.opacity = Math.min(scrollTop / 50, 1);
                botGrad.style.opacity = distanceToBottom <= 10 ? 0 : 1;
            };
            list.addEventListener('scroll', handleScroll);
            handleScroll();
        }
    });
});
