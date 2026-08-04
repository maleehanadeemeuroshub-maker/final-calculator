/* ================================================================
     AGE CALCULATOR
     ================================================================ */

const ageAsOfInput = document.getElementById('ageAsOf');
if (ageAsOfInput) ageAsOfInput.valueAsDate = new Date();

const ageCalcBtn = document.getElementById('ageCalcBtn');
if (ageCalcBtn) {
  ageCalcBtn.addEventListener('click', () => {
    const dob = document.getElementById('ageDob').value;
    const asOf = document.getElementById('ageAsOf').value;
    const box = document.getElementById('ageResult');
    if (!dob || !asOf) { showResult(box, 'Pick both dates.'); return; }
    const start = new Date(dob);
    const end = new Date(asOf);
    if (end < start) { showResult(box, '"As of" date must be after the date of birth.'); return; }

    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();
    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) { months += 12; years -= 1; }
    const totalDays = Math.round((end - start) / (1000 * 60 * 60 * 24));

    showResult(box, `${years} years, ${months} months, ${days} days`, `Total: ${totalDays.toLocaleString()} days`);
  });
}