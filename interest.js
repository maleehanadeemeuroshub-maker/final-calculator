/* ================================================================
     SIMPLE INTEREST CALCULATOR
     ================================================================ */

const siCalcBtn = document.getElementById('siCalcBtn');
if (siCalcBtn) {
  siCalcBtn.addEventListener('click', () => {
    const p = parseFloat(document.getElementById('siPrincipal').value);
    const r = parseFloat(document.getElementById('siRate').value);
    const t = parseFloat(document.getElementById('siTime').value);
    const box = document.getElementById('siResult');
    if (![p, r, t].every(Number.isFinite) || p < 0 || r < 0 || t < 0) {
      showResult(box, 'Enter valid principal, rate and time.');
      return;
    }
    const interest = (p * r * t) / 100;
    const total = p + interest;
    showResult(box, `Interest: ${interest.toFixed(2)}`, `Total payable: ${total.toFixed(2)}`);
  });
}