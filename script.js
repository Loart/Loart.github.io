document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('nav a[href^="#"]');

  function hideAllSections() {
    sections.forEach(section => {
      section.classList.remove('active');
    });
  }

  function showSection(sectionId) {
    const targetSection = document.querySelector(sectionId);
    if (targetSection) {
      hideAllSections();
      targetSection.classList.add('active');
    }
  }

  // Show the first section by default
  showSection('#intro');

  // Add click events to navigation links
  navLinks.forEach(link => {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      const sectionId = this.getAttribute('href');
      showSection(sectionId);
    });
  });
});
