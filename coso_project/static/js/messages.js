document.addEventListener('DOMContentLoaded', function() {
    const messageInput = document.querySelector('.message-input');
    const sendButton = document.querySelector('.send-button');
    const messagesContainer = document.querySelector('.messages');
    const friendItems = document.querySelectorAll('.friend-item');
    const searchInput = document.querySelector('.search-bar');
    const container = document.querySelector('.container');
    const chatHeader = document.querySelector('.chat-header');
    const chatArea = document.querySelector('.chat-area');

    // Create back button for mobile view
    const backButton = document.createElement('button');
    backButton.className = 'back-button';
    backButton.innerHTML = '&larr;';
    backButton.setAttribute('aria-label', 'Back to contacts');
    chatHeader.insertBefore(backButton, chatHeader.firstChild);

    // Mock data for conversations
    const conversations = {
        'John Doe': [
            { text: "Hey, how are you?", type: "received", timestamp: "10:00 AM" },
            { text: "I'm good, thanks! How about you?", type: "sent", timestamp: "10:01 AM" }
        ],
        'Jane Smith': [
            { text: "Did you finish the assignment?", type: "received", timestamp: "Yesterday" },
            { text: "Almost done! Just need to review it once more.", type: "sent", timestamp: "Yesterday" },
            { text: "Great! Let me know when you submit it.", type: "received", timestamp: "Yesterday" }
        ],
        'Mike Johnson': [
            { text: "Are you coming to the study group tonight?", type: "received", timestamp: "2 days ago" },
            { text: "Yes, I'll be there. What time does it start?", type: "sent", timestamp: "2 days ago" },
            { text: "7 PM at the library.", type: "received", timestamp: "2 days ago" },
            { text: "Perfect, see you there!", type: "sent", timestamp: "2 days ago" }
        ]
    };

    // Current active conversation
    let currentFriend = 'John Doe';
    let currentMessages = [...conversations[currentFriend]];

    // Function to create a message element
    function createMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${message.type}`;
        
        messageDiv.innerHTML = `
            <span class="message-text">${message.text}</span>
            <span class="timestamp">${message.timestamp || getCurrentTime()}</span>
        `;
        
        return messageDiv;
    }

    // Get current time formatted
    function getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    // Display messages for the current conversation
    function displayMessages(friendName) {
        // Clear current messages
        messagesContainer.innerHTML = '';
        
        // Update chat header
        document.querySelector('.chat-title').textContent = friendName;
        
        // Get messages for this friend
        const messages = conversations[friendName] || [];
        
        // Display messages
        messages.forEach(msg => {
            const messageDiv = createMessage(msg);
            messagesContainer.appendChild(messageDiv);
        });
        
        // Scroll to bottom
        scrollToBottom();
    }

    // Scroll messages container to bottom
    function scrollToBottom() {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Send a new message
    function sendMessage(text) {
        if (!text.trim()) return;

        const now = getCurrentTime();
        
        // Add message to current conversation
        const newMessage = {
            text: text,
            type: "sent",
            timestamp: now
        };
        
        conversations[currentFriend].push(newMessage);
        
        // Add message to display
        const messageDiv = createMessage(newMessage);
        messagesContainer.appendChild(messageDiv);
        
        // Scroll to bottom
        scrollToBottom();
        
        // Clear input
        messageInput.value = '';
        
        // Simulate received message (for demo)
        showTypingIndicator();
        
        setTimeout(() => {
            hideTypingIndicator();
            
            // Random responses based on the current friend
            const responses = {
                'John Doe': [
                    "I'm doing great! What are you up to today?",
                    "Been busy with classes, how about you?",
                    "Just finished my project, finally!"
                ],
                'Jane Smith': [
                    "Let me know when you submit it, I need to compare notes.",
                    "Don't forget the deadline is tomorrow!",
                    "Thanks for the update!"
                ],
                'Mike Johnson': [
                    "Perfect! I'll bring the notes.",
                    "Don't be late this time!",
                    "We'll be in the main study room."
                ]
            };
            
            const friendResponses = responses[currentFriend] || responses['John Doe'];
            const randomResponse = friendResponses[Math.floor(Math.random() * friendResponses.length)];
            
            const responseMessage = {
                text: randomResponse,
                type: "received",
                timestamp: getCurrentTime()
            };
            
            conversations[currentFriend].push(responseMessage);
            
            const responseDiv = createMessage(responseMessage);
            messagesContainer.appendChild(responseDiv);
            
            scrollToBottom();
        }, 1500);
    }

    // Show typing indicator
    function showTypingIndicator() {
        if (!document.querySelector('.typing-indicator')) {
            const indicator = document.createElement('div');
            indicator.className = 'typing-indicator';
            indicator.textContent = currentFriend + ' is typing...';
            document.querySelector('.chat-header').appendChild(indicator);
        }
    }

    // Hide typing indicator
    function hideTypingIndicator() {
        const indicator = document.querySelector('.typing-indicator');
        if (indicator) indicator.remove();
    }

    // Switch to a different conversation
    function switchConversation(friendName) {
        currentFriend = friendName;
        displayMessages(friendName);
        
        // Update active friend in the sidebar
        friendItems.forEach(item => {
            const itemName = item.querySelector('.friend-name').textContent;
            if (itemName === friendName) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
        
        // On mobile, show chat and hide sidebar
        if (window.innerWidth <= 768) {
            container.classList.add('chat-active');
            
            // Focus input field after switching
            setTimeout(() => {
                messageInput.focus();
            }, 300); // After the transition
        }
    }

    // Filter friends list based on search
    function filterFriends(query) {
        const normalizedQuery = query.toLowerCase().trim();
        
        friendItems.forEach(item => {
            const friendName = item.querySelector('.friend-name').textContent.toLowerCase();
            if (normalizedQuery === '' || friendName.includes(normalizedQuery)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }

    // Handle back button (mobile)
    backButton.addEventListener('click', function() {
        container.classList.remove('chat-active');
    });

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

    // Friend selection
    friendItems.forEach(item => {
        item.addEventListener('click', () => {
            const friendName = item.querySelector('.friend-name').textContent;
            switchConversation(friendName);
        });
    });

    // Search functionality
    searchInput.addEventListener('input', () => {
        filterFriends(searchInput.value);
    });

    // Check screen size on resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            // Reset layout for desktop view
            container.classList.remove('chat-active');
        }
    });

    // Initialize - desktop shows first friend, mobile shows contacts
    if (window.innerWidth > 768) {
        displayMessages(currentFriend);
    }
});