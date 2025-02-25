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
            time: '2 minutes ago',
            read: false
        },
        {
            type: 'friend-request', 
            message: 'You have a new friend request from User2',
            time: '5 mins ago',
            read: false
        },
        {
            type: 'friend-request', 
            message: 'You have a new friend request from User3',
            time: '10 min ago',
            read: false
        },
        {
            type: 'friend-request', 
            message: 'You have a new friend request from User4',
            time: '1 hour ago',
            read: false
        },
        {
            type: 'friend-request', 
            message: 'You have a new friend request from User5',
            time: '2 hours ago',
            read: false
        }
    ];


    // Add event listeners for navigation icons
    const homeIcon = document.querySelector('nav a[href="index.html"]');
    const messagesIcon = document.querySelector('nav a[href="messages.html"]');
    const notificationsIcon = document.querySelector('nav a[href="notifications.html"]');
    const profileIcon = document.querySelector('nav a[href="profile.html"]');

    homeIcon.addEventListener('click', function(event) {
        event.preventDefault();
        window.location.href = 'index.html';
    });

    messagesIcon.addEventListener('click', function(event) {
        event.preventDefault();
        window.location.href = 'messages.html';
    });

    notificationsIcon.addEventListener('click', function(event) {
        event.preventDefault();
        window.location.href = 'notifications.html';
    });

    profileIcon.addEventListener('click', function(event) {
        event.preventDefault();
        window.location.href = 'profile.html';
    });

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
                    ${notification.type === 'friend-request' ? 
                    `<button class="accept-btn">Accept</button>
                     <button class="reject-btn">Reject</button>` : 
                    ''}
                </div>

            `;

            // Add event listeners for notification actions

            // Handle friend request actions
            if (notification.type === 'friend-request') {
                const acceptBtn = notificationItem.querySelector('.accept-btn');
                const rejectBtn = notificationItem.querySelector('.reject-btn');

                acceptBtn.addEventListener('click', () => {
                    // Handle friend request acceptance
                    notificationsList.removeChild(notificationItem);
                    if (notificationsList.children.length === 0) {
                        emptyState.style.display = 'block';
                    }
                });

                rejectBtn.addEventListener('click', () => {
                    // Handle friend request rejection
                    notificationsList.removeChild(notificationItem);
                    if (notificationsList.children.length === 0) {
                        emptyState.style.display = 'block';
                    }
                });
            }


            notificationsList.appendChild(notificationItem); // Add notification to list

        });
    }

    // Initial render of notifications

    renderNotifications();
});
