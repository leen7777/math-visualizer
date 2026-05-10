/* ════════════════════════════════════════════
   VISUAL MATHEMATICS Al-Kashi's π (1424 CE)
   Risāla al-muḥīṭiyya — "Treatise on the Circumference"

   Method: inscribed regular polygons in a unit circle,
   starting with the hexagon (s_6 = R) and doubling the
   number of sides 27 times to n = 3·2²⁸ = 805,306,368.

   Half-angle recurrence (numerically stable form,
   avoiding catastrophic cancellation):
       s_{2n} = s_n / √(2 + √(4R² − s_n²))      with R = 1

   Then  π ≈ (n · s_n) / (2R).
════════════════════════════════════════════ */

let kashiSteps = [], kashiIdx = 0;

function startKashi() {
  kashiSteps = buildKashiSteps();
  kashiIdx = 0;
  renderKashi();
  setNav('kashi', kashiSteps, kashiIdx);
}
function navKashi(dir) {
  kashiIdx = Math.max(0, Math.min(kashiSteps.length - 1, kashiIdx + dir));
  renderKashi();
  setNav('kashi', kashiSteps, kashiIdx);
}
function renderKashi() {
  if (!kashiSteps.length) return;
  const s = kashiSteps[kashiIdx];
  document.getElementById('kashi-desc').innerHTML =
    `<span class="ar-text">${s.descAr}</span><span class="en-text">${s.descEn}</span>`;
  document.getElementById('kashi-viz').innerHTML = s.svg;
}

function buildKashiSteps() {
  const cx = 220, cy = 220, R = 170;

  /* ── Run all 28 iterations once (stable recurrence) ── */
  const iters = [];
  let s = 1;         // side length with R = 1 → s_6 = 1
  let n = 6;
  for (let k = 0; k <= 27; k++) {
    iters.push({ k, n, s, perim: n * s, piEst: (n * s) / 2 });
    if (k < 27) {
      s = s / Math.sqrt(2 + Math.sqrt(4 - s * s));
      n *= 2;
    }
  }

  /* ── SVG helpers ── */
  const W  = body => `<svg viewBox="0 0 440 460" style="width:100%;max-height:440px">${body}</svg>`;
  const TXT = (x, y, str, col, sz = 13, anchor = 'middle', family = 'Courier Prime,monospace') =>
    `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="${anchor}"
      font-family="${family}" font-size="${sz}" fill="${col}">${str}</text>`;

  const circle = `<circle cx="${cx}" cy="${cy}" r="${R}"
    fill="rgba(74,127,189,0.05)" stroke="#4A7FBD" stroke-width="1.6"/>`;
  const center = `<circle cx="${cx}" cy="${cy}" r="2.6" fill="var(--text2)"/>`;

  function polyVerts(n) {
    const out = [];
    for (let j = 0; j < n; j++) {
      const a = -Math.PI / 2 + (2 * Math.PI * j) / n;
      out.push([cx + R * Math.cos(a), cy + R * Math.sin(a)]);
    }
    return out;
  }

  function polygonSvg(n, { showVertices = true, highlightSide = true } = {}) {
    const v = polyVerts(n);
    const pts = v.map(p => `${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(' ');
    let body = `<polygon points="${pts}" fill="rgba(194,164,109,0.12)"
      stroke="var(--gold-dark)" stroke-width="1.8"/>`;

    if (highlightSide) {
      // Highlight one edge to make "the side s_n" tangible
      body += `<line x1="${v[0][0].toFixed(2)}" y1="${v[0][1].toFixed(2)}"
        x2="${v[1][0].toFixed(2)}" y2="${v[1][1].toFixed(2)}"
        stroke="var(--crimson)" stroke-width="3"/>`;
    }
    if (showVertices && n <= 96) {
      for (const p of v) {
        body += `<circle cx="${p[0].toFixed(2)}" cy="${p[1].toFixed(2)}"
          r="2.6" fill="var(--gold)" stroke="#1C2B20" stroke-width="0.9"/>`;
      }
    }
    return body;
  }

  function radiiSvg(n) {
    // Two radii to the highlighted edge endpoints — shows the central angle
    const v = polyVerts(n);
    return `
      <line x1="${cx}" y1="${cy}" x2="${v[0][0].toFixed(2)}" y2="${v[0][1].toFixed(2)}"
        stroke="#3A6A9E" stroke-width="1.2" stroke-dasharray="4,3" opacity="0.75"/>
      <line x1="${cx}" y1="${cy}" x2="${v[1][0].toFixed(2)}" y2="${v[1][1].toFixed(2)}"
        stroke="#3A6A9E" stroke-width="1.2" stroke-dasharray="4,3" opacity="0.75"/>`;
  }

  function infoBox(n, sVal, perim, piEst) {
    const piRef = Math.PI;
    const diff  = Math.abs(piEst - piRef);
    const digits = diff > 0 ? Math.max(0, Math.floor(-Math.log10(diff))) : 16;
    const rows = [
      ['n',    n.toLocaleString('en-US')],
      ['sₙ', sVal.toFixed(15)],
      ['n·sₙ', perim.toFixed(15)],
      ['π ≈ n·sₙ/2', piEst.toFixed(15)],
      ['correct digits', `${digits}`],
    ];
    let y = 415;
    let body = '';
    rows.forEach((r, i) => {
      body += TXT(20, y - (rows.length - 1 - i) * 16,
        `${r[0].padEnd(18, ' ')}= ${r[1]}`,
        i === 3 ? 'var(--crimson)' : 'var(--text2)', 12, 'start');
    });
    return body;
  }

  const steps = [];

  /* ── Step 0: Introduction ── */
  {
    const it = iters[0];
    const v  = polyVerts(6);
    const tagP = TXT(cx, cy + R + 28,
      `n = 6,  s₆ = R,  perimeter = 6R  →  π ≈ 3`,
      'var(--gold-dark)', 13);

    steps.push({
      descAr:
        `بدأ الكاشي من سداسي منتظم محاط بدائرة نصف قطرها R. ضلع السداسي يساوي نصف القطر بالضبط (s₆ = R)، ` +
        `فيكون محيطه 6R، وبما أن محيط الدائرة 2πR فإن π ≈ 6R / (2R) = 3 كتقدير أوّلي خشن. ` +
        `الفكرة: ضاعف عدد الأضلاع تكراراً وراقِب اقتراب المضلّع من الدائرة.`,
      descEn:
        `Al-Kashi began with a regular hexagon inscribed in a circle of radius R. The hexagon's side equals R exactly (s₆ = R), ` +
        `so its perimeter is 6R, giving the rough first estimate π ≈ 6R/(2R) = 3. ` +
        `Idea: keep doubling the number of sides and watch the polygon close in on the circle.`,
      svg: W(circle + center + polygonSvg(6) + radiiSvg(6) +
        TXT(cx, cy - R - 12, 'محيط الدائرة = 2πR', 'var(--olive)', 13, 'middle', 'Amiri,serif') +
        tagP)
    });
  }

  /* ── Step 1: Geometric derivation of the half-angle recurrence ── */
  {
    // Wedge drawn at θ = 60° (concrete: hexagon → 12-gon). The argument is general.
    const theta  = Math.PI / 3;          // 60°
    const halfTh = theta / 2;            // 30°
    const dcx = 220, dcy = 200, dR = 140;

    const aL = -Math.PI / 2 - halfTh;
    const aR = -Math.PI / 2 + halfTh;
    const pL  = [dcx + dR * Math.cos(aL), dcy + dR * Math.sin(aL)];
    const pR  = [dcx + dR * Math.cos(aR), dcy + dR * Math.sin(aR)];
    const mid = [(pL[0] + pR[0]) / 2, (pL[1] + pR[1]) / 2];

    // Right-angle marker — small square hugging the right-triangle corner at the chord midpoint
    const sq = 8;
    const raMarker =
      `<polyline points="${(mid[0]+sq).toFixed(2)},${mid[1].toFixed(2)} `
      + `${(mid[0]+sq).toFixed(2)},${(mid[1]+sq).toFixed(2)} `
      + `${mid[0].toFixed(2)},${(mid[1]+sq).toFixed(2)}"
         fill="none" stroke="var(--text2)" stroke-width="1.1"/>`;

    // Angle arc at center: from the perpendicular (straight up) to the right radius
    const arcR = 26;
    const arcStart = `${dcx} ${dcy - arcR}`;
    const arcEnd   = `${(dcx + arcR * Math.cos(aR)).toFixed(2)} ${(dcy + arcR * Math.sin(aR)).toFixed(2)}`;
    const angleArc =
      `<path d="M ${arcStart} A ${arcR} ${arcR} 0 0 1 ${arcEnd}"
        fill="none" stroke="var(--olive)" stroke-width="1.4"/>`;

    const dia =
      `<circle cx="${dcx}" cy="${dcy}" r="${dR}"
        fill="rgba(74,127,189,0.05)" stroke="#4A7FBD" stroke-width="1.4"/>`
      + `<circle cx="${dcx}" cy="${dcy}" r="2.6" fill="var(--text2)"/>`
      // two radii forming the wedge
      + `<line x1="${dcx}" y1="${dcy}" x2="${pL[0].toFixed(2)}" y2="${pL[1].toFixed(2)}"
          stroke="var(--gold-dark)" stroke-width="1.6"/>`
      + `<line x1="${dcx}" y1="${dcy}" x2="${pR[0].toFixed(2)}" y2="${pR[1].toFixed(2)}"
          stroke="var(--gold-dark)" stroke-width="1.6"/>`
      // chord sₙ (full)
      + `<line x1="${pL[0].toFixed(2)}" y1="${pL[1].toFixed(2)}"
          x2="${pR[0].toFixed(2)}" y2="${pR[1].toFixed(2)}"
          stroke="var(--crimson)" stroke-width="2"/>`
      // perpendicular from center to chord midpoint (the height of the right triangle)
      + `<line x1="${dcx}" y1="${dcy}" x2="${mid[0].toFixed(2)}" y2="${mid[1].toFixed(2)}"
          stroke="var(--text2)" stroke-width="1.2" stroke-dasharray="4,3"/>`
      // emphasize the half-chord we will label sₙ/2
      + `<line x1="${mid[0].toFixed(2)}" y1="${mid[1].toFixed(2)}"
          x2="${pR[0].toFixed(2)}" y2="${pR[1].toFixed(2)}"
          stroke="var(--crimson)" stroke-width="3.2"/>`
      + raMarker
      + angleArc
      // labels
      + TXT(dcx + 38, dcy - 80, '1',    'var(--gold-dark)', 14, 'middle')
      + TXT(mid[0] + 35, mid[1] - 8, 'sₙ/2', 'var(--crimson)',  13, 'middle')
      + TXT(dcx + 12, dcy - 30, 'θ/2',  'var(--olive)',    12, 'start')
      // small caption above the wedge
      + TXT(dcx, 32,
          'central angle θ subtends chord sₙ',
          'var(--text2)', 12, 'middle', 'Lora,serif')
      + TXT(dcx, 50,
          'الزاوية المركزية θ تقابل الوتر sₙ',
          'var(--text2)', 13, 'middle', 'Amiri,serif');

    // Algebraic derivation rendered as HTML below the diagram
    const deriv = `
      <div style="padding:14px 18px;font-family:'Courier Prime',monospace;
                  font-size:12.5px;line-height:1.7;color:var(--text2);
                  background:var(--surface2);border-radius:6px;
                  border:1px solid var(--border-soft);margin-top:8px">
        <div style="display:grid;grid-template-columns:24px 1fr;column-gap:10px;row-gap:10px">
          <div style="color:var(--gold-dark);font-weight:700">①</div>
          <div>
            <span class="ar-text" style="font-family:Amiri,serif">في المثلث القائم: </span>
            <span class="en-text" style="font-family:'Lora',serif;font-style:italic">In the right triangle: </span>
            sin(θ/2) = (sₙ/2)/1 &nbsp;→&nbsp; <b>sₙ = 2·sin(θ/2)</b>
          </div>

          <div style="color:var(--gold-dark);font-weight:700">②</div>
          <div>
            <span class="ar-text" style="font-family:Amiri,serif">المضاعفة تنصِّف الزاوية: </span>
            <span class="en-text" style="font-family:'Lora',serif;font-style:italic">Doubling halves the angle: </span>
            <b>s₂ₙ = 2·sin(θ/4)</b>
          </div>

          <div style="color:var(--gold-dark);font-weight:700">③</div>
          <div>
            <span class="ar-text" style="font-family:Amiri,serif">متطابقة نصف الزاوية:</span>
            <span class="en-text" style="font-family:'Lora',serif;font-style:italic">Half-angle identity:</span><br>
            cos(θ/2) = 1 − 2·sin²(θ/4) = 1 − ½·s₂ₙ²
          </div>

          <div style="color:var(--gold-dark);font-weight:700">④</div>
          <div>
            <span class="ar-text" style="font-family:Amiri,serif">ومن فيثاغورس:</span>
            <span class="en-text" style="font-family:'Lora',serif;font-style:italic">And from Pythagoras:</span><br>
            cos(θ/2) = √(1 − sin²(θ/2)) = ½·√(4 − sₙ²)
          </div>

          <div style="color:var(--gold-dark);font-weight:700">⑤</div>
          <div>
            <span class="ar-text" style="font-family:Amiri,serif">بمساواة ③ و ④:</span>
            <span class="en-text" style="font-family:'Lora',serif;font-style:italic">Equate ③ and ④:</span><br>
            s₂ₙ² = 2 − √(4 − sₙ²) &nbsp;→&nbsp;
            <b style="color:var(--crimson)">s₂ₙ = √(2 − √(4 − sₙ²))</b>
          </div>

          <div style="color:var(--gold-dark);font-weight:700">⑥</div>
          <div>
            <span class="ar-text" style="font-family:Amiri,serif">بضرب البسط والمقام في المرافق (لتجنّب الطرح بين متقاربين):</span>
            <span class="en-text" style="font-family:'Lora',serif;font-style:italic">Rationalize (to avoid catastrophic cancellation):</span><br>
            <b style="color:var(--crimson)">s₂ₙ = sₙ / √(2 + √(4 − sₙ²))</b>
          </div>
        </div>
      </div>`;

    const html =
      `<svg viewBox="0 0 440 360" style="width:100%;max-height:360px">${dia}</svg>`
      + deriv;

    steps.push({
      descAr:
        `الاشتقاق الهندسي للصيغة. داخل القطاع المحصور بين نصفَي قطر، أنزِل عموداً من المركز إلى منتصف الوتر sₙ. ` +
        `يُكوِّن هذا مثلثاً قائم الزاوية وتره نصف القطر (=1)، وضلعه القائم نصف الوتر sₙ/2، وزاويته عند المركز θ/2. ` +
        `إذن sin(θ/2) = sₙ/2. عند مضاعفة عدد الأضلاع تنتصف الزاوية، فيكون s₂ₙ = 2·sin(θ/4)، ` +
        `وبتطبيق متطابقة نصف الزاوية على هاتين العلاقتين تظهر الصيغة التراجعية. ` +
        `الصورة الأخيرة (المضروبة في المرافق) تتجنّب الطرح بين عددين متقاربين، فتحافظ على الدقة عند مئات المضاعفات.`,
      descEn:
        `Geometric derivation. Inside the wedge between two radii, drop a perpendicular from the center to the midpoint of the chord sₙ. ` +
        `This makes a right triangle: hypotenuse = radius = 1, opposite side = sₙ/2, central angle = θ/2. ` +
        `So sin(θ/2) = sₙ/2. Doubling the number of sides halves the angle, giving s₂ₙ = 2·sin(θ/4); ` +
        `applying the half-angle identity to these two relations produces the recurrence. ` +
        `The rationalized form avoids subtracting two nearly-equal numbers — essential for keeping precision over hundreds of doublings.`,
      svg: html
    });
  }

  /* ── Steps 2..8: visual doublings n = 12, 24, 48, 96, 192, 384, 768 ── */
  for (let k = 1; k <= 7; k++) {
    const it = iters[k];
    const prev = iters[k - 1];

    const formulaTop = `s₂ₙ = sₙ / √(2 + √(4 − sₙ²))`;
    const numLine =
      `sₙ = ${prev.s.toFixed(12)}   →   s₂ₙ = ${it.s.toFixed(12)}`;

    const piLine =
      `π ≈ ${it.n} · ${it.s.toFixed(10)} / 2 = ${it.piEst.toFixed(12)}`;

    // Faint outline of the previous polygon — shows what is being doubled.
    const vPrev = polyVerts(prev.n);
    const prevPts = vPrev.map(p => `${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(' ');
    const prevPolyFaint =
      `<polygon points="${prevPts}" fill="none" stroke="var(--gold-dark)"
        stroke-width="1.2" stroke-dasharray="4,3" opacity="0.45"/>`;

    // The newly-inserted vertex sits on the arc between two old vertices —
    // it is currV[1] (the midpoint of the old arc from prevV[0] to prevV[1]).
    const vCurr = polyVerts(it.n);
    const insertedVertex =
      `<circle cx="${vCurr[1][0].toFixed(2)}" cy="${vCurr[1][1].toFixed(2)}"
        r="4.2" fill="var(--crimson)" stroke="#1C2B20" stroke-width="0.9"/>`;

    // Direct labels on the geometry — only readable while sides are large enough.
    let geomLabels = '';
    if (it.n <= 48) {
      const labelAt = (ax, ay, bx, by, txt, col, off) => {
        const mx = (ax + bx) / 2, my = (ay + by) / 2;
        let nx = mx - cx, ny = my - cy;
        const nl = Math.hypot(nx, ny) || 1;
        nx /= nl; ny /= nl;
        return TXT(mx + nx * off, my + ny * off + 4, txt, col, 14);
      };
      // Old side sₙ: the previous polygon's first edge — currV[0] to currV[2].
      geomLabels += labelAt(
        vCurr[0][0], vCurr[0][1], vCurr[2][0], vCurr[2][1],
        'sₙ', 'var(--gold-dark)', 20);
      // New side s₂ₙ: currV[0] to currV[1] (the red highlighted edge).
      geomLabels += labelAt(
        vCurr[0][0], vCurr[0][1], vCurr[1][0], vCurr[1][1],
        's₂ₙ', 'var(--crimson)', 16);
    }

    steps.push({
      descAr:
        `المضاعفة ${k}: عدد الأضلاع الآن n = ${it.n.toLocaleString('en-US')}. ` +
        `الخطّ المتقطّع يُظهر المضلّع السابق، والنقطة الحمراء هي الرأس الجديد المُدرَج عند منتصف القوس. ` +
        `يُشتقّ الضلع الجديد s₂ₙ من الضلع السابق sₙ بصيغة نصف الزاوية، بصورة تتجنّب عمليات الطرح المُفقِدة للدقة. ` +
        `فيصبح التقدير π ≈ ${it.piEst.toFixed(12)} (القيمة الحقيقية لـ π = ${Math.PI.toFixed(12)}).`,
      descEn:
        `Doubling ${k}: now n = ${it.n.toLocaleString('en-US')} sides. ` +
        `The dashed outline is the previous polygon; the red dot is the new vertex inserted at the midpoint of the old arc. ` +
        `The new side s₂ₙ is derived from the old side sₙ by the half-angle relation, in a form that avoids precision-killing subtraction. ` +
        `Estimate is now π ≈ ${it.piEst.toFixed(12)}  (true π = ${Math.PI.toFixed(12)}).`,
      svg: W(circle + center + prevPolyFaint + polygonSvg(it.n) + radiiSvg(it.n) +
        insertedVertex + geomLabels +
        TXT(cx, cy - R - 14, formulaTop, 'var(--olive)', 12) +
        TXT(cx, cy + R + 22, numLine, 'var(--text2)', 11) +
        TXT(cx, cy + R + 40, piLine, 'var(--crimson)', 13))
    });
  }

  /* ── Step 8: Numerical table — all 28 doublings ── */
  {
    const lines = iters.map(it => {
      const piRef = Math.PI;
      const diff  = Math.abs(it.piEst - piRef);
      const dig   = diff > 0 ? Math.max(0, Math.floor(-Math.log10(diff))) : 16;
      const nStr  = it.n.toLocaleString('en-US').padStart(13, ' ');
      const piStr = it.piEst.toFixed(15);
      return `k=${String(it.k).padStart(2, ' ')}   n=${nStr}   π ≈ ${piStr}   (${dig} digits)`;
    });

    // Render as monospace text inside an SVG-like card.
    // Easier: produce raw HTML pre block (still inside #kashi-viz).
    const html = `
      <div style="padding:16px 18px;font-family:'Courier Prime',monospace;
                  font-size:12px;line-height:1.55;color:var(--text2);
                  background:var(--surface2);border-radius:8px;
                  border:1px solid var(--border-soft);overflow:auto">
        <div style="font-family:Amiri,serif;font-size:14px;color:var(--crimson);
                    margin-bottom:10px;text-align:center" class="ar-text">
          جدول المضاعفات الثماني والعشرين
        </div>
        <div style="font-family:'Lora',serif;font-size:14px;color:var(--crimson);
                    margin-bottom:10px;text-align:center;font-style:italic" class="en-text">
          The 28 doublings — convergence to π
        </div>
        <pre style="margin:0;white-space:pre;direction:ltr;text-align:left">${lines.join('\n')}</pre>
      </div>`;

    steps.push({
      descAr:
        `هذا جدول الـ 28 مضاعفة. يبدأ من السداسي (n = 6) وينتهي عند n = 3·2²⁸ = 805,306,368 ضلعاً. ` +
        `لاحظ كيف تتضاعف عدد الخانات الصحيحة في كل مضاعفتين تقريباً، حتى نصل إلى الحد الأقصى لدقة الحاسوب.`,
      descEn:
        `Here is the full table of 28 doublings, from the hexagon (n = 6) to n = 3·2²⁸ = 805,306,368 sides. ` +
        `The number of correct digits roughly doubles every two iterations until floating-point precision saturates.`,
      svg: html
    });
  }

  /* ── Step 9: Al-Kashi's actual published 16-digit result ── */
  {
    const piKashi = '3.1415926535897932';
    const html = `
      <div style="padding:24px 22px;color:var(--text2);background:var(--surface2);
                  border-radius:8px;border:1px solid var(--border-soft)">
        <div style="font-family:Amiri,serif;font-size:18px;color:var(--crimson);
                    text-align:center;margin-bottom:8px" class="ar-text">
          نتيجة الكاشي المنشورة (1424م)
        </div>
        <div style="font-family:'Lora',serif;font-size:18px;color:var(--crimson);
                    text-align:center;margin-bottom:8px;font-style:italic" class="en-text">
          Al-Kashi's published result (1424 CE)
        </div>

        <div style="text-align:center;margin:18px 0">
          <div style="font-family:'Courier Prime',monospace;font-size:26px;
                      color:var(--text);letter-spacing:1px">
            2π &nbsp;=&nbsp; ${(2 * Math.PI).toFixed(16)}
          </div>
          <div style="font-family:'Courier Prime',monospace;font-size:26px;
                      color:var(--crimson);letter-spacing:1px;margin-top:6px">
            π &nbsp;&nbsp;=&nbsp; ${piKashi}
          </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;
                    font-size:13px;line-height:1.6;margin-top:18px">
          <div>
            <div style="font-family:Amiri,serif;color:var(--olive);font-weight:700"
                 class="ar-text">السابقون</div>
            <div style="font-family:'Lora',serif;color:var(--olive);font-weight:600;
                        font-style:italic" class="en-text">Previous record</div>
            <div style="font-family:'Courier Prime',monospace;font-size:12px;margin-top:4px">
              <span class="ar-text">آريابهاتا (~499م): 4 خانات</span>
              <span class="en-text">Āryabhaṭa (~499 CE): 4 digits</span>
            </div>
            <div style="font-family:'Courier Prime',monospace;font-size:12px">
              <span class="ar-text">تسو تشونغ-تشي (~480م): 7 خانات</span>
              <span class="en-text">Zǔ Chōngzhī (~480 CE): 7 digits</span>
            </div>
            <div style="font-family:'Courier Prime',monospace;font-size:12px">
              <span class="ar-text">مادهافا (~1400م): 10 خانات</span>
              <span class="en-text">Mādhava (~1400 CE): 10 digits</span>
            </div>
          </div>
          <div>
            <div style="font-family:Amiri,serif;color:var(--olive);font-weight:700"
                 class="ar-text">اللاحقون</div>
            <div style="font-family:'Lora',serif;color:var(--olive);font-weight:600;
                        font-style:italic" class="en-text">Surpassed by</div>
            <div style="font-family:'Courier Prime',monospace;font-size:12px;margin-top:4px">
              <span class="ar-text">رومن فان كولن (1596م): 20 خانة</span>
              <span class="en-text">Ludolph van Ceulen (1596): 20 digits</span>
            </div>
            <div style="font-family:'Courier Prime',monospace;font-size:12px">
              <span class="ar-text">— أي بعد 172 عاماً</span>
              <span class="en-text">— a 172-year wait</span>
            </div>
          </div>
        </div>

        <div style="margin-top:20px;padding-top:14px;border-top:1px solid var(--border-soft);
                    font-size:13px;line-height:1.7">
          <span class="ar-text" style="font-family:Amiri,serif">
            حدّد الكاشي مسبقاً الدقة المطلوبة: محيط دائرة قطرها يساوي قطر الكون
            بخطأ لا يتجاوز عرض شعرة فرس. ثم أثبت أن 28 مضاعفة (3·2²⁸ ضلعاً) كافية لذلك.
            هذا أوّل مثال موثَّق في التاريخ على تحديد الدقّة هندسيّاً قبل بدء الحساب.
          </span>
          <span class="en-text" style="font-family:'Lora',serif">
            Al-Kashi <em>specified the precision in advance</em>: he wanted the circumference of a circle
            with diameter equal to the size of the universe to err by less than the width of a horse's hair.
            He then proved 28 doublings (3·2²⁸ sides) suffice. This is the earliest documented example in
            history of fixing numerical precision <em>before</em> starting the computation.
          </span>
        </div>
      </div>`;

    steps.push({
      descAr:
        `أعلن الكاشي قيمة 2π بستة عشر منزلة عشرية صحيحة في رسالته «الرسالة المحيطية» (سمرقند، 1424م). ` +
        `ظلّ هذا الرقم القياسي العالمي مدّة 172 عاماً قبل أن يتجاوزه الهولندي رومن فان كولن.`,
      descEn:
        `Al-Kashi published 2π to 16 correct decimal places in his "Treatise on the Circumference" (Samarkand, 1424 CE). ` +
        `This world record stood for 172 years until Ludolph van Ceulen broke it.`,
      svg: html
    });
  }

  return steps;
}
