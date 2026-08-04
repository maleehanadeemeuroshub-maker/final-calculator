/* ================================================================
     DATE DIFFERENCE CALCULATOR
     ================================================================ */

const ddCalcBtn = document.getElementById('ddCalcBtn');
if (ddCalcBtn) {
  ddCalcBtn.addEventListener('click', () => {
    const startVal = document.getElementById('ddStart').value;
    const endVal = document.getElementById('ddEnd').value;
    const box = document.getElementById('ddResult');
    if (!startVal || !endVal) { showResult(box, 'Pick both dates.'); return; }
    const start = new Date(startVal);
    const end = new Date(endVal);
    const diffMs = end - start;
    const totalDays = Math.round(Math.abs(diffMs) / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(totalDays / 7);
    const remDays = totalDays % 7;
    const direction = diffMs < 0 ? ' (end date is before start date)' : '';
    showResult(box, `${totalDays.toLocaleString()} days${direction}`, `${weeks} weeks and ${remDays} days`);
  });
}