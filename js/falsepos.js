/* ══════════════════════════════════════════
   VISUAL MATHEMATICS حساب الخطأين
   Double False Position
   Solve:  a·x + b = c
   Given two guesses g1, g2 compute errors
   then apply the interpolation formula.
══════════════════════════════════════════ */

let fpSteps = [];
let fpIdx   = 0;

function startFp() {
  const a  = parseFloat(document.getElementById('fp-a').value);
  const b  = parseFloat(document.getElementById('fp-b').value);
  const c  = parseFloat(document.getElementById('fp-c').value);
  const g1 = parseFloat(document.getElementById('fp-g1').value);
  const g2 = parseFloat(document.getElementById('fp-g2').value);
  if (isNaN(a) || isNaN(b) || isNaN(c) || isNaN(g1) || isNaN(g2)) return;
  fpSteps = buildFpSteps(a, b, c, g1, g2);
  fpIdx   = 0;
  renderFp();
  setNav('fp', fpSteps, fpIdx);
}

function navFp(d) {
  fpIdx = Math.max(0, Math.min(fpSteps.length - 1, fpIdx + d));
  renderFp();
  setNav('fp', fpSteps, fpIdx);
}

/* ── round to reasonable decimal places ── */
function rnd(v, dec = 4) {
  return parseFloat(v.toFixed(dec));
}

/* ── Algorithm ──────────────────────────── */
function buildFpSteps(a, b, c, g1, g2) {
  const steps = [];

  /* Evaluate f(g) = a·g + b  and  error = f(g) - c */
  const f1  = rnd(a * g1 + b);
  const f2  = rnd(a * g2 + b);
  const e1  = rnd(f1 - c);
  const e2  = rnd(f2 - c);

  /* Double False Position formula */
  const denom = rnd(e2 - e1);
  const numer = rnd(g1 * e2 - g2 * e1);
  const exact = rnd(numer / denom);

  /* Verify */
  const check = rnd(a * exact + b);
  const isOk  = Math.abs(check - c) < 0.0001;

  /* ── Step 0: present the equation ── */
  steps.push({
    phase: 'intro',
    descAr: `نريد حل المعادلة: ${a}·س + ${b} = ${c}. لا نحلها جبرياً بل نستخدم طريقة الخطأين. نختار تخمينين: س = ${g1} وس = ${g2}، ثم نقيس الخطأ في كل تخمين.`,
    descEn: `We want to solve: ${a}·x + ${b} = ${c}. Instead of algebra, we use Double False Position. We pick two guesses: x = ${g1} and x = ${g2}, then measure the error for each.`,
    showG1: false, showG2: false, showFormula: false, showResult: false,
    a, b, c, g1, g2, f1, f2, e1, e2, denom, numer, exact, check, isOk
  });

  /* ── Step 1: evaluate first guess ── */
  steps.push({
    phase: 'g1',
    descAr: `التخمين الأول: س = ${g1}. نحسب: f(${g1}) = ${a}·${g1} + ${b} = ${f1}. الخطأ: ${f1} − ${c} = ${e1} ${e1 > 0 ? '(أكبر من الهدف)' : e1 < 0 ? '(أصغر من الهدف)' : '(تخمين صحيح!)'}`,
    descEn: `First guess: x = ${g1}. Compute: f(${g1}) = ${a}·${g1} + ${b} = ${f1}. Error: ${f1} − ${c} = ${e1} ${e1 > 0 ? '(above target)' : e1 < 0 ? '(below target)' : '(exact hit!)'}`,
    showG1: true, showG2: false, showFormula: false, showResult: false,
    a, b, c, g1, g2, f1, f2, e1, e2, denom, numer, exact, check, isOk
  });

  /* ── Step 2: evaluate second guess ── */
  steps.push({
    phase: 'g2',
    descAr: `التخمين الثاني: س = ${g2}. نحسب: f(${g2}) = ${a}·${g2} + ${b} = ${f2}. الخطأ: ${f2} − ${c} = ${e2} ${e2 > 0 ? '(أكبر من الهدف)' : e2 < 0 ? '(أصغر من الهدف)' : '(تخمين صحيح!)'}`,
    descEn: `Second guess: x = ${g2}. Compute: f(${g2}) = ${a}·${g2} + ${b} = ${f2}. Error: ${f2} − ${c} = ${e2} ${e2 > 0 ? '(above target)' : e2 < 0 ? '(below target)' : '(exact hit!)'}`,
    showG1: true, showG2: true, showFormula: false, showResult: false,
    a, b, c, g1, g2, f1, f2, e1, e2, denom, numer, exact, check, isOk
  });

  /* ── Step 3: apply formula ── */
  steps.push({
    phase: 'formula',
    descAr: `صيغة الخطأين:\n س = (${g1} × ${e2} − ${g2} × ${e1}) ÷ (${e2} − ${e1})\n   = ${numer} ÷ ${denom}\n   = ${exact}`,
    descEn: `Double False Position formula:\n x = (${g1} × ${e2} − ${g2} × ${e1}) ÷ (${e2} − ${e1})\n   = ${numer} ÷ ${denom}\n   = ${exact}`,
    showG1: true, showG2: true, showFormula: true, showResult: false,
    a, b, c, g1, g2, f1, f2, e1, e2, denom, numer, exact, check, isOk
  });

  /* ── Step 4: verify ── */
  steps.push({
    phase: 'verify',
    descAr: `تحقق: ${a}·${exact} + ${b} = ${check} ${isOk ? `= ${c} ✓` : `≠ ${c} (فارق التقريب)`}`,
    descEn: `Verify: ${a}·${exact} + ${b} = ${check} ${isOk ? `= ${c} ✓` : `≠ ${c} (rounding)`}`,
    showG1: true, showG2: true, showFormula: true, showResult: true,
    a, b, c, g1, g2, f1, f2, e1, e2, denom, numer, exact, check, isOk
  });

  return steps;
}

/* ── Renderer ───────────────────────────── */
function renderFp() {
  const s   = fpSteps[fpIdx];
  const isEn = currentLang === 'en';

  document.getElementById('fp-desc').textContent = isEn ? s.descEn : s.descAr;

  const { a, b, c, g1, g2, f1, f2, e1, e2, denom, numer, exact, check, isOk } = s;

  const errorClass = (e) => e > 0 ? 'positive' : e < 0 ? 'negative' : 'active';

  let h = '<div class="fp-layout">';

  /* Equation banner */
  h += `<div class="fp-equation">${a}·x + ${b} = ${c}</div>`;

  /* Guess boxes */
  if (s.showG1 || s.showG2) {
    h += '<div class="fp-row">';

    /* Guess 1 */
    h += `<div class="fp-box ${s.showG1 ? errorClass(e1) : ''}">`;
    h += `<div class="fp-box-title">${isEn ? 'Guess 1' : 'التخمين الأول'}</div>`;
    h += `<div class="fp-big">x = ${g1}</div>`;
    if (s.showG1) {
      h += `<div class="fp-small">f(${g1}) = ${f1}</div>`;
      h += `<div class="fp-small" style="color:${e1>0?'#8B2020':e1<0?'#2B5070':'#8B6030'}">`;
      h += `${isEn ? 'error' : 'الخطأ'} = ${e1}</div>`;
    }
    h += '</div>';

    h += '<div class="fp-arrow">→</div>';

    /* Guess 2 */
    h += `<div class="fp-box ${s.showG2 ? errorClass(e2) : ''}">`;
    h += `<div class="fp-box-title">${isEn ? 'Guess 2' : 'التخمين الثاني'}</div>`;
    h += `<div class="fp-big">x = ${g2}</div>`;
    if (s.showG2) {
      h += `<div class="fp-small">f(${g2}) = ${f2}</div>`;
      h += `<div class="fp-small" style="color:${e2>0?'#8B2020':e2<0?'#2B5070':'#8B6030'}">`;
      h += `${isEn ? 'error' : 'الخطأ'} = ${e2}</div>`;
    }
    h += '</div>';

    h += '</div>'; /* /fp-row */
  }

  /* Formula box */
  if (s.showFormula) {
    h += `<div class="fp-formula">`;
    h += isEn
      ? `x = (<span style="color:#8B6030">${g1}</span>·<span style="color:#8B2020">${e2}</span>
             &minus; <span style="color:#8B6030">${g2}</span>·<span style="color:#2B5070">${e1}</span>)
             &divide; (<span style="color:#8B2020">${e2}</span> &minus; <span style="color:#2B5070">${e1}</span>)<br>
           = <span style="color:#8B5020">${numer}</span>
             &divide; <span style="color:#8B5020">${denom}</span><br>
           = <span style="color:#2B1B0E;font-size:22px;font-weight:bold">${exact}</span>`
      : `س = (<span style="color:#8B6030">${g1}</span>·<span style="color:#8B2020">${e2}</span>
             &minus; <span style="color:#8B6030">${g2}</span>·<span style="color:#2B5070">${e1}</span>)
             &divide; (<span style="color:#8B2020">${e2}</span> &minus; <span style="color:#2B5070">${e1}</span>)<br>
           = <span style="color:#8B5020">${numer}</span>
             &divide; <span style="color:#8B5020">${denom}</span><br>
           = <span style="color:#2B1B0E;font-size:22px;font-weight:bold">${exact}</span>`;
    h += `</div>`;
  }

  /* Result verification */
  if (s.showResult) {
    h += `<div class="result-box ${isOk ? 'result-ok' : 'result-err'}">
      <div class="result-text">
        x = ${exact} &nbsp;|&nbsp; ${a}·${exact} + ${b} = ${check}
        ${isOk ? ' = ' + c + ' ✓' : ' ≈ ' + c}
      </div>
    </div>`;
  }

  h += '</div>'; /* /fp-layout */
  document.getElementById('fp-viz').innerHTML = h;
}
