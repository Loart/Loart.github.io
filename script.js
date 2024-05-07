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
