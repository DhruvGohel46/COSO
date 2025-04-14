import { eventsAPI, postsAPI } from './api.js'; // Import API functions

// Import college data from external file
import { collegeData } from './colleges and courses list.js';

document.addEventListener('DOMContentLoaded', async function () {
    const collegeSelect = document.getElementById('college-search');
    const courseSelect = document.getElementById('course-search');
    const yearSelect = document.getElementById('academic-year');
    const searchButton = document.getElementById('search-button');
    const searchSection = document.getElementById('search-section');
    const nameSearch = document.getElementById('name-search');
    const technicalEventsSection = document.getElementById('technical-events');
    const nonTechnicalEventsSection = document.getElementById('non-technical-events');
    const sportsEventsSection = document.getElementById('sports-events');
    const userPostsSection = document.getElementById('user-posts');
    const addEventButton = document.querySelector('a[href="add-event.html"]');

    // Initially hide the search section (only show in College Posts)
    if (searchSection) {
        searchSection.style.display = 'none';
    }

    // Populate college dropdown
    if (collegeSelect) {
        // Add default option
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Select College';
        collegeSelect.appendChild(defaultOption);

        // Add college options
        Object.keys(collegeData).forEach(college => {
            const option = document.createElement('option');
            option.value = college;
            option.textContent = college;
            collegeSelect.appendChild(option);
        });

        // Handle college selection change
        collegeSelect.addEventListener('change', function () {
            const selectedCollege = this.value;

            // Clear existing course options
            courseSelect.innerHTML = '<option value="">Select Course</option>';
            courseSelect.disabled = true;

            if (selectedCollege && collegeData[selectedCollege]) {
                // Enable course dropdown
                courseSelect.disabled = false;

                console.log('Selected College:', selectedCollege);
                console.log('Courses:', collegeData[selectedCollege]);

                // Populate course options
                collegeData[selectedCollege].forEach(course => {
                    const option = document.createElement('option');
                    option.value = course;
                    option.textContent = course;
                    courseSelect.appendChild(option);
                });
            }
        });
    }

    // Load events and posts on page load
    await loadEvents();
    await loadPosts();

    // Handle search functionality
    if (searchButton) {
        searchButton.addEventListener('click', async function () {
            const filters = {
                name: nameSearch.value,
                college: collegeSelect.value,
                course: courseSelect.value,
                year: yearSelect.value,
            };

            try {
                const events = await eventsAPI.getEvents(filters);
                displayEvents(events, technicalEventsSection, nonTechnicalEventsSection, sportsEventsSection);
            } catch (error) {
                console.error('Error fetching events:', error);
                alert('Failed to fetch events. Please try again.');
            }
        });
    }

    // Function to load events
    async function loadEvents() {
        try {
            const events = await eventsAPI.getEvents();
            displayEvents(events, technicalEventsSection, nonTechnicalEventsSection, sportsEventsSection);
        } catch (error) {
            console.error('Error loading events:', error);
        }
    }

    // Function to display events
    function displayEvents(events, technicalSection, nonTechnicalSection, sportsSection) {
        const technicalEvents = events.filter(event => event.event_type === 'Technical');
        const nonTechnicalEvents = events.filter(event => event.event_type === 'Non-Technical');
        const sportsEvents = events.filter(event => event.event_type === 'Sports');

        technicalSection.querySelector('.events-container').innerHTML = technicalEvents.map(createEventCard).join('');
        nonTechnicalSection.querySelector('.events-container').innerHTML = nonTechnicalEvents.map(createEventCard).join('');
        sportsSection.querySelector('.events-container').innerHTML = sportsEvents.map(createEventCard).join('');
    }

    // Function to create an event card
    function createEventCard(event) {
        return `
            <div class="event-card" data-event-id="${event.id}" data-category="${event.event_type.toLowerCase()}">
                <div class="flyer">
                    <img src="${event.flyer || 'placeholder.jpg'}" alt="${event.title} Flyer" class="event-flyer">
                </div>
                <div class="details">
                    <span class="category-badge ${event.event_type.toLowerCase()}">${event.event_type}</span>
                    <h3 class="event-title">${event.title}</h3>
                    <p class="event-college">${event.college_name}</p>
                </div>
            </div>
        `;
    }

    // Function to load posts
    async function loadPosts() {
        try {
            const posts = await postsAPI.getPosts();
            displayPosts(posts, userPostsSection);
        } catch (error) {
            console.error('Error loading posts:', error);
        }
    }

    // Function to display posts
    function displayPosts(posts, postsSection) {
        postsSection.innerHTML = `
            <h2>College Posts</h2>
            ${posts.map(createPostCard).join('')}
        `;
    }

    // Function to create a post card
    function createPostCard(post) {
        return `
            <div class="post-card">
                <div class="post-header">
                    <div class="post-avatar">${getInitials(post.author.full_name)}</div>
                    <div class="post-meta">
                        <div class="post-author">${post.author.full_name}</div>
                        <div class="post-details">Posted ${getTimeAgo(post.created_at)}</div>
                    </div>
                </div>
                <div class="post-content">
                    <p>${post.description}</p>
                </div>
                ${post.image ? `<img src="${post.image}" alt="" class="post-image">` : ''}
                <div class="post-actions">
                    <div class="post-action">👍 Like</div>
                    <div class="post-action">💬 Comment</div>
                    <div class="post-action">↗️ Share</div>
                </div>
            </div>
        `;
    }

    // Helper function to get initials from a name
    function getInitials(name) {
        return name.split(' ').map(word => word[0]).join('').toUpperCase();
    }

    // Helper function to calculate time ago
    function getTimeAgo(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);

        if (seconds < 60) return 'just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
        return `${Math.floor(seconds / 86400)} days ago`;
    }

    // Function to handle sidebar navigation
    function initializeSidebarNavigation() {
        const sidebarLinks = document.querySelectorAll('.sidebar-menu a');
        const sections = document.querySelectorAll('section');

        // Hide all sections except user posts initially
        sections.forEach(section => {
            if (section.id !== 'user-posts' && section.id !== 'search-section') {
                section.style.display = 'none';
            }
        });

        sidebarLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Remove active class from all links
                sidebarLinks.forEach(l => l.classList.remove('active'));
                
                // Add active class to clicked link
                link.classList.add('active');
                
                // Get the target section id
                const targetId = link.getAttribute('href').substring(1);
                
                // Hide all sections except search
                sections.forEach(section => {
                    if (section.id !== 'search-section') {
                        section.style.display = 'none';
                    }
                });
                
                // Show the target section
                if (targetId === 'user-posts') {
                    document.getElementById('user-posts').style.display = 'block';
                } else {
                    document.getElementById(targetId).style.display = 'block';
                }
            });
        });
    }

    // Initialize sidebar navigation
    initializeSidebarNavigation();

    // Function to show only the selected section
    function showOnlySection(sectionToShow) {
        // Hide all sections first
        if (technicalEventsSection) technicalEventsSection.style.display = 'none';
        if (nonTechnicalEventsSection) nonTechnicalEventsSection.style.display = 'none';
        if (sportsEventsSection) sportsEventsSection.style.display = 'none';
        if (userPostsSection) userPostsSection.style.display = 'none';
        if (searchSection) searchSection.style.display = 'none';
        if (addEventButton) addEventButton.style.display = 'none';

        // Show only the selected section
        if (sectionToShow) sectionToShow.style.display = 'block';

        // Show the search section only for user posts
        if (sectionToShow === userPostsSection && searchSection) {
            searchSection.style.display = 'block';
        }

        // Always show the Add Event button
        if (addEventButton) addEventButton.style.display = 'block';
    }

    // Sidebar menu active state and section visibility
    const sidebarLinks = document.querySelectorAll('.sidebar-menu a');
    if (sidebarLinks.length > 0) {
        // Initially show only technical events (first tab)
        showOnlySection(technicalEventsSection);

        sidebarLinks.forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault(); // Prevent default anchor behavior

                // Remove active class from all links
                sidebarLinks.forEach(l => l.classList.remove('active'));

                // Add active class to clicked link
                this.classList.add('active');

                // Show the corresponding section based on href
                const targetId = this.getAttribute('href').substring(1); // Remove # from href
                const targetSection = document.getElementById(targetId);

                showOnlySection(targetSection);
            });
        });
    }

    // Event card click events
    const eventCards = document.querySelectorAll('.event-card');
    if (eventCards.length > 0) {
        eventCards.forEach(card => {
            card.addEventListener('click', function () {
                const eventId = this.getAttribute('data-event-id');
                const category = this.getAttribute('data-category');
                console.log(`Clicked on ${category} event with ID: ${eventId}`);
                // Future functionality: Redirect to event detail page
            });
        });
    }

    // Add Event Form Submission
    const addEventForm = document.getElementById('add-event-form');
    if (addEventForm) {
        addEventForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const eventTitle = document.getElementById('event-title').value;
            const eventCollege = document.getElementById('event-college').value;
            const eventCategory = document.getElementById('event-category').value;
            const eventDate = document.getElementById('event-date').value;
            const eventDescription = document.getElementById('event-description').value;

            console.log('Event Submitted:', {
                title: eventTitle,
                college: eventCollege,
                category: eventCategory,
                date: eventDate,
                description: eventDescription
            });

            alert('Event submitted successfully! After review, it will appear on the homepage.');
            addEventForm.reset();
        });
    }
});