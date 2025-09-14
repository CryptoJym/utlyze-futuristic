// ROI Landing Page Logic

// Reuse project Supabase credentials if we keep them centralized; for now, duplicate to keep page standalone.
var supabaseUrl = 'https://mvjzmhlwnbwkrtachiec.supabase.co';
var supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12anptaGx3bmJ3a3J0YWNoaWVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwOTI1MDQsImV4cCI6MjA2OTY2ODUwNH0.KWWX-XFgBqCA4MUpUOIU_Dt0gLX7O6mWgMVJhJAuCXw';

let supabase;
if (window.supabase && typeof window.supabase.createClient === 'function') {
	supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
} else {
	console.warn('Supabase library not loaded; skipping Supabase initialisation');
	supabase = null;
}

function parseNumber(value) {
	const n = parseFloat(value);
	return Number.isFinite(n) ? n : 0;
}

function formatMoney(n) {
	return (Number.isFinite(n) ? n : 0).toFixed(2);
}

function getUrlParam(name) {
	const params = new URLSearchParams(window.location.search);
	return params.get(name) || '';
}

function captureAttributionHiddenFields(form) {
	form.utm_source.value = getUrlParam('utm_source');
	form.utm_medium.value = getUrlParam('utm_medium');
	form.utm_campaign.value = getUrlParam('utm_campaign');
	form.utm_term.value = getUrlParam('utm_term');
	form.utm_content.value = getUrlParam('utm_content');
	form.referrer.value = document.referrer || '';
	form.page_url.value = window.location.href;
}

// Save calculator state to localStorage
function saveCalculatorState() {
	const state = {
		mode: document.getElementById('modeSimple')?.checked ? 'simple' : 'advanced',
		simpleMonthlySpend: document.getElementById('simpleMonthlySpend')?.value || '',
		spendRange: document.getElementById('spendRange')?.value || '',
		tokensPerReq: document.getElementById('tokensPerReq')?.value || '',
		requestsPerDay: document.getElementById('requestsPerDay')?.value || '',
		apiCost: document.getElementById('apiCost')?.value || ''
	};
	localStorage.setItem('utlyzeROIState', JSON.stringify(state));
}

// Load calculator state from localStorage
function loadCalculatorState() {
	try {
		const saved = localStorage.getItem('utlyzeROIState');
		if (!saved) return;
		
		const state = JSON.parse(saved);
		
		// Restore mode
		if (state.mode === 'advanced') {
			const advancedEl = document.getElementById('modeAdvanced');
			const simpleEl = document.getElementById('modeSimple');
			if (advancedEl && simpleEl) {
				advancedEl.checked = true;
				simpleEl.checked = false;
			}
		}
		
		// Restore values
		const setIfExists = (id, value) => {
			const el = document.getElementById(id);
			if (el && value) el.value = value;
		};
		
		setIfExists('simpleMonthlySpend', state.simpleMonthlySpend);
		setIfExists('spendRange', state.spendRange);
		setIfExists('tokensPerReq', state.tokensPerReq);
		setIfExists('requestsPerDay', state.requestsPerDay);
		setIfExists('apiCost', state.apiCost);
		
		// Sync UI
		const syncModeUI = () => {
			const modeSimple = document.getElementById('modeSimple')?.checked;
			const simpleFields = document.getElementById('simpleFields');
			const advancedFields = document.getElementById('advancedFields');
			if (modeSimple) {
				simpleFields && (simpleFields.style.display = '');
				advancedFields && (advancedFields.style.display = 'none');
			} else {
				simpleFields && (simpleFields.style.display = 'none');
				advancedFields && (advancedFields.style.display = '');
			}
		};
		syncModeUI();
		
	} catch (e) {
		console.warn('Failed to load calculator state:', e);
	}
}

function calcROI() {
	const modeSimple = document.getElementById('modeSimple')?.checked;
	let tokensPerReq = 0;
	let requestsPerDay = 0;
	let apiCost = 0;
	let currentMonthly = 0;
	const hostingFee = document.getElementById('hostingFee') ? parseNumber(document.getElementById('hostingFee').value) : 0;
	const trainingFee = document.getElementById('trainingFee') ? parseNumber(document.getElementById('trainingFee').value) : 0;
	const amortizationMonths = document.getElementById('amortizationMonths') ? (parseInt(document.getElementById('amortizationMonths').value || '12', 10) || 12) : 12;
	
	// Save state on each calculation
	saveCalculatorState();

	// Methodology inputs (removed for essentialism)
	// const offloadPercent = parseNumber(document.getElementById('offloadPercent')?.value || 80);
	// const promptReduction = parseNumber(document.getElementById('promptReduction')?.value || 15);
	// const cachingHitRate = parseNumber(document.getElementById('cachingHitRate')?.value || 25);
	// const batchingEfficiency = parseNumber(document.getElementById('batchingEfficiency')?.value || 20);
	// const hostedRate = parseNumber(document.getElementById('hostedRate')?.value || 0.0012);

	const trainingMonthly = amortizationMonths > 0 ? (trainingFee / amortizationMonths) : 0;

	// Compute costs (essentialist)
	if (modeSimple) {
		const sm = parseNumber(document.getElementById('simpleMonthlySpend')?.value);
		const range = document.getElementById('spendRange')?.value || '';
		const rangeMidpoints = { under_1k: 500, '1k_5k': 3000, '5k_20k': 12000, '20k_plus': 25000 };
		currentMonthly = sm > 0 ? sm : (rangeMidpoints[range] || 0);
	} else {
		tokensPerReq = parseNumber(document.getElementById('tokensPerReq')?.value);
		requestsPerDay = parseNumber(document.getElementById('requestsPerDay')?.value);
		apiCost = parseNumber(document.getElementById('apiCost')?.value);
		currentMonthly = (tokensPerReq * requestsPerDay / 1000) * apiCost * 30;
	}

	// Midpoint savings assumption (50%)
	const savingsPercent = 0.5;
	const utlyzeMonthly = currentMonthly * (1 - savingsPercent);
	const savings = currentMonthly - utlyzeMonthly;
	const roi = utlyzeMonthly > 0 ? (savings / utlyzeMonthly) : 0;

	const paybackDays = savings > 0 ? Math.max(1, Math.round((currentMonthly / Math.max(savings, 1)) * 30)) : 0;

	document.getElementById('utlyzeCost').innerText = formatMoney(utlyzeMonthly);
	document.getElementById('savings').innerText = formatMoney(savings);
	document.getElementById('roi').innerText = (roi * 100).toFixed(1) + '%';
	document.getElementById('paybackDays') && (document.getElementById('paybackDays').innerText = String(paybackDays));
	document.getElementById('currentSpend').innerText = formatMoney(currentMonthly);
	document.getElementById('roiResults').style.display = 'block';
	
	// Show assumptions explainer
	const assumptionsEl = document.getElementById('assumptionsExplainer');
	if (assumptionsEl) {
		assumptionsEl.style.display = 'block';
	}

	// Animate bars (proportional widths)
	const current = Math.max(1, Number(document.getElementById('currentSpend').textContent || '0'));
	const utlyze = Math.max(0, Number(document.getElementById('utlyzeCost').textContent || '0'));
	const savingsVal = Math.max(0, Number(document.getElementById('savings').textContent || '0'));
	const maxVal = Math.max(current, utlyze, savingsVal);
	const pct = (v) => `${Math.min(100, Math.round((v / (maxVal || 1)) * 100))}%`;
	const setW = (id, v) => { const el = document.getElementById(id); if (el) el.style.width = pct(v); };
	setW('barCurrent', current);
	setW('barUtlyze', utlyze);
	setW('barSavings', savingsVal);

	// Update sticky summary
	const summaryCurrent = document.getElementById('summaryCurrent');
	const summaryUtlyze = document.getElementById('summaryUtlyze');
	const summarySavings = document.getElementById('summarySavings');
	const summaryRoi = document.getElementById('summaryRoi');
	if (summaryCurrent) summaryCurrent.textContent = formatMoney(currentMonthly);
	if (summaryUtlyze) summaryUtlyze.textContent = formatMoney(utlyzeMonthly);
	if (summarySavings) summarySavings.textContent = formatMoney(savings);
	if (summaryRoi) summaryRoi.textContent = (roi * 100).toFixed(1) + '%';

    // Detailed report section removed (placeholder not in DOM)

	// Sync hidden fields on lead form
	const form = document.getElementById('calcForm');
	form.tokens_per_request.value = tokensPerReq;
	form.requests_per_day.value = requestsPerDay;
	form.api_cost_per_k.value = apiCost;
	form.hosting_fee.value = hostingFee;
	form.training_fee.value = trainingFee;
	form.amortization_months.value = amortizationMonths;
	form.current_monthly_spend.value = formatMoney(currentMonthly);
	form.utlyze_effective_monthly.value = formatMoney(utlyzeMonthly);
	form.savings.value = formatMoney(savings);
	form.roi_percentage.value = (roi * 100).toFixed(1);
	form.spend_range.value = document.getElementById('spendRange')?.value || '';
	// Move focus to results
	const heading = document.getElementById('resultsHeading');
	if (heading && typeof heading.focus === 'function') heading.focus();
}

window.addEventListener('DOMContentLoaded', () => {
	const btnCalc = document.getElementById('btnCalc');
	const leadForm = document.getElementById('calcForm');
	const calcForm = document.getElementById('calcForm');
	
	// Load saved state first
	loadCalculatorState();

	// Hydrate from URL params
	const params = new URLSearchParams(window.location.search);
	const setIf = (id, key=params.get(id)) => { const el=document.getElementById(id); if(el && params.get(id)) el.value=params.get(id); };
	setIf('simpleMonthlySpend');
	setIf('tokensPerReq'); setIf('requestsPerDay'); setIf('apiCost');
	const nameEl = calcForm?.querySelector('input[name="name"]'); if (nameEl && params.get('name')) nameEl.value = params.get('name');
	const emailEl = calcForm?.querySelector('input[name="email"]'); if (emailEl && params.get('email')) emailEl.value = params.get('email');
	const companyEl = calcForm?.querySelector('input[name="company"]'); if (companyEl && params.get('company')) companyEl.value = params.get('company');
	const roleSel = calcForm?.querySelector('select[name="role"]'); if (roleSel && params.get('role')) roleSel.value = params.get('role');
	// Hydrate pain points
	const painParams = params.getAll('pain_points[]');
	if (painParams && painParams.length) {
		painParams.forEach(v => {
			const box = calcForm?.querySelector(`input[type="checkbox"][name="pain_points[]"][value="${CSS.escape(v)}"]`);
			if (box) box.checked = true;
		});
	}
	// Hydrate calc mode
	const mode = params.get('calcMode');
	const modeSimpleEl = document.getElementById('modeSimple');
	const modeAdvancedEl = document.getElementById('modeAdvanced');
	if (mode === 'advanced' && modeAdvancedEl && modeSimpleEl) { modeAdvancedEl.checked = true; modeSimpleEl.checked = false; }

	// CTA affordance
	const setBusy = (busy) => {
        if (!calcForm) return;
        const btn = document.getElementById('btnCalc');
        if (btn) { btn.disabled = busy; btn.style.opacity = busy ? '0.7' : '1'; btn.style.cursor = busy ? 'not-allowed' : 'pointer'; }
    };

    const showError = (id, msg) => { const el = document.getElementById(id); if (el) { el.textContent = msg; el.style.display = msg ? 'block' : 'none'; } };

	if (btnCalc) {
		btnCalc.addEventListener('click', calcROI);
	}

	// Smooth scroll for top CTA
	const seeSavingsCta = document.getElementById('seeSavingsCta');
	if (seeSavingsCta) {
		seeSavingsCta.addEventListener('click', (e) => {
			const href = seeSavingsCta.getAttribute('href') || '';
			if (href.startsWith('#')) {
				e.preventDefault();
				const target = document.querySelector(href);
				if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
			}
		});
	}

	// Smooth scroll for subnav
	const subnavLinks = document.querySelectorAll('.roi-subnav a');
	subnavLinks.forEach(link => {
		link.addEventListener('click', (e) => {
			const href = link.getAttribute('href') || '';
			if (href.startsWith('#')) {
				e.preventDefault();
				const target = document.querySelector(href);
				if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
			}
		});
	});

	// Seed attribution
	if (leadForm) {
		captureAttributionHiddenFields(leadForm);
	}

	if (calcForm) {
		// Plan tier preset -> hosting fee
		const planTier = document.getElementById('planTier');
		if (planTier) {
			planTier.addEventListener('change', () => {
				const price = parseNumber(planTier.selectedOptions[0]?.dataset?.price);
				if (price > 0) {
					document.getElementById('hostingFee').value = String(price);
				}
				if (document.getElementById('roiResults').style.display === 'block') calcROI();
			});
		}

		// Mode switching UI
		const modeSimpleEl = document.getElementById('modeSimple');
		const modeAdvancedEl = document.getElementById('modeAdvanced');
		const simpleFields = document.getElementById('simpleFields');
		const advancedFields = document.getElementById('advancedFields');
		const syncModeUI = () => {
			if (modeSimpleEl && modeSimpleEl.checked) {
				simpleFields && (simpleFields.style.display = '');
				advancedFields && (advancedFields.style.display = 'none');
			} else {
				simpleFields && (simpleFields.style.display = 'none');
				advancedFields && (advancedFields.style.display = '');
			}
		};
		if (modeSimpleEl && modeAdvancedEl) {
			modeSimpleEl.addEventListener('change', syncModeUI);
			modeAdvancedEl.addEventListener('change', syncModeUI);
			syncModeUI();
		}

		// Recalculate when key inputs change
		['simpleMonthlySpend','spendRange','tokensPerReq','requestsPerDay','apiCost','hostingFee','trainingFee','amortizationMonths','planTier']
			.forEach(id => {
				const el = document.getElementById(id);
				if (el) el.addEventListener('change', () => {
					if (document.getElementById('roiResults').style.display === 'block') {
						calcROI();
					}
				});
			});

		// Methodology and presets
		;['offloadPercent','promptReduction','cachingHitRate','batchingEfficiency','hostedRate','useCasePreset'].forEach(id => {
			const el = document.getElementById(id);
			if (el) el.addEventListener('input', () => {
				const valSpan = document.getElementById(id + 'Val');
				if (valSpan && el && el.type === 'range') valSpan.textContent = el.value + '%';
				if (document.getElementById('roiResults').style.display === 'block') calcROI();
			});
		});

		// Use case presets
		const useCasePreset = document.getElementById('useCasePreset');
		const applyPreset = (preset) => {
			const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = String(val); };
			switch (preset) {
				case 'insurance_claims':
					setVal('tokensPerReq', 350);
					setVal('requestsPerDay', 1200);
					setVal('apiCost', 0.0030);
					setVal('offloadPercent', 80);
					setVal('promptReduction', 15);
					setVal('cachingHitRate', 30);
					setVal('batchingEfficiency', 20);
					setVal('hostedRate', 0.0012);
					break;
				case 'rag_support':
					setVal('tokensPerReq', 600);
					setVal('requestsPerDay', 800);
					setVal('apiCost', 0.0020);
					setVal('offloadPercent', 70);
					setVal('promptReduction', 20);
					setVal('cachingHitRate', 40);
					setVal('batchingEfficiency', 15);
					setVal('hostedRate', 0.0011);
					break;
				case 'doc_extraction':
					setVal('tokensPerReq', 900);
					setVal('requestsPerDay', 450);
					setVal('apiCost', 0.0025);
					setVal('offloadPercent', 85);
					setVal('promptReduction', 10);
					setVal('cachingHitRate', 20);
					setVal('batchingEfficiency', 25);
					setVal('hostedRate', 0.0013);
					break;
				case 'call_summaries':
					setVal('tokensPerReq', 1200);
					setVal('requestsPerDay', 200);
					setVal('apiCost', 0.0035);
					setVal('offloadPercent', 75);
					setVal('promptReduction', 18);
					setVal('cachingHitRate', 15);
					setVal('batchingEfficiency', 30);
					setVal('hostedRate', 0.0014);
					break;
				default:
					return;
			}
			// Show advanced mode and recalc
			if (modeAdvancedEl) modeAdvancedEl.checked = true;
			syncModeUI();
			const updateVal = (id) => { const s = document.getElementById(id + 'Val'); const el = document.getElementById(id); if (s && el && el.type === 'range') s.textContent = el.value + '%'; };
			['offloadPercent','promptReduction','cachingHitRate','batchingEfficiency'].forEach(updateVal);
			if (document.getElementById('roiResults').style.display === 'block') calcROI();
		};
		if (useCasePreset) {
			useCasePreset.addEventListener('change', () => applyPreset(useCasePreset.value));
		}

		// Report actions
		const printBtn = document.getElementById('printReportBtn');
		if (printBtn) {
			printBtn.addEventListener('click', () => window.print());
		}
		const emailBtn = document.getElementById('emailReportBtn');
		if (emailBtn) {
			emailBtn.addEventListener('click', () => {
				const lines = [];
				const get = (id) => document.getElementById(id)?.textContent || '';
				lines.push('Your Utlyze ROI estimate');
				lines.push('');
				lines.push(`Current spend: $${get('currentSpend')}`);
				lines.push(`Projected with Utlyze: $${get('utlyzeCost')}`);
				lines.push(`Savings: $${get('savings')}`);
				lines.push(`ROI: ${get('roi')}`);
				const payback = document.getElementById('paybackDays')?.textContent;
				if (payback) {
					lines.push(`Payback period: ${payback} days`);
				}
				const emailInput = document.querySelector('#calcForm input[name="email"]');
				const to = emailInput && emailInput.value ? emailInput.value : '';
				const subject = 'Your Utlyze ROI estimate';
				const body = lines.join('\n');
				const mailto = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
				window.location.href = mailto;
			});
		}
	}

	if (calcForm) {
		calcForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = nameEl?.value.trim();
            const email = emailEl?.value.trim();
            showError('nameError',''); showError('emailError','');
            if (!name) { showError('nameError','Name is required.'); nameEl?.focus(); return; }
            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showError('emailError','Enter a valid work email.'); emailEl?.focus(); return; }
            setBusy(true);
            try {
                calcROI();
                const heading = document.getElementById('resultsHeading');
                if (heading) heading.focus?.();
            } finally {
                setBusy(false);
            }
        });
	}

	if (leadForm) {
		leadForm.addEventListener('submit', async (e) => {
			e.preventDefault();
			// Ensure we have the latest calculations
			if (document.getElementById('roiResults').style.display !== 'block') {
				calcROI();
			}

			const formData = new FormData(leadForm);
			const payload = Object.fromEntries(formData.entries());
			const painPoints = formData.getAll('pain_points[]');

			try {
				if (supabase) {
					const { error } = await supabase.from('roi_leads').insert([
						{
							name: payload.name,
							email: payload.email,
							company: payload.company || null,
							notes: payload.notes || null,
							role: payload.role || null,
							pain_points: painPoints && painPoints.length ? painPoints : null,
							tokens_per_request: Number(payload.tokens_per_request) || null,
							requests_per_day: Number(payload.requests_per_day) || null,
							api_cost_per_k: Number(payload.api_cost_per_k) || null,
							hosting_fee: Number(payload.hosting_fee) || 0,
							training_fee: Number(payload.training_fee) || 0,
							amortization_months: Number(payload.amortization_months) || 12,
							current_monthly_spend: Number(payload.current_monthly_spend) || null,
							utlyze_effective_monthly: Number(payload.utlyze_effective_monthly) || null,
							savings: Number(payload.savings) || null,
							roi_percentage: Number(payload.roi_percentage) || null,
							spend_range: payload.spend_range || null,
							// Extended (optional) methodology fields if present in schema
							use_case_preset: null,
							offload_percent: null,
							prompt_reduction_percent: null,
							caching_hit_rate_percent: null,
							batching_efficiency_percent: null,
							hosted_rate_per_k: null,
							projected_new_monthly_cost: Number(document.getElementById('utlyzeCost')?.textContent || '0') || null,
							payback_days: Number(document.getElementById('paybackDays')?.textContent || '0') || null,
							utm_source: payload.utm_source || null,
							utm_medium: payload.utm_medium || null,
							utm_campaign: payload.utm_campaign || null,
							utm_term: payload.utm_term || null,
							utm_content: payload.utm_content || null,
							referrer: payload.referrer || null,
							page_url: payload.page_url || null
						}
					]);
					if (error) throw error;
				}

				// Best-effort Slack notification if configured
				try {
					if (window.utlyzeNotifySlack) {
						await window.utlyzeNotifySlack('roi', {
							name: payload.name,
							email: payload.email,
							company: payload.company,
							utlyze_effective_monthly: Number(document.getElementById('utlyzeCost')?.textContent || '0') || null,
							savings: Number(document.getElementById('savings')?.textContent?.replace(/[^0-9.]/g,'') || '0') || null,
							roi_percentage: Number(document.getElementById('roi')?.textContent?.replace(/[^0-9.]/g,'') || '0') || null,
							utm_source: payload.utm_source,
							utm_medium: payload.utm_medium,
							utm_campaign: payload.utm_campaign,
							referrer: payload.referrer,
							page_url: window.location.href
						});
					}
				} catch (e) { console.warn('Slack notify skipped:', e?.message || e); }

				leadForm.reset();
				alert('Thanks! Your personalized ROI summary is on its way.');
			} catch (err) {
				console.error('Error submitting ROI lead:', err);
				// Best-effort Slack even on DB failure
				try {
					if (window.utlyzeNotifySlack) {
						await window.utlyzeNotifySlack('roi-error', {
							name: payload.name,
							email: payload.email,
							company: payload.company,
							page_url: window.location.href,
							error: (err && (err.message || String(err))) || 'unknown'
						});
					}
				} catch (_) {}
				alert('Sorry, something went wrong. Please try again.');
			}
		});
	}
});
