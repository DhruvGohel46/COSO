document.addEventListener('DOMContentLoaded', function() {
    const notificationsList = document.querySelector('.notifications-list');
    const emptyState = document.querySelector('.empty-state');

    // Sample notification data
    const notifications = [
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
    function renderNotifications() {
        notificationsList.innerHTML = '';
        
        if (notifications.length === 0) {
            emptyState.style.display = 'block';
            return;
        }

        emptyState.style.display = 'none';

        notifications.forEach(notification => {
            const notificationItem = document.createElement('div');
            notificationItem.className = `notification-item ${notification.read ? 'read' : ''}`;
            
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

            // Add event listeners for actions
            const markReadBtn = notificationItem.querySelector('.mark-read');
            const dismissBtn = notificationItem.querySelector('.dismiss');

            markReadBtn.addEventListener('click', () => {
                notification.read = !notification.read;
                markReadBtn.textContent = notification.read ? 'Mark Unread' : 'Mark Read';
                notificationItem.classList.toggle('read', notification.read);
            });

            dismissBtn.addEventListener('click', () => {
                notificationsList.removeChild(notificationItem);
                if (notificationsList.children.length === 0) {
                    emptyState.style.display = 'block';
                }
            });

            notificationsList.appendChild(notificationItem);
        });
    }

    // Initial render
    renderNotifications();
});
