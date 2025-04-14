// api.js - Create this new file for API communication

// Add this at the top of api.js
function getCsrfToken() {
    const name = 'csrftoken';
    let cookieValue = null;
    
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Base URL for all API calls
const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Helper function to handle fetch with consistent error handling
async function fetchAPI(endpoint, options = {}) {
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCsrfToken(),
        },
        credentials: 'include', // Important for session authentication
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...defaultOptions,
            ...options,
            headers: {
                ...defaultOptions.headers,
                ...options.headers,
            },
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
}

// Authentication functions
const authAPI = {
    // Student registration
    async registerStudent(studentData) {
        const formData = new FormData();
        
        // Add all text fields
        for (const [key, value] of Object.entries(studentData)) {
            if (key !== 'profile_photo' && key !== 'student_id_doc') {
                formData.append(key, value);
            }
        }
        
        // Add file fields
        if (studentData.profile_photo) {
            formData.append('profile_photo', studentData.profile_photo);
        }
        if (studentData.student_id_doc) {
            formData.append('student_id_doc', studentData.student_id_doc);
        }
        
        return fetchAPI('register/student/', {
            method: 'POST',
            body: formData,
            headers: {},  // Let browser set content-type for FormData
        });
    },
    
    // Admin registration
    async registerAdmin(adminData) {
        return fetchAPI('register/admin/', {
            method: 'POST',
            body: JSON.stringify(adminData),
        });
    },
    
    // Login
    async login(email, password) {
        return fetchAPI('login/', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
    },
    
    // Logout
    async logout() {
        return fetchAPI('logout/', { method: 'POST' });
    },
    
    // Get current user profile
    async getProfile() {
        return fetchAPI('profile/');
    },
    
    // Update user profile
    async updateProfile(profileData) {
        const formData = new FormData();
        
        // Add all text fields
        for (const [key, value] of Object.entries(profileData)) {
            if (typeof value !== 'object') {
                formData.append(key, value);
            }
        }
        
        // Add file fields if provided
        if (profileData.profile_photo instanceof File) {
            formData.append('profile_photo', profileData.profile_photo);
        }
        if (profileData.student_id_doc instanceof File) {
            formData.append('student_id_doc', profileData.student_id_doc);
        }
        
        return fetchAPI('profile/', {
            method: 'PUT',
            body: formData,
            headers: {},  // Let browser set content-type for FormData
        });
    }
};

// Event functions
const eventsAPI = {
    // Get all events with optional filters
    async getEvents(filters = {}) {
        const queryParams = new URLSearchParams();
        
        // Add filters to query string
        for (const [key, value] of Object.entries(filters)) {
            if (value) {
                queryParams.append(key, value);
            }
        }
        
        const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
        return fetchAPI(`events/${queryString}`);
    },
    
    // Get a single event
    async getEvent(eventId) {
        return fetchAPI(`events/${eventId}/`);
    },
    
    // Create a new event
    async createEvent(eventData) {
        const formData = new FormData();
        
        // Add all text fields
        for (const [key, value] of Object.entries(eventData)) {
            if (key !== 'flyer') {
                formData.append(key, value);
            }
        }
        
        // Add flyer if provided
        if (eventData.flyer instanceof File) {
            formData.append('flyer', eventData.flyer);
        }
        
        return fetchAPI('events/', {
            method: 'POST',
            body: formData,
            headers: {},  // Let browser set content-type for FormData
        });
    },
    
    // Update an event
    async updateEvent(eventId, eventData) {
        const formData = new FormData();
        
        // Add all text fields
        for (const [key, value] of Object.entries(eventData)) {
            if (key !== 'flyer') {
                formData.append(key, value);
            }
        }
        
        // Add flyer if provided
        if (eventData.flyer instanceof File) {
            formData.append('flyer', eventData.flyer);
        }
        
        return fetchAPI(`events/${eventId}/`, {
            method: 'PUT',
            body: formData,
            headers: {},  // Let browser set content-type for FormData
        });
    },
    
    // Delete an event
    async deleteEvent(eventId) {
        return fetchAPI(`events/${eventId}/`, {
            method: 'DELETE',
        });
    }
};

// Posts functions
const postsAPI = {
    // Get all posts
    async getPosts() {
        return fetchAPI('posts/');
    },
    
    // Get a single post
    async getPost(postId) {
        return fetchAPI(`posts/${postId}/`);
    },
    
    // Create a new post (admin only)
    async createPost(postData) {
        const formData = new FormData();
        
        // Handle photos
        if (postData.photos) {
            postData.photos.forEach(photo => {
                formData.append('photos', photo);
            });
        }
        
        // Handle other fields
        formData.append('caption', postData.caption);
        formData.append('location', postData.location || '');
        formData.append('visibility', postData.visibility);
        
        // Handle tags array
        if (postData.tags) {
            postData.tags.forEach(tag => {
                formData.append('tags', tag);
            });
        }
        
        return fetchAPI('posts/', {
            method: 'POST',
            body: formData,
            headers: {},  // Let browser set content-type for FormData
        });
    },
    
    // Update a post
    async updatePost(postId, postData) {
        return fetchAPI(`posts/${postId}/`, {
            method: 'PUT',
            body: JSON.stringify(postData),
        });
    },
    
    // Delete a post
    async deletePost(postId) {
        return fetchAPI(`posts/${postId}/`, {
            method: 'DELETE',
        });
    }
};

// Admin dashboard functions
const adminAPI = {
    // Get admin dashboard data
    async getDashboard() {
        return fetchAPI('admin/dashboard/');
    },
    
    // Approve student
    async approveStudent(studentId) {
        return fetchAPI(`admin/approve/${studentId}/`, {
            method: 'POST',
        });
    },
    
    // Reject student
    async rejectStudent(studentId) {
        return fetchAPI(`admin/reject/${studentId}/`, {
            method: 'POST',
        });
    }
};

// Export all API endpoints
export { authAPI, eventsAPI, postsAPI, adminAPI };