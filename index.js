document.addEventListener('DOMContentLoaded', function() {
    // Search functionality
    const searchBar = document.getElementById('search-bar');
    searchBar.addEventListener('input', function() {
        const query = this.value.toLowerCase();
        console.log(`Searching for: ${query}`);
        // Implement search logic here
    });

    // Navigation handling
    const navLinks = document.querySelectorAll('#navigation-container nav a');
    if (navLinks.length === 0) {
        console.error('No navigation links found. Ensure navigation.html is loaded correctly.');
        return;
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const target = this.getAttribute('href').substring(1); // Get target section ID

            console.log(`Navigating to: ${target}`); // Log the target section

            // Hide all sections
            document.querySelectorAll('#content-area > section').forEach(section => {
                section.style.display = 'none';
            });

            // Show the target section
            const targetSection = document.getElementById(target);
            if (targetSection) {
                targetSection.style.display = 'block';
                console.log(`Displayed section: ${target}`); // Log successful display
            } else {
                console.error(`Section with ID ${target} not found.`); // Log error if section not found
            }

            // If it's the profile page, load profile data (you'll need a backend API)
            if (target === 'profile') {
                loadProfileData();
            }
        });
    });

    // Display profile picture
    const profilePicture = document.getElementById('profile-picture');
    if (profilePicture) {
        profilePicture.src = 'path/to/default/profile-picture.jpg'; // Set default image
    }

    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const fileInput = document.getElementById('profile-photo');
            const file = fileInput.files[0];

            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    document.getElementById('photo-preview').innerHTML = `<img src="${e.target.result}" alt="Profile Photo">`;

                    // Send image data to server (you'll need a backend API endpoint)
                    const formData = new FormData();
                    formData.append('profile-photo', file);

                    fetch('/api/profile/photo', { // Replace with your API endpoint
                        method: 'POST',
                        body: formData
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            console.log('Profile photo uploaded successfully');
                        } else {
                            console.error('Error uploading profile photo:', data.message);
                        }
                    })
                    .catch(error => {
                        console.error('Error uploading profile photo:', error);
                    });
                }
                reader.readAsDataURL(file);
            }
        });
    }

    // Registration form submission
    const registrationForm = document.getElementById('registrationForm');
    if (registrationForm) {
        registrationForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const name = document.getElementById('name').value;
            const college = document.getElementById('college').value;
            const course = document.getElementById('course').value;
            const year = document.getElementById('year').value;
            const linkedin = document.getElementById('linkedin').value;
            const instagram = document.getElementById('instagram').value;
            const contact = document.getElementById('contact').value;

            // Send data to server (you'll need a backend API endpoint)
            fetch('/api/register', { // Replace with your API endpoint
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    college: college,
                    course: course,
                    year: year,
                    linkedin: linkedin,
                    instagram: instagram,
                    contact: contact
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    document.getElementById('formFeedback').textContent = "Registration successful!";
                    document.getElementById('formFeedback').style.color = "green";
                    this.reset();
                } else {
                    document.getElementById('formFeedback').textContent = data.message || "Registration failed.";
                    document.getElementById('formFeedback').style.color = "red";
                }
            });
        });
    }

    // Function to load profile data (replace with your actual API call)
    function loadProfileData() {
        fetch('/api/profile') // Your API endpoint for getting profile data
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const profileData = document.getElementById('profile-data');
                    profileData.innerHTML = `
                        <p>Name: ${data.name}</p>
                        <p>College: ${data.college}</p>
                        <p>Course: ${data.course}</p>
                    `;
                    // Set the profile photo preview if available
                    if (data.profilePhoto) {
                        document.getElementById('photo-preview').innerHTML = `<img src="${data.profilePhoto}" alt="Profile Photo">`;
                    }
                } else {
                    console.error("Error loading profile data:", data.message);
                }
            })
            .catch(error => {
                console.error("Error loading profile data:", error);
            });
    }

    // Example: Adding friends (you'll need to fetch this from the backend)
    const friendList = document.getElementById('friend-list');
    const friends = ["Friend 1", "Friend 2", "Friend 3"]; // Replace with actual data
    friends.forEach(friend => {
        const li = document.createElement('li');
        li.textContent = friend;
        friendList.appendChild(li);
    });

});
