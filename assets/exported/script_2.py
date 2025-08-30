# Create a comprehensive HTML structure demonstrating the redesigned ROI page
html_content = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ROI Calculator - Utlyze | Cut AI Spend 30-70%</title>
    <link rel="stylesheet" href="utlyze-roi-modern-ui.css">
    <script src="utlyze-roi-interactions.js" defer></script>
</head>
<body>
    <!-- ========================================
         HERO SECTION
         Masterful first impression
         ======================================== -->
    <section class="hero">
        <div class="container">
            <div class="hero__content animate-on-scroll">
                <h1 class="hero__title">
                    Cut AI spend 30–70%<br>
                    without sacrificing quality
                </h1>
                <p class="hero__subtitle">
                    Private models. Predictable pricing. Results you can measure.
                </p>
                
                <!-- Industry badges for credibility -->
                <div class="industry-badges">
                    <span class="industry-badge">Insurance</span>
                    <span class="industry-badge">Finance</span>
                    <span class="industry-badge">Professional Services</span>
                </div>
            </div>
        </div>
    </section>
    
    <!-- ========================================
         ROI CALCULATOR SECTION
         Focused interaction design
         ======================================== -->
    <section class="section">
        <div class="container">
            <div class="grid grid--2-cols">
                <!-- Left: Value Proposition -->
                <div class="value-proposition animate-on-scroll">
                    <h2 class="content-section__title">Why Utlyze?</h2>
                    
                    <div class="feature-cards">
                        <div class="feature-card">
                            <div class="feature-card__icon">💰</div>
                            <h3 class="feature-card__title">Predictable pricing</h3>
                            <p class="feature-card__description">
                                No surprise bills. Fixed monthly costs you can budget for.
                            </p>
                        </div>
                        
                        <div class="feature-card">
                            <div class="feature-card__icon">🔒</div>
                            <h3 class="feature-card__title">Private by design</h3>
                            <p class="feature-card__description">
                                Your data never leaves your infrastructure. Complete control.
                            </p>
                        </div>
                        
                        <div class="feature-card">
                            <div class="feature-card__icon">⚡</div>
                            <h3 class="feature-card__title">Performance parity</h3>
                            <p class="feature-card__description">
                                Match or exceed GPT-4 performance on your specific tasks.
                            </p>
                        </div>
                    </div>
                </div>
                
                <!-- Right: Calculator -->
                <div class="roi-calculator animate-on-scroll">
                    <h2 class="text-center mb-4">Estimate Your Savings</h2>
                    
                    <!-- Mode Toggle -->
                    <div class="form-mode-toggle">
                        <button class="form-mode-toggle__button form-mode-toggle__button--active" 
                                data-mode="regular">
                            Regular
                        </button>
                        <button class="form-mode-toggle__button" 
                                data-mode="advanced">
                            Advanced
                        </button>
                    </div>
                    <p class="text-center text-sm text-secondary mb-4">
                        Regular: enter current monthly spend. Advanced: enter tokens, calls, and price.
                    </p>
                    
                    <!-- Regular Mode Fields -->
                    <div class="regular-mode-fields">
                        <div class="form-group">
                            <label class="form-label">
                                Your current monthly AI spend ($)
                            </label>
                            <input type="number" 
                                   class="form-input" 
                                   placeholder="Enter amount"
                                   data-field="currentSpend">
                            
                            <p class="form-helper-text mt-2">
                                Not sure? Pick a range
                            </p>
                            
                            <div class="spend-range-selector mt-3">
                                <div class="range-option" data-range="under-1k">
                                    Under $1k
                                </div>
                                <div class="range-option" data-range="1k-5k">
                                    $1k–$5k
                                </div>
                                <div class="range-option" data-range="5k-20k">
                                    $5k–$20k
                                </div>
                                <div class="range-option" data-range="20k+">
                                    $20k+
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Advanced Mode Fields -->
                    <div class="advanced-mode-fields hidden">
                        <div class="form-group">
                            <label class="form-label">
                                Typical response length (tokens per request)
                            </label>
                            <input type="number" 
                                   class="form-input" 
                                   placeholder="e.g. 500"
                                   data-field="tokensPerRequest">
                            <p class="form-helper-text">
                                A token ≈ ¾ of a word
                            </p>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">
                                AI calls per day
                            </label>
                            <input type="number" 
                                   class="form-input" 
                                   placeholder="e.g. 1000"
                                   data-field="callsPerDay">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">
                                Price per 1,000 tokens ($)
                            </label>
                            <input type="number" 
                                   class="form-input" 
                                   placeholder="e.g. 0.002"
                                   step="0.001"
                                   data-field="pricePerThousand">
                            <p class="form-helper-text">
                                Not sure? $0.002 is a good default
                            </p>
                        </div>
                    </div>
                    
                    <!-- Results Container -->
                    <div class="results-container mt-4">
                        <!-- Results will be dynamically inserted here -->
                    </div>
                </div>
            </div>
        </div>
    </section>
    
    <!-- ========================================
         HOW IT WORKS SECTION
         Clear process visualization
         ======================================== -->
    <section class="content-section">
        <div class="container">
            <h2 class="content-section__title animate-on-scroll">How it works</h2>
            
            <div class="process-steps">
                <div class="process-step animate-on-scroll">
                    <div class="process-step__number">1</div>
                    <h3 class="process-step__title">Share your task and data shape</h3>
                    <p class="process-step__description">
                        Tell us about your use case and requirements
                    </p>
                </div>
                
                <div class="process-step animate-on-scroll">
                    <div class="process-step__number">2</div>
                    <h3 class="process-step__title">We fine-tune and host your model</h3>
                    <p class="process-step__description">
                        Custom optimization for your specific needs
                    </p>
                </div>
                
                <div class="process-step animate-on-scroll">
                    <div class="process-step__number">3</div>
                    <h3 class="process-step__title">You get a predictable private API</h3>
                    <p class="process-step__description">
                        Fixed costs, no surprises, complete control
                    </p>
                </div>
            </div>
        </div>
    </section>
    
    <!-- ========================================
         FAQ SECTION
         Elegant information disclosure
         ======================================== -->
    <section class="content-section">
        <div class="container">
            <h2 class="content-section__title animate-on-scroll">FAQ</h2>
            
            <div class="faq-list">
                <div class="faq-item animate-on-scroll">
                    <button class="faq-question">
                        How is the model secured?
                        <svg class="faq-icon" width="20" height="20" viewBox="0 0 20 20">
                            <path fill="currentColor" d="M5 7l5 5 5-5z"/>
                        </svg>
                    </button>
                    <div class="faq-answer">
                        VPC isolation, encryption, RBAC, audit logs. Your data never leaves 
                        your infrastructure, ensuring complete privacy and compliance.
                    </div>
                </div>
                
                <div class="faq-item animate-on-scroll">
                    <button class="faq-question">
                        Will performance match GPT-4?
                        <svg class="faq-icon" width="20" height="20" viewBox="0 0 20 20">
                            <path fill="currentColor" d="M5 7l5 5 5-5z"/>
                        </svg>
                    </button>
                    <div class="faq-answer">
                        We test parity on your eval set and provide fallback options when needed. 
                        Most clients see equal or better performance on their specific tasks.
                    </div>
                </div>
                
                <div class="faq-item animate-on-scroll">
                    <button class="faq-question">
                        What if my usage spikes?
                        <svg class="faq-icon" width="20" height="20" viewBox="0 0 20 20">
                            <path fill="currentColor" d="M5 7l5 5 5-5z"/>
                        </svg>
                    </button>
                    <div class="faq-answer">
                        Unlike pay-per-token models, our fixed pricing means no surprise bills. 
                        We'll work with you to ensure your infrastructure scales smoothly.
                    </div>
                </div>
                
                <div class="faq-item animate-on-scroll">
                    <button class="faq-question">
                        What if I'm not satisfied?
                        <svg class="faq-icon" width="20" height="20" viewBox="0 0 20 20">
                            <path fill="currentColor" d="M5 7l5 5 5-5z"/>
                        </svg>
                    </button>
                    <div class="faq-answer">
                        We offer a 30-day money-back guarantee. If our solution doesn't meet 
                        your needs, we'll refund your first month's payment in full.
                    </div>
                </div>
            </div>
        </div>
    </section>
    
    <!-- ========================================
         CONTACT SECTION
         Clear call to action
         ======================================== -->
    <section class="content-section">
        <div class="container">
            <div class="contact-card animate-on-scroll">
                <h2 class="text-center mb-3">Ready to cut your AI costs?</h2>
                <p class="text-center text-secondary mb-4">
                    Get your personalized savings estimate and implementation plan
                </p>
                
                <form class="contact-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Name</label>
                            <input type="text" class="form-input" required>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Work email</label>
                            <input type="email" class="form-input" required>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Company</label>
                            <input type="text" class="form-input" required>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Your role</label>
                            <select class="form-input" required>
                                <option value="">Select</option>
                                <option value="ops-engineering">Ops/Engineering leader</option>
                                <option value="founder">Founder</option>
                                <option value="engineer">Engineer</option>
                                <option value="procurement">Procurement/Finance</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Biggest pain today</label>
                        <textarea class="form-input" rows="3" 
                                  placeholder="Tell us about your current AI challenges..."></textarea>
                    </div>
                    
                    <button type="submit" class="button button--primary w-full">
                        Get Your Custom Estimate
                    </button>
                    
                    <p class="text-center text-sm text-secondary mt-3">
                        We'll show your results instantly and email a copy. Confidential by default.
                    </p>
                </form>
            </div>
        </div>
    </section>
</body>
</html>"""

# Save the HTML file
with open('utlyze-roi-redesigned.html', 'w') as f:
    f.write(html_content)

print("HTML structure guide created successfully!")
print(f"Total lines: {len(html_content.splitlines())}")
print(f"File size: {len(html_content)} characters")