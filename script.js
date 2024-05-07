document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('section');

  function hideAllSections() {
    sections.forEach(section => {
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

  // Global event listener to catch clicks on any anchor tags with href starting with #
  document.body.addEventListener('click', function(event) {
    if (event.target.tagName === 'A' && event.target.getAttribute('href').startsWith('#')) {
      event.preventDefault();
      const sectionId = event.target.getAttribute('href');
      showSection(sectionId);
    }
  });
});
