/* ================================================================
     CURRENCY CALCULATOR
     Live rates from open.er-api.com (no key required), with a
     small offline fallback table if the request fails.
     ================================================================ */

const CURRENCY_NAMES = {
  USD: 'US Dollar', EUR: 'Euro', GBP: 'British Pound', PKR: 'Pakistani Rupee',
  INR: 'Indian Rupee', JPY: 'Japanese Yen', AUD: 'Australian Dollar',
  CAD: 'Canadian Dollar', CNY: 'Chinese Yuan', AED: 'UAE Dirham',
  SAR: 'Saudi Riyal', CHF: 'Swiss Franc', SGD: 'Singapore Dollar',
  NZD: 'New Zealand Dollar', ZAR: 'South African Rand'
};

// Approximate fallback rates (per 1 USD) — only used if the live fetch fails.
const FALLBACK_RATES_USD = {
  USD: 1, EUR: 0.92, GBP: 0.78, PKR: 283, INR: 83.5, JPY: 151,
  AUD: 1.52, CAD: 1.36, CNY: 7.24, AED: 3.67, SAR: 3.75, CHF: 0.88,
  SGD: 1.34, NZD: 1.64, ZAR: 18.6
};

const curFromSel   = document.getElementById('curFrom');
const curToSel     = document.getElementById('curTo');
const curAmountEl  = document.getElementById('curAmount');
const curCalcBtn   = document.getElementById('curCalcBtn');
const curSwapBtn   = document.getElementById('curSwapBtn');
const curResultBox = document.getElementById('curResult');
const curStatusEl  = document.getElementById('curStatus');

let ratesUSD = null;
let ratesAreLive = false;

function populateCurrencySelects() {
  const optionsHtml = Object.keys(CURRENCY_NAMES)
    .map(code => `<option value="${code}">${code} — ${CURRENCY_NAMES[code]}</option>`)
    .join('');
  curFromSel.innerHTML = optionsHtml;
  curToSel.innerHTML = optionsHtml;
  curFromSel.value = 'USD';
  curToSel.value = 'PKR';
}

async function loadRates() {
  curStatusEl.textContent = 'Fetching live rates…';
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD');
    if (!res.ok) throw new Error('Bad response');
    const data = await res.json();
    if (data.result !== 'success' || !data.rates) throw new Error('Bad payload');
    ratesUSD = data.rates;
    ratesAreLive = true;
    const updated = data.time_last_update_utc ? data.time_last_update_utc : '';
    curStatusEl.textContent = updated ? `Live rates · updated ${updated}` : 'Live rates loaded.';
  } catch (err) {
    ratesUSD = FALLBACK_RATES_USD;
    ratesAreLive = false;
    curStatusEl.textContent = "Couldn't reach live rates — using approximate offline rates.";
  }
}

function convertCurrency() {
  const amount = parseFloat(curAmountEl.value);
  const from = curFromSel.value;
  const to = curToSel.value;

  if (!Number.isFinite(amount) || amount < 0) {
    showResult(curResultBox, 'Enter a valid amount.');
    return;
  }
  if (!ratesUSD || !(from in ratesUSD) || !(to in ratesUSD)) {
    showResult(curResultBox, 'Rates not available for one of the selected currencies.');
    return;
  }

  const amountInUsd = amount / ratesUSD[from];
  const result = amountInUsd * ratesUSD[to];
  const rate = ratesUSD[to] / ratesUSD[from];

  showResult(
    curResultBox,
    `${result.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${to}`,
    `1 ${from} = ${parseFloat(rate.toFixed(6)).toLocaleString()} ${to}`,
    ratesAreLive ? '' : '(offline approximate rate)'
  );
}

if (curFromSel) {
  populateCurrencySelects();
  loadRates();

  curCalcBtn.addEventListener('click', convertCurrency);

  curSwapBtn.addEventListener('click', (evt) => {
    spawnRipple(evt, curSwapBtn);
    const temp = curFromSel.value;
    curFromSel.value = curToSel.value;
    curToSel.value = temp;
  });
}