document.addEventListener('DOMContentLoaded', () => {
    // Obsługa akordeonu (rozwijanie szczegółów)
    const experienceItems = document.querySelectorAll('.experience-item');

    experienceItems.forEach(item => {
        // Kliknięcie w nagłówek elementu (z wyłączeniem linków wewnątrz)
        item.addEventListener('click', function(e) {
            // Ignoruj kliknięcia w linki i iframe
            if(e.target.tagName === 'A' || e.target.tagName === 'IFRAME') return;

            this.classList.toggle('active-details');

            // Zmiana ikony
            const icon = this.querySelector('.toggle-icon');
            if (icon) {
                if (this.classList.contains('active-details')) {
                    icon.classList.remove('fa-plus');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-plus');
                }
            }
        });
    });
});
