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

    // Helper function to hide all sections
    function hideAllSections() {
        loginSection.classList.add('hidden');
        profileSection.classList.add('hidden');
        registrationSection.classList.add('hidden');
        adminRegistrationSection.classList.add('hidden');
        adminDashboard.classList.add('hidden');
        
        // Hide dashboard components if they exist
        const profileDashboard = document.querySelector('.profile-dashboard');
        if (profileDashboard) profileDashboard.style.display = 'none';
        
        const userInfoSidebar = document.querySelector('.user-info-sidebar');
        if (userInfoSidebar) userInfoSidebar.style.display = 'none';
        
        const mainContentArea = document.querySelector('.main-content-area');
        if (mainContentArea) mainContentArea.style.display = 'none';
        
        const userStats = document.querySelector('.user-stats');
        if (userStats) userStats.style.display = 'none';
        
        const userBooksSection = document.querySelector('.user-books-section');
        if (userBooksSection) userBooksSection.style.display = 'none';
        
        const myBooksSection = document.getElementById('my-books-section');
        if (myBooksSection) myBooksSection.style.display = 'none';
    }

    // Show Student Signup Form
    showStudentSignupBtn.addEventListener('click', function(e) {
        e.preventDefault();
        hideAllSections();
        registrationSection.classList.remove('hidden');
    });
    
    // Show Admin Signup Form
    showAdminSignupBtn.addEventListener('click', function(e) {
        e.preventDefault();
        hideAllSections();
        adminRegistrationSection.classList.remove('hidden');
    });

    // Show Login Form from Student Registration
    showLoginBtn.addEventListener('click', function(e) {
        e.preventDefault();
        hideAllSections();
        loginSection.classList.remove('hidden');
    });
    
    // Show Login Form from Admin Registration
    showLoginFromAdminBtn.addEventListener('click', function(e) {
        e.preventDefault();
        hideAllSections();
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
    registrationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        try {
            // Collect form data
            const formData = {
                email: document.getElementById('regEmail').value,
                name: document.getElementById('name').value,
                college: document.getElementById('collegeSelect').value,
                course: document.getElementById('courseSelect').value,
                year: document.getElementById('year').value,
                password: document.getElementById('passwordInput').value,
                profilePicture: regPhotoPreview.src !== '../static/images/logo.png' ? regPhotoPreview.src : '../static/images/logo.png',
                studentId: studentIdPreview.src !== '../static/images/student id card.png' ? studentIdPreview.src : null,
                status: 'pending',
                userType: 'student',
                booksListed: 0,
                booksSold: 0,
                activeListings: 0,
                totalEarnings: 0
            };

            // Validate form data
            if (!formData.email || !formData.name || !formData.college || !formData.course || !formData.password) {
                alert('Please fill in all required fields');
                return;
            }

            // Save user data to localStorage
            localStorage.setItem('userData', JSON.stringify(formData));
            
            // Show profile with new data
            showProfile(formData);
            
            // Success message
            alert('Registration successful! Your account is pending approval.');
            
        } catch (error) {
            console.error('Registration error:', error);
            alert('Registration failed. Please try again.');
        }
    });

    // Admin Registration Form Submission
    adminRegistrationForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        try {
            // Collect admin form data
            const adminData = {
                email: document.getElementById('adminRegEmail').value,
                name: document.getElementById('adminName').value,
                college: document.getElementById('adminCollegeSelect').value,
                designation: document.getElementById('adminDesignation').value,
                adminId: document.getElementById('adminId').value,
                password: document.getElementById('adminPasswordInput').value,
                userType: 'admin'
            };
            
            // Try backend admin registration first
            try {
                await authAPI.registerAdmin(adminData);
            } catch (error) {
                console.error('Backend admin registration failed:', error);
                // Continue with localStorage logic
            }
            
            // Save to localStorage
            localStorage.setItem('adminData', JSON.stringify(adminData));
            
            showAdminDashboard(adminData);
            alert('Admin registration successful!');
            
        } catch (error) {
            console.error('Admin registration error:', error);
            alert('Admin registration failed. Please try again.');
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
        hideAllSections();
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
        hideAllSections();
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
        hideAllSections();
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
                hideAllSections();
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
        
        if (userData.profilePicture && userData.profilePicture !== 'logo.png') {
            profilePhotoPreview.src = userData.profilePicture;
        }

        // Hide all sections first
        hideAllSections();
        
        // Show profile section and dashboard
        profileSection.classList.remove('hidden');
        
        // Show user sections and populate books
        const userSections = [
            '.profile-dashboard',
            '.user-info-sidebar',
            '.user-stats',
            '.user-books-section',
            '.main-content-area'
        ];
        
        userSections.forEach(section => {
            const element = document.querySelector(section);
            if (element) {
                element.style.display = section === '.profile-dashboard' ? 'grid' : 'block';
            }
        });

        // Show and populate My Books section
        const myBooksSection = document.getElementById('my-books-section');
        if (myBooksSection) {
            myBooksSection.style.display = 'block';
            
            // Add demo books
            const demoBooks = [
                {
                    title: 'Java Programming',
                    author: 'Herbert Schildt',
                    price: '₹400',
                    image: '../static/images/books/Java Programming.jpeg',
                    status: 'available'
                },
                {
                    title: 'Calculus: Early Transcendentals',
                    author: 'James Stewart',
                    price: '₹550',
                    image: '../static/images/books/Calculus Early Transcendentals.jpeg',
                    status: 'sold'
                }
            ];

            const bookList = myBooksSection.querySelector('.book-list');
            if (bookList) {
                bookList.innerHTML = demoBooks.map(book => `
                    <div class="book-card">
                        <img src="${book.image}" alt="${book.title}" class="book-image" />
                        <div class="book-details">
                            <h3 class="book-title">${book.title}</h3>
                            <p class="book-author">By ${book.author}</p>
                            <p class="book-price">${book.price}</p>
                            <span class="book-status status-${book.status}">${book.status}</span>
                            <div class="book-action-buttons">
                                ${book.status === 'available' ? `
                                    <button class="button book-action-btn">Edit</button>
                                    <button class="button book-action-btn cancel-btn">Remove</button>
                                    <button class="button book-action-btn">Mark Sold</button>
                                ` : `
                                    <button class="button book-action-btn cancel-btn">Remove</button>
                                    <button class="button book-action-btn">Relist</button>
                                `}
                            </div>
                        </div>
                    </div>
                `).join('');
            }
        }
    }

    // Add new function to load user's books
    function loadUserBooks(userData) {
        const bookList = document.querySelector('.book-list');
        const noBooks = document.querySelector('.no-books');
        
        // If user has no books, show the no-books message
        if (!userData.books || userData.books.length === 0) {
            if (noBooks) noBooks.style.display = 'block';
            if (bookList) bookList.style.display = 'none';
            return;
        }
        
        // If user has books, hide no-books message and show the list
        if (noBooks) noBooks.style.display = 'none';
        if (bookList) bookList.style.display = 'grid';
    }

    // Add new function to load user stats
    function loadUserStats(userData) {
        const statsContainer = document.querySelector('.user-stats');
        if (!statsContainer) return;
        
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
        hideAllSections();
        
        // Update admin info
        document.getElementById('admin-name').textContent = adminData.name;
        document.getElementById('admin-college').textContent = adminData.college;
        document.getElementById('admin-designation').textContent = adminData.designation || 'Not specified';
        
        // Show admin dashboard
        const adminDashboard = document.getElementById('adminDashboard');
        adminDashboard.classList.remove('hidden');
        adminDashboard.classList.add('active');
        
        // Load students
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
                    <img src="${student.profilePicture || '../static/images/logo.png'}" alt="${student.name}">
                </div>
                <div class="student-details">
                    <h4>${student.name}</h4>
                    <p>Course: ${student.course}</p>
                    <p>Year: ${student.year}</p>
                    <p>Email: ${student.email}</p>
                    <p>Status: <span class="student-status ${student.status ? 'status-' + student.status : 'status-pending'}">${student.status || 'pending'}</span></p>
                </div>
                <div class="student-id-preview">
                    <img src="${student.studentId || '../static/images/student id card.png'}" alt="Student ID">
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

    // Handle Start Selling button
    const startSellingBtn = document.getElementById('startSellingBtn');
    if (startSellingBtn) {
        startSellingBtn.addEventListener('click', function() {
            window.location.href = 'book.html';
        });
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
    document.getElementById('my-books-section').style.display = 'block';
}

// Add new function to show demo books
function showMyBooks() {
    const bookList = document.querySelector('.book-list');
    if (!bookList) return;

    // Show the book list container
    bookList.style.display = 'grid';
    
    // Hide the no books message if it exists
    const noBooks = document.querySelector('.no-books');
    if (noBooks) {
        noBooks.style.display = 'none';
    }
}