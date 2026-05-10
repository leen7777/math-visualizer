/* ════════════════════════════════════════════
   VISUAL MATHEMATICS Pascal-Precursor Triangle
   مثلث الكَرَجي والسموأل (~القرن 11-12م)
   Tabulated binomial coefficients ~600 years
   before Pascal's "Traité du triangle" (1665).
════════════════════════════════════════════ */

let krSteps = [], krIdx = 0;

function startKr() {
  let R = parseInt(document.getElementById('kr-n').value, 10);
  if (isNaN(R)) R = 8;
  R = Math.max(3, Math.min(12, R));
  krSteps = buildKrSteps(R);
  krIdx = 0;
  renderKr();
  setNav('kr', krSteps, krIdx);
}

function navKr(dir) {
  krIdx = Math.max(0, Math.min(krSteps.length - 1, krIdx + dir));
  renderKr();
  setNav('kr', krSteps, krIdx);
}

function renderKr() {
  if (!krSteps.length) return;
  const s = krSteps[krIdx];
  const isEn = currentLang === 'en';
  document.getElementById('kr-desc').textContent = isEn ? s.descEn : s.descAr;
  document.getElementById('kr-viz').innerHTML = s.svg;
}

/* Compute full triangle: rows 0 .. R-1 */
function krCompute(R) {
  const T = [[1]];
  for (let r = 1; r < R; r++) {
    const row = [1];
    for (let k = 1; k < r; k++) row.push(T[r-1][k-1] + T[r-1][k]);
    row.push(1);
    T.push(row);
  }
  return T;
}

function buildKrSteps(R) {
  const T = krCompute(R);
  const n = R - 1;
  const steps = [];

  /* ── Step 0: Intro ── */
  steps.push({
    descAr: `قبل باسكال بنحو ستة قرون، رتّب الكَرَجي (نحو 1000م) ثم السموأل (نحو 1150م) معاملات (س + ص) مرفوعةً لقوًى في مثلث عددي. القاعدة: كل عدد في الداخل هو مجموع العددين الواقعَين فوقه مباشرة، والطرفان دائماً 1. سنبني المثلث صفّاً صفّاً حتى الصف ${n}.`,
    descEn: `About six centuries before Pascal, al-Karajī (~1000 CE) and al-Samawʾal (~1150 CE) tabulated the coefficients of (x + y) raised to integer powers in a number triangle. The rule: every interior entry is the sum of the two entries directly above it, and the two ends of each row are always 1. We'll build the triangle row by row up to row ${n}.`,
    svg: krSvg(T, R, 0, null, null)
  });

  /* ── Steps 1..n: reveal each row with parents highlighted ── */
  for (let r = 1; r <= n; r++) {
    const row = T[r];
    const eqs = [];
    for (let k = 1; k < r; k++) {
      eqs.push(`${T[r-1][k-1]} + ${T[r-1][k]} = ${T[r][k]}`);
    }
    let descAr, descEn;
    if (r === 1) {
      descAr = `الصف 1: نضع 1 على كلا الطرفين. لا توجد خانات داخلية بعد، فالصف هو [1، 1].`;
      descEn = `Row 1: place 1 at each end. No interior cells yet, so the row is [1, 1].`;
    } else {
      const showRowAr = row.join('، ');
      const showRowEn = row.join(', ');
      const eqAr = eqs.join('، ');
      const eqEn = eqs.join(', ');
      descAr = `الصف ${r}: نضع 1 على الطرفين، ولكل خانة داخلية نجمع الخانتين الواقعتين فوقها. ${eqAr}. النتيجة: [${showRowAr}].`;
      descEn = `Row ${r}: place 1 at each end; for every interior cell, add the two cells directly above it. ${eqEn}. Resulting row: [${showRowEn}].`;
    }
    steps.push({ descAr, descEn, svg: krSvg(T, R, r, r, null) });
  }

  /* ── Final step: row sums + binomial expansion of last row ── */
  const rowSums = T.map(row => row.reduce((a, b) => a + b, 0));
  const lastRow = T[n];
  const expansion = lastRow.map((c, k) => {
    const px = n - k, py = k;
    let term = '';
    if (c !== 1 || (px === 0 && py === 0)) term += c;
    if (px > 0) term += px === 1 ? 'x' : `x^${px}`;
    if (py > 0) term += py === 1 ? 'y' : `y^${py}`;
    return term || '1';
  }).join(' + ');
  const expansionAr = lastRow.map((c, k) => {
    const px = n - k, py = k;
    let term = '';
    if (c !== 1 || (px === 0 && py === 0)) term += c;
    if (px > 0) term += px === 1 ? 'س' : `س^${px}`;
    if (py > 0) term += py === 1 ? 'ص' : `ص^${py}`;
    return term || '1';
  }).join(' + ');
  const sumsListAr = rowSums.map((s, i) => `2^${i} = ${s}`).join('، ');
  const sumsListEn = rowSums.map((s, i) => `2^${i} = ${s}`).join(', ');

  steps.push({
    descAr: `كل صف يعطي معاملات (س + ص) مرفوعةً لرتبته. الصف ${n} هو معاملات (س + ص)^${n} = ${expansionAr}. ولاحظ أن مجموع كل صف يساوي قوّة من قوى 2: ${sumsListAr}. هذه الخصائص كلها كانت معروفة عند الكَرَجي والسموأل قبل باسكال بستة قرون.`,
    descEn: `Each row holds the coefficients of a binomial power. Row ${n} = coefficients of (x + y)^${n} = ${expansion}. And every row sums to a power of two: ${sumsListEn}. All these properties were known to al-Karajī and al-Samawʾal six centuries before Pascal.`,
    svg: krSvg(T, R, n, null, 'sums')
  });

  return steps;
}

/* ── SVG renderer ────────────────────────────
   T          : full triangle (R rows)
   R          : total rows
   visibleTo  : highest row index to render
   highlight  : row index drawn as the "active" new row (or null)
   mode       : null | 'sums' to add 2^r = sum to the right of each row
*/
function krSvg(T, R, visibleTo, highlight, mode) {
  const cellW = 38, cellH = 38, gap = 6;
  const rowH  = cellH + gap;
  const sumColW = mode === 'sums' ? 110 : 0;
  const triW = R * (cellW + gap);
  const padX = 20, padY = 18;
  const W = padX * 2 + triW + sumColW;
  const H = padY * 2 + R * rowH;

  const cx = (r, k) => padX + (triW - (r + 1) * (cellW + gap)) / 2 + k * (cellW + gap) + cellW / 2;
  const cy = r       => padY + r * rowH + cellH / 2;

  let cells = '', sums = '', annotations = '';

  for (let r = 0; r <= visibleTo; r++) {
    const isActive    = r === highlight;
    const isParentRow = highlight !== null && r === highlight - 1 && highlight >= 2;
    for (let k = 0; k < T[r].length; k++) {
      const x = cx(r, k) - cellW / 2;
      const y = cy(r) - cellH / 2;
      let fill   = 'rgba(194,164,109,0.10)';
      let stroke = 'rgba(194,164,109,0.55)';
      let txtCol = 'var(--text2)';
      let strokeW = 1;
      let fontW   = 600;
      if (isActive) {
        fill = 'rgba(139,32,32,0.10)';
        stroke = 'var(--crimson)';
        strokeW = 1.7;
        txtCol = 'var(--crimson)';
        fontW = 700;
      } else if (isParentRow) {
        fill = 'rgba(194,164,109,0.30)';
        stroke = 'var(--gold-dark)';
        strokeW = 1.3;
        txtCol = 'var(--gold-dark)';
        fontW = 700;
      }
      cells += `<rect x="${x}" y="${y}" width="${cellW}" height="${cellH}" rx="6"
                  fill="${fill}" stroke="${stroke}" stroke-width="${strokeW}"/>`;
      cells += `<text x="${cx(r,k)}" y="${cy(r) + 4}" text-anchor="middle"
                  font-family="'Courier Prime',monospace" font-size="14" font-weight="${fontW}"
                  fill="${txtCol}">${T[r][k]}</text>`;
    }

    if (mode === 'sums') {
      const sum = T[r].reduce((a, b) => a + b, 0);
      const sx  = padX + triW + 14;
      const sy  = cy(r) + 4;
      sums += `<text x="${sx}" y="${sy}" font-family="'Courier Prime',monospace" font-size="13"
                fill="var(--gold-dark)">= 2^${r} = ${sum}</text>`;
    }
  }

  /* Subtle "+" hint between the two parents above the active row */
  if (highlight !== null && highlight >= 2) {
    const r = highlight;
    for (let k = 1; k < T[r].length - 1; k++) {
      const px = (cx(r-1, k-1) + cx(r-1, k)) / 2;
      const py = cy(r-1);
      annotations += `<text x="${px}" y="${py + 4}" text-anchor="middle"
                        font-family="'Courier Prime',monospace" font-size="13"
                        fill="var(--crimson)" opacity="0.55">+</text>`;
    }
  }

  return `<div style="overflow-x:auto;direction:ltr">
    <svg viewBox="0 0 ${W} ${H}" style="width:100%;max-width:${W}px;display:block;margin:0 auto">
      ${cells}${annotations}${sums}
    </svg>
  </div>`;
}
