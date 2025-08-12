// Company data (will be overridden by data.json if present)
let companies = [
  {
    "id": 100,
    "name": "Vuplicity",
    "slug": "vuplicity",
    "logo": "V",
    "color": "#2563EB",
    "tagline": "Unified AI for content velocity and brand clarity",
    "description": "Vuplicity helps teams generate, refine, and orchestrate content with AI while maintaining brand consistency and measurable output across channels.",
    "industry": "AI/ML",
    "stage": "Growth",
    "founded": 2025,
    "teamSize": 6,
    "location": "Remote",
    "achievements": [
      "100+ docs automated/mo",
      "Sub-10s draft generation",
      "Brand-safe reusable prompts"
    ],
    "demoUrl": "https://www.perplexity.ai/apps/09f89ad8-e3c8-4ec3-ad7d-aeb0941617d9",
    "websiteUrl": "https://vuplicity.com"
  },
  {
    "id": 1,
    "name": "FinFlow AI",
    "logo": "FF",
    "color": "#3B82F6",
    "tagline": "AI-powered financial analytics for SMBs",
    "description": "FinFlow AI revolutionizes financial management for small and medium businesses with intelligent automation and predictive analytics. Our platform helps businesses optimize cash flow, automate bookkeeping, and make data-driven financial decisions.",
    "industry": "FinTech",
    "stage": "Series A",
    "founded": 2022,
    "teamSize": 25,
    "location": "San Francisco, CA",
    "achievements": ["$5M ARR", "10,000+ active users", "SOC 2 certified"],
    "demoUrl": "https://demo.finflow.ai",
    "websiteUrl": "https://finflow.ai"
  },
  {
    "id": 2,
    "name": "HealthBridge",
    "logo": "HB",
    "color": "#10B981",
    "tagline": "Connecting patients with specialized care",
    "description": "HealthBridge is a telemedicine platform that seamlessly connects patients with specialized healthcare providers. We reduce wait times and improve health outcomes through AI-driven matching and virtual consultations.",
    "industry": "HealthTech",
    "stage": "Seed",
    "founded": 2023,
    "teamSize": 15,
    "location": "Boston, MA",
    "achievements": ["50,000 consultations", "4.8/5 patient rating", "HIPAA compliant"],
    "demoUrl": "https://app.healthbridge.com/demo",
    "websiteUrl": "https://healthbridge.com"
  },
  {
    "id": 3,
    "name": "EduSpark",
    "logo": "ES",
    "color": "#8B5CF6",
    "tagline": "Personalized learning paths powered by AI",
    "description": "EduSpark creates adaptive learning experiences for K-12 students using advanced AI algorithms. Our platform analyzes learning patterns and adjusts content difficulty in real-time to maximize student engagement and outcomes.",
    "industry": "EdTech",
    "stage": "Pre-seed",
    "founded": 2024,
    "teamSize": 8,
    "location": "Austin, TX",
    "achievements": ["100+ pilot schools", "95% student improvement rate", "EdTech Award nominee"],
    "demoUrl": "https://demo.eduspark.io",
    "websiteUrl": "https://eduspark.io"
  },
  {
    "id": 4,
    "name": "RetailMind",
    "logo": "RM",
    "color": "#EF4444",
    "tagline": "Smart inventory management for retailers",
    "description": "RetailMind uses machine learning to optimize inventory levels and predict demand patterns for retail businesses. Our solution reduces stockouts by 40% and improves profit margins through intelligent purchasing recommendations.",
    "industry": "E-commerce",
    "stage": "Seed",
    "founded": 2022,
    "teamSize": 18,
    "location": "New York, NY",
    "achievements": ["500+ retail partners", "$50M GMV processed", "30% inventory cost reduction"],
    "demoUrl": "https://retailmind.com/demo",
    "websiteUrl": "https://retailmind.com"
  },
  {
    "id": 5,
    "name": "CloudSync Pro",
    "logo": "CS",
    "color": "#F59E0B",
    "tagline": "Enterprise cloud migration made simple",
    "description": "CloudSync Pro automates complex cloud migrations for enterprise clients. Our platform ensures zero downtime migrations with automated testing and rollback capabilities, saving companies millions in migration costs.",
    "industry": "SaaS",
    "stage": "Growth",
    "founded": 2021,
    "teamSize": 42,
    "location": "Seattle, WA",
    "achievements": ["100+ enterprise clients", "$15M ARR", "AWS Advanced Partner"],
    "demoUrl": "https://cloudsync.pro/interactive-demo",
    "websiteUrl": "https://cloudsync.pro"
  },
  {
    "id": 6,
    "name": "NeuralVision",
    "logo": "NV",
    "color": "#6366F1",
    "tagline": "Computer vision for quality control",
    "description": "NeuralVision provides AI-powered visual inspection systems for manufacturing. Our technology detects defects 10x faster than human inspection with 99.9% accuracy, reducing quality control costs by 60%.",
    "industry": "AI/ML",
    "stage": "Series A",
    "founded": 2021,
    "teamSize": 32,
    "location": "Detroit, MI",
    "achievements": ["50+ manufacturing clients", "1M+ inspections daily", "ISO certified"],
    "demoUrl": "https://neuralvision.ai/demo",
    "websiteUrl": "https://neuralvision.ai"
  },
  {
    "id": 7,
    "name": "PayLink",
    "logo": "PL",
    "color": "#14B8A6",
    "tagline": "Instant cross-border payments",
    "description": "PayLink enables instant, low-cost international money transfers using blockchain technology. We serve the $700B remittance market with fees 80% lower than traditional providers.",
    "industry": "FinTech",
    "stage": "Seed",
    "founded": 2023,
    "teamSize": 12,
    "location": "Miami, FL",
    "achievements": ["$100M processed", "50+ countries supported", "Regulatory approval in 5 markets"],
    "demoUrl": "https://paylink.global/demo",
    "websiteUrl": "https://paylink.global"
  },
  {
    "id": 8,
    "name": "MediTrack",
    "logo": "MT",
    "color": "#EC4899",
    "tagline": "Medication adherence through smart reminders",
    "description": "MediTrack improves medication adherence through smart pill dispensers and mobile apps. Our IoT-enabled solution reduces hospital readmissions by 35% and improves patient outcomes significantly.",
    "industry": "HealthTech",
    "stage": "Pre-seed",
    "founded": 2024,
    "teamSize": 6,
    "location": "San Diego, CA",
    "achievements": ["500+ beta users", "3 hospital partnerships", "FDA submission in progress"],
    "demoUrl": "https://meditrack.health/demo",
    "websiteUrl": "https://meditrack.health"
  },
  {
    "id": 9,
    "name": "LearnLoop",
    "logo": "LL",
    "color": "#84CC16",
    "tagline": "Corporate training reimagined",
    "description": "LearnLoop transforms corporate training with microlearning and gamification. Our platform increases training completion rates by 3x while reducing training time by 50% through AI-powered content optimization.",
    "industry": "EdTech",
    "stage": "Seed",
    "founded": 2022,
    "teamSize": 20,
    "location": "Chicago, IL",
    "achievements": ["200+ enterprise clients", "2M+ learners", "95% completion rate"],
    "demoUrl": "https://learnloop.com/demo",
    "websiteUrl": "https://learnloop.com"
  },
  {
    "id": 10,
    "name": "ShopGenius",
    "logo": "SG",
    "color": "#DC2626",
    "tagline": "AI personal shopping assistant",
    "description": "ShopGenius uses conversational AI to provide personalized shopping recommendations. Our chatbot increases conversion rates by 40% and average order values by 25% for e-commerce retailers.",
    "industry": "E-commerce",
    "stage": "Series A",
    "founded": 2021,
    "teamSize": 28,
    "location": "Los Angeles, CA",
    "achievements": ["1M+ conversations monthly", "$200M GMV influenced", "500+ brand partners"],
    "demoUrl": "https://shopgenius.ai/try-demo",
    "websiteUrl": "https://shopgenius.ai"
  },
  {
    "id": 11,
    "name": "DataPulse",
    "logo": "DP",
    "color": "#7C3AED",
    "tagline": "Real-time analytics for SaaS metrics",
    "description": "DataPulse provides real-time analytics dashboards specifically designed for SaaS companies. Track MRR, churn, LTV, and other key metrics with predictive insights powered by machine learning.",
    "industry": "SaaS",
    "stage": "Seed",
    "founded": 2023,
    "teamSize": 14,
    "location": "Denver, CO",
    "achievements": ["300+ SaaS clients", "$3M ARR", "Product Hunt #1"],
    "demoUrl": "https://datapulse.io/demo",
    "websiteUrl": "https://datapulse.io"
  },
  {
    "id": 12,
    "name": "VoiceAI Pro",
    "logo": "VA",
    "color": "#0891B2",
    "tagline": "Natural language processing for customer service",
    "description": "VoiceAI Pro revolutionizes customer service with advanced voice AI that handles 80% of customer inquiries autonomously. Our solution reduces support costs by 60% while improving customer satisfaction scores.",
    "industry": "AI/ML",
    "stage": "Growth",
    "founded": 2020,
    "teamSize": 55,
    "location": "Atlanta, GA",
    "achievements": ["10M+ calls handled", "Fortune 500 clients", "$20M Series B raised"],
    "demoUrl": "https://voiceai.pro/demo",
    "websiteUrl": "https://voiceai.pro"
  }
];

// State management
let filteredCompanies = [...companies];
let currentSearch = '';
let currentIndustryFilter = '';
let currentStageFilter = '';

// DOM elements
const companyGrid = document.getElementById('companyGrid');
const searchInput = document.getElementById('searchInput');
const industryFilter = document.getElementById('industryFilter');
const stageFilter = document.getElementById('stageFilter');
const modal = document.getElementById('companyModal');
const modalClose = document.getElementById('modalClose');
const modalBackdrop = document.getElementById('modalBackdrop');
const modalBody = document.getElementById('modalBody');

// Helpers for formatting
function formatCurrencyShort(value) {
  if (value === undefined || value === null || value === '') return '';
  if (typeof value === 'string') return value; // already formatted
  const abs = Math.abs(value);
  if (abs >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(1)}B`;
  if (abs >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `$${(value / 1_000).toFixed(1)}k`;
  return `$${value}`;
}

function metricItem(label, value) {
  if (!value && value !== 0) return '';
  return `
    <div class="metric-item">
      <div class="metric-icon" aria-hidden="true">${
        label === 'ARR/MRR' ? '💰' :
        label === 'Growth' ? '📈' :
        label === 'NRR / Churn' ? '🔁' :
        label === 'Efficiency' ? '⚖️' :
        label === 'Runway' ? '⏳' :
        label === 'AI KPI' ? '🎯' :
        label === 'Team' ? '👥' : '•'
      }</div>
      <div class="metric-label">${label}</div>
      <div class="metric-value">${value}</div>
    </div>
  `;
}

// Create company card HTML (VC-focused, mobile-optimized)
function createCompanyCard(company) {
  const funding = company.fundingRaised || '';
  const backers = Array.isArray(company.backers) && company.backers.length > 0 ? ` • ${company.backers[0]}${company.backers.length > 1 ? ' +' : ''}` : '';

  const arrDisplay = company.arr ? formatCurrencyShort(company.arr) : (company.mrr ? `${formatCurrencyShort(company.mrr)} MRR` : '');
  const growthDisplay = company.growthRate ? company.growthRate : '';
  const nrrDisplay = company.nrr ? company.nrr : (company.churn ? `${company.churn} churn` : '');
  const efficiencyDisplay = company.cacPaybackMonths ? `${company.cacPaybackMonths} mo payback` : (company.ltvToCac ? `LTV:CAC ${company.ltvToCac}` : '');
  const runwayDisplay = company.runwayMonths ? `${company.runwayMonths} mo runway` : (company.burnRate ? `${formatCurrencyShort(company.burnRate)}/mo burn` : '');
  const techDisplay = company.techKpi || (company.accuracy ? `${company.accuracy} accuracy` : (company.apiLatencyMs ? `${company.apiLatencyMs}ms latency` : ''));
  const teamDisplay = company.teamSummary || (company.teamSize ? `${company.teamSize} team` : '');

  const metricsHtml = [
    metricItem('ARR/MRR', arrDisplay),
    metricItem('Growth', growthDisplay),
    metricItem('NRR / Churn', nrrDisplay),
    metricItem('Efficiency', efficiencyDisplay),
    metricItem('Runway', runwayDisplay),
    metricItem('AI KPI', techDisplay),
    metricItem('Team', teamDisplay)
  ]
    .filter(Boolean)
    .slice(0, 4) // keep card concise
    .join('');

  const differentiator = Array.isArray(company.differentiators) && company.differentiators.length > 0
    ? `<span class="differentiator-badge">${company.differentiators[0]}</span>`
    : '';

  return `
    <div class="company-card" data-company-id="${company.id}">
      <div class="company-card__header">
        <div class="company-logo" style="background-color: ${company.color}">${company.logo}</div>
        <div class="company-info">
          <h3>${company.name}</h3>
          <p class="company-tagline">${company.tagline}</p>
        </div>
        ${differentiator}
      </div>

      <div class="company-meta">
        <span class="meta-badge">${company.stage || ''}</span>
        ${funding ? `<span class="meta-badge">Raised ${funding}${backers}</span>` : ''}
        ${company.industry ? `<span class="meta-badge">${company.industry}</span>` : ''}
      </div>

      <div class="company-metrics">
        ${metricsHtml}
      </div>

      <div class="company-card__footer">
        <a href="${company.demoUrl}" target="_blank" class="btn--demo">View Demo</a>
        <a class="view-details" href="/companies/${(company.slug || company.name.toLowerCase().replace(/[^a-z0-9]+/g,'-'))}/">View One-Pager →</a>
      </div>
    </div>
  `;
}

// Create modal content HTML
function createModalContent(company) {
  const achievementTags = company.achievements
    .map(achievement => `<span class="achievement">${achievement}</span>`)
    .join('');

  return `
    <div class="modal-company__header">
      <div class="modal-company__logo" style="background-color: ${company.color}">
        ${company.logo}
      </div>
      <div class="modal-company__info">
        <h2>${company.name}</h2>
        <p class="modal-company__tagline">${company.tagline}</p>
      </div>
    </div>
    
    <div class="modal-details">
      <div class="modal-detail">
        <div class="modal-detail__label">Founded</div>
        <div class="modal-detail__value">${company.founded}</div>
      </div>
      <div class="modal-detail">
        <div class="modal-detail__label">Team Size</div>
        <div class="modal-detail__value">${company.teamSize}</div>
      </div>
      <div class="modal-detail">
        <div class="modal-detail__label">Location</div>
        <div class="modal-detail__value">${company.location}</div>
      </div>
      <div class="modal-detail">
        <div class="modal-detail__label">Stage</div>
        <div class="modal-detail__value">${company.stage}</div>
      </div>
    </div>
    
    <p class="modal-description">${company.description}</p>
    
    <div class="modal-achievements">
      <h4>Key Achievements</h4>
      <div class="achievements-list">
        ${achievementTags}
      </div>
    </div>
    
    <div class="modal-actions">
      <a href="${company.demoUrl}" target="_blank" class="btn--modal btn--modal-primary">
        View Demo
      </a>
      <a href="${company.websiteUrl}" target="_blank" class="btn--modal btn--modal-secondary">
        Visit Website
      </a>
    </div>
  `;
}

// Render companies
function renderCompanies(companiesToRender = filteredCompanies) {
  if (companiesToRender.length === 0) {
    companyGrid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <h3>No companies found</h3>
        <p>Try adjusting your search or filter criteria.</p>
      </div>
    `;
    return;
  }

  const html = companiesToRender.map(createCompanyCard).join('');
  companyGrid.innerHTML = html;

  // Add click handlers to company cards and demo buttons
  document.querySelectorAll('.company-card').forEach(card => {
    // Add click handler for the card itself
    card.addEventListener('click', (e) => {
      // Don't open modal if demo button was clicked
      if (e.target.closest('.btn--demo')) {
        return;
      }
      
      const companyId = parseInt(card.dataset.companyId);
      const company = companies.find(c => c.id === companyId);
      if (company) {
        showModal(company);
      }
    });

    // Ensure demo buttons work correctly
    const demoButton = card.querySelector('.btn--demo');
    if (demoButton) {
      demoButton.addEventListener('click', (e) => {
        e.stopPropagation();
        // The href attribute should handle opening in new tab
      });
    }
  });
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
  
  renderCompanies(filteredCompanies);
}

// Show modal
function showModal(company) {
  modalBody.innerHTML = createModalContent(company);
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

// Hide modal
function hideModal() {
  modal.classList.add('hidden');
  document.body.style.overflow = 'auto';
}

async function loadExternalCompaniesIfAvailable() {
  try {
    const response = await fetch('./data.json', { cache: 'no-store' });
    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        companies = data.map((c, idx) => ({
          id: c.id ?? idx + 1,
          name: c.name,
          slug: c.slug || (c.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          logo: c.logo || (c.name ? c.name[0] : '?'),
          color: c.color || '#2563EB',
          tagline: c.tagline || '',
          description: c.description || '',
          industry: c.industry || '',
          stage: c.stage || '',
          founded: c.founded || '',
          teamSize: c.teamSize || '',
          location: c.location || '',
          teamSummary: c.teamSummary || '',
          techKpi: c.techKpi || '',
          fundingRaised: c.fundingRaised || '',
          backers: Array.isArray(c.backers) ? c.backers : [],
          targetCustomer: c.targetCustomer || '',
          differentiators: Array.isArray(c.differentiators) ? c.differentiators : [],
          // Optional metrics for VC card
          arr: c.arr ?? '',
          mrr: c.mrr ?? '',
          growthRate: c.growthRate ?? '',
          nrr: c.nrr ?? '',
          churn: c.churn ?? '',
          burnRate: c.burnRate ?? '',
          runwayMonths: c.runwayMonths ?? '',
          ltvToCac: c.ltvToCac ?? '',
          cacPaybackMonths: c.cacPaybackMonths ?? '',
          grossMargin: c.grossMargin ?? '',
          apiLatencyMs: c.apiLatencyMs ?? '',
          accuracy: c.accuracy ?? '',
          arrPerEmployee: c.arrPerEmployee ?? '',
          achievements: Array.isArray(c.achievements) ? c.achievements : [],
          demoUrl: c.demoUrl || c.primaryCta || '#',
          websiteUrl: c.websiteUrl || '#'
        }));
        filteredCompanies = [...companies];
      }
    }
  } catch (_) {
    // ignore fetch errors; fallback to embedded data
  }
}

// Initialize the application
async function initializeApp() {
  await loadExternalCompaniesIfAvailable();
  // Initial render
  renderCompanies();

  // Search input event listener
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
  if (industryFilter) {
    industryFilter.addEventListener('change', (e) => {
      currentIndustryFilter = e.target.value;
      filterCompanies();
    });
  }

  // Stage filter event listener
  if (stageFilter) {
    stageFilter.addEventListener('change', (e) => {
      currentStageFilter = e.target.value;
      filterCompanies();
    });
  }

  // Modal close handlers
  if (modalClose) {
    modalClose.addEventListener('click', hideModal);
  }
  
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', hideModal);
  }

  // Escape key to close modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
      hideModal();
    }
  });

  // Prevent modal close when clicking inside modal content
  const modalContent = modal?.querySelector('.modal__content');
  if (modalContent) {
    modalContent.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }
}

// Wait for DOM to be fully loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}