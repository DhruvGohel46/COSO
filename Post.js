// create-post.js - Handles all functionality for the Create Post page

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const photoInput = document.getElementById('post-photos');
    const photoPreviewContainer = document.getElementById('photo-preview-container');
    const uploadBtn = document.getElementById('upload-photo-btn');
    const form = document.getElementById('create-post-form');
    const captionInput = document.getElementById('post-caption');
    const locationInput = document.getElementById('post-location');
    const tagsInput = document.getElementById('post-tags');
    const visibilitySelect = document.getElementById('post-visibility');
    
    // Track uploaded photos
    let uploadedPhotos = [];
    const MAX_PHOTOS = 5;
    
    // Initialize the page
    function init() {
        // Set up event listeners
        uploadBtn.addEventListener('click', triggerPhotoUpload);
        photoInput.addEventListener('change', handlePhotoSelection);
        form.addEventListener('submit', submitPost);
        
        // Check for any saved draft in local storage
        checkForSavedDraft();
        
        // Add auto-save functionality
        setupAutoSave();
    }
    
    // Trigger the file input when the upload button is clicked
    function triggerPhotoUpload() {
        photoInput.click();
    }
    
    // Handle photo selection from file input
    function handlePhotoSelection() {
        if (photoInput.files.length === 0) return;
        
        // Clear placeholder when photos are selected
        if (photoPreviewContainer.querySelector('.photo-placeholder')) {
            photoPreviewContainer.innerHTML = '';
        }
        
        // Calculate how many more photos can be added
        const currentPhotoCount = photoPreviewContainer.querySelectorAll('.photo-preview').length;
        const remainingSlots = MAX_PHOTOS - currentPhotoCount;
        
        if (remainingSlots <= 0) {
            alert(`Maximum ${MAX_PHOTOS} photos allowed. Please remove some photos first.`);
            return;
        }
        
        // Process only the number of photos that can fit
        const filesToProcess = Math.min(photoInput.files.length, remainingSlots);
        
        for (let i = 0; i < filesToProcess; i++) {
            const file = photoInput.files[i];
            
            // Validate file type
            if (!file.type.match('image.*')) {
                continue;
            }
            
            // Add to uploaded photos array
            uploadedPhotos.push(file);
            
            // Create preview
            createPhotoPreview(file);
        }
        
        // Reset file input to allow selecting the same file again
        photoInput.value = '';
        
        // Update hint text with remaining count
        updatePhotoCountHint();
        
        // Save draft
        saveDraft();
    }
    
    // Create a preview element for a photo
    function createPhotoPreview(file) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const photoPreview = document.createElement('div');
            photoPreview.className = 'photo-preview';
            photoPreview.dataset.filename = file.name; // Store filename for reference
            
            const img = document.createElement('img');
            img.src = e.target.result;
            img.alt = 'Preview';
            
            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-photo';
            removeBtn.innerHTML = '×';
            removeBtn.addEventListener('click', function() {
                removePhoto(photoPreview, file);
            });
            
            photoPreview.appendChild(img);
            photoPreview.appendChild(removeBtn);
            photoPreviewContainer.appendChild(photoPreview);
        };
        
        reader.readAsDataURL(file);
    }
    
    // Remove a photo from preview and storage
    function removePhoto(previewElement, file) {
        // Remove from DOM
        previewElement.remove();
        
        // Remove from uploadedPhotos array
        const filename = previewElement.dataset.filename;
        uploadedPhotos = uploadedPhotos.filter(f => f.name !== filename);
        
        // Show placeholder if no photos left
        if (photoPreviewContainer.querySelectorAll('.photo-preview').length === 0) {
            addPlaceholder();
        }
        
        // Update hint text
        updatePhotoCountHint();
        
        // Save draft
        saveDraft();
    }
    
    // Add placeholder to photo container
    function addPlaceholder() {
        const placeholder = document.createElement('div');
        placeholder.className = 'photo-placeholder';
        placeholder.innerHTML = '<span>+</span><p>Add Photos</p>';
        photoPreviewContainer.innerHTML = '';
        photoPreviewContainer.appendChild(placeholder);
    }
    
    // Update the hint text with remaining photo count
    function updatePhotoCountHint() {
        const photoHint = document.querySelector('.photo-hint');
        const currentCount = photoPreviewContainer.querySelectorAll('.photo-preview').length;
        const remaining = MAX_PHOTOS - currentCount;
        
        photoHint.textContent = `You can upload ${remaining} more photo${remaining !== 1 ? 's' : ''}`;
    }
    
    // Handle form submission
    function submitPost(e) {
        e.preventDefault();
        
        // Validate form
        if (!validateForm()) {
            return;
        }
        
        // Create FormData object to handle file uploads
        const formData = new FormData();
        
        // Add all photos
        uploadedPhotos.forEach((photo, index) => {
            formData.append(`photo_${index}`, photo);
        });
        
        // Add other form fields
        formData.append('caption', captionInput.value);
        formData.append('location', locationInput.value);
        formData.append('tags', tagsInput.value);
        formData.append('visibility', visibilitySelect.value);
        
        // Show loading state
        toggleLoadingState(true);
        
        // In a real application, you would send the data to the server here
        // Using fetch API to simulate server communication
        setTimeout(() => {
            // This timeout simulates network request
            console.log('Post data:', {
                photos: uploadedPhotos.map(p => p.name),
                caption: captionInput.value,
                location: locationInput.value,
                tags: tagsInput.value,
                visibility: visibilitySelect.value
            });
            
            // Clear saved draft after successful submission
            localStorage.removeItem('post_draft');
            
            // Show success message
            showNotification('Post created successfully!', 'success');
            
            // Reset form after small delay
            setTimeout(() => {
                resetForm();
                toggleLoadingState(false);
                
                // Redirect to home page
                // window.location.href = 'index.html';
                
                // Redirect to profile page
            window.location.href = 'profile.html';
            }, 1000);
        }, 1500);
    }
    
    // Validate the form
    function validateForm() {
        // Check if at least one photo is uploaded
        if (uploadedPhotos.length === 0) {
            showNotification('Please upload at least one photo to create a post', 'error');
            return false;
        }
        
        // Check if caption is provided
        if (!captionInput.value.trim()) {
            showNotification('Please write a caption for your post', 'error');
            captionInput.focus();
            return false;
        }
        
        return true;
    }
    
    // Toggle loading state during form submission
    function toggleLoadingState(isLoading) {
        const submitBtn = form.querySelector('button[type="submit"]');
        
        if (isLoading) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Posting...';
            submitBtn.classList.add('loading');
        } else {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Share Post';
            submitBtn.classList.remove('loading');
        }
    }
    
    // Show notification message
    function showNotification(message, type = 'info') {
        // Check if notification container exists, create if not
        let notificationContainer = document.querySelector('.notification-container');
        
        if (!notificationContainer) {
            notificationContainer = document.createElement('div');
            notificationContainer.className = 'notification-container';
            document.body.appendChild(notificationContainer);
            
            // Add styles for notification container
            notificationContainer.style.position = 'fixed';
            notificationContainer.style.top = '20px';
            notificationContainer.style.right = '20px';
            notificationContainer.style.zIndex = '1000';
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Style notification
        notification.style.padding = '12px 20px';
        notification.style.marginBottom = '10px';
        notification.style.borderRadius = '4px';
        notification.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
        notification.style.transition = 'opacity 0.3s ease-in-out';
        
        // Set color based on type
        if (type === 'error') {
            notification.style.backgroundColor = '#f44336';
            notification.style.color = 'white';
        } else if (type === 'success') {
            notification.style.backgroundColor = '#4CAF50';
            notification.style.color = 'white';
        } else {
            notification.style.backgroundColor = '#2196F3';
            notification.style.color = 'white';
        }
        
        // Add to container
        notificationContainer.appendChild(notification);
        
        // Remove after delay
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
    
    // Reset form to initial state
    function resetForm() {
        form.reset();
        uploadedPhotos = [];
        photoPreviewContainer.innerHTML = '';
        addPlaceholder();
        updatePhotoCountHint();
    }
    
    // Save current draft to local storage
    function saveDraft() {
        // Create a draft object with current form data
        const draft = {
            // We can't store File objects directly in localStorage,
            // so we'll just track the count for the UI restoration
            photoCount: uploadedPhotos.length,
            caption: captionInput.value,
            location: locationInput.value,
            tags: tagsInput.value,
            visibility: visibilitySelect.value,
            timestamp: new Date().getTime()
        };
        
        localStorage.setItem('post_draft', JSON.stringify(draft));
    }
    
    // Check for saved draft and restore if found
    function checkForSavedDraft() {
        const savedDraft = localStorage.getItem('post_draft');
        
        if (savedDraft) {
            try {
                const draft = JSON.parse(savedDraft);
                
                // Check if draft is less than 24 hours old
                const now = new Date().getTime();
                const draftAge = now - draft.timestamp;
                const oneDayInMs = 24 * 60 * 60 * 1000;
                
                if (draftAge < oneDayInMs) {
                    // Ask user if they want to restore the draft
                    const confirmed = confirm('We found a saved draft of your post. Would you like to restore it?');
                    
                    if (confirmed) {
                        // Restore form data
                        captionInput.value = draft.caption || '';
                        locationInput.value = draft.location || '';
                        tagsInput.value = draft.tags || '';
                        visibilitySelect.value = draft.visibility || 'public';
                        
                        // Note about photos
                        if (draft.photoCount > 0) {
                            showNotification(`Your draft had ${draft.photoCount} photos. Please re-upload them.`, 'info');
                        }
                    } else {
                        // User declined to restore, delete the draft
                        localStorage.removeItem('post_draft');
                    }
                } else {
                    // Draft is too old, remove it
                    localStorage.removeItem('post_draft');
                }
            } catch (e) {
                console.error('Error restoring draft:', e);
                localStorage.removeItem('post_draft');
            }
        }
    }
    
    // Set up auto-save functionality
    function setupAutoSave() {
        const formElements = [captionInput, locationInput, tagsInput, visibilitySelect];
        
        formElements.forEach(element => {
            element.addEventListener('input', debounce(saveDraft, 1000));
        });
    }
    
    // Debounce function to limit auto-save frequency
    function debounce(func, delay) {
        let timer;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timer);
            timer = setTimeout(() => {
                func.apply(context, args);
            }, delay);
        };
    }
    
    // Initialize the page
    init();
});