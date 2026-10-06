# LALA PROGRAMMING LANGUAGE: OFFICIAL DEVELOPER REFERENCE MANUAL
**Version 1.0.0 — The Complete Guide for Software Engineers, Compiler Developers, and Architects**

---

# Table of Contents
1. [Language Identity & Philosophy](#1-language-identity--philosophy)
2. [Installation & Toolchain Setup](#2-installation--toolchain-setup)
3. [Lexical Grammar & Tokenization](#3-lexical-grammar--tokenization)
4. [Multilingual Keyword Rosetta Stone Matrix](#4-multilingual-keyword-rosetta-stone-matrix)
5. [Variables, Scoping, and Mutability](#5-variables-scoping-and-mutability)
6. [Data Types & Type System](#6-data-types--type-system)
7. [Operators & Expression Precedence](#7-operators--expression-precedence)
8. [Control Flow: If-Else & While](#8-control-flow-if-else--while)
9. [First-Class 'for' Loops](#9-first-class-for-loops)
10. [Functions, Closures, and Recursion](#10-functions-closures-and-recursion)
11. [Object-Oriented Programming (OOP)](#11-object-oriented-programming-oop)
12. [Error Handling (Try / Catch / Finally)](#12-error-handling-try--catch--finally)
13. [Asynchronous Programming & Concurrency](#13-asynchronous-programming--concurrency)
14. [JavaScript Interoperability (Node.js & npm)](#14-javascript-interoperability-nodejs--npm)
15. [Python 3.14 Interoperability (PyPI & Scientific Stack)](#15-python-314-interoperability-pypi--scientific-stack)
16. [Source-to-Source Dialect Translator](#16-source-to-source-dialect-translator)
17. [Standard Library Reference (`lala:*`)](#17-standard-library-reference-lala)
18. [Compiler & Runtime Internal Architecture](#18-compiler--runtime-internal-architecture)
19. [Project Configuration & Packaging (`lala.config.json`)](#19-project-configuration--packaging-lalaconfigjson)
20. [Security Model & Sandboxing](#20-security-model--sandboxing)
21. [Best Practices, Code Style & FAQs](#21-best-practices-code-style--faqs)

---

# 1. Language Identity & Philosophy

**Lala** (file extension: `.lala`) is a general-purpose, expression-oriented, dynamically-typed programming language engineered for linguistic sovereignty and polyglot computing.

### The Core Triad
1. **Linguistic Sovereignty**: Developers should not be forced to master English idioms merely to formulate computational logic. Lala elevates three of Africa's major native languages—**Yorùbá ("Wa")**, **Hausa ("Zo")**, and **Asụsụ Igbo ("Bia")**—alongside **English** as first-class grammatical citizens.
2. **Zero-Boilerplate Polyglot Reach**: A new programming language cannot thrive in a silo. Rather than rebuilding libraries from scratch, Lala provides instantaneous, transparent memory and IPC bridges to the two largest developer ecosystems on Earth: **JavaScript (Node.js/npm)** and **Python 3.14 (PyPI)**.
3. **Ergonomic Simplicity**: Lala unites the conciseness of Python with the versatility of JavaScript, underpinned by a clean, brace-delimited block structure, first-class logical keywords (`and`, `or`, `not`), and three dedicated `for` loop constructs.

---

# 2. Installation & Toolchain Setup

### Prerequisites
- **Node.js**: Version 18.0.0 or higher (v24 LTS recommended).
- **Python**: Version 3.10 or higher (Python 3.14 recommended for Python FFI).
- **Operating System**: Windows 10/11, macOS, or Linux.

### Windows Native Installation
Lala provides a dedicated Windows installer executable:
1. Double-click or execute [dist/Setup-Lala.exe](file:///c:/Users/PC/Desktop/LALA/dist/Setup-Lala.exe):
   ```cmd
   Setup-Lala.exe
   ```
2. The installer will:
   - Allow you to select your preferred default dialect (**Yorùbá**, **Hausa**, **Igbo**, or **English**).
   - Install the runtime to `%LOCALAPPDATA%\Lala` (no Administrator rights needed).
   - Automatically append Lala to your Windows User `PATH` environment variable.
   - Associate `.lala` files with the `lala.exe` executable in the Windows Registry.
   - Generate an idiomatic starter program `main.lala` and `lala.config.json`.

Unattended / Silent Installation:
```cmd
Setup-Lala.exe /silent /dialect=yo /dir="C:\Lala"
```

### CLI Command Reference
The Lala toolchain provides the `lala` command (or `lala.exe` on Windows):

| Command | Usage | Description |
| :--- | :--- | :--- |
| `lala init` | `lala init [--dialect <en\|yo\|ha\|ig>]` | Launches project setup wizard to choose native language |
| `lala run <file>` | `lala run main.lala` or `lala run main` | Parses and executes a Lala script |
| `lala repl` | `lala repl` | Launches the interactive terminal shell |
| `lala translate` | `lala translate app.lala --to yo` | Translates source code between dialects |
| `lala --version` | `lala --version` or `-v` | Prints current Lala runtime version |
| `lala --help` | `lala --help` or `-h` | Displays command-line flags and help |

---

# 3. Lexical Grammar & Tokenization

### Character Encoding
All Lala source files must be encoded in **UTF-8**. The lexer handles full Unicode normalization (NFKC) so accents, tonal marks, and special characters behave predictably.

### Diacritics & Accents Tolerance
African languages utilize rich diacritic tone marks and subdots. Lala's lexer incorporates diacritic normalization so that accented and unaccented variations are recognized interchangeably:
- **Yorùbá**: `òótọ́` and `otito` both tokenize to `KW_TRUE`. `gbìyànjú` and `gbiyanju` both tokenize to `KW_TRY`. `bikoṣe` and `bikose` both tokenize to `KW_ELSE`.
- **Hausa**: Hooked letters (`ɓ`, `ɗ`, `ƙ`, `ƴ`) are supported in identifiers and strings.
- **Igbo**: Subdotted vowels (`ị`, `ọ`, `ụ`, `ṅ`) are fully supported. `kwụsie` and `kwusie` both tokenize to `KW_CONST`.

### Dialect Auto-Detection & Homograph Resolution
Certain short words share spellings across languages but hold opposite semantic meanings. The most notable example is **`ko`**:
- In **Hausa**: `ko` means **"or"** (logical disjunction: *wannan ko wancan*).
- In **Yorùbá**: `ko` (or `kò`) means **"not"** (logical negation: *kò burú*).

To solve this without requiring manual flags, Lala's lexer features a **contextual dialect detector**:
1. It checks `lala.config.json` for the project's default dialect.
2. If absent, it scans the source file for signature vocabulary:
   - Hausa markers: `buga`, `bari`, `aiki`, `cikin`, `gaskiya`, `koma`.
   - Yorùbá markers: `te`, `tẹ`, `gbiyanju`, `bikoṣe`, `ninu`, `otito`, `pada`.
   - Igbo markers: `dee`, `oru`, `nime`, `eziokwu`, `maka`, `abughi`, `oburu`.
3. In a Hausa context, `ko` maps to `KW_OR`. In a Yorùbá context, `ko` maps to `KW_NOT`.

### Comments
```lala
// Single-line comment (C-style)
# Single-line comment (Python-style)

/*
   Multi-line comment block
   spans multiple lines cleanly
*/
```

### Semicolons & Blocks
- Semicolons `;` are completely optional at the end of statements.
- Blocks are delimited by curly braces `{ ... }`.
- Parentheses around `if`, `while`, and `for` expressions are supported but optional when followed by `{ ... }`.

---

# 4. Multilingual Keyword Rosetta Stone Matrix

The following table provides the exact lexical mappings across all 4 languages supported in Version 1:

| Canonical Token | English | Yorùbá ("Wa") | Hausa ("Zo") | Asụsụ Igbo ("Bia") | Semantic Purpose |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `KW_FOR` | `for` | `fun` / `fún` | `don` | `maka` | Iterative loop construct |
| `KW_IN` | `in` | `ninu` / `nínú` | `cikin` | `nime` | Membership / sequence domain |
| `KW_WHILE` | `while` | `nigbati` / `nígbàtí` | `yayin` | `mgbe` | Conditional loop construct |
| `KW_AND` | `and` | `ati` / `àti` | `da` | `na` | Short-circuit logical AND |
| `KW_OR` | `or` | `tabi` / `tàbí` | `ko` | `maobu` / `mọbụ` | Short-circuit logical OR |
| `KW_NOT` | `not` | `ko` / `kò` | `ba` | `abughi` / `abụghị` | Unary logical NOT |
| `KW_LET` | `let` | `je` / `jẹ́` | `bari` | `ka` | Block-scoped mutable variable |
| `KW_CONST` | `const` | `duro` / `dúró` | `tsaye` | `kwusie` / `kwụsie` | Block-scoped immutable constant |
| `KW_IF` | `if` | `ti` / `tí` | `idan` | `oburu` / `ọbụrụ` | Conditional branch |
| `KW_ELIF` | `elif` | `tabiti` | `kodan` | `moburu` | Chained conditional branch |
| `KW_ELSE` | `else` | `bikose` / `bikoṣe` | `inba_haka` / `kuma` | `ozor` / `ọzọ` | Fallback branch |
| `KW_FN` | `fn` / `function` | `ise` / `iṣẹ́` | `aiki` | `oru` / `ọrụ` | Function declaration |
| `KW_RETURN` | `return` | `pada` / `padà` | `koma` | `lota` / `lọta` | Return value from function |
| `KW_TRUE` | `true` | `otito` / `òótọ́` | `gaskiya` | `eziokwu` | Boolean true literal |
| `KW_FALSE` | `false` | `iro` / `irọ́` | `kariya` | `asi` / `asị` | Boolean false literal |
| `KW_NULL` | `null` / `nil` | `ofo` / `òfo` | `babu` | `efu` | Null reference literal |
| `KW_CLASS` | `class` | `egbe` / `ẹgbẹ́` | `aji` | `otu` | Class blueprint |
| `KW_NEW` | `new` | `tuntun` | `sabo` | `ohuru` / `ọhụrụ` | Instantiation operator |
| `KW_THIS` | `this` | `eyi` / `èyí` | `wannan` | `nkea` | Current instance reference |
| `KW_TRY` | `try` | `gbiyanju` / `gbìyànjú`| `gwada` | `nwaa` | Exception block |
| `KW_CATCH` | `catch` | `mu` / `mú` | `kama` | `nwute` | Exception capture block |
| `KW_FINALLY` | `finally` | `ni_ipari` / `ní_ìparí`| `a_karshe` | `na_ikpeazu` | Guaranteed cleanup block |
| `KW_ASYNC` | `async` | `asiko` / `àsìkò` | `lokaci` | `oge` | Asynchronous modifier |
| `KW_AWAIT` | `await` | `duro_de` | `jira` | `chere` | Asynchronous resolution |
| `KW_IMPORT` | `import` | `gba_wole` | `shigo` | `bubata` | Import module/library |
| `KW_FROM` | `from` | `lati` / `láti` | `daga` | `site` | Import origin clause |
| `KW_EXPORT` | `export` | `firanmo` | `fitar` | `bupuru` | Module export declaration |
| `KW_AS` | `as` | `gegebi` | `kamar` | `dika` | Import alias specifier |
| `KW_PRINT` | `print` | `te` / `tẹ` | `buga` | `dee` | Standard console output |

---

# 5. Variables, Scoping, and Mutability

Lala implements lexical block scoping with two explicit declaration keywords:

### Mutable Bindings (`let`)
Declared with `let` (English), `je` (Yorùbá), `bari` (Hausa), or `ka` (Igbo). Can be freely reassigned:
```lala
let x = 100
x = 200 // Valid

// Yorùbá
je iye = 50
iye += 25

// Hausa
bari jimla = 10
jimla *= 3

// Igbo
ka ego = 500
ego -= 100
```

### Immutable Bindings (`const`)
Declared with `const` (English), `duro` (Yorùbá), `tsaye` (Hausa), or `kwusie` (Igbo). Cannot be reassigned once defined:
```lala
const API_URL = "https://api.lala.dev"
// API_URL = "other" -> Throws Runtime Error: Cannot reassign to constant variable 'API_URL'

// Yorùbá
duro NOMBA_AGBA = 1000

// Hausa
tsaye IYAKA = 500

// Igbo
kwusie OKE = 250
```

### Lexical Scoping Rules
Inner blocks inherit variables from outer scopes and can shadow outer variables:
```lala
let value = "global"
{
    let value = "inner block"
    print(value) // Prints "inner block"
}
print(value) // Prints "global"
```

---

# 6. Data Types & Type System

Lala is dynamically typed with first-class runtime reflection:

### 1. Primitives
- **Number**: IEEE 754 64-bit float and arbitrary integers.
  ```lala
  let a = 42
  let b = 3.14159
  let c = -18.5
  ```
- **String**: UTF-8 immutable character sequences with escape sequences (`\n`, `\t`, `\"`, `\'`).
  ```lala
  let message = "Kaabo, E ku ojumo!"
  let greeting = 'Sannu da zuwa'
  ```
- **Boolean**: Truth values `true` / `false` and their native equivalents:
  - English: `true`, `false`
  - Yorùbá: `otito`, `iro`
  - Hausa: `gaskiya`, `kariya`
  - Igbo: `eziokwu`, `asi`
- **Null**: Absence of value `null`, `ofo`, `babu`, `efu`.

### 2. Compound Types
- **List**: Ordered dynamic array:
  ```lala
  let numbers = [1, 2, 3, 4, 5]
  let mixed = ["Ade", 25, true, [10, 20]]
  numbers[0] = 99
  print(len(numbers)) // 5
  ```
- **Object (Map)**: Key-value dictionary:
  ```lala
  let developer = {
      name: "Chinedu",
      city: "Enugu",
      skills: ["Lala", "Python", "Node.js"]
  }
  print(developer.name)        // Dot notation
  print(developer["city"])     // Bracket notation
  developer.role = "Lead Architect"
  ```

### 3. Built-in Type Utilities
- `type(val)`: Returns `'number'`, `'string'`, `'boolean'`, `'list'`, `'object'`, or `'null'`.
- `len(val)`: Returns length of string, list, or number of keys in an object.
- `str(val)`, `int(val)`, `float(val)`: Explicit type conversions.

---

# 7. Operators & Expression Precedence

### Logical Operators (`and`, `or`, `not`)
Lala emphasizes explicit English or native words for boolean logic rather than symbols (though `&&`, `||`, and `!` are also accepted for convenience):

1. **Logical `and`** (`ati`, `da`, `na`):
   - Short-circuits: If LHS is falsy, RHS is never evaluated.
   ```lala
   let safe = false and (10 / 0 == 0) // RHS is NOT evaluated! safe is false.
   ```
2. **Logical `or`** (`tabi`, `ko`, `maobu`):
   - Short-circuits: If LHS is truthy, RHS is never evaluated.
   ```lala
   let valid = true or (10 / 0 == 0) // RHS is NOT evaluated! valid is true.
   ```
3. **Logical `not`** (`ko`, `ba`, `abughi`):
   - Unary prefix operator: Inverts truth value.
   ```lala
   let isReady = not false // true
   ```

### Operator Precedence (Highest to Lowest)

| Level | Operator Category | Operators | Associativity |
| :--- | :--- | :--- | :--- |
| 1 (Highest) | Grouping & Literals | `(...)`, `[...]`, `{...}`, literals | N/A |
| 2 | Member Access & Call | `.`, `[index]`, `func(...)` | Left-to-right |
| 3 | Unary | `not` / `!`, `-`, `+`, `await` | Right-to-left |
| 4 | Exponentiation | `**` | Right-to-left |
| 5 | Multiplicative | `*`, `/`, `%` | Left-to-right |
| 6 | Additive | `+`, `-` | Left-to-right |
| 7 | Range | `..` | Left-to-right |
| 8 | Relational | `<`, `<=`, `>`, `>=` | Left-to-right |
| 9 | Equality | `==`, `!=` | Left-to-right |
| 10 | Logical AND | `and`, `ati`, `da`, `na`, `&&` | Left-to-right |
| 11 | Logical OR | `or`, `tabi`, `ko`, `maobu`, `\|\|` | Left-to-right |
| 12 (Lowest) | Assignment | `=`, `+=`, `-=`, `*=`, `/=` | Right-to-left |

---

# 8. Control Flow: If-Else & While

### Conditional Branching (`if`, `elif`, `else`)

```lala
// English
if (score >= 90) {
    print("Grade: A")
} elif (score >= 70) {
    print("Grade: B")
} else {
    print("Grade: C")
}

// Yorùbá
ti (ojo_ori >= 18 ati omo_naija == otito) {
    te("O ni anfani lati dibo.")
} tabiti (ojo_ori == 17) {
    te("O ku odun kan lati yege.")
} bikose {
    te("O ko tii yege.")
}

// Hausa
idan (maki >= 70 da gaskiya) {
    buga("Ka ci jarrabawa!")
} kodan (maki >= 50) {
    buga("Ka wuce da kyar.")
} kuma {
    buga("Ka fadi jarrabawa.")
}

// Asụsụ Igbo
oburu (ego >= 1000 na nkwenye == eziokwu) {
    dee("Zụọ ngwaahịa")
} moburu (ego >= 500) {
    dee("Zụọ nke obere")
} ozor {
    dee("Ego ezughị")
}
```

### While Loops (`while`)
Executes as long as the condition remains truthy:
```lala
// English
let count = 3
while (count > 0) {
    print("Countdown:", count)
    count -= 1
}

// Yorùbá
je i = 0
nigbati (i < 5) {
    te("Igbese:", i)
    i += 1
}

// Hausa
bari l = 0
yayin (l < 3) {
    buga("Lambar:", l)
    l += 1
}

// Igbo
ka j = 0
mgbe (j < 3) {
    dee("Nọmba:", j)
    j += 1
}
```

---

# 9. First-Class 'for' Loops

Lala provides three first-class iterations:

### 1. Range Loops (`start..end`)
The range operator `..` creates an inclusive progression from `start` to `end`:
```lala
// English
for i in 1..5 {
    print("Range step:", i) // 1, 2, 3, 4, 5
}

// Yorùbá
fun i ninu 1..5 {
    te("Nomba:", i)
}

// Hausa
don i cikin 1..5 {
    buga("Lamba:", i)
}

// Igbo
maka i nime 1..5 {
    dee("Nọmba:", i)
}
```

### 2. Collection Loops
Iterates directly over elements of a list, keys of an object, or characters of a string:
```lala
let cities = ["Lagos", "Kano", "Ibadan", "Enugu"]
for city in cities {
    print("Nigerian City:", city)
}

let profile = { name: "Amaka", state: "Anambra" }
for key in profile {
    print(key + " => " + profile[key])
}
```

### 3. C-Style For Loops
For fine-grained loop counters and increments:
```lala
for (let k = 10; k > 0; k -= 2) {
    print("Stepping down:", k) // 10, 8, 6, 4, 2
}
```

---

# 10. Functions, Closures, and Recursion

Functions are first-class citizens in Lala. They can be stored in variables, passed to other functions, and returned from functions:

### Declaration & Calling
```lala
// English
fn add(a, b) {
    return a + b
}

// Yorùbá
ise isiro_apapo(owo, ori) {
    pada owo + (owo * ori)
}

// Hausa
aiki tara_lamba(a, b) {
    koma a + b
}

// Igbo
oru mụbaa(ego, ọnụọgụ) {
    lota ego * ọnụọgụ
}
```

### Lexical Closures
Functions retain access to the environment where they were created:
```lala
fn make_counter(start) {
    let current = start
    fn next() {
        current += 1
        return current
    }
    return next
}

let counterA = make_counter(10)
print(counterA()) // 11
print(counterA()) // 12
```

### Recursion
```lala
fn factorial(n) {
    if (n <= 1) {
        return 1
    }
    return n * factorial(n - 1)
}
print(factorial(5)) // 120
```

---

# 11. Object-Oriented Programming (OOP)

Lala provides full class declarations, instantiation, method binding, and instance state:

```lala
// Class declaration across dialects
class BankAccount {
    // Constructor method
    init(owner, initialBalance) {
        this.owner = owner
        this.balance = initialBalance
    }

    deposit(amount) {
        this.balance += amount
        print("Deposited ₦" + amount + " for " + this.owner)
        return this.balance
    }

    withdraw(amount) {
        if (amount > this.balance) {
            print("Error: Insufficient funds for " + this.owner)
            return false
        }
        this.balance -= amount
        print("Withdrew ₦" + amount + " for " + this.owner)
        return true
    }

    getInfo() {
        return {
            owner: this.owner,
            balance: this.balance
        }
    }
}

// Instantiation with 'new' (or native 'tuntun', 'sabo', 'ohuru')
let account = new BankAccount("Adewale", 50000)
account.deposit(15000)
account.withdraw(8000)

let details = account.getInfo()
print("Account details:", details)
```

---

# 12. Error Handling (Try / Catch / Finally)

Exceptions in Lala are captured safely using structured blocks across all dialects:

```lala
// English
try {
    let x = 10 / 0
} catch (error) {
    print("Caught an error:", error)
} finally {
    print("Always runs.")
}

// Yorùbá
gbiyanju {
    let ewu = 10 / 0
} mu (asise) {
    te("Aṣiṣe sele:", asise)
} ni_ipari {
    te("A pari igbiyanju yii.")
}

// Hausa
gwada {
    let aiki = 10 / 0
} kama (kuskure) {
    buga("An sami matsala:", kuskure)
} a_karshe {
    buga("Aiki ya kammala.")
}

// Asụsụ Igbo
nwaa {
    let nsogbu = 10 / 0
} nwute (mmejo) {
    dee("Mmejọ mere:", mmejo)
} na_ikpeazu {
    dee("Emela atụmatụ ahụ.")
}
```

---

# 13. Asynchronous Programming & Concurrency

Lala supports asynchronous event-loop functions via `async` and `await`:

```lala
async fn fetch_user_data(userId) {
    print("Initiating async call for user:", userId)
    let timestamp = js.Date.now()
    return { id: userId, time: timestamp, status: "active" }
}

async fn main_flow() {
    let user = await fetch_user_data(101)
    print("Resolved user:", user)
}
```

---

# 14. JavaScript Interoperability (Node.js & npm)

Lala offers zero-boilerplate bidirectional interoperability with the Node.js / V8 runtime. Any standard Node module or installed npm package can be imported directly:

### 1. Global `js` Proxy
Access JS built-ins directly without any import:
```lala
// Math
let sqrtVal = js.Math.sqrt(625) // 25
let maxVal = js.Math.max(12, 99, 45) // 99
let randomNum = js.Math.floor(js.Math.random() * 100)

// Date & Timestamps
let now = js.Date.now()
print("Epoch timestamp:", now)

// JSON
let serialized = js.JSON.stringify({ lang: "Lala", version: "1.0.0" })
print("JSON string:", serialized)

// Dynamic JS Evaluation
let upperList = js.eval("['Lagos', 'Abuja', 'Enugu'].map(s => s.toUpperCase())")
print(upperList)
```

### 2. Direct Node.js & npm Imports
```lala
// Import Node core modules
import js "path" as jspath
import js "crypto" as jscrypto
import js "fs" as jsfs

let fullPath = jspath.join("src", "engine", "runtime.lala")
print("Constructed path:", fullPath)

let token = jscrypto.randomBytes(16).toString("hex")
print("Generated token:", token)
```

---

# 15. Python 3.14 Interoperability (PyPI & Scientific Stack)

Lala connects directly to your computer's Python runtime (Python 3.14+). Lala seamlessly calls Python functions, evaluates comprehensions, and leverages machine learning or data science packages:

### 1. Importing Python Standard Modules
```lala
// Import Python math module
import py "math" as pymath
import py "sys" as pysys
import py "json" as pyjson

// Access constants
print("Python Pi:", pymath.pi)

// Call Python functions
let sinVal = pymath.sin(1.5707963)
let sqrtVal = pymath.sqrt(1024)
print("sin(pi/2):", sinVal)
print("sqrt(1024):", sqrtVal)
print("Python Version:", pysys.version)
```

### 2. Python Dynamic Evaluation (`py.eval`)
Evaluate Python expressions, lambda functions, and list comprehensions directly from Lala:
```lala
let squares = py.eval("[n ** 2 for n in range(1, 8)]")
print("Python squares:", squares) // [1, 4, 9, 16, 25, 36, 49]

let calculatedSum = py.eval("sum([10, 20, 30, 40, 50])")
print("Calculated sum:", calculatedSum) // 150
```

### 3. Python Multiline Script Execution (`py.exec`)
```lala
let scope = py.exec("numbers = [1, 2, 3]; total = sum(numbers)")
print(scope) // { numbers: [1, 2, 3], total: 6 }
```

---

# 16. Source-to-Source Dialect Translator

Lala includes a built-in dialect translation engine that transforms source code between English, Yorùbá, Hausa, and Igbo while preserving exact variable names, strings, numbers, and logical structure:

### CLI Usage:
```bash
# Translate an English script to Yorùbá
lala translate script.lala --to yo

# Translate to Hausa
lala translate script.lala --to ha

# Translate to Asụsụ Igbo
lala translate script.lala --to ig
```

### Programmatic Translation in Code:
```javascript
import { translateSource } from './src/translator.js';

const englishCode = `for i in 1..5 { if (i == 2 and not false) { print(i) } }`;
const yorubaCode = translateSource(englishCode, 'yo');
console.log(yorubaCode);
// Outputs: fun i ninu 1 .. 5 { ti ( i == 2 ati ko iro ) { te ( i ) } }
```

---

# 17. Standard Library Reference (`lala:*`)

Lala comes bundled with fundamental standard library procedures:

### Standard I/O
- `print(...)`, `te(...)`, `buga(...)`, `dee(...)`: Prints all arguments formatted to standard output with a trailing newline.

### Math Utilities
- `range(start, end, step = 1)`: Generates an array of integers from `start` to `end`.

### Collections & String Helpers
- `len(item)`: Returns count of elements for strings, arrays, or object keys.
- `str(val)`: Converts any value into its string representation.
- `int(val)`: Parses integer from number or string.
- `float(val)`: Parses floating-point number from string.
- `type(val)`: Returns the runtime type tag of the argument.

---

# 18. Compiler & Runtime Internal Architecture

```
                       ┌──────────────────────────────┐
                       │     Source Code (.lala)      │
                       └──────────────┬───────────────┘
                                      │
                                      ▼
                       ┌──────────────────────────────┐
                       │        Unicode Lexer         │
                       │ (NFKC Normalization, Accents │
                       │    & Dialect Auto-Detect)    │
                       └──────────────┬───────────────┘
                                      │
                                      ▼
                       ┌──────────────────────────────┐
                       │      Canonical Tokens        │
                       └──────────────┬───────────────┘
                                      │
                                      ▼
                       ┌──────────────────────────────┐
                       │   Recursive Descent Parser   │
                       │(Precedence Climbing Operator)│
                       └──────────────┬───────────────┘
                                      │
                                      ▼
                       ┌──────────────────────────────┐
                       │  Abstract Syntax Tree (AST)  │
                       └──────────────┬───────────────┘
                                      │
                 ┌────────────────────┴────────────────────┐
                 ▼                                         ▼
   ┌───────────────────────────┐             ┌───────────────────────────┐
   │    Tree-Walk Evaluator    │             │ Source-to-Source Dialect  │
   │ (Lexical Env Scoping, OOP │             │        Transpiler         │
   │  Classes, Closures, Stmts)│             │ (EN <-> YO <-> HA <-> IG) │
   └─────────────┬─────────────┘             └───────────────────────────┘
                 │
       ┌─────────┴─────────┐
       ▼                   ▼
┌──────────────┐    ┌──────────────┐
│  JavaScript  │    │  Python 3.14 │
│  V8 Proxies  │    │  IPC Bridge  │
│(npm / Node)  │    │(PyPI / Math) │
└──────────────┘    └──────────────┘
```

---

# 19. Project Configuration & Packaging (`lala.config.json`)

Projects initialized with `lala init` contain a `lala.config.json`:

```json
{
  "name": "my-lala-app",
  "version": "1.0.0",
  "language": "lala",
  "fileExtension": ".lala",
  "dialect": "yo",
  "dialectName": "Yorùbá",
  "interop": {
    "javascript": true,
    "python": true
  }
}
```

- `dialect`: Sets the default language dialect for the project (`"en"`, `"yo"`, `"ha"`, `"ig"`).
- `interop.javascript`: Enables zero-boilerplate Node.js proxy access.
- `interop.python`: Enables Python 3.14 bridge IPC integration.

---

# 20. Security Model & Sandboxing

When running untrusted Lala code or deploying to multi-tenant servers:
- **`--safe` Flag**: Disables arbitrary filesystem writes and shell subprocess spawning.
- **FFI Granular Permissions**: Disable `allow_js` or `allow_python` in configuration to sandbox execution to pure Lala memory structures.

---

# 21. Best Practices, Code Style & FAQs

### Best Practices
1. **Choose an Idiomatic Dialect for Your Module**: Pick one primary dialect (`yo`, `ha`, `ig`, or `en`) per file to maintain visual cohesion for readers.
2. **Take Advantage of `lala translate`**: If collaborating across different language communities, use `lala translate file.lala --to <target>` so each developer can read the logic in their preferred tongue.
3. **Use `const` (`duro`, `tsaye`, `kwusie`) by Default**: Protect configuration and invariants from accidental mutation.
4. **Leverage Ecosystem Bridges Responsibly**: Use `js.*` for high-throughput networking and Web APIs; use `py.*` for scientific calculations, machine learning, and math.

### Frequently Asked Questions (FAQ)

**Q: Can I mix English, Yorùbá, Hausa, and Igbo in the same `.lala` file?**  
A: Yes! The Lala lexer maps all valid keywords into universal canonical internal tokens. While sticking to one dialect per file is recommended for readability, mixed syntax executes without error.

**Q: Does Lala require an internet connection to run?**  
A: No. Lala is a 100% offline, local runtime. The in-browser IDE also runs entirely on client-side Web Workers and JavaScript with zero remote server calls.

**Q: How does Lala compare to TypeScript or Python?**  
A: Lala is specifically designed to eliminate the cognitive language barrier for African software engineers while maintaining full capability to run any npm or PyPI library.
