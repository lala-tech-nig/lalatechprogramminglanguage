// WAZOBIA Lexical Environment

export class Environment {
  constructor(parent = null) {
    this.parent = parent;
    this.bindings = new Map();
    this.constants = new Set();
  }

  define(name, value, isConst = false) {
    if (this.bindings.has(name)) {
      throw new Error(`Runtime Error: Identifier '${name}' has already been declared in this scope.`);
    }
    this.bindings.set(name, value);
    if (isConst) {
      this.constants.add(name);
    }
    return value;
  }

  assign(name, value) {
    if (this.bindings.has(name)) {
      if (this.constants.has(name)) {
        throw new Error(`Runtime Error: Cannot reassign to constant variable '${name}'.`);
      }
      this.bindings.set(name, value);
      return value;
    }

    if (this.parent) {
      return this.parent.assign(name, value);
    }

    throw new Error(`Runtime Error: Undefined variable '${name}'. Cannot assign.`);
  }

  get(name) {
    if (this.bindings.has(name)) {
      return this.bindings.get(name);
    }

    if (this.parent) {
      return this.parent.get(name);
    }

    throw new Error(`Runtime Error: Undefined variable '${name}'.`);
  }

  has(name) {
    if (this.bindings.has(name)) return true;
    if (this.parent) return this.parent.has(name);
    return false;
  }
}
