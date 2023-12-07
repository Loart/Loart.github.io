const OPENAI_API_KEY = API_KEY;
let currentChatId = null;
const chats = {};
const messageContainer = document.getElementById('messageContainer');
const txtMsg = document.getElementById('txtMsg');
const spMsg = document.getElementById('spMsg');

function OnLoad() {
    loadChats();
    if (Object.keys(chats).length === 0) {
        createNewChat();
    } else {
        switchToChat(Object.keys(chats)[0]);
    }
}

function generateChatId() {
    return Date.now().toString(); // Simple unique ID
}

function generateChatName() {
    // Implement your logic to generate a random name
    return "Random Chat Name"; // Placeholder
}

function createNewChat() {
    const chatId = generateChatId();
    const chatName = generateChatName();
    chats[chatId] = { name: chatName, messages: [] };
    addChatToList(chatId, chatName);
    switchToChat(chatId);
    saveChats();
}

function applySyntaxHighlighting(codeElement) {
    Prism.highlightElement(codeElement);
}

function detectLanguage(codeContent) {
    // Use Highlight.js to detect the language
    const result = hljs.highlightAuto(codeContent);
    return result.language;
}

function showDropdownMenu(event, chatId) {
    closeAllDropdownMenus(); // Close any already open menus

    const dropdown = document.createElement('div');
    dropdown.className = 'dropdown-menu';
 dropdown.innerHTML = `<a href="#" onclick="renameChat('${chatId}'); event.stopPropagation();">Rename</a>
                          <a href="#" onclick="deleteChat('${chatId}'); event.stopPropagation();">Delete</a>`;

    event.currentTarget.appendChild(dropdown);
    dropdown.style.display = 'block';

    // Close the dropdown if clicked outside
    window.onclick = function(event) {
        if (!event.target.matches('.three-dots-menu')) {
            closeAllDropdownMenus();
        }
    };
}

function closeAllDropdownMenus() {
    var dropdowns = document.getElementsByClassName("dropdown-menu");
    for (var i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.style.display === 'block') {
            openDropdown.style.display = 'none';
            openDropdown.parentNode.removeChild(openDropdown);
        }
    }
}

function updateChatList() {
    document.getElementById('chatListContainer').innerHTML = '';
    for (const id in chats) {
        addChatToList(id, chats[id].name);
    }
}

function renameChat(chatId) {
    const newName = prompt("Enter new chat name:");
    if (newName) {
        chats[chatId].name = newName; // Update the name in your chat data structure
        saveChats(); // Save changes
        updateChatList(); // Refresh the chat list UI
    }
}

function addChatToList(chatId, chatName) {
    const chatListContainer = document.getElementById('chatListContainer');

    // Create a div for each chat item
    const chatDiv = document.createElement('div');
    chatDiv.className = 'chat-item';

    // Create a span for the chat name
    const chatNameSpan = document.createElement('span');
    chatNameSpan.className = 'chat-name';
    chatNameSpan.textContent = chatName;

    // Append chat name span to chat div
    chatDiv.appendChild(chatNameSpan);

    // Handler for selecting chat
    chatDiv.onclick = () => switchToChat(chatId);

    // Create delete button
    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-button';
    deleteButton.textContent = 'X';
    deleteButton.onclick = (event) => {
        event.stopPropagation(); // Stop the event from bubbling up to the chat item
        if (confirm("Are you sure you want to delete this chat?")) {
            deleteChat(chatId);
        }
    };

    // Append delete button to chat div
    chatDiv.appendChild(deleteButton);

    // Finally, append the chat div to the chat list container
    chatListContainer.appendChild(chatDiv);
}


function deleteChat(chatId) {
    if (confirm("Are you sure you want to delete this chat?")) {
        delete chats[chatId];
        saveChats();
        document.getElementById('chatListContainer').innerHTML = '';
        for (const id in chats) {
            addChatToList(id, chats[id].name);
        }
        currentChatId = Object.keys(chats).length > 0 ? Object.keys(chats)[0] : null;
        updateMessageContainer();
    }
}

function switchToChat(chatId) {
    // Remove highlight from all chats
    const allChats = document.getElementsByClassName('chat-item');
    for (let i = 0; i < allChats.length; i++) {
        allChats[i].classList.remove('selected-chat');
    }

    // Highlight the selected chat
    const selectedChat = document.getElementById('chat-item-' + chatId);
    if (selectedChat) {
        selectedChat.classList.add('selected-chat');
    }

    currentChatId = chatId;
    updateMessageContainer();
}


function isCodeBlock(message) {
    // Check if the message contains triple backticks anywhere
    const containsCodeBlock = message.includes("```");
    console.log("isCodeBlock check:", containsCodeBlock, "Message:", message);
    return containsCodeBlock;
}


function extractCode(message) {
    const startOfCode = message.indexOf("```") + 3; // +3 to skip the backticks
    const endOfCode = message.lastIndexOf("```");
    const codeBlockHeader = message.substring(startOfCode, message.indexOf("\n", startOfCode)).trim();
    const language = codeBlockHeader.split(" ")[0]; // Extracts the first word as language
    const code = message.substring(message.indexOf("\n", startOfCode) + 1, endOfCode).trim();

    console.log("Extracted Language:", language);
    console.log("Extracted Code:", code);

    return { language, code };
}

function appendMessageToContainer(message, className) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${className}`;

    if (isCodeBlock(message)) {
        const { language, code } = extractCode(message);
        const pre = document.createElement('pre');
        const codeElement = document.createElement('code');
        codeElement.className = `language-${language}`;
        codeElement.textContent = code;
        pre.appendChild(codeElement);
        messageDiv.appendChild(pre);
        
        console.log("Applying Prism Highlighting to:", codeElement);
        Prism.highlightElement(codeElement);
    } else {
        messageDiv.innerHTML = message.replace(/\n/g, '<br>');
    }

    messageContainer.appendChild(messageDiv);
    messageDiv.scrollIntoView(false);
}



function updateMessageContainer() {
    messageContainer.innerHTML = '';
    const messages = chats[currentChatId]?.messages || [];
    messages.forEach((message) => {
        const className = message.startsWith("Me:") ? 'message me-message' : 'message chatgpt-message';
        appendMessageToContainer(message, className);
    });
}

function saveChats() {
    localStorage.setItem('chats', JSON.stringify(chats));
}

function loadChats() {
    const storedChats = localStorage.getItem('chats');
    if (storedChats) {
        Object.assign(chats, JSON.parse(storedChats));
        for (const chatId in chats) {
            addChatToList(chatId, chats[chatId].name);
        }
        if (currentChatId && chats[currentChatId]) {
            updateMessageContainer();
        }
    }
}

function Send() {
    const model = 'gpt-4-1106-preview';
    const question = txtMsg.value.trim();

    if (!question) {
        alert("Type in your question!");
        txtMsg.focus();
        return;
    }

    // Prepare context from the last few messages
    const numberOfContextMessages = 4; // Number of message pairs to include as context
    const chatHistory = chats[currentChatId].messages;
    const contextMessages = chatHistory.slice(-numberOfContextMessages).map(msg => {
        return {
            "role": msg.startsWith("Me:") ? "user" : "assistant",
            "content": msg.replace("Me: ", "").replace("Chat GPT: ", "")
        };
    });

    // Add your current message to the context for API request
    contextMessages.push({
        "role": "user",
        "content": question
    });

    // Add your message to the chat history and display it
    const myMessage = "Me: " + question;
    chats[currentChatId].messages.push(myMessage);
    appendMessageToContainer(myMessage, 'me-message');

    spMsg.textContent = "Chat GPT is thinking...";

    const url = "https://api.openai.com/v1/chat/completions";
    const data = {
        "model": model,
        "messages": contextMessages
    };

    fetch(url, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": "Bearer " + OPENAI_API_KEY
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        spMsg.textContent = "";

        if (data.error && data.error.message) {
            alert("Error: " + data.error.message);
        } else if (data.choices && data.choices[0]) {
            let responseContent = data.choices[0].text || data.choices[0].message?.content || "";
            responseContent = "Chat GPT: " + responseContent;

            chats[currentChatId].messages.push(responseContent);
            appendMessageToContainer(responseContent, 'message chatgpt-message');
            saveChats(); // Save the updated chat history
        }
    })
    .catch((error) => {
        alert("Error: " + error.message);
    });

    txtMsg.value = '';
}
