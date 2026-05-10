/* ════════════════════════════════════════════
   VISUAL MATHEMATICS Classical Geometry
   1. Al-Qūhī Angle Trisection by Conic Sections (تثليث الزاوية بالمخروطيات)
   2. Pythagorean Theorem (مبرهنة فيثاغورس)
════════════════════════════════════════════ */

/* ══════════════════════════════════════════
   AL-QŪHĪ ANGLE TRISECTION VIA CONIC SECTIONS
   Trisecting ∠AOB = θ reduces to solving the
   cubic 4x³ − 3x = cos(θ), where x = cos(θ/3).
   al-Qūhī's method (~980 CE): substitute y=x²
   to factor the cubic into the intersection of
     • parabola   y = x²
     • hyperbola  4xy − 3x = cos(θ)
   The intersection x-coordinate is cos(θ/3),
   from which the trisecting ray is constructed.
══════════════════════════════════════════ */

let quhiSteps = [], quhiIdx = 0;

function startQuhi() {
  const thetaDeg = parseFloat(document.getElementById('quhi-theta').value);
  if (!thetaDeg || thetaDeg < 15 || thetaDeg > 120) return;
  quhiSteps = buildQuhiSteps(thetaDeg);
  quhiIdx = 0;
  renderQuhi();
  setNav('quhi', quhiSteps, quhiIdx);
}
function navQuhi(dir) {
  quhiIdx = Math.max(0, Math.min(quhiSteps.length - 1, quhiIdx + dir));
  renderQuhi();
  setNav('quhi', quhiSteps, quhiIdx);
}
function renderQuhi() {
  if (!quhiSteps.length) return;
  const s = quhiSteps[quhiIdx];
  document.getElementById('quhi-desc').innerHTML =
    `<span class="ar-text">${s.descAr}</span><span class="en-text">${s.descEn}</span>`;
  document.getElementById('quhi-viz').innerHTML = s.svg;
}

function buildQuhiSteps(thetaDeg) {
  const steps = [];
  const theta  = thetaDeg * Math.PI / 180;
  const c      = Math.cos(theta);
  const alpha  = theta / 3;
  const xRoot  = Math.cos(alpha);          // root of 4x³ − 3x = c in [0,1]

  /* ── Layout: 700×380 SVG, two side-by-side panels ── */
  const W = inner => `<svg viewBox="0 0 700 380" style="width:100%;max-height:380px">${inner}</svg>`;

  /* Left panel: unit circle and angle */
  const Lcx = 175, Lcy = 200, R = 130;
  /* Right panel: coordinate plane for conics */
  const Rox = 480, Roy = 250, SC = 130;
  const xToP = x => Rox + x * SC;
  const yToP = y => Roy - y * SC;

  /* ── Reusable left-side primitives ── */
  const circle = `<circle cx="${Lcx}" cy="${Lcy}" r="${R}" fill="none" stroke="var(--gold)" stroke-width="1.5" opacity="0.7"/>`;
  const rayA = `<line x1="${Lcx}" y1="${Lcy}" x2="${Lcx + R + 10}" y2="${Lcy}" stroke="var(--muted)" stroke-width="1.5"/>
    <text x="${Lcx + R + 14}" y="${Lcy + 5}" font-family="Courier Prime,monospace" font-size="11" fill="var(--muted)">A</text>`;
  const Bx = Lcx + R * Math.cos(theta);
  const By = Lcy - R * Math.sin(theta);
  const rayB = `<line x1="${Lcx}" y1="${Lcy}" x2="${Bx.toFixed(1)}" y2="${By.toFixed(1)}" stroke="var(--crimson)" stroke-width="2"/>
    <text x="${(Bx + 10 * Math.cos(theta)).toFixed(1)}" y="${(By - 10 * Math.sin(theta) + 4).toFixed(1)}" font-family="Courier Prime,monospace" font-size="11" fill="var(--crimson)">B</text>`;
  const arcR = 36;
  const arcTheta = `<path d="M ${(Lcx + arcR).toFixed(1)} ${Lcy.toFixed(1)} A ${arcR} ${arcR} 0 0 0 ${(Lcx + arcR * Math.cos(theta)).toFixed(1)} ${(Lcy - arcR * Math.sin(theta)).toFixed(1)}"
      fill="none" stroke="var(--crimson)" stroke-width="1.5"/>
    <text x="${(Lcx + (arcR + 14) * Math.cos(theta / 2)).toFixed(1)}" y="${(Lcy - (arcR + 14) * Math.sin(theta / 2) + 4).toFixed(1)}"
      text-anchor="middle" font-family="Courier Prime,monospace" font-size="11" fill="var(--crimson)">θ</text>`;
  const oLbl = `<text x="${Lcx - 12}" y="${Lcy + 16}" font-family="Amiri,serif" font-size="13" fill="var(--muted)">O</text>`;
  const leftBase = circle + rayA + rayB + arcTheta + oLbl;

  /* Trisecting ray OP and second ray O→2α (for verification) */
  const Px = Lcx + R * Math.cos(alpha);
  const Py = Lcy - R * Math.sin(alpha);
  const rayP = `<line x1="${Lcx}" y1="${Lcy}" x2="${Px.toFixed(1)}" y2="${Py.toFixed(1)}" stroke="#3A6A9E" stroke-width="2.2"/>
    <text x="${(Px + 10 * Math.cos(alpha)).toFixed(1)}" y="${(Py - 10 * Math.sin(alpha) + 4).toFixed(1)}" font-family="Courier Prime,monospace" font-size="11" fill="#3A6A9E">P</text>`;
  const arcAlpha = `<path d="M ${(Lcx + 22).toFixed(1)} ${Lcy.toFixed(1)} A 22 22 0 0 0 ${(Lcx + 22 * Math.cos(alpha)).toFixed(1)} ${(Lcy - 22 * Math.sin(alpha)).toFixed(1)}"
      fill="none" stroke="#3A6A9E" stroke-width="1.5"/>
    <text x="${(Lcx + 33 * Math.cos(alpha / 2)).toFixed(1)}" y="${(Lcy - 33 * Math.sin(alpha / 2) + 4).toFixed(1)}"
      text-anchor="middle" font-family="Courier Prime,monospace" font-size="10" fill="#3A6A9E">α</text>`;
  const Q2x = Lcx + R * Math.cos(2 * alpha);
  const Q2y = Lcy - R * Math.sin(2 * alpha);
  const ray2 = `<line x1="${Lcx}" y1="${Lcy}" x2="${Q2x.toFixed(1)}" y2="${Q2y.toFixed(1)}" stroke="#3A6A9E" stroke-width="1.6" stroke-dasharray="5,3" opacity="0.8"/>`;

  /* ── Right-side coordinate plane ── */
  const axes = `
    <line x1="${Rox - 150}" y1="${Roy}" x2="${Rox + 170}" y2="${Roy}" stroke="var(--muted)" stroke-width="1" opacity="0.5"/>
    <line x1="${Rox}" y1="${Roy - 200}" x2="${Rox}" y2="${Roy + 50}" stroke="var(--muted)" stroke-width="1" opacity="0.5"/>
    <text x="${Rox + 165}" y="${Roy + 14}" font-family="Courier Prime,monospace" font-size="11" fill="var(--muted)">x</text>
    <text x="${Rox - 12}" y="${Roy - 195}" font-family="Courier Prime,monospace" font-size="11" fill="var(--muted)">y</text>
    <line x1="${Rox + SC}" y1="${Roy - 3}" x2="${Rox + SC}" y2="${Roy + 3}" stroke="var(--muted)" stroke-width="1"/>
    <text x="${Rox + SC}" y="${Roy + 14}" text-anchor="middle" font-family="Courier Prime,monospace" font-size="10" fill="var(--muted)">1</text>`;

  /* Parabola y = x² */
  let parabolaD = '';
  for (let i = 0; i <= 80; i++) {
    const x = -1.25 + 2.5 * i / 80;
    const y = x * x;
    if (y > 1.55) continue;
    parabolaD += `${parabolaD ? 'L' : 'M'}${xToP(x).toFixed(1)},${yToP(y).toFixed(1)} `;
  }
  const parabola = `<path d="${parabolaD}" fill="none" stroke="#3A6A9E" stroke-width="2"/>`;

  /* Hyperbola y = 3/4 + c/(4x) */
  function hyperPath(xStart, xEnd, steps) {
    let d = '';
    for (let i = 0; i <= steps; i++) {
      const x = xStart + (xEnd - xStart) * i / steps;
      const y = 0.75 + c / (4 * x);
      if (y > 1.55 || y < -0.6) { d = ''; continue; }
      d += `${d ? 'L' : 'M'}${xToP(x).toFixed(2)},${yToP(y).toFixed(2)} `;
    }
    return d;
  }
  const hyperRight = `<path d="${hyperPath(0.04, 1.35, 80)}" fill="none" stroke="#8B2020" stroke-width="2"/>`;
  const hyperLeft  = `<path d="${hyperPath(-1.25, -0.04, 80)}" fill="none" stroke="#8B2020" stroke-width="2" opacity="0.4"/>`;
  const hyperbola  = hyperRight + hyperLeft;

  /* Intersection point (xRoot, xRoot²) */
  const intX = xToP(xRoot);
  const intY = yToP(xRoot * xRoot);
  const intDot = `<circle cx="${intX.toFixed(1)}" cy="${intY.toFixed(1)}" r="5.5" fill="var(--gold)" stroke="#fff" stroke-width="1.5"/>
    <line x1="${intX.toFixed(1)}" y1="${intY.toFixed(1)}" x2="${intX.toFixed(1)}" y2="${Roy}" stroke="var(--gold)" stroke-width="1" stroke-dasharray="3,2" opacity="0.7"/>
    <text x="${intX.toFixed(1)}" y="${(Roy + 16).toFixed(1)}" text-anchor="middle" font-family="Courier Prime,monospace" font-size="10" fill="var(--gold)">${xRoot.toFixed(3)}</text>`;

  const labParabola = `<text x="${xToP(0.92).toFixed(0)}" y="${(yToP(0.92) - 8).toFixed(0)}" font-family="Lora,serif" font-size="13" fill="#3A6A9E" font-style="italic">y = x²</text>`;
  const labHyper    = `<text x="${xToP(1.05).toFixed(0)}" y="${(yToP(0.75 + c / 4.2) - 6).toFixed(0)}" font-family="Lora,serif" font-size="12" fill="#8B2020" font-style="italic">4xy − 3x = c</text>`;

  /* ── Step 0: state the problem ── */
  steps.push({
    descAr: `الزاوية ∠AOB = ${thetaDeg}°. المطلوب: شعاع OP يقسمها إلى ثلاثة أقسام متساوية، أي ∠AOP = ${(thetaDeg/3).toFixed(2)}°. أدرك العلماء المسلمون أن هذا غير ممكن بالمسطرة والفرجار وحدهما، لأن المسألة تكافئ حلّ معادلة من الدرجة الثالثة.`,
    descEn: `Angle ∠AOB = ${thetaDeg}°. Goal: a ray OP that splits it into three equal parts, so ∠AOP = ${(thetaDeg/3).toFixed(2)}°. Muslim mathematicians realised this cannot be done with compass-and-straightedge alone, because the problem is equivalent to solving a cubic equation.`,
    svg: W(leftBase)
  });

  /* ── Step 1: derive the cubic ── */
  steps.push({
    descAr: `بمتطابقة جيب تمام الزاوية الثلاثية: cos(3α) = 4cos³(α) − 3cos(α). فإذا وضعنا x = cos(α) و c = cos(θ) = ${c.toFixed(4)}، تصبح المسألة: 4x³ − 3x = c. هذه معادلة تكعيبية، وقد بُرهن أن المسطرة والفرجار لا يحلّان إلا المعادلات من الدرجة الأولى والثانية.`,
    descEn: `By the cosine triple-angle identity: cos(3α) = 4cos³(α) − 3cos(α). Setting x = cos(α) and c = cos(θ) = ${c.toFixed(4)}, the problem becomes 4x³ − 3x = c. A cubic equation — and compass-and-straightedge can only solve equations of degree one or two.`,
    svg: W(leftBase +
      `<text x="480" y="135" text-anchor="middle" font-family="Lora,serif" font-size="22" fill="var(--gold)">4x³ − 3x = c</text>
       <text x="480" y="170" text-anchor="middle" font-family="Courier Prime,monospace" font-size="12" fill="var(--muted)">c = cos(${thetaDeg}°) = ${c.toFixed(4)}</text>
       <text x="480" y="220" text-anchor="middle" font-family="Lora,serif" font-size="14" fill="var(--crimson)" font-style="italic">x = cos(α) = ?</text>`)
  });

  /* ── Step 2: factor cubic into two conics ── */
  steps.push({
    descAr: `فكرة الكوهي: نضع y = x²، فتتفكّك المعادلة التكعيبية إلى تقاطع منحنيين من الدرجة الثانية:  قطع مكافئ y = x²، وقطع زائد 4xy − 3x = c. تقاطعهما يعطي x = cos(α). هذا أصل منهج «حلّ المعادلات التكعيبية بالمخروطيات» الذي طوّره الكوهي ثم وسّعه عمر الخيّام.`,
    descEn: `al-Qūhī's idea: substitute y = x², so the cubic factors into the intersection of two conics — a parabola y = x² and a hyperbola 4xy − 3x = c. Their intersection gives x = cos(α). This is the seed of the "solve cubics by conics" programme that al-Qūhī pioneered and Khayyām later systematised.`,
    svg: W(leftBase + axes +
      `<text x="480" y="40" text-anchor="middle" font-family="Lora,serif" font-size="14" fill="#3A6A9E">y = x²   (parabola)</text>
       <text x="480" y="60" text-anchor="middle" font-family="Lora,serif" font-size="14" fill="#8B2020">4xy − 3x = c   (hyperbola)</text>`)
  });

  /* ── Step 3: draw the parabola ── */
  steps.push({
    descAr: `أولاً: نرسم القطع المكافئ y = x² في المستوي الإحداثي. (عرّف أبلونيوس القطوع المخروطية في القرن الثاني ق.م، لكن استخدامها لحلّ المعادلات منهج إسلامي.)`,
    descEn: `First: plot the parabola y = x² in the coordinate plane. (Apollonius defined the conics in the 2nd century BC, but using them to solve equations is a distinctly Muslim innovation.)`,
    svg: W(leftBase + axes + parabola + labParabola)
  });

  /* ── Step 4: add the hyperbola ── */
  steps.push({
    descAr: `ثانياً: نرسم القطع الزائد 4xy − 3x = c، أي y = ¾ + c/(4x). فرعه الأيمن (الأحمر الكامل) هو الذي يهمّنا، والأيسر (الباهت) تتمّةً للصورة.`,
    descEn: `Next: plot the hyperbola 4xy − 3x = c, i.e. y = ¾ + c/(4x). The right branch (solid red) is the one we need; the left branch (faded) is shown for completeness.`,
    svg: W(leftBase + axes + parabola + hyperbola + labParabola + labHyper)
  });

  /* ── Step 5: read off intersection ── */
  steps.push({
    descAr: `يتقاطع المنحنيان عند نقطة إحداثيّها السيني x = ${xRoot.toFixed(4)}. هذه القيمة هي بالضبط cos(θ/3) = cos(${(thetaDeg/3).toFixed(2)}°).`,
    descEn: `The two conics meet at a point with x-coordinate x = ${xRoot.toFixed(4)}. This value is exactly cos(θ/3) = cos(${(thetaDeg/3).toFixed(2)}°).`,
    svg: W(leftBase + axes + parabola + hyperbola + intDot + labParabola + labHyper)
  });

  /* ── Step 6: transfer x back to the circle ── */
  const vertX = Lcx + xRoot * R;
  const vertY = Lcy - Math.sqrt(Math.max(0, 1 - xRoot * xRoot)) * R;
  const transferLine = `<line x1="${vertX.toFixed(1)}" y1="${Lcy}" x2="${vertX.toFixed(1)}" y2="${vertY.toFixed(1)}" stroke="var(--gold)" stroke-width="1.2" stroke-dasharray="3,2" opacity="0.8"/>
    <text x="${vertX.toFixed(1)}" y="${(Lcy + 16).toFixed(1)}" text-anchor="middle" font-family="Courier Prime,monospace" font-size="9" fill="var(--gold)">${xRoot.toFixed(3)}</text>`;

  steps.push({
    descAr: `نأخذ القيمة x = ${xRoot.toFixed(4)} على المحور السيني، ثم نُقيم عموداً عليه حتى يلاقي دائرة الوحدة عند النقطة P. الشعاع OP يصنع مع الشعاع OA زاوية مقدارها α = arccos(x) = ${(thetaDeg/3).toFixed(2)}° = θ/3 بالضبط.`,
    descEn: `Carry x = ${xRoot.toFixed(4)} onto the unit circle: rise vertically at that x-value until you meet the circle at point P. The ray OP makes with OA an angle α = arccos(x) = ${(thetaDeg/3).toFixed(2)}° = θ/3 exactly.`,
    svg: W(leftBase + transferLine + rayP + arcAlpha + axes + parabola + hyperbola + intDot + labParabola + labHyper)
  });

  /* ── Step 7: verify ── */
  const cubicCheck = (4 * xRoot ** 3 - 3 * xRoot).toFixed(4);
  steps.push({
    descAr: `التحقّق: ${thetaDeg}° ÷ 3 = ${(thetaDeg/3).toFixed(2)}°، والشعاعان الأزرقان يقسمان ∠AOB إلى ثلاثة أقسام متساوية. ربط الكوهي بين الجبر (المعادلة التكعيبية) والهندسة (تقاطع المخروطيات)، وقد وسّع عمر الخيّام (~1070م) المنهج فحلّ به جميع أنواع المعادلات التكعيبية.`,
    descEn: `Verification: ${thetaDeg}° ÷ 3 = ${(thetaDeg/3).toFixed(2)}°, and the two blue rays split ∠AOB into three equal parts. al-Qūhī united algebra (the cubic equation) with geometry (intersecting conics); Omar Khayyām (~1070 CE) later extended the programme to solve every cubic equation this way.`,
    svg: W(circle + rayA + rayB + arcTheta + oLbl + rayP + ray2 + arcAlpha +
      `<text x="${Lcx}" y="365" text-anchor="middle" font-family="Lora,serif" font-size="13" fill="var(--gold)">θ/3 = ${(thetaDeg/3).toFixed(2)}°</text>
       <text x="480" y="170" text-anchor="middle" font-family="Lora,serif" font-size="15" fill="var(--gold)">x = cos(θ/3) = ${xRoot.toFixed(4)}</text>
       <text x="480" y="200" text-anchor="middle" font-family="Courier Prime,monospace" font-size="12" fill="var(--muted)">4(${xRoot.toFixed(3)})³ − 3(${xRoot.toFixed(3)}) = ${cubicCheck}</text>
       <text x="480" y="222" text-anchor="middle" font-family="Courier Prime,monospace" font-size="12" fill="var(--crimson)">c = ${c.toFixed(4)}   ✓</text>`)
  });

  return steps;
}


/* ══════════════════════════════════════════
   PYTHAGOREAN THEOREM
   Inputs: a, b  → c = √(a²+b²)
   Proof: 4 congruent right-triangles inside big square (a+b)²
   Central tilted square has side c  →  c² = (a+b)² − 2ab = a²+b²
══════════════════════════════════════════ */

let pySteps = [], pyIdx = 0;

function startPy() {
  const a = parseFloat(document.getElementById('py-a').value);
  const b = parseFloat(document.getElementById('py-b').value);
  if (!a || !b || a <= 0 || b <= 0 || a > 18 || b > 18) return;
  pySteps = buildPySteps(a, b);
  pyIdx = 0;
  renderPy();
  setNav('py', pySteps, pyIdx);
}
function navPy(dir) {
  pyIdx = Math.max(0, Math.min(pySteps.length - 1, pyIdx + dir));
  renderPy();
  setNav('py', pySteps, pyIdx);
}
function renderPy() {
  if (!pySteps.length) return;
  const s = pySteps[pyIdx];
  document.getElementById('py-desc').innerHTML =
    `<span class="ar-text">${s.descAr}</span><span class="en-text">${s.descEn}</span>`;
  document.getElementById('py-viz').innerHTML = s.svg;
}

function buildPySteps(a, b) {
  const c    = Math.sqrt(a*a + b*b);
  const sc   = 200 / (a + b);          // scale so big square = 200px
  const A    = a * sc, B = b * sc, C = c * sc;
  const S    = A + B;                  // big square side (200)
  const ox   = (400 - S) / 2;         // offset to center
  const oy   = (400 - S) / 2;

  /* Corner coords */
  const TL = [ox,   oy  ], TR = [ox+S, oy  ];
  const BR = [ox+S, oy+S], BL = [ox,   oy+S];

  /* Edge-split points (each edge split at distance B from "first" corner) */
  const ET = [ox+B, oy  ];   // top edge:    B from TL
  const ER = [ox+S, oy+B];   // right edge:  B from TR
  const EB = [ox+A, oy+S];   // bottom edge: A from BL  (= S-B from BR)
  const EL = [ox,   oy+A];   // left edge:   A from TL

  const poly = pts => pts.map(p=>`${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');

  /* 4 triangles */
  const tCol = 'rgba(139,32,32,0.22)', tStr = '#8B2020';
  const T1 = `<polygon points="${poly([TL,ET,EL])}" fill="${tCol}" stroke="${tStr}" stroke-width="1.5"/>`;
  const T2 = `<polygon points="${poly([TR,ER,ET])}" fill="${tCol}" stroke="${tStr}" stroke-width="1.5"/>`;
  const T3 = `<polygon points="${poly([BR,EB,ER])}" fill="${tCol}" stroke="${tStr}" stroke-width="1.5"/>`;
  const T4 = `<polygon points="${poly([BL,EL,EB])}" fill="${tCol}" stroke="${tStr}" stroke-width="1.5"/>`;

  /* Central c² square */
  const cSq = `<polygon points="${poly([ET,ER,EB,EL])}"
    fill="rgba(74,127,189,0.22)" stroke="#4A7FBD" stroke-width="2"/>`;

  /* Big square outline */
  const bigSq = `<rect x="${ox.toFixed(1)}" y="${oy.toFixed(1)}" width="${S}" height="${S}"
    fill="rgba(194,164,109,0.04)" stroke="var(--gold)" stroke-width="1.5"/>`;

  const txt = (x,y,s,col,sz=13,anchor='middle') =>
    `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="${anchor}"
      font-family="Courier Prime,monospace" font-size="${sz}" fill="${col}">${s}</text>`;

  const W = s => `<svg viewBox="0 0 400 400" style="width:100%;max-height:380px">${s}</svg>`;

  const steps = [];

  /* ── Step 0: right triangle ── */
  const tx=160, ty=270;
  steps.push({
    descAr: `مثلث قائم الزاوية: الضلعان أ = ${a}، ب = ${b}. نريد إثبات أن أ² + ب² = ج².`,
    descEn: `Right triangle with legs a = ${a}, b = ${b}. We want to prove a² + b² = c².`,
    svg: W(`
      <polygon points="${tx},${ty} ${tx+B*1.4},${ty} ${tx},${ty-A*1.4}"
        fill="rgba(194,164,109,0.15)" stroke="var(--crimson)" stroke-width="2"/>
      <path d="M ${tx+14} ${ty} L ${tx+14} ${ty-14} L ${tx} ${ty-14}"
        fill="none" stroke="var(--gold)" stroke-width="1.5"/>
      ${txt(tx+B*0.7, ty+20, `ب = ${b}`, 'var(--gold)')}
      ${txt(tx-22, ty-A*0.7, `أ = ${a}`, 'var(--gold)')}
      ${txt(tx+B*0.8+8, ty-A*0.7-10, `ج = ${c.toFixed(2)}`, 'var(--crimson)')}
      ${txt(200, 370, `نريد: أ² + ب² = ج²  →  ${a}² + ${b}² = ${c.toFixed(2)}²`, 'var(--muted)', 12)}`)
  });

  /* ── Step 1: big square + 4 triangles + c² ── */
  const midC = [(ET[0]+EB[0])/2, (ET[1]+EB[1])/2];
  steps.push({
    descAr: `نرسم مربعاً كبيراً جانبه (أ+ب) = ${a+b}. داخله 4 مثلثات متطابقة (أحمر) تترك مربعاً وسطياً مائلاً (أزرق) جانبه ج.`,
    descEn: `Draw a big square with side (a+b) = ${a+b}. Inside: 4 congruent triangles (red) leave a central tilted square (blue) of side c.`,
    svg: W(bigSq + T1+T2+T3+T4 + cSq +
      txt(midC[0], midC[1]+5, `ج²`, '#4A7FBD', 15) +
      txt(ox+S/2, oy-12, `(أ+ب)² = ${(a+b)*(a+b)}`, 'var(--gold)', 12))
  });

  /* ── Step 2: area equation ── */
  steps.push({
    descAr: `مساحة المربع الكبير = (أ+ب)² = ${(a+b)*(a+b)}\n4 مثلثات: ${4} × ½×${a}×${b} = ${2*a*b}\nإذن ج² = ${(a+b)*(a+b)} − ${2*a*b} = ${a*a+b*b}`,
    descEn: `Big square = (a+b)² = ${(a+b)*(a+b)}\n4 triangles = 4×½×${a}×${b} = ${2*a*b}\nSo c² = ${(a+b)*(a+b)} − ${2*a*b} = ${a*a+b*b}`,
    svg: W(bigSq + T1+T2+T3+T4 + cSq +
      txt(midC[0], midC[1]+5, `ج² = ${a*a+b*b}`, '#4A7FBD', 14) +
      txt(ox+S/2, oy-14, `(${a}+${b})² = ${(a+b)*(a+b)}`, 'var(--gold)', 12) +
      txt(ox+S/2, oy+S+18, `4 × ½×${a}×${b} = ${2*a*b}`, tStr, 12) +
      txt(ox+S/2, oy+S+36, `ج² = ${(a+b)*(a+b)}−${2*a*b} = ${a*a+b*b}`, '#4A7FBD', 13))
  });

  /* ── Step 3: expand (a+b)² algebraically ── */
  steps.push({
    descAr: `توسيع المربع: (أ+ب)² = أ² + 2أب + ب²\nمساحة المثلثات = 2أب\nبطرح المتشابهات: ج² = أ² + ب²   ✓`,
    descEn: `Expanding: (a+b)² = a² + 2ab + b²\nTriangle area = 2ab\nCancelling: c² = a² + b²   ✓`,
    svg: W(bigSq + T1+T2+T3+T4 + cSq +
      txt(midC[0], midC[1]+5, `ج²`, '#4A7FBD', 15) +
      txt(200, 370, `(أ+ب)² − 2أب = أ² + 2أب + ب² − 2أب = أ² + ب²`, 'var(--gold)', 11) +
      txt(200, 390, `∴ ج² = أ² + ب²   ✓`, 'var(--crimson)', 13))
  });

  /* ── Step 4: show a², b², c² as separate squares ── */
  const pad = 16;
  const aSqX = ox, aSqY = oy + S + pad + 10;
  const bSqX = ox + A + pad, bSqY = aSqY;
  const cSqY = oy + S + pad + 10;

  /* If there's no room, just show numeric result */
  steps.push({
    descAr: `أ² = ${a}² = ${a*a}،   ب² = ${b}² = ${b*b}\nأ² + ب² = ${a*a} + ${b*b} = ${a*a+b*b} = ج²\nج = √${a*a+b*b} = ${c.toFixed(4)}`,
    descEn: `a² = ${a}² = ${a*a},   b² = ${b}² = ${b*b}\na² + b² = ${a*a} + ${b*b} = ${a*a+b*b} = c²\nc = √${a*a+b*b} = ${c.toFixed(4)}`,
    svg: W(`
      <rect x="${ox}" y="${oy}" width="${A}" height="${A}"
        fill="rgba(74,127,189,0.2)" stroke="#4A7FBD" stroke-width="2"/>
      ${txt(ox+A/2, oy+A/2+5, `أ²=${a*a}`, '#4A7FBD', 14)}
      <rect x="${ox+A+20}" y="${oy}" width="${B}" height="${B}"
        fill="rgba(139,32,32,0.2)" stroke="#8B2020" stroke-width="2"/>
      ${txt(ox+A+20+B/2, oy+B/2+5, `ب²=${b*b}`, '#8B2020', 14)}
      <rect x="${ox}" y="${oy+Math.max(A,B)+30}" width="${C}" height="${C}"
        fill="rgba(194,164,109,0.2)" stroke="var(--gold)" stroke-width="2"/>
      ${txt(ox+C/2, oy+Math.max(A,B)+30+C/2+5, `ج²=${Math.round(c*c)}`, 'var(--gold)', 14)}
      ${txt(200, oy+Math.max(A,B)+30+C+22, `أ²+ب² = ${a*a}+${b*b} = ${a*a+b*b} = ج²   ✓`, 'var(--crimson)', 13)}`)
  });

  return steps;
}
