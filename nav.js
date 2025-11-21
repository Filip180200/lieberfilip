document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. ANIMACJE PRZYCISKÓW (PILLS) ---
    const pills = document.querySelectorAll('.pill');
    
    pills.forEach(pill => {
        const circle = pill.querySelector('.hover-circle');
        const label = pill.querySelector('.pill-label');
        const labelHover = pill.querySelector('.pill-label-hover');
        
        // Obliczanie geometrii koła, żeby idealnie wypełniało przycisk
        function layout() {
            const rect = pill.getBoundingClientRect();
            const w = rect.width;
            const h = rect.height;
            
            // Matematyka obliczająca promień i pozycję koła
            const R = ((w * w) / 4 + h * h) / (2 * h);
            const D = Math.ceil(2 * R) + 2; 
            const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
            const originY = D - delta;

            // Ustawienie stylów początkowych (GSAP)
            gsap.set(circle, {
                width: D,
                height: D,
                bottom: -delta,
                xPercent: -50,
                scale: 0, // Ukryte koło
                transformOrigin: `50% ${originY}px`
            });
            
            gsap.set(label, { y: 0 });
            gsap.set(labelHover, { y: h + 10, opacity: 0 });
        }
        
        // Uruchom obliczenia
        layout();
        window.addEventListener('resize', layout);
        if(document.fonts) document.fonts.ready.then(layout);

        // Tworzenie osi czasu (Timeline) dla animacji
        const tl = gsap.timeline({ paused: true });
        
        // Definicja ruchu
        tl.to(circle, { scale: 1, duration: 0.4, ease: "power3.out" }, 0);
        tl.to(label, { y: -30, duration: 0.4, ease: "power3.out" }, 0);
        tl.fromTo(labelHover, 
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.4, ease: "power3.out" }, 
        0);

        // Obsługa myszki
        pill.addEventListener('mouseenter', () => tl.play());
        pill.addEventListener('mouseleave', () => tl.reverse());
    });

    // --- 2. ANIMACJA LOGO ---
    const logoLink = document.querySelector('.pill-logo');
    if (logoLink) {
        const logoImg = logoLink.querySelector('img');
        logoLink.addEventListener('mouseenter', () => {
            gsap.to(logoImg, { rotation: 360, duration: 0.4, ease: "power2.out" });
        });
        logoLink.addEventListener('mouseleave', () => {
            gsap.to(logoImg, { rotation: 0, duration: 0.4, ease: "power2.out" });
        });
    }

    // --- 3. MENU MOBILNE ---
    const hamburger = document.querySelector('.mobile-menu-button');
    const mobileMenu = document.querySelector('.mobile-menu-popover');
    const mobileLinks = document.querySelectorAll('.mobile-menu-link');
    const lines = document.querySelectorAll('.hamburger-line');
    let isMenuOpen = false;

    if (hamburger && mobileMenu) {
        gsap.set(mobileMenu, { display: "none", scaleY: 0, opacity: 0 });

        hamburger.addEventListener('click', () => {
            isMenuOpen = !isMenuOpen;
            
            if (isMenuOpen) {
                // Otwieranie
                gsap.to(lines[0], { rotation: 45, y: 3, duration: 0.3 });
                gsap.to(lines[1], { rotation: -45, y: -3, duration: 0.3 });
                
                gsap.set(mobileMenu, { display: "block", visibility: "visible" });
                gsap.to(mobileMenu, { scaleY: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" });
            } else {
                // Zamykanie
                gsap.to(lines[0], { rotation: 0, y: 0, duration: 0.3 });
                gsap.to(lines[1], { rotation: 0, y: 0, duration: 0.3 });
                
                gsap.to(mobileMenu, { 
                    scaleY: 0, opacity: 0, duration: 0.3, ease: "power2.in",
                    onComplete: () => gsap.set(mobileMenu, { display: "none" })
                });
            }
        });
        
        // Zamykanie po kliknięciu linku w menu
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                isMenuOpen = false;
                gsap.to(lines[0], { rotation: 0, y: 0 });
                gsap.to(lines[1], { rotation: 0, y: 0 });
                gsap.to(mobileMenu, { scaleY: 0, opacity: 0, onComplete: () => gsap.set(mobileMenu, { display: "none" }) });
            });
        });
    }
});