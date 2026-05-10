/* ════════════════════════════════════════════
   VISUAL MATHEMATICS Classical Geometry
   1. Pythagorean Theorem (مبرهنة فيثاغورس)
════════════════════════════════════════════ */

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
