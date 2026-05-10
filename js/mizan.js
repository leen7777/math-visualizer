/* ══════════════════════════════════════════
   VISUAL MATHEMATICS الميزان
   Casting-out-Nines  (الجذر الرقمي)
══════════════════════════════════════════ */

let mzSteps = [];
let mzIdx   = 0;

function mzOpChange() {
  const op  = document.getElementById('mz-op').value;
  const isDivision = op === '÷';
  document.getElementById('mz-rem-group').style.display = isDivision ? 'flex' : 'none';
  const lbl = document.getElementById('mz-r-label');
  if (lbl) lbl.textContent = isDivision ? t('mizanLabelQuotient') : t('mizanLabelR');
}

function startMz() {
  const a   = parseInt(document.getElementById('mz-a').value);
  const op  = document.getElementById('mz-op').value;
  const b   = parseInt(document.getElementById('mz-b').value);
  const r   = parseInt(document.getElementById('mz-r').value);
  const rem = op === '÷' ? (parseInt(document.getElementById('mz-rem').value) || 0) : 0;
  if (isNaN(a) || isNaN(b) || isNaN(r)) return;
  mzSteps = buildMzSteps(a, op, b, r, rem);
  mzIdx   = 0;
  renderMz();
  setNav('mz', mzSteps, mzIdx);
}

function navMz(d) {
  mzIdx = Math.max(0, Math.min(mzSteps.length - 1, mzIdx + d));
  renderMz();
  setNav('mz', mzSteps, mzIdx);
}

function dr(n) {
  /* Casting-out-nines digital root: result lies in 0..8.
     9 is fully cast out to 0 (since 9 ≡ 0 mod 9). */
  return Math.abs(n) % 9;
}

function drHistory(n) {
  n = Math.abs(n);
  if (n < 9) return [n];
  /* For multi-digit n: sum digits once first */
  const hist = [n];
  if (n >= 10) {
    const digitSum = String(n).split('').reduce((acc, d) => acc + parseInt(d), 0);
    hist.push(digitSum);
  }
  /* Subtract 9 repeatedly until below 9 (so 9 itself is cast out to 0) */
  let v = hist[hist.length - 1];
  while (v >= 9) { v -= 9; hist.push(v); }
  return hist;
}

function buildMzSteps(A, op, B, R, Rem) {
  Rem = Rem || 0;
  const steps  = [];
  const digStr = v => String(v).split('').join(' + ');

  const h1   = drHistory(A), h2 = drHistory(B), h3 = drHistory(R);
  const hRem = Rem > 0 ? drHistory(Rem) : [0];
  const dr1   = h1[h1.length - 1];
  const dr2   = h2[h2.length - 1];
  const dr3   = h3[h3.length - 1];
  const drRem = hRem[hRem.length - 1];
  const hasDivRem = op === '÷' && Rem > 0;

  let opVal, drOp, balanced;
  if (op === '÷') {
    /* Textbook formula: (dr(quotient) × dr(divisor)) + dr(remainder) = dr(dividend) */
    opVal    = dr3 * dr2 + drRem;
    drOp     = dr(opVal);
    balanced = drOp === dr1;
  } else {
    if      (op === '+') opVal = dr1 + dr2;
    else if (op === '-') opVal = dr1 >= dr2 ? dr1 - dr2 : dr1 - dr2 + 9;
    else                 opVal = dr1 * dr2;
    drOp     = dr(opVal);
    balanced = drOp === dr3;
  }

  const opD = op === '-' ? '−' : op;

  /* helpers */
  const remSuffixAr = Rem > 0 ? ` باقٍ ${Rem}` : '';
  const remSuffixEn = Rem > 0 ? ` remainder ${Rem}` : '';
  let introNoteAr = '', introNoteEn = '';
  if (op === '÷') {
    introNoteAr = hasDivRem
      ? ' (للقسمة مع باقٍ: (ميزان الخارج × ميزان المقسوم عليه) + ميزان الباقي = ميزان المقسوم)'
      : ' (للقسمة: ميزان الخارج × ميزان المقسوم عليه = ميزان المقسوم)';
    introNoteEn = hasDivRem
      ? ' (For division with remainder: (mizan(quotient) × mizan(divisor)) + mizan(remainder) = mizan(dividend))'
      : ' (For division: mizan(quotient) × mizan(divisor) = mizan(dividend))';
  }

  /* ── Step 0: intro ── */
  steps.push({
    descAr: `نريد التحقق من: ${A} ${opD} ${B} = ${R}${remSuffixAr}. سنحسب ميزان كل عدد: نجمع أرقامه مرة واحدة، ثم نطرح 9 تكراراً حتى يصبح الناتج رقماً أحادياً.${introNoteAr}`,
    descEn: `We want to verify: ${A} ${opD} ${B} = ${R}${remSuffixEn}. We find the mizan (scale) of each number: sum its digits once, then subtract 9 repeatedly until a single digit remains.${introNoteEn}`,
    phase: 'init', show1: false, show2: false, show3: false, showRem: false, showOp: false, showBal: false,
    h1: [], h2: [], h3: [], hRem: [],
    dr1: null, dr2: null, dr3: null, drRem: null, drOp: null, balanced: null, hasDivRem,
  });

  /* ── dr1 steps ── */
  for (let i = 1; i < h1.length; i++) {
    const isLast1 = i === h1.length - 1;
    const tailAr1 = isLast1 ? ` → الميزان: ${h1[i]}` : '';
    const tailEn1 = isLast1 ? ` → scale: ${h1[i]}` : '';
    let dAr1, dEn1;
    if (i === 1 && h1[0] >= 10) {
      dAr1 = `ميزان ${A}: نجمع الأرقام: ${digStr(h1[0])} = ${h1[1]}${tailAr1}`;
      dEn1 = `Scale of ${A}: sum the digits: ${digStr(h1[0])} = ${h1[1]}${tailEn1}`;
    } else {
      dAr1 = `${h1[i-1]} ≥ 9 نطرح تسعة: ${h1[i-1]} − 9 = ${h1[i]}${tailAr1}`;
      dEn1 = `${h1[i-1]} ≥ 9 subtract nine: ${h1[i-1]} − 9 = ${h1[i]}${tailEn1}`;
    }
    steps.push({
      descAr: dAr1, descEn: dEn1,
      phase: 'dr1', show1: true, show2: false, show3: false, showRem: false, showOp: false, showBal: false,
      h1: h1.slice(0, i+1), h2: [], h3: [], hRem: [],
      dr1: isLast1 ? dr1 : null, dr2: null, dr3: null, drRem: null, drOp: null, balanced: null, hasDivRem,
    });
  }
  if (h1.length === 1) {
    steps.push({
      descAr: `${A} رقم أحادي أصغر من 9 → ميزانه هو ${dr1}`,
      descEn: `${A} is a single digit < 9 → its scale is ${dr1}`,
      phase: 'dr1', show1: true, show2: false, show3: false, showRem: false, showOp: false, showBal: false,
      h1, h2: [], h3: [], hRem: [],
      dr1, dr2: null, dr3: null, drRem: null, drOp: null, balanced: null, hasDivRem,
    });
  }

  /* ── dr2 steps ── */
  for (let i = 1; i < h2.length; i++) {
    const isLast2 = i === h2.length - 1;
    const tailAr2 = isLast2 ? ` → الميزان: ${h2[i]}` : '';
    const tailEn2 = isLast2 ? ` → scale: ${h2[i]}` : '';
    let dAr2, dEn2;
    if (i === 1 && h2[0] >= 10) {
      dAr2 = `ميزان ${B}: نجمع الأرقام: ${digStr(h2[0])} = ${h2[1]}${tailAr2}`;
      dEn2 = `Scale of ${B}: sum the digits: ${digStr(h2[0])} = ${h2[1]}${tailEn2}`;
    } else {
      dAr2 = `${h2[i-1]} ≥ 9 نطرح تسعة: ${h2[i-1]} − 9 = ${h2[i]}${tailAr2}`;
      dEn2 = `${h2[i-1]} ≥ 9 subtract nine: ${h2[i-1]} − 9 = ${h2[i]}${tailEn2}`;
    }
    steps.push({
      descAr: dAr2, descEn: dEn2,
      phase: 'dr2', show1: true, show2: true, show3: false, showRem: false, showOp: false, showBal: false,
      h1, h2: h2.slice(0, i+1), h3: [], hRem: [],
      dr1, dr2: isLast2 ? dr2 : null, dr3: null, drRem: null, drOp: null, balanced: null, hasDivRem,
    });
  }
  if (h2.length === 1) {
    steps.push({
      descAr: `${B} رقم أحادي أصغر من 9 → ميزانه هو ${dr2}`,
      descEn: `${B} is a single digit < 9 → its scale is ${dr2}`,
      phase: 'dr2', show1: true, show2: true, show3: false, showRem: false, showOp: false, showBal: false,
      h1, h2, h3: [], hRem: [],
      dr1, dr2, dr3: null, drRem: null, drOp: null, balanced: null, hasDivRem,
    });
  }

  /* ── dr3 steps (quotient / result) ── */
  for (let i = 1; i < h3.length; i++) {
    const isLast3 = i === h3.length - 1;
    const tailAr3 = isLast3 ? ` → الميزان: ${h3[i]}` : '';
    const tailEn3 = isLast3 ? ` → scale: ${h3[i]}` : '';
    let dAr3, dEn3;
    if (i === 1 && h3[0] >= 10) {
      dAr3 = `ميزان ${R}: نجمع الأرقام: ${digStr(h3[0])} = ${h3[1]}${tailAr3}`;
      dEn3 = `Scale of ${R}: sum the digits: ${digStr(h3[0])} = ${h3[1]}${tailEn3}`;
    } else {
      dAr3 = `${h3[i-1]} ≥ 9 نطرح تسعة: ${h3[i-1]} − 9 = ${h3[i]}${tailAr3}`;
      dEn3 = `${h3[i-1]} ≥ 9 subtract nine: ${h3[i-1]} − 9 = ${h3[i]}${tailEn3}`;
    }
    steps.push({
      descAr: dAr3, descEn: dEn3,
      phase: 'dr3', show1: true, show2: true, show3: true, showRem: false, showOp: false, showBal: false,
      h1, h2, h3: h3.slice(0, i+1), hRem: [],
      dr1, dr2, dr3: isLast3 ? dr3 : null, drRem: null, drOp: null, balanced: null, hasDivRem,
    });
  }
  if (h3.length === 1) {
    steps.push({
      descAr: `${R} رقم أحادي أصغر من 9 → ميزانه هو ${dr3}`,
      descEn: `${R} is a single digit < 9 → its scale is ${dr3}`,
      phase: 'dr3', show1: true, show2: true, show3: true, showRem: false, showOp: false, showBal: false,
      h1, h2, h3, hRem: [],
      dr1, dr2, dr3, drRem: null, drOp: null, balanced: null, hasDivRem,
    });
  }

  /* ── drRem steps (remainder division with remainder only) ── */
  if (hasDivRem) {
    for (let i = 1; i < hRem.length; i++) {
      const isLastR = i === hRem.length - 1;
      const tailArR = isLastR ? ` → الميزان: ${hRem[i]}` : '';
      const tailEnR = isLastR ? ` → scale: ${hRem[i]}` : '';
      let dArR, dEnR;
      if (i === 1 && hRem[0] >= 10) {
        dArR = `ميزان الباقي ${Rem}: نجمع الأرقام: ${digStr(hRem[0])} = ${hRem[1]}${tailArR}`;
        dEnR = `Scale of remainder ${Rem}: sum the digits: ${digStr(hRem[0])} = ${hRem[1]}${tailEnR}`;
      } else {
        dArR = `${hRem[i-1]} ≥ 9 نطرح تسعة: ${hRem[i-1]} − 9 = ${hRem[i]}${tailArR}`;
        dEnR = `${hRem[i-1]} ≥ 9 subtract nine: ${hRem[i-1]} − 9 = ${hRem[i]}${tailEnR}`;
      }
      steps.push({
        descAr: dArR, descEn: dEnR,
        phase: 'drRem', show1: true, show2: true, show3: true, showRem: true, showOp: false, showBal: false,
        h1, h2, h3, hRem: hRem.slice(0, i+1),
        dr1, dr2, dr3, drRem: isLastR ? drRem : null, drOp: null, balanced: null, hasDivRem,
      });
    }
    if (hRem.length === 1) {
      steps.push({
        descAr: `${Rem} رقم أحادي أصغر من 9 → ميزانه هو ${drRem}`,
        descEn: `${Rem} is a single digit < 9 → its scale is ${drRem}`,
        phase: 'drRem', show1: true, show2: true, show3: true, showRem: true, showOp: false, showBal: false,
        h1, h2, h3, hRem,
        dr1, dr2, dr3, drRem, drOp: null, balanced: null, hasDivRem,
      });
    }
  }

  /* ── Operation step ── */
  let descAr, descEn;
  if (op === '÷') {
    if (hasDivRem) {
      descAr = `نطبق صيغة الميزان: (ميزان الخارج × ميزان المقسوم عليه) + ميزان الباقي = (${dr3} × ${dr2}) + ${drRem} = ${opVal} → الميزان: ${drOp}. يجب أن يساوي ميزان المقسوم (${dr1}).`;
      descEn = `Apply the mizan formula: (mizan(quotient) × mizan(divisor)) + mizan(remainder) = (${dr3} × ${dr2}) + ${drRem} = ${opVal} → mizan: ${drOp}. Must equal mizan(dividend) = ${dr1}.`;
    } else {
      descAr = `للتحقق من القسمة نضرب: ميزان الخارج (${dr3}) × ميزان المقسوم عليه (${dr2}) = ${opVal} → الميزان: ${drOp}. يجب أن يساوي ميزان المقسوم (${dr1}).`;
      descEn = `For division, multiply: mizan(quotient)(${dr3}) × mizan(divisor)(${dr2}) = ${opVal} → mizan: ${drOp}. Must equal mizan(dividend) = ${dr1}.`;
    }
  } else {
    descAr = `نطبّق العملية على الميزانين: ميزان(${A}) ${opD} ميزان(${B}) = ${dr1} ${opD} ${dr2} = ${opVal} → الميزان: ${drOp}. لكي تكون العملية صحيحة يجب أن يساوي هذا ميزانَ الناتج المزعوم: ميزان(${R}) = ${dr3}.`;
    descEn = `Apply the operation to the two mizans: mizan(${A}) ${opD} mizan(${B}) = ${dr1} ${opD} ${dr2} = ${opVal} → mizan: ${drOp}. For the operation to be correct this must equal the mizan of the claimed result: mizan(${R}) = ${dr3}.`;
  }
  steps.push({
    descAr, descEn,
    phase: 'op', show1: true, show2: true, show3: true, showRem: hasDivRem, showOp: true, showBal: false,
    h1, h2, h3, hRem,
    dr1, dr2, dr3, drRem, drOp, balanced: null, opVal, hasDivRem,
  });

  /* ── Balance step ── */
  if (op === '÷') {
    if (hasDivRem) {
      descAr = balanced
        ? `✓ الميزان متوازن! (ميزان(${R}) × ميزان(${B})) + ميزان(${Rem}) = ${drOp} = ميزان(${A}) = ${dr1}. القسمة صحيحة.`
        : `✗ الميزان غير متوازن! (ميزان(${R}) × ميزان(${B})) + ميزان(${Rem}) = ${drOp} ≠ ميزان(${A}) = ${dr1}. القسمة خاطئة.`;
      descEn = balanced
        ? `✓ Mizan balanced! (mizan(${R}) × mizan(${B})) + mizan(${Rem}) = ${drOp} = mizan(${A}) = ${dr1}. Division is correct.`
        : `✗ Mizan unbalanced! (mizan(${R}) × mizan(${B})) + mizan(${Rem}) = ${drOp} ≠ mizan(${A}) = ${dr1}. Division is wrong.`;
    } else {
      descAr = balanced
        ? `✓ الميزان متوازن! ميزان(${R}) × ميزان(${B}) = ${drOp} = ميزان(${A}) = ${dr1}. القسمة صحيحة.`
        : `✗ الميزان غير متوازن! ميزان(${R}) × ميزان(${B}) = ${drOp} ≠ ميزان(${A}) = ${dr1}. القسمة خاطئة.`;
      descEn = balanced
        ? `✓ Mizan balanced! mizan(${R}) × mizan(${B}) = ${drOp} = mizan(${A}) = ${dr1}. Division is correct.`
        : `✗ Mizan unbalanced! mizan(${R}) × mizan(${B}) = ${drOp} ≠ mizan(${A}) = ${dr1}. Division is wrong.`;
    }
  } else {
    descAr = balanced
      ? `✓ الميزان متوازن! ميزان العملية (${drOp}) = ميزان الناتج (${dr3}). العملية صحيحة.`
      : `✗ الميزان غير متوازن! ميزان العملية (${drOp}) ≠ ميزان الناتج (${dr3}). العملية خاطئة.`;
    descEn = balanced
      ? `✓ Mizan balanced! mizan(operation) (${drOp}) = mizan(result) (${dr3}). Operation is correct.`
      : `✗ Mizan unbalanced! mizan(operation) (${drOp}) ≠ mizan(result) (${dr3}). Operation is incorrect.`;
  }
  steps.push({
    descAr, descEn,
    phase: 'balance', show1: true, show2: true, show3: true, showRem: hasDivRem, showOp: true, showBal: true,
    h1, h2, h3, hRem,
    dr1, dr2, dr3, drRem, drOp, balanced, opVal, hasDivRem,
  });

  return steps;
}

function renderMz() {
  const s   = mzSteps[mzIdx];
  const A   = document.getElementById('mz-a').value;
  const op  = document.getElementById('mz-op').value;
  const B   = document.getElementById('mz-b').value;
  const R   = document.getElementById('mz-r').value;
  const Rem = op === '÷' ? (parseInt(document.getElementById('mz-rem').value) || 0) : 0;
  const opD = op === '-' ? '−' : op;
  const isEn = currentLang === 'en';
  const hasDivRem = op === '÷' && Rem > 0;

  document.getElementById('mz-desc').textContent = isEn ? s.descEn : s.descAr;

  const chainHTML = (hist) => {
    if (!hist || hist.length === 0) return '';
    return hist
      .map((v, i) => `<span style="color:${i === hist.length-1 ? '#8B6030' : '#2B5070'}">${v}</span>`)
      .join(' <span style="color:#C2A46D">→</span> ');
  };

  /* Box titles switch for division mode */
  const titleA = op === '÷' ? t('boxDividend')  : t('boxFirst');
  const titleB = op === '÷' ? t('boxDivisor')   : t('boxSecond');
  const titleR = op === '÷' ? t('boxQuotient')  : t('boxResult');

  const eqStr = hasDivRem
    ? `${A} ${opD} ${B} = ${R} ${isEn ? 'rem' : 'باقٍ'} ${Rem}`
    : `${A} ${opD} ${B} = ${R}`;

  let h = '<div class="miz-layout">';
  h += `<div class="miz-equation">${eqStr}</div>`;
  h += '<div class="miz-nums">';

  /* Box A */
  h += '<div class="miz-box">';
  h += `<div class="miz-box-title">${titleA}</div>`;
  h += `<div class="miz-big">${A}</div>`;
  if (s.show1 && s.h1.length > 0) h += `<div class="miz-chain">${chainHTML(s.h1)}</div>`;
  if (s.dr1 !== null) h += `<div class="miz-dr">${t('drLabel')}<b>${s.dr1}</b></div>`;
  h += '</div>';

  h += `<div class="miz-op-sym">${opD}</div>`;

  /* Box B */
  h += '<div class="miz-box">';
  h += `<div class="miz-box-title">${titleB}</div>`;
  h += `<div class="miz-big">${B}</div>`;
  if (s.show2 && s.h2.length > 0) h += `<div class="miz-chain">${chainHTML(s.h2)}</div>`;
  if (s.dr2 !== null) h += `<div class="miz-dr">${t('drLabel')}<b>${s.dr2}</b></div>`;
  h += '</div>';

  h += `<div class="miz-eq-sym">=</div>`;

  /* Box R (quotient / result) */
  h += '<div class="miz-box">';
  h += `<div class="miz-box-title">${titleR}</div>`;
  h += `<div class="miz-big">${R}</div>`;
  if (s.show3 && s.h3.length > 0) h += `<div class="miz-chain">${chainHTML(s.h3)}</div>`;
  if (s.dr3 !== null) h += `<div class="miz-dr">${t('drLabel')}<b>${s.dr3}</b></div>`;
  h += '</div>';

  /* Box Rem division with remainder only */
  if (hasDivRem) {
    h += `<div style="font-size:16px;color:#7A6045;align-self:center">${isEn ? 'rem' : 'باقٍ'}</div>`;
    h += '<div class="miz-box">';
    h += `<div class="miz-box-title">${t('boxRemainder')}</div>`;
    h += `<div class="miz-big">${Rem}</div>`;
    if (s.showRem && s.hRem && s.hRem.length > 0) h += `<div class="miz-chain">${chainHTML(s.hRem)}</div>`;
    if (s.drRem !== null) h += `<div class="miz-dr">${t('drLabel')}<b>${s.drRem}</b></div>`;
    h += '</div>';
  }

  h += '</div>'; /* /miz-nums */

  /* Operation result box  shows the textbook comparison
       mizan(A) op mizan(B) = X = mizan(R) ?
     side-by-side so the check is unambiguous. */
  if (s.showOp && s.drOp !== null) {
    const matchOk    = s.balanced === true || (s.balanced === null && s.drOp === (op === '÷' ? s.dr1 : s.dr3));
    const cmpColor   = s.balanced === false ? '#8B2020' : (s.balanced === true ? '#5C7A3C' : '#8B6030');
    const cmpSym     = s.balanced === false ? '≠' : '=';
    const expectedDr = op === '÷' ? s.dr1 : s.dr3;
    const expectedN  = op === '÷' ? A      : R;
    const lhsLabel   = isEn ? 'left side' : 'الطرف الأيسر';
    const rhsLabel   = isEn ? 'right side (claimed result)' : 'الطرف الأيمن (الناتج المزعوم)';

    let lhsExpr;
    if (op === '÷') {
      lhsExpr = hasDivRem
        ? `(ميزان(${R}) × ميزان(${B})) + ميزان(${Rem}) = (${s.dr3} × ${s.dr2}) + ${s.drRem} = ${s.opVal}`
        : `ميزان(${R}) × ميزان(${B}) = ${s.dr3} × ${s.dr2} = ${s.opVal}`;
      if (isEn) lhsExpr = lhsExpr.replace(/ميزان/g, 'mizan');
    } else {
      lhsExpr = isEn
        ? `mizan(${A}) ${opD} mizan(${B}) = ${s.dr1} ${opD} ${s.dr2} = ${s.opVal}`
        : `ميزان(${A}) ${opD} ميزان(${B}) = ${s.dr1} ${opD} ${s.dr2} = ${s.opVal}`;
    }
    const rhsExpr = isEn
      ? `mizan(${expectedN}) = ${expectedDr}`
      : `ميزان(${expectedN}) = ${expectedDr}`;

    h += `<div class="op-result-box" style="text-align:center;line-height:1.7">`;
    h += `<div style="font-size:13px;color:var(--muted);margin-bottom:6px">${isEn ? 'check whether' : 'نتحقق ممّا إذا كان'}</div>`;
    h += `<div style="font-family:'Courier Prime',monospace;font-size:14px;color:var(--text2)">`;
    h += `<span>${lhsExpr}</span> &nbsp;`;
    h += `<span style="color:#8B6030;font-size:22px;font-weight:bold">${s.drOp}</span> &nbsp;`;
    h += `<span style="color:${cmpColor};font-size:22px;font-weight:bold">${cmpSym}</span> &nbsp;`;
    h += `<span style="color:#8B6030;font-size:22px;font-weight:bold">${expectedDr}</span> &nbsp;`;
    h += `<span>${rhsExpr}</span>`;
    h += `</div></div>`;
  }

  /* Balance scale */
  if (s.showBal) {
    const tilt     = s.balanced ? 0 : 18;
    const lColor   = s.balanced ? '#5C7A3C' : '#8B5020';
    const rColor   = s.balanced ? '#5C7A3C' : '#8B2020';
    const isDivOp  = op === '÷';
    const leftVal  = s.drOp;
    const rightVal = isDivOp ? s.dr1 : s.dr3;
    let leftLbl, rightLbl;
    if (isDivOp) {
      leftLbl  = hasDivRem ? t('balLeftDivRem') : t('balLeftDiv');
      rightLbl = t('balRightDiv');
    } else {
      leftLbl  = t('balLeft');
      rightLbl = t('balRight');
    }

    h += `<div class="balance-wrap">
    <svg viewBox="0 0 420 220" xmlns="http://www.w3.org/2000/svg">
      <rect x="197" y="55" width="6" height="130" rx="3" fill="#C2A46D"/>
      <rect x="155" y="178" width="110" height="8" rx="4" fill="#C2A46D"/>
      <circle cx="200" cy="58" r="8" fill="#7A6045"/>
      <g transform="rotate(${tilt}, 200, 58)">
        <rect x="55" y="54" width="290" height="8" rx="4" fill="${s.balanced ? '#5C7A3C' : '#8B2020'}"/>
        <line x1="80"  y1="62" x2="60"  y2="115" stroke="#C2A46D" stroke-width="2"/>
        <line x1="80"  y1="62" x2="100" y2="115" stroke="#C2A46D" stroke-width="2"/>
        <path d="M 50 115 Q 80 132 110 115" fill="${lColor}" fill-opacity="0.22" stroke="${lColor}" stroke-width="2"/>
        <text x="80" y="130" text-anchor="middle" fill="${lColor}" font-size="22" font-weight="bold">${leftVal}</text>
        <text x="80" y="150" text-anchor="middle" fill="#7A6045" font-size="9">${leftLbl}</text>
        <line x1="320" y1="62" x2="300" y2="115" stroke="#C2A46D" stroke-width="2"/>
        <line x1="320" y1="62" x2="340" y2="115" stroke="#C2A46D" stroke-width="2"/>
        <path d="M 290 115 Q 320 132 350 115" fill="${rColor}" fill-opacity="0.22" stroke="${rColor}" stroke-width="2"/>
        <text x="320" y="130" text-anchor="middle" fill="${rColor}" font-size="22" font-weight="bold">${rightVal}</text>
        <text x="320" y="150" text-anchor="middle" fill="#7A6045" font-size="10">${rightLbl}</text>
      </g>
    </svg></div>`;

    h += `<div class="result-box ${s.balanced ? 'result-ok' : 'result-err'}">
      <div class="result-text">${s.balanced ? t('balOk') : t('balErr')}</div>
    </div>`;
  }

  h += '</div>';
  document.getElementById('mz-viz').innerHTML = h;
}
