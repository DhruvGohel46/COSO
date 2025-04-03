// Import college data from external file
import { collegeData } from './colleges and courses list.js';

document.addEventListener('DOMContentLoaded', function () {
    const collegeSelect = document.getElementById('college-search');
    const courseSelect = document.getElementById('course-search');
    const yearSelect = document.getElementById('academic-year');
    const searchButton = document.getElementById('search-button');
    const searchSection = document.getElementById('search-section');
    
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

    // Handle search button click
    if (searchButton) {
        searchButton.addEventListener('click', function () {
            const selectedCollege = collegeSelect.value;
            const selectedCourse = courseSelect.value;
            const selectedYear = yearSelect.value;

            if (!selectedCollege || !selectedCourse || !selectedYear) {
                alert('Please select all fields before searching.');
                return;
            }

            // Perform search (placeholder for actual search logic)
            console.log('Searching for:', {
                college: selectedCollege,
                course: selectedCourse,
                year: selectedYear
            });

            // TODO: Implement actual search functionality
            alert('Search functionality coming soon!');
        });
    }

    // Add event listeners for navigation icons
    const homeIcon = document.querySelector('nav a[href="index.html"]');
    const messagesIcon = document.querySelector('nav a[href="messages.html"]');
    const notificationsIcon = document.querySelector('nav a[href="notifications.html"]');
    const profileIcon = document.querySelector('nav a[href="profile.html"]');

    if (homeIcon) {
        homeIcon.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent default anchor behavior
            window.location.href = 'index.html'; // Redirect to home
        });
    }

    if (messagesIcon) {
        messagesIcon.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent default anchor behavior
            window.location.href = 'messages.html'; // Redirect to messages
        });
    }

    if (notificationsIcon) {
        notificationsIcon.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent default anchor behavior
            window.location.href = 'notifications.html'; // Redirect to notifications
        });
    }

    if (profileIcon) {
        profileIcon.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent default anchor behavior
            window.location.href = 'profile.html'; // Redirect to profile
        });
    }

    // Get all event sections
    const technicalEvents = document.getElementById('technical-events');
    const nonTechnicalEvents = document.getElementById('non-technical-events');
    const sportsEvents = document.getElementById('sports-events');
    const userPosts = document.getElementById('user-posts');
    const addEventButton = document.querySelector('a[href="add-event.html"]');

    // Function to show only the selected section
    function showOnlySection(sectionToShow) {
        // Hide all sections first
        if (technicalEvents) technicalEvents.style.display = 'none';
        if (nonTechnicalEvents) nonTechnicalEvents.style.display = 'none';
        if (sportsEvents) sportsEvents.style.display = 'none';
        if (userPosts) userPosts.style.display = 'none';
        if (searchSection) searchSection.style.display = 'none';
        if (addEventButton) addEventButton.style.display = 'none';
        
        // Show only the selected section
        if (sectionToShow) sectionToShow.style.display = 'block';
        
        // Show the search section only for user posts
        if (sectionToShow === userPosts && searchSection) {
            searchSection.style.display = 'block';
        }
        
        // Always show the Add Event button
        if (addEventButton) addEventButton.style.display = 'block';
    }

    // Sidebar menu active state and section visibility
    const sidebarLinks = document.querySelectorAll('.sidebar-menu a');
    if (sidebarLinks.length > 0) {
        // Initially show only technical events (first tab)
        showOnlySection(technicalEvents);
        
        sidebarLinks.forEach(link => {
            link.addEventListener('click', function(e) {
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
            card.addEventListener('click', function() {
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
        addEventForm.addEventListener('submit', function(e) {
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