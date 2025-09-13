// Portfolio functionality for Studio page
document.addEventListener('DOMContentLoaded', function() {
  // Company data - from original companies/data.json
  const companies = [
    {
      id: 100,
      name: "Vuplicity",
      slug: "vuplicity",
      tagline: "Same‑day background checks that transform your hiring.",
      description: "Transform your background check process with AI‑powered efficiency. Get comprehensive results same day. Real‑time, compliant checks at better value.",
      industry: "AI/ML",
      stage: "Growth",
      founded: 2025,
      teamSize: 6,
      location: "Remote",
      teamSummary: "Experienced founders; 6-person team",
      techKpi: "Same-day turnaround",
      fundingRaised: "",
      backers: [],
      targetCustomer: "Hiring teams & HR",
      differentiators: [
        "Compliance-first",
        "Proprietary workflows"
      ],
      achievements: [
        "100+ docs automated/mo",
        "Sub-10s draft generation",
        "Brand-safe reusable prompts"
      ],
      demoUrl: "https://www.perplexity.ai/apps/09f89ad8-e3c8-4ec3-ad7d-aeb0941617d9",
      websiteUrl: "https://vuplicity.com",
      color: "#21808D",
      logo: "V"
    },
    {
      id: 101,
      name: "Guardian",
      slug: "guardian",
      tagline: "AI KYC/AML compliance agent",
      description: "Automates KYC onboarding, sanctions screening, and real‑time AML monitoring to cut false positives and reduce compliance cost.",
      industry: "RegTech",
      stage: "Pre-seed",
      teamSize: "",
      location: "Remote",
      teamSummary: "Compliance + ML experience",
      techKpi: "False positives ↓40% (target)",
      fundingRaised: "",
      backers: [],
      targetCustomer: "Banks, fintechs, exchanges",
      differentiators: [
        "Always‑on diligence",
        "Real‑time sanctions updates"
      ],
      achievements: [],
      demoUrl: "#",
      websiteUrl: "#",
      color: "#1D747E",
      logo: "G"
    },
    {
      id: 102,
      name: "Captura",
      slug: "captura",
      tagline: "AI invoice processing (AP automation)",
      description: "Automates invoice capture, coding, 3‑way matching and approvals to cut cost per invoice and cycle time.",
      industry: "SaaS",
      stage: "Pre-seed",
      teamSize: "",
      location: "Remote",
      teamSummary: "Finance systems + AI",
      techKpi: "Cost/invoice <$2",
      fundingRaised: "",
      backers: [],
      targetCustomer: "Mid‑market finance/AP",
      differentiators: [
        "3‑way matching",
        "Duplicate/fraud detection"
      ],
      achievements: [],
      demoUrl: "#",
      websiteUrl: "#",
      color: "#1A687E",
      logo: "C"
    },
    {
      id: 103,
      name: "Collexa",
      slug: "collexa",
      tagline: "AI accounts receivable collections",
      description: "Predicts late payers, automates dunning via email/SMS, and accelerates cash collection with embedded pay links.",
      industry: "FinTech",
      stage: "Pre-seed",
      teamSize: "",
      location: "Remote",
      teamSummary: "FinOps + growth automation",
      techKpi: "DSO ↓10–20% (target)",
      fundingRaised: "",
      backers: [],
      targetCustomer: "B2B finance/AR",
      differentiators: [
        "Multi‑channel reminders",
        "One‑click payment links"
      ],
      achievements: [],
      demoUrl: "#",
      websiteUrl: "#",
      color: "#21808D",
      logo: "X"
    },
    {
      id: 104,
      name: "Welcomat",
      slug: "welcomat",
      tagline: "AI employee onboarding assistant",
      description: "Automates paperwork, provisioning, training, and day‑1/90‑day journeys to improve retention and time‑to‑productivity.",
      industry: "HR Tech",
      stage: "Pre-seed",
      teamSize: "",
      location: "Remote",
      teamSummary: "People Ops + platform integration",
      techKpi: "HR time saved 14h/wk (target)",
      fundingRaised: "",
      backers: [],
      targetCustomer: "People Ops & HR",
      differentiators: [
        "Orchestrates HR/IT/LMS",
        "Always‑on new‑hire Q&A"
      ],
      achievements: [],
      demoUrl: "#",
      websiteUrl: "#",
      color: "#1D747E",
      logo: "W"
    }
  ];

  // State variables
  let filteredCompanies = [...companies];
  let displayedCount = 6;
  const COMPANIES_PER_LOAD = 6;

  // Get DOM elements
  const companyGrid = document.getElementById('companyGrid');
  const searchInput = document.getElementById('searchInput');
  const industryFilter = document.getElementById('industryFilter');
  const stageFilter = document.getElementById('stageFilter');
  const modal = document.getElementById('companyModal');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalClose = document.getElementById('modalClose');
  const modalBody = document.getElementById('modalBody');

  // Check if elements exist before continuing
  if (!companyGrid) {
    console.error('Company grid element not found');
    return;
  }

  // Filter companies
  function filterCompanies() {
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    const selectedIndustry = industryFilter ? industryFilter.value : '';
    const selectedStage = stageFilter ? stageFilter.value : '';

    filteredCompanies = companies.filter(company => {
      const matchesSearch = !searchTerm || 
        company.name.toLowerCase().includes(searchTerm) ||
        company.tagline.toLowerCase().includes(searchTerm) ||
        company.description.toLowerCase().includes(searchTerm);

      const matchesIndustry = !selectedIndustry || company.industry === selectedIndustry;
      const matchesStage = !selectedStage || company.stage === selectedStage;

      return matchesSearch && matchesIndustry && matchesStage;
    });

    displayedCount = COMPANIES_PER_LOAD;
    renderCompanies();
  }

  // Create company card HTML
  function createCompanyCard(company) {
    const hasWebsite = company.websiteUrl && company.websiteUrl !== '#';
    const hasDemo = company.demoUrl && company.demoUrl !== '#';
    
    // Extract meaningful metrics
    const metric1Label = company.techKpi ? 'Key Metric' : 'Team Size';
    const metric1Value = company.techKpi || (company.teamSize || 'N/A');
    
    const metric2Label = company.targetCustomer ? 'Target' : 'Funding';
    const metric2Value = company.targetCustomer || company.fundingRaised || 'Pre-seed';

    const initial = (company.name || '').charAt(0).toUpperCase();
    return `
      <div class="company-card" data-company-id="${company.id}">
        <div class="company-card__stage" aria-label="Stage: ${company.stage}">${company.stage}</div>
        <div class="company-card__header">
          <div class="company-card__logo" style="background-color: ${company.color};" role="img" aria-label="Logo placeholder for ${company.name}">
            ${initial}
          </div>
          <h3 class="company-card__name">${company.name}</h3>
          <span class="company-card__industry">${company.industry}</span>
        </div>
        <div class="company-card__body">
          <p class="company-card__description">${company.tagline}</p>
          <div class="company-card__metrics">
            <div class="metric-item">
              <div class="metric-value">${metric1Value}</div>
              <div class="metric-label">${metric1Label}</div>
            </div>
            <div class="metric-item">
              <div class="metric-value">${metric2Value}</div>
              <div class="metric-label">${metric2Label}</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Create modal content
  function createModalContent(company) {
    const hasWebsite = company.websiteUrl && company.websiteUrl !== '#';
    const hasDemo = company.demoUrl && company.demoUrl !== '#';
    
    // Build achievements or differentiators list
    let highlightsList = '';
    if (company.achievements && company.achievements.length > 0) {
      highlightsList = company.achievements.map(item => `<li>${item}</li>`).join('');
    } else if (company.differentiators && company.differentiators.length > 0) {
      highlightsList = company.differentiators.map(item => `<li>${item}</li>`).join('');
    }

    // Build metrics
    const metricsHTML = [];
    if (company.techKpi) {
      metricsHTML.push(`
        <div class="modal-metric-card">
          <div class="modal-metric-value">${company.techKpi}</div>
          <div class="modal-metric-label">Key Metric</div>
        </div>
      `);
    }
    if (company.teamSize) {
      metricsHTML.push(`
        <div class="modal-metric-card">
          <div class="modal-metric-value">${company.teamSize}</div>
          <div class="modal-metric-label">Team Size</div>
        </div>
      `);
    }
    if (company.targetCustomer) {
      metricsHTML.push(`
        <div class="modal-metric-card">
          <div class="modal-metric-value">${company.targetCustomer}</div>
          <div class="modal-metric-label">Target Customer</div>
        </div>
      `);
    }

    return `
      <div class="modal-company-header">
        <div class="modal-company-info">
          <div class="modal-company-logo" style="color: ${company.color};">
            ${company.logo}
          </div>
          <div class="modal-company-details">
            <h2>${company.name}</h2>
            <div class="modal-company-meta">
              <span class="modal-industry-tag">${company.industry}</span>
              <span class="modal-stage-tag">${company.stage}</span>
              ${hasWebsite ? `<a href="${company.websiteUrl}" target="_blank" class="modal-website">Visit Website →</a>` : ''}
            </div>
            ${hasDemo ? `<div class="modal-demo-link"><a href="${company.demoUrl}" target="_blank" class="demo-button">Try Demo →</a></div>` : ''}
          </div>
        </div>
      </div>
      
      <div class="modal-content-section">
        <h3>About</h3>
        <p class="modal-description">${company.description}</p>
        
        ${metricsHTML.length > 0 ? `
          <h3>Key Metrics</h3>
          <div class="modal-metrics-grid">
            ${metricsHTML.join('')}
          </div>
        ` : ''}
        
        ${highlightsList ? `
          <h3>Key Highlights</h3>
          <ul class="modal-highlights">
            ${highlightsList}
          </ul>
        ` : ''}
      </div>
    `;
  }

  // Render companies
  function renderCompanies(append = false) {
    const companiesToRender = filteredCompanies.slice(0, displayedCount);
    
    if (companiesToRender.length === 0) {
      companyGrid.innerHTML = `
        <div class="no-results">
          <h3>No companies found</h3>
          <p>Try adjusting your filters or search terms</p>
        </div>
      `;
      return;
    }

    const companiesToDisplay = append 
      ? companiesToRender.slice(displayedCount - COMPANIES_PER_LOAD, displayedCount)
      : companiesToRender;

    const html = companiesToDisplay.map(createCompanyCard).join('');
    
    if (append) {
      companyGrid.insertAdjacentHTML('beforeend', html);
    } else {
      companyGrid.innerHTML = html;
    }

    // Add click handlers
    document.querySelectorAll('.company-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const companyId = parseInt(card.dataset.companyId);
        const company = companies.find(c => c.id === companyId);
        if (company) {
          showModal(company);
        }
      });
    });
    
    // Handle Load More button
    updateLoadMoreButton(companiesToRender);
  }

  // Update Load More button
  function updateLoadMoreButton(companiesToRender) {
    const existingLoadMore = document.querySelector('.load-more');
    
    if (existingLoadMore) {
      existingLoadMore.remove();
    }
    
    if (displayedCount < filteredCompanies.length) {
      const loadMoreHTML = `
        <div class="load-more">
          <button class="load-more-btn" onclick="loadMoreCompanies()">
            Load More Companies
          </button>
        </div>
      `;
      companyGrid.insertAdjacentHTML('afterend', loadMoreHTML);
    }
  }

  // Load more companies
  window.loadMoreCompanies = function() {
    displayedCount += COMPANIES_PER_LOAD;
    renderCompanies(true);
  };

  // Show modal
  function showModal(company) {
    if (modal && modalBody) {
      modalBody.innerHTML = createModalContent(company);
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }
  }

  // Close modal
  function closeModal() {
    if (modal) {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
    }
  }

  // Event listeners
  if (searchInput) {
    searchInput.addEventListener('input', filterCompanies);
  }
  
  if (industryFilter) {
    industryFilter.addEventListener('change', filterCompanies);
  }
  
  if (stageFilter) {
    stageFilter.addEventListener('change', filterCompanies);
  }

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }
  
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', closeModal);
  }

  // Escape key to close modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  });

  // Initial render
  renderCompanies();
  
  // Initialize portfolio functionality
  console.log('Portfolio functionality initialized with', companies.length, 'companies');
});
