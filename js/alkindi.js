/* ════════════════════════════════════════════
   VISUAL MATHEMATICS Al-Kindi Frequency Analysis
   الكندي رسالة في استخراج المعمّى (~801–873م)
════════════════════════════════════════════ */

/* Standard Arabic letter frequency (% of all letters in classical Arabic text) */
const KINDI_STD = {
  'ا':11.5,'ل':8.2,'ن':6.7,'م':6.4,'و':5.8,'ي':5.2,'ه':4.7,'ر':4.1,'ت':3.9,
  'ع':3.5,'ب':3.3,'ك':2.9,'ف':2.7,'س':2.5,'ق':2.3,'د':2.1,'ج':1.9,'ح':1.8,
  'خ':1.4,'ز':1.3,'ش':1.3,'ص':1.2,'ث':1.1,'ض':0.9,'ط':0.8,'ذ':0.7,'غ':0.6,'ظ':0.5
};
const KINDI_LETTERS = Object.keys(KINDI_STD);
const KINDI_STD_SORTED = [...KINDI_LETTERS].sort((a, b) => KINDI_STD[b] - KINDI_STD[a]);

const KINDI_DEFAULT_TEXT =
  'القراءة غذاء العقل وزاد الروح ومن قرأ كتابا في كل يوم فقد عاش في كل عام حياة كاملة ' +
  'فالكتب تحمل تجارب الناس وافكارهم عبر الزمن وتنقل الحكمة من جيل الى جيل ومن اراد ان يعرف نفسه ' +
  'ويفهم العالم من حوله فعليه ان يجعل القراءة عادة يومية فان لكل قراءة فائدة ولكل صفحة درسا ' +
  'ولكل كاتب رسالة يريد ان يوصلها الى قارئه ولولا الكتاب لضاعت العلوم ولاندثرت الحكم وما عرف الناس ' +
  'شيئا مما تركه السابقون من معارف وتجارب وحكايات';

let kdSteps = [], kdIdx = 0;

function startKd() {
  let raw = document.getElementById('kd-text').value || KINDI_DEFAULT_TEXT;
  raw = raw.replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي');
  const cipher = makeKdCipher();
  kdSteps = buildKdSteps(raw, cipher);
  kdIdx = 0;
  renderKd();
  setNav('kd', kdSteps, kdIdx);
}

function navKd(dir) {
  kdIdx = Math.max(0, Math.min(kdSteps.length - 1, kdIdx + dir));
  renderKd();
  setNav('kd', kdSteps, kdIdx);
}

function renderKd() {
  if (!kdSteps.length) return;
  const s = kdSteps[kdIdx];
  document.getElementById('kd-desc').innerHTML =
    `<span class="ar-text">${s.descAr}</span><span class="en-text">${s.descEn}</span>`;
  document.getElementById('kd-viz').innerHTML = s.svg;
}

/* ── Build a random substitution cipher (no fixed points) ── */
function makeKdCipher() {
  const src = KINDI_LETTERS.slice();
  const dst = KINDI_LETTERS.slice();
  let safe = 0;
  do {
    for (let i = dst.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [dst[i], dst[j]] = [dst[j], dst[i]];
    }
    safe++;
  } while (dst.some((d, i) => d === src[i]) && safe < 30);
  const map = {};
  src.forEach((s, i) => map[s] = dst[i]);
  return map;
}

function applyMap(text, map) {
  let out = '';
  for (const ch of text) out += (map[ch] !== undefined ? map[ch] : ch);
  return out;
}

function buildKdSteps(plain, cipher) {
  const ciphertext = applyMap(plain, cipher);

  const cipherCounts = {};
  KINDI_LETTERS.forEach(l => cipherCounts[l] = 0);
  let total = 0;
  for (const ch of ciphertext) {
    if (cipherCounts[ch] !== undefined) { cipherCounts[ch]++; total++; }
  }

  if (total === 0) {
    return [{
      descAr: 'لم يُعثر على أحرف عربية. أدخل نصاً عربياً.',
      descEn: 'No Arabic letters found. Please enter Arabic text.',
      svg: '<div class="empty-state">⚠ أدخل نصاً عربياً</div>'
    }];
  }

  /* Sort ciphertext letters by observed count, ties broken by standard Arabic order
     (KINDI_LETTERS is already listed in descending standard frequency).
     The attacker uses ONLY the ciphertext counts and public language statistics —
     no access to plaintext or the secret key. */
  const cipherSorted = KINDI_LETTERS.filter(l => cipherCounts[l] > 0)
    .sort((a, b) => (cipherCounts[b] - cipherCounts[a]) ||
                    (KINDI_LETTERS.indexOf(a) - KINDI_LETTERS.indexOf(b)));

  /* Attacker's guessed key: i-th most-frequent ciphertext letter ↔ i-th letter of standard Arabic.
     On short inputs this will be wrong for many letters — that is the honest behaviour
     of frequency analysis and the reason al-Kindī stressed the need for long ciphertexts. */
  const guessedKey = {};
  cipherSorted.forEach((c, i) => {
    if (i < KINDI_STD_SORTED.length) guessedKey[c] = KINDI_STD_SORTED[i];
  });
  const decoded = applyMap(ciphertext, guessedKey);

  let correct = 0, lettersCount = 0;
  for (let i = 0; i < plain.length; i++) {
    if (KINDI_LETTERS.includes(plain[i])) {
      lettersCount++;
      if (decoded[i] === plain[i]) correct++;
    }
  }
  const correctPct = Math.round((correct / lettersCount) * 100);

  const steps = [];

  /* ── Step 1: plaintext ── */
  steps.push({
    descAr: 'لدينا جملة عربية عاديّة. سنرى كيف تُخفى بشيفرة الاستبدال، ثم كيف نكسرها بطريقة الكندي.',
    descEn: 'A normal Arabic sentence. We will hide it with a substitution cipher, then break it the way Al-Kindī did.',
    svg: kdTextPanel(
      { ar: 'النص الأصلي', en: 'Plaintext' },
      plain, 'var(--navy)'
    )
  });

  /* ── Step 2: encrypt ── */
  steps.push({
    descAr: 'في شيفرة الاستبدال يُستبدل كل حرف بحرف آخر بحسب مفتاح سرّي. النتيجة تبدو كأنها هذيان لا معنى له.',
    descEn: 'In a substitution cipher every letter is replaced by another according to a secret key. The result looks like meaningless gibberish.',
    svg: kdEncryptView(plain, ciphertext, cipher)
  });

  /* ── Step 3: attacker counts frequencies ── */
  steps.push({
    descAr: 'الآن تخيّل أنك المهاجم: لا تعرف المفتاح، وكل ما لديك هو النص المشفّر. لاحظ الكندي أنه يستطيع عدّ كم مرة يظهر كل حرف فيه.',
    descEn: 'Now imagine you are the attacker: you do not know the key, only the ciphertext. Al-Kindī noticed that you can simply count how often each letter appears in it.',
    svg: kdFreqBars(cipherCounts, total, cipherSorted)
  });

  /* ── Step 4: match to standard Arabic frequencies ── */
  steps.push({
    descAr: 'الفكرة العبقرية: قارنْ هذا الترتيب بأشهر حروف اللغة العربية (ا، ل، ن، م، و، ي…). الأكثر شيوعا في الشيفرة هو غالبا "ا"، والذي يليه "ل"، وهكذا.',
    descEn: 'The genius idea: match this ranking against the most common letters of Arabic (ا, ل, ن, م, و, ي…). The most frequent ciphertext letter is most likely "ا", the next "ل", and so on.',
    svg: kdMatchTable(cipherSorted, cipherCounts, total)
  });

  /* ── Step 5: apply guessed key, reveal ── */
  steps.push({
    descAr: `بتطبيق المفتاح المُستنتَج من الإحصاء وحده، عاد النصّ مفهوماً (${correct} من ${lettersCount} حرفاً صحيحاً، أي ${correctPct}٪). كسر الكندي الشيفرة بالأرقام، قبل خمسة قرون من اكتشاف أوروبا للطريقة نفسها.`,
    descEn: `Applying the key guessed from statistics alone, the message becomes readable (${correct} of ${lettersCount} letters correct, ${correctPct}%). Al-Kindī broke ciphers with arithmetic — five centuries before Europe rediscovered the same idea.`,
    svg: kdRevealView(ciphertext, decoded, plain)
  });

  return steps;
}

/* ── Plaintext / generic text panel ── */
function kdTextPanel(label, text, color) {
  return `<div style="padding:24px 22px">
    <div style="font-family:'Courier Prime',monospace;font-size:11px;color:var(--gold);margin-bottom:10px;letter-spacing:0.5px">
      <span class="ar-text">${label.ar}</span><span class="en-text">${label.en}</span>
    </div>
    <div style="font-family:Amiri,serif;font-size:21px;line-height:2;color:${color};direction:rtl;text-align:right">
      ${text}
    </div>
  </div>`;
}

/* ── Encryption view: key + plain → cipher ── */
function kdEncryptView(plain, cipher, cipherMap) {
  const keyChips = KINDI_LETTERS.map(l => `
    <span style="display:inline-flex;align-items:center;margin:2px;padding:3px 7px;background:rgba(194,164,109,0.15);border:1px solid rgba(194,164,109,0.35);border-radius:4px;font-family:Amiri,serif;font-size:14px;direction:ltr">
      <span style="color:var(--navy)">${l}</span><span style="color:var(--muted);margin:0 4px;font-size:11px">→</span><span style="color:var(--crimson)">${cipherMap[l]}</span>
    </span>`).join('');
  return `<div style="padding:18px 16px">
    <div style="font-family:'Courier Prime',monospace;font-size:11px;color:var(--gold);margin-bottom:6px"><span class="ar-text">المفتاح السرّي (يعرفه المُرسِل وحده)</span><span class="en-text">Secret key (sender only)</span></div>
    <div style="margin-bottom:14px;direction:ltr;text-align:center;line-height:1.9">${keyChips}</div>
    <div style="font-family:'Courier Prime',monospace;font-size:11px;color:var(--gold);margin-bottom:6px"><span class="ar-text">النص الأصلي</span><span class="en-text">Plaintext</span></div>
    <div style="font-family:Amiri,serif;font-size:18px;line-height:1.9;color:var(--navy);direction:rtl;text-align:right;margin-bottom:14px">${plain}</div>
    <div style="font-family:'Courier Prime',monospace;font-size:11px;color:var(--gold);margin-bottom:6px"><span class="ar-text">النص المشفّر</span><span class="en-text">Ciphertext</span></div>
    <div style="font-family:Amiri,serif;font-size:18px;line-height:1.9;color:var(--crimson);direction:rtl;text-align:right">${cipher}</div>
  </div>`;
}

/* ── Frequency bars of ciphertext (single colour) ── */
function kdFreqBars(counts, total, cipherSorted) {
  const letters = cipherSorted.slice(0, 14);
  const W = 390, H = 230, chartH = 170, chartX = 28, chartY = 14, barW = 22, gap = 4;
  const maxCount = Math.max(...letters.map(l => counts[l]), 1);

  let bars = '';
  letters.forEach((l, i) => {
    const x = chartX + i * (barW + gap);
    const h = (counts[l] / maxCount) * chartH;
    bars += `<rect x="${x}" y="${chartY + chartH - h}" width="${barW}" height="${h}" fill="#C84B45" opacity="0.78" rx="2"/>`;
    bars += `<text x="${x + barW/2}" y="${chartY + chartH + 16}" text-anchor="middle" font-family="Amiri,serif" font-size="14" fill="var(--text)">${l}</text>`;
    bars += `<text x="${x + barW/2}" y="${chartY + chartH - h - 4}" text-anchor="middle" font-family="'Courier Prime',monospace" font-size="10" fill="var(--muted)">${counts[l]}</text>`;
  });
  const baseline = `<line x1="${chartX}" y1="${chartY + chartH}" x2="${chartX + letters.length*(barW+gap)}" y2="${chartY + chartH}" stroke="var(--gold)" stroke-width="1" opacity="0.45"/>`;

  return `<div style="padding:8px 6px">
    <svg viewBox="0 0 ${W} ${H}" style="width:100%;max-height:240px">${bars}${baseline}</svg>
    <div style="text-align:center;font-family:'Courier Prime',monospace;font-size:11px;color:var(--muted);margin-top:4px">
      <span class="ar-text">تواتر الحروف في النص المشفّر</span><span class="en-text">Letter counts in the ciphertext</span>
    </div>
  </div>`;
}

/* ── Side-by-side ranking: cipher rank vs std Arabic rank ── */
function kdMatchTable(cipherSorted, cipherCounts, total) {
  const n = Math.min(10, cipherSorted.length);
  const rows = [];
  for (let i = 0; i < n; i++) {
    const c = cipherSorted[i];
    const s = KINDI_STD_SORTED[i];
    const pct = ((cipherCounts[c]/total)*100).toFixed(1);
    rows.push(`<tr>
      <td style="padding:5px 12px;font-family:'Courier Prime',monospace;font-size:11px;color:var(--muted);text-align:center">#${i+1}</td>
      <td style="padding:5px 12px;font-family:Amiri,serif;font-size:22px;color:var(--crimson);text-align:center">${c}</td>
      <td style="padding:5px 10px;font-family:'Courier Prime',monospace;font-size:12px;color:var(--text);text-align:right">${pct}%</td>
      <td style="padding:5px 10px;color:var(--gold);font-size:16px;text-align:center">→</td>
      <td style="padding:5px 12px;font-family:Amiri,serif;font-size:22px;color:var(--navy);text-align:center">${s}</td>
      <td style="padding:5px 10px;font-family:'Courier Prime',monospace;font-size:12px;color:var(--muted);text-align:right">${KINDI_STD[s]}%</td>
    </tr>`);
  }
  return `<div style="overflow-x:auto;padding:14px 8px">
    <table style="border-collapse:collapse;margin:0 auto;direction:ltr">
      <thead><tr>
        <th style="padding:6px 12px;color:var(--gold);font-family:'Courier Prime',monospace;font-size:10px;text-align:center;border-bottom:1px solid rgba(194,164,109,0.35)">Rank</th>
        <th style="padding:6px 12px;color:var(--gold);font-family:'Courier Prime',monospace;font-size:10px;text-align:center;border-bottom:1px solid rgba(194,164,109,0.35)">Ciphertext</th>
        <th style="padding:6px 10px;color:var(--gold);font-family:'Courier Prime',monospace;font-size:10px;text-align:right;border-bottom:1px solid rgba(194,164,109,0.35)">In text</th>
        <th style="border-bottom:1px solid rgba(194,164,109,0.35)"></th>
        <th style="padding:6px 12px;color:var(--gold);font-family:'Courier Prime',monospace;font-size:10px;text-align:center;border-bottom:1px solid rgba(194,164,109,0.35)">Plaintext</th>
        <th style="padding:6px 10px;color:var(--gold);font-family:'Courier Prime',monospace;font-size:10px;text-align:right;border-bottom:1px solid rgba(194,164,109,0.35)">Standard</th>
      </tr></thead>
      <tbody>${rows.join('')}</tbody>
    </table>
  </div>`;
}

/* ── Final reveal: ciphertext → recovered text, with correct letters in green ── */
function kdRevealView(cipher, decoded, original) {
  let marked = '';
  for (let i = 0; i < decoded.length; i++) {
    const ch = decoded[i];
    if (KINDI_LETTERS.includes(original[i])) {
      const ok = ch === original[i];
      marked += `<span style="color:${ok ? '#3a7a3a' : 'var(--crimson)'};${ok ? 'font-weight:500' : ''}">${ch}</span>`;
    } else {
      marked += ch;
    }
  }
  return `<div style="padding:18px 16px">
    <div style="font-family:'Courier Prime',monospace;font-size:11px;color:var(--gold);margin-bottom:6px"><span class="ar-text">النص المشفّر (لم يتغيّر)</span><span class="en-text">Ciphertext (unchanged)</span></div>
    <div style="font-family:Amiri,serif;font-size:18px;line-height:1.9;color:var(--crimson);direction:rtl;text-align:right;margin-bottom:14px">${cipher}</div>
    <div style="font-family:'Courier Prime',monospace;font-size:11px;color:var(--gold);margin-bottom:6px"><span class="ar-text">النصّ المُسترجَع — الأخضر = حرف صحيح</span><span class="en-text">Recovered text — green letters were guessed correctly</span></div>
    <div style="font-family:Amiri,serif;font-size:18px;line-height:1.9;direction:rtl;text-align:right">${marked}</div>
  </div>`;
}
