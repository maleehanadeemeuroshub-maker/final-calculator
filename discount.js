/* ================================================================
     DISCOUNT CALCULATOR
     ================================================================ */

const discCalcBtn = document.getElementById('discCalcBtn');
if (discCalcBtn) {
  discCalcBtn.addEventListener('click', () => {
    const price = parseFloat(document.getElementById('discPrice').value);
    const pct = parseFloat(document.getElementById('discPercent').value);
    const box = document.getElementById('discResult');
    if (!Number.isFinite(price) || !Number.isFinite(pct) || price < 0 || pct < 0) {
      showResult(box, 'Enter a valid price and discount %.');
      return;
    }
    const discountAmount = (price * pct) / 100;
    const finalPrice = price - discountAmount;
    showResult(box, `Final price: ${finalPrice.toFixed(2)}`, `You save: ${discountAmount.toFixed(2)}`);
  });
}