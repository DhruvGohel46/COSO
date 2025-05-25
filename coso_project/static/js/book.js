document.addEventListener('DOMContentLoaded', function() {
    const buyBtn = document.querySelector('.buy-btn');
    const sellBtn = document.querySelector('.sell-btn');
    const myBooksBtn = document.querySelector('.my-books-btn');
    const landingContainer = document.querySelector('.landing-container');
    const marketplaceContent = document.querySelector('.marketplace-content');
    const backBtn = document.querySelector('.back-btn');

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

    function backToHome() {
        marketplaceContent.style.display = 'none';
        landingContainer.style.display = 'block';
    }

    buyBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showSection('buy-section');
    });

    sellBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showSection('sell-section');
    });

    myBooksBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showSection('my-books-section');
    });

    backBtn.addEventListener('click', backToHome);

    // Tab switching functionality
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const tabId = tab.getAttribute('data-tab');
        
        // Remove active class from all tabs and contents
        tabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        // Add active class to clicked tab and corresponding content
        tab.classList.add('active');
        document.getElementById(`${tabId}-tab`).classList.add('active');
      });
    });

    // Category filtering functionality
    const filterItems = document.querySelectorAll('.filter-item');
    const bookCards = document.querySelectorAll('.book-card');

    // Set initial category for each book card
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

    bookCards.forEach(card => {
        const titleElement = card.querySelector('.book-title');
        const title = titleElement.textContent;
        const category = categoryMap[title] || 'Other';
        card.setAttribute('data-category', category);
    });

    filterItems.forEach(item => {
        item.addEventListener('click', () => {
            const selectedCategory = item.textContent.trim();
            
            // Update active state of filter buttons
            filterItems.forEach(f => f.classList.remove('active'));
            item.classList.add('active');

            // Filter books
            bookCards.forEach(card => {
                if (selectedCategory === 'All') {
                    card.style.display = '';
                } else {
                    const cardCategory = card.getAttribute('data-category');
                    card.style.display = cardCategory === selectedCategory ? '' : 'none';
                }
            });
        });
    });

    // Book image preview functionality
    const bookImageInput = document.getElementById('book-image');
    const bookImagePreview = document.getElementById('bookImagePreview');
    
    if (bookImageInput) {
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

    // "Start Selling" button functionality
    const startSellingBtn = document.getElementById('startSellingBtn');
    if (startSellingBtn) {
      startSellingBtn.addEventListener('click', function() {
        const sellTab = document.querySelector('.tab[data-tab="sell"]');
        if (sellTab) {
          sellTab.click();
        }
      });
    }

    // Form submission
    const sellBookForm = document.getElementById('sellBookForm');
    if (sellBookForm) {
      sellBookForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Your book has been listed for sale!');
        
        // Reset form and preview
        this.reset();
        bookImagePreview.innerHTML = '<span>Book Image</span>';
        
        // Switch to My Books tab
        const myBooksTab = document.querySelector('.tab[data-tab="my-books"]');
        if (myBooksTab) {
          myBooksTab.click();
        }
      });
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
  });