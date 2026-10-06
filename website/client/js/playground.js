// ============================================================
// LALA PLAYGROUND JAVASCRIPT
// Full browser-based LALA interpreter simulation
// ============================================================

// ---- CODE EXAMPLES ----
const EXAMPLES = {
  hello: {
    label: '👋 Hello World',
    dialect: 'english',
    code: `// Hello World in LALA (English)
let name = "World"
print("Hello, " + name + "!")
print("LALA v1.0.0 — Multilingual Programming")
print("Supported dialects: English, Yorùbá, Hausa, Igbo")`
  },
  loops: {
    label: '🔄 For Loops',
    dialect: 'english',
    code: `// Three types of for loops in LALA

// 1. Range loop
print("=== Range Loop ===")
for i in 1..5 {
    print("Step:", i)
}

// 2. Collection loop
print("\\n=== Collection Loop ===")
let cities = ["Lagos", "Kano", "Enugu", "Ibadan"]
for city in cities {
    print("City:", city)
}

// 3. C-style loop
print("\\n=== C-Style Loop ===")
for (let k = 10; k > 0; k -= 3) {
    print("Countdown:", k)
}`
  },
  functions: {
    label: '🔧 Functions & Closures',
    dialect: 'english',
    code: `// Functions and closures in LALA

fn greet(name, lang = "English") {
    return "Hello from " + lang + ", " + name + "!"
}

print(greet("Adewale"))
print(greet("Amina", "Hausa"))

// Closure example
fn make_counter(start) {
    let count = start
    fn increment() {
        count += 1
        return count
    }
    return increment
}

let counter = make_counter(10)
print("Counter:", counter())
print("Counter:", counter())
print("Counter:", counter())

// Recursion
fn factorial(n) {
    if (n <= 1) { return 1 }
    return n * factorial(n - 1)
}

print("5! =", factorial(5))
print("8! =", factorial(8))`
  },
  oop: {
    label: '🏦 OOP — BankAccount',
    dialect: 'english',
    code: `// Object-Oriented Programming in LALA

class BankAccount {
    init(owner, balance) {
        this.owner = owner
        this.balance = balance
    }

    deposit(amount) {
        this.balance += amount
        print("Deposited ₦" + amount + " for " + this.owner)
        return this.balance
    }

    withdraw(amount) {
        if (amount > this.balance) {
            print("Error: Insufficient funds!")
            return false
        }
        this.balance -= amount
        print("Withdrew ₦" + amount)
        return true
    }

    getBalance() {
        return "Balance: ₦" + this.balance
    }
}

let account = new BankAccount("Chidi Obi", 50000)
account.deposit(15000)
account.withdraw(8000)
print(account.getBalance())`
  },
  async: {
    label: '⚡ Async/Await',
    dialect: 'english',
    code: `// Asynchronous programming in LALA

async fn fetch_user(id) {
    print("Fetching user", id, "...")
    // Simulating async call
    let user = {
        id: id,
        name: "User_" + id,
        status: "active"
    }
    return user
}

async fn main() {
    let user1 = await fetch_user(101)
    print("Got user:", user1.name)

    let user2 = await fetch_user(202)
    print("Got user:", user2.name)

    print("Done! Both users loaded.")
}

main()`
  },
  js_interop: {
    label: '🔗 JS Interop',
    dialect: 'english',
    code: `// JavaScript Interoperability in LALA

// Math operations via JS
let pi = js.Math.PI
let sqrt144 = js.Math.sqrt(144)
let maxVal = js.Math.max(12, 99, 45, 7)
let random = js.Math.floor(js.Math.random() * 100)

print("π =", pi)
print("√144 =", sqrt144)
print("max(12,99,45,7) =", maxVal)
print("Random 0-99:", random)

// Date operations
let now = js.Date.now()
print("Epoch timestamp:", now)

// JSON operations
let data = { lang: "LALA", version: "1.0.0", dialects: 4 }
let jsonStr = js.JSON.stringify(data)
print("JSON:", jsonStr)

let parsed = js.JSON.parse(jsonStr)
print("Parsed lang:", parsed.lang)`
  },
  yoruba_hello: {
    label: '🇳🇬 Yorùbá',
    dialect: 'yoruba',
    code: `// LALA — Ede Yorùbá
// Ẹ káàbọ̀ sí LALA!

je oruko = "Babatunde"
je ojo_ori = 28
je omo_naija = otito

ti (ojo_ori >= 18 ati omo_naija == otito) {
    te("E kaabo, " + oruko + "! O yege lati dibo.")
} bikose {
    te("E ma binu, o ko tii yege.")
}

// Lupu 'fun' — for loop
te("\\nAwon nomba paapaa:")
fun nomba ninu 1..10 {
    ti (nomba % 2 == 0) {
        te("  Nomba paapaa: " + nomba)
    }
}

// Iṣẹ́ — function
ise ki_oruko(eniyan) {
    pada "Oruko mi ni: " + eniyan
}

te("\\n" + ki_oruko(oruko))`
  },
  hausa_hello: {
    label: '🇳🇬 Hausa',
    dialect: 'hausa',
    code: `// LALA — Harshen Hausa
// Barka da zuwa!

bari suna = "Amina Bello"
bari kudi = 15000
bari mai_aiki = gaskiya

idan (kudi > 10000 da mai_aiki == gaskiya) {
    buga("Sannu da aiki, " + suna + "! Asusunka yana da kyau.")
} kuma {
    buga("Asusunka yana bukatar kulawa.")
}

// Madauki 'don' — for loop
buga("\\nLambobim:")
don lamba cikin 1..8 {
    idan (lamba == 3 ko lamba == 6) {
        buga("  Lamba ta musamman: " + lamba)
    }
}

// Aiki — function
aiki salamar_gida(sunan) {
    koma "Sannu da zuwa, " + sunan + "!"
}

buga("\\n" + salamar_gida(suna))`
  },
  igbo_hello: {
    label: '🇳🇬 Igbo',
    dialect: 'igbo',
    code: `// LALA — Asụsụ Igbo
// Nnọọ!

ka onye_ahia = "Emeka Okonkwo"
ka ego_ahia = 50000
ka debanyere_aha = eziokwu

oburu (ego_ahia >= 20000 na debanyere_aha == eziokwu) {
    dee("Daalụ, " + onye_ahia + "! Azụmahịa gị tozuru oke.")
} ozor {
    dee("Biko deba aha gị n'akwụkwọ.")
}

// Loop 'maka' — for loop
dee("\\nNọmba ọ bụghị abụọ:")
maka i nime 1..10 {
    oburu (i % 2 != 0 na abughi (i == 1)) {
        dee("  Nọmba pụrụ iche: " + i)
    }
}

// Ọrụ — function
oru ekele(aha) {
    lota "Nnọọ, " + aha + "! Ị nabatara."
}

dee("\\n" + ekele(onye_ahia))`
  }
};

// ---- QUICK SNIPPET CHIPS ----
const QUICK_SNIPPETS = [
  { label: 'Hello World', key: 'hello' },
  { label: 'For Loop', key: 'loops' },
  { label: 'OOP Class', key: 'oop' },
  { label: 'Async/Await', key: 'async' },
  { label: 'JS Math', key: 'js_interop' },
  { label: 'Yorùbá', key: 'yoruba_hello' },
  { label: 'Hausa', key: 'hausa_hello' },
  { label: 'Igbo', key: 'igbo_hello' },
];

// ---- LALA INTERPRETER SIMULATION ----
class LalaInterpreter {
  constructor() {
    this.env = {};
    this.output = [];
    this.dialect = 'english';
  }

  setDialect(d) { this.dialect = d; }

  run(code) {
    this.output = [];
    this.env = {};
    
    try {
      // Normalize dialect keywords to English equivalents
      const normalized = this.normalizeDialect(code);
      
      // Evaluate line by line (simplified simulation)
      this.evalProgram(normalized);
    } catch (e) {
      this.output.push({ type: 'error', text: `RuntimeError: ${e.message}` });
    }
    
    return this.output;
  }

  normalizeDialect(code) {
    const maps = {
      // Yoruba
      'je ': 'let ', 'duro ': 'const ', 'ti (': 'if (', 'ti{': 'if{',
      'bikose': 'else', 'tabiti': 'elif', 'fun ': 'for ', 'ninu ': 'in ',
      'nigbati': 'while', 'ise ': 'fn ', 'pada ': 'return ', 'pada\n': 'return\n',
      'te(': 'print(', 'otito': 'true', 'iro': 'false', 'ofo': 'null',
      'ati ': 'and ', 'tabi ': 'or ', ' ko ': ' not ', ' ko(': ' not(',
      // Hausa
      'bari ': 'let ', 'tsaye ': 'const ', 'idan ': 'if ', 'kuma': 'else',
      'kodan': 'elif', 'don ': 'for ', 'cikin ': 'in ', 'yayin': 'while',
      'aiki ': 'fn ', 'koma ': 'return ', 'buga(': 'print(', 'gaskiya': 'true',
      'kariya': 'false', 'babu': 'null', ' da ': ' and ', ' ko ': ' or ', ' ba ': ' not ',
      // Igbo
      'ka ': 'let ', 'kwusie ': 'const ', 'oburu ': 'if ', 'ozor': 'else',
      'moburu': 'elif', 'maka ': 'for ', 'nime ': 'in ', 'mgbe': 'while',
      'oru ': 'fn ', 'lota ': 'return ', 'dee(': 'print(', 'eziokwu': 'true',
      'asi': 'false', 'efu': 'null', ' na ': ' and ', ' maobu ': ' or ', ' abughi ': ' not ',
    };

    let result = code;
    Object.entries(maps).forEach(([from, to]) => {
      result = result.split(from).join(to);
    });
    return result;
  }

  evalProgram(code) {
    // Simple simulation: Parse print statements and basic expressions
    const lines = code.split('\n');
    let i = 0;

    while (i < lines.length) {
      const line = lines[i].trim();
      
      if (!line || line.startsWith('//') || line.startsWith('#') || line.startsWith('/*')) {
        i++;
        continue;
      }

      // Variable declaration
      if (line.match(/^(let|const)\s+(\w+)\s*=\s*(.+)/)) {
        const [, , name, valStr] = line.match(/^(let|const)\s+(\w+)\s*=\s*(.+)/);
        this.env[name] = this.evalExpr(valStr.replace(/;$/, '').trim());
        i++;
        continue;
      }

      // Print statement
      if (line.match(/^print\s*\(/)) {
        const inner = this.extractArgs(line, 'print');
        const parts = this.parseArgList(inner);
        const values = parts.map(p => this.evalExpr(p.trim()));
        this.output.push({ type: 'output', text: values.map(v => this.stringify(v)).join(' ') });
        i++;
        continue;
      }

      // Assignment
      if (line.match(/^(\w+)\s*([\+\-\*\/]?)=\s*(.+)/)) {
        const [, name, op, valStr] = line.match(/^(\w+)\s*([\+\-\*\/]?)=\s*(.+)/);
        if (name in this.env) {
          const newVal = this.evalExpr(valStr.replace(/;$/, '').trim());
          if (op === '+') this.env[name] = this.env[name] + newVal;
          else if (op === '-') this.env[name] = this.env[name] - newVal;
          else if (op === '*') this.env[name] = this.env[name] * newVal;
          else if (op === '/') this.env[name] = this.env[name] / newVal;
          else this.env[name] = newVal;
        }
        i++;
        continue;
      }

      // For-in range loop
      const forRangeMatch = line.match(/^for\s+(\w+)\s+in\s+(\d+)\.\.(\d+)\s*\{?/);
      if (forRangeMatch) {
        const [, varName, startStr, endStr] = forRangeMatch;
        const start = parseInt(startStr), end = parseInt(endStr);
        // Find block
        const { block, nextLine } = this.extractBlock(lines, i);
        for (let v = start; v <= end; v++) {
          this.env[varName] = v;
          const blockNorm = this.normalizeDialect(block);
          this.evalProgram(blockNorm);
        }
        i = nextLine;
        continue;
      }

      // For-in collection
      const forColMatch = line.match(/^for\s+(\w+)\s+in\s+(\w+)\s*\{?/);
      if (forColMatch) {
        const [, itemName, collName] = forColMatch;
        const coll = this.env[collName];
        const { block, nextLine } = this.extractBlock(lines, i);
        if (Array.isArray(coll)) {
          for (const item of coll) {
            this.env[itemName] = item;
            this.evalProgram(this.normalizeDialect(block));
          }
        }
        i = nextLine;
        continue;
      }

      // If statement (simplified)
      if (line.match(/^if\s*\(/)) {
        const condMatch = line.match(/^if\s*\((.+?)\)\s*\{?/);
        if (condMatch) {
          const cond = this.evalCondition(condMatch[1]);
          const { block, nextLine } = this.extractBlock(lines, i);
          if (cond) this.evalProgram(this.normalizeDialect(block));
          i = nextLine;
          continue;
        }
      }

      i++;
    }
  }

  extractBlock(lines, startIdx) {
    let depth = 0;
    let blockLines = [];
    let started = false;
    let i = startIdx;

    for (; i < lines.length; i++) {
      const line = lines[i];
      if (line.includes('{')) {
        if (!started) { started = true; depth = 1; continue; }
        depth++;
      }
      if (started && line.includes('}')) {
        depth--;
        if (depth === 0) { i++; break; }
      }
      if (started && depth > 0) blockLines.push(line);
    }

    return { block: blockLines.join('\n'), nextLine: i };
  }

  parseArgList(str) {
    const parts = [];
    let depth = 0;
    let current = '';
    for (const ch of str) {
      if (ch === '(' || ch === '[' || ch === '{') depth++;
      if (ch === ')' || ch === ']' || ch === '}') depth--;
      if (ch === ',' && depth === 0) { parts.push(current); current = ''; }
      else current += ch;
    }
    if (current.trim()) parts.push(current);
    return parts;
  }

  extractArgs(line, fnName) {
    const start = line.indexOf(fnName + '(') + fnName.length + 1;
    let depth = 1;
    let i = start;
    while (i < line.length && depth > 0) {
      if (line[i] === '(') depth++;
      if (line[i] === ')') depth--;
      i++;
    }
    return line.slice(start, i - 1);
  }

  evalCondition(expr) {
    try {
      const norm = expr
        .replace(/\band\b/g, '&&').replace(/\bor\b/g, '||').replace(/\bnot\b/g, '!')
        .replace(/\btrue\b/g, 'true').replace(/\bfalse\b/g, 'false');
      
      const fn = new Function(...Object.keys(this.env), `return (${norm});`);
      return fn(...Object.values(this.env));
    } catch { return false; }
  }

  evalExpr(expr) {
    if (!expr) return undefined;
    expr = expr.trim().replace(/;$/, '');

    // String literal
    if ((expr.startsWith('"') && expr.endsWith('"')) || (expr.startsWith("'") && expr.endsWith("'"))) {
      return expr.slice(1, -1).replace(/\\n/g, '\n').replace(/\\t/g, '\t');
    }

    // Number
    if (!isNaN(expr)) return parseFloat(expr);

    // Boolean / null
    if (expr === 'true') return true;
    if (expr === 'false') return false;
    if (expr === 'null') return null;

    // Array literal
    if (expr.startsWith('[') && expr.endsWith(']')) {
      const inner = expr.slice(1, -1);
      const parts = this.parseArgList(inner);
      return parts.map(p => this.evalExpr(p.trim())).filter(v => v !== undefined || true);
    }

    // Object literal
    if (expr.startsWith('{') && expr.endsWith('}')) {
      const obj = {};
      const inner = expr.slice(1, -1);
      const parts = this.parseArgList(inner);
      parts.forEach(p => {
        const colonIdx = p.indexOf(':');
        if (colonIdx > 0) {
          const key = p.slice(0, colonIdx).trim().replace(/['"]/g, '');
          obj[key] = this.evalExpr(p.slice(colonIdx + 1).trim());
        }
      });
      return obj;
    }

    // String concatenation / arithmetic
    if (expr.includes('+')) {
      const parts = this.splitByOp(expr, '+');
      if (parts.length > 1) {
        const vals = parts.map(p => this.evalExpr(p.trim()));
        if (vals.some(v => typeof v === 'string')) return vals.map(v => this.stringify(v)).join('');
        return vals.reduce((a, b) => a + b, 0);
      }
    }

    // Variable reference
    if (/^\w+$/.test(expr) && expr in this.env) return this.env[expr];

    // Property access
    if (expr.includes('.')) {
      const parts = expr.split('.');
      let val = this.env[parts[0]];
      for (let i = 1; i < parts.length && val !== undefined; i++) val = val[parts[i]];
      return val;
    }

    // JS Math calls
    if (expr.startsWith('js.Math.')) {
      const methodCall = expr.slice('js.Math.'.length);
      const methodMatch = methodCall.match(/^(\w+)\((.*)?\)/);
      if (methodMatch) {
        const [, method, argsStr] = methodMatch;
        const args = argsStr ? this.parseArgList(argsStr).map(a => this.evalExpr(a.trim())) : [];
        if (typeof Math[method] === 'function') return Math[method](...args);
        if (Math[method] !== undefined) return Math[method];
      }
    }

    if (expr === 'js.Math.PI') return Math.PI;
    if (expr === 'js.Date.now()') return Date.now();

    // Arithmetic
    try {
      const fn = new Function(...Object.keys(this.env), `return (${expr});`);
      return fn(...Object.values(this.env));
    } catch { return expr; }
  }

  splitByOp(expr, op) {
    const parts = [];
    let depth = 0, current = '', i = 0;
    while (i < expr.length) {
      const ch = expr[i];
      if (ch === '"' || ch === "'") {
        const q = ch;
        current += ch; i++;
        while (i < expr.length && expr[i] !== q) { current += expr[i]; i++; }
        current += expr[i] || '';
      } else if (ch === '(' || ch === '[' || ch === '{') { depth++; current += ch; }
      else if (ch === ')' || ch === ']' || ch === '}') { depth--; current += ch; }
      else if (ch === op && depth === 0) { parts.push(current); current = ''; }
      else { current += ch; }
      i++;
    }
    if (current) parts.push(current);
    return parts;
  }

  stringify(val) {
    if (val === null) return 'null';
    if (val === undefined) return 'undefined';
    if (Array.isArray(val)) return '[' + val.map(v => typeof v === 'string' ? `"${v}"` : this.stringify(v)).join(', ') + ']';
    if (typeof val === 'object') return JSON.stringify(val);
    return String(val);
  }
}

// ---- DOM SETUP ----
const editor = document.getElementById('code-editor');
const highlightPre = document.getElementById('editor-highlight-pre');
const lineNumbers = document.getElementById('line-numbers');
const outputArea = document.getElementById('output-area');
const dialectSelect = document.getElementById('dialect-select');
const exampleSelect = document.getElementById('example-select');
const runBtn = document.getElementById('run-btn');
const runIcon = document.getElementById('run-icon');
const clearBtn = document.getElementById('clear-btn');
const clearOutputBtn = document.getElementById('clear-output-btn');
const copyOutputBtn = document.getElementById('copy-output-btn');
const examplesList = document.getElementById('examples-list');
const statusLang = document.getElementById('status-lang');
const statusLines = document.getElementById('status-lines');

const interpreter = new LalaInterpreter();

// Build example chips
if (examplesList) {
  QUICK_SNIPPETS.forEach(({ label, key }) => {
    const chip = document.createElement('button');
    chip.className = 'example-chip';
    chip.textContent = EXAMPLES[key].label;
    chip.addEventListener('click', () => loadExample(key));
    examplesList.appendChild(chip);
  });
}

// Load example
function loadExample(key) {
  const ex = EXAMPLES[key];
  if (!ex) return;
  editor.value = ex.code;
  dialectSelect.value = ex.dialect;
  interpreter.setDialect(ex.dialect);
  updateHighlight();
  updateLineNumbers();
  updateStatus();
  if (exampleSelect) exampleSelect.value = '';
}

// Load default example
loadExample('hello');

// Dialect change
dialectSelect.addEventListener('change', () => {
  interpreter.setDialect(dialectSelect.value);
  updateStatus();
});

// Example select dropdown
exampleSelect.addEventListener('change', () => {
  if (exampleSelect.value) loadExample(exampleSelect.value);
});

// Editor input handling
function updateHighlight() {
  if (!highlightPre) return;
  highlightPre.innerHTML = highlightLala(editor.value + '\n');
}

function updateLineNumbers() {
  if (!lineNumbers) return;
  const lines = editor.value.split('\n').length;
  lineNumbers.innerHTML = Array.from({ length: lines }, (_, i) => `<div>${i + 1}</div>`).join('');
}

function updateStatus() {
  const lines = editor.value.split('\n').length;
  if (statusLines) statusLines.textContent = `${lines} line${lines !== 1 ? 's' : ''}`;
  const dialects = { english: 'English Dialect', yoruba: 'Yorùbá Dialect', hausa: 'Hausa Dialect', igbo: 'Igbo Dialect' };
  if (statusLang) statusLang.textContent = dialects[dialectSelect.value] || 'English Dialect';
}

editor.addEventListener('input', () => {
  updateHighlight();
  updateLineNumbers();
  updateStatus();
});

editor.addEventListener('scroll', () => {
  if (highlightPre && highlightPre.parentElement) {
    highlightPre.parentElement.scrollTop = editor.scrollTop;
    highlightPre.parentElement.scrollLeft = editor.scrollLeft;
  }
  if (lineNumbers) lineNumbers.scrollTop = editor.scrollTop;
});

// Tab key handling
editor.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    e.preventDefault();
    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    editor.value = editor.value.slice(0, start) + '  ' + editor.value.slice(end);
    editor.selectionStart = editor.selectionEnd = start + 2;
    updateHighlight();
  }
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    e.preventDefault();
    runCode();
  }
});

// ---- RUN CODE ----
async function runCode() {
  const code = editor.value.trim();
  if (!code) { showToast('Write some code first!', 'warn'); return; }

  // Clear and show running state
  clearOutput();
  
  const runningEl = document.createElement('div');
  runningEl.className = 'running-indicator';
  runningEl.innerHTML = `<span>Running...</span><div class="running-dots"><span></span><span></span><span></span></div>`;
  outputArea.appendChild(runningEl);

  runBtn.disabled = true;
  runIcon.textContent = '⏳';

  await new Promise(r => setTimeout(r, 300));

  try {
    interpreter.setDialect(dialectSelect.value);
    const results = interpreter.run(code);

    runningEl.remove();

    if (results.length === 0) {
      addOutputLine('(Program completed with no output)', 'info');
    } else {
      results.forEach(({ type, text }) => {
        text.split('\n').forEach(line => addOutputLine(line, type));
      });
    }

    addSeparator();
    addOutputLine(`✅ Program finished (${results.filter(r => r.type !== 'error').length} outputs)`, 'success');
  } catch (e) {
    runningEl.remove();
    addOutputLine(`❌ Error: ${e.message}`, 'error');
  }

  runBtn.disabled = false;
  runIcon.textContent = '▶';
}

function addOutputLine(text, type = 'output') {
  const line = document.createElement('div');
  line.className = `output-line output-${type}`;
  const prefix = document.createElement('span');
  prefix.className = 'output-prefix';
  prefix.textContent = type === 'output' ? '>' : type === 'error' ? '!' : type === 'success' ? '✓' : '~';
  const content = document.createElement('span');
  content.textContent = text;
  line.appendChild(prefix);
  line.appendChild(content);
  outputArea.appendChild(line);
  outputArea.scrollTop = outputArea.scrollHeight;
}

function addSeparator() {
  const sep = document.createElement('hr');
  sep.className = 'output-separator';
  outputArea.appendChild(sep);
}

function clearOutput() {
  outputArea.innerHTML = '';
}

// Buttons
runBtn.addEventListener('click', runCode);
clearBtn.addEventListener('click', () => {
  editor.value = '';
  updateHighlight();
  updateLineNumbers();
  updateStatus();
  clearOutput();
});
clearOutputBtn.addEventListener('click', clearOutput);
copyOutputBtn.addEventListener('click', () => {
  const text = [...outputArea.querySelectorAll('.output-line')].map(el => el.textContent).join('\n');
  copyToClipboard(text || 'No output to copy');
});

// Init
updateHighlight();
updateLineNumbers();
updateStatus();
