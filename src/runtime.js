// WAZOBIA Tree-Walk Interpreter and Runtime Engine
import { JSInterop, JSProxy, wrapJS, unwrapJS } from './js_interop.js';
import { PythonInterop, PyModuleProxy } from './python_interop.js';
import { Environment } from './environment.js';
import * as fs from 'fs';
import * as path from 'path';

export class ReturnValue {
  constructor(value) {
    this.value = value;
  }
}

export class LalaFunction {
  constructor(declaration, closure, isAsync = false) {
    this.declaration = declaration;
    this.closure = closure;
    this.isAsync = isAsync;
  }

  async call(interpreter, args) {
    const fnEnv = new Environment(this.closure);

    for (let i = 0; i < this.declaration.params.length; i++) {
      const paramName = this.declaration.params[i];
      const argVal = i < args.length ? args[i] : null;
      fnEnv.define(paramName, argVal);
    }

    try {
      await interpreter.executeBlock(this.declaration.body.statements, fnEnv);
    } catch (e) {
      if (e instanceof ReturnValue) {
        return e.value;
      }
      throw e;
    }

    return null;
  }
}

export class LalaClass {
  constructor(name, methods) {
    this.name = name;
    this.methods = methods;
  }

  async instantiate(interpreter, args) {
    const instance = new LalaInstance(this);
    if (this.methods['init']) {
      const initMethod = this.methods['init'].bind(instance);
      await initMethod.call(interpreter, args);
    }
    return instance;
  }
}

export class LalaInstance {
  constructor(klass) {
    this.klass = klass;
    this.fields = new Map();
  }

  get(name) {
    if (this.fields.has(name)) {
      return this.fields.get(name);
    }

    const method = this.klass.methods[name];
    if (method) {
      return method.bind(this);
    }

    return undefined;
  }

  set(name, value) {
    this.fields.set(name, value);
    return value;
  }
}

// Bind a method to a specific instance so 'this' works properly
LalaFunction.prototype.bind = function (instance) {
  const boundEnv = new Environment(this.closure);
  boundEnv.define('this', instance);
  return new LalaFunction(this.declaration, boundEnv, this.isAsync);
};

// Aliases for compatibility
export const WazobiaFunction = LalaFunction;
export const WazobiaClass = LalaClass;
export const WazobiaInstance = LalaInstance;

export class Interpreter {
  constructor(options = {}) {
    this.options = options;
    this.stdout = options.stdout || console.log;
    this.js = new JSInterop();
    this.py = new PythonInterop(options.pythonBin || 'python');
    this.globalEnv = new Environment();
    this.currentEnv = this.globalEnv;

    this.setupGlobals();
  }

  setupGlobals() {
    // Expose FFI objects
    this.globalEnv.define('js', this.js);
    this.globalEnv.define('py', this.py);

    // Standard Library Functions
    this.globalEnv.define('te', (...args) => this.stdout(...args));
    this.globalEnv.define('print', (...args) => this.stdout(...args));
    this.globalEnv.define('buga', (...args) => this.stdout(...args));
    this.globalEnv.define('dee', (...args) => this.stdout(...args));

    this.globalEnv.define('len', (val) => {
      if (val === null || val === undefined) return 0;
      if (typeof val === 'string' || Array.isArray(val)) return val.length;
      if (typeof val === 'object') return Object.keys(val).length;
      return 0;
    });

    this.globalEnv.define('type', (val) => {
      if (val === null) return 'null';
      if (Array.isArray(val)) return 'list';
      return typeof val;
    });

    this.globalEnv.define('range', (start, end, step = 1) => {
      const res = [];
      for (let i = start; i <= end; i += step) {
        res.push(i);
      }
      return res;
    });

    this.globalEnv.define('str', (val) => String(val));
    this.globalEnv.define('int', (val) => parseInt(val, 10));
    this.globalEnv.define('float', (val) => parseFloat(val));
  }

  isTruthy(val) {
    if (val === null || val === undefined) return false;
    if (typeof val === 'boolean') return val;
    if (typeof val === 'number') return val !== 0;
    if (typeof val === 'string') return val.length > 0;
    if (Array.isArray(val)) return val.length > 0;
    return true;
  }

  async executeBlock(statements, newEnv) {
    const previous = this.currentEnv;
    try {
      this.currentEnv = newEnv;
      for (const stmt of statements) {
        await this.evaluate(stmt);
      }
    } finally {
      this.currentEnv = previous;
    }
  }

  async evaluate(node) {
    if (!node) return null;

    switch (node.type) {
      case 'Program': {
        let lastResult = null;
        for (const stmt of node.body) {
          lastResult = await this.evaluate(stmt);
        }
        return lastResult;
      }

      case 'Block': {
        const blockEnv = new Environment(this.currentEnv);
        return await this.executeBlock(node.statements, blockEnv);
      }

      case 'VarDecl': {
        let value = null;
        if (node.initializer) {
          value = await this.evaluate(node.initializer);
        }
        return this.currentEnv.define(node.name, value, node.isConst);
      }

      case 'Assignment': {
        const value = await this.evaluate(node.value);
        if (node.target.type === 'Identifier') {
          const varName = node.target.name;
          if (node.operator === '=') {
            return this.currentEnv.assign(varName, value);
          }
          const current = this.currentEnv.get(varName);
          let newVal;
          if (node.operator === '+=') newVal = current + value;
          else if (node.operator === '-=') newVal = current - value;
          else if (node.operator === '*=') newVal = current * value;
          else if (node.operator === '/=') newVal = current / value;
          return this.currentEnv.assign(varName, newVal);
        }

        if (node.target.type === 'MemberExpr') {
          const obj = await this.evaluate(node.target.object);
          let prop = node.target.property;
          if (node.target.computed) {
            prop = await this.evaluate(prop);
          }

          let current;
          if (obj instanceof WazobiaInstance) current = obj.get(prop);
          else if (obj instanceof JSProxy) current = obj.get(prop);
          else current = obj ? obj[prop] : undefined;

          let finalVal = value;
          if (node.operator === '+=') finalVal = current + value;
          else if (node.operator === '-=') finalVal = current - value;
          else if (node.operator === '*=') finalVal = current * value;
          else if (node.operator === '/=') finalVal = current / value;

          if (obj instanceof WazobiaInstance) {
            return obj.set(prop, finalVal);
          } else if (obj instanceof JSProxy) {
            obj.set(prop, finalVal);
            return finalVal;
          } else if (typeof obj === 'object' && obj !== null) {
            obj[prop] = finalVal;
            return finalVal;
          }
          throw new Error(`Cannot assign property '${prop}' of non-object.`);
        }

        throw new Error('Invalid assignment target.');
      }

      case 'Literal':
        return node.value;

      case 'Identifier': {
        const name = node.name;
        if (name === 'js') return this.js;
        if (name === 'py') return this.py;
        return this.currentEnv.get(name);
      }

      case 'ListLiteral': {
        const elements = [];
        for (const el of node.elements) {
          elements.push(await this.evaluate(el));
        }
        return elements;
      }

      case 'ObjectLiteral': {
        const obj = {};
        for (const prop of node.properties) {
          obj[prop.key] = await this.evaluate(prop.value);
        }
        return obj;
      }

      // FIRST-CLASS LOGICAL OPERATORS: and, or, not
      case 'LogicalExpr': {
        const leftVal = await this.evaluate(node.left);

        if (node.operator === 'or') {
          if (this.isTruthy(leftVal)) {
            return leftVal; // Short-circuit OR
          }
          return await this.evaluate(node.right);
        }

        if (node.operator === 'and') {
          if (!this.isTruthy(leftVal)) {
            return leftVal; // Short-circuit AND
          }
          return await this.evaluate(node.right);
        }

        throw new Error(`Unknown logical operator '${node.operator}'`);
      }

      case 'UnaryExpr': {
        const arg = await this.evaluate(node.argument);
        if (node.operator === 'not') {
          return !this.isTruthy(arg);
        }
        if (node.operator === '-') {
          return -arg;
        }
        if (node.operator === '+') {
          return +arg;
        }
        throw new Error(`Unknown unary operator '${node.operator}'`);
      }

      case 'BinaryExpr': {
        const left = await this.evaluate(node.left);
        const right = await this.evaluate(node.right);

        switch (node.operator) {
          case '+': return left + right;
          case '-': return left - right;
          case '*': return left * right;
          case '/': return left / right;
          case '%': return left % right;
          case '**': return left ** right;
          case '==': return left === right;
          case '!=': return left !== right;
          case '<': return left < right;
          case '<=': return left <= right;
          case '>': return left > right;
          case '>=': return left >= right;
          case '..': {
            // Range generation
            const res = [];
            const step = left <= right ? 1 : -1;
            for (let i = left; step > 0 ? i <= right : i >= right; i += step) {
              res.push(i);
            }
            return res;
          }
          default:
            throw new Error(`Unknown binary operator '${node.operator}'`);
        }
      }

      // FIRST-CLASS FOR LOOPS
      case 'ForRange': {
        const start = await this.evaluate(node.start);
        const end = await this.evaluate(node.end);
        const loopEnv = new Environment(this.currentEnv);
        loopEnv.define(node.variable, start);

        const step = start <= end ? 1 : -1;
        for (let i = start; step > 0 ? i <= end : i >= end; i += step) {
          loopEnv.assign(node.variable, i);
          await this.executeBlock(node.body.statements, loopEnv);
        }
        return null;
      }

      case 'ForIn': {
        const iterable = await this.evaluate(node.iterable);
        const loopEnv = new Environment(this.currentEnv);
        loopEnv.define(node.variable, null);

        if (Array.isArray(iterable) || typeof iterable === 'string') {
          for (const item of iterable) {
            loopEnv.assign(node.variable, item);
            await this.executeBlock(node.body.statements, loopEnv);
          }
        } else if (typeof iterable === 'object' && iterable !== null) {
          for (const key of Object.keys(iterable)) {
            loopEnv.assign(node.variable, key);
            await this.executeBlock(node.body.statements, loopEnv);
          }
        } else {
          throw new Error(`Type Error: Value is not iterable in for loop`);
        }
        return null;
      }

      case 'ForCStyle': {
        const loopEnv = new Environment(this.currentEnv);
        const prevEnv = this.currentEnv;
        this.currentEnv = loopEnv;

        try {
          if (node.init) await this.evaluate(node.init);

          while (true) {
            if (node.test) {
              const condition = await this.evaluate(node.test);
              if (!this.isTruthy(condition)) break;
            }

            await this.executeBlock(node.body.statements, loopEnv);

            if (node.update) {
              await this.evaluate(node.update);
            }
          }
        } finally {
          this.currentEnv = prevEnv;
        }
        return null;
      }

      case 'WhileStatement': {
        while (this.isTruthy(await this.evaluate(node.condition))) {
          await this.evaluate(node.body);
        }
        return null;
      }

      case 'IfStatement': {
        const cond = await this.evaluate(node.condition);
        if (this.isTruthy(cond)) {
          return await this.evaluate(node.consequent);
        }

        for (const alt of node.alternates) {
          const altCond = await this.evaluate(alt.condition);
          if (this.isTruthy(altCond)) {
            return await this.evaluate(alt.body);
          }
        }

        if (node.fallback) {
          return await this.evaluate(node.fallback);
        }

        return null;
      }

      case 'FunctionDecl': {
        const fn = new WazobiaFunction(node, this.currentEnv, node.isAsync);
        this.currentEnv.define(node.name, fn);
        return fn;
      }

      case 'ReturnStatement': {
        let value = null;
        if (node.argument) {
          value = await this.evaluate(node.argument);
        }
        throw new ReturnValue(value);
      }

      case 'ClassDecl': {
        const methods = {};
        for (const [name, methodDecl] of Object.entries(node.methods)) {
          methods[name] = new WazobiaFunction(methodDecl, this.currentEnv, methodDecl.isAsync);
        }
        const klass = new WazobiaClass(node.name, methods);
        this.currentEnv.define(node.name, klass);
        return klass;
      }

      case 'NewExpression': {
        const klass = this.currentEnv.get(node.callee);
        if (!(klass instanceof LalaClass)) {
          throw new Error(`Identifier '${node.callee}' is not a Lala class`);
        }
        const args = [];
        for (const a of node.args) {
          args.push(await this.evaluate(a));
        }
        return await klass.instantiate(this, args);
      }

      case 'CallExpr': {
        const callee = await this.evaluate(node.callee);
        const evaluatedArgs = [];
        for (const a of node.args) {
          evaluatedArgs.push(await this.evaluate(a));
        }

        if (callee instanceof WazobiaFunction) {
          return await callee.call(this, evaluatedArgs);
        }

        if (typeof callee === 'function') {
          return callee(...evaluatedArgs);
        }

        if (callee instanceof JSProxy) {
          return callee.call(...evaluatedArgs);
        }

        throw new Error(`Target is not callable: ${callee}`);
      }

      case 'MemberExpr': {
        const obj = await this.evaluate(node.object);
        let prop = node.property;
        if (node.computed) {
          prop = await this.evaluate(prop);
        }

        if (obj === null || obj === undefined) {
          throw new Error(`Cannot read property '${prop}' of ${obj}`);
        }

        if (obj instanceof JSInterop) {
          return obj.get(prop);
        }

        if (obj instanceof PythonInterop) {
          return obj.get(prop);
        }

        if (obj instanceof PyModuleProxy) {
          return obj.get(prop);
        }

        if (obj instanceof JSProxy) {
          return obj.get(prop);
        }

        if (obj instanceof WazobiaInstance) {
          return obj.get(prop);
        }

        return obj[prop];
      }

      case 'TryCatchStatement': {
        try {
          return await this.evaluate(node.tryBlock);
        } catch (err) {
          if (err instanceof ReturnValue) throw err;
          const catchEnv = new Environment(this.currentEnv);
          catchEnv.define(node.catchParam, err.message || String(err));
          return await this.executeBlock(node.catchBlock.statements, catchEnv);
        } finally {
          if (node.finallyBlock) {
            await this.evaluate(node.finallyBlock);
          }
        }
      }

      case 'ImportStatement': {
        if (node.isInterop === 'js') {
          const mod = this.js.importModule(node.source);
          const alias = node.alias || path.basename(node.source, path.extname(node.source));
          this.currentEnv.define(alias, mod);
          return mod;
        }

        if (node.isInterop === 'py') {
          const mod = this.py.importModule(node.source);
          const alias = node.alias || node.source;
          this.currentEnv.define(alias, mod);
          return mod;
        }

        // Local Wazobia file import (.lala)
        let filePath = path.resolve(process.cwd(), node.source);
        if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.lala')) {
          filePath = filePath + '.lala';
        }
        if (!fs.existsSync(filePath)) {
          throw new Error(`Cannot find module '${node.source}'`);
        }
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const subInterpreter = new Interpreter({ stdout: this.stdout, pythonBin: this.options.pythonBin });
        await subInterpreter.run(fileContent);

        for (const spec of node.specifiers) {
          const val = subInterpreter.globalEnv.get(spec);
          this.currentEnv.define(spec, val);
        }
        return null;
      }

      case 'PrintStatement': {
        const vals = [];
        for (const a of node.args) {
          const v = await this.evaluate(a);
          vals.push(unwrapJS(v));
        }
        this.stdout(...vals);
        return null;
      }

      case 'AwaitExpr': {
        const val = await this.evaluate(node.argument);
        return await Promise.resolve(val);
      }

      default:
        throw new Error(`Unknown AST node type: ${node.type}`);
    }
  }

  async run(source) {
    const { Lexer } = await import('./lexer.js');
    const { Parser } = await import('./parser.js');

    const lexer = new Lexer(source);
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();

    return await this.evaluate(ast);
  }
}
