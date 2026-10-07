'use strict';
// =============================================
// LALA IDE v2.0 - Full Engine
// Firebase Auth + Firestore + IntelliSense
// Minimap + Find/Replace + Terminal
// =============================================

// ---- CONFIG ----
const LANG = {
  lala:{ext:'.lala',icon:'🌍',label:'LALA'},
  javascript:{ext:'.js',icon:'🟨',label:'JavaScript'},
  python:{ext:'.py',icon:'🐍',label:'Python'},
  html:{ext:'.html',icon:'🌐',label:'HTML'},
  css:{ext:'.css',icon:'🎨',label:'CSS'},
  json:{ext:'.json',icon:'📋',label:'JSON'},
  text:{ext:'.txt',icon:'📄',label:'Text'},
};
function extToLang(f){const e=f.split('.').pop().toLowerCase();return{lala:'lala',js:'javascript',py:'python',html:'html',css:'css',json:'json',txt:'text',md:'text'}[e]||'text';}
function li(l){return(LANG[l]||LANG.text).icon;}
function ll(l){return(LANG[l]||LANG.text).label;}
function le(l){return(LANG[l]||LANG.text).ext;}

// ---- TEMPLATES ----
const TPL={
  lala:`// Hello World in LALA\nlet name = "World"\nprint("Hello, " + name + "!")\nprint("LALA IDE v2.0 - Multilingual Programming")\n\nfn greet(person) {\n    return "Welcome, " + person + "!"\n}\n\nprint(greet("Adewale"))\n`,
  javascript:`'use strict';\n\nconst greet = (name) => \`Hello, \${name}!\`;\nconsole.log(greet('World'));\n\nconst nums = [1,2,3,4,5];\nconst doubled = nums.map(n => n * 2);\nconsole.log('Doubled:', doubled);\n`,
  python:`# Python\ndef greet(name):\n    return f"Hello, {name}!"\n\nprint(greet("World"))\n\nnums = [1,2,3,4,5]\ndoubled = [n*2 for n in nums]\nprint("Doubled:", doubled)\n`,
  html:`<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8"/>\n  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>\n  <title>My App</title>\n  <style>\n    *{margin:0;padding:0;box-sizing:border-box;}\n    body{font-family:'Segoe UI',sans-serif;background:linear-gradient(135deg,#0d1117,#1a1b26);min-height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;}\n    .card{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:16px;padding:2rem 3rem;text-align:center;backdrop-filter:blur(10px);}\n    h1{font-size:2.5rem;margin-bottom:1rem;background:linear-gradient(135deg,#7c3aed,#007acc);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}\n    p{color:rgba(255,255,255,.7);margin-bottom:1.5rem;}\n    button{padding:.75rem 2rem;border-radius:8px;background:linear-gradient(135deg,#7c3aed,#007acc);border:none;color:#fff;font-size:1rem;cursor:pointer;}\n    #c{font-size:3rem;font-weight:900;color:#4fc1ff;margin:1rem 0;}\n  </style>\n</head>\n<body>\n  <div class="card">\n    <h1>Hello LALA!</h1>\n    <p>Built with LALA IDE</p>\n    <div id="c">0</div>\n    <button onclick="document.getElementById('c').textContent=+document.getElementById('c').textContent+1">Click!</button>\n  </div>\n</body>\n</html>\n`,
  css:`/* CSS Styles */\n:root {\n  --primary: #7c3aed;\n  --accent: #007acc;\n  --bg: #0d1117;\n}\n\nbody {\n  font-family: 'Inter', sans-serif;\n  background: var(--bg);\n  color: #d4d4d4;\n  margin: 0;\n}\n`,
  json:`{\n  "name": "my-lala-project",\n  "version": "1.0.0",\n  "language": "lala",\n  "dialect": "english"\n}\n`,
  text:`# Notes\n\nWrite your notes here...\n`,
};

// ---- VIRTUAL FS ----
class VFS {
  constructor(){this.files=new Map();this._load();}
  _load(){try{const s=localStorage.getItem('lala-ide-v2');if(s){const o=JSON.parse(s);for(const[k,v]of Object.entries(o))this.files.set(k,v);}}catch(e){}}
  _save(){try{const o={};this.files.forEach((v,k)=>{o[k]=v;});localStorage.setItem('lala-ide-v2',JSON.stringify(o));}catch(e){}}
  create(name,lang,content=''){if(!content)content=TPL[lang]||'';const f={content,lang,created:Date.now(),modified:Date.now()};this.files.set(name,f);this._save();return f;}
  get(name){return this.files.get(name);}
  update(name,content){const f=this.files.get(name);if(f){f.content=content;f.modified=Date.now();this._save();}}
  rename(o,n){const f=this.files.get(o);if(f){this.files.set(n,f);this.files.delete(o);this._save();}}
  delete(name){this.files.delete(name);this._save();}
  list(){return[...this.files.entries()].map(([n,d])=>({name:n,...d})).sort((a,b)=>a.name.localeCompare(b.name));}
  has(n){return this.files.has(n);}
  size(){return this.files.size;}
  toJSON(){const o={};this.files.forEach((v,k)=>{o[k]=v;});return o;}
  fromJSON(o){this.files.clear();for(const[k,v]of Object.entries(o))this.files.set(k,v);this._save();}
}

// ---- SYNTAX HIGHLIGHTER ----
const HL={
  esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');},
  lala(code){
    let s=this.esc(code);
    s=s.replace(/(\/\/[^\n]*|#[^\n]*)/g,'<span class="hl-comment">$1</span>');
    s=s.replace(/(\/\*[\s\S]*?\*\/)/g,'<span class="hl-comment">$1</span>');
    s=s.replace(/(&quot;[^&\n]*?&quot;|&#x27;[^&#\n]*?&#x27;|`[^`]*?`)/g,'<span class="hl-string">$1</span>');
    s=s.replace(/\b(\d+\.?\d*)\b/g,'<span class="hl-number">$1</span>');
    s=s.replace(/\b(je|duro|ise|pada|ti|bikose|tabiti|fun|ninu|nigbati|te|otito|iro|ofo|ati|tabi|ko|bari|tsaye|aiki|koma|idan|kuma|kodan|don|cikin|yayin|buga|gaskiya|babu|da|ka|kwusie|oru|lota|oburu|ozor|moburu|maka|nime|mgbe|dee|eziokwu|asi|efu|na|maobu|abughi|gbiyanju|mu|ni_ipari|asiko|duro_de|gba_wole|lati|firanmo|tuntun|sabo|ohuru|nwaa|nwute|na_ikpeazu|oge|chere|bubata|site|bupuru|egbe|aji|otu|gwada|kama|a_karshe|lokaci|jira|shigo|daga|fitar)\b/g,'<span class="hl-dialect">$&</span>');
    s=s.replace(/\b(let|const|var|fn|function|return|if|elif|else|for|in|of|while|class|new|true|false|null|nil|and|or|not|async|await|import|from|export|print|this|init|try|catch|finally|break|continue|typeof|instanceof|delete|void|yield|super|extends|static)\b/g,'<span class="hl-keyword">$&</span>');
    s=s.replace(/\b(js|Math|Date|JSON|Array|Object|Number|String|Boolean|Promise|fetch|console|window|document|setTimeout|setInterval|clearTimeout|parseInt|parseFloat|isNaN|isFinite)\b/g,'<span class="hl-builtin">$&</span>');
    s=s.replace(/\b([A-Z][a-zA-Z0-9_]*)\b/g,'<span class="hl-class">$&</span>');
    s=s.replace(/\b([a-zA-Z_]\w*)\s*(?=\()/g,'<span class="hl-function">$1</span>');
    s=s.replace(/\b([a-zA-Z_]\w*)\s*(?=\s*[=:](?![=>]))/g,'<span class="hl-var">$1</span>');
    return s;
  },
  javascript(code){
    let s=this.esc(code);
    s=s.replace(/(\/\/[^\n]*)/g,'<span class="hl-comment">$1</span>');
    s=s.replace(/(\/\*[\s\S]*?\*\/)/g,'<span class="hl-comment">$1</span>');
    s=s.replace(/(\/(?:[^/\\\n]|\\.)+\/[gimsuy]*)/g,'<span class="hl-regex">$1</span>');
    s=s.replace(/(`[^`]*`)/g,'<span class="hl-string">$1</span>');
    s=s.replace(/(&quot;[^&\n]*?&quot;|&#x27;[^&#\n]*?&#x27;)/g,'<span class="hl-string">$1</span>');
    s=s.replace(/\b(\d+\.?\d*(?:[eE][+-]?\d+)?n?)\b/g,'<span class="hl-number">$1</span>');
    s=s.replace(/\b(var|let|const|function|return|if|else|for|in|of|while|do|switch|case|default|break|continue|class|new|true|false|null|undefined|this|typeof|instanceof|async|await|try|catch|finally|throw|import|export|from|static|get|set|super|extends|yield|delete|void|debugger)\b/g,'<span class="hl-keyword">$&</span>');
    s=s.replace(/\b(console|Math|JSON|Array|Object|Promise|fetch|document|window|setTimeout|clearTimeout|setInterval|clearInterval|Map|Set|WeakMap|WeakSet|Symbol|Proxy|Reflect|Error|parseInt|parseFloat|isNaN|Number|String|Boolean|Function|RegExp|Date)\b/g,'<span class="hl-builtin">$&</span>');
    s=s.replace(/@\w+/g,'<span class="hl-decorator">$&</span>');
    s=s.replace(/\b([A-Z][a-zA-Z0-9_]*)\b/g,'<span class="hl-class">$&</span>');
    s=s.replace(/\b([a-zA-Z_]\w*)\s*(?=\()/g,'<span class="hl-function">$1</span>');
    s=s.replace(/(\.\b[a-zA-Z_]\w*\b)(?!\s*\()/g,'<span class="hl-property">$1</span>');
    return s;
  },
  python(code){
    let s=this.esc(code);
    s=s.replace(/(#[^\n]*)/g,'<span class="hl-comment">$1</span>');
    s=s.replace(/(&quot;&quot;&quot;[\s\S]*?&quot;&quot;&quot;|&#x27;&#x27;&#x27;[\s\S]*?&#x27;&#x27;&#x27;)/g,'<span class="hl-string">$1</span>');
    s=s.replace(/(f&quot;[^&\n]*?&quot;|f&#x27;[^&#\n]*?&#x27;|r&quot;[^&\n]*?&quot;|b&quot;[^&\n]*?&quot;)/g,'<span class="hl-string">$1</span>');
    s=s.replace(/(&quot;[^&\n]*?&quot;|&#x27;[^&#\n]*?&#x27;)/g,'<span class="hl-string">$1</span>');
    s=s.replace(/\b(\d+\.?\d*(?:[eEjJ])?\b)/g,'<span class="hl-number">$1</span>');
    s=s.replace(/\b(def|class|return|if|elif|else|for|in|while|try|except|finally|with|as|import|from|pass|break|continue|lambda|yield|raise|assert|global|nonlocal|del|and|or|not|is|True|False|None|async|await|match|case)\b/g,'<span class="hl-keyword">$&</span>');
    s=s.replace(/\b(print|len|range|type|int|float|str|list|dict|tuple|set|bool|input|open|enumerate|zip|map|filter|sorted|reversed|sum|min|max|abs|round|isinstance|hasattr|getattr|setattr|repr|iter|next|id|dir|help|vars|super|property|staticmethod|classmethod)\b/g,'<span class="hl-builtin">$&</span>');
    s=s.replace(/@\w+/g,'<span class="hl-decorator">$&</span>');
    s=s.replace(/\b([A-Z][a-zA-Z0-9_]*)\b/g,'<span class="hl-class">$&</span>');
    s=s.replace(/\b([a-zA-Z_]\w*)\s*(?=\()/g,'<span class="hl-function">$1</span>');
    return s;
  },
  html(code){
    let s=this.esc(code);
    s=s.replace(/(&lt;!--[\s\S]*?--&gt;)/g,'<span class="hl-comment">$1</span>');
    s=s.replace(/=(&quot;[^&]*?&quot;|&#x27;[^&#]*?&#x27;)/g,'=<span class="hl-attrval">$1</span>');
    s=s.replace(/(&lt;\/?)([a-zA-Z][a-zA-Z0-9-]*)/g,'$1<span class="hl-tag">$2</span>');
    s=s.replace(/\s([a-zA-Z][a-zA-Z0-9-]*)(?==)/g,' <span class="hl-attr">$1</span>');
    return s;
  },
  css(code){
    let s=this.esc(code);
    s=s.replace(/(\/\*[\s\S]*?\*\/)/g,'<span class="hl-comment">$1</span>');
    s=s.replace(/(&quot;[^&]*?&quot;|&#x27;[^&#]*?&#x27;)/g,'<span class="hl-string">$1</span>');
    s=s.replace(/(#[0-9a-fA-F]{3,8})\b/g,'<span class="hl-number">$1</span>');
    s=s.replace(/\b(-?\d+\.?\d*(?:px|em|rem|%|vh|vw|vmin|vmax|deg|s|ms|fr|ch|ex)?)\b/g,'<span class="hl-number">$1</span>');
    s=s.replace(/([.#]?[a-zA-Z][a-zA-Z0-9_-]*)(?=\s*\{)/g,'<span class="hl-selector">$1</span>');
    s=s.replace(/([a-zA-Z-]+)\s*(?=:(?!:))/g,'<span class="hl-property">$1</span>');
    s=s.replace(/\b(var|calc|rgba?|hsl|linear-gradient|radial-gradient|url|translate|rotate|scale|matrix|perspective|none|auto|inherit|initial|unset|normal|bold|italic)\b/g,'<span class="hl-builtin">$&</span>');
    return s;
  },
  json(code){
    let s=this.esc(code);
    s=s.replace(/(&quot;[^&]*?&quot;)\s*:/g,'<span class="hl-property">$1</span>:');
    s=s.replace(/:\s*(&quot;[^&]*?&quot;)/g,':<span class="hl-string">$1</span>');
    s=s.replace(/:\s*(-?\d+\.?\d*(?:[eE][+-]?\d+)?)/g,':<span class="hl-number">$1</span>');
    s=s.replace(/\b(true|false|null)\b/g,'<span class="hl-boolean">$&</span>');
    return s;
  },
  highlight(code,lang){
    if(!code)return'';
    try{
      if(lang==='lala')return this.lala(code);
      if(lang==='javascript')return this.javascript(code);
      if(lang==='python')return this.python(code);
      if(lang==='html')return this.html(code);
      if(lang==='css')return this.css(code);
      if(lang==='json')return this.json(code);
      return this.esc(code);
    }catch(e){return this.esc(code);}
  }
};

// ---- INTELLISENSE DATA ----
const IS_DATA = {
  lala:[
    {label:'print',kind:'function',detail:'print(value)',doc:'Output a value to the console'},
    {label:'let',kind:'keyword',detail:'let name = value',doc:'Declare a variable'},
    {label:'const',kind:'keyword',detail:'const name = value',doc:'Declare a constant'},
    {label:'fn',kind:'keyword',detail:'fn name(params) { }',doc:'Declare a function'},
    {label:'if',kind:'keyword',detail:'if condition { }',doc:'Conditional statement'},
    {label:'elif',kind:'keyword',detail:'elif condition { }',doc:'Else-if branch'},
    {label:'else',kind:'keyword',detail:'else { }',doc:'Else branch'},
    {label:'for',kind:'keyword',detail:'for i in range { }',doc:'For loop'},
    {label:'while',kind:'keyword',detail:'while condition { }',doc:'While loop'},
    {label:'class',kind:'keyword',detail:'class Name { }',doc:'Declare a class'},
    {label:'return',kind:'keyword',detail:'return value',doc:'Return from function'},
    {label:'import',kind:'keyword',detail:'import module from "path"',doc:'Import a module'},
    {label:'async',kind:'keyword',detail:'async fn name() { }',doc:'Async function'},
    {label:'await',kind:'keyword',detail:'await expression',doc:'Await a promise'},
    {label:'true',kind:'keyword',detail:'boolean true',doc:'Boolean true value'},
    {label:'false',kind:'keyword',detail:'boolean false',doc:'Boolean false value'},
    {label:'null',kind:'keyword',detail:'null value',doc:'Null/nil value'},
    {label:'this',kind:'keyword',detail:'this.property',doc:'Current class instance'},
    {label:'new',kind:'keyword',detail:'new ClassName()',doc:'Create class instance'},
    {label:'try',kind:'keyword',detail:'try { } catch(e) { }',doc:'Error handling block'},
    {label:'je',kind:'keyword',detail:'je oruko = iye (Yoruba let)',doc:'Yoruba: declare variable'},
    {label:'ise',kind:'keyword',detail:'ise (...) {...} (Yoruba function)',doc:'Yoruba: function keyword'},
    {label:'te',kind:'keyword',detail:'te(iye) (Yoruba print)',doc:'Yoruba: print/output'},
    {label:'buga',kind:'keyword',detail:'buga(iye) (Hausa print)',doc:'Hausa: print/output'},
    {label:'dee',kind:'keyword',detail:'dee(uru) (Igbo print)',doc:'Igbo: print/output'},
    {label:'greet',kind:'snippet',detail:'fn greet(name) snippet',doc:'Insert greeting function'},
    {label:'forloop',kind:'snippet',detail:'for loop snippet',doc:'Insert for loop'},
    {label:'class',kind:'snippet',detail:'class template',doc:'Insert class template'},
  ],
  javascript:[
    {label:'console.log',kind:'function',detail:'console.log(...args)',doc:'Log to console'},
    {label:'const',kind:'keyword',detail:'const name = value',doc:'Block-scoped constant'},
    {label:'let',kind:'keyword',detail:'let name = value',doc:'Block-scoped variable'},
    {label:'var',kind:'keyword',detail:'var name = value',doc:'Function-scoped variable'},
    {label:'function',kind:'keyword',detail:'function name(params) {}',doc:'Function declaration'},
    {label:'return',kind:'keyword',detail:'return value',doc:'Return statement'},
    {label:'class',kind:'keyword',detail:'class Name {}',doc:'Class declaration'},
    {label:'async',kind:'keyword',detail:'async function name() {}',doc:'Async function'},
    {label:'await',kind:'keyword',detail:'await promise',doc:'Await a Promise'},
    {label:'import',kind:'keyword',detail:"import { } from ''",doc:'ES module import'},
    {label:'export',kind:'keyword',detail:'export default value',doc:'ES module export'},
    {label:'if',kind:'keyword',detail:'if (cond) {}',doc:'If statement'},
    {label:'for',kind:'keyword',detail:'for (let i=0;i<n;i++) {}',doc:'For loop'},
    {label:'forEach',kind:'function',detail:'array.forEach(item => {})',doc:'Iterate array'},
    {label:'map',kind:'function',detail:'array.map(item => value)',doc:'Transform array'},
    {label:'filter',kind:'function',detail:'array.filter(item => bool)',doc:'Filter array'},
    {label:'reduce',kind:'function',detail:'array.reduce((acc,cur)=>acc,init)',doc:'Reduce array'},
    {label:'Promise',kind:'class',detail:'new Promise((resolve,reject)=>{})',doc:'Create a Promise'},
    {label:'fetch',kind:'function',detail:'fetch(url, options)',doc:'HTTP fetch request'},
    {label:'JSON.parse',kind:'function',detail:'JSON.parse(string)',doc:'Parse JSON string'},
    {label:'JSON.stringify',kind:'function',detail:'JSON.stringify(value)',doc:'Stringify to JSON'},
    {label:'document.getElementById',kind:'function',detail:'document.getElementById(id)',doc:'Get element by ID'},
    {label:'addEventListener',kind:'function',detail:"element.addEventListener('event', handler)",doc:'Add event listener'},
    {label:'setTimeout',kind:'function',detail:'setTimeout(callback, delay)',doc:'Delayed execution'},
  ],
  python:[
    {label:'print',kind:'function',detail:'print(*args, sep=" ", end="\\n")',doc:'Print to stdout'},
    {label:'def',kind:'keyword',detail:'def name(params):',doc:'Define function'},
    {label:'class',kind:'keyword',detail:'class Name:',doc:'Define class'},
    {label:'import',kind:'keyword',detail:'import module',doc:'Import module'},
    {label:'from',kind:'keyword',detail:'from module import name',doc:'From import'},
    {label:'if',kind:'keyword',detail:'if condition:',doc:'If statement'},
    {label:'elif',kind:'keyword',detail:'elif condition:',doc:'Else-if'},
    {label:'else',kind:'keyword',detail:'else:',doc:'Else branch'},
    {label:'for',kind:'keyword',detail:'for item in iterable:',doc:'For loop'},
    {label:'while',kind:'keyword',detail:'while condition:',doc:'While loop'},
    {label:'return',kind:'keyword',detail:'return value',doc:'Return'},
    {label:'try',kind:'keyword',detail:'try:\\n    pass\\nexcept Exception as e:',doc:'Try/except'},
    {label:'lambda',kind:'keyword',detail:'lambda args: expression',doc:'Lambda function'},
    {label:'with',kind:'keyword',detail:'with open(file) as f:',doc:'Context manager'},
    {label:'range',kind:'function',detail:'range(start, stop, step)',doc:'Number range'},
    {label:'len',kind:'function',detail:'len(sequence)',doc:'Length of sequence'},
    {label:'enumerate',kind:'function',detail:'enumerate(iterable, start=0)',doc:'Index + value pairs'},
    {label:'zip',kind:'function',detail:'zip(*iterables)',doc:'Zip multiple iterables'},
    {label:'map',kind:'function',detail:'map(function, iterable)',doc:'Map function to iterable'},
    {label:'filter',kind:'function',detail:'filter(function, iterable)',doc:'Filter by function'},
    {label:'list',kind:'function',detail:'list(iterable)',doc:'Create list'},
    {label:'dict',kind:'function',detail:'dict(**kwargs)',doc:'Create dictionary'},
    {label:'isinstance',kind:'function',detail:'isinstance(obj, class)',doc:'Type check'},
  ],
  html:[
    {label:'div',kind:'snippet',detail:'<div></div>',doc:'Block container'},
    {label:'span',kind:'snippet',detail:'<span></span>',doc:'Inline container'},
    {label:'p',kind:'snippet',detail:'<p></p>',doc:'Paragraph'},
    {label:'h1',kind:'snippet',detail:'<h1></h1>',doc:'Heading 1'},
    {label:'input',kind:'snippet',detail:'<input type="text" />',doc:'Form input'},
    {label:'button',kind:'snippet',detail:'<button></button>',doc:'Button'},
    {label:'img',kind:'snippet',detail:'<img src="" alt="" />',doc:'Image'},
    {label:'a',kind:'snippet',detail:'<a href=""></a>',doc:'Anchor link'},
    {label:'ul',kind:'snippet',detail:'<ul><li></li></ul>',doc:'Unordered list'},
    {label:'form',kind:'snippet',detail:'<form action="" method="post"></form>',doc:'Form'},
    {label:'script',kind:'snippet',detail:'<script></script>',doc:'Script block'},
    {label:'style',kind:'snippet',detail:'<style></style>',doc:'Style block'},
    {label:'meta',kind:'snippet',detail:'<meta name="" content="" />',doc:'Meta tag'},
    {label:'link',kind:'snippet',detail:'<link rel="stylesheet" href="" />',doc:'Link tag'},
  ],
  css:[
    {label:'display',kind:'property',detail:'display: flex | grid | block | inline',doc:'Display type'},
    {label:'flex',kind:'snippet',detail:'display: flex;\nalign-items: center;\njustify-content: center;',doc:'Flexbox center'},
    {label:'grid',kind:'snippet',detail:'display: grid;\ngrid-template-columns: repeat(auto-fit, minmax(280px,1fr));\ngap: 1rem;',doc:'Grid layout'},
    {label:'position',kind:'property',detail:'position: relative | absolute | fixed | sticky',doc:'Positioning'},
    {label:'margin',kind:'property',detail:'margin: top right bottom left',doc:'Outer spacing'},
    {label:'padding',kind:'property',detail:'padding: top right bottom left',doc:'Inner spacing'},
    {label:'border',kind:'property',detail:'border: width style color',doc:'Border shorthand'},
    {label:'border-radius',kind:'property',detail:'border-radius: value',doc:'Corner rounding'},
    {label:'background',kind:'property',detail:'background: color | gradient | image',doc:'Background'},
    {label:'color',kind:'property',detail:'color: value',doc:'Text color'},
    {label:'font-size',kind:'property',detail:'font-size: px | em | rem | %',doc:'Font size'},
    {label:'transition',kind:'property',detail:'transition: property duration timing',doc:'CSS transition'},
    {label:'animation',kind:'property',detail:'animation: name duration timing iteration',doc:'CSS animation'},
    {label:'gradient',kind:'snippet',detail:'background: linear-gradient(135deg, #7c3aed, #007acc);',doc:'Purple-blue gradient'},
    {label:'glassmorphism',kind:'snippet',detail:'background: rgba(255,255,255,.1);\nbackdrop-filter: blur(10px);\nborder: 1px solid rgba(255,255,255,.2);\nborder-radius: 16px;',doc:'Glass effect'},
  ],
};

// ---- CODE SNIPPETS ----
const SNIPS={
  lala:[
    {lang:'lala',label:'Hello World',code:`let name = "World"\nprint("Hello, " + name + "!")`},
    {lang:'lala',label:'Function',code:`fn greet(name) {\n    return "Hello, " + name + "!"\n}\nprint(greet("LALA"))`},
    {lang:'lala',label:'For Loop',code:`for i in 1..10 {\n    print("Step:", i)\n}`},
    {lang:'lala',label:'While Loop',code:`let i = 0\nwhile i < 5 {\n    print(i)\n    i = i + 1\n}`},
    {lang:'lala',label:'Class',code:`class Animal {\n    init(name) {\n        this.name = name\n    }\n    speak() {\n        return this.name + " says hello!"\n    }\n}`},
    {lang:'lala',label:'Async Function',code:`async fn fetchData(url) {\n    let result = await http.get(url)\n    return result\n}`},
    {lang:'lala',label:'Try-Catch',code:`try {\n    let result = riskyOp()\n    print(result)\n} catch(e) {\n    print("Error:", e)\n}`},
    {lang:'lala',label:'Yoruba - Hello',code:`je oruko = "Babatunde"\nte("E kaabo, " + oruko + "!")`},
    {lang:'lala',label:'Hausa - Hello',code:`bari suna = "Amina"\nbuga("Sannu da zuwa, " + suna + "!")`},
    {lang:'lala',label:'Igbo - Hello',code:`ka aha = "Emeka"\ndee("Nnoo, " + aha + "!")`},
  ],
  javascript:[
    {lang:'javascript',label:'Arrow Function',code:`const greet = (name) => \`Hello, \${name}!\`;\nconsole.log(greet('World'));`},
    {lang:'javascript',label:'Array Methods',code:`const nums = [1,2,3,4,5];\nconst doubled = nums.map(n => n * 2);\nconst evens = nums.filter(n => n % 2 === 0);\nconsole.log(doubled, evens);`},
    {lang:'javascript',label:'Fetch API',code:`async function getData(url) {\n  const res = await fetch(url);\n  const data = await res.json();\n  return data;\n}\ngetData('https://api.example.com/data').then(console.log);`},
    {lang:'javascript',label:'Class',code:`class Animal {\n  constructor(name) { this.name = name; }\n  speak() { return \`\${this.name} says hello!\`; }\n}\nconst a = new Animal('Dog');\nconsole.log(a.speak());`},
    {lang:'javascript',label:'Destructuring',code:`const { name, age, ...rest } = person;\nconst [first, second, ...others] = array;\nconsole.log(name, age, first);`},
    {lang:'javascript',label:'Promise.all',code:`const results = await Promise.all([\n  fetch('/api/users'),\n  fetch('/api/posts'),\n]);\nconsole.log(results);`},
  ],
  python:[
    {lang:'python',label:'List Comprehension',code:`nums = [1,2,3,4,5]\nsquares = [n**2 for n in nums if n % 2 == 0]\nprint(squares)`},
    {lang:'python',label:'Class',code:`class Animal:\n    def __init__(self, name):\n        self.name = name\n    def speak(self):\n        return f"{self.name} says hello!"\n\na = Animal("Dog")\nprint(a.speak())`},
    {lang:'python',label:'Decorator',code:`def timer(func):\n    import time\n    def wrapper(*args, **kwargs):\n        start = time.time()\n        result = func(*args, **kwargs)\n        print(f"Time: {time.time()-start:.3f}s")\n        return result\n    return wrapper\n\n@timer\ndef slow():\n    import time; time.sleep(0.1)\nslow()`},
    {lang:'python',label:'Generator',code:`def fibonacci():\n    a, b = 0, 1\n    while True:\n        yield a\n        a, b = b, a + b\n\nfib = fibonacci()\nfor _ in range(10):\n    print(next(fib))`},
    {lang:'python',label:'Context Manager',code:`class FileHandler:\n    def __init__(self, path, mode='r'):\n        self.path = path; self.mode = mode\n    def __enter__(self):\n        self.file = open(self.path, self.mode)\n        return self.file\n    def __exit__(self, *args):\n        self.file.close()`},
  ],
  html:[
    {lang:'html',label:'Boilerplate',code:`<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8"/>\n  <title>Page</title>\n</head>\n<body>\n  <h1>Hello World</h1>\n</body>\n</html>`},
    {lang:'html',label:'Card Component',code:`<div class="card">\n  <h2>Title</h2>\n  <p>Content goes here.</p>\n  <button>Action</button>\n</div>`},
    {lang:'html',label:'Flexbox Layout',code:`<div style="display:flex;gap:1rem;align-items:center;">\n  <div>Item 1</div>\n  <div>Item 2</div>\n</div>`},
    {lang:'html',label:'Form',code:`<form action="#" method="post">\n  <input type="text" name="name" placeholder="Name" required/>\n  <input type="email" name="email" placeholder="Email" required/>\n  <button type="submit">Submit</button>\n</form>`},
  ],
  css:[
    {lang:'css',label:'Gradient',code:`background: linear-gradient(135deg, #7c3aed, #007acc);`},
    {lang:'css',label:'Glassmorphism',code:`background: rgba(255,255,255,0.1);\nbackdrop-filter: blur(10px);\nborder: 1px solid rgba(255,255,255,0.2);\nborder-radius: 16px;`},
    {lang:'css',label:'Flexbox Center',code:`display: flex;\nalign-items: center;\njustify-content: center;`},
    {lang:'css',label:'Grid Layout',code:`display: grid;\ngrid-template-columns: repeat(auto-fit, minmax(280px, 1fr));\ngap: 1.5rem;`},
    {lang:'css',label:'Animation',code:`@keyframes fadeIn {\n  from { opacity: 0; transform: translateY(10px); }\n  to   { opacity: 1; transform: translateY(0); }\n}\n.element {\n  animation: fadeIn 0.3s ease forwards;\n}`},
  ],
};

// ---- PYTHON RUNNER ----
class PyRunner {
  run(code){
    const out=[];const env={};
    const lines=code.split('\n');let i=0;
    while(i<lines.length){
      const line=lines[i].trim();
      if(!line||line.startsWith('#')){i++;continue;}
      if(/^print\s*\(/.test(line)){
        try{
          const inner=line.slice(line.indexOf('(')+1,line.lastIndexOf(')'));
          const parts=this._splitArgs(inner);
          const vals=parts.map(p=>this._eval(p.trim(),env));
          out.push({type:'output',text:vals.join(' ')});
        }catch(e){out.push({type:'error',text:e.message});}
        i++;continue;
      }
      const m=line.match(/^([a-zA-Z_]\w*)\s*=\s*(.+)/);
      if(m){try{env[m[1]]=this._eval(m[2],env);}catch(e){}i++;continue;}
      i++;
    }
    return out;
  }
  _eval(expr,env){
    expr=expr.trim();
    if(!expr)return undefined;
    if(expr.startsWith('"')&&expr.endsWith('"'))return expr.slice(1,-1);
    if(expr.startsWith("'")&&expr.endsWith("'"))return expr.slice(1,-1);
    if(!isNaN(expr))return parseFloat(expr);
    if(expr==='True')return true;if(expr==='False')return false;if(expr==='None')return null;
    if(expr.startsWith('[')&&expr.endsWith(']'))return this._splitArgs(expr.slice(1,-1)).map(p=>this._eval(p,env));
    if(expr in env)return env[expr];
    if(expr.match(/^f["']/)){const inner=expr.slice(2,-1);return inner.replace(/\{([^}]+)\}/g,(_,k)=>String(this._eval(k,env)));}
    try{const fn=new Function(...Object.keys(env),`return (${expr});`);return fn(...Object.values(env));}catch{return expr;}
  }
  _splitArgs(s){const p=[];let d=0,cur='';for(const c of s){if('([{'.includes(c))d++;if(')]}'.includes(c))d--;if(c===','&&d===0){p.push(cur);cur='';}else cur+=c;}if(cur.trim())p.push(cur);return p;}
}

// ---- JS RUNNER ----
class JSRunner {
  run(code){
    const out=[];
    const con={
      log:(...a)=>out.push({type:'output',text:a.map(x=>{try{return typeof x==='object'?JSON.stringify(x,null,2):String(x);}catch{return String(x);}}).join(' ')}),
      error:(...a)=>out.push({type:'error',text:a.join(' ')}),
      warn:(...a)=>out.push({type:'info',text:'⚠ '+a.join(' ')}),
      info:(...a)=>out.push({type:'info',text:a.join(' ')}),
      table:(d)=>out.push({type:'output',text:JSON.stringify(d,null,2)}),
    };
    try{const fn=new Function('console',code);fn(con);}
    catch(e){out.push({type:'error',text:`${e.name}: ${e.message}`});}
    return out;
  }
}



// ---- TOAST ----
function showToast(msg, type='info', dur=3000) {
  const area = document.getElementById('toast-area');
  if (!area) return;
  const t = document.createElement('div');
  t.className = 'toast ' + type;
  t.textContent = msg;
  area.appendChild(t);
  setTimeout(() => {
    t.style.opacity = '0';
    t.style.transform = 'translateX(20px)';
    t.style.transition = 'all .3s';
    setTimeout(() => t.remove(), 300);
  }, dur);
}


// ---- MONGODB API SERVICE ----
// Replaces Firebase. All auth and project sync goes through
// the Express + MongoDB backend at window.API_BASE.
class MongoDBService {
  constructor() {
    this.base = window.API_BASE || 'http://localhost:5000/api';
    this.token = localStorage.getItem('lala-ide-token') || null;
    this.user  = null;
    this.ready = true;
  }

  _headers(extra) {
    const h = { 'Content-Type': 'application/json', ...extra };
    if (this.token) h['Authorization'] = 'Bearer ' + this.token;
    return h;
  }

  async _req(method, path, body) {
    const opts = { method, headers: this._headers() };
    if (body) opts.body = JSON.stringify(body);
    const res = await fetch(this.base + path, opts);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Request failed');
    return data;
  }

  // Auth
  async register(name, email, password) {
    const data = await this._req('POST', '/auth/register', { name, email, password });
    this.token = data.token;
    this.user  = data.user;
    localStorage.setItem('lala-ide-token', data.token);
    localStorage.setItem('lala-ide-user',  JSON.stringify(data.user));
    return data.user;
  }

  async login(email, password) {
    const data = await this._req('POST', '/auth/login', { email, password });
    this.token = data.token;
    this.user  = data.user;
    localStorage.setItem('lala-ide-token', data.token);
    localStorage.setItem('lala-ide-user',  JSON.stringify(data.user));
    return data.user;
  }

  async restoreSession() {
    const token = localStorage.getItem('lala-ide-token');
    if (!token) return null;
    this.token = token;
    try {
      const data = await this._req('GET', '/auth/me');
      this.user = data.user;
      localStorage.setItem('lala-ide-user', JSON.stringify(data.user));
      return data.user;
    } catch {
      this.logout();
      return null;
    }
  }

  logout() {
    this.token = null;
    this.user  = null;
    localStorage.removeItem('lala-ide-token');
    localStorage.removeItem('lala-ide-user');
  }

  get currentUser() { return this.user; }

  // IDE Projects
  async saveProject(projectId, data) {
    if (!this.token) throw new Error('Not signed in');
    if (projectId && projectId !== 'default') {
      return this._req('PUT', '/ide-projects/' + projectId, data);
    }
    // Create new project
    const res = await this._req('POST', '/ide-projects', data);
    return res;
  }

  async loadProjects() {
    if (!this.token) throw new Error('Not signed in');
    const data = await this._req('GET', '/ide-projects');
    return data.projects;
  }

  async loadProject(id) {
    if (!this.token) throw new Error('Not signed in');
    const data = await this._req('GET', '/ide-projects/' + id);
    return data.project;
  }

  async deleteProject(id) {
    if (!this.token) throw new Error('Not signed in');
    return this._req('DELETE', '/ide-projects/' + id);
  }
}

// ---- MINIMAP ----
class Minimap {
  constructor(canvas, scrollEl) { this.canvas=canvas; this.ctx=canvas.getContext('2d'); this.scrollEl=scrollEl; }
  render(code, lang) {
    const lines = code.split('\n');
    const w = 80, lh = 3;
    const h = Math.max(lines.length * lh, this.canvas.parentElement ? this.canvas.parentElement.offsetHeight : 200);
    this.canvas.height = h;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#1e1e1e';
    ctx.fillRect(0, 0, w, h);
    lines.forEach((line, i) => {
      if (!line.trim()) return;
      let x = 2;
      const y = i * lh;
      const tokens = line.split(/(\s+)/);
      tokens.forEach(tok => {
        if (!tok.trim()) { x += tok.length * 1.2; return; }
        if (/\b(fn|function|def|class|let|const|var|if|for|while|return)\b/.test(tok)) ctx.fillStyle = '#569cd6';
        else if (/^["'`]/.test(tok)) ctx.fillStyle = '#ce9178';
        else if (/^\d/.test(tok)) ctx.fillStyle = '#b5cea8';
        else if (/^\/\/|^#/.test(tok)) ctx.fillStyle = '#6a9955';
        else ctx.fillStyle = 'rgba(255,255,255,.4)';
        const tw = Math.min(tok.length * 1.2, w - x - 2);
        if (tw > 0) ctx.fillRect(x, y, tw, lh - 0.5);
        x += tok.length * 1.2;
      });
    });
    this._renderViewport();
  }
  _renderViewport() {
    const se = this.scrollEl;
    if (!se) return;
    const ratio = this.canvas.height / Math.max(se.scrollHeight, 1);
    const vTop = se.scrollTop * ratio;
    const vH = se.clientHeight * ratio;
    this.ctx.fillStyle = 'rgba(255,255,255,.1)';
    this.ctx.fillRect(0, vTop, this.canvas.width, vH);
  }
  onScroll() { this._renderViewport(); }
}

// ---- MAIN IDE CLASS ----
class LalaIDE {
  constructor() {
    this.vfs = new VFS();
    this.fb = new MongoDBService();
    this.tabs = [];
    this.activeTab = null;
    this.dialect = 'english';
    this.sidebarPanel = 'explorer';
    this.sidebarOpen = true;
    this.panelOpen = true;
    this.minimapEnabled = true;
    this.fontSize = 13;
    this.zoom = 1;
    this.findMatches = [];
    this.findIdx = 0;
    this.ctxTarget = null;
    this.cmdHistory = [];
    this.histIdx = -1;
    this.pyRunner = new PyRunner();
    this.jsRunner = new JSRunner();
    this.lalaInterp = null;
    this.isItems = [];
    this.isIdx = 0;
    this.isOpen = false;
    this.mm = null;
    this.projectId = 'default';
    this.user = null;
    this._q = id => document.getElementById(id);
    this._initFirebase();
    this._initEvents();
    this._initSnippets();
    this._renderFileTree();
    this._renderWelcomeRecent();
    if (this.vfs.size() === 0) this._showWelcome();
    this._termLine('system', 'LALA IDE v2.0 ready. Type "help" for commands.');
    this._termLine('system', this.vfs.size() + ' file(s) in workspace.');
  }

  _initFirebase() {
    // Restore JWT session from localStorage
    this.fb.restoreSession().then(user => {
      if (user) { this.user = user; this._updateAuthUI(user); this._loadCloudProjects(); }
      else this._updateAuthUI(null);
    }).catch(() => this._updateAuthUI(null));
  }

  _updateAuthUI(u) {
    const out = this._q('tb-auth-out');
    const inn = this._q('tb-auth-in');
    const wlBtn = this._q('wl-signin-btn');
    if (u) {
      if (out) out.style.display = 'none';
      if (inn) inn.style.display = 'block';
      const initials = (u.name || u.email || '?').charAt(0).toUpperCase();
      const av = this._q('tb-avatar'); if (av) av.textContent = initials;
      const un = this._q('tb-username'); if (un) un.textContent = u.name || u.email.split('@')[0];
      const nm = this._q('tbud-name'); if (nm) nm.textContent = u.name || 'User';
      const em = this._q('tbud-email'); if (em) em.textContent = u.email;
      if (wlBtn) wlBtn.textContent = 'Open Cloud Projects';
      const st = this._q('sync-text'); if (st) st.textContent = 'Signed in';
      showToast('Welcome, ' + (u.name || u.email) + '!', 'success');
    } else {
      if (out) out.style.display = 'block';
      if (inn) inn.style.display = 'none';
      if (wlBtn) wlBtn.textContent = 'Sign In / Create Account';
      const st = this._q('sync-text'); if (st) st.textContent = 'Not synced';
      const wlCloud = this._q('wlc-cloud');
      if (wlCloud) wlCloud.innerHTML = '<div class="wlc-empty">Sign in to load cloud projects</div>';
    }
  }

  async _loadCloudProjects() {
    if (!this.user) return;
    try {
      const projects = await this.fb.loadProjects();
      const cloud = this._q('wlc-cloud');
      if (!cloud) return;
      if (!projects.length) { cloud.innerHTML = '<div class="wlc-empty">No cloud projects yet</div>'; return; }
      cloud.innerHTML = projects.map(p =>
        '<div class="cloud-item" data-id="' + p._id + '">' +
        '<div class="ci-name">📁 ' + (p.name || p._id) + '</div>' +
        '<div class="ci-date">' + (p.fileCount || 0) + ' files · ' + new Date(p.updatedAt || 0).toLocaleDateString() + '</div>' +
        '</div>'
      ).join('');
      cloud.querySelectorAll('.cloud-item').forEach(el => {
        el.addEventListener('click', async () => {
          try {
            const proj = await this.fb.loadProject(el.dataset.id);
            if (proj && proj.files) {
              this.vfs.fromJSON(proj.files);
              this.projectId = proj._id;
              this._renderFileTree();
              this._renderWelcomeRecent();
              showToast('Loaded: ' + (proj.name || proj._id), 'success');
            }
          } catch(e) { showToast('Failed to load project: ' + e.message, 'error'); }
        });
      });
    } catch(e) { console.warn('Load cloud projects failed:', e.message); }
  }

  async _syncToCloud() {
    if (!this.user) { showToast('Sign in to sync', 'warn'); return; }
    this._saveCurrentContent();
    try {
      const projName = (this._q('sb-proj-name') || {textContent:'My Project'}).textContent;
      const data = { name: projName, files: this.vfs.toJSON() };
      const result = await this.fb.saveProject(this.projectId, data);
      // After first save, store the returned _id
      if (result && result.project && result.project._id && this.projectId === 'default') {
        this.projectId = result.project._id;
      }
      const st = this._q('sync-text'); if (st) st.textContent = 'Synced ✓';
      showToast('Project synced!', 'success');
    } catch(e) { showToast('Sync failed: ' + e.message, 'error'); }
  }

  _initEvents() {
    // Activity bar
    document.querySelectorAll('.ab-btn[data-panel]').forEach(btn => {
      btn.addEventListener('click', () => {
        const p = btn.dataset.panel;
        if (this.sidebarPanel === p && this.sidebarOpen) { this._toggleSidebar(); return; }
        this.sidebarPanel = p;
        this._showSidebarPanel(p);
        document.querySelectorAll('.ab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const sb = this._q('ide-sidebar');
        if (sb) { sb.classList.remove('collapsed'); this.sidebarOpen = true; }
      });
    });

    this._q('ab-account')?.addEventListener('click', () => this._openAuthModal());
    this._q('tb-run-btn')?.addEventListener('click', () => this._runFile());
    this._q('tb-signin-btn')?.addEventListener('click', () => this._openAuthModal());

    // Auth
    this._q('auth-close')?.addEventListener('click', () => this._closeAuthModal());
    this._q('auth-overlay')?.addEventListener('click', e => { if (e.target === this._q('auth-overlay')) this._closeAuthModal(); });
    this._q('atab-in')?.addEventListener('click', () => this._switchAuthTab('in'));
    this._q('atab-up')?.addEventListener('click', () => this._switchAuthTab('up'));
    this._q('sw-to-up')?.addEventListener('click', () => this._switchAuthTab('up'));
    this._q('sw-to-in')?.addEventListener('click', () => this._switchAuthTab('in'));
    this._q('btn-si')?.addEventListener('click', () => this._doSignIn());
    this._q('btn-su')?.addEventListener('click', () => this._doSignUp());
    this._q('btn-google-si')?.addEventListener('click', () => this._doGoogleSignIn());
    this._q('btn-google-su')?.addEventListener('click', () => this._doGoogleSignIn());
    this._q('m-signout')?.addEventListener('click', () => this._doSignOut());
    this._q('m-my-projects')?.addEventListener('click', () => this._openProjectsModal());
    this._q('m-sync-now')?.addEventListener('click', () => this._syncToCloud());
    this._q('su-pw')?.addEventListener('input', e => this._checkPwStrength(e.target.value));
    this._setupEye('si-eye','si-pw');
    this._setupEye('su-eye','su-pw');

    // Welcome
    this._q('wl-new-lala')?.addEventListener('click', () => this._quickCreate('lala','main.lala'));
    this._q('wl-new-js')?.addEventListener('click', () => this._quickCreate('javascript','script.js'));
    this._q('wl-new-py')?.addEventListener('click', () => this._quickCreate('python','main.py'));
    this._q('wl-new-html')?.addEventListener('click', () => this._quickCreate('html','index.html'));
    this._q('wl-open')?.addEventListener('click', () => this._q('open-file-input')?.click());
    this._q('wl-extract-zip')?.addEventListener('click', () => this._q('zip-extract-input')?.click());
    this._q('wl-signin-btn')?.addEventListener('click', () => this.user ? this._openProjectsModal() : this._openAuthModal());

    // File inputs
    this._q('open-file-input')?.addEventListener('change', e => this._handleUpload(e.target.files));
    this._q('zip-extract-input')?.addEventListener('change', e => { if (e.target.files[0]) this._extractZip(e.target.files[0]); });

    // Sidebar
    this._q('sb-new-file')?.addEventListener('click', () => this._openNewFileModal());
    this._q('sb-add-file-btn')?.addEventListener('click', () => this._openNewFileModal());
    this._q('sb-collapse-all')?.addEventListener('click', () => this._toggleSidebar());
    this._q('sb-search-input')?.addEventListener('input', () => this._doSidebarSearch());

    // New file modal
    this._q('nf-cancel')?.addEventListener('click', () => this._closeNFModal());
    this._q('nf-create')?.addEventListener('click', () => this._createFromModal());
    this._q('nf-overlay')?.addEventListener('click', e => { if (e.target === this._q('nf-overlay')) this._closeNFModal(); });
    this._q('nf-name')?.addEventListener('keydown', e => { if (e.key === 'Enter') this._createFromModal(); });
    this._q('nf-name')?.addEventListener('input', () => {
      const n = this._q('nf-name').value;
      if (n.includes('.')) { const l = extToLang(n); const s = this._q('nf-lang'); if (s) s.value = l; }
    });

    // Textarea
    const ta = this._q('ide-textarea');
    if (ta) {
      ta.addEventListener('input', () => this._onInput());
      ta.addEventListener('keydown', e => this._onKeydown(e));
      ta.addEventListener('scroll', () => this._onScroll());
      ta.addEventListener('click', () => this._updateStatus());
      ta.addEventListener('keyup', () => this._updateStatus());
    }

    // Context menu
    document.addEventListener('click', e => { if (!e.target.closest('.ctx-menu')) this._closeCtx(); });
    this._q('ctx-open')?.addEventListener('click', () => { if (this.ctxTarget) this._openFile(this.ctxTarget); this._closeCtx(); });
    this._q('ctx-rename')?.addEventListener('click', () => { this._renameFile(this.ctxTarget); this._closeCtx(); });
    this._q('ctx-download')?.addEventListener('click', () => { this._downloadFile(this.ctxTarget); this._closeCtx(); });
    this._q('ctx-delete')?.addEventListener('click', () => { this._deleteFile(this.ctxTarget); this._closeCtx(); });

    // Panel tabs
    document.querySelectorAll('.ptab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.ptab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.pbody').forEach(b => b.classList.remove('active'));
        tab.classList.add('active');
        const p = this._q('pbody-' + tab.dataset.ptab); if (p) p.classList.add('active');
      });
    });

    this._q('ph-clear')?.addEventListener('click', () => this._clearOutput());
    this._q('ph-toggle')?.addEventListener('click', () => this._togglePanel());

    // Find bar
    this._q('fb-find')?.addEventListener('input', () => this._doFind());
    this._q('fb-find')?.addEventListener('keydown', e => {
      if (e.key === 'Enter') e.shiftKey ? this._findPrev() : this._findNext();
      if (e.key === 'Escape') this._closeFind();
    });
    this._q('fb-next')?.addEventListener('click', () => this._findNext());
    this._q('fb-prev')?.addEventListener('click', () => this._findPrev());
    this._q('fb-close')?.addEventListener('click', () => this._closeFind());
    this._q('fb-rep-one')?.addEventListener('click', () => this._replaceOne());
    this._q('fb-rep-all')?.addEventListener('click', () => this._replaceAll());
    ['fb-case','fb-word','fb-regex'].forEach(id => {
      this._q(id)?.addEventListener('click', () => {
        const b = this._q(id);
        b.dataset.active = b.dataset.active === 'true' ? 'false' : 'true';
        this._doFind();
      });
    });

    // Web preview
    this._q('wv-run')?.addEventListener('click', () => this._activateWebPreview());
    this._q('wv-reload')?.addEventListener('click', () => { const f = this._q('web-frame'); if (f) f.src = f.src; });
    this._q('wv-popout')?.addEventListener('click', () => this._popoutWebPreview());

    // Terminal
    this._q('term-input')?.addEventListener('keydown', e => this._onTermKey(e));

    // Resize handles
    this._initPanelResize();
    this._initSidebarResize();

    // Menu items
    this._q('m-new-file')?.addEventListener('click', () => this._openNewFileModal());
    this._q('m-open-file')?.addEventListener('click', () => this._q('open-file-input')?.click());
    this._q('m-save')?.addEventListener('click', () => this._save());
    this._q('m-save-all')?.addEventListener('click', () => this._saveAll());
    this._q('m-download-file')?.addEventListener('click', () => this._downloadFile(this.activeTab));
    this._q('m-download-zip')?.addEventListener('click', () => this._downloadAllZip());
    this._q('m-extract-zip')?.addEventListener('click', () => this._q('zip-extract-input')?.click());
    this._q('m-sync-cloud')?.addEventListener('click', () => this._syncToCloud());
    this._q('m-find')?.addEventListener('click', () => this._openFind());
    this._q('m-toggle-comment')?.addEventListener('click', () => this._toggleComment());
    this._q('m-format-doc')?.addEventListener('click', () => this._formatDoc());
    this._q('m-toggle-sidebar')?.addEventListener('click', () => this._toggleSidebar());
    this._q('m-toggle-panel')?.addEventListener('click', () => this._togglePanel());
    this._q('m-toggle-minimap')?.addEventListener('click', () => this._toggleMinimap());
    this._q('m-zoom-in')?.addEventListener('click', () => this._setZoom(this.zoom + 0.1));
    this._q('m-zoom-out')?.addEventListener('click', () => this._setZoom(this.zoom - 0.1));
    this._q('m-run-code')?.addEventListener('click', () => this._runFile());
    this._q('m-run-web')?.addEventListener('click', () => this._activateWebPreview());
    this._q('m-clear-output')?.addEventListener('click', () => this._clearOutput());

    // Dialect
    document.querySelectorAll('.tdd-item[data-dialect]').forEach(item => {
      item.addEventListener('click', e => {
        e.stopPropagation();
        this.dialect = item.dataset.dialect;
        const labels = {english:'🌍 English', yoruba:'🇳🇬 Yoruba', hausa:'🇳🇬 Hausa', igbo:'🇳🇬 Igbo'};
        const lbl = this._q('tb-dialect-label'); if (lbl) lbl.textContent = labels[this.dialect];
        showToast('Dialect: ' + this.dialect, 'success', 1500);
      });
    });

    this._q('pm-close')?.addEventListener('click', () => this._q('projects-overlay')?.classList.remove('open'));

    // Global shortcuts
    document.addEventListener('keydown', e => {
      const mod = e.ctrlKey || e.metaKey;
      if (mod && e.key === 'Enter') { e.preventDefault(); this._runFile(); }
      if (mod && e.key === 'f') { e.preventDefault(); this._openFind(); }
      if (mod && e.key === 's') { e.preventDefault(); this._save(); }
      if (mod && e.key === 'n') { e.preventDefault(); this._openNewFileModal(); }
      if (mod && e.key === 'b') { e.preventDefault(); this._toggleSidebar(); }
      if (mod && e.key === 'j') { e.preventDefault(); this._togglePanel(); }
      if (mod && e.key === '/') { e.preventDefault(); this._toggleComment(); }
      if (e.key === 'Escape') {
        this._closeFind(); this._closeCtx(); this._closeAuthModal(); this._closeNFModal(); this._closeIS();
      }
    });
  }

  _setupEye(eyeId, inputId) {
    const eye = this._q(eyeId); const inp = this._q(inputId);
    if (eye && inp) eye.addEventListener('click', () => { inp.type = inp.type === 'password' ? 'text' : 'password'; });
  }

  _checkPwStrength(pw) {
    const fill = this._q('pw-fill'); const label = this._q('pw-label'); if (!fill || !label) return;
    let s = 0;
    if (pw.length >= 6) s++;
    if (pw.length >= 10) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^a-zA-Z0-9]/.test(pw)) s++;
    const colors = ['#f44747','#f44747','#ce9178','#16825d','#16825d'];
    const labels = ['Too short','Weak','Fair','Good','Strong'];
    fill.style.width = Math.min(s * 20, 100) + '%';
    fill.style.background = colors[s - 1] || '#f44747';
    label.textContent = pw ? (labels[s - 1] || 'Weak') : '';
    label.style.color = colors[s - 1] || '#f44747';
  }

  // AUTH
  _openAuthModal() { const o = this._q('auth-overlay'); if (o) o.classList.add('open'); }
  _closeAuthModal() { const o = this._q('auth-overlay'); if (o) o.classList.remove('open'); }
  _switchAuthTab(t) {
    ['in','up'].forEach(k => {
      this._q('atab-' + k)?.classList.toggle('active', k === t);
      this._q('aform-' + k)?.classList.toggle('active', k === t);
    });
  }
  async _doSignIn() {
    const email = this._q('si-email')?.value;
    const pw = this._q('si-pw')?.value;
    const err = this._q('si-error'); if (err) err.textContent = '';
    if (!email || !pw) { if (err) err.textContent = 'Enter email and password'; return; }
    const btn = this._q('btn-si'); if (btn) { btn.textContent = 'Signing in…'; btn.disabled = true; }
    try {
      const user = await this.fb.login(email, pw);
      this.user = user;
      this._updateAuthUI(user);
      this._loadCloudProjects();
      this._closeAuthModal();
      showToast('Welcome back, ' + (user.name || user.email) + '!', 'success');
    } catch(e) {
      if (err) err.textContent = e.message;
    } finally {
      if (btn) { btn.textContent = 'Sign In'; btn.disabled = false; }
    }
  }
  async _doSignUp() {
    const name = this._q('su-name')?.value;
    const email = this._q('su-email')?.value;
    const pw = this._q('su-pw')?.value;
    const err = this._q('su-error'); if (err) err.textContent = '';
    if (!name || !email || !pw) { if (err) err.textContent = 'Fill all fields'; return; }
    if (pw.length < 6) { if (err) err.textContent = 'Password min 6 chars'; return; }
    const btn = this._q('btn-su'); if (btn) { btn.textContent = 'Creating…'; btn.disabled = true; }
    try {
      const user = await this.fb.register(name, email, pw);
      this.user = user;
      this._updateAuthUI(user);
      this._closeAuthModal();
      showToast('Account created! Welcome, ' + user.name + '!', 'success');
    } catch(e) {
      if (err) err.textContent = e.message;
    } finally {
      if (btn) { btn.textContent = 'Create Account'; btn.disabled = false; }
    }
  }
  async _doGoogleSignIn() {
    showToast('Google sign-in not available — use email/password', 'warn', 3000);
  }
  async _doSignOut() {
    this.fb.logout();
    this.user = null;
    this._updateAuthUI(null);
    showToast('Signed out', 'info');
  }

  _openProjectsModal() { this._q('projects-overlay')?.classList.add('open'); this._loadProjectsList(); }
  async _loadProjectsList() {
    if (!this.user) { return; }
    const list = this._q('pm-list'); if (!list) return;
    list.innerHTML = '<div class="pm-empty">Loading...</div>';
    try {
      const projects = await this.fb.loadProjects();
      if (!projects.length) { list.innerHTML = '<div class="pm-empty">No cloud projects yet.</div>'; return; }
      list.innerHTML = projects.map(p =>
        '<div class="pm-item"><div class="pm-item-icon">📁</div>' +
        '<div class="pm-item-info"><div class="pm-item-name">' + (p.name || p._id) + '</div>' +
        '<div class="pm-item-meta">' + (p.fileCount || 0) + ' files · ' + new Date(p.updatedAt || 0).toLocaleDateString() + '</div></div>' +
        '<div class="pm-item-actions"><button class="pm-act-btn primary" data-id="' + p._id + '">Load</button>' +
        '<button class="pm-act-btn del" data-id="' + p._id + '">Delete</button></div></div>'
      ).join('');
      list.querySelectorAll('.pm-act-btn.primary').forEach(btn => {
        btn.addEventListener('click', async () => {
          try {
            const proj = await this.fb.loadProject(btn.dataset.id);
            if (proj && proj.files) {
              this.vfs.fromJSON(proj.files);
              this.projectId = proj._id;
              this._renderFileTree(); this._renderWelcomeRecent();
              showToast('Loaded: ' + (proj.name || proj._id), 'success');
              this._q('projects-overlay')?.classList.remove('open');
            }
          } catch(e) { showToast('Load failed: ' + e.message, 'error'); }
        });
      });
      list.querySelectorAll('.pm-act-btn.del').forEach(btn => {
        btn.addEventListener('click', async () => {
          if (!confirm('Delete this project from cloud?')) return;
          try {
            await this.fb.deleteProject(btn.dataset.id);
            showToast('Project deleted', 'info');
            this._loadProjectsList();
          } catch(e) { showToast('Delete failed: ' + e.message, 'error'); }
        });
      });
    } catch(e) { list.innerHTML = '<div class="pm-empty">Error: ' + e.message + '</div>'; }
  }

  // SIDEBAR
  _toggleSidebar() {
    const sb = this._q('ide-sidebar'); if (!sb) return;
    this.sidebarOpen = !this.sidebarOpen;
    sb.classList.toggle('collapsed', !this.sidebarOpen);
  }
  _showSidebarPanel(name) {
    document.querySelectorAll('.sb-panel').forEach(p => p.classList.remove('active'));
    this._q('sb-panel-' + name)?.classList.add('active');
  }

  // FILE TREE
  _renderFileTree() {
    const tree = this._q('sb-file-tree'); if (!tree) return;
    const files = this.vfs.list();
    tree.innerHTML = '';
    if (!files.length) { tree.innerHTML = '<div class="tree-empty">No files. Create one!</div>'; return; }
    files.forEach(f => {
      const item = document.createElement('div');
      item.className = 'tree-item' + (this.activeTab === f.name ? ' active' : '');
      item.dataset.name = f.name;
      item.innerHTML =
        '<span class="ti-icon">' + li(f.lang) + '</span>' +
        '<span class="ti-name" title="' + f.name + '">' + f.name + '</span>' +
        '<div class="ti-acts">' +
        '<button class="ti-act-btn" data-act="dl" title="Download">&#x2193;</button>' +
        '<button class="ti-act-btn" data-act="rm" title="Delete">&#x2715;</button>' +
        '</div>';
      item.addEventListener('click', e => { if (!e.target.closest('.ti-acts')) this._openFile(f.name); });
      item.addEventListener('contextmenu', e => { e.preventDefault(); this.ctxTarget = f.name; this._showCtx(e.clientX, e.clientY); });
      item.querySelectorAll('.ti-act-btn').forEach(btn => {
        btn.addEventListener('click', e => {
          e.stopPropagation();
          if (btn.dataset.act === 'dl') this._downloadFile(f.name);
          if (btn.dataset.act === 'rm') this._deleteFile(f.name);
        });
      });
      tree.appendChild(item);
    });
  }

  // TABS
  _renderTabs() {
    const tabs = this._q('ide-tabs'); if (!tabs) return;
    tabs.innerHTML = '';
    this.tabs.forEach(t => {
      const f = this.vfs.get(t.name);
      const lang = f ? f.lang : extToLang(t.name);
      const el = document.createElement('div');
      el.className = 'ide-tab' + (t.name === this.activeTab ? ' active' : '') + (t.unsaved ? ' unsaved' : '');
      el.dataset.name = t.name;
      el.innerHTML =
        '<span class="tab-icon">' + li(lang) + '</span>' +
        '<span class="tab-name" title="' + t.name + '">' + t.name + '</span>' +
        '<button class="tab-close" title="Close">&#x2715;</button>';
      el.addEventListener('click', e => {
        if (!e.target.closest('.tab-close')) { this._saveCurrentContent(); this._switchTab(t.name); }
      });
      el.querySelector('.tab-close').addEventListener('click', e => { e.stopPropagation(); this._closeTab(t.name); });
      tabs.appendChild(el);
    });
  }

  _openFile(name) {
    const f = this.vfs.get(name); if (!f) return;
    if (!this.tabs.find(t => t.name === name)) this.tabs.push({name, unsaved: false});
    this.activeTab = name;
    this._renderTabs(); this._renderFileTree(); this._showEditor(name);
  }
  _switchTab(name) { this.activeTab = name; this._renderTabs(); this._renderFileTree(); this._showEditor(name); }
  _closeTab(name) {
    this._saveCurrentContent();
    const idx = this.tabs.findIndex(t => t.name === name); if (idx < 0) return;
    this.tabs.splice(idx, 1);
    if (this.activeTab === name) {
      if (this.tabs.length) { this.activeTab = this.tabs[Math.max(0, idx - 1)].name; this._showEditor(this.activeTab); }
      else { this.activeTab = null; this._showWelcome(); }
    }
    this._renderTabs(); this._renderFileTree();
  }

  _showEditor(name) {
    const f = this.vfs.get(name); if (!f) return;
    const wlc = this._q('ide-welcome'); if (wlc) wlc.style.display = 'none';
    const wrap = this._q('ide-editor-wrap'); if (wrap) wrap.style.display = 'flex';
    const ta = this._q('ide-textarea'); ta.value = f.content;
    this._updateHL(f.content, f.lang);
    this._updateGutter(f.content);
    this._updateBreadcrumb(name, f.lang);
    this._updateStatusLang(f.lang);
    const pill = this._q('tb-dialect-pill'); if (pill) pill.style.display = f.lang === 'lala' ? 'flex' : 'none';
    const tcFile = this._q('tc-file'); if (tcFile) tcFile.textContent = name;
    ta.focus();
    this._initMinimap();
    this._renderMinimap(f.content, f.lang);
    this._isSetupFor(f.lang);
    this._updateStatus();
  }

  _showWelcome() {
    const wrap = this._q('ide-editor-wrap'); if (wrap) wrap.style.display = 'none';
    const wlc = this._q('ide-welcome'); if (wlc) wlc.style.display = 'flex';
    const tcFile = this._q('tc-file'); if (tcFile) tcFile.textContent = 'Welcome';
    this._renderWelcomeRecent();
  }

  _renderWelcomeRecent() {
    const list = this._q('wlc-recent'); if (!list) return;
    const files = this.vfs.list().slice(0, 6);
    if (!files.length) { list.innerHTML = '<div class="wlc-empty">No recent files</div>'; return; }
    list.innerHTML = files.map(f =>
      '<div class="recent-item" data-name="' + f.name + '">' + li(f.lang) + ' ' + f.name + '</div>'
    ).join('');
    list.querySelectorAll('.recent-item').forEach(el => el.addEventListener('click', () => this._openFile(el.dataset.name)));
  }

  // EDITOR
  _onInput() {
    const ta = this._q('ide-textarea'); const code = ta.value;
    const f = this.vfs.get(this.activeTab); if (!f) return;
    this._updateHL(code, f.lang);
    this._updateGutter(code);
    this._updateStatus();
    const tab = this.tabs.find(t => t.name === this.activeTab);
    if (tab && !tab.unsaved) { tab.unsaved = true; this._renderTabs(); }
    this._renderMinimap(code, f.lang);
    this._showIS(ta, code, f.lang);
  }

  _onKeydown(e) {
    const ta = this._q('ide-textarea');
    if (this.isOpen) {
      if (e.key === 'ArrowDown') { e.preventDefault(); this._isMove(1); return; }
      if (e.key === 'ArrowUp') { e.preventDefault(); this._isMove(-1); return; }
      if (e.key === 'Enter' || e.key === 'Tab') { e.preventDefault(); this._isAccept(); return; }
      if (e.key === 'Escape') { this._closeIS(); return; }
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      const s = ta.selectionStart, en = ta.selectionEnd;
      if (e.shiftKey) {
        const before = ta.value.slice(0, s);
        const lines = before.split('\n');
        const last = lines[lines.length - 1];
        if (last.startsWith('  ')) { ta.value = ta.value.slice(0, s - 2) + ta.value.slice(s); ta.selectionStart = ta.selectionEnd = Math.max(0, s - 2); }
      } else {
        ta.value = ta.value.slice(0, s) + '  ' + ta.value.slice(en);
        ta.selectionStart = ta.selectionEnd = s + 2;
      }
      this._onInput(); return;
    }
    if (e.key === 'Enter') {
      const s = ta.selectionStart;
      const before = ta.value.slice(0, s);
      const lastLine = before.split('\n').pop();
      const indent = lastLine.match(/^(\s*)/)[1];
      const extra = (lastLine.trimEnd().endsWith('{') || lastLine.trimEnd().endsWith(':')) ? '  ' : '';
      if (indent || extra) {
        e.preventDefault();
        const ins = '\n' + indent + extra;
        ta.value = ta.value.slice(0, s) + ins + ta.value.slice(ta.selectionEnd);
        ta.selectionStart = ta.selectionEnd = s + ins.length;
        this._onInput(); return;
      }
    }
    const pairs = {'(':')', '[':']', '{':'}', '`':'`'};
    if (pairs[e.key] && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      const s = ta.selectionStart, en = ta.selectionEnd;
      const sel = ta.value.slice(s, en);
      ta.value = ta.value.slice(0, s) + e.key + sel + pairs[e.key] + ta.value.slice(en);
      ta.selectionStart = ta.selectionEnd = s + 1;
      this._onInput(); return;
    }
    if ((e.ctrlKey || e.metaKey) && e.key === '/') { e.preventDefault(); this._toggleComment(); }
  }

  _onScroll() {
    const ta = this._q('ide-textarea');
    const hl = this._q('ide-highlight'); if (hl) hl.style.transform = 'translate(-' + ta.scrollLeft + 'px,-' + ta.scrollTop + 'px)';
    const gut = this._q('ide-gutter'); if (gut) gut.scrollTop = ta.scrollTop;
    if (this.mm) this.mm.onScroll();
  }

  _updateHL(code, lang) { const hl = this._q('ide-highlight'); if (hl) hl.innerHTML = HL.highlight(code + '\n', lang); }
  _updateGutter(code) {
    const gut = this._q('ide-gutter'); if (!gut) return;
    const n = code.split('\n').length;
    gut.innerHTML = Array.from({length: n}, (_, i) => '<div class="gutter-line">' + (i + 1) + '</div>').join('');
  }
  _updateBreadcrumb(name, lang) {
    const f = this._q('bc-file'); if (f) f.textContent = name;
    const l = this._q('bc-lang'); if (l) l.textContent = ll(lang);
  }
  _updateStatusLang(lang) {
    if (!lang) { const f = this.vfs.get(this.activeTab); lang = f ? f.lang : 'text'; }
    const sbl = this._q('sbi-lang'); if (sbl) sbl.textContent = ll(lang);
  }
  _updateStatus() {
    const ta = this._q('ide-textarea'); if (!ta) return;
    const text = ta.value.slice(0, ta.selectionStart);
    const lines = text.split('\n');
    const ln = lines.length, col = lines[lines.length - 1].length + 1;
    const cur = this._q('sbi-cursor'); if (cur) cur.textContent = 'Ln ' + ln + ', Col ' + col;
    const selLen = ta.selectionEnd - ta.selectionStart;
    const sel = this._q('sbi-sel'); if (sel) sel.textContent = selLen > 0 ? '(' + selLen + ' selected)' : '';
  }

  _saveCurrentContent() {
    if (!this.activeTab) return;
    const ta = this._q('ide-textarea'); if (!ta) return;
    this.vfs.update(this.activeTab, ta.value);
    const tab = this.tabs.find(t => t.name === this.activeTab);
    if (tab) { tab.unsaved = false; this._renderTabs(); }
  }
  _save() { this._saveCurrentContent(); showToast('Saved', 'success', 1500); }
  _saveAll() { this._saveCurrentContent(); showToast('All saved', 'success', 1500); }

  _formatDoc() {
    const ta = this._q('ide-textarea'); const f = this.vfs.get(this.activeTab);
    if (!ta || !f) return;
    let code = ta.value;
    if (f.lang === 'json') { try { code = JSON.stringify(JSON.parse(code), null, 2); } catch(e) { showToast('Invalid JSON', 'error'); return; } }
    ta.value = code; this._onInput(); showToast('Formatted', 'success', 1500);
  }

  _toggleComment() {
    const ta = this._q('ide-textarea'); const f = this.vfs.get(this.activeTab);
    if (!ta || !f) return;
    const s = ta.selectionStart, e = ta.selectionEnd, code = ta.value;
    const comment = f.lang === 'python' ? '#' : '//';
    const lines = code.split('\n');
    const startLine = code.slice(0, s).split('\n').length - 1;
    const endLine = code.slice(0, e).split('\n').length - 1;
    const allCommented = lines.slice(startLine, endLine + 1).every(l => l.trimStart().startsWith(comment));
    const newLines = lines.map((l, i) => {
      if (i < startLine || i > endLine) return l;
      return allCommented
        ? l.replace(new RegExp('^(\\s*)' + comment.replace(/\//g, '\\/') + '\\s?'), '$1')
        : l.replace(/^(\s*)/, '$1' + comment + ' ');
    });
    ta.value = newLines.join('\n'); ta.selectionStart = s; ta.selectionEnd = e; this._onInput();
  }

  // INTELLISENSE
  _isSetupFor(lang) { this.isItems = IS_DATA[lang] || []; }
  _showIS(ta, code, lang) {
    const is = this._q('ide-intellisense'); if (!is) return;
    const s = ta.selectionStart;
    const before = code.slice(0, s);
    const word = (before.match(/[\w.]+$/) || [''])[0];
    if (word.length < 1) { this._closeIS(); return; }
    const items = (IS_DATA[lang] || []).filter(i => i.label.toLowerCase().startsWith(word.toLowerCase()) && i.label !== word).slice(0, 10);
    if (!items.length) { this._closeIS(); return; }
    this.isItems = items; this.isIdx = 0;
    is.innerHTML = items.map((it, i) =>
      '<div class="is-item' + (i === 0 ? ' active' : '') + '" data-idx="' + i + '">' +
      '<div class="is-kind ' + it.kind + '">' + it.kind.charAt(0).toUpperCase() + '</div>' +
      '<span class="is-label">' + it.label + '</span>' +
      '<span class="is-detail">' + (it.detail || '') + '</span>' +
      '</div>'
    ).join('');
    is.querySelectorAll('.is-item').forEach(el => {
      el.addEventListener('mousedown', e => { e.preventDefault(); this.isIdx = +el.dataset.idx; this._isAccept(); });
      el.addEventListener('mouseover', () => {
        is.querySelectorAll('.is-item').forEach(x => x.classList.remove('active'));
        el.classList.add('active'); this.isIdx = +el.dataset.idx;
      });
    });
    const coords = this._getCaretCoords(ta, s);
    is.style.left = (coords.left + 50) + 'px'; is.style.top = (coords.top + 20) + 'px';
    is.style.display = 'block'; this.isOpen = true;
  }
  _isMove(dir) {
    const is = this._q('ide-intellisense'); if (!is) return;
    this.isIdx = Math.max(0, Math.min(this.isItems.length - 1, this.isIdx + dir));
    is.querySelectorAll('.is-item').forEach((el, i) => el.classList.toggle('active', i === this.isIdx));
    is.querySelectorAll('.is-item')[this.isIdx]?.scrollIntoView({block:'nearest'});
  }
  _isAccept() {
    const ta = this._q('ide-textarea'); const item = this.isItems[this.isIdx];
    if (!item || !ta) return;
    const s = ta.selectionStart;
    const before = ta.value.slice(0, s);
    const wordMatch = before.match(/[\w.]+$/);
    const word = wordMatch ? wordMatch[0] : '';
    const rep = item.kind === 'snippet' && item.code ? item.code : item.label;
    ta.value = ta.value.slice(0, s - word.length) + rep + ta.value.slice(s);
    ta.selectionStart = ta.selectionEnd = s - word.length + rep.length;
    this._closeIS(); this._onInput();
  }
  _closeIS() { const is = this._q('ide-intellisense'); if (is) is.style.display = 'none'; this.isOpen = false; }
  _getCaretCoords(ta, pos) {
    const div = document.createElement('div');
    const style = getComputedStyle(ta);
    ['fontFamily','fontSize','fontWeight','lineHeight','padding','border','boxSizing','whiteSpace','wordWrap'].forEach(p => { div.style[p] = style[p]; });
    div.style.cssText += ';position:absolute;visibility:hidden;top:0;left:0;white-space:pre-wrap;word-break:break-word;';
    div.style.width = ta.offsetWidth + 'px';
    div.textContent = ta.value.slice(0, pos);
    const span = document.createElement('span'); span.textContent = '|'; div.appendChild(span);
    document.body.appendChild(div);
    const r = {left: span.offsetLeft, top: span.offsetTop};
    document.body.removeChild(div);
    return {left: r.left - ta.scrollLeft, top: r.top - ta.scrollTop};
  }

  // FIND
  _openFind() { const fb = this._q('ide-find-bar'); if (fb) { fb.classList.add('open'); this._q('fb-find')?.focus(); } }
  _closeFind() { this._q('ide-find-bar')?.classList.remove('open'); if (this._q('fb-count')) this._q('fb-count').textContent = '0/0'; }
  _doFind() {
    const q = this._q('fb-find')?.value; const ta = this._q('ide-textarea');
    if (!q || !ta) { if (this._q('fb-count')) this._q('fb-count').textContent = '0/0'; return; }
    const useCase = this._q('fb-case')?.dataset.active === 'true';
    const useWord = this._q('fb-word')?.dataset.active === 'true';
    const useRx = this._q('fb-regex')?.dataset.active === 'true';
    let pattern;
    try {
      if (useRx) { pattern = new RegExp(q, useCase ? 'g' : 'gi'); }
      else { const esc = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); pattern = new RegExp(useWord ? '\\b' + esc + '\\b' : esc, useCase ? 'g' : 'gi'); }
    } catch { if (this._q('fb-count')) this._q('fb-count').textContent = 'error'; return; }
    this.findMatches = []; let m; const code = ta.value;
    while ((m = pattern.exec(code)) !== null) this.findMatches.push(m.index);
    this.findIdx = 0; this._updateFindCount();
    if (this.findMatches.length) this._jumpTo(0);
  }
  _findNext() { if (!this.findMatches.length) return; this.findIdx = (this.findIdx + 1) % this.findMatches.length; this._jumpTo(this.findIdx); }
  _findPrev() { if (!this.findMatches.length) return; this.findIdx = (this.findIdx - 1 + this.findMatches.length) % this.findMatches.length; this._jumpTo(this.findIdx); }
  _jumpTo(i) {
    const ta = this._q('ide-textarea'); const pos = this.findMatches[i]; if (pos === undefined) return;
    const q = this._q('fb-find')?.value || '';
    ta.focus(); ta.setSelectionRange(pos, pos + q.length);
    this._updateFindCount(); this._updateStatus();
  }
  _updateFindCount() {
    const c = this._q('fb-count');
    if (c) c.textContent = this.findMatches.length ? (this.findIdx + 1) + '/' + this.findMatches.length : '0/0';
  }
  _replaceOne() {
    const ta = this._q('ide-textarea'); const q = this._q('fb-find')?.value; const rep = this._q('fb-replace')?.value || '';
    if (!ta || !q || !this.findMatches.length) return;
    const pos = this.findMatches[this.findIdx];
    ta.value = ta.value.slice(0, pos) + rep + ta.value.slice(pos + q.length);
    this._onInput(); this._doFind();
  }
  _replaceAll() {
    const ta = this._q('ide-textarea'); const q = this._q('fb-find')?.value; const rep = this._q('fb-replace')?.value || '';
    if (!ta || !q) return;
    const count = this.findMatches.length;
    ta.value = ta.value.split(q).join(rep);
    this._onInput(); this._doFind();
    showToast('Replaced ' + count + ' occurrences', 'success');
  }

  // MINIMAP
  _initMinimap() {
    const canvas = this._q('ide-minimap'); const scroll = this._q('ide-code-scroll');
    if (!canvas || !scroll) return;
    if (!this.mm) { this.mm = new Minimap(canvas, scroll); scroll.addEventListener('scroll', () => this.mm.onScroll()); }
    canvas.width = 80; canvas.style.display = this.minimapEnabled ? 'block' : 'none';
  }
  _renderMinimap(code, lang) { if (this.mm && this.minimapEnabled) this.mm.render(code, lang); }
  _toggleMinimap() {
    this.minimapEnabled = !this.minimapEnabled;
    const c = this._q('ide-minimap'); if (c) c.style.display = this.minimapEnabled ? 'block' : 'none';
    showToast('Minimap ' + (this.minimapEnabled ? 'on' : 'off'), 'info', 1500);
  }

  // ZOOM
  _setZoom(z) {
    this.zoom = Math.max(0.6, Math.min(2, z));
    const sz = Math.round(13 * this.zoom) + 'px';
    ['ide-textarea','ide-highlight','ide-gutter'].forEach(id => { const el = this._q(id); if (el) el.style.fontSize = sz; });
    showToast('Zoom: ' + Math.round(this.zoom * 100) + '%', 'info', 1200);
  }

  // RUN
  async _runFile() {
    if (!this.activeTab) return showToast('No file open', 'warn');
    this._saveCurrentContent(); const f = this.vfs.get(this.activeTab); if (!f) return;
    document.querySelectorAll('.ptab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.pbody').forEach(b => b.classList.remove('active'));
    this._q('ptab-output')?.classList.add('active'); this._q('pbody-output')?.classList.add('active');
    const out = this._q('run-output'); out.innerHTML = '';
    const btn = this._q('tb-run-btn');
    if (btn) { btn.innerHTML = '&#x23F8; Running'; btn.style.background = '#cc6633'; }
    this._addLine(out, '&#9654; Running ' + f.name + '...', 'info');
    await new Promise(r => setTimeout(r, 80));
    try {
      let results = [];
      if (f.lang === 'lala') {
        if (!this.lalaInterp && typeof LalaInterpreter !== 'undefined') this.lalaInterp = new LalaInterpreter();
        if (this.lalaInterp) {
          if (this.lalaInterp.setDialect) this.lalaInterp.setDialect(this.dialect);
          results = this.lalaInterp.run(f.content);
        } else this._addLine(out, 'LALA interpreter not loaded', 'error');
      } else if (f.lang === 'javascript') {
        results = this.jsRunner.run(f.content);
      } else if (f.lang === 'python') {
        results = this.pyRunner.run(f.content);
      } else if (f.lang === 'html') {
        this._activateWebPreview(); this._addLine(out, 'Launched in Web Preview', 'info');
      } else {
        this._addLine(out, 'No runner for ' + ll(f.lang), 'info');
      }
      if (results.length) results.forEach(r => (r.text || '').split('\n').forEach(l => this._addLine(out, l, r.type)));
      else if (f.lang !== 'html') this._addLine(out, '(No output)', 'info');
      const errs = results.filter(r => r.type === 'error').length;
      this._addLine(out, errs ? '&#10060; ' + errs + ' error(s)' : '&#9989; Done', errs ? 'error' : 'success');
    } catch(e) { this._addLine(out, '&#10060; ' + e.message, 'error'); }
    finally { if (btn) { btn.innerHTML = '&#9654; Run'; btn.style.background = ''; } }
  }

  _addLine(container, text, type) {
    const div = document.createElement('div');
    div.className = 'tl ' + (type || 'output');
    const prefix = {output:'>', error:'!', success:'\u2713', info:'~', system:'#'}[type] || '>';
    div.innerHTML = '<span class="tl-prefix">' + prefix + '</span><span class="tl-text">' + String(text).replace(/</g,'&lt;').replace(/>/g,'&gt;') + '</span>';
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
  }

  _clearOutput() {
    const t = this._q('term-out'); if (t) t.innerHTML = '';
    const o = this._q('run-output'); if (o) o.innerHTML = '';
  }

  // WEB PREVIEW
  _activateWebPreview() {
    document.querySelectorAll('.ptab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.pbody').forEach(b => b.classList.remove('active'));
    this._q('ptab-webview')?.classList.add('active'); this._q('pbody-webview')?.classList.add('active');
    this._runWebPreview();
  }
  _runWebPreview() {
    const f = this.activeTab ? this.vfs.get(this.activeTab) : null;
    let html = '';
    if (f && f.lang === 'html') { html = f.content; }
    else {
      const hf = this.vfs.list().find(x => x.lang === 'html');
      if (hf) {
        html = hf.content;
        this.vfs.list().filter(x => x.lang === 'css').forEach(c => { html = html.replace('</head>', '<style>' + c.content + '</style></head>'); });
        this.vfs.list().filter(x => x.lang === 'javascript').forEach(j => { html = html.replace('</body>', '<script>' + j.content + '</' + 'script></body>'); });
      } else {
        html = '<html><body style="font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;background:#1e1e1e;color:#d4d4d4"><div style="text-align:center"><h2>No HTML file</h2><p>Create an index.html file first.</p></div></body></html>';
      }
    }
    const frame = this._q('web-frame'); if (!frame) return;
    const blob = new Blob([html], {type:'text/html'});
    const url = URL.createObjectURL(blob);
    frame.src = url;
    const wvUrl = this._q('wv-url'); if (wvUrl) wvUrl.textContent = 'blob:preview';
  }
  _popoutWebPreview() {
    const f = this.activeTab ? this.vfs.get(this.activeTab) : null;
    const html = (f && f.lang === 'html') ? f.content : '<h1 style="font-family:sans-serif">No HTML file open</h1>';
    const w = window.open('about:blank', '_blank');
    if (w) { w.document.write(html); w.document.close(); }
  }

  // TERMINAL
  _termLine(type, text) { this._addLine(this._q('term-out'), text, type); }
  _onTermKey(e) {
    const inp = this._q('term-input');
    if (e.key === 'Enter') {
      const cmd = inp.value.trim(); if (!cmd) return;
      this.cmdHistory.unshift(cmd); this.histIdx = -1; inp.value = '';
      this._termLine('input', '$ ' + cmd); this._execCmd(cmd);
    }
    if (e.key === 'ArrowUp') { e.preventDefault(); if (this.histIdx < this.cmdHistory.length - 1) { this.histIdx++; inp.value = this.cmdHistory[this.histIdx]; } }
    if (e.key === 'ArrowDown') { e.preventDefault(); if (this.histIdx > 0) { this.histIdx--; inp.value = this.cmdHistory[this.histIdx]; } else { this.histIdx = -1; inp.value = ''; } }
  }
  _execCmd(cmd) {
    const parts = cmd.trim().split(/\s+/); const c = parts[0];
    const cmds = {
      help:  () => { ['help - show commands','ls - list files','new <name>','open <name>','rm <name>','run - run active file','download <name>','zip - download all as zip','sync - sync to cloud','clear','echo <text>','js <code>','py <code>','lala <code>'].forEach(h => this._termLine('info', '  ' + h)); },
      ls:    () => { this.vfs.list().forEach(f => this._termLine('output', '  ' + li(f.lang) + ' ' + f.name)); this._termLine('info', this.vfs.size() + ' files'); },
      clear: () => { const t = this._q('term-out'); if (t) t.innerHTML = ''; },
      echo:  () => this._termLine('output', parts.slice(1).join(' ')),
      run:   () => this._runFile(),
      zip:   () => this._downloadAllZip(),
      sync:  () => this._syncToCloud(),
    };
    if (cmds[c]) { cmds[c](); return; }
    if (c === 'new') { const n = parts[1]; if (!n) { this._termLine('error','Usage: new <filename>'); return; } this._createAndOpen(n, extToLang(n)); this._termLine('success','Created ' + n); return; }
    if (c === 'open') { const n = parts[1]; if (!this.vfs.has(n)) { this._termLine('error','Not found: ' + n); return; } this._openFile(n); this._termLine('success','Opened ' + n); return; }
    if (c === 'rm') { const n = parts[1]; if (!this.vfs.has(n)) { this._termLine('error','Not found: ' + n); return; } this._deleteFile(n); this._termLine('success','Deleted ' + n); return; }
    if (c === 'download') { this._downloadFile(parts[1] || this.activeTab); return; }
    if (c === 'js') { const code = parts.slice(1).join(' '); this.jsRunner.run(code).forEach(x => this._termLine(x.type, x.text)); return; }
    if (c === 'py') { const code = parts.slice(1).join(' '); this.pyRunner.run(code).forEach(x => this._termLine(x.type, x.text)); return; }
    if (c === 'lala') {
      const code = parts.slice(1).join(' ');
      if (!this.lalaInterp && typeof LalaInterpreter !== 'undefined') this.lalaInterp = new LalaInterpreter();
      if (this.lalaInterp) this.lalaInterp.run(code).forEach(x => this._termLine(x.type, x.text));
      return;
    }
    this._termLine('error', 'Unknown: ' + c + '. Type "help"');
  }

  // PANEL
  _togglePanel() {
    const p = this._q('ide-panel'); if (!p) return;
    this.panelOpen = !this.panelOpen;
    p.style.height = this.panelOpen ? (p._lastH || '210px') : '0';
  }
  _initPanelResize() {
    const handle = this._q('panel-resize-handle'); const panel = this._q('ide-panel');
    if (!handle || !panel) return;
    let sy, sh;
    handle.addEventListener('mousedown', e => {
      sy = e.clientY; sh = panel.offsetHeight;
      const mv = ev => { const h = Math.max(60, Math.min(600, sh + (sy - ev.clientY))); panel.style.height = h + 'px'; panel._lastH = h + 'px'; };
      const up = () => { document.removeEventListener('mousemove', mv); document.removeEventListener('mouseup', up); };
      document.addEventListener('mousemove', mv); document.addEventListener('mouseup', up);
    });
  }
  _initSidebarResize() {
    const handle = this._q('sb-resize'); const sb = this._q('ide-sidebar');
    if (!handle || !sb) return;
    let sx, sw;
    handle.addEventListener('mousedown', e => {
      sx = e.clientX; sw = sb.offsetWidth; handle.classList.add('dragging');
      const mv = ev => { const w = Math.max(150, Math.min(500, sw + (ev.clientX - sx))); sb.style.width = w + 'px'; };
      const up = () => { handle.classList.remove('dragging'); document.removeEventListener('mousemove', mv); document.removeEventListener('mouseup', up); };
      document.addEventListener('mousemove', mv); document.addEventListener('mouseup', up);
    });
  }

  // FILE OPS
  _quickCreate(lang, name) { this._createAndOpen(name, lang); }
  _createAndOpen(name, lang, content) {
    if (this.vfs.has(name)) { showToast(name + ' already exists', 'warn'); this._openFile(name); return; }
    this.vfs.create(name, lang, content);
    this._renderFileTree(); this._renderWelcomeRecent(); this._openFile(name);
    showToast('Created ' + name, 'success', 1500);
  }
  _deleteFile(name) {
    if (!confirm('Delete "' + name + '"?')) return;
    this.vfs.delete(name);
    const idx = this.tabs.findIndex(t => t.name === name); if (idx >= 0) this.tabs.splice(idx, 1);
    if (this.activeTab === name) {
      this.activeTab = this.tabs.length ? this.tabs[0].name : null;
      this.activeTab ? this._showEditor(this.activeTab) : this._showWelcome();
    }
    this._renderTabs(); this._renderFileTree(); showToast('Deleted ' + name, 'info', 1500);
  }
  _renameFile(name) {
    const nn = prompt('Rename to:', name); if (!nn || nn === name) return;
    this.vfs.rename(name, nn);
    const tab = this.tabs.find(t => t.name === name); if (tab) tab.name = nn;
    if (this.activeTab === name) { this.activeTab = nn; this._showEditor(nn); }
    this._renderTabs(); this._renderFileTree();
  }
  _downloadFile(name) {
    if (!name || !this.vfs.has(name)) return;
    const f = this.vfs.get(name);
    const blob = new Blob([f.content], {type:'text/plain;charset=utf-8'});
    if (typeof saveAs !== 'undefined') saveAs(blob, name);
    else { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; a.click(); }
    showToast('Downloading ' + name, 'success', 1500);
  }
  async _downloadAllZip() {
    const files = this.vfs.list(); if (!files.length) return showToast('No files', 'warn');
    this._saveCurrentContent();
    if (typeof JSZip === 'undefined') { files.forEach(f => this._downloadFile(f.name)); return; }
    const zip = new JSZip();
    files.forEach(f => zip.file(f.name, f.content));
    const blob = await zip.generateAsync({type:'blob', compression:'DEFLATE'});
    const name = 'lala-project.zip';
    if (typeof saveAs !== 'undefined') saveAs(blob, name);
    else { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; a.click(); }
    showToast('ZIP downloaded!', 'success');
  }
  async _extractZip(file) {
    if (!file || !file.name.endsWith('.zip')) return showToast('Select a .zip file', 'warn');
    if (typeof JSZip === 'undefined') return showToast('JSZip not loaded', 'error');
    try {
      const zip = await JSZip.loadAsync(file); let count = 0;
      const ps = [];
      zip.forEach((path, entry) => {
        if (!entry.dir) ps.push(entry.async('string').then(c => { const n = path.split('/').pop(); this.vfs.create(n, extToLang(n), c); count++; }));
      });
      await Promise.all(ps);
      this._renderFileTree(); this._renderWelcomeRecent();
      showToast('Extracted ' + count + ' files', 'success');
    } catch(e) { showToast('Extract failed: ' + e.message, 'error'); }
  }
  _handleUpload(files) {
    [...files].forEach(file => {
      if (file.name.endsWith('.zip')) { this._extractZip(file); return; }
      const r = new FileReader();
      r.onload = e => { const lang = extToLang(file.name); this.vfs.create(file.name, lang, e.target.result); this._renderFileTree(); this._renderWelcomeRecent(); this._openFile(file.name); showToast('Uploaded ' + file.name, 'success', 1500); };
      r.readAsText(file);
    });
  }

  // CONTEXT MENU
  _showCtx(x, y) { const m = this._q('ctx-menu'); if (!m) return; m.style.left = x + 'px'; m.style.top = y + 'px'; m.classList.add('open'); }
  _closeCtx() { this._q('ctx-menu')?.classList.remove('open'); }

  // NEW FILE MODAL
  _openNewFileModal() { const o = this._q('nf-overlay'); if (o) o.classList.add('open'); const n = this._q('nf-name'); if (n) { n.value = ''; setTimeout(() => n.focus(), 50); } }
  _closeNFModal() { this._q('nf-overlay')?.classList.remove('open'); }
  _createFromModal() {
    const name = this._q('nf-name')?.value.trim();
    if (!name) return showToast('Enter a file name', 'warn');
    const lang = this._q('nf-lang')?.value || 'lala';
    const fname = name.includes('.') ? name : name + le(lang);
    this._closeNFModal(); this._createAndOpen(fname, lang);
  }

  // SNIPPETS
  _initSnippets() {
    const langSel = this._q('sb-snip-lang');
    if (langSel) langSel.addEventListener('change', () => this._renderSnippets(langSel.value));
    this._renderSnippets('all');
  }
  _renderSnippets(filterLang) {
    const list = this._q('sb-snip-list'); if (!list) return;
    list.innerHTML = '';
    const all = Object.values(SNIPS).flat();
    const filtered = !filterLang || filterLang === 'all' ? all : all.filter(s => s.lang === filterLang);
    filtered.forEach(snip => {
      const el = document.createElement('div');
      el.className = 'snip-item';
      el.innerHTML = '<span class="si-icon">' + li(snip.lang) + '</span><span class="si-label">' + snip.label + '</span><span class="si-lang">' + snip.lang + '</span>';
      el.addEventListener('click', () => {
        if (!this.activeTab) return showToast('Open a file first', 'warn');
        const ta = this._q('ide-textarea');
        const s = ta.selectionStart;
        ta.value = ta.value.slice(0, s) + snip.code + ta.value.slice(ta.selectionEnd);
        ta.selectionStart = ta.selectionEnd = s + snip.code.length;
        this._onInput(); showToast('Snippet inserted!', 'success', 1000);
      });
      list.appendChild(el);
    });
  }

  // SIDEBAR SEARCH
  _doSidebarSearch() {
    const q = (this._q('sb-search-input')?.value || '').toLowerCase();
    const res = this._q('sb-search-results'); if (!res) return;
    res.innerHTML = ''; if (!q) return;
    let found = 0;
    this.vfs.list().forEach(f => {
      const lines = f.content.split('\n');
      lines.forEach((line, idx) => {
        if (line.toLowerCase().includes(q) && found < 30) {
          found++;
          const d = document.createElement('div');
          d.innerHTML = '<div class="sb-result-file">' + f.name + ':' + (idx + 1) + '</div><div class="sb-result-line">' + line.trim().slice(0, 60) + '</div>';
          d.addEventListener('click', () => this._openFile(f.name));
          res.appendChild(d);
        }
      });
    });
    if (!found) res.innerHTML = '<div style="padding:4px;color:var(--text-muted);font-size:12px">No results</div>';
  }
}

// ---- BOOT ----
document.addEventListener('DOMContentLoaded', () => { window.IDE = new LalaIDE(); });
