// Utlyze Website JavaScript - Premium Edition (Fixed)

// Initialize Supabase client
const supabaseUrl = 'https://mvjzmhlwnbwkrtachiec.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12anptaGx3bmJ3a3J0YWNoaWVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwOTI1MDQsImV4cCI6MjA2OTY2ODUwNH0.KWWX-XFgBqCA4MUpUOIU_Dt0gLX7O6mWgMVJhJAuCXw';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

document.addEventListener('DOMContentLoaded', function() {
    // Initialize premium animations and effects
    initializePremiumEffects();
    
    // Smooth scroll functionality
    const scrollButtons = document.querySelectorAll('[data-scroll-to]');
    scrollButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('data-scroll-to');
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Form handling
    const form = document.getElementById('ideaForm');
    const successMessage = document.getElementById('success-message');

    if (form) {
        // Ensure each form field is properly isolated
        const formFields = form.querySelectorAll('.glass-input');
        formFields.forEach(field => {
            // Clear any existing event listeners that might cause issues
            field.value = '';
            
            // Add proper input event handling
            field.addEventListener('input', function(e) {
                // Ensure the field only contains its own value
                const fieldId = this.id;
                const errorElement = document.getElementById(fieldId + '-error');
                
                // Clear errors on valid input
                if (errorElement && errorElement.style.display === 'block') {
                    clearFieldError(fieldId);
                }
            });
            
            // Add focus and blur handlers for premium effects
            field.addEventListener('focus', handleFieldFocus);
            field.addEventListener('blur', handleFieldBlur);
        });

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Clear previous errors
            clearAllErrors();
            
            // Validate form
            const isValid = validateForm();
            
            if (isValid) {
                // Simulate form submission with premium animation
                submitFormWithAnimation();
            }
        });
    }

    // Premium form validation functions
    function validateForm() {
        let isValid = true;
        
        // URL validation
        const urlField = document.getElementById('url');
        const urlValue = urlField ? urlField.value.trim() : '';
        if (!urlValue) {
            showError('url', 'URL is required');
            isValid = false;
        } else if (!isValidURL(urlValue)) {
            showError('url', 'Please enter a valid URL');
            isValid = false;
        }
        
        // Name validation
        const nameField = document.getElementById('name');
        const nameValue = nameField ? nameField.value.trim() : '';
        if (!nameValue) {
            showError('name', 'Name is required');
            isValid = false;
        } else if (nameValue.length < 2) {
            showError('name', 'Name must be at least 2 characters');
            isValid = false;
        }
        
        // Email validation
        const emailField = document.getElementById('email');
        const emailValue = emailField ? emailField.value.trim() : '';
        if (!emailValue) {
            showError('email', 'Email is required');
            isValid = false;
        } else if (!isValidEmail(emailValue)) {
            showError('email', 'Please enter a valid email address');
            isValid = false;
        }
        
        // Description is optional - no validation needed
        
        return isValid;
    }

    function isValidURL(string) {
        try {
            // Add protocol if missing
            if (!string.startsWith('http://') && !string.startsWith('https://')) {
                string = 'https://' + string;
            }
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function showError(fieldId, message) {
        const errorElement = document.getElementById(fieldId + '-error');
        const field = document.getElementById(fieldId);
        
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
            // Add subtle shake animation
            errorElement.style.animation = 'shake 0.5s ease-in-out';
        }
        
        // Add error styling to field with premium effect
        if (field) {
            field.classList.add('error');
            field.style.borderColor = '#DC2626';
            field.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.15)';
            
            // Brief scale animation for attention
            field.style.transform = 'scale(1.01)';
            setTimeout(() => {
                field.style.transform = 'scale(1)';
            }, 200);
        }
    }

    function clearFieldError(fieldId) {
        const errorElement = document.getElementById(fieldId + '-error');
        const field = document.getElementById(fieldId);
        
        if (errorElement) {
            errorElement.style.opacity = '0';
            errorElement.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                errorElement.textContent = '';
                errorElement.style.display = 'none';
                errorElement.style.opacity = '1';
                errorElement.style.transform = 'translateY(0)';
                errorElement.style.animation = '';
            }, 200);
        }
        
        if (field) {
            field.classList.remove('error');
            field.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            field.style.boxShadow = 'none';
        }
    }

    function clearAllErrors() {
        const errorElements = document.querySelectorAll('.form-error');
        const formFields = document.querySelectorAll('.glass-input');
        
        errorElements.forEach(element => {
            element.textContent = '';
            element.style.display = 'none';
            element.style.animation = '';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        });
        
        // Remove error styling from fields
        formFields.forEach(field => {
            field.classList.remove('error');
            field.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            field.style.boxShadow = 'none';
            field.style.transform = 'scale(1)';
        });
    }

    function handleFieldFocus(e) {
        const field = e.target;
        if (!field.classList.contains('error')) {
            field.style.borderColor = '#005BFF';
            field.style.boxShadow = '0 0 0 3px rgba(0, 91, 255, 0.15)';
            field.style.transform = 'scale(1.01)';
            field.style.background = 'rgba(255, 255, 255, 0.2)';
        }
    }

    function handleFieldBlur(e) {
        const field = e.target;
        if (!field.classList.contains('error')) {
            field.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            field.style.boxShadow = 'none';
            field.style.transform = 'scale(1)';
            field.style.background = 'rgba(255, 255, 255, 0.15)';
        }
    }

    async function submitFormWithAnimation() {
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        const formContainer = form.parentElement;
        
        // Get form data
        const formData = {
            url: document.getElementById('url').value,
            description: document.getElementById('description').value,
            name: document.getElementById('name').value,
            email: document.getElementById('email').value
        };
        
        // Show premium loading state
        submitButton.innerHTML = '<span style="opacity: 0.7;">Submitting...</span>';
        submitButton.disabled = true;
        submitButton.style.transform = 'scale(0.98)';
        
        // Add subtle pulse effect to form
        formContainer.style.animation = 'pulse-submit 1.5s ease-in-out';
        
        try {
            // Submit to Supabase
            const { data, error } = await supabase
                .from('submissions')
                .insert([formData]);
            
            if (error) throw error;
            
            // Success - proceed with animations
            // Hide form with smooth animation
            form.style.transform = 'translateY(-20px)';
            form.style.opacity = '0';
            form.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            
            setTimeout(() => {
                form.style.display = 'none';
                successMessage.classList.remove('hidden');
                successMessage.style.display = 'block';
                successMessage.style.transform = 'translateY(20px)';
                successMessage.style.opacity = '0';
                
                // Animate success message in
                setTimeout(() => {
                    successMessage.style.transform = 'translateY(0)';
                    successMessage.style.opacity = '1';
                    successMessage.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                    
                    // Scroll to success message with offset
                    successMessage.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                    
                    // Add celebration effect
                    createCelebrationParticles();
                }, 100);
            }, 600);
            
            // Reset form
            form.reset();
            
        } catch (error) {
            console.error('Error submitting form:', error);
            // Show error message
            alert('Error submitting form. Please try again.');
            
            // Reset button state
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
            submitButton.style.transform = 'scale(1)';
            formContainer.style.animation = '';
        }
    }

    // Premium celebration particles effect
    function createCelebrationParticles() {
        const successElement = successMessage;
        const particles = 15;
        
        for (let i = 0; i < particles; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 6px;
                height: 6px;
                background: linear-gradient(45deg, #FF7A00, #005BFF);
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                opacity: 0.9;
            `;
            
            const rect = successElement.getBoundingClientRect();
            particle.style.left = (rect.left + rect.width / 2) + 'px';
            particle.style.top = (rect.top + rect.height / 2) + 'px';
            
            document.body.appendChild(particle);
            
            // Animate particle
            const angle = (i / particles) * Math.PI * 2;
            const velocity = 120 + Math.random() * 60;
            const x = Math.cos(angle) * velocity;
            const y = Math.sin(angle) * velocity;
            
            particle.animate([
                { transform: 'translate(0, 0) scale(1)', opacity: 0.9 },
                { transform: `translate(${x}px, ${y}px) scale(0)`, opacity: 0 }
            ], {
                duration: 1200 + Math.random() * 600,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
            }).onfinish = () => particle.remove();
        }
    }

    // Premium scroll animations with intersection observer
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -80px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger animation for multiple elements
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 120);
            }
        });
    }, observerOptions);

    // Add premium fade-in animation to sections
    const animatedElements = document.querySelectorAll('.glass-card, .glass-step, .comparison-visual, .innovation-visual, .glass-mission');
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // Premium hover effects for process steps
    const processSteps = document.querySelectorAll('.glass-step');
    processSteps.forEach((step, index) => {
        step.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-12px) scale(1.02)';
            this.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            this.style.boxShadow = '0 20px 50px rgba(0, 91, 255, 0.2)';
            this.style.borderColor = 'rgba(255, 255, 255, 0.4)';
            this.style.background = 'rgba(255, 255, 255, 0.2)';
        });
        
        step.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 2px 16px rgba(0, 0, 0, 0.08)';
            this.style.borderColor = 'rgba(255, 255, 255, 0.25)';
            this.style.background = 'rgba(255, 255, 255, 0.15)';
        });
    });

    // Premium parallax effect for hero background
    let ticking = false;
    function updatePremiumParallax() {
        const scrolled = window.pageYOffset;
        const heroMesh = document.querySelector('.hero-mesh-background');
        const heroParticles = document.querySelector('.hero-particles');
        const heroGlow = document.querySelector('.hero-glow');
        
        if (scrolled < window.innerHeight) {
            if (heroMesh) {
                heroMesh.style.transform = `translateY(${scrolled * 0.2}px) scale(${1 + scrolled * 0.0002})`;
            }
            if (heroParticles) {
                heroParticles.style.transform = `translateY(${scrolled * 0.4}px)`;
            }
            if (heroGlow) {
                heroGlow.style.opacity = Math.max(0, 1 - scrolled / window.innerHeight);
            }
        }
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updatePremiumParallax);
            ticking = true;
        }
    });

    // Premium button interactions
    const allButtons = document.querySelectorAll('.btn');
    allButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });
        
        button.addEventListener('mousedown', function() {
            this.style.transform = 'translateY(-1px) scale(0.98)';
        });
        
        button.addEventListener('mouseup', function() {
            this.style.transform = 'translateY(-2px) scale(1.02)';
        });
        
        button.addEventListener('mouseleave', function() {
            // Reset to default hover state
            setTimeout(() => {
                if (this.matches(':hover')) return;
                this.style.transform = '';
            }, 100);
        });
    });

    // Initialize premium effects
    function initializePremiumEffects() {
        // Add smooth reveal animation for hero content
        setTimeout(() => {
            const heroContent = document.querySelector('.hero-content');
            if (heroContent) {
                heroContent.style.opacity = '1';
                heroContent.style.transform = 'translateY(0)';
            }
        }, 300);

        // Initialize hero content with animation-ready state
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.opacity = '0';
            heroContent.style.transform = 'translateY(40px)';
            heroContent.style.transition = 'all 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
        }

        // Add premium glass card interactions
        const glassCards = document.querySelectorAll('.glass-card');
        glassCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-6px)';
                this.style.boxShadow = '0 16px 50px rgba(0, 0, 0, 0.2)';
                this.style.background = 'rgba(255, 255, 255, 0.25)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.12)';
                this.style.background = 'rgba(255, 255, 255, 0.2)';
            });
        });

        // Add subtle cursor following effect for premium feel
        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Animate floating orbs slightly based on cursor position
        function animateOrbs() {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                return;
            }
            
            cursorX += (mouseX - cursorX) * 0.02;
            cursorY += (mouseY - cursorY) * 0.02;
            
            const orbs = document.querySelectorAll('.orb');
            orbs.forEach((orb, index) => {
                const speed = (index + 1) * 0.00008;
                const x = (cursorX - window.innerWidth / 2) * speed;
                const y = (cursorY - window.innerHeight / 2) * speed;
                orb.style.transform = `translate(${x}px, ${y}px)`;
            });
            
            requestAnimationFrame(animateOrbs);
        }
        
        // Only start orb animation if user doesn't prefer reduced motion
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            animateOrbs();
        }
    }

    // Add click tracking for conversion optimization
    function trackClick(element, action) {
        // In a real implementation, this would send data to analytics
        console.log(`User clicked: ${action}`, {
            element: element.tagName,
            text: element.textContent,
            timestamp: new Date().toISOString(),
            position: {
                x: element.getBoundingClientRect().left,
                y: element.getBoundingClientRect().top
            }
        });
    }

    // Track premium CTA clicks
    const ctaButtons = document.querySelectorAll('.btn--primary');
    ctaButtons.forEach(button => {
        button.addEventListener('click', () => {
            trackClick(button, 'primary_cta_click');
            // Add premium click effect
            createClickRipple(button);
        });
    });

    // Track secondary button clicks
    const secondaryButtons = document.querySelectorAll('.btn--outline');
    secondaryButtons.forEach(button => {
        button.addEventListener('click', () => {
            trackClick(button, 'secondary_cta_click');
            createClickRipple(button);
        });
    });

    // Premium click ripple effect
    function createClickRipple(element) {
        const ripple = document.createElement('div');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
            width: ${size}px;
            height: ${size}px;
            left: ${rect.width / 2 - size / 2}px;
            top: ${rect.height / 2 - size / 2}px;
            z-index: 10;
        `;
        
        element.style.position = 'relative';
        element.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }

    // Add CSS keyframes for premium animations
    const premiumStyles = document.createElement('style');
    premiumStyles.textContent = `
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
        
        @keyframes shake {
            10%, 90% { transform: translateX(-1px); }
            20%, 80% { transform: translateX(2px); }
            30%, 50%, 70% { transform: translateX(-4px); }
            40%, 60% { transform: translateX(4px); }
        }
        
        @keyframes pulse-submit {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.01); }
        }
    `;
    document.head.appendChild(premiumStyles);

    // Performance optimization - respect user preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
        // Disable premium animations for users who prefer reduced motion
        const style = document.createElement('style');
        style.textContent = `
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
            .floating-orbs { display: none !important; }
            .form-particles { display: none !important; }
        `;
        document.head.appendChild(style);
    }

    // Premium page visibility handling
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // Pause expensive animations when page is not visible
            document.body.style.setProperty('--animation-play-state', 'paused');
        } else {
            document.body.style.setProperty('--animation-play-state', 'running');
        }
    });
});