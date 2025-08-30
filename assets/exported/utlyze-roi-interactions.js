/* ========================================
   UTLYZE ROI PAGE - ADVANCED UI INTERACTIONS
   Engineering Implementation Guide
   ======================================== */

class UtlyzeROICalculator {
  constructor() {
    this.state = {
      mode: 'regular',
      currentSpend: null,
      spendRange: null,
      advancedData: {
        tokensPerRequest: null,
        callsPerDay: null,
        pricePerThousand: null
      },
      results: null,
      isCalculating: false
    };

    this.init();
  }

  /* ========================================
     1. INITIALIZATION & SETUP
     ======================================== */
  init() {
    this.setupEventListeners();
    this.initializeAnimations();
    this.setupIntersectionObserver();
    this.initializeFormValidation();
  }

  setupEventListeners() {
    // Mode toggle
    document.querySelectorAll('.form-mode-toggle__button').forEach(btn => {
      btn.addEventListener('click', (e) => this.handleModeSwitch(e));
    });

    // Spend range selection
    document.querySelectorAll('.range-option').forEach(option => {
      option.addEventListener('click', (e) => this.handleRangeSelection(e));
    });

    // Form inputs with debouncing
    const inputs = document.querySelectorAll('.form-input');
    inputs.forEach(input => {
      input.addEventListener('input', this.debounce((e) => {
        this.handleInputChange(e);
      }, 300));
    });

    // FAQ accordions
    document.querySelectorAll('.faq-question').forEach(question => {
      question.addEventListener('click', (e) => this.toggleFAQ(e));
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => this.smoothScroll(e));
    });
  }

  /* ========================================
     2. FORM INTERACTIONS
     ======================================== */
  handleModeSwitch(e) {
    const button = e.currentTarget;
    const mode = button.dataset.mode;

    // Update state
    this.state.mode = mode;

    // Update UI
    document.querySelectorAll('.form-mode-toggle__button').forEach(btn => {
      btn.classList.remove('form-mode-toggle__button--active');
    });
    button.classList.add('form-mode-toggle__button--active');

    // Animate form transition
    this.animateFormTransition(mode);
  }

  animateFormTransition(mode) {
    const regularFields = document.querySelector('.regular-mode-fields');
    const advancedFields = document.querySelector('.advanced-mode-fields');

    // Fade out current fields
    const currentFields = mode === 'regular' ? advancedFields : regularFields;
    const newFields = mode === 'regular' ? regularFields : advancedFields;

    currentFields.style.opacity = '0';
    currentFields.style.transform = 'translateY(10px)';

    setTimeout(() => {
      currentFields.classList.add('hidden');
      newFields.classList.remove('hidden');

      // Force reflow
      void newFields.offsetWidth;

      // Fade in new fields
      newFields.style.opacity = '1';
      newFields.style.transform = 'translateY(0)';
    }, 300);
  }

  handleRangeSelection(e) {
    const option = e.currentTarget;
    const range = option.dataset.range;

    // Update state
    this.state.spendRange = range;

    // Update UI
    document.querySelectorAll('.range-option').forEach(opt => {
      opt.classList.remove('range-option--selected');
    });
    option.classList.add('range-option--selected');

    // Animate selection
    this.animateSelection(option);

    // Trigger calculation
    this.calculateROI();
  }

  handleInputChange(e) {
    const input = e.target;
    const value = input.value;
    const field = input.dataset.field;

    // Validate input
    if (!this.validateInput(input)) {
      return;
    }

    // Update state based on field
    if (this.state.mode === 'regular') {
      this.state.currentSpend = value;
    } else {
      this.state.advancedData[field] = value;
    }

    // Live calculation
    if (this.hasRequiredData()) {
      this.calculateROI();
    }
  }

  /* ========================================
     3. VALIDATION & CALCULATION
     ======================================== */
  validateInput(input) {
    const value = input.value;
    const type = input.type;

    if (type === 'number') {
      const num = parseFloat(value);
      if (isNaN(num) || num < 0) {
        this.showValidationError(input, 'Please enter a valid positive number');
        return false;
      }
    }

    this.clearValidationError(input);
    return true;
  }

  showValidationError(input, message) {
    const formGroup = input.closest('.form-group');
    let errorEl = formGroup.querySelector('.form-error');

    if (!errorEl) {
      errorEl = document.createElement('span');
      errorEl.className = 'form-error';
      formGroup.appendChild(errorEl);
    }

    errorEl.textContent = message;
    errorEl.style.opacity = '1';
    input.classList.add('form-input--error');
  }

  clearValidationError(input) {
    const formGroup = input.closest('.form-group');
    const errorEl = formGroup.querySelector('.form-error');

    if (errorEl) {
      errorEl.style.opacity = '0';
      setTimeout(() => errorEl.remove(), 300);
    }

    input.classList.remove('form-input--error');
  }

  hasRequiredData() {
    if (this.state.mode === 'regular') {
      return this.state.currentSpend || this.state.spendRange;
    } else {
      const { tokensPerRequest, callsPerDay, pricePerThousand } = this.state.advancedData;
      return tokensPerRequest && callsPerDay && pricePerThousand;
    }
  }

  calculateROI() {
    // Show calculating state
    this.showCalculatingState();

    // Simulate API call with sophisticated calculation
    setTimeout(() => {
      const savings = this.performCalculation();
      this.displayResults(savings);
      this.hideCalculatingState();
    }, 800);
  }

  performCalculation() {
    let monthlySpend;

    if (this.state.mode === 'regular') {
      // Use direct input or range midpoint
      if (this.state.currentSpend) {
        monthlySpend = parseFloat(this.state.currentSpend);
      } else {
        const rangeMap = {
          'under-1k': 500,
          '1k-5k': 3000,
          '5k-20k': 12500,
          '20k+': 30000
        };
        monthlySpend = rangeMap[this.state.spendRange] || 0;
      }
    } else {
      // Calculate from advanced inputs
      const { tokensPerRequest, callsPerDay, pricePerThousand } = this.state.advancedData;
      const dailyTokens = tokensPerRequest * callsPerDay;
      const monthlyTokens = dailyTokens * 30;
      monthlySpend = (monthlyTokens / 1000) * pricePerThousand;
    }

    // Calculate savings (30-70% range)
    const minSavings = monthlySpend * 0.3;
    const maxSavings = monthlySpend * 0.7;
    const avgSavings = (minSavings + maxSavings) / 2;

    return {
      currentSpend: monthlySpend,
      minSavings,
      maxSavings,
      avgSavings,
      newSpend: monthlySpend - avgSavings,
      percentageSaved: Math.round((avgSavings / monthlySpend) * 100)
    };
  }

  /* ========================================
     4. RESULTS DISPLAY
     ======================================== */
  displayResults(savings) {
    const resultsContainer = document.querySelector('.results-container');

    // Create or update results HTML
    resultsContainer.innerHTML = `
      <div class="results-card animate-in">
        <h3 class="results-title">Your Estimated Savings</h3>

        <div class="savings-highlight">
          <div class="savings-percentage">${savings.percentageSaved}%</div>
          <div class="savings-label">Average Savings</div>
        </div>

        <div class="savings-breakdown">
          <div class="savings-item">
            <span class="savings-item-label">Current monthly spend</span>
            <span class="savings-item-value">$${this.formatNumber(savings.currentSpend)}</span>
          </div>

          <div class="savings-item">
            <span class="savings-item-label">Estimated new spend</span>
            <span class="savings-item-value savings-item-value--highlight">
              $${this.formatNumber(savings.newSpend)}
            </span>
          </div>

          <div class="savings-range">
            <span class="savings-range-label">Monthly savings range</span>
            <div class="savings-range-values">
              $${this.formatNumber(savings.minSavings)} - $${this.formatNumber(savings.maxSavings)}
            </div>
          </div>
        </div>

        <div class="results-actions">
          <button class="button button--primary" onclick="utlyzeROI.showContactForm()">
            Get Your Custom Quote
          </button>
          <button class="button button--secondary" onclick="utlyzeROI.downloadReport()">
            Download Full Report
          </button>
        </div>
      </div>
    `;

    // Animate results in
    setTimeout(() => {
      resultsContainer.querySelector('.results-card').classList.add('animate-in--visible');
    }, 100);
  }

  /* ========================================
     5. ANIMATIONS & EFFECTS
     ======================================== */
  initializeAnimations() {
    // Add smooth entrance animations to all sections
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach((el, index) => {
      el.style.transitionDelay = `${index * 100}ms`;
    });
  }

  setupIntersectionObserver() {
    const options = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');

          // Special animations for certain elements
          if (entry.target.classList.contains('feature-card')) {
            this.animateFeatureCard(entry.target);
          }
        }
      });
    }, options);

    // Observe all animated elements
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el);
    });
  }

  animateFeatureCard(card) {
    const icon = card.querySelector('.feature-card__icon');
    if (icon) {
      icon.style.animation = 'pulse 2s infinite';
    }
  }

  animateSelection(element) {
    // Create ripple effect
    const ripple = document.createElement('span');
    ripple.className = 'selection-ripple';
    element.appendChild(ripple);

    // Position ripple at click point
    const rect = element.getBoundingClientRect();
    ripple.style.left = '50%';
    ripple.style.top = '50%';

    // Trigger animation
    setTimeout(() => {
      ripple.classList.add('selection-ripple--active');
    }, 10);

    // Clean up
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  /* ========================================
     6. FAQ INTERACTIONS
     ======================================== */
  toggleFAQ(e) {
    const question = e.currentTarget;
    const item = question.closest('.faq-item');
    const isOpen = item.classList.contains('faq-item--open');

    // Close all other FAQs
    document.querySelectorAll('.faq-item').forEach(faq => {
      if (faq !== item) {
        faq.classList.remove('faq-item--open');
      }
    });

    // Toggle current FAQ
    if (!isOpen) {
      item.classList.add('faq-item--open');
      this.animateFAQOpen(item);
    } else {
      item.classList.remove('faq-item--open');
    }
  }

  animateFAQOpen(item) {
    const answer = item.querySelector('.faq-answer');
    answer.style.maxHeight = answer.scrollHeight + 'px';

    setTimeout(() => {
      answer.style.maxHeight = 'none';
    }, 300);
  }

  /* ========================================
     7. UTILITY FUNCTIONS
     ======================================== */
  debounce(func, wait) {
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

  formatNumber(num) {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
  }

  smoothScroll(e) {
    e.preventDefault();
    const targetId = e.currentTarget.getAttribute('href').slice(1);
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      const offset = 80; // Account for fixed header
      const targetPosition = targetElement.offsetTop - offset;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  }

  showCalculatingState() {
    const button = document.querySelector('.calculate-button');
    if (button) {
      button.classList.add('button--loading');
      button.textContent = 'Calculating...';
    }
  }

  hideCalculatingState() {
    const button = document.querySelector('.calculate-button');
    if (button) {
      button.classList.remove('button--loading');
      button.textContent = 'Calculate Savings';
    }
  }

  /* ========================================
     8. CONTACT FORM & REPORT
     ======================================== */
  showContactForm() {
    // Implementation for showing contact form modal
    console.log('Show contact form modal');
    // This would typically open a modal or scroll to contact section
  }

  downloadReport() {
    // Implementation for generating and downloading PDF report
    console.log('Generate and download PDF report');
    // This would typically generate a PDF with the calculation results
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.utlyzeROI = new UtlyzeROICalculator();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = UtlyzeROICalculator;
}
