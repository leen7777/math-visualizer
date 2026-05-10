/* ══════════════════════════════════════════
   VISUAL MATHEMATICS الجبر (إكمال المربع)
   al-Khwārizmī Completing the Square
   from Kitāb al-mukhtasar fī ḥisāb al-jabr wa-l-muqābala (~830 CE)

   Three trinomial-form cases proven geometrically in
   "علم الجبر عند العرب والمسلمين" (الفصل الثاني)، صفحات 44–53:

     Case 4 (الحالة الرابعة):  س² + بس = جـ        →  pp. 44–45
     Case 5 (الحالة الخامسة):  س² + جـ = بس       →  pp. 46–50
     Case 6 (الحالة السادسة):  س² = بس + جـ        →  pp. 51–53
══════════════════════════════════════════ */

let jbSteps = [];
let jbIdx   = 0;

function jbCaseChange() {
  const caseNum = parseInt(document.getElementById('jb-case').value);
  const bIn = document.getElementById('jb-b');
  const cIn = document.getElementById('jb-c');
  if      (caseNum === 1) { bIn.value = 5;  cIn.value = 0;  } /* s² = 5s,       s = 5  (c unused) */
  else if (caseNum === 2) { bIn.value = 0;  cIn.value = 49; } /* s² = 49,       s = 7  (b unused) */
  else if (caseNum === 3) { bIn.value = 5;  cIn.value = 10; } /* 5s = 10,       s = 2  */
  else if (caseNum === 4) { bIn.value = 10; cIn.value = 39; } /* s² + 10s = 39, s = 3  */
  else if (caseNum === 5) { bIn.value = 10; cIn.value = 21; } /* s² + 21 = 10s, s = 3 or 7 */
  else                    { bIn.value = 3;  cIn.value = 4;  } /* s² = 3s + 4,   s = 4  */
}

function startJb() {
  const caseNum = parseInt(document.getElementById('jb-case').value);
  const b = parseFloat(document.getElementById('jb-b').value);
  const c = parseFloat(document.getElementById('jb-c').value);
  if (isNaN(b) || isNaN(c)) return;

  /* Per-case input validation */
  if      (caseNum === 1 && b <= 0) return;       /* s² = bs    requires b > 0 */
  else if (caseNum === 2 && c <= 0) return;       /* s² = c     requires c > 0 */
  else if (caseNum === 3 && (b <= 0 || c <= 0)) return; /* bs = c    both > 0 */
  else if (caseNum >= 4 && (b <= 0 || c <= 0)) return;  /* trinomial both > 0 */

  /* Case 5 needs (b/2)² ≥ c for real solutions */
  if (caseNum === 5 && c > (b / 2) * (b / 2)) {
    const isEn = currentLang === 'en';
    document.getElementById('jb-desc').textContent = isEn
      ? `No real solution: this case requires (b/2)² ≥ c, but ${(b/2).toFixed(3)}² = ${((b/2)*(b/2)).toFixed(3)} < ${c}.`
      : `لا يوجد حلّ حقيقي: تتطلّب هذه الحالة (ب/2)² ≥ جـ، لكن ${(b/2).toFixed(3)}² = ${((b/2)*(b/2)).toFixed(3)} < ${c}.`;
    document.getElementById('jb-viz').innerHTML = '<div class="empty-state">⚠</div>';
    jbSteps = [];
    setNav('jb', jbSteps, 0);
    return;
  }

  jbSteps = (caseNum === 1) ? buildJbCase1(b)
          : (caseNum === 2) ? buildJbCase2(c)
          : (caseNum === 3) ? buildJbCase3(b, c)
          : (caseNum === 4) ? buildJbCase4(b, c)
          : (caseNum === 5) ? buildJbCase5(b, c)
          :                   buildJbCase6(b, c);
  jbIdx = 0;
  renderJb();
  setNav('jb', jbSteps, jbIdx);
}

function navJb(d) {
  jbIdx = Math.max(0, Math.min(jbSteps.length - 1, jbIdx + d));
  renderJb();
  setNav('jb', jbSteps, jbIdx);
}

const jbR = v => {
  const n = typeof v === 'number' ? v : parseFloat(v);
  return parseFloat(n.toFixed(6)).toString();
};

/* ══════════════════════════════════════════
   MONOMIAL CASES (1, 2, 3) — direct algebraic solution
══════════════════════════════════════════ */

/* CASE 1:  س² = بس        s = b */
function buildJbCase1(b) {
  const x = b;
  const baseData = { caseNum: 1, b, x: jbR(x) };
  return [
    { ...baseData, phase: 'equation',
      descAr: `الحالة الأولى (المال يعدل الجذور): س² = ${b}س. هذه أبسط الحالات الأحاديّة عند الخوارزمي.`,
      descEn: `Case 1 (squares equal roots): x² = ${b}x. The simplest of the monomial forms.` },
    { ...baseData, phase: 'divide',
      descAr: `الطرفان يحتويان «س». نقسّم على «س» (بفرض س ≠ 0): س²/س = ${b}س/س ⇒ س = ${b}.`,
      descEn: `Both sides contain x. Divide by x (assuming x ≠ 0): x²/x = ${b}x/x ⇒ x = ${b}.` },
    { ...baseData, phase: 'solve',
      descAr: `إذاً: س = ${jbR(x)}.`,
      descEn: `So x = ${jbR(x)}.` },
  ];
}

/* CASE 2:  س² = جـ        s = √c */
function buildJbCase2(c) {
  const x = Math.sqrt(c);
  const baseData = { caseNum: 2, c, x: jbR(x) };
  return [
    { ...baseData, phase: 'equation',
      descAr: `الحالة الثانية (المال يعدل العدد): س² = ${c}.`,
      descEn: `Case 2 (squares equal a number): x² = ${c}.` },
    { ...baseData, phase: 'sqrt',
      descAr: `نأخذ الجذر التربيعي للطرفين: س = √${c} = ${jbR(x)}.`,
      descEn: `Take the square root of both sides: x = √${c} = ${jbR(x)}.` },
    { ...baseData, phase: 'solve',
      descAr: `إذاً: س = ${jbR(x)}.`,
      descEn: `So x = ${jbR(x)}.` },
  ];
}

/* CASE 3:  بس = جـ        s = c/b */
function buildJbCase3(b, c) {
  const x = c / b;
  const baseData = { caseNum: 3, b, c, x: jbR(x) };
  return [
    { ...baseData, phase: 'equation',
      descAr: `الحالة الثالثة (الجذور تعدل العدد): ${b}س = ${c}.`,
      descEn: `Case 3 (roots equal a number): ${b}x = ${c}.` },
    { ...baseData, phase: 'divide',
      descAr: `نقسّم الطرفين على معامل «س» (= ${b}): س = ${c} ÷ ${b} = ${jbR(x)}.`,
      descEn: `Divide both sides by the coefficient of x (= ${b}): x = ${c} ÷ ${b} = ${jbR(x)}.` },
    { ...baseData, phase: 'solve',
      descAr: `إذاً: س = ${jbR(x)}.`,
      descEn: `So x = ${jbR(x)}.` },
  ];
}

/* ══════════════════════════════════════════
   CASE 4:  س² + بس = جـ        s = √((b/2)² + c) − b/2
══════════════════════════════════════════ */
function buildJbCase4(b, c) {
  const halfB  = b / 2;
  const corner = halfB * halfB;
  const rhs    = c + corner;
  const side   = Math.sqrt(rhs);
  const x      = side - halfB;

  const baseData = { caseNum: 4, b, c, halfB, corner, rhs, side: jbR(side), x: jbR(x) };

  return [
    { ...baseData, phase: 'equation',
      descAr: `الحالة الرابعة: س² + ${b}س = ${c}. هذه أوّل مسائل كتاب «المختصر في حساب الجبر والمقابلة» للخوارزمي. سنحلّها هندسيّاً كما فعل الخوارزمي.`,
      descEn: `Case 4: x² + ${b}x = ${c}. The opening problem of al-Khwārizmī's al-Jabr. We solve it geometrically, as he did.`,
      showSquare: false, showRects: false, showCorner: false, showSide: false },
    { ...baseData, phase: 'square',
      descAr: `نرسم مربعاً جانبه «س» مساحته = س². هذا يمثّل الطرف الأول من المعادلة.`,
      descEn: `Draw a square of side x its area = x². This represents the x² term.`,
      showSquare: true, showRects: false, showCorner: false, showSide: false },
    { ...baseData, phase: 'rects',
      descAr: `نُلصق مستطيلين بجانبَي المربع، عرض كلٍّ منهما ${halfB} وطوله «س». مساحة كلّ مستطيل = ${halfB}س، ومجموعهما = ${b}س. المساحة الكلّية = س² + ${b}س = ${c}.`,
      descEn: `Attach two rectangles to two sides of the square, each width ${halfB} and length x. Each area = ${halfB}x, combined = ${b}x. Total = x² + ${b}x = ${c}.`,
      showSquare: true, showRects: true, showCorner: false, showSide: false },
    { ...baseData, phase: 'corner',
      descAr: `نُكمل المربع الناقص في الركن، جانبه ${halfB} ومساحته = ${halfB}² = ${corner}. الشكل بأكمله مربع كامل جانبه (س + ${halfB}).`,
      descEn: `Complete the missing corner with a square of side ${halfB}, area = ${corner}. The whole shape is now a perfect square of side (x + ${halfB}).`,
      showSquare: true, showRects: true, showCorner: true, showSide: false },
    { ...baseData, phase: 'algebra',
      descAr: `المربع الكبير = س² + ${b}س + ${corner} = (س + ${halfB})².  ولأنّ س² + ${b}س = ${c}، فإنّ (س + ${halfB})² = ${c} + ${corner} = ${rhs}.`,
      descEn: `Big square = x² + ${b}x + ${corner} = (x + ${halfB})². But x² + ${b}x = ${c}, so (x + ${halfB})² = ${c} + ${corner} = ${rhs}.`,
      showSquare: true, showRects: true, showCorner: true, showSide: false },
    { ...baseData, phase: 'solve',
      descAr: `نأخذ الجذر التربيعي: س + ${halfB} = √${rhs} = ${jbR(side)}. إذاً: س = ${jbR(side)} − ${halfB} = ${jbR(x)}.`,
      descEn: `Take the square root: x + ${halfB} = √${rhs} = ${jbR(side)}. Therefore x = ${jbR(side)} − ${halfB} = ${jbR(x)}.`,
      showSquare: true, showRects: true, showCorner: true, showSide: true },
  ];
}

/* ══════════════════════════════════════════
   CASE 5:  س² + جـ = بس        s = (b/2) ± √((b/2)² − c)
══════════════════════════════════════════ */
function buildJbCase5(b, c) {
  const halfB    = b / 2;
  const inside   = halfB * halfB - c;
  const root     = Math.sqrt(inside);
  const xSmall   = halfB - root;
  const xLarge   = halfB + root;

  const baseData = { caseNum: 5, b, c, halfB, inside, root: jbR(root),
                     xSmall: jbR(xSmall), xLarge: jbR(xLarge) };

  return [
    { ...baseData, phase: 'equation',
      descAr: `الحالة الخامسة: س² + ${c} = ${b}س. مثال الخوارزمي الكلاسيكي: س² + 21 = 10س، حلّاه 3 و7.`,
      descEn: `Case 5: x² + ${c} = ${b}x. al-Khwārizmī's classical example x² + 21 = 10x has roots 3 and 7.`,
      showRect: false, showSplit: false, showMid: false, showInner: false, showSolve: false },
    { ...baseData, phase: 'rect',
      descAr: `نعتبر مستطيلاً عرضه «س» وطوله «${b}»، فمساحته = ${b}س.`,
      descEn: `Consider a rectangle of width x and length ${b}; area = ${b}x.`,
      showRect: true, showSplit: false, showMid: false, showInner: false, showSolve: false },
    { ...baseData, phase: 'split',
      descAr: `نقسّمه إلى قسمين: مربع جانبه «س» مساحته = س²، ومستطيل بقي مساحته = ${c}. مجموعهما: س² + ${c} = ${b}س.`,
      descEn: `Split it into two: a square of side x (area x²) and a remaining rectangle of area ${c}. Together x² + ${c} = ${b}x.`,
      showRect: true, showSplit: true, showMid: false, showInner: false, showSolve: false },
    { ...baseData, phase: 'mid',
      descAr: `نضع منتصف الضلع الطويل عند النقطة ه فيكون |ضه| = |هي| = ${halfB}. ثمّ نُكمل المربع جانبه ${halfB} ومساحته (${halfB})² = ${jbR(halfB*halfB)}.`,
      descEn: `Mark midpoint h of the long side, so each half = ${halfB}. Complete a square of side ${halfB}, area = ${jbR(halfB*halfB)}.`,
      showRect: true, showSplit: true, showMid: true, showInner: false, showSolve: false },
    { ...baseData, phase: 'inner',
      descAr: `بإعادة ترتيب الأجزاء: المربع الكبير (${halfB})² يتركّب من المستطيل (مساحة = ${c}) ومربع داخلي صغير جانبه (${halfB} − س). إذاً: (${halfB} − س)² = ${jbR(halfB*halfB)} − ${c} = ${jbR(inside)}.`,
      descEn: `Rearranging: the big square (${halfB})² consists of the rectangle (area ${c}) plus an inner square of side (${halfB} − x). So (${halfB} − x)² = ${jbR(halfB*halfB)} − ${c} = ${jbR(inside)}.`,
      showRect: false, showSplit: false, showMid: false, showInner: true, showSolve: false },
    { ...baseData, phase: 'solve',
      descAr: `نأخذ الجذر التربيعي: ${halfB} − س = √${jbR(inside)} = ${jbR(root)}. الجذر الأصغر: س = ${halfB} − ${jbR(root)} = ${jbR(xSmall)}. والأكبر (المتماثل): س = ${halfB} + ${jbR(root)} = ${jbR(xLarge)}.`,
      descEn: `Take square root: ${halfB} − x = √${jbR(inside)} = ${jbR(root)}. Smaller root: x = ${jbR(xSmall)}. The symmetric larger root: x = ${jbR(xLarge)}.`,
      showRect: false, showSplit: false, showMid: false, showInner: true, showSolve: true },
  ];
}

/* ══════════════════════════════════════════
   CASE 6:  س² = بس + جـ        s = (b/2) + √((b/2)² + c)
══════════════════════════════════════════ */
function buildJbCase6(b, c) {
  const halfB  = b / 2;
  const inside = halfB * halfB + c;
  const root   = Math.sqrt(inside);
  const x      = halfB + root;

  const baseData = { caseNum: 6, b, c, halfB, inside, root: jbR(root), x: jbR(x) };

  return [
    { ...baseData, phase: 'equation',
      descAr: `الحالة السادسة: س² = ${b}س + ${c}. مثال الخوارزمي: 3س + 4 = س²، حلّه 4.`,
      descEn: `Case 6: x² = ${b}x + ${c}. al-Khwārizmī's example: 3x + 4 = x², solution 4.`,
      showSquare: false, showStrip: false, showRem: false, showMid: false, showCompletion: false, showSolve: false },
    { ...baseData, phase: 'square',
      descAr: `نعتبر مربعاً جانبه المجهول «س»، مساحته = س². هذا الطرف الأيسر من المعادلة.`,
      descEn: `Consider a square of unknown side x, area = x². This is the LHS.`,
      showSquare: true, showStrip: false, showRem: false, showMid: false, showCompletion: false, showSolve: false },
    { ...baseData, phase: 'strip',
      descAr: `نختار نقطة على ضلع المربع تجعل شريحة بعرض «س» وطول «${b}» (= ${b}س) داخلَه.`,
      descEn: `Pick a point on a side so an inner strip of width x and length ${b} (= ${b}x) is marked.`,
      showSquare: true, showStrip: true, showRem: false, showMid: false, showCompletion: false, showSolve: false },
    { ...baseData, phase: 'rem',
      descAr: `الباقي من المربع بعد الشريحة = س² − ${b}س = ${c} (من المعادلة). أي أنّ الجزء المتبقّي مساحته ${c}.`,
      descEn: `The remainder (square minus strip) = x² − ${b}x = ${c}. So the remaining piece has area ${c}.`,
      showSquare: true, showStrip: true, showRem: true, showMid: false, showCompletion: false, showSolve: false },
    { ...baseData, phase: 'mid',
      descAr: `نضع منتصف الشريحة عند النقطة (ه)، |ضه| = ${halfB}. ثمّ نُنشئ مربعاً جانبه ${halfB} ومساحته = (${halfB})² = ${jbR(halfB*halfB)}.`,
      descEn: `Mark the midpoint of the strip's length (= ${halfB}), then build a small square of side ${halfB}, area = ${jbR(halfB*halfB)}.`,
      showSquare: true, showStrip: true, showRem: true, showMid: true, showCompletion: false, showSolve: false },
    { ...baseData, phase: 'completion',
      descAr: `بإعادة ترتيب الباقي مع ربع المربع الصغير: ينتج مربع كبير جانبه (س − ${halfB})، ومساحته = ${c} + ${jbR(halfB*halfB)} = ${jbR(inside)}.`,
      descEn: `Rearranging the remainder with the small square's quarters: a big square of side (x − ${halfB}) emerges, area = ${c} + ${jbR(halfB*halfB)} = ${jbR(inside)}.`,
      showSquare: true, showStrip: true, showRem: true, showMid: true, showCompletion: true, showSolve: false },
    { ...baseData, phase: 'solve',
      descAr: `نأخذ الجذر التربيعي: س − ${halfB} = √${jbR(inside)} = ${jbR(root)}. إذاً: س = ${halfB} + ${jbR(root)} = ${jbR(x)}.`,
      descEn: `Take the square root: x − ${halfB} = √${jbR(inside)} = ${jbR(root)}. So x = ${halfB} + ${jbR(root)} = ${jbR(x)}.`,
      showSquare: true, showStrip: true, showRem: true, showMid: true, showCompletion: true, showSolve: true },
  ];
}

/* ══════════════════════════════════════════
   Renderer  dispatches by case
══════════════════════════════════════════ */
function renderJb() {
  const s    = jbSteps[jbIdx];
  const isEn = currentLang === 'en';

  document.getElementById('jb-desc').textContent = isEn ? s.descEn : s.descAr;

  let h;
  if      (s.caseNum <= 3) h = renderJbMonomial(s, isEn);
  else if (s.caseNum === 4) h = renderJbCase4(s, isEn);
  else if (s.caseNum === 5) h = renderJbCase5(s, isEn);
  else                       h = renderJbCase6(s, isEn);

  document.getElementById('jb-viz').innerHTML = h;
}

const jbTxt = (x, y, txt, color, fs, fw, anchor) =>
  `<text x="${(+x).toFixed(1)}" y="${(+y).toFixed(1)}" text-anchor="${anchor||'middle'}" `
+ `font-size="${fs||14}" font-weight="${fw||'normal'}" fill="${color}" `
+ `font-family="'Courier New',monospace">${txt}</text>`;

/* ══════════════════════════════════════════
   Monomial renderer (cases 1, 2, 3)
   No geometric figure these are direct algebraic derivations.
══════════════════════════════════════════ */
function renderJbMonomial(s, isEn) {
  const eqMap = {
    1: { equation: `x² = ${s.b}x`,           solved: `x = ${s.x}` },
    2: { equation: `x² = ${s.c}`,            solved: `x = √${s.c} = ${s.x}` },
    3: { equation: `${s.b}x = ${s.c}`,       solved: `x = ${s.c} ÷ ${s.b} = ${s.x}` },
  };
  const e = eqMap[s.caseNum];

  /* Stack: equation banner, working line(s), result */
  let h = `<div style="display:flex;flex-direction:column;align-items:center;gap:18px;padding:24px 12px">`;

  /* Equation banner (always shown) */
  h += `<div style="font-family:'Courier Prime',monospace;font-size:28px;color:var(--text);`
     + `background:var(--surface);border:1.5px solid var(--border-soft);border-radius:10px;`
     + `padding:14px 28px;box-shadow:var(--shadow-sm)">${e.equation}</div>`;

  /* Working step (for divide / sqrt phase) */
  if (s.phase === 'divide' || s.phase === 'sqrt') {
    const op = (s.phase === 'sqrt')
      ? (isEn ? 'take √ both sides' : 'نأخذ الجذر التربيعي')
      : (isEn ? 'divide both sides' : 'نقسّم الطرفين');
    h += `<div style="font-family:'Courier Prime',monospace;font-size:18px;color:var(--muted);font-style:italic">${op}</div>`;
    h += `<div style="font-family:'Courier Prime',monospace;font-size:24px;color:var(--gold-dark);font-weight:700">${e.solved}</div>`;
  }

  /* Result box on solve phase */
  if (s.phase === 'solve') {
    let verifyTxt = '';
    if (s.caseNum === 1) {
      const xN = parseFloat(s.x);
      verifyTxt = `verify: ${xN}² = ${xN*xN} = ${s.b}·${xN} ✓`;
    } else if (s.caseNum === 2) {
      const xN = parseFloat(s.x);
      verifyTxt = `verify: ${xN}² = ${(xN*xN).toFixed(2).replace(/\.?0+$/, '')} ≈ ${s.c} ✓`;
    } else {
      const xN = parseFloat(s.x);
      verifyTxt = `verify: ${s.b}·${xN} = ${jbR(s.b * xN)} = ${s.c} ✓`;
    }
    h += `<div class="result-box result-ok" style="direction:ltr;text-align:center;min-width:300px">`
       + `<div class="result-text">x = ${s.x}</div>`
       + `<div style="font-size:12px;color:var(--muted);margin-top:6px;font-style:italic">${verifyTxt}</div>`
       + `</div>`;
  }

  h += `</div>`;
  return h;
}

/* ══════════════════════════════════════════
   Case 4 renderer
══════════════════════════════════════════ */
function renderJbCase4(s, isEn) {
  const { b, halfB, corner, rhs, side, x } = s;

  const SQSZ = 130, HALF = 64, PAD = 48, RW = 200;
  const W = PAD + SQSZ + HALF + 30 + RW + PAD;
  const H = PAD + SQSZ + HALF + PAD + 10;
  const SX = PAD, SY = PAD;

  let svg = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" `
          + `style="max-width:${Math.min(W,660)}px;display:block;overflow:visible">`;

  if (s.showSquare) {
    svg += `<rect x="${SX}" y="${SY}" width="${SQSZ}" height="${SQSZ}" `
         + `fill="rgba(139,32,32,0.12)" stroke="#8B2020" stroke-width="2"/>`;
    svg += jbTxt(SX + SQSZ/2, SY + SQSZ/2 + 8, 'x²', '#8B2020', 22, 'bold');
    svg += jbTxt(SX + SQSZ/2, SY - 12, 'x', '#2B1B0E', 15);
    svg += jbTxt(SX - 14, SY + SQSZ/2 + 6, 'x', '#2B1B0E', 15);
  }
  if (s.showRects) {
    svg += `<rect x="${SX + SQSZ}" y="${SY}" width="${HALF}" height="${SQSZ}" `
         + `fill="rgba(43,80,112,0.16)" stroke="#2B5070" stroke-width="2"/>`;
    svg += jbTxt(SX + SQSZ + HALF/2, SY + SQSZ/2 + 8, `${halfB}x`, '#2B5070', 13, 'bold');
    svg += jbTxt(SX + SQSZ + HALF/2, SY - 12, `${halfB}`, '#2B5070', 13);
    svg += `<rect x="${SX}" y="${SY + SQSZ}" width="${SQSZ}" height="${HALF}" `
         + `fill="rgba(43,80,112,0.16)" stroke="#2B5070" stroke-width="2"/>`;
    svg += jbTxt(SX + SQSZ/2, SY + SQSZ + HALF/2 + 8, `${halfB}x`, '#2B5070', 13, 'bold');
    svg += jbTxt(SX - 14, SY + SQSZ + HALF/2 + 6, `${halfB}`, '#2B5070', 13);
  }
  if (s.showCorner) {
    svg += `<rect x="${SX + SQSZ}" y="${SY + SQSZ}" width="${HALF}" height="${HALF}" `
         + `fill="rgba(92,122,60,0.22)" stroke="#5C7A3C" stroke-width="2"/>`;
    svg += jbTxt(SX + SQSZ + HALF/2, SY + SQSZ + HALF/2 + 7, `${corner}`, '#5C7A3C', 13, 'bold');
    svg += jbTxt(SX + SQSZ + HALF/2, SY + SQSZ + HALF + 18, `${halfB}`, '#5C7A3C', 11);
  }
  if (s.showSide && s.showCorner) {
    svg += `<rect x="${SX}" y="${SY}" width="${SQSZ + HALF}" height="${SQSZ + HALF}" `
         + `fill="none" stroke="#C2A46D" stroke-width="3" stroke-dasharray="7,4" rx="2"/>`;
    svg += jbTxt(SX + (SQSZ+HALF)/2, SY + SQSZ + HALF + 34, `x + ${halfB} = ${side}`, '#8B6030', 15, 'bold');
  }

  /* right-panel formula area */
  const RX = PAD + SQSZ + HALF + 32;
  let ryc = SY + 10;
  const line = (txt, color, fs, fw) => {
    svg += `<text x="${RX}" y="${ryc}" font-size="${fs||15}" font-weight="${fw||'normal'}" `
         + `fill="${color}" font-family="'Courier New',monospace">${txt}</text>`;
    ryc += (fs || 15) + 10;
  };
  if      (!s.showSquare)         { line(`x² + ${b}x = ${s.c}`, '#2B1B0E', 20, 'bold'); }
  else if (s.phase === 'square')  { line(`x² = ?`, '#8B2020', 17, 'bold'); ryc += 4; line(`Area = x²`, '#7A6045', 13); }
  else if (s.phase === 'rects')   { line(`x²`, '#8B2020', 15, 'bold');
                                    line(`+ ${halfB}x`, '#2B5070', 15, 'bold');
                                    line(`+ ${halfB}x`, '#2B5070', 15, 'bold');
                                    ryc += 6; line(`= ${s.c}`, '#2B1B0E', 17, 'bold'); }
  else if (s.phase === 'corner')  { line(`x²  + ${b}x  + ${corner}`, '#2B1B0E', 14); ryc += 4;
                                    line(`= (x + ${halfB})²`, '#8B6030', 16, 'bold'); }
  else if (s.phase === 'algebra') { line(`(x + ${halfB})²`, '#8B6030', 16, 'bold');
                                    line(`= ${s.c} + ${corner}`, '#2B5070', 15);
                                    line(`= ${rhs}`, '#8B2020', 17, 'bold'); }
  else if (s.phase === 'solve')   { line(`x + ${halfB} = √${rhs}`, '#2B5070', 15);
                                    line(`x + ${halfB} = ${side}`, '#2B5070', 15); ryc += 4;
                                    line(`x = ${side} − ${halfB}`, '#8B6030', 15); ryc += 2;
                                    line(`x = ${x}`, '#8B2020', 20, 'bold'); }

  svg += '</svg>';
  let h = `<div class="lat-wrap">${svg}</div>`;

  if (s.phase === 'solve') {
    const xN = parseFloat(x);
    const ck = parseFloat((xN*xN + b*xN).toFixed(6));
    const ok = Math.abs(ck - s.c) < 0.001;
    const t  = isEn
      ? `x = ${x} &nbsp;|&nbsp; verify: (${x})² + ${b}·${x} = ${ck} ${ok ? '= ' + s.c + ' ✓' : '≈ ' + s.c}`
      : `س = ${x} &nbsp;|&nbsp; تحقق: (${x})² + ${b}·${x} = ${ck} ${ok ? '= ' + s.c + ' ✓' : '≈ ' + s.c}`;
    h += `<div class="result-box result-ok" style="margin-top:14px;direction:ltr"><div class="result-text">${t}</div></div>`;
  }
  return h;
}

/* ══════════════════════════════════════════
   Case 5 renderer
══════════════════════════════════════════ */
function renderJbCase5(s, isEn) {
  const { b, c, halfB, inside } = s;
  const xS = parseFloat(s.xSmall);

  const sc = 280 / b;
  const W  = 540, H = 380;
  const PAD_X = 30, PAD_Y = 50;

  const RW = b * sc;
  const RH = xS * sc;
  const X0 = PAD_X;
  const Y0 = PAD_Y;
  const splitX = X0 + (b - xS) * sc;

  let svg = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" `
          + `style="max-width:660px;display:block;overflow:visible">`;

  if (s.showRect) {
    svg += `<rect x="${X0}" y="${Y0}" width="${RW.toFixed(1)}" height="${RH.toFixed(1)}" `
         + `fill="rgba(194,164,109,0.06)" stroke="#8B6030" stroke-width="2"/>`;
    svg += jbTxt(X0 + RW/2, Y0 - 14, `b = ${b}`, '#8B6030', 14, 'bold');
    svg += jbTxt(X0 - 14, Y0 + RH/2 + 5, `x`, '#8B6030', 14, 'bold');
    if (!s.showSplit) svg += jbTxt(X0 + RW/2, Y0 + RH/2 + 6, `${b}x`, '#8B6030', 16, 'bold');
  }
  if (s.showSplit) {
    /* left part = c (length b - x) */
    svg += `<rect x="${X0}" y="${Y0}" width="${(splitX - X0).toFixed(1)}" height="${RH.toFixed(1)}" `
         + `fill="rgba(43,80,112,0.16)" stroke="#2B5070" stroke-width="1.5"/>`;
    svg += jbTxt(X0 + (splitX - X0)/2, Y0 + RH/2 + 6, `c = ${c}`, '#2B5070', 14, 'bold');
    /* right part = x² (square) */
    svg += `<rect x="${splitX.toFixed(1)}" y="${Y0}" width="${(RW - (splitX-X0)).toFixed(1)}" height="${RH.toFixed(1)}" `
         + `fill="rgba(139,32,32,0.16)" stroke="#8B2020" stroke-width="1.5"/>`;
    svg += jbTxt(splitX + (RW - (splitX-X0))/2, Y0 + RH/2 + 6, `x²`, '#8B2020', 14, 'bold');
    svg += jbTxt(splitX + (RW - (splitX-X0))/2, Y0 + RH + 16, `x`, '#8B2020', 11);
    svg += jbTxt(X0 + (splitX - X0)/2, Y0 + RH + 16, `b − x`, '#2B5070', 11);
  }
  if (s.showMid) {
    const midX = X0 + halfB * sc;
    svg += `<line x1="${midX.toFixed(1)}" y1="${(Y0 + RH).toFixed(1)}" `
         + `x2="${midX.toFixed(1)}" y2="${(Y0 + RH + 10).toFixed(1)}" stroke="#5C7A3C" stroke-width="2"/>`;
    svg += jbTxt(midX, Y0 + RH + 24, `b/2 = ${halfB}`, '#5C7A3C', 11, 'bold');
  }

  /* (b/2)² square (and inner decomposition) shown for both mid and inner/solve phases */
  if (s.showMid || s.showInner) {
    const sqSide = halfB * sc;
    /* When original rectangle is visible, place square below it; otherwise center it */
    const SX2 = s.showRect ? X0 : (W - sqSide) / 2;
    const SY2 = s.showRect ? Y0 + RH + 50 : Y0 + 30;
    svg += `<rect x="${SX2.toFixed(1)}" y="${SY2.toFixed(1)}" width="${sqSide.toFixed(1)}" height="${sqSide.toFixed(1)}" `
         + `fill="rgba(92,122,60,0.10)" stroke="#5C7A3C" stroke-width="2"/>`;
    svg += jbTxt(SX2 + sqSide/2, SY2 - 8, `(b/2)² = ${jbR(halfB*halfB)}`, '#5C7A3C', 12, 'bold');

    if (s.showInner) {
      const innerSide = (halfB - xS) * sc;
      svg += `<rect x="${SX2.toFixed(1)}" y="${SY2.toFixed(1)}" width="${innerSide.toFixed(1)}" height="${innerSide.toFixed(1)}" `
           + `fill="rgba(122,96,69,0.18)" stroke="#7A6045" stroke-width="1.5"/>`;
      svg += jbTxt(SX2 + innerSide/2, SY2 + innerSide/2 + 4, `(b/2−x)²`, '#7A6045', 10, 'bold');
      svg += `<line x1="${(SX2 + innerSide).toFixed(1)}" y1="${SY2.toFixed(1)}" `
           + `x2="${(SX2 + innerSide).toFixed(1)}" y2="${(SY2 + sqSide).toFixed(1)}" stroke="#2B5070" stroke-width="1.2" stroke-dasharray="3,2"/>`;
      svg += jbTxt(SX2 + innerSide + (sqSide-innerSide)/2, SY2 + sqSide/2 + 5, `c = ${c}`, '#2B5070', 11, 'bold');
      svg += jbTxt(SX2 + innerSide/2, SY2 + sqSide + 16, `b/2 − x = ${jbR(halfB - xS)}`, '#7A6045', 11);
    }
  }
  if (s.showSolve) {
    svg += jbTxt(W/2, H - 22, `x = ${halfB} ± √${jbR(inside)} = ${s.xSmall} or ${s.xLarge}`,
                 '#8B2020', 15, 'bold');
  }

  svg += '</svg>';
  let h = `<div class="lat-wrap">${svg}</div>`;

  if (s.phase === 'solve') {
    const xL = parseFloat(s.xLarge);
    const ckS = parseFloat((xS*xS + c).toFixed(6));
    const ckL = parseFloat((xL*xL + c).toFixed(6));
    const okS = Math.abs(ckS - b*xS) < 0.001;
    const okL = Math.abs(ckL - b*xL) < 0.001;
    const t = isEn
      ? `x ∈ {${s.xSmall}, ${s.xLarge}} &nbsp;|&nbsp; ${s.xSmall}² + ${c} = ${ckS} ${okS?'= '+(b*xS)+' ✓':''}, &nbsp; ${s.xLarge}² + ${c} = ${ckL} ${okL?'= '+(b*xL)+' ✓':''}`
      : `س ∈ {${s.xSmall}، ${s.xLarge}} &nbsp;|&nbsp; ${s.xSmall}² + ${c} = ${ckS}، ${s.xLarge}² + ${c} = ${ckL} ✓`;
    h += `<div class="result-box result-ok" style="margin-top:14px;direction:ltr"><div class="result-text">${t}</div></div>`;
  }
  return h;
}

/* ══════════════════════════════════════════
   Case 6 renderer
══════════════════════════════════════════ */
function renderJbCase6(s, isEn) {
  const { b, c, halfB, inside, root } = s;
  const xN = parseFloat(s.x);

  const sc  = 220 / xN;
  const SQ  = xN * sc;
  const STR = b  * sc;
  const HF  = halfB * sc;
  const W   = 560, H = 380;
  const PAD = 50;
  const SX  = PAD, SY  = PAD;

  let svg = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" `
          + `style="max-width:660px;display:block;overflow:visible">`;

  if (s.showSquare) {
    svg += `<rect x="${SX}" y="${SY}" width="${SQ.toFixed(1)}" height="${SQ.toFixed(1)}" `
         + `fill="rgba(139,32,32,0.10)" stroke="#8B2020" stroke-width="2"/>`;
    svg += jbTxt(SX + SQ/2, SY - 10, `x`, '#8B2020', 14);
    svg += jbTxt(SX - 14, SY + SQ/2 + 6, `x`, '#8B2020', 14);
    if (!s.showStrip) svg += jbTxt(SX + SQ/2, SY + SQ/2 + 6, `x²`, '#8B2020', 22, 'bold');
  }
  if (s.showStrip) {
    svg += `<rect x="${SX}" y="${SY}" width="${STR.toFixed(1)}" height="${SQ.toFixed(1)}" `
         + `fill="rgba(43,80,112,0.16)" stroke="#2B5070" stroke-width="1.5"/>`;
    svg += jbTxt(SX + STR/2, SY + SQ/2 + 6, `${b}x`, '#2B5070', 16, 'bold');
    svg += jbTxt(SX + STR/2, SY - 10, `b = ${b}`, '#2B5070', 12);
  }
  if (s.showRem) {
    const remX = SX + STR;
    const remW = SQ - STR;
    svg += `<rect x="${remX.toFixed(1)}" y="${SY}" width="${remW.toFixed(1)}" height="${SQ.toFixed(1)}" `
         + `fill="rgba(122,96,69,0.16)" stroke="#7A6045" stroke-width="1.5"/>`;
    svg += jbTxt(remX + remW/2, SY + SQ/2 + 6, `c = ${c}`, '#7A6045', 14, 'bold');
    svg += jbTxt(remX + remW/2, SY + SQ + 16, `x − b`, '#7A6045', 11);
  }
  if (s.showMid) {
    const midX = SX + HF;
    svg += `<line x1="${midX.toFixed(1)}" y1="${(SY - 6).toFixed(1)}" x2="${midX.toFixed(1)}" y2="${(SY + 6).toFixed(1)}" `
         + `stroke="#5C7A3C" stroke-width="2"/>`;
    svg += jbTxt(midX, SY - 16, `b/2 = ${halfB}`, '#5C7A3C', 11, 'bold');
    /* (b/2)² square inside the strip, on the right half */
    svg += `<rect x="${midX.toFixed(1)}" y="${SY}" width="${HF.toFixed(1)}" height="${HF.toFixed(1)}" `
         + `fill="rgba(92,122,60,0.18)" stroke="#5C7A3C" stroke-width="1.5"/>`;
    svg += jbTxt(midX + HF/2, SY + HF/2 + 4, `(b/2)²`, '#5C7A3C', 11, 'bold');
  }
  if (s.showCompletion) {
    /* dashed (x − b/2)² square */
    const bigSide = (xN - halfB) * sc;
    const bX = SX + HF;
    const bY = SY + HF;
    svg += `<rect x="${bX.toFixed(1)}" y="${bY.toFixed(1)}" width="${bigSide.toFixed(1)}" height="${bigSide.toFixed(1)}" `
         + `fill="none" stroke="#C2A46D" stroke-width="3" stroke-dasharray="7,4" rx="2"/>`;
    svg += jbTxt(bX + bigSide/2, bY + bigSide + 22, `(x − ${halfB})² = ${jbR(inside)}`, '#8B6030', 13, 'bold');
  }

  /* right-panel formula */
  const RX = SX + SQ + 28;
  let ryc  = SY + 12;
  const line = (txt, color, fs, fw) => {
    svg += `<text x="${RX}" y="${ryc}" font-size="${fs||14}" font-weight="${fw||'normal'}" `
         + `fill="${color}" font-family="'Courier New',monospace">${txt}</text>`;
    ryc += (fs || 14) + 8;
  };
  if      (!s.showSquare)              { line(`x² = ${b}x + ${c}`, '#2B1B0E', 18, 'bold'); }
  else if (s.phase === 'square')       { line(`x² = ?`, '#8B2020', 16, 'bold'); }
  else if (s.phase === 'strip')        { line(`strip = ${b}·x`, '#2B5070', 13, 'bold'); }
  else if (s.phase === 'rem')          { line(`x² − ${b}x = ${c}`, '#2B1B0E', 14, 'bold'); }
  else if (s.phase === 'mid')          { line(`(b/2)² = ${jbR(halfB*halfB)}`, '#5C7A3C', 13, 'bold'); }
  else if (s.phase === 'completion')   { line(`(x − ${halfB})²`, '#8B6030', 14, 'bold');
                                          line(`= ${c} + ${jbR(halfB*halfB)}`, '#2B5070', 13);
                                          line(`= ${inside ? jbR(inside) : ''}`, '#8B2020', 16, 'bold'); }
  else if (s.phase === 'solve')        { line(`x − ${halfB} = √${jbR(inside)}`, '#2B5070', 13);
                                          line(`         = ${root}`, '#2B5070', 13); ryc += 4;
                                          line(`x = ${halfB} + ${root}`, '#8B6030', 14); ryc += 2;
                                          line(`x = ${s.x}`, '#8B2020', 18, 'bold'); }

  svg += '</svg>';
  let h = `<div class="lat-wrap">${svg}</div>`;

  if (s.phase === 'solve') {
    const ck = parseFloat((xN*xN).toFixed(6));
    const ok = Math.abs(ck - (b*xN + c)) < 0.001;
    const t  = isEn
      ? `x = ${jbR(xN)} &nbsp;|&nbsp; verify: (${jbR(xN)})² = ${ck} ${ok ? '= '+b+'·'+jbR(xN)+' + '+c+' ✓' : ''}`
      : `س = ${jbR(xN)} &nbsp;|&nbsp; تحقق: (${jbR(xN)})² = ${ck} ${ok ? '= '+b+'·'+jbR(xN)+' + '+c+' ✓' : ''}`;
    h += `<div class="result-box result-ok" style="margin-top:14px;direction:ltr"><div class="result-text">${t}</div></div>`;
  }
  return h;
}
