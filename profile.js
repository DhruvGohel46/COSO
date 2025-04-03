import { collegeData } from "./colleges and courses list.js";

document.addEventListener('DOMContentLoaded', function () {
    // Elements
    const loginSection = document.getElementById('loginSection');
    const profileSection = document.getElementById('profileSection');
    const registrationSection = document.getElementById('registrationSection');
    const showSignupBtn = document.getElementById('showSignupBtn');
    const showLoginBtn = document.getElementById('showLoginBtn');
    const loginForm = document.getElementById('loginForm');
    const registrationForm = document.getElementById('registrationForm');
    const editProfileBtn = document.getElementById('editProfileBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    
    // Profile Picture Upload (Profile Section)
    const profilePhotoInput = document.getElementById('profile-photo');
    const profilePhotoPreview = document.getElementById('profile-photo-preview');

    profilePhotoInput.addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                profilePhotoPreview.src = e.target.result;
                
                // Save the profile picture to localStorage
                const userData = JSON.parse(localStorage.getItem('userData')) || {};
                userData.profilePicture = e.target.result;
                localStorage.setItem('userData', JSON.stringify(userData));
            }
            reader.readAsDataURL(file);
        }
    });
    
    // Profile Picture Upload (Registration Section)
    const regPhotoInput = document.getElementById('reg-photo');
    const regPhotoPreview = document.getElementById('reg-photo-preview');

    regPhotoInput.addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                regPhotoPreview.src = e.target.result;
                // We'll save this when the form is submitted
            }
            reader.readAsDataURL(file);
        }
    });

    // College and Course Dropdown Logic
    const collegeSelect = document.getElementById('collegeSelect');
    const courseSelect = document.getElementById('courseSelect');

    // Populate the college dropdown
    function populateColleges() {
        collegeSelect.innerHTML = '<option value="">Select College</option>';
        Object.keys(collegeData).forEach(college => {
            const option = document.createElement('option');
            option.value = college;
            option.textContent = college;
            collegeSelect.appendChild(option);
        });
    }
    
    populateColleges();

    // Update courses when college changes
    collegeSelect.addEventListener('change', function () {
        const selectedCollege = collegeSelect.value;
        const courses = collegeData[selectedCollege] || [];

        // Clear existing options
        courseSelect.innerHTML = '<option value="">Select Course</option>';

        // Add new options
        courses.forEach(course => {
            const option = document.createElement('option');
            option.value = course;
            option.textContent = course;
            courseSelect.appendChild(option);
        });
    });

    // Show Signup Form
    showSignupBtn.addEventListener('click', function(e) {
        e.preventDefault();
        loginSection.classList.add('hidden');
        registrationSection.classList.remove('hidden');
    });

    // Show Login Form
    showLoginBtn.addEventListener('click', function(e) {
        e.preventDefault();
        registrationSection.classList.add('hidden');
        loginSection.classList.remove('hidden');
    });

    // Login Form Submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Get stored user data
        const userData = JSON.parse(localStorage.getItem('userData'));
        
        if (userData && userData.email === email && userData.password === password) {
            // Login successful
            showProfile(userData);
        } else {
            // Login failed
            alert('Invalid email or password. Please try again.');
        }
    });

    // Registration Form Submission
    registrationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get profile picture from registration form
        const profilePicture = regPhotoPreview.src !== 'logo.png' ? regPhotoPreview.src : 'logo.png';
        
        const userData = {
            email: document.getElementById('regEmail').value,
            name: document.getElementById('name').value,
            college: collegeSelect.value,
            course: courseSelect.value,
            year: document.getElementById('year').value,
            password: document.getElementById('passwordInput').value,
            profilePicture: profilePicture
        };
        
        // Save user data to localStorage
        localStorage.setItem('userData', JSON.stringify(userData));
        
        // Show profile
        showProfile(userData);
        
        alert('Registration successful!');
    });

    // Edit Profile Button
    editProfileBtn.addEventListener('click', function() {
        const userData = JSON.parse(localStorage.getItem('userData'));
        
        // Fill the form with current user data
        document.getElementById('regEmail').value = userData.email;
        document.getElementById('name').value = userData.name;
        
        // Update the registration profile picture
        if (userData.profilePicture) {
            regPhotoPreview.src = userData.profilePicture;
        }
        
        // Reset and populate colleges
        populateColleges();
        collegeSelect.value = userData.college;
        
        // Trigger college change to populate courses
        const event = new Event('change');
        collegeSelect.dispatchEvent(event);
        
        // Set course after courses are populated
        setTimeout(() => {
            courseSelect.value = userData.course;
        }, 100);
        
        document.getElementById('year').value = userData.year;
        document.getElementById('passwordInput').value = userData.password;
        
        // Show registration form for editing
        profileSection.classList.add('hidden');
        registrationSection.classList.remove('hidden');
    });

    // Logout Button
    logoutBtn.addEventListener('click', function() {
        // Show login form
        profileSection.classList.add('hidden');
        loginSection.classList.remove('hidden');
    });

    // Check if user is already logged in
    function checkLoggedInStatus() {
        const userData = JSON.parse(localStorage.getItem('userData'));
        
        if (userData) {
            // User is logged in, show profile
            showProfile(userData);
        } else {
            // User is not logged in, show login form
            loginSection.classList.remove('hidden');
        }
    }

    // Show user profile
    function showProfile(userData) {
        // Update profile display
        document.getElementById('profile-name').textContent = userData.name;
        document.getElementById('profile-college').textContent = userData.college;
        document.getElementById('profile-course').textContent = userData.course;
        
        // Update profile picture if available
        if (userData.profilePicture && userData.profilePicture !== 'logo.png') {
            profilePhotoPreview.src = userData.profilePicture;
        }
        
        // Hide login/registration, show profile
        loginSection.classList.add('hidden');
        registrationSection.classList.add('hidden');
        profileSection.classList.remove('hidden');
    }

    // Initial check on page load
    checkLoggedInStatus();
});