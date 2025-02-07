document.addEventListener('DOMContentLoaded', function() {
    const profileForm = document.getElementById('profile-form');
    
    if (profileForm) {
        profileForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const fileInput = document.getElementById('profile-photo');
            const file = fileInput.files[0];
            
            if (!file) {
                alert('Please select a file to upload.');
                return;
            }

            // Show loading spinner
            document.getElementById('loading-spinner').style.display = 'block';
            
            try {
                const reader = new FileReader();
                reader.onload = function(e) {
                    document.getElementById('photo-preview').innerHTML = `<img src="${e.target.result}" alt="Profile Photo">`;
                    
                    // Send image data to server
                    const formData = new FormData();
                    formData.append('profile-photo', file);
                    
                    fetch('/api/profile/photo', {
                        method: 'POST',
                        body: formData
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            document.getElementById('loading-spinner').style.display = 'none';
                            console.log('Profile photo uploaded successfully');
                        } else {
                            alert('Error uploading profile photo: ' + data.message);
                        }
                    })
                    .catch(error => {
                        alert('Error uploading profile photo: ' + error.message);
                    });
                };
                reader.readAsDataURL(file);
            } catch(error) {
                console.error('Error:', error);
                alert('An error occurred during file processing');
            }
        });
    }
});
