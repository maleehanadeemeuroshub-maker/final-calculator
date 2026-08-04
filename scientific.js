/* ================================================================
     SCIENTIFIC CALCULATOR — engine, memory, history, quick-calc form
     ================================================================ */

const state = {
  expression: '',
  angleMode: 'deg',
  history: [],
  memory: 0,
  lastAnswer: 0
};

const MAX_HISTORY = 20;

const currentText     = document.getElementById('currentText');
const previousText     = document.getElementById('previousText');
const historyList      = document.getElementById('historyList');
const emptyMsg         = document.getElementById('emptyHistoryMsg');
const degBtn           = document.getElementById('degBtn');
const radBtn           = document.getElementById('radBtn');
const quickForm        = document.getElementById('quickForm');
const quickInput       = document.getElementById('quickInput');
const formError        = document.getElementById('formError');
const clearHistBtn     = document.getElementById('clearHistoryBtn');
const equalsBtn        = document.getElementById('equalsBtn');
const displayBox       = document.querySelector('.display-glow');
const memoryIndicator  = document.getElementById('memoryIndicator');

const calcButtons = document.querySelectorAll(
  '.calc-btn[data-number], .calc-btn[data-operator], .calc-btn[data-func], .calc-btn[data-action], .calc-btn[data-paren], .calc-btn[data-const]'
);

function formatForDisplay(expr) {
  return expr
    .replace(/Math\.asin\(/g, 'sin⁻¹(')
    .replace(/Math\.acos\(/g, 'cos⁻¹(')
    .replace(/Math\.atan\(/g, 'tan⁻¹(')
    .replace(/Math\.sinh\(/g, 'sinh(')
    .replace(/Math\.cosh\(/g, 'cosh(')
    .replace(/Math\.tanh\(/g, 'tanh(')
    .replace(/Math\.sin\(/g, 'sin(')
    .replace(/Math\.cos\(/g, 'cos(')
    .replace(/Math\.tan\(/g, 'tan(')
    .replace(/Math\.log10\(/g, 'log(')
    .replace(/Math\.log\(/g, 'ln(')
    .replace(/Math\.sqrt\(/g, '√(')
    .replace(/Math\.PI/g, 'π')
    .replace(/Math\.E/g, 'e')
    .replace(/\*\*/g, '^');
}

function updateDisplay() {
  currentText.textContent = state.expression === '' ? '0' : formatForDisplay(state.expression);
  currentText.classList.remove('digit-pop');
  void currentText.offsetWidth; // restart animation
  currentText.classList.add('digit-pop');

  if (state.expression === 'Error') {
    displayBox.classList.remove('shake');
    void displayBox.offsetWidth;
    displayBox.classList.add('shake');
  }
}

function appendToExpression(value) { state.expression += value; }
function inputNumber(digit) { appendToExpression(digit); }
function inputOperator(op) { appendToExpression(op === '^' ? '**' : op); }
function inputParen(p) { appendToExpression(p); }
function inputConst(name) { appendToExpression(name === 'pi' ? 'Math.PI' : 'Math.E'); }

function angleWrap(fnCall) {
  if (state.angleMode === 'deg') {
    return fnCall.replace('(', '((Math.PI/180)*');
  }
  return fnCall;
}

// Inverse trig functions (asin/acos/atan) return radians natively —
// convert the OUTPUT to degrees by prefixing a (180/PI)* multiplier.
function angleWrapInverse(fnCall) {
  if (state.angleMode === 'deg') {
    return '(180/Math.PI)*' + fnCall;
  }
  return fnCall;
}

function inputFunc(fn) {
  switch (fn) {
    case 'sin':     appendToExpression(angleWrap('Math.sin(')); break;
    case 'cos':     appendToExpression(angleWrap('Math.cos(')); break;
    case 'tan':     appendToExpression(angleWrap('Math.tan(')); break;
    case 'asin':    appendToExpression(angleWrapInverse('Math.asin(')); break;
    case 'acos':    appendToExpression(angleWrapInverse('Math.acos(')); break;
    case 'atan':    appendToExpression(angleWrapInverse('Math.atan(')); break;
    case 'sinh':    appendToExpression('Math.sinh('); break;
    case 'cosh':    appendToExpression('Math.cosh('); break;
    case 'tanh':    appendToExpression('Math.tanh('); break;
    case 'log':     appendToExpression('Math.log10('); break;
    case 'ln':      appendToExpression('Math.log('); break;
    case 'sqrt':    appendToExpression('Math.sqrt('); break;
    case 'nthroot': appendToExpression('**(1/'); break;
    case 'exp':     appendToExpression('e'); break;
    case 'rand':    appendToExpression(Math.random().toFixed(6).toString()); break;
    case 'pow2':    appendToExpression('**2'); break;
    case 'inv':     appendToExpression('**-1'); break;
    case 'percent': appendToExpression('/100'); break;
    case 'fact':    appendToExpression('!'); break;
  }
}

function factorial(n) {
  if (n < 0 || !Number.isInteger(n)) return NaN;
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}

function resolveFactorials(expr) {
  return expr.replace(/(\d+(\.\d+)?)!/g, (match, num) => `factorial(${num})`);
}

function addToHistory(expr, result) {
  const entry = {
    expression: formatForDisplay(expr),
    result: result,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
  state.history.unshift(entry);
  if (state.history.length > MAX_HISTORY) state.history.pop();
  renderHistory();
}

function renderHistory() {
  historyList.innerHTML = '';
  if (state.history.length === 0) {
    historyList.appendChild(emptyMsg);
    return;
  }
  for (const entry of state.history) {
    const li = document.createElement('li');
    li.className = 'history-item bg-white/70 rounded-lg px-3 py-2 border border-[#e8def7]';
    li.innerHTML = `
      <div class="text-[#8b7fa8] text-xs">${entry.expression} =</div>
      <div class="text-[#3d3557] font-semibold">${entry.result}</div>
      <div class="text-[#b3a8ce] text-[10px] mt-1">${entry.timestamp}</div>
    `;
    historyList.appendChild(li);
  }
}

function clearHistory() {
  state.history = [];
  renderHistory();
}

function calculate() {
  if (state.expression === '') return;
  try {
    const cleanExpr = resolveFactorials(state.expression);
    const result = Function('factorial', `"use strict"; return (${cleanExpr})`)(factorial);
    if (!Number.isFinite(result)) throw new Error('Invalid result');
    const finalResult = parseFloat(result.toFixed(10)).toString();
    previousText.textContent = formatForDisplay(state.expression) + ' =';
    addToHistory(state.expression, finalResult);
    state.expression = finalResult;
    state.lastAnswer = parseFloat(finalResult);
    burstSparkles(equalsBtn);
  } catch (err) {
    state.expression = 'Error';
  }
}

// Returns the numeric value of the current expression without
// mutating state — used by M+ / M- so they don't clear the display.
function getCurrentValue() {
  if (state.expression === '' || state.expression === 'Error') return 0;
  try {
    const cleanExpr = resolveFactorials(state.expression);
    const result = Function('factorial', `"use strict"; return (${cleanExpr})`)(factorial);
    return Number.isFinite(result) ? result : 0;
  } catch (err) {
    return 0;
  }
}

function updateMemoryIndicator() {
  memoryIndicator.classList.toggle('hidden', state.memory === 0);
}

function memoryClear() { state.memory = 0; updateMemoryIndicator(); }
function memoryAdd()   { state.memory += getCurrentValue(); updateMemoryIndicator(); }
function memorySub()   { state.memory -= getCurrentValue(); updateMemoryIndicator(); }
function memoryRecall(){ appendToExpression(state.memory.toString()); }

function insertAns() { appendToExpression(state.lastAnswer.toString()); }

// Toggles the sign of the last-typed number in the expression.
function negate() {
  const match = state.expression.match(/(-?\d+\.?\d*)$/);
  if (!match) return;
  const numStr = match[1];
  const before = state.expression.slice(0, state.expression.length - numStr.length);
  const toggled = numStr.startsWith('-') ? numStr.slice(1) : '-' + numStr;
  state.expression = before + '(' + toggled + ')';
}

function copyResult() {
  const text = currentText.textContent;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).catch(() => {});
  }
}

function pasteValue() {
  if (!navigator.clipboard || !navigator.clipboard.readText) return;
  navigator.clipboard.readText().then(text => {
    const val = text.trim();
    if (/^-?\d+(\.\d+)?$/.test(val)) {
      appendToExpression(val);
      updateDisplay();
    }
  }).catch(() => {});
}

function clearAll() {
  state.expression = '';
  previousText.textContent = '';
}

function deleteLast() {
  if (state.expression === 'Error') {
    state.expression = '';
    return;
  }
  const funcTokens = [
    'Math.asin(', 'Math.acos(', 'Math.atan(', 'Math.sinh(', 'Math.cosh(', 'Math.tanh(',
    'Math.sin(', 'Math.cos(', 'Math.tan(', 'Math.log10(', 'Math.log(',
    'Math.sqrt(', '(180/Math.PI)*', '(Math.PI/180)*', 'Math.PI', 'Math.E',
    '**(1/', '**-1', '**2', '**'
  ];
  let removed = false;
  for (let i = 0; i < funcTokens.length; i++) {
    const token = funcTokens[i];
    if (state.expression.endsWith(token)) {
      state.expression = state.expression.slice(0, -token.length);
      removed = true;
      break;
    }
  }
  if (!removed) state.expression = state.expression.slice(0, -1);
}

// FIXED: fully swaps className on both buttons, so the active/inactive
// state is always unambiguous — no partial class toggling to go wrong.
const ACTIVE_CLASSES   = 'mode-btn relative overflow-hidden px-4 py-1.5 rounded-full text-xs font-bold border-2 border-violet-300 bg-violet-400 text-white';
const INACTIVE_CLASSES = 'mode-btn relative overflow-hidden px-4 py-1.5 rounded-full text-xs font-bold border-2 border-[#e8def7] bg-white/70 text-[#a89bc4]';

function setAngleMode(mode) {
  state.angleMode = mode;

  if (mode === 'rad') {
    radBtn.className = ACTIVE_CLASSES;
    degBtn.className = INACTIVE_CLASSES;
  } else {
    degBtn.className = ACTIVE_CLASSES;
    radBtn.className = INACTIVE_CLASSES;
  }
}

calcButtons.forEach(button => {
  button.addEventListener('click', (evt) => {
    spawnRipple(evt, button);
    const { number, operator, func, action, paren, const: constName } = button.dataset;
    if (number !== undefined) inputNumber(number);
    else if (operator !== undefined) inputOperator(operator);
    else if (func !== undefined) inputFunc(func);
    else if (paren !== undefined) inputParen(paren);
    else if (constName !== undefined) inputConst(constName);
    else if (action === 'equals') calculate();
    else if (action === 'clear') clearAll();
    else if (action === 'delete') deleteLast();
    else if (action === 'ans') insertAns();
    else if (action === 'negate') negate();
    else if (action === 'mc') memoryClear();
    else if (action === 'mr') memoryRecall();
    else if (action === 'mplus') memoryAdd();
    else if (action === 'mminus') memorySub();
    else if (action === 'copy') copyResult();
    else if (action === 'paste') pasteValue();
    updateDisplay();
  });
});

degBtn.addEventListener('click', (evt) => { spawnRipple(evt, degBtn); setAngleMode('deg'); });
radBtn.addEventListener('click', (evt) => { spawnRipple(evt, radBtn); setAngleMode('rad'); });

clearHistBtn.addEventListener('click', clearHistory);

quickForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const value = quickInput.value.trim();
  const isValid = quickInput.checkValidity() && value.length > 0;
  if (!isValid) {
    formError.classList.remove('hidden');
    quickInput.classList.add('shake');
    setTimeout(() => quickInput.classList.remove('shake'), 400);
    return;
  }
  formError.classList.add('hidden');
  state.expression = value;
  calculate();
  updateDisplay();
  quickInput.value = '';
});

document.addEventListener('keydown', (e) => {
  if (document.activeElement === quickInput) return;
  if (e.key >= '0' && e.key <= '9') inputNumber(e.key);
  else if (e.key === '.') inputNumber('.');
  else if (['+', '-', '*', '/'].includes(e.key)) inputOperator(e.key);
  else if (e.key === '(' || e.key === ')') inputParen(e.key);
  else if (e.key === 'Enter' || e.key === '=') calculate();
  else if (e.key === 'Backspace') deleteLast();
  else if (e.key === 'Escape') clearAll();
  updateDisplay();
});

updateDisplay();
renderHistory();
setAngleMode('deg');