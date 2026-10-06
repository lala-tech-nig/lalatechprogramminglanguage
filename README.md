# LALA Programming Language (v1.0.0)
> **Empowering Polyglot Indigenous Computing:** Write software in **English**, **Yorùbá** ("Wa"), **Hausa** ("Zo"), or **Asụsụ Igbo** ("Bia") with zero-boilerplate bidirectional **JavaScript** and **Python 3.14** interoperability.
> Official File Extension: **`.lala`**  
> 📖 **[Read the Full Developer Reference Manual](DEVELOPER_DOCUMENTATION.md)**

---

## 🌟 Overview & Key Innovations

**Lala** is a modern, high-performance, expression-oriented programming language designed for linguistic inclusivity and global ecosystem leverage:
1. **Multilingual Native Syntax**: Developers can choose their native language on setup or per-file. Version 1 provides first-class support for Nigeria's 3 major national languages (**Yorùbá**, **Hausa**, **Asụsụ Igbo**) and **English**.
2. **First-Class `for` Loops & `and`/`or`/`not`**: Rich range loops (`for i in 1..10`), collection iteration (`for item in list`), C-style loops (`for (let i = 0; i < 10; i += 1)`), and short-circuiting logical operators with full precedence.
3. **Seamless JavaScript Interoperability**: Direct zero-boilerplate access to the entire Node.js and npm ecosystem (`js.Math`, `js.Date`, `js.crypto`, npm libraries).
4. **Seamless Python 3.14 Interoperability**: Direct access to PyPI, Python standard library, data science packages, and inline evaluations (`py.import("math")`, `py.eval(...)`, `py.exec(...)`).
5. **Universal Source-to-Source Dialect Translator**: Automatically translate any Lala code between English, Yoruba, Hausa, and Igbo.
6. **Dedicated File Extension**: Files use the **`.lala`** extension.

---

## 🚀 Quick Setup & Usage

### 1. Interactive Setup Wizard (Select Native Language)
When setting up Lala or initializing a project:
```bash
node bin/lala.js init
```
Or directly specify your dialect of choice:
```bash
# Set up for Yorùbá
node bin/lala.js init --dialect yoruba

# Set up for Hausa
node bin/lala.js init --dialect hausa

# Set up for Igbo
node bin/lala.js init --dialect igbo

# Set up for English
node bin/lala.js init --dialect english
```
This generates `lala.config.json` and creates a ready-to-run `main.lala` idiomatic starter program!

### 2. Running a Lala Program
```bash
node bin/lala.js run main.lala
# Or without extension:
node bin/lala.js run main
```

### 3. Interactive REPL
```bash
node bin/lala.js repl
```

### 4. Translating Between Native Languages
```bash
# Translate an English file to Yorùbá
node bin/lala.js translate examples/01_for_and_logic.lala --to yo

# Translate to Hausa
node bin/lala.js translate examples/01_for_and_logic.lala --to ha

# Translate to Igbo
node bin/lala.js translate examples/01_for_and_logic.lala --to ig
```

### 5. Running the Test Suite
```bash
npm test
```

---

## 🌐 Multilingual Keyword Matrix

| Canonical Feature | English | Yorùbá ("Wa") | Hausa ("Zo") | Asụsụ Igbo ("Bia") |
| :--- | :--- | :--- | :--- | :--- |
| **For Loop** | `for` | `fun` / `fún` | `don` | `maka` |
| **In** | `in` | `ninu` / `nínú` | `cikin` | `nime` |
| **While Loop** | `while` | `nigbati` | `yayin` | `mgbe` |
| **Logical AND** | `and` | `ati` / `àti` | `da` | `na` |
| **Logical OR** | `or` | `tabi` / `tàbí` | `ko` | `maobu` / `mọbụ` |
| **Logical NOT** | `not` | `ko` / `kò` | `ba` | `abughi` / `abụghị` |
| **Mutable Var** | `let` | `je` / `jẹ́` | `bari` | `ka` |
| **Constant** | `const` | `duro` / `dúró` | `tsaye` | `kwusie` / `kwụsie` |
| **If** | `if` | `ti` / `tí` | `idan` | `oburu` / `ọbụrụ` |
| **Else** | `else` | `bikose` / `bikoṣe` | `inba_haka` / `kuma` | `ozor` / `ọzọ` |
| **Elif** | `elif` | `tabiti` | `kodan` | `moburu` |
| **Function** | `fn` / `function` | `ise` / `iṣẹ́` | `aiki` | `oru` / `ọrụ` |
| **Return** | `return` | `pada` / `padà` | `koma` | `lota` / `lọta` |
| **True** | `true` | `otito` / `òótọ́` | `gaskiya` | `eziokwu` |
| **False** | `false` | `iro` / `irọ́` | `kariya` | `asi` / `asị` |
| **Null** | `null` | `ofo` / `òfo` | `babu` | `efu` |
| **Class** | `class` | `egbe` / `ẹgbẹ́` | `aji` | `otu` |
| **New** | `new` | `tuntun` | `sabo` | `ohuru` / `ọhụrụ` |
| **Try** | `try` | `gbiyanju` | `gwada` | `nwaa` |
| **Catch** | `catch` | `mu` / `mú` | `kama` | `nwute` |
| **Finally** | `finally` | `ni_ipari` | `a_karshe` | `na_ikpeazu` |
| **Print** | `print` | `te` / `tẹ` | `buga` | `dee` |

---

## ⚡ Examples in Action

### 1. Yorùbá Dialect Sample (`examples/02_yoruba_sample.lala`)
```lala
je oruko = "Babatunde"
je ojo_ori = 28
je omo_naija = otito

ti (ojo_ori >= 18 ati omo_naija == otito) {
    te("E kaabo, " + oruko + "! O yege lati dibo.")
} bikose {
    te("E ma binu, o ko tii yege.")
}

// Lupu 'fun' (for loop)
fun nomba ninu 1..6 {
    ti (nomba % 2 == 0 ati ko (nomba == 4)) {
        te("Nomba paapaa: " + nomba)
    }
}
```

### 2. Hausa Dialect Sample (`examples/03_hausa_sample.lala`)
```lala
bari suna = "Amina Bello"
bari kudi = 15000
bari mai_aiki = gaskiya

idan (kudi > 10000 da mai_aiki == gaskiya) {
    buga("Sannu da aiki, " + suna + "! Asusunka yana da kyau.")
} kuma {
    buga("Asusunka yana bukatar kulawa.")
}

// Madauki 'don' (for loop)
don lamba cikin 1..5 {
    idan (lamba == 3 ko lamba == 5) {
        buga("Mun zabi lamba ta musamman: " + lamba)
    }
}
```

### 3. Asụsụ Igbo Dialect Sample (`examples/04_igbo_sample.lala`)
```lala
ka onye_ahia = "Emeka Okonkwo"
ka ego_ahia = 50000
ka debanyere_aha = eziokwu

oburu (ego_ahia >= 20000 na debanyere_aha == eziokwu) {
    dee("Daalụ, " + onye_ahia + "! Azụmahịa gị tozuru oke.")
} ozor {
    dee("Biko deba aha gị n'akwụkwọ.")
}

// Loop 'maka' (for loop)
maka i nime 1..5 {
    oburu (i % 2 != 0 na abughi (i == 1)) {
        dee("Nọmba pụrụ iche: " + i)
    }
}
```

### 4. JavaScript Interoperability (`examples/05_js_interop.lala`)
```lala
// Calling JS built-ins
let jsTime = js.Date.now()
let sqrtVal = js.Math.sqrt(625) // 25

// Importing Node modules directly
import js "path" as jspath
let pathStr = jspath.join("src", "engine", "runtime.lala")

// Dynamic JS Evaluation
let result = js.eval("['Yoruba', 'Hausa', 'Igbo'].map(s => s.toUpperCase())")
```

### 5. Python 3.14 Interoperability (`examples/06_python_interop.lala`)
```lala
// Importing Python math module
import py "math" as pymath
let pySqrt = pymath.sqrt(1024) // 32
let pySin = pymath.sin(1.5707963) // 1

// Python List Comprehensions & Data Science structures
let squares = py.eval("[n ** 2 for n in range(1, 8)]")
print("Squares from Python:", squares)

// Python multiline execution
let output = py.exec("total = sum([10, 20, 30, 40]); res = f'Sum is {total}'")
print(output)
```

---

## 🏛️ Comprehensive 23 Specifications Overview
Detailed in [LALA_SPEC.md](file:///c:/Users/PC/Desktop/LALA/LALA_SPEC.md):
1. **Philosophy**: Linguistic empowerment uniting Yoruba, Hausa, Igbo, and English with polyglot ecosystem reach.
2. **Syntax**: Modern curly-bracket block syntax with optional statement semicolons.
3. **Keywords**: Universal canonical tokenization across 4 dialects with accent-tolerance.
4. **Identifiers**: Full Unicode UTF-8 identifier support (`ṣ`, `ẹ`, `ọ`, `ɓ`, `ɗ`, `ƙ`, `ị`, `ụ`, etc.).
5. **Variables**: Lexically scoped mutable `let` and immutable `const`.
6. **Types**: Numbers, Strings, Booleans, Null, Lists, Objects, Functions, Classes, and Proxies.
7. **Operators**: Arithmetic, Relational, and dedicated short-circuiting `and`, `or`, `not`.
8. **Functions**: First-class closures, closures, default parameters, recursion.
9. **Objects**: Hash maps with property and computed index access.
10. **Classes**: Class definitions, constructors (`init`), method bindings, instance state.
11. **Modules**: Local `.lala` imports and exports.
12. **Error Handling**: `try`, `catch`, `finally` with error objects.
13. **Async / Concurrency**: `async` / `await` event-loop asynchronous execution.
14. **Memory Model**: V8-managed generational garbage collection and reference lifecycle.
15. **Package System**: `lala.pkg.json` with npm and pip dependency co-existence.
16. **JavaScript Interop**: Zero-boilerplate proxy calling Node.js and npm modules.
17. **Python Interop**: Native Python 3.14 IPC bridge with JSON serialization.
18. **Multilingual Syntax**: Dialect auto-detection, config presets, and source translator.
19. **Standard Library**: Built-in `io`, `math`, `string`, `os` operations.
20. **Compiler Architecture**: Unicode Lexer -> Recursive Descent Parser -> AST -> Tree-walk Engine.
21. **Runtime Architecture**: Host V8 runtime concurrently orchestrating Node.js and Python.
22. **Security Model**: Configurable FFI permissions and sandboxing.
23. **Versioning**: Strict SemVer 2.0.0 (`v1.0.0`).
