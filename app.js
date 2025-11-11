// Global Variables
let portfolioData = [
    {
        title: "TechStart Website Redesign",
        category: "website",
        description: "Complete website overhaul for a growing tech startup, featuring modern design and improved user experience"
    },
    {
        title: "GreenLeaf Brand Identity",
        category: "design",
        description: "Comprehensive branding package including logo, business cards, and marketing materials for eco-friendly company"
    },
    {
        title: "RetailPro E-commerce Platform",
        category: "website",
        description: "Custom e-commerce solution with inventory management and payment gateway integration"
    },
    {
        title: "FinanceHub Mobile App UI",
        category: "design",
        description: "Intuitive mobile interface design for financial services application"
    },
    {
        title: "MediCare Network Infrastructure",
        category: "it",
        description: "Secure network setup and cybersecurity implementation for healthcare provider"
    },
    {
        title: "FoodDelight Marketing Campaign",
        category: "design",
        description: "Multi-channel marketing design including social media graphics and print materials"
    },
    {
        title: "EduTech Learning Portal",
        category: "website",
        description: "Interactive learning management system with video streaming and progress tracking"
    },
    {
        title: "SecureNet IT Support",
        category: "it",
        description: "Comprehensive IT infrastructure upgrade and ongoing support services"
    },
    {
        title: "StyleCo Fashion Lookbook",
        category: "design",
        description: "Creative digital and print lookbook showcasing latest fashion collection"
    }
];

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializePortfolio();
    initializeScrollAnimations();
    initializeNavigation();
    initializeCounterAnimation();
    initializeForms();
    // Fix: Add event listener for close button on demo form
    const quoteCloseBtn = document.getElementById('quote-close');
    if (quoteCloseBtn) {
        quoteCloseBtn.addEventListener('click', closeQuoteModal);
    }
});

// Navigation Functions
function initializeNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navOverlay = document.getElementById('nav-overlay');
    const navMenuMobile = document.getElementById('nav-menu-mobile');
    
    // Mobile menu toggle (supports both the existing nav-menu and a slide-in mobile menu)
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            // Toggle hamburger animation
            hamburger.classList.toggle('active');

            // Toggle desktop fallback menu (if present)
            if (navMenu) navMenu.classList.toggle('active');

            // If a dedicated mobile menu exists, toggle it + overlay
            if (navMenuMobile) {
                navMenuMobile.classList.toggle('active');
            }

            if (navOverlay) {
                navOverlay.classList.toggle('active');
            }
        });
    }
    
    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu) navMenu.classList.remove('active');
            if (navMenuMobile) navMenuMobile.classList.remove('active');
            if (navOverlay) navOverlay.classList.remove('active');
            if (hamburger) hamburger.classList.remove('active');
        });
    });
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Navbar background on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 50) {
            if (navbar) {
                navbar.style.boxShadow = '0 10px 30px rgba(15, 23, 42, 0.08)';
                navbar.style.backdropFilter = 'blur(6px)';
                navbar.style.background = 'linear-gradient(180deg, rgba(255,255,255,0.98), rgba(249,250,251,0.98))';
            }
        } else {
            if (navbar) {
                navbar.style.boxShadow = '';
                navbar.style.background = '';
            }
        }
    });

    // Close mobile menu when clicking overlay
    if (navOverlay) {
        navOverlay.addEventListener('click', function() {
            if (navMenuMobile) navMenuMobile.classList.remove('active');
            navOverlay.classList.remove('active');
            if (hamburger) hamburger.classList.remove('active');
        });
    }
}

// Portfolio Functions
function initializePortfolio() {
    const portfolioGrid = document.getElementById('portfolio-grid');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    // Populate portfolio items
    portfolioData.forEach((item, index) => {
        const portfolioItem = document.createElement('div');
        portfolioItem.className = `portfolio-item animate-on-scroll`;
        portfolioItem.dataset.category = item.category;
        
        portfolioItem.innerHTML = `
            <div class="portfolio-image">
                <i class="fas ${getCategoryIcon(item.category)}"></i>
            </div>
            <div class="portfolio-content">
                <span class="portfolio-category">${getCategoryName(item.category)}</span>
                <h4>${item.title}</h4>
                <p>${item.description}</p>
            </div>
        `;
        
        portfolioItem.addEventListener('click', function() {
            openPortfolioModal(item);
        });
        
        portfolioGrid.appendChild(portfolioItem);
    });
    
    // Filter functionality
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.dataset.filter;
            
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter portfolio items
            filterPortfolioItems(filter);
        });
    });
}

function getCategoryIcon(category) {
    const icons = {
        website: 'fa-laptop-code',
        design: 'fa-paint-brush',
        it: 'fa-server'
    };
    return icons[category] || 'fa-folder';
}

function getCategoryName(category) {
    const names = {
        website: 'Website',
        design: 'Design',
        it: 'IT Solutions'
    };
    return names[category] || 'Project';
}

function filterPortfolioItems(filter) {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    portfolioItems.forEach(item => {
        const category = item.dataset.category;
        
        if (filter === 'all' || category === filter) {
            item.classList.remove('hidden');
            item.style.display = 'block';
        } else {
            item.classList.add('hidden');
            item.style.display = 'none';
        }
    });
}

// Modal Functions
function openQuoteModal() {
    const modal = document.getElementById('quote-modal');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeQuoteModal() {
    const modal = document.getElementById('quote-modal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function openPortfolioModal(item) {
    const modal = document.getElementById('portfolio-modal');
    const title = document.getElementById('portfolio-modal-title');
    const category = document.getElementById('portfolio-modal-category');
    const description = document.getElementById('portfolio-modal-description');
    const image = document.getElementById('portfolio-modal-img');
    
    title.textContent = item.title;
    category.innerHTML = `<span class="portfolio-category">${getCategoryName(item.category)}</span>`;
    description.textContent = item.description;
    image.innerHTML = `<i class="fas ${getCategoryIcon(item.category)}"></i>`;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closePortfolioModal() {
    const modal = document.getElementById('portfolio-modal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close modals when clicking outside
window.addEventListener('click', function(event) {
    const quoteModal = document.getElementById('quote-modal');
    const portfolioModal = document.getElementById('portfolio-modal');
    
    if (event.target === quoteModal) {
        closeQuoteModal();
    }
    
    if (event.target === portfolioModal) {
        closePortfolioModal();
    }
});

// Scroll Animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    }, observerOptions);
    
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// Counter Animation
function initializeCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');
    const observerOptions = {
        threshold: 0.5
    };
    
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.dataset.target);
                const increment = target / 50;
                let current = 0;
                
                const updateCounter = () => {
                    if (current < target) {
                        current += increment;
                        counter.textContent = Math.ceil(current) + (target === 98 ? '%' : '+');
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target + (target === 98 ? '%' : '+');
                    }
                };
                
                updateCounter();
                counterObserver.unobserve(counter);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

// Form Functions
function initializeForms() {
    const contactForm = document.getElementById('contact-form');
    const quoteForm = document.getElementById('quote-form');
    
    contactForm.addEventListener('submit', handleContactSubmit);
    quoteForm.addEventListener('submit', handleQuoteSubmit);
}

function handleContactSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    if (validateContactForm(data)) {
        // Simulate form submission
        simulateFormSubmission('Thank you! Your message has been sent successfully.');
        e.target.reset();
        clearFormErrors();
    }
}

function handleQuoteSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    if (validateQuoteForm(data)) {
        // Simulate form submission
        simulateFormSubmission('Quote request submitted! We\'ll get back to you within 24 hours.');
        e.target.reset();
        closeQuoteModal();
    }
}

function validateContactForm(data) {
    let isValid = true;
    
    // Clear previous errors
    clearFormErrors();
    
    // Name validation
    if (!data.name || data.name.trim().length < 2) {
        showFieldError('name', 'Please enter a valid name (at least 2 characters)');
        isValid = false;
    }
    
    // Email validation
    if (!data.email || !isValidEmail(data.email)) {
        showFieldError('email', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Phone validation (optional but if provided, should be valid)
    if (data.phone && !isValidPhone(data.phone)) {
        showFieldError('phone', 'Please enter a valid phone number');
        isValid = false;
    }
    
    // Service validation
    if (!data.service) {
        showFieldError('service', 'Please select a service');
        isValid = false;
    }
    
    // Message validation
    if (!data.message || data.message.trim().length < 10) {
        showFieldError('message', 'Please enter a message (at least 10 characters)');
        isValid = false;
    }
    
    return isValid;
}

function validateQuoteForm(data) {
    let isValid = true;
    
    // Basic validation for quote form
    if (!data.name || data.name.trim().length < 2) {
        isValid = false;
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        isValid = false;
    }
    
    if (!data.service) {
        isValid = false;
    }
    
    return isValid;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d\s\-\(\)]{7,}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

function showFieldError(fieldName, message) {
    const field = document.getElementById(fieldName);
    const errorElement = document.getElementById(fieldName + '-error');
    
    if (field && errorElement) {
        field.classList.add('invalid');
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
}

function clearFormErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    const invalidFields = document.querySelectorAll('.invalid');
    
    errorElements.forEach(el => {
        el.classList.remove('show');
        el.textContent = '';
    });
    
    invalidFields.forEach(field => {
        field.classList.remove('invalid');
    });
}

function simulateFormSubmission(message) {
    const successToast = document.getElementById('success-message');
    const successText = document.getElementById('success-text');
    
    successText.textContent = message;
    successToast.classList.add('show');
    
    setTimeout(() => {
        successToast.classList.remove('show');
    }, 4000);
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Smooth scroll to top function (can be used for back-to-top button)
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Add smooth hover effects to service cards
document.addEventListener('DOMContentLoaded', function() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Add loading animation for better UX
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

// Add keyboard navigation support for modals
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const quoteModal = document.getElementById('quote-modal');
        const portfolioModal = document.getElementById('portfolio-modal');
        
        if (quoteModal.style.display === 'block') {
            closeQuoteModal();
        }
        
        if (portfolioModal.style.display === 'block') {
            closePortfolioModal();
        }
    }
});

// Performance optimization: Lazy load animations
const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

if (mediaQuery.matches) {
    // Disable animations for users who prefer reduced motion
    document.documentElement.style.setProperty('--transition', 'none');
}

// Add focus management for better accessibility
function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
    );
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];
    
    element.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstFocusableElement) {
                    lastFocusableElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusableElement) {
                    firstFocusableElement.focus();
                    e.preventDefault();
                }
            }
        }
    });
}

// Initialize focus trapping for modals
document.addEventListener('DOMContentLoaded', function() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        trapFocus(modal);
    });
});