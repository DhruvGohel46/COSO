document.addEventListener('DOMContentLoaded', function() {
    // Search functionality
    const searchBar = document.getElementById('search-bar');
    if (searchBar) {
        searchBar.addEventListener('input', function() {
            // Search implementation
        });
    }

    // Events Section Functionality
    const eventsSection = document.getElementById('events');
    if (eventsSection) {
        // Add Intersection Observer for animations
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe each event card
        const eventCards = document.querySelectorAll('.event-card');
        eventCards.forEach(card => {
            observer.observe(card);
        });

        // Handle CTA button clicks
        const ctaButtons = document.querySelectorAll('.event-card .cta-button');
        ctaButtons.forEach(button => {
            button.addEventListener('click', function(event) {
                event.preventDefault();
                // Handle button click (e.g., redirect to event page)
                const eventTitle = this.closest('.event-card').querySelector('h3').textContent;
                console.log(`Registering for event: ${eventTitle}`);
                // Add actual registration logic here
            });
        });
    }
});
