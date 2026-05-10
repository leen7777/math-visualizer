/* ══════════════════════════════════════════
   VISUAL MATHEMATICS الكسور العشرية
   Method of Abū al-Ḥasan al-Uqlīdisī (~952 CE)
   "al-Fuṣūl fī al-Ḥisāb al-Hindī"

   Two demonstrations from الفصل الأول علم الحساب العربي:
     1. تنصيف (halving)            divide by 2 K times
     2. ضرب بالعشر الزائد ×(1+1/10)  add a tenth K times
   Both naturally produce decimal fractions.
══════════════════════════════════════════ */

let dcSteps = [];
let dcIdx   = 0;

const DC_MAX_K = 12;

/* Format a decimal: trim trailing zeros, swap separator for Arabic mode. */
function dcFmt(n, isEn) {
  if (!isFinite(n)) return String(n);
  /* round-trip via toFixed to avoid 0.1+0.2 style noise */
  let s = (Math.round(n * 1e12) / 1e12).toString();
  if (s.includes('e')) s = n.toFixed(12).replace(/0+$/, '').replace(/\.$/, '');
  return isEn ? s : s.replace('.', '٫');
}

/* Right-align numbers by their decimal point.  Returns array of equal-length strings. */
function dcAlign(values) {
  const strs = values.map(v => {
    let s = (Math.round(v * 1e12) / 1e12).toString();
    if (s.includes('e')) s = v.toFixed(12);
    return s.replace(/0+$/, '').replace(/\.$/, '');
  });
  const fracs = strs.map(s => { const i = s.indexOf('.'); return i < 0 ? 0 : s.length - i - 1; });
  const maxF  = Math.max(...fracs);
  const padded = strs.map((s, i) => {
    if (maxF === 0) return s;
    if (s.indexOf('.') < 0) return s + '.' + '0'.repeat(maxF);
    return s + '0'.repeat(maxF - fracs[i]);
  });
  const ints = padded.map(s => { const i = s.indexOf('.'); return i < 0 ? s.length : i; });
  const maxI = Math.max(...ints);
  return padded.map((s, i) => ' '.repeat(maxI - ints[i]) + s);
}

function startDc() {
  const n  = parseFloat(document.getElementById('dc-n').value);
  const op = document.getElementById('dc-op').value;
  const k  = parseInt(document.getElementById('dc-k').value);
  if (!isFinite(n) || n === 0 || !k || k < 1 || k > DC_MAX_K) return;
  dcSteps = (op === 'halve') ? buildHalveSteps(n, k) : buildAddTenthSteps(n, k);
  dcIdx   = 0;
  renderDc();
  setNav('dc', dcSteps, dcIdx);
}

function navDc(d) {
  dcIdx = Math.max(0, Math.min(dcSteps.length - 1, dcIdx + d));
  renderDc();
  setNav('dc', dcSteps, dcIdx);
}

/* ── HALVING (تنصيف):  divide by 2 successively ───────── */
function buildHalveSteps(N, K) {
  const steps = [];
  const chain = [N];
  let v = N;
  for (let i = 0; i < K; i++) { v = v / 2; chain.push(v); }

  steps.push({
    op: 'halve', N, K, chain, idx: 0, phase: 'intro'
  });

  let cur = N;
  for (let i = 1; i <= K; i++) {
    const prev = cur;
    cur = cur / 2;
    steps.push({
      op: 'halve', N, K, chain, idx: i, phase: 'step',
      prev, cur, stepNum: i
    });
  }

  steps.push({
    op: 'halve', N, K, chain, idx: K, phase: 'final', cur
  });

  return steps;
}

/* ── ADD-A-TENTH (×(1+1/10) = ×11/10):  add a tenth successively ───── */
function buildAddTenthSteps(N, K) {
  const steps = [];
  const chain = [N];
  let v = N;
  for (let i = 0; i < K; i++) { v = v + v / 10; chain.push(v); }

  steps.push({
    op: 'addtenth', N, K, chain, idx: 0, phase: 'intro'
  });

  let cur = N;
  for (let i = 1; i <= K; i++) {
    const prev  = cur;
    const tenth = prev / 10;
    cur = prev + tenth;
    steps.push({
      op: 'addtenth', N, K, chain, idx: i, phase: 'step',
      prev, tenth, cur, stepNum: i
    });
  }

  steps.push({
    op: 'addtenth', N, K, chain, idx: K, phase: 'final', cur
  });

  return steps;
}

/* ── Renderer ───────────────────────────── */
function renderDc() {
  const s    = dcSteps[dcIdx];
  const isEn = currentLang === 'en';

  /* ── Step description ── */
  let descAr, descEn;
  if (s.phase === 'intro') {
    if (s.op === 'halve') {
      descAr = `سنحاكي طريقة الإقليدسي (~952م) في تنصيف العدد ${dcFmt(s.N,false)} ${s.K} مرّات. كل مرّة نقسّم على 2، فتنشأ الكسور العشرية تلقائيّاً عند تنصيف الأعداد الفردية. هذه أوّل أداة حسابية في التاريخ تُستعمل فيها الكسور العشرية بشكل منهجي.`;
      descEn = `We replay al-Uqlīdisī's method (~952 CE) for halving ${dcFmt(s.N,true)} ${s.K} times. Each step divides by 2, and decimal fractions arise naturally from halving odd numbers — the first systematic computational use of decimals in history.`;
    } else {
      descAr = `سنحاكي طريقة الإقليدسي في حساب (1 + 1/10) × العدد، أي إضافة عُشر العدد إليه مرّةً بعد مرّة. الإقليدسي يكتب العدد، ثم يكتب تحته نفس العدد مزاحاً خانةً واحدةً لليمين (وهو عُشره)، ثم يجمع الصفّين. سنطبّق هذا ${s.K} مرّات على العدد ${dcFmt(s.N,false)}.`;
      descEn = `We follow al-Uqlīdisī's method for computing (1 + 1/10) × N — i.e., adding one-tenth of the number to itself, repeatedly. He writes the number, then writes it again shifted one place to the right (which is its tenth), and sums the two rows. We apply this ${s.K} times to ${dcFmt(s.N,true)}.`;
    }
  } else if (s.phase === 'step') {
    if (s.op === 'halve') {
      descAr = `الخطوة ${s.stepNum}: ننصِّف ${dcFmt(s.prev,false)} ÷ 2 = ${dcFmt(s.cur,false)}.`;
      descEn = `Step ${s.stepNum}: halve ${dcFmt(s.prev,true)} ÷ 2 = ${dcFmt(s.cur,true)}.`;
    } else {
      descAr = `الخطوة ${s.stepNum}: (1 + 1/10) × ${dcFmt(s.prev,false)} = ${dcFmt(s.prev,false)} + ${dcFmt(s.tenth,false)} = ${dcFmt(s.cur,false)}.  وكصيغة كسرية: ${dcFmt(s.prev,false)} × 11/10 = ${dcFmt(s.cur,false)}.`;
      descEn = `Step ${s.stepNum}: (1 + 1/10) × ${dcFmt(s.prev,true)} = ${dcFmt(s.prev,true)} + ${dcFmt(s.tenth,true)} = ${dcFmt(s.cur,true)}.  As a fraction: ${dcFmt(s.prev,true)} × 11/10 = ${dcFmt(s.cur,true)}.`;
    }
  } else {
    /* final */
    if (s.op === 'halve') {
      descAr = `✓ تم. بعد ${s.K} عمليّات تنصيف، صار ${dcFmt(s.N,false)} = ${dcFmt(s.cur,false)}. هذه السلسلة هي ذاتها التي أوردها الإقليدسي في كتابه «الفصول في الحساب الهندي» لإثبات أنّ الكسور العشرية أداة طبيعية في الحساب.`;
      descEn = `✓ Done. After ${s.K} halvings, ${dcFmt(s.N,true)} = ${dcFmt(s.cur,true)}. This same chain appears in al-Uqlīdisī's "al-Fuṣūl fī al-Ḥisāb al-Hindī" as evidence that decimal fractions are a natural tool for arithmetic.`;
    } else {
      descAr = `✓ تم. بعد ${s.K} مضاعفات بالعشر الزائد، صار ${dcFmt(s.N,false)} = ${dcFmt(s.cur,false)}. أوضح الإقليدسي بهذا أنّ الكسور العشرية ليست للقسمة فحسب، بل للضرب الكسري كذلك.`;
      descEn = `✓ Done. After ${s.K} multiplications by (1+1/10), ${dcFmt(s.N,true)} = ${dcFmt(s.cur,true)}. al-Uqlīdisī used this to show decimals serve not only division but also fractional multiplication.`;
    }
  }
  document.getElementById('dc-desc').textContent = isEn ? descEn : descAr;

  /* ── Visualisation ── */
  let h = '<div class="dec-layout">';

  /* Chain visualization. Highlight the value reached so far (chain[idx]). */
  const arrowSym = s.op === 'halve' ? '÷ 2' : '× 11/10';
  h += '<div style="display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:10px;direction:ltr;margin-bottom:14px">';
  for (let i = 0; i < s.chain.length; i++) {
    if (i > 0) {
      const reached = i <= s.idx;
      const col = reached ? 'var(--gold-dark)' : 'var(--faint)';
      h += `<div style="display:flex;flex-direction:column;align-items:center;color:${col};font-family:'Courier Prime',monospace;font-size:11px">`;
      h += `<div style="font-size:18px;line-height:1">→</div>`;
      h += `<div style="margin-top:1px">${arrowSym}</div>`;
      h += `</div>`;
    }
    const reached = i <= s.idx;
    const isCur   = i === s.idx && s.phase !== 'intro' || (s.phase === 'intro' && i === 0);
    const bg     = reached ? 'var(--bg)' : 'var(--surface2)';
    const border = isCur ? 'var(--gold)' : (reached ? 'var(--border)' : 'var(--border-soft)');
    const color  = isCur ? 'var(--gold-dark)' : (reached ? 'var(--text)' : 'var(--faint)');
    const fs     = isCur ? '22px' : '17px';
    const fw     = isCur ? '700' : (reached ? '600' : '400');
    h += `<div style="background:${bg};border:1.5px solid ${border};border-radius:8px;`
       + `padding:${isCur ? '10px 16px' : '7px 12px'};font-family:'Courier Prime',monospace;`
       + `font-size:${fs};font-weight:${fw};color:${color};transition:all .2s">${dcFmt(s.chain[i], isEn)}</div>`;
  }
  h += '</div>';

  /* Per-step detail box */
  if (s.phase === 'step') {
    if (s.op === 'halve') {
      const aligned = dcAlign([s.prev, s.cur]);
      h += `<div style="display:flex;justify-content:center;margin-top:8px">`;
      h += `<div style="background:var(--surface);border:1px solid var(--border-soft);border-radius:10px;`
         + `padding:14px 22px;font-family:'Courier Prime',monospace;font-size:20px;direction:ltr;text-align:center;`
         + `box-shadow:var(--shadow-sm);min-width:220px">`;
      h += `<div style="color:var(--text)">${dcFmt(s.prev, isEn)} <span style="color:var(--muted)">÷ 2</span> = `
         + `<span style="color:var(--gold-dark);font-weight:700">${dcFmt(s.cur, isEn)}</span></div>`;
      h += `</div></div>`;
    } else {
      /* Show al-Uqlīdisī's columnar addition: number, number/10 shifted right, sum */
      const aligned = dcAlign([s.prev, s.tenth, s.cur]);
      const width   = aligned[0].length;
      h += `<div style="display:flex;justify-content:center;margin-top:8px">`;
      h += `<div style="background:var(--surface);border:1px solid var(--border-soft);border-radius:10px;`
         + `padding:14px 26px;font-family:'Courier Prime',monospace;font-size:18px;direction:ltr;`
         + `box-shadow:var(--shadow-sm)">`;
      h += `<pre style="margin:0;font-family:inherit;font-size:inherit;line-height:1.5;color:var(--text)">`;
      h += `${aligned[0].replace(/ /g, '&nbsp;')}<br>`;
      h += `+ ${aligned[1].replace(/ /g, '&nbsp;')}<br>`;
      h += `<span style="border-top:1.5px solid var(--gold);display:inline-block;padding-top:2px">`
         + `${'&nbsp;&nbsp;' + aligned[2].replace(/ /g, '&nbsp;')}</span><br>`;
      h += `</pre>`;
      h += `<div style="font-size:11px;color:var(--muted);margin-top:8px;text-align:center;font-family:Amiri,serif;font-style:italic">`;
      h += isEn
        ? `Write the number, then beneath it the same number shifted one place right (= its tenth). Sum the two rows.`
        : `الإقليدسي: نكتب العدد، ثم نكتب تحته نفس العدد مزاحاً خانةً لليمين (= عُشره)، ثم نجمع الصفّين.`;
      h += `</div>`;
      h += `</div></div>`;
    }
  }

  /* Final result box */
  if (s.phase === 'final') {
    const opLabel = s.op === 'halve' ? '÷ 2' : '× (1 + 1/10)';
    const txt = isEn
      ? `start: ${dcFmt(s.N, true)} → after ${s.K}× (${opLabel}) → result: ${dcFmt(s.cur, true)}`
      : `البداية: ${dcFmt(s.N, false)} ← بعد ${s.K} مرّات (${opLabel}) ← النتيجة: ${dcFmt(s.cur, false)}`;
    h += `<div class="result-box result-ok" style="margin-top:14px;direction:ltr;text-align:center">`;
    h += `<div class="result-text">${txt}</div></div>`;
  }

  /* Historical note on intro step only */
  if (s.phase === 'intro') {
    h += `<div class="dec-hist-box" style="margin-top:14px">`;
    h += isEn
      ? `<span style="color:var(--gold-dark)">★ Source:</span> Abū al-Ḥasan al-Uqlīdisī, <em>al-Fuṣūl fī al-Ḥisāb al-Hindī</em> (~952–953 CE). The first systematic use of decimal fractions as a computational tool. al-Samaw'al (1172) gave the theoretical foundation; al-Kashi (15th c.) standardized the modern form.`
      : `<span style="color:var(--gold-dark)">★ المصدر:</span> أبو الحسن الإقليدسي، <em>الفصول في الحساب الهندي</em> (~952-953م). أوّل استخدام منهجي للكسر العشري كأداة حسابية. السموأل (1172م) وضع لها الإطار النظري؛ الكاشي (القرن 15م) أوصلها إلى صورتها الحديثة.`;
    h += `</div>`;
  }

  h += '</div>';
  document.getElementById('dc-viz').innerHTML = h;
}
