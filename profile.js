import { collegeData } from "./colleges and courses list.js";

document.addEventListener('DOMContentLoaded', function () {
    // Profile Picture Upload
    const profilePhotoInput = document.getElementById('profile-photo');
    const profilePhotoPreview = document.getElementById('profile-photo-preview');

    profilePhotoInput.addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                profilePhotoPreview.src = e.target.result;
            }
            reader.readAsDataURL(file);
        }
    });

    const collegeSelect = document.getElementById('collegeSelect');
    const courseSelect = document.getElementById('courseSelect');

    // Populate the college dropdown on page load
    Object.keys(collegeData).forEach(college => {
        const option = document.createElement('option');
        option.value = college;
        option.textContent = college;
        collegeSelect.appendChild(option);
    });
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


    // Registration Form Handling
    const registrationForm = document.getElementById('registrationForm');
    const editProfileBtn = document.getElementById('editProfileBtn');

    function handleRegistration(event) {
        event.preventDefault();

        const password = document.getElementById('passwordInput').value;
        if (!password) {
            alert('Please enter a password to complete registration.');
            return;
        }

        const formData = {
            name: document.getElementById('name').value,
            college: collegeSelect.value,
            course: courseSelect.value,
            year: document.getElementById('year').value,
            password: password
        };

        // Save to localStorage
        localStorage.setItem('userProfile', JSON.stringify(formData));

        // Update profile display
        updateProfileDisplay(formData);

        // Lock the form
        lockForm();

        alert('Registration successful!');
    }

    registrationForm.addEventListener('submit', handleRegistration);

    // Load profile data if exists
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
        updateProfileDisplay(JSON.parse(savedProfile));
        lockForm();
    }

    // Edit Profile Button
    editProfileBtn.addEventListener('click', function () {
        unlockForm();
    });

    // Password Update Handling
    const updatePasswordBtn = document.getElementById('updatePasswordBtn');
    updatePasswordBtn.addEventListener('click', function () {
        const password = document.getElementById('passwordInput').value;
        if (password) {
            alert('Password updated successfully!');
        } else {
            alert('Please enter a new password.');
        }
    });
});

function updateProfileDisplay(profileData) {
    document.getElementById('profile-name').textContent = profileData.name;
    document.getElementById('profile-college').textContent = profileData.college;
    document.getElementById('profile-course').textContent = profileData.course;
}

function lockForm() {
    const inputs = document.querySelectorAll('#registrationForm input, #registrationForm select');
    inputs.forEach(input => input.disabled = true);
    document.getElementById('registrationForm').classList.add('locked');
    document.getElementById('editProfileBtn').classList.remove('hidden');
    document.getElementById('editProfileBtn').textContent = 'Edit Profile';
}

function unlockForm() {
    const inputs = document.querySelectorAll('#registrationForm input, #registrationForm select');
    inputs.forEach(input => input.disabled = false);
    document.getElementById('registrationForm').classList.remove('locked');
    document.getElementById('editProfileBtn').textContent = 'Save Changes';

    // Update form submission to handle saving changes
    const registrationForm = document.getElementById('registrationForm');
    registrationForm.removeEventListener('submit', handleRegistration);
    registrationForm.addEventListener('submit', handleSaveChanges);
}

function handleSaveChanges(event) {
    event.preventDefault();

    const formData = {
        name: document.getElementById('name').value,
        college: document.getElementById('collegeSelect').value,
        course: document.getElementById('courseSelect').value,
        year: document.getElementById('year').value,
        password: document.getElementById('passwordInput').value
    };

    // Save updated profile
    localStorage.setItem('userProfile', JSON.stringify(formData));
    updateProfileDisplay(formData);
    lockForm();

    alert('Profile updated successfully!');
}
