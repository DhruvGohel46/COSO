// Main initialization function - runs when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {

    // Get references to DOM elements
    const notificationsList = document.querySelector('.notifications-list');

    const emptyState = document.querySelector('.empty-state'); // Empty state message element


    // Sample notification data (would typically come from an API)

    const notifications = [ // Array of notification objects

        {
            type: 'friend-request',
            message: 'You have a new friend request from User1',
            time: '10 minutes ago',
            read: false
        },
        {
            type: 'message',
            message: 'You have a new message from User2',
            time: '1 hour ago',
            read: false
        },
        {
            type: 'update',
            message: 'New features are available!',
            time: '2 hours ago',
            read: true
        }
    ];

    // Render notifications
    // Function to render notifications in the UI
    function renderNotifications() {

        notificationsList.innerHTML = ''; // Clear existing notifications

        
        // Show empty state if no notifications
        if (notifications.length === 0) {

            emptyState.style.display = 'block';
            return;
        }

        emptyState.style.display = 'none'; // Hide empty state if notifications exist


        // Loop through notifications and create DOM elements
        notifications.forEach(notification => {

            // Create notification item container
            const notificationItem = document.createElement('div');

            // Set class based on read status
            notificationItem.className = `notification-item ${notification.read ? 'read' : ''}`;

            
            // Notification item HTML template
            notificationItem.innerHTML = `

                <div class="notification-icon"></div>
                <div class="notification-content">
                    <p class="notification-message">${notification.message}</p>
                    <p class="notification-time">${notification.time}</p>
                </div>
                <div class="notification-actions">
                    <button class="mark-read">${notification.read ? 'Mark Unread' : 'Mark Read'}</button>
                    <button class="dismiss">Dismiss</button>
                </div>
            `;

            // Add event listeners for notification actions

            // Get reference to mark read/unread button
            const markReadBtn = notificationItem.querySelector('.mark-read');

            // Get reference to dismiss button
            const dismissBtn = notificationItem.querySelector('.dismiss');


            // Handle mark read/unread click
            markReadBtn.addEventListener('click', () => {

                notification.read = !notification.read; // Toggle read status

                markReadBtn.textContent = notification.read ? 'Mark Unread' : 'Mark Read'; // Update button text

                notificationItem.classList.toggle('read', notification.read); // Update visual state

            });

            // Handle dismiss click
            dismissBtn.addEventListener('click', () => {

                notificationsList.removeChild(notificationItem); // Remove notification from DOM

                // Show empty state if no notifications left
                if (notificationsList.children.length === 0) {

                    emptyState.style.display = 'block'; // Show empty state message

                }
            });

            notificationsList.appendChild(notificationItem); // Add notification to list

        });
    }

    // Initial render of notifications

    renderNotifications();
});
