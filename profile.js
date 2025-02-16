document.addEventListener('DOMContentLoaded', function() {
    // Profile Picture Upload
    const profilePhotoInput = document.getElementById('profile-photo');
    const profilePhotoPreview = document.getElementById('profile-photo-preview');
    
    profilePhotoInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                profilePhotoPreview.src = e.target.result;
            }
            reader.readAsDataURL(file);
        }
    });

    // Registration Form Handling
    const registrationForm = document.getElementById('registrationForm');
    
    registrationForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const formData = {
            name: document.getElementById('name').value,
            college: document.getElementById('college').value,
            course: document.getElementById('course').value,
            year: document.getElementById('year').value
        };

        // Save to localStorage
        localStorage.setItem('userProfile', JSON.stringify(formData));
        
        // Update profile display
        updateProfileDisplay(formData);
        
        alert('Registration successful!');
    });

    // Load profile data if exists
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
        updateProfileDisplay(JSON.parse(savedProfile));
    }

    // Edit Profile Button
    const editBtn = document.querySelector('.edit-btn');
    editBtn.addEventListener('click', function() {
        // Clear registration form
        registrationForm.reset();
        
        // Clear localStorage
        localStorage.removeItem('userProfile');
        
        // Reset profile display
        updateProfileDisplay({
            name: 'John Doe',
            college: 'University of Example',
            course: 'Computer Science'
        });
    });
});

function updateProfileDisplay(profileData) {
    document.getElementById('profile-name').textContent = profileData.name;
    document.getElementById('profile-college').textContent = profileData.college;
    document.getElementById('profile-course').textContent = profileData.course;
}
