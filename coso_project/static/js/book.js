document.addEventListener('DOMContentLoaded', function() {
  // Main navigation buttons
  const buyBtn = document.querySelector('.buy-btn');
  const sellBtn = document.querySelector('.sell-btn');
  const landingContainer = document.querySelector('.landing-container');
  const marketplaceContent = document.querySelector('.marketplace-content');
  const backBtn = document.querySelector('.back-btn');

  // Book cards and filter elements
  const filterItems = document.querySelectorAll('.filter-item');
  const bookCards = document.querySelectorAll('.book-card');
  const searchInput = document.querySelector('.search-box input');
  const searchButton = document.querySelector('.searchB');

  // Book category mapping
  const categoryMap = {
      'Clean Code': 'Computer Science',
      'Introduction to Algorithms': 'Computer Science',
      'Artificial Intelligence: A Modern Approach': 'Computer Science',
      'You Don\'t Know JS': 'Computer Science',
      'The Pragmatic Programmer': 'Computer Science',
      'The Art of Computer Programming': 'Computer Science',
      
      'Engineering Mechanics': 'Engineering',
      'Strength of Materials': 'Engineering',
      'Machine Design': 'Engineering',
      'Control Systems Engineering': 'Engineering',
      'Fluid Mechanics': 'Engineering',
      'Electrical Technology': 'Engineering',
      
      'Gray\'s Anatomy': 'Medicine',
      'Robbins Basic Pathology': 'Medicine',
      'Bates\' Guide to Physical Examination': 'Medicine',
      'Essentials of Medical Pharmacology': 'Medicine',
      'Harrison\'s Principles of Internal Medicine': 'Medicine',
      'Davidson\'s Principles & Practice of Medicine': 'Medicine',
      
      'The Story of Art': 'Arts',
      'Ways of Seeing': 'Arts',
      'Art: A World History': 'Arts',
      'Lives of the Artists': 'Arts',
      'Art Through the Ages': 'Arts',
      'Steal Like an Artist': 'Arts',
      
      'Rich Dad Poor Dad': 'Business',
      'The Lean Startup': 'Business',
      'Good to Great': 'Business',
      'Zero to One': 'Business',
      'Start with Why': 'Business',
      'The Intelligent Investor': 'Business'
  };

  // Initialize category attributes for each book card
  bookCards.forEach(card => {
      const titleElement = card.querySelector('.book-title');
      if (titleElement) {
          const title = titleElement.textContent.trim();
          const category = categoryMap[title] || 'Other';
          card.setAttribute('data-category', category);
      }
  });

  // Show specific section and hide landing page
  function showSection(sectionId) {
      landingContainer.style.display = 'none';
      marketplaceContent.style.display = 'block';
      
      // Hide all sections first
      document.querySelectorAll('.content-section').forEach(section => {
          section.style.display = 'none';
      });
      
      // Show the selected section
      document.getElementById(sectionId).style.display = 'block';
  }

  // Return to landing page
  function backToHome() {
      marketplaceContent.style.display = 'none';
      landingContainer.style.display = 'block';
  }

  // Filter books by category
  function filterBooks(selectedCategory) {
      bookCards.forEach(card => {
          const cardCategory = card.getAttribute('data-category');
          
          if (selectedCategory === 'All') {
              card.style.display = 'flex'; // Use flex to maintain card layout
          } else {
              card.style.display = (cardCategory === selectedCategory) ? 'flex' : 'none';
          }
      });
  }

  // Search functionality
  function searchBooks(searchTerm) {
      if (!searchTerm) {
          // If search term is empty, show all books based on current category filter
          const activeFilter = document.querySelector('.filter-item.active');
          filterBooks(activeFilter ? activeFilter.textContent.trim() : 'All');
          return;
      }

      searchTerm = searchTerm.toLowerCase();
      
      bookCards.forEach(card => {
          const title = card.querySelector('.book-title').textContent.toLowerCase();
          const author = card.querySelector('.book-author').textContent.toLowerCase();
          const seller = card.querySelector('.book-seller').textContent.toLowerCase();
          
          if (title.includes(searchTerm) || author.includes(searchTerm) || seller.includes(searchTerm)) {
              card.style.display = 'flex'; // Show matching cards
          } else {
              card.style.display = 'none'; // Hide non-matching cards
          }
      });
  }

  // Book image preview functionality
  const bookImageInput = document.getElementById('book-image');
  const bookImagePreview = document.getElementById('bookImagePreview');
  
  if (bookImageInput && bookImagePreview) {
      bookImageInput.addEventListener('change', function() {
          const file = this.files[0];
          if (file) {
              const reader = new FileReader();
              reader.onload = function(e) {
                  bookImagePreview.innerHTML = `<img src="${e.target.result}" alt="Book Preview">`;
              }
              reader.readAsDataURL(file);
          }
      });
  }

  // Form submission handler
  const sellBookForm = document.getElementById('sellBookForm');
  if (sellBookForm) {
      sellBookForm.addEventListener('submit', async function(e) {
          e.preventDefault();
          
          // Get current user from localStorage
          const currentUser = JSON.parse(localStorage.getItem('currentUser'));
          if (!currentUser) {
              alert('Please login to list books');
              window.location.href = 'profile.html';
              return;
          }

          // Validate required fields
          const requiredFields = ['book-title', 'book-author', 'book-price', 'book-course', 'book-condition', 'book-description'];
          const missingFields = requiredFields.filter(fieldId => !document.getElementById(fieldId).value.trim());
          
          if (missingFields.length > 0) {
              alert('Please fill in all required fields');
              return;
          }

          try {
              // Get form values
              const bookData = {
                  id: 'book_' + Date.now(),
                  title: document.getElementById('book-title').value.trim(),
                  author: document.getElementById('book-author').value.trim(),
                  price: document.getElementById('book-price').value.trim(),
                  status: 'available',
                  ownerId: currentUser.id,
                  sellerName: currentUser.name, // Add seller name
                  course: document.getElementById('book-course').value,
                  condition: document.getElementById('book-condition').value,
                  description: document.getElementById('book-description').value.trim(),
                  edition: document.getElementById('book-edition').value.trim() || 'N/A',
                  dateAdded: new Date().toISOString()
              };

              // Handle image
              const imageFile = document.getElementById('book-image').files[0];
              if (!imageFile) {
                  alert('Please upload a book image');
                  return;
              }

              // Convert image to base64
              const base64Image = await new Promise((resolve) => {
                  const reader = new FileReader();
                  reader.onload = (e) => resolve(e.target.result);
                  reader.readAsDataURL(imageFile);
              });

              bookData.image = base64Image;

              // Save book
              saveBook(bookData);

          } catch (error) {
              console.error('Error submitting book:', error);
              alert('There was an error submitting your book. Please try again.');
          }
      });
  }

  // Function to save book to localStorage
  function saveBook(bookData) {
      if (!bookData || !bookData.id || !bookData.title) {
          console.error('Invalid book data');
          alert('Missing required book information');
          return;
      }

      try {
          // Get existing books array or initialize new one
          let myBooks = [];
          const existingBooks = localStorage.getItem('mockBooks');
          
          if (existingBooks) {
              try {
                  myBooks = JSON.parse(existingBooks);
                  if (!Array.isArray(myBooks)) {
                      myBooks = [];
                  }
              } catch (parseError) {
                  console.error('Error parsing existing books:', parseError);
                  myBooks = [];
              }
          }
          
          // Add new book
          myBooks.push(bookData);
          
          // Save back to localStorage
          localStorage.setItem('mockBooks', JSON.stringify(myBooks));
          
          // Reset form and preview
          if (sellBookForm) {
              sellBookForm.reset();
          }
          if (bookImagePreview) {
              bookImagePreview.innerHTML = '<span>Book Image</span>';
          }

          alert('Your book has been successfully listed for sale!');
          
          // Redirect to profile page after short delay
          setTimeout(() => {
              window.location.href = 'profile.html';
          }, 1000);

      } catch (error) {
          console.error('Storage error:', error);
          // Check if it's a storage quota exceeded error
          if (error.name === 'QuotaExceededError') {
              alert('Storage limit reached. Please try with a smaller image size.');
          } else {
              alert('Unable to save the book. Please try again or contact support if the problem persists.');
          }
      }
  }

  // Contact seller button functionality
  const contactButtons = document.querySelectorAll('.contact-btn');
  contactButtons.forEach(button => {
      button.addEventListener('click', function() {
          const bookTitle = this.closest('.book-details').querySelector('.book-title').textContent;
          const seller = this.closest('.book-details').querySelector('.book-seller').textContent;
          alert(`Contact request sent for "${bookTitle}"\n${seller}`);
      });
  });

  // Event Listeners
  
  // Main navigation buttons
  buyBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showSection('buy-section');
  });

  sellBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showSection('sell-section');
  });

  backBtn.addEventListener('click', backToHome);

  // Category filter buttons
  filterItems.forEach(item => {
      item.addEventListener('click', () => {
          // Update active state
          filterItems.forEach(f => f.classList.remove('active'));
          item.classList.add('active');
          
          // Apply filter
          const selectedCategory = item.textContent.trim();
          filterBooks(selectedCategory);
      });
  });

  // Search button
  if (searchButton) {
      searchButton.addEventListener('click', () => {
          const searchTerm = searchInput.value.trim();
          searchBooks(searchTerm);
      });
  }
  
  // Add search on enter key
  if (searchInput) {
      searchInput.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') {
              const searchTerm = searchInput.value.trim();
              searchBooks(searchTerm);
          }
      });
  }

  // Initialize with all books showing
  filterBooks('All');
});