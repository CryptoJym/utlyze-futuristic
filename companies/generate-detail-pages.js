// Script to generate company detail pages from the template
const fs = require('fs');
const path = require('path');

// Read the template
const templatePath = path.join(__dirname, 'company-template.html');
const template = fs.readFileSync(templatePath, 'utf8');

// Read company data
const dataPath = path.join(__dirname, 'data.json');
const companies = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Helper function to format achievements
function formatAchievements(achievements) {
    if (!achievements || !Array.isArray(achievements) || achievements.length === 0) {
        return '<p>Building something amazing...</p>';
    }
    return achievements.map(achievement => 
        `<span class="achievement">${achievement}</span>`
    ).join('\n                ');
}

// Helper function to format metrics
function formatMetrics(company) {
    const metrics = [];
    
    if (company.techKpi) {
        metrics.push(`
                <div class="metric-item">
                    <div class="metric-label">Tech KPI</div>
                    <div class="metric-value">${company.techKpi}</div>
                </div>`);
    }
    
    if (company.teamSummary) {
        metrics.push(`
                <div class="metric-item">
                    <div class="metric-label">Team</div>
                    <div class="metric-value">${company.teamSummary}</div>
                </div>`);
    }
    
    if (company.targetCustomer) {
        metrics.push(`
                <div class="metric-item">
                    <div class="metric-label">Target Customer</div>
                    <div class="metric-value">${company.targetCustomer}</div>
                </div>`);
    }
    
    return metrics.join('\n');
}

// Helper function to format outcomes
function formatOutcomes(company) {
    const outcomes = [];
    
    if (company.differentiators && company.differentiators.length > 0) {
        outcomes.push(`
                <div class="highlight-card">
                    <h3>Key Differentiators</h3>
                    <ul>
                        ${company.differentiators.map(d => `<li>${d}</li>`).join('\n                        ')}
                    </ul>
                </div>`);
    }
    
    // Add more outcome sections as needed
    if (outcomes.length === 0) {
        outcomes.push(`
                <div class="highlight-card">
                    <h3>Coming Soon</h3>
                    <p>We're building something transformative. Stay tuned for updates!</p>
                </div>`);
    }
    
    return outcomes.join('\n');
}

// Generate pages for each company
companies.forEach(company => {
    // Create company directory if it doesn't exist
    const companyDir = path.join(__dirname, company.slug);
    if (!fs.existsSync(companyDir)) {
        fs.mkdirSync(companyDir, { recursive: true });
    }
    
    // Replace placeholders in template
    let html = template
        .replace(/{COMPANY_NAME}/g, company.name)
        .replace(/{COMPANY_TAGLINE}/g, company.tagline)
        .replace(/{COMPANY_DESCRIPTION}/g, company.description)
        .replace(/{COMPANY_COLOR}/g, company.color)
        .replace(/{COMPANY_LOGO}/g, company.logo)
        .replace(/{COMPANY_STAGE}/g, company.stage || 'Early Stage')
        .replace(/{COMPANY_INDUSTRY}/g, company.industry || 'Technology')
        .replace(/{COMPANY_LOCATION}/g, company.location || 'Remote')
        .replace(/{COMPANY_FOUNDED}/g, company.founded || '2025')
        .replace(/{COMPANY_TEAM_SIZE}/g, company.teamSize || 'Growing Team')
        .replace(/{COMPANY_FUNDING}/g, company.fundingRaised || 'Pre-funding')
        .replace(/{COMPANY_DEMO_URL}/g, company.demoUrl || '#')
        .replace(/{COMPANY_WEBSITE_URL}/g, company.websiteUrl || '#')
        .replace(/{COMPANY_ACHIEVEMENTS}/g, formatAchievements(company.achievements))
        .replace(/{COMPANY_METRICS}/g, formatMetrics(company))
        .replace(/{COMPANY_OUTCOMES}/g, formatOutcomes(company));
    
    // Write the file
    const outputPath = path.join(companyDir, 'index.html');
    fs.writeFileSync(outputPath, html);
    console.log(`Generated: ${company.name} -> ${outputPath}`);
});

console.log('\nAll company detail pages generated successfully!');