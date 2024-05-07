document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('nav a[href^="#"]');

  // Function to hide all sections
  function hideAllSections() {
    sections.forEach(section => {
      section.classList.remove('active');
    });
  }

  // Function to show the selected section
  function showSection(sectionId) {
    const targetSection = document.querySelector(sectionId);
    if (targetSection) {
      hideAllSections(); // Ensure all other sections are hidden
      targetSection.classList.add('active'); // Display the targeted section
    }
  }

  // Initialize the page by showing the intro section by default
  showSection('#intro');

  // Add click events to navigation links
  navLinks.forEach(link => {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      const sectionId = this.getAttribute('href');
      showSection(sectionId);
      window.scrollTo({ // Optional: scroll to the top of the page or to the targeted section
        top: 0,
        behavior: 'smooth'
      });
    });
  });
});
