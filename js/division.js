/* ══════════════════════════════════════════
   VISUAL MATHEMATICS القسمة المطولة
   Al-Kashi Long Division  (مفتاح الحساب، الفصل الأول)
══════════════════════════════════════════ */

let divSteps = [];
let divIdx   = 0;

let _divRows          = [];
let _divDivRows       = [];
let _divN             = 0;
let _divDividend      = [];
let _divQuotientFinal = [];

const DIV_COLORS = ['#8B6030', '#2B5070', '#8B2020', '#8B5020', '#5C3A7A'];

function startDiv() {
  const a = parseInt(document.getElementById('div-a').value);
  const b = parseInt(document.getElementById('div-b').value);
  if (!a || !b || b === 0) return;
  divSteps = buildDivSteps(a, b);
  divIdx   = 0;
  renderDiv();
  setNav('div', divSteps, divIdx);
}

function navDiv(d) {
  divIdx = Math.max(0, Math.min(divSteps.length - 1, divIdx + d));
  renderDiv();
  setNav('div', divSteps, divIdx);
}

/* ── Algorithm ──────────────────────────── */
function buildDivSteps(A, B) {
  const aStr = String(A), bStr = String(B);
  const n = aStr.length, m = bStr.length;
  const dD = aStr.split('').map(Number);
  const dB = bStr.split('').map(Number);

  function place(value, rightCol) {
    const cells = new Array(n).fill(null);
    const s = String(value);
    for (let i = 0; i < s.length; i++) {
      const c = rightCol - s.length + 1 + i;
      if (c >= 0 && c < n) cells[c] = +s[i];
    }
    return cells;
  }

  const workRows = [];
  const divRows  = [];
  const qFinal   = new Array(n).fill(null);
  const wDig     = [...dD];
  const pvSnaps  = [];   /* partial dividend value at each offset, from running wDig */

  /* Al-Kashi: always start divisor at column 0.
     If partial dividend < divisor at this position, q=0 and we shift right. */
  let workColorIdx = 0;
  for (let off = 0; off <= n - m; off++) {
    const dc = new Array(n).fill(null);
    for (let j = 0; j < m; j++) dc[off + j] = dB[j];

    /* pv from running wDig correct for all rounds */
    let pv = 0;
    for (let i = 0; i <= off + m - 1; i++) pv = pv * 10 + wDig[i];
    pvSnaps.push(pv);

    const q = Math.min(9, Math.floor(pv / B));
    qFinal[off + m - 1] = q;

    if (q === 0) {
      divRows.push({ cells: dc, hasWork: false, workStart: workRows.length, color: null });
      continue;
    }

    const color = DIV_COLORS[workColorIdx % DIV_COLORS.length];
    workColorIdx++;
    const workStart = workRows.length;

    let running = 0;
    for (let i = 0; i < off; i++) running = running * 10 + wDig[i];

    for (let j = 0; j < m; j++) {
      const c = off + j;
      running = running * 10 + wDig[c];
      const prod   = q * dB[j];
      const result = running - prod;

      workRows.push({
        cells: place(prod, c),
        underline: true,
        color,
        descAr: `${q} × ${dB[j]} = ${prod}`,
        descEn: `${q} × ${dB[j]} = ${prod}`
      });
      workRows.push({
        cells: place(result, c),
        underline: false,
        color,
        descAr: `${running} − ${prod} = ${result}`,
        descEn: `${running} − ${prod} = ${result}`
      });

      running = result;
      const rs2 = String(running < 0 ? 0 : running);
      for (let ci = 0; ci <= c; ci++) wDig[ci] = 0;
      for (let p = 0; p < rs2.length; p++) {
        const tc = c - rs2.length + 1 + p;
        if (tc >= 0) wDig[tc] = +rs2[p];
      }
    }

    divRows.push({ cells: dc, hasWork: true, workStart, color });
  }

  const finalQ   = parseInt(qFinal.map(d => d ?? 0).join('')) || 0;
  const finalRem = parseInt(wDig.join(''))                     || 0;

  _divRows          = workRows;
  _divDivRows       = divRows;
  _divN             = n;
  _divDividend      = dD;
  _divQuotientFinal = qFinal;

  /* ── Build step list ── */
  const steps = [];
  const qRev  = new Array(n).fill(null);
  let wVis = 0, dVis = 0;

  /* Setup step: describe the initial divisor placement per Al-Kashi.
     The divisor is placed in the last row with its last digit (units) conceptually
     aligned under the first digit of the dividend; the grid starts at off=0. */
  steps.push({
    descAr: `نريد قسمة ${A} على ${B}. نرسم جدولاً بـ${n} عموداً. نضع المقسوم (${A}) في الصف الثاني. نضع المقسوم عليه (${B}) في الصف الأخير بحيث يقع آخر رقم منه (${bStr[m-1]}) تحت أول رقم من المقسوم (${aStr[0]})، فتمتد أرقامه الأخرى يساراً خارج الشبكة. نبدأ العمل من الموضع الأول الذي تستوعبه الشبكة.`,
    descEn: `We want to divide ${A} by ${B}. We draw a grid of ${n} columns. The dividend (${A}) goes in the second row. We place the divisor (${B}) in the last row so that its last digit (${bStr[m-1]}) aligns under the first digit of the dividend (${aStr[0]}); its other digits extend beyond the left edge. We begin from the first position that fits in the grid.`,
    wVis: 0, dVis: 1, quot: [...qRev], final: false
  });

  let ri = 0;
  for (let off = 0; off <= n - m; off++) {
    dVis++;
    const q  = qFinal[off + m - 1];
    const pv = pvSnaps[off];   /* use the snapshot captured during algorithm correct value */

    if (q === 0) {
      qRev[off + m - 1] = 0;
      steps.push({
        descAr: `القيمة الجارية عند هذا الموضع (${pv}) أصغر من ${B} رقم الخارج هنا = 0. ننقل المقسوم عليه خطوةً واحدة إلى اليمين.`,
        descEn: `The running value at this position (${pv}) is less than ${B} quotient digit here = 0. Shift the divisor one place to the right.`,
        wVis, dVis, quot: [...qRev], final: false
      });
      continue;
    }

    /* Write the quotient digit into qRev NOW so it appears in the first row
       on the announcement step and all subsequent multiplication steps. */
    qRev[off + m - 1] = q;

    /* Announce the found quotient digit before showing the multiplications */
    steps.push({
      descAr: `القيمة الجارية (${pv}) ÷ ${B}: أكبر عدد صحيح لا يتجاوز الناتج هو ${q}. نكتبه في الصف الأول عند موضع وحدات المقسوم عليه، ثم نبدأ الضرب.`,
      descEn: `Running value (${pv}) ÷ ${B}: the largest integer quotient digit is ${q}. Write ${q} in the first row at the units position of the divisor, then begin multiplying.`,
      wVis, dVis, quot: [...qRev], final: false
    });

    for (let j = 0; j < m; j++) {
      const pr = workRows[ri];
      const rs = workRows[ri + 1];
      ri += 2;

      /* Step 1 of 2: show the product row only */
      wVis += 1;
      steps.push({
        descAr: `${pr.descAr} نكتب الناتج في الجدول ونضع خطاً تحته.`,
        descEn: `${pr.descEn} write the product in the grid and underline it.`,
        wVis, dVis, quot: [...qRev], final: false, highlightRow: wVis - 1
      });

      /* Step 2 of 2: show the subtraction result below it */
      wVis += 1;
      steps.push({
        descAr: rs.descAr + (j === m - 1 ? ` ننتقل إلى الموضع التالي.` : ''),
        descEn: rs.descEn + (j === m - 1 ? ` move to the next position.` : ''),
        wVis, dVis, quot: [...qRev], final: false, highlightRow: wVis - 1
      });
    }
  }

  steps.push({
    descAr: `✓ انتهت القسمة. الخارج = ${finalQ} والباقي = ${finalRem}.`,
    descEn: `✓ Division complete. Quotient = ${finalQ}, Remainder = ${finalRem}.`,
    wVis: workRows.length, dVis: divRows.length,
    quot: [...qFinal], final: true, finalQ, finalR: finalRem
  });

  return steps;
}

/* ── Renderer ───────────────────────────── */
function renderDiv() {
  const s    = divSteps[divIdx];
  const n    = _divN || _divDividend.length || 1;
  const isEn = currentLang === 'en';

  document.getElementById('div-desc').textContent = isEn ? s.descEn : s.descAr;

  let h = `<div class="div-grid" style="direction:ltr">`;

  /* ── Quotient row (above the line) ── */
  h += `<div class="row-label" style="direction:${isEn ? 'ltr' : 'rtl'}">${t('quotientLabel')}</div>`;
  h += `<div class="grid-row">`;
  for (let i = 0; i < n; i++) {
    const q = s.quot ? s.quot[i] : null;
    h += `<div class="cell cell-q">${q !== null && q !== undefined ? q : ''}</div>`;
  }
  h += `</div>`;
  h += `<div class="h-rule" style="width:${n * 42}px"></div>`;

  /* ── Dividend row ── */
  h += `<div class="row-label" style="direction:${isEn ? 'ltr' : 'rtl'};margin-top:4px">${t('dividendLabel')}</div>`;
  h += `<div class="grid-row">`;
  for (let i = 0; i < n; i++) {
    h += `<div class="cell cell-d">${_divDividend[i] ?? ''}</div>`;
  }
  h += `</div>`;
  h += `<div class="h-rule" style="width:${n * 42}px;margin-top:2px"></div>`;

  /* ── Work rows keyed to divRow.workStart metadata ── */
  const dVisCount = s.dVis || 0;
  const visCount  = s.wVis || 0;
  let lastRenderedWork = -1;

  for (let r = 0; r < dVisCount; r++) {
    const divRow = _divDivRows[r];
    if (!divRow || !divRow.hasWork) continue;

    const color  = divRow.color;
    const wBase  = divRow.workStart;
    /* Each divisor application produces m digit-pairs (product row + remainder row) */
    const divM   = _divDivRows[r].cells.filter(c => c !== null).length;
    const wEnd   = Math.min(wBase + divM * 2, visCount);
    if (wEnd <= wBase) continue;

    if (lastRenderedWork >= 0)
      h += `<div class="h-rule" style="width:${n * 42}px;margin:3px 0;opacity:0.35"></div>`;

    for (let ri = wBase; ri < wEnd; ri++) {
      const row = _divRows[ri];
      if (!row) continue;
      const isHL = s.highlightRow === ri;
      const bb   = row.underline ? `border-bottom:2px solid ${color};padding-bottom:2px;` : '';
      h += `<div class="grid-row" style="${isHL ? 'background:rgba(139,96,48,0.10);border-radius:4px;' : ''}${bb}">`;
      for (let i = 0; i < n; i++) {
        const v  = row.cells[i];
        const cs = v !== null && v !== undefined ? `color:${color};` : '';
        h += `<div class="cell" style="font-size:19px;${cs}">${v !== null && v !== undefined ? v : ''}</div>`;
      }
      h += `</div>`;
    }
    lastRenderedWork = r;
  }

  /* ── Divisor at BOTTOM current sliding position, colour-matched ── */
  if (dVisCount > 0) {
    h += `<div class="h-rule" style="width:${n * 42}px;margin:8px 0 3px;opacity:0.45"></div>`;
    const curR   = dVisCount - 1;
    const curDiv = _divDivRows[curR];
    const curCol = curDiv.color || DIV_COLORS[0];
    const lbl    = isEn ? 'Divisor (current position)' : 'المقسوم عليه (الموضع الحالي)';
    h += `<div class="row-label" style="direction:${isEn ? 'ltr' : 'rtl'};opacity:0.65">${lbl}</div>`;
    h += `<div class="grid-row">`;
    for (let i = 0; i < n; i++) {
      const v = curDiv.cells[i];
      h += `<div class="cell" style="font-size:19px;`
         + `${v !== null && v !== undefined ? `color:${curCol};font-weight:bold;` : 'color:var(--faint);'}">`
         + `${v !== null && v !== undefined ? v : '·'}</div>`;
    }
    h += `</div>`;
  }

  /* ── Final result ── */
  if (s.final) {
    const A = document.getElementById('div-a').value;
    const B = document.getElementById('div-b').value;
    const resultText = isEn
      ? `${A} ÷ ${B} = ${s.finalQ}  |  Remainder: ${s.finalR}`
      : `${A} ÷ ${B} = ${s.finalQ} &nbsp;|&nbsp; الباقي: ${s.finalR}`;
    h += `<div class="result-box result-ok" style="margin-top:16px;direction:ltr">
      <div class="result-text">${resultText}</div>
    </div>`;
  }

  h += `</div>`;
  document.getElementById('div-viz').innerHTML = h;
}
