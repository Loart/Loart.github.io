document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('nav a[href^="#"]');

  // Function to hide all sections
  function hideAllSections() {
    sections.forEach(section => {
      section.style.display = 'none';
      section.classList.remove('active');
    });
  }

  // Function to show the selected section
  function showSection(sectionId) {
    const targetSection = document.querySelector(sectionId);
    if (targetSection) {
      hideAllSections();
      targetSection.style.display = 'block';
      targetSection.classList.add('active');
    }
  }

  // Initialize the page by showing the first section by default
  if (sections.length > 0) {
    showSection('#intro');
  }

  // Add click events to navigation links
  navLinks.forEach(link => {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      const sectionId = this.getAttribute('href');
      showSection(sectionId);
    });
  });
});
