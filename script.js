document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('nav a[href^="#"], #portfolio a[href^="#"]'); // Select links in the nav and portfolio

  function hideAllSections() {
    sections.forEach(section => {
      section.style.display = 'none'; // Make sure to hide sections this way if CSS isn't enough
      section.classList.remove('active');
    });
  }

  function showSection(sectionId) {
    const targetSection = document.querySelector(sectionId);
    if (targetSection) {
      hideAllSections();
      targetSection.style.display = 'block'; // Make sure to display the block
      targetSection.classList.add('active');
    }
  }

  // Initialize with the intro section visible
  showSection('#intro');

  navLinks.forEach(link => {
    link.addEventListener('click', function (event) {
      event.preventDefault(); // Prevent the default anchor link behavior
      const sectionId = this.getAttribute('href');
      showSection(sectionId);
    });
  });
});
