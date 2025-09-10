// Portfolio companies data
const companies = [
  {
    id: 1,
    name: "DataSync Pro",
    logo: "DS",
    color: "#21808D",
    tagline: "Revolutionary data integration platform",
    description: "DataSync Pro revolutionizes data integration for Fortune 500 companies with intelligent automation and real-time synchronization. Built in 6 months, now valued at $280M.",
    industry: "SaaS",
    stage: "Series B",
    founded: 2021,
    teamSize: 45,
    location: "San Francisco, CA",
    achievements: ["$45M Series B", "$280M valuation", "Fortune 500 clients"],
    fundingRaised: "$45M",
    demoUrl: "https://demo.datasync.pro",
    websiteUrl: "https://datasync.pro"
  },
  {
    id: 2,
    name: "CloudOptimize",
    logo: "CO",
    color: "#1D747E",
    tagline: "AI-powered cloud cost optimization",
    description: "CloudOptimize uses AI to optimize cloud costs for enterprises. From idea to acquisition by AWS in just 18 months, delivering 40% cost savings to enterprise customers.",
    industry: "AI/ML",
    stage: "Acquired",
    founded: 2022,
    teamSize: 38,
    location: "Seattle, WA",
    achievements: ["Acquired by AWS", "40% cost reduction", "18-month exit"],
    fundingRaised: "Acquired",
    demoUrl: "https://aws.amazon.com/cloudoptimize",
    websiteUrl: "https://cloudoptimize.aws"
  },
  {
    id: 3,
    name: "SecureFlow",
    logo: "SF",
    color: "#1A687E",
    tagline: "Next-gen security orchestration platform",
    description: "SecureFlow provides next-generation security orchestration for modern enterprises. Achieved product-market fit in 4 months using Utlyze platform insights.",
    industry: "Security",
    stage: "Series A",
    founded: 2023,
    teamSize: 28,
    location: "Austin, TX",
    achievements: ["10,000+ users", "4-month PMF", "$15M Series A"],
    fundingRaised: "$15M",
    demoUrl: "https://demo.secureflow.io",
    websiteUrl: "https://secureflow.io"
  },
  {
    id: 4,
    name: "FinFlow AI",
    logo: "FF",
    color: "#21808D",
    tagline: "AI-powered financial analytics for SMBs",
    description: "FinFlow AI revolutionizes financial management for small and medium businesses with intelligent automation and predictive analytics. Our platform helps businesses optimize cash flow and make data-driven decisions.",
    industry: "FinTech",
    stage: "Series A",
    founded: 2022,
    teamSize: 25,
    location: "New York, NY",
    achievements: ["$5M ARR", "10,000+ users", "SOC 2 certified"],
    fundingRaised: "$12M",
    demoUrl: "https://demo.finflow.ai",
    websiteUrl: "https://finflow.ai"
  },
  {
    id: 5,
    name: "HealthBridge",
    logo: "HB",
    color: "#1D747E",
    tagline: "Connecting patients with specialized care",
    description: "HealthBridge seamlessly connects patients with specialized healthcare providers through AI-driven matching and virtual consultations, reducing wait times and improving outcomes.",
    industry: "HealthTech",
    stage: "Seed",
    founded: 2023,
    teamSize: 15,
    location: "Boston, MA",
    achievements: ["50,000 consultations", "4.8/5 rating", "HIPAA compliant"],
    fundingRaised: "$4M",
    demoUrl: "https://app.healthbridge.com/demo",
    websiteUrl: "https://healthbridge.com"
  },
  {
    id: 6,
    name: "EduSpark",
    logo: "ES",
    color: "#1A687E",
    tagline: "Personalized learning paths powered by AI",
    description: "EduSpark creates adaptive learning experiences for K-12 students using advanced AI algorithms that adjust content difficulty in real-time to maximize engagement and outcomes.",
    industry: "EdTech",
    stage: "Pre-seed",
    founded: 2024,
    teamSize: 8,
    location: "Chicago, IL",
    achievements: ["100+ pilot schools", "95% improvement rate", "EdTech Award nominee"],
    fundingRaised: "$1.5M",
    demoUrl: "https://demo.eduspark.io",
    websiteUrl: "https://eduspark.io"
  },
  {
    id: 7,
    name: "RetailMind",
    logo: "RM",
    color: "#21808D",
    tagline: "Smart inventory management for retailers",
    description: "RetailMind uses machine learning to optimize inventory levels and predict demand patterns, reducing stockouts by 40% and improving profit margins through intelligent purchasing.",
    industry: "E-commerce",
    stage: "Seed",
    founded: 2022,
    teamSize: 18,
    location: "Los Angeles, CA",
    achievements: ["500+ partners", "$50M GMV", "30% cost reduction"],
    fundingRaised: "$6M",
    demoUrl: "https://retailmind.com/demo",
    websiteUrl: "https://retailmind.com"
  },
  {
    id: 8,
    name: "NeuralVision",
    logo: "NV",
    color: "#1D747E",
    tagline: "Computer vision for quality control",
    description: "NeuralVision provides AI-powered visual inspection systems for manufacturing, detecting defects 10x faster than human inspection with 99.9% accuracy.",
    industry: "AI/ML",
    stage: "Series A",
    founded: 2021,
    teamSize: 32,
    location: "Detroit, MI",
    achievements: ["50+ clients", "1M+ daily inspections", "ISO certified"],
    fundingRaised: "$18M",
    demoUrl: "https://neuralvision.ai/demo",
    websiteUrl: "https://neuralvision.ai"
  },
  {
    id: 9,
    name: "PayLink",
    logo: "PL",
    color: "#1A687E",
    tagline: "Instant cross-border payments",
    description: "PayLink enables instant, low-cost international money transfers using blockchain technology, serving the $700B remittance market with fees 80% lower than traditional providers.",
    industry: "FinTech",
    stage: "Seed",
    founded: 2023,
    teamSize: 12,
    location: "Miami, FL",
    achievements: ["$100M processed", "50+ countries", "5 market approvals"],
    fundingRaised: "$8M",
    demoUrl: "https://paylink.global/demo",
    websiteUrl: "https://paylink.global"
  },
  {
    id: 10,
    name: "LearnLoop",
    logo: "LL",
    color: "#21808D",
    tagline: "Corporate training reimagined",
    description: "LearnLoop transforms corporate training with microlearning and gamification, increasing completion rates by 3x while reducing training time by 50% through AI-powered optimization.",
    industry: "EdTech",
    stage: "Seed",
    founded: 2022,
    teamSize: 20,
    location: "Denver, CO",
    achievements: ["200+ enterprises", "2M+ learners", "95% completion"],
    fundingRaised: "$10M",
    demoUrl: "https://learnloop.com/demo",
    websiteUrl: "https://learnloop.com"
  },
  {
    id: 11,
    name: "DataPulse",
    logo: "DP",
    color: "#1D747E",
    tagline: "Real-time analytics for SaaS metrics",
    description: "DataPulse provides real-time analytics dashboards specifically designed for SaaS companies, tracking MRR, churn, LTV, and other key metrics with predictive insights.",
    industry: "SaaS",
    stage: "Seed",
    founded: 2023,
    teamSize: 14,
    location: "Portland, OR",
    achievements: ["300+ clients", "$3M ARR", "Product Hunt #1"],
    fundingRaised: "$7M",
    demoUrl: "https://datapulse.io/demo",
    websiteUrl: "https://datapulse.io"
  },
  {
    id: 12,
    name: "VoiceAI Pro",
    logo: "VA",
    color: "#1A687E",
    tagline: "Natural language processing for customer service",
    description: "VoiceAI Pro revolutionizes customer service with advanced voice AI that handles 80% of inquiries autonomously, reducing support costs by 60% while improving satisfaction.",
    industry: "AI/ML",
    stage: "Growth",
    founded: 2020,
    teamSize: 55,
    location: "Atlanta, GA",
    achievements: ["10M+ calls", "Fortune 500 clients", "$20M Series B"],
    fundingRaised: "$35M",
    demoUrl: "https://voiceai.pro/demo",
    websiteUrl: "https://voiceai.pro"
  }
];

// State management
let filteredCompanies = [...companies];
let currentSearch = '';
let currentIndustryFilter = '';
let currentStageFilter = '';
let displayedCount = 6; // Show 6 companies initially
const COMPANIES_PER_LOAD = 6; // Load 6 more companies each time

// Create company card HTML
function createCompanyCard(company) {
  return `
    <div class="company-card" data-company-id="${company.id}">
      <div class="company-card-header">
        <div class="company-logo" style="background-color: ${company.color}">${company.logo}</div>
        <div class="company-info">
          <h3>${company.name}</h3>
          <p class="company-tagline">${company.tagline}</p>
        </div>
      </div>
      
      <div class="company-meta">
        <span class="meta-badge">${company.stage}</span>
        <span class="meta-badge">${company.industry}</span>
        ${company.fundingRaised && company.fundingRaised !== 'Acquired' ? 
          `<span class="meta-badge">Raised ${company.fundingRaised}</span>` : ''}
      </div>
      
      <div class="company-achievements">
        ${company.achievements.slice(0, 3).map(achievement => 
          `<span class="achievement-tag">${achievement}</span>`
        ).join('')}
      </div>
      
      <div class="company-card-footer">
        <button class="btn-view-details" data-company-id="${company.id}">View Details</button>
        <a href="${company.demoUrl}" target="_blank" class="btn-demo">View Demo</a>
      </div>
    </div>
  `;
}

// Create modal content HTML
function createModalContent(company) {
  return `
    <div class="modal-company-header">
      <div class="modal-company-logo" style="background-color: ${company.color}">
        ${company.logo}
      </div>
      <div class="modal-company-info">
        <h2>${company.name}</h2>
        <p class="modal-company-tagline">${company.tagline}</p>
      </div>
    </div>
    
    <div class="modal-details">
      <div class="modal-detail">
        <div class="modal-detail-label">Founded</div>
        <div class="modal-detail-value">${company.founded}</div>
      </div>
      <div class="modal-detail">
        <div class="modal-detail-label">Team Size</div>
        <div class="modal-detail-value">${company.teamSize}</div>
      </div>
      <div class="modal-detail">
        <div class="modal-detail-label">Location</div>
        <div class="modal-detail-value">${company.location}</div>
      </div>
      <div class="modal-detail">
        <div class="modal-detail-label">Stage</div>
        <div class="modal-detail-value">${company.stage}</div>
      </div>
    </div>
    
    <p class="modal-description">${company.description}</p>
    
    <div class="modal-achievements">
      <h4>Key Achievements</h4>
      <div class="achievements-list">
        ${company.achievements.map(achievement => 
          `<span class="achievement">${achievement}</span>`
        ).join('')}
      </div>
    </div>
    
    <div class="modal-actions">
      <a href="${company.demoUrl}" target="_blank" class="btn btn-primary">
        View Demo
      </a>
      <a href="${company.websiteUrl}" target="_blank" class="btn btn-secondary">
        Visit Website
      </a>
    </div>
  `;
}

// Render companies
function renderCompanies(companiesToRender = filteredCompanies, append = false) {
  const companyGrid = document.getElementById('companyGrid');
  
  if (!companyGrid) return;
  
  if (!append && companiesToRender.length === 0) {
    companyGrid.innerHTML = `
      <div class="empty-state">
        <h3>No companies found</h3>
        <p>Try adjusting your search or filter criteria.</p>
      </div>
    `;
    // Remove load more button if it exists
    const existingLoadMore = document.querySelector('.load-more-container');
    if (existingLoadMore) existingLoadMore.remove();
    return;
  }

  // Get companies to display based on displayedCount
  const companiesToDisplay = append 
    ? companiesToRender.slice(displayedCount - COMPANIES_PER_LOAD, displayedCount)
    : companiesToRender.slice(0, displayedCount);

  const html = companiesToDisplay.map(createCompanyCard).join('');
  
  if (append) {
    // Add new companies to existing grid
    companyGrid.insertAdjacentHTML('beforeend', html);
  } else {
    companyGrid.innerHTML = html;
  }

  // Add click handlers to view details buttons
  document.querySelectorAll('.btn-view-details').forEach(button => {
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      const companyId = parseInt(button.dataset.companyId);
      const company = companies.find(c => c.id === companyId);
      if (company) {
        showModal(company);
      }
    });
  });
  
  // Handle Load More button
  updateLoadMoreButton(companiesToRender);
}

// Function to manage the Load More button
function updateLoadMoreButton(companiesToRender) {
  const existingLoadMore = document.querySelector('.load-more-container');
  
  // Remove existing button if it exists
  if (existingLoadMore) {
    existingLoadMore.remove();
  }
  
  // Add Load More button if there are more companies to show
  if (displayedCount < companiesToRender.length) {
    const companyGrid = document.getElementById('companyGrid');
    const loadMoreHtml = `
      <div class="load-more-container">
        <button class="btn btn-primary load-more-btn" id="loadMoreBtn">
          Load More Companies (${companiesToRender.length - displayedCount} remaining)
        </button>
      </div>
    `;
    companyGrid.insertAdjacentHTML('afterend', loadMoreHtml);
    
    // Add click handler
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', () => {
        displayedCount += COMPANIES_PER_LOAD;
        renderCompanies(companiesToRender, true);
      });
    }
  }
}

// Filter companies
function filterCompanies() {
  filteredCompanies = companies.filter(company => {
    const matchesSearch = currentSearch === '' || 
      company.name.toLowerCase().includes(currentSearch.toLowerCase()) ||
      company.tagline.toLowerCase().includes(currentSearch.toLowerCase()) ||
      company.description.toLowerCase().includes(currentSearch.toLowerCase());
    
    const matchesIndustry = currentIndustryFilter === '' || 
      company.industry === currentIndustryFilter;
    
    const matchesStage = currentStageFilter === '' || 
      company.stage === currentStageFilter;
    
    return matchesSearch && matchesIndustry && matchesStage;
  });
  
  // Reset displayed count when filtering
  displayedCount = Math.min(COMPANIES_PER_LOAD, filteredCompanies.length);
  
  renderCompanies(filteredCompanies);
}

// Show modal
function showModal(company) {
  const modal = document.getElementById('companyModal');
  const modalBody = document.getElementById('modalBody');
  
  if (modal && modalBody) {
    modalBody.innerHTML = createModalContent(company);
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
}

// Hide modal
function hideModal() {
  const modal = document.getElementById('companyModal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
  }
}

// Initialize portfolio functionality
function initializePortfolio() {
  // Set initial displayed count based on available companies
  displayedCount = Math.min(COMPANIES_PER_LOAD, companies.length);
  
  // Initial render
  renderCompanies();

  // Search input event listener
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearch = e.target.value.trim();
      filterCompanies();
    });

    // Allow clearing the search input
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        searchInput.value = '';
        currentSearch = '';
        filterCompanies();
      }
    });
  }

  // Industry filter event listener
  const industryFilter = document.getElementById('industryFilter');
  if (industryFilter) {
    industryFilter.addEventListener('change', (e) => {
      currentIndustryFilter = e.target.value;
      filterCompanies();
    });
  }

  // Stage filter event listener
  const stageFilter = document.getElementById('stageFilter');
  if (stageFilter) {
    stageFilter.addEventListener('change', (e) => {
      currentStageFilter = e.target.value;
      filterCompanies();
    });
  }

  // Modal close handlers
  const modalClose = document.getElementById('modalClose');
  const modalBackdrop = document.getElementById('modalBackdrop');
  
  if (modalClose) {
    modalClose.addEventListener('click', hideModal);
  }
  
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', hideModal);
  }

  // Escape key to close modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const modal = document.getElementById('companyModal');
      if (modal && !modal.classList.contains('hidden')) {
        hideModal();
      }
    }
  });

  // Prevent modal close when clicking inside modal content
  const modal = document.getElementById('companyModal');
  const modalContent = modal?.querySelector('.modal-content');
  if (modalContent) {
    modalContent.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }
}

// Wait for DOM to be fully loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializePortfolio);
} else {
  initializePortfolio();
}