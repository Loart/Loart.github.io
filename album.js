document.addEventListener('DOMContentLoaded', () => {
    const allSections = document.querySelectorAll('section');
    const galleryItems = document.querySelectorAll('.gallery-item');

    function hideAllSections() {
        allSections.forEach(section => {
            section.style.display = 'none';
            section.classList.remove('active');
        });
        galleryItems.forEach(item => {
            item.style.display = 'none';
            item.classList.remove('active');
        });
    }

    function showSection(sectionId) {
        const targetSection = document.querySelector(sectionId);
        if (targetSection) {
            hideAllSections();
            targetSection.style.display = 'block';
            targetSection.classList.add('active');
        }
    }

    document.body.addEventListener('click', function (event) {
        let target = event.target;
        if (target.tagName === 'A' && target.href.includes('#')) {
            event.preventDefault();
            const sectionId = target.getAttribute('href');
            showSection(sectionId);
        }
    });
    
    showSection('#intro'); // Initialize with the intro section visible
});
