// profile.js - Complete script for the profile page functionality

// Import collegeData
import { collegeData } from './colleges and courses list.js';

// DOM Elements - Login Section
const loginSection = document.getElementById('loginSection');
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const showStudentSignupBtn = document.getElementById('showStudentSignupBtn');
const showAdminSignupBtn = document.getElementById('showAdminSignupBtn');
const showLoginBtn = document.getElementById('showLoginBtn');
const showLoginFromAdminBtn = document.getElementById('showLoginFromAdminBtn');

// DOM Elements - Registration Section
const registrationSection = document.getElementById('registrationSection');
const registrationForm = document.getElementById('registrationForm');
const regEmailInput = document.getElementById('regEmail');
const nameInput = document.getElementById('name');
const collegeSelect = document.getElementById('collegeSelect');
const courseSelect = document.getElementById('courseSelect');
const yearSelect = document.getElementById('year');
const regPasswordInput = document.getElementById('passwordInput');
const regPhotoInput = document.getElementById('reg-photo');
const regPhotoPreview = document.getElementById('reg-photo-preview');
const studentIdInput = document.getElementById('student-id');
const studentIdPreview = document.getElementById('student-id-preview');

// DOM Elements - Admin Registration Section
const adminRegistrationSection = document.getElementById('adminRegistrationSection');
const adminRegistrationForm = document.getElementById('adminRegistrationForm');
const adminRegEmailInput = document.getElementById('adminRegEmail');
const adminNameInput = document.getElementById('adminName');
const adminDesignationInput = document.getElementById('adminDesignation');
const adminCollegeSelect = document.getElementById('adminCollegeSelect');
const adminIdInput = document.getElementById('adminId');
const adminPasswordInput = document.getElementById('adminPasswordInput');
const adminConfirmPasswordInput = document.getElementById('adminConfirmPassword');

// DOM Elements - Profile Section
const profileSection = document.getElementById('profileSection');
const profileName = document.getElementById('profile-name');
const profileCollege = document.getElementById('profile-college');
const profileCourse = document.getElementById('profile-course');
const profilePhotoPreview = document.getElementById('profile-photo-preview');
const profilePhotoInput = document.getElementById('profile-photo');
const editProfileBtn = document.getElementById('editProfileBtn');
const logoutBtn = document.getElementById('logoutBtn');
const startSellingBtn = document.getElementById('startSellingBtn');

// DOM Elements - Admin Dashboard
const adminDashboard = document.getElementById('adminDashboard');
const adminName = document.getElementById('admin-name');
const adminCollege = document.getElementById('admin-college');
const adminDesignation = document.getElementById('admin-designation');
const adminLogoutBtn = document.getElementById('adminLogoutBtn');
const studentList = document.getElementById('studentList');
const noStudentsMessage = document.querySelector('.no-students');

// Books Section
const booksList = document.querySelector('.book-list');
const noBooksMessage = document.querySelector('.no-books');
const booksGrid = document.querySelector('.books-grid');

// Mock database for demonstration (in a real app, this would be on the server)
let mockUsers = JSON.parse(localStorage.getItem('mockUsers')) || [];
let mockBooks = JSON.parse(localStorage.getItem('mockBooks')) || [];
let pendingStudents = JSON.parse(localStorage.getItem('pendingStudents')) || [];

// Sample books data for demonstration
const sampleBooks = [
  {
    id: 'book1',
    title: 'Java Programming',
    author: 'Herbert Schildt',
    price: '400',
    status: 'available',
    image: '../static/images/books/Java Programming.jpeg',
    ownerId: 'user1'
  },
  {
    id: 'book2',
    title: 'Calculus: Early Transcendentals',
    author: 'James Stewart',
    price: '550',
    status: 'sold',
    image: '../static/images/books/Calculus Early Transcendentals.jpeg',
    ownerId: 'user1'
  }
];

// Add sample data if not present
function initializeMockData() {
  // Add sample users if none exist
  if (mockUsers.length === 0) {
    mockUsers = [
      {
        id: 'user1',
        email: 'student@example.com',
        name: 'John Doe',
        college: 'University of Example',
        collegeId: 'college1',
        course: 'Computer Science',
        year: '3',
        role: 'student',
        approved: true,
        profilePhoto: '../static/images/logo.png',
        password: 'password123', // In a real app, this would be hashed
      },
      {
        id: 'admin1',
        email: 'admin@example.com',
        name: 'Admin User',
        college: 'University of Example',
        collegeId: 'college1',
        designation: 'Department Head',
        adminId: 'ADM001',
        role: 'admin',
        password: 'admin123', // In a real app, this would be hashed
      }
    ];
    localStorage.setItem('mockUsers', JSON.stringify(mockUsers));
  }

  // Add sample books if none exist
  if (mockBooks.length === 0) {
    mockBooks = sampleBooks;
    localStorage.setItem('mockBooks', JSON.stringify(mockBooks));
  }

  // Add sample pending students if none exist
  if (pendingStudents.length === 0) {
    pendingStudents = [
      {
        id: 'pending1',
        email: 'pending@example.com',
        name: 'Pending Student',
        college: 'University of Example',
        collegeId: 'college1',
        course: 'Physics',
        year: '2',
        role: 'student',
        approved: false,
        profilePhoto: '../static/images/logo.png',
        studentId: '../static/images/student id card.png',
        password: 'pending123',
      }
    ];
    localStorage.setItem('pendingStudents', JSON.stringify(pendingStudents));
  }
}

// Initialize the page based on user state
document.addEventListener('DOMContentLoaded', () => {
  // Initialize mock data
  initializeMockData();
  
  // Populate college and course dropdowns
  populateCollegesDropdown();
  
  // Get currentUser from localStorage
  const user = getCurrentUser();
  
  // Show appropriate section based on user state
  if (user) {
    if (user.role === 'admin') {
      showAdminDashboard(user);
    } else {
      showProfile(user);
    }
  } else {
    // If no user is logged in, show login form
    showLogin();
  }
  
  // Set up event listeners
  setupEventListeners();
});

// Get current user from localStorage
function getCurrentUser() {
  const userData = localStorage.getItem('currentUser');
  return userData ? JSON.parse(userData) : null;
}

// Populate colleges dropdown using the colleges array from the external file
function populateCollegesDropdown() {
  // Clear existing options
  collegeSelect.innerHTML = '<option value="">Select Institute</option>';
  adminCollegeSelect.innerHTML = '<option value="">Select Institute</option>';
  
  // Add options for each college - using the colleges variable from "colleges and courses list.js"
  if (typeof colleges !== 'undefined') {
    colleges.forEach(college => {
      const option = document.createElement('option');
      option.value = college.id;
      option.textContent = college.name;
      
      // Clone the option for collegeSelect
      collegeSelect.appendChild(option.cloneNode(true));
      
      // Add the option to adminCollegeSelect
      adminCollegeSelect.appendChild(option);
    });
  } else {
    console.error('Colleges data not found. Make sure "colleges and courses list.js" is loaded correctly.');
  }
}

// Update courses dropdown based on selected college
function updateCoursesDropdown(collegeId) {
    const courseSelect = document.getElementById('courseSelect');
    if (!courseSelect) return;

    // Clear existing options
    courseSelect.innerHTML = '<option value="">Select Course</option>';
    
    try {
        // Find the selected college
        const selectedCollege = colleges.find(c => c.id === collegeId);
        if (selectedCollege && selectedCollege.courses) {
            // Add options for each course
            selectedCollege.courses.forEach(course => {
                const option = document.createElement('option');
                option.value = course;
                option.textContent = course;
                courseSelect.appendChild(option);
            });
            courseSelect.disabled = false;
        } else {
            courseSelect.disabled = true;
        }
    } catch (error) {
        console.error('Error updating courses:', error);
        courseSelect.disabled = true;
    }
}

// Set up all event listeners
function setupEventListeners() {
  // Login form submission
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
  
  // Show registration forms
  if (showStudentSignupBtn) {
    showStudentSignupBtn.addEventListener('click', showStudentRegistration);
  }
  if (showAdminSignupBtn) {
    showAdminSignupBtn.addEventListener('click', showAdminRegistration);
  }
  
  // Show login
  if (showLoginBtn) {
    showLoginBtn.addEventListener('click', showLogin);
  }
  if (showLoginFromAdminBtn) {
    showLoginFromAdminBtn.addEventListener('click', showLogin);
  }
  
  // Registration form submission
  if (registrationForm) {
    registrationForm.addEventListener('submit', handleStudentRegistration);
  }
  
  // Admin registration form submission
  if (adminRegistrationForm) {
    adminRegistrationForm.addEventListener('submit', handleAdminRegistration);
  }
  
  // College select change
  if (collegeSelect) {
    collegeSelect.addEventListener('change', (e) => {
      updateCoursesDropdown(e.target.value);
    });
  }
  
  // Profile picture preview for registration
  if (regPhotoInput) {
    regPhotoInput.addEventListener('change', (e) => {
      previewImage(e.target, regPhotoPreview);
    });
  }
  
  // Student ID preview
  if (studentIdInput) {
    studentIdInput.addEventListener('change', (e) => {
      previewImage(e.target, studentIdPreview);
    });
  }
  
  // Profile picture change
  if (profilePhotoInput) {
    profilePhotoInput.addEventListener('change', (e) => {
      previewImage(e.target, profilePhotoPreview);
      updateProfilePicture(e.target.files[0]);
    });
  }
  
  // Edit profile button
  if (editProfileBtn) {
    editProfileBtn.addEventListener('click', showEditProfileModal);
  }
  
  // Logout buttons
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }
  if (adminLogoutBtn) {
    adminLogoutBtn.addEventListener('click', handleLogout);
  }
  
  // Start selling button
  if (startSellingBtn) {
    startSellingBtn.addEventListener('click', () => {
      window.location.href = 'book.html';
    });
  }

  // Set up book action buttons
  setupBookActionButtons();
  
  // Setup existing demo books when page loads
  setupExistingBookCards();
}

// Handle login form submission
function handleLogin(e) {
  e.preventDefault();
  
  const email = emailInput.value;
  const password = passwordInput.value;
  
  try {
    const user = login(email, password);
    if (user) {
      // Store user data in localStorage
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      // Display appropriate view based on user role
      if (user.role === 'admin') {
        showAdminDashboard(user);
      } else {
        showProfile(user);
      }
    }
  } catch (error) {
    alert(`Login failed: ${error.message}`);
  }
}

// Login function (mock implementation)
function login(email, password) {
  // Check if user exists in mockUsers array
  const user = mockUsers.find(u => u.email === email && u.password === password);
  
  if (!user) {
    throw new Error('Invalid email or password');
  }
  
  // Check if student is approved
  if (user.role === 'student' && !user.approved) {
    throw new Error('Your account is still pending approval');
  }
  
  return user;
}

// Handle student registration form submission
function handleStudentRegistration(e) {
  e.preventDefault();
  
  // Validate form
  if (!regPhotoInput.files.length || !studentIdInput.files.length) {
    alert('Please upload both a profile photo and student ID card.');
    return;
  }
  
  try {
    // Create new student object
    const newStudent = {
      id: `student${Date.now()}`,
      email: regEmailInput.value,
      name: nameInput.value,
      collegeId: collegeSelect.value,
      college: collegeSelect.options[collegeSelect.selectedIndex].textContent,
      course: courseSelect.value,
      year: yearSelect.value,
      role: 'student',
      approved: false,
      profilePhoto: URL.createObjectURL(regPhotoInput.files[0]),
      studentId: URL.createObjectURL(studentIdInput.files[0]),
      password: regPasswordInput.value
    };
    
    // Add to pending students
    pendingStudents.push(newStudent);
    localStorage.setItem('pendingStudents', JSON.stringify(pendingStudents));

    // Store user data in localStorage and show profile
    localStorage.setItem('currentUser', JSON.stringify(newStudent));
    showProfile(newStudent);

    // Show pending message
    const pendingMessage = document.createElement('div');
    pendingMessage.className = 'pending-message';
    pendingMessage.innerHTML = `
      <h3 class="status-message">Account Pending Approval</h3>
      <p class="sub-message">Your account is awaiting approval from your institute's admin. You'll be notified once approved.</p>
    `;
    profileSection.insertBefore(pendingMessage, profileSection.firstChild);
    
  } catch (error) {
    alert(`Registration failed: ${error.message}`);
  }
}

// Handle admin registration form submission
function handleAdminRegistration(e) {
  e.preventDefault();
  
  // Validate passwords match
  if (adminPasswordInput.value !== adminConfirmPasswordInput.value) {
    alert('Passwords do not match!');
    return;
  }
  
  try {
    // Create new admin object
    const newAdmin = {
      id: `admin${Date.now()}`,
      email: adminRegEmailInput.value,
      name: adminNameInput.value,
      designation: adminDesignationInput.value,
      collegeId: adminCollegeSelect.value,
      college: adminCollegeSelect.options[adminCollegeSelect.selectedIndex].textContent,
      adminId: adminIdInput.value,
      role: 'admin',
      password: adminPasswordInput.value
    };
    
    // Add to users
    mockUsers.push(newAdmin);
    localStorage.setItem('mockUsers', JSON.stringify(mockUsers));

    // Store user data in localStorage
    localStorage.setItem('currentUser', JSON.stringify(newAdmin));

    // Hide the registration form
    hideAllSections();

    // Show admin dashboard immediately
    adminDashboard.classList.remove('hidden');
    adminName.textContent = newAdmin.name;
    adminCollege.textContent = newAdmin.college;
    adminDesignation.textContent = newAdmin.designation;

    // Initialize the admin dashboard
    loadPendingStudents(newAdmin.collegeId);
    
  } catch (error) {
    alert(`Registration failed: ${error.message}`);
  }
}

// Show login section
function showLogin() {
  hideAllSections();
  loginSection.style.display = 'block';
  loginSection.classList.remove('hidden');
}

// Show student registration section
function showStudentRegistration() {
    hideAllSections();
    registrationSection.style.display = 'block';
    registrationSection.classList.remove('hidden');
    
    // Reset form
    if (registrationForm) {
        registrationForm.reset();
    }
    
    // Reset preview images
    if (regPhotoPreview) {
        regPhotoPreview.src = '../static/images/logo.png';
    }
    if (studentIdPreview) {
        studentIdPreview.src = '../static/images/student id card.png';
    }
}

// Show admin registration section
function showAdminRegistration() {
    hideAllSections();
    adminRegistrationSection.style.display = 'block';
    adminRegistrationSection.classList.remove('hidden');
    
    // Reset form
    if (adminRegistrationForm) {
        adminRegistrationForm.reset();
    }
}

// Show user profile
function showProfile(user) {
    hideAllSections();
    
    // Show profile section
    profileSection.style.display = 'block';
    profileSection.classList.remove('hidden');

    // Also show profile dashboard container
    const profileDashboard = document.querySelector('.profile-dashboard');
    if (profileDashboard) {
        profileDashboard.style.display = 'grid';
    }
    
    // Update profile information
    profileName.textContent = user.name;
    profileCollege.textContent = user.college;
    profileCourse.textContent = user.course || '';
    
    if (user.profilePhoto) {
        profilePhotoPreview.src = user.profilePhoto;
    }

    // Define dashboard elements to control visibility
    const dashboardElements = {
        '.user-info-sidebar': 'block',
        '.user-stats': 'grid',
        '.user-books-section': 'block',
        '#my-books-section': 'block',
        '.main-content-area': 'flex'
    };

    if (!user.approved) {
        // Remove existing pending message if it exists
        const existingMessage = profileSection.querySelector('.pending-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Show pending message for unapproved users
        const pendingMessage = document.createElement('div');
        pendingMessage.className = 'pending-message';
        pendingMessage.innerHTML = `
            <h3 class="status-message">Account Pending Approval</h3>
            <p class="sub-message">Your account is awaiting approval from your institute's admin. You'll be notified once approved.</p>
        `;
        profileSection.insertBefore(pendingMessage, profileSection.firstChild);
        
        // Hide dashboard elements for unapproved users
        if (profileDashboard) {
            profileDashboard.style.display = 'none';
        }
        Object.keys(dashboardElements).forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                element.style.display = 'none';
            }
        });
    } else {
        // Show dashboard elements for approved users
        if (profileDashboard) {
            profileDashboard.style.display = 'grid';
        }
        Object.entries(dashboardElements).forEach(([selector, displayStyle]) => {
            const element = document.querySelector(selector);
            if (element) {
                element.style.display = displayStyle;
            }
        });
        
        // Load user's books
        loadUserBooks(user.id);
    }
}

// Show admin dashboard
function showAdminDashboard(admin) {
  hideAllSections();
  
  // Show dashboard and update information
  adminDashboard.style.display = 'block';
  adminDashboard.classList.remove('hidden');
  
  // Update admin information
  adminName.textContent = admin.name;
  adminCollege.textContent = admin.college;
  adminDesignation.textContent = admin.designation;
  
  // Load pending students
  loadPendingStudents(admin.collegeId);
}

// Hide all sections
function hideAllSections() {
  const sections = [
    loginSection,
    registrationSection,
    adminRegistrationSection,
    profileSection,
    adminDashboard
  ];
  
  sections.forEach(section => {
    if (section) {
      section.classList.add('hidden');
      section.style.display = 'none';
    }
  });

  // Also hide profile dashboard
  const profileDashboard = document.querySelector('.profile-dashboard');
  if (profileDashboard) {
    profileDashboard.style.display = 'none';
  }
}

// Preview image before upload
function previewImage(input, imgElement) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
      imgElement.src = e.target.result;
    };
    
    reader.readAsDataURL(input.files[0]);
  }
}

// Update profile picture
function updateProfilePicture(file) {
  if (!file) return;
  
  const user = getCurrentUser();
  if (!user) return;
  
  // In a real app, this would upload the file to a server
  // For demo purposes, we'll just update the local user object
  const reader = new FileReader();
  
  reader.onload = function(e) {
    user.profilePhoto = e.target.result;
    
    // Update user in mockUsers array
    const userIndex = mockUsers.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      mockUsers[userIndex].profilePhoto = e.target.result;
      localStorage.setItem('mockUsers', JSON.stringify(mockUsers));
    }
    
    // Update current user in localStorage
    localStorage.setItem('currentUser', JSON.stringify(user));
  };
  
  reader.readAsDataURL(file);
}

// Show edit profile modal
function showEditProfileModal() {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        alert('Please login to edit profile');
        return;
    }

    try {
        // Hide profile section and show registration form
        profileSection.style.display = 'none';
        registrationSection.style.display = 'block';
        registrationSection.classList.remove('hidden');

        // Hide password field since we don't want to change it during edit
        const passwordField = document.getElementById('passwordInput');
        if (passwordField) {
            passwordField.parentElement.style.display = 'none';
        }

        // Remove previous cancel button if exists
        const existingCancelBtn = registrationForm.querySelector('.cancel-btn');
        if (existingCancelBtn) {
            existingCancelBtn.remove();
        }

        // Hide unnecessary sections
        const studentIdSection = document.querySelector('.student-id-section');
        const loginPrompt = registrationForm.querySelector('.login-prompt');
        if (studentIdSection) studentIdSection.style.display = 'none';
        if (loginPrompt) loginPrompt.style.display = 'none';

        // Pre-fill form fields
        document.getElementById('regEmail').value = currentUser.email || '';
        document.getElementById('regEmail').readOnly = true;
        document.getElementById('name').value = currentUser.name || '';
        
        // Handle college selection
        const collegeSelect = document.getElementById('collegeSelect');
        collegeSelect.value = currentUser.collegeId || '';
        
        // Update courses dropdown and select current course
        updateCoursesDropdown(currentUser.collegeId);
        
        // Set other fields
        document.getElementById('year').value = currentUser.year || '1';
        if (currentUser.profilePhoto && regPhotoPreview) {
            regPhotoPreview.src = currentUser.profilePhoto;
        }

        // Create update button container
        const formActions = document.createElement('div');
        formActions.className = 'form-actions';
        
        // Create update button
        const updateBtn = document.createElement('button');
        updateBtn.type = 'button';
        updateBtn.className = 'button submit-btn';
        updateBtn.textContent = 'Update Profile';
        
        // Create cancel button
        const cancelBtn = document.createElement('button');
        cancelBtn.type = 'button';
        cancelBtn.className = 'button cancel-btn';
        cancelBtn.textContent = 'Cancel';

        // Add buttons to container
        formActions.appendChild(updateBtn);
        formActions.appendChild(cancelBtn);

        // Replace existing submit button
        const existingSubmitBtn = registrationForm.querySelector('.submit-btn');
        if (existingSubmitBtn) {
            existingSubmitBtn.parentElement.replaceChild(formActions, existingSubmitBtn);
        }

        // Add click handlers
        updateBtn.onclick = () => handleProfileUpdate(currentUser.id);
        cancelBtn.onclick = () => {
            registrationForm.reset();
            showProfile(currentUser);
        };

        // Select current course after a short delay
        setTimeout(() => {
            const courseSelect = document.getElementById('courseSelect');
            if (courseSelect) {
                courseSelect.value = currentUser.course || '';
                courseSelect.disabled = false;
            }
        }, 100);

    } catch (error) {
        console.error('Error showing edit profile:', error);
        alert('There was an error loading the edit profile form. Please try again.');
        showProfile(currentUser);
    }
}

function handleProfileUpdate(userId) {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.id !== userId) {
        alert('Unauthorized update attempt');
        return;
    }

    // Get form values
    const name = document.getElementById('name').value.trim();
    const collegeId = document.getElementById('collegeSelect').value;
    const college = document.getElementById('collegeSelect').options[document.getElementById('collegeSelect').selectedIndex].text;
    const course = document.getElementById('courseSelect').value;
    const year = document.getElementById('year').value;

    // Validate required fields
    if (!name || !collegeId || !course || !year) {
        alert('Please fill in all required fields');
        return;
    }

    // Create updated user object
    const updatedUser = {
        ...currentUser,
        name,
        collegeId,
        college,
        course,
        year
    };

    // Handle profile photo
    const newProfilePhoto = document.getElementById('reg-photo').files[0];
    if (newProfilePhoto) {
        const reader = new FileReader();
        reader.onload = function(e) {
            updatedUser.profilePhoto = e.target.result;
            saveProfileUpdate(updatedUser);
        };
        reader.readAsDataURL(newProfilePhoto);
    } else {
        saveProfileUpdate(updatedUser);
    }
}

function saveProfileUpdate(updatedUser) {
    try {
        // Update user in mockUsers array
        const userIndex = mockUsers.findIndex(u => u.id === updatedUser.id);
        if (userIndex !== -1) {
            mockUsers[userIndex] = updatedUser;
            localStorage.setItem('mockUsers', JSON.stringify(mockUsers));
        }

        // Update current user in localStorage
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));

        // Show success message
        alert('Profile updated successfully!');

        // Show updated profile
        showProfile(updatedUser);

    } catch (error) {
        console.error('Error saving profile update:', error);
        alert('Error saving profile updates. Please try again.');
    }
}

// Handle logout
function handleLogout() {
  // Clear current user from localStorage
  localStorage.removeItem('currentUser');
  
  // Hide all sections
  hideAllSections();
  
  // Show login section and ensure it's visible
  const loginSection = document.getElementById('loginSection');
  loginSection.classList.remove('hidden');
  loginSection.style.display = 'block';
  
  // Clear any input fields
  if (emailInput) emailInput.value = '';
  if (passwordInput) passwordInput.value = '';
  
  // Reset container styles
  const container = document.querySelector('.container');
  if (container) {
    container.style.display = 'block';
  }
}

// Load user's books
function loadUserBooks(userId) {
  // Get existing HTML books
  const existingBooks = booksList ? booksList.innerHTML : '';
  
  // Filter books by owner ID from mockBooks
  const userBooks = mockBooks.filter(book => book.ownerId === userId);
  
  // Check if user has any books
  if (userBooks.length === 0 && !existingBooks) {
    if (booksList) booksList.style.display = 'none';
    if (noBooksMessage) noBooksMessage.style.display = 'block';
    return;
  }
  
  // Show books list, hide no books message
  if (booksList) {
    booksList.style.display = 'flex';
    // Only clear existing books if we have new ones to add
    if (userBooks.length > 0) {
      booksList.innerHTML = '';
    } else {
      // Keep demo books and add event listeners
      setupExistingBookCards();
    }
  }
  if (noBooksMessage) noBooksMessage.style.display = 'none';
  
  // Add dynamic books if any
  userBooks.forEach(book => {
    const bookCard = createBookCard(book);
    if (booksList) booksList.appendChild(bookCard);
  });
  
  // Populate books grid for dashboard
  populateBooksGrid(userBooks);
}

// Setup event listeners for existing book cards
function setupExistingBookCards() {
  const existingCards = document.querySelectorAll('.book-card');
  
  existingCards.forEach(card => {
    // Add button event listeners
    const editBtn = card.querySelector('.edit-book');
    const removeBtn = card.querySelector('.remove-book');
    const markSoldBtn = card.querySelector('.mark-sold');
    const relistBtn = card.querySelector('.relist-book');
    
    if (editBtn) {
      editBtn.addEventListener('click', () => editBook('demo-book'));
    }
    
    if (removeBtn) {
      removeBtn.addEventListener('click', () => removeBook('demo-book'));
    }
    
    if (markSoldBtn) {
      markSoldBtn.addEventListener('click', () => markBookSold('demo-book'));
    }
    
    if (relistBtn) {
      relistBtn.addEventListener('click', () => relistBook('demo-book'));
    }
  });
}

// Create book card
function createBookCard(book) {
  const bookCard = document.createElement('div');
  bookCard.className = 'book-card';
  bookCard.dataset.bookId = book.id;
  
  bookCard.innerHTML = `
    <img src="${book.image}" alt="${book.title}" class="book-image" />
    <div class="book-details">
      <h3 class="book-title">${book.title}</h3>
      <p class="book-author">By ${book.author}</p>
      <p class="book-price">₹${book.price}</p>
      <span class="book-status status-${book.status}">${book.status.charAt(0).toUpperCase() + book.status.slice(1)}</span>
      <div class="book-action-buttons">
        ${book.status === 'available' ? `
          <button class="button book-action-btn edit-book" data-book-id="${book.id}">Edit</button>
          <button class="button book-action-btn cancel-btn remove-book" data-book-id="${book.id}">Remove</button>
          <button class="button book-action-btn mark-sold" data-book-id="${book.id}">Mark Sold</button>
        ` : `
          <button class="button book-action-btn cancel-btn remove-book" data-book-id="${book.id}">Remove</button>
          <button class="button book-action-btn relist-book" data-book-id="${book.id}">Relist</button>
        `}
      </div>
    </div>
  `;
  
  return bookCard;
}

// Populate books grid
function populateBooksGrid(books) {
  if (!booksGrid) return;
  
  // Clear existing books
  booksGrid.innerHTML = '';
  
  // Add each book to the grid
  books.forEach(book => {
    if (book.status === 'available') {
      const bookItem = document.createElement('div');
      bookItem.className = 'book-item';
      
      bookItem.innerHTML = `
        <img src="${book.image}" alt="${book.title}" class="book-image" />
        <h3 class="book-title">${book.title}</h3>
        <p class="book-author">By ${book.author}</p>
        <p class="book-price">₹${book.price}</p>
      `;
      
      booksGrid.appendChild(bookItem);
    }
  });
}

// Set up book action buttons
function setupBookActionButtons() {
  // Setup event delegation for book actions
  if (booksList) {
    booksList.addEventListener('click', function(e) {
      const target = e.target;
      
      // Get book ID
      const bookId = target.dataset.bookId;
      if (!bookId) return;
      
      // Edit book
      if (target.classList.contains('edit-book')) {
        editBook(bookId);
      }
      
      // Remove book
      if (target.classList.contains('remove-book')) {
        removeBook(bookId);
      }
      
      // Mark book as sold
      if (target.classList.contains('mark-sold')) {
        markBookSold(bookId);
      }
      
      // Relist book
      if (target.classList.contains('relist-book')) {
        relistBook(bookId);
      }
    });
  }
  
  // Setup start selling button
  if (startSellingBtn) {
    startSellingBtn.addEventListener('click', function() {
      window.location.href = 'book.html';
    });
  }
}

// Edit book
function editBook(bookId) {
  // In a real app, this would navigate to the edit book page
  alert(`Edit book functionality for book ID: ${bookId}`);
}

// Remove book
function removeBook(bookId) {
  if (confirm('Are you sure you want to remove this book?')) {
    // Remove book from mockBooks array
    const bookIndex = mockBooks.findIndex(b => b.id === bookId);
    if (bookIndex !== -1) {
      mockBooks.splice(bookIndex, 1);
      localStorage.setItem('mockBooks', JSON.stringify(mockBooks));
      
      // Reload user's books
      const user = getCurrentUser();
      if (user) {
        loadUserBooks(user.id);
      }
    }
  }
}

// Mark book as sold
function markBookSold(bookId) {
  // Update book status in mockBooks array
  const bookIndex = mockBooks.findIndex(b => b.id === bookId);
  if (bookIndex !== -1) {
    mockBooks[bookIndex].status = 'sold';
    localStorage.setItem('mockBooks', JSON.stringify(mockBooks));
    
    // Reload user's books
    const user = getCurrentUser();
    if (user) {
      loadUserBooks(user.id);
    }
  }
}

// Relist book
function relistBook(bookId) {
  // Update book status in mockBooks array
  const bookIndex = mockBooks.findIndex(b => b.id === bookId);
  if (bookIndex !== -1) {
    mockBooks[bookIndex].status = 'available';
    localStorage.setItem('mockBooks', JSON.stringify(mockBooks));
    
    // Reload user's books
    const user = getCurrentUser();
    if (user) {
      loadUserBooks(user.id);
    }
  }
}

// Load pending students for approval
function loadPendingStudents(collegeId) {
  // Filter pending students by collegeId
  const collegeStudents = pendingStudents.filter(s => s.collegeId === collegeId);
  
  // Check if there are any pending students
  if (collegeStudents.length === 0) {
    studentList.innerHTML = '';
    noStudentsMessage.classList.remove('hidden');
    return;
  }
  
  // Show student list, hide no students message
  noStudentsMessage.classList.add('hidden');
  
  // Clear existing students
  studentList.innerHTML = '';
  
  // Add each student to the list
  collegeStudents.forEach(student => {
    const studentItem = document.createElement('div');
    studentItem.className = 'student-item';
    studentItem.dataset.studentId = student.id;
    
    studentItem.innerHTML = `
      <div class="student-info">
        <img src="${student.profilePhoto}" alt="${student.name}" class="student-photo" />
        <div class="student-details">
          <h4>${student.name}</h4>
          <p>${student.course}, Year ${student.year}</p>
          <p>${student.email}</p>
        </div>
      </div>
      <div class="student-id-preview">
        <img src="${student.studentId}" alt="Student ID" class="id-image" />
      </div>
      <div class="approval-actions">
        <button class="button approve-btn" data-student-id="${student.id}">Approve</button>
        <button class="button reject-btn" data-student-id="${student.id}">Reject</button>
      </div>
    `;
    
    studentList.appendChild(studentItem);
  });
  
  // Set up approve/reject buttons
  setupApprovalButtons();
}

// Set up approval buttons
function setupApprovalButtons() {
  // Setup event delegation for approval actions
  studentList.addEventListener('click', function(e) {
    const target = e.target;
    
    // Get student ID
    const studentId = target.dataset.studentId;
    if (!studentId) return;
    
    // Approve student
    if (target.classList.contains('approve-btn')) {
      approveStudent(studentId);
    }
    
    // Reject student
    if (target.classList.contains('reject-btn')) {
      rejectStudent(studentId);
    }
  });
}

// Approve student
function approveStudent(studentId) {
  // Find student in pendingStudents array
  const studentIndex = pendingStudents.findIndex(s => s.id === studentId);
  if (studentIndex === -1) return;
  
  // Get student data
  const student = pendingStudents[studentIndex];
  
  // Mark student as approved
  student.approved = true;
  
  // Add student to mockUsers array
  mockUsers.push(student);
  localStorage.setItem('mockUsers', JSON.stringify(mockUsers));
  
  // Remove student from pendingStudents array
  pendingStudents.splice(studentIndex, 1);
  localStorage.setItem('pendingStudents', JSON.stringify(pendingStudents));
  
  // Remove pending message if student is currently logged in
  const currentUser = getCurrentUser();
  if (currentUser && currentUser.id === student.id) {
    // Update current user's approved status
    currentUser.approved = true;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Remove pending message
    const pendingMessage = document.querySelector('.pending-message');
    if (pendingMessage) {
      pendingMessage.remove();
    }

    // Show dashboard elements
    const dashboardElements = {
      '.profile-dashboard': 'grid',
      '.user-info-sidebar': 'block',
      '.user-stats': 'grid',
      '.user-books-section': 'block',
      '#my-books-section': 'block'
    };

    Object.entries(dashboardElements).forEach(([selector, displayValue]) => {
      const element = document.querySelector(selector);
      if (element) {
        element.style.display = displayValue;
      }
    });
  }
  
  // Reload pending students for admin view
  const admin = getCurrentUser();
  if (admin) {
    loadPendingStudents(admin.collegeId);
  }
  
  alert(`${student.name} has been approved`);
}

// Reject student
function rejectStudent(studentId) {
  if (confirm('Are you sure you want to reject this student?')) {
    // Find student in pendingStudents array
    const studentIndex = pendingStudents.findIndex(s => s.id === studentId);
    if (studentIndex === -1) return;
    
    // Get student name for confirmation
    const studentName = pendingStudents[studentIndex].name;
    
    // Remove student from pendingStudents array
    pendingStudents.splice(studentIndex, 1);
    localStorage.setItem('pendingStudents', JSON.stringify(pendingStudents));
    
    // Reload pending students
    const admin = getCurrentUser();
    if (admin) {
      loadPendingStudents(admin.collegeId);
    }
    
    alert(`${studentName} has been rejected`);
  }
}

document.addEventListener('DOMContentLoaded', function() {
    // Get college and course select elements
    const collegeSelect = document.getElementById('collegeSelect');
    const courseSelect = document.getElementById('courseSelect');
    const adminCollegeSelect = document.getElementById('adminCollegeSelect');

    // Populate colleges dropdown
    function populateColleges(selectElement) {
        selectElement.innerHTML = '<option value="">Select Institute</option>';
        Object.keys(collegeData).forEach(college => {
            const option = document.createElement('option');
            option.value = college;
            option.textContent = college;
            selectElement.appendChild(option);
        });
    }

    // Populate courses based on selected college
    function updateCourses(college) {
        courseSelect.innerHTML = '<option value="">Select Course</option>';
        if (college && collegeData[college]) {
            collegeData[college].forEach(course => {
                const option = document.createElement('option');
                option.value = course;
                option.textContent = course;
                courseSelect.appendChild(option);
            });
            courseSelect.disabled = false;
        } else {
            courseSelect.disabled = true;
        }
    }

    // Initialize college dropdowns
    populateColleges(collegeSelect);
    populateColleges(adminCollegeSelect);

    // Add change event listener to college select
    collegeSelect.addEventListener('change', (e) => {
        updateCourses(e.target.value);
    });
});