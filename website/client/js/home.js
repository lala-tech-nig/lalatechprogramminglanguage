// ============================================================
// HOME.JS — Homepage logic (White Theme)
// ============================================================

// ---- DIALECT CODE SAMPLES ----
const DIALECT_SAMPLES = {
  english: {
    label: 'English',
    flag: '🇬🇧',
    file: 'main.lala',
    code: `// LALA — English Dialect
class Greeter {
  init(name) {
    this.name = name
  }

  hello() {
    let msg = "Hello, " + this.name + "!"
    print(msg)
    return msg
  }
}

let g = new Greeter("World")
g.hello()

// JS interop — no boilerplate
let pi = js.Math.PI
print("Pi is: " + pi)`
  },
  yoruba: {
    label: 'Yorùbá',
    flag: '🇳🇬',
    file: 'kaabo.lala',
    code: `// LALA — Yorùbá Dialect
ẹgbẹ Olóòrúkọ {
  init(orukọ) {
    this.orukọ = orukọ
  }

  kaabọ() {
    jẹ ifiranṣẹ = "Ẹ káàbọ̀, " + this.orukọ + "!"
    sọ(ifiranṣẹ)
    padà ifiranṣẹ
  }
}

jẹ g = new Olóòrúkọ("Àgbáyé")
g.kaabọ()

// JS interop
jẹ pi = js.Math.PI
sọ("Pi jẹ: " + pi)`
  },
  hausa: {
    label: 'Hausa',
    flag: '🇳🇬',
    file: 'barka.lala',
    code: `// LALA — Hausa Dialect
ajin Mai_Suna {
  init(suna) {
    this.suna = suna
  }

  barka() {
    bari sako = "Sannu, " + this.suna + "!"
    nuna(sako)
    dawo sako
  }
}

bari g = new Mai_Suna("Duniya")
g.barka()

// JS interop
bari pi = js.Math.PI
nuna("Pi shine: " + pi)`
  },
  igbo: {
    label: 'Igbo',
    flag: '🇳🇬',
    file: 'nnoo.lala',
    code: `// LALA — Igbo Dialect
otu Onye_Aha {
  init(aha) {
    this.aha = aha
  }

  nnọọ() {
    were ozi = "Nnọọ, " + this.aha + "!"
    bịpụta(ozi)
    laghachi ozi
  }
}

were g = new Onye_Aha("Ụwa")
g.nnọọ()

// JS interop
were pi = js.Math.PI
bịpụta("Pi bụ: " + pi)`
  }
};

// ---- INIT DIALECT TABS ----
let activeDialect = 'english';
const dialectCodeEl = document.getElementById('dialect-code-display');
const dialectFileLabel = document.getElementById('dialect-file-label');

function renderDialect(key) {
  const sample = DIALECT_SAMPLES[key];
  if (!dialectCodeEl || !sample) return;
  activeDialect = key;

  // Syntax highlight
  const highlighted = highlightCode(sample.code, key);
  dialectCodeEl.innerHTML = highlighted;
  if (dialectFileLabel) dialectFileLabel.textContent = sample.file;

  // Update tab active states
  document.querySelectorAll('.dialect-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.dialect === key);
  });
}

document.querySelectorAll('.dialect-tab').forEach(tab => {
  tab.addEventListener('click', () => renderDialect(tab.dataset.dialect));
});

// Initialize
renderDialect('english');

// ---- HERO LANG CYCLE ----
const langCycleEl = document.getElementById('hero-lang-cycle');
const LANGS = ['English', 'Yorùbá', 'Hausa', 'Igbo'];
let langIdx = 0;
if (langCycleEl) {
  setInterval(() => {
    langIdx = (langIdx + 1) % LANGS.length;
    langCycleEl.style.opacity = '0';
    setTimeout(() => {
      langCycleEl.textContent = LANGS[langIdx];
      langCycleEl.style.opacity = '1';
    }, 200);
  }, 2500);
}

// ---- STAT COUNTERS ----
(function initCounters() {
  const targets = {
    'sn-2': { val: 2000000, suffix: 'M', display: '2M' },
    'sn-3': { val: 500000,  suffix: 'K', display: '500K' }
  };
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const id = e.target.id;
      const t = targets[id];
      if (t) { e.target.textContent = t.display; }
      obs.unobserve(e.target);
    });
  }, { threshold: 0.5 });
  Object.keys(targets).forEach(id => {
    const el = document.getElementById(id);
    if (el) obs.observe(el);
  });
})();

// ---- SMOOTH SCROLL INDICATOR ----
const scrollIndicator = document.querySelector('.scroll-indicator');
if (scrollIndicator) {
  window.addEventListener('scroll', () => {
    scrollIndicator.style.opacity = window.scrollY > 50 ? '0' : '1';
    scrollIndicator.style.transform = window.scrollY > 50 ? 'translateY(10px)' : '';
  }, { passive: true });
}

// ---- COPY NPM (from home page) ----
// Handled in global.js via window.copyNpm
