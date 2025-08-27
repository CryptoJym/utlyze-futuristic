// ROI Landing Page Logic

// Reuse project Supabase credentials if we keep them centralized; for now, duplicate to keep page standalone.
const supabaseUrl = 'https://mvjzmhlwnbwkrtachiec.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12anptaGx3bmJ3a3J0YWNoaWVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwOTI1MDQsImV4cCI6MjA2OTY2ODUwNH0.KWWX-XFgBqCA4MUpUOIU_Dt0gLX7O6mWgMVJhJAuCXw';

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

function calcROI() {
	const modeSimple = document.getElementById('modeSimple')?.checked;
	let tokensPerReq = 0;
	let requestsPerDay = 0;
	let apiCost = 0;
	let currentMonthly = 0;
	const hostingFee = parseNumber(document.getElementById('hostingFee').value);
	const trainingFee = parseNumber(document.getElementById('trainingFee').value);
	const amortizationMonths = parseInt(document.getElementById('amortizationMonths').value || '12', 10) || 12;

	if (modeSimple) {
		const range = document.getElementById('spendRange')?.value;
		const monthlyOverride = parseNumber(document.getElementById('simpleMonthlySpend')?.value);
		const rangeMidpoints = { under_1k: 500, '1k_5k': 3000, '5k_20k': 12000, '20k_plus': 25000 };
		currentMonthly = monthlyOverride > 0 ? monthlyOverride : (rangeMidpoints[range] || 0);
	} else {
		tokensPerReq = parseNumber(document.getElementById('tokensPerReq').value);
		requestsPerDay = parseNumber(document.getElementById('requestsPerDay').value);
		apiCost = parseNumber(document.getElementById('apiCost').value);
		currentMonthly = (tokensPerReq * requestsPerDay / 1000) * apiCost * 30;
	}
	const trainingMonthly = amortizationMonths > 0 ? (trainingFee / amortizationMonths) : 0;
	const utlyzeMonthly = hostingFee + trainingMonthly;
	const savings = currentMonthly - utlyzeMonthly;
	const roi = utlyzeMonthly > 0 ? (savings / utlyzeMonthly) : 0;

	document.getElementById('currentSpend').innerText = formatMoney(currentMonthly);
	document.getElementById('utlyzeCost').innerText = formatMoney(utlyzeMonthly);
	document.getElementById('savings').innerText = formatMoney(savings);
	document.getElementById('roi').innerText = (roi * 100).toFixed(1) + '%';
	document.getElementById('roiResults').style.display = 'block';

	// Update sticky summary
	const summaryCurrent = document.getElementById('summaryCurrent');
	const summaryUtlyze = document.getElementById('summaryUtlyze');
	const summarySavings = document.getElementById('summarySavings');
	const summaryRoi = document.getElementById('summaryRoi');
	if (summaryCurrent) summaryCurrent.textContent = formatMoney(currentMonthly);
	if (summaryUtlyze) summaryUtlyze.textContent = formatMoney(utlyzeMonthly);
	if (summarySavings) summarySavings.textContent = formatMoney(savings);
	if (summaryRoi) summaryRoi.textContent = (roi * 100).toFixed(1) + '%';

	// Sync hidden fields on lead form
	const form = document.getElementById('leadForm');
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
}

window.addEventListener('DOMContentLoaded', () => {
	const btnCalc = document.getElementById('btnCalc');
	const leadForm = document.getElementById('leadForm');
	const calcForm = document.getElementById('calcForm');

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
					const { error } = await supabase.from('roi_leads').insert({
						name: payload.name,
						email: payload.email,
						company: payload.company || null,
						notes: payload.notes || null,
						role: payload.role || null,
						pain_points: painPoints && painPoints.length ? painPoints : null,
						tokens_per_request: Number(payload.tokens_per_request) || null,
						requests_per_day: Number(payload.requests_per_day) || null,
						api_cost_per_k: Number(payload.api_cost_per_k) || null,
						hosting_fee: Number(payload.hosting_fee) || null,
						training_fee: Number(payload.training_fee) || null,
						amortization_months: Number(payload.amortization_months) || 12,
						current_monthly_spend: Number(payload.current_monthly_spend) || null,
						utlyze_effective_monthly: Number(payload.utlyze_effective_monthly) || null,
						savings: Number(payload.savings) || null,
						roi_percentage: Number(payload.roi_percentage) || null,
						spend_range: payload.spend_range || null,
						utm_source: payload.utm_source || null,
						utm_medium: payload.utm_medium || null,
						utm_campaign: payload.utm_campaign || null,
						utm_term: payload.utm_term || null,
						utm_content: payload.utm_content || null,
						referrer: payload.referrer || null,
						page_url: payload.page_url || null
					});
					if (error) throw error;
				}

				// Optional: also forward to external CRM webhook here
				// await fetch('https://your-gohighlevel-webhook-url', { method: 'POST', body: formData });

				leadForm.reset();
				alert('Thanks! Your personalized ROI summary is on its way.');
			} catch (err) {
				console.error('Error submitting ROI lead:', err);
				alert('Sorry, something went wrong. Please try again.');
			}
		});
	}
});
