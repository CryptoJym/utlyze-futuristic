// Mobile Menu Fix - Better event handling for touch devices
(function() {
    'use strict';
    
    // Wait for DOM to be ready
    function initMobileMenuFix() {
        const menuToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-links');
        
        if (!menuToggle || !navMenu) {
            console.warn('Mobile menu elements not found, retrying...');
            setTimeout(initMobileMenuFix, 500);
            return;
        }
        
        console.log('Initializing mobile menu fix...');
        
        // Remove any existing event listeners
        const newMenuToggle = menuToggle.cloneNode(true);
        menuToggle.parentNode.replaceChild(newMenuToggle, menuToggle);
        
        // Track menu state
        let isMenuOpen = false;
        
        // Function to open menu
        function openMenu() {
            isMenuOpen = true;
            navMenu.classList.add('nav-links--open');
            newMenuToggle.classList.add('nav-toggle--active');
            newMenuToggle.setAttribute('aria-expanded', 'true');
            document.body.classList.add('menu-open');
            console.log('Menu opened');
        }
        
        // Function to close menu
        function closeMenu() {
            isMenuOpen = false;
            navMenu.classList.remove('nav-links--open');
            newMenuToggle.classList.remove('nav-toggle--active');
            newMenuToggle.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('menu-open');
            console.log('Menu closed');
        }
        
        // Toggle menu function
        function toggleMenu(e) {
            e.preventDefault();
            e.stopPropagation();
            
            if (isMenuOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        }
        
        // Handle menu toggle click/touch
        newMenuToggle.addEventListener('click', toggleMenu, { passive: false });
        newMenuToggle.addEventListener('touchend', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleMenu(e);
        }, { passive: false });
        
        // Close menu when clicking outside (with delay for touch events)
        document.addEventListener('click', function(e) {
            if (isMenuOpen && !navMenu.contains(e.target) && !newMenuToggle.contains(e.target)) {
                closeMenu();
            }
        });
        
        // Handle touch events separately to prevent conflicts
        document.addEventListener('touchend', function(e) {
            // Don't close immediately - wait to see if it's a menu toggle touch
            setTimeout(() => {
                if (isMenuOpen && !navMenu.contains(e.target) && !newMenuToggle.contains(e.target)) {
                    closeMenu();
                }
            }, 100);
        }, { passive: true });
        
        // Close menu when clicking a nav link
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                closeMenu();
            });
        });
        
        // Handle escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && isMenuOpen) {
                closeMenu();
                newMenuToggle.focus();
            }
        });
        
        // Prevent menu from flashing on page load
        navMenu.style.transition = 'none';
        navMenu.classList.remove('nav-links--open');
        setTimeout(() => {
            navMenu.style.transition = '';
        }, 100);
        
        console.log('Mobile menu fix initialized successfully');
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobileMenuFix);
    } else {
        // DOM is already ready
        setTimeout(initMobileMenuFix, 100);
    }
})();