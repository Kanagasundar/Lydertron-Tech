/* ============================================
   LYDERTRON TECH - SCRIPT.JS
   Modern parallax scrolling website scripts
   ============================================ */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initNavigation();
    initParallax();
    initScrollAnimations();
    initTypingEffect();
    initProductCarousel();
    initContactForm();
    initStatsCounter();
    initBackToTop();
    initSmoothScroll();
});

/* ============================================
   NAVIGATION
   Handles mobile menu and header shrink on scroll
   ============================================ */
function initNavigation() {
    const header = document.getElementById('header');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Toggle mobile menu
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
    }
    
    // Close mobile menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
            
            // Update active link
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Header shrink on scroll
    let lastScroll = 0;
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        // Add/remove scrolled class
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
    
    // Update active nav link based on scroll position
    updateActiveNavOnScroll(navLinks);
}

/**
 * Updates active navigation link based on current scroll position
 * @param {NodeList} navLinks - Navigation link elements
 */
function updateActiveNavOnScroll(navLinks) {
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.pageYOffset >= sectionTop && 
                window.pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

/* ============================================
   PARALLAX EFFECT
   Creates depth by moving backgrounds at different speeds
   ============================================ */
function initParallax() {
    const parallaxBgs = document.querySelectorAll('.parallax-bg');
    
    // Only enable parallax on non-touch devices for performance
    if ('ontouchstart' in window) {
        return;
    }
    
    let ticking = false;
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                updateParallax(parallaxBgs);
                ticking = false;
            });
            ticking = true;
        }
    });
}

/**
 * Updates parallax background positions based on scroll
 * @param {NodeList} elements - Parallax background elements
 */
function updateParallax(elements) {
    const scrolled = window.pageYOffset;
    
    elements.forEach(bg => {
        const section = bg.parentElement;
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        // Only animate when section is in view
        if (scrolled + window.innerHeight > sectionTop && 
            scrolled < sectionTop + sectionHeight) {
            const speed = 0.3;
            const yPos = (scrolled - sectionTop) * speed;
            bg.style.transform = `translateY(${yPos}px)`;
        }
    });
}

/* ============================================
   SCROLL ANIMATIONS
   Fade-in elements as they enter the viewport
   ============================================ */
function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    // Use Intersection Observer for better performance
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add delay for staggered animations
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                
                // Stop observing once animated
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Add staggered delays to elements
    fadeElements.forEach((el, index) => {
        el.dataset.delay = (index % 4) * 100; // Stagger by 100ms
        observer.observe(el);
    });
}

/* ============================================
   TYPING EFFECT
   Typewriter animation for hero subtitle
   ============================================ */
function initTypingEffect() {
    const typedText = document.getElementById('typed-text');
    if (!typedText) return;
    
    const phrases = [
        'Industrial Solutions Provider',
        'Spare Parts Specialist',
        'Controller Repair Experts',
        '24-Hour Delivery Service',
        'Pan India Coverage'
    ];
    
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    
    function type() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            // Remove character
            typedText.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            // Add character
            typedText.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }
        
        // Word complete
        if (!isDeleting && charIndex === currentPhrase.length) {
            typingSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 500; // Pause before next word
        }
        
        setTimeout(type, typingSpeed);
    }
    
    // Start typing effect
    setTimeout(type, 1000);
}

/* ============================================
   PRODUCT CAROUSEL
   Interactive product slider with dots navigation
   ============================================ */
function initProductCarousel() {
    const track = document.getElementById('carousel-track');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    const dotsContainer = document.getElementById('carousel-dots');
    
    if (!track) return;
    
    const cards = track.querySelectorAll('.product-card');
    const cardCount = cards.length;
    const cardWidth = 350 + 32; // card width + gap
    let currentIndex = 0;
    let visibleCards = getVisibleCards();
    let maxIndex = Math.max(0, cardCount - visibleCards);
    
    // Calculate visible cards based on screen width
    function getVisibleCards() {
        const containerWidth = track.parentElement.offsetWidth;
        return Math.floor(containerWidth / cardWidth) || 1;
    }
    
    // Create dots
    function createDots() {
        dotsContainer.innerHTML = '';
        const numDots = maxIndex + 1;
        
        for (let i = 0; i < numDots; i++) {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            if (i === 0) dot.classList.add('active');
            
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }
    
    // Go to specific slide
    function goToSlide(index) {
        currentIndex = Math.max(0, Math.min(index, maxIndex));
        updateCarousel();
    }
    
    // Update carousel position
    function updateCarousel() {
        const offset = currentIndex * cardWidth;
        track.style.transform = `translateX(-${offset}px)`;
        
        // Update dots
        const dots = dotsContainer.querySelectorAll('.carousel-dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
        
        // Update button states
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex === maxIndex;
        prevBtn.style.opacity = currentIndex === 0 ? 0.5 : 1;
        nextBtn.style.opacity = currentIndex === maxIndex ? 0.5 : 1;
    }
    
    // Navigation handlers
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });
    
    nextBtn.addEventListener('click', () => {
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateCarousel();
        }
    });
    
    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    
    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (diff > swipeThreshold && currentIndex < maxIndex) {
            currentIndex++;
            updateCarousel();
        } else if (diff < -swipeThreshold && currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' && currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        } else if (e.key === 'ArrowRight' && currentIndex < maxIndex) {
            currentIndex++;
            updateCarousel();
        }
    });
    
    // Handle resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            visibleCards = getVisibleCards();
            maxIndex = Math.max(0, cardCount - visibleCards);
            currentIndex = Math.min(currentIndex, maxIndex);
            createDots();
            updateCarousel();
        }, 250);
    });
    
    // Initialize
    createDots();
    updateCarousel();
    
    // Auto-play (optional)
    let autoPlayInterval;
    
    function startAutoPlay() {
        autoPlayInterval = setInterval(() => {
            if (currentIndex < maxIndex) {
                currentIndex++;
            } else {
                currentIndex = 0;
            }
            updateCarousel();
        }, 5000);
    }
    
    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }
    
    // Start auto-play and pause on hover
    startAutoPlay();
    track.addEventListener('mouseenter', stopAutoPlay);
    track.addEventListener('mouseleave', startAutoPlay);
}

/* ============================================
   CONTACT FORM VALIDATION
   Client-side form validation with feedback
   ============================================ */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    const submitBtn = document.getElementById('submit-btn');
    
    // Validation rules
    const validators = {
        name: {
            validate: (value) => value.trim().length >= 2,
            message: 'Please enter a valid name (at least 2 characters)'
        },
        email: {
            validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
            message: 'Please enter a valid email address'
        },
        phone: {
            validate: (value) => !value || /^[\d\s\+\-\(\)]{10,}$/.test(value),
            message: 'Please enter a valid phone number'
        },
        message: {
            validate: (value) => value.trim().length >= 10,
            message: 'Please enter a message (at least 10 characters)'
        }
    };
    
    // Validate single field
    function validateField(field) {
        const validator = validators[field.name];
        if (!validator) return true;
        
        const isValid = validator.validate(field.value);
        const formGroup = field.closest('.form-group');
        const errorEl = document.getElementById(`${field.name}-error`);
        
        if (isValid) {
            formGroup.classList.remove('error');
            if (errorEl) errorEl.textContent = '';
        } else {
            formGroup.classList.add('error');
            if (errorEl) errorEl.textContent = validator.message;
        }
        
        return isValid;
    }
    
    // Real-time validation on blur
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
            if (input.closest('.form-group').classList.contains('error')) {
                validateField(input);
            }
        });
    });
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });
        
        if (isValid) {
            // Show loading state
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                // Success feedback
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                submitBtn.style.background = 'var(--color-success)';
                
                // Reset form
                form.reset();
                
                // Reset button after delay
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 3000);
            }, 1500);
        } else {
            // Scroll to first error
            const firstError = form.querySelector('.form-group.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });
}

/* ============================================
   STATS COUNTER
   Animated counting effect for statistics
   ============================================ */
function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observerOptions = {
        root: null,
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    statNumbers.forEach(stat => observer.observe(stat));
}

/**
 * Animates a counter from 0 to target value
 * @param {HTMLElement} element - Counter element with data-target attribute
 */
function animateCounter(element) {
    const target = parseInt(element.dataset.target);
    const duration = 2000; // 2 seconds
    const start = 0;
    const increment = target / (duration / 16); // 60fps
    let current = start;
    
    function updateCounter() {
        current += increment;
        
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
            
            // Add plus sign for certain stats
            if (target >= 100 && target < 1000) {
                element.textContent = target + '+';
            }
        }
    }
    
    requestAnimationFrame(updateCounter);
}

/* ============================================
   BACK TO TOP BUTTON
   Shows/hides button based on scroll position
   ============================================ */
function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    if (!backToTopBtn) return;
    
    // Show/hide button based on scroll
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    // Scroll to top on click
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* ============================================
   SMOOTH SCROLL
   Enhanced smooth scrolling for anchor links
   ============================================ */
function initSmoothScroll() {
    const anchors = document.querySelectorAll('a[href^="#"]');
    
    anchors.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Skip if just "#"
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                const headerHeight = document.getElementById('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ============================================
   UTILITY FUNCTIONS
   ============================================ */

/**
 * Debounce function to limit execution rate
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
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

/**
 * Throttle function to limit execution to once per interval
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/* ============================================
   LAZY LOADING ENHANCEMENT
   Progressive image loading
   ============================================ */
document.addEventListener('DOMContentLoaded', function() {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // Add loaded class for fade-in effect
                    img.addEventListener('load', function() {
                        this.classList.add('loaded');
                    });
                    
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
});

/* ============================================
   PRELOADER (Optional)
   Page load animation
   ============================================ */
window.addEventListener('load', function() {
    // Remove any preloader
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.classList.add('loaded');
        setTimeout(() => preloader.remove(), 500);
    }
    
    // Trigger initial animations
    document.body.classList.add('loaded');
});

/* ============================================
   PERFORMANCE OPTIMIZATION
   Request idle callback for non-critical tasks
   ============================================ */
if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
        // Non-critical initialization
        console.log('Lydertron Tech website loaded successfully');
    });
}
