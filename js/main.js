/* ══════════════════════════════════════════
   VISUAL MATHEMATICS Main Controller
   Tab switching · nav helper · math background
══════════════════════════════════════════ */

function switchTab(name, el) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('panel-' + name).classList.add('active');
  el.classList.add('active');
  if (name === 'facts' && typeof initFacts === 'function') initFacts();
}

function goToTab(name) {
  const btn = document.querySelector('[data-tab="' + name + '"]');
  if (btn) switchTab(name, btn);
}

function setNav(prefix, steps, idx) {
  document.getElementById(prefix + '-prev').disabled = idx === 0;
  document.getElementById(prefix + '-next').disabled = idx === steps.length - 1;
  document.getElementById(prefix + '-ctr').textContent =
    steps.length ? t('stepOf', idx + 1, steps.length) : '';
}

/* ── Math-symbol background overlay ───────────────────── */
function initMathBg() {
  // [x%, y%, symbol, fontSize, opacity]
  const syms = [
    [3,  6,  '∑', 36, 0.038], [16, 2,  'π', 22, 0.028], [30, 11, '√', 30, 0.034],
    [50, 5,  '∞', 24, 0.026], [66, 9,  '∫', 32, 0.030], [80, 3,  '±', 20, 0.025],
    [91, 14, 'Δ', 26, 0.032], [2,  24, '∂', 20, 0.026], [13, 31, 'θ', 24, 0.030],
    [27, 27, 'α', 20, 0.025], [42, 34, 'β', 22, 0.028], [56, 25, 'σ', 18, 0.024],
    [71, 29, 'φ', 26, 0.032], [85, 37, 'γ', 20, 0.025], [95, 27, 'λ', 22, 0.027],
    [6,  47, 'μ', 20, 0.025], [19, 54, 'ω', 24, 0.030], [34, 49, '∇', 28, 0.034],
    [49, 57, 'ε', 18, 0.024], [63, 47, 'ζ', 20, 0.026], [77, 54, 'η', 22, 0.028],
    [89, 49, '∀', 20, 0.025], [1,  67, '∃', 22, 0.027], [15, 71, '∈', 20, 0.025],
    [29, 64, '≈', 24, 0.030], [44, 74, '×', 22, 0.026], [59, 67, '÷', 20, 0.024],
    [73, 71, 'π', 26, 0.030], [87, 64, '√', 22, 0.026], [97, 74, '∑', 30, 0.032],
    [7,  84, '∫', 28, 0.030], [21, 89, 'Δ', 22, 0.026], [37, 87, 'θ', 20, 0.024],
    [53, 91, 'φ', 24, 0.028], [69, 84, 'α', 18, 0.022], [83, 89, 'β', 22, 0.026],
    [93, 87, '∞', 20, 0.024], [24, 17, '±', 18, 0.022], [59, 19, 'σ', 22, 0.026],
    [46, 42, '∂', 18, 0.020], [75, 43, 'γ', 20, 0.022], [8,  58, 'λ', 18, 0.022],
  ];

  const d = document.createElement('div');
  d.id = 'math-bg';
  syms.forEach(([x, y, s, sz, op]) => {
    const el = document.createElement('span');
    el.textContent = s;
    /* Dark brown watermark on parchment halve opacity for subtlety */
    el.style.cssText =
      `position:absolute;left:${x}%;top:${y}%;font-size:${sz}px;` +
      `opacity:${op * 0.55};color:#2B1B0E;font-family:Georgia,serif;user-select:none;` +
      `pointer-events:none;`;
    d.appendChild(el);
  });
  document.body.insertBefore(d, document.body.firstChild);
}

initMathBg();
