// background.js

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('squares-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // ==========================================
    // KONFIGURACJA (Tu edytuj wygląd)
    // ==========================================
    const config = {
        direction: 'diagonal', // 'up', 'down', 'left', 'right', 'diagonal'
        speed: 0.5,
        borderColor: '#333',   // Kolor linii (ciemny szary)
        squareSize: 40,        // Wielkość kratek
        hoverFillColor: '#222' // Kolor podświetlenia po najechaniu
    };
    // ==========================================

    let gridOffset = { x: 0, y: 0 };
    let mouse = { x: null, y: null };
    let requestRef = null;

    // Dopasowanie rozmiaru canvasu do okna
    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Rysowanie siatki
    const drawGrid = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const startX = Math.floor(gridOffset.x / config.squareSize) * config.squareSize;
        const startY = Math.floor(gridOffset.y / config.squareSize) * config.squareSize;

        for (let x = startX; x < canvas.width + config.squareSize; x += config.squareSize) {
            for (let y = startY; y < canvas.height + config.squareSize; y += config.squareSize) {
                const squareX = x - (gridOffset.x % config.squareSize);
                const squareY = y - (gridOffset.y % config.squareSize);

                // Sprawdzenie czy myszka jest nad kwadratem
                if (
                    mouse.x !== null &&
                    mouse.x >= squareX &&
                    mouse.x < squareX + config.squareSize &&
                    mouse.y >= squareY &&
                    mouse.y < squareY + config.squareSize
                ) {
                    ctx.fillStyle = config.hoverFillColor;
                    ctx.fillRect(squareX, squareY, config.squareSize, config.squareSize);
                }

                ctx.strokeStyle = config.borderColor;
                ctx.lineWidth = 1; // Grubość linii
                ctx.strokeRect(squareX, squareY, config.squareSize, config.squareSize);
            }
        }

        // Opcjonalny gradient na wierzchu (winieta), żeby rogi były ciemniejsze
        // Jeśli nie chcesz przyciemniania, usuń ten fragment poniżej
        const gradient = ctx.createRadialGradient(
            canvas.width / 2, canvas.height / 2, 0,
            canvas.width / 2, canvas.height / 2, Math.sqrt(canvas.width ** 2 + canvas.height ** 2) / 2
        );
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0)'); // Środek przezroczysty
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.8)'); // Rogi czarne
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    // Logika animacji
    const updateAnimation = () => {
        const effectiveSpeed = Math.max(config.speed, 0.1);

        switch (config.direction) {
            case 'right':
                gridOffset.x = (gridOffset.x - effectiveSpeed + config.squareSize) % config.squareSize;
                break;
            case 'left':
                gridOffset.x = (gridOffset.x + effectiveSpeed + config.squareSize) % config.squareSize;
                break;
            case 'up':
                gridOffset.y = (gridOffset.y + effectiveSpeed + config.squareSize) % config.squareSize;
                break;
            case 'down':
                gridOffset.y = (gridOffset.y - effectiveSpeed + config.squareSize) % config.squareSize;
                break;
            case 'diagonal':
                gridOffset.x = (gridOffset.x - effectiveSpeed + config.squareSize) % config.squareSize;
                gridOffset.y = (gridOffset.y - effectiveSpeed + config.squareSize) % config.squareSize;
                break;
        }

        drawGrid();
        requestRef = requestAnimationFrame(updateAnimation);
    };

    // Obsługa myszki
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Start animacji
    requestRef = requestAnimationFrame(updateAnimation);
});