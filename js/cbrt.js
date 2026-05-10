/* ══════════════════════════════════════════
   VISUAL MATHEMATICS الجذر التكعيبي
   Incremental cube-root method
   Identity: (r+1)³ = r³ + 3r² + 3r + 1
   ⇒ (r+1)³ − r³ = 3r² + 3r + 1
   Start at the largest multiple of 10 below the root,
   then increment r by 1, subtracting (3r²+3r+1) each step.
══════════════════════════════════════════ */

let cbSteps = [];
let cbIdx   = 0;

function startCb() {
  const n = parseInt(document.getElementById('cb-n').value);
  if (!n || n < 1) return;
  cbSteps = buildCbSteps(n);
  cbIdx   = 0;
  renderCb();
  setNav('cb', cbSteps, cbIdx);
}

function navCb(d) {
  cbIdx = Math.max(0, Math.min(cbSteps.length - 1, cbIdx + d));
  renderCb();
  setNav('cb', cbSteps, cbIdx);
}

/* ── Algorithm ──────────────────────────── */
function buildCbSteps(N) {
  const steps = [];

  /* Step 0: introduce the identity */
  steps.push({
    phase  : 'identity',
    N,
    descAr : `نريد إيجاد ⁦∛${N}⁩. الفكرة: عند زيادة ضلع المكعّب من ر إلى ر+1، يزداد حجمه بالمقدار (ر+1)³ − ر³ = 3ر² + 3ر + 1. سنبدأ بأقرب مضاعف للعشرة من الأسفل، ثم نزيد الجذر واحداً كلّ مرّة، طارحين هذا المقدار من الباقي حتى يصل إلى صفر.`,
    descEn : `We want to find ∛${N}. Idea: when the side of a cube grows from r to r+1, the volume grows by (r+1)³ − r³ = 3r² + 3r + 1. We start at the nearest multiple of ten below the root, then raise r by one each step, subtracting that amount from the remainder until it reaches zero.`,
  });

  /* Step 1: locate the decade — the largest multiple of 10 m with m³ ≤ N */
  let r0 = 0;
  while ((r0 + 10) ** 3 <= N) r0 += 10;
  const r0Cube     = r0 ** 3;
  const r0NextCube = (r0 + 10) ** 3;

  steps.push({
    phase  : 'decade',
    N, r: r0, r0, r0Cube, r0NextCube,
    descAr : r0 === 0
      ? `نبحث عن أكبر مضاعف للعشرة م حيث م³ ≤ ${N}. هنا (10)³ = 1000 > ${N}، فنبدأ من ر = 0.`
      : `نبحث عن أكبر مضاعف للعشرة م حيث م³ ≤ ${N}. لدينا ${r0}³ = ${r0Cube} و ${r0+10}³ = ${r0NextCube}، فالجذر بين ${r0} و ${r0+10}. نبدأ من ر = ${r0}.`,
    descEn : r0 === 0
      ? `Find the largest multiple of ten m with m³ ≤ ${N}. Here (10)³ = 1000 > ${N}, so we start at r = 0.`
      : `Find the largest multiple of ten m with m³ ≤ ${N}. We have ${r0}³ = ${r0Cube} and ${r0+10}³ = ${r0NextCube}, so the root lies between ${r0} and ${r0+10}. Start at r = ${r0}.`,
  });

  /* Step 2: initial remainder */
  let r         = r0;
  let remainder = N - r0Cube;
  const history = [{ r: r0, rem: remainder, sub: null }];

  steps.push({
    phase  : 'rem-init',
    N, r, remainder, r0, r0Cube, history: [...history],
    descAr : `الباقي الابتدائي: ${N} − ${r0}³ = ${N} − ${r0Cube} = ${remainder}.`,
    descEn : `Initial remainder: ${N} − ${r0}³ = ${N} − ${r0Cube} = ${remainder}.`,
  });

  /* Step 3: iterate, incrementing r by 1 each time */
  let safety = 0;
  while (remainder > 0 && safety < 10000) {
    const inc = 3 * r * r + 3 * r + 1;
    if (inc > remainder) break;       /* would overshoot ⇒ floor reached */
    const newRem = remainder - inc;
    history.push({ r: r + 1, rem: newRem, sub: inc, from: r });

    steps.push({
      phase  : 'iter',
      N, r0, r0Cube,
      from   : r,
      to     : r + 1,
      sub    : inc,
      prevRem: remainder,
      remainder: newRem,
      history: [...history],
      descAr : `الانتقال من ${r} إلى ${r+1}: نطرح [3·${r}² + 3·${r} + 1] = ${inc}. ${remainder} − ${inc} = ${newRem}.`,
      descEn : `From ${r} to ${r+1}: subtract [3·${r}² + 3·${r} + 1] = ${inc}. ${remainder} − ${inc} = ${newRem}.`,
    });

    r         = r + 1;
    remainder = newRem;
    safety++;
  }

  /* Step 4: final */
  const exact = remainder === 0;
  steps.push({
    phase  : 'final',
    N, r0, r0Cube,
    finalRoot: r,
    remainder,
    exact,
    history: [...history],
    final  : true,
    descAr : exact
      ? `✓ توقّف الباقي عند الصفر بالضبط. إذاً ⁦∛${N} = ${r}⁩.`
      : `⌊⌋ لا يمكن طرح [3·${r}² + 3·${r} + 1] = ${3*r*r + 3*r + 1} من الباقي ${remainder}، إذاً ⁦∛${N} ≈ ${r}⁩ (الباقي ${remainder}).`,
    descEn : exact
      ? `✓ The remainder reached exactly zero, so ∛${N} = ${r}.`
      : `⌊⌋ Cannot subtract [3·${r}² + 3·${r} + 1] = ${3*r*r + 3*r + 1} from remainder ${remainder}, so ∛${N} ≈ ${r} (remainder ${remainder}).`,
  });

  return steps;
}

/* ── Renderer ───────────────────────────── */
function renderCb() {
  const s    = cbSteps[cbIdx];
  const isEn = currentLang === 'en';

  document.getElementById('cb-desc').textContent = isEn ? s.descEn : s.descAr;

  let h = '<div style="direction:ltr">';

  /* Identity banner — always shown */
  h += `<div class="cb-identity">
          <div class="cb-identity-title">${isEn ? 'Key identity' : 'الهوية الأساسية'}</div>
          <div class="cb-identity-eq">(r + 1)<sup>3</sup> &minus; r<sup>3</sup> = 3r<sup>2</sup> + 3r + 1</div>
        </div>`;

  /* Number + initial bounds (after the decade step) */
  if (s.phase !== 'identity') {
    h += '<div class="cb-bounds">';
    h += `<div class="cb-bounds-row"><span class="cb-bounds-label">N =</span><span class="cb-bounds-val">${s.N}</span></div>`;
    if (s.r0 !== undefined) {
      h += `<div class="cb-bounds-row"><span class="cb-bounds-label">${s.r0}<sup>3</sup> =</span><span class="cb-bounds-val">${s.r0Cube}</span></div>`;
      if (s.r0NextCube !== undefined)
        h += `<div class="cb-bounds-row"><span class="cb-bounds-label">${s.r0+10}<sup>3</sup> =</span><span class="cb-bounds-val">${s.r0NextCube}</span></div>`;
    }
    h += '</div>';
  }

  /* Working box for the iteration */
  if (s.phase === 'rem-init' || s.phase === 'iter' || s.phase === 'final') {
    h += '<div class="working-box">';

    if (s.phase === 'rem-init') {
      h += `<div>${isEn ? 'Initial remainder: ' : 'الباقي الابتدائي: '}
              <span class="wval" style="color:#5C3A7A">${s.N} &minus; ${s.r0Cube} = ${s.remainder}</span></div>`;
      h += `<div>${isEn ? 'Current root r = ' : 'الجذر الحالي ر = '}
              <span class="wval" style="color:#2B5070">${s.r}</span></div>`;
    } else if (s.phase === 'iter') {
      h += `<div>${isEn ? 'Step: ' : 'الخطوة: '}
              <span class="wval" style="color:#2B5070">${s.from} &rarr; ${s.to}</span></div>`;
      h += `<div>${isEn ? 'Increment 3r² + 3r + 1 = ' : 'الزيادة 3ر² + 3ر + 1 = '}
              <span class="wval" style="color:#8B5020">3·${s.from}² + 3·${s.from} + 1 = ${s.sub}</span></div>`;
      h += `<div>${isEn ? 'Remainder: ' : 'الباقي: '}
              <span class="wval" style="color:#5C3A7A">${s.prevRem} &minus; ${s.sub} = ${s.remainder}</span></div>`;
    } else if (s.phase === 'final') {
      h += `<div>${isEn ? 'Final root: ' : 'الجذر النهائي: '}
              <span class="wval" style="color:#2B5070">${s.finalRoot}</span></div>`;
      h += `<div>${isEn ? 'Final remainder: ' : 'الباقي النهائي: '}
              <span class="wval" style="color:#5C3A7A">${s.remainder}</span></div>`;
    }

    h += '</div>';
  }

  /* History timeline of (r, remainder) pairs */
  if (s.history && s.history.length) {
    h += `<div class="row-label" style="direction:${isEn ? 'ltr' : 'rtl'}">${isEn ? 'Progress: r and remainder' : 'سير الجذر والباقي'}</div>`;
    h += '<div class="cb-history">';
    s.history.forEach((row, i) => {
      if (i > 0 && row.sub != null) {
        h += `<div class="cb-hist-arrow">
                <div class="cb-hist-sub">&minus;${row.sub}</div>
                <div>&rarr;</div>
              </div>`;
      }
      const isLast = i === s.history.length - 1;
      const cls = 'cb-hist-cell' + (isLast ? ' cb-hist-active' : '');
      h += `<div class="${cls}">
              <div class="cb-hist-r">r = ${row.r}</div>
              <div class="cb-hist-rem">${isEn ? 'rem' : 'الباقي'} = ${row.rem}</div>
            </div>`;
    });
    h += '</div>';
  }

  /* Final result box */
  if (s.final) {
    const txt = isEn
      ? (s.exact
          ? `∛${s.N} = ${s.finalRoot}`
          : `∛${s.N} &approx; ${s.finalRoot} &nbsp; (remainder: ${s.remainder})`)
      : (s.exact
          ? `∛${s.N} = ${s.finalRoot}`
          : `∛${s.N} &approx; ${s.finalRoot} &nbsp; (الباقي: ${s.remainder})`);
    h += `<div class="result-box ${s.exact ? 'result-ok' : ''}" style="margin-top:16px;direction:ltr">
            <div class="result-text">${txt}</div>
          </div>`;
  }

  h += '</div>';
  document.getElementById('cb-viz').innerHTML = h;
}
