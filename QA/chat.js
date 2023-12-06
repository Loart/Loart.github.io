const inputField = document.getElementById("input");
const messagesDiv = document.getElementById("messages");

async function sendMessage() {
    const message = inputField.value;
    displayMessage(message, 'user');
    inputField.value = '';

    const response = await fetchGPT4Response(message);
    displayMessage(response, 'gpt');
}

async function fetchGPT4Response(message) {
    const response = await fetch('https://api.openai.com/v1/engines/gpt-4/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `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`
        },
        body: JSON.stringify({
            prompt: message,
            max_tokens: 150
        })
    });
    const data = await response.json();
    return data.choices[0].text.trim();
}

function displayMessage(message, sender) {
    const messageDiv = document.createElement("div");
    messageDiv.textContent = message;
    messageDiv.className = sender;
    messagesDiv.appendChild(messageDiv);
}
