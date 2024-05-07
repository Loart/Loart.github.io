function copyCode() {
  // Select the code text
  const code = document.querySelector('#project1 .code-block pre code').textContent;
  // Create a temporary textarea element to utilize the execCommand method
  const textarea = document.createElement('textarea');
  textarea.textContent = code;
  document.body.appendChild(textarea);
  textarea.select(); // Select the text
  document.execCommand('copy'); // Copy the text
  textarea.remove(); // Remove the temporary element
  alert('Code copied to clipboard!'); // Notify the user
}
