document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('nav a[href^="#"]');

  function hideAllSections() {
    sections.forEach(section => {
      section.classList.remove('active');
      section.style.display = 'none'; // Explicitly hide sections
    });
  }

  function showSection(sectionId) {
    const targetSection = document.querySelector(sectionId);
    if (targetSection) {
      hideAllSections();
      targetSection.classList.add('active');
      targetSection.style.display = 'block'; // Explicitly show section
    }
  }

  // Initialize with the intro section visible
  showSection('#intro');

  navLinks.forEach(link => {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      showSection(this.getAttribute('href'));
    });
  });
});
