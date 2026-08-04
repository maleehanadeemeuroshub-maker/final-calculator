/* ================================================================
     JAVASCRIPT — Variables, Data Types, Loops, Functions,
                  Arrays, Objects, DOM Manipulation
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
  const previousText    = document.getElementById('previousText');
  const historyList     = document.getElementById('historyList');
  const emptyMsg        = document.getElementById('emptyHistoryMsg');
  const degBtn          = document.getElementById('degBtn');
  const radBtn          = document.getElementById('radBtn');
  const quickForm       = document.getElementById('quickForm');
  const quickInput      = document.getElementById('quickInput');
  const formError       = document.getElementById('formError');
  const clearHistBtn    = document.getElementById('clearHistoryBtn');
  const equalsBtn       = document.getElementById('equalsBtn');
  const displayBox      = document.querySelector('.display-glow');
  const memoryIndicator = document.getElementById('memoryIndicator');

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

  // Material-style click ripple from the exact pointer position.
  function spawnRipple(evt, btn) {
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.width = ripple.style.height = size + 'px';
    const x = (evt.clientX ?? rect.left + rect.width / 2) - rect.left - size / 2;
    const y = (evt.clientY ?? rect.top + rect.height / 2) - rect.top - size / 2;
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    btn.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  }

  // Little sparkle particles bursting out of the equals button on success.
  function burstSparkles(btn) {
    const rect = btn.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const symbols = ['✦', '✧', '✨'];
    for (let i = 0; i < 8; i++) {
      const p = document.createElement('span');
      p.className = 'spark-particle';
      p.textContent = symbols[i % symbols.length];
      const angle = (Math.PI * 2 * i) / 8;
      const dist = 45 + Math.random() * 20;
      p.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
      p.style.setProperty('--dy', Math.sin(angle) * dist + 'px');
      p.style.left = centerX + 'px';
      p.style.top = centerY + 'px';
      document.body.appendChild(p);
      p.addEventListener('animationend', () => p.remove());
    }
    btn.classList.remove('equals-burst');
    void btn.offsetWidth;
    btn.classList.add('equals-burst');
  }

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
      li.className = 'history-item bg-[#0f0c1e] rounded-lg px-3 py-2 border border-white/5';
      li.innerHTML = `
        <div class="text-slate-400 text-xs">${entry.expression} =</div>
        <div class="text-white font-semibold">${entry.result}</div>
        <div class="text-slate-600 text-[10px] mt-1">${entry.timestamp}</div>
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
  const ACTIVE_CLASSES   = 'mode-btn relative overflow-hidden px-4 py-1.5 rounded-full text-xs font-bold border-2 border-violet-400 bg-violet-500 text-white';
  const INACTIVE_CLASSES = 'mode-btn relative overflow-hidden px-4 py-1.5 rounded-full text-xs font-bold border-2 border-white/10 bg-[#0f0c1e] text-slate-500';

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

  /* ================================================================
       VIEW ROUTING — hub search + switching between the 10 tools
       ================================================================ */

  const calcViews   = document.querySelectorAll('.calc-view');
  const hubSearch    = document.getElementById('hubSearch');
  const hubCards     = document.querySelectorAll('.hub-card');
  const hubNoMatch   = document.getElementById('hubNoMatch');

  function showView(target) {
    calcViews.forEach(view => view.classList.toggle('active', view.dataset.view === target));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  document.querySelectorAll('[data-target]').forEach(el => {
    el.addEventListener('click', () => showView(el.dataset.target));
  });

  if (hubSearch) {
    hubSearch.addEventListener('input', () => {
      const q = hubSearch.value.trim().toLowerCase();
      let visibleCount = 0;
      hubCards.forEach(card => {
        const matches = card.dataset.name.includes(q);
        card.style.display = matches ? '' : 'none';
        if (matches) visibleCount++;
      });
      hubNoMatch.classList.toggle('hidden', visibleCount !== 0);
    });
  }

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

  document.querySelectorAll('[data-view="basic"] .calc-btn').forEach(button => {
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

  /* ================================================================
       Shared helper — render a result box from an array of lines.
       First line is shown large/bold, the rest as supporting detail.
       ================================================================ */

  function showResult(boxEl, headline, ...detailLines) {
    boxEl.innerHTML = `<div class="tool-result-big">${headline}</div>` +
      detailLines.map(line => `<div>${line}</div>`).join('');
    boxEl.classList.remove('hidden');
  }

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

  /* ================================================================
       UNIT CONVERTER
       ================================================================ */

  const UNIT_GROUPS = {
    length: {
      label: 'Length',
      base: { m: 1, km: 1000, cm: 0.01, mm: 0.001, mile: 1609.344, yard: 0.9144, ft: 0.3048, inch: 0.0254 },
      names: { m: 'Meters', km: 'Kilometers', cm: 'Centimeters', mm: 'Millimeters', mile: 'Miles', yard: 'Yards', ft: 'Feet', inch: 'Inches' }
    },
    weight: {
      label: 'Weight',
      base: { kg: 1, g: 0.001, mg: 0.000001, lb: 0.45359237, oz: 0.028349523125, ton: 1000 },
      names: { kg: 'Kilograms', g: 'Grams', mg: 'Milligrams', lb: 'Pounds', oz: 'Ounces', ton: 'Metric tons' }
    },
    temperature: {
      label: 'Temperature',
      names: { c: 'Celsius', f: 'Fahrenheit', k: 'Kelvin' }
    }
  };

  const unitCategorySel = document.getElementById('unitCategory');
  const unitFromSel = document.getElementById('unitFrom');
  const unitToSel = document.getElementById('unitTo');

  function populateUnitSelects() {
    const group = UNIT_GROUPS[unitCategorySel.value];
    const keys = Object.keys(group.names);
    const optionsHtml = keys.map(k => `<option value="${k}">${group.names[k]}</option>`).join('');
    unitFromSel.innerHTML = optionsHtml;
    unitToSel.innerHTML = optionsHtml;
    if (keys.length > 1) unitToSel.selectedIndex = 1;
  }

  function convertTemperature(value, from, to) {
    let celsius;
    if (from === 'c') celsius = value;
    else if (from === 'f') celsius = (value - 32) * (5 / 9);
    else celsius = value - 273.15;

    if (to === 'c') return celsius;
    if (to === 'f') return celsius * (9 / 5) + 32;
    return celsius + 273.15;
  }

  if (unitCategorySel) {
    unitCategorySel.addEventListener('change', populateUnitSelects);
    populateUnitSelects();

    document.getElementById('unitCalcBtn').addEventListener('click', () => {
      const value = parseFloat(document.getElementById('unitValue').value);
      const box = document.getElementById('unitResult');
      const category = unitCategorySel.value;
      const from = unitFromSel.value;
      const to = unitToSel.value;
      if (!Number.isFinite(value)) { showResult(box, 'Enter a value to convert.'); return; }

      let result;
      if (category === 'temperature') {
        result = convertTemperature(value, from, to);
      } else {
        const group = UNIT_GROUPS[category];
        result = (value * group.base[from]) / group.base[to];
      }
      const rounded = parseFloat(result.toFixed(6));
      showResult(box, `${rounded.toLocaleString()} ${to}`, `${value} ${from} = ${rounded.toLocaleString()} ${to}`);
    });
  }

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