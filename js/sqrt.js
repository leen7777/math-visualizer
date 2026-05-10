/* ══════════════════════════════════════════
   VISUAL MATHEMATICS الجذر التربيعي
   Al-Kāshī Square Root — In-place tabular algorithm
     • Top: original number, with crossings-out replaced by subtraction results
     • Bottom: "lower number" that grows step-by-step (double then append new digit)
     • Root digits accumulate above the original number
══════════════════════════════════════════ */

let sqSteps = [];
let sqIdx   = 0;

function startSq() {
  const n = parseInt(document.getElementById('sq-n').value);
  if (!n || n < 1) return;
  sqSteps = buildSqSteps(n);
  sqIdx   = 0;
  renderSq();
  setNav('sq', sqSteps, sqIdx);
}

function navSq(d) {
  sqIdx = Math.max(0, Math.min(sqSteps.length - 1, sqIdx + d));
  renderSq();
  setNav('sq', sqSteps, sqIdx);
}

function buildSqSteps(N) {
  const steps   = [];
  const nStr    = String(N);
  const padded  = nStr.length % 2 === 1 ? '0' + nStr : nStr;
  const totalCols = padded.length;
  const numPairs  = totalCols / 2;
  const pairsDisp = [];
  for (let i = 0; i < numPairs; i++) pairsDisp.push(padded.substring(2*i, 2*i+2));

  // Live state arrays — mutated as the algorithm progresses
  let topCells    = [];   // each: {col, row, val, struck, active}
  let bottomCells = [];   // each: {col, row, val, struck, active}
  let rootDigits  = [];

  let topNextRow    = 1;  // row 0 holds the original number
  let bottomNextRow = 0;

  // Original number digits at row 0
  for (let c = 0; c < totalCols; c++) {
    topCells.push({ col: c, row: 0, val: padded[c], struck: false, active: false, kind: 'original' });
  }

  function snapshot(descAr, descEn) {
    // Deep-copy live cells so the snapshot freezes their state, then clear active flags on the live copy
    const tc = topCells.map(c => ({ ...c }));
    const bc = bottomCells.map(c => ({ ...c }));
    topCells.forEach(c => (c.active = false));
    bottomCells.forEach(c => (c.active = false));
    return {
      descAr, descEn,
      topCells: tc, bottomCells: bc,
      rootDigits: [...rootDigits],
      numPairs, totalCols, pairsDisp,
      final: false,
    };
  }

  function topAt(col) {
    // Latest live (non-struck) cell in column, ignoring subtrahend annotations
    let last = null;
    for (const c of topCells) {
      if (c.col === col && !c.struck && c.kind !== 'subtrahend') last = c;
    }
    return last;
  }

  function topValueThrough(col) {
    // Form the integer value from the latest non-struck top digits in cols [0..col]
    let s = '';
    for (let c = 0; c <= col; c++) {
      const cell = topAt(c);
      s += cell ? cell.val : '0';
    }
    return parseInt(s) || 0;
  }

  // ── Step 0: initial layout ────────────────────────────────────────
  steps.push(snapshot(
    `نريد إيجاد الجذر التربيعي لـ ${N}. نقسّم الأرقام إلى مجموعات من رقمين بدءاً من اليمين: ${pairsDisp.join(' | ')}. نرسم خطاً أفقياً فوقها وخطوطاً عمودية بين المجموعات.`,
    `Find √${N}. Split the digits into pairs from the right: ${pairsDisp.join(' | ')}. Draw a horizontal line above and vertical lines between the pair groups.`
  ));

  let currentBottom = [];   // [{col, val}] — digits of the active bottom number, left → right

  for (let i = 0; i < numPairs; i++) {
    const pairLeftCol  = 2 * i;
    const pairRightCol = 2 * i + 1;

    if (i === 0) {
      // ── A. Find d₀ such that d₀² ≤ pair[0] ────────────────────────
      const pv = parseInt(padded.substring(0, 2));
      let d = Math.floor(Math.sqrt(pv));
      while (d * d > pv) d--;

      rootDigits.push(d);

      // Place d at the bottom under the units of pair 0
      const bcell = { col: pairRightCol, row: bottomNextRow, val: String(d), struck: false, active: true };
      bottomCells.push(bcell);
      bottomNextRow++;
      currentBottom = [{ col: pairRightCol, val: d }];

      // Highlight the original pair-0 cells too
      topCells.filter(c => c.row === 0 && (c.col === pairLeftCol || c.col === pairRightCol)).forEach(c => (c.active = true));

      steps.push(snapshot(
        `نجد أكبر رقم آحاد ف بحيث ف² ≤ ${pv}. هنا ف = ${d} لأن ${d}² = ${d*d} ≤ ${pv}. نكتب ${d} فوق المجموعة الأولى وأيضاً تحت آحاد الـ${pv}.`,
        `Find the largest digit f with f² ≤ ${pv}. Here f = ${d} since ${d}² = ${d*d} ≤ ${pv}. Write ${d} above the first pair AND below the units of ${pv}.`
      ));

      // ── B. Multiply d×d, write 25 under 33 as subtrahend, then cross out and write result ──
      const product   = d * d;
      const remainder = pv - product;
      const remStr    = String(remainder).padStart(2, '0');
      const productStr = String(product).padStart(2, '0');

      // Subtrahend row: write 25 under 33
      const subtrahendRow = topNextRow;
      [pairLeftCol, pairRightCol].forEach((c, idx) => {
        topCells.push({ col: c, row: subtrahendRow, val: productStr[idx], struck: false, active: true, kind: 'subtrahend' });
      });
      topNextRow++;

      // Cross out the active original top cells in cols [pairLeftCol, pairRightCol]
      [pairLeftCol, pairRightCol].forEach(c => {
        const t = topAt(c);
        if (t) t.struck = true;
      });

      // Result row: write the remainder digits (skip leading zero unless it's the units col)
      const subRow = topNextRow;
      [pairLeftCol, pairRightCol].forEach((c, idx) => {
        const dig = remStr[idx];
        if (dig !== '0' || c === pairRightCol) {
          topCells.push({ col: c, row: subRow, val: dig, struck: false, active: true, kind: 'result' });
        }
      });
      topNextRow++;

      // Highlight the bottom d (we just used it for multiplication)
      bcell.active = true;

      steps.push(snapshot(
        `نضرب الـ${d} في الأعلى بالـ${d} في الأسفل = ${product}. نطرح من ${pv} في نفس العمود وما على يساره: ${pv} − ${product} = ${remainder}. نشطب ${pv} ونكتب ${remainder} تحته.`,
        `Multiply the top ${d} by the bottom ${d} = ${product}. Subtract from ${pv} (same column and to its left): ${pv} − ${product} = ${remainder}. Strike out ${pv} and write ${remainder} below.`
      ));

    } else {
      // ── C. Double-and-shift: top dᵢ₋₁ + bottom number, written one col right ──
      const lastD            = rootDigits[rootDigits.length - 1];
      const currentBottomInt = parseInt(currentBottom.map(x => x.val).join(''));
      const newBottomInt     = lastD + currentBottomInt;
      const newBottomStr     = String(newBottomInt);
      const oldUnitsCol      = currentBottom[currentBottom.length - 1].col;
      const newUnitsCol      = oldUnitsCol + 1;
      const newStartCol      = newUnitsCol - newBottomStr.length + 1;

      // Strike out the active bottom layer
      currentBottom.forEach(({ col }) => {
        const c = bottomCells.filter(x => x.col === col && !x.struck).pop();
        if (c) c.struck = true;
      });

      // Write new bottom digits, shifted one position to the right
      const newRow = bottomNextRow;
      const newDigits = [];
      for (let k = 0; k < newBottomStr.length; k++) {
        const col = newStartCol + k;
        bottomCells.push({ col, row: newRow, val: newBottomStr[k], struck: false, active: true });
        newDigits.push({ col, val: parseInt(newBottomStr[k]) });
      }
      bottomNextRow++;
      currentBottom = newDigits;

      // Also highlight the just-found root digit (it's the "top" being added)
      // The previous root digit is already shown above its pair — emphasize it briefly
      // (left without active because the cell was placed in a previous snapshot)

      steps.push(snapshot(
        `نجمع الـ${lastD} في الأعلى مع العدد السفلي ${currentBottomInt} = ${newBottomInt}. نكتب ${newBottomInt} فوق ${currentBottomInt} مع إزاحة خانة واحدة إلى اليمين، ونرسم خطاً فوق ${currentBottomInt} للدلالة على شطبه.`,
        `Add the top ${lastD} to the bottom ${currentBottomInt} = ${newBottomInt}. Write ${newBottomInt} above ${currentBottomInt} shifted one position to the right, and draw a strike through ${currentBottomInt}.`
      ));

      // ── D. Find dᵢ: largest f where f × (newBottom·10 + f) ≤ topValueThrough(pairRightCol) ──
      const topVal = topValueThrough(pairRightCol);
      let di = 0;
      for (let k = 9; k >= 0; k--) {
        if ((newBottomInt * 10 + k) * k <= topVal) { di = k; break; }
      }
      rootDigits.push(di);

      // Append dᵢ to the bottom (one col further right)
      const diCol = newUnitsCol + 1;
      bottomCells.push({ col: diCol, row: newRow, val: String(di), struck: false, active: true });
      currentBottom.push({ col: diCol, val: di });
      const lowerWithDi = newBottomInt * 10 + di;

      // Highlight the pair being processed
      topCells.filter(c => !c.struck && (c.col === pairLeftCol || c.col === pairRightCol)).forEach(c => (c.active = true));

      steps.push(snapshot(
        `نجد أكبر رقم آحاد ف بحيث ف × (${newBottomInt}0 + ف) ≤ ${topVal}. هنا ف = ${di} لأن ${di} × ${lowerWithDi} = ${di * lowerWithDi} ≤ ${topVal}. نكتب ${di} فوق المجموعة ${pairsDisp[i]} وأيضاً نلحقه بالعدد السفلي ليصبح ${lowerWithDi}.`,
        `Find the largest digit f with f × (${newBottomInt}0 + f) ≤ ${topVal}. Here f = ${di} because ${di} × ${lowerWithDi} = ${di * lowerWithDi} ≤ ${topVal}. Write ${di} above pair ${pairsDisp[i]} AND append it to the bottom number, making it ${lowerWithDi}.`
      ));

      // ── E. Multiply dᵢ × full lower, write subtrahend under the active value, then cross out and write result ──
      const fullProduct = di * lowerWithDi;
      const newRem      = topVal - fullProduct;
      const span        = pairRightCol + 1;     // number of cols from col 0 through pairRightCol
      const newRemStr   = String(newRem).padStart(span, '0');
      const productStr  = String(fullProduct);
      const productStartCol = pairRightCol - productStr.length + 1;

      // Subtrahend row: show the product (e.g., 749 below 817, or 6876 below 6881)
      const subtrahendRow = topNextRow;
      for (let k = 0; k < productStr.length; k++) {
        const col = productStartCol + k;
        topCells.push({ col, row: subtrahendRow, val: productStr[k], struck: false, active: true, kind: 'subtrahend' });
      }
      topNextRow++;

      // Strike out the active top cells in cols 0..pairRightCol
      for (let c = 0; c <= pairRightCol; c++) {
        const t = topAt(c);
        if (t) t.struck = true;
      }

      // Result row: write the new remainder digits (skip leading zeros except the rightmost col)
      const newSubRow = topNextRow;
      let seenNonZero = false;
      for (let k = 0; k < span; k++) {
        const dig = newRemStr[k];
        const col = k;
        if (dig !== '0') seenNonZero = true;
        if (seenNonZero || col === pairRightCol) {
          topCells.push({ col, row: newSubRow, val: dig, struck: false, active: true, kind: 'result' });
        }
      }
      topNextRow++;

      // Highlight the full active bottom (we just multiplied by it)
      currentBottom.forEach(({ col }) => {
        const bc = bottomCells.filter(x => x.col === col && !x.struck).pop();
        if (bc) bc.active = true;
      });

      steps.push(snapshot(
        `نضرب ${di} (في الأعلى) بـ${lowerWithDi} (في الأسفل) رقماً رقماً = ${fullProduct}. نطرح ${fullProduct} من ${topVal} = ${newRem}. نشطب ${topVal} ونكتب ${newRem} تحته.`,
        `Multiply ${di} (top) by ${lowerWithDi} (bottom) digit-by-digit = ${fullProduct}. Subtract ${fullProduct} from ${topVal} = ${newRem}. Strike out ${topVal} and write ${newRem} below.`
      ));
    }
  }

  // ── Final: integer-root summary ───────────────────────────────────
  const finalRoot = parseInt(rootDigits.join(''));
  // Compute the final remainder from the latest non-struck top cells
  let finalRem = 0;
  let started  = false;
  for (let c = 0; c < totalCols; c++) {
    const cell = topAt(c);
    const v = cell ? parseInt(cell.val) : 0;
    if (v !== 0) started = true;
    if (started) finalRem = finalRem * 10 + v;
  }

  const finalSnap = snapshot(
    `✓ الجذر التربيعي الصحيح للعدد ${N} هو ${finalRoot}، والباقي ${finalRem}. تحقق: ${finalRoot}² = ${finalRoot * finalRoot}.`,
    `✓ Integer part of √${N} is ${finalRoot}, with remainder ${finalRem}. Check: ${finalRoot}² = ${finalRoot * finalRoot}.`
  );
  finalSnap.final     = true;
  finalSnap.finalRoot = finalRoot;
  finalSnap.N         = N;
  finalSnap.remainder = finalRem;
  steps.push(finalSnap);

  // ── al-Kāshī's fractional refinement (only when remainder > 0) ────
  if (finalRem > 0) {
    const denom   = 2 * finalRoot + 1;
    const approx  = finalRoot + finalRem / denom;
    const trueVal = Math.sqrt(N);
    const k = snapshot(
      `✦ تقدير الكاشي للجزء الكسري: الباقي ÷ (2·الجذر + 1) = ${finalRem} ÷ ${denom}. إذن √${N} ≈ ${finalRoot} + ${finalRem}/${denom} ≈ ${approx.toFixed(6)} (القيمة الحقيقية ≈ ${trueVal.toFixed(6)}).`,
      `✦ Al-Kāshī's fractional refinement: remainder ÷ (2·root + 1) = ${finalRem} ÷ ${denom}. So √${N} ≈ ${finalRoot} + ${finalRem}/${denom} ≈ ${approx.toFixed(6)} (true value ≈ ${trueVal.toFixed(6)}).`
    );
    k.final     = true;
    k.finalRoot = finalRoot;
    k.N         = N;
    k.remainder = finalRem;
    k.kashi     = { numerator: finalRem, denom, approx, trueVal };
    steps.push(k);
  }

  return steps;
}

function renderSq() {
  const s    = sqSteps[sqIdx];
  const isEn = currentLang === 'en';

  document.getElementById('sq-desc').textContent = isEn ? s.descEn : s.descAr;

  const totalCols = s.totalCols;
  const numPairs  = s.numPairs;

  const maxTopRow    = s.topCells.reduce((m, c) => Math.max(m, c.row), 0);
  const maxBottomRow = s.bottomCells.reduce((m, c) => Math.max(m, c.row), 0);

  // Grid layout (1-indexed):
  //   row 1                        : root row (each digit spans 2 cols)
  //   rows 2 .. (2 + maxTopRow)    : top stack (row 0 of data → grid row 2; row k → grid row 2+k)
  //   row (3 + maxTopRow)          : separator (gap)
  //   rows (4 + maxTopRow) .. ...  : bottom stack
  const topGridStart    = 2;
  const sepRow          = topGridStart + maxTopRow + 1;
  const bottomGridStart = sepRow + 1;

  let h = `<div class="sq-tab"><div class="sq-grid" style="--cols:${totalCols}">`;

  // ── Root row: each root digit sits above its pair (2 cols wide) ──
  for (let i = 0; i < numPairs; i++) {
    const d = s.rootDigits[i];
    const startCol = 1 + 2 * i;
    h += `<div class="sq-rootcell" style="grid-row:1;grid-column:${startCol} / span 2">${d !== undefined ? d : ''}</div>`;
  }

  // ── Top stack: original number at row 0, then subtraction layers below ──
  for (const c of s.topCells) {
    let cls = 'sq-topcell';
    if (c.row === 0)            cls += ' sq-original';
    if (c.kind === 'subtrahend') cls += ' sq-subtrahend';
    if (c.struck)               cls += ' sq-struck';
    if (c.active)               cls += ' sq-active';
    // Pair-boundary right border (between pairs)
    if (c.row === 0 && c.col % 2 === 1 && c.col < totalCols - 1) cls += ' sq-pair-end';
    h += `<div class="${cls}" style="grid-row:${topGridStart + c.row};grid-column:${1 + c.col}">${c.val}</div>`;
  }

  // ── Bottom stack: lower-number layers (newest layer on TOP, older layers below) ──
  for (const c of s.bottomCells) {
    let cls = 'sq-bottomcell';
    if (c.struck) cls += ' sq-struck';
    if (c.active) cls += ' sq-active';
    const flippedRow = maxBottomRow - c.row;
    h += `<div class="${cls}" style="grid-row:${bottomGridStart + flippedRow};grid-column:${1 + c.col}">${c.val}</div>`;
  }

  h += '</div></div>'; // close sq-grid and sq-tab

  // ── Result/al-Kāshī box ──────────────────────────────────────────
  if (s.final) {
    if (s.kashi) {
      const k = s.kashi;
      const sub = isEn
        ? `≈ ${k.approx.toFixed(6)} &nbsp;·&nbsp; true value ≈ ${k.trueVal.toFixed(6)}`
        : `≈ ${k.approx.toFixed(6)} &nbsp;·&nbsp; القيمة الحقيقية ≈ ${k.trueVal.toFixed(6)}`;
      h += `<div class="result-box result-ok sq-kashi-box" style="margin-top:16px;direction:ltr">
        <div class="sq-kashi-formula">
          <span>√${s.N} &nbsp;≈&nbsp;</span>
          <span class="sq-kashi-int">${s.finalRoot}</span>
          <span class="sq-kashi-plus">+</span>
          <span class="sq-kashi-frac">
            <span class="sq-kashi-num">${k.numerator}</span>
            <span class="sq-kashi-bar"></span>
            <span class="sq-kashi-den">2·${s.finalRoot} + 1 = ${k.denom}</span>
          </span>
        </div>
        <div class="result-sub" style="margin-top:6px;font-size:14px;color:var(--muted)">${sub}</div>
      </div>`;
    } else {
      const txt = isEn
        ? `√${s.N} = ${s.finalRoot} &nbsp; (remainder: ${s.remainder})`
        : `√${s.N} = ${s.finalRoot} &nbsp; (الباقي: ${s.remainder})`;
      h += `<div class="result-box result-ok" style="margin-top:16px;direction:ltr">
        <div class="result-text">${txt}</div>
      </div>`;
    }
  }

  document.getElementById('sq-viz').innerHTML = h;
}
