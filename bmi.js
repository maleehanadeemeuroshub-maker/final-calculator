/* ================================================================
     BMI CALCULATOR
     ================================================================ */

const bmiCalcBtn = document.getElementById('bmiCalcBtn');
if (bmiCalcBtn) {
  bmiCalcBtn.addEventListener('click', () => {
    const weight = parseFloat(document.getElementById('bmiWeight').value);
    const heightCm = parseFloat(document.getElementById('bmiHeight').value);
    const box = document.getElementById('bmiResult');
    if (!weight || !heightCm || weight <= 0 || heightCm <= 0) {
      showResult(box, 'Enter a valid weight and height.');
      return;
    }
    const heightM = heightCm / 100;
    const bmi = weight / (heightM * heightM);
    let category;
    if (bmi < 18.5) category = 'Underweight';
    else if (bmi < 25) category = 'Normal weight';
    else if (bmi < 30) category = 'Overweight';
    else category = 'Obese';
    showResult(box, `BMI: ${bmi.toFixed(1)}`, `Category: ${category}`);
  });
}