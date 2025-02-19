document.addEventListener('DOMContentLoaded', function() {
    // College and Course Data
    const collegeData = {
        "GTU - School of Management Studies (GSMS)": ["Ph.D. in Management", "Master of Business Administration (MBA) in International Business", "MBA in Innovation,Entrepreneurship, and Venture Development (IEV)", "post Graduate Diploma in Digital Marketing (PGDDM)", "Post Graduate Diploma in Hospital Management (PGDHM)"],
        "GTU - School of Engineering and Technology (GTU-SET)": ["Computer Engineering", "Electronics & Communication Engineering", "Artificial Intelligence and Data Science", "Structural Engineering"],
        "Kaushalya The Skill University": ["Business Administration", "Computer Applications"],
        "Vishwakarma Government Engineering College (VGEC)": ["Chemical Engineering", "Civil Engineering", "Computer Engineering", "Computer Science and Engineering (Data Science)", "Electronics & Communication Engineering", "Electronics and Instrumentation Engineering", "Electrical Engineering", "Information Technology", "Information and Communication Technology", "Instrumentation & Control Engineering", "Mechanical Engineering", "Power Electronics Engineering"],
        "School of Applied Sciences & Technology (SAST - GTU)": ["Industrial Biotechnology", "Intellectual Property Rights", "Bioinformatics", "Biotechnology"]
    };

    // Get dropdown elements
    const collegeSelect = document.getElementById('college-search');
    const courseSelect = document.getElementById('course-search');

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
    collegeSelect.addEventListener('change', function() {
        const selectedCollege = this.value;
        
        // Clear existing course options
        courseSelect.innerHTML = '<option value="">Select Course</option>';
        courseSelect.disabled = true;

        if (selectedCollege && collegeData[selectedCollege]) {
            // Enable course dropdown
            courseSelect.disabled = false;

            // Populate course options
            collegeData[selectedCollege].forEach(course => {
                const option = document.createElement('option');
                option.value = course;
                option.textContent = course;
                courseSelect.appendChild(option);
            });
        }
    });

    // Handle search button click
    const searchButton = document.getElementById('search-button');
    if (searchButton) {
        searchButton.addEventListener('click', function() {
            const selectedCollege = collegeSelect.value;
            const selectedCourse = courseSelect.value;
            const selectedYear = document.getElementById('academic-year').value;
            
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
