/* ================================================================
     SHARED HELPERS — used across multiple calculator pages
     ================================================================ */

// Renders a result box from a headline + optional supporting detail lines.
// Used by every "simple tool" calculator (BMI, age, percentage, etc.)
function showResult(boxEl, headline, ...detailLines) {
  boxEl.innerHTML = `<div class="tool-result-big">${headline}</div>` +
    detailLines.map(line => `<div>${line}</div>`).join('');
  boxEl.classList.remove('hidden');
}

// Material-style click ripple from the exact pointer position.
// Used by the Basic and Scientific calculator keypads.
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
// Used by the Scientific calculator.
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