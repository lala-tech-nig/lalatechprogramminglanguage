#!/usr/bin/env node

// LALA CLI Binary
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import { Interpreter } from '../src/runtime.js';
import { translateSource } from '../src/translator.js';

const CONFIG_FILE = 'lala.config.json';
const FALLBACK_CONFIG = 'wazobia.config.json';

function printBanner(dialect = 'en') {
  const greetings = {
    en: 'Welcome to Lala Language (v1.0.0) — Empowering Polyglot Indigenous Computing!',
    yo: 'Ẹ kú àbọ̀ sí èdè Lala (v1.0.0) — Èdè Ìkọ̀wé Kọ̀mpútà ní Èdè Yorùbá, Hausa, Igbo àti Gẹ̀ẹ́sì!',
    ha: 'Barka da zuwa yaren Lala (v1.0.0) — Harshen Shirye-shiryen Kwamfuta a Hausa, Yoruba, Igbo da Ingilishi!',
    ig: 'Nnọọ na asụsụ mmemme Lala (v1.0.0) — Asụsụ Mmemme Kọmputa nwere Asụsụ Igbo, Yoruba, Hausa na Bekee!'
  };

  console.log('╔══════════════════════════════════════════════════════════════════════════╗');
  console.log('║             LALA PROGRAMMING LANGUAGE — OFFICIAL RUNTIME                 ║');
  console.log('║    English • Yorùbá ("Wa") • Hausa ("Zo") • Asụsụ Igbo ("Bia")           ║');
  console.log('║           Zero-Boilerplate JavaScript & Python 3.14 Interop             ║');
  console.log('╚══════════════════════════════════════════════════════════════════════════╝');
  console.log(greetings[dialect] || greetings.en);
  console.log('');
}

function loadConfig() {
  if (fs.existsSync(CONFIG_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
    } catch (_) {}
  }
  if (fs.existsSync(FALLBACK_CONFIG)) {
    try {
      return JSON.parse(fs.readFileSync(FALLBACK_CONFIG, 'utf-8'));
    } catch (_) {}
  }
  return { dialect: 'en', name: 'lala-project', fileExtension: '.lala' };
}

async function runFile(filename) {
  let filePath = path.resolve(process.cwd(), filename);
  if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.lala')) {
    filePath = filePath + '.lala';
  }
  if (!fs.existsSync(filePath)) {
    console.error(`Error: File not found: ${filePath}`);
    process.exit(1);
  }

  const source = fs.readFileSync(filePath, 'utf-8');
  const interpreter = new Interpreter();

  try {
    await interpreter.run(source);
  } catch (err) {
    console.error(`\x1b[31mExecution Error:\x1b[0m ${err.message}`);
    process.exit(1);
  }
}

async function startRepl() {
  const config = loadConfig();
  printBanner(config.dialect);

  const prompts = {
    en: 'lala> ',
    yo: 'lala(yorùbá)> ',
    ha: 'lala(hausa)> ',
    ig: 'lala(igbo)> '
  };

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: prompts[config.dialect] || prompts.en
  });

  const interpreter = new Interpreter();
  rl.prompt();

  for await (const line of rl) {
    const trimmed = line.trim();
    if (trimmed === 'exit' || trimmed === 'quit' || trimmed === 'jade') {
      console.log('O dabọ! / Sai an jima! / Ka ọ dị! / Goodbye!');
      process.exit(0);
    }

    if (trimmed) {
      try {
        const result = await interpreter.run(line);
        if (result !== null && result !== undefined) {
          console.log(`=>`, result);
        }
      } catch (e) {
        console.error(`\x1b[31mError:\x1b[0m ${e.message}`);
      }
    }

    rl.prompt();
  }
}

async function initProject(targetDialect) {
  let dialect = targetDialect ? targetDialect.toLowerCase() : null;

  if (dialect === 'yoruba' || dialect === '2') dialect = 'yo';
  else if (dialect === 'hausa' || dialect === '3') dialect = 'ha';
  else if (dialect === 'igbo' || dialect === '4') dialect = 'ig';
  else if (dialect === 'english' || dialect === '1') dialect = 'en';

  if (!dialect) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    console.log('------------------------------------------------------------------');
    console.log('LALA PROGRAMMING LANGUAGE SETUP WIZARD');
    console.log('Select your primary preferred language for this system/project:');
    console.log('  1) English (en)');
    console.log('  2) Yorùbá (yo) — Wa');
    console.log('  3) Hausa (ha)   — Zo');
    console.log('  4) Asụsụ Igbo (ig) — Bia');
    console.log('------------------------------------------------------------------');

    const answer = await new Promise((resolve) => {
      rl.question('Choose (1-4 or en/yo/ha/ig) [default: 1]: ', resolve);
    });
    rl.close();

    const choice = answer.trim().toLowerCase();
    if (choice === '2' || choice === 'yo' || choice === 'yoruba') {
      dialect = 'yo';
    } else if (choice === '3' || choice === 'ha' || choice === 'hausa') {
      dialect = 'ha';
    } else if (choice === '4' || choice === 'ig' || choice === 'igbo') {
      dialect = 'ig';
    } else {
      dialect = 'en';
    }
  }

  const dialectNames = {
    en: 'English',
    yo: 'Yorùbá',
    ha: 'Hausa',
    ig: 'Asụsụ Igbo'
  };

  const config = {
    name: 'lala-project',
    version: '1.0.0',
    language: 'lala',
    fileExtension: '.lala',
    dialect: dialect,
    dialectName: dialectNames[dialect],
    interop: {
      javascript: true,
      python: true
    }
  };

  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));

  // Generate idiomatic starter file based on selected language
  let starterCode = '';
  if (dialect === 'yo') {
    starterCode = `// Eto Ibẹrẹ Lala (Èdè Yorùbá)
// 1. Awọn Oniyipada ati Awọn Iṣiro (Variables & Logic)
je oruko = "Oluko"
je ojo_ori = 25
je oye = otito

ti (ojo_ori >= 18 ati oye == otito) {
    te("Kaabo, " + oruko + "! O ni anfani lati wole.")
} bikose {
    te("E ma binu, o ko le wole.")
}

// 2. Lupu 'fun' (for loop) ati 'ati' / 'tabi' / 'ko'
te("--- Ise Lupu 'fun' ---")
fun i ninu 1..5 {
    ti (i % 2 == 0 ati ko (i == 4)) {
        te("Nomba paapaa ti a fẹ: " + i)
    }
}

// 3. Ibaraenisọrọ pẹlu JavaScript (JS Interoperability)
je js_akoko = js.Date.now()
te("Akoko JS Lọwọlọwọ: " + js_akoko)
je gbongbo_144 = js.Math.sqrt(144)
te("Gbọngbọ Onigun 144 lati JS: " + gbongbo_144)

// 4. Ibaraenisọrọ pẹlu Python 3.14 (Python Interoperability)
je py_math = py.import("math")
je py_pi = py_math.pi
te("Pi lati Python: " + py_pi)
je py_isin = py_math.sin(1.5707963)
te("Sin(pi/2) lati Python: " + py_isin)
`;
  } else if (dialect === 'ha') {
    starterCode = `// Shirin Farko na Lala (Harshen Hausa)
// 1. Masu Sauyi da Hukunce-hukunce (Variables & Logic)
bari suna = "Malam Musa"
bari shekaru = 24
bari yarda = gaskiya

idan (shekaru >= 18 da yarda == gaskiya) {
    buga("Barka da zuwa, " + suna + "! Kana da izinin shiga.")
} kuma {
    buga("Yi hakuri, ba ka da izini.")
}

// 2. Madauki 'don' (for loop) da 'da' / 'ko' / 'ba'
buga("--- Ayyukan Madauki 'don' ---")
don i cikin 1..5 {
    idan (i % 2 == 0 da ba (i == 4)) {
        buga("Lambar da muke so: " + i)
    }
}

// 3. Haɗin gwiwa da JavaScript (JS Interoperability)
bari js_lokaci = js.Date.now()
buga("Lokaci daga JS: " + js_lokaci)
bari js_tushe = js.Math.sqrt(100)
buga("Tushen lamba 100 daga JS: " + js_tushe)

// 4. Haɗin gwiwa da Python 3.14 (Python Interoperability)
bari py_math = py.import("math")
bari py_cos = py_math.cos(0)
buga("Cos(0) daga Python: " + py_cos)
`;
  } else if (dialect === 'ig') {
    starterCode = `// Mmemme Mbido Lala (Asụsụ Igbo)
// 1. Ndị Na-agbanwe agbanwe na Echiche (Variables & Logic)
ka aha = "Nwokeoma"
ka afo = 22
ka nkwenye = eziokwu

oburu (afo >= 18 na nkwenye == eziokwu) {
    dee("Nnọọ, " + aha + "! I nwere ikike ịbanye.")
} ozor {
    dee("Ndo, ị nweghị ikike.")
}

// 2. Loop 'maka' (for loop) na 'na' / 'maobu' / 'abughi'
dee("--- Loop 'maka' ---")
maka i nime 1..5 {
    oburu (i % 2 == 0 na abughi (i == 4)) {
        dee("Nọmba anyị chọrọ: " + i)
    }
}

// 3. Mmekọrịta na JavaScript (JS Interoperability)
ka js_oge = js.Date.now()
dee("Oge JS Ugbu a: " + js_oge)
ka js_mgbọrọgwụ = js.Math.sqrt(81)
dee("Mgbọrọgwụ 81 site na JS: " + js_mgbọrọgwụ)

// 4. Mmekọrịta na Python 3.14 (Python Interoperability)
ka py_math = py.import("math")
ka py_ike = py_math.pow(2, 8)
dee("2 ike 8 site na Python: " + py_ike)
`;
  } else {
    starterCode = `// Lala Starter Program (English)
// 1. Variables and Logical Operators (and / or / not)
let name = "Amaka"
let age = 20
let verified = true

if (age >= 18 and verified == true) {
    print("Welcome, " + name + "! You are eligible.")
} else {
    print("Access denied.")
}

// 2. 'for' Loops & Logical Precedence
print("--- 'for' Loop Demonstration ---")
for i in 1..5 {
    if (i % 2 == 0 and not (i == 4)) {
        print("Target even number: " + i)
    }
}

// 3. JavaScript Interoperability (Node & Web API)
let jsTime = js.Date.now()
print("Current JS Timestamp: " + jsTime)
let sqrtVal = js.Math.sqrt(256)
print("Square root of 256 from JS: " + sqrtVal)

// 4. Python 3.14 Interoperability (PyPI & Standard Lib)
let pyMath = py.import("math")
let pySin = pyMath.sin(1.5707963)
print("sin(pi/2) from Python: " + pySin)
`;
  }

  const starterFilename = 'main.lala';
  fs.writeFileSync(starterFilename, starterCode);

  console.log(`\n\x1b[32m✔ Successfully initialized Lala project!\x1b[0m`);
  console.log(`- Language: \x1b[36mLala\x1b[0m`);
  console.log(`- Active Dialect: \x1b[36m${dialectNames[dialect]} (${dialect})\x1b[0m`);
  console.log(`- File Extension: \x1b[36m.lala\x1b[0m`);
  console.log(`- Created configuration: \x1b[33m${CONFIG_FILE}\x1b[0m`);
  console.log(`- Created starter program: \x1b[33m${starterFilename}\x1b[0m`);
  console.log(`\nTo run your program, type:`);
  console.log(`  \x1b[35mnode bin/lala.js run ${starterFilename}\x1b[0m`);
}

async function main() {
  const args = process.argv.slice(2);
  const cmd = args[0];

  if (!cmd || cmd === '--help' || cmd === '-h') {
    printBanner();
    console.log('USAGE:');
    console.log('  lala init [--dialect <en|yo|ha|ig>]   Initialize project and choose native language');
    console.log('  lala run <file.lala>                 Execute a Lala source file');
    console.log('  lala repl                            Start the interactive Lala REPL');
    console.log('  lala translate <file.lala> --to <lang> Convert source between en/yo/ha/ig');
    console.log('  lala --version                       Display version information\n');
    return;
  }

  if (cmd === '--version' || cmd === '-v') {
    console.log('Lala Programming Language v1.0.0 (Native Nigerian Polyglot Language)');
    return;
  }

  if (cmd === 'init') {
    let dialect = null;
    const dialectIdx = args.indexOf('--dialect');
    if (dialectIdx !== -1 && args[dialectIdx + 1]) {
      dialect = args[dialectIdx + 1].toLowerCase();
    }
    await initProject(dialect);
    return;
  }

  if (cmd === 'run') {
    if (!args[1]) {
      console.error('Error: Please specify a file to run. Example: lala run main.lala');
      process.exit(1);
    }
    await runFile(args[1]);
    return;
  }

  if (cmd === 'repl') {
    await startRepl();
    return;
  }

  if (cmd === 'translate') {
    let file = args[1];
    if (file && !fs.existsSync(file) && fs.existsSync(file + '.lala')) {
      file = file + '.lala';
    }
    const toIdx = args.indexOf('--to');
    const target = toIdx !== -1 && args[toIdx + 1] ? args[toIdx + 1] : 'en';

    if (!file || !fs.existsSync(file)) {
      console.error('Error: Please specify a valid file to translate.');
      process.exit(1);
    }

    const src = fs.readFileSync(file, 'utf-8');
    const translated = translateSource(src, target);
    console.log(translated);
    return;
  }

  // Fallback: if argument is a file, execute it directly
  let targetFile = cmd;
  if (!fs.existsSync(targetFile) && fs.existsSync(targetFile + '.lala')) {
    targetFile = targetFile + '.lala';
  }
  if (fs.existsSync(targetFile)) {
    await runFile(targetFile);
    return;
  }

  console.error(`Unknown command '${cmd}'. Use 'lala --help' for usage.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
