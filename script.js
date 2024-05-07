document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('section');
  // Add the 'back-button' class links to the selection
  const navLinks = document.querySelectorAll('nav a[href^="#"], #portfolio a[href^="#"], #project1 a[href^="#"]');

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

  navLinks.forEach(link => {
    link.addEventListener('click', function (event) {
      event.preventDefault(); // Prevent the default behavior of navigation
      const sectionId = this.getAttribute('href');
      showSection(sectionId);
    });
  });
});
