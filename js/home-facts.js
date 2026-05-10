/* ════════════════════════════════════════════
   HOME FACTS  ·  random 3-card spotlight
   Source pool migrated from old facts deck.
   No coloured emoji icons (per design rules).
════════════════════════════════════════════ */

const HOME_FACTS = [
  {
    titleAr:'الكاشي ومفتاح الحساب',
    titleEn:'Al-Kashi & the Key of Arithmetic',
    bodyAr:'ألّف جمشيد الكاشي (1380–1429م) كتابه "مفتاح الحساب" عام 1427م أشمل موسوعة حساب في عصره. كتبه بمرصد أولوغ بك في سمرقند.',
    bodyEn:'Jamshid al-Kashi (1380–1429 CE) completed "Miftāḥ al-Ḥisāb" in 1427 CE the most comprehensive arithmetic encyclopedia of its era, written at Ulugh Beg\'s observatory in Samarkand.',
    tagAr:'1427م · سمرقند', tagEn:'1427 CE · Samarkand'
  },
  {
    titleAr:'اختراع الكسور العشرية',
    titleEn:'Invention of Decimal Fractions',
    bodyAr:'الكاشي أول من استخدم الكسور العشرية استخداماً منهجياً في الحساب سبق العالم الأوروبي سيمون ستيفن بنحو مائة وخمسين عاماً.',
    bodyEn:'Al-Kashi was the first to systematically use decimal fractions in computation about 150 years before the European Simon Stevin claimed the same idea.',
    tagAr:'1427م · الأسبقية الإسلامية', tagEn:'1427 CE · Islamic priority'
  },
  {
    titleAr:'القسمة المطولة عند الكاشي',
    titleEn:'Al-Kashi\'s Long Division',
    bodyAr:'وصف الكاشي خوارزمية القسمة المطولة بصورة مفصّلة تبدأ من اليسار وتستهلك أرقام المقسوم تدريجياً، وهي الطريقة ذاتها التي نتعلمها في المدارس اليوم.',
    bodyEn:'Al-Kashi described long division in meticulous detail working left to right, consuming dividend digits progressively. This is the same algorithm taught in schools today.',
    tagAr:'القرن 15م · الحساب', tagEn:'15th century · Arithmetic'
  },
  {
    titleAr:'الضرب بالشبكة وفيبوناتشي',
    titleEn:'Lattice Multiplication & Fibonacci',
    bodyAr:'طريقة الضرب بالشبكة كانت معيارية في المدارس الإسلامية قبل أن يذكرها فيبوناتشي في "Liber Abaci" عام 1202م. انتقلت إلى أوروبا عبر الترجمات العربية.',
    bodyEn:'Lattice multiplication was standard in Islamic schools long before Fibonacci mentioned it in Liber Abaci (1202 CE). It spread to Europe through Arabic translations.',
    tagAr:'ق.12م · الانتشار الأوروبي', tagEn:'12th century · European spread'
  },
  {
    titleAr:'الميزان طرح التسعات',
    titleEn:'Al-Mīzān Casting Out Nines',
    bodyAr:'تستند طريقة الميزان إلى حقيقة رياضية: أي عدد يساوي مجموع أرقامه بالنسبة للقسمة على 9. استخدمها العلماء قروناً للتحقق من العمليات الكبيرة.',
    bodyEn:'Al-Mīzān rests on the fact that any integer is congruent to the sum of its digits modulo 9. Scholars used it for centuries to verify large calculations without repeating them.',
    tagAr:'التراث الإسلامي · نظرية الأعداد', tagEn:'Islamic heritage · Number theory'
  },
  {
    titleAr:'أصل كلمتَي "جبر" و"خوارزمية"',
    titleEn:'Origins of "Algebra" & "Algorithm"',
    bodyAr:'"Algebra" من "الجبر" عنوان كتاب الخوارزمي (~830م). و"Algorithm" من اسمه "الخوارزمي" بصيغته اللاتينية. كلتاهما من عالم إسلامي واحد.',
    bodyEn:'"Algebra" comes from "al-jabr" the title of al-Khwārazmī\'s book (~830 CE). "Algorithm" derives from his name "al-Khwārazmī" latinised. Both words trace to one Islamic scholar.',
    tagAr:'الخوارزمي · ~830م · بغداد', tagEn:'Al-Khwārazmī · ~830 CE · Baghdad'
  },
  {
    titleAr:'إكمال المربع الهندسي',
    titleEn:'Geometric Completing the Square',
    bodyAr:'برهن الخوارزمي على حل المعادلة س² + بس = جـ بإضافة مربعات هندسية، لا بالجبر الرمزي. كان الجبر في البداية علم هندسي خالص.',
    bodyEn:'Al-Khwārazmī proved x² + bx = c by adding geometric squares, not symbolic algebra. Algebra was originally a purely geometric science.',
    tagAr:'~830م · الجبر الهندسي', tagEn:'~830 CE · Geometric algebra'
  },
  {
    titleAr:'حساب الخطأين',
    titleEn:'Double False Position',
    bodyAr:'تحل طريقة الخطأين معادلة خطية بتخمينين وقياس خطأ كل منهما دون أي جبر رمزي. وردت في مؤلفات إسلامية عديدة قبل الجبر الرمزي الحديث.',
    bodyEn:'Double false position solves a linear equation using two guesses and measuring each error without any symbolic algebra. It appears in numerous Islamic treatises predating modern symbolic methods.',
    tagAr:'التراث الإسلامي · المعادلات الخطية', tagEn:'Islamic heritage · Linear equations'
  },
  {
    titleAr:'الكندي وعلم فك الشفرات',
    titleEn:'Al-Kindī & the Birth of Cryptanalysis',
    bodyAr:'كتب يعقوب الكندي (801–873م) أول رسالة في تاريخ البشرية لفك الشفرات، مبتكراً التحليل التكراري سبق أوروبا بخمسة قرون.',
    bodyEn:'Ya\'qūb al-Kindī (801–873 CE) wrote the first treatise on cryptanalysis in human history, inventing frequency analysis 500 years before Europe discovered the technique.',
    tagAr:'الكندي · ~830م · بغداد', tagEn:'Al-Kindī · ~830 CE · Baghdad'
  },
  {
    titleAr:'الخليل بن أحمد والتوافيق',
    titleEn:'Al-Khalīl ibn Aḥmad & Combinatorics',
    bodyAr:'طبّق الخليل بن أحمد الفراهيدي (718–791م) نظرية التوافيق والتباديل لأول مرة على الأوزان الشعرية العربية أول تطبيق لعلم التوافيق في التاريخ.',
    bodyEn:'Al-Khalīl ibn Aḥmad al-Farāhīdī (718–791 CE) applied combinatorics and permutations for the first time to Arabic prosody the world\'s first combinatorial application.',
    tagAr:'الخليل · ق.8م · البصرة', tagEn:'Al-Khalīl · 8th century · Basra'
  },
  {
    titleAr:'الأعداد الكاملة والمتحابة',
    titleEn:'Perfect & Amicable Numbers',
    bodyAr:'العدد الكامل يساوي مجموع مقسوميه: 6=1+2+3، 28=1+2+4+7+14. والأعداد المتحابة زوجان كل منهما يساوي مجموع مقسومي الآخر: (220، 284). درسها ثابت بن قرة بعمق.',
    bodyEn:'A perfect number equals the sum of its proper divisors: 6=1+2+3, 28=1+2+4+7+14. Amicable pairs are two numbers each equal to the sum of the other\'s divisors: (220, 284) studied deeply by Thābit ibn Qurra.',
    tagAr:'ثابت بن قرة · ~900م', tagEn:'Thābit ibn Qurra · ~900 CE'
  },
  {
    titleAr:'الكاشي وحساب π',
    titleEn:'Al-Kashi\'s Computation of π',
    bodyAr:'حسب الكاشي قيمة π بستة عشر منزلاً عشرياً صحيحة عام 1424م رقم قياسي لم يُتجاوز قبله أو بعده لعقود.',
    bodyEn:'Al-Kashi computed π to 16 correct decimal places in 1424 CE a record unsurpassed for decades before or after.',
    tagAr:'1424م · الدقة الرياضية', tagEn:'1424 CE · Mathematical precision'
  },
  {
    titleAr:'ابن الهيثم وتقريب الجذر التربيعي',
    titleEn:'Ibn al-Haytham\'s Square Root',
    bodyAr:'ابتكر الحسن بن الهيثم (965–1040م) طريقة لتقريب الجذر التربيعي تجد أكبر م يحقق م²≤ن ثم تحسب الجزء الكسري بمعادلة تكرارية.',
    bodyEn:'Al-Ḥasan ibn al-Haytham (965–1040 CE) devised a square root approximation: find the largest integer m with m²≤N, then compute the fractional part iteratively.',
    tagAr:'ابن الهيثم · ~1000م · مصر', tagEn:'Ibn al-Haytham · ~1000 CE · Egypt'
  },
  {
    titleAr:'الخوارزمية التكرارية للجذر',
    titleEn:'Iterative Square Root Algorithm',
    bodyAr:'بنى الكاشي خوارزميته على العلاقة (س+ص)² = س² + ص(2س+ص). تُجزَّأ الأرقام زوجاً، وفي كل خطوة يُوجد أكبر رقم ص. هذا المبدأ ذاته يستخدمه الحاسوب اليوم.',
    bodyEn:'Al-Kashi built his algorithm on the recurrence (s+f)² = s² + f(2s+f). Digits are grouped in pairs; at each step the largest digit f is found. This same principle underlies modern computer square root algorithms.',
    tagAr:'الكاشي · 1427م · سمرقند', tagEn:'Al-Kashi · 1427 CE · Samarkand'
  },
  {
    titleAr:'بردية رايند وتقريب π المصري',
    titleEn:'Rhind Papyrus & Egyptian π',
    bodyAr:'في بردية رايند (~1650ق.م) استخدم المصريون القدماء تقريب π = 256/81 ≈ 3.16 دقة مذهلة لحضارة قبل الميلاد بألفَي سنة.',
    bodyEn:'The Rhind Papyrus (~1650 BC) shows ancient Egyptians used π ≈ 256/81 ≈ 3.16 remarkable precision for a civilisation 2000 years before Christ.',
    tagAr:'~1650ق.م · مصر القديمة', tagEn:'~1650 BC · Ancient Egypt'
  },
  {
    titleAr:'لوح YBC 7289 وتقريب √2',
    titleEn:'Tablet YBC 7289 & √2',
    bodyAr:'يُظهر اللوح البابلي YBC 7289 (~1700ق.م) قطر مربع مع تقريب √2 = 1.41421296 دقة إلى ستة أرقام عشرية منذ أربعة آلاف سنة.',
    bodyEn:'Babylonian tablet YBC 7289 (~1700 BC) shows a square\'s diagonal with √2 ≈ 1.41421296 accurate to 6 decimal places, 4000 years ago.',
    tagAr:'~1700ق.م · بابل', tagEn:'~1700 BC · Babylon'
  },
  {
    titleAr:'المسائل الثلاث الكلاسيكية',
    titleEn:'The Three Classical Problems',
    bodyAr:'تربيع الدائرة، مضاعفة المكعب، وتثليث الزاوية ثلاث مسائل هندسية شغلت الرياضيين لأكثر من ألفَي سنة. درسها علماء إسلاميون بأدوات تتجاوز المسطرة والفرجار.',
    bodyEn:'Squaring the circle, doubling the cube, and trisecting an angle three geometric problems that occupied mathematicians for over 2000 years. Islamic scholars attacked them with tools beyond straight-edge and compass.',
    tagAr:'ق.10م · الهندسة الإسلامية', tagEn:'10th century · Islamic geometry'
  },
  {
    titleAr:'بيت الحكمة في بغداد',
    titleEn:'The House of Wisdom in Baghdad',
    bodyAr:'بلغ بيت الحكمة ذروته في عهد الخليفة المأمون (~830م). كان أعظم مركز علمي في العالم؛ جمع فيه العلماء الترجمات اليونانية والفارسية والهندية في الرياضيات والفلك والطب.',
    bodyEn:'Bayt al-Ḥikma peaked under Caliph al-Ma\'mūn (~830 CE) the world\'s greatest centre of learning, where scholars translated and extended Greek, Persian and Indian works in mathematics, astronomy and medicine.',
    tagAr:'بغداد · ~830م', tagEn:'Baghdad · ~830 CE'
  }
];

const HOME_FACTS_VISIBLE = 3;
let homeFactsLastIndices = [];

function pickRandomFacts(n){
  const pool = HOME_FACTS.slice();
  const out = [];
  while (out.length < n && pool.length){
    const i = Math.floor(Math.random() * pool.length);
    out.push(pool.splice(i, 1)[0]);
  }
  return out;
}

function renderHomeFacts(){
  const grid = document.getElementById('home-facts-grid');
  if (!grid) return;
  const picks = pickRandomFacts(HOME_FACTS_VISIBLE);
  grid.innerHTML = picks.map((f, i) => `
    <div class="home-fact-card" data-fact-slot="${i+1}">
      <div class="home-fact-num">
        <span class="ar-text">حقيقة ${String(i+1).padStart(2,'0')}</span>
        <span class="en-text">FACT ${String(i+1).padStart(2,'0')}</span>
      </div>
      <div class="home-fact-title">
        <span class="ar-text">${f.titleAr}</span>
        <span class="en-text">${f.titleEn}</span>
      </div>
      <div class="home-fact-body">
        <span class="ar-text">${f.bodyAr}</span>
        <span class="en-text">${f.bodyEn}</span>
      </div>
      <div class="home-fact-tag">
        <span class="ar-text">${f.tagAr}</span>
        <span class="en-text">${f.tagEn}</span>
      </div>
    </div>
  `).join('');
}

function shuffleHomeFacts(){
  const grid = document.getElementById('home-facts-grid');
  if (!grid) return;
  grid.classList.add('home-facts-fading');
  setTimeout(() => {
    renderHomeFacts();
    grid.classList.remove('home-facts-fading');
  }, 180);
}

document.addEventListener('DOMContentLoaded', renderHomeFacts);
