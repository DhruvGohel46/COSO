document.addEventListener('DOMContentLoaded', function() {
    const messageInput = document.querySelector('.message-input');
    const sendButton = document.querySelector('.send-button');
    const messagesContainer = document.querySelector('.messages');
    const friendItems = document.querySelectorAll('.friend-item');

    // Mock data for demo purposes
    let currentChat = {
        friendId: 1,
        messages: []
    };

    // Add message history tracking
    let messageHistory = [];

    function createMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        messageDiv.innerHTML = `
            <span class="message-text">${text}</span>
            <span class="timestamp">${timeString}</span>
        `;
        
        return messageDiv;
    }

    function displayMessages() {
        // Clear current messages
        messagesContainer.innerHTML = '';
        
        // Display messages in order
        messageHistory.forEach(msg => {
            const messageDiv = createMessage(msg.text, msg.type);
            messagesContainer.appendChild(messageDiv);
        });
        
        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function sendMessage(text) {
        if (!text.trim()) return;

        // Add received message first if it's the first message
        if (messageHistory.length === 0) {
            messageHistory.push({
                text: "Hey there! How can I help you?",
                type: "received"
            });
        }

        // Add sent message to history
        messageHistory.push({
            text: text,
            type: "sent"
        });

        // Display all messages
        displayMessages();
        
        // Clear input
        messageInput.value = '';

        // Simulate received message (for demo)
        setTimeout(() => {
            const responses = [
                "Got your message!",
                "I'll get back to you soon",
                "Thanks for letting me know",
                "Okay, sounds good!"
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            
            // Add received message to history
            messageHistory.push({
                text: randomResponse,
                type: "received"
            });

            // Display updated messages
            displayMessages();
        }, 1000);
    }

    // Event Listeners
    sendButton.addEventListener('click', () => {
        sendMessage(messageInput.value);
    });

    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage(messageInput.value);
        }
    });

    // Friend selection with message history
    friendItems.forEach(item => {
        item.addEventListener('click', () => {
            // Update active friend
            friendItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            // Update chat header
            const friendName = item.querySelector('.friend-name').textContent;
            document.querySelector('.chat-title').textContent = friendName;
            
            // Clear current messages
            messagesContainer.innerHTML = '';

            // Load mock message history
            const mockHistory = [
                { text: "Hey there!", type: "received" },
                { text: "Hi! How are you?", type: "sent" }
            ];

            // Reset message history
            messageHistory = mockHistory;
            displayMessages();
        });
    });

    // Typing indicator
    let typingTimer;
    messageInput.addEventListener('input', () => {
        clearTimeout(typingTimer);
        const typingIndicator = document.querySelector('.typing-indicator');
        
        if (!typingIndicator && messageInput.value) {
            const indicator = document.createElement('div');
            indicator.className = 'typing-indicator';
            indicator.textContent = 'Typing...';
            document.querySelector('.chat-header').appendChild(indicator);
        }

        typingTimer = setTimeout(() => {
            const indicator = document.querySelector('.typing-indicator');
            if (indicator) indicator.remove();
        }, 1000);
    });

    // Focus input on page load
    messageInput.focus();
});
