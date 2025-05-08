import { authAPI, adminAPI } from './api.js';
import { collegeData } from "./colleges and courses list.js";

document.addEventListener('DOMContentLoaded', async function () {
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
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            // Try backend login first
            const response = await authAPI.login(email, password);
            if (response.role === 'admin') {
                showAdminDashboard(response.user);
                return;
            } else {
                showProfile(response.user);
                return;
            }
        } catch (error) {
            console.error('Backend login failed:', error);
            
            // Fallback to existing localStorage logic
            const adminData = JSON.parse(localStorage.getItem('adminData'));
            if (adminData && adminData.email === email && adminData.password === password) {
                showAdminDashboard(adminData);
                return;
            }
            
            const userData = JSON.parse(localStorage.getItem('userData'));
            if (userData && userData.email === email && userData.password === password) {
                showProfile(userData);
                return;
            }
            
            alert('Invalid email or password. Please try again.');
        }
    });

    // Student Registration Form Submission
    registrationForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(registrationForm);
        
        try {
            // Try backend registration first
            await authAPI.registerStudent(Object.fromEntries(formData));
            alert('Registration successful! Your account is pending approval.');
            
            // Fallback to existing localStorage logic if needed
            const userData = {
                email: document.getElementById('regEmail').value,
                name: document.getElementById('name').value,
                college: collegeSelect.value,
                course: courseSelect.value,
                year: document.getElementById('year').value,
                password: document.getElementById('passwordInput').value,
                profilePicture: regPhotoPreview.src !== 'logo.png' ? regPhotoPreview.src : 'logo.png',
                studentId: studentIdPreview.src !== 'student id card.png' ? studentIdPreview.src : null,
                status: 'pending',
                userType: 'student'
            };
            localStorage.setItem('userData', JSON.stringify(userData));
            
            showProfile(userData);
        } catch (error) {
            console.error('Backend registration failed:', error);
            // Continue with existing localStorage logic
            const userData = {
                email: document.getElementById('regEmail').value,
                name: document.getElementById('name').value,
                college: collegeSelect.value,
                course: courseSelect.value,
                year: document.getElementById('year').value,
                password: document.getElementById('passwordInput').value,
                profilePicture: regPhotoPreview.src !== 'logo.png' ? regPhotoPreview.src : 'logo.png',
                studentId: studentIdPreview.src !== 'student id card.png' ? studentIdPreview.src : null,
                status: 'pending',
                userType: 'student'
            };
            localStorage.setItem('userData', JSON.stringify(userData));
            
            showProfile(userData);
            
            alert('Registration successful! Your account is pending approval from a college admin.');
        }
    });

    // Admin Registration Form Submission
    adminRegistrationForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(adminRegistrationForm);
        
        try {
            // Try backend admin registration first
            await authAPI.registerAdmin(Object.fromEntries(formData));
            alert('Admin registration successful!');
            
            // Fallback to existing localStorage logic if needed
            const adminData = {
                email: document.getElementById('adminRegEmail').value,
                name: document.getElementById('adminName').value,
                college: document.getElementById('adminCollegeSelect').value,
                designation: document.getElementById('adminDesignation').value,
                adminId: document.getElementById('adminId').value,
                password: document.getElementById('adminPasswordInput').value,
                userType: 'admin'
            };
            localStorage.setItem('adminData', JSON.stringify(adminData));
            
            showAdminDashboard(adminData);
        } catch (error) {
            console.error('Backend admin registration failed:', error);
            // Continue with existing localStorage logic
            const adminData = {
                email: document.getElementById('adminRegEmail').value,
                name: document.getElementById('adminName').value,
                college: document.getElementById('adminCollegeSelect').value,
                designation: document.getElementById('adminDesignation').value,
                adminId: document.getElementById('adminId').value,
                password: document.getElementById('adminPasswordInput').value,
                userType: 'admin'
            };
            localStorage.setItem('adminData', JSON.stringify(adminData));
            
            showAdminDashboard(adminData);
            
            alert('Admin registration successful!');
        }
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
    logoutBtn.addEventListener('click', async function() {
        try {
            await authAPI.logout();
        } catch (error) {
            console.error('Backend logout failed:', error);
        }
        // Continue with existing logout logic
        profileSection.classList.add('hidden');
        loginSection.classList.remove('hidden');
    });

    // Logout Button (Admin)
    adminLogoutBtn.addEventListener('click', async function() {
        try {
            await authAPI.logout();
        } catch (error) {
            console.error('Backend logout failed:', error);
        }
        // Continue with existing admin logout logic
        adminDashboard.classList.add('hidden');
        loginSection.classList.remove('hidden');
    });

    // Check if user is already logged in
    async function checkLoggedInStatus() {
        try {
            const response = await authAPI.getProfile();
            if (response.role === 'admin') {
                showAdminDashboard(response.user);
            } else {
                showProfile(response.user);
            }
        } catch (error) {
            console.error('Backend profile check failed:', error);
            // Fallback to existing localStorage logic
            const userData = JSON.parse(localStorage.getItem('userData'));
            const adminData = JSON.parse(localStorage.getItem('adminData'));
            
            if (adminData) {
                showAdminDashboard(adminData);
            } else if (userData) {
                showProfile(userData);
            } else {
                loginSection.classList.remove('hidden');
            }
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
        
        // Show books section and user stats immediately for demo
        const myBooksSection = document.getElementById('my-books-section');
        const userStats = document.querySelector('.user-stats');
        const noBooks = document.querySelector('.no-books');
        
        // Show the sections
        myBooksSection.style.display = 'block';
        userStats.style.display = 'block';
        
        // Hide the "No books" message and "Start Selling" button
        if (noBooks) {
            noBooks.style.display = 'none';
        }
        
        // Hide login/registration sections
        loginSection.classList.add('hidden');
        registrationSection.classList.add('hidden');
        adminRegistrationSection.classList.add('hidden');
        adminDashboard.classList.add('hidden');
        profileSection.classList.remove('hidden');
    }

    // Add new function to load user's books
    function loadUserBooks(userData) {
        const bookList = document.querySelector('.book-list');
        
        // If user has no books, show the no-books message
        if (!userData.books || userData.books.length === 0) {
            document.querySelector('.no-books').style.display = 'block';
            bookList.style.display = 'none';
            return;
        }
        
        // If user has books, hide no-books message and show the list
        document.querySelector('.no-books').style.display = 'none';
        bookList.style.display = 'grid';
    }

    // Add new function to load user stats
    function loadUserStats(userData) {
        const statsContainer = document.querySelector('.user-stats');
        
        // Update stats with actual user data
        statsContainer.innerHTML = `
            <div class="stat-item">
                <div class="stat-icon">📚</div>
                <div class="stat-info">
                    <div class="stat-label">Books Listed</div>
                    <div class="stat-value">${userData.booksListed || 0}</div>
                </div>
            </div>
            <div class="stat-item">
                <div class="stat-icon">💰</div>
                <div class="stat-info">
                    <div class="stat-label">Books Sold</div>
                    <div class="stat-value">${userData.booksSold || 0}</div>
                </div>
            </div>
            <div class="stat-item">
                <div class="stat-icon">📖</div>
                <div class="stat-info">
                    <div class="stat-label">Active Listings</div>
                    <div class="stat-value">${userData.activeListings || 0}</div>
                </div>
            </div>
            <div class="stat-item">
                <div class="stat-icon">💸</div>
                <div class="stat-info">
                    <div class="stat-label">Total Earnings</div>
                    <div class="stat-value earnings">₹${userData.totalEarnings || 0}</div>
                </div>
            </div>
        `;
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
    async function loadStudents(adminCollege) {
        try {
            // Try to get students from backend first
            const students = await adminAPI.getStudentsByCollege(adminCollege);
            displayStudents(students);
        } catch (error) {
            console.error('Backend student fetch failed:', error);
            // Fallback to existing localStorage logic
            let allUsers = [];
            
            const userData = JSON.parse(localStorage.getItem('userData'));
            if (userData && userData.userType === 'student') {
                allUsers.push(userData);
            }
            
            const additionalUsers = JSON.parse(localStorage.getItem('allUsers')) || [];
            allUsers = allUsers.concat(additionalUsers);
            
            const collegeStudents = allUsers.filter(user => user.college === adminCollege);
            
            displayStudents(collegeStudents);
        }
    }

    // Add function to display students
    function displayStudents(students) {
        studentList.innerHTML = '';
        
        if (students.length === 0) {
            noStudentsMsg.classList.remove('hidden');
            return;
        }
        
        noStudentsMsg.classList.add('hidden');
        
        students.forEach((student, index) => {
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
            
            const approveBtn = studentCard.querySelector('.approve-btn');
            if (approveBtn) {
                approveBtn.addEventListener('click', async () => {
                    try {
                        await adminAPI.approveStudent(student.id);
                        loadStudents(student.college);
                    } catch (error) {
                        console.error('Failed to approve student:', error);
                        updateStudentStatus(student, 'approved');
                    }
                });
            }
            
            const rejectBtn = studentCard.querySelector('.reject-btn');
            if (rejectBtn) {
                rejectBtn.addEventListener('click', async () => {
                    try {
                        await adminAPI.rejectStudent(student.id);
                        loadStudents(student.college);
                    } catch (error) {
                        console.error('Failed to reject student:', error);
                        updateStudentStatus(student, 'rejected');
                    }
                });
            }
        });
    }

    // Update student status
    function updateStudentStatus(student, status) {
        student.status = status;
        
        localStorage.setItem('userData', JSON.stringify(student));
        
        const adminData = JSON.parse(localStorage.getItem('adminData'));
        loadStudents(adminData.college);
        
        alert(`Student ${student.name} has been ${status}.`);
    }

    // Initial check on page load
    checkLoggedInStatus();
});

function showUserProfile() {
    document.getElementById('loginSection').classList.add('hidden');
    document.getElementById('registrationSection').classList.add('hidden');
    document.getElementById('adminRegistrationSection').classList.add('hidden');
    document.getElementById('adminDashboard').classList.add('hidden');
    document.getElementById('profileSection').classList.remove('hidden');
    document.getElementById('my-books-section').style.display = 'block'; // Add this line
}