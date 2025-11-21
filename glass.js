document.addEventListener("DOMContentLoaded", () => {
    const target = document.querySelector('.main_content');
    if (!target) return;

    // Konfiguracja efektu (możesz tu zmieniać parametry)
    const config = {
        borderRadius: 50,   // Musi pasować do border-radius w CSS
        borderWidth: 0.07,
        brightness: 50,
        opacity: 0.93,
        blur: 11,
        displace: 0.7 // Siła zniekształcenia
    };

    // Sprawdzenie wsparcia przeglądarki (Safari/Firefox słabo radzą sobie z filtrami SVG w backdropie)
    const isWebkit = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
    const isFirefox = /Firefox/.test(navigator.userAgent);
    const supportsSVG = !(isWebkit || isFirefox);

    if (!supportsSVG) {
        target.classList.add('glass-fallback');
        return;
    }

    target.classList.add('glass-active');

    // Generowanie unikalnych ID
    const uniqueId = Math.random().toString(36).substr(2, 9);
    const filterId = `glass-filter-${uniqueId}`;
    const redGradId = `red-grad-${uniqueId}`;
    const blueGradId = `blue-grad-${uniqueId}`;

    // Struktura SVG Filtra
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.classList.add("glass-svg-hidden");
    
    svg.innerHTML = `
        <defs>
            <filter id="${filterId}" color-interpolation-filters="sRGB" x="0%" y="0%" width="100%" height="100%">
                <feImage id="fe-map-${uniqueId}" result="map" preserveAspectRatio="none" />
                <feDisplacementMap in="SourceGraphic" in2="map" scale="-180" xChannelSelector="R" yChannelSelector="G" result="dispRed" />
                <feDisplacementMap in="SourceGraphic" in2="map" scale="-170" xChannelSelector="R" yChannelSelector="G" result="dispGreen" />
                <feDisplacementMap in="SourceGraphic" in2="map" scale="-160" xChannelSelector="R" yChannelSelector="G" result="dispBlue" />
                
                <feColorMatrix in="dispRed" type="matrix" values="1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" result="red" />
                <feColorMatrix in="dispGreen" type="matrix" values="0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 1 0" result="green" />
                <feColorMatrix in="dispBlue" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 1 0" result="blue" />
                
                <feBlend in="red" in2="green" mode="screen" result="rg" />
                <feBlend in="rg" in2="blue" mode="screen" result="output" />
                <feGaussianBlur in="output" stdDeviation="${config.displace}" />
            </filter>
        </defs>
    `;
    
    document.body.appendChild(svg);
    target.style.backdropFilter = `url(#${filterId})`;

    // Funkcja generująca mapę przemieszczeń (Displacement Map)
    const updateMap = () => {
        const rect = target.getBoundingClientRect();
        const w = rect.width || 400;
        const h = rect.height || 200;
        const edgeSize = Math.min(w, h) * (config.borderWidth * 0.5);

        const svgContent = `
            <svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="${redGradId}" x1="100%" y1="0%" x2="0%" y2="0%">
                        <stop offset="0%" stop-color="#0000"/>
                        <stop offset="100%" stop-color="red"/>
                    </linearGradient>
                    <linearGradient id="${blueGradId}" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stop-color="#0000"/>
                        <stop offset="100%" stop-color="blue"/>
                    </linearGradient>
                </defs>
                <rect x="0" y="0" width="${w}" height="${h}" fill="black"></rect>
                <rect x="0" y="0" width="${w}" height="${h}" rx="${config.borderRadius}" fill="url(#${redGradId})" />
                <rect x="0" y="0" width="${w}" height="${h}" rx="${config.borderRadius}" fill="url(#${blueGradId})" style="mix-blend-mode: difference" />
                <rect x="${edgeSize}" y="${edgeSize}" width="${w - edgeSize * 2}" height="${h - edgeSize * 2}" rx="${config.borderRadius}" fill="hsl(0 0% ${config.brightness}% / ${config.opacity})" style="filter:blur(${config.blur}px)" />
            </svg>
        `;
        
        const dataURI = `data:image/svg+xml,${encodeURIComponent(svgContent)}`;
        const feImage = document.getElementById(`fe-map-${uniqueId}`);
        if(feImage) feImage.setAttribute('href', dataURI);
    };

    // Obserwowanie zmiany rozmiaru okna
    const resizeObserver = new ResizeObserver(() => {
        requestAnimationFrame(updateMap);
    });
    resizeObserver.observe(target);
    updateMap();
});