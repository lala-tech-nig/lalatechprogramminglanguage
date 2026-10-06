# WAZOBIA PROGRAMMING LANGUAGE SPECIFICATION
**Version 1.0.0 — Multilingual Polyglot Language (English, Yoruba, Hausa, Igbo) with Native JavaScript & Python Interoperability**

---

## 1. Philosophy
Wazobia is designed with three foundational pillars:
1. **Linguistic Inclusivity & Sovereignty**: Empower developers to write, read, think, and solve problems directly in their native mother tongue (Yorùbá, Hausa, Asụsụ Igbo) or English, eliminating the cognitive friction of foreign-language programming syntax while retaining global interoperability.
2. **Ecosystem Leverage (Polyglot FFI)**: No new language can succeed in isolation. Wazobia grants instantaneous, zero-boilerplate bidirectional interoperability with the world's two largest software ecosystems: **JavaScript (npm, Node.js, Web APIs)** and **Python (PyPI, Machine Learning, Data Science, Scientific Computing)**.
3. **Simplicity and Expressiveness**: A clean, modern, expression-oriented grammar that balances the approachability of Python with the versatility and event-driven power of JavaScript, underpinned by lexically-scoped dynamic typing with gradual contracts.

---

## 2. Syntax
Wazobia syntax is modern, clean, and flexible:
- Statements can be delimited by newlines or semicolons `;`.
- Blocks are delimited by braces `{ ... }`.
- Comments:
  - Single-line: `//` or `#`
  - Multi-line: `/* ... */`
- Parentheses around `if`, `for`, and `while` conditions are optional when using braces.
- Indentation is aesthetic; braces define lexical blocks, making it robust against formatting variations across editors.

---

## 3. Keywords & Multilingual Mappings
Wazobia allows the developer to configure their project dialect (`english`, `yoruba`, `hausa`, `igbo`) or mix them freely. The lexer maps all dialect keywords to universal canonical internal tokens.

| Canonical Token | English | Yorùbá | Hausa | Igbo | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `KW_FOR` | `for` | `fun` | `don` | `maka` | Iterative loop construct |
| `KW_WHILE` | `while` | `nigbati` | `yayin` | `mgbe` | Conditional loop construct |
| `KW_AND` | `and` | `ati` | `da` | `na` | Logical conjunction |
| `KW_OR` | `or` | `tabi` | `ko` | `maobu` | Logical disjunction |
| `KW_NOT` | `not` | `ko` | `ba` | `abughi` | Logical negation |
| `KW_LET` | `let` | `je` | `bari` | `ka` | Mutable variable declaration |
| `KW_CONST` | `const` | `duro` | `tsaye` | `kwusie` | Immutable variable declaration |
| `KW_IF` | `if` | `ti` | `idan` | `oburu` | Conditional branch |
| `KW_ELSE` | `else` | `bikoṣe` / `el` | `inba_haka` / `kuma` | `ozor` / `ma` | Alternative branch |
| `KW_ELIF` | `elif` | `tikoje` | `kodan` | `moburu` | Chained conditional branch |
| `KW_FN` | `fn` / `function` | `ise` | `aiki` | `oru` | Function definition |
| `KW_RETURN` | `return` | `pada` | `koma` | `lota` | Return value from function |
| `KW_TRUE` | `true` | `otito` | `gaskiya` | `eziokwu` | Boolean truth value |
| `KW_FALSE` | `false` | `iro` | `kariya` | `asi` | Boolean false value |
| `KW_NULL` | `null` / `nil` | `ofo` | `babu` | `efu` | Null / absence of value |
| `KW_CLASS` | `class` | `egbe` | `aji` | `otu` | Object-oriented class |
| `KW_NEW` | `new` | `tuntun` | `sabo` | `ohuru` | Instantiation operator |
| `KW_TRY` | `try` | `gbiyanju` | `gwada` | `nwaa` | Exception handling block |
| `KW_CATCH` | `catch` | `mu` | `kama` | `nwute` | Exception capture block |
| `KW_FINALLY` | `finally` | `ni_ipari` | `a_karshe` | `na_ikpeazu` | Guaranteed cleanup block |
| `KW_ASYNC` | `async` | `asiko` | `lokaci` | `oge` | Asynchronous function modifier |
| `KW_AWAIT` | `await` | `duro_de` | `jira` | `chere` | Asynchronous promise resolution |
| `KW_IMPORT` | `import` | `gba_wole` | `shigo` | `bubata` | Module / library inclusion |
| `KW_FROM` | `from` | `lati` | `daga` | `site` | Import origin specifier |
| `KW_EXPORT` | `export` | `firanmo` | `fitar` | `bupuru` | Module export declaration |
| `KW_PRINT` | `print` | `te` | `buga` | `dee` | Standard output printing |

---

## 4. Identifiers
- Wazobia natively supports full UTF-8 identifiers:
  - Letters: `[a-zA-Z_]` as well as Yorùbá tonal letters (`ẹ`, `ọ`, `ṣ`, `á`, `à`, etc.), Hausa hooked letters (`ɓ`, `ɗ`, `ƙ`, `ƴ`), and Igbo dotted vowels (`ị`, `ọ`, `ụ`, `ṅ`).
  - Digits: `[0-9]` (cannot be first character).
  - Normalization: Automatically normalized via Unicode NFKC so accented variations match reliably.

---

## 5. Variables & Mutability
- `let` (`je`, `bari`, `ka`): Declares a block-scoped mutable variable.
- `const` (`duro`, `tsaye`, `kwusie`): Declares a block-scoped immutable binding.
- Scoping: Lexical scoping rules (inner blocks shadow outer blocks).

---

## 6. Types
Wazobia supports dynamic typing with rich primitive and compound types:
- **Primitives**:
  - `Number`: 64-bit IEEE 754 floating-point and arbitrary precision integer conversions.
  - `String`: UTF-8 immutable text sequences with template literals (`"Hello ${name}"`).
  - `Boolean`: `true` (`otito`, `gaskiya`, `eziokwu`) and `false` (`iro`, `kariya`, `asi`).
  - `Null`: `null` (`ofo`, `babu`, `efu`).
  - `Undefined`: Represented internally as `undefined`.
- **Compound Types**:
  - `List`: Ordered, dynamic arrays: `[1, 2, "item", true]`.
  - `Object / Map`: Key-value dictionaries: `{ oruko: "Ade", ojo_ori: 25 }`.
  - `Function`: First-class callable closures.
  - `Class / Instance`: OOP user-defined types.
  - `JSProxy` & `PyProxy`: Transparent wrapper objects wrapping JavaScript and Python references.

---

## 7. Operators
- **Arithmetic**: `+`, `-`, `*`, `/`, `%`, `**` (exponentiation).
- **Comparison**: `==`, `!=`, `<`, `<=`, `>`, `>=`.
- **Logical Operators (Required First-Class)**:
  - Logical AND: `and` (English), `ati` (Yoruba), `da` (Hausa), `na` (Igbo), or `&&`. Short-circuiting.
  - Logical OR: `or` (English), `tabi` (Yoruba), `ko` (Hausa), `maobu` (Igbo), or `||`. Short-circuiting.
  - Logical NOT: `not` (English), `ko` (Yoruba), `ba` (Hausa), `abughi` (Igbo), or `!`. Prefix unary.
- **Assignment**: `=`, `+=`, `-=`, `*=`, `/=`.
- **Range Operator**: `..` (e.g., `1..10` generates an iterable sequence from 1 to 10 inclusive).

---

## 8. Functions
Functions are first-class citizens in Wazobia:
```wazobia
// English
fn calculate_total(price, tax_rate) {
    return price + (price * tax_rate)
}

// Yorùbá
ise isiro_apapo(owo, owo_ori) {
    pada owo + (owo * owo_ori)
}

// Hausa
aiki lissafa_jimla(farashi, haraji) {
    koma farashi + (farashi * haraji)
}

// Igbo
oru gbakoo_ngụkọ(ego, utụ) {
    lota ego + (ego * utụ)
}
```
- First-class closures, default parameter values, rest parameters (`...args`), and anonymous arrow functions (`(x) => x * 2`).

---

## 9. Objects & Maps
Objects are key-value structures with dynamic property access:
```wazobia
let ilu = {
    oruko: "Eko",
    orile_ede: "Nigeria",
    awon_eniyan: 20000000
}
te(ilu.oruko)       // "Eko"
ilu["ipinle"] = "Lagos"
```

---

## 10. Classes & OOP
Full object-oriented programming with constructors, methods, and inheritance:
```wazobia
class Eniyan {
    init(oruko, ojo_ori) {
        this.oruko = oruko
        this.ojo_ori = ojo_ori
    }
    
    kini_oruko() {
        return "Oruko mi ni " + this.oruko
    }
}

let user = new Eniyan("Chidi", 28)
```

---

## 11. Modules
Modular code organization with bidirectional exports and imports:
```wazobia
// Exporting
export fn so_dada() { return "E kaaro!" }

// Importing from local file
import { so_dada } from "./ikini.lala"
```

---

## 12. Error Handling
Robust exception handling with `try`, `catch`, `finally` across all languages:
```wazobia
// Yorùbá dialect
gbiyanju {
    let ewu = 10 / 0
} mu (aṣiṣe) {
    te("Aṣiṣe sele: " + aṣiṣe)
} ni_ipari {
    te("Ipari gbiyanju.")
}
```

---

## 13. Async / Concurrency
Event-loop-based asynchronous programming with `async` and `await`:
```wazobia
async fn gba_data() {
    let abajade = await fetch_remote()
    return abajade
}
```

---

## 14. Memory Model
- Automatically managed heap with garbage collection (leveraging V8 high-performance generational mark-and-sweep GC).
- Safe reference counting and lifecycle cleanup for cross-language proxies (JavaScript and Python references).

---

## 15. Package System
- Package metadata file: `wazobia.pkg.json`.
- Can install and manage native Wazobia packages as well as automatically resolve and expose dependencies from `npm` and `pip`.

---

## 16. JavaScript Interoperability (Zero Boilerplate)
Wazobia can directly import, call, and pass data to any JavaScript standard library or npm package:
```wazobia
// Import JS modules directly
import js "fs" as fs
import js "path" as path

// Call JS global functions or properties
let rad = js.Math.sqrt(144) // 12
te("Square root lati JS: " + rad)

let timestamp = js.Date.now()
te("Akoko: " + timestamp)
```
- Wazobia data structures (Numbers, Strings, Booleans, Lists, Objects) are mapped to JS equivalents without manual marshaling.

---

## 17. Python Interoperability (Zero Boilerplate)
Wazobia integrates directly with the installed Python environment (Python 3.14):
```wazobia
// Import Python standard or pip libraries directly
import py "math" as pymath
import py "json" as pyjson

let sin_val = pymath.sin(1.57079)
te("Python Sine: " + sin_val)

// Run Python code blocks dynamically
let py_res = py.eval("[x**2 for x in range(5)]")
te("Python comprehension: " + py_res)
```

---

## 18. Multilingual Syntax Engine
When Wazobia is installed or a project is initialized via `wazobia init`, the developer chooses their primary tongue:
1. `english` (Default universal)
2. `yoruba` (Yorùbá native)
3. `hausa` (Hausa native)
4. `igbo` (Asụsụ Igbo native)

Developers can write in pure English, pure Yoruba, pure Hausa, pure Igbo, or even seamlessly mix them in the same file. The lexer contains unified bidirectional keyword tokenization.

---

## 19. Standard Library (`wazobia:*`)
Built-in modules available out of the box:
- `wazobia:io` (`te`, `ka_oro`, `file_read`, `file_write`)
- `wazobia:math` (`apapo`, `gbongbo`, `sin`, `cos`, `random`)
- `wazobia:string` (`kekere`, `nla`, `pin`, `sopọ`)
- `wazobia:os` (`eto_igbese`, `orin_ipase`, `oruko_kọmputa`)

---

## 20. Compiler Architecture
```
Source Code (.lala)
      │
      ▼
Unicode Lexer (Multi-Dialect Normalization: EN / YOR / HAU / IGB)
      │
      ▼
Tokens Stream (Canonical AST Tokens)
      │
      ▼
Recursive Descent Parser (Precedence Climbing for Operators)
      │
      ▼
Abstract Syntax Tree (AST)
      │
  ┌───┴────────────────────────┐
  ▼                            ▼
Tree-Walk Interpreter    Code Transpiler (To ES2024 / Node / Python)
(with JS & Py FFI)
```

---

## 21. Runtime Architecture
The Wazobia runtime runs on top of the ultra-fast V8/Node.js host engine, maintaining a concurrent bidirectional bridge to Python via IPC/JSON-RPC shared communication channels.
- Object Proxies allow accessing `.property` and invoking `(...args)` on remote JS and Python objects seamlessly.

---

## 22. Security Model
- Sandboxed evaluation modes (`--safe` flag) disabling arbitrary OS/filesystem writes.
- Explicit permissions for FFI loading (`allow_js`, `allow_python`).

---

## 23. Versioning
Wazobia adheres to **Semantic Versioning 2.0.0 (SemVer)**:
- `v1.0.0`: Initial release featuring English, Yoruba, Hausa, Igbo multilingual support, `for` loops, logical `and`/`or`/`not`, and full JS + Python interoperability.
