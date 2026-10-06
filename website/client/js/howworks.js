// ============================================================
// HOW IT WORKS — JAVASCRIPT
// ============================================================

// Populate keyword table
const keywords = [
  ['for', 'fun / fún', 'don', 'maka', 'KW_FOR'],
  ['in', 'ninu / nínú', 'cikin', 'nime', 'KW_IN'],
  ['while', 'nigbati', 'yayin', 'mgbe', 'KW_WHILE'],
  ['and', 'ati / àti', 'da', 'na', 'KW_AND'],
  ['or', 'tabi / tàbí', 'ko', 'maobu', 'KW_OR'],
  ['not', 'ko / kò', 'ba', 'abughi', 'KW_NOT'],
  ['let', 'je / jẹ́', 'bari', 'ka', 'KW_LET'],
  ['const', 'duro / dúró', 'tsaye', 'kwusie', 'KW_CONST'],
  ['if', 'ti / tí', 'idan', 'oburu', 'KW_IF'],
  ['else', 'bikose', 'kuma', 'ozor', 'KW_ELSE'],
  ['fn / function', 'ise / iṣẹ́', 'aiki', 'oru', 'KW_FN'],
  ['return', 'pada / padà', 'koma', 'lota', 'KW_RETURN'],
  ['true', 'otito / òótọ́', 'gaskiya', 'eziokwu', 'KW_TRUE'],
  ['false', 'iro / irọ́', 'kariya', 'asi', 'KW_FALSE'],
  ['null', 'ofo / òfo', 'babu', 'efu', 'KW_NULL'],
  ['class', 'egbe / ẹgbẹ́', 'aji', 'otu', 'KW_CLASS'],
  ['new', 'tuntun', 'sabo', 'ohuru', 'KW_NEW'],
  ['try', 'gbiyanju', 'gwada', 'nwaa', 'KW_TRY'],
  ['catch', 'mu / mú', 'kama', 'nwute', 'KW_CATCH'],
  ['print', 'te / tẹ', 'buga', 'dee', 'KW_PRINT'],
  ['async', 'asiko', 'lokaci', 'oge', 'KW_ASYNC'],
  ['await', 'duro_de', 'jira', 'chere', 'KW_AWAIT'],
  ['import', 'gba_wole', 'shigo', 'bubata', 'KW_IMPORT'],
  ['export', 'firanmo', 'fitar', 'bupuru', 'KW_EXPORT'],
];

const tableBody = document.getElementById('keyword-table-body');
if (tableBody) {
  keywords.forEach(([en, yo, ha, ig, token]) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${en}</td><td>${yo}</td><td>${ha}</td><td>${ig}</td><td>${token}</td>`;
    tableBody.appendChild(tr);
  });
}

// Syntax demo code
const syntaxDemoEl = document.getElementById('syntax-demo');
if (syntaxDemoEl) {
  syntaxDemoEl.innerHTML = highlightLala(`// English — modern clean syntax
let developer = {
    name: "Chinedu",
    city: "Enugu",
    skills: ["LALA", "Python", "Node.js"]
}

fn greet(person) {
    if (person.city == "Enugu" and not false) {
        print("Welcome from " + person.city + ", " + person.name + "!")
    }
    return person.skills
}

// Range loop — no boilerplate
for i in 1..5 {
    print("Step " + i + ": " + developer.skills[0])
}

// Async/await — native concurrency
async fn load_data() {
    let result = await fetch_remote_api()
    return result
}`);
}

// JS interop code
const jsInteropEl = document.getElementById('js-interop-code');
if (jsInteropEl) {
  jsInteropEl.innerHTML = highlightLala(`// Access JS global APIs — zero boilerplate
let sqrtVal = js.Math.sqrt(625)      // 25
let maxVal = js.Math.max(12, 99, 45) // 99
let now = js.Date.now()              // Epoch ms

// JSON serialization
let jsonStr = js.JSON.stringify({ lang: "LALA", v: "1.0.0" })
print("JSON:", jsonStr)

// Import any Node.js core module
import js "crypto" as jscrypto
import js "path" as jspath
import js "fs" as jsfs

let token = jscrypto.randomBytes(16).toString("hex")
let fullPath = jspath.join("src", "main.lala")

// Dynamic JS evaluation
let upperList = js.eval("['Lagos', 'Kano'].map(s => s.toUpperCase())")`);
}

// Python interop code
const pyInteropEl = document.getElementById('py-interop-code');
if (pyInteropEl) {
  pyInteropEl.innerHTML = highlightLala(`// Import Python standard library
import py "math" as pymath
import py "json" as pyjson
import py "sys" as pysys

print("Pi:", pymath.pi)              // 3.14159...
let sin = pymath.sin(1.5707963)      // 1.0
let sqrt = pymath.sqrt(1024)         // 32.0
print("Python version:", pysys.version)

// List comprehensions — Python-native
let squares = py.eval("[n**2 for n in range(1, 8)]")
print("Squares:", squares)           // [1, 4, 9, 16, 25, 36, 49]

// Import ML libraries (if installed)
import py "numpy" as np
let arr = np.array([1, 2, 3, 4, 5])
let mean = np.mean(arr)              // 3.0`);
}

// Translate demo
const translateEnEl = document.getElementById('translate-en');
const translateYoEl = document.getElementById('translate-yo');

if (translateEnEl) {
  translateEnEl.textContent = `let score = 95
if (score >= 90) {
    print("Grade: A")
} elif (score >= 70) {
    print("Grade: B")
} else {
    print("Grade: C")
}

for i in 1..3 {
    print("Step:", i)
}`;
}

if (translateYoEl) {
  translateYoEl.textContent = `je score = 95
ti (score >= 90) {
    te("Ipele: A")
} tabiti (score >= 70) {
    te("Ipele: B")
} bikose {
    te("Ipele: C")
}

fun i ninu 1..3 {
    te("Igbese:", i)
}`;
}

// Security config
const securityEl = document.getElementById('security-config');
if (securityEl) {
  securityEl.innerHTML = highlightLala(`// lala.config.json — security & permissions
{
  "name": "my-lala-app",
  "version": "1.0.0",
  "dialect": "en",
  "interop": {
    "javascript": true,
    "python": true,
    "allow_js_modules": ["path", "crypto", "fs"],
    "allow_py_modules": ["math", "json", "numpy"]
  },
  "security": {
    "sandbox": false,
    "allow_network": true,
    "allow_filesystem_write": true
  }
}`);
}

// Sidebar active link tracking
const hwSections = document.querySelectorAll('.hw-section');
const sidebarLinks = document.querySelectorAll('.hw-sidebar-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      sidebarLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { threshold: 0.3, rootMargin: '-80px 0px -60% 0px' });

hwSections.forEach(sec => sectionObserver.observe(sec));
