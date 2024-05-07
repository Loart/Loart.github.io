document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('section');

  function hideAllSections() {
    sections.forEach(section => {
      section.style.display = 'none'; // Hide the section
      section.classList.remove('active'); // Remove active class to start transition
    });
  }

  function showSection(sectionId) {
    const targetSection = document.querySelector(sectionId);
    if (targetSection) {
      hideAllSections();
      // Set a slight delay to ensure the 'display: none' from other sections is applied first
      setTimeout(() => {
        targetSection.style.display = 'block'; // Display the section
        // Set another timeout to allow the browser to render 'display: block' before adding 'active'
        setTimeout(() => {
          targetSection.classList.add('active'); // Add active class to start the transition
        }, 20);
      }, 20);
    }
  }

  // Initialize with the intro section visible
  showSection('#intro');

  document.body.addEventListener('click', function(event) {
    let target = event.target;
    if (target.tagName !== 'A') {
      target = target.closest('A');
    }
    if (target && target.href && target.href.includes('#')) {
      event.preventDefault();
      const sectionId = target.getAttribute('href');
      showSection(sectionId);
    }
  });

});
