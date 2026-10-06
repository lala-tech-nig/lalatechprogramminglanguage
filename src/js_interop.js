// WAZOBIA - JavaScript Interoperability Engine
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

export class JSProxy {
  constructor(target) {
    this._target = target;
  }

  get(prop) {
    const val = this._target[prop];
    if (typeof val === 'function') {
      return (...args) => {
        const unwrappedArgs = args.map(unwrapJS);
        const result = val.apply(this._target, unwrappedArgs);
        return wrapJS(result);
      };
    }
    return wrapJS(val);
  }

  set(prop, value) {
    this._target[prop] = unwrapJS(value);
  }

  call(...args) {
    if (typeof this._target !== 'function') {
      throw new Error(`Target is not a callable JavaScript function`);
    }
    const unwrappedArgs = args.map(unwrapJS);
    const result = this._target(...unwrappedArgs);
    return wrapJS(result);
  }

  raw() {
    return this._target;
  }
}

export function wrapJS(val) {
  if (val === null || val === undefined) return val;
  if (typeof val === 'object' || typeof val === 'function') {
    return new JSProxy(val);
  }
  return val;
}

export function unwrapJS(val) {
  if (val instanceof JSProxy) {
    return val._target;
  }
  return val;
}

export class JSInterop {
  constructor() {
    this.globals = {
      Math: wrapJS(Math),
      Date: wrapJS(Date),
      JSON: wrapJS(JSON),
      Number: wrapJS(Number),
      String: wrapJS(String),
      Array: wrapJS(Array),
      Object: wrapJS(Object),
      console: wrapJS(console),
      eval: (code) => {
        return wrapJS(eval(code));
      }
    };
  }

  importModule(moduleName) {
    try {
      const mod = require(moduleName);
      return wrapJS(mod);
    } catch (e) {
      throw new Error(`JavaScript Interop Error: Could not import '${moduleName}'. Details: ${e.message}`);
    }
  }

  get(name) {
    if (name in this.globals) {
      return this.globals[name];
    }
    // Attempt lazy loading of core Node modules
    try {
      const mod = require(name);
      return wrapJS(mod);
    } catch (_) {
      return undefined;
    }
  }
}
