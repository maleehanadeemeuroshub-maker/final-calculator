/* ================================================================
     TIP CALCULATOR
     ================================================================ */

const tipChips  = document.querySelectorAll('#tipChipRow .glass-chip');
const tipCustom = document.getElementById('tipCustom');
let selectedTipPct = 15;

tipChips.forEach(chip => {
  chip.addEventListener('click', () => {
    tipChips.forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    selectedTipPct = parseFloat(chip.dataset.tip);
    tipCustom.value = '';
  });
});

tipCustom.addEventListener('input', () => {
  if (tipCustom.value.trim() !== '') {
    tipChips.forEach(c => c.classList.remove('active'));
  }
});

const tipCalcBtn = document.getElementById('tipCalcBtn');
if (tipCalcBtn) {
  tipCalcBtn.addEventListener('click', () => {
    const bill = parseFloat(document.getElementById('tipBill').value);
    const people = parseInt(document.getElementById('tipPeople').value, 10) || 1;
    const customPct = parseFloat(tipCustom.value);
    const pct = Number.isFinite(customPct) && tipCustom.value.trim() !== '' ? customPct : selectedTipPct;
    const box = document.getElementById('tipResult');

    if (!Number.isFinite(bill) || bill <= 0 || !Number.isFinite(pct) || pct < 0 || people < 1) {
      box.innerHTML = `<div class="glass-result-big">Enter a valid bill and tip %.</div>`;
      box.classList.remove('hidden');
      return;
    }

    const tipAmount = (bill * pct) / 100;
    const total = bill + tipAmount;
    const perPerson = total / people;

    box.innerHTML = `
      <div class="glass-result-big">${perPerson.toFixed(2)} / person</div>
      <div>Tip (${pct}%): ${tipAmount.toFixed(2)}</div>
      <div>Total with tip: ${total.toFixed(2)}</div>
    `;
    box.classList.remove('hidden');
  });
}