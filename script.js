document.addEventListener('DOMContentLoaded', () => {
  // Adding smooth scroll to navigation links
  const navLinks = document.querySelectorAll('nav a[href^="#"]');

  navLinks.forEach(link => {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      // Scroll to the selected section smoothly
      window.scrollTo({
        top: targetElement.offsetTop - 60, // Adjust for header height
        behavior: 'smooth'
      });
    });
  });
});
