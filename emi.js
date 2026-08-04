/* ================================================================
     EMI / LOAN CALCULATOR
     ================================================================ */

const emiCalcBtn = document.getElementById('emiCalcBtn');
if (emiCalcBtn) {
  emiCalcBtn.addEventListener('click', () => {
    const p = parseFloat(document.getElementById('emiPrincipal').value);
    const annualRate = parseFloat(document.getElementById('emiRate').value);
    const n = parseFloat(document.getElementById('emiMonths').value);
    const box = document.getElementById('emiResult');
    if (![p, annualRate, n].every(Number.isFinite) || p <= 0 || n <= 0 || annualRate < 0) {
      showResult(box, 'Enter a valid loan amount, rate and tenure.');
      return;
    }
    const r = annualRate / 12 / 100;
    let emi;
    if (r === 0) {
      emi = p / n;
    } else {
      emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }
    const totalPayment = emi * n;
    const totalInterest = totalPayment - p;
    showResult(
      box,
      `EMI: ${emi.toFixed(2)} / month`,
      `Total payment: ${totalPayment.toFixed(2)}`,
      `Total interest: ${totalInterest.toFixed(2)}`
    );
  });
}