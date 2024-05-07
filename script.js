document.addEventListener('DOMContentLoaded', () => {
  const main = document.querySelector('main'); // Delegate from the main element

  function hideAllSections() {
    document.querySelectorAll('section').forEach(section => {
      section.style.display = 'none';
      section.classList.remove('active');
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

  // Initialize with the intro section visible
  showSection('#intro');

  main.addEventListener('click', function (event) {
    const target = event.target;
    if (target.tagName === 'A' && target.getAttribute('href').startsWith('#')) {
      event.preventDefault(); // Prevent the default behavior of navigation
      const sectionId = target.getAttribute('href');
      showSection(sectionId);
    }
  });
});
