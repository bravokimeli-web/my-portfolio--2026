// Portfolio JavaScript - Ham Matage DevOps Engineer
// Improved version with better performance and accessibility

(function() {
    'use strict';

    // ============================================
    // MOBILE NAVIGATION
    // ============================================
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');
    const body = document.body;

    if (hamburger && navLinks) {
        // Toggle mobile menu
        hamburger.addEventListener('click', function() {
            const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
            
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            body.classList.toggle('no-scroll');
            
            // Update ARIA attributes for accessibility
            hamburger.setAttribute('aria-expanded', !isExpanded);
        });

        // Close mobile menu when clicking nav links
        navItems.forEach(item => {
            item.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                body.classList.remove('no-scroll');
                hamburger.setAttribute('aria-expanded', 'false');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navLinks.contains(event.target);
            const isClickOnHamburger = hamburger.contains(event.target);
            
            if (!isClickInsideNav && !isClickOnHamburger && navLinks.classList.contains('active')) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                body.classList.remove('no-scroll');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });

        // Close mobile menu on ESC key
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && navLinks.classList.contains('active')) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                body.classList.remove('no-scroll');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // ============================================
    // SMOOTH SCROLLING
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Don't prevent default for empty anchors
            if (href === '#' || href === '') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                
                const headerOffset = 80; // Adjust based on your header height
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Update URL without jumping
                if (history.pushState) {
                    history.pushState(null, null, href);
                }

                // Focus the target section for accessibility
                target.setAttribute('tabindex', '-1');
                target.focus();
            }
        });
    });

    // ============================================
    // EXPERIENCE TABS
    // ============================================
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    if (tabButtons.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const targetId = this.getAttribute('data-id');
                const targetPanel = document.getElementById(`${targetId}-panel`) || document.getElementById(targetId);
                
                if (!targetPanel) return;

                // Remove active class from all buttons and contents
                tabButtons.forEach(btn => {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-selected', 'false');
                });
                
                tabContents.forEach(content => {
                    content.classList.remove('active');
                    content.setAttribute('hidden', '');
                });

                // Add active class to clicked button and corresponding content
                this.classList.add('active');
                this.setAttribute('aria-selected', 'true');
                targetPanel.classList.add('active');
                targetPanel.removeAttribute('hidden');
            });

            // Keyboard navigation for tabs
            button.addEventListener('keydown', function(e) {
                let index = Array.from(tabButtons).indexOf(this);
                
                if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                    e.preventDefault();
                    index = (index + 1) % tabButtons.length;
                    tabButtons[index].focus();
                    tabButtons[index].click();
                } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    index = (index - 1 + tabButtons.length) % tabButtons.length;
                    tabButtons[index].focus();
                    tabButtons[index].click();
                } else if (e.key === 'Home') {
                    e.preventDefault();
                    tabButtons[0].focus();
                    tabButtons[0].click();
                } else if (e.key === 'End') {
                    e.preventDefault();
                    tabButtons[tabButtons.length - 1].focus();
                    tabButtons[tabButtons.length - 1].click();
                }
            });
        });
    }

    // ============================================
    // SCROLL ANIMATIONS (INTERSECTION OBSERVER)
    // ============================================
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Stop observing after animation
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all elements with fade-in class
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(element => {
        observer.observe(element);
    });

    // ============================================
    // HEADER SCROLL EFFECT
    // ============================================
    const header = document.querySelector('header');
    let lastScrollTop = 0;
    let scrollTimeout;

    function handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Add shadow on scroll
        if (scrollTop > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Hide/show header on scroll (optional)
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            header.style.transform = 'translateY(0)';
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }

    // Debounce scroll event for performance
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }
        scrollTimeout = window.requestAnimationFrame(handleScroll);
    }, { passive: true });

    // ============================================
    // ACTIVE NAVIGATION HIGHLIGHTING
    // ============================================
    const sections = document.querySelectorAll('section[id]');
    
    function highlightNavigation() {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);

            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLink.classList.add('active');
                } else {
                    navLink.classList.remove('active');
                }
            }
        });
    }

    window.addEventListener('scroll', highlightNavigation, { passive: true });

    // ============================================
    // PREVENT FOUC (Flash of Unstyled Content)
    // ============================================
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });

    // ============================================
    // PRELOAD CRITICAL IMAGES
    // ============================================
    const criticalImages = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.src; // Trigger loading
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });

        criticalImages.forEach(img => imageObserver.observe(img));
    }

    // ============================================
    // EXTERNAL LINK SECURITY
    // ============================================
    const externalLinks = document.querySelectorAll('a[target="_blank"]');
    externalLinks.forEach(link => {
        // Add security attributes if not present
        if (!link.hasAttribute('rel')) {
            link.setAttribute('rel', 'noopener noreferrer');
        }
    });

    // ============================================
    // PERFORMANCE MONITORING (OPTIONAL)
    // ============================================
    if ('PerformanceObserver' in window) {
        const perfObserver = new PerformanceObserver(function(list) {
            for (const entry of list.getEntries()) {
                if (entry.entryType === 'largest-contentful-paint') {
                    console.log('LCP:', entry.renderTime || entry.loadTime);
                }
            }
        });
        
        try {
            perfObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {
            // Browser doesn't support this type
        }
    }

    // ============================================
    // FORM VALIDATION (If you add a contact form)
    // ============================================
    const contactForm = document.querySelector('#contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Add your form validation and submission logic here
            const formData = new FormData(contactForm);
            
            // Example: Log form data
            for (let [key, value] of formData.entries()) {
                console.log(key, value);
            }
            
            // Show success message
            alert('Thank you for your message! I\'ll get back to you soon.');
            contactForm.reset();
        });
    }

    // ============================================
    // COPY EMAIL TO CLIPBOARD
    // ============================================
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    
    emailLinks.forEach(link => {
        link.addEventListener('contextmenu', function(e) {
            // Optional: Add copy to clipboard on right-click
        });
    });

    // ============================================
    // KEYBOARD NAVIGATION IMPROVEMENTS
    // ============================================
    // Allow skip to main content link to work properly
    const skipLink = document.querySelector('.skip-to-main');
    if (skipLink) {
        skipLink.addEventListener('click', function(e) {
            e.preventDefault();
            const mainContent = document.querySelector('#main-content');
            if (mainContent) {
                mainContent.setAttribute('tabindex', '-1');
                mainContent.focus();
            }
        });
    }

    // ============================================
    // REDUCED MOTION SUPPORT
    // ============================================
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
        // Disable animations for users who prefer reduced motion
        document.documentElement.style.setProperty('--animation-duration', '0.01ms');
    }

    // ============================================
    // CONSOLE MESSAGE (Optional Easter Egg)
    // ============================================
    console.log(
        '%c👋 Hello, Developer!',
        'font-size: 20px; font-weight: bold; color: #64ffda;'
    );
    console.log(
        '%cLooking for a DevOps Engineer? Let\'s connect!\n' +
        'Email: kiplangathamman@gmail.com\n' +
        'GitHub: https://github.com/hammatage\n' +
        'LinkedIn: https://linkedin.com/in/hammatage',
        'font-size: 14px; color: #8892b0;'
    );

})();