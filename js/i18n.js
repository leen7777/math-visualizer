/* ══════════════════════════════════════════
   VISUAL MATHEMATICS Internationalisation
   Supports: Arabic (ar) and English (en)
══════════════════════════════════════════ */

let currentLang = 'ar';

const UI = {
  ar: {
    appTitle      : '🔢 الرياضيات البصرية',
    langBtn       : 'English',

    tabDiv        : 'القسمة المطولة',
    tabMul        : 'الضرب بالشبكة',
    tabSqrt       : 'الجذر التربيعي',
    tabCbrt       : 'الجذر التكعيبي',
    tabMizan      : 'الميزان',
    tabFp         : 'حساب الخطأين',
    tabDec        : 'الكسور العشرية',
    tabJabr       : 'المعادلات التربيعية',

    /* ── Division ── */
    divTitle      : 'القسمة المطولة',
    divSource     : 'طريقة الكاشي كتاب مفتاح الحساب',
    divLabelA     : 'المقسوم',
    divLabelB     : 'المقسوم عليه',
    divStart      : '▶ ابدأ',
    divInitDesc   : 'أدخل العددين واضغط ابدأ لمشاهدة القسمة خطوة بخطوة.',
    divEmpty      : '⬆ أدخل الأعداد واضغط ابدأ',

    /* ── Multiply ── */
    mulTitle      : 'الضرب المطول بالشبكة',
    mulSource     : 'طريقة الكاشي ضرب الأعداد بالشبكة الإسلامية',
    mulLabelA     : 'المضروب',
    mulLabelB     : 'المضروب فيه',
    mulStart      : '▶ ابدأ',
    mulInitDesc   : 'أدخل العددين واضغط ابدأ لمشاهدة الضرب بالشبكة خطوة بخطوة.',
    mulEmpty      : '⬆ أدخل الأعداد واضغط ابدأ',
    mulCellLabel  : (i,j,da,db,prod,t,u) => `العمود ${j+1} × الصف ${i+1}: ${da} × ${db} = ${prod} → ${t} عشرات، ${u} آحاد`,
    mulDiagLabel  : (p,raw,carry,tot,dig) => `القطر ${p+1}: مجموع ${raw}${carry>0?' + حمل '+carry:''} = ${tot} → رقم: ${dig}`,

    /* ── Square Root ── */
    sqrtTitle     : 'الجذر التربيعي',
    sqrtSource    : 'طريقة الكاشي مفتاح الحساب (تجميع الأرقام زوجاً زوجاً)',
    sqrtLabelN    : 'العدد',
    sqrtStart     : '▶ ابدأ',
    sqrtInitDesc  : 'أدخل العدد واضغط ابدأ لمشاهدة خطوات الجذر التربيعي.',
    sqrtEmpty     : '⬆ أدخل العدد واضغط ابدأ',

    /* ── Cube Root ── */
    cbrtTitle     : 'الجذر التكعيبي',
    cbrtSource    : 'طريقة الكاشي أشهر إنجازاته الحسابية',
    cbrtLabelN    : 'العدد',
    cbrtStart     : '▶ ابدأ',
    cbrtInitDesc  : 'أدخل العدد واضغط ابدأ لمشاهدة خطوات الجذر التكعيبي.',
    cbrtEmpty     : '⬆ أدخل العدد واضغط ابدأ',
    cbrtTriples   : 'المجموعات الثلاثية',
    cbrtRoot      : 'الجذر',

    /* ── Mizan ── */
    mizanTitle       : 'الميزان',
    mizanSource      : 'التحقق من صحة العمليات الحسابية بطريقة الميزان',
    mizanLabelA      : 'العدد الأول',
    mizanLabelOp     : 'العملية',
    mizanLabelB      : 'العدد الثاني',
    mizanLabelR      : 'الناتج المزعوم',
    mizanLabelQuotient: 'الخارج',
    mizanLabelRem    : 'الباقي',
    mizanStart       : '⚖ تحقق',
    mizanInitDesc    : 'أدخل العملية الحسابية واضغط تحقق للتحقق من صحتها.',
    mizanEmpty       : '⬆ أدخل العملية واضغط تحقق',

    /* ── False Position ── */
    fpTitle       : 'حساب الخطأين',
    fpSource      : 'حل المعادلات الخطية بطريقة التخمين التراث الرياضي الإسلامي',
    fpLabelA      : 'المعامل (أ)',
    fpLabelB      : 'الثابت (ب)',
    fpLabelC      : 'الهدف',
    fpLabelG1     : 'التخمين الأول',
    fpLabelG2     : 'التخمين الثاني',
    fpStart       : '▶ ابدأ',
    fpInitDesc    : 'أدخل معادلة من الشكل: أ × س + ب = هدف، وتخمينين، ثم اضغط ابدأ.',
    fpEmpty       : '⬆ أدخل المعادلة والتخمينات واضغط ابدأ',
    fpGuess       : 'تخمين',
    fpError       : 'الخطأ',
    fpFormula     : 'صيغة الحل',
    fpSolution    : 'الحل',

    /* ── Decimal (al-Uqlīdisī) ── */
    decTitle      : 'الكسور العشرية',
    decSource     : 'طريقة الإقليدسي (~952م) كتاب الفصول في الحساب الهندي أوّل من أسّس مفهوم الكسر العشري',
    decLabelN     : 'العدد',
    decLabelOp    : 'العملية',
    decLabelK     : 'عدد المرات',
    decOpHalve    : '÷ 2 (تنصيف)',
    decOpAddTenth : '× (1 + 1/10)',
    decStart      : '▶ ابدأ',
    decInitDesc   : 'اختر عدداً وعمليّةً واضغط ابدأ لمشاهدة كيف نشأت الكسور العشرية في طريقة الإقليدسي.',
    decEmpty      : '⬆ أدخل العدد واضغط ابدأ',

    /* ── Al-Jabr (Completing the Square) ── */
    jabrTitle     : 'حلّ المعادلة التربيعية هندسيّاً',
    jabrSource    : 'طريقة الخوارزمي ـ كتاب المختصر في حساب الجبر والمقابلة (~830م)',
    jabrLabelCase : 'الحالة',
    jabrCase1     : '(1)  س² = بس',
    jabrCase2     : '(2)  س² = جـ',
    jabrCase3     : '(3)  بس = جـ',
    jabrCase4     : '(4)  س² + بس = جـ',
    jabrCase5     : '(5)  س² + جـ = بس',
    jabrCase6     : '(6)  س² = بس + جـ',
    jabrLabelB    : 'معامل س (ب)',
    jabrLabelC    : 'الثابت (جـ)',
    jabrStart     : '▶ ابدأ',
    jabrInitDesc  : 'اختر الحالة وأدخل المعاملات واضغط ابدأ لمشاهدة البرهان الهندسي خطوة بخطوة.',
    jabrEmpty     : '⬆ اختر الحالة واضغط ابدأ',

    /* ── Shared ── */
    prevBtn       : 'السابق ▶',
    nextBtn       : '◀ التالي',
    stepOf        : (i, n) => `الخطوة ${i} من ${n}`,

    quotientLabel : 'الخارج (ناتج القسمة)',
    dividendLabel : 'المقسوم',
    pairsLabel    : 'المجموعات الثنائية',
    rootLabel     : 'الجذر',

    boxFirst      : 'العدد الأول',
    boxSecond     : 'العدد الثاني',
    boxResult     : 'الناتج المزعوم',
    boxDividend   : 'المقسوم',
    boxDivisor    : 'المقسوم عليه',
    boxQuotient   : 'الخارج',
    boxRemainder  : 'الباقي',
    drLabel       : 'الميزان: ',
    drOpBox       : 'ميزان العملية: ',

    balLeftDiv    : 'ميزان(خارج)×ميزان(م.عليه)',
    balLeftDivRem : '(ميزان.خارج×ميزان.م.عليه)+ميزان.باقي',
    balRightDiv   : 'ميزان(المقسوم)',
    balLeft       : 'العملية',
    balRight      : 'الناتج',
    balOk         : '✓ العملية صحيحة',
    balErr        : '✗ العملية خاطئة',

    wbCurrent     : 'العدد الحالي: ',
    wbLower       : 'العدد السفلي: ',
    wbNewDigit    : 'رقم الجذر "ف": ',
    wbSub         : 'المطروح: ',
    wbRem         : 'الباقي: ',
    wbBase        : 'القاعدة: ',
    wbTrial       : 'التجربة: ',

    /* ── Navigation & Categories ── */
    tabHome        : 'الرئيسية',
    tabScholars    : 'العلماء',
    tabGloss       : 'المسرد',
    tabRefs        : 'المراجع',
    tabFacts       : 'معلومات تاريخية',
    catArithmetic  : 'الحساب',
    catRoots       : 'الجذور',
    catVerify      : 'التحقق',
    catAlgebra     : 'الجبر',
    catRefs        : 'المراجع',

    /* ── Scholars panel ── */
    schTitle       : 'علماء الرياضيات في الحضارة الإسلامية',
    schSource      : 'دليل مرجعي للعلماء الذين تُمثّل طُرُقهم في هذا الموقع، مرتّباً زمنيّاً',

    /* ── Glossary panel ── */
    glossTitle     : 'مسرد المصطلحات',
    glossSource    : 'المصطلحات العربية الكلاسيكية في الرياضيات وما يقابلها في اللغة الحديثة',

    /* ── References panel ── */
    refTitle       : 'المراجع',
    refSource      : 'المصدر الأساسي للمحتوى التاريخي والخوارزميات في هذا الموقع',

    /* ── Home Panel ── */
    homeTitle      : 'الرئيسية',
    homeSource     : 'من إرث علم الحساب العربي الإسلامي',
    homeHeroText   : 'مرحباً بك في الرياضيات البصرية رحلة تفاعلية في إرث علماء الرياضيات الإسلاميين، من القسمة المطولة عند الكاشي إلى الجبر عند الخوارزمي.',

    /* ── Facts Panel ── */
    factsTitle     : 'معلومات تاريخية',
    factsSource    : 'اضغط على البطاقة للتوسع · استخدم الأزرار للتنقل',

    /* ── New Categories ── */
    catNumberTheory: 'نظرية الأعداد',
    catGeometry    : 'الهندسة الكلاسيكية',

    /* ── Al-Kindi ── */
    tabAlKindi     : 'الكندي التشفير',
    alkTitle       : 'تحليل تواتر الكندي',
    alkSource      : 'الكندي (~801–873م) أول رسالة في فك الشفرات في التاريخ',
    alkLabel       : 'اكتب جملة عربية لتشفيرها ثم كسر شفرتها',
    alkStart       : '▶ شفّر واكسر',
    alkInitDesc    : 'اكتب أي جملة عربية، واضغط «شفّر واكسر» لرؤية كيف يحوّلها مفتاح سرّي إلى هذيان، ثم كيف يكسر الكندي الشفرة بعدّ تواتر الحروف فقط.',
    alkEmpty       : '⬆ اكتب جملة عربية واضغط الزر',

    /* ── Pythagorean ── */
    tabPyth        : 'مبرهنة فيثاغورس',
    pythTitle      : 'مبرهنة فيثاغورس البرهان الهندسي',
    pythSource     : 'ثابت بن قرة (~880م) · البرهان الهندسي بالمثلثات الأربعة',
    pythLabelA     : 'الضلع أ',
    pythLabelB     : 'الضلع ب',
    pythStart      : '▶ أثبت',
    pythInitDesc   : 'أدخل ضلعَي المثلث القائم واضغط «أثبت» لمشاهدة البرهان الهندسي خطوة بخطوة.',
    pythEmpty      : '⬆ أدخل الضلعين واضغط أثبت',

    /* ── Karaji / Pascal-precursor ── */
    tabKaraji      : 'مثلث الكَرَجي',
    krTitle        : 'مثلث الكَرَجي والسموأل',
    krSource       : 'الكَرَجي (~1000م) والسموأل (~1150م) · معاملات (س+ص)^ن قبل باسكال بستة قرون',
    krLabelN       : 'عدد الصفوف',
    krStart        : '▶ ابنِ المثلث',
    krInitDesc     : 'أدخل عدد الصفوف واضغط «ابنِ» لمشاهدة بناء مثلث المعاملات الثنائية صفّاً صفّاً.',
    krEmpty        : '⬆ أدخل عدد الصفوف واضغط ابنِ',

    /* ── Al-Kashi's π ── */
    tabKashi       : 'الكاشي وحساب π',
    kashiTitle     : 'الكاشي وحساب π بستة عشر منزلة',
    kashiSource    : 'غياث الدين الكاشي ـ الرسالة المحيطية (سمرقند، 1424م)',
    kashiStart     : '▶ ابدأ المضاعفة',
    kashiInitDesc  : 'اضغط «ابدأ» لمشاهدة كيف ضاعف الكاشي عدد أضلاع المضلّع المنتظم 28 مرّة حتى حصل على π بستة عشر منزلة عشرية.',
    kashiEmpty     : '⬆ اضغط ابدأ المضاعفة',
  },

  en: {
    appTitle      : '🔢 Visual Mathematics',
    langBtn       : 'العربية',

    tabDiv        : 'Long Division',
    tabMul        : 'Lattice Multiply',
    tabSqrt       : 'Square Root',
    tabCbrt       : 'Cube Root',
    tabMizan      : 'Al-Mizan',
    tabFp         : 'False Position',
    tabDec        : 'Decimal Fractions',
    tabJabr       : 'Quadratic Equations',

    /* ── Division ── */
    divTitle      : 'Al-Kashi Long Division',
    divSource     : "Al-Kashi's method Miftāḥ al-Ḥisāb (Key of Arithmetic)",
    divLabelA     : 'Dividend',
    divLabelB     : 'Divisor',
    divStart      : '▶ Start',
    divInitDesc   : 'Enter both numbers and press Start to see the division step by step.',
    divEmpty      : '⬆ Enter numbers and press Start',

    /* ── Multiply ── */
    mulTitle      : 'Lattice / Grid Multiplication',
    mulSource     : "Al-Kashi's method Islamic Lattice Multiplication",
    mulLabelA     : 'Multiplicand',
    mulLabelB     : 'Multiplier',
    mulStart      : '▶ Start',
    mulInitDesc   : 'Enter both numbers and press Start to see lattice multiplication step by step.',
    mulEmpty      : '⬆ Enter numbers and press Start',
    mulCellLabel  : (i,j,da,db,prod,t,u) => `Column ${j+1} × Row ${i+1}: ${da} × ${db} = ${prod} → ${t} tens, ${u} units`,
    mulDiagLabel  : (p,raw,carry,tot,dig) => `Diagonal ${p+1}: sum ${raw}${carry>0?' + carry '+carry:''} = ${tot} → digit: ${dig}`,

    /* ── Square Root ── */
    sqrtTitle     : 'Square Root',
    sqrtSource    : "Al-Kashi's method Miftāḥ al-Ḥisāb (digit-pair grouping)",
    sqrtLabelN    : 'Number',
    sqrtStart     : '▶ Start',
    sqrtInitDesc  : 'Enter a number and press Start to see the square root steps.',
    sqrtEmpty     : '⬆ Enter a number and press Start',

    /* ── Cube Root ── */
    cbrtTitle     : 'Cube Root',
    cbrtSource    : "Al-Kashi's method His most celebrated computation",
    cbrtLabelN    : 'Number',
    cbrtStart     : '▶ Start',
    cbrtInitDesc  : 'Enter a number and press Start to see the cube root steps.',
    cbrtEmpty     : '⬆ Enter a number and press Start',
    cbrtTriples   : 'Digit Triples',
    cbrtRoot      : 'Root',

    /* ── Mizan ── */
    mizanTitle       : 'Al-Mizan (The Scale)',
    mizanSource      : 'Casting-out-Nines verification using the mizan (scale)',
    mizanLabelA      : 'First Number',
    mizanLabelOp     : 'Operation',
    mizanLabelB      : 'Second Number',
    mizanLabelR      : 'Claimed Result',
    mizanLabelQuotient: 'Quotient',
    mizanLabelRem    : 'Remainder',
    mizanStart       : '⚖ Verify',
    mizanInitDesc    : 'Enter an arithmetic operation and press Verify to check its correctness.',
    mizanEmpty       : '⬆ Enter the operation and press Verify',

    /* ── False Position ── */
    fpTitle       : 'Double False Position',
    fpSource      : 'Solving linear equations by guessing Islamic mathematical heritage',
    fpLabelA      : 'Coefficient (a)',
    fpLabelB      : 'Constant (b)',
    fpLabelC      : 'Target',
    fpLabelG1     : 'First Guess',
    fpLabelG2     : 'Second Guess',
    fpStart       : '▶ Start',
    fpInitDesc    : 'Enter equation a·x + b = target and two guesses, then press Start.',
    fpEmpty       : '⬆ Enter the equation and guesses and press Start',
    fpGuess       : 'Guess',
    fpError       : 'Error',
    fpFormula     : 'Solution Formula',
    fpSolution    : 'Solution',

    /* ── Decimal (al-Uqlīdisī) ── */
    decTitle      : 'Decimal Fractions',
    decSource     : "Method of al-Uqlīdisī (~952 CE) — al-Fuṣūl fī al-Ḥisāb al-Hindī, the first to establish the decimal-fraction concept",
    decLabelN     : 'Number',
    decLabelOp    : 'Operation',
    decLabelK     : 'Times',
    decOpHalve    : '÷ 2 (halving)',
    decOpAddTenth : '× (1 + 1/10)',
    decStart      : '▶ Start',
    decInitDesc   : 'Pick a number and an operation, then press Start to see how decimal fractions arose in al-Uqlīdisī\'s method.',
    decEmpty      : '⬆ Enter a number and press Start',

    /* ── Al-Jabr (Completing the Square) ── */
    jabrTitle     : 'Solving Quadratic Equations Geometrically',
    jabrSource    : "al-Khwārizmī's method — Kitāb al-mukhtasar fī ḥisāb al-jabr wa-l-muqābala (~830 CE)",
    jabrLabelCase : 'Case',
    jabrCase1     : '(1)  x² = bx',
    jabrCase2     : '(2)  x² = c',
    jabrCase3     : '(3)  bx = c',
    jabrCase4     : '(4)  x² + bx = c',
    jabrCase5     : '(5)  x² + c = bx',
    jabrCase6     : '(6)  x² = bx + c',
    jabrLabelB    : 'Coefficient of x (b)',
    jabrLabelC    : 'Constant (c)',
    jabrStart     : '▶ Start',
    jabrInitDesc  : 'Pick a case, enter coefficients, and press Start to see the geometric proof step by step.',
    jabrEmpty     : '⬆ Enter the equation and press Start',

    /* ── Shared ── */
    prevBtn       : '◀ Prev',
    nextBtn       : 'Next ▶',
    stepOf        : (i, n) => `Step ${i} of ${n}`,

    quotientLabel : 'Quotient',
    dividendLabel : 'Dividend',
    pairsLabel    : 'Digit Pairs',
    rootLabel     : 'Root',

    boxFirst      : 'First Number',
    boxSecond     : 'Second Number',
    boxResult     : 'Claimed Result',
    boxDividend   : 'Dividend',
    boxDivisor    : 'Divisor',
    boxQuotient   : 'Quotient',
    boxRemainder  : 'Remainder',
    drLabel       : 'Mizan: ',
    drOpBox       : 'Mizan of operation: ',

    balLeftDiv    : 'mizan(quotient)×mizan(divisor)',
    balLeftDivRem : '(mizan(quot)×mizan(div))+mizan(rem)',
    balRightDiv   : 'mizan(dividend)',
    balLeft       : 'Operation',
    balRight      : 'Result',
    balOk         : '✓ Operation is correct',
    balErr        : '✗ Operation is incorrect',

    wbCurrent     : 'Current value: ',
    wbLower       : 'Lower number: ',
    wbNewDigit    : 'Root digit "f": ',
    wbSub         : 'Subtract: ',
    wbRem         : 'Remainder: ',
    wbBase        : 'Base value: ',
    wbTrial       : 'Trial product: ',

    /* ── Navigation & Categories ── */
    tabHome        : 'Home',
    tabScholars    : 'Scholars',
    tabGloss       : 'Glossary',
    tabRefs        : 'References',
    tabFacts       : 'Historical Facts',
    catArithmetic  : 'Arithmetic',
    catRoots       : 'Roots',
    catVerify      : 'Verification',
    catAlgebra     : 'Algebra',
    catRefs        : 'References',

    /* ── Scholars panel ── */
    schTitle       : 'Mathematicians of the Islamic Civilisation',
    schSource      : 'Reference index of scholars whose methods are demonstrated on this site, in chronological order',

    /* ── Glossary panel ── */
    glossTitle     : 'Glossary of Terms',
    glossSource    : 'Classical Arabic mathematical terms with their modern English equivalents',

    /* ── References panel ── */
    refTitle       : 'References',
    refSource      : 'Primary source for the historical content and algorithms on this site',

    /* ── Home Panel ── */
    homeTitle      : 'Home',
    homeSource     : 'From the heritage of Islamic & Arabic arithmetic',
    homeHeroText   : "Welcome to Visual Mathematics an interactive journey through the heritage of Islamic mathematicians, from Al-Kashi's long division to Al-Khwārazmī's algebra.",

    /* ── Facts Panel ── */
    factsTitle     : 'Historical Facts',
    factsSource    : 'Tap a card to expand · use buttons to navigate',

    /* ── New Categories ── */
    catNumberTheory: 'Number Theory',
    catGeometry    : 'Classical Geometry',

    /* ── Al-Kindi ── */
    tabAlKindi     : 'Al-Kindī Cryptanalysis',
    alkTitle       : 'Al-Kindī Frequency Analysis',
    alkSource      : 'Al-Kindī (~801–873 CE) First cryptanalysis treatise in history',
    alkLabel       : 'Type an Arabic sentence to encrypt and crack',
    alkStart       : '▶ Encrypt & Crack',
    alkInitDesc    : 'Type any Arabic sentence and press Encrypt & Crack to see how a secret key turns it into gibberish — then how Al-Kindī breaks the cipher using only letter counts.',
    alkEmpty       : '⬆ Type an Arabic sentence and press the button',

    /* ── Pythagorean ── */
    tabPyth        : 'Pythagorean Theorem',
    pythTitle      : 'Pythagorean Theorem Geometric Proof',
    pythSource     : 'Thābit ibn Qurra (~880 CE) · Four-triangle geometric proof',
    pythLabelA     : 'Leg a',
    pythLabelB     : 'Leg b',
    pythStart      : '▶ Prove',
    pythInitDesc   : 'Enter the two legs of a right triangle and press Prove to see the geometric proof step by step.',
    pythEmpty      : '⬆ Enter the two legs and press Prove',

    /* ── Karaji / Pascal-precursor ── */
    tabKaraji      : 'Al-Karajī Triangle',
    krTitle        : 'Al-Karajī & al-Samawʾal Triangle',
    krSource       : 'Al-Karajī (~1000 CE) & al-Samawʾal (~1150 CE) · coefficients of (x+y)ⁿ six centuries before Pascal',
    krLabelN       : 'Rows',
    krStart        : '▶ Build triangle',
    krInitDesc     : 'Enter the number of rows and press Build to see the binomial-coefficient triangle constructed row by row.',
    krEmpty        : '⬆ Enter rows and press Build',

    /* ── Al-Kashi's π ── */
    tabKashi       : "Al-Kashi's π",
    kashiTitle     : "Al-Kashi Computing π to 16 Decimal Places",
    kashiSource    : "Ghiyāth al-Dīn al-Kāshī — Risāla al-muḥīṭiyya (Samarkand, 1424 CE)",
    kashiStart     : '▶ Start doubling',
    kashiInitDesc  : 'Press "Start" to see how al-Kashi doubled the sides of a regular polygon 28 times to obtain π to 16 decimal places.',
    kashiEmpty     : '⬆ Press Start doubling',
  }
};

function t(key, ...args) {
  const val = UI[currentLang][key];
  return typeof val === 'function' ? val(...args) : (val ?? key);
}

function switchLang() {
  currentLang = currentLang === 'ar' ? 'en' : 'ar';

  const html = document.documentElement;
  html.lang = currentLang;
  html.dir  = currentLang === 'ar' ? 'rtl' : 'ltr';

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    /* INPUT fields (.value) vs everything else including <button> (.textContent) */
    if (el.tagName === 'INPUT') {
      el.value = t(key);
    } else {
      el.textContent = t(key);
    }
  });

  /* Re-render active panels */
  if (divSteps.length) { renderDiv(); setNav('div', divSteps, divIdx); }
  if (mulSteps.length) { renderMul(); setNav('mul', mulSteps, mulIdx); }
  if (sqSteps.length)  { renderSq();  setNav('sq',  sqSteps,  sqIdx);  }
  if (cbSteps.length)  { renderCb();  setNav('cb',  cbSteps,  cbIdx);  }
  if (mzSteps.length)  { renderMz();  setNav('mz',  mzSteps,  mzIdx);  }
  if (fpSteps.length)  { renderFp();  setNav('fp',  fpSteps,  fpIdx);  }
  if (dcSteps.length)  { renderDc();  setNav('dc',  dcSteps,  dcIdx);  }
  if (jbSteps.length)  { renderJb();  setNav('jb',  jbSteps,  jbIdx);  }
  if (typeof krSteps !== 'undefined' && krSteps.length) { renderKr(); setNav('kr', krSteps, krIdx); }

  /* Reset empty desc for unstarted panels */
  if (!divSteps.length) document.getElementById('div-desc').textContent = t('divInitDesc');
  if (!mulSteps.length) document.getElementById('mul-desc').textContent = t('mulInitDesc');
  if (!sqSteps.length)  document.getElementById('sq-desc').textContent  = t('sqrtInitDesc');
  if (!cbSteps.length)  document.getElementById('cb-desc').textContent  = t('cbrtInitDesc');
  if (!mzSteps.length)  document.getElementById('mz-desc').textContent  = t('mizanInitDesc');
  if (!fpSteps.length)  document.getElementById('fp-desc').textContent  = t('fpInitDesc');
  if (!dcSteps.length)  document.getElementById('dc-desc').textContent  = t('decInitDesc');
  if (!jbSteps.length)  document.getElementById('jb-desc').textContent  = t('jabrInitDesc');
}
