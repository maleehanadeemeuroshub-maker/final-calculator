/* ================================================================
     BASIC CALCULATOR — plain +, -, *, /, % arithmetic
     ================================================================ */

const basicCurrentText  = document.getElementById('basicCurrentText');
const basicPreviousText = document.getElementById('basicPreviousText');
let basicExpression = '';

function updateBasicDisplay() {
  basicCurrentText.textContent = basicExpression === '' ? '0' : basicExpression;
}

function basicNegate() {
  const match = basicExpression.match(/(-?\d+\.?\d*)$/);
  if (!match) return;
  const numStr = match[1];
  const before = basicExpression.slice(0, basicExpression.length - numStr.length);
  const toggled = numStr.startsWith('-') ? numStr.slice(1) : '-' + numStr;
  basicExpression = before + '(' + toggled + ')';
}

function basicDelete() {
  if (basicExpression === 'Error') { basicExpression = ''; return; }
  basicExpression = basicExpression.slice(0, -1);
}

function basicCalculate() {
  if (basicExpression === '') return;
  try {
    const result = Function(`"use strict"; return (${basicExpression})`)();
    if (!Number.isFinite(result)) throw new Error('Invalid result');
    const finalResult = parseFloat(result.toFixed(10)).toString();
    basicPreviousText.textContent = basicExpression + ' =';
    basicExpression = finalResult;
  } catch (err) {
    basicExpression = 'Error';
  }
}

document.querySelectorAll('.calc-btn').forEach(button => {
  button.addEventListener('click', (evt) => {
    spawnRipple(evt, button);
    const { basicNum, basicOp, basicAction } = button.dataset;
    if (basicNum !== undefined) basicExpression += basicNum;
    else if (basicOp !== undefined) basicExpression += basicOp;
    else if (basicAction === 'clear') { basicExpression = ''; basicPreviousText.textContent = ''; }
    else if (basicAction === 'delete') basicDelete();
    else if (basicAction === 'negate') basicNegate();
    else if (basicAction === 'equals') basicCalculate();
    updateBasicDisplay();
  });
});