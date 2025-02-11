document.addEventListener('DOMContentLoaded', () => {
    const chatIcon = document.getElementById('chat-icon');
    const chatContainer = document.getElementById('chat-container');
    const closeBtn = document.getElementById('close-btn');
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');

    // Toggle chat visibility
    chatIcon.addEventListener('click', () => {
        chatContainer.classList.toggle('active');
    });

    closeBtn.addEventListener('click', () => {
        chatContainer.classList.remove('active');
    });

    // Close chat when clicking outside
    document.addEventListener('click', (e) => {
        if (!chatContainer.contains(e.target) && 
            !chatIcon.contains(e.target) &&
            chatContainer.classList.contains('active')) {
            chatContainer.classList.remove('active');
        }
    });

    // Add message to chat
    function addMessage(message, isUser) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
        messageDiv.innerHTML = `<p>${message}</p>`;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Send message to backend
    async function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;

        addMessage(message, true);
        userInput.value = '';

        try {
            const response = await fetch('/ask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message }),
            });
            const data = await response.json();
            addMessage(data.response, false);
        } catch (error) {
            addMessage('Sorry, I am currently unavailable. Please try again later.', false);
        }
    }

    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
});