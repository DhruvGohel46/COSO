// Import college data from external file
import { collegeData } from './colleges and courses list.js';

document.addEventListener('DOMContentLoaded', function () {
    const collegeSelect = document.getElementById('college-search');
    const courseSelect = document.getElementById('course-search');
    const yearSelect = document.getElementById('academic-year');
    const searchButton = document.getElementById('search-button');

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

    // Existing Events Section Functionality
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

        // Get all event cards
        const eventCards = document.querySelectorAll('.event-card');

    // Observe each event card for animations
    eventCards.forEach(card => {
        observer.observe(card);
    });

    // Add click event listeners to each card
    eventCards.forEach(card => {
        card.addEventListener('click', function () {
            const eventId = card.getAttribute('data-event-id');
            console.log('Event clicked:', eventId);
            // Future functionality: Redirect to event detail page using eventId
        });
    });

    // Check if the user is registered
    var userRegistered = localStorage.getItem("userRegistered");
    if (userRegistered === "true") {
        document.getElementById("getStartedBtn").classList.add("hidden");
        document.getElementById("heroBackground").classList.add("hidden");
    }

    }
});
