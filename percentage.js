/* ================================================================
     PERCENTAGE CALCULATOR
     ================================================================ */

const pctCalcBtn1 = document.getElementById('pctCalcBtn1');
if (pctCalcBtn1) {
  pctCalcBtn1.addEventListener('click', () => {
    const x = parseFloat(document.getElementById('pctX1').value);
    const y = parseFloat(document.getElementById('pctY1').value);
    const box = document.getElementById('pctResult1');
    if (!Number.isFinite(x) || !Number.isFinite(y)) { showResult(box, 'Enter both numbers.'); return; }
    const result = (x / 100) * y;
    showResult(box, `${x}% of ${y} = ${parseFloat(result.toFixed(6))}`);
  });
}

const pctCalcBtn2 = document.getElementById('pctCalcBtn2');
if (pctCalcBtn2) {
  pctCalcBtn2.addEventListener('click', () => {
    const x = parseFloat(document.getElementById('pctX2').value);
    const y = parseFloat(document.getElementById('pctY2').value);
    const box = document.getElementById('pctResult2');
    if (!Number.isFinite(x) || !Number.isFinite(y) || y === 0) { showResult(box, 'Enter both numbers (Y can\'t be 0).'); return; }
    const result = (x / y) * 100;
    showResult(box, `${x} is ${parseFloat(result.toFixed(6))}% of ${y}`);
  });
}