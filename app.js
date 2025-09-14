// Utlyze Website JavaScript - Premium Edition (Fixed)

// Initialize Supabase client (with environment shim)
// Order of precedence:
// 1) window.__ENV.NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY
// 2) <meta name="NEXT_PUBLIC_SUPABASE_URL" content="..."> / <meta name="NEXT_PUBLIC_SUPABASE_ANON_KEY" content="...">
// 3) localStorage overrides (SUPABASE_URL / SUPABASE_ANON_KEY)
// 4) Hard-coded fallback (kept for local/offline demos)
var supabaseUrl =
  (window.__ENV && (window.__ENV.NEXT_PUBLIC_SUPABASE_URL || window.__ENV.SUPABASE_URL)) ||
  (document.querySelector('meta[name="NEXT_PUBLIC_SUPABASE_URL"]')?.content) ||
  (localStorage.getItem('SUPABASE_URL')) ||
  'https://mvjzmhlwnbwkrtachiec.supabase.co';

var supabaseKey =
  (window.__ENV && (window.__ENV.NEXT_PUBLIC_SUPABASE_ANON_KEY || window.__ENV.SUPABASE_ANON_KEY)) ||
  (document.querySelector('meta[name="NEXT_PUBLIC_SUPABASE_ANON_KEY"]')?.content) ||
  (localStorage.getItem('SUPABASE_ANON_KEY')) ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12anptaGx3bmJ3a3J0YWNoaWVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwOTI1MDQsImV4cCI6MjA2OTY2ODUwNH0.KWWX-XFgBqCA4MUpUOIU_Dt0gLX7O6mWgMVJhJAuCXw';

// Initialise Supabase only if the library is available. Without this check,
// an undefined 'window.supabase' throws and stops all other code from running.
var supabase;
if (window.supabase && typeof window.supabase.createClient === 'function') {
    supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
} else {
    console.warn('Supabase library not loaded; skipping Supabase initialisation');
    supabase = null;
}

// Slack webhook (optional) for lead notifications
var slackWebhook =
  (window.__ENV && (window.__ENV.SLACK_WEBHOOK_URL || window.__ENV.NEXT_PUBLIC_SLACK_WEBHOOK_URL)) ||
  (document.querySelector('meta[name="SLACK_WEBHOOK_URL"]')?.content) ||
  (document.querySelector('meta[name="NEXT_PUBLIC_SLACK_WEBHOOK_URL"]')?.content) ||
  (localStorage.getItem('SLACK_WEBHOOK_URL')) ||
  null;

async function utlyzeNotifySlack(context, payload) {
  try {
    // Prefer serverless proxy if available (protects secrets)
    const resp = await fetch('/api/notify-lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ context, payload })
    });
    if (!resp.ok) {
      // Fallback to direct webhook only if provided client-side (dev/local only)
      if (!slackWebhook) return;
      const site = window.location.origin || '';
      const title = `New ${context} lead`;
      const text = [
        `• Name: ${payload.name || [payload.first_name, payload.last_name].filter(Boolean).join(' ') || '—'}`,
        `• Company: ${payload.company || '—'}`,
        `• Email: ${payload.email || '—'}`,
        payload.interest ? `• Interest: ${payload.interest}` : (payload.primary_interest ? `• Interest: ${payload.primary_interest}` : ''),
        payload.message ? `• Message: ${payload.message}` : '',
        payload.utlyze_effective_monthly != null ? `• Est. Utlyze monthly: $${payload.utlyze_effective_monthly}` : '',
        payload.savings != null ? `• Est. savings: $${payload.savings}` : '',
        payload.roi_percentage != null ? `• ROI: ${payload.roi_percentage}%` : '',
        `• Page: ${payload.page_url || (site + window.location.pathname)}`,
        `• UTM: ${['source','medium','campaign','term','content'].map(k=>`${k}=${payload[`utm_${k}`]||''}`).join(' ')}`
      ].filter(Boolean).join('\n');
      await fetch(slackWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: `${title}\n${text}` })
      });
    }
  } catch (e) {
    console.warn('Slack notify failed:', e?.message || e);
  }
}
// Expose for other pages inline scripts
window.utlyzeNotifySlack = utlyzeNotifySlack;

// Early delegated handler: ensure toggle works before init completes
document.addEventListener('click', function(e) {
    const btn = e.target.closest && e.target.closest('.nav-toggle');
    if (!btn) return;
    // If not initialized yet, apply a minimal toggle so tests and users don't race init
    if (!btn.hasAttribute('data-initialized')) {
        e.preventDefault();
        e.stopPropagation();
        const menu = document.querySelector('.nav-links');
        if (!menu) return;
        const open = btn.getAttribute('aria-expanded') === 'true';
        const next = !open;
        btn.setAttribute('aria-expanded', String(next));
        menu.classList.toggle('nav-links--open', next);
        document.body.classList.toggle('menu-open', next);
        // Ensure menu is visible when opened even before full init
        if (next) {
            menu.style.opacity = '1';
            menu.style.visibility = 'visible';
            menu.style.pointerEvents = 'auto';
        } else {
            menu.style.opacity = '';
            menu.style.visibility = '';
            menu.style.pointerEvents = '';
        }
    }
}, true);

// Fallback HTML for mobile when fetch fails
const fallbackHeaderHTML = `<header class="site-header">
  <nav class="main-navigation" role="navigation" aria-label="Main navigation">
    <div class="nav-container">
      <a href="/" class="logo-link" aria-label="Utlyze Home">
        <span class="logo-text">Utlyze</span>
      </a>
      <ul class="nav-links">
        <li><a href="/" class="nav-link">Home</a></li>
        <li><a href="/agents/" class="nav-link">AI Agents</a></li>
        <li><a href="/pricing/" class="nav-link">Pricing & ROI</a></li>
        <li><a href="/use-cases/" class="nav-link">Use Cases</a></li>
        <li><a href="/studio/" class="nav-link">Venture Studio</a></li>
        <li><a href="/about/" class="nav-link">About</a></li>
        <li><a href="/resources/" class="nav-link">Resources</a></li>
        <li><a href="/contact/" class="nav-link">Contact</a></li>
      </ul>
      <button class="nav-toggle" aria-label="Toggle navigation menu" aria-expanded="false">
        <span class="nav-toggle-line"></span>
        <span class="nav-toggle-line"></span>
        <span class="nav-toggle-line"></span>
      </button>
    </div>
  </nav>
</header>`;

const fallbackFooterHTML = `<footer class="site-footer">
  <div class="footer-container">
    <div class="footer-content">
      <div class="footer-column">
        <h3 class="footer-heading">Product</h3>
        <ul class="footer-nav">
          <li><a href="/agents/" class="footer-link">Agents</a></li>
          <li><a href="/pricing/" class="footer-link">Pricing</a></li>
          <li><a href="/use-cases/" class="footer-link">Use Cases</a></li>
        </ul>
      </div>
      <div class="footer-column">
        <h3 class="footer-heading">Company</h3>
        <ul class="footer-nav">
          <li><a href="/about/" class="footer-link">About</a></li>
          <li><a href="/studio/" class="footer-link">Studio</a></li>
          <li><a href="/contact/" class="footer-link">Contact</a></li>
        </ul>
      </div>
      <div class="footer-column">
        <h3 class="footer-heading">Resources</h3>
        <ul class="footer-nav">
          <li><a href="/resources/" class="footer-link">Resources hub</a></li>
          <li><a href="/roi/" class="footer-link">ROI Calculator</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <p class="copyright">&copy; 2025 Utlyze. All rights reserved.</p>
    </div>
  </div>
</footer>`;

// Function to calculate the correct path prefix based on current page location
function getPathPrefix() {
    const pathname = window.location.pathname;
    const depth = (pathname.match(/\//g) || []).length - 1;
    
    // If we're at root or index.html at root
    if (depth === 0 || pathname === '/index.html' || pathname === '/') {
        return '.';
    }
    
    // Build relative path back to root
    return Array(depth).fill('..').join('/');
}

// Function to load header and footer partials with fallback
async function loadPartials() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isLocalFile = window.location.protocol === 'file:';
    const pathPrefix = getPathPrefix();
    
    // Load header
    const headerMount = document.getElementById('site-header-mount');
    if (headerMount) {
        let headerLoaded = false;
        
        // Always try to fetch partials unless running from local files
        if (!isLocalFile) {
            try {
                const headerResponse = await fetch(`${pathPrefix}/partials/header.html`);
                if (headerResponse.ok) {
                    const headerHTML = await headerResponse.text();
                    headerMount.innerHTML = headerHTML;
                    headerLoaded = true;
                    console.log('Header loaded via fetch from:', `${pathPrefix}/partials/header.html`);
                }
            } catch (error) {
                console.warn('Fetch failed for header, using fallback:', error.message);
            }
        }
        
        // Use fallback if fetch failed or running locally
        if (!headerLoaded) {
            headerMount.innerHTML = fallbackHeaderHTML;
            console.log('Header loaded via fallback injection');
        }
        
        // Initialize mobile menu with delay to ensure DOM is ready
        setTimeout(() => {
            initializeMobileMenu();
        }, 200);
        
        // Set active navigation state
        setTimeout(setActiveNavLink, 150);
        
        // Add fade-in animation if motion is allowed
        if (!prefersReducedMotion) {
            headerMount.style.opacity = '0';
            headerMount.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                headerMount.style.transition = 'opacity 0.4s ease-out, transform 0.4s ease-out';
                headerMount.style.opacity = '1';
                headerMount.style.transform = 'translateY(0)';
            }, 100);
        }
    }
    
    // Load footer
    const footerMount = document.getElementById('site-footer-mount');
    if (footerMount) {
        let footerLoaded = false;
        
        // Always try to fetch partials unless running from local files
        if (!isLocalFile) {
            try {
                const footerResponse = await fetch(`${pathPrefix}/partials/footer.html`);
                if (footerResponse.ok) {
                    const footerHTML = await footerResponse.text();
                    footerMount.innerHTML = footerHTML;
                    footerLoaded = true;
                    console.log('Footer loaded via fetch from:', `${pathPrefix}/partials/footer.html`);
                }
            } catch (error) {
                console.warn('Fetch failed for footer, using fallback:', error.message);
            }
        }
        
        // Use fallback if fetch failed or running locally
        if (!footerLoaded) {
            footerMount.innerHTML = fallbackFooterHTML;
            console.log('Footer loaded via fallback injection');
        }
        
        // Add fade-in animation if motion is allowed
        if (!prefersReducedMotion) {
            footerMount.style.opacity = '0';
            footerMount.style.transform = 'translateY(20px)';
            setTimeout(() => {
                footerMount.style.transition = 'opacity 0.4s ease-out, transform 0.4s ease-out';
                footerMount.style.opacity = '1';
                footerMount.style.transform = 'translateY(0)';
            }, 200);
        }
    }
}

// Set active navigation state
function setActiveNavLink() {
    const navLinks = document.querySelectorAll('.nav-link');
    // Normalize current path: remove trailing slash and query strings
    const currentPath = window.location.pathname.replace(/\/$/, '').split('?')[0];
    
    navLinks.forEach(link => {
        // Normalize link path: remove trailing slash
        const linkPath = link.getAttribute('href').replace(/\/$/, '');
        // Check exact match or if current path starts with link path (for nested pages)
        if (linkPath === currentPath || (linkPath !== '' && currentPath.startsWith(linkPath))) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Initialize mobile menu functionality
function initializeMobileMenu() {
    let menuToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-links');
    
    if (!menuToggle || !navMenu) {
        // Elements not found yet, might still be loading
        return;
    }

    // Remember original placement so we can restore it when closing
    let navOriginalParent = navMenu.parentNode;
    let navNextSibling = navMenu.nextSibling;

    const moveMenuToBody = () => {
        if (navMenu.parentNode !== document.body) {
            document.body.appendChild(navMenu);
        }
        // Ensure the menu truly overlays everything on mobile
        Object.assign(navMenu.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            width: '100vw',
            height: '100dvh',
            zIndex: '2147483647'
        });
    };

    const restoreMenuToHeader = () => {
        if (navOriginalParent && navMenu.parentNode === document.body) {
            if (navNextSibling) {
                navOriginalParent.insertBefore(navMenu, navNextSibling);
            } else {
                navOriginalParent.appendChild(navMenu);
            }
        }
        // Clean up inline styles so CSS controls layout again
        navMenu.removeAttribute('style');
    };

    // Focus trap helpers
    let removeFocusTrap = null;
    const enableFocusTrap = (container) => {
        const focusable = container.querySelectorAll(
            'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable.length) return () => {};
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const onKeyDown = (e) => {
            if (e.key !== 'Tab') return;
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        };
        document.addEventListener('keydown', onKeyDown, true);
        // return disposer
        return () => document.removeEventListener('keydown', onKeyDown, true);
    };

    const setMenuState = (open) => {
        const currentToggle = document.querySelector('.nav-toggle');
        const currentMenu = document.querySelector('.nav-links');
        if (!currentToggle || !currentMenu) return;
        currentToggle.setAttribute('aria-expanded', String(open));
        currentMenu.setAttribute('aria-hidden', String(!open));
        currentMenu.classList.toggle('nav-links--open', open);
        currentToggle.classList.toggle('nav-toggle--active', open);
        document.body.classList.toggle('menu-open', open);

        // Move menu to body when opening to avoid page content intercepting taps
        if (open) {
            moveMenuToBody();
            // Enable focus trap and move focus to first item
            if (removeFocusTrap) removeFocusTrap();
            removeFocusTrap = enableFocusTrap(currentMenu);
            const firstLink = currentMenu.querySelector('a, button, [tabindex]:not([tabindex="-1"])');
            if (firstLink) firstLink.focus();
        } else {
            restoreMenuToHeader();
            if (removeFocusTrap) {
                removeFocusTrap();
                removeFocusTrap = null;
            }
            // Return focus to the toggle for better accessibility
            currentToggle.focus();
        }
    };
    
    // Remove old event listeners if re-initializing
    if (menuToggle.hasAttribute('data-initialized')) {
        // Clone node to remove all event listeners
        const newToggle = menuToggle.cloneNode(true);
        menuToggle.parentNode.replaceChild(newToggle, menuToggle);
        // Update reference
        menuToggle = newToggle;
    }
    
    menuToggle.setAttribute('data-initialized', 'true');
    
    // Handle menu toggle click
    const handleToggle = function(e) {
        e.preventDefault();
        e.stopPropagation();
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        setMenuState(!isExpanded);
    };
    
    // Add event listeners for both click and touch
    menuToggle.addEventListener('click', handleToggle);
    
    // Handle touch events separately to prevent double-firing
    let touchHandled = false;
    menuToggle.addEventListener('touchstart', function(e) {
        touchHandled = true;
        handleToggle.call(this, e);
    }, { passive: false });
    
    menuToggle.addEventListener('mousedown', function(e) {
        if (!touchHandled) {
            e.preventDefault();
        }
        touchHandled = false;
    });
    
    // Close menu when clicking outside
    const handleOutsideClick = function(e) {
        const currentMenu = document.querySelector('.nav-links');
        const currentToggle = document.querySelector('.nav-toggle');
        if (currentMenu && currentMenu.classList.contains('nav-links--open')) {
            if (currentToggle && !currentToggle.contains(e.target) && !currentMenu.contains(e.target)) {
                setMenuState(false);
            }
        }
    };
    
    // Register outside click handler immediately so clicks outside close the menu reliably
    document.addEventListener('click', handleOutsideClick, true);
    document.addEventListener('touchstart', handleOutsideClick, { passive: true, capture: true });
    
    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        const currentMenu = document.querySelector('.nav-links');
        const currentToggle = document.querySelector('.nav-toggle');
        if (e.key === 'Escape' && currentMenu && currentMenu.classList.contains('nav-links--open')) {
            setMenuState(false);
            if (currentToggle) currentToggle.focus();
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // Load header and footer partials
    loadPartials();
    
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

    // Form handling for both home page and studio page
    const form = document.getElementById('ideaForm');
    const successMessage = document.getElementById('success-message');
    const formMessage = document.getElementById('formMessage');

    if (form) {
        // Check if it's the studio page form by looking for description field
        const isStudioForm = document.getElementById('description') !== null;
        
        // Ensure each form field is properly isolated
        const formFields = form.querySelectorAll('.glass-input, input[type="text"], input[type="email"], input[type="url"], textarea');
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
            
            // Add focus and blur handlers for premium effects (skip for studio form)
            if (!isStudioForm) {
                field.addEventListener('focus', handleFieldFocus);
                field.addEventListener('blur', handleFieldBlur);
            }
        });

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Clear previous errors
            clearAllErrors();
            
            // Validate form based on form type
            const isValid = isStudioForm ? validateStudioForm() : validateForm();
            
            if (isValid) {
                // Submit form based on type
                if (isStudioForm) {
                    submitStudioForm();
                } else {
                    submitFormWithAnimation();
                }
            }
        });
    }

    // Premium form validation functions
    function validateForm() {
        let isValid = true;
        
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
        
        // Company validation
        const companyField = document.getElementById('company');
        const companyValue = companyField ? companyField.value.trim() : '';
        if (!companyValue) {
            showError('company', 'Company name is required');
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
        
        // Interest validation
        const interestField = document.getElementById('interest');
        const interestValue = interestField ? interestField.value.trim() : '';
        if (!interestValue) {
            showError('interest', 'Please select your primary interest');
            isValid = false;
        }
        
        // Phone and message are optional - no validation needed
        // Company size is optional - no validation needed
        
        return isValid;
    }


    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // URL validator for optional URL fields on studio/contact forms
    function isValidURL(string) {
        try {
            let urlString = String(string || '').trim();
            if (!urlString) return false;
            if (!/^https?:\/\//i.test(urlString)) {
                urlString = 'https://' + urlString;
            }
            // Throws if invalid
            new URL(urlString);
            return true;
        } catch (_) {
            return false;
        }
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
            field.style.borderColor = 'var(--color-error)';
            field.style.boxShadow = '0 0 0 3px var(--color-focus-ring)';
            
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
            field.style.borderColor = 'var(--border-color)';
            field.style.boxShadow = 'none';
        }
    }

    // Validation for Studio form
    function validateStudioForm() {
        let isValid = true;
        
        // Name validation
        const nameField = document.getElementById('name');
        const nameValue = nameField ? nameField.value.trim() : '';
        if (!nameValue) {
            showStudioError('name', 'Name is required');
            isValid = false;
        } else if (nameValue.length < 2) {
            showStudioError('name', 'Name must be at least 2 characters');
            isValid = false;
        }
        
        // Email validation
        const emailField = document.getElementById('email');
        const emailValue = emailField ? emailField.value.trim() : '';
        if (!emailValue) {
            showStudioError('email', 'Email is required');
            isValid = false;
        } else if (!isValidEmail(emailValue)) {
            showStudioError('email', 'Please enter a valid email address');
            isValid = false;
        }
        
        // URL is optional in studio form
        const urlField = document.getElementById('url');
        const urlValue = urlField ? urlField.value.trim() : '';
        if (urlValue && !isValidURL(urlValue)) {
            showStudioError('url', 'Please enter a valid URL');
            isValid = false;
        }
        
        // Description validation
        const descField = document.getElementById('description');
        const descValue = descField ? descField.value.trim() : '';
        if (!descValue) {
            showStudioError('description', 'Please describe your idea');
            isValid = false;
        } else if (descValue.length < 20) {
            showStudioError('description', 'Please provide more details (at least 20 characters)');
            isValid = false;
        }
        
        return isValid;
    }

    function showStudioError(fieldId, message) {
        const field = document.getElementById(fieldId);
        if (field) {
            field.style.borderColor = 'var(--color-error)';
            field.focus();
            
            // Show error message in formMessage div
            const formMessage = document.getElementById('formMessage');
            if (formMessage) {
                formMessage.textContent = message;
                formMessage.className = 'form-message error';
                formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }

    async function submitStudioForm() {
        const submitButton = form.querySelector('.submit-btn');
        const originalText = submitButton.textContent;
        const formMessage = document.getElementById('formMessage');
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            url: document.getElementById('url').value || null,
            description: document.getElementById('description').value,
            created_at: new Date().toISOString()
        };
        
        // Show loading state
        submitButton.textContent = 'Submitting...';
        submitButton.disabled = true;
        
        try {
            // Submit to Supabase if available
            if (supabase) {
                const { data, error } = await supabase
                    .from('submissions')
                    .insert([formData]);
                
                if (error) throw error;
            }
            
            // Show success message
            if (formMessage) {
                formMessage.textContent = 'Thank you! Your idea has been submitted. We\'ll review it within 48 hours.';
                formMessage.className = 'form-message success';
                formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            
            // Reset form
            form.reset();
            
            // Reset button after delay
            setTimeout(() => {
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }, 3000);
            
        } catch (error) {
            console.error('Error submitting form:', error);
            
            // Show user-friendly error message
            if (formMessage) {
                let errorText = 'We encountered an issue submitting your idea. ';
                
                if (!navigator.onLine) {
                    errorText += 'Please check your internet connection and try again.';
                } else if (error.message && error.message.includes('duplicate')) {
                    errorText += 'It looks like you\'ve already submitted this idea. We\'ll review it soon!';
                } else if (error.code === '23505') {
                    errorText += 'This submission has already been received. We\'ll review it within 48 hours!';
                } else {
                    errorText += 'Please try again in a moment, or email us directly at hello@utlyze.com';
                }
                
                formMessage.textContent = errorText;
                formMessage.className = 'form-message error';
                formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // Auto-clear error after 10 seconds
                setTimeout(() => {
                    if (formMessage.className.includes('error')) {
                        formMessage.textContent = '';
                        formMessage.className = 'form-message';
                    }
                }, 10000);
            }
            
            // Reset button
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    }

    function clearAllErrors() {
        const errorElements = document.querySelectorAll('.form-error');
        const formFields = document.querySelectorAll('.glass-input, input[type="text"], input[type="email"], input[type="url"], textarea');
        const formMessage = document.getElementById('formMessage');
        
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
            field.style.borderColor = '';
            field.style.boxShadow = 'none';
            field.style.transform = 'scale(1)';
        });
        
        // Clear form message
        if (formMessage) {
            formMessage.textContent = '';
            formMessage.className = 'form-message';
        }
    }

    function handleFieldFocus(e) {
        const field = e.target;
        if (!field.classList.contains('error')) {
            field.style.borderColor = 'var(--utlyze-blue)';
            field.style.boxShadow = '0 0 0 3px var(--color-focus-ring)';
            field.style.transform = 'scale(1.01)';
            field.style.background = 'rgba(255, 255, 255, 0.2)';
        }
    }

    function handleFieldBlur(e) {
        const field = e.target;
        if (!field.classList.contains('error')) {
            field.style.borderColor = 'var(--border-color)';
            field.style.boxShadow = 'none';
            field.style.transform = 'scale(1)';
            field.style.background = 'rgba(255, 255, 255, 0.15)';
        }
    }

    async function submitFormWithAnimation() {
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        const formContainer = form.parentElement;
        
        // Build lead row for Edge Function (public.lead_forms)
        function parseUtm() {
            try {
                const u = new URL(window.location.href);
                const ks = ['utm_source','utm_medium','utm_campaign','utm_term','utm_content','ref'];
                const o = {};
                ks.forEach(k=>{ const v=u.searchParams.get(k); if(v) o[k]=v; });
                return o;
            } catch { return {}; }
        }

        const fullName = document.getElementById('name').value.trim();
        const companyName = document.getElementById('company').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = (document.getElementById('phone')?.value || '').trim();
        const interestVal = document.getElementById('interest').value;
        const messageVal = (document.getElementById('message')?.value || '').trim();
        const companySize = (document.getElementById('company_size')?.value || '').trim();

        const additional_info = JSON.stringify({
            contact_email: email,
            meta: {
                source_site: window.location.host,
                path: window.location.pathname,
                utm: parseUtm(),
                form: 'homepage'
            }
        });

        const row = {
            full_name: fullName,
            company_name: companyName,
            industry: null,
            title: null,
            value_message: messageVal || null,
            ideal_lead: '',
            lead_capacity: companySize || '',
            spend_range: '',
            success_rate: '',
            pain_points: interestVal || '',
            phone: phone || null,
            company_url: null,
            additional_info
        };

        const formData = {
            // Split name into first and last name
            first_name: document.getElementById('name').value.trim().split(' ')[0] || '',
            last_name: document.getElementById('name').value.trim().split(' ').slice(1).join(' ') || '',
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim() || null,
            company: document.getElementById('company').value.trim(),
            job_title: null, // Not collected on main form
            company_size: document.getElementById('company_size').value || null,
            industry: null, // Not collected on main form
            current_ai_usage: null, // Not collected on main form
            interested_solutions: [document.getElementById('interest').value], // Convert single value to array
            timeline: null, // Not collected on main form
            budget_range: null, // Not collected on main form
            pain_points: null, // Not collected on main form
            message: document.getElementById('message').value.trim() || null,
            // Track source
            utm_source: 'homepage',
            utm_medium: 'web',
            utm_campaign: 'main_form',
            referrer: document.referrer || null
        };
        
        // Show premium loading state
        submitButton.innerHTML = '<span style="opacity: 0.7;">Submitting...</span>';
        submitButton.disabled = true;
        submitButton.style.transform = 'scale(0.98)';
        
        // Add subtle pulse effect to form
        formContainer.style.animation = 'pulse-submit 1.5s ease-in-out';
        
        try {
            // Try Edge Function first (server-side insert to lead_forms)
            try {
                const resp = await fetch('https://kfdfbkchglfygyukstip.functions.supabase.co/lead-intake', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ row })
                });
                const j = await resp.json().catch(()=>({}));
                if (!resp.ok || j.ok === false) {
                    throw new Error(j.error || `Edge function error: ${resp.status}`);
                }
            } catch (edgeErr) {
                console.warn('Edge Function insert failed, attempting client insert', edgeErr);
                // Fallback to existing client insert path if supabase-js present
                if (supabase) {
                    const { error } = await supabase.from('lead_forms').insert([row]);
                    if (error) throw error;
                }
            }
            // Non-blocking Slack notification (best-effort)
            utlyzeNotifySlack('homepage', {
              first_name: formData.first_name,
              last_name: formData.last_name,
              email: formData.email,
              company: formData.company,
              interest: (formData.interested_solutions && formData.interested_solutions[0]) || null,
              message: formData.message || null,
              utm_source: formData.utm_source,
              utm_medium: formData.utm_medium,
              utm_campaign: formData.utm_campaign,
              referrer: formData.referrer,
              page_url: window.location.href
            });
            
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
            // Best-effort Slack even on DB failure
            try {
                const utm = { utm_source: 'homepage', utm_medium: 'web', utm_campaign: 'main_form' };
                if (window.utlyzeNotifySlack) {
                    await window.utlyzeNotifySlack('homepage-error', {
                        name: document.getElementById('name')?.value.trim() || '',
                        email: document.getElementById('email')?.value.trim() || '',
                        company: document.getElementById('company')?.value.trim() || '',
                        interest: document.getElementById('interest')?.value || '',
                        message: document.getElementById('message')?.value.trim() || '',
                        ...utm,
                        page_url: window.location.href,
                        error: (error && (error.message || String(error))) || 'unknown'
                    });
                }
            } catch (_) {}
            
            // Show user-friendly error message
            const errorDiv = document.createElement('div');
            errorDiv.className = 'form-error-message';
            errorDiv.style.cssText = `
                background: linear-gradient(135deg, var(--color-error), var(--color-error));
                color: white;
                padding: 15px 20px;
                border-radius: 8px;
                margin: 20px 0;
                font-size: 14px;
                line-height: 1.5;
                box-shadow: 0 4px 15px rgba(var(--color-error-rgb), 0.3);
                animation: slideIn 0.4s ease-out;
            `;
            
            // Determine specific error message
            let errorMessage = 'We encountered an issue submitting your form. ';
            if (!navigator.onLine) {
                errorMessage += 'Please check your internet connection and try again.';
            } else if (error.message && error.message.includes('duplicate')) {
                errorMessage += 'It looks like you\'ve already submitted this form. We\'ll be in touch soon!';
            } else if (error.code === '23505') {
                errorMessage += 'This email has already been registered. We\'ll be in touch soon!';
            } else {
                errorMessage += 'Please try again in a moment, or contact us directly at hello@utlyze.com';
            }
            
            errorDiv.textContent = errorMessage;
            
            // Insert error message after the form
            form.parentNode.insertBefore(errorDiv, form.nextSibling);
            
            // Auto-remove error after 8 seconds
            setTimeout(() => {
                errorDiv.style.opacity = '0';
                errorDiv.style.transform = 'translateY(-10px)';
                setTimeout(() => errorDiv.remove(), 400);
            }, 8000);
            
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
                background: linear-gradient(45deg, var(--utlyze-orange), var(--utlyze-blue));
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
            page: window.location.pathname,
            analyticsId: element.getAttribute && element.getAttribute('data-analytics-id') || null,
            timestamp: new Date().toISOString(),
            position: {
                x: element.getBoundingClientRect().left,
                y: element.getBoundingClientRect().top
            }
        });
    }

    // Track premium CTA clicks
    const ctaButtons = document.querySelectorAll('.btn--primary, .btn-primary');
    ctaButtons.forEach(button => {
        button.addEventListener('click', () => {
            trackClick(button, 'primary_cta_click');
            // Add premium click effect
            createClickRipple(button);
        });
    });

    // Track secondary button clicks
    const secondaryButtons = document.querySelectorAll('.btn--outline, .btn-secondary');
    secondaryButtons.forEach(button => {
        button.addEventListener('click', () => {
            trackClick(button, 'secondary_cta_click');
            createClickRipple(button);
        });
    });

    // Track pricing/other CTA anchors
    const pricingCtas = document.querySelectorAll('.tier-cta, .cta-button, .schedule-button');
    pricingCtas.forEach(button => {
        button.addEventListener('click', () => {
            trackClick(button, 'tertiary_cta_click');
            createClickRipple(button);
        });
    });

    // Canonical CTA analytics
    const demoLinks = document.querySelectorAll('a[href*="/contact?context=demo"]');
    demoLinks.forEach(link => {
        link.addEventListener('click', () => trackClick(link, 'click_cta_demo'));
    });
    const roiLinks = document.querySelectorAll('a[href="/roi/"], a[href*="/roi#"], a[href*="/roi?"]');
    roiLinks.forEach(link => {
        link.addEventListener('click', () => trackClick(link, 'click_cta_roi'));
    });

    // Form submit analytics
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', () => trackClick(contactForm, 'form_submit_contact'));
    }
    const roiForm = document.getElementById('calcForm');
    if (roiForm) {
        roiForm.addEventListener('submit', () => trackClick(roiForm, 'form_submit_roi_calc'));
    }

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

  // Sync tier pricing for Home and Pricing from canonical assets/data/tiers.json
  (async function syncTierPricing() {
    try {
      const pathPrefix = getPathPrefix();
      const res = await fetch(`${pathPrefix}/assets/data/tiers.json`, { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();
      const tiersArr = data.tiers || [];

      // Build a lookup by id
      const byId = Object.fromEntries(tiersArr.map(t => [t.id, t]));
      // Map legacy keys used on Home to canonical ids
      const legacyMap = { TierA: 'team', TierB: 'workflow', TierC: 'autonomy' };

      // Home page cards (data-tier="TierA|TierB|TierC")
      document.querySelectorAll('.tier-card[data-tier]').forEach(card => {
        const legacy = card.getAttribute('data-tier');
        const id = legacyMap[legacy] || legacy;
        const t = byId[id];
        if (!t) return;
        const monthly = card.querySelector('.tier-monthly');
        const setup = card.querySelector('.tier-setup');
        if (monthly && t.monthly != null) {
          monthly.textContent = `$${Number(t.monthly).toLocaleString()}/month`;
        }
        if (setup && t.setup != null) {
          setup.textContent = `Setup: $${Number(t.setup).toLocaleString()}`;
        }
      });

      // Pricing page cards that render server-side markup (monthly-cost/setup-cost)
      const setMonthly = (root, value) => {
        if (!root || value == null) return;
        const period = root.querySelector('.period');
        root.textContent = `$${Number(value).toLocaleString()}`;
        if (period) {
          root.appendChild(period);
        } else {
          const span = document.createElement('span');
          span.className = 'period';
          span.textContent = '/month';
          root.appendChild(span);
        }
      };

      const setSetup = (root, value) => {
        if (!root || value == null) return;
        root.textContent = `Setup: $${Number(value).toLocaleString()}`;
      };

      const tA = byId['team'];
      const tB = byId['workflow'];
      const tC = byId['autonomy'];
      setMonthly(document.querySelector('.tier-card.tier-a .monthly-cost'), tA?.monthly);
      setMonthly(document.querySelector('.tier-card.tier-b .monthly-cost'), tB?.monthly);
      setMonthly(document.querySelector('.tier-card.tier-c .monthly-cost'), tC?.monthly);
      setSetup(document.querySelector('.tier-card.tier-a .setup-cost'), tA?.setup);
      setSetup(document.querySelector('.tier-card.tier-b .setup-cost'), tB?.setup);
      setSetup(document.querySelector('.tier-card.tier-c .setup-cost'), tC?.setup);
    } catch (e) {
      // Silent failure to avoid blocking page
    }
  })();

  // Inject breadcrumb on Use Case detail pages (Use Cases > [Case])
  (function injectUseCaseBreadcrumb() {
    try {
      const path = window.location.pathname.replace(/\/$/, '');
      if (!path.startsWith('/use-cases/') || path === '/use-cases') return;
      const segments = path.split('/').filter(Boolean);
      if (segments.length < 2) return; // not a detail page
      const container = document.querySelector('main .container');
      if (!container) return;
      const firstSection = container.querySelector('.section-content');
      const nav = document.createElement('nav');
      nav.className = 'breadcrumb';
      nav.setAttribute('aria-label', 'Breadcrumb');
      nav.innerHTML = `
        <a href="/use-cases/" class="breadcrumb-link">Use Cases</a>
        <span class="breadcrumb-sep">/</span>
        <span class="breadcrumb-current">${document.querySelector('h1')?.textContent || segments[1].replace(/-/g,' ')}</span>
      `;
      if (firstSection) {
        firstSection.parentNode.insertBefore(nav, firstSection);
      } else {
        container.insertBefore(nav, container.firstChild);
      }
    } catch {}
  })();

  // Resources page enhancements (scrollspy, anchors, rail, CTAs)
  try {
    if (document.body.classList.contains('resources-page')) initResourcesPage();
  } catch (e) { console.warn('Resources init error', e); }
  
  function initResourcesPage() {
    const quicknav = document.querySelector('.resources-quicknav');
    const railTocList = document.getElementById('railTocList');
    const backToTop = document.getElementById('backToTop');
    const sectionIds = ['on-prem-vs-cloud','implementation-roadmap','security-compliance','roi','model-selection','conclusion'];
    const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);

    // Smooth scroll for internal anchors
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', (e) => {
        const href = a.getAttribute('href');
        if (!href || href === '#') return;
        const id = href.slice(1);
        const target = document.getElementById(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          history.replaceState(null, '', `#${id}`);
        }
      });
    });

    // Build right-rail TOC from H2s
    if (railTocList) {
      railTocList.innerHTML = '';
      sections.forEach(sec => {
        const h2 = sec.querySelector('h2');
        if (!h2) return;
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = `#${sec.id}`;
        a.textContent = h2.textContent.replace(/\s+/g,' ').trim();
        li.appendChild(a);
        railTocList.appendChild(li);
      });
    }

    // Scrollspy via IntersectionObserver
    const quickLinks = quicknav ? Array.from(quicknav.querySelectorAll('a')) : [];
    const railLinks = railTocList ? Array.from(railTocList.querySelectorAll('a')) : [];
    const setActive = (id) => {
      const update = links => links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${id}`));
      update(quickLinks); update(railLinks);
    };
    const spy = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0.01 });
    sections.forEach(sec => spy.observe(sec));

    // Heading anchors + copy link on H2/H3
    const addAnchors = () => {
      const toSlug = (txt) => txt.toLowerCase().trim().replace(/[^a-z0-9\s-]/g,'').replace(/\s+/g,'-');
      document.querySelectorAll('section .section-content h2, section .section-content h3').forEach(h => {
        if (!h.id) {
          const proposed = toSlug(h.textContent);
          const sec = h.closest('section[id]');
          // Avoid duplicate ids when section already uses the same id
          h.id = (sec && sec.id === proposed) ? `${proposed}-title` : proposed;
        }
        if (h.querySelector('.anchor-link')) return;
        const a = document.createElement('a');
        a.className = 'anchor-link';
        a.href = `#${h.id}`;
        a.setAttribute('aria-label', 'Copy link to this section');
        a.textContent = '#';
        a.addEventListener('click', (e) => {
          e.preventDefault();
          const url = `${location.origin}${location.pathname}#${h.id}`;
          navigator.clipboard && navigator.clipboard.writeText(url).catch(()=>{});
          history.replaceState(null, '', `#${h.id}`);
        });
        h.appendChild(a);
      });
    };
    addAnchors();

    // Convert inline (source: domain) notes into links; annotate internal
    try {
      const nodes = document.querySelectorAll('.section-text p, .section-text li');
      nodes.forEach(node => {
        const html = node.innerHTML;
        node.innerHTML = html.replace(/\(source: ([^\)]+)\)/gi, (m, src) => {
          const trimmed = (src || '').trim();
          if (!trimmed) return m;
          if (trimmed.includes('utlyze.com')) {
            return '(Utlyze internal analysis (2025))';
          }
          const url = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed.replace(/\.$/,'')}`;
          return `(source: <a href="${url}" target="_blank" rel="noopener noreferrer">${trimmed}</a>)`;
        });
      });
    } catch {}

    // Collapsible H3 under Security on mobile with persisted state
    const mql = window.matchMedia('(max-width: 900px)');
    const security = document.getElementById('security-compliance');
    const collKey = (id) => `resources-collapse-${id}`;
    if (security) {
      const h3s = Array.from(security.querySelectorAll('h3'));
      const apply = () => {
        const mobile = mql.matches;
        h3s.forEach(h3 => {
          let content = h3.nextElementSibling;
          // group contiguous siblings until next heading
          const group = [];
          while (content && !(content.tagName && /^H[23]$/.test(content.tagName))) {
            group.push(content);
            content = content.nextElementSibling;
          }
          const id = h3.id || (h3.id = h3.textContent.trim().toLowerCase().replace(/[^a-z0-9\s-]/g,'').replace(/\s+/g,'-'));
          const collapsed = localStorage.getItem(collKey(id)) === '1';
          h3.style.cursor = mobile ? 'pointer' : '';
          if (mobile) {
            h3.addEventListener('click', () => {
              const now = !group[0] || group[0].style.display !== 'none' ? true : false;
              group.forEach(el => el.style.display = now ? 'none' : '');
              localStorage.setItem(collKey(id), now ? '1' : '0');
            });
            group.forEach(el => el.style.display = collapsed ? 'none' : '');
          } else {
            group.forEach(el => el.style.display = '');
          }
        });
      };
      apply();
      mql.addEventListener('change', apply);
    }

    // Back to top
    if (backToTop) {
      window.addEventListener('scroll', () => {
        const y = window.scrollY || document.documentElement.scrollTop;
        backToTop.classList.toggle('visible', y > 800);
      }, { passive: true });
      backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    // Insert SectionIntro cards and Micro CTAs
    const metaRead = (min) => `<span class="intro-meta">Estimated read: ${min}</span>`;
    const intros = {
      'on-prem-vs-cloud': { bullets: ['Latency, cost, compliance trade‑offs','Where on‑prem vs cloud excel','How to evaluate hybrid'], read: '3–5 min' },
      'implementation-roadmap': { bullets: ['Phased rollout (30–60–90)','Success criteria & KPIs','Common blockers to avoid'], read: '3–5 min' },
      'security-compliance': { bullets: ['Controls that matter most','PII/SPI handling patterns','Audit & monitoring checklist'], read: '3–4 min' },
      'roi': { bullets: ['Drivers of AI ROI','Cost levers to optimize','Benchmarks and targets'], read: '2–3 min' },
      'model-selection': { bullets: ['Right‑sizing models','Fine‑tuning vs RAG','Licensing considerations'], read: '3–4 min' }
    };
    const micro = {
      'on-prem-vs-cloud': { label: 'Open TCO/Latency Estimator', href: '/contact/#tco' },
      'implementation-roadmap': { label: 'Download 30–60–90 Plan', href: '/contact/#plan' },
      'security-compliance': { label: 'Get Controls Checklist', href: '/contact/#security-checklist' },
      'roi': { label: 'Open ROI Calculator', href: '/roi/' },
      'model-selection': { label: 'Download Model Decision Tree', href: '/contact/#model-decision-tree' }
    };
    sections.forEach(sec => {
      const art = sec.querySelector('.section-content');
      const h2 = art && art.querySelector('h2');
      if (art && h2) {
        const id = sec.id;
        const intro = intros[id];
        if (intro) {
          const wrap = document.createElement('div');
          wrap.className = 'section-intro';
          wrap.innerHTML = `
            <div class="intro-title">What you’ll learn</div>
            ${metaRead(intro.read)}
            <ul>${intro.bullets.map(b=>`<li>${b}</li>`).join('')}</ul>
          `;
          h2.insertAdjacentElement('afterend', wrap);
        }
        const m = micro[id];
        if (m) {
          const cta = document.createElement('div');
          cta.className = 'micro-cta';
          cta.innerHTML = `<span class="label">Next step</span><a class="btn btn--outline btn-sm" href="${m.href}">${m.label}</a>`;
          art.appendChild(cta);
        }
      }
    });
  }
});
