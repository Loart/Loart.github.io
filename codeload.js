document.addEventListener('DOMContentLoaded', function() {
  // Select all code blocks that have a 'data-src' attribute
  document.querySelectorAll('code[data-src]').forEach(codeBlock => {
    const fileToLoad = codeBlock.getAttribute('data-src');  // Get the file path from the data-src attribute
    fetch(fileToLoad)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then(data => {
        codeBlock.textContent = data;  // Load the fetched data into the code block
        if (typeof Prism !== 'undefined') {
          Prism.highlightAllUnder(codeBlock.parentElement);
        }
      })
      .catch(error => {
        console.error('Error loading the script:', error);
        codeBlock.textContent = 'Failed to load the code.';
      });
  });
});

