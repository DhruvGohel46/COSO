document.addEventListener('DOMContentLoaded', function() {
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
});
