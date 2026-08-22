document.addEventListener("DOMContentLoaded", () => {
    
    const list = document.querySelector('.scroll-list');
    if (!list) return;

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

    function sortListItems() {
        const items = Array.from(document.querySelectorAll('.list-item'));

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

    // Wykonaj sortowanie
    sortListItems();


    // --- 2. ANIMACJE WEJŚCIA ---
    const observerOptions = { root: list, threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, observerOptions);

    function refreshAnimations() {
        const visibleItems = document.querySelectorAll('.list-item:not(.hidden)');
        visibleItems.forEach((item, index) => {
            item.classList.remove('in-view');
            item.style.transitionDelay = `${index * 0.05}s`;
            observer.observe(item);
            setTimeout(() => item.classList.add('in-view'), 50);
        });
    }
    refreshAnimations();


    // --- 3. FILTROWANIE ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const selectedCategory = btn.getAttribute('data-filter');
            const allItems = document.querySelectorAll('.list-item');

            allItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                if (selectedCategory === 'all' || itemCategory === selectedCategory) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                    item.classList.remove('in-view');
                }
            });
            setTimeout(() => refreshAnimations(), 10);
        });
    });

    // --- 4. GRADIENTY ---
    const topGrad = document.querySelector('.list-gradient-top');
    const botGrad = document.querySelector('.list-gradient-bottom');
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