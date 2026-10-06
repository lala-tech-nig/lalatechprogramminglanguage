// LALA Automated Comprehensive Test Suite
import { Lexer } from '../src/lexer.js';
import { Parser } from '../src/parser.js';
import { Interpreter } from '../src/runtime.js';
import { translateSource } from '../src/translator.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (!condition) {
    console.error(`  \x1b[31m✖ FAIL:\x1b[0m ${message}`);
    failed++;
  } else {
    console.log(`  \x1b[32m✔ PASS:\x1b[0m ${message}`);
    passed++;
  }
}

async function runTestCase(name, code, expectedLogs = []) {
  console.log(`\nTesting: \x1b[36m${name}\x1b[0m`);
  const logs = [];
  const interpreter = new Interpreter({
    stdout: (...args) => logs.push(args.join(' '))
  });

  try {
    await interpreter.run(code);
    for (const exp of expectedLogs) {
      const match = logs.some(l => l.includes(exp));
      assert(match, `Output contains "${exp}"`);
    }
  } catch (err) {
    assert(false, `Unexpected error: ${err.message}`);
  }
}

async function runAllTests() {
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║             LALA AUTOMATED SYSTEM TEST SUITE              ║');
  console.log('╚═══════════════════════════════════════════════════════════╝');

  // Test 1: For Loops and Logical Operators (First-class requirement)
  await runTestCase(
    'For Loops and Logical Operators (and/or/not)',
    `
    let count = 0
    for i in 1..4 {
      if (i > 1 and not (i == 3)) {
        count += i
      }
    }
    print("Result count:", count)

    let flag = (true or false) and not false
    print("Logical flag:", flag)
    `,
    ['Result count: 6', 'Logical flag: true']
  );

  // Test 2: Yoruba Native Keywords
  await runTestCase(
    'Yorùbá Native Dialect Execution',
    `
    je apapo = 0
    fun i ninu 1..3 {
      ti (i >= 1 ati otito) {
        apapo += i
      }
    }
    te("Apapo Yoruba:", apapo)
    `,
    ['Apapo Yoruba: 6']
  );

  // Test 3: Hausa Native Keywords
  await runTestCase(
    'Hausa Native Dialect Execution',
    `
    bari jimla = 0
    don i cikin 1..3 {
      idan (i > 0 da gaskiya) {
        jimla += i
      }
    }
    buga("Jimla Hausa:", jimla)
    `,
    ['Jimla Hausa: 6']
  );

  // Test 4: Igbo Native Keywords
  await runTestCase(
    'Asụsụ Igbo Native Dialect Execution',
    `
    ka ngụkọta = 0
    maka i nime 1..3 {
      oburu (i > 0 na eziokwu) {
        ngụkọta += i
      }
    }
    dee("Ngụkọta Igbo:", ngụkọta)
    `,
    ['Ngụkọta Igbo: 6']
  );

  // Test 5: JavaScript Interoperability
  await runTestCase(
    'JavaScript Direct Interoperability',
    `
    let val = js.Math.sqrt(81)
    let max = js.Math.max(10, 45, 20)
    print("JS Math Sqrt:", val)
    print("JS Math Max:", max)
    `,
    ['JS Math Sqrt: 9', 'JS Math Max: 45']
  );

  // Test 6: Python 3.14 Interoperability
  await runTestCase(
    'Python 3.14 Direct Interoperability',
    `
    let pyMath = py.import("math")
    let pySqrt = pyMath.sqrt(144)
    print("Python Sqrt:", pySqrt)

    let pyEvalRes = py.eval("sum([1, 2, 3, 4, 5])")
    print("Python Eval Sum:", pyEvalRes)
    `,
    ['Python Sqrt: 12', 'Python Eval Sum: 15']
  );

  // Test 7: Classes and OOP
  await runTestCase(
    'Classes, Constructors, and Methods',
    `
    class Person {
      init(name) {
        this.name = name
      }
      greet() {
        return "Ndewo, " + this.name
      }
    }
    let p = new Person("Chinedu")
    print(p.greet())
    `,
    ['Ndewo, Chinedu']
  );

  // Test 8: Error Handling (Try / Catch / Finally)
  await runTestCase(
    'Error Handling (Try / Catch / Finally)',
    `
    let caught = false
    try {
      let x = 10
      print("Inside try")
    } catch (e) {
      caught = true
    } finally {
      print("Inside finally")
    }
    `,
    ['Inside try', 'Inside finally']
  );

  // Test 9: Source-to-Source Dialect Translator
  console.log('\nTesting: \x1b[36mSource-to-Source Dialect Translator\x1b[0m');
  const enSource = 'for i in 1..3 { if (i == 2 and not false) { print(i) } }';
  const yoTrans = translateSource(enSource, 'yo');
  const haTrans = translateSource(enSource, 'ha');
  const igTrans = translateSource(enSource, 'ig');

  assert(yoTrans.includes('fun') && yoTrans.includes('ninu') && yoTrans.includes('ati'), 'Translated to Yoruba keywords');
  assert(haTrans.includes('don') && haTrans.includes('cikin') && haTrans.includes('da'), 'Translated to Hausa keywords');
  assert(igTrans.includes('maka') && igTrans.includes('nime') && igTrans.includes('na'), 'Translated to Igbo keywords');

  // Summary
  console.log('\n===========================================================');
  console.log(`TOTAL TESTS: ${passed + failed} | \x1b[32mPASSED: ${passed}\x1b[0m | \x1b[31mFAILED: ${failed}\x1b[0m`);
  console.log('===========================================================\n');

  if (failed > 0) process.exit(1);
}

runAllTests().catch(err => {
  console.error('Fatal Test Runner Error:', err);
  process.exit(1);
});
