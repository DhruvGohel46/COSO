import { collegeData } from "./colleges and courses list.js";

document.addEventListener('DOMContentLoaded', function () {
    // Existing Elements
    const loginSection = document.getElementById('loginSection');
    const profileSection = document.getElementById('profileSection');
    const registrationSection = document.getElementById('registrationSection');
    const showStudentSignupBtn = document.getElementById('showStudentSignupBtn');
    const showAdminSignupBtn = document.getElementById('showAdminSignupBtn');
    const showLoginBtn = document.getElementById('showLoginBtn');
    const showLoginFromAdminBtn = document.getElementById('showLoginFromAdminBtn');
    const loginForm = document.getElementById('loginForm');
    const registrationForm = document.getElementById('registrationForm');
    const editProfileBtn = document.getElementById('editProfileBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    
    // Admin Elements
    const adminRegistrationSection = document.getElementById('adminRegistrationSection');
    const adminDashboard = document.getElementById('adminDashboard');
    const adminRegistrationForm = document.getElementById('adminRegistrationForm');
    const adminLogoutBtn = document.getElementById('adminLogoutBtn');
    const studentList = document.getElementById('studentList');
    const noStudentsMsg = document.querySelector('.no-students');
    
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

    // Student ID Upload
    const studentIdInput = document.getElementById('student-id');
    const studentIdPreview = document.getElementById('student-id-preview');

    studentIdInput.addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                studentIdPreview.src = e.target.result;
            }
            reader.readAsDataURL(file);
        }
    });

    // College and Course Dropdown Logic
    const collegeSelect = document.getElementById('collegeSelect');
    const courseSelect = document.getElementById('courseSelect');
    const adminCollegeSelect = document.getElementById('adminCollegeSelect');

    // Populate the college dropdown
    function populateColleges(selectElement) {
        selectElement.innerHTML = '<option value="">Select Institute</option>';
        Object.keys(collegeData).forEach(college => {
            const option = document.createElement('option');
            option.value = college;
            option.textContent = college;
            selectElement.appendChild(option);
        });
    }
    
    populateColleges(collegeSelect);
    populateColleges(adminCollegeSelect);

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

    // Show Student Signup Form
    showStudentSignupBtn.addEventListener('click', function(e) {
        e.preventDefault();
        loginSection.classList.add('hidden');
        registrationSection.classList.remove('hidden');
        adminRegistrationSection.classList.add('hidden');
    });
    
    // Show Admin Signup Form
    showAdminSignupBtn.addEventListener('click', function(e) {
        e.preventDefault();
        loginSection.classList.add('hidden');
        registrationSection.classList.add('hidden');
        adminRegistrationSection.classList.remove('hidden');
    });

    // Show Login Form from Student Registration
    showLoginBtn.addEventListener('click', function(e) {
        e.preventDefault();
        registrationSection.classList.add('hidden');
        adminRegistrationSection.classList.add('hidden');
        loginSection.classList.remove('hidden');
    });
    
    // Show Login Form from Admin Registration
    showLoginFromAdminBtn.addEventListener('click', function(e) {
        e.preventDefault();
        adminRegistrationSection.classList.add('hidden');
        registrationSection.classList.add('hidden');
        loginSection.classList.remove('hidden');
    });

    // Unified Login Form Submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // First check if admin credentials match
        const adminData = JSON.parse(localStorage.getItem('adminData'));
        if (adminData && adminData.email === email && adminData.password === password) {
            // Admin Login successful
            showAdminDashboard(adminData);
            return;
        }
        
        // If not admin, check if student credentials match
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (userData && userData.email === email && userData.password === password) {
            // Student Login successful
            showProfile(userData);
            return;
        }
        
        // If neither matched, login failed
        alert('Invalid email or password. Please try again.');
    });

    // Student Registration Form Submission
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
            profilePicture: profilePicture,
            studentId: studentIdPreview.src !== 'student id card.png' ? studentIdPreview.src : null,
            status: 'pending', // Set initial status as pending
            userType: 'student' // Set user type as student
        };
        
        // Save user data to localStorage
        localStorage.setItem('userData', JSON.stringify(userData));
        
        // Show profile
        showProfile(userData);
        
        alert('Registration successful! Your account is pending approval from a college admin.');
    });

    // Admin Registration Form Submission
    adminRegistrationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const password = document.getElementById('adminPasswordInput').value;
        const confirmPassword = document.getElementById('adminConfirmPassword').value;
        
        // Check if passwords match
        if (password !== confirmPassword) {
            alert('Passwords do not match. Please try again.');
            return;
        }
        
        const adminData = {
            email: document.getElementById('adminRegEmail').value,
            name: document.getElementById('adminName').value,
            college: document.getElementById('adminCollegeSelect').value,
            designation: document.getElementById('adminDesignation').value,
            adminId: document.getElementById('adminId').value,
            password: password,
            userType: 'admin' // Set user type as admin
        };
        
        // Save admin data to localStorage
        localStorage.setItem('adminData', JSON.stringify(adminData));
        
        // Show admin dashboard
        showAdminDashboard(adminData);
        
        alert('Admin registration successful!');
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
        populateColleges(collegeSelect);
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

    // Logout Button (Student)
    logoutBtn.addEventListener('click', function() {
        // Show login form
        profileSection.classList.add('hidden');
        loginSection.classList.remove('hidden');
    });

    // Logout Button (Admin)
    adminLogoutBtn.addEventListener('click', function() {
        // Show login form (unified login)
        adminDashboard.classList.add('hidden');
        loginSection.classList.remove('hidden');
    });

    // Check if user is already logged in
    function checkLoggedInStatus() {
        const userData = JSON.parse(localStorage.getItem('userData'));
        const adminData = JSON.parse(localStorage.getItem('adminData'));
        
        if (adminData) {
            // Admin is logged in, show dashboard
            showAdminDashboard(adminData);
        } else if (userData) {
            // User is logged in, show profile
            showProfile(userData);
        } else {
            // No one is logged in, show login form
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
        adminRegistrationSection.classList.add('hidden');
        adminDashboard.classList.add('hidden');
        profileSection.classList.remove('hidden');
    }

    // Show admin dashboard
    function showAdminDashboard(adminData) {
        // Update admin info
        document.getElementById('admin-name').textContent = adminData.name;
        document.getElementById('admin-college').textContent = adminData.college;
        document.getElementById('admin-designation').textContent = adminData.designation || 'Not specified';
        
        // Hide all other sections
        loginSection.classList.add('hidden');
        registrationSection.classList.add('hidden');
        profileSection.classList.add('hidden');
        adminRegistrationSection.classList.add('hidden');
        
        // Show admin dashboard
        adminDashboard.classList.remove('hidden');
        
        // Load students from the same college
        loadStudents(adminData.college);
    }

    // Load students from a specific college
    function loadStudents(adminCollege) {
        // Clear the student list
        studentList.innerHTML = '';
        
        // Get all students from localStorage
        let allUsers = [];
        
        // Check if userData exists and is an object (single user)
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (userData && userData.userType === 'student') {
            allUsers.push(userData);
        }
        
        // Check if there are additional users stored in other formats (e.g., array)
        // This is a placeholder for if you implement multiple users in the future
        const additionalUsers = JSON.parse(localStorage.getItem('allUsers')) || [];
        allUsers = allUsers.concat(additionalUsers);
        
        // Filter students from the admin's college
        const collegeStudents = allUsers.filter(user => user.college === adminCollege);
        
        // Show message if no students are found
        if (collegeStudents.length === 0) {
            noStudentsMsg.classList.remove('hidden');
            return;
        }
        
        // Hide the no students message
        noStudentsMsg.classList.add('hidden');
        
        // Create student cards
        collegeStudents.forEach((student, index) => {
            const studentCard = document.createElement('div');
            studentCard.className = 'student-card';
            studentCard.innerHTML = `
                <div class="student-photo">
                    <img src="${student.profilePicture || 'logo.png'}" alt="${student.name}">
                </div>
                <div class="student-details">
                    <h4>${student.name}</h4>
                    <p>Course: ${student.course}</p>
                    <p>Year: ${student.year}</p>
                    <p>Email: ${student.email}</p>
                    <p>Status: <span class="student-status ${student.status ? 'status-' + student.status : 'status-pending'}">${student.status || 'pending'}</span></p>
                </div>
                <div class="student-id-preview">
                    <img src="${student.studentId || 'student id card.png'}" alt="Student ID">
                </div>
                <div class="student-actions">
                    ${student.status !== 'approved' ? `<button class="approve-btn" data-student-index="${index}">Approve</button>` : ''}
                    ${student.status !== 'rejected' ? `<button class="reject-btn" data-student-index="${index}">Reject</button>` : ''}
                </div>
            `;
            
            studentList.appendChild(studentCard);
        });
        
        // Add event listeners to approve/reject buttons
        const approveButtons = document.querySelectorAll('.approve-btn');
        const rejectButtons = document.querySelectorAll('.reject-btn');
        
        approveButtons.forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-student-index'));
                updateStudentStatus(collegeStudents[index], 'approved');
            });
        });
        
        rejectButtons.forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-student-index'));
                updateStudentStatus(collegeStudents[index], 'rejected');
            });
        });
    }

    // Update student status
    function updateStudentStatus(student, status) {
        // Update status
        student.status = status;
        
        // Save updated user data
        localStorage.setItem('userData', JSON.stringify(student));
        
        // Reload the dashboard to reflect changes
        const adminData = JSON.parse(localStorage.getItem('adminData'));
        loadStudents(adminData.college);
        
        // Show alert
        alert(`Student ${student.name} has been ${status}.`);
    }

    // Initial check on page load
    checkLoggedInStatus();
});