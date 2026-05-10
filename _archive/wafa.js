/* ════════════════════════════════════════════
   VISUAL MATHEMATICS Abū al-Wafāʾ al-Būzjānī
   Kitāb fīmā yaḥtāju ilayhi al-kuttāb wa-l-ʿummāl
   min ʿilm al-ḥisāb · Baghdad, ~975 CE

   Identities demonstrated:
     sin(α+β) = sin α cos β + cos α sin β
     cos(α+β) = cos α cos β − sin α sin β
     sin 2α    = 2 sin α cos α
     cos 2α    = 1 − 2 sin²α
     sin(α/2) = √((1 − cos α)/2)

   Abū al-Wafāʾ also defined tan, cot, sec, csc as
   first-class functions on the unit circle, replacing
   the older shadow-table ratios.
════════════════════════════════════════════ */

let wafSteps = [], wafIdx = 0;

function startWaf() {
  const a = clampWafAngle(parseFloat(document.getElementById('waf-a').value));
  const b = clampWafAngle(parseFloat(document.getElementById('waf-b').value));
  document.getElementById('waf-a').value = a;
  document.getElementById('waf-b').value = b;
  wafSteps = buildWafSteps(a, b);
  wafIdx = 0;
  renderWaf();
  setNav('waf', wafSteps, wafIdx);
}
function navWaf(dir) {
  wafIdx = Math.max(0, Math.min(wafSteps.length - 1, wafIdx + dir));
  renderWaf();
  setNav('waf', wafSteps, wafIdx);
}
function renderWaf() {
  if (!wafSteps.length) return;
  const s = wafSteps[wafIdx];
  document.getElementById('waf-desc').innerHTML =
    `<span class="ar-text">${s.descAr}</span><span class="en-text">${s.descEn}</span>`;
  document.getElementById('waf-viz').innerHTML = s.svg;
}

function clampWafAngle(v) {
  if (!isFinite(v)) return 30;
  return Math.max(5, Math.min(80, Math.round(v)));
}

function buildWafSteps(aDeg, bDeg) {
  const cx = 230, cy = 250, R = 180;
  const aRad = aDeg * Math.PI / 180;
  const bRad = bDeg * Math.PI / 180;
  const sumRad = aRad + bRad;
  const sumDeg = aDeg + bDeg;

  const sinA = Math.sin(aRad), cosA = Math.cos(aRad);
  const sinB = Math.sin(bRad), cosB = Math.cos(bRad);
  const sinSum = Math.sin(sumRad), cosSum = Math.cos(sumRad);

  const fmt = v => {
    const s = v.toFixed(6);
    return v >= 0 ? ' ' + s : s;
  };

  /* ── SVG primitives ── */
  const W = body => `<svg viewBox="0 0 460 500" style="width:100%;max-height:480px">${body}</svg>`;
  const TXT = (x, y, str, col, sz = 13, anchor = 'middle', family = 'Courier Prime,monospace') =>
    `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="${anchor}"
      font-family="${family}" font-size="${sz}" fill="${col}">${str}</text>`;

  // Unit circle: Y points down in SVG so flip the trig Y.
  const px = ang => cx + R * Math.cos(ang);
  const py = ang => cy - R * Math.sin(ang);

  const circle = `<circle cx="${cx}" cy="${cy}" r="${R}"
    fill="rgba(74,127,189,0.05)" stroke="#4A7FBD" stroke-width="1.4"/>`;
  const axes =
    `<line x1="${cx - R - 14}" y1="${cy}" x2="${cx + R + 14}" y2="${cy}"
       stroke="var(--faint)" stroke-width="0.8"/>` +
    `<line x1="${cx}" y1="${cy - R - 14}" x2="${cx}" y2="${cy + R + 14}"
       stroke="var(--faint)" stroke-width="0.8"/>`;
  const center = `<circle cx="${cx}" cy="${cy}" r="2.6" fill="var(--text2)"/>`;

  function arc(angStart, angEnd, r, stroke) {
    const x1 = cx + r * Math.cos(angStart), y1 = cy - r * Math.sin(angStart);
    const x2 = cx + r * Math.cos(angEnd),   y2 = cy - r * Math.sin(angEnd);
    const large = (angEnd - angStart) > Math.PI ? 1 : 0;
    return `<path d="M ${x1.toFixed(2)} ${y1.toFixed(2)}
      A ${r} ${r} 0 ${large} 0 ${x2.toFixed(2)} ${y2.toFixed(2)}"
      fill="none" stroke="${stroke}" stroke-width="1.6"/>`;
  }

  function ray(ang, label, color, labelCol = color) {
    const ex = px(ang), ey = py(ang);
    const lx = cx + (R + 22) * Math.cos(ang);
    const ly = cy - (R + 22) * Math.sin(ang);
    return `
      <line x1="${cx}" y1="${cy}" x2="${ex.toFixed(2)}" y2="${ey.toFixed(2)}"
        stroke="${color}" stroke-width="2"/>
      <circle cx="${ex.toFixed(2)}" cy="${ey.toFixed(2)}" r="3.2" fill="${color}"/>
      ${TXT(lx, ly, label, labelCol, 13, 'middle', 'Lora,serif')}`;
  }

  function box(html) {
    return `
      <div style="padding:18px 20px;color:var(--text2);background:var(--surface2);
                  border-radius:8px;border:1px solid var(--border-soft);
                  font-family:'Courier Prime',monospace;font-size:13.5px;line-height:1.7">
        ${html}
      </div>`;
  }

  const steps = [];

  /* ── Step 0: Introduction & sine/cosine on the unit circle ── */
  {
    const sinSeg = `<line x1="${px(aRad).toFixed(2)}" y1="${py(aRad).toFixed(2)}"
      x2="${px(aRad).toFixed(2)}" y2="${cy}" stroke="var(--crimson)" stroke-width="2.4"/>`;
    const cosSeg = `<line x1="${cx}" y1="${cy}"
      x2="${px(aRad).toFixed(2)}" y2="${cy}" stroke="#2A4A5E" stroke-width="2.4"/>`;

    const sinLab = TXT((px(aRad) + 16), (py(aRad) + cy) / 2 + 4,
      `sin α = ${sinA.toFixed(4)}`, 'var(--crimson)', 13, 'start', 'Lora,serif');
    const cosLab = TXT((cx + px(aRad)) / 2, cy + 18,
      `cos α = ${cosA.toFixed(4)}`, '#2A4A5E', 13, 'middle', 'Lora,serif');
    const aArc  = arc(0, aRad, 32, 'var(--olive)');
    const aLab  = TXT(cx + 44, cy - 10, `α = ${aDeg}°`, 'var(--olive)', 13, 'start', 'Lora,serif');

    steps.push({
      descAr:
        `<strong>أبو الوفاء البوزجاني</strong> (940–998م) من أكبر علماء بيت الحكمة في بغداد. ` +
        `في كتابه «المجسطي» جدوَل الجيب وجيب التمام بدقّة 1/60⁸، وعرّف الظِّلّ (tan) والقاطع (sec) ` +
        `والمتمّمات (cot, csc) كدوال مستقلّة على دائرة الوحدة، مستبدلاً بذلك جداول الظلّ التقريبية. ` +
        `نبدأ بدائرة الوحدة: كل زاوية α عند المركز يقابلها نصف وتر يساوي sin α، ` +
        `ومسقط على المحور الأفقي يساوي cos α.`,
      descEn:
        `<strong>Abū al-Wafāʾ al-Būzjānī</strong> (940–998 CE) was a giant of the House of Wisdom in Baghdad. ` +
        `His book <em>Almagest</em> tabulated sine and cosine to 1/60⁸ precision and, crucially, defined tangent, ` +
        `cotangent, secant and cosecant as <em>functions on the unit circle</em>, replacing the older shadow-length ratios. ` +
        `We start on the unit circle: every central angle α has a half-chord equal to sin α and a horizontal ` +
        `projection equal to cos α.`,
      svg: W(circle + axes + center + ray(aRad, '', 'var(--crimson)') +
        sinSeg + cosSeg + sinLab + cosLab + aArc + aLab +
        TXT(cx, cy + R + 36, 'unit circle · R = 1', 'var(--gold-dark)', 12))
    });
  }

  /* ── Construction shared by Steps 1 & 2 ─────────────────────────────
     Points (SVG coordinates, y-axis flipped):
        O  origin
        A  on circle at angle α          (defines ray OA)
        P  on circle at angle α+β
        Q  foot of perpendicular from P onto ray OA
        N  foot of perpendicular from P onto x-axis
        M  foot of perpendicular from Q onto x-axis
        R  intersection of horizontal through Q with vertical PN

     Two right triangles do all the work:
        △OPQ : right angle at Q, hypotenuse OP = 1, angle β at O
                ⇒  PQ = sin β,  OQ = cos β
        △PQR : right angle at R, hypotenuse PQ = sin β, angle α at P
                (PQ ⊥ OA and PR ⊥ x-axis ⇒ angle QPR = α)
                ⇒  PR = sin β · cos α,  QR = sin β · sin α
        △OQM : right angle at M, hypotenuse OQ = cos β, angle α at O
                ⇒  OM = cos β · cos α,  QM = cos β · sin α
        Rectangle MQRN  ⇒  NR = QM
     Reading off the figure:
        sin(α+β) = PN = NR + RP = sin α cos β + cos α sin β
        cos(α+β) = ON = OM − MN = cos α cos β − sin α sin β
  ─────────────────────────────────────────────────────────────────── */
  const Px = px(sumRad), Py = py(sumRad);
  const Ax = px(aRad),   Ay = py(aRad);
  const Qx = cx + R * cosB * cosA;
  const Qy = cy - R * cosB * sinA;
  const Nx = Px,  Ny = cy;
  const Mx = Qx,  My = cy;
  const Rx = Px,  Ry = Qy;
  const f = n => n.toFixed(2);

  // Right-angle tick at corner (px,py) with two unit directions (ux,uy) & (vx,vy)
  const rightAngle = (x, y, ux, uy, vx, vy, size = 8) => {
    const ax = x + ux * size,           ay = y + uy * size;
    const bx = x + (ux + vx) * size,    by = y + (uy + vy) * size;
    const cx_ = x + vx * size,          cy_ = y + vy * size;
    return `<polyline points="${f(ax)},${f(ay)} ${f(bx)},${f(by)} ${f(cx_)},${f(cy_)}"
      fill="none" stroke="var(--text2)" stroke-width="0.9" opacity="0.65"/>`;
  };

  // Rays (drawn faint; the meaningful highlighted segments come on top)
  const rayAfaint = `<line x1="${cx}" y1="${cy}" x2="${f(Ax)}" y2="${f(Ay)}"
    stroke="var(--olive)" stroke-width="1.2" opacity="0.45"/>`;
  const rayPfaint = `<line x1="${cx}" y1="${cy}" x2="${f(Px)}" y2="${f(Py)}"
    stroke="var(--text2)" stroke-width="1.1" opacity="0.4" stroke-dasharray="4,3"/>`;

  // Angle arcs at O
  const aArcSh = arc(0, aRad, 28, 'var(--olive)');
  const bArcSh = arc(aRad, sumRad, 50, 'var(--gold-dark)');
  const aLabSh = TXT(cx + 36, cy - 4,  `α`, 'var(--olive)',     13, 'start', 'Lora,serif');
  const bLabSh = TXT(cx + 56, cy - 28, `β`, 'var(--gold-dark)', 13, 'start', 'Lora,serif');

  // Vertex dots & labels
  const dotsSh =
    `<circle cx="${f(Px)}" cy="${f(Py)}" r="3.4" fill="var(--crimson)"/>` +
    `<circle cx="${f(Qx)}" cy="${f(Qy)}" r="3"   fill="var(--olive)"/>` +
    `<circle cx="${f(Nx)}" cy="${f(Ny)}" r="2.6" fill="var(--text2)"/>` +
    `<circle cx="${f(Mx)}" cy="${f(My)}" r="2.6" fill="var(--text2)"/>` +
    `<circle cx="${f(Rx)}" cy="${f(Ry)}" r="2.4" fill="var(--text2)" opacity="0.7"/>`;
  const ptLabsSh =
    TXT(cx - 10, cy + 16, 'O', 'var(--text2)', 12, 'end',   'Lora,serif') +
    TXT(Px - 8,  Py - 6,  'P', 'var(--crimson)', 13, 'end', 'Lora,serif') +
    TXT(Qx + 8,  Qy - 6,  'Q', 'var(--olive)',   12, 'start','Lora,serif') +
    TXT(Nx,      Ny + 16, 'N', 'var(--text2)',   12, 'middle','Lora,serif') +
    TXT(Mx,      My + 16, 'M', 'var(--text2)',   12, 'middle','Lora,serif') +
    TXT(Rx + 10, Ry - 4,  'R', 'var(--text2)',   11, 'start','Lora,serif');

  /* ── Step 1: sin(α+β) — full geometric proof ── */
  {
    // OQ along ray OA (length cos β)
    const OQseg = `<line x1="${cx}" y1="${cy}" x2="${f(Qx)}" y2="${f(Qy)}"
      stroke="var(--olive)" stroke-width="2.8"/>`;
    // PQ perpendicular to OA (length sin β)
    const PQseg = `<line x1="${f(Px)}" y1="${f(Py)}" x2="${f(Qx)}" y2="${f(Qy)}"
      stroke="var(--gold-dark)" stroke-width="2.6"/>`;
    // The two pieces of sin(α+β):
    //   NR (lower)  = sin α · cos β    — shown blue
    //   RP (upper)  = cos α · sin β    — shown crimson
    const NRseg = `<line x1="${f(Nx)}" y1="${f(Ny)}" x2="${f(Rx)}" y2="${f(Ry)}"
      stroke="#2A4A5E" stroke-width="3.4"/>`;
    const RPseg = `<line x1="${f(Rx)}" y1="${f(Ry)}" x2="${f(Px)}" y2="${f(Py)}"
      stroke="var(--crimson)" stroke-width="3.4"/>`;
    // Auxiliary: QM (= NR via rectangle) and QR (used in step 2) — faint dashes
    const QMseg = `<line x1="${f(Qx)}" y1="${f(Qy)}" x2="${f(Mx)}" y2="${f(My)}"
      stroke="#2A4A5E" stroke-width="1" opacity="0.45" stroke-dasharray="3,3"/>`;
    const QRseg = `<line x1="${f(Qx)}" y1="${f(Qy)}" x2="${f(Rx)}" y2="${f(Ry)}"
      stroke="var(--text2)" stroke-width="1" opacity="0.4" stroke-dasharray="3,3"/>`;

    // Right-angle ticks (Q: PQ⊥OA, N: PN⊥x-axis, R: QR⊥RP, M: QM⊥x-axis)
    const raQ = rightAngle(Qx, Qy, -cosA,  sinA,  -sinA, -cosA);  // along QO and QP
    const raN = rightAngle(Nx, Ny, -1, 0, 0, -1);
    const raM = rightAngle(Mx, My,  1, 0, 0, -1);
    const raR = rightAngle(Rx, Ry,  1, 0, 0,  1);

    // Segment labels
    const labPQ = TXT((Px + Qx)/2 + 14*cosA, (Py + Qy)/2 - 14*sinA,
      'sin β', 'var(--gold-dark)', 12, 'start', 'Lora,serif');
    const labOQ = TXT((cx + Qx)/2 + 10*sinA, (cy + Qy)/2 + 14*cosA,
      'cos β', 'var(--olive)', 12, 'middle', 'Lora,serif');
    const labNR = TXT(Nx + 10, (Ny + Ry)/2 + 4,
      'sin α · cos β', '#2A4A5E', 12, 'start', 'Lora,serif');
    const labRP = TXT(Rx + 10, (Ry + Py)/2 + 4,
      'cos α · sin β', 'var(--crimson)', 12, 'start', 'Lora,serif');
    const labPN = TXT(Nx - 12, (Ny + Py)/2 + 4,
      'sin(α+β)', 'var(--text)', 12, 'end', 'Lora,serif');

    const html = box(`
      <div class="ar-text" style="font-family:Amiri,serif;font-size:14px;color:var(--crimson);text-align:center;margin-bottom:10px">
        متطابقة جيب المجموع — برهان هندسي
      </div>
      <div class="en-text" style="font-family:'Lora',serif;font-size:14px;color:var(--crimson);text-align:center;font-style:italic;margin-bottom:10px">
        Sine angle-addition identity — geometric proof
      </div>
      <div style="margin:10px 0;font-size:13px;line-height:1.75">
        <strong>1.</strong> △OPQ has a right angle at Q (PQ ⊥ OA) and hypotenuse OP = 1.<br>
        &nbsp;&nbsp;&nbsp;&nbsp; ⇒ &nbsp;PQ = <span style="color:var(--gold-dark)">sin β</span>,
        &nbsp; OQ = <span style="color:var(--olive)">cos β</span>.<br>
        <strong>2.</strong> △PQR has a right angle at R; PQ ⊥ OA and PR ⊥ x-axis,
        so ∠QPR = α. Hypotenuse PQ = sin β.<br>
        &nbsp;&nbsp;&nbsp;&nbsp; ⇒ &nbsp;PR = <span style="color:var(--crimson)">sin β · cos α</span>,
        &nbsp; QR = sin β · sin α.<br>
        <strong>3.</strong> △OQM has a right angle at M, hypotenuse OQ = cos β, angle α at O.<br>
        &nbsp;&nbsp;&nbsp;&nbsp; ⇒ &nbsp;QM = <span style="color:#2A4A5E">cos β · sin α</span>.<br>
        <strong>4.</strong> MQRN is a rectangle, so NR = QM = <span style="color:#2A4A5E">sin α · cos β</span>.<br>
        <strong>5.</strong> Read PN off the figure:
      </div>
      <div style="text-align:center;font-size:15px;color:var(--text);margin:10px 0">
        sin(α + β) = PN = <span style="color:#2A4A5E">NR</span> + <span style="color:var(--crimson)">RP</span>
        = <span style="color:#2A4A5E">sin α · cos β</span> + <span style="color:var(--crimson)">cos α · sin β</span>
      </div>
      <div style="margin-top:10px;font-size:12.5px;color:var(--text2)">
        Numerical check at α = ${aDeg}°, β = ${bDeg}°:<br>
        ${sinA.toFixed(6)} × ${cosB.toFixed(6)} + ${cosA.toFixed(6)} × ${sinB.toFixed(6)}
        = ${(sinA*cosB).toFixed(6)} + ${(cosA*sinB).toFixed(6)}
        = <span style="color:var(--crimson)">${sinSum.toFixed(6)}</span>
        &nbsp;= sin ${sumDeg}° &nbsp;✓
      </div>
    `);

    steps.push({
      descAr:
        `أوّل المتطابقات الكبرى: جيب مجموع زاويتين، ببرهان هندسي كامل. أركّب الزاوية β فوق α فأحصل على النقطة P ` +
        `على الدائرة. أُسقط من P عموداً على الشعاع OA فيلتقيه عند Q، وعموداً على المحور الأفقي فيلتقيه عند N، ` +
        `ثم أُسقط من Q عموداً على المحور الأفقي عند M، وأرسم القطعة الأفقية QR لتلتقي PN عند R. ` +
        `يصبح المثلث OPQ قائماً في Q بوتره OP = 1، فينتج PQ = sin β و OQ = cos β. ` +
        `والمثلث PQR قائم في R وزاويته في P تساوي α (لأنّ PQ ⊥ OA و PR ⊥ المحور)، فينتج PR = sin β · cos α. ` +
        `والمثلث OQM قائم في M بوتره OQ = cos β وزاويته في O تساوي α، فينتج QM = sin α · cos β. ` +
        `وبما أنّ MQRN مستطيل فإنّ NR = QM. وبجمع الجزأين العموديّين: ` +
        `sin(α+β) = PN = NR + RP = sin α · cos β + cos α · sin β.`,
      descEn:
        `The first great identity, with a complete geometric proof. P is the point on the circle at angle α+β. ` +
        `Drop a perpendicular from P onto ray OA — its foot is Q. Drop a perpendicular from P onto the x-axis — ` +
        `its foot is N. From Q drop a perpendicular onto the x-axis at M, and draw the horizontal QR meeting PN at R. ` +
        `Triangle OPQ is right-angled at Q with hypotenuse OP = 1, so PQ = sin β and OQ = cos β. ` +
        `Triangle PQR is right-angled at R, and because PQ ⊥ OA and PR is vertical, ∠QPR = α; so PR = sin β · cos α. ` +
        `Triangle OQM is right-angled at M with hypotenuse OQ = cos β and angle α at O, so QM = sin α · cos β. ` +
        `Because MQRN is a rectangle, NR = QM. Reading the vertical segment PN as two stacked pieces: ` +
        `sin(α+β) = PN = NR + RP = sin α · cos β + cos α · sin β.`,
      svg: W(circle + axes + center +
        rayAfaint + rayPfaint + aArcSh + bArcSh + aLabSh + bLabSh +
        QMseg + QRseg +                          // faint construction
        OQseg + PQseg + NRseg + RPseg +          // load-bearing segments
        raQ + raN + raM + raR +
        dotsSh + ptLabsSh +
        labOQ + labPQ + labNR + labRP + labPN)
        + html
    });
  }

  /* ── Step 2: cos(α+β) — same construction, horizontal axis ── */
  {
    // Re-emphasize the horizontal segments:
    //   OM (length cos α · cos β) and MN = QR (length sin α · sin β)
    //   ON = OM − MN = cos(α+β)
    const OMseg = `<line x1="${cx}" y1="${cy}" x2="${f(Mx)}" y2="${f(My)}"
      stroke="var(--olive)" stroke-width="3.4"/>`;
    const MNseg = `<line x1="${f(Mx)}" y1="${cy}" x2="${f(Nx)}" y2="${cy}"
      stroke="var(--crimson)" stroke-width="3.4"/>`;
    const ONlab = TXT((cx + Nx) / 2, cy + 32,
      'cos(α+β) = ON = OM − MN', 'var(--text)', 12, 'middle', 'Lora,serif');

    // Faint reminders of the rest of the construction
    const OQfaint = `<line x1="${cx}" y1="${cy}" x2="${f(Qx)}" y2="${f(Qy)}"
      stroke="var(--olive)" stroke-width="1.4" opacity="0.45"/>`;
    const PQfaint = `<line x1="${f(Px)}" y1="${f(Py)}" x2="${f(Qx)}" y2="${f(Qy)}"
      stroke="var(--gold-dark)" stroke-width="1.4" opacity="0.45"/>`;
    const QMfaint = `<line x1="${f(Qx)}" y1="${f(Qy)}" x2="${f(Mx)}" y2="${f(My)}"
      stroke="var(--text2)" stroke-width="1" opacity="0.4" stroke-dasharray="3,3"/>`;
    const QRfaint = `<line x1="${f(Qx)}" y1="${f(Qy)}" x2="${f(Rx)}" y2="${f(Ry)}"
      stroke="var(--crimson)" stroke-width="1.4" opacity="0.55" stroke-dasharray="3,3"/>`;
    const PNfaint = `<line x1="${f(Px)}" y1="${f(Py)}" x2="${f(Nx)}" y2="${cy}"
      stroke="var(--text2)" stroke-width="1" opacity="0.4" stroke-dasharray="3,3"/>`;

    const labOM = TXT((cx + Mx) / 2, cy + 16,
      'cos α · cos β', 'var(--olive)', 12, 'middle', 'Lora,serif');
    const labMN = TXT((Mx + Nx) / 2, cy - 6,
      'sin α · sin β', 'var(--crimson)', 11, 'middle', 'Lora,serif');

    const raN2 = rightAngle(Nx, Ny, -1, 0, 0, -1);

    const html = box(`
      <div class="ar-text" style="font-family:Amiri,serif;font-size:14px;color:#2A4A5E;text-align:center;margin-bottom:10px">
        متطابقة جيب التمام للمجموع — من نفس البناء
      </div>
      <div class="en-text" style="font-family:'Lora',serif;font-size:14px;color:#2A4A5E;text-align:center;font-style:italic;margin-bottom:10px">
        Cosine identity — read off the same figure
      </div>
      <div style="margin:10px 0;font-size:13px;line-height:1.75">
        Now read the <em>horizontal</em> segments along the x-axis:<br>
        <strong>•</strong> OM = <span style="color:var(--olive)">cos α · cos β</span> &nbsp;
        (from △OQM with hypotenuse OQ = cos β and angle α at O).<br>
        <strong>•</strong> MN = QR = <span style="color:var(--crimson)">sin α · sin β</span> &nbsp;
        (from △PQR; QR is the leg opposite ∠α).<br>
        <strong>•</strong> N lies between O and M, so ON = OM − MN.
      </div>
      <div style="text-align:center;font-size:15px;color:var(--text);margin:10px 0">
        cos(α + β) = ON = <span style="color:var(--olive)">cos α · cos β</span>
        − <span style="color:var(--crimson)">sin α · sin β</span>
      </div>
      <div style="margin-top:10px;font-size:12.5px;color:var(--text2)">
        Numerical check at α = ${aDeg}°, β = ${bDeg}°:<br>
        ${cosA.toFixed(6)} × ${cosB.toFixed(6)} − ${sinA.toFixed(6)} × ${sinB.toFixed(6)}
        = ${(cosA*cosB).toFixed(6)} − ${(sinA*sinB).toFixed(6)}
        = <span style="color:#2A4A5E">${cosSum.toFixed(6)}</span>
        &nbsp;= cos ${sumDeg}° &nbsp;✓
      </div>
    `);

    steps.push({
      descAr:
        `بنفس البناء السابق، نقرأ الآن القطع الأفقيّة على المحور بدلاً من العموديّة. ` +
        `OM هو مسقط Q أفقياً، وطوله = cos α · cos β (من المثلث OQM). ` +
        `وMN هو نفس طول QR (المستطيل MQRN)، أي sin α · sin β (من المثلث PQR). ` +
        `وبما أنّ N يقع بين O و M، فإنّ ON = OM − MN، أي ` +
        `cos(α+β) = cos α · cos β − sin α · sin β. علامة الطرح هندسيّةٌ خالصة: عرض المستطيل QR يُقصِّر المسقط الأفقي.`,
      descEn:
        `The same figure proves the cosine identity — just read horizontal segments instead of vertical ones. ` +
        `OM is the horizontal projection of Q, of length cos α · cos β (from △OQM). ` +
        `MN equals QR (rectangle MQRN), of length sin α · sin β (from △PQR). ` +
        `Since N sits between O and M, ON = OM − MN, giving ` +
        `cos(α+β) = cos α · cos β − sin α · sin β. The minus sign is purely geometric: the rectangle's width QR ` +
        `eats into the horizontal projection.`,
      svg: W(circle + axes + center +
        rayAfaint + rayPfaint + aArcSh + bArcSh + aLabSh + bLabSh +
        OQfaint + PQfaint + QMfaint + PNfaint +
        OMseg + MNseg + QRfaint +
        raN2 +
        dotsSh + ptLabsSh +
        labOM + labMN + ONlab)
        + html
    });
  }

  /* ── Step 3: Double angle  sin 2α, cos 2α ── */
  {
    const dRad = 2 * aRad;
    const sin2 = Math.sin(dRad), cos2 = Math.cos(dRad);

    const aArc = arc(0, aRad, 36, 'var(--olive)');
    const dArc = arc(aRad, dRad, 56, 'var(--crimson)');
    const sumSeg = `<line x1="${px(dRad).toFixed(2)}" y1="${py(dRad).toFixed(2)}"
      x2="${px(dRad).toFixed(2)}" y2="${cy}" stroke="var(--crimson)" stroke-width="2.4"/>`;

    const html = box(`
      <div class="ar-text" style="font-family:Amiri,serif;font-size:14px;color:var(--crimson);text-align:center;margin-bottom:10px">
        متطابقتا الزاوية المضاعفة
      </div>
      <div class="en-text" style="font-family:'Lora',serif;font-size:14px;color:var(--crimson);text-align:center;font-style:italic;margin-bottom:10px">
        Double-angle identities
      </div>
      <div style="text-align:center;font-size:15px;color:var(--text);margin:10px 0">
        sin 2α = 2 sin α cos α<br>
        cos 2α = 1 − 2 sin²α  =  2 cos²α − 1
      </div>
      <div style="margin-top:10px">
        2α = ${(2 * aDeg)}°<br>
        sin 2α = 2 × ${sinA.toFixed(6)} × ${cosA.toFixed(6)} = <span style="color:var(--crimson)">${sin2.toFixed(6)}</span><br>
        cos 2α = 1 − 2 × (${sinA.toFixed(6)})² = 1 − ${(2 * sinA * sinA).toFixed(6)} = <span style="color:#2A4A5E">${cos2.toFixed(6)}</span>
      </div>
    `);

    steps.push({
      descAr:
        `حالة خاصة مهمّة: عندما β = α نحصل على متطابقة الزاوية المضاعفة. ` +
        `استعمل أبو الوفاء هذه المتطابقة لاشتقاق جداوله، إذ تتيح حساب sin 2α من sin α و cos α فقط. ` +
        `الصيغة الثانية cos 2α = 1 − 2 sin²α أساسية لاحقاً في صيغة نصف الزاوية.`,
      descEn:
        `An important special case: when β = α we obtain the double-angle identities. ` +
        `Abū al-Wafāʾ used these to derive his tables, since they let you compute sin 2α from sin α and cos α alone. ` +
        `The second form, cos 2α = 1 − 2 sin²α, is the seed of the half-angle formula in the next step.`,
      svg: W(circle + axes + center +
        ray(aRad, '', 'var(--olive)') +
        ray(dRad, '', 'var(--crimson)') +
        sumSeg + aArc + dArc +
        TXT(cx + 50, cy - 8,  `α = ${aDeg}°`, 'var(--olive)',  12, 'start', 'Lora,serif') +
        TXT(cx + 70, cy - 30, `α = ${aDeg}°`, 'var(--crimson)', 12, 'start', 'Lora,serif')) + html
    });
  }

  /* ── Step 4: Half-angle  sin(α/2) ── */
  {
    const hRad = aRad / 2;
    const sinH = Math.sin(hRad), cosH = Math.cos(hRad);
    const formula = Math.sqrt((1 - cosA) / 2);

    const hArc = arc(0, hRad, 36, '#2A4A5E');
    const sumSeg = `<line x1="${px(hRad).toFixed(2)}" y1="${py(hRad).toFixed(2)}"
      x2="${px(hRad).toFixed(2)}" y2="${cy}" stroke="var(--crimson)" stroke-width="2.4"/>`;

    const html = box(`
      <div class="ar-text" style="font-family:Amiri,serif;font-size:14px;color:#2A4A5E;text-align:center;margin-bottom:10px">
        متطابقة نصف الزاوية
      </div>
      <div class="en-text" style="font-family:'Lora',serif;font-size:14px;color:#2A4A5E;text-align:center;font-style:italic;margin-bottom:10px">
        Half-angle identity
      </div>
      <div style="text-align:center;font-size:16px;color:var(--text);margin:10px 0">
        sin(α/2) = √((1 − cos α) / 2)
      </div>
      <div style="margin-top:10px">
        α/2 = ${(aDeg / 2)}°<br>
        1 − cos ${aDeg}° = 1 − ${cosA.toFixed(6)} = ${(1 - cosA).toFixed(6)}<br>
        (1 − cos α)/2 = ${((1 - cosA) / 2).toFixed(6)}<br>
        √(…) = <span style="color:var(--crimson)">${formula.toFixed(6)}</span><br>
        direct sin(${(aDeg / 2)}°) = ${sinH.toFixed(6)} &nbsp;✓
      </div>
    `);

    steps.push({
      descAr:
        `بحلّ cos 2θ = 1 − 2 sin²θ بالنسبة إلى sin θ نحصل على صيغة نصف الزاوية: ` +
        `sin(α/2) = √((1 − cos α)/2). أهمية هذه الصيغة عمليّة: تتيح حساب جيوب زوايا أصغر فأصغر ` +
        `بدءاً من زاوية معروفة، وهي القلب الحسابي لجدول جيب الكاشي اللاحق ولحساب π بالمضلّعات.`,
      descEn:
        `Solving cos 2θ = 1 − 2 sin²θ for sin θ gives the half-angle formula: ` +
        `sin(α/2) = √((1 − cos α)/2). Its practical power is huge: starting from a known angle, you can ` +
        `compute the sine of progressively smaller angles. It is the engine of al-Kāshī's later sine table ` +
        `and of the polygon-doubling computation of π.`,
      svg: W(circle + axes + center +
        ray(aRad, '', 'var(--olive)') +
        ray(hRad, '', 'var(--crimson)') +
        sumSeg + hArc +
        TXT(cx + 50, cy - 10, `α/2 = ${(aDeg / 2)}°`, 'var(--crimson)', 12, 'start', 'Lora,serif') +
        TXT(cx + 70, cy - 32, `α = ${aDeg}°`,        'var(--olive)',   12, 'start', 'Lora,serif')) + html
    });
  }

  /* ── Step 5: The six functions, completed by Abū al-Wafāʾ ── */
  {
    const tanA = Math.tan(aRad);
    const cotA = 1 / Math.tan(aRad);
    const secA = 1 / cosA;
    const cscA = 1 / sinA;

    const tanLine = `<line x1="${(cx + R).toFixed(2)}" y1="${cy}"
      x2="${(cx + R).toFixed(2)}" y2="${(cy - R * tanA).toFixed(2)}"
      stroke="var(--crimson)" stroke-width="2.4"/>`;
    const tanLab = TXT(cx + R + 8, cy - R * tanA / 2,
      `tan α = ${tanA.toFixed(4)}`, 'var(--crimson)', 12, 'start', 'Lora,serif');

    const secLine = `<line x1="${cx}" y1="${cy}"
      x2="${(cx + R).toFixed(2)}" y2="${(cy - R * tanA).toFixed(2)}"
      stroke="#2A4A5E" stroke-width="2" stroke-dasharray="5,3"/>`;
    const secLab = TXT(cx + R / 2 + 8, cy - R * tanA / 2 - 8,
      `sec α = ${secA.toFixed(4)}`, '#2A4A5E', 12, 'start', 'Lora,serif');

    const aArc = arc(0, aRad, 30, 'var(--olive)');
    const ray0 = ray(aRad, '', 'var(--olive)');
    const tanRefLine = `<line x1="${cx + R}" y1="${cy - R - 8}"
      x2="${cx + R}" y2="${cy + 8}" stroke="var(--gold-dark)" stroke-width="0.8"
      stroke-dasharray="3,3"/>`;

    const html = `
      <div style="padding:18px 20px;color:var(--text2);background:var(--surface2);
                  border-radius:8px;border:1px solid var(--border-soft)">
        <div class="ar-text" style="font-family:Amiri,serif;font-size:15px;color:var(--crimson);text-align:center;margin-bottom:10px">
          الدوال السِّت كما عرّفها أبو الوفاء
        </div>
        <div class="en-text" style="font-family:'Lora',serif;font-size:15px;color:var(--crimson);text-align:center;font-style:italic;margin-bottom:10px">
          The six functions as defined by Abū al-Wafāʾ
        </div>
        <table style="width:100%;border-collapse:collapse;font-family:'Courier Prime',monospace;font-size:13px;direction:ltr">
          <thead>
            <tr style="border-bottom:1px solid var(--border-soft);color:var(--olive)">
              <th style="text-align:left;padding:6px 8px">function</th>
              <th style="text-align:left;padding:6px 8px">definition</th>
              <th style="text-align:right;padding:6px 8px">value at α = ${aDeg}°</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style="padding:4px 8px">sin α</td>
                <td style="padding:4px 8px">half-chord</td>
                <td style="padding:4px 8px;text-align:right">${sinA.toFixed(6)}</td></tr>
            <tr><td style="padding:4px 8px">cos α</td>
                <td style="padding:4px 8px">complement half-chord</td>
                <td style="padding:4px 8px;text-align:right">${cosA.toFixed(6)}</td></tr>
            <tr><td style="padding:4px 8px;color:var(--crimson)">tan α</td>
                <td style="padding:4px 8px">vertical shadow on x = 1</td>
                <td style="padding:4px 8px;text-align:right;color:var(--crimson)">${tanA.toFixed(6)}</td></tr>
            <tr><td style="padding:4px 8px">cot α</td>
                <td style="padding:4px 8px">horizontal shadow on y = 1</td>
                <td style="padding:4px 8px;text-align:right">${cotA.toFixed(6)}</td></tr>
            <tr><td style="padding:4px 8px;color:#2A4A5E">sec α</td>
                <td style="padding:4px 8px">distance O → tangent foot</td>
                <td style="padding:4px 8px;text-align:right;color:#2A4A5E">${secA.toFixed(6)}</td></tr>
            <tr><td style="padding:4px 8px">csc α</td>
                <td style="padding:4px 8px">distance O → cotangent foot</td>
                <td style="padding:4px 8px;text-align:right">${cscA.toFixed(6)}</td></tr>
          </tbody>
        </table>
        <div style="margin-top:14px;padding-top:12px;border-top:1px solid var(--border-soft);font-size:12.5px;line-height:1.7">
          <span class="ar-text" style="font-family:Amiri,serif">
            علاقات بدهيّة: tan α = sin α / cos α &nbsp;،&nbsp; sec α = 1 / cos α &nbsp;،&nbsp; sin²α + cos²α = 1.
          </span>
          <span class="en-text" style="font-family:'Lora',serif">
            Trivially: tan α = sin α / cos α, sec α = 1 / cos α, and sin²α + cos²α = 1.
          </span>
        </div>
      </div>`;

    steps.push({
      descAr:
        `الإسهام الأكبر لأبي الوفاء في تنظيم علم المثلثات: عرّف الدوالّ السِتّ على دائرة الوحدة بصورة موحَّدة. ` +
        `الظِّلّ tan α هو طول العمود المُقام عند نقطة (1, 0) حتى يلتقي بامتداد الشعاع، والقاطع sec α هو طول هذا الامتداد ` +
        `من المركز. قبل أبي الوفاء كانت هذه الكميّات تُحسَب كنِسَب ظلّ في جداول منفصلة بلا توحيد. ` +
        `في الجدول قِيَم الدوالّ الست عند α = ${aDeg}°.`,
      descEn:
        `Abū al-Wafāʾ's signature contribution to the architecture of trigonometry: he defined all six functions ` +
        `coherently on the unit circle. <em>tan α</em> is the height of the vertical raised at (1, 0) until it ` +
        `meets the extended ray; <em>sec α</em> is the length of that extended ray from the centre. Before him, ` +
        `these quantities lived as ad-hoc shadow ratios in unrelated tables. The values for α = ${aDeg}° are below.`,
      svg: W(circle + axes + center + tanRefLine +
        ray0 + secLine + tanLine + aArc +
        TXT(cx + 38, cy - 8, `α = ${aDeg}°`, 'var(--olive)', 12, 'start', 'Lora,serif') +
        tanLab + secLab) + html
    });
  }

  /* ── Step 6: Closing — historical impact ── */
  {
    const html = `
      <div style="padding:24px 22px;color:var(--text2);background:var(--surface2);
                  border-radius:8px;border:1px solid var(--border-soft);line-height:1.75">
        <div style="font-family:Amiri,serif;font-size:18px;color:var(--crimson);text-align:center;margin-bottom:6px" class="ar-text">
          الأثر التاريخي
        </div>
        <div style="font-family:'Lora',serif;font-size:18px;color:var(--crimson);text-align:center;font-style:italic;margin-bottom:14px" class="en-text">
          Historical impact
        </div>

        <div class="ar-text" style="font-family:Amiri,serif;font-size:14.5px">
          • متطابقات أبي الوفاء هي الأساس النظري الذي بُنيت عليه جداول الجيب لاحقاً عند البيروني والكاشي.<br>
          • صيغة الجيب للمثلث الكروي (sin a / sin A = sin b / sin B = sin c / sin C) صاغها أبو الوفاء بصورتها العامّة، ` +
            `وكانت أداة الفلكيّين المسلمين لتحديد القبلة وأوقات الصلاة بدقّة.<br>
          • انتقلت هذه المتطابقات إلى أوروبا عبر ترجمات جيرارد الكريموني (~1175م)، ` +
            `لتُسهم في ميلاد علم المثلثات الحديث على يد ريغيومونتانوس (~1464م).<br>
          • التعريفات الموحّدة للدوال الستّ بقيت كما وضعها أبو الوفاء، نستخدمها اليوم بلا تعديل.
        </div>

        <div class="en-text" style="font-family:'Lora',serif;font-size:14.5px">
          • Abū al-Wafāʾ's identities are the theoretical bedrock on which al-Bīrūnī and al-Kāshī later built their sine tables.<br>
          • He gave the spherical law of sines (sin a / sin A = sin b / sin B = sin c / sin C) in its general form, ` +
            `the working tool of Muslim astronomers for determining the qibla direction and prayer times.<br>
          • These identities entered Europe through Gerard of Cremona's translations (~1175 CE) and seeded modern ` +
            `trigonometry in the hands of Regiomontanus (~1464 CE).<br>
          • The unified definitions of the six functions stand exactly as he set them down — we still use them today.
        </div>
      </div>`;

    steps.push({
      descAr:
        `بهذه المتطابقات والتعريفات أعاد أبو الوفاء صياغة علم المثلثات من جداول مبعثرة إلى نظام موحَّد متماسك. ` +
        `الصيغ نفسها التي تكتبها يدك في كرّاس الرياضيات اليوم خرجت من رصدخانة بغداد قبل ألف عام.`,
      descEn:
        `With these identities and unified definitions, Abū al-Wafāʾ recast trigonometry from a scatter of tables ` +
        `into a coherent system. The very formulas you write today in your maths notebook left the Baghdad ` +
        `observatory a thousand years ago.`,
      svg: html
    });
  }

  return steps;
}
