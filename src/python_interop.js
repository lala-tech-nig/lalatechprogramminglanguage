// WAZOBIA - Python Interoperability Engine
import { execFileSync, spawnSync } from 'child_process';

export class PyModuleProxy {
  constructor(bridge, moduleName) {
    this.bridge = bridge;
    this.moduleName = moduleName;
    this._cache = new Map();
  }

  get(prop) {
    // Check if it's a function or attribute by asking the bridge
    const info = this.bridge.inspectMember(this.moduleName, prop);
    if (!info.isCallable) {
      return info.value;
    }

    return (...args) => {
      return this.bridge.callFunction(this.moduleName, prop, args);
    };
  }
}

export class PythonInterop {
  constructor(pythonBin = 'python') {
    this.pythonBin = pythonBin;
    this._verifyPython();
  }

  _verifyPython() {
    try {
      const res = spawnSync(this.pythonBin, ['--version'], { encoding: 'utf-8' });
      if (res.error) {
        this.available = false;
        this.version = null;
      } else {
        this.available = true;
        this.version = (res.stdout || res.stderr).trim();
      }
    } catch (_) {
      this.available = false;
      this.version = null;
    }
  }

  eval(code) {
    if (!this.available) {
      throw new Error(`Python Interop Error: Python executable '${this.pythonBin}' is not available.`);
    }

    const script = `
import json, sys
try:
    result = eval(${JSON.stringify(code)})
    print("___RESULT___" + json.dumps(result))
except Exception as e:
    print("___ERROR___" + str(e), file=sys.stderr)
    sys.exit(1)
`;
    const res = spawnSync(this.pythonBin, ['-c', script], { encoding: 'utf-8' });
    if (res.status !== 0) {
      const err = (res.stderr || '').replace('___ERROR___', '').trim();
      throw new Error(`Python Eval Error: ${err}`);
    }

    const out = res.stdout || '';
    const marker = '___RESULT___';
    const idx = out.indexOf(marker);
    if (idx !== -1) {
      return JSON.parse(out.substring(idx + marker.length).trim());
    }
    return null;
  }

  exec(code) {
    if (!this.available) {
      throw new Error(`Python Interop Error: Python executable '${this.pythonBin}' is not available.`);
    }

    const script = `
import json, sys
try:
    scope = {}
    exec(${JSON.stringify(code)}, scope)
    # Filter serializable scope variables
    safe_scope = {}
    for k, v in scope.items():
        if not k.startswith('_'):
            try:
                json.dumps(v)
                safe_scope[k] = v
            except:
                pass
    print("___RESULT___" + json.dumps(safe_scope))
except Exception as e:
    print("___ERROR___" + str(e), file=sys.stderr)
    sys.exit(1)
`;
    const res = spawnSync(this.pythonBin, ['-c', script], { encoding: 'utf-8' });
    if (res.status !== 0) {
      const err = (res.stderr || '').replace('___ERROR___', '').trim();
      throw new Error(`Python Exec Error: ${err}`);
    }

    const out = res.stdout || '';
    const marker = '___RESULT___';
    const idx = out.indexOf(marker);
    if (idx !== -1) {
      return JSON.parse(out.substring(idx + marker.length).trim());
    }
    return {};
  }

  importModule(moduleName) {
    if (!this.available) {
      throw new Error(`Python Interop Error: Python runtime is not available.`);
    }
    return new PyModuleProxy(this, moduleName);
  }

  inspectMember(moduleName, prop) {
    if (!this.available) return { isCallable: false, value: null };

    const script = `
import json, sys, importlib
try:
    mod = importlib.import_module(${JSON.stringify(moduleName)})
    val = getattr(mod, ${JSON.stringify(prop)})
    is_call = callable(val)
    res_val = None
    if not is_call:
        try:
            json.dumps(val)
            res_val = val
        except:
            res_val = str(val)
    print("___INSPECT___" + json.dumps({"isCallable": is_call, "value": res_val}))
except Exception as e:
    print("___INSPECT___" + json.dumps({"isCallable": True, "value": None}))
`;
    const res = spawnSync(this.pythonBin, ['-c', script], { encoding: 'utf-8' });
    const out = res.stdout || '';
    const marker = '___INSPECT___';
    const idx = out.indexOf(marker);
    if (idx !== -1) {
      return JSON.parse(out.substring(idx + marker.length).trim());
    }
    return { isCallable: true, value: null };
  }

  callFunction(moduleName, funcName, args = []) {
    const payload = JSON.stringify({
      module: moduleName,
      function: funcName,
      args: args
    });

    const script = `
import json, sys, importlib
try:
    req = json.loads(${JSON.stringify(payload)})
    mod = importlib.import_module(req['module'])
    fn = getattr(mod, req['function'])
    res = fn(*req['args'])
    print("___RESULT___" + json.dumps(res))
except Exception as e:
    print("___ERROR___" + str(e), file=sys.stderr)
    sys.exit(1)
`;
    const res = spawnSync(this.pythonBin, ['-c', script], { encoding: 'utf-8' });
    if (res.status !== 0) {
      const err = (res.stderr || '').replace('___ERROR___', '').trim();
      throw new Error(`Python Function Error [${moduleName}.${funcName}]: ${err}`);
    }

    const out = res.stdout || '';
    const marker = '___RESULT___';
    const idx = out.indexOf(marker);
    if (idx !== -1) {
      return JSON.parse(out.substring(idx + marker.length).trim());
    }
    return null;
  }

  get(prop) {
    if (prop === 'eval') return (code) => this.eval(code);
    if (prop === 'exec') return (code) => this.exec(code);
    if (prop === 'import') return (mod) => this.importModule(mod);
    return this.importModule(prop);
  }
}
