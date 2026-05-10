/* ══════════════════════════════════════════
   VISUAL MATHEMATICS الضرب المطول بالشبكة
   Al-Kashi Islamic Lattice Multiplication
══════════════════════════════════════════ */

let mulSteps = [];
let mulIdx   = 0;

function startMul() {
  const a = parseInt(document.getElementById('mul-a').value);
  const b = parseInt(document.getElementById('mul-b').value);
  if (!a || !b || a < 1 || b < 1) return;
  mulSteps = buildMulSteps(a, b);
  mulIdx   = 0;
  renderMul();
  setNav('mul', mulSteps, mulIdx);
}

function navMul(d) {
  mulIdx = Math.max(0, Math.min(mulSteps.length - 1, mulIdx + d));
  renderMul();
  setNav('mul', mulSteps, mulIdx);
}

/* ── Algorithm ──────────────────────────── */
function buildMulSteps(A, B) {
  const digA = String(A).split('').map(Number);           // columns (top)
  const digB = String(B).split('').reverse().map(Number); // rows (right side), units first
  const N = digA.length;   // columns
  const M = digB.length;   // rows

  /* Build cell products */
  const cells = [];
  for (let i = 0; i < M; i++) {
    cells[i] = [];
    for (let j = 0; j < N; j++) {
      const prod  = digA[j] * digB[i];
      cells[i][j] = { tens: Math.floor(prod / 10), units: prod % 10, prod };
    }
  }

  /* Diagonal sums
     units of cell(i,j) → position p = (M-1-i)+(N-1-j) from right
     tens  of cell(i,j) → position p+1                             */
  const maxP    = N + M;
  const rawSums = new Array(maxP + 2).fill(0);
  for (let i = 0; i < M; i++)
    for (let j = 0; j < N; j++) {
      const p = i + (N - 1 - j);          /* units-first row order */
      rawSums[p]     += cells[i][j].units;
      rawSums[p + 1] += cells[i][j].tens;
    }

  /* Apply carries, build per-diagonal data */
  const diagData = [];
  let carry = 0;
  for (let p = 0; p <= maxP; p++) {
    const total = rawSums[p] + carry;
    diagData.push({ p, rawSum: rawSums[p], carryIn: carry, total, digit: total % 10 });
    carry = Math.floor(total / 10);
  }
  if (carry > 0)
    diagData.push({ p: maxP + 1, rawSum: 0, carryIn: carry, total: carry, digit: carry });

  /* Reconstruct result string from diagData (position 0 = rightmost) */
  const resultArr = diagData.map(d => d.digit).reverse();
  const result    = parseInt(resultArr.join('').replace(/^0+/, '') || '0');

  const steps = [];

  /* Step 0 – setup */
  steps.push({
    phase: 'intro', filledCount: 0, diagStep: -1, resultSoFar: [],
    descAr: `نريد ضرب ${A} × ${B} بطريقة الشبكة الإسلامية. نبني شبكة ${N}×${M}: أرقام ${A} أعلى الأعمدة وأرقام ${B} على يسار الصفوف. كل خلية تحوي حاصل ضرب رقمين، مقسّماً بخط قُطري.`,
    descEn: `We want to multiply ${A} × ${B} using the Islamic lattice method. We build a ${N}×${M} grid: digits of ${A} across the top, digits of ${B} down the left side. Each cell holds the product of two digits, split by a diagonal line.`,
    cells, N, M, digA, digB, diagData, result
  });

  /* Steps – fill cells row by row */
  for (let k = 0; k < N * M; k++) {
    const i  = Math.floor(k / N), j = k % N;
    const c  = cells[i][j];
    steps.push({
      phase: 'fill', filledCount: k + 1, activeCell: [i, j], diagStep: -1, resultSoFar: [],
      descAr: `الصف ${i+1} × العمود ${j+1}: ${digB[i]} × ${digA[j]} = ${String(c.prod).padStart(2,'0')} → نكتب ${c.tens} في المثلث الأيسر (عشرات) و${c.units} في المثلث الأيمن (آحاد).`,
      descEn: `Row ${i+1} × Column ${j+1}: ${digB[i]} × ${digA[j]} = ${String(c.prod).padStart(2,'0')} → write ${c.tens} in the left triangle (tens) and ${c.units} in the right triangle (units).`,
      cells, N, M, digA, digB, diagData, result
    });
  }

  /* Steps – sum each diagonal */
  const accResult = [];
  for (const ds of diagData) {
    if (ds.rawSum === 0 && ds.carryIn === 0) continue;
    accResult.unshift(ds.digit);

    /* Collect individual digit contributions in reading order (i asc, j asc):
       - units of cell(i,j) if pc === ds.p
       - tens  of cell(i,j) if pc === ds.p - 1
       Skip zero values so the sum stays clean.                             */
    const contribs = [];
    for (let i = 0; i < M; i++)
      for (let j = 0; j < N; j++) {
        const pc = i + (N - 1 - j);
        if (pc === ds.p     && cells[i][j].units !== 0) contribs.push(cells[i][j].units);
        if (pc === ds.p - 1 && cells[i][j].tens  !== 0) contribs.push(cells[i][j].tens);
      }
    if (ds.carryIn > 0) contribs.push(ds.carryIn);   /* carry always last */

    const contribStr = contribs.length > 0 ? contribs.join(' + ') : String(ds.rawSum);
    const showEq     = contribs.length > 1;
    const eqPart     = showEq ? ` = ${ds.total}` : '';
    const newCarry   = Math.floor(ds.total / 10);

    steps.push({
      phase: 'diag', filledCount: N * M, diagStep: ds.p, resultSoFar: [...accResult],
      descAr: `القطر ${ds.p + 1}: ${contribStr}${eqPart} → رقم الناتج: ${ds.digit}${newCarry > 0 ? `، يُحمل: ${newCarry}` : ''}`,
      descEn: `Diagonal ${ds.p + 1}: ${contribStr}${eqPart} → result digit: ${ds.digit}${newCarry > 0 ? `, carry: ${newCarry}` : ''}`,
      cells, N, M, digA, digB, diagData, result
    });
  }

  /* Final step */
  steps.push({
    phase: 'final', filledCount: N * M, diagStep: -2, resultSoFar: resultArr,
    descAr: `✓ ${A} × ${B} = ${result}. تحقق: ${A} × ${B} = ${A * B}`,
    descEn: `✓ ${A} × ${B} = ${result}. Check: ${A} × ${B} = ${A * B}`,
    cells, N, M, digA, digB, diagData, result, isOk: result === A * B
  });

  return steps;
}

/* ── Renderer (SVG-based lattice) ───────── */
function renderMul() {
  const s  = mulSteps[mulIdx];
  const en = currentLang === 'en';
  document.getElementById('mul-desc').textContent = en ? s.descEn : s.descAr;

  const { cells, N, M, digA, digB, diagData, result } = s;

  const CS      = 54;   /* cell size */
  const PAD_L   = 62;   /* left margin room for B-digit labels + result digits */
  const PAD_T   = 38;   /* top margin (A-digit labels) */
  const PAD_R   = 22;   /* right margin */
  const PAD_B   = 56;   /* bottom margin (result row) */
  const W       = PAD_L + N * CS + PAD_R;
  const H       = PAD_T + M * CS + PAD_B;

  let svg = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" `
          + `style="max-width:${Math.min(W, 640)}px;display:block;overflow:visible">`;

  /* A digits along top */
  for (let j = 0; j < N; j++) {
    const cx = PAD_L + j * CS + CS / 2;
    svg += `<text x="${cx}" y="${PAD_T - 10}" text-anchor="middle" `
         + `font-size="20" font-weight="bold" fill="#8B2020" font-family="'Courier New',monospace">${digA[j]}</text>`;
  }

  /* B digits along LEFT side (between result-digit zone and grid) */
  for (let i = 0; i < M; i++) {
    const cy = PAD_T + i * CS + CS / 2 + 7;
    svg += `<text x="${PAD_L - 16}" y="${cy}" text-anchor="middle" `
         + `font-size="20" font-weight="bold" fill="#8B6030" font-family="'Courier New',monospace">${digB[i]}</text>`;
  }

  /* Column dividers (extended above grid for style) */
  for (let j = 0; j <= N; j++) {
    const x = PAD_L + j * CS;
    svg += `<line x1="${x}" y1="${PAD_T - 6}" x2="${x}" y2="${PAD_T + M * CS}" `
         + `stroke="#C2A46D" stroke-width="1"/>`;
  }

  /* Row dividers */
  for (let i = 0; i <= M; i++) {
    const y = PAD_T + i * CS;
    svg += `<line x1="${PAD_L}" y1="${y}" x2="${PAD_L + N * CS}" y2="${y}" `
         + `stroke="#C2A46D" stroke-width="1"/>`;
  }

  /* Triangle highlights for active diagStep.
     "\" diagonal splits each cell into:
       upper-RIGHT (TL,TR,BR) → holds the UNITS digit → highlighted when pc === diagStep
       lower-LEFT  (TL,BL,BR) → holds the TENS  digit → highlighted when pc === diagStep-1 */
  if (s.diagStep >= 0) {
    for (let i = 0; i < M; i++)
      for (let j = 0; j < N; j++) {
        const pc = i + (N - 1 - j);
        const cx = PAD_L + j * CS, cy = PAD_T + i * CS;
        if (pc === s.diagStep) {
          /* Units contributor → upper-RIGHT triangle */
          svg += `<polygon points="${cx},${cy} ${cx + CS},${cy} ${cx + CS},${cy + CS}" `
               + `fill="rgba(139,32,32,0.28)"/>`;
        }
        if (pc === s.diagStep - 1) {
          /* Tens contributor → lower-LEFT triangle */
          svg += `<polygon points="${cx},${cy} ${cx},${cy + CS} ${cx + CS},${cy + CS}" `
               + `fill="rgba(43,80,112,0.25)"/>`;
        }
      }
  }

  /* Cell contents */
  for (let i = 0; i < M; i++)
    for (let j = 0; j < N; j++) {
      const cx   = PAD_L + j * CS, cy = PAD_T + i * CS;
      const kNum = i * N + j;
      const isFilled = kNum < s.filledCount;
      const isActive = s.activeCell && s.activeCell[0] === i && s.activeCell[1] === j;

      /* Active-cell glow */
      if (isActive) {
        svg += `<rect x="${cx + 1}" y="${cy + 1}" width="${CS - 2}" height="${CS - 2}" `
             + `fill="rgba(139,32,32,0.28)" rx="2"/>`;
      }

      /* Diagonal line (top-left → bottom-right, "\" shape matches reference) */
      svg += `<line x1="${cx}" y1="${cy}" x2="${cx + CS}" y2="${cy + CS}" `
           + `stroke="${isFilled ? '#C2A46D' : '#DCC99A'}" stroke-width="1.2"/>`;

      if (isFilled) {
        const c = cells[i][j];
        /* Tens lower-LEFT triangle (left digit, read first left-to-right) */
        svg += `<text x="${cx + CS * 0.27}" y="${cy + CS * 0.78}" text-anchor="middle" `
             + `font-size="15" font-weight="bold" fill="#2B5070" font-family="'Courier New',monospace">${c.tens}</text>`;
        /* Units upper-RIGHT triangle (right digit, read second left-to-right) */
        svg += `<text x="${cx + CS * 0.73}" y="${cy + CS * 0.34}" text-anchor="middle" `
             + `font-size="15" font-weight="bold" fill="#2B1B0E" font-family="'Courier New',monospace">${c.units}</text>`;
      }
    }

  /* Outer grid border */
  svg += `<rect x="${PAD_L}" y="${PAD_T}" width="${N * CS}" height="${M * CS}" `
       + `fill="none" stroke="#8B2020" stroke-width="1.5"/>`;

  /* Running result label centre-bottom (digits revealed as diagonals are summed).
     Per-digit overlays around the grid edges are intentionally omitted —
     the description above the grid already shows each diagonal sum and carry. */
  if (s.resultSoFar && s.resultSoFar.length > 0 &&
      (s.phase === 'final' || s.phase === 'diag')) {
    const bOrig   = digB.slice().reverse().join('');
    const fullStr = String(result);
    let labelResult;
    if (s.phase === 'final') {
      labelResult = fullStr;
    } else {
      const nRevealed = s.resultSoFar.length;
      const blanks    = Math.max(0, fullStr.length - nRevealed);
      const shown     = fullStr.slice(-Math.min(nRevealed, fullStr.length));
      labelResult = '_'.repeat(blanks) + shown;
    }
    svg += `<text x="${W / 2}" y="${H - 8}" text-anchor="middle" font-size="14" `
         + `fill="#7A6045" font-family="'Courier New',monospace">`
         + `${digA.join('')} × ${bOrig} = ${labelResult}</text>`;
  }

  svg += '</svg>';

  let h = `<div class="lat-wrap">${svg}</div>`;

  if (s.phase === 'final') {
    const bOrig = digB.slice().reverse().join('');
    h += `<div class="result-box result-ok" style="margin-top:14px;direction:ltr">
      <div class="result-text">${digA.join('')} × ${bOrig} = ${result}</div>
    </div>`;
  }

  document.getElementById('mul-viz').innerHTML = h;
}
