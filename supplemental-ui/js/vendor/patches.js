var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a2, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a2, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a2, prop, b[prop]);
    }
  return a2;
};
var __spreadProps = (a2, b) => __defProps(a2, __getOwnPropDescs(b));
const p$1 = function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(script) {
    const fetchOpts = {};
    if (script.integrity)
      fetchOpts.integrity = script.integrity;
    if (script.referrerpolicy)
      fetchOpts.referrerPolicy = script.referrerpolicy;
    if (script.crossorigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (script.crossorigin === "anonymous")
      fetchOpts.credentials = "omit";
    else
      fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
};
p$1();
function makeMap(str, expectsLowerCase) {
  const map = /* @__PURE__ */ Object.create(null);
  const list = str.split(",");
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase ? (val) => !!map[val.toLowerCase()] : (val) => !!map[val];
}
const specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
const isSpecialBooleanAttr = /* @__PURE__ */ makeMap(specialBooleanAttrs);
function includeBooleanAttr(value) {
  return !!value || value === "";
}
function normalizeStyle(value) {
  if (isArray(value)) {
    const res = {};
    for (let i = 0; i < value.length; i++) {
      const item = value[i];
      const normalized = isString(item) ? parseStringStyle(item) : normalizeStyle(item);
      if (normalized) {
        for (const key in normalized) {
          res[key] = normalized[key];
        }
      }
    }
    return res;
  } else if (isString(value)) {
    return value;
  } else if (isObject$1(value)) {
    return value;
  }
}
const listDelimiterRE = /;(?![^(]*\))/g;
const propertyDelimiterRE = /:(.+)/;
function parseStringStyle(cssText) {
  const ret = {};
  cssText.split(listDelimiterRE).forEach((item) => {
    if (item) {
      const tmp = item.split(propertyDelimiterRE);
      tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return ret;
}
function normalizeClass(value) {
  let res = "";
  if (isString(value)) {
    res = value;
  } else if (isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      const normalized = normalizeClass(value[i]);
      if (normalized) {
        res += normalized + " ";
      }
    }
  } else if (isObject$1(value)) {
    for (const name in value) {
      if (value[name]) {
        res += name + " ";
      }
    }
  }
  return res.trim();
}
const toDisplayString = (val) => {
  return isString(val) ? val : val == null ? "" : isArray(val) || isObject$1(val) && (val.toString === objectToString || !isFunction(val.toString)) ? JSON.stringify(val, replacer, 2) : String(val);
};
const replacer = (_key, val) => {
  if (val && val.__v_isRef) {
    return replacer(_key, val.value);
  } else if (isMap(val)) {
    return {
      [`Map(${val.size})`]: [...val.entries()].reduce((entries, [key, val2]) => {
        entries[`${key} =>`] = val2;
        return entries;
      }, {})
    };
  } else if (isSet(val)) {
    return {
      [`Set(${val.size})`]: [...val.values()]
    };
  } else if (isObject$1(val) && !isArray(val) && !isPlainObject$1(val)) {
    return String(val);
  }
  return val;
};
const EMPTY_OBJ = {};
const EMPTY_ARR = [];
const NOOP = () => {
};
const NO = () => false;
const onRE = /^on[^a-z]/;
const isOn = (key) => onRE.test(key);
const isModelListener = (key) => key.startsWith("onUpdate:");
const extend = Object.assign;
const remove = (arr, el) => {
  const i = arr.indexOf(el);
  if (i > -1) {
    arr.splice(i, 1);
  }
};
const hasOwnProperty = Object.prototype.hasOwnProperty;
const hasOwn = (val, key) => hasOwnProperty.call(val, key);
const isArray = Array.isArray;
const isMap = (val) => toTypeString(val) === "[object Map]";
const isSet = (val) => toTypeString(val) === "[object Set]";
const isFunction = (val) => typeof val === "function";
const isString = (val) => typeof val === "string";
const isSymbol = (val) => typeof val === "symbol";
const isObject$1 = (val) => val !== null && typeof val === "object";
const isPromise = (val) => {
  return isObject$1(val) && isFunction(val.then) && isFunction(val.catch);
};
const objectToString = Object.prototype.toString;
const toTypeString = (value) => objectToString.call(value);
const toRawType = (value) => {
  return toTypeString(value).slice(8, -1);
};
const isPlainObject$1 = (val) => toTypeString(val) === "[object Object]";
const isIntegerKey = (key) => isString(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
const isReservedProp = /* @__PURE__ */ makeMap(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted");
const cacheStringFunction = (fn) => {
  const cache = /* @__PURE__ */ Object.create(null);
  return (str) => {
    const hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
};
const camelizeRE = /-(\w)/g;
const camelize = cacheStringFunction((str) => {
  return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : "");
});
const hyphenateRE = /\B([A-Z])/g;
const hyphenate = cacheStringFunction((str) => str.replace(hyphenateRE, "-$1").toLowerCase());
const capitalize = cacheStringFunction((str) => str.charAt(0).toUpperCase() + str.slice(1));
const toHandlerKey = cacheStringFunction((str) => str ? `on${capitalize(str)}` : ``);
const hasChanged = (value, oldValue) => !Object.is(value, oldValue);
const invokeArrayFns = (fns, arg) => {
  for (let i = 0; i < fns.length; i++) {
    fns[i](arg);
  }
};
const def = (obj, key, value) => {
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: false,
    value
  });
};
const toNumber = (val) => {
  const n = parseFloat(val);
  return isNaN(n) ? val : n;
};
let _globalThis;
const getGlobalThis = () => {
  return _globalThis || (_globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
};
let activeEffectScope;
class EffectScope {
  constructor(detached = false) {
    this.active = true;
    this.effects = [];
    this.cleanups = [];
    if (!detached && activeEffectScope) {
      this.parent = activeEffectScope;
      this.index = (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(this) - 1;
    }
  }
  run(fn) {
    if (this.active) {
      const currentEffectScope = activeEffectScope;
      try {
        activeEffectScope = this;
        return fn();
      } finally {
        activeEffectScope = currentEffectScope;
      }
    }
  }
  on() {
    activeEffectScope = this;
  }
  off() {
    activeEffectScope = this.parent;
  }
  stop(fromParent) {
    if (this.active) {
      let i, l2;
      for (i = 0, l2 = this.effects.length; i < l2; i++) {
        this.effects[i].stop();
      }
      for (i = 0, l2 = this.cleanups.length; i < l2; i++) {
        this.cleanups[i]();
      }
      if (this.scopes) {
        for (i = 0, l2 = this.scopes.length; i < l2; i++) {
          this.scopes[i].stop(true);
        }
      }
      if (this.parent && !fromParent) {
        const last = this.parent.scopes.pop();
        if (last && last !== this) {
          this.parent.scopes[this.index] = last;
          last.index = this.index;
        }
      }
      this.active = false;
    }
  }
}
function effectScope(detached) {
  return new EffectScope(detached);
}
function recordEffectScope(effect, scope = activeEffectScope) {
  if (scope && scope.active) {
    scope.effects.push(effect);
  }
}
const createDep = (effects) => {
  const dep = new Set(effects);
  dep.w = 0;
  dep.n = 0;
  return dep;
};
const wasTracked = (dep) => (dep.w & trackOpBit) > 0;
const newTracked = (dep) => (dep.n & trackOpBit) > 0;
const initDepMarkers = ({ deps }) => {
  if (deps.length) {
    for (let i = 0; i < deps.length; i++) {
      deps[i].w |= trackOpBit;
    }
  }
};
const finalizeDepMarkers = (effect) => {
  const { deps } = effect;
  if (deps.length) {
    let ptr = 0;
    for (let i = 0; i < deps.length; i++) {
      const dep = deps[i];
      if (wasTracked(dep) && !newTracked(dep)) {
        dep.delete(effect);
      } else {
        deps[ptr++] = dep;
      }
      dep.w &= ~trackOpBit;
      dep.n &= ~trackOpBit;
    }
    deps.length = ptr;
  }
};
const targetMap = /* @__PURE__ */ new WeakMap();
let effectTrackDepth = 0;
let trackOpBit = 1;
const maxMarkerBits = 30;
let activeEffect;
const ITERATE_KEY = Symbol("");
const MAP_KEY_ITERATE_KEY = Symbol("");
class ReactiveEffect {
  constructor(fn, scheduler = null, scope) {
    this.fn = fn;
    this.scheduler = scheduler;
    this.active = true;
    this.deps = [];
    this.parent = void 0;
    recordEffectScope(this, scope);
  }
  run() {
    if (!this.active) {
      return this.fn();
    }
    let parent = activeEffect;
    let lastShouldTrack = shouldTrack;
    while (parent) {
      if (parent === this) {
        return;
      }
      parent = parent.parent;
    }
    try {
      this.parent = activeEffect;
      activeEffect = this;
      shouldTrack = true;
      trackOpBit = 1 << ++effectTrackDepth;
      if (effectTrackDepth <= maxMarkerBits) {
        initDepMarkers(this);
      } else {
        cleanupEffect(this);
      }
      return this.fn();
    } finally {
      if (effectTrackDepth <= maxMarkerBits) {
        finalizeDepMarkers(this);
      }
      trackOpBit = 1 << --effectTrackDepth;
      activeEffect = this.parent;
      shouldTrack = lastShouldTrack;
      this.parent = void 0;
      if (this.deferStop) {
        this.stop();
      }
    }
  }
  stop() {
    if (activeEffect === this) {
      this.deferStop = true;
    } else if (this.active) {
      cleanupEffect(this);
      if (this.onStop) {
        this.onStop();
      }
      this.active = false;
    }
  }
}
function cleanupEffect(effect) {
  const { deps } = effect;
  if (deps.length) {
    for (let i = 0; i < deps.length; i++) {
      deps[i].delete(effect);
    }
    deps.length = 0;
  }
}
let shouldTrack = true;
const trackStack = [];
function pauseTracking() {
  trackStack.push(shouldTrack);
  shouldTrack = false;
}
function resetTracking() {
  const last = trackStack.pop();
  shouldTrack = last === void 0 ? true : last;
}
function track(target2, type, key) {
  if (shouldTrack && activeEffect) {
    let depsMap = targetMap.get(target2);
    if (!depsMap) {
      targetMap.set(target2, depsMap = /* @__PURE__ */ new Map());
    }
    let dep = depsMap.get(key);
    if (!dep) {
      depsMap.set(key, dep = createDep());
    }
    trackEffects(dep);
  }
}
function trackEffects(dep, debuggerEventExtraInfo) {
  let shouldTrack2 = false;
  if (effectTrackDepth <= maxMarkerBits) {
    if (!newTracked(dep)) {
      dep.n |= trackOpBit;
      shouldTrack2 = !wasTracked(dep);
    }
  } else {
    shouldTrack2 = !dep.has(activeEffect);
  }
  if (shouldTrack2) {
    dep.add(activeEffect);
    activeEffect.deps.push(dep);
  }
}
function trigger(target2, type, key, newValue, oldValue, oldTarget) {
  const depsMap = targetMap.get(target2);
  if (!depsMap) {
    return;
  }
  let deps = [];
  if (type === "clear") {
    deps = [...depsMap.values()];
  } else if (key === "length" && isArray(target2)) {
    depsMap.forEach((dep, key2) => {
      if (key2 === "length" || key2 >= newValue) {
        deps.push(dep);
      }
    });
  } else {
    if (key !== void 0) {
      deps.push(depsMap.get(key));
    }
    switch (type) {
      case "add":
        if (!isArray(target2)) {
          deps.push(depsMap.get(ITERATE_KEY));
          if (isMap(target2)) {
            deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        } else if (isIntegerKey(key)) {
          deps.push(depsMap.get("length"));
        }
        break;
      case "delete":
        if (!isArray(target2)) {
          deps.push(depsMap.get(ITERATE_KEY));
          if (isMap(target2)) {
            deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        }
        break;
      case "set":
        if (isMap(target2)) {
          deps.push(depsMap.get(ITERATE_KEY));
        }
        break;
    }
  }
  if (deps.length === 1) {
    if (deps[0]) {
      {
        triggerEffects(deps[0]);
      }
    }
  } else {
    const effects = [];
    for (const dep of deps) {
      if (dep) {
        effects.push(...dep);
      }
    }
    {
      triggerEffects(createDep(effects));
    }
  }
}
function triggerEffects(dep, debuggerEventExtraInfo) {
  const effects = isArray(dep) ? dep : [...dep];
  for (const effect of effects) {
    if (effect.computed) {
      triggerEffect(effect);
    }
  }
  for (const effect of effects) {
    if (!effect.computed) {
      triggerEffect(effect);
    }
  }
}
function triggerEffect(effect, debuggerEventExtraInfo) {
  if (effect !== activeEffect || effect.allowRecurse) {
    if (effect.scheduler) {
      effect.scheduler();
    } else {
      effect.run();
    }
  }
}
const isNonTrackableKeys = /* @__PURE__ */ makeMap(`__proto__,__v_isRef,__isVue`);
const builtInSymbols = new Set(/* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((key) => key !== "arguments" && key !== "caller").map((key) => Symbol[key]).filter(isSymbol));
const get = /* @__PURE__ */ createGetter();
const shallowGet = /* @__PURE__ */ createGetter(false, true);
const readonlyGet = /* @__PURE__ */ createGetter(true);
const arrayInstrumentations = /* @__PURE__ */ createArrayInstrumentations();
function createArrayInstrumentations() {
  const instrumentations = {};
  ["includes", "indexOf", "lastIndexOf"].forEach((key) => {
    instrumentations[key] = function(...args) {
      const arr = toRaw(this);
      for (let i = 0, l2 = this.length; i < l2; i++) {
        track(arr, "get", i + "");
      }
      const res = arr[key](...args);
      if (res === -1 || res === false) {
        return arr[key](...args.map(toRaw));
      } else {
        return res;
      }
    };
  });
  ["push", "pop", "shift", "unshift", "splice"].forEach((key) => {
    instrumentations[key] = function(...args) {
      pauseTracking();
      const res = toRaw(this)[key].apply(this, args);
      resetTracking();
      return res;
    };
  });
  return instrumentations;
}
function createGetter(isReadonly2 = false, shallow = false) {
  return function get2(target2, key, receiver) {
    if (key === "__v_isReactive") {
      return !isReadonly2;
    } else if (key === "__v_isReadonly") {
      return isReadonly2;
    } else if (key === "__v_isShallow") {
      return shallow;
    } else if (key === "__v_raw" && receiver === (isReadonly2 ? shallow ? shallowReadonlyMap : readonlyMap : shallow ? shallowReactiveMap : reactiveMap).get(target2)) {
      return target2;
    }
    const targetIsArray = isArray(target2);
    if (!isReadonly2 && targetIsArray && hasOwn(arrayInstrumentations, key)) {
      return Reflect.get(arrayInstrumentations, key, receiver);
    }
    const res = Reflect.get(target2, key, receiver);
    if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
      return res;
    }
    if (!isReadonly2) {
      track(target2, "get", key);
    }
    if (shallow) {
      return res;
    }
    if (isRef(res)) {
      return targetIsArray && isIntegerKey(key) ? res : res.value;
    }
    if (isObject$1(res)) {
      return isReadonly2 ? readonly(res) : reactive(res);
    }
    return res;
  };
}
const set = /* @__PURE__ */ createSetter();
const shallowSet = /* @__PURE__ */ createSetter(true);
function createSetter(shallow = false) {
  return function set2(target2, key, value, receiver) {
    let oldValue = target2[key];
    if (isReadonly(oldValue) && isRef(oldValue) && !isRef(value)) {
      return false;
    }
    if (!shallow && !isReadonly(value)) {
      if (!isShallow(value)) {
        value = toRaw(value);
        oldValue = toRaw(oldValue);
      }
      if (!isArray(target2) && isRef(oldValue) && !isRef(value)) {
        oldValue.value = value;
        return true;
      }
    }
    const hadKey = isArray(target2) && isIntegerKey(key) ? Number(key) < target2.length : hasOwn(target2, key);
    const result = Reflect.set(target2, key, value, receiver);
    if (target2 === toRaw(receiver)) {
      if (!hadKey) {
        trigger(target2, "add", key, value);
      } else if (hasChanged(value, oldValue)) {
        trigger(target2, "set", key, value);
      }
    }
    return result;
  };
}
function deleteProperty(target2, key) {
  const hadKey = hasOwn(target2, key);
  target2[key];
  const result = Reflect.deleteProperty(target2, key);
  if (result && hadKey) {
    trigger(target2, "delete", key, void 0);
  }
  return result;
}
function has(target2, key) {
  const result = Reflect.has(target2, key);
  if (!isSymbol(key) || !builtInSymbols.has(key)) {
    track(target2, "has", key);
  }
  return result;
}
function ownKeys(target2) {
  track(target2, "iterate", isArray(target2) ? "length" : ITERATE_KEY);
  return Reflect.ownKeys(target2);
}
const mutableHandlers = {
  get,
  set,
  deleteProperty,
  has,
  ownKeys
};
const readonlyHandlers = {
  get: readonlyGet,
  set(target2, key) {
    return true;
  },
  deleteProperty(target2, key) {
    return true;
  }
};
const shallowReactiveHandlers = /* @__PURE__ */ extend({}, mutableHandlers, {
  get: shallowGet,
  set: shallowSet
});
const toShallow = (value) => value;
const getProto = (v) => Reflect.getPrototypeOf(v);
function get$1(target2, key, isReadonly2 = false, isShallow2 = false) {
  target2 = target2["__v_raw"];
  const rawTarget = toRaw(target2);
  const rawKey = toRaw(key);
  if (!isReadonly2) {
    if (key !== rawKey) {
      track(rawTarget, "get", key);
    }
    track(rawTarget, "get", rawKey);
  }
  const { has: has2 } = getProto(rawTarget);
  const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
  if (has2.call(rawTarget, key)) {
    return wrap(target2.get(key));
  } else if (has2.call(rawTarget, rawKey)) {
    return wrap(target2.get(rawKey));
  } else if (target2 !== rawTarget) {
    target2.get(key);
  }
}
function has$1(key, isReadonly2 = false) {
  const target2 = this["__v_raw"];
  const rawTarget = toRaw(target2);
  const rawKey = toRaw(key);
  if (!isReadonly2) {
    if (key !== rawKey) {
      track(rawTarget, "has", key);
    }
    track(rawTarget, "has", rawKey);
  }
  return key === rawKey ? target2.has(key) : target2.has(key) || target2.has(rawKey);
}
function size$1(target2, isReadonly2 = false) {
  target2 = target2["__v_raw"];
  !isReadonly2 && track(toRaw(target2), "iterate", ITERATE_KEY);
  return Reflect.get(target2, "size", target2);
}
function add(value) {
  value = toRaw(value);
  const target2 = toRaw(this);
  const proto = getProto(target2);
  const hadKey = proto.has.call(target2, value);
  if (!hadKey) {
    target2.add(value);
    trigger(target2, "add", value, value);
  }
  return this;
}
function set$1(key, value) {
  value = toRaw(value);
  const target2 = toRaw(this);
  const { has: has2, get: get2 } = getProto(target2);
  let hadKey = has2.call(target2, key);
  if (!hadKey) {
    key = toRaw(key);
    hadKey = has2.call(target2, key);
  }
  const oldValue = get2.call(target2, key);
  target2.set(key, value);
  if (!hadKey) {
    trigger(target2, "add", key, value);
  } else if (hasChanged(value, oldValue)) {
    trigger(target2, "set", key, value);
  }
  return this;
}
function deleteEntry(key) {
  const target2 = toRaw(this);
  const { has: has2, get: get2 } = getProto(target2);
  let hadKey = has2.call(target2, key);
  if (!hadKey) {
    key = toRaw(key);
    hadKey = has2.call(target2, key);
  }
  get2 ? get2.call(target2, key) : void 0;
  const result = target2.delete(key);
  if (hadKey) {
    trigger(target2, "delete", key, void 0);
  }
  return result;
}
function clear() {
  const target2 = toRaw(this);
  const hadItems = target2.size !== 0;
  const result = target2.clear();
  if (hadItems) {
    trigger(target2, "clear", void 0, void 0);
  }
  return result;
}
function createForEach(isReadonly2, isShallow2) {
  return function forEach(callback, thisArg) {
    const observed = this;
    const target2 = observed["__v_raw"];
    const rawTarget = toRaw(target2);
    const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
    !isReadonly2 && track(rawTarget, "iterate", ITERATE_KEY);
    return target2.forEach((value, key) => {
      return callback.call(thisArg, wrap(value), wrap(key), observed);
    });
  };
}
function createIterableMethod(method, isReadonly2, isShallow2) {
  return function(...args) {
    const target2 = this["__v_raw"];
    const rawTarget = toRaw(target2);
    const targetIsMap = isMap(rawTarget);
    const isPair = method === "entries" || method === Symbol.iterator && targetIsMap;
    const isKeyOnly = method === "keys" && targetIsMap;
    const innerIterator = target2[method](...args);
    const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
    !isReadonly2 && track(rawTarget, "iterate", isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY);
    return {
      next() {
        const { value, done } = innerIterator.next();
        return done ? { value, done } : {
          value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
          done
        };
      },
      [Symbol.iterator]() {
        return this;
      }
    };
  };
}
function createReadonlyMethod(type) {
  return function(...args) {
    return type === "delete" ? false : this;
  };
}
function createInstrumentations() {
  const mutableInstrumentations2 = {
    get(key) {
      return get$1(this, key);
    },
    get size() {
      return size$1(this);
    },
    has: has$1,
    add,
    set: set$1,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, false)
  };
  const shallowInstrumentations2 = {
    get(key) {
      return get$1(this, key, false, true);
    },
    get size() {
      return size$1(this);
    },
    has: has$1,
    add,
    set: set$1,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, true)
  };
  const readonlyInstrumentations2 = {
    get(key) {
      return get$1(this, key, true);
    },
    get size() {
      return size$1(this, true);
    },
    has(key) {
      return has$1.call(this, key, true);
    },
    add: createReadonlyMethod("add"),
    set: createReadonlyMethod("set"),
    delete: createReadonlyMethod("delete"),
    clear: createReadonlyMethod("clear"),
    forEach: createForEach(true, false)
  };
  const shallowReadonlyInstrumentations2 = {
    get(key) {
      return get$1(this, key, true, true);
    },
    get size() {
      return size$1(this, true);
    },
    has(key) {
      return has$1.call(this, key, true);
    },
    add: createReadonlyMethod("add"),
    set: createReadonlyMethod("set"),
    delete: createReadonlyMethod("delete"),
    clear: createReadonlyMethod("clear"),
    forEach: createForEach(true, true)
  };
  const iteratorMethods = ["keys", "values", "entries", Symbol.iterator];
  iteratorMethods.forEach((method) => {
    mutableInstrumentations2[method] = createIterableMethod(method, false, false);
    readonlyInstrumentations2[method] = createIterableMethod(method, true, false);
    shallowInstrumentations2[method] = createIterableMethod(method, false, true);
    shallowReadonlyInstrumentations2[method] = createIterableMethod(method, true, true);
  });
  return [
    mutableInstrumentations2,
    readonlyInstrumentations2,
    shallowInstrumentations2,
    shallowReadonlyInstrumentations2
  ];
}
const [mutableInstrumentations, readonlyInstrumentations, shallowInstrumentations, shallowReadonlyInstrumentations] = /* @__PURE__ */ createInstrumentations();
function createInstrumentationGetter(isReadonly2, shallow) {
  const instrumentations = shallow ? isReadonly2 ? shallowReadonlyInstrumentations : shallowInstrumentations : isReadonly2 ? readonlyInstrumentations : mutableInstrumentations;
  return (target2, key, receiver) => {
    if (key === "__v_isReactive") {
      return !isReadonly2;
    } else if (key === "__v_isReadonly") {
      return isReadonly2;
    } else if (key === "__v_raw") {
      return target2;
    }
    return Reflect.get(hasOwn(instrumentations, key) && key in target2 ? instrumentations : target2, key, receiver);
  };
}
const mutableCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false, false)
};
const shallowCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false, true)
};
const readonlyCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(true, false)
};
const reactiveMap = /* @__PURE__ */ new WeakMap();
const shallowReactiveMap = /* @__PURE__ */ new WeakMap();
const readonlyMap = /* @__PURE__ */ new WeakMap();
const shallowReadonlyMap = /* @__PURE__ */ new WeakMap();
function targetTypeMap(rawType) {
  switch (rawType) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
function getTargetType(value) {
  return value["__v_skip"] || !Object.isExtensible(value) ? 0 : targetTypeMap(toRawType(value));
}
function reactive(target2) {
  if (isReadonly(target2)) {
    return target2;
  }
  return createReactiveObject(target2, false, mutableHandlers, mutableCollectionHandlers, reactiveMap);
}
function shallowReactive(target2) {
  return createReactiveObject(target2, false, shallowReactiveHandlers, shallowCollectionHandlers, shallowReactiveMap);
}
function readonly(target2) {
  return createReactiveObject(target2, true, readonlyHandlers, readonlyCollectionHandlers, readonlyMap);
}
function createReactiveObject(target2, isReadonly2, baseHandlers, collectionHandlers, proxyMap) {
  if (!isObject$1(target2)) {
    return target2;
  }
  if (target2["__v_raw"] && !(isReadonly2 && target2["__v_isReactive"])) {
    return target2;
  }
  const existingProxy = proxyMap.get(target2);
  if (existingProxy) {
    return existingProxy;
  }
  const targetType = getTargetType(target2);
  if (targetType === 0) {
    return target2;
  }
  const proxy = new Proxy(target2, targetType === 2 ? collectionHandlers : baseHandlers);
  proxyMap.set(target2, proxy);
  return proxy;
}
function isReactive(value) {
  if (isReadonly(value)) {
    return isReactive(value["__v_raw"]);
  }
  return !!(value && value["__v_isReactive"]);
}
function isReadonly(value) {
  return !!(value && value["__v_isReadonly"]);
}
function isShallow(value) {
  return !!(value && value["__v_isShallow"]);
}
function isProxy(value) {
  return isReactive(value) || isReadonly(value);
}
function toRaw(observed) {
  const raw = observed && observed["__v_raw"];
  return raw ? toRaw(raw) : observed;
}
function markRaw(value) {
  def(value, "__v_skip", true);
  return value;
}
const toReactive = (value) => isObject$1(value) ? reactive(value) : value;
const toReadonly = (value) => isObject$1(value) ? readonly(value) : value;
function trackRefValue(ref2) {
  if (shouldTrack && activeEffect) {
    ref2 = toRaw(ref2);
    {
      trackEffects(ref2.dep || (ref2.dep = createDep()));
    }
  }
}
function triggerRefValue(ref2, newVal) {
  ref2 = toRaw(ref2);
  if (ref2.dep) {
    {
      triggerEffects(ref2.dep);
    }
  }
}
function isRef(r) {
  return !!(r && r.__v_isRef === true);
}
function ref(value) {
  return createRef(value, false);
}
function createRef(rawValue, shallow) {
  if (isRef(rawValue)) {
    return rawValue;
  }
  return new RefImpl(rawValue, shallow);
}
class RefImpl {
  constructor(value, __v_isShallow) {
    this.__v_isShallow = __v_isShallow;
    this.dep = void 0;
    this.__v_isRef = true;
    this._rawValue = __v_isShallow ? value : toRaw(value);
    this._value = __v_isShallow ? value : toReactive(value);
  }
  get value() {
    trackRefValue(this);
    return this._value;
  }
  set value(newVal) {
    newVal = this.__v_isShallow ? newVal : toRaw(newVal);
    if (hasChanged(newVal, this._rawValue)) {
      this._rawValue = newVal;
      this._value = this.__v_isShallow ? newVal : toReactive(newVal);
      triggerRefValue(this);
    }
  }
}
function unref(ref2) {
  return isRef(ref2) ? ref2.value : ref2;
}
const shallowUnwrapHandlers = {
  get: (target2, key, receiver) => unref(Reflect.get(target2, key, receiver)),
  set: (target2, key, value, receiver) => {
    const oldValue = target2[key];
    if (isRef(oldValue) && !isRef(value)) {
      oldValue.value = value;
      return true;
    } else {
      return Reflect.set(target2, key, value, receiver);
    }
  }
};
function proxyRefs(objectWithRefs) {
  return isReactive(objectWithRefs) ? objectWithRefs : new Proxy(objectWithRefs, shallowUnwrapHandlers);
}
function toRefs(object) {
  const ret = isArray(object) ? new Array(object.length) : {};
  for (const key in object) {
    ret[key] = toRef(object, key);
  }
  return ret;
}
class ObjectRefImpl {
  constructor(_object, _key, _defaultValue) {
    this._object = _object;
    this._key = _key;
    this._defaultValue = _defaultValue;
    this.__v_isRef = true;
  }
  get value() {
    const val = this._object[this._key];
    return val === void 0 ? this._defaultValue : val;
  }
  set value(newVal) {
    this._object[this._key] = newVal;
  }
}
function toRef(object, key, defaultValue) {
  const val = object[key];
  return isRef(val) ? val : new ObjectRefImpl(object, key, defaultValue);
}
class ComputedRefImpl {
  constructor(getter, _setter, isReadonly2, isSSR) {
    this._setter = _setter;
    this.dep = void 0;
    this.__v_isRef = true;
    this._dirty = true;
    this.effect = new ReactiveEffect(getter, () => {
      if (!this._dirty) {
        this._dirty = true;
        triggerRefValue(this);
      }
    });
    this.effect.computed = this;
    this.effect.active = this._cacheable = !isSSR;
    this["__v_isReadonly"] = isReadonly2;
  }
  get value() {
    const self2 = toRaw(this);
    trackRefValue(self2);
    if (self2._dirty || !self2._cacheable) {
      self2._dirty = false;
      self2._value = self2.effect.run();
    }
    return self2._value;
  }
  set value(newValue) {
    this._setter(newValue);
  }
}
function computed$1(getterOrOptions, debugOptions, isSSR = false) {
  let getter;
  let setter;
  const onlyGetter = isFunction(getterOrOptions);
  if (onlyGetter) {
    getter = getterOrOptions;
    setter = NOOP;
  } else {
    getter = getterOrOptions.get;
    setter = getterOrOptions.set;
  }
  const cRef = new ComputedRefImpl(getter, setter, onlyGetter || !setter, isSSR);
  return cRef;
}
function callWithErrorHandling(fn, instance, type, args) {
  let res;
  try {
    res = args ? fn(...args) : fn();
  } catch (err) {
    handleError(err, instance, type);
  }
  return res;
}
function callWithAsyncErrorHandling(fn, instance, type, args) {
  if (isFunction(fn)) {
    const res = callWithErrorHandling(fn, instance, type, args);
    if (res && isPromise(res)) {
      res.catch((err) => {
        handleError(err, instance, type);
      });
    }
    return res;
  }
  const values = [];
  for (let i = 0; i < fn.length; i++) {
    values.push(callWithAsyncErrorHandling(fn[i], instance, type, args));
  }
  return values;
}
function handleError(err, instance, type, throwInDev) {
  instance ? instance.vnode : null;
  if (instance) {
    let cur = instance.parent;
    const exposedInstance = instance.proxy;
    const errorInfo = type;
    while (cur) {
      const errorCapturedHooks = cur.ec;
      if (errorCapturedHooks) {
        for (let i = 0; i < errorCapturedHooks.length; i++) {
          if (errorCapturedHooks[i](err, exposedInstance, errorInfo) === false) {
            return;
          }
        }
      }
      cur = cur.parent;
    }
    const appErrorHandler = instance.appContext.config.errorHandler;
    if (appErrorHandler) {
      callWithErrorHandling(appErrorHandler, null, 10, [err, exposedInstance, errorInfo]);
      return;
    }
  }
  logError(err);
}
function logError(err, type, contextVNode, throwInDev) {
  {
    console.error(err);
  }
}
let isFlushing = false;
let isFlushPending = false;
const queue$1 = [];
let flushIndex = 0;
const pendingPreFlushCbs = [];
let activePreFlushCbs = null;
let preFlushIndex = 0;
const pendingPostFlushCbs = [];
let activePostFlushCbs = null;
let postFlushIndex = 0;
const resolvedPromise = /* @__PURE__ */ Promise.resolve();
let currentFlushPromise = null;
let currentPreFlushParentJob = null;
function nextTick(fn) {
  const p2 = currentFlushPromise || resolvedPromise;
  return fn ? p2.then(this ? fn.bind(this) : fn) : p2;
}
function findInsertionIndex(id) {
  let start = flushIndex + 1;
  let end = queue$1.length;
  while (start < end) {
    const middle = start + end >>> 1;
    const middleJobId = getId(queue$1[middle]);
    middleJobId < id ? start = middle + 1 : end = middle;
  }
  return start;
}
function queueJob(job) {
  if ((!queue$1.length || !queue$1.includes(job, isFlushing && job.allowRecurse ? flushIndex + 1 : flushIndex)) && job !== currentPreFlushParentJob) {
    if (job.id == null) {
      queue$1.push(job);
    } else {
      queue$1.splice(findInsertionIndex(job.id), 0, job);
    }
    queueFlush();
  }
}
function queueFlush() {
  if (!isFlushing && !isFlushPending) {
    isFlushPending = true;
    currentFlushPromise = resolvedPromise.then(flushJobs);
  }
}
function invalidateJob(job) {
  const i = queue$1.indexOf(job);
  if (i > flushIndex) {
    queue$1.splice(i, 1);
  }
}
function queueCb(cb, activeQueue, pendingQueue, index2) {
  if (!isArray(cb)) {
    if (!activeQueue || !activeQueue.includes(cb, cb.allowRecurse ? index2 + 1 : index2)) {
      pendingQueue.push(cb);
    }
  } else {
    pendingQueue.push(...cb);
  }
  queueFlush();
}
function queuePreFlushCb(cb) {
  queueCb(cb, activePreFlushCbs, pendingPreFlushCbs, preFlushIndex);
}
function queuePostFlushCb(cb) {
  queueCb(cb, activePostFlushCbs, pendingPostFlushCbs, postFlushIndex);
}
function flushPreFlushCbs(seen, parentJob = null) {
  if (pendingPreFlushCbs.length) {
    currentPreFlushParentJob = parentJob;
    activePreFlushCbs = [...new Set(pendingPreFlushCbs)];
    pendingPreFlushCbs.length = 0;
    for (preFlushIndex = 0; preFlushIndex < activePreFlushCbs.length; preFlushIndex++) {
      activePreFlushCbs[preFlushIndex]();
    }
    activePreFlushCbs = null;
    preFlushIndex = 0;
    currentPreFlushParentJob = null;
    flushPreFlushCbs(seen, parentJob);
  }
}
function flushPostFlushCbs(seen) {
  flushPreFlushCbs();
  if (pendingPostFlushCbs.length) {
    const deduped = [...new Set(pendingPostFlushCbs)];
    pendingPostFlushCbs.length = 0;
    if (activePostFlushCbs) {
      activePostFlushCbs.push(...deduped);
      return;
    }
    activePostFlushCbs = deduped;
    activePostFlushCbs.sort((a2, b) => getId(a2) - getId(b));
    for (postFlushIndex = 0; postFlushIndex < activePostFlushCbs.length; postFlushIndex++) {
      activePostFlushCbs[postFlushIndex]();
    }
    activePostFlushCbs = null;
    postFlushIndex = 0;
  }
}
const getId = (job) => job.id == null ? Infinity : job.id;
function flushJobs(seen) {
  isFlushPending = false;
  isFlushing = true;
  flushPreFlushCbs(seen);
  queue$1.sort((a2, b) => getId(a2) - getId(b));
  const check = NOOP;
  try {
    for (flushIndex = 0; flushIndex < queue$1.length; flushIndex++) {
      const job = queue$1[flushIndex];
      if (job && job.active !== false) {
        if (false)
          ;
        callWithErrorHandling(job, null, 14);
      }
    }
  } finally {
    flushIndex = 0;
    queue$1.length = 0;
    flushPostFlushCbs();
    isFlushing = false;
    currentFlushPromise = null;
    if (queue$1.length || pendingPreFlushCbs.length || pendingPostFlushCbs.length) {
      flushJobs(seen);
    }
  }
}
function emit$1(instance, event, ...rawArgs) {
  if (instance.isUnmounted)
    return;
  const props = instance.vnode.props || EMPTY_OBJ;
  let args = rawArgs;
  const isModelListener2 = event.startsWith("update:");
  const modelArg = isModelListener2 && event.slice(7);
  if (modelArg && modelArg in props) {
    const modifiersKey = `${modelArg === "modelValue" ? "model" : modelArg}Modifiers`;
    const { number, trim } = props[modifiersKey] || EMPTY_OBJ;
    if (trim) {
      args = rawArgs.map((a2) => a2.trim());
    }
    if (number) {
      args = rawArgs.map(toNumber);
    }
  }
  let handlerName;
  let handler = props[handlerName = toHandlerKey(event)] || props[handlerName = toHandlerKey(camelize(event))];
  if (!handler && isModelListener2) {
    handler = props[handlerName = toHandlerKey(hyphenate(event))];
  }
  if (handler) {
    callWithAsyncErrorHandling(handler, instance, 6, args);
  }
  const onceHandler = props[handlerName + `Once`];
  if (onceHandler) {
    if (!instance.emitted) {
      instance.emitted = {};
    } else if (instance.emitted[handlerName]) {
      return;
    }
    instance.emitted[handlerName] = true;
    callWithAsyncErrorHandling(onceHandler, instance, 6, args);
  }
}
function normalizeEmitsOptions(comp, appContext, asMixin = false) {
  const cache = appContext.emitsCache;
  const cached = cache.get(comp);
  if (cached !== void 0) {
    return cached;
  }
  const raw = comp.emits;
  let normalized = {};
  let hasExtends = false;
  if (!isFunction(comp)) {
    const extendEmits = (raw2) => {
      const normalizedFromExtend = normalizeEmitsOptions(raw2, appContext, true);
      if (normalizedFromExtend) {
        hasExtends = true;
        extend(normalized, normalizedFromExtend);
      }
    };
    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendEmits);
    }
    if (comp.extends) {
      extendEmits(comp.extends);
    }
    if (comp.mixins) {
      comp.mixins.forEach(extendEmits);
    }
  }
  if (!raw && !hasExtends) {
    cache.set(comp, null);
    return null;
  }
  if (isArray(raw)) {
    raw.forEach((key) => normalized[key] = null);
  } else {
    extend(normalized, raw);
  }
  cache.set(comp, normalized);
  return normalized;
}
function isEmitListener(options, key) {
  if (!options || !isOn(key)) {
    return false;
  }
  key = key.slice(2).replace(/Once$/, "");
  return hasOwn(options, key[0].toLowerCase() + key.slice(1)) || hasOwn(options, hyphenate(key)) || hasOwn(options, key);
}
let currentRenderingInstance = null;
let currentScopeId = null;
function setCurrentRenderingInstance(instance) {
  const prev = currentRenderingInstance;
  currentRenderingInstance = instance;
  currentScopeId = instance && instance.type.__scopeId || null;
  return prev;
}
function pushScopeId(id) {
  currentScopeId = id;
}
function popScopeId() {
  currentScopeId = null;
}
function withCtx(fn, ctx = currentRenderingInstance, isNonScopedSlot) {
  if (!ctx)
    return fn;
  if (fn._n) {
    return fn;
  }
  const renderFnWithContext = (...args) => {
    if (renderFnWithContext._d) {
      setBlockTracking(-1);
    }
    const prevInstance = setCurrentRenderingInstance(ctx);
    const res = fn(...args);
    setCurrentRenderingInstance(prevInstance);
    if (renderFnWithContext._d) {
      setBlockTracking(1);
    }
    return res;
  };
  renderFnWithContext._n = true;
  renderFnWithContext._c = true;
  renderFnWithContext._d = true;
  return renderFnWithContext;
}
function markAttrsAccessed() {
}
function renderComponentRoot(instance) {
  const { type: Component, vnode, proxy, withProxy, props, propsOptions: [propsOptions], slots, attrs, emit, render, renderCache, data, setupState, ctx, inheritAttrs } = instance;
  let result;
  let fallthroughAttrs;
  const prev = setCurrentRenderingInstance(instance);
  try {
    if (vnode.shapeFlag & 4) {
      const proxyToUse = withProxy || proxy;
      result = normalizeVNode(render.call(proxyToUse, proxyToUse, renderCache, props, setupState, data, ctx));
      fallthroughAttrs = attrs;
    } else {
      const render2 = Component;
      if (false)
        ;
      result = normalizeVNode(render2.length > 1 ? render2(props, false ? {
        get attrs() {
          markAttrsAccessed();
          return attrs;
        },
        slots,
        emit
      } : { attrs, slots, emit }) : render2(props, null));
      fallthroughAttrs = Component.props ? attrs : getFunctionalFallthrough(attrs);
    }
  } catch (err) {
    blockStack.length = 0;
    handleError(err, instance, 1);
    result = createVNode(Comment);
  }
  let root = result;
  if (fallthroughAttrs && inheritAttrs !== false) {
    const keys = Object.keys(fallthroughAttrs);
    const { shapeFlag } = root;
    if (keys.length) {
      if (shapeFlag & (1 | 6)) {
        if (propsOptions && keys.some(isModelListener)) {
          fallthroughAttrs = filterModelListeners(fallthroughAttrs, propsOptions);
        }
        root = cloneVNode(root, fallthroughAttrs);
      }
    }
  }
  if (vnode.dirs) {
    root = cloneVNode(root);
    root.dirs = root.dirs ? root.dirs.concat(vnode.dirs) : vnode.dirs;
  }
  if (vnode.transition) {
    root.transition = vnode.transition;
  }
  {
    result = root;
  }
  setCurrentRenderingInstance(prev);
  return result;
}
const getFunctionalFallthrough = (attrs) => {
  let res;
  for (const key in attrs) {
    if (key === "class" || key === "style" || isOn(key)) {
      (res || (res = {}))[key] = attrs[key];
    }
  }
  return res;
};
const filterModelListeners = (attrs, props) => {
  const res = {};
  for (const key in attrs) {
    if (!isModelListener(key) || !(key.slice(9) in props)) {
      res[key] = attrs[key];
    }
  }
  return res;
};
function shouldUpdateComponent(prevVNode, nextVNode, optimized) {
  const { props: prevProps, children: prevChildren, component } = prevVNode;
  const { props: nextProps, children: nextChildren, patchFlag } = nextVNode;
  const emits = component.emitsOptions;
  if (nextVNode.dirs || nextVNode.transition) {
    return true;
  }
  if (optimized && patchFlag >= 0) {
    if (patchFlag & 1024) {
      return true;
    }
    if (patchFlag & 16) {
      if (!prevProps) {
        return !!nextProps;
      }
      return hasPropsChanged(prevProps, nextProps, emits);
    } else if (patchFlag & 8) {
      const dynamicProps = nextVNode.dynamicProps;
      for (let i = 0; i < dynamicProps.length; i++) {
        const key = dynamicProps[i];
        if (nextProps[key] !== prevProps[key] && !isEmitListener(emits, key)) {
          return true;
        }
      }
    }
  } else {
    if (prevChildren || nextChildren) {
      if (!nextChildren || !nextChildren.$stable) {
        return true;
      }
    }
    if (prevProps === nextProps) {
      return false;
    }
    if (!prevProps) {
      return !!nextProps;
    }
    if (!nextProps) {
      return true;
    }
    return hasPropsChanged(prevProps, nextProps, emits);
  }
  return false;
}
function hasPropsChanged(prevProps, nextProps, emitsOptions) {
  const nextKeys = Object.keys(nextProps);
  if (nextKeys.length !== Object.keys(prevProps).length) {
    return true;
  }
  for (let i = 0; i < nextKeys.length; i++) {
    const key = nextKeys[i];
    if (nextProps[key] !== prevProps[key] && !isEmitListener(emitsOptions, key)) {
      return true;
    }
  }
  return false;
}
function updateHOCHostEl({ vnode, parent }, el) {
  while (parent && parent.subTree === vnode) {
    (vnode = parent.vnode).el = el;
    parent = parent.parent;
  }
}
const isSuspense = (type) => type.__isSuspense;
function queueEffectWithSuspense(fn, suspense) {
  if (suspense && suspense.pendingBranch) {
    if (isArray(fn)) {
      suspense.effects.push(...fn);
    } else {
      suspense.effects.push(fn);
    }
  } else {
    queuePostFlushCb(fn);
  }
}
function provide(key, value) {
  if (!currentInstance)
    ;
  else {
    let provides = currentInstance.provides;
    const parentProvides = currentInstance.parent && currentInstance.parent.provides;
    if (parentProvides === provides) {
      provides = currentInstance.provides = Object.create(parentProvides);
    }
    provides[key] = value;
  }
}
function inject(key, defaultValue, treatDefaultAsFactory = false) {
  const instance = currentInstance || currentRenderingInstance;
  if (instance) {
    const provides = instance.parent == null ? instance.vnode.appContext && instance.vnode.appContext.provides : instance.parent.provides;
    if (provides && key in provides) {
      return provides[key];
    } else if (arguments.length > 1) {
      return treatDefaultAsFactory && isFunction(defaultValue) ? defaultValue.call(instance.proxy) : defaultValue;
    } else
      ;
  }
}
function watchEffect(effect, options) {
  return doWatch(effect, null, options);
}
const INITIAL_WATCHER_VALUE = {};
function watch(source, cb, options) {
  return doWatch(source, cb, options);
}
function doWatch(source, cb, { immediate, deep, flush, onTrack, onTrigger } = EMPTY_OBJ) {
  const instance = currentInstance;
  let getter;
  let forceTrigger = false;
  let isMultiSource = false;
  if (isRef(source)) {
    getter = () => source.value;
    forceTrigger = isShallow(source);
  } else if (isReactive(source)) {
    getter = () => source;
    deep = true;
  } else if (isArray(source)) {
    isMultiSource = true;
    forceTrigger = source.some((s2) => isReactive(s2) || isShallow(s2));
    getter = () => source.map((s2) => {
      if (isRef(s2)) {
        return s2.value;
      } else if (isReactive(s2)) {
        return traverse(s2);
      } else if (isFunction(s2)) {
        return callWithErrorHandling(s2, instance, 2);
      } else
        ;
    });
  } else if (isFunction(source)) {
    if (cb) {
      getter = () => callWithErrorHandling(source, instance, 2);
    } else {
      getter = () => {
        if (instance && instance.isUnmounted) {
          return;
        }
        if (cleanup) {
          cleanup();
        }
        return callWithAsyncErrorHandling(source, instance, 3, [onCleanup]);
      };
    }
  } else {
    getter = NOOP;
  }
  if (cb && deep) {
    const baseGetter = getter;
    getter = () => traverse(baseGetter());
  }
  let cleanup;
  let onCleanup = (fn) => {
    cleanup = effect.onStop = () => {
      callWithErrorHandling(fn, instance, 4);
    };
  };
  if (isInSSRComponentSetup) {
    onCleanup = NOOP;
    if (!cb) {
      getter();
    } else if (immediate) {
      callWithAsyncErrorHandling(cb, instance, 3, [
        getter(),
        isMultiSource ? [] : void 0,
        onCleanup
      ]);
    }
    return NOOP;
  }
  let oldValue = isMultiSource ? [] : INITIAL_WATCHER_VALUE;
  const job = () => {
    if (!effect.active) {
      return;
    }
    if (cb) {
      const newValue = effect.run();
      if (deep || forceTrigger || (isMultiSource ? newValue.some((v, i) => hasChanged(v, oldValue[i])) : hasChanged(newValue, oldValue)) || false) {
        if (cleanup) {
          cleanup();
        }
        callWithAsyncErrorHandling(cb, instance, 3, [
          newValue,
          oldValue === INITIAL_WATCHER_VALUE ? void 0 : oldValue,
          onCleanup
        ]);
        oldValue = newValue;
      }
    } else {
      effect.run();
    }
  };
  job.allowRecurse = !!cb;
  let scheduler;
  if (flush === "sync") {
    scheduler = job;
  } else if (flush === "post") {
    scheduler = () => queuePostRenderEffect(job, instance && instance.suspense);
  } else {
    scheduler = () => queuePreFlushCb(job);
  }
  const effect = new ReactiveEffect(getter, scheduler);
  if (cb) {
    if (immediate) {
      job();
    } else {
      oldValue = effect.run();
    }
  } else if (flush === "post") {
    queuePostRenderEffect(effect.run.bind(effect), instance && instance.suspense);
  } else {
    effect.run();
  }
  return () => {
    effect.stop();
    if (instance && instance.scope) {
      remove(instance.scope.effects, effect);
    }
  };
}
function instanceWatch(source, value, options) {
  const publicThis = this.proxy;
  const getter = isString(source) ? source.includes(".") ? createPathGetter(publicThis, source) : () => publicThis[source] : source.bind(publicThis, publicThis);
  let cb;
  if (isFunction(value)) {
    cb = value;
  } else {
    cb = value.handler;
    options = value;
  }
  const cur = currentInstance;
  setCurrentInstance(this);
  const res = doWatch(getter, cb.bind(publicThis), options);
  if (cur) {
    setCurrentInstance(cur);
  } else {
    unsetCurrentInstance();
  }
  return res;
}
function createPathGetter(ctx, path) {
  const segments = path.split(".");
  return () => {
    let cur = ctx;
    for (let i = 0; i < segments.length && cur; i++) {
      cur = cur[segments[i]];
    }
    return cur;
  };
}
function traverse(value, seen) {
  if (!isObject$1(value) || value["__v_skip"]) {
    return value;
  }
  seen = seen || /* @__PURE__ */ new Set();
  if (seen.has(value)) {
    return value;
  }
  seen.add(value);
  if (isRef(value)) {
    traverse(value.value, seen);
  } else if (isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      traverse(value[i], seen);
    }
  } else if (isSet(value) || isMap(value)) {
    value.forEach((v) => {
      traverse(v, seen);
    });
  } else if (isPlainObject$1(value)) {
    for (const key in value) {
      traverse(value[key], seen);
    }
  }
  return value;
}
function useTransitionState() {
  const state = {
    isMounted: false,
    isLeaving: false,
    isUnmounting: false,
    leavingVNodes: /* @__PURE__ */ new Map()
  };
  onMounted(() => {
    state.isMounted = true;
  });
  onBeforeUnmount(() => {
    state.isUnmounting = true;
  });
  return state;
}
const TransitionHookValidator = [Function, Array];
const BaseTransitionImpl = {
  name: `BaseTransition`,
  props: {
    mode: String,
    appear: Boolean,
    persisted: Boolean,
    onBeforeEnter: TransitionHookValidator,
    onEnter: TransitionHookValidator,
    onAfterEnter: TransitionHookValidator,
    onEnterCancelled: TransitionHookValidator,
    onBeforeLeave: TransitionHookValidator,
    onLeave: TransitionHookValidator,
    onAfterLeave: TransitionHookValidator,
    onLeaveCancelled: TransitionHookValidator,
    onBeforeAppear: TransitionHookValidator,
    onAppear: TransitionHookValidator,
    onAfterAppear: TransitionHookValidator,
    onAppearCancelled: TransitionHookValidator
  },
  setup(props, { slots }) {
    const instance = getCurrentInstance();
    const state = useTransitionState();
    let prevTransitionKey;
    return () => {
      const children = slots.default && getTransitionRawChildren(slots.default(), true);
      if (!children || !children.length) {
        return;
      }
      let child = children[0];
      if (children.length > 1) {
        for (const c of children) {
          if (c.type !== Comment) {
            child = c;
            break;
          }
        }
      }
      const rawProps = toRaw(props);
      const { mode } = rawProps;
      if (state.isLeaving) {
        return emptyPlaceholder(child);
      }
      const innerChild = getKeepAliveChild(child);
      if (!innerChild) {
        return emptyPlaceholder(child);
      }
      const enterHooks = resolveTransitionHooks(innerChild, rawProps, state, instance);
      setTransitionHooks(innerChild, enterHooks);
      const oldChild = instance.subTree;
      const oldInnerChild = oldChild && getKeepAliveChild(oldChild);
      let transitionKeyChanged = false;
      const { getTransitionKey } = innerChild.type;
      if (getTransitionKey) {
        const key = getTransitionKey();
        if (prevTransitionKey === void 0) {
          prevTransitionKey = key;
        } else if (key !== prevTransitionKey) {
          prevTransitionKey = key;
          transitionKeyChanged = true;
        }
      }
      if (oldInnerChild && oldInnerChild.type !== Comment && (!isSameVNodeType(innerChild, oldInnerChild) || transitionKeyChanged)) {
        const leavingHooks = resolveTransitionHooks(oldInnerChild, rawProps, state, instance);
        setTransitionHooks(oldInnerChild, leavingHooks);
        if (mode === "out-in") {
          state.isLeaving = true;
          leavingHooks.afterLeave = () => {
            state.isLeaving = false;
            instance.update();
          };
          return emptyPlaceholder(child);
        } else if (mode === "in-out" && innerChild.type !== Comment) {
          leavingHooks.delayLeave = (el, earlyRemove, delayedLeave) => {
            const leavingVNodesCache = getLeavingNodesForType(state, oldInnerChild);
            leavingVNodesCache[String(oldInnerChild.key)] = oldInnerChild;
            el._leaveCb = () => {
              earlyRemove();
              el._leaveCb = void 0;
              delete enterHooks.delayedLeave;
            };
            enterHooks.delayedLeave = delayedLeave;
          };
        }
      }
      return child;
    };
  }
};
const BaseTransition = BaseTransitionImpl;
function getLeavingNodesForType(state, vnode) {
  const { leavingVNodes } = state;
  let leavingVNodesCache = leavingVNodes.get(vnode.type);
  if (!leavingVNodesCache) {
    leavingVNodesCache = /* @__PURE__ */ Object.create(null);
    leavingVNodes.set(vnode.type, leavingVNodesCache);
  }
  return leavingVNodesCache;
}
function resolveTransitionHooks(vnode, props, state, instance) {
  const { appear, mode, persisted = false, onBeforeEnter, onEnter, onAfterEnter, onEnterCancelled, onBeforeLeave, onLeave, onAfterLeave, onLeaveCancelled, onBeforeAppear, onAppear, onAfterAppear, onAppearCancelled } = props;
  const key = String(vnode.key);
  const leavingVNodesCache = getLeavingNodesForType(state, vnode);
  const callHook2 = (hook, args) => {
    hook && callWithAsyncErrorHandling(hook, instance, 9, args);
  };
  const callAsyncHook = (hook, args) => {
    const done = args[1];
    callHook2(hook, args);
    if (isArray(hook)) {
      if (hook.every((hook2) => hook2.length <= 1))
        done();
    } else if (hook.length <= 1) {
      done();
    }
  };
  const hooks = {
    mode,
    persisted,
    beforeEnter(el) {
      let hook = onBeforeEnter;
      if (!state.isMounted) {
        if (appear) {
          hook = onBeforeAppear || onBeforeEnter;
        } else {
          return;
        }
      }
      if (el._leaveCb) {
        el._leaveCb(true);
      }
      const leavingVNode = leavingVNodesCache[key];
      if (leavingVNode && isSameVNodeType(vnode, leavingVNode) && leavingVNode.el._leaveCb) {
        leavingVNode.el._leaveCb();
      }
      callHook2(hook, [el]);
    },
    enter(el) {
      let hook = onEnter;
      let afterHook = onAfterEnter;
      let cancelHook = onEnterCancelled;
      if (!state.isMounted) {
        if (appear) {
          hook = onAppear || onEnter;
          afterHook = onAfterAppear || onAfterEnter;
          cancelHook = onAppearCancelled || onEnterCancelled;
        } else {
          return;
        }
      }
      let called = false;
      const done = el._enterCb = (cancelled) => {
        if (called)
          return;
        called = true;
        if (cancelled) {
          callHook2(cancelHook, [el]);
        } else {
          callHook2(afterHook, [el]);
        }
        if (hooks.delayedLeave) {
          hooks.delayedLeave();
        }
        el._enterCb = void 0;
      };
      if (hook) {
        callAsyncHook(hook, [el, done]);
      } else {
        done();
      }
    },
    leave(el, remove2) {
      const key2 = String(vnode.key);
      if (el._enterCb) {
        el._enterCb(true);
      }
      if (state.isUnmounting) {
        return remove2();
      }
      callHook2(onBeforeLeave, [el]);
      let called = false;
      const done = el._leaveCb = (cancelled) => {
        if (called)
          return;
        called = true;
        remove2();
        if (cancelled) {
          callHook2(onLeaveCancelled, [el]);
        } else {
          callHook2(onAfterLeave, [el]);
        }
        el._leaveCb = void 0;
        if (leavingVNodesCache[key2] === vnode) {
          delete leavingVNodesCache[key2];
        }
      };
      leavingVNodesCache[key2] = vnode;
      if (onLeave) {
        callAsyncHook(onLeave, [el, done]);
      } else {
        done();
      }
    },
    clone(vnode2) {
      return resolveTransitionHooks(vnode2, props, state, instance);
    }
  };
  return hooks;
}
function emptyPlaceholder(vnode) {
  if (isKeepAlive(vnode)) {
    vnode = cloneVNode(vnode);
    vnode.children = null;
    return vnode;
  }
}
function getKeepAliveChild(vnode) {
  return isKeepAlive(vnode) ? vnode.children ? vnode.children[0] : void 0 : vnode;
}
function setTransitionHooks(vnode, hooks) {
  if (vnode.shapeFlag & 6 && vnode.component) {
    setTransitionHooks(vnode.component.subTree, hooks);
  } else if (vnode.shapeFlag & 128) {
    vnode.ssContent.transition = hooks.clone(vnode.ssContent);
    vnode.ssFallback.transition = hooks.clone(vnode.ssFallback);
  } else {
    vnode.transition = hooks;
  }
}
function getTransitionRawChildren(children, keepComment = false, parentKey) {
  let ret = [];
  let keyedFragmentCount = 0;
  for (let i = 0; i < children.length; i++) {
    let child = children[i];
    const key = parentKey == null ? child.key : String(parentKey) + String(child.key != null ? child.key : i);
    if (child.type === Fragment) {
      if (child.patchFlag & 128)
        keyedFragmentCount++;
      ret = ret.concat(getTransitionRawChildren(child.children, keepComment, key));
    } else if (keepComment || child.type !== Comment) {
      ret.push(key != null ? cloneVNode(child, { key }) : child);
    }
  }
  if (keyedFragmentCount > 1) {
    for (let i = 0; i < ret.length; i++) {
      ret[i].patchFlag = -2;
    }
  }
  return ret;
}
function defineComponent(options) {
  return isFunction(options) ? { setup: options, name: options.name } : options;
}
const isAsyncWrapper = (i) => !!i.type.__asyncLoader;
const isKeepAlive = (vnode) => vnode.type.__isKeepAlive;
function onActivated(hook, target2) {
  registerKeepAliveHook(hook, "a", target2);
}
function onDeactivated(hook, target2) {
  registerKeepAliveHook(hook, "da", target2);
}
function registerKeepAliveHook(hook, type, target2 = currentInstance) {
  const wrappedHook = hook.__wdc || (hook.__wdc = () => {
    let current = target2;
    while (current) {
      if (current.isDeactivated) {
        return;
      }
      current = current.parent;
    }
    return hook();
  });
  injectHook(type, wrappedHook, target2);
  if (target2) {
    let current = target2.parent;
    while (current && current.parent) {
      if (isKeepAlive(current.parent.vnode)) {
        injectToKeepAliveRoot(wrappedHook, type, target2, current);
      }
      current = current.parent;
    }
  }
}
function injectToKeepAliveRoot(hook, type, target2, keepAliveRoot) {
  const injected = injectHook(type, hook, keepAliveRoot, true);
  onUnmounted(() => {
    remove(keepAliveRoot[type], injected);
  }, target2);
}
function injectHook(type, hook, target2 = currentInstance, prepend = false) {
  if (target2) {
    const hooks = target2[type] || (target2[type] = []);
    const wrappedHook = hook.__weh || (hook.__weh = (...args) => {
      if (target2.isUnmounted) {
        return;
      }
      pauseTracking();
      setCurrentInstance(target2);
      const res = callWithAsyncErrorHandling(hook, target2, type, args);
      unsetCurrentInstance();
      resetTracking();
      return res;
    });
    if (prepend) {
      hooks.unshift(wrappedHook);
    } else {
      hooks.push(wrappedHook);
    }
    return wrappedHook;
  }
}
const createHook = (lifecycle) => (hook, target2 = currentInstance) => (!isInSSRComponentSetup || lifecycle === "sp") && injectHook(lifecycle, hook, target2);
const onBeforeMount = createHook("bm");
const onMounted = createHook("m");
const onBeforeUpdate = createHook("bu");
const onUpdated = createHook("u");
const onBeforeUnmount = createHook("bum");
const onUnmounted = createHook("um");
const onServerPrefetch = createHook("sp");
const onRenderTriggered = createHook("rtg");
const onRenderTracked = createHook("rtc");
function onErrorCaptured(hook, target2 = currentInstance) {
  injectHook("ec", hook, target2);
}
function withDirectives(vnode, directives) {
  const internalInstance = currentRenderingInstance;
  if (internalInstance === null) {
    return vnode;
  }
  const instance = getExposeProxy(internalInstance) || internalInstance.proxy;
  const bindings = vnode.dirs || (vnode.dirs = []);
  for (let i = 0; i < directives.length; i++) {
    let [dir, value, arg, modifiers = EMPTY_OBJ] = directives[i];
    if (isFunction(dir)) {
      dir = {
        mounted: dir,
        updated: dir
      };
    }
    if (dir.deep) {
      traverse(value);
    }
    bindings.push({
      dir,
      instance,
      value,
      oldValue: void 0,
      arg,
      modifiers
    });
  }
  return vnode;
}
function invokeDirectiveHook(vnode, prevVNode, instance, name) {
  const bindings = vnode.dirs;
  const oldBindings = prevVNode && prevVNode.dirs;
  for (let i = 0; i < bindings.length; i++) {
    const binding = bindings[i];
    if (oldBindings) {
      binding.oldValue = oldBindings[i].value;
    }
    let hook = binding.dir[name];
    if (hook) {
      pauseTracking();
      callWithAsyncErrorHandling(hook, instance, 8, [
        vnode.el,
        binding,
        vnode,
        prevVNode
      ]);
      resetTracking();
    }
  }
}
const COMPONENTS = "components";
const NULL_DYNAMIC_COMPONENT = Symbol();
function resolveDynamicComponent(component) {
  if (isString(component)) {
    return resolveAsset(COMPONENTS, component) || component;
  } else {
    return component || NULL_DYNAMIC_COMPONENT;
  }
}
function resolveAsset(type, name, warnMissing, maybeSelfReference = false) {
  const instance = currentRenderingInstance || currentInstance;
  if (instance) {
    const Component = instance.type;
    if (type === COMPONENTS) {
      const selfName = getComponentName(Component);
      if (selfName && (selfName === name || selfName === camelize(name) || selfName === capitalize(camelize(name)))) {
        return Component;
      }
    }
    const res = resolve(instance[type] || Component[type], name) || resolve(instance.appContext[type], name);
    if (!res && maybeSelfReference) {
      return Component;
    }
    return res;
  }
}
function resolve(registry, name) {
  return registry && (registry[name] || registry[camelize(name)] || registry[capitalize(camelize(name))]);
}
function renderList(source, renderItem, cache, index2) {
  let ret;
  const cached = cache && cache[index2];
  if (isArray(source) || isString(source)) {
    ret = new Array(source.length);
    for (let i = 0, l2 = source.length; i < l2; i++) {
      ret[i] = renderItem(source[i], i, void 0, cached && cached[i]);
    }
  } else if (typeof source === "number") {
    ret = new Array(source);
    for (let i = 0; i < source; i++) {
      ret[i] = renderItem(i + 1, i, void 0, cached && cached[i]);
    }
  } else if (isObject$1(source)) {
    if (source[Symbol.iterator]) {
      ret = Array.from(source, (item, i) => renderItem(item, i, void 0, cached && cached[i]));
    } else {
      const keys = Object.keys(source);
      ret = new Array(keys.length);
      for (let i = 0, l2 = keys.length; i < l2; i++) {
        const key = keys[i];
        ret[i] = renderItem(source[key], key, i, cached && cached[i]);
      }
    }
  } else {
    ret = [];
  }
  if (cache) {
    cache[index2] = ret;
  }
  return ret;
}
const getPublicInstance = (i) => {
  if (!i)
    return null;
  if (isStatefulComponent(i))
    return getExposeProxy(i) || i.proxy;
  return getPublicInstance(i.parent);
};
const publicPropertiesMap = /* @__PURE__ */ extend(/* @__PURE__ */ Object.create(null), {
  $: (i) => i,
  $el: (i) => i.vnode.el,
  $data: (i) => i.data,
  $props: (i) => i.props,
  $attrs: (i) => i.attrs,
  $slots: (i) => i.slots,
  $refs: (i) => i.refs,
  $parent: (i) => getPublicInstance(i.parent),
  $root: (i) => getPublicInstance(i.root),
  $emit: (i) => i.emit,
  $options: (i) => resolveMergedOptions(i),
  $forceUpdate: (i) => i.f || (i.f = () => queueJob(i.update)),
  $nextTick: (i) => i.n || (i.n = nextTick.bind(i.proxy)),
  $watch: (i) => instanceWatch.bind(i)
});
const PublicInstanceProxyHandlers = {
  get({ _: instance }, key) {
    const { ctx, setupState, data, props, accessCache, type, appContext } = instance;
    let normalizedProps;
    if (key[0] !== "$") {
      const n = accessCache[key];
      if (n !== void 0) {
        switch (n) {
          case 1:
            return setupState[key];
          case 2:
            return data[key];
          case 4:
            return ctx[key];
          case 3:
            return props[key];
        }
      } else if (setupState !== EMPTY_OBJ && hasOwn(setupState, key)) {
        accessCache[key] = 1;
        return setupState[key];
      } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
        accessCache[key] = 2;
        return data[key];
      } else if ((normalizedProps = instance.propsOptions[0]) && hasOwn(normalizedProps, key)) {
        accessCache[key] = 3;
        return props[key];
      } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
        accessCache[key] = 4;
        return ctx[key];
      } else if (shouldCacheAccess) {
        accessCache[key] = 0;
      }
    }
    const publicGetter = publicPropertiesMap[key];
    let cssModule, globalProperties;
    if (publicGetter) {
      if (key === "$attrs") {
        track(instance, "get", key);
      }
      return publicGetter(instance);
    } else if ((cssModule = type.__cssModules) && (cssModule = cssModule[key])) {
      return cssModule;
    } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
      accessCache[key] = 4;
      return ctx[key];
    } else if (globalProperties = appContext.config.globalProperties, hasOwn(globalProperties, key)) {
      {
        return globalProperties[key];
      }
    } else
      ;
  },
  set({ _: instance }, key, value) {
    const { data, setupState, ctx } = instance;
    if (setupState !== EMPTY_OBJ && hasOwn(setupState, key)) {
      setupState[key] = value;
      return true;
    } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
      data[key] = value;
      return true;
    } else if (hasOwn(instance.props, key)) {
      return false;
    }
    if (key[0] === "$" && key.slice(1) in instance) {
      return false;
    } else {
      {
        ctx[key] = value;
      }
    }
    return true;
  },
  has({ _: { data, setupState, accessCache, ctx, appContext, propsOptions } }, key) {
    let normalizedProps;
    return !!accessCache[key] || data !== EMPTY_OBJ && hasOwn(data, key) || setupState !== EMPTY_OBJ && hasOwn(setupState, key) || (normalizedProps = propsOptions[0]) && hasOwn(normalizedProps, key) || hasOwn(ctx, key) || hasOwn(publicPropertiesMap, key) || hasOwn(appContext.config.globalProperties, key);
  },
  defineProperty(target2, key, descriptor) {
    if (descriptor.get != null) {
      target2._.accessCache[key] = 0;
    } else if (hasOwn(descriptor, "value")) {
      this.set(target2, key, descriptor.value, null);
    }
    return Reflect.defineProperty(target2, key, descriptor);
  }
};
let shouldCacheAccess = true;
function applyOptions(instance) {
  const options = resolveMergedOptions(instance);
  const publicThis = instance.proxy;
  const ctx = instance.ctx;
  shouldCacheAccess = false;
  if (options.beforeCreate) {
    callHook$1(options.beforeCreate, instance, "bc");
  }
  const {
    data: dataOptions,
    computed: computedOptions,
    methods,
    watch: watchOptions,
    provide: provideOptions,
    inject: injectOptions,
    created,
    beforeMount,
    mounted,
    beforeUpdate,
    updated,
    activated,
    deactivated,
    beforeDestroy,
    beforeUnmount,
    destroyed,
    unmounted,
    render,
    renderTracked,
    renderTriggered,
    errorCaptured,
    serverPrefetch,
    expose,
    inheritAttrs,
    components,
    directives,
    filters
  } = options;
  const checkDuplicateProperties = null;
  if (injectOptions) {
    resolveInjections(injectOptions, ctx, checkDuplicateProperties, instance.appContext.config.unwrapInjectedRef);
  }
  if (methods) {
    for (const key in methods) {
      const methodHandler = methods[key];
      if (isFunction(methodHandler)) {
        {
          ctx[key] = methodHandler.bind(publicThis);
        }
      }
    }
  }
  if (dataOptions) {
    const data = dataOptions.call(publicThis, publicThis);
    if (!isObject$1(data))
      ;
    else {
      instance.data = reactive(data);
    }
  }
  shouldCacheAccess = true;
  if (computedOptions) {
    for (const key in computedOptions) {
      const opt = computedOptions[key];
      const get2 = isFunction(opt) ? opt.bind(publicThis, publicThis) : isFunction(opt.get) ? opt.get.bind(publicThis, publicThis) : NOOP;
      const set2 = !isFunction(opt) && isFunction(opt.set) ? opt.set.bind(publicThis) : NOOP;
      const c = computed({
        get: get2,
        set: set2
      });
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => c.value,
        set: (v) => c.value = v
      });
    }
  }
  if (watchOptions) {
    for (const key in watchOptions) {
      createWatcher(watchOptions[key], ctx, publicThis, key);
    }
  }
  if (provideOptions) {
    const provides = isFunction(provideOptions) ? provideOptions.call(publicThis) : provideOptions;
    Reflect.ownKeys(provides).forEach((key) => {
      provide(key, provides[key]);
    });
  }
  if (created) {
    callHook$1(created, instance, "c");
  }
  function registerLifecycleHook(register, hook) {
    if (isArray(hook)) {
      hook.forEach((_hook) => register(_hook.bind(publicThis)));
    } else if (hook) {
      register(hook.bind(publicThis));
    }
  }
  registerLifecycleHook(onBeforeMount, beforeMount);
  registerLifecycleHook(onMounted, mounted);
  registerLifecycleHook(onBeforeUpdate, beforeUpdate);
  registerLifecycleHook(onUpdated, updated);
  registerLifecycleHook(onActivated, activated);
  registerLifecycleHook(onDeactivated, deactivated);
  registerLifecycleHook(onErrorCaptured, errorCaptured);
  registerLifecycleHook(onRenderTracked, renderTracked);
  registerLifecycleHook(onRenderTriggered, renderTriggered);
  registerLifecycleHook(onBeforeUnmount, beforeUnmount);
  registerLifecycleHook(onUnmounted, unmounted);
  registerLifecycleHook(onServerPrefetch, serverPrefetch);
  if (isArray(expose)) {
    if (expose.length) {
      const exposed = instance.exposed || (instance.exposed = {});
      expose.forEach((key) => {
        Object.defineProperty(exposed, key, {
          get: () => publicThis[key],
          set: (val) => publicThis[key] = val
        });
      });
    } else if (!instance.exposed) {
      instance.exposed = {};
    }
  }
  if (render && instance.render === NOOP) {
    instance.render = render;
  }
  if (inheritAttrs != null) {
    instance.inheritAttrs = inheritAttrs;
  }
  if (components)
    instance.components = components;
  if (directives)
    instance.directives = directives;
}
function resolveInjections(injectOptions, ctx, checkDuplicateProperties, unwrapRef = false) {
  if (isArray(injectOptions)) {
    injectOptions = normalizeInject(injectOptions);
  }
  for (const key in injectOptions) {
    const opt = injectOptions[key];
    let injected;
    if (isObject$1(opt)) {
      if ("default" in opt) {
        injected = inject(opt.from || key, opt.default, true);
      } else {
        injected = inject(opt.from || key);
      }
    } else {
      injected = inject(opt);
    }
    if (isRef(injected)) {
      if (unwrapRef) {
        Object.defineProperty(ctx, key, {
          enumerable: true,
          configurable: true,
          get: () => injected.value,
          set: (v) => injected.value = v
        });
      } else {
        ctx[key] = injected;
      }
    } else {
      ctx[key] = injected;
    }
  }
}
function callHook$1(hook, instance, type) {
  callWithAsyncErrorHandling(isArray(hook) ? hook.map((h2) => h2.bind(instance.proxy)) : hook.bind(instance.proxy), instance, type);
}
function createWatcher(raw, ctx, publicThis, key) {
  const getter = key.includes(".") ? createPathGetter(publicThis, key) : () => publicThis[key];
  if (isString(raw)) {
    const handler = ctx[raw];
    if (isFunction(handler)) {
      watch(getter, handler);
    }
  } else if (isFunction(raw)) {
    watch(getter, raw.bind(publicThis));
  } else if (isObject$1(raw)) {
    if (isArray(raw)) {
      raw.forEach((r) => createWatcher(r, ctx, publicThis, key));
    } else {
      const handler = isFunction(raw.handler) ? raw.handler.bind(publicThis) : ctx[raw.handler];
      if (isFunction(handler)) {
        watch(getter, handler, raw);
      }
    }
  } else
    ;
}
function resolveMergedOptions(instance) {
  const base = instance.type;
  const { mixins, extends: extendsOptions } = base;
  const { mixins: globalMixins, optionsCache: cache, config: { optionMergeStrategies } } = instance.appContext;
  const cached = cache.get(base);
  let resolved;
  if (cached) {
    resolved = cached;
  } else if (!globalMixins.length && !mixins && !extendsOptions) {
    {
      resolved = base;
    }
  } else {
    resolved = {};
    if (globalMixins.length) {
      globalMixins.forEach((m) => mergeOptions(resolved, m, optionMergeStrategies, true));
    }
    mergeOptions(resolved, base, optionMergeStrategies);
  }
  cache.set(base, resolved);
  return resolved;
}
function mergeOptions(to, from, strats, asMixin = false) {
  const { mixins, extends: extendsOptions } = from;
  if (extendsOptions) {
    mergeOptions(to, extendsOptions, strats, true);
  }
  if (mixins) {
    mixins.forEach((m) => mergeOptions(to, m, strats, true));
  }
  for (const key in from) {
    if (asMixin && key === "expose")
      ;
    else {
      const strat = internalOptionMergeStrats[key] || strats && strats[key];
      to[key] = strat ? strat(to[key], from[key]) : from[key];
    }
  }
  return to;
}
const internalOptionMergeStrats = {
  data: mergeDataFn,
  props: mergeObjectOptions,
  emits: mergeObjectOptions,
  methods: mergeObjectOptions,
  computed: mergeObjectOptions,
  beforeCreate: mergeAsArray,
  created: mergeAsArray,
  beforeMount: mergeAsArray,
  mounted: mergeAsArray,
  beforeUpdate: mergeAsArray,
  updated: mergeAsArray,
  beforeDestroy: mergeAsArray,
  beforeUnmount: mergeAsArray,
  destroyed: mergeAsArray,
  unmounted: mergeAsArray,
  activated: mergeAsArray,
  deactivated: mergeAsArray,
  errorCaptured: mergeAsArray,
  serverPrefetch: mergeAsArray,
  components: mergeObjectOptions,
  directives: mergeObjectOptions,
  watch: mergeWatchOptions,
  provide: mergeDataFn,
  inject: mergeInject
};
function mergeDataFn(to, from) {
  if (!from) {
    return to;
  }
  if (!to) {
    return from;
  }
  return function mergedDataFn() {
    return extend(isFunction(to) ? to.call(this, this) : to, isFunction(from) ? from.call(this, this) : from);
  };
}
function mergeInject(to, from) {
  return mergeObjectOptions(normalizeInject(to), normalizeInject(from));
}
function normalizeInject(raw) {
  if (isArray(raw)) {
    const res = {};
    for (let i = 0; i < raw.length; i++) {
      res[raw[i]] = raw[i];
    }
    return res;
  }
  return raw;
}
function mergeAsArray(to, from) {
  return to ? [...new Set([].concat(to, from))] : from;
}
function mergeObjectOptions(to, from) {
  return to ? extend(extend(/* @__PURE__ */ Object.create(null), to), from) : from;
}
function mergeWatchOptions(to, from) {
  if (!to)
    return from;
  if (!from)
    return to;
  const merged = extend(/* @__PURE__ */ Object.create(null), to);
  for (const key in from) {
    merged[key] = mergeAsArray(to[key], from[key]);
  }
  return merged;
}
function initProps(instance, rawProps, isStateful, isSSR = false) {
  const props = {};
  const attrs = {};
  def(attrs, InternalObjectKey, 1);
  instance.propsDefaults = /* @__PURE__ */ Object.create(null);
  setFullProps(instance, rawProps, props, attrs);
  for (const key in instance.propsOptions[0]) {
    if (!(key in props)) {
      props[key] = void 0;
    }
  }
  if (isStateful) {
    instance.props = isSSR ? props : shallowReactive(props);
  } else {
    if (!instance.type.props) {
      instance.props = attrs;
    } else {
      instance.props = props;
    }
  }
  instance.attrs = attrs;
}
function updateProps(instance, rawProps, rawPrevProps, optimized) {
  const { props, attrs, vnode: { patchFlag } } = instance;
  const rawCurrentProps = toRaw(props);
  const [options] = instance.propsOptions;
  let hasAttrsChanged = false;
  if ((optimized || patchFlag > 0) && !(patchFlag & 16)) {
    if (patchFlag & 8) {
      const propsToUpdate = instance.vnode.dynamicProps;
      for (let i = 0; i < propsToUpdate.length; i++) {
        let key = propsToUpdate[i];
        if (isEmitListener(instance.emitsOptions, key)) {
          continue;
        }
        const value = rawProps[key];
        if (options) {
          if (hasOwn(attrs, key)) {
            if (value !== attrs[key]) {
              attrs[key] = value;
              hasAttrsChanged = true;
            }
          } else {
            const camelizedKey = camelize(key);
            props[camelizedKey] = resolvePropValue(options, rawCurrentProps, camelizedKey, value, instance, false);
          }
        } else {
          if (value !== attrs[key]) {
            attrs[key] = value;
            hasAttrsChanged = true;
          }
        }
      }
    }
  } else {
    if (setFullProps(instance, rawProps, props, attrs)) {
      hasAttrsChanged = true;
    }
    let kebabKey;
    for (const key in rawCurrentProps) {
      if (!rawProps || !hasOwn(rawProps, key) && ((kebabKey = hyphenate(key)) === key || !hasOwn(rawProps, kebabKey))) {
        if (options) {
          if (rawPrevProps && (rawPrevProps[key] !== void 0 || rawPrevProps[kebabKey] !== void 0)) {
            props[key] = resolvePropValue(options, rawCurrentProps, key, void 0, instance, true);
          }
        } else {
          delete props[key];
        }
      }
    }
    if (attrs !== rawCurrentProps) {
      for (const key in attrs) {
        if (!rawProps || !hasOwn(rawProps, key) && true) {
          delete attrs[key];
          hasAttrsChanged = true;
        }
      }
    }
  }
  if (hasAttrsChanged) {
    trigger(instance, "set", "$attrs");
  }
}
function setFullProps(instance, rawProps, props, attrs) {
  const [options, needCastKeys] = instance.propsOptions;
  let hasAttrsChanged = false;
  let rawCastValues;
  if (rawProps) {
    for (let key in rawProps) {
      if (isReservedProp(key)) {
        continue;
      }
      const value = rawProps[key];
      let camelKey;
      if (options && hasOwn(options, camelKey = camelize(key))) {
        if (!needCastKeys || !needCastKeys.includes(camelKey)) {
          props[camelKey] = value;
        } else {
          (rawCastValues || (rawCastValues = {}))[camelKey] = value;
        }
      } else if (!isEmitListener(instance.emitsOptions, key)) {
        if (!(key in attrs) || value !== attrs[key]) {
          attrs[key] = value;
          hasAttrsChanged = true;
        }
      }
    }
  }
  if (needCastKeys) {
    const rawCurrentProps = toRaw(props);
    const castValues = rawCastValues || EMPTY_OBJ;
    for (let i = 0; i < needCastKeys.length; i++) {
      const key = needCastKeys[i];
      props[key] = resolvePropValue(options, rawCurrentProps, key, castValues[key], instance, !hasOwn(castValues, key));
    }
  }
  return hasAttrsChanged;
}
function resolvePropValue(options, props, key, value, instance, isAbsent) {
  const opt = options[key];
  if (opt != null) {
    const hasDefault = hasOwn(opt, "default");
    if (hasDefault && value === void 0) {
      const defaultValue = opt.default;
      if (opt.type !== Function && isFunction(defaultValue)) {
        const { propsDefaults } = instance;
        if (key in propsDefaults) {
          value = propsDefaults[key];
        } else {
          setCurrentInstance(instance);
          value = propsDefaults[key] = defaultValue.call(null, props);
          unsetCurrentInstance();
        }
      } else {
        value = defaultValue;
      }
    }
    if (opt[0]) {
      if (isAbsent && !hasDefault) {
        value = false;
      } else if (opt[1] && (value === "" || value === hyphenate(key))) {
        value = true;
      }
    }
  }
  return value;
}
function normalizePropsOptions(comp, appContext, asMixin = false) {
  const cache = appContext.propsCache;
  const cached = cache.get(comp);
  if (cached) {
    return cached;
  }
  const raw = comp.props;
  const normalized = {};
  const needCastKeys = [];
  let hasExtends = false;
  if (!isFunction(comp)) {
    const extendProps = (raw2) => {
      hasExtends = true;
      const [props, keys] = normalizePropsOptions(raw2, appContext, true);
      extend(normalized, props);
      if (keys)
        needCastKeys.push(...keys);
    };
    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendProps);
    }
    if (comp.extends) {
      extendProps(comp.extends);
    }
    if (comp.mixins) {
      comp.mixins.forEach(extendProps);
    }
  }
  if (!raw && !hasExtends) {
    cache.set(comp, EMPTY_ARR);
    return EMPTY_ARR;
  }
  if (isArray(raw)) {
    for (let i = 0; i < raw.length; i++) {
      const normalizedKey = camelize(raw[i]);
      if (validatePropName(normalizedKey)) {
        normalized[normalizedKey] = EMPTY_OBJ;
      }
    }
  } else if (raw) {
    for (const key in raw) {
      const normalizedKey = camelize(key);
      if (validatePropName(normalizedKey)) {
        const opt = raw[key];
        const prop = normalized[normalizedKey] = isArray(opt) || isFunction(opt) ? { type: opt } : opt;
        if (prop) {
          const booleanIndex = getTypeIndex(Boolean, prop.type);
          const stringIndex = getTypeIndex(String, prop.type);
          prop[0] = booleanIndex > -1;
          prop[1] = stringIndex < 0 || booleanIndex < stringIndex;
          if (booleanIndex > -1 || hasOwn(prop, "default")) {
            needCastKeys.push(normalizedKey);
          }
        }
      }
    }
  }
  const res = [normalized, needCastKeys];
  cache.set(comp, res);
  return res;
}
function validatePropName(key) {
  if (key[0] !== "$") {
    return true;
  }
  return false;
}
function getType(ctor) {
  const match = ctor && ctor.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : ctor === null ? "null" : "";
}
function isSameType(a2, b) {
  return getType(a2) === getType(b);
}
function getTypeIndex(type, expectedTypes) {
  if (isArray(expectedTypes)) {
    return expectedTypes.findIndex((t) => isSameType(t, type));
  } else if (isFunction(expectedTypes)) {
    return isSameType(expectedTypes, type) ? 0 : -1;
  }
  return -1;
}
const isInternalKey = (key) => key[0] === "_" || key === "$stable";
const normalizeSlotValue = (value) => isArray(value) ? value.map(normalizeVNode) : [normalizeVNode(value)];
const normalizeSlot = (key, rawSlot, ctx) => {
  if (rawSlot._n) {
    return rawSlot;
  }
  const normalized = withCtx((...args) => {
    return normalizeSlotValue(rawSlot(...args));
  }, ctx);
  normalized._c = false;
  return normalized;
};
const normalizeObjectSlots = (rawSlots, slots, instance) => {
  const ctx = rawSlots._ctx;
  for (const key in rawSlots) {
    if (isInternalKey(key))
      continue;
    const value = rawSlots[key];
    if (isFunction(value)) {
      slots[key] = normalizeSlot(key, value, ctx);
    } else if (value != null) {
      const normalized = normalizeSlotValue(value);
      slots[key] = () => normalized;
    }
  }
};
const normalizeVNodeSlots = (instance, children) => {
  const normalized = normalizeSlotValue(children);
  instance.slots.default = () => normalized;
};
const initSlots = (instance, children) => {
  if (instance.vnode.shapeFlag & 32) {
    const type = children._;
    if (type) {
      instance.slots = toRaw(children);
      def(children, "_", type);
    } else {
      normalizeObjectSlots(children, instance.slots = {});
    }
  } else {
    instance.slots = {};
    if (children) {
      normalizeVNodeSlots(instance, children);
    }
  }
  def(instance.slots, InternalObjectKey, 1);
};
const updateSlots = (instance, children, optimized) => {
  const { vnode, slots } = instance;
  let needDeletionCheck = true;
  let deletionComparisonTarget = EMPTY_OBJ;
  if (vnode.shapeFlag & 32) {
    const type = children._;
    if (type) {
      if (optimized && type === 1) {
        needDeletionCheck = false;
      } else {
        extend(slots, children);
        if (!optimized && type === 1) {
          delete slots._;
        }
      }
    } else {
      needDeletionCheck = !children.$stable;
      normalizeObjectSlots(children, slots);
    }
    deletionComparisonTarget = children;
  } else if (children) {
    normalizeVNodeSlots(instance, children);
    deletionComparisonTarget = { default: 1 };
  }
  if (needDeletionCheck) {
    for (const key in slots) {
      if (!isInternalKey(key) && !(key in deletionComparisonTarget)) {
        delete slots[key];
      }
    }
  }
};
function createAppContext() {
  return {
    app: null,
    config: {
      isNativeTag: NO,
      performance: false,
      globalProperties: {},
      optionMergeStrategies: {},
      errorHandler: void 0,
      warnHandler: void 0,
      compilerOptions: {}
    },
    mixins: [],
    components: {},
    directives: {},
    provides: /* @__PURE__ */ Object.create(null),
    optionsCache: /* @__PURE__ */ new WeakMap(),
    propsCache: /* @__PURE__ */ new WeakMap(),
    emitsCache: /* @__PURE__ */ new WeakMap()
  };
}
let uid$1 = 0;
function createAppAPI(render, hydrate) {
  return function createApp2(rootComponent, rootProps = null) {
    if (!isFunction(rootComponent)) {
      rootComponent = Object.assign({}, rootComponent);
    }
    if (rootProps != null && !isObject$1(rootProps)) {
      rootProps = null;
    }
    const context = createAppContext();
    const installedPlugins = /* @__PURE__ */ new Set();
    let isMounted = false;
    const app2 = context.app = {
      _uid: uid$1++,
      _component: rootComponent,
      _props: rootProps,
      _container: null,
      _context: context,
      _instance: null,
      version,
      get config() {
        return context.config;
      },
      set config(v) {
      },
      use(plugin, ...options) {
        if (installedPlugins.has(plugin))
          ;
        else if (plugin && isFunction(plugin.install)) {
          installedPlugins.add(plugin);
          plugin.install(app2, ...options);
        } else if (isFunction(plugin)) {
          installedPlugins.add(plugin);
          plugin(app2, ...options);
        } else
          ;
        return app2;
      },
      mixin(mixin) {
        {
          if (!context.mixins.includes(mixin)) {
            context.mixins.push(mixin);
          }
        }
        return app2;
      },
      component(name, component) {
        if (!component) {
          return context.components[name];
        }
        context.components[name] = component;
        return app2;
      },
      directive(name, directive) {
        if (!directive) {
          return context.directives[name];
        }
        context.directives[name] = directive;
        return app2;
      },
      mount(rootContainer, isHydrate, isSVG) {
        if (!isMounted) {
          const vnode = createVNode(rootComponent, rootProps);
          vnode.appContext = context;
          if (isHydrate && hydrate) {
            hydrate(vnode, rootContainer);
          } else {
            render(vnode, rootContainer, isSVG);
          }
          isMounted = true;
          app2._container = rootContainer;
          rootContainer.__vue_app__ = app2;
          return getExposeProxy(vnode.component) || vnode.component.proxy;
        }
      },
      unmount() {
        if (isMounted) {
          render(null, app2._container);
          delete app2._container.__vue_app__;
        }
      },
      provide(key, value) {
        context.provides[key] = value;
        return app2;
      }
    };
    return app2;
  };
}
function setRef(rawRef, oldRawRef, parentSuspense, vnode, isUnmount = false) {
  if (isArray(rawRef)) {
    rawRef.forEach((r, i) => setRef(r, oldRawRef && (isArray(oldRawRef) ? oldRawRef[i] : oldRawRef), parentSuspense, vnode, isUnmount));
    return;
  }
  if (isAsyncWrapper(vnode) && !isUnmount) {
    return;
  }
  const refValue = vnode.shapeFlag & 4 ? getExposeProxy(vnode.component) || vnode.component.proxy : vnode.el;
  const value = isUnmount ? null : refValue;
  const { i: owner, r: ref2 } = rawRef;
  const oldRef = oldRawRef && oldRawRef.r;
  const refs = owner.refs === EMPTY_OBJ ? owner.refs = {} : owner.refs;
  const setupState = owner.setupState;
  if (oldRef != null && oldRef !== ref2) {
    if (isString(oldRef)) {
      refs[oldRef] = null;
      if (hasOwn(setupState, oldRef)) {
        setupState[oldRef] = null;
      }
    } else if (isRef(oldRef)) {
      oldRef.value = null;
    }
  }
  if (isFunction(ref2)) {
    callWithErrorHandling(ref2, owner, 12, [value, refs]);
  } else {
    const _isString = isString(ref2);
    const _isRef = isRef(ref2);
    if (_isString || _isRef) {
      const doSet = () => {
        if (rawRef.f) {
          const existing = _isString ? refs[ref2] : ref2.value;
          if (isUnmount) {
            isArray(existing) && remove(existing, refValue);
          } else {
            if (!isArray(existing)) {
              if (_isString) {
                refs[ref2] = [refValue];
                if (hasOwn(setupState, ref2)) {
                  setupState[ref2] = refs[ref2];
                }
              } else {
                ref2.value = [refValue];
                if (rawRef.k)
                  refs[rawRef.k] = ref2.value;
              }
            } else if (!existing.includes(refValue)) {
              existing.push(refValue);
            }
          }
        } else if (_isString) {
          refs[ref2] = value;
          if (hasOwn(setupState, ref2)) {
            setupState[ref2] = value;
          }
        } else if (isRef(ref2)) {
          ref2.value = value;
          if (rawRef.k)
            refs[rawRef.k] = value;
        } else
          ;
      };
      if (value) {
        doSet.id = -1;
        queuePostRenderEffect(doSet, parentSuspense);
      } else {
        doSet();
      }
    }
  }
}
const queuePostRenderEffect = queueEffectWithSuspense;
function createRenderer(options) {
  return baseCreateRenderer(options);
}
function baseCreateRenderer(options, createHydrationFns) {
  const target2 = getGlobalThis();
  target2.__VUE__ = true;
  const { insert: hostInsert, remove: hostRemove, patchProp: hostPatchProp, createElement: hostCreateElement, createText: hostCreateText, createComment: hostCreateComment, setText: hostSetText, setElementText: hostSetElementText, parentNode: hostParentNode, nextSibling: hostNextSibling, setScopeId: hostSetScopeId = NOOP, cloneNode: hostCloneNode, insertStaticContent: hostInsertStaticContent } = options;
  const patch = (n1, n2, container, anchor = null, parentComponent = null, parentSuspense = null, isSVG = false, slotScopeIds = null, optimized = !!n2.dynamicChildren) => {
    if (n1 === n2) {
      return;
    }
    if (n1 && !isSameVNodeType(n1, n2)) {
      anchor = getNextHostNode(n1);
      unmount(n1, parentComponent, parentSuspense, true);
      n1 = null;
    }
    if (n2.patchFlag === -2) {
      optimized = false;
      n2.dynamicChildren = null;
    }
    const { type, ref: ref2, shapeFlag } = n2;
    switch (type) {
      case Text:
        processText(n1, n2, container, anchor);
        break;
      case Comment:
        processCommentNode(n1, n2, container, anchor);
        break;
      case Static:
        if (n1 == null) {
          mountStaticNode(n2, container, anchor, isSVG);
        }
        break;
      case Fragment:
        processFragment(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        break;
      default:
        if (shapeFlag & 1) {
          processElement(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        } else if (shapeFlag & 6) {
          processComponent(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        } else if (shapeFlag & 64) {
          type.process(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, internals);
        } else if (shapeFlag & 128) {
          type.process(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, internals);
        } else
          ;
    }
    if (ref2 != null && parentComponent) {
      setRef(ref2, n1 && n1.ref, parentSuspense, n2 || n1, !n2);
    }
  };
  const processText = (n1, n2, container, anchor) => {
    if (n1 == null) {
      hostInsert(n2.el = hostCreateText(n2.children), container, anchor);
    } else {
      const el = n2.el = n1.el;
      if (n2.children !== n1.children) {
        hostSetText(el, n2.children);
      }
    }
  };
  const processCommentNode = (n1, n2, container, anchor) => {
    if (n1 == null) {
      hostInsert(n2.el = hostCreateComment(n2.children || ""), container, anchor);
    } else {
      n2.el = n1.el;
    }
  };
  const mountStaticNode = (n2, container, anchor, isSVG) => {
    [n2.el, n2.anchor] = hostInsertStaticContent(n2.children, container, anchor, isSVG, n2.el, n2.anchor);
  };
  const moveStaticNode = ({ el, anchor }, container, nextSibling) => {
    let next;
    while (el && el !== anchor) {
      next = hostNextSibling(el);
      hostInsert(el, container, nextSibling);
      el = next;
    }
    hostInsert(anchor, container, nextSibling);
  };
  const removeStaticNode = ({ el, anchor }) => {
    let next;
    while (el && el !== anchor) {
      next = hostNextSibling(el);
      hostRemove(el);
      el = next;
    }
    hostRemove(anchor);
  };
  const processElement = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    isSVG = isSVG || n2.type === "svg";
    if (n1 == null) {
      mountElement(n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
    } else {
      patchElement(n1, n2, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
    }
  };
  const mountElement = (vnode, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    let el;
    let vnodeHook;
    const { type, props, shapeFlag, transition, patchFlag, dirs } = vnode;
    if (vnode.el && hostCloneNode !== void 0 && patchFlag === -1) {
      el = vnode.el = hostCloneNode(vnode.el);
    } else {
      el = vnode.el = hostCreateElement(vnode.type, isSVG, props && props.is, props);
      if (shapeFlag & 8) {
        hostSetElementText(el, vnode.children);
      } else if (shapeFlag & 16) {
        mountChildren(vnode.children, el, null, parentComponent, parentSuspense, isSVG && type !== "foreignObject", slotScopeIds, optimized);
      }
      if (dirs) {
        invokeDirectiveHook(vnode, null, parentComponent, "created");
      }
      if (props) {
        for (const key in props) {
          if (key !== "value" && !isReservedProp(key)) {
            hostPatchProp(el, key, null, props[key], isSVG, vnode.children, parentComponent, parentSuspense, unmountChildren);
          }
        }
        if ("value" in props) {
          hostPatchProp(el, "value", null, props.value);
        }
        if (vnodeHook = props.onVnodeBeforeMount) {
          invokeVNodeHook(vnodeHook, parentComponent, vnode);
        }
      }
      setScopeId(el, vnode, vnode.scopeId, slotScopeIds, parentComponent);
    }
    if (dirs) {
      invokeDirectiveHook(vnode, null, parentComponent, "beforeMount");
    }
    const needCallTransitionHooks = (!parentSuspense || parentSuspense && !parentSuspense.pendingBranch) && transition && !transition.persisted;
    if (needCallTransitionHooks) {
      transition.beforeEnter(el);
    }
    hostInsert(el, container, anchor);
    if ((vnodeHook = props && props.onVnodeMounted) || needCallTransitionHooks || dirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
        needCallTransitionHooks && transition.enter(el);
        dirs && invokeDirectiveHook(vnode, null, parentComponent, "mounted");
      }, parentSuspense);
    }
  };
  const setScopeId = (el, vnode, scopeId, slotScopeIds, parentComponent) => {
    if (scopeId) {
      hostSetScopeId(el, scopeId);
    }
    if (slotScopeIds) {
      for (let i = 0; i < slotScopeIds.length; i++) {
        hostSetScopeId(el, slotScopeIds[i]);
      }
    }
    if (parentComponent) {
      let subTree = parentComponent.subTree;
      if (vnode === subTree) {
        const parentVNode = parentComponent.vnode;
        setScopeId(el, parentVNode, parentVNode.scopeId, parentVNode.slotScopeIds, parentComponent.parent);
      }
    }
  };
  const mountChildren = (children, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, start = 0) => {
    for (let i = start; i < children.length; i++) {
      const child = children[i] = optimized ? cloneIfMounted(children[i]) : normalizeVNode(children[i]);
      patch(null, child, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
    }
  };
  const patchElement = (n1, n2, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    const el = n2.el = n1.el;
    let { patchFlag, dynamicChildren, dirs } = n2;
    patchFlag |= n1.patchFlag & 16;
    const oldProps = n1.props || EMPTY_OBJ;
    const newProps = n2.props || EMPTY_OBJ;
    let vnodeHook;
    parentComponent && toggleRecurse(parentComponent, false);
    if (vnodeHook = newProps.onVnodeBeforeUpdate) {
      invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
    }
    if (dirs) {
      invokeDirectiveHook(n2, n1, parentComponent, "beforeUpdate");
    }
    parentComponent && toggleRecurse(parentComponent, true);
    const areChildrenSVG = isSVG && n2.type !== "foreignObject";
    if (dynamicChildren) {
      patchBlockChildren(n1.dynamicChildren, dynamicChildren, el, parentComponent, parentSuspense, areChildrenSVG, slotScopeIds);
    } else if (!optimized) {
      patchChildren(n1, n2, el, null, parentComponent, parentSuspense, areChildrenSVG, slotScopeIds, false);
    }
    if (patchFlag > 0) {
      if (patchFlag & 16) {
        patchProps(el, n2, oldProps, newProps, parentComponent, parentSuspense, isSVG);
      } else {
        if (patchFlag & 2) {
          if (oldProps.class !== newProps.class) {
            hostPatchProp(el, "class", null, newProps.class, isSVG);
          }
        }
        if (patchFlag & 4) {
          hostPatchProp(el, "style", oldProps.style, newProps.style, isSVG);
        }
        if (patchFlag & 8) {
          const propsToUpdate = n2.dynamicProps;
          for (let i = 0; i < propsToUpdate.length; i++) {
            const key = propsToUpdate[i];
            const prev = oldProps[key];
            const next = newProps[key];
            if (next !== prev || key === "value") {
              hostPatchProp(el, key, prev, next, isSVG, n1.children, parentComponent, parentSuspense, unmountChildren);
            }
          }
        }
      }
      if (patchFlag & 1) {
        if (n1.children !== n2.children) {
          hostSetElementText(el, n2.children);
        }
      }
    } else if (!optimized && dynamicChildren == null) {
      patchProps(el, n2, oldProps, newProps, parentComponent, parentSuspense, isSVG);
    }
    if ((vnodeHook = newProps.onVnodeUpdated) || dirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
        dirs && invokeDirectiveHook(n2, n1, parentComponent, "updated");
      }, parentSuspense);
    }
  };
  const patchBlockChildren = (oldChildren, newChildren, fallbackContainer, parentComponent, parentSuspense, isSVG, slotScopeIds) => {
    for (let i = 0; i < newChildren.length; i++) {
      const oldVNode = oldChildren[i];
      const newVNode = newChildren[i];
      const container = oldVNode.el && (oldVNode.type === Fragment || !isSameVNodeType(oldVNode, newVNode) || oldVNode.shapeFlag & (6 | 64)) ? hostParentNode(oldVNode.el) : fallbackContainer;
      patch(oldVNode, newVNode, container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, true);
    }
  };
  const patchProps = (el, vnode, oldProps, newProps, parentComponent, parentSuspense, isSVG) => {
    if (oldProps !== newProps) {
      for (const key in newProps) {
        if (isReservedProp(key))
          continue;
        const next = newProps[key];
        const prev = oldProps[key];
        if (next !== prev && key !== "value") {
          hostPatchProp(el, key, prev, next, isSVG, vnode.children, parentComponent, parentSuspense, unmountChildren);
        }
      }
      if (oldProps !== EMPTY_OBJ) {
        for (const key in oldProps) {
          if (!isReservedProp(key) && !(key in newProps)) {
            hostPatchProp(el, key, oldProps[key], null, isSVG, vnode.children, parentComponent, parentSuspense, unmountChildren);
          }
        }
      }
      if ("value" in newProps) {
        hostPatchProp(el, "value", oldProps.value, newProps.value);
      }
    }
  };
  const processFragment = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    const fragmentStartAnchor = n2.el = n1 ? n1.el : hostCreateText("");
    const fragmentEndAnchor = n2.anchor = n1 ? n1.anchor : hostCreateText("");
    let { patchFlag, dynamicChildren, slotScopeIds: fragmentSlotScopeIds } = n2;
    if (fragmentSlotScopeIds) {
      slotScopeIds = slotScopeIds ? slotScopeIds.concat(fragmentSlotScopeIds) : fragmentSlotScopeIds;
    }
    if (n1 == null) {
      hostInsert(fragmentStartAnchor, container, anchor);
      hostInsert(fragmentEndAnchor, container, anchor);
      mountChildren(n2.children, container, fragmentEndAnchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
    } else {
      if (patchFlag > 0 && patchFlag & 64 && dynamicChildren && n1.dynamicChildren) {
        patchBlockChildren(n1.dynamicChildren, dynamicChildren, container, parentComponent, parentSuspense, isSVG, slotScopeIds);
        if (n2.key != null || parentComponent && n2 === parentComponent.subTree) {
          traverseStaticChildren(n1, n2, true);
        }
      } else {
        patchChildren(n1, n2, container, fragmentEndAnchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
      }
    }
  };
  const processComponent = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    n2.slotScopeIds = slotScopeIds;
    if (n1 == null) {
      if (n2.shapeFlag & 512) {
        parentComponent.ctx.activate(n2, container, anchor, isSVG, optimized);
      } else {
        mountComponent(n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized);
      }
    } else {
      updateComponent(n1, n2, optimized);
    }
  };
  const mountComponent = (initialVNode, container, anchor, parentComponent, parentSuspense, isSVG, optimized) => {
    const instance = initialVNode.component = createComponentInstance(initialVNode, parentComponent, parentSuspense);
    if (isKeepAlive(initialVNode)) {
      instance.ctx.renderer = internals;
    }
    {
      setupComponent(instance);
    }
    if (instance.asyncDep) {
      parentSuspense && parentSuspense.registerDep(instance, setupRenderEffect);
      if (!initialVNode.el) {
        const placeholder = instance.subTree = createVNode(Comment);
        processCommentNode(null, placeholder, container, anchor);
      }
      return;
    }
    setupRenderEffect(instance, initialVNode, container, anchor, parentSuspense, isSVG, optimized);
  };
  const updateComponent = (n1, n2, optimized) => {
    const instance = n2.component = n1.component;
    if (shouldUpdateComponent(n1, n2, optimized)) {
      if (instance.asyncDep && !instance.asyncResolved) {
        updateComponentPreRender(instance, n2, optimized);
        return;
      } else {
        instance.next = n2;
        invalidateJob(instance.update);
        instance.update();
      }
    } else {
      n2.el = n1.el;
      instance.vnode = n2;
    }
  };
  const setupRenderEffect = (instance, initialVNode, container, anchor, parentSuspense, isSVG, optimized) => {
    const componentUpdateFn = () => {
      if (!instance.isMounted) {
        let vnodeHook;
        const { el, props } = initialVNode;
        const { bm, m, parent } = instance;
        const isAsyncWrapperVNode = isAsyncWrapper(initialVNode);
        toggleRecurse(instance, false);
        if (bm) {
          invokeArrayFns(bm);
        }
        if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeBeforeMount)) {
          invokeVNodeHook(vnodeHook, parent, initialVNode);
        }
        toggleRecurse(instance, true);
        if (el && hydrateNode) {
          const hydrateSubTree = () => {
            instance.subTree = renderComponentRoot(instance);
            hydrateNode(el, instance.subTree, instance, parentSuspense, null);
          };
          if (isAsyncWrapperVNode) {
            initialVNode.type.__asyncLoader().then(() => !instance.isUnmounted && hydrateSubTree());
          } else {
            hydrateSubTree();
          }
        } else {
          const subTree = instance.subTree = renderComponentRoot(instance);
          patch(null, subTree, container, anchor, instance, parentSuspense, isSVG);
          initialVNode.el = subTree.el;
        }
        if (m) {
          queuePostRenderEffect(m, parentSuspense);
        }
        if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeMounted)) {
          const scopedInitialVNode = initialVNode;
          queuePostRenderEffect(() => invokeVNodeHook(vnodeHook, parent, scopedInitialVNode), parentSuspense);
        }
        if (initialVNode.shapeFlag & 256 || parent && isAsyncWrapper(parent.vnode) && parent.vnode.shapeFlag & 256) {
          instance.a && queuePostRenderEffect(instance.a, parentSuspense);
        }
        instance.isMounted = true;
        initialVNode = container = anchor = null;
      } else {
        let { next, bu, u, parent, vnode } = instance;
        let originNext = next;
        let vnodeHook;
        toggleRecurse(instance, false);
        if (next) {
          next.el = vnode.el;
          updateComponentPreRender(instance, next, optimized);
        } else {
          next = vnode;
        }
        if (bu) {
          invokeArrayFns(bu);
        }
        if (vnodeHook = next.props && next.props.onVnodeBeforeUpdate) {
          invokeVNodeHook(vnodeHook, parent, next, vnode);
        }
        toggleRecurse(instance, true);
        const nextTree = renderComponentRoot(instance);
        const prevTree = instance.subTree;
        instance.subTree = nextTree;
        patch(prevTree, nextTree, hostParentNode(prevTree.el), getNextHostNode(prevTree), instance, parentSuspense, isSVG);
        next.el = nextTree.el;
        if (originNext === null) {
          updateHOCHostEl(instance, nextTree.el);
        }
        if (u) {
          queuePostRenderEffect(u, parentSuspense);
        }
        if (vnodeHook = next.props && next.props.onVnodeUpdated) {
          queuePostRenderEffect(() => invokeVNodeHook(vnodeHook, parent, next, vnode), parentSuspense);
        }
      }
    };
    const effect = instance.effect = new ReactiveEffect(componentUpdateFn, () => queueJob(update2), instance.scope);
    const update2 = instance.update = () => effect.run();
    update2.id = instance.uid;
    toggleRecurse(instance, true);
    update2();
  };
  const updateComponentPreRender = (instance, nextVNode, optimized) => {
    nextVNode.component = instance;
    const prevProps = instance.vnode.props;
    instance.vnode = nextVNode;
    instance.next = null;
    updateProps(instance, nextVNode.props, prevProps, optimized);
    updateSlots(instance, nextVNode.children, optimized);
    pauseTracking();
    flushPreFlushCbs(void 0, instance.update);
    resetTracking();
  };
  const patchChildren = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized = false) => {
    const c1 = n1 && n1.children;
    const prevShapeFlag = n1 ? n1.shapeFlag : 0;
    const c2 = n2.children;
    const { patchFlag, shapeFlag } = n2;
    if (patchFlag > 0) {
      if (patchFlag & 128) {
        patchKeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        return;
      } else if (patchFlag & 256) {
        patchUnkeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        return;
      }
    }
    if (shapeFlag & 8) {
      if (prevShapeFlag & 16) {
        unmountChildren(c1, parentComponent, parentSuspense);
      }
      if (c2 !== c1) {
        hostSetElementText(container, c2);
      }
    } else {
      if (prevShapeFlag & 16) {
        if (shapeFlag & 16) {
          patchKeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        } else {
          unmountChildren(c1, parentComponent, parentSuspense, true);
        }
      } else {
        if (prevShapeFlag & 8) {
          hostSetElementText(container, "");
        }
        if (shapeFlag & 16) {
          mountChildren(c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        }
      }
    }
  };
  const patchUnkeyedChildren = (c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    c1 = c1 || EMPTY_ARR;
    c2 = c2 || EMPTY_ARR;
    const oldLength = c1.length;
    const newLength = c2.length;
    const commonLength = Math.min(oldLength, newLength);
    let i;
    for (i = 0; i < commonLength; i++) {
      const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
      patch(c1[i], nextChild, container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
    }
    if (oldLength > newLength) {
      unmountChildren(c1, parentComponent, parentSuspense, true, false, commonLength);
    } else {
      mountChildren(c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, commonLength);
    }
  };
  const patchKeyedChildren = (c1, c2, container, parentAnchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    let i = 0;
    const l2 = c2.length;
    let e1 = c1.length - 1;
    let e2 = l2 - 1;
    while (i <= e1 && i <= e2) {
      const n1 = c1[i];
      const n2 = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
      if (isSameVNodeType(n1, n2)) {
        patch(n1, n2, container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
      } else {
        break;
      }
      i++;
    }
    while (i <= e1 && i <= e2) {
      const n1 = c1[e1];
      const n2 = c2[e2] = optimized ? cloneIfMounted(c2[e2]) : normalizeVNode(c2[e2]);
      if (isSameVNodeType(n1, n2)) {
        patch(n1, n2, container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
      } else {
        break;
      }
      e1--;
      e2--;
    }
    if (i > e1) {
      if (i <= e2) {
        const nextPos = e2 + 1;
        const anchor = nextPos < l2 ? c2[nextPos].el : parentAnchor;
        while (i <= e2) {
          patch(null, c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]), container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
          i++;
        }
      }
    } else if (i > e2) {
      while (i <= e1) {
        unmount(c1[i], parentComponent, parentSuspense, true);
        i++;
      }
    } else {
      const s1 = i;
      const s2 = i;
      const keyToNewIndexMap = /* @__PURE__ */ new Map();
      for (i = s2; i <= e2; i++) {
        const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
        if (nextChild.key != null) {
          keyToNewIndexMap.set(nextChild.key, i);
        }
      }
      let j;
      let patched = 0;
      const toBePatched = e2 - s2 + 1;
      let moved = false;
      let maxNewIndexSoFar = 0;
      const newIndexToOldIndexMap = new Array(toBePatched);
      for (i = 0; i < toBePatched; i++)
        newIndexToOldIndexMap[i] = 0;
      for (i = s1; i <= e1; i++) {
        const prevChild = c1[i];
        if (patched >= toBePatched) {
          unmount(prevChild, parentComponent, parentSuspense, true);
          continue;
        }
        let newIndex;
        if (prevChild.key != null) {
          newIndex = keyToNewIndexMap.get(prevChild.key);
        } else {
          for (j = s2; j <= e2; j++) {
            if (newIndexToOldIndexMap[j - s2] === 0 && isSameVNodeType(prevChild, c2[j])) {
              newIndex = j;
              break;
            }
          }
        }
        if (newIndex === void 0) {
          unmount(prevChild, parentComponent, parentSuspense, true);
        } else {
          newIndexToOldIndexMap[newIndex - s2] = i + 1;
          if (newIndex >= maxNewIndexSoFar) {
            maxNewIndexSoFar = newIndex;
          } else {
            moved = true;
          }
          patch(prevChild, c2[newIndex], container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
          patched++;
        }
      }
      const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : EMPTY_ARR;
      j = increasingNewIndexSequence.length - 1;
      for (i = toBePatched - 1; i >= 0; i--) {
        const nextIndex = s2 + i;
        const nextChild = c2[nextIndex];
        const anchor = nextIndex + 1 < l2 ? c2[nextIndex + 1].el : parentAnchor;
        if (newIndexToOldIndexMap[i] === 0) {
          patch(null, nextChild, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        } else if (moved) {
          if (j < 0 || i !== increasingNewIndexSequence[j]) {
            move(nextChild, container, anchor, 2);
          } else {
            j--;
          }
        }
      }
    }
  };
  const move = (vnode, container, anchor, moveType, parentSuspense = null) => {
    const { el, type, transition, children, shapeFlag } = vnode;
    if (shapeFlag & 6) {
      move(vnode.component.subTree, container, anchor, moveType);
      return;
    }
    if (shapeFlag & 128) {
      vnode.suspense.move(container, anchor, moveType);
      return;
    }
    if (shapeFlag & 64) {
      type.move(vnode, container, anchor, internals);
      return;
    }
    if (type === Fragment) {
      hostInsert(el, container, anchor);
      for (let i = 0; i < children.length; i++) {
        move(children[i], container, anchor, moveType);
      }
      hostInsert(vnode.anchor, container, anchor);
      return;
    }
    if (type === Static) {
      moveStaticNode(vnode, container, anchor);
      return;
    }
    const needTransition = moveType !== 2 && shapeFlag & 1 && transition;
    if (needTransition) {
      if (moveType === 0) {
        transition.beforeEnter(el);
        hostInsert(el, container, anchor);
        queuePostRenderEffect(() => transition.enter(el), parentSuspense);
      } else {
        const { leave, delayLeave, afterLeave } = transition;
        const remove3 = () => hostInsert(el, container, anchor);
        const performLeave = () => {
          leave(el, () => {
            remove3();
            afterLeave && afterLeave();
          });
        };
        if (delayLeave) {
          delayLeave(el, remove3, performLeave);
        } else {
          performLeave();
        }
      }
    } else {
      hostInsert(el, container, anchor);
    }
  };
  const unmount = (vnode, parentComponent, parentSuspense, doRemove = false, optimized = false) => {
    const { type, props, ref: ref2, children, dynamicChildren, shapeFlag, patchFlag, dirs } = vnode;
    if (ref2 != null) {
      setRef(ref2, null, parentSuspense, vnode, true);
    }
    if (shapeFlag & 256) {
      parentComponent.ctx.deactivate(vnode);
      return;
    }
    const shouldInvokeDirs = shapeFlag & 1 && dirs;
    const shouldInvokeVnodeHook = !isAsyncWrapper(vnode);
    let vnodeHook;
    if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeBeforeUnmount)) {
      invokeVNodeHook(vnodeHook, parentComponent, vnode);
    }
    if (shapeFlag & 6) {
      unmountComponent(vnode.component, parentSuspense, doRemove);
    } else {
      if (shapeFlag & 128) {
        vnode.suspense.unmount(parentSuspense, doRemove);
        return;
      }
      if (shouldInvokeDirs) {
        invokeDirectiveHook(vnode, null, parentComponent, "beforeUnmount");
      }
      if (shapeFlag & 64) {
        vnode.type.remove(vnode, parentComponent, parentSuspense, optimized, internals, doRemove);
      } else if (dynamicChildren && (type !== Fragment || patchFlag > 0 && patchFlag & 64)) {
        unmountChildren(dynamicChildren, parentComponent, parentSuspense, false, true);
      } else if (type === Fragment && patchFlag & (128 | 256) || !optimized && shapeFlag & 16) {
        unmountChildren(children, parentComponent, parentSuspense);
      }
      if (doRemove) {
        remove2(vnode);
      }
    }
    if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeUnmounted) || shouldInvokeDirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
        shouldInvokeDirs && invokeDirectiveHook(vnode, null, parentComponent, "unmounted");
      }, parentSuspense);
    }
  };
  const remove2 = (vnode) => {
    const { type, el, anchor, transition } = vnode;
    if (type === Fragment) {
      {
        removeFragment(el, anchor);
      }
      return;
    }
    if (type === Static) {
      removeStaticNode(vnode);
      return;
    }
    const performRemove = () => {
      hostRemove(el);
      if (transition && !transition.persisted && transition.afterLeave) {
        transition.afterLeave();
      }
    };
    if (vnode.shapeFlag & 1 && transition && !transition.persisted) {
      const { leave, delayLeave } = transition;
      const performLeave = () => leave(el, performRemove);
      if (delayLeave) {
        delayLeave(vnode.el, performRemove, performLeave);
      } else {
        performLeave();
      }
    } else {
      performRemove();
    }
  };
  const removeFragment = (cur, end) => {
    let next;
    while (cur !== end) {
      next = hostNextSibling(cur);
      hostRemove(cur);
      cur = next;
    }
    hostRemove(end);
  };
  const unmountComponent = (instance, parentSuspense, doRemove) => {
    const { bum, scope, update: update2, subTree, um } = instance;
    if (bum) {
      invokeArrayFns(bum);
    }
    scope.stop();
    if (update2) {
      update2.active = false;
      unmount(subTree, instance, parentSuspense, doRemove);
    }
    if (um) {
      queuePostRenderEffect(um, parentSuspense);
    }
    queuePostRenderEffect(() => {
      instance.isUnmounted = true;
    }, parentSuspense);
    if (parentSuspense && parentSuspense.pendingBranch && !parentSuspense.isUnmounted && instance.asyncDep && !instance.asyncResolved && instance.suspenseId === parentSuspense.pendingId) {
      parentSuspense.deps--;
      if (parentSuspense.deps === 0) {
        parentSuspense.resolve();
      }
    }
  };
  const unmountChildren = (children, parentComponent, parentSuspense, doRemove = false, optimized = false, start = 0) => {
    for (let i = start; i < children.length; i++) {
      unmount(children[i], parentComponent, parentSuspense, doRemove, optimized);
    }
  };
  const getNextHostNode = (vnode) => {
    if (vnode.shapeFlag & 6) {
      return getNextHostNode(vnode.component.subTree);
    }
    if (vnode.shapeFlag & 128) {
      return vnode.suspense.next();
    }
    return hostNextSibling(vnode.anchor || vnode.el);
  };
  const render = (vnode, container, isSVG) => {
    if (vnode == null) {
      if (container._vnode) {
        unmount(container._vnode, null, null, true);
      }
    } else {
      patch(container._vnode || null, vnode, container, null, null, null, isSVG);
    }
    flushPostFlushCbs();
    container._vnode = vnode;
  };
  const internals = {
    p: patch,
    um: unmount,
    m: move,
    r: remove2,
    mt: mountComponent,
    mc: mountChildren,
    pc: patchChildren,
    pbc: patchBlockChildren,
    n: getNextHostNode,
    o: options
  };
  let hydrate;
  let hydrateNode;
  if (createHydrationFns) {
    [hydrate, hydrateNode] = createHydrationFns(internals);
  }
  return {
    render,
    hydrate,
    createApp: createAppAPI(render, hydrate)
  };
}
function toggleRecurse({ effect, update: update2 }, allowed) {
  effect.allowRecurse = update2.allowRecurse = allowed;
}
function traverseStaticChildren(n1, n2, shallow = false) {
  const ch1 = n1.children;
  const ch2 = n2.children;
  if (isArray(ch1) && isArray(ch2)) {
    for (let i = 0; i < ch1.length; i++) {
      const c1 = ch1[i];
      let c2 = ch2[i];
      if (c2.shapeFlag & 1 && !c2.dynamicChildren) {
        if (c2.patchFlag <= 0 || c2.patchFlag === 32) {
          c2 = ch2[i] = cloneIfMounted(ch2[i]);
          c2.el = c1.el;
        }
        if (!shallow)
          traverseStaticChildren(c1, c2);
      }
    }
  }
}
function getSequence(arr) {
  const p2 = arr.slice();
  const result = [0];
  let i, j, u, v, c;
  const len = arr.length;
  for (i = 0; i < len; i++) {
    const arrI = arr[i];
    if (arrI !== 0) {
      j = result[result.length - 1];
      if (arr[j] < arrI) {
        p2[i] = j;
        result.push(i);
        continue;
      }
      u = 0;
      v = result.length - 1;
      while (u < v) {
        c = u + v >> 1;
        if (arr[result[c]] < arrI) {
          u = c + 1;
        } else {
          v = c;
        }
      }
      if (arrI < arr[result[u]]) {
        if (u > 0) {
          p2[i] = result[u - 1];
        }
        result[u] = i;
      }
    }
  }
  u = result.length;
  v = result[u - 1];
  while (u-- > 0) {
    result[u] = v;
    v = p2[v];
  }
  return result;
}
const isTeleport = (type) => type.__isTeleport;
const isTeleportDisabled = (props) => props && (props.disabled || props.disabled === "");
const isTargetSVG = (target2) => typeof SVGElement !== "undefined" && target2 instanceof SVGElement;
const resolveTarget = (props, select) => {
  const targetSelector = props && props.to;
  if (isString(targetSelector)) {
    if (!select) {
      return null;
    } else {
      const target2 = select(targetSelector);
      return target2;
    }
  } else {
    return targetSelector;
  }
};
const TeleportImpl = {
  __isTeleport: true,
  process(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, internals) {
    const { mc: mountChildren, pc: patchChildren, pbc: patchBlockChildren, o: { insert, querySelector, createText, createComment } } = internals;
    const disabled = isTeleportDisabled(n2.props);
    let { shapeFlag, children, dynamicChildren } = n2;
    if (n1 == null) {
      const placeholder = n2.el = createText("");
      const mainAnchor = n2.anchor = createText("");
      insert(placeholder, container, anchor);
      insert(mainAnchor, container, anchor);
      const target2 = n2.target = resolveTarget(n2.props, querySelector);
      const targetAnchor = n2.targetAnchor = createText("");
      if (target2) {
        insert(targetAnchor, target2);
        isSVG = isSVG || isTargetSVG(target2);
      }
      const mount = (container2, anchor2) => {
        if (shapeFlag & 16) {
          mountChildren(children, container2, anchor2, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        }
      };
      if (disabled) {
        mount(container, mainAnchor);
      } else if (target2) {
        mount(target2, targetAnchor);
      }
    } else {
      n2.el = n1.el;
      const mainAnchor = n2.anchor = n1.anchor;
      const target2 = n2.target = n1.target;
      const targetAnchor = n2.targetAnchor = n1.targetAnchor;
      const wasDisabled = isTeleportDisabled(n1.props);
      const currentContainer = wasDisabled ? container : target2;
      const currentAnchor = wasDisabled ? mainAnchor : targetAnchor;
      isSVG = isSVG || isTargetSVG(target2);
      if (dynamicChildren) {
        patchBlockChildren(n1.dynamicChildren, dynamicChildren, currentContainer, parentComponent, parentSuspense, isSVG, slotScopeIds);
        traverseStaticChildren(n1, n2, true);
      } else if (!optimized) {
        patchChildren(n1, n2, currentContainer, currentAnchor, parentComponent, parentSuspense, isSVG, slotScopeIds, false);
      }
      if (disabled) {
        if (!wasDisabled) {
          moveTeleport(n2, container, mainAnchor, internals, 1);
        }
      } else {
        if ((n2.props && n2.props.to) !== (n1.props && n1.props.to)) {
          const nextTarget = n2.target = resolveTarget(n2.props, querySelector);
          if (nextTarget) {
            moveTeleport(n2, nextTarget, null, internals, 0);
          }
        } else if (wasDisabled) {
          moveTeleport(n2, target2, targetAnchor, internals, 1);
        }
      }
    }
  },
  remove(vnode, parentComponent, parentSuspense, optimized, { um: unmount, o: { remove: hostRemove } }, doRemove) {
    const { shapeFlag, children, anchor, targetAnchor, target: target2, props } = vnode;
    if (target2) {
      hostRemove(targetAnchor);
    }
    if (doRemove || !isTeleportDisabled(props)) {
      hostRemove(anchor);
      if (shapeFlag & 16) {
        for (let i = 0; i < children.length; i++) {
          const child = children[i];
          unmount(child, parentComponent, parentSuspense, true, !!child.dynamicChildren);
        }
      }
    }
  },
  move: moveTeleport,
  hydrate: hydrateTeleport
};
function moveTeleport(vnode, container, parentAnchor, { o: { insert }, m: move }, moveType = 2) {
  if (moveType === 0) {
    insert(vnode.targetAnchor, container, parentAnchor);
  }
  const { el, anchor, shapeFlag, children, props } = vnode;
  const isReorder = moveType === 2;
  if (isReorder) {
    insert(el, container, parentAnchor);
  }
  if (!isReorder || isTeleportDisabled(props)) {
    if (shapeFlag & 16) {
      for (let i = 0; i < children.length; i++) {
        move(children[i], container, parentAnchor, 2);
      }
    }
  }
  if (isReorder) {
    insert(anchor, container, parentAnchor);
  }
}
function hydrateTeleport(node, vnode, parentComponent, parentSuspense, slotScopeIds, optimized, { o: { nextSibling, parentNode, querySelector } }, hydrateChildren) {
  const target2 = vnode.target = resolveTarget(vnode.props, querySelector);
  if (target2) {
    const targetNode = target2._lpa || target2.firstChild;
    if (vnode.shapeFlag & 16) {
      if (isTeleportDisabled(vnode.props)) {
        vnode.anchor = hydrateChildren(nextSibling(node), vnode, parentNode(node), parentComponent, parentSuspense, slotScopeIds, optimized);
        vnode.targetAnchor = targetNode;
      } else {
        vnode.anchor = nextSibling(node);
        let targetAnchor = targetNode;
        while (targetAnchor) {
          targetAnchor = nextSibling(targetAnchor);
          if (targetAnchor && targetAnchor.nodeType === 8 && targetAnchor.data === "teleport anchor") {
            vnode.targetAnchor = targetAnchor;
            target2._lpa = vnode.targetAnchor && nextSibling(vnode.targetAnchor);
            break;
          }
        }
        hydrateChildren(targetNode, vnode, target2, parentComponent, parentSuspense, slotScopeIds, optimized);
      }
    }
  }
  return vnode.anchor && nextSibling(vnode.anchor);
}
const Teleport = TeleportImpl;
const Fragment = Symbol(void 0);
const Text = Symbol(void 0);
const Comment = Symbol(void 0);
const Static = Symbol(void 0);
const blockStack = [];
let currentBlock = null;
function openBlock(disableTracking = false) {
  blockStack.push(currentBlock = disableTracking ? null : []);
}
function closeBlock() {
  blockStack.pop();
  currentBlock = blockStack[blockStack.length - 1] || null;
}
let isBlockTreeEnabled = 1;
function setBlockTracking(value) {
  isBlockTreeEnabled += value;
}
function setupBlock(vnode) {
  vnode.dynamicChildren = isBlockTreeEnabled > 0 ? currentBlock || EMPTY_ARR : null;
  closeBlock();
  if (isBlockTreeEnabled > 0 && currentBlock) {
    currentBlock.push(vnode);
  }
  return vnode;
}
function createElementBlock(type, props, children, patchFlag, dynamicProps, shapeFlag) {
  return setupBlock(createBaseVNode(type, props, children, patchFlag, dynamicProps, shapeFlag, true));
}
function createBlock(type, props, children, patchFlag, dynamicProps) {
  return setupBlock(createVNode(type, props, children, patchFlag, dynamicProps, true));
}
function isVNode(value) {
  return value ? value.__v_isVNode === true : false;
}
function isSameVNodeType(n1, n2) {
  return n1.type === n2.type && n1.key === n2.key;
}
const InternalObjectKey = `__vInternal`;
const normalizeKey = ({ key }) => key != null ? key : null;
const normalizeRef = ({ ref: ref2, ref_key, ref_for }) => {
  return ref2 != null ? isString(ref2) || isRef(ref2) || isFunction(ref2) ? { i: currentRenderingInstance, r: ref2, k: ref_key, f: !!ref_for } : ref2 : null;
};
function createBaseVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, shapeFlag = type === Fragment ? 0 : 1, isBlockNode = false, needFullChildrenNormalization = false) {
  const vnode = {
    __v_isVNode: true,
    __v_skip: true,
    type,
    props,
    key: props && normalizeKey(props),
    ref: props && normalizeRef(props),
    scopeId: currentScopeId,
    slotScopeIds: null,
    children,
    component: null,
    suspense: null,
    ssContent: null,
    ssFallback: null,
    dirs: null,
    transition: null,
    el: null,
    anchor: null,
    target: null,
    targetAnchor: null,
    staticCount: 0,
    shapeFlag,
    patchFlag,
    dynamicProps,
    dynamicChildren: null,
    appContext: null
  };
  if (needFullChildrenNormalization) {
    normalizeChildren(vnode, children);
    if (shapeFlag & 128) {
      type.normalize(vnode);
    }
  } else if (children) {
    vnode.shapeFlag |= isString(children) ? 8 : 16;
  }
  if (isBlockTreeEnabled > 0 && !isBlockNode && currentBlock && (vnode.patchFlag > 0 || shapeFlag & 6) && vnode.patchFlag !== 32) {
    currentBlock.push(vnode);
  }
  return vnode;
}
const createVNode = _createVNode;
function _createVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, isBlockNode = false) {
  if (!type || type === NULL_DYNAMIC_COMPONENT) {
    type = Comment;
  }
  if (isVNode(type)) {
    const cloned = cloneVNode(type, props, true);
    if (children) {
      normalizeChildren(cloned, children);
    }
    if (isBlockTreeEnabled > 0 && !isBlockNode && currentBlock) {
      if (cloned.shapeFlag & 6) {
        currentBlock[currentBlock.indexOf(type)] = cloned;
      } else {
        currentBlock.push(cloned);
      }
    }
    cloned.patchFlag |= -2;
    return cloned;
  }
  if (isClassComponent(type)) {
    type = type.__vccOpts;
  }
  if (props) {
    props = guardReactiveProps(props);
    let { class: klass, style } = props;
    if (klass && !isString(klass)) {
      props.class = normalizeClass(klass);
    }
    if (isObject$1(style)) {
      if (isProxy(style) && !isArray(style)) {
        style = extend({}, style);
      }
      props.style = normalizeStyle(style);
    }
  }
  const shapeFlag = isString(type) ? 1 : isSuspense(type) ? 128 : isTeleport(type) ? 64 : isObject$1(type) ? 4 : isFunction(type) ? 2 : 0;
  return createBaseVNode(type, props, children, patchFlag, dynamicProps, shapeFlag, isBlockNode, true);
}
function guardReactiveProps(props) {
  if (!props)
    return null;
  return isProxy(props) || InternalObjectKey in props ? extend({}, props) : props;
}
function cloneVNode(vnode, extraProps, mergeRef = false) {
  const { props, ref: ref2, patchFlag, children } = vnode;
  const mergedProps = extraProps ? mergeProps(props || {}, extraProps) : props;
  const cloned = {
    __v_isVNode: true,
    __v_skip: true,
    type: vnode.type,
    props: mergedProps,
    key: mergedProps && normalizeKey(mergedProps),
    ref: extraProps && extraProps.ref ? mergeRef && ref2 ? isArray(ref2) ? ref2.concat(normalizeRef(extraProps)) : [ref2, normalizeRef(extraProps)] : normalizeRef(extraProps) : ref2,
    scopeId: vnode.scopeId,
    slotScopeIds: vnode.slotScopeIds,
    children,
    target: vnode.target,
    targetAnchor: vnode.targetAnchor,
    staticCount: vnode.staticCount,
    shapeFlag: vnode.shapeFlag,
    patchFlag: extraProps && vnode.type !== Fragment ? patchFlag === -1 ? 16 : patchFlag | 16 : patchFlag,
    dynamicProps: vnode.dynamicProps,
    dynamicChildren: vnode.dynamicChildren,
    appContext: vnode.appContext,
    dirs: vnode.dirs,
    transition: vnode.transition,
    component: vnode.component,
    suspense: vnode.suspense,
    ssContent: vnode.ssContent && cloneVNode(vnode.ssContent),
    ssFallback: vnode.ssFallback && cloneVNode(vnode.ssFallback),
    el: vnode.el,
    anchor: vnode.anchor
  };
  return cloned;
}
function createTextVNode(text = " ", flag = 0) {
  return createVNode(Text, null, text, flag);
}
function createCommentVNode(text, asBlock) {
  return asBlock ? (openBlock(), createBlock(Comment, null, text)) : createVNode(Comment, null, text);
}
function normalizeVNode(child) {
  if (child == null || typeof child === "boolean") {
    return createVNode(Comment);
  } else if (isArray(child)) {
    return createVNode(Fragment, null, child.slice());
  } else if (typeof child === "object") {
    return cloneIfMounted(child);
  } else {
    return createVNode(Text, null, String(child));
  }
}
function cloneIfMounted(child) {
  return child.el === null || child.memo ? child : cloneVNode(child);
}
function normalizeChildren(vnode, children) {
  let type = 0;
  const { shapeFlag } = vnode;
  if (children == null) {
    children = null;
  } else if (isArray(children)) {
    type = 16;
  } else if (typeof children === "object") {
    if (shapeFlag & (1 | 64)) {
      const slot = children.default;
      if (slot) {
        slot._c && (slot._d = false);
        normalizeChildren(vnode, slot());
        slot._c && (slot._d = true);
      }
      return;
    } else {
      type = 32;
      const slotFlag = children._;
      if (!slotFlag && !(InternalObjectKey in children)) {
        children._ctx = currentRenderingInstance;
      } else if (slotFlag === 3 && currentRenderingInstance) {
        if (currentRenderingInstance.slots._ === 1) {
          children._ = 1;
        } else {
          children._ = 2;
          vnode.patchFlag |= 1024;
        }
      }
    }
  } else if (isFunction(children)) {
    children = { default: children, _ctx: currentRenderingInstance };
    type = 32;
  } else {
    children = String(children);
    if (shapeFlag & 64) {
      type = 16;
      children = [createTextVNode(children)];
    } else {
      type = 8;
    }
  }
  vnode.children = children;
  vnode.shapeFlag |= type;
}
function mergeProps(...args) {
  const ret = {};
  for (let i = 0; i < args.length; i++) {
    const toMerge = args[i];
    for (const key in toMerge) {
      if (key === "class") {
        if (ret.class !== toMerge.class) {
          ret.class = normalizeClass([ret.class, toMerge.class]);
        }
      } else if (key === "style") {
        ret.style = normalizeStyle([ret.style, toMerge.style]);
      } else if (isOn(key)) {
        const existing = ret[key];
        const incoming = toMerge[key];
        if (incoming && existing !== incoming && !(isArray(existing) && existing.includes(incoming))) {
          ret[key] = existing ? [].concat(existing, incoming) : incoming;
        }
      } else if (key !== "") {
        ret[key] = toMerge[key];
      }
    }
  }
  return ret;
}
function invokeVNodeHook(hook, instance, vnode, prevVNode = null) {
  callWithAsyncErrorHandling(hook, instance, 7, [
    vnode,
    prevVNode
  ]);
}
const emptyAppContext = createAppContext();
let uid$1$1 = 0;
function createComponentInstance(vnode, parent, suspense) {
  const type = vnode.type;
  const appContext = (parent ? parent.appContext : vnode.appContext) || emptyAppContext;
  const instance = {
    uid: uid$1$1++,
    vnode,
    type,
    parent,
    appContext,
    root: null,
    next: null,
    subTree: null,
    effect: null,
    update: null,
    scope: new EffectScope(true),
    render: null,
    proxy: null,
    exposed: null,
    exposeProxy: null,
    withProxy: null,
    provides: parent ? parent.provides : Object.create(appContext.provides),
    accessCache: null,
    renderCache: [],
    components: null,
    directives: null,
    propsOptions: normalizePropsOptions(type, appContext),
    emitsOptions: normalizeEmitsOptions(type, appContext),
    emit: null,
    emitted: null,
    propsDefaults: EMPTY_OBJ,
    inheritAttrs: type.inheritAttrs,
    ctx: EMPTY_OBJ,
    data: EMPTY_OBJ,
    props: EMPTY_OBJ,
    attrs: EMPTY_OBJ,
    slots: EMPTY_OBJ,
    refs: EMPTY_OBJ,
    setupState: EMPTY_OBJ,
    setupContext: null,
    suspense,
    suspenseId: suspense ? suspense.pendingId : 0,
    asyncDep: null,
    asyncResolved: false,
    isMounted: false,
    isUnmounted: false,
    isDeactivated: false,
    bc: null,
    c: null,
    bm: null,
    m: null,
    bu: null,
    u: null,
    um: null,
    bum: null,
    da: null,
    a: null,
    rtg: null,
    rtc: null,
    ec: null,
    sp: null
  };
  {
    instance.ctx = { _: instance };
  }
  instance.root = parent ? parent.root : instance;
  instance.emit = emit$1.bind(null, instance);
  if (vnode.ce) {
    vnode.ce(instance);
  }
  return instance;
}
let currentInstance = null;
const getCurrentInstance = () => currentInstance || currentRenderingInstance;
const setCurrentInstance = (instance) => {
  currentInstance = instance;
  instance.scope.on();
};
const unsetCurrentInstance = () => {
  currentInstance && currentInstance.scope.off();
  currentInstance = null;
};
function isStatefulComponent(instance) {
  return instance.vnode.shapeFlag & 4;
}
let isInSSRComponentSetup = false;
function setupComponent(instance, isSSR = false) {
  isInSSRComponentSetup = isSSR;
  const { props, children } = instance.vnode;
  const isStateful = isStatefulComponent(instance);
  initProps(instance, props, isStateful, isSSR);
  initSlots(instance, children);
  const setupResult = isStateful ? setupStatefulComponent(instance, isSSR) : void 0;
  isInSSRComponentSetup = false;
  return setupResult;
}
function setupStatefulComponent(instance, isSSR) {
  const Component = instance.type;
  instance.accessCache = /* @__PURE__ */ Object.create(null);
  instance.proxy = markRaw(new Proxy(instance.ctx, PublicInstanceProxyHandlers));
  const { setup } = Component;
  if (setup) {
    const setupContext = instance.setupContext = setup.length > 1 ? createSetupContext(instance) : null;
    setCurrentInstance(instance);
    pauseTracking();
    const setupResult = callWithErrorHandling(setup, instance, 0, [instance.props, setupContext]);
    resetTracking();
    unsetCurrentInstance();
    if (isPromise(setupResult)) {
      setupResult.then(unsetCurrentInstance, unsetCurrentInstance);
      if (isSSR) {
        return setupResult.then((resolvedResult) => {
          handleSetupResult(instance, resolvedResult, isSSR);
        }).catch((e) => {
          handleError(e, instance, 0);
        });
      } else {
        instance.asyncDep = setupResult;
      }
    } else {
      handleSetupResult(instance, setupResult, isSSR);
    }
  } else {
    finishComponentSetup(instance, isSSR);
  }
}
function handleSetupResult(instance, setupResult, isSSR) {
  if (isFunction(setupResult)) {
    if (instance.type.__ssrInlineRender) {
      instance.ssrRender = setupResult;
    } else {
      instance.render = setupResult;
    }
  } else if (isObject$1(setupResult)) {
    instance.setupState = proxyRefs(setupResult);
  } else
    ;
  finishComponentSetup(instance, isSSR);
}
let compile;
function finishComponentSetup(instance, isSSR, skipOptions) {
  const Component = instance.type;
  if (!instance.render) {
    if (!isSSR && compile && !Component.render) {
      const template = Component.template;
      if (template) {
        const { isCustomElement, compilerOptions } = instance.appContext.config;
        const { delimiters, compilerOptions: componentCompilerOptions } = Component;
        const finalCompilerOptions = extend(extend({
          isCustomElement,
          delimiters
        }, compilerOptions), componentCompilerOptions);
        Component.render = compile(template, finalCompilerOptions);
      }
    }
    instance.render = Component.render || NOOP;
  }
  {
    setCurrentInstance(instance);
    pauseTracking();
    applyOptions(instance);
    resetTracking();
    unsetCurrentInstance();
  }
}
function createAttrsProxy(instance) {
  return new Proxy(instance.attrs, {
    get(target2, key) {
      track(instance, "get", "$attrs");
      return target2[key];
    }
  });
}
function createSetupContext(instance) {
  const expose = (exposed) => {
    instance.exposed = exposed || {};
  };
  let attrs;
  {
    return {
      get attrs() {
        return attrs || (attrs = createAttrsProxy(instance));
      },
      slots: instance.slots,
      emit: instance.emit,
      expose
    };
  }
}
function getExposeProxy(instance) {
  if (instance.exposed) {
    return instance.exposeProxy || (instance.exposeProxy = new Proxy(proxyRefs(markRaw(instance.exposed)), {
      get(target2, key) {
        if (key in target2) {
          return target2[key];
        } else if (key in publicPropertiesMap) {
          return publicPropertiesMap[key](instance);
        }
      }
    }));
  }
}
function getComponentName(Component) {
  return isFunction(Component) ? Component.displayName || Component.name : Component.name;
}
function isClassComponent(value) {
  return isFunction(value) && "__vccOpts" in value;
}
const computed = (getterOrOptions, debugOptions) => {
  return computed$1(getterOrOptions, debugOptions, isInSSRComponentSetup);
};
function h(type, propsOrChildren, children) {
  const l2 = arguments.length;
  if (l2 === 2) {
    if (isObject$1(propsOrChildren) && !isArray(propsOrChildren)) {
      if (isVNode(propsOrChildren)) {
        return createVNode(type, null, [propsOrChildren]);
      }
      return createVNode(type, propsOrChildren);
    } else {
      return createVNode(type, null, propsOrChildren);
    }
  } else {
    if (l2 > 3) {
      children = Array.prototype.slice.call(arguments, 2);
    } else if (l2 === 3 && isVNode(children)) {
      children = [children];
    }
    return createVNode(type, propsOrChildren, children);
  }
}
const version = "3.2.36";
const svgNS = "http://www.w3.org/2000/svg";
const doc = typeof document !== "undefined" ? document : null;
const templateContainer = doc && /* @__PURE__ */ doc.createElement("template");
const nodeOps = {
  insert: (child, parent, anchor) => {
    parent.insertBefore(child, anchor || null);
  },
  remove: (child) => {
    const parent = child.parentNode;
    if (parent) {
      parent.removeChild(child);
    }
  },
  createElement: (tag, isSVG, is, props) => {
    const el = isSVG ? doc.createElementNS(svgNS, tag) : doc.createElement(tag, is ? { is } : void 0);
    if (tag === "select" && props && props.multiple != null) {
      el.setAttribute("multiple", props.multiple);
    }
    return el;
  },
  createText: (text) => doc.createTextNode(text),
  createComment: (text) => doc.createComment(text),
  setText: (node, text) => {
    node.nodeValue = text;
  },
  setElementText: (el, text) => {
    el.textContent = text;
  },
  parentNode: (node) => node.parentNode,
  nextSibling: (node) => node.nextSibling,
  querySelector: (selector) => doc.querySelector(selector),
  setScopeId(el, id) {
    el.setAttribute(id, "");
  },
  cloneNode(el) {
    const cloned = el.cloneNode(true);
    if (`_value` in el) {
      cloned._value = el._value;
    }
    return cloned;
  },
  insertStaticContent(content, parent, anchor, isSVG, start, end) {
    const before = anchor ? anchor.previousSibling : parent.lastChild;
    if (start && (start === end || start.nextSibling)) {
      while (true) {
        parent.insertBefore(start.cloneNode(true), anchor);
        if (start === end || !(start = start.nextSibling))
          break;
      }
    } else {
      templateContainer.innerHTML = isSVG ? `<svg>${content}</svg>` : content;
      const template = templateContainer.content;
      if (isSVG) {
        const wrapper = template.firstChild;
        while (wrapper.firstChild) {
          template.appendChild(wrapper.firstChild);
        }
        template.removeChild(wrapper);
      }
      parent.insertBefore(template, anchor);
    }
    return [
      before ? before.nextSibling : parent.firstChild,
      anchor ? anchor.previousSibling : parent.lastChild
    ];
  }
};
function patchClass(el, value, isSVG) {
  const transitionClasses = el._vtc;
  if (transitionClasses) {
    value = (value ? [value, ...transitionClasses] : [...transitionClasses]).join(" ");
  }
  if (value == null) {
    el.removeAttribute("class");
  } else if (isSVG) {
    el.setAttribute("class", value);
  } else {
    el.className = value;
  }
}
function patchStyle(el, prev, next) {
  const style = el.style;
  const isCssString = isString(next);
  if (next && !isCssString) {
    for (const key in next) {
      setStyle(style, key, next[key]);
    }
    if (prev && !isString(prev)) {
      for (const key in prev) {
        if (next[key] == null) {
          setStyle(style, key, "");
        }
      }
    }
  } else {
    const currentDisplay = style.display;
    if (isCssString) {
      if (prev !== next) {
        style.cssText = next;
      }
    } else if (prev) {
      el.removeAttribute("style");
    }
    if ("_vod" in el) {
      style.display = currentDisplay;
    }
  }
}
const importantRE = /\s*!important$/;
function setStyle(style, name, val) {
  if (isArray(val)) {
    val.forEach((v) => setStyle(style, name, v));
  } else {
    if (val == null)
      val = "";
    if (name.startsWith("--")) {
      style.setProperty(name, val);
    } else {
      const prefixed = autoPrefix(style, name);
      if (importantRE.test(val)) {
        style.setProperty(hyphenate(prefixed), val.replace(importantRE, ""), "important");
      } else {
        style[prefixed] = val;
      }
    }
  }
}
const prefixes = ["Webkit", "Moz", "ms"];
const prefixCache = {};
function autoPrefix(style, rawName) {
  const cached = prefixCache[rawName];
  if (cached) {
    return cached;
  }
  let name = camelize(rawName);
  if (name !== "filter" && name in style) {
    return prefixCache[rawName] = name;
  }
  name = capitalize(name);
  for (let i = 0; i < prefixes.length; i++) {
    const prefixed = prefixes[i] + name;
    if (prefixed in style) {
      return prefixCache[rawName] = prefixed;
    }
  }
  return rawName;
}
const xlinkNS = "http://www.w3.org/1999/xlink";
function patchAttr(el, key, value, isSVG, instance) {
  if (isSVG && key.startsWith("xlink:")) {
    if (value == null) {
      el.removeAttributeNS(xlinkNS, key.slice(6, key.length));
    } else {
      el.setAttributeNS(xlinkNS, key, value);
    }
  } else {
    const isBoolean = isSpecialBooleanAttr(key);
    if (value == null || isBoolean && !includeBooleanAttr(value)) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, isBoolean ? "" : value);
    }
  }
}
function patchDOMProp(el, key, value, prevChildren, parentComponent, parentSuspense, unmountChildren) {
  if (key === "innerHTML" || key === "textContent") {
    if (prevChildren) {
      unmountChildren(prevChildren, parentComponent, parentSuspense);
    }
    el[key] = value == null ? "" : value;
    return;
  }
  if (key === "value" && el.tagName !== "PROGRESS" && !el.tagName.includes("-")) {
    el._value = value;
    const newValue = value == null ? "" : value;
    if (el.value !== newValue || el.tagName === "OPTION") {
      el.value = newValue;
    }
    if (value == null) {
      el.removeAttribute(key);
    }
    return;
  }
  let needRemove = false;
  if (value === "" || value == null) {
    const type = typeof el[key];
    if (type === "boolean") {
      value = includeBooleanAttr(value);
    } else if (value == null && type === "string") {
      value = "";
      needRemove = true;
    } else if (type === "number") {
      value = 0;
      needRemove = true;
    }
  }
  try {
    el[key] = value;
  } catch (e) {
  }
  needRemove && el.removeAttribute(key);
}
const [_getNow, skipTimestampCheck] = /* @__PURE__ */ (() => {
  let _getNow2 = Date.now;
  let skipTimestampCheck2 = false;
  if (typeof window !== "undefined") {
    if (Date.now() > document.createEvent("Event").timeStamp) {
      _getNow2 = performance.now.bind(performance);
    }
    const ffMatch = navigator.userAgent.match(/firefox\/(\d+)/i);
    skipTimestampCheck2 = !!(ffMatch && Number(ffMatch[1]) <= 53);
  }
  return [_getNow2, skipTimestampCheck2];
})();
let cachedNow = 0;
const p = /* @__PURE__ */ Promise.resolve();
const reset = () => {
  cachedNow = 0;
};
const getNow = () => cachedNow || (p.then(reset), cachedNow = _getNow());
function addEventListener(el, event, handler, options) {
  el.addEventListener(event, handler, options);
}
function removeEventListener(el, event, handler, options) {
  el.removeEventListener(event, handler, options);
}
function patchEvent(el, rawName, prevValue, nextValue, instance = null) {
  const invokers = el._vei || (el._vei = {});
  const existingInvoker = invokers[rawName];
  if (nextValue && existingInvoker) {
    existingInvoker.value = nextValue;
  } else {
    const [name, options] = parseName(rawName);
    if (nextValue) {
      const invoker = invokers[rawName] = createInvoker(nextValue, instance);
      addEventListener(el, name, invoker, options);
    } else if (existingInvoker) {
      removeEventListener(el, name, existingInvoker, options);
      invokers[rawName] = void 0;
    }
  }
}
const optionsModifierRE = /(?:Once|Passive|Capture)$/;
function parseName(name) {
  let options;
  if (optionsModifierRE.test(name)) {
    options = {};
    let m;
    while (m = name.match(optionsModifierRE)) {
      name = name.slice(0, name.length - m[0].length);
      options[m[0].toLowerCase()] = true;
    }
  }
  return [hyphenate(name.slice(2)), options];
}
function createInvoker(initialValue, instance) {
  const invoker = (e) => {
    const timeStamp = e.timeStamp || _getNow();
    if (skipTimestampCheck || timeStamp >= invoker.attached - 1) {
      callWithAsyncErrorHandling(patchStopImmediatePropagation(e, invoker.value), instance, 5, [e]);
    }
  };
  invoker.value = initialValue;
  invoker.attached = getNow();
  return invoker;
}
function patchStopImmediatePropagation(e, value) {
  if (isArray(value)) {
    const originalStop = e.stopImmediatePropagation;
    e.stopImmediatePropagation = () => {
      originalStop.call(e);
      e._stopped = true;
    };
    return value.map((fn) => (e2) => !e2._stopped && fn && fn(e2));
  } else {
    return value;
  }
}
const nativeOnRE = /^on[a-z]/;
const patchProp = (el, key, prevValue, nextValue, isSVG = false, prevChildren, parentComponent, parentSuspense, unmountChildren) => {
  if (key === "class") {
    patchClass(el, nextValue, isSVG);
  } else if (key === "style") {
    patchStyle(el, prevValue, nextValue);
  } else if (isOn(key)) {
    if (!isModelListener(key)) {
      patchEvent(el, key, prevValue, nextValue, parentComponent);
    }
  } else if (key[0] === "." ? (key = key.slice(1), true) : key[0] === "^" ? (key = key.slice(1), false) : shouldSetAsProp(el, key, nextValue, isSVG)) {
    patchDOMProp(el, key, nextValue, prevChildren, parentComponent, parentSuspense, unmountChildren);
  } else {
    if (key === "true-value") {
      el._trueValue = nextValue;
    } else if (key === "false-value") {
      el._falseValue = nextValue;
    }
    patchAttr(el, key, nextValue, isSVG);
  }
};
function shouldSetAsProp(el, key, value, isSVG) {
  if (isSVG) {
    if (key === "innerHTML" || key === "textContent") {
      return true;
    }
    if (key in el && nativeOnRE.test(key) && isFunction(value)) {
      return true;
    }
    return false;
  }
  if (key === "spellcheck" || key === "draggable" || key === "translate") {
    return false;
  }
  if (key === "form") {
    return false;
  }
  if (key === "list" && el.tagName === "INPUT") {
    return false;
  }
  if (key === "type" && el.tagName === "TEXTAREA") {
    return false;
  }
  if (nativeOnRE.test(key) && isString(value)) {
    return false;
  }
  return key in el;
}
const TRANSITION = "transition";
const ANIMATION = "animation";
const Transition = (props, { slots }) => h(BaseTransition, resolveTransitionProps(props), slots);
Transition.displayName = "Transition";
const DOMTransitionPropsValidators = {
  name: String,
  type: String,
  css: {
    type: Boolean,
    default: true
  },
  duration: [String, Number, Object],
  enterFromClass: String,
  enterActiveClass: String,
  enterToClass: String,
  appearFromClass: String,
  appearActiveClass: String,
  appearToClass: String,
  leaveFromClass: String,
  leaveActiveClass: String,
  leaveToClass: String
};
Transition.props = /* @__PURE__ */ extend({}, BaseTransition.props, DOMTransitionPropsValidators);
const callHook = (hook, args) => {
  if (isArray(hook)) {
    hook.forEach((h2) => h2(...args));
  } else if (hook) {
    hook(...args);
  }
};
const hasExplicitCallback = (hook) => {
  return hook ? isArray(hook) ? hook.some((h2) => h2.length > 1) : hook.length > 1 : false;
};
function resolveTransitionProps(rawProps) {
  const baseProps = {};
  for (const key in rawProps) {
    if (!(key in DOMTransitionPropsValidators)) {
      baseProps[key] = rawProps[key];
    }
  }
  if (rawProps.css === false) {
    return baseProps;
  }
  const { name = "v", type, duration, enterFromClass = `${name}-enter-from`, enterActiveClass = `${name}-enter-active`, enterToClass = `${name}-enter-to`, appearFromClass = enterFromClass, appearActiveClass = enterActiveClass, appearToClass = enterToClass, leaveFromClass = `${name}-leave-from`, leaveActiveClass = `${name}-leave-active`, leaveToClass = `${name}-leave-to` } = rawProps;
  const durations = normalizeDuration(duration);
  const enterDuration = durations && durations[0];
  const leaveDuration = durations && durations[1];
  const { onBeforeEnter, onEnter, onEnterCancelled, onLeave, onLeaveCancelled, onBeforeAppear = onBeforeEnter, onAppear = onEnter, onAppearCancelled = onEnterCancelled } = baseProps;
  const finishEnter = (el, isAppear, done) => {
    removeTransitionClass(el, isAppear ? appearToClass : enterToClass);
    removeTransitionClass(el, isAppear ? appearActiveClass : enterActiveClass);
    done && done();
  };
  const finishLeave = (el, done) => {
    el._isLeaving = false;
    removeTransitionClass(el, leaveFromClass);
    removeTransitionClass(el, leaveToClass);
    removeTransitionClass(el, leaveActiveClass);
    done && done();
  };
  const makeEnterHook = (isAppear) => {
    return (el, done) => {
      const hook = isAppear ? onAppear : onEnter;
      const resolve2 = () => finishEnter(el, isAppear, done);
      callHook(hook, [el, resolve2]);
      nextFrame(() => {
        removeTransitionClass(el, isAppear ? appearFromClass : enterFromClass);
        addTransitionClass(el, isAppear ? appearToClass : enterToClass);
        if (!hasExplicitCallback(hook)) {
          whenTransitionEnds(el, type, enterDuration, resolve2);
        }
      });
    };
  };
  return extend(baseProps, {
    onBeforeEnter(el) {
      callHook(onBeforeEnter, [el]);
      addTransitionClass(el, enterFromClass);
      addTransitionClass(el, enterActiveClass);
    },
    onBeforeAppear(el) {
      callHook(onBeforeAppear, [el]);
      addTransitionClass(el, appearFromClass);
      addTransitionClass(el, appearActiveClass);
    },
    onEnter: makeEnterHook(false),
    onAppear: makeEnterHook(true),
    onLeave(el, done) {
      el._isLeaving = true;
      const resolve2 = () => finishLeave(el, done);
      addTransitionClass(el, leaveFromClass);
      forceReflow();
      addTransitionClass(el, leaveActiveClass);
      nextFrame(() => {
        if (!el._isLeaving) {
          return;
        }
        removeTransitionClass(el, leaveFromClass);
        addTransitionClass(el, leaveToClass);
        if (!hasExplicitCallback(onLeave)) {
          whenTransitionEnds(el, type, leaveDuration, resolve2);
        }
      });
      callHook(onLeave, [el, resolve2]);
    },
    onEnterCancelled(el) {
      finishEnter(el, false);
      callHook(onEnterCancelled, [el]);
    },
    onAppearCancelled(el) {
      finishEnter(el, true);
      callHook(onAppearCancelled, [el]);
    },
    onLeaveCancelled(el) {
      finishLeave(el);
      callHook(onLeaveCancelled, [el]);
    }
  });
}
function normalizeDuration(duration) {
  if (duration == null) {
    return null;
  } else if (isObject$1(duration)) {
    return [NumberOf(duration.enter), NumberOf(duration.leave)];
  } else {
    const n = NumberOf(duration);
    return [n, n];
  }
}
function NumberOf(val) {
  const res = toNumber(val);
  return res;
}
function addTransitionClass(el, cls) {
  cls.split(/\s+/).forEach((c) => c && el.classList.add(c));
  (el._vtc || (el._vtc = /* @__PURE__ */ new Set())).add(cls);
}
function removeTransitionClass(el, cls) {
  cls.split(/\s+/).forEach((c) => c && el.classList.remove(c));
  const { _vtc } = el;
  if (_vtc) {
    _vtc.delete(cls);
    if (!_vtc.size) {
      el._vtc = void 0;
    }
  }
}
function nextFrame(cb) {
  requestAnimationFrame(() => {
    requestAnimationFrame(cb);
  });
}
let endId = 0;
function whenTransitionEnds(el, expectedType, explicitTimeout, resolve2) {
  const id = el._endId = ++endId;
  const resolveIfNotStale = () => {
    if (id === el._endId) {
      resolve2();
    }
  };
  if (explicitTimeout) {
    return setTimeout(resolveIfNotStale, explicitTimeout);
  }
  const { type, timeout, propCount } = getTransitionInfo(el, expectedType);
  if (!type) {
    return resolve2();
  }
  const endEvent = type + "end";
  let ended = 0;
  const end = () => {
    el.removeEventListener(endEvent, onEnd);
    resolveIfNotStale();
  };
  const onEnd = (e) => {
    if (e.target === el && ++ended >= propCount) {
      end();
    }
  };
  setTimeout(() => {
    if (ended < propCount) {
      end();
    }
  }, timeout + 1);
  el.addEventListener(endEvent, onEnd);
}
function getTransitionInfo(el, expectedType) {
  const styles = window.getComputedStyle(el);
  const getStyleProperties = (key) => (styles[key] || "").split(", ");
  const transitionDelays = getStyleProperties(TRANSITION + "Delay");
  const transitionDurations = getStyleProperties(TRANSITION + "Duration");
  const transitionTimeout = getTimeout(transitionDelays, transitionDurations);
  const animationDelays = getStyleProperties(ANIMATION + "Delay");
  const animationDurations = getStyleProperties(ANIMATION + "Duration");
  const animationTimeout = getTimeout(animationDelays, animationDurations);
  let type = null;
  let timeout = 0;
  let propCount = 0;
  if (expectedType === TRANSITION) {
    if (transitionTimeout > 0) {
      type = TRANSITION;
      timeout = transitionTimeout;
      propCount = transitionDurations.length;
    }
  } else if (expectedType === ANIMATION) {
    if (animationTimeout > 0) {
      type = ANIMATION;
      timeout = animationTimeout;
      propCount = animationDurations.length;
    }
  } else {
    timeout = Math.max(transitionTimeout, animationTimeout);
    type = timeout > 0 ? transitionTimeout > animationTimeout ? TRANSITION : ANIMATION : null;
    propCount = type ? type === TRANSITION ? transitionDurations.length : animationDurations.length : 0;
  }
  const hasTransform = type === TRANSITION && /\b(transform|all)(,|$)/.test(styles[TRANSITION + "Property"]);
  return {
    type,
    timeout,
    propCount,
    hasTransform
  };
}
function getTimeout(delays, durations) {
  while (delays.length < durations.length) {
    delays = delays.concat(delays);
  }
  return Math.max(...durations.map((d, i) => toMs(d) + toMs(delays[i])));
}
function toMs(s2) {
  return Number(s2.slice(0, -1).replace(",", ".")) * 1e3;
}
function forceReflow() {
  return document.body.offsetHeight;
}
const vShow = {
  beforeMount(el, { value }, { transition }) {
    el._vod = el.style.display === "none" ? "" : el.style.display;
    if (transition && value) {
      transition.beforeEnter(el);
    } else {
      setDisplay(el, value);
    }
  },
  mounted(el, { value }, { transition }) {
    if (transition && value) {
      transition.enter(el);
    }
  },
  updated(el, { value, oldValue }, { transition }) {
    if (!value === !oldValue)
      return;
    if (transition) {
      if (value) {
        transition.beforeEnter(el);
        setDisplay(el, true);
        transition.enter(el);
      } else {
        transition.leave(el, () => {
          setDisplay(el, false);
        });
      }
    } else {
      setDisplay(el, value);
    }
  },
  beforeUnmount(el, { value }) {
    setDisplay(el, value);
  }
};
function setDisplay(el, value) {
  el.style.display = value ? el._vod : "none";
}
const rendererOptions = /* @__PURE__ */ extend({ patchProp }, nodeOps);
let renderer;
function ensureRenderer() {
  return renderer || (renderer = createRenderer(rendererOptions));
}
const createApp = (...args) => {
  const app2 = ensureRenderer().createApp(...args);
  const { mount } = app2;
  app2.mount = (containerOrSelector) => {
    const container = normalizeContainer(containerOrSelector);
    if (!container)
      return;
    const component = app2._component;
    if (!isFunction(component) && !component.render && !component.template) {
      component.template = container.innerHTML;
    }
    container.innerHTML = "";
    const proxy = mount(container, false, container instanceof SVGElement);
    if (container instanceof Element) {
      container.removeAttribute("v-cloak");
      container.setAttribute("data-v-app", "");
    }
    return proxy;
  };
  return app2;
};
function normalizeContainer(container) {
  if (isString(container)) {
    const res = document.querySelector(container);
    return res;
  }
  return container;
}
function injectProp(target2, propName, get2, set2) {
  Object.defineProperty(target2, propName, {
    get: get2,
    set: set2,
    enumerable: true
  });
}
const isRuntimeSsrPreHydration = ref(false);
let iosCorrection;
function getMatch(userAgent2, platformMatch) {
  const match = /(edg|edge|edga|edgios)\/([\w.]+)/.exec(userAgent2) || /(opr)[\/]([\w.]+)/.exec(userAgent2) || /(vivaldi)[\/]([\w.]+)/.exec(userAgent2) || /(chrome|crios)[\/]([\w.]+)/.exec(userAgent2) || /(version)(applewebkit)[\/]([\w.]+).*(safari)[\/]([\w.]+)/.exec(userAgent2) || /(webkit)[\/]([\w.]+).*(version)[\/]([\w.]+).*(safari)[\/]([\w.]+)/.exec(userAgent2) || /(firefox|fxios)[\/]([\w.]+)/.exec(userAgent2) || /(webkit)[\/]([\w.]+)/.exec(userAgent2) || /(opera)(?:.*version|)[\/]([\w.]+)/.exec(userAgent2) || [];
  return {
    browser: match[5] || match[3] || match[1] || "",
    version: match[2] || match[4] || "0",
    versionNumber: match[4] || match[2] || "0",
    platform: platformMatch[0] || ""
  };
}
function getPlatformMatch(userAgent2) {
  return /(ipad)/.exec(userAgent2) || /(ipod)/.exec(userAgent2) || /(windows phone)/.exec(userAgent2) || /(iphone)/.exec(userAgent2) || /(kindle)/.exec(userAgent2) || /(silk)/.exec(userAgent2) || /(android)/.exec(userAgent2) || /(win)/.exec(userAgent2) || /(mac)/.exec(userAgent2) || /(linux)/.exec(userAgent2) || /(cros)/.exec(userAgent2) || /(playbook)/.exec(userAgent2) || /(bb)/.exec(userAgent2) || /(blackberry)/.exec(userAgent2) || [];
}
const hasTouch = "ontouchstart" in window || window.navigator.maxTouchPoints > 0;
function applyIosCorrection(is) {
  iosCorrection = { is: __spreadValues({}, is) };
  delete is.mac;
  delete is.desktop;
  const platform = Math.min(window.innerHeight, window.innerWidth) > 414 ? "ipad" : "iphone";
  Object.assign(is, {
    mobile: true,
    ios: true,
    platform,
    [platform]: true
  });
}
function getPlatform(UA) {
  const userAgent2 = UA.toLowerCase(), platformMatch = getPlatformMatch(userAgent2), matched = getMatch(userAgent2, platformMatch), browser = {};
  if (matched.browser) {
    browser[matched.browser] = true;
    browser.version = matched.version;
    browser.versionNumber = parseInt(matched.versionNumber, 10);
  }
  if (matched.platform) {
    browser[matched.platform] = true;
  }
  const knownMobiles = browser.android || browser.ios || browser.bb || browser.blackberry || browser.ipad || browser.iphone || browser.ipod || browser.kindle || browser.playbook || browser.silk || browser["windows phone"];
  if (knownMobiles === true || userAgent2.indexOf("mobile") > -1) {
    browser.mobile = true;
    if (browser.edga || browser.edgios) {
      browser.edge = true;
      matched.browser = "edge";
    } else if (browser.crios) {
      browser.chrome = true;
      matched.browser = "chrome";
    } else if (browser.fxios) {
      browser.firefox = true;
      matched.browser = "firefox";
    }
  } else {
    browser.desktop = true;
  }
  if (browser.ipod || browser.ipad || browser.iphone) {
    browser.ios = true;
  }
  if (browser["windows phone"]) {
    browser.winphone = true;
    delete browser["windows phone"];
  }
  if (browser.chrome || browser.opr || browser.safari || browser.vivaldi || browser.mobile === true && browser.ios !== true && knownMobiles !== true) {
    browser.webkit = true;
  }
  if (browser.edg) {
    matched.browser = "edgechromium";
    browser.edgeChromium = true;
  }
  if (browser.safari && browser.blackberry || browser.bb) {
    matched.browser = "blackberry";
    browser.blackberry = true;
  }
  if (browser.safari && browser.playbook) {
    matched.browser = "playbook";
    browser.playbook = true;
  }
  if (browser.opr) {
    matched.browser = "opera";
    browser.opera = true;
  }
  if (browser.safari && browser.android) {
    matched.browser = "android";
    browser.android = true;
  }
  if (browser.safari && browser.kindle) {
    matched.browser = "kindle";
    browser.kindle = true;
  }
  if (browser.safari && browser.silk) {
    matched.browser = "silk";
    browser.silk = true;
  }
  if (browser.vivaldi) {
    matched.browser = "vivaldi";
    browser.vivaldi = true;
  }
  browser.name = matched.browser;
  browser.platform = matched.platform;
  {
    if (userAgent2.indexOf("electron") > -1) {
      browser.electron = true;
    } else if (document.location.href.indexOf("-extension://") > -1) {
      browser.bex = true;
    } else {
      if (window.Capacitor !== void 0) {
        browser.capacitor = true;
        browser.nativeMobile = true;
        browser.nativeMobileWrapper = "capacitor";
      } else if (window._cordovaNative !== void 0 || window.cordova !== void 0) {
        browser.cordova = true;
        browser.nativeMobile = true;
        browser.nativeMobileWrapper = "cordova";
      }
      if (hasTouch === true && browser.mac === true && (browser.desktop === true && browser.safari === true || browser.nativeMobile === true && browser.android !== true && browser.ios !== true && browser.ipad !== true)) {
        applyIosCorrection(browser);
      }
    }
  }
  return browser;
}
const userAgent = navigator.userAgent || navigator.vendor || window.opera;
const ssrClient = {
  has: {
    touch: false,
    webStorage: false
  },
  within: { iframe: false }
};
const client = {
  userAgent,
  is: getPlatform(userAgent),
  has: {
    touch: hasTouch
  },
  within: {
    iframe: window.self !== window.top
  }
};
const Platform = {
  install(opts) {
    const { $q } = opts;
    if (isRuntimeSsrPreHydration.value === true) {
      opts.onSSRHydrated.push(() => {
        isRuntimeSsrPreHydration.value = false;
        Object.assign($q.platform, client);
        iosCorrection = void 0;
      });
      $q.platform = reactive(this);
    } else {
      $q.platform = this;
    }
  }
};
{
  let hasWebStorage;
  injectProp(client.has, "webStorage", () => {
    if (hasWebStorage !== void 0) {
      return hasWebStorage;
    }
    try {
      if (window.localStorage) {
        hasWebStorage = true;
        return true;
      }
    } catch (e) {
    }
    hasWebStorage = false;
    return false;
  });
  client.is.ios === true && window.navigator.vendor.toLowerCase().indexOf("apple") === -1;
  if (isRuntimeSsrPreHydration.value === true) {
    Object.assign(Platform, client, iosCorrection, ssrClient);
  } else {
    Object.assign(Platform, client);
  }
}
var defineReactivePlugin = (state, plugin) => {
  const reactiveState = reactive(state);
  for (const name in state) {
    injectProp(plugin, name, () => reactiveState[name], (val) => {
      reactiveState[name] = val;
    });
  }
  return plugin;
};
const listenOpts = {
  hasPassive: false,
  passiveCapture: true,
  notPassiveCapture: true
};
try {
  const opts = Object.defineProperty({}, "passive", {
    get() {
      Object.assign(listenOpts, {
        hasPassive: true,
        passive: { passive: true },
        notPassive: { passive: false },
        passiveCapture: { passive: true, capture: true },
        notPassiveCapture: { passive: false, capture: true }
      });
    }
  });
  window.addEventListener("qtest", null, opts);
  window.removeEventListener("qtest", null, opts);
} catch (e) {
}
function noop$1() {
}
function position(e) {
  if (e.touches && e.touches[0]) {
    e = e.touches[0];
  } else if (e.changedTouches && e.changedTouches[0]) {
    e = e.changedTouches[0];
  } else if (e.targetTouches && e.targetTouches[0]) {
    e = e.targetTouches[0];
  }
  return {
    top: e.clientY,
    left: e.clientX
  };
}
function stop(e) {
  e.stopPropagation();
}
function prevent(e) {
  e.cancelable !== false && e.preventDefault();
}
function stopAndPrevent(e) {
  e.cancelable !== false && e.preventDefault();
  e.stopPropagation();
}
function addEvt(ctx, targetName, events) {
  const name = `__q_${targetName}_evt`;
  ctx[name] = ctx[name] !== void 0 ? ctx[name].concat(events) : events;
  events.forEach((evt) => {
    evt[0].addEventListener(evt[1], ctx[evt[2]], listenOpts[evt[3]]);
  });
}
function cleanEvt(ctx, targetName) {
  const name = `__q_${targetName}_evt`;
  if (ctx[name] !== void 0) {
    ctx[name].forEach((evt) => {
      evt[0].removeEventListener(evt[1], ctx[evt[2]], listenOpts[evt[3]]);
    });
    ctx[name] = void 0;
  }
}
function debounce(fn, wait = 250, immediate) {
  let timeout;
  function debounced() {
    const args = arguments;
    const later = () => {
      timeout = void 0;
      if (immediate !== true) {
        fn.apply(this, args);
      }
    };
    clearTimeout(timeout);
    if (immediate === true && timeout === void 0) {
      fn.apply(this, args);
    }
    timeout = setTimeout(later, wait);
  }
  debounced.cancel = () => {
    clearTimeout(timeout);
  };
  return debounced;
}
const SIZE_LIST = ["sm", "md", "lg", "xl"];
const { passive } = listenOpts;
var Screen = defineReactivePlugin({
  width: 0,
  height: 0,
  name: "xs",
  sizes: {
    sm: 600,
    md: 1024,
    lg: 1440,
    xl: 1920
  },
  lt: {
    sm: true,
    md: true,
    lg: true,
    xl: true
  },
  gt: {
    xs: false,
    sm: false,
    md: false,
    lg: false
  },
  xs: true,
  sm: false,
  md: false,
  lg: false,
  xl: false
}, {
  setSizes: noop$1,
  setDebounce: noop$1,
  install({ $q, onSSRHydrated }) {
    $q.screen = this;
    if (this.__installed === true) {
      if ($q.config.screen !== void 0) {
        if ($q.config.screen.bodyClasses === false) {
          document.body.classList.remove(`screen--${this.name}`);
        } else {
          this.__update(true);
        }
      }
      return;
    }
    const { visualViewport } = window;
    const target2 = visualViewport || window;
    const scrollingElement = document.scrollingElement || document.documentElement;
    const getSize = visualViewport === void 0 || client.is.mobile === true ? () => [
      Math.max(window.innerWidth, scrollingElement.clientWidth),
      Math.max(window.innerHeight, scrollingElement.clientHeight)
    ] : () => [
      visualViewport.width * visualViewport.scale + window.innerWidth - scrollingElement.clientWidth,
      visualViewport.height * visualViewport.scale + window.innerHeight - scrollingElement.clientHeight
    ];
    const classes = $q.config.screen !== void 0 && $q.config.screen.bodyClasses === true;
    this.__update = (force) => {
      const [w, h2] = getSize();
      if (h2 !== this.height) {
        this.height = h2;
      }
      if (w !== this.width) {
        this.width = w;
      } else if (force !== true) {
        return;
      }
      let s2 = this.sizes;
      this.gt.xs = w >= s2.sm;
      this.gt.sm = w >= s2.md;
      this.gt.md = w >= s2.lg;
      this.gt.lg = w >= s2.xl;
      this.lt.sm = w < s2.sm;
      this.lt.md = w < s2.md;
      this.lt.lg = w < s2.lg;
      this.lt.xl = w < s2.xl;
      this.xs = this.lt.sm;
      this.sm = this.gt.xs === true && this.lt.md === true;
      this.md = this.gt.sm === true && this.lt.lg === true;
      this.lg = this.gt.md === true && this.lt.xl === true;
      this.xl = this.gt.lg;
      s2 = this.xs === true && "xs" || this.sm === true && "sm" || this.md === true && "md" || this.lg === true && "lg" || "xl";
      if (s2 !== this.name) {
        if (classes === true) {
          document.body.classList.remove(`screen--${this.name}`);
          document.body.classList.add(`screen--${s2}`);
        }
        this.name = s2;
      }
    };
    let updateEvt, updateSizes = {}, updateDebounce = 16;
    this.setSizes = (sizes) => {
      SIZE_LIST.forEach((name) => {
        if (sizes[name] !== void 0) {
          updateSizes[name] = sizes[name];
        }
      });
    };
    this.setDebounce = (deb) => {
      updateDebounce = deb;
    };
    const start = () => {
      const style = getComputedStyle(document.body);
      if (style.getPropertyValue("--q-size-sm")) {
        SIZE_LIST.forEach((name) => {
          this.sizes[name] = parseInt(style.getPropertyValue(`--q-size-${name}`), 10);
        });
      }
      this.setSizes = (sizes) => {
        SIZE_LIST.forEach((name) => {
          if (sizes[name]) {
            this.sizes[name] = sizes[name];
          }
        });
        this.__update(true);
      };
      this.setDebounce = (delay) => {
        updateEvt !== void 0 && target2.removeEventListener("resize", updateEvt, passive);
        updateEvt = delay > 0 ? debounce(this.__update, delay) : this.__update;
        target2.addEventListener("resize", updateEvt, passive);
      };
      this.setDebounce(updateDebounce);
      if (Object.keys(updateSizes).length > 0) {
        this.setSizes(updateSizes);
        updateSizes = void 0;
      } else {
        this.__update();
      }
      classes === true && this.name === "xs" && document.body.classList.add("screen--xs");
    };
    if (isRuntimeSsrPreHydration.value === true) {
      onSSRHydrated.push(start);
    } else {
      start();
    }
  }
});
const Plugin$2 = defineReactivePlugin({
  isActive: false,
  mode: false
}, {
  __media: void 0,
  set(val) {
    Plugin$2.mode = val;
    if (val === "auto") {
      if (Plugin$2.__media === void 0) {
        Plugin$2.__media = window.matchMedia("(prefers-color-scheme: dark)");
        Plugin$2.__updateMedia = () => {
          Plugin$2.set("auto");
        };
        Plugin$2.__media.addListener(Plugin$2.__updateMedia);
      }
      val = Plugin$2.__media.matches;
    } else if (Plugin$2.__media !== void 0) {
      Plugin$2.__media.removeListener(Plugin$2.__updateMedia);
      Plugin$2.__media = void 0;
    }
    Plugin$2.isActive = val === true;
    document.body.classList.remove(`body--${val === true ? "light" : "dark"}`);
    document.body.classList.add(`body--${val === true ? "dark" : "light"}`);
  },
  toggle() {
    {
      Plugin$2.set(Plugin$2.isActive === false);
    }
  },
  install({ $q, onSSRHydrated, ssrContext }) {
    const { dark } = $q.config;
    $q.dark = this;
    if (this.__installed === true && dark === void 0) {
      return;
    }
    this.isActive = dark === true;
    const initialVal = dark !== void 0 ? dark : false;
    if (isRuntimeSsrPreHydration.value === true) {
      const ssrSet = (val) => {
        this.__fromSSR = val;
      };
      const originalSet = this.set;
      this.set = ssrSet;
      ssrSet(initialVal);
      onSSRHydrated.push(() => {
        this.set = originalSet;
        this.set(this.__fromSSR);
      });
    } else {
      this.set(initialVal);
    }
  }
});
const getTrue = () => true;
function filterInvalidPath(path) {
  return typeof path === "string" && path !== "" && path !== "/" && path !== "#/";
}
function normalizeExitPath(path) {
  path.startsWith("#") === true && (path = path.substring(1));
  path.startsWith("/") === false && (path = "/" + path);
  path.endsWith("/") === true && (path = path.substring(0, path.length - 1));
  return "#" + path;
}
function getShouldExitFn(cfg) {
  if (cfg.backButtonExit === false) {
    return () => false;
  }
  if (cfg.backButtonExit === "*") {
    return getTrue;
  }
  const exitPaths = ["#/"];
  Array.isArray(cfg.backButtonExit) === true && exitPaths.push(...cfg.backButtonExit.filter(filterInvalidPath).map(normalizeExitPath));
  return () => exitPaths.includes(window.location.hash);
}
var History = {
  __history: [],
  add: noop$1,
  remove: noop$1,
  install({ $q }) {
    if (this.__installed === true) {
      return;
    }
    const { cordova, capacitor } = client.is;
    if (cordova !== true && capacitor !== true) {
      return;
    }
    const qConf = $q.config[cordova === true ? "cordova" : "capacitor"];
    if (qConf !== void 0 && qConf.backButton === false) {
      return;
    }
    if (capacitor === true && (window.Capacitor === void 0 || window.Capacitor.Plugins.App === void 0)) {
      return;
    }
    this.add = (entry) => {
      if (entry.condition === void 0) {
        entry.condition = getTrue;
      }
      this.__history.push(entry);
    };
    this.remove = (entry) => {
      const index2 = this.__history.indexOf(entry);
      if (index2 >= 0) {
        this.__history.splice(index2, 1);
      }
    };
    const shouldExit = getShouldExitFn(Object.assign({ backButtonExit: true }, qConf));
    const backHandler = () => {
      if (this.__history.length) {
        const entry = this.__history[this.__history.length - 1];
        if (entry.condition() === true) {
          this.__history.pop();
          entry.handler();
        }
      } else if (shouldExit() === true) {
        navigator.app.exitApp();
      } else {
        window.history.back();
      }
    };
    if (cordova === true) {
      document.addEventListener("deviceready", () => {
        document.addEventListener("backbutton", backHandler, false);
      });
    } else {
      window.Capacitor.Plugins.App.addListener("backButton", backHandler);
    }
  }
};
var defaultLang = {
  isoName: "en-US",
  nativeName: "English (US)",
  label: {
    clear: "Clear",
    ok: "OK",
    cancel: "Cancel",
    close: "Close",
    set: "Set",
    select: "Select",
    reset: "Reset",
    remove: "Remove",
    update: "Update",
    create: "Create",
    search: "Search",
    filter: "Filter",
    refresh: "Refresh"
  },
  date: {
    days: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
    daysShort: "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
    months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
    monthsShort: "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
    firstDayOfWeek: 0,
    format24h: false,
    pluralDay: "days"
  },
  table: {
    noData: "No data available",
    noResults: "No matching records found",
    loading: "Loading...",
    selectedRecords: (rows) => rows === 1 ? "1 record selected." : (rows === 0 ? "No" : rows) + " records selected.",
    recordsPerPage: "Records per page:",
    allRows: "All",
    pagination: (start, end, total) => start + "-" + end + " of " + total,
    columns: "Columns"
  },
  editor: {
    url: "URL",
    bold: "Bold",
    italic: "Italic",
    strikethrough: "Strikethrough",
    underline: "Underline",
    unorderedList: "Unordered List",
    orderedList: "Ordered List",
    subscript: "Subscript",
    superscript: "Superscript",
    hyperlink: "Hyperlink",
    toggleFullscreen: "Toggle Fullscreen",
    quote: "Quote",
    left: "Left align",
    center: "Center align",
    right: "Right align",
    justify: "Justify align",
    print: "Print",
    outdent: "Decrease indentation",
    indent: "Increase indentation",
    removeFormat: "Remove formatting",
    formatting: "Formatting",
    fontSize: "Font Size",
    align: "Align",
    hr: "Insert Horizontal Rule",
    undo: "Undo",
    redo: "Redo",
    heading1: "Heading 1",
    heading2: "Heading 2",
    heading3: "Heading 3",
    heading4: "Heading 4",
    heading5: "Heading 5",
    heading6: "Heading 6",
    paragraph: "Paragraph",
    code: "Code",
    size1: "Very small",
    size2: "A bit small",
    size3: "Normal",
    size4: "Medium-large",
    size5: "Big",
    size6: "Very big",
    size7: "Maximum",
    defaultFont: "Default Font",
    viewSource: "View Source"
  },
  tree: {
    noNodes: "No nodes available",
    noResults: "No matching nodes found"
  }
};
function getLocale() {
  const val = Array.isArray(navigator.languages) === true && navigator.languages.length > 0 ? navigator.languages[0] : navigator.language;
  if (typeof val === "string") {
    return val.split(/[-_]/).map((v, i) => i === 0 ? v.toLowerCase() : i > 1 || v.length < 4 ? v.toUpperCase() : v[0].toUpperCase() + v.slice(1).toLowerCase()).join("-");
  }
}
const Plugin$1 = defineReactivePlugin({
  __langPack: {}
}, {
  getLocale,
  set(langObject = defaultLang, ssrContext) {
    const lang = __spreadProps(__spreadValues({}, langObject), {
      rtl: langObject.rtl === true,
      getLocale
    });
    {
      const el = document.documentElement;
      el.setAttribute("dir", lang.rtl === true ? "rtl" : "ltr");
      el.setAttribute("lang", lang.isoName);
      lang.set = Plugin$1.set;
      Object.assign(Plugin$1.__langPack, lang);
      Plugin$1.props = lang;
      Plugin$1.isoName = lang.isoName;
      Plugin$1.nativeName = lang.nativeName;
    }
  },
  install({ $q, lang, ssrContext }) {
    {
      $q.lang = Plugin$1.__langPack;
      if (this.__installed === true) {
        lang !== void 0 && this.set(lang);
      } else {
        this.set(lang || defaultLang);
      }
    }
  }
});
function setCssVar(propName, value, element = document.body) {
  if (typeof propName !== "string") {
    throw new TypeError("Expected a string as propName");
  }
  if (typeof value !== "string") {
    throw new TypeError("Expected a string as value");
  }
  if (!(element instanceof Element)) {
    throw new TypeError("Expected a DOM element");
  }
  element.style.setProperty(`--q-${propName}`, value);
}
let lastKeyCompositionStatus = false;
function onKeyDownComposition(evt) {
  lastKeyCompositionStatus = evt.isComposing === true;
}
function shouldIgnoreKey(evt) {
  return lastKeyCompositionStatus === true || evt !== Object(evt) || evt.isComposing === true || evt.qKeyEvent === true;
}
function isKeyCode(evt, keyCodes) {
  return shouldIgnoreKey(evt) === true ? false : [].concat(keyCodes).includes(evt.keyCode);
}
function getMobilePlatform(is) {
  if (is.ios === true)
    return "ios";
  if (is.android === true)
    return "android";
}
function getBodyClasses({ is, has: has2, within }, cfg) {
  const cls = [
    is.desktop === true ? "desktop" : "mobile",
    `${has2.touch === false ? "no-" : ""}touch`
  ];
  if (is.mobile === true) {
    const mobile = getMobilePlatform(is);
    mobile !== void 0 && cls.push("platform-" + mobile);
  }
  if (is.nativeMobile === true) {
    const type = is.nativeMobileWrapper;
    cls.push(type);
    cls.push("native-mobile");
    if (is.ios === true && (cfg[type] === void 0 || cfg[type].iosStatusBarPadding !== false)) {
      cls.push("q-ios-padding");
    }
  } else if (is.electron === true) {
    cls.push("electron");
  } else if (is.bex === true) {
    cls.push("bex");
  }
  within.iframe === true && cls.push("within-iframe");
  return cls;
}
function applyClientSsrCorrections() {
  const classes = document.body.className;
  let newCls = classes;
  if (iosCorrection !== void 0) {
    newCls = newCls.replace("desktop", "platform-ios mobile");
  }
  if (client.has.touch === true) {
    newCls = newCls.replace("no-touch", "touch");
  }
  if (client.within.iframe === true) {
    newCls += " within-iframe";
  }
  if (classes !== newCls) {
    document.body.className = newCls;
  }
}
function setColors(brand) {
  for (const color in brand) {
    setCssVar(color, brand[color]);
  }
}
var Body = {
  install(opts) {
    if (this.__installed === true) {
      return;
    }
    if (isRuntimeSsrPreHydration.value === true) {
      applyClientSsrCorrections();
    } else {
      const { $q } = opts;
      $q.config.brand !== void 0 && setColors($q.config.brand);
      const cls = getBodyClasses(client, $q.config);
      document.body.classList.add.apply(document.body.classList, cls);
    }
    if (client.is.ios === true) {
      document.body.addEventListener("touchstart", noop$1);
    }
    window.addEventListener("keydown", onKeyDownComposition, true);
  }
};
var materialIcons = {
  name: "material-icons",
  type: {
    positive: "check_circle",
    negative: "warning",
    info: "info",
    warning: "priority_high"
  },
  arrow: {
    up: "arrow_upward",
    right: "arrow_forward",
    down: "arrow_downward",
    left: "arrow_back",
    dropdown: "arrow_drop_down"
  },
  chevron: {
    left: "chevron_left",
    right: "chevron_right"
  },
  colorPicker: {
    spectrum: "gradient",
    tune: "tune",
    palette: "style"
  },
  pullToRefresh: {
    icon: "refresh"
  },
  carousel: {
    left: "chevron_left",
    right: "chevron_right",
    up: "keyboard_arrow_up",
    down: "keyboard_arrow_down",
    navigationIcon: "lens"
  },
  chip: {
    remove: "cancel",
    selected: "check"
  },
  datetime: {
    arrowLeft: "chevron_left",
    arrowRight: "chevron_right",
    now: "access_time",
    today: "today"
  },
  editor: {
    bold: "format_bold",
    italic: "format_italic",
    strikethrough: "strikethrough_s",
    underline: "format_underlined",
    unorderedList: "format_list_bulleted",
    orderedList: "format_list_numbered",
    subscript: "vertical_align_bottom",
    superscript: "vertical_align_top",
    hyperlink: "link",
    toggleFullscreen: "fullscreen",
    quote: "format_quote",
    left: "format_align_left",
    center: "format_align_center",
    right: "format_align_right",
    justify: "format_align_justify",
    print: "print",
    outdent: "format_indent_decrease",
    indent: "format_indent_increase",
    removeFormat: "format_clear",
    formatting: "text_format",
    fontSize: "format_size",
    align: "format_align_left",
    hr: "remove",
    undo: "undo",
    redo: "redo",
    heading: "format_size",
    code: "code",
    size: "format_size",
    font: "font_download",
    viewSource: "code"
  },
  expansionItem: {
    icon: "keyboard_arrow_down",
    denseIcon: "arrow_drop_down"
  },
  fab: {
    icon: "add",
    activeIcon: "close"
  },
  field: {
    clear: "cancel",
    error: "error"
  },
  pagination: {
    first: "first_page",
    prev: "keyboard_arrow_left",
    next: "keyboard_arrow_right",
    last: "last_page"
  },
  rating: {
    icon: "grade"
  },
  stepper: {
    done: "check",
    active: "edit",
    error: "warning"
  },
  tabs: {
    left: "chevron_left",
    right: "chevron_right",
    up: "keyboard_arrow_up",
    down: "keyboard_arrow_down"
  },
  table: {
    arrowUp: "arrow_upward",
    warning: "warning",
    firstPage: "first_page",
    prevPage: "chevron_left",
    nextPage: "chevron_right",
    lastPage: "last_page"
  },
  tree: {
    icon: "play_arrow"
  },
  uploader: {
    done: "done",
    clear: "clear",
    add: "add_box",
    upload: "cloud_upload",
    removeQueue: "clear_all",
    removeUploaded: "done_all"
  }
};
const Plugin = defineReactivePlugin({
  iconMapFn: null,
  __icons: {}
}, {
  set(setObject, ssrContext) {
    const def2 = __spreadProps(__spreadValues({}, setObject), { rtl: setObject.rtl === true });
    {
      def2.set = Plugin.set;
      Object.assign(Plugin.__icons, def2);
    }
  },
  install({ $q, iconSet, ssrContext }) {
    {
      if ($q.config.iconMapFn !== void 0) {
        this.iconMapFn = $q.config.iconMapFn;
      }
      $q.iconSet = this.__icons;
      injectProp($q, "iconMapFn", () => this.iconMapFn, (val) => {
        this.iconMapFn = val;
      });
      if (this.__installed === true) {
        iconSet !== void 0 && this.set(iconSet);
      } else {
        this.set(iconSet || materialIcons);
      }
    }
  }
});
const quasarKey = "_q_";
const formKey = "_q_fo_";
const globalConfig = {};
let globalConfigIsFrozen = false;
function freezeGlobalConfig() {
  globalConfigIsFrozen = true;
}
const hasMap = typeof Map === "function", hasSet = typeof Set === "function", hasArrayBuffer = typeof ArrayBuffer === "function";
function isDeepEqual(a2, b) {
  if (a2 === b) {
    return true;
  }
  if (a2 !== null && b !== null && typeof a2 === "object" && typeof b === "object") {
    if (a2.constructor !== b.constructor) {
      return false;
    }
    let length, i;
    if (a2.constructor === Array) {
      length = a2.length;
      if (length !== b.length) {
        return false;
      }
      for (i = length; i-- !== 0; ) {
        if (isDeepEqual(a2[i], b[i]) !== true) {
          return false;
        }
      }
      return true;
    }
    if (hasMap === true && a2.constructor === Map) {
      if (a2.size !== b.size) {
        return false;
      }
      i = a2.entries().next();
      while (i.done !== true) {
        if (b.has(i.value[0]) !== true) {
          return false;
        }
        i = i.next();
      }
      i = a2.entries().next();
      while (i.done !== true) {
        if (isDeepEqual(i.value[1], b.get(i.value[0])) !== true) {
          return false;
        }
        i = i.next();
      }
      return true;
    }
    if (hasSet === true && a2.constructor === Set) {
      if (a2.size !== b.size) {
        return false;
      }
      i = a2.entries().next();
      while (i.done !== true) {
        if (b.has(i.value[0]) !== true) {
          return false;
        }
        i = i.next();
      }
      return true;
    }
    if (hasArrayBuffer === true && a2.buffer != null && a2.buffer.constructor === ArrayBuffer) {
      length = a2.length;
      if (length !== b.length) {
        return false;
      }
      for (i = length; i-- !== 0; ) {
        if (a2[i] !== b[i]) {
          return false;
        }
      }
      return true;
    }
    if (a2.constructor === RegExp) {
      return a2.source === b.source && a2.flags === b.flags;
    }
    if (a2.valueOf !== Object.prototype.valueOf) {
      return a2.valueOf() === b.valueOf();
    }
    if (a2.toString !== Object.prototype.toString) {
      return a2.toString() === b.toString();
    }
    const keys = Object.keys(a2).filter((key) => a2[key] !== void 0);
    length = keys.length;
    if (length !== Object.keys(b).filter((key) => b[key] !== void 0).length) {
      return false;
    }
    for (i = length; i-- !== 0; ) {
      const key = keys[i];
      if (isDeepEqual(a2[key], b[key]) !== true) {
        return false;
      }
    }
    return true;
  }
  return a2 !== a2 && b !== b;
}
function isObject(v) {
  return v !== null && typeof v === "object" && Array.isArray(v) !== true;
}
const autoInstalledPlugins = [
  Platform,
  Body,
  Plugin$2,
  Screen,
  History,
  Plugin$1,
  Plugin
];
function installPlugins(pluginOpts, pluginList) {
  pluginList.forEach((Plugin2) => {
    Plugin2.install(pluginOpts);
    Plugin2.__installed = true;
  });
}
function prepareApp(app2, uiOpts, pluginOpts) {
  app2.config.globalProperties.$q = pluginOpts.$q;
  app2.provide(quasarKey, pluginOpts.$q);
  installPlugins(pluginOpts, autoInstalledPlugins);
  uiOpts.components !== void 0 && Object.values(uiOpts.components).forEach((c) => {
    if (isObject(c) === true && c.name !== void 0) {
      app2.component(c.name, c);
    }
  });
  uiOpts.directives !== void 0 && Object.values(uiOpts.directives).forEach((d) => {
    if (isObject(d) === true && d.name !== void 0) {
      app2.directive(d.name, d);
    }
  });
  uiOpts.plugins !== void 0 && installPlugins(pluginOpts, Object.values(uiOpts.plugins).filter((p2) => typeof p2.install === "function" && autoInstalledPlugins.includes(p2) === false));
  if (isRuntimeSsrPreHydration.value === true) {
    pluginOpts.$q.onSSRHydrated = () => {
      pluginOpts.onSSRHydrated.forEach((fn) => {
        fn();
      });
      pluginOpts.$q.onSSRHydrated = () => {
      };
    };
  }
}
var installQuasar = function(parentApp, opts = {}) {
  const $q = { version: "2.7.5" };
  if (globalConfigIsFrozen === false) {
    if (opts.config !== void 0) {
      Object.assign(globalConfig, opts.config);
    }
    $q.config = __spreadValues({}, globalConfig);
    freezeGlobalConfig();
  } else {
    $q.config = opts.config || {};
  }
  prepareApp(parentApp, opts, {
    parentApp,
    $q,
    lang: opts.lang,
    iconSet: opts.iconSet,
    onSSRHydrated: []
  });
};
var Quasar = {
  version: "2.7.5",
  install: installQuasar,
  lang: Plugin$1,
  iconSet: Plugin
};
var index = "";
var main = "";
if (typeof window !== "undefined") {
  let loadSvg2 = function() {
    var body = document.body;
    var svgDom = document.getElementById("__svg__icons__dom__");
    if (!svgDom) {
      svgDom = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svgDom.style.position = "absolute";
      svgDom.style.width = "0";
      svgDom.style.height = "0";
      svgDom.id = "__svg__icons__dom__";
      svgDom.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      svgDom.setAttribute("xmlns:link", "http://www.w3.org/1999/xlink");
    }
    svgDom.innerHTML = '<symbol  viewBox="0 0 24 24" id="icon-alert"><path d="M13 14h-2V9h2m0 9h-2v-2h2M1 21h22L12 2 1 21Z" /></symbol><symbol  viewBox="0 0 24 24" id="icon-application-braces-outline"><path d="M21 2H3c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2m0 18H3V6h18v14M9 8c-1.1 0-2 .9-2 2s-.9 2-2 2v2c1.1 0 2 .9 2 2s.9 2 2 2h2v-2H9v-1c0-1.1-.9-2-2-2 1.1 0 2-.9 2-2v-1h2V8m4 0c1.1 0 2 .9 2 2s.9 2 2 2v2c-1.1 0-2 .9-2 2s-.9 2-2 2h-2v-2h2v-1c0-1.1.9-2 2-2-1.1 0-2-.9-2-2v-1h-2V8h2Z" /></symbol><symbol  viewBox="0 0 24 24" id="icon-bookshelf"><path d="M9 3v15h3V3H9m3 2 4 13 3-1-4-13-3 1M5 5v13h3V5H5M3 19v2h18v-2H3Z" /></symbol><symbol  viewBox="0 0 24 24" id="icon-briefcase-outline"><path d="M20 6c.58 0 1.05.2 1.42.59.38.41.58.86.58 1.41v11c0 .55-.2 1-.58 1.41-.37.39-.84.59-1.42.59H4c-.58 0-1.05-.2-1.42-.59C2.2 20 2 19.55 2 19V8c0-.55.2-1 .58-1.41C2.95 6.2 3.42 6 4 6h4V4c0-.58.2-1.05.58-1.42C8.95 2.2 9.42 2 10 2h4c.58 0 1.05.2 1.42.58.38.37.58.84.58 1.42v2h4M4 8v11h16V8H4m10-2V4h-4v2h4Z" /></symbol><symbol  viewBox="0 0 24 24" id="icon-chevron-down"><path d="M7.41 8.58 12 13.17l4.59-4.59L18 10l-6 6-6-6 1.41-1.42Z" /></symbol><symbol  viewBox="0 0 24 24" id="icon-close-circle-outline"><path d="M12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8m0-18C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2m2.59 6L12 10.59 9.41 8 8 9.41 10.59 12 8 14.59 9.41 16 12 13.41 14.59 16 16 14.59 13.41 12 16 9.41 14.59 8Z" /></symbol><symbol  viewBox="0 0 24 24" id="icon-emoticon-cry-outline"><path d="M7.57 20c-1.34 0-2.43-1.09-2.43-2.43 0-1.07 1.18-3.07 2.43-4.76C8.82 14.5 10 16.5 10 17.57A2.43 2.43 0 0 1 7.57 20M12 2A10 10 0 0 0 2 12c0 1.75.45 3.38 1.24 4.81.16-.81.57-1.74 1.07-2.64A7.69 7.69 0 0 1 4 12a8 8 0 0 1 8-8 8 8 0 0 1 8 8 8 8 0 0 1-8 8c-.24 0-.47 0-.71-.04-.47.74-1.15 1.32-1.95 1.67.85.24 1.74.37 2.66.37a10 10 0 0 0 10-10A10 10 0 0 0 12 2m0 12c-.41 0-.81.04-1.19.12.35.63.66 1.28.88 1.88H12c1.25 0 2.32.5 2.77 1.23l1.42-1.42C15.29 14.72 13.75 14 12 14m3.5-6c-.8 0-1.5.7-1.5 1.5s.7 1.5 1.5 1.5 1.5-.7 1.5-1.5S16.3 8 15.5 8M10 9.5C10 8.7 9.3 8 8.5 8S7 8.7 7 9.5 7.7 11 8.5 11s1.5-.7 1.5-1.5" /></symbol><symbol  viewBox="0 0 24 24" id="icon-github"><path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z" /></symbol><symbol  viewBox="0 0 24 24" id="icon-magnify"><path d="M9.5 3A6.5 6.5 0 0 1 16 9.5c0 1.61-.59 3.09-1.56 4.23l.27.27h.79l5 5-1.5 1.5-5-5v-.79l-.27-.27A6.516 6.516 0 0 1 9.5 16 6.5 6.5 0 0 1 3 9.5 6.5 6.5 0 0 1 9.5 3m0 2C7 5 5 7 5 9.5S7 14 9.5 14 14 12 14 9.5 12 5 9.5 5Z" /></symbol><symbol  viewBox="0 0 24 24" id="icon-rocket-launch"><path d="m13.13 22.19-1.63-3.83c1.57-.58 3.04-1.36 4.4-2.27l-2.77 6.1M5.64 12.5l-3.83-1.63 6.1-2.77C7 9.46 6.22 10.93 5.64 12.5M21.61 2.39S16.66.269 11 5.93c-2.19 2.19-3.5 4.6-4.35 6.71-.28.75-.09 1.57.46 2.13l2.13 2.12c.55.56 1.37.74 2.12.46A19.1 19.1 0 0 0 18.07 13c5.66-5.66 3.54-10.61 3.54-10.61m-7.07 7.07c-.78-.78-.78-2.05 0-2.83s2.05-.78 2.83 0c.77.78.78 2.05 0 2.83-.78.78-2.05.78-2.83 0m-5.66 7.07-1.41-1.41 1.41 1.41M6.24 22l3.64-3.64c-.34-.09-.67-.24-.97-.45L4.83 22h1.41M2 22h1.41l4.77-4.76-1.42-1.41L2 20.59V22m0-2.83 4.09-4.08c-.21-.3-.36-.62-.45-.97L2 17.76v1.41Z" /></symbol><symbol  viewBox="0 0 24 24" id="icon-source-branch"><path d="M13 14c-3.36 0-4.46 1.35-4.82 2.24C9.25 16.7 10 17.76 10 19a3 3 0 0 1-3 3 3 3 0 0 1-3-3c0-1.31.83-2.42 2-2.83V7.83A2.99 2.99 0 0 1 4 5a3 3 0 0 1 3-3 3 3 0 0 1 3 3c0 1.31-.83 2.42-2 2.83v5.29c.88-.65 2.16-1.12 4-1.12 2.67 0 3.56-1.34 3.85-2.23A3.006 3.006 0 0 1 14 7a3 3 0 0 1 3-3 3 3 0 0 1 3 3c0 1.34-.88 2.5-2.09 2.86C17.65 11.29 16.68 14 13 14m-6 4a1 1 0 0 0-1 1 1 1 0 0 0 1 1 1 1 0 0 0 1-1 1 1 0 0 0-1-1M7 4a1 1 0 0 0-1 1 1 1 0 0 0 1 1 1 1 0 0 0 1-1 1 1 0 0 0-1-1m10 2a1 1 0 0 0-1 1 1 1 0 0 0 1 1 1 1 0 0 0 1-1 1 1 0 0 0-1-1z" /></symbol><symbol  viewBox="0 0 24 24" id="icon-unfold-more-horizontal"><path d="M12 18.17 8.83 15l-1.41 1.41L12 21l4.59-4.59L15.17 15M12 5.83 15.17 9l1.41-1.41L12 3 7.41 7.59 8.83 9 12 5.83Z" /></symbol>';
    body.insertBefore(svgDom, body.lastChild);
  };
  var loadSvg = loadSvg2;
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadSvg2);
  } else {
    loadSvg2();
  }
}
var isVue2 = false;
/*!
  * pinia v2.0.14
  * (c) 2022 Eduardo San Martin Morote
  * @license MIT
  */
let activePinia;
const setActivePinia = (pinia2) => activePinia = pinia2;
const piniaSymbol = Symbol();
function isPlainObject(o) {
  return o && typeof o === "object" && Object.prototype.toString.call(o) === "[object Object]" && typeof o.toJSON !== "function";
}
var MutationType;
(function(MutationType2) {
  MutationType2["direct"] = "direct";
  MutationType2["patchObject"] = "patch object";
  MutationType2["patchFunction"] = "patch function";
})(MutationType || (MutationType = {}));
function createPinia() {
  const scope = effectScope(true);
  const state = scope.run(() => ref({}));
  let _p = [];
  let toBeInstalled = [];
  const pinia2 = markRaw({
    install(app2) {
      setActivePinia(pinia2);
      {
        pinia2._a = app2;
        app2.provide(piniaSymbol, pinia2);
        app2.config.globalProperties.$pinia = pinia2;
        toBeInstalled.forEach((plugin) => _p.push(plugin));
        toBeInstalled = [];
      }
    },
    use(plugin) {
      if (!this._a && !isVue2) {
        toBeInstalled.push(plugin);
      } else {
        _p.push(plugin);
      }
      return this;
    },
    _p,
    _a: null,
    _e: scope,
    _s: /* @__PURE__ */ new Map(),
    state
  });
  return pinia2;
}
const noop = () => {
};
function addSubscription(subscriptions, callback, detached, onCleanup = noop) {
  subscriptions.push(callback);
  const removeSubscription = () => {
    const idx = subscriptions.indexOf(callback);
    if (idx > -1) {
      subscriptions.splice(idx, 1);
      onCleanup();
    }
  };
  if (!detached && getCurrentInstance()) {
    onUnmounted(removeSubscription);
  }
  return removeSubscription;
}
function triggerSubscriptions(subscriptions, ...args) {
  subscriptions.slice().forEach((callback) => {
    callback(...args);
  });
}
function mergeReactiveObjects(target2, patchToApply) {
  for (const key in patchToApply) {
    if (!patchToApply.hasOwnProperty(key))
      continue;
    const subPatch = patchToApply[key];
    const targetValue = target2[key];
    if (isPlainObject(targetValue) && isPlainObject(subPatch) && target2.hasOwnProperty(key) && !isRef(subPatch) && !isReactive(subPatch)) {
      target2[key] = mergeReactiveObjects(targetValue, subPatch);
    } else {
      target2[key] = subPatch;
    }
  }
  return target2;
}
const skipHydrateSymbol = Symbol();
function shouldHydrate(obj) {
  return !isPlainObject(obj) || !obj.hasOwnProperty(skipHydrateSymbol);
}
const { assign } = Object;
function isComputed(o) {
  return !!(isRef(o) && o.effect);
}
function createOptionsStore(id, options, pinia2, hot) {
  const { state, actions, getters } = options;
  const initialState = pinia2.state.value[id];
  let store;
  function setup() {
    if (!initialState && true) {
      {
        pinia2.state.value[id] = state ? state() : {};
      }
    }
    const localState = toRefs(pinia2.state.value[id]);
    return assign(localState, actions, Object.keys(getters || {}).reduce((computedGetters, name) => {
      computedGetters[name] = markRaw(computed(() => {
        setActivePinia(pinia2);
        const store2 = pinia2._s.get(id);
        return getters[name].call(store2, store2);
      }));
      return computedGetters;
    }, {}));
  }
  store = createSetupStore(id, setup, options, pinia2, hot, true);
  store.$reset = function $reset() {
    const newState = state ? state() : {};
    this.$patch(($state) => {
      assign($state, newState);
    });
  };
  return store;
}
function createSetupStore($id, setup, options = {}, pinia2, hot, isOptionsStore) {
  let scope;
  const optionsForPlugin = assign({ actions: {} }, options);
  const $subscribeOptions = {
    deep: true
  };
  let isListening;
  let isSyncListening;
  let subscriptions = markRaw([]);
  let actionSubscriptions = markRaw([]);
  let debuggerEvents;
  const initialState = pinia2.state.value[$id];
  if (!isOptionsStore && !initialState && true) {
    {
      pinia2.state.value[$id] = {};
    }
  }
  ref({});
  let activeListener;
  function $patch(partialStateOrMutator) {
    let subscriptionMutation;
    isListening = isSyncListening = false;
    if (typeof partialStateOrMutator === "function") {
      partialStateOrMutator(pinia2.state.value[$id]);
      subscriptionMutation = {
        type: MutationType.patchFunction,
        storeId: $id,
        events: debuggerEvents
      };
    } else {
      mergeReactiveObjects(pinia2.state.value[$id], partialStateOrMutator);
      subscriptionMutation = {
        type: MutationType.patchObject,
        payload: partialStateOrMutator,
        storeId: $id,
        events: debuggerEvents
      };
    }
    const myListenerId = activeListener = Symbol();
    nextTick().then(() => {
      if (activeListener === myListenerId) {
        isListening = true;
      }
    });
    isSyncListening = true;
    triggerSubscriptions(subscriptions, subscriptionMutation, pinia2.state.value[$id]);
  }
  const $reset = noop;
  function $dispose() {
    scope.stop();
    subscriptions = [];
    actionSubscriptions = [];
    pinia2._s.delete($id);
  }
  function wrapAction(name, action) {
    return function() {
      setActivePinia(pinia2);
      const args = Array.from(arguments);
      const afterCallbackList = [];
      const onErrorCallbackList = [];
      function after(callback) {
        afterCallbackList.push(callback);
      }
      function onError(callback) {
        onErrorCallbackList.push(callback);
      }
      triggerSubscriptions(actionSubscriptions, {
        args,
        name,
        store,
        after,
        onError
      });
      let ret;
      try {
        ret = action.apply(this && this.$id === $id ? this : store, args);
      } catch (error) {
        triggerSubscriptions(onErrorCallbackList, error);
        throw error;
      }
      if (ret instanceof Promise) {
        return ret.then((value) => {
          triggerSubscriptions(afterCallbackList, value);
          return value;
        }).catch((error) => {
          triggerSubscriptions(onErrorCallbackList, error);
          return Promise.reject(error);
        });
      }
      triggerSubscriptions(afterCallbackList, ret);
      return ret;
    };
  }
  const partialStore = {
    _p: pinia2,
    $id,
    $onAction: addSubscription.bind(null, actionSubscriptions),
    $patch,
    $reset,
    $subscribe(callback, options2 = {}) {
      const removeSubscription = addSubscription(subscriptions, callback, options2.detached, () => stopWatcher());
      const stopWatcher = scope.run(() => watch(() => pinia2.state.value[$id], (state) => {
        if (options2.flush === "sync" ? isSyncListening : isListening) {
          callback({
            storeId: $id,
            type: MutationType.direct,
            events: debuggerEvents
          }, state);
        }
      }, assign({}, $subscribeOptions, options2)));
      return removeSubscription;
    },
    $dispose
  };
  const store = reactive(assign({}, partialStore));
  pinia2._s.set($id, store);
  const setupStore = pinia2._e.run(() => {
    scope = effectScope();
    return scope.run(() => setup());
  });
  for (const key in setupStore) {
    const prop = setupStore[key];
    if (isRef(prop) && !isComputed(prop) || isReactive(prop)) {
      if (!isOptionsStore) {
        if (initialState && shouldHydrate(prop)) {
          if (isRef(prop)) {
            prop.value = initialState[key];
          } else {
            mergeReactiveObjects(prop, initialState[key]);
          }
        }
        {
          pinia2.state.value[$id][key] = prop;
        }
      }
    } else if (typeof prop === "function") {
      const actionValue = wrapAction(key, prop);
      {
        setupStore[key] = actionValue;
      }
      optionsForPlugin.actions[key] = prop;
    } else
      ;
  }
  {
    assign(store, setupStore);
    assign(toRaw(store), setupStore);
  }
  Object.defineProperty(store, "$state", {
    get: () => pinia2.state.value[$id],
    set: (state) => {
      $patch(($state) => {
        assign($state, state);
      });
    }
  });
  pinia2._p.forEach((extender) => {
    {
      assign(store, scope.run(() => extender({
        store,
        app: pinia2._a,
        pinia: pinia2,
        options: optionsForPlugin
      })));
    }
  });
  if (initialState && isOptionsStore && options.hydrate) {
    options.hydrate(store.$state, initialState);
  }
  isListening = true;
  isSyncListening = true;
  return store;
}
function defineStore(idOrOptions, setup, setupOptions) {
  let id;
  let options;
  const isSetupStore = typeof setup === "function";
  if (typeof idOrOptions === "string") {
    id = idOrOptions;
    options = isSetupStore ? setupOptions : setup;
  } else {
    options = idOrOptions;
    id = idOrOptions.id;
  }
  function useStore(pinia2, hot) {
    const currentInstance2 = getCurrentInstance();
    pinia2 = pinia2 || currentInstance2 && inject(piniaSymbol);
    if (pinia2)
      setActivePinia(pinia2);
    pinia2 = activePinia;
    if (!pinia2._s.has(id)) {
      if (isSetupStore) {
        createSetupStore(id, setup, options, pinia2);
      } else {
        createOptionsStore(id, options, pinia2);
      }
    }
    const store = pinia2._s.get(id);
    return store;
  }
  useStore.$id = id;
  return useStore;
}
const useSizeDefaults = {
  xs: 18,
  sm: 24,
  md: 32,
  lg: 38,
  xl: 46
};
const useSizeProps = {
  size: String
};
function useSize(props, sizes = useSizeDefaults) {
  return computed(() => props.size !== void 0 ? { fontSize: props.size in sizes ? `${sizes[props.size]}px` : props.size } : null);
}
const createComponent = (raw) => markRaw(defineComponent(raw));
const createDirective = (raw) => markRaw(raw);
function hSlot(slot, otherwise) {
  return slot !== void 0 ? slot() || otherwise : otherwise;
}
function hUniqueSlot(slot, otherwise) {
  if (slot !== void 0) {
    const vnode = slot();
    if (vnode !== void 0 && vnode !== null) {
      return vnode.slice();
    }
  }
  return otherwise;
}
function hMergeSlot(slot, source) {
  return slot !== void 0 ? source.concat(slot()) : source;
}
function hMergeSlotSafely(slot, source) {
  if (slot === void 0) {
    return source;
  }
  return source !== void 0 ? source.concat(slot()) : slot();
}
const defaultViewBox = "0 0 24 24";
const sameFn = (i) => i;
const ionFn = (i) => `ionicons ${i}`;
const libMap = {
  "mdi-": (i) => `mdi ${i}`,
  "icon-": sameFn,
  "bt-": (i) => `bt ${i}`,
  "eva-": (i) => `eva ${i}`,
  "ion-md": ionFn,
  "ion-ios": ionFn,
  "ion-logo": ionFn,
  "iconfont ": sameFn,
  "ti-": (i) => `themify-icon ${i}`,
  "bi-": (i) => `bootstrap-icons ${i}`
};
const matMap = {
  o_: "-outlined",
  r_: "-round",
  s_: "-sharp"
};
const symMap = {
  sym_o_: "-outlined",
  sym_r_: "-rounded",
  sym_s_: "-sharp"
};
const libRE = new RegExp("^(" + Object.keys(libMap).join("|") + ")");
const matRE = new RegExp("^(" + Object.keys(matMap).join("|") + ")");
const symRE = new RegExp("^(" + Object.keys(symMap).join("|") + ")");
const mRE = /^[Mm]\s?[-+]?\.?\d/;
const imgRE = /^img:/;
const svgUseRE = /^svguse:/;
const ionRE = /^ion-/;
const faRE = /^(fa-(solid|regular|light|brands|duotone|thin)|[lf]a[srlbdk]?) /;
var QIcon = createComponent({
  name: "QIcon",
  props: __spreadProps(__spreadValues({}, useSizeProps), {
    tag: {
      type: String,
      default: "i"
    },
    name: String,
    color: String,
    left: Boolean,
    right: Boolean
  }),
  setup(props, { slots }) {
    const { proxy: { $q } } = getCurrentInstance();
    const sizeStyle = useSize(props);
    const classes = computed(() => "q-icon" + (props.left === true ? " on-left" : "") + (props.right === true ? " on-right" : "") + (props.color !== void 0 ? ` text-${props.color}` : ""));
    const type = computed(() => {
      let cls;
      let icon = props.name;
      if (icon === "none" || !icon) {
        return { none: true };
      }
      if ($q.iconMapFn !== null) {
        const res = $q.iconMapFn(icon);
        if (res !== void 0) {
          if (res.icon !== void 0) {
            icon = res.icon;
            if (icon === "none" || !icon) {
              return { none: true };
            }
          } else {
            return {
              cls: res.cls,
              content: res.content !== void 0 ? res.content : " "
            };
          }
        }
      }
      if (mRE.test(icon) === true) {
        const [def2, viewBox = defaultViewBox] = icon.split("|");
        return {
          svg: true,
          viewBox,
          nodes: def2.split("&&").map((path) => {
            const [d, style, transform] = path.split("@@");
            return h("path", { style, d, transform });
          })
        };
      }
      if (imgRE.test(icon) === true) {
        return {
          img: true,
          src: icon.substring(4)
        };
      }
      if (svgUseRE.test(icon) === true) {
        const [def2, viewBox = defaultViewBox] = icon.split("|");
        return {
          svguse: true,
          src: def2.substring(7),
          viewBox
        };
      }
      let content = " ";
      const matches = icon.match(libRE);
      if (matches !== null) {
        cls = libMap[matches[1]](icon);
      } else if (faRE.test(icon) === true) {
        cls = icon;
      } else if (ionRE.test(icon) === true) {
        cls = `ionicons ion-${$q.platform.is.ios === true ? "ios" : "md"}${icon.substring(3)}`;
      } else if (symRE.test(icon) === true) {
        cls = "notranslate material-symbols";
        const matches2 = icon.match(symRE);
        if (matches2 !== null) {
          icon = icon.substring(6);
          cls += symMap[matches2[1]];
        }
        content = icon;
      } else {
        cls = "notranslate material-icons";
        const matches2 = icon.match(matRE);
        if (matches2 !== null) {
          icon = icon.substring(2);
          cls += matMap[matches2[1]];
        }
        content = icon;
      }
      return {
        cls,
        content
      };
    });
    return () => {
      const data = {
        class: classes.value,
        style: sizeStyle.value,
        "aria-hidden": "true",
        role: "presentation"
      };
      if (type.value.none === true) {
        return h(props.tag, data, hSlot(slots.default));
      }
      if (type.value.img === true) {
        return h("span", data, hMergeSlot(slots.default, [
          h("img", { src: type.value.src })
        ]));
      }
      if (type.value.svg === true) {
        return h("span", data, hMergeSlot(slots.default, [
          h("svg", {
            viewBox: type.value.viewBox || "0 0 24 24"
          }, type.value.nodes)
        ]));
      }
      if (type.value.svguse === true) {
        return h("span", data, hMergeSlot(slots.default, [
          h("svg", {
            viewBox: type.value.viewBox
          }, [
            h("use", { "xlink:href": type.value.src })
          ])
        ]));
      }
      if (type.value.cls !== void 0) {
        data.class += " " + type.value.cls;
      }
      return h(props.tag, data, hMergeSlot(slots.default, [
        type.value.content
      ]));
    };
  }
});
const useSpinnerProps = {
  size: {
    type: [Number, String],
    default: "1em"
  },
  color: String
};
function useSpinner(props) {
  return {
    cSize: computed(() => props.size in useSizeDefaults ? `${useSizeDefaults[props.size]}px` : props.size),
    classes: computed(() => "q-spinner" + (props.color ? ` text-${props.color}` : ""))
  };
}
var QSpinner = createComponent({
  name: "QSpinner",
  props: __spreadProps(__spreadValues({}, useSpinnerProps), {
    thickness: {
      type: Number,
      default: 5
    }
  }),
  setup(props) {
    const { cSize, classes } = useSpinner(props);
    return () => h("svg", {
      class: classes.value + " q-spinner-mat",
      width: cSize.value,
      height: cSize.value,
      viewBox: "25 25 50 50"
    }, [
      h("circle", {
        class: "path",
        cx: "50",
        cy: "50",
        r: "20",
        fill: "none",
        stroke: "currentColor",
        "stroke-width": props.thickness,
        "stroke-miterlimit": "10"
      })
    ]);
  }
});
function css(element, css2) {
  const style = element.style;
  for (const prop in css2) {
    style[prop] = css2[prop];
  }
}
function getElement(el) {
  if (el === void 0 || el === null) {
    return void 0;
  }
  if (typeof el === "string") {
    try {
      return document.querySelector(el) || void 0;
    } catch (err) {
      return void 0;
    }
  }
  const target2 = isRef(el) === true ? el.value : el;
  if (target2) {
    return target2.$el || target2;
  }
}
function throttle(fn, limit) {
  let wait = false, result;
  return function() {
    if (wait === false) {
      wait = true;
      setTimeout(() => {
        wait = false;
      }, limit);
      result = fn.apply(this, arguments);
    }
    return result;
  };
}
function showRipple(evt, el, ctx, forceCenter) {
  ctx.modifiers.stop === true && stop(evt);
  const color = ctx.modifiers.color;
  let center = ctx.modifiers.center;
  center = center === true || forceCenter === true;
  const node = document.createElement("span"), innerNode = document.createElement("span"), pos = position(evt), { left, top, width, height } = el.getBoundingClientRect(), diameter2 = Math.sqrt(width * width + height * height), radius2 = diameter2 / 2, centerX = `${(width - diameter2) / 2}px`, x = center ? centerX : `${pos.left - left - radius2}px`, centerY = `${(height - diameter2) / 2}px`, y = center ? centerY : `${pos.top - top - radius2}px`;
  innerNode.className = "q-ripple__inner";
  css(innerNode, {
    height: `${diameter2}px`,
    width: `${diameter2}px`,
    transform: `translate3d(${x},${y},0) scale3d(.2,.2,1)`,
    opacity: 0
  });
  node.className = `q-ripple${color ? " text-" + color : ""}`;
  node.setAttribute("dir", "ltr");
  node.appendChild(innerNode);
  el.appendChild(node);
  const abort = () => {
    node.remove();
    clearTimeout(timer2);
  };
  ctx.abort.push(abort);
  let timer2 = setTimeout(() => {
    innerNode.classList.add("q-ripple__inner--enter");
    innerNode.style.transform = `translate3d(${centerX},${centerY},0) scale3d(1,1,1)`;
    innerNode.style.opacity = 0.2;
    timer2 = setTimeout(() => {
      innerNode.classList.remove("q-ripple__inner--enter");
      innerNode.classList.add("q-ripple__inner--leave");
      innerNode.style.opacity = 0;
      timer2 = setTimeout(() => {
        node.remove();
        ctx.abort.splice(ctx.abort.indexOf(abort), 1);
      }, 275);
    }, 250);
  }, 50);
}
function updateModifiers(ctx, { modifiers, value, arg }) {
  const cfg = Object.assign({}, ctx.cfg.ripple, modifiers, value);
  ctx.modifiers = {
    early: cfg.early === true,
    stop: cfg.stop === true,
    center: cfg.center === true,
    color: cfg.color || arg,
    keyCodes: [].concat(cfg.keyCodes || 13)
  };
}
var Ripple = createDirective({
  name: "ripple",
  beforeMount(el, binding) {
    const ctx = {
      cfg: binding.instance.$.appContext.config.globalProperties.$q.config,
      enabled: binding.value !== false,
      modifiers: {},
      abort: [],
      start(evt) {
        if (ctx.enabled === true && evt.qSkipRipple !== true && evt.type === (ctx.modifiers.early === true ? "pointerdown" : "click")) {
          showRipple(evt, el, ctx, evt.qKeyEvent === true);
        }
      },
      keystart: throttle((evt) => {
        if (ctx.enabled === true && evt.qSkipRipple !== true && isKeyCode(evt, ctx.modifiers.keyCodes) === true && evt.type === `key${ctx.modifiers.early === true ? "down" : "up"}`) {
          showRipple(evt, el, ctx, true);
        }
      }, 300)
    };
    updateModifiers(ctx, binding);
    el.__qripple = ctx;
    addEvt(ctx, "main", [
      [el, "pointerdown", "start", "passive"],
      [el, "click", "start", "passive"],
      [el, "keydown", "keystart", "passive"],
      [el, "keyup", "keystart", "passive"]
    ]);
  },
  updated(el, binding) {
    if (binding.oldValue !== binding.value) {
      const ctx = el.__qripple;
      ctx.enabled = binding.value !== false;
      if (ctx.enabled === true && Object(binding.value) === binding.value) {
        updateModifiers(ctx, binding);
      }
    }
  },
  beforeUnmount(el) {
    const ctx = el.__qripple;
    ctx.abort.forEach((fn) => {
      fn();
    });
    cleanEvt(ctx, "main");
    delete el._qripple;
  }
});
const alignMap = {
  left: "start",
  center: "center",
  right: "end",
  between: "between",
  around: "around",
  evenly: "evenly",
  stretch: "stretch"
};
const alignValues = Object.keys(alignMap);
const useAlignProps = {
  align: {
    type: String,
    validator: (v) => alignValues.includes(v)
  }
};
function useAlign(props) {
  return computed(() => {
    const align = props.align === void 0 ? props.vertical === true ? "stretch" : "left" : props.align;
    return `${props.vertical === true ? "items" : "justify"}-${alignMap[align]}`;
  });
}
function vmHasRouter(vm) {
  return vm.appContext.config.globalProperties.$router !== void 0;
}
function getOriginalPath(record) {
  return record ? record.aliasOf ? record.aliasOf.path : record.path : "";
}
function isSameRouteRecord(a2, b) {
  return (a2.aliasOf || a2) === (b.aliasOf || b);
}
function includesParams(outer, inner) {
  for (const key in inner) {
    const innerValue = inner[key], outerValue = outer[key];
    if (typeof innerValue === "string") {
      if (innerValue !== outerValue) {
        return false;
      }
    } else if (Array.isArray(outerValue) === false || outerValue.length !== innerValue.length || innerValue.some((value, i) => value !== outerValue[i])) {
      return false;
    }
  }
  return true;
}
function isEquivalentArray(a2, b) {
  return Array.isArray(b) === true ? a2.length === b.length && a2.every((value, i) => value === b[i]) : a2.length === 1 && a2[0] === b;
}
function isSameRouteLocationParamsValue(a2, b) {
  return Array.isArray(a2) === true ? isEquivalentArray(a2, b) : Array.isArray(b) === true ? isEquivalentArray(b, a2) : a2 === b;
}
function isSameRouteLocationParams(a2, b) {
  if (Object.keys(a2).length !== Object.keys(b).length) {
    return false;
  }
  for (const key in a2) {
    if (isSameRouteLocationParamsValue(a2[key], b[key]) === false) {
      return false;
    }
  }
  return true;
}
const useRouterLinkProps = {
  to: [String, Object],
  replace: Boolean,
  exact: Boolean,
  activeClass: {
    type: String,
    default: "q-router-link--active"
  },
  exactActiveClass: {
    type: String,
    default: "q-router-link--exact-active"
  },
  href: String,
  target: String,
  disable: Boolean
};
function useRouterLink(fallbackTag) {
  const vm = getCurrentInstance();
  const { props, proxy } = vm;
  const hasRouter = vmHasRouter(vm);
  const hasHrefLink = computed(() => props.disable !== true && props.href !== void 0);
  const hasRouterLinkProps = computed(() => hasRouter === true && props.disable !== true && hasHrefLink.value !== true && props.to !== void 0 && props.to !== null && props.to !== "");
  const linkRoute = computed(() => {
    if (hasRouterLinkProps.value === true) {
      try {
        return proxy.$router.resolve(props.to);
      } catch (err) {
      }
    }
    return null;
  });
  const hasRouterLink = computed(() => linkRoute.value !== null);
  const hasLink = computed(() => hasHrefLink.value === true || hasRouterLink.value === true);
  const linkTag = computed(() => props.type === "a" || hasLink.value === true ? "a" : props.tag || fallbackTag || "div");
  const linkProps = computed(() => hasHrefLink.value === true ? {
    href: props.href,
    target: props.target
  } : hasRouterLink.value === true ? {
    href: linkRoute.value.href,
    target: props.target
  } : {});
  const linkActiveIndex = computed(() => {
    if (hasRouterLink.value === false) {
      return null;
    }
    const { matched } = linkRoute.value, { length } = matched, routeMatched = matched[length - 1];
    if (routeMatched === void 0) {
      return -1;
    }
    const currentMatched = proxy.$route.matched;
    if (currentMatched.length === 0) {
      return -1;
    }
    const index2 = currentMatched.findIndex(isSameRouteRecord.bind(null, routeMatched));
    if (index2 > -1) {
      return index2;
    }
    const parentRecordPath = getOriginalPath(matched[length - 2]);
    return length > 1 && getOriginalPath(routeMatched) === parentRecordPath && currentMatched[currentMatched.length - 1].path !== parentRecordPath ? currentMatched.findIndex(isSameRouteRecord.bind(null, matched[length - 2])) : index2;
  });
  const linkIsActive = computed(() => hasRouterLink.value === true && linkActiveIndex.value > -1 && includesParams(proxy.$route.params, linkRoute.value.params));
  const linkIsExactActive = computed(() => linkIsActive.value === true && linkActiveIndex.value === proxy.$route.matched.length - 1 && isSameRouteLocationParams(proxy.$route.params, linkRoute.value.params));
  const linkClass = computed(() => hasRouterLink.value === true ? linkIsExactActive.value === true ? ` ${props.exactActiveClass} ${props.activeClass}` : props.exact === true ? "" : linkIsActive.value === true ? ` ${props.activeClass}` : "" : "");
  function navigateToRouterLink(e) {
    if (props.disable === true || e.metaKey || e.altKey || e.ctrlKey || e.shiftKey || e.__qNavigate !== true && e.defaultPrevented === true || e.button !== void 0 && e.button !== 0 || props.target === "_blank") {
      return false;
    }
    prevent(e);
    return proxy.$router[props.replace === true ? "replace" : "push"](props.to).catch((err) => err);
  }
  return {
    hasRouterLink,
    hasHrefLink,
    hasLink,
    linkTag,
    linkRoute,
    linkIsActive,
    linkIsExactActive,
    linkClass,
    linkProps,
    navigateToRouterLink
  };
}
const padding = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32
};
const defaultSizes = {
  xs: 8,
  sm: 10,
  md: 14,
  lg: 20,
  xl: 24
};
const formTypes = ["button", "submit", "reset"];
const mediaTypeRE = /[^\s]\/[^\s]/;
const useBtnProps = __spreadProps(__spreadValues(__spreadValues({}, useSizeProps), useRouterLinkProps), {
  type: {
    type: String,
    default: "button"
  },
  label: [Number, String],
  icon: String,
  iconRight: String,
  round: Boolean,
  outline: Boolean,
  flat: Boolean,
  unelevated: Boolean,
  rounded: Boolean,
  push: Boolean,
  glossy: Boolean,
  size: String,
  fab: Boolean,
  fabMini: Boolean,
  padding: String,
  color: String,
  textColor: String,
  noCaps: Boolean,
  noWrap: Boolean,
  dense: Boolean,
  tabindex: [Number, String],
  ripple: {
    type: [Boolean, Object],
    default: true
  },
  align: __spreadProps(__spreadValues({}, useAlignProps.align), {
    default: "center"
  }),
  stack: Boolean,
  stretch: Boolean,
  loading: {
    type: Boolean,
    default: null
  },
  disable: Boolean
});
function useBtn(props) {
  const sizeStyle = useSize(props, defaultSizes);
  const alignClass = useAlign(props);
  const { hasRouterLink, hasLink, linkTag, linkProps, navigateToRouterLink } = useRouterLink("button");
  const style = computed(() => {
    const obj = props.fab === false && props.fabMini === false ? sizeStyle.value : {};
    return props.padding !== void 0 ? Object.assign({}, obj, {
      padding: props.padding.split(/\s+/).map((v) => v in padding ? padding[v] + "px" : v).join(" "),
      minWidth: "0",
      minHeight: "0"
    }) : obj;
  });
  const isRounded = computed(() => props.rounded === true || props.fab === true || props.fabMini === true);
  const isActionable = computed(() => props.disable !== true && props.loading !== true);
  const tabIndex = computed(() => isActionable.value === true ? props.tabindex || 0 : -1);
  const design = computed(() => {
    if (props.flat === true)
      return "flat";
    if (props.outline === true)
      return "outline";
    if (props.push === true)
      return "push";
    if (props.unelevated === true)
      return "unelevated";
    return "standard";
  });
  const attributes = computed(() => {
    const acc = { tabindex: tabIndex.value };
    if (hasLink.value === true) {
      Object.assign(acc, linkProps.value);
    } else if (formTypes.includes(props.type) === true) {
      acc.type = props.type;
    }
    if (linkTag.value === "a") {
      if (props.disable === true) {
        acc["aria-disabled"] = "true";
      } else if (acc.href === void 0) {
        acc.role = "button";
      }
      if (hasRouterLink.value !== true && mediaTypeRE.test(props.type) === true) {
        acc.type = props.type;
      }
    } else if (props.disable === true) {
      acc.disabled = "";
      acc["aria-disabled"] = "true";
    }
    if (props.loading === true && props.percentage !== void 0) {
      Object.assign(acc, {
        role: "progressbar",
        "aria-valuemin": 0,
        "aria-valuemax": 100,
        "aria-valuenow": props.percentage
      });
    }
    return acc;
  });
  const classes = computed(() => {
    let colors;
    if (props.color !== void 0) {
      if (props.flat === true || props.outline === true) {
        colors = `text-${props.textColor || props.color}`;
      } else {
        colors = `bg-${props.color} text-${props.textColor || "white"}`;
      }
    } else if (props.textColor) {
      colors = `text-${props.textColor}`;
    }
    return `q-btn--${design.value} q-btn--${props.round === true ? "round" : `rectangle${isRounded.value === true ? " q-btn--rounded" : ""}`}` + (colors !== void 0 ? " " + colors : "") + (isActionable.value === true ? " q-btn--actionable q-focusable q-hoverable" : props.disable === true ? " disabled" : "") + (props.fab === true ? " q-btn--fab" : props.fabMini === true ? " q-btn--fab-mini" : "") + (props.noCaps === true ? " q-btn--no-uppercase" : "") + (props.dense === true ? " q-btn--dense" : "") + (props.stretch === true ? " no-border-radius self-stretch" : "") + (props.glossy === true ? " glossy" : "");
  });
  const innerClasses = computed(() => alignClass.value + (props.stack === true ? " column" : " row") + (props.noWrap === true ? " no-wrap text-no-wrap" : "") + (props.loading === true ? " q-btn__content--hidden" : ""));
  return {
    classes,
    style,
    innerClasses,
    attributes,
    hasRouterLink,
    hasLink,
    linkTag,
    navigateToRouterLink,
    isActionable
  };
}
const { passiveCapture } = listenOpts;
let touchTarget = null, keyboardTarget = null, mouseTarget = null;
var QBtn = createComponent({
  name: "QBtn",
  props: __spreadProps(__spreadValues({}, useBtnProps), {
    percentage: Number,
    darkPercentage: Boolean
  }),
  emits: ["click", "keydown", "touchstart", "mousedown", "keyup"],
  setup(props, { slots, emit }) {
    const { proxy } = getCurrentInstance();
    const {
      classes,
      style,
      innerClasses,
      attributes,
      hasRouterLink,
      hasLink,
      linkTag,
      navigateToRouterLink,
      isActionable
    } = useBtn(props);
    const rootRef = ref(null);
    const blurTargetRef = ref(null);
    let localTouchTargetEl = null, avoidMouseRipple, mouseTimer;
    const hasLabel = computed(() => props.label !== void 0 && props.label !== null && props.label !== "");
    const ripple = computed(() => props.disable === true || props.ripple === false ? false : __spreadValues({
      keyCodes: hasLink.value === true ? [13, 32] : [13]
    }, props.ripple === true ? {} : props.ripple));
    const rippleProps = computed(() => ({ center: props.round }));
    const percentageStyle = computed(() => {
      const val = Math.max(0, Math.min(100, props.percentage));
      return val > 0 ? { transition: "transform 0.6s", transform: `translateX(${val - 100}%)` } : {};
    });
    const onEvents = computed(() => {
      if (props.loading === true) {
        return {
          onMousedown: onLoadingEvt,
          onTouchstartPassive: onLoadingEvt,
          onClick: onLoadingEvt,
          onKeydown: onLoadingEvt,
          onKeyup: onLoadingEvt
        };
      }
      if (isActionable.value === true) {
        return {
          onClick,
          onKeydown,
          onMousedown,
          onTouchstart
        };
      }
      return {
        onClick: stopAndPrevent
      };
    });
    const nodeProps = computed(() => __spreadValues(__spreadValues({
      ref: rootRef,
      class: "q-btn q-btn-item non-selectable no-outline " + classes.value,
      style: style.value
    }, attributes.value), onEvents.value));
    function onClick(e) {
      if (rootRef.value === null) {
        return;
      }
      if (e !== void 0) {
        if (e.defaultPrevented === true) {
          return;
        }
        const el = document.activeElement;
        if (props.type === "submit" && el !== document.body && rootRef.value.contains(el) === false && el.contains(rootRef.value) === false) {
          rootRef.value.focus();
          const onClickCleanup = () => {
            document.removeEventListener("keydown", stopAndPrevent, true);
            document.removeEventListener("keyup", onClickCleanup, passiveCapture);
            rootRef.value !== null && rootRef.value.removeEventListener("blur", onClickCleanup, passiveCapture);
          };
          document.addEventListener("keydown", stopAndPrevent, true);
          document.addEventListener("keyup", onClickCleanup, passiveCapture);
          rootRef.value.addEventListener("blur", onClickCleanup, passiveCapture);
        }
      }
      if (hasRouterLink.value === true) {
        const go = () => {
          e.__qNavigate = true;
          navigateToRouterLink(e);
        };
        emit("click", e, go);
        e.defaultPrevented !== true && go();
      } else {
        emit("click", e);
      }
    }
    function onKeydown(e) {
      if (rootRef.value === null) {
        return;
      }
      emit("keydown", e);
      if (isKeyCode(e, [13, 32]) === true && keyboardTarget !== rootRef.value) {
        keyboardTarget !== null && cleanup();
        if (e.defaultPrevented !== true) {
          rootRef.value.focus();
          keyboardTarget = rootRef.value;
          rootRef.value.classList.add("q-btn--active");
          document.addEventListener("keyup", onPressEnd, true);
          rootRef.value.addEventListener("blur", onPressEnd, passiveCapture);
        }
        stopAndPrevent(e);
      }
    }
    function onTouchstart(e) {
      if (rootRef.value === null) {
        return;
      }
      emit("touchstart", e);
      if (e.defaultPrevented === true) {
        return;
      }
      if (touchTarget !== rootRef.value) {
        touchTarget !== null && cleanup();
        touchTarget = rootRef.value;
        localTouchTargetEl = e.target;
        localTouchTargetEl.addEventListener("touchcancel", onPressEnd, passiveCapture);
        localTouchTargetEl.addEventListener("touchend", onPressEnd, passiveCapture);
      }
      avoidMouseRipple = true;
      clearTimeout(mouseTimer);
      mouseTimer = setTimeout(() => {
        avoidMouseRipple = false;
      }, 200);
    }
    function onMousedown(e) {
      if (rootRef.value === null) {
        return;
      }
      e.qSkipRipple = avoidMouseRipple === true;
      emit("mousedown", e);
      if (e.defaultPrevented !== true && mouseTarget !== rootRef.value) {
        mouseTarget !== null && cleanup();
        mouseTarget = rootRef.value;
        rootRef.value.classList.add("q-btn--active");
        document.addEventListener("mouseup", onPressEnd, passiveCapture);
      }
    }
    function onPressEnd(e) {
      if (rootRef.value === null) {
        return;
      }
      if (e !== void 0 && e.type === "blur" && document.activeElement === rootRef.value) {
        return;
      }
      if (e !== void 0 && e.type === "keyup") {
        if (keyboardTarget === rootRef.value && isKeyCode(e, [13, 32]) === true) {
          const evt = new MouseEvent("click", e);
          evt.qKeyEvent = true;
          e.defaultPrevented === true && prevent(evt);
          e.cancelBubble === true && stop(evt);
          rootRef.value.dispatchEvent(evt);
          stopAndPrevent(e);
          e.qKeyEvent = true;
        }
        emit("keyup", e);
      }
      cleanup();
    }
    function cleanup(destroying) {
      const blurTarget = blurTargetRef.value;
      if (destroying !== true && (touchTarget === rootRef.value || mouseTarget === rootRef.value) && blurTarget !== null && blurTarget !== document.activeElement) {
        blurTarget.setAttribute("tabindex", -1);
        blurTarget.focus();
      }
      if (touchTarget === rootRef.value) {
        if (localTouchTargetEl !== null) {
          localTouchTargetEl.removeEventListener("touchcancel", onPressEnd, passiveCapture);
          localTouchTargetEl.removeEventListener("touchend", onPressEnd, passiveCapture);
        }
        touchTarget = localTouchTargetEl = null;
      }
      if (mouseTarget === rootRef.value) {
        document.removeEventListener("mouseup", onPressEnd, passiveCapture);
        mouseTarget = null;
      }
      if (keyboardTarget === rootRef.value) {
        document.removeEventListener("keyup", onPressEnd, true);
        rootRef.value !== null && rootRef.value.removeEventListener("blur", onPressEnd, passiveCapture);
        keyboardTarget = null;
      }
      rootRef.value !== null && rootRef.value.classList.remove("q-btn--active");
    }
    function onLoadingEvt(evt) {
      stopAndPrevent(evt);
      evt.qSkipRipple = true;
    }
    onBeforeUnmount(() => {
      cleanup(true);
    });
    Object.assign(proxy, { click: onClick });
    return () => {
      let inner = [];
      props.icon !== void 0 && inner.push(h(QIcon, {
        name: props.icon,
        left: props.stack === false && hasLabel.value === true,
        role: "img",
        "aria-hidden": "true"
      }));
      hasLabel.value === true && inner.push(h("span", { class: "block" }, [props.label]));
      inner = hMergeSlot(slots.default, inner);
      if (props.iconRight !== void 0 && props.round === false) {
        inner.push(h(QIcon, {
          name: props.iconRight,
          right: props.stack === false && hasLabel.value === true,
          role: "img",
          "aria-hidden": "true"
        }));
      }
      const child = [
        h("span", {
          class: "q-focus-helper",
          ref: blurTargetRef
        })
      ];
      if (props.loading === true && props.percentage !== void 0) {
        child.push(h("span", {
          class: "q-btn__progress absolute-full overflow-hidden" + (props.darkPercentage === true ? " q-btn__progress--dark" : "")
        }, [
          h("span", {
            class: "q-btn__progress-indicator fit block",
            style: percentageStyle.value
          })
        ]));
      }
      child.push(h("span", {
        class: "q-btn__content text-center col items-center q-anchor--skip " + innerClasses.value
      }, inner));
      props.loading !== null && child.push(h(Transition, {
        name: "q-transition--fade"
      }, () => props.loading === true ? [
        h("span", {
          key: "loading",
          class: "absolute-full flex flex-center"
        }, slots.loading !== void 0 ? slots.loading() : [h(QSpinner)])
      ] : null));
      return withDirectives(h(linkTag.value, nodeProps.value, child), [[
        Ripple,
        ripple.value,
        void 0,
        rippleProps.value
      ]]);
    };
  }
});
function clearSelection() {
  if (window.getSelection !== void 0) {
    const selection = window.getSelection();
    if (selection.empty !== void 0) {
      selection.empty();
    } else if (selection.removeAllRanges !== void 0) {
      selection.removeAllRanges();
      Platform.is.mobile !== true && selection.addRange(document.createRange());
    }
  } else if (document.selection !== void 0) {
    document.selection.empty();
  }
}
const useAnchorProps = {
  target: {
    default: true
  },
  noParentEvent: Boolean,
  contextMenu: Boolean
};
function useAnchor({
  showing,
  avoidEmit,
  configureAnchorEl
}) {
  const { props, proxy, emit } = getCurrentInstance();
  const anchorEl = ref(null);
  let touchTimer;
  function canShow(evt) {
    return anchorEl.value === null ? false : evt === void 0 || evt.touches === void 0 || evt.touches.length <= 1;
  }
  const anchorEvents = {};
  if (configureAnchorEl === void 0) {
    Object.assign(anchorEvents, {
      hide(evt) {
        proxy.hide(evt);
      },
      toggle(evt) {
        proxy.toggle(evt);
        evt.qAnchorHandled = true;
      },
      toggleKey(evt) {
        isKeyCode(evt, 13) === true && anchorEvents.toggle(evt);
      },
      contextClick(evt) {
        proxy.hide(evt);
        prevent(evt);
        nextTick(() => {
          proxy.show(evt);
          evt.qAnchorHandled = true;
        });
      },
      prevent,
      mobileTouch(evt) {
        anchorEvents.mobileCleanup(evt);
        if (canShow(evt) !== true) {
          return;
        }
        proxy.hide(evt);
        anchorEl.value.classList.add("non-selectable");
        const target2 = evt.target;
        addEvt(anchorEvents, "anchor", [
          [target2, "touchmove", "mobileCleanup", "passive"],
          [target2, "touchend", "mobileCleanup", "passive"],
          [target2, "touchcancel", "mobileCleanup", "passive"],
          [anchorEl.value, "contextmenu", "prevent", "notPassive"]
        ]);
        touchTimer = setTimeout(() => {
          proxy.show(evt);
          evt.qAnchorHandled = true;
        }, 300);
      },
      mobileCleanup(evt) {
        anchorEl.value.classList.remove("non-selectable");
        clearTimeout(touchTimer);
        if (showing.value === true && evt !== void 0) {
          clearSelection();
        }
      }
    });
    configureAnchorEl = function(context = props.contextMenu) {
      if (props.noParentEvent === true || anchorEl.value === null) {
        return;
      }
      let evts;
      if (context === true) {
        if (proxy.$q.platform.is.mobile === true) {
          evts = [
            [anchorEl.value, "touchstart", "mobileTouch", "passive"]
          ];
        } else {
          evts = [
            [anchorEl.value, "mousedown", "hide", "passive"],
            [anchorEl.value, "contextmenu", "contextClick", "notPassive"]
          ];
        }
      } else {
        evts = [
          [anchorEl.value, "click", "toggle", "passive"],
          [anchorEl.value, "keyup", "toggleKey", "passive"]
        ];
      }
      addEvt(anchorEvents, "anchor", evts);
    };
  }
  function unconfigureAnchorEl() {
    cleanEvt(anchorEvents, "anchor");
  }
  function setAnchorEl(el) {
    anchorEl.value = el;
    while (anchorEl.value.classList.contains("q-anchor--skip")) {
      anchorEl.value = anchorEl.value.parentNode;
    }
    configureAnchorEl();
  }
  function pickAnchorEl() {
    if (props.target === false || props.target === "" || proxy.$el.parentNode === null) {
      anchorEl.value = null;
    } else if (props.target === true) {
      setAnchorEl(proxy.$el.parentNode);
    } else {
      let el = props.target;
      if (typeof props.target === "string") {
        try {
          el = document.querySelector(props.target);
        } catch (err) {
          el = void 0;
        }
      }
      if (el !== void 0 && el !== null) {
        anchorEl.value = el.$el || el;
        configureAnchorEl();
      } else {
        anchorEl.value = null;
        console.error(`Anchor: target "${props.target}" not found`);
      }
    }
  }
  watch(() => props.contextMenu, (val) => {
    if (anchorEl.value !== null) {
      unconfigureAnchorEl();
      configureAnchorEl(val);
    }
  });
  watch(() => props.target, () => {
    if (anchorEl.value !== null) {
      unconfigureAnchorEl();
    }
    pickAnchorEl();
  });
  watch(() => props.noParentEvent, (val) => {
    if (anchorEl.value !== null) {
      if (val === true) {
        unconfigureAnchorEl();
      } else {
        configureAnchorEl();
      }
    }
  });
  onMounted(() => {
    pickAnchorEl();
    if (avoidEmit !== true && props.modelValue === true && anchorEl.value === null) {
      emit("update:modelValue", false);
    }
  });
  onBeforeUnmount(() => {
    clearTimeout(touchTimer);
    unconfigureAnchorEl();
  });
  return {
    anchorEl,
    canShow,
    anchorEvents
  };
}
function useScrollTarget(props, configureScrollTarget) {
  const localScrollTarget = ref(null);
  let scrollFn;
  function changeScrollEvent(scrollTarget, fn) {
    const fnProp = `${fn !== void 0 ? "add" : "remove"}EventListener`;
    const fnHandler = fn !== void 0 ? fn : scrollFn;
    if (scrollTarget !== window) {
      scrollTarget[fnProp]("scroll", fnHandler, listenOpts.passive);
    }
    window[fnProp]("scroll", fnHandler, listenOpts.passive);
    scrollFn = fn;
  }
  function unconfigureScrollTarget() {
    if (localScrollTarget.value !== null) {
      changeScrollEvent(localScrollTarget.value);
      localScrollTarget.value = null;
    }
  }
  const noParentEventWatcher = watch(() => props.noParentEvent, () => {
    if (localScrollTarget.value !== null) {
      unconfigureScrollTarget();
      configureScrollTarget();
    }
  });
  onBeforeUnmount(noParentEventWatcher);
  return {
    localScrollTarget,
    unconfigureScrollTarget,
    changeScrollEvent
  };
}
const useModelToggleProps = {
  modelValue: {
    type: Boolean,
    default: null
  },
  "onUpdate:modelValue": [Function, Array]
};
const useModelToggleEmits = [
  "before-show",
  "show",
  "before-hide",
  "hide"
];
function useModelToggle({
  showing,
  canShow,
  hideOnRouteChange,
  handleShow,
  handleHide,
  processOnMount
}) {
  const vm = getCurrentInstance();
  const { props, emit, proxy } = vm;
  let payload;
  function toggle(evt) {
    if (showing.value === true) {
      hide(evt);
    } else {
      show(evt);
    }
  }
  function show(evt) {
    if (props.disable === true || evt !== void 0 && evt.qAnchorHandled === true || canShow !== void 0 && canShow(evt) !== true) {
      return;
    }
    const listener = props["onUpdate:modelValue"] !== void 0;
    if (listener === true && true) {
      emit("update:modelValue", true);
      payload = evt;
      nextTick(() => {
        if (payload === evt) {
          payload = void 0;
        }
      });
    }
    if (props.modelValue === null || listener === false || false) {
      processShow(evt);
    }
  }
  function processShow(evt) {
    if (showing.value === true) {
      return;
    }
    showing.value = true;
    emit("before-show", evt);
    if (handleShow !== void 0) {
      handleShow(evt);
    } else {
      emit("show", evt);
    }
  }
  function hide(evt) {
    if (props.disable === true) {
      return;
    }
    const listener = props["onUpdate:modelValue"] !== void 0;
    if (listener === true && true) {
      emit("update:modelValue", false);
      payload = evt;
      nextTick(() => {
        if (payload === evt) {
          payload = void 0;
        }
      });
    }
    if (props.modelValue === null || listener === false || false) {
      processHide(evt);
    }
  }
  function processHide(evt) {
    if (showing.value === false) {
      return;
    }
    showing.value = false;
    emit("before-hide", evt);
    if (handleHide !== void 0) {
      handleHide(evt);
    } else {
      emit("hide", evt);
    }
  }
  function processModelChange(val) {
    if (props.disable === true && val === true) {
      if (props["onUpdate:modelValue"] !== void 0) {
        emit("update:modelValue", false);
      }
    } else if (val === true !== showing.value) {
      const fn = val === true ? processShow : processHide;
      fn(payload);
    }
  }
  watch(() => props.modelValue, processModelChange);
  if (hideOnRouteChange !== void 0 && vmHasRouter(vm) === true) {
    watch(() => proxy.$route.fullPath, () => {
      if (hideOnRouteChange.value === true && showing.value === true) {
        hide();
      }
    });
  }
  processOnMount === true && onMounted(() => {
    processModelChange(props.modelValue);
  });
  const publicMethods = { show, hide, toggle };
  Object.assign(proxy, publicMethods);
  return publicMethods;
}
let queue = [];
let waitFlags = [];
function clearFlag(flag) {
  waitFlags = waitFlags.filter((entry) => entry !== flag);
}
function addFocusWaitFlag(flag) {
  clearFlag(flag);
  waitFlags.push(flag);
}
function removeFocusWaitFlag(flag) {
  clearFlag(flag);
  if (waitFlags.length === 0 && queue.length > 0) {
    queue[queue.length - 1]();
    queue = [];
  }
}
function addFocusFn(fn) {
  if (waitFlags.length === 0) {
    fn();
  } else {
    queue.push(fn);
  }
}
function removeFocusFn(fn) {
  queue = queue.filter((entry) => entry !== fn);
}
let target = document.body;
function createGlobalNode(id) {
  const el = document.createElement("div");
  if (id !== void 0) {
    el.id = id;
  }
  if (globalConfig.globalNodes !== void 0) {
    const cls = globalConfig.globalNodes.class;
    if (cls !== void 0) {
      el.className = cls;
    }
  }
  target.appendChild(el);
  return el;
}
function removeGlobalNode(el) {
  el.remove();
}
const portalList = [];
function isOnGlobalDialog(vm) {
  vm = vm.parent;
  while (vm !== void 0 && vm !== null) {
    if (vm.type.name === "QGlobalDialog") {
      return true;
    }
    if (vm.type.name === "QDialog" || vm.type.name === "QMenu") {
      return false;
    }
    vm = vm.parent;
  }
  return false;
}
function usePortal(vm, innerRef, renderPortalContent, checkGlobalDialog) {
  const portalIsActive = ref(false);
  const portalIsAccessible = ref(false);
  let portalEl = null;
  const focusObj = {};
  const onGlobalDialog = checkGlobalDialog === true && isOnGlobalDialog(vm);
  function showPortal(isReady) {
    if (isReady === true) {
      removeFocusWaitFlag(focusObj);
      portalIsAccessible.value = true;
      return;
    }
    portalIsAccessible.value = false;
    if (portalIsActive.value === false) {
      if (onGlobalDialog === false && portalEl === null) {
        portalEl = createGlobalNode();
      }
      portalIsActive.value = true;
      portalList.push(vm.proxy);
      addFocusWaitFlag(focusObj);
    }
  }
  function hidePortal(isReady) {
    portalIsAccessible.value = false;
    if (isReady !== true) {
      return;
    }
    removeFocusWaitFlag(focusObj);
    portalIsActive.value = false;
    const index2 = portalList.indexOf(vm.proxy);
    if (index2 > -1) {
      portalList.splice(index2, 1);
    }
    if (portalEl !== null) {
      removeGlobalNode(portalEl);
      portalEl = null;
    }
  }
  onUnmounted(() => {
    hidePortal(true);
  });
  Object.assign(vm.proxy, { __qPortalInnerRef: innerRef });
  return {
    showPortal,
    hidePortal,
    portalIsActive,
    portalIsAccessible,
    renderPortal: () => onGlobalDialog === true ? renderPortalContent() : portalIsActive.value === true ? [h(Teleport, { to: portalEl }, renderPortalContent())] : void 0
  };
}
const useTransitionProps = {
  transitionShow: {
    type: String,
    default: "fade"
  },
  transitionHide: {
    type: String,
    default: "fade"
  },
  transitionDuration: {
    type: [String, Number],
    default: 300
  }
};
function useTransition(props, showing) {
  const transitionState = ref(showing.value);
  watch(showing, (val) => {
    nextTick(() => {
      transitionState.value = val;
    });
  });
  return {
    transition: computed(() => "q-transition--" + (transitionState.value === true ? props.transitionHide : props.transitionShow)),
    transitionStyle: computed(() => `--q-transition-duration: ${props.transitionDuration}ms`)
  };
}
function useTick() {
  let tickFn;
  onBeforeUnmount(() => {
    tickFn = void 0;
  });
  return {
    registerTick(fn) {
      tickFn = fn;
      nextTick(() => {
        if (tickFn === fn) {
          tickFn();
          tickFn = void 0;
        }
      });
    },
    removeTick() {
      tickFn = void 0;
    }
  };
}
function useTimeout() {
  let timer2;
  onBeforeUnmount(() => {
    clearTimeout(timer2);
  });
  return {
    registerTimeout(fn, delay) {
      clearTimeout(timer2);
      timer2 = setTimeout(fn, delay);
    },
    removeTimeout() {
      clearTimeout(timer2);
    }
  };
}
const scrollTargets = [null, document, document.body, document.scrollingElement, document.documentElement];
function getScrollTarget(el, targetEl) {
  let target2 = getElement(targetEl);
  if (target2 === void 0) {
    if (el === void 0 || el === null) {
      return window;
    }
    target2 = el.closest(".scroll,.scroll-y,.overflow-auto");
  }
  return scrollTargets.includes(target2) ? window : target2;
}
function getScrollHeight(el) {
  return (el === window ? document.body : el).scrollHeight;
}
function getScrollWidth(el) {
  return (el === window ? document.body : el).scrollWidth;
}
function getVerticalScrollPosition(scrollTarget) {
  return scrollTarget === window ? window.pageYOffset || window.scrollY || document.body.scrollTop || 0 : scrollTarget.scrollTop;
}
function getHorizontalScrollPosition(scrollTarget) {
  return scrollTarget === window ? window.pageXOffset || window.scrollX || document.body.scrollLeft || 0 : scrollTarget.scrollLeft;
}
function animVerticalScrollTo(el, to, duration = 0) {
  const prevTime = arguments[3] === void 0 ? performance.now() : arguments[3];
  const pos = getVerticalScrollPosition(el);
  if (duration <= 0) {
    if (pos !== to) {
      setScroll(el, to);
    }
    return;
  }
  requestAnimationFrame((nowTime) => {
    const frameTime = nowTime - prevTime;
    const newPos = pos + (to - pos) / Math.max(frameTime, duration) * frameTime;
    setScroll(el, newPos);
    if (newPos !== to) {
      animVerticalScrollTo(el, to, duration - frameTime, nowTime);
    }
  });
}
function animHorizontalScrollTo(el, to, duration = 0) {
  const prevTime = arguments[3] === void 0 ? performance.now() : arguments[3];
  const pos = getHorizontalScrollPosition(el);
  if (duration <= 0) {
    if (pos !== to) {
      setHorizontalScroll(el, to);
    }
    return;
  }
  requestAnimationFrame((nowTime) => {
    const frameTime = nowTime - prevTime;
    const newPos = pos + (to - pos) / Math.max(frameTime, duration) * frameTime;
    setHorizontalScroll(el, newPos);
    if (newPos !== to) {
      animHorizontalScrollTo(el, to, duration - frameTime, nowTime);
    }
  });
}
function setScroll(scrollTarget, offset) {
  if (scrollTarget === window) {
    window.scrollTo(window.pageXOffset || window.scrollX || document.body.scrollLeft || 0, offset);
    return;
  }
  scrollTarget.scrollTop = offset;
}
function setHorizontalScroll(scrollTarget, offset) {
  if (scrollTarget === window) {
    window.scrollTo(offset, window.pageYOffset || window.scrollY || document.body.scrollTop || 0);
    return;
  }
  scrollTarget.scrollLeft = offset;
}
function setVerticalScrollPosition(scrollTarget, offset, duration) {
  if (duration) {
    animVerticalScrollTo(scrollTarget, offset, duration);
    return;
  }
  setScroll(scrollTarget, offset);
}
function setHorizontalScrollPosition(scrollTarget, offset, duration) {
  if (duration) {
    animHorizontalScrollTo(scrollTarget, offset, duration);
    return;
  }
  setHorizontalScroll(scrollTarget, offset);
}
let size;
function getScrollbarWidth() {
  if (size !== void 0) {
    return size;
  }
  const inner = document.createElement("p"), outer = document.createElement("div");
  css(inner, {
    width: "100%",
    height: "200px"
  });
  css(outer, {
    position: "absolute",
    top: "0px",
    left: "0px",
    visibility: "hidden",
    width: "200px",
    height: "150px",
    overflow: "hidden"
  });
  outer.appendChild(inner);
  document.body.appendChild(outer);
  const w1 = inner.offsetWidth;
  outer.style.overflow = "scroll";
  let w2 = inner.offsetWidth;
  if (w1 === w2) {
    w2 = outer.clientWidth;
  }
  outer.remove();
  size = w1 - w2;
  return size;
}
function hasScrollbar(el, onY = true) {
  if (!el || el.nodeType !== Node.ELEMENT_NODE) {
    return false;
  }
  return onY ? el.scrollHeight > el.clientHeight && (el.classList.contains("scroll") || el.classList.contains("overflow-auto") || ["auto", "scroll"].includes(window.getComputedStyle(el)["overflow-y"])) : el.scrollWidth > el.clientWidth && (el.classList.contains("scroll") || el.classList.contains("overflow-auto") || ["auto", "scroll"].includes(window.getComputedStyle(el)["overflow-x"]));
}
var scroll = {
  getScrollTarget,
  getScrollHeight,
  getScrollWidth,
  getVerticalScrollPosition,
  getHorizontalScrollPosition,
  animVerticalScrollTo,
  animHorizontalScrollTo,
  setVerticalScrollPosition,
  setHorizontalScrollPosition,
  getScrollbarWidth,
  hasScrollbar
};
let timer;
const { notPassiveCapture } = listenOpts, registeredList = [];
function globalHandler(evt) {
  clearTimeout(timer);
  const target2 = evt.target;
  if (target2 === void 0 || target2.nodeType === 8 || target2.classList.contains("no-pointer-events") === true) {
    return;
  }
  let portalIndex = portalList.length - 1;
  while (portalIndex >= 0) {
    const proxy = portalList[portalIndex].$;
    if (proxy.type.name !== "QDialog") {
      break;
    }
    if (proxy.props.seamless !== true) {
      return;
    }
    portalIndex--;
  }
  for (let i = registeredList.length - 1; i >= 0; i--) {
    const state = registeredList[i];
    if ((state.anchorEl.value === null || state.anchorEl.value.contains(target2) === false) && (target2 === document.body || state.innerRef.value !== null && state.innerRef.value.contains(target2) === false)) {
      evt.qClickOutside = true;
      state.onClickOutside(evt);
    } else {
      return;
    }
  }
}
function addClickOutside(clickOutsideProps) {
  registeredList.push(clickOutsideProps);
  if (registeredList.length === 1) {
    document.addEventListener("mousedown", globalHandler, notPassiveCapture);
    document.addEventListener("touchstart", globalHandler, notPassiveCapture);
  }
}
function removeClickOutside(clickOutsideProps) {
  const index2 = registeredList.findIndex((h2) => h2 === clickOutsideProps);
  if (index2 > -1) {
    registeredList.splice(index2, 1);
    if (registeredList.length === 0) {
      clearTimeout(timer);
      document.removeEventListener("mousedown", globalHandler, notPassiveCapture);
      document.removeEventListener("touchstart", globalHandler, notPassiveCapture);
    }
  }
}
let vpLeft, vpTop;
function validatePosition(pos) {
  const parts = pos.split(" ");
  if (parts.length !== 2) {
    return false;
  }
  if (["top", "center", "bottom"].includes(parts[0]) !== true) {
    console.error("Anchor/Self position must start with one of top/center/bottom");
    return false;
  }
  if (["left", "middle", "right", "start", "end"].includes(parts[1]) !== true) {
    console.error("Anchor/Self position must end with one of left/middle/right/start/end");
    return false;
  }
  return true;
}
function validateOffset(val) {
  if (!val) {
    return true;
  }
  if (val.length !== 2) {
    return false;
  }
  if (typeof val[0] !== "number" || typeof val[1] !== "number") {
    return false;
  }
  return true;
}
const horizontalPos = {
  "start#ltr": "left",
  "start#rtl": "right",
  "end#ltr": "right",
  "end#rtl": "left"
};
["left", "middle", "right"].forEach((pos) => {
  horizontalPos[`${pos}#ltr`] = pos;
  horizontalPos[`${pos}#rtl`] = pos;
});
function parsePosition(pos, rtl) {
  const parts = pos.split(" ");
  return {
    vertical: parts[0],
    horizontal: horizontalPos[`${parts[1]}#${rtl === true ? "rtl" : "ltr"}`]
  };
}
function getAnchorProps(el, offset) {
  let { top, left, right, bottom, width, height } = el.getBoundingClientRect();
  if (offset !== void 0) {
    top -= offset[1];
    left -= offset[0];
    bottom += offset[1];
    right += offset[0];
    width += offset[0];
    height += offset[1];
  }
  return {
    top,
    left,
    right,
    bottom,
    width,
    height,
    middle: left + (right - left) / 2,
    center: top + (bottom - top) / 2
  };
}
function getTargetProps(el) {
  return {
    top: 0,
    center: el.offsetHeight / 2,
    bottom: el.offsetHeight,
    left: 0,
    middle: el.offsetWidth / 2,
    right: el.offsetWidth
  };
}
function setPosition(cfg) {
  if (client.is.ios === true && window.visualViewport !== void 0) {
    const el = document.body.style;
    const { offsetLeft: left, offsetTop: top } = window.visualViewport;
    if (left !== vpLeft) {
      el.setProperty("--q-pe-left", left + "px");
      vpLeft = left;
    }
    if (top !== vpTop) {
      el.setProperty("--q-pe-top", top + "px");
      vpTop = top;
    }
  }
  let anchorProps;
  const { scrollLeft, scrollTop } = cfg.el;
  if (cfg.absoluteOffset === void 0) {
    anchorProps = getAnchorProps(cfg.anchorEl, cfg.cover === true ? [0, 0] : cfg.offset);
  } else {
    const { top: anchorTop, left: anchorLeft } = cfg.anchorEl.getBoundingClientRect(), top = anchorTop + cfg.absoluteOffset.top, left = anchorLeft + cfg.absoluteOffset.left;
    anchorProps = { top, left, width: 1, height: 1, right: left + 1, center: top, middle: left, bottom: top + 1 };
  }
  let elStyle = {
    maxHeight: cfg.maxHeight,
    maxWidth: cfg.maxWidth,
    visibility: "visible"
  };
  if (cfg.fit === true || cfg.cover === true) {
    elStyle.minWidth = anchorProps.width + "px";
    if (cfg.cover === true) {
      elStyle.minHeight = anchorProps.height + "px";
    }
  }
  Object.assign(cfg.el.style, elStyle);
  const targetProps = getTargetProps(cfg.el), props = {
    top: anchorProps[cfg.anchorOrigin.vertical] - targetProps[cfg.selfOrigin.vertical],
    left: anchorProps[cfg.anchorOrigin.horizontal] - targetProps[cfg.selfOrigin.horizontal]
  };
  applyBoundaries(props, anchorProps, targetProps, cfg.anchorOrigin, cfg.selfOrigin);
  elStyle = {
    top: props.top + "px",
    left: props.left + "px"
  };
  if (props.maxHeight !== void 0) {
    elStyle.maxHeight = props.maxHeight + "px";
    if (anchorProps.height > props.maxHeight) {
      elStyle.minHeight = elStyle.maxHeight;
    }
  }
  if (props.maxWidth !== void 0) {
    elStyle.maxWidth = props.maxWidth + "px";
    if (anchorProps.width > props.maxWidth) {
      elStyle.minWidth = elStyle.maxWidth;
    }
  }
  Object.assign(cfg.el.style, elStyle);
  if (cfg.el.scrollTop !== scrollTop) {
    cfg.el.scrollTop = scrollTop;
  }
  if (cfg.el.scrollLeft !== scrollLeft) {
    cfg.el.scrollLeft = scrollLeft;
  }
}
function applyBoundaries(props, anchorProps, targetProps, anchorOrigin, selfOrigin) {
  const currentHeight = targetProps.bottom, currentWidth = targetProps.right, margin = getScrollbarWidth(), innerHeight = window.innerHeight - margin, innerWidth = document.body.clientWidth;
  if (props.top < 0 || props.top + currentHeight > innerHeight) {
    if (selfOrigin.vertical === "center") {
      props.top = anchorProps[anchorOrigin.vertical] > innerHeight / 2 ? Math.max(0, innerHeight - currentHeight) : 0;
      props.maxHeight = Math.min(currentHeight, innerHeight);
    } else if (anchorProps[anchorOrigin.vertical] > innerHeight / 2) {
      const anchorY = Math.min(innerHeight, anchorOrigin.vertical === "center" ? anchorProps.center : anchorOrigin.vertical === selfOrigin.vertical ? anchorProps.bottom : anchorProps.top);
      props.maxHeight = Math.min(currentHeight, anchorY);
      props.top = Math.max(0, anchorY - currentHeight);
    } else {
      props.top = Math.max(0, anchorOrigin.vertical === "center" ? anchorProps.center : anchorOrigin.vertical === selfOrigin.vertical ? anchorProps.top : anchorProps.bottom);
      props.maxHeight = Math.min(currentHeight, innerHeight - props.top);
    }
  }
  if (props.left < 0 || props.left + currentWidth > innerWidth) {
    props.maxWidth = Math.min(currentWidth, innerWidth);
    if (selfOrigin.horizontal === "middle") {
      props.left = anchorProps[anchorOrigin.horizontal] > innerWidth / 2 ? Math.max(0, innerWidth - currentWidth) : 0;
    } else if (anchorProps[anchorOrigin.horizontal] > innerWidth / 2) {
      const anchorX = Math.min(innerWidth, anchorOrigin.horizontal === "middle" ? anchorProps.middle : anchorOrigin.horizontal === selfOrigin.horizontal ? anchorProps.right : anchorProps.left);
      props.maxWidth = Math.min(currentWidth, anchorX);
      props.left = Math.max(0, anchorX - props.maxWidth);
    } else {
      props.left = Math.max(0, anchorOrigin.horizontal === "middle" ? anchorProps.middle : anchorOrigin.horizontal === selfOrigin.horizontal ? anchorProps.left : anchorProps.right);
      props.maxWidth = Math.min(currentWidth, innerWidth - props.left);
    }
  }
}
var QTooltip = createComponent({
  name: "QTooltip",
  inheritAttrs: false,
  props: __spreadProps(__spreadValues(__spreadValues(__spreadValues({}, useAnchorProps), useModelToggleProps), useTransitionProps), {
    maxHeight: {
      type: String,
      default: null
    },
    maxWidth: {
      type: String,
      default: null
    },
    transitionShow: {
      default: "jump-down"
    },
    transitionHide: {
      default: "jump-up"
    },
    anchor: {
      type: String,
      default: "bottom middle",
      validator: validatePosition
    },
    self: {
      type: String,
      default: "top middle",
      validator: validatePosition
    },
    offset: {
      type: Array,
      default: () => [14, 14],
      validator: validateOffset
    },
    scrollTarget: {
      default: void 0
    },
    delay: {
      type: Number,
      default: 0
    },
    hideDelay: {
      type: Number,
      default: 0
    }
  }),
  emits: [
    ...useModelToggleEmits
  ],
  setup(props, { slots, emit, attrs }) {
    let unwatchPosition, observer;
    const vm = getCurrentInstance();
    const { proxy: { $q } } = vm;
    const innerRef = ref(null);
    const showing = ref(false);
    const anchorOrigin = computed(() => parsePosition(props.anchor, $q.lang.rtl));
    const selfOrigin = computed(() => parsePosition(props.self, $q.lang.rtl));
    const hideOnRouteChange = computed(() => props.persistent !== true);
    const { registerTick, removeTick } = useTick();
    const { registerTimeout, removeTimeout } = useTimeout();
    const { transition, transitionStyle } = useTransition(props, showing);
    const { localScrollTarget, changeScrollEvent, unconfigureScrollTarget } = useScrollTarget(props, configureScrollTarget);
    const { anchorEl, canShow, anchorEvents } = useAnchor({ showing, configureAnchorEl });
    const { show, hide } = useModelToggle({
      showing,
      canShow,
      handleShow,
      handleHide,
      hideOnRouteChange,
      processOnMount: true
    });
    Object.assign(anchorEvents, { delayShow, delayHide });
    const { showPortal, hidePortal, renderPortal } = usePortal(vm, innerRef, renderPortalContent);
    if ($q.platform.is.mobile === true) {
      const clickOutsideProps = {
        anchorEl,
        innerRef,
        onClickOutside(e) {
          hide(e);
          if (e.target.classList.contains("q-dialog__backdrop")) {
            stopAndPrevent(e);
          }
          return true;
        }
      };
      const hasClickOutside = computed(() => props.modelValue === null && props.persistent !== true && showing.value === true);
      watch(hasClickOutside, (val) => {
        const fn = val === true ? addClickOutside : removeClickOutside;
        fn(clickOutsideProps);
      });
      onBeforeUnmount(() => {
        removeClickOutside(clickOutsideProps);
      });
    }
    function handleShow(evt) {
      removeTick();
      removeTimeout();
      showPortal();
      registerTick(() => {
        observer = new MutationObserver(() => updatePosition());
        observer.observe(innerRef.value, { attributes: false, childList: true, characterData: true, subtree: true });
        updatePosition();
        configureScrollTarget();
      });
      if (unwatchPosition === void 0) {
        unwatchPosition = watch(() => $q.screen.width + "|" + $q.screen.height + "|" + props.self + "|" + props.anchor + "|" + $q.lang.rtl, updatePosition);
      }
      registerTimeout(() => {
        showPortal(true);
        emit("show", evt);
      }, props.transitionDuration);
    }
    function handleHide(evt) {
      removeTick();
      removeTimeout();
      hidePortal();
      anchorCleanup();
      registerTimeout(() => {
        hidePortal(true);
        emit("hide", evt);
      }, props.transitionDuration);
    }
    function anchorCleanup() {
      if (observer !== void 0) {
        observer.disconnect();
        observer = void 0;
      }
      if (unwatchPosition !== void 0) {
        unwatchPosition();
        unwatchPosition = void 0;
      }
      unconfigureScrollTarget();
      cleanEvt(anchorEvents, "tooltipTemp");
    }
    function updatePosition() {
      const el = innerRef.value;
      if (anchorEl.value === null || !el) {
        return;
      }
      setPosition({
        el,
        offset: props.offset,
        anchorEl: anchorEl.value,
        anchorOrigin: anchorOrigin.value,
        selfOrigin: selfOrigin.value,
        maxHeight: props.maxHeight,
        maxWidth: props.maxWidth
      });
    }
    function delayShow(evt) {
      if ($q.platform.is.mobile === true) {
        clearSelection();
        document.body.classList.add("non-selectable");
        const target2 = anchorEl.value;
        const evts = ["touchmove", "touchcancel", "touchend", "click"].map((e) => [target2, e, "delayHide", "passiveCapture"]);
        addEvt(anchorEvents, "tooltipTemp", evts);
      }
      registerTimeout(() => {
        show(evt);
      }, props.delay);
    }
    function delayHide(evt) {
      removeTimeout();
      if ($q.platform.is.mobile === true) {
        cleanEvt(anchorEvents, "tooltipTemp");
        clearSelection();
        setTimeout(() => {
          document.body.classList.remove("non-selectable");
        }, 10);
      }
      registerTimeout(() => {
        hide(evt);
      }, props.hideDelay);
    }
    function configureAnchorEl() {
      if (props.noParentEvent === true || anchorEl.value === null) {
        return;
      }
      const evts = $q.platform.is.mobile === true ? [
        [anchorEl.value, "touchstart", "delayShow", "passive"]
      ] : [
        [anchorEl.value, "mouseenter", "delayShow", "passive"],
        [anchorEl.value, "mouseleave", "delayHide", "passive"]
      ];
      addEvt(anchorEvents, "anchor", evts);
    }
    function configureScrollTarget() {
      if (anchorEl.value !== null || props.scrollTarget !== void 0) {
        localScrollTarget.value = getScrollTarget(anchorEl.value, props.scrollTarget);
        const fn = props.noParentEvent === true ? updatePosition : hide;
        changeScrollEvent(localScrollTarget.value, fn);
      }
    }
    function getTooltipContent() {
      return showing.value === true ? h("div", __spreadProps(__spreadValues({}, attrs), {
        ref: innerRef,
        class: [
          "q-tooltip q-tooltip--style q-position-engine no-pointer-events",
          attrs.class
        ],
        style: [
          attrs.style,
          transitionStyle.value
        ],
        role: "complementary"
      }), hSlot(slots.default)) : null;
    }
    function renderPortalContent() {
      return h(Transition, {
        name: transition.value,
        appear: true
      }, getTooltipContent);
    }
    onBeforeUnmount(anchorCleanup);
    Object.assign(vm.proxy, { updatePosition });
    return renderPortal;
  }
});
var QCardSection = createComponent({
  name: "QCardSection",
  props: {
    tag: {
      type: String,
      default: "div"
    },
    horizontal: Boolean
  },
  setup(props, { slots }) {
    const classes = computed(() => `q-card__section q-card__section--${props.horizontal === true ? "horiz row no-wrap" : "vert"}`);
    return () => h(props.tag, { class: classes.value }, hSlot(slots.default));
  }
});
const useDarkProps = {
  dark: {
    type: Boolean,
    default: null
  }
};
function useDark(props, $q) {
  return computed(() => props.dark === null ? $q.dark.isActive : props.dark);
}
var QItem = createComponent({
  name: "QItem",
  props: __spreadProps(__spreadValues(__spreadValues({}, useDarkProps), useRouterLinkProps), {
    tag: {
      type: String,
      default: "div"
    },
    active: {
      type: Boolean,
      default: null
    },
    clickable: Boolean,
    dense: Boolean,
    insetLevel: Number,
    tabindex: [String, Number],
    focused: Boolean,
    manualFocus: Boolean
  }),
  emits: ["click", "keyup"],
  setup(props, { slots, emit }) {
    const { proxy: { $q } } = getCurrentInstance();
    const isDark = useDark(props, $q);
    const { hasRouterLink, hasLink, linkProps, linkClass, linkTag, navigateToRouterLink } = useRouterLink();
    const rootRef = ref(null);
    const blurTargetRef = ref(null);
    const isActionable = computed(() => props.clickable === true || hasLink.value === true || props.tag === "label");
    const isClickable = computed(() => props.disable !== true && isActionable.value === true);
    const classes = computed(() => "q-item q-item-type row no-wrap" + (props.dense === true ? " q-item--dense" : "") + (isDark.value === true ? " q-item--dark" : "") + (hasLink.value === true && props.active === null ? linkClass.value : props.active === true ? `${props.activeClass !== void 0 ? ` ${props.activeClass}` : ""} q-item--active` : "") + (props.disable === true ? " disabled" : "") + (isClickable.value === true ? " q-item--clickable q-link cursor-pointer " + (props.manualFocus === true ? "q-manual-focusable" : "q-focusable q-hoverable") + (props.focused === true ? " q-manual-focusable--focused" : "") : ""));
    const style = computed(() => {
      if (props.insetLevel === void 0) {
        return null;
      }
      const dir = $q.lang.rtl === true ? "Right" : "Left";
      return {
        ["padding" + dir]: 16 + props.insetLevel * 56 + "px"
      };
    });
    function onClick(e) {
      if (isClickable.value === true) {
        if (blurTargetRef.value !== null) {
          if (e.qKeyEvent !== true && document.activeElement === rootRef.value) {
            blurTargetRef.value.focus();
          } else if (document.activeElement === blurTargetRef.value) {
            rootRef.value.focus();
          }
        }
        hasRouterLink.value === true && navigateToRouterLink(e);
        emit("click", e);
      }
    }
    function onKeyup(e) {
      if (isClickable.value === true && isKeyCode(e, 13) === true) {
        stopAndPrevent(e);
        e.qKeyEvent = true;
        const evt = new MouseEvent("click", e);
        evt.qKeyEvent = true;
        rootRef.value.dispatchEvent(evt);
      }
      emit("keyup", e);
    }
    function getContent() {
      const child = hUniqueSlot(slots.default, []);
      isClickable.value === true && child.unshift(h("div", { class: "q-focus-helper", tabindex: -1, ref: blurTargetRef }));
      return child;
    }
    return () => {
      const data = {
        ref: rootRef,
        class: classes.value,
        style: style.value,
        onClick,
        onKeyup
      };
      if (isClickable.value === true) {
        data.tabindex = props.tabindex || "0";
        Object.assign(data, linkProps.value);
      } else if (isActionable.value === true) {
        data["aria-disabled"] = "true";
      }
      return h(linkTag.value, data, getContent());
    };
  }
});
var QItemSection = createComponent({
  name: "QItemSection",
  props: {
    avatar: Boolean,
    thumbnail: Boolean,
    side: Boolean,
    top: Boolean,
    noWrap: Boolean
  },
  setup(props, { slots }) {
    const classes = computed(() => `q-item__section column q-item__section--${props.avatar === true || props.side === true || props.thumbnail === true ? "side" : "main"}` + (props.top === true ? " q-item__section--top justify-start" : " justify-center") + (props.avatar === true ? " q-item__section--avatar" : "") + (props.thumbnail === true ? " q-item__section--thumbnail" : "") + (props.noWrap === true ? " q-item__section--nowrap" : ""));
    return () => h("div", { class: classes.value }, hSlot(slots.default));
  }
});
var QItemLabel = createComponent({
  name: "QItemLabel",
  props: {
    overline: Boolean,
    caption: Boolean,
    header: Boolean,
    lines: [Number, String]
  },
  setup(props, { slots }) {
    const parsedLines = computed(() => parseInt(props.lines, 10));
    const classes = computed(() => "q-item__label" + (props.overline === true ? " q-item__label--overline text-overline" : "") + (props.caption === true ? " q-item__label--caption text-caption" : "") + (props.header === true ? " q-item__label--header" : "") + (parsedLines.value === 1 ? " ellipsis" : ""));
    const style = computed(() => {
      return props.lines !== void 0 && parsedLines.value > 1 ? {
        overflow: "hidden",
        display: "-webkit-box",
        "-webkit-box-orient": "vertical",
        "-webkit-line-clamp": parsedLines.value
      } : null;
    });
    return () => h("div", {
      style: style.value,
      class: classes.value
    }, hSlot(slots.default));
  }
});
var QSlideTransition = createComponent({
  name: "QSlideTransition",
  props: {
    appear: Boolean,
    duration: {
      type: Number,
      default: 300
    }
  },
  emits: ["show", "hide"],
  setup(props, { slots, emit }) {
    let animating = false, doneFn, element;
    let timer2, timerFallback, animListener, lastEvent;
    function cleanup() {
      doneFn && doneFn();
      doneFn = null;
      animating = false;
      clearTimeout(timer2);
      clearTimeout(timerFallback);
      element !== void 0 && element.removeEventListener("transitionend", animListener);
      animListener = null;
    }
    function begin(el, height, done) {
      el.style.overflowY = "hidden";
      if (height !== void 0) {
        el.style.height = `${height}px`;
      }
      el.style.transition = `height ${props.duration}ms cubic-bezier(.25, .8, .50, 1)`;
      animating = true;
      doneFn = done;
    }
    function end(el, event) {
      el.style.overflowY = null;
      el.style.height = null;
      el.style.transition = null;
      cleanup();
      event !== lastEvent && emit(event);
    }
    function onEnter(el, done) {
      let pos = 0;
      element = el;
      if (animating === true) {
        cleanup();
        pos = el.offsetHeight === el.scrollHeight ? 0 : void 0;
      } else {
        lastEvent = "hide";
      }
      begin(el, pos, done);
      timer2 = setTimeout(() => {
        el.style.height = `${el.scrollHeight}px`;
        animListener = (evt) => {
          if (Object(evt) !== evt || evt.target === el) {
            end(el, "show");
          }
        };
        el.addEventListener("transitionend", animListener);
        timerFallback = setTimeout(animListener, props.duration * 1.1);
      }, 100);
    }
    function onLeave(el, done) {
      let pos;
      element = el;
      if (animating === true) {
        cleanup();
      } else {
        lastEvent = "show";
        pos = el.scrollHeight;
      }
      begin(el, pos, done);
      timer2 = setTimeout(() => {
        el.style.height = 0;
        animListener = (evt) => {
          if (Object(evt) !== evt || evt.target === el) {
            end(el, "hide");
          }
        };
        el.addEventListener("transitionend", animListener);
        timerFallback = setTimeout(animListener, props.duration * 1.1);
      }, 100);
    }
    onBeforeUnmount(() => {
      animating === true && cleanup();
    });
    return () => h(Transition, {
      css: false,
      appear: props.appear,
      onEnter,
      onLeave
    }, slots.default);
  }
});
const insetMap = {
  true: "inset",
  item: "item-inset",
  "item-thumbnail": "item-thumbnail-inset"
};
const margins = {
  xs: 2,
  sm: 4,
  md: 8,
  lg: 16,
  xl: 24
};
var QSeparator = createComponent({
  name: "QSeparator",
  props: __spreadProps(__spreadValues({}, useDarkProps), {
    spaced: [Boolean, String],
    inset: [Boolean, String],
    vertical: Boolean,
    color: String,
    size: String
  }),
  setup(props) {
    const vm = getCurrentInstance();
    const isDark = useDark(props, vm.proxy.$q);
    const orientation = computed(() => props.vertical === true ? "vertical" : "horizontal");
    const orientClass = computed(() => ` q-separator--${orientation.value}`);
    const insetClass = computed(() => props.inset !== false ? `${orientClass.value}-${insetMap[props.inset]}` : "");
    const classes = computed(() => `q-separator${orientClass.value}${insetClass.value}` + (props.color !== void 0 ? ` bg-${props.color}` : "") + (isDark.value === true ? " q-separator--dark" : ""));
    const style = computed(() => {
      const acc = {};
      if (props.size !== void 0) {
        acc[props.vertical === true ? "width" : "height"] = props.size;
      }
      if (props.spaced !== false) {
        const size2 = props.spaced === true ? `${margins.md}px` : props.spaced in margins ? `${margins[props.spaced]}px` : props.spaced;
        const dir = props.vertical === true ? ["Left", "Right"] : ["Top", "Bottom"];
        acc[`margin${dir[0]}`] = acc[`margin${dir[1]}`] = size2;
      }
      return acc;
    });
    return () => h("hr", {
      class: classes.value,
      style: style.value,
      "aria-orientation": orientation.value
    });
  }
});
let buf, bufIdx = 0;
const hexBytes = new Array(256);
for (let i = 0; i < 256; i++) {
  hexBytes[i] = (i + 256).toString(16).substring(1);
}
const randomBytes = (() => {
  const lib = typeof crypto !== "undefined" ? crypto : typeof window !== "undefined" ? window.crypto || window.msCrypto : void 0;
  if (lib !== void 0) {
    if (lib.randomBytes !== void 0) {
      return lib.randomBytes;
    }
    if (lib.getRandomValues !== void 0) {
      return (n) => {
        const bytes = new Uint8Array(n);
        lib.getRandomValues(bytes);
        return bytes;
      };
    }
  }
  return (n) => {
    const r = [];
    for (let i = n; i > 0; i--) {
      r.push(Math.floor(Math.random() * 256));
    }
    return r;
  };
})();
const BUFFER_SIZE = 4096;
function uid() {
  if (buf === void 0 || bufIdx + 16 > BUFFER_SIZE) {
    bufIdx = 0;
    buf = randomBytes(BUFFER_SIZE);
  }
  const b = Array.prototype.slice.call(buf, bufIdx, bufIdx += 16);
  b[6] = b[6] & 15 | 64;
  b[8] = b[8] & 63 | 128;
  return hexBytes[b[0]] + hexBytes[b[1]] + hexBytes[b[2]] + hexBytes[b[3]] + "-" + hexBytes[b[4]] + hexBytes[b[5]] + "-" + hexBytes[b[6]] + hexBytes[b[7]] + "-" + hexBytes[b[8]] + hexBytes[b[9]] + "-" + hexBytes[b[10]] + hexBytes[b[11]] + hexBytes[b[12]] + hexBytes[b[13]] + hexBytes[b[14]] + hexBytes[b[15]];
}
const itemGroups = shallowReactive({});
const LINK_PROPS = Object.keys(useRouterLinkProps);
var QExpansionItem = createComponent({
  name: "QExpansionItem",
  props: __spreadProps(__spreadValues(__spreadValues(__spreadValues({}, useRouterLinkProps), useModelToggleProps), useDarkProps), {
    icon: String,
    label: String,
    labelLines: [Number, String],
    caption: String,
    captionLines: [Number, String],
    dense: Boolean,
    expandIcon: String,
    expandedIcon: String,
    expandIconClass: [Array, String, Object],
    duration: Number,
    headerInsetLevel: Number,
    contentInsetLevel: Number,
    expandSeparator: Boolean,
    defaultOpened: Boolean,
    expandIconToggle: Boolean,
    switchToggleSide: Boolean,
    denseToggle: Boolean,
    group: String,
    popup: Boolean,
    headerStyle: [Array, String, Object],
    headerClass: [Array, String, Object]
  }),
  emits: [
    ...useModelToggleEmits,
    "click",
    "after-show",
    "after-hide"
  ],
  setup(props, { slots, emit }) {
    const { proxy: { $q } } = getCurrentInstance();
    const isDark = useDark(props, $q);
    const showing = ref(props.modelValue !== null ? props.modelValue : props.defaultOpened);
    const blurTargetRef = ref(null);
    const { hide, toggle } = useModelToggle({ showing });
    let uniqueId, exitGroup;
    const classes = computed(() => `q-expansion-item q-item-type q-expansion-item--${showing.value === true ? "expanded" : "collapsed"} q-expansion-item--${props.popup === true ? "popup" : "standard"}`);
    const contentStyle = computed(() => {
      if (props.contentInsetLevel === void 0) {
        return null;
      }
      const dir = $q.lang.rtl === true ? "Right" : "Left";
      return {
        ["padding" + dir]: props.contentInsetLevel * 56 + "px"
      };
    });
    const hasLink = computed(() => props.disable !== true && (props.href !== void 0 || props.to !== void 0 && props.to !== null && props.to !== ""));
    const linkProps = computed(() => {
      const acc = {};
      LINK_PROPS.forEach((key) => {
        acc[key] = props[key];
      });
      return acc;
    });
    const isClickable = computed(() => hasLink.value === true || props.expandIconToggle !== true);
    const expansionIcon = computed(() => props.expandedIcon !== void 0 && showing.value === true ? props.expandedIcon : props.expandIcon || $q.iconSet.expansionItem[props.denseToggle === true ? "denseIcon" : "icon"]);
    const activeToggleIcon = computed(() => props.disable !== true && (hasLink.value === true || props.expandIconToggle === true));
    watch(() => props.group, (name) => {
      exitGroup !== void 0 && exitGroup();
      name !== void 0 && enterGroup();
    });
    function onHeaderClick(e) {
      hasLink.value !== true && toggle(e);
      emit("click", e);
    }
    function toggleIconKeyboard(e) {
      e.keyCode === 13 && toggleIcon(e, true);
    }
    function toggleIcon(e, keyboard) {
      keyboard !== true && blurTargetRef.value !== null && blurTargetRef.value.focus();
      toggle(e);
      stopAndPrevent(e);
    }
    function onShow() {
      emit("after-show");
    }
    function onHide() {
      emit("after-hide");
    }
    function enterGroup() {
      if (uniqueId === void 0) {
        uniqueId = uid();
      }
      if (showing.value === true) {
        itemGroups[props.group] = uniqueId;
      }
      const show = watch(showing, (val) => {
        if (val === true) {
          itemGroups[props.group] = uniqueId;
        } else if (itemGroups[props.group] === uniqueId) {
          delete itemGroups[props.group];
        }
      });
      const group = watch(() => itemGroups[props.group], (val, oldVal) => {
        if (oldVal === uniqueId && val !== void 0 && val !== uniqueId) {
          hide();
        }
      });
      exitGroup = () => {
        show();
        group();
        if (itemGroups[props.group] === uniqueId) {
          delete itemGroups[props.group];
        }
        exitGroup = void 0;
      };
    }
    function getToggleIcon() {
      const data = {
        class: [
          `q-focusable relative-position cursor-pointer${props.denseToggle === true && props.switchToggleSide === true ? " items-end" : ""}`,
          props.expandIconClass
        ],
        side: props.switchToggleSide !== true,
        avatar: props.switchToggleSide
      };
      const child = [
        h(QIcon, {
          class: "q-expansion-item__toggle-icon" + (props.expandedIcon === void 0 && showing.value === true ? " q-expansion-item__toggle-icon--rotated" : ""),
          name: expansionIcon.value
        })
      ];
      if (activeToggleIcon.value === true) {
        Object.assign(data, {
          tabindex: 0,
          onClick: toggleIcon,
          onKeyup: toggleIconKeyboard
        });
        child.unshift(h("div", {
          ref: blurTargetRef,
          class: "q-expansion-item__toggle-focus q-icon q-focus-helper q-focus-helper--rounded",
          tabindex: -1
        }));
      }
      return h(QItemSection, data, () => child);
    }
    function getHeaderChild() {
      let child;
      if (slots.header !== void 0) {
        child = [].concat(slots.header());
      } else {
        child = [
          h(QItemSection, () => [
            h(QItemLabel, { lines: props.labelLines }, () => props.label || ""),
            props.caption ? h(QItemLabel, { lines: props.captionLines, caption: true }, () => props.caption) : null
          ])
        ];
        props.icon && child[props.switchToggleSide === true ? "push" : "unshift"](h(QItemSection, {
          side: props.switchToggleSide === true,
          avatar: props.switchToggleSide !== true
        }, () => h(QIcon, { name: props.icon })));
      }
      props.disable !== true && child[props.switchToggleSide === true ? "unshift" : "push"](getToggleIcon());
      return child;
    }
    function getHeader() {
      const data = {
        ref: "item",
        style: props.headerStyle,
        class: props.headerClass,
        dark: isDark.value,
        disable: props.disable,
        dense: props.dense,
        insetLevel: props.headerInsetLevel
      };
      if (isClickable.value === true) {
        data.clickable = true;
        data.onClick = onHeaderClick;
        hasLink.value === true && Object.assign(data, linkProps.value);
      }
      return h(QItem, data, getHeaderChild);
    }
    function getTransitionChild() {
      return withDirectives(h("div", {
        key: "e-content",
        class: "q-expansion-item__content relative-position",
        style: contentStyle.value
      }, hSlot(slots.default)), [[
        vShow,
        showing.value
      ]]);
    }
    function getContent() {
      const node = [
        getHeader(),
        h(QSlideTransition, {
          duration: props.duration,
          onShow,
          onHide
        }, getTransitionChild)
      ];
      if (props.expandSeparator === true) {
        node.push(h(QSeparator, {
          class: "q-expansion-item__border q-expansion-item__border--top absolute-top",
          dark: isDark.value
        }), h(QSeparator, {
          class: "q-expansion-item__border q-expansion-item__border--bottom absolute-bottom",
          dark: isDark.value
        }));
      }
      return node;
    }
    props.group !== void 0 && enterGroup();
    onBeforeUnmount(() => {
      exitGroup !== void 0 && exitGroup();
    });
    return () => h("div", { class: classes.value }, [
      h("div", { class: "q-expansion-item__container relative-position" }, getContent())
    ]);
  }
});
var QList = createComponent({
  name: "QList",
  props: __spreadProps(__spreadValues({}, useDarkProps), {
    bordered: Boolean,
    dense: Boolean,
    separator: Boolean,
    padding: Boolean
  }),
  setup(props, { slots }) {
    const vm = getCurrentInstance();
    const isDark = useDark(props, vm.proxy.$q);
    const classes = computed(() => "q-list" + (props.bordered === true ? " q-list--bordered" : "") + (props.dense === true ? " q-list--dense" : "") + (props.separator === true ? " q-list--separator" : "") + (isDark.value === true ? " q-list--dark" : "") + (props.padding === true ? " q-list--padding" : ""));
    return () => h("div", { class: classes.value }, hSlot(slots.default));
  }
});
function useFormChild({ validate, resetValidation, requiresQForm }) {
  const $form = inject(formKey, false);
  if ($form !== false) {
    const { props, proxy } = getCurrentInstance();
    Object.assign(proxy, { validate, resetValidation });
    watch(() => props.disable, (val) => {
      if (val === true) {
        typeof resetValidation === "function" && resetValidation();
        $form.unbindComponent(proxy);
      } else {
        $form.bindComponent(proxy);
      }
    });
    props.disable !== true && $form.bindComponent(proxy);
    onBeforeUnmount(() => {
      props.disable !== true && $form.unbindComponent(proxy);
    });
  } else if (requiresQForm === true) {
    console.error("Parent QForm not found on useFormChild()!");
  }
}
const hex = /^#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/, hexa = /^#[0-9a-fA-F]{4}([0-9a-fA-F]{4})?$/, hexOrHexa = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/, rgb = /^rgb\(((0|[1-9][\d]?|1[\d]{0,2}|2[\d]?|2[0-4][\d]|25[0-5]),){2}(0|[1-9][\d]?|1[\d]{0,2}|2[\d]?|2[0-4][\d]|25[0-5])\)$/, rgba = /^rgba\(((0|[1-9][\d]?|1[\d]{0,2}|2[\d]?|2[0-4][\d]|25[0-5]),){2}(0|[1-9][\d]?|1[\d]{0,2}|2[\d]?|2[0-4][\d]|25[0-5]),(0|0\.[0-9]+[1-9]|0\.[1-9]+|1)\)$/;
const testPattern = {
  date: (v) => /^-?[\d]+\/[0-1]\d\/[0-3]\d$/.test(v),
  time: (v) => /^([0-1]?\d|2[0-3]):[0-5]\d$/.test(v),
  fulltime: (v) => /^([0-1]?\d|2[0-3]):[0-5]\d:[0-5]\d$/.test(v),
  timeOrFulltime: (v) => /^([0-1]?\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/.test(v),
  email: (v) => /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v),
  hexColor: (v) => hex.test(v),
  hexaColor: (v) => hexa.test(v),
  hexOrHexaColor: (v) => hexOrHexa.test(v),
  rgbColor: (v) => rgb.test(v),
  rgbaColor: (v) => rgba.test(v),
  rgbOrRgbaColor: (v) => rgb.test(v) || rgba.test(v),
  hexOrRgbColor: (v) => hex.test(v) || rgb.test(v),
  hexaOrRgbaColor: (v) => hexa.test(v) || rgba.test(v),
  anyColor: (v) => hexOrHexa.test(v) || rgb.test(v) || rgba.test(v)
};
"Boolean Number String Function Array Date RegExp Object".split(" ").forEach((name) => {
  name.toLowerCase();
});
const useCircularCommonProps = __spreadProps(__spreadValues({}, useSizeProps), {
  min: {
    type: Number,
    default: 0
  },
  max: {
    type: Number,
    default: 100
  },
  color: String,
  centerColor: String,
  trackColor: String,
  fontSize: String,
  thickness: {
    type: Number,
    default: 0.2,
    validator: (v) => v >= 0 && v <= 1
  },
  angle: {
    type: Number,
    default: 0
  },
  showValue: Boolean,
  reverse: Boolean,
  instantFeedback: Boolean
});
function between(v, min, max) {
  return max <= min ? min : Math.min(max, Math.max(min, v));
}
const radius = 50, diameter = 2 * radius, circumference = diameter * Math.PI, strokeDashArray = Math.round(circumference * 1e3) / 1e3;
createComponent({
  name: "QCircularProgress",
  props: __spreadProps(__spreadValues({}, useCircularCommonProps), {
    value: {
      type: Number,
      default: 0
    },
    animationSpeed: {
      type: [String, Number],
      default: 600
    },
    indeterminate: Boolean
  }),
  setup(props, { slots }) {
    const { proxy: { $q } } = getCurrentInstance();
    const sizeStyle = useSize(props);
    const svgStyle = computed(() => {
      const angle = ($q.lang.rtl === true ? -1 : 1) * props.angle;
      return {
        transform: props.reverse !== ($q.lang.rtl === true) ? `scale3d(-1, 1, 1) rotate3d(0, 0, 1, ${-90 - angle}deg)` : `rotate3d(0, 0, 1, ${angle - 90}deg)`
      };
    });
    const circleStyle = computed(() => props.instantFeedback !== true && props.indeterminate !== true ? { transition: `stroke-dashoffset ${props.animationSpeed}ms ease 0s, stroke ${props.animationSpeed}ms ease` } : "");
    const viewBox = computed(() => diameter / (1 - props.thickness / 2));
    const viewBoxAttr = computed(() => `${viewBox.value / 2} ${viewBox.value / 2} ${viewBox.value} ${viewBox.value}`);
    const normalized = computed(() => between(props.value, props.min, props.max));
    const strokeDashOffset = computed(() => circumference * (1 - (normalized.value - props.min) / (props.max - props.min)));
    const strokeWidth = computed(() => props.thickness / 2 * viewBox.value);
    function getCircle({ thickness, offset, color, cls }) {
      return h("circle", {
        class: "q-circular-progress__" + cls + (color !== void 0 ? ` text-${color}` : ""),
        style: circleStyle.value,
        fill: "transparent",
        stroke: "currentColor",
        "stroke-width": thickness,
        "stroke-dasharray": strokeDashArray,
        "stroke-dashoffset": offset,
        cx: viewBox.value,
        cy: viewBox.value,
        r: radius
      });
    }
    return () => {
      const svgChild = [];
      props.centerColor !== void 0 && props.centerColor !== "transparent" && svgChild.push(h("circle", {
        class: `q-circular-progress__center text-${props.centerColor}`,
        fill: "currentColor",
        r: radius - strokeWidth.value / 2,
        cx: viewBox.value,
        cy: viewBox.value
      }));
      props.trackColor !== void 0 && props.trackColor !== "transparent" && svgChild.push(getCircle({
        cls: "track",
        thickness: strokeWidth.value,
        offset: 0,
        color: props.trackColor
      }));
      svgChild.push(getCircle({
        cls: "circle",
        thickness: strokeWidth.value,
        offset: strokeDashOffset.value,
        color: props.color
      }));
      const child = [
        h("svg", {
          class: "q-circular-progress__svg",
          style: svgStyle.value,
          viewBox: viewBoxAttr.value,
          "aria-hidden": "true"
        }, svgChild)
      ];
      props.showValue === true && child.push(h("div", {
        class: "q-circular-progress__text absolute-full row flex-center content-center",
        style: { fontSize: props.fontSize }
      }, slots.default !== void 0 ? slots.default() : [h("div", normalized.value)]));
      return h("div", {
        class: `q-circular-progress q-circular-progress--${props.indeterminate === true ? "in" : ""}determinate`,
        style: sizeStyle.value,
        role: "progressbar",
        "aria-valuemin": props.min,
        "aria-valuemax": props.max,
        "aria-valuenow": props.indeterminate === true ? void 0 : normalized.value
      }, hMergeSlotSafely(slots.internal, child));
    };
  }
});
const useFileEmits = ["rejected"];
const coreEmits = [
  ...useFileEmits,
  "start",
  "finish",
  "added",
  "removed"
];
const trueFn = () => true;
function getEmitsObject(emitsArray) {
  const emitsObject = {};
  emitsArray.forEach((val) => {
    emitsObject[val] = trueFn;
  });
  return emitsObject;
}
getEmitsObject(coreEmits);
const lazyRulesValues = [true, false, "ondemand"];
const useValidateProps = {
  modelValue: {},
  error: {
    type: Boolean,
    default: null
  },
  errorMessage: String,
  noErrorIcon: Boolean,
  rules: Array,
  reactiveRules: Boolean,
  lazyRules: {
    type: [Boolean, String],
    validator: (v) => lazyRulesValues.includes(v)
  }
};
function useValidate(focused, innerLoading) {
  const { props, proxy } = getCurrentInstance();
  const innerError = ref(false);
  const innerErrorMessage = ref(null);
  const isDirtyModel = ref(null);
  useFormChild({ validate, resetValidation });
  let validateIndex = 0, unwatchRules;
  const hasRules = computed(() => props.rules !== void 0 && props.rules !== null && props.rules.length > 0);
  const hasActiveRules = computed(() => props.disable !== true && hasRules.value === true);
  const hasError = computed(() => props.error === true || innerError.value === true);
  const errorMessage = computed(() => typeof props.errorMessage === "string" && props.errorMessage.length > 0 ? props.errorMessage : innerErrorMessage.value);
  watch(() => props.modelValue, () => {
    validateIfNeeded();
  });
  watch(() => props.reactiveRules, (val) => {
    if (val === true) {
      if (unwatchRules === void 0) {
        unwatchRules = watch(() => props.rules, () => {
          validateIfNeeded(true);
        });
      }
    } else if (unwatchRules !== void 0) {
      unwatchRules();
      unwatchRules = void 0;
    }
  }, { immediate: true });
  watch(focused, (val) => {
    if (val === true) {
      if (isDirtyModel.value === null) {
        isDirtyModel.value = false;
      }
    } else if (isDirtyModel.value === false) {
      isDirtyModel.value = true;
      if (hasActiveRules.value === true && props.lazyRules !== "ondemand" && innerLoading.value === false) {
        debouncedValidate();
      }
    }
  });
  function resetValidation() {
    validateIndex++;
    innerLoading.value = false;
    isDirtyModel.value = null;
    innerError.value = false;
    innerErrorMessage.value = null;
    debouncedValidate.cancel();
  }
  function validate(val = props.modelValue) {
    if (hasActiveRules.value !== true) {
      return true;
    }
    const index2 = ++validateIndex;
    if (innerLoading.value !== true && props.lazyRules !== true) {
      isDirtyModel.value = true;
    }
    const update2 = (err, msg) => {
      if (innerError.value !== err) {
        innerError.value = err;
      }
      const m = msg || void 0;
      if (innerErrorMessage.value !== m) {
        innerErrorMessage.value = m;
      }
      innerLoading.value = false;
    };
    const promises = [];
    for (let i = 0; i < props.rules.length; i++) {
      const rule = props.rules[i];
      let res;
      if (typeof rule === "function") {
        res = rule(val);
      } else if (typeof rule === "string" && testPattern[rule] !== void 0) {
        res = testPattern[rule](val);
      }
      if (res === false || typeof res === "string") {
        update2(true, res);
        return false;
      } else if (res !== true && res !== void 0) {
        promises.push(res);
      }
    }
    if (promises.length === 0) {
      update2(false);
      return true;
    }
    innerLoading.value = true;
    return Promise.all(promises).then((res) => {
      if (res === void 0 || Array.isArray(res) === false || res.length === 0) {
        index2 === validateIndex && update2(false);
        return true;
      }
      const msg = res.find((r) => r === false || typeof r === "string");
      index2 === validateIndex && update2(msg !== void 0, msg);
      return msg === void 0;
    }, (e) => {
      if (index2 === validateIndex) {
        console.error(e);
        update2(true);
      }
      return false;
    });
  }
  function validateIfNeeded(changedRules) {
    if (hasActiveRules.value === true && props.lazyRules !== "ondemand" && (isDirtyModel.value === true || props.lazyRules !== true && changedRules !== true)) {
      debouncedValidate();
    }
  }
  const debouncedValidate = debounce(validate, 0);
  onBeforeUnmount(() => {
    unwatchRules !== void 0 && unwatchRules();
    debouncedValidate.cancel();
  });
  Object.assign(proxy, { resetValidation, validate });
  injectProp(proxy, "hasError", () => hasError.value);
  return {
    isDirtyModel,
    hasRules,
    hasError,
    errorMessage,
    validate,
    resetValidation
  };
}
const listenerRE = /^on[A-Z]/;
function useSplitAttrs(attrs, vnode) {
  const acc = {
    listeners: ref({}),
    attributes: ref({})
  };
  function update2() {
    const attributes = {};
    const listeners = {};
    for (const key in attrs) {
      if (key !== "class" && key !== "style" && listenerRE.test(key) === false) {
        attributes[key] = attrs[key];
      }
    }
    for (const key in vnode.props) {
      if (listenerRE.test(key) === true) {
        listeners[key] = vnode.props[key];
      }
    }
    acc.attributes.value = attributes;
    acc.listeners.value = listeners;
  }
  onBeforeUpdate(update2);
  update2();
  return acc;
}
function getTargetUid(val) {
  return val === void 0 ? `f_${uid()}` : val;
}
function fieldValueIsFilled(val) {
  return val !== void 0 && val !== null && ("" + val).length > 0;
}
const useFieldProps = __spreadProps(__spreadValues(__spreadValues({}, useDarkProps), useValidateProps), {
  label: String,
  stackLabel: Boolean,
  hint: String,
  hideHint: Boolean,
  prefix: String,
  suffix: String,
  labelColor: String,
  color: String,
  bgColor: String,
  filled: Boolean,
  outlined: Boolean,
  borderless: Boolean,
  standout: [Boolean, String],
  square: Boolean,
  loading: Boolean,
  labelSlot: Boolean,
  bottomSlots: Boolean,
  hideBottomSpace: Boolean,
  rounded: Boolean,
  dense: Boolean,
  itemAligned: Boolean,
  counter: Boolean,
  clearable: Boolean,
  clearIcon: String,
  disable: Boolean,
  readonly: Boolean,
  autofocus: Boolean,
  for: String,
  maxlength: [Number, String]
});
const useFieldEmits = ["update:modelValue", "clear", "focus", "blur", "popup-show", "popup-hide"];
function useFieldState() {
  const { props, attrs, proxy, vnode } = getCurrentInstance();
  const isDark = useDark(props, proxy.$q);
  return {
    isDark,
    editable: computed(() => props.disable !== true && props.readonly !== true),
    innerLoading: ref(false),
    focused: ref(false),
    hasPopupOpen: false,
    splitAttrs: useSplitAttrs(attrs, vnode),
    targetUid: ref(getTargetUid(props.for)),
    rootRef: ref(null),
    targetRef: ref(null),
    controlRef: ref(null)
  };
}
function useField(state) {
  const { props, emit, slots, attrs, proxy } = getCurrentInstance();
  const { $q } = proxy;
  let focusoutTimer;
  if (state.hasValue === void 0) {
    state.hasValue = computed(() => fieldValueIsFilled(props.modelValue));
  }
  if (state.emitValue === void 0) {
    state.emitValue = (value) => {
      emit("update:modelValue", value);
    };
  }
  if (state.controlEvents === void 0) {
    state.controlEvents = {
      onFocusin: onControlFocusin,
      onFocusout: onControlFocusout
    };
  }
  Object.assign(state, {
    clearValue,
    onControlFocusin,
    onControlFocusout,
    focus
  });
  if (state.computedCounter === void 0) {
    state.computedCounter = computed(() => {
      if (props.counter !== false) {
        const len = typeof props.modelValue === "string" || typeof props.modelValue === "number" ? ("" + props.modelValue).length : Array.isArray(props.modelValue) === true ? props.modelValue.length : 0;
        const max = props.maxlength !== void 0 ? props.maxlength : props.maxValues;
        return len + (max !== void 0 ? " / " + max : "");
      }
    });
  }
  const {
    isDirtyModel,
    hasRules,
    hasError,
    errorMessage,
    resetValidation
  } = useValidate(state.focused, state.innerLoading);
  const floatingLabel = state.floatingLabel !== void 0 ? computed(() => props.stackLabel === true || state.focused.value === true || state.floatingLabel.value === true) : computed(() => props.stackLabel === true || state.focused.value === true || state.hasValue.value === true);
  const shouldRenderBottom = computed(() => props.bottomSlots === true || props.hint !== void 0 || hasRules.value === true || props.counter === true || props.error !== null);
  const styleType = computed(() => {
    if (props.filled === true) {
      return "filled";
    }
    if (props.outlined === true) {
      return "outlined";
    }
    if (props.borderless === true) {
      return "borderless";
    }
    if (props.standout) {
      return "standout";
    }
    return "standard";
  });
  const classes = computed(() => `q-field row no-wrap items-start q-field--${styleType.value}` + (state.fieldClass !== void 0 ? ` ${state.fieldClass.value}` : "") + (props.rounded === true ? " q-field--rounded" : "") + (props.square === true ? " q-field--square" : "") + (floatingLabel.value === true ? " q-field--float" : "") + (hasLabel.value === true ? " q-field--labeled" : "") + (props.dense === true ? " q-field--dense" : "") + (props.itemAligned === true ? " q-field--item-aligned q-item-type" : "") + (state.isDark.value === true ? " q-field--dark" : "") + (state.getControl === void 0 ? " q-field--auto-height" : "") + (state.focused.value === true ? " q-field--focused" : "") + (hasError.value === true ? " q-field--error" : "") + (hasError.value === true || state.focused.value === true ? " q-field--highlighted" : "") + (props.hideBottomSpace !== true && shouldRenderBottom.value === true ? " q-field--with-bottom" : "") + (props.disable === true ? " q-field--disabled" : props.readonly === true ? " q-field--readonly" : ""));
  const contentClass = computed(() => "q-field__control relative-position row no-wrap" + (props.bgColor !== void 0 ? ` bg-${props.bgColor}` : "") + (hasError.value === true ? " text-negative" : typeof props.standout === "string" && props.standout.length > 0 && state.focused.value === true ? ` ${props.standout}` : props.color !== void 0 ? ` text-${props.color}` : ""));
  const hasLabel = computed(() => props.labelSlot === true || props.label !== void 0);
  const labelClass = computed(() => "q-field__label no-pointer-events absolute ellipsis" + (props.labelColor !== void 0 && hasError.value !== true ? ` text-${props.labelColor}` : ""));
  const controlSlotScope = computed(() => ({
    id: state.targetUid.value,
    editable: state.editable.value,
    focused: state.focused.value,
    floatingLabel: floatingLabel.value,
    modelValue: props.modelValue,
    emitValue: state.emitValue
  }));
  const attributes = computed(() => {
    const acc = {
      for: state.targetUid.value
    };
    if (props.disable === true) {
      acc["aria-disabled"] = "true";
    } else if (props.readonly === true) {
      acc["aria-readonly"] = "true";
    }
    return acc;
  });
  watch(() => props.for, (val) => {
    state.targetUid.value = getTargetUid(val);
  });
  function focusHandler() {
    const el = document.activeElement;
    let target2 = state.targetRef !== void 0 && state.targetRef.value;
    if (target2 && (el === null || el.id !== state.targetUid.value)) {
      target2.hasAttribute("tabindex") === true || (target2 = target2.querySelector("[tabindex]"));
      if (target2 && target2 !== el) {
        target2.focus({ preventScroll: true });
      }
    }
  }
  function focus() {
    addFocusFn(focusHandler);
  }
  function blur() {
    removeFocusFn(focusHandler);
    const el = document.activeElement;
    if (el !== null && state.rootRef.value.contains(el)) {
      el.blur();
    }
  }
  function onControlFocusin(e) {
    clearTimeout(focusoutTimer);
    if (state.editable.value === true && state.focused.value === false) {
      state.focused.value = true;
      emit("focus", e);
    }
  }
  function onControlFocusout(e, then) {
    clearTimeout(focusoutTimer);
    focusoutTimer = setTimeout(() => {
      if (document.hasFocus() === true && (state.hasPopupOpen === true || state.controlRef === void 0 || state.controlRef.value === null || state.controlRef.value.contains(document.activeElement) !== false)) {
        return;
      }
      if (state.focused.value === true) {
        state.focused.value = false;
        emit("blur", e);
      }
      then !== void 0 && then();
    });
  }
  function clearValue(e) {
    stopAndPrevent(e);
    if ($q.platform.is.mobile !== true) {
      const el = state.targetRef !== void 0 && state.targetRef.value || state.rootRef.value;
      el.focus();
    } else if (state.rootRef.value.contains(document.activeElement) === true) {
      document.activeElement.blur();
    }
    if (props.type === "file") {
      state.inputRef.value.value = null;
    }
    emit("update:modelValue", null);
    emit("clear", props.modelValue);
    nextTick(() => {
      resetValidation();
      if ($q.platform.is.mobile !== true) {
        isDirtyModel.value = false;
      }
    });
  }
  function getContent() {
    const node = [];
    slots.prepend !== void 0 && node.push(h("div", {
      class: "q-field__prepend q-field__marginal row no-wrap items-center",
      key: "prepend",
      onClick: prevent
    }, slots.prepend()));
    node.push(h("div", {
      class: "q-field__control-container col relative-position row no-wrap q-anchor--skip"
    }, getControlContainer()));
    hasError.value === true && props.noErrorIcon === false && node.push(getInnerAppendNode("error", [
      h(QIcon, { name: $q.iconSet.field.error, color: "negative" })
    ]));
    if (props.loading === true || state.innerLoading.value === true) {
      node.push(getInnerAppendNode("inner-loading-append", slots.loading !== void 0 ? slots.loading() : [h(QSpinner, { color: props.color })]));
    } else if (props.clearable === true && state.hasValue.value === true && state.editable.value === true) {
      node.push(getInnerAppendNode("inner-clearable-append", [
        h(QIcon, {
          class: "q-field__focusable-action",
          tag: "button",
          name: props.clearIcon || $q.iconSet.field.clear,
          tabindex: 0,
          type: "button",
          "aria-hidden": null,
          role: null,
          onClick: clearValue
        })
      ]));
    }
    slots.append !== void 0 && node.push(h("div", {
      class: "q-field__append q-field__marginal row no-wrap items-center",
      key: "append",
      onClick: prevent
    }, slots.append()));
    state.getInnerAppend !== void 0 && node.push(getInnerAppendNode("inner-append", state.getInnerAppend()));
    state.getControlChild !== void 0 && node.push(state.getControlChild());
    return node;
  }
  function getControlContainer() {
    const node = [];
    props.prefix !== void 0 && props.prefix !== null && node.push(h("div", {
      class: "q-field__prefix no-pointer-events row items-center"
    }, props.prefix));
    if (state.getShadowControl !== void 0 && state.hasShadow.value === true) {
      node.push(state.getShadowControl());
    }
    if (state.getControl !== void 0) {
      node.push(state.getControl());
    } else if (slots.rawControl !== void 0) {
      node.push(slots.rawControl());
    } else if (slots.control !== void 0) {
      node.push(h("div", __spreadProps(__spreadValues({
        ref: state.targetRef,
        class: "q-field__native row",
        tabindex: -1
      }, state.splitAttrs.attributes.value), {
        "data-autofocus": props.autofocus === true || void 0
      }), slots.control(controlSlotScope.value)));
    }
    hasLabel.value === true && node.push(h("div", {
      class: labelClass.value
    }, hSlot(slots.label, props.label)));
    props.suffix !== void 0 && props.suffix !== null && node.push(h("div", {
      class: "q-field__suffix no-pointer-events row items-center"
    }, props.suffix));
    return node.concat(hSlot(slots.default));
  }
  function getBottom() {
    let msg, key;
    if (hasError.value === true) {
      if (errorMessage.value !== null) {
        msg = [h("div", { role: "alert" }, errorMessage.value)];
        key = `q--slot-error-${errorMessage.value}`;
      } else {
        msg = hSlot(slots.error);
        key = "q--slot-error";
      }
    } else if (props.hideHint !== true || state.focused.value === true) {
      if (props.hint !== void 0) {
        msg = [h("div", props.hint)];
        key = `q--slot-hint-${props.hint}`;
      } else {
        msg = hSlot(slots.hint);
        key = "q--slot-hint";
      }
    }
    const hasCounter = props.counter === true || slots.counter !== void 0;
    if (props.hideBottomSpace === true && hasCounter === false && msg === void 0) {
      return;
    }
    const main2 = h("div", {
      key,
      class: "q-field__messages col"
    }, msg);
    return h("div", {
      class: "q-field__bottom row items-start q-field__bottom--" + (props.hideBottomSpace !== true ? "animated" : "stale")
    }, [
      props.hideBottomSpace === true ? main2 : h(Transition, { name: "q-transition--field-message" }, () => main2),
      hasCounter === true ? h("div", {
        class: "q-field__counter"
      }, slots.counter !== void 0 ? slots.counter() : state.computedCounter.value) : null
    ]);
  }
  function getInnerAppendNode(key, content) {
    return content === null ? null : h("div", {
      key,
      class: "q-field__append q-field__marginal row no-wrap items-center q-anchor--skip"
    }, content);
  }
  Object.assign(proxy, { focus, blur });
  let shouldActivate = false;
  onDeactivated(() => {
    shouldActivate = true;
  });
  onActivated(() => {
    shouldActivate === true && props.autofocus === true && proxy.focus();
  });
  onMounted(() => {
    if (isRuntimeSsrPreHydration.value === true && props.for === void 0) {
      state.targetUid.value = getTargetUid();
    }
    props.autofocus === true && proxy.focus();
  });
  onBeforeUnmount(() => {
    clearTimeout(focusoutTimer);
  });
  return function renderField() {
    const labelAttrs = state.getControl === void 0 && slots.control === void 0 ? __spreadValues(__spreadProps(__spreadValues({}, state.splitAttrs.attributes.value), {
      "data-autofocus": props.autofocus === true || void 0
    }), attributes.value) : attributes.value;
    return h("label", __spreadValues({
      ref: state.rootRef,
      class: [
        classes.value,
        attrs.class
      ],
      style: attrs.style
    }, labelAttrs), [
      slots.before !== void 0 ? h("div", {
        class: "q-field__before q-field__marginal row no-wrap items-center",
        onClick: prevent
      }, slots.before()) : null,
      h("div", {
        class: "q-field__inner relative-position col self-stretch"
      }, [
        h("div", __spreadValues({
          ref: state.controlRef,
          class: contentClass.value,
          tabindex: -1
        }, state.controlEvents), getContent()),
        shouldRenderBottom.value === true ? getBottom() : null
      ]),
      slots.after !== void 0 ? h("div", {
        class: "q-field__after q-field__marginal row no-wrap items-center",
        onClick: prevent
      }, slots.after()) : null
    ]);
  };
}
const NAMED_MASKS = {
  date: "####/##/##",
  datetime: "####/##/## ##:##",
  time: "##:##",
  fulltime: "##:##:##",
  phone: "(###) ### - ####",
  card: "#### #### #### ####"
};
const TOKENS = {
  "#": { pattern: "[\\d]", negate: "[^\\d]" },
  S: { pattern: "[a-zA-Z]", negate: "[^a-zA-Z]" },
  N: { pattern: "[0-9a-zA-Z]", negate: "[^0-9a-zA-Z]" },
  A: { pattern: "[a-zA-Z]", negate: "[^a-zA-Z]", transform: (v) => v.toLocaleUpperCase() },
  a: { pattern: "[a-zA-Z]", negate: "[^a-zA-Z]", transform: (v) => v.toLocaleLowerCase() },
  X: { pattern: "[0-9a-zA-Z]", negate: "[^0-9a-zA-Z]", transform: (v) => v.toLocaleUpperCase() },
  x: { pattern: "[0-9a-zA-Z]", negate: "[^0-9a-zA-Z]", transform: (v) => v.toLocaleLowerCase() }
};
const KEYS = Object.keys(TOKENS);
KEYS.forEach((key) => {
  TOKENS[key].regex = new RegExp(TOKENS[key].pattern);
});
const tokenRegexMask = new RegExp("\\\\([^.*+?^${}()|([\\]])|([.*+?^${}()|[\\]])|([" + KEYS.join("") + "])|(.)", "g"), escRegex = /[.*+?^${}()|[\]\\]/g;
const MARKER = String.fromCharCode(1);
const useMaskProps = {
  mask: String,
  reverseFillMask: Boolean,
  fillMask: [Boolean, String],
  unmaskedValue: Boolean
};
function useMask(props, emit, emitValue, inputRef) {
  let maskMarked, maskReplaced, computedMask, computedUnmask;
  const hasMask = ref(null);
  const innerValue = ref(getInitialMaskedValue());
  function getIsTypeText() {
    return props.autogrow === true || ["textarea", "text", "search", "url", "tel", "password"].includes(props.type);
  }
  watch(() => props.type + props.autogrow, updateMaskInternals);
  watch(() => props.mask, (v) => {
    if (v !== void 0) {
      updateMaskValue(innerValue.value, true);
    } else {
      const val = unmaskValue(innerValue.value);
      updateMaskInternals();
      props.modelValue !== val && emit("update:modelValue", val);
    }
  });
  watch(() => props.fillMask + props.reverseFillMask, () => {
    hasMask.value === true && updateMaskValue(innerValue.value, true);
  });
  watch(() => props.unmaskedValue, () => {
    hasMask.value === true && updateMaskValue(innerValue.value);
  });
  function getInitialMaskedValue() {
    updateMaskInternals();
    if (hasMask.value === true) {
      const masked = maskValue(unmaskValue(props.modelValue));
      return props.fillMask !== false ? fillWithMask(masked) : masked;
    }
    return props.modelValue;
  }
  function getPaddedMaskMarked(size2) {
    if (size2 < maskMarked.length) {
      return maskMarked.slice(-size2);
    }
    let pad = "", localMaskMarked = maskMarked;
    const padPos = localMaskMarked.indexOf(MARKER);
    if (padPos > -1) {
      for (let i = size2 - localMaskMarked.length; i > 0; i--) {
        pad += MARKER;
      }
      localMaskMarked = localMaskMarked.slice(0, padPos) + pad + localMaskMarked.slice(padPos);
    }
    return localMaskMarked;
  }
  function updateMaskInternals() {
    hasMask.value = props.mask !== void 0 && props.mask.length > 0 && getIsTypeText();
    if (hasMask.value === false) {
      computedUnmask = void 0;
      maskMarked = "";
      maskReplaced = "";
      return;
    }
    const localComputedMask = NAMED_MASKS[props.mask] === void 0 ? props.mask : NAMED_MASKS[props.mask], fillChar = typeof props.fillMask === "string" && props.fillMask.length > 0 ? props.fillMask.slice(0, 1) : "_", fillCharEscaped = fillChar.replace(escRegex, "\\$&"), unmask = [], extract = [], mask = [];
    let firstMatch = props.reverseFillMask === true, unmaskChar = "", negateChar = "";
    localComputedMask.replace(tokenRegexMask, (_, char1, esc, token, char2) => {
      if (token !== void 0) {
        const c = TOKENS[token];
        mask.push(c);
        negateChar = c.negate;
        if (firstMatch === true) {
          extract.push("(?:" + negateChar + "+)?(" + c.pattern + "+)?(?:" + negateChar + "+)?(" + c.pattern + "+)?");
          firstMatch = false;
        }
        extract.push("(?:" + negateChar + "+)?(" + c.pattern + ")?");
      } else if (esc !== void 0) {
        unmaskChar = "\\" + (esc === "\\" ? "" : esc);
        mask.push(esc);
        unmask.push("([^" + unmaskChar + "]+)?" + unmaskChar + "?");
      } else {
        const c = char1 !== void 0 ? char1 : char2;
        unmaskChar = c === "\\" ? "\\\\\\\\" : c.replace(escRegex, "\\\\$&");
        mask.push(c);
        unmask.push("([^" + unmaskChar + "]+)?" + unmaskChar + "?");
      }
    });
    const unmaskMatcher = new RegExp("^" + unmask.join("") + "(" + (unmaskChar === "" ? "." : "[^" + unmaskChar + "]") + "+)?$"), extractLast = extract.length - 1, extractMatcher = extract.map((re, index2) => {
      if (index2 === 0 && props.reverseFillMask === true) {
        return new RegExp("^" + fillCharEscaped + "*" + re);
      } else if (index2 === extractLast) {
        return new RegExp("^" + re + "(" + (negateChar === "" ? "." : negateChar) + "+)?" + (props.reverseFillMask === true ? "$" : fillCharEscaped + "*"));
      }
      return new RegExp("^" + re);
    });
    computedMask = mask;
    computedUnmask = (val) => {
      const unmaskMatch = unmaskMatcher.exec(val);
      if (unmaskMatch !== null) {
        val = unmaskMatch.slice(1).join("");
      }
      const extractMatch = [], extractMatcherLength = extractMatcher.length;
      for (let i = 0, str = val; i < extractMatcherLength; i++) {
        const m = extractMatcher[i].exec(str);
        if (m === null) {
          break;
        }
        str = str.slice(m.shift().length);
        extractMatch.push(...m);
      }
      if (extractMatch.length > 0) {
        return extractMatch.join("");
      }
      return val;
    };
    maskMarked = mask.map((v) => typeof v === "string" ? v : MARKER).join("");
    maskReplaced = maskMarked.split(MARKER).join(fillChar);
  }
  function updateMaskValue(rawVal, updateMaskInternalsFlag, inputType) {
    const inp = inputRef.value, end = inp.selectionEnd, endReverse = inp.value.length - end, unmasked = unmaskValue(rawVal);
    updateMaskInternalsFlag === true && updateMaskInternals();
    const preMasked = maskValue(unmasked), masked = props.fillMask !== false ? fillWithMask(preMasked) : preMasked, changed = innerValue.value !== masked;
    inp.value !== masked && (inp.value = masked);
    changed === true && (innerValue.value = masked);
    document.activeElement === inp && nextTick(() => {
      if (masked === maskReplaced) {
        const cursor = props.reverseFillMask === true ? maskReplaced.length : 0;
        inp.setSelectionRange(cursor, cursor, "forward");
        return;
      }
      if (inputType === "insertFromPaste" && props.reverseFillMask !== true) {
        const cursor = end - 1;
        moveCursor.right(inp, cursor, cursor);
        return;
      }
      if (["deleteContentBackward", "deleteContentForward"].indexOf(inputType) > -1) {
        const cursor = props.reverseFillMask === true ? end === 0 ? masked.length > preMasked.length ? 1 : 0 : Math.max(0, masked.length - (masked === maskReplaced ? 0 : Math.min(preMasked.length, endReverse) + 1)) + 1 : end;
        inp.setSelectionRange(cursor, cursor, "forward");
        return;
      }
      if (props.reverseFillMask === true) {
        if (changed === true) {
          const cursor = Math.max(0, masked.length - (masked === maskReplaced ? 0 : Math.min(preMasked.length, endReverse + 1)));
          if (cursor === 1 && end === 1) {
            inp.setSelectionRange(cursor, cursor, "forward");
          } else {
            moveCursor.rightReverse(inp, cursor, cursor);
          }
        } else {
          const cursor = masked.length - endReverse;
          inp.setSelectionRange(cursor, cursor, "backward");
        }
      } else {
        if (changed === true) {
          const cursor = Math.max(0, maskMarked.indexOf(MARKER), Math.min(preMasked.length, end) - 1);
          moveCursor.right(inp, cursor, cursor);
        } else {
          const cursor = end - 1;
          moveCursor.right(inp, cursor, cursor);
        }
      }
    });
    const val = props.unmaskedValue === true ? unmaskValue(masked) : masked;
    String(props.modelValue) !== val && emitValue(val, true);
  }
  function moveCursorForPaste(inp, start, end) {
    const preMasked = maskValue(unmaskValue(inp.value));
    start = Math.max(0, maskMarked.indexOf(MARKER), Math.min(preMasked.length, start));
    inp.setSelectionRange(start, end, "forward");
  }
  const moveCursor = {
    left(inp, start, end, selection) {
      const noMarkBefore = maskMarked.slice(start - 1).indexOf(MARKER) === -1;
      let i = Math.max(0, start - 1);
      for (; i >= 0; i--) {
        if (maskMarked[i] === MARKER) {
          start = i;
          noMarkBefore === true && start++;
          break;
        }
      }
      if (i < 0 && maskMarked[start] !== void 0 && maskMarked[start] !== MARKER) {
        return moveCursor.right(inp, 0, 0);
      }
      start >= 0 && inp.setSelectionRange(start, selection === true ? end : start, "backward");
    },
    right(inp, start, end, selection) {
      const limit = inp.value.length;
      let i = Math.min(limit, end + 1);
      for (; i <= limit; i++) {
        if (maskMarked[i] === MARKER) {
          end = i;
          break;
        } else if (maskMarked[i - 1] === MARKER) {
          end = i;
        }
      }
      if (i > limit && maskMarked[end - 1] !== void 0 && maskMarked[end - 1] !== MARKER) {
        return moveCursor.left(inp, limit, limit);
      }
      inp.setSelectionRange(selection ? start : end, end, "forward");
    },
    leftReverse(inp, start, end, selection) {
      const localMaskMarked = getPaddedMaskMarked(inp.value.length);
      let i = Math.max(0, start - 1);
      for (; i >= 0; i--) {
        if (localMaskMarked[i - 1] === MARKER) {
          start = i;
          break;
        } else if (localMaskMarked[i] === MARKER) {
          start = i;
          if (i === 0) {
            break;
          }
        }
      }
      if (i < 0 && localMaskMarked[start] !== void 0 && localMaskMarked[start] !== MARKER) {
        return moveCursor.rightReverse(inp, 0, 0);
      }
      start >= 0 && inp.setSelectionRange(start, selection === true ? end : start, "backward");
    },
    rightReverse(inp, start, end, selection) {
      const limit = inp.value.length, localMaskMarked = getPaddedMaskMarked(limit), noMarkBefore = localMaskMarked.slice(0, end + 1).indexOf(MARKER) === -1;
      let i = Math.min(limit, end + 1);
      for (; i <= limit; i++) {
        if (localMaskMarked[i - 1] === MARKER) {
          end = i;
          end > 0 && noMarkBefore === true && end--;
          break;
        }
      }
      if (i > limit && localMaskMarked[end - 1] !== void 0 && localMaskMarked[end - 1] !== MARKER) {
        return moveCursor.leftReverse(inp, limit, limit);
      }
      inp.setSelectionRange(selection === true ? start : end, end, "forward");
    }
  };
  function onMaskedKeydown(e) {
    if (shouldIgnoreKey(e) === true) {
      return;
    }
    const inp = inputRef.value, start = inp.selectionStart, end = inp.selectionEnd;
    if (e.keyCode === 37 || e.keyCode === 39) {
      const fn = moveCursor[(e.keyCode === 39 ? "right" : "left") + (props.reverseFillMask === true ? "Reverse" : "")];
      e.preventDefault();
      fn(inp, start, end, e.shiftKey);
    } else if (e.keyCode === 8 && props.reverseFillMask !== true && start === end) {
      moveCursor.left(inp, start, end, true);
    } else if (e.keyCode === 46 && props.reverseFillMask === true && start === end) {
      moveCursor.rightReverse(inp, start, end, true);
    }
  }
  function maskValue(val) {
    if (val === void 0 || val === null || val === "") {
      return "";
    }
    if (props.reverseFillMask === true) {
      return maskValueReverse(val);
    }
    const mask = computedMask;
    let valIndex = 0, output = "";
    for (let maskIndex = 0; maskIndex < mask.length; maskIndex++) {
      const valChar = val[valIndex], maskDef = mask[maskIndex];
      if (typeof maskDef === "string") {
        output += maskDef;
        valChar === maskDef && valIndex++;
      } else if (valChar !== void 0 && maskDef.regex.test(valChar)) {
        output += maskDef.transform !== void 0 ? maskDef.transform(valChar) : valChar;
        valIndex++;
      } else {
        return output;
      }
    }
    return output;
  }
  function maskValueReverse(val) {
    const mask = computedMask, firstTokenIndex = maskMarked.indexOf(MARKER);
    let valIndex = val.length - 1, output = "";
    for (let maskIndex = mask.length - 1; maskIndex >= 0 && valIndex > -1; maskIndex--) {
      const maskDef = mask[maskIndex];
      let valChar = val[valIndex];
      if (typeof maskDef === "string") {
        output = maskDef + output;
        valChar === maskDef && valIndex--;
      } else if (valChar !== void 0 && maskDef.regex.test(valChar)) {
        do {
          output = (maskDef.transform !== void 0 ? maskDef.transform(valChar) : valChar) + output;
          valIndex--;
          valChar = val[valIndex];
        } while (firstTokenIndex === maskIndex && valChar !== void 0 && maskDef.regex.test(valChar));
      } else {
        return output;
      }
    }
    return output;
  }
  function unmaskValue(val) {
    return typeof val !== "string" || computedUnmask === void 0 ? typeof val === "number" ? computedUnmask("" + val) : val : computedUnmask(val);
  }
  function fillWithMask(val) {
    if (maskReplaced.length - val.length <= 0) {
      return val;
    }
    return props.reverseFillMask === true && val.length > 0 ? maskReplaced.slice(0, -val.length) + val : val + maskReplaced.slice(val.length);
  }
  return {
    innerValue,
    hasMask,
    moveCursorForPaste,
    updateMaskValue,
    onMaskedKeydown
  };
}
const useFormProps = {
  name: String
};
function useFormInputNameAttr(props) {
  return computed(() => props.name || props.for);
}
function useFileFormDomProps(props, typeGuard) {
  function getFormDomProps() {
    const model = props.modelValue;
    try {
      const dt = "DataTransfer" in window ? new DataTransfer() : "ClipboardEvent" in window ? new ClipboardEvent("").clipboardData : void 0;
      if (Object(model) === model) {
        ("length" in model ? Array.from(model) : [model]).forEach((file) => {
          dt.items.add(file);
        });
      }
      return {
        files: dt.files
      };
    } catch (e) {
      return {
        files: void 0
      };
    }
  }
  return typeGuard === true ? computed(() => {
    if (props.type !== "file") {
      return;
    }
    return getFormDomProps();
  }) : computed(getFormDomProps);
}
const isJapanese = /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/;
const isChinese = /[\u4e00-\u9fff\u3400-\u4dbf\u{20000}-\u{2a6df}\u{2a700}-\u{2b73f}\u{2b740}-\u{2b81f}\u{2b820}-\u{2ceaf}\uf900-\ufaff\u3300-\u33ff\ufe30-\ufe4f\uf900-\ufaff\u{2f800}-\u{2fa1f}]/u;
const isKorean = /[\u3131-\u314e\u314f-\u3163\uac00-\ud7a3]/;
const isPlainText = /[a-z0-9_ -]$/i;
function useKeyComposition(onInput) {
  return function onComposition(e) {
    if (e.type === "compositionend" || e.type === "change") {
      if (e.target.qComposing !== true) {
        return;
      }
      e.target.qComposing = false;
      onInput(e);
    } else if (e.type === "compositionupdate" && e.target.qComposing !== true && typeof e.data === "string") {
      const isComposing = client.is.firefox === true ? isPlainText.test(e.data) === false : isJapanese.test(e.data) === true || isChinese.test(e.data) === true || isKorean.test(e.data) === true;
      if (isComposing === true) {
        e.target.qComposing = true;
      }
    }
  };
}
var QInput = createComponent({
  name: "QInput",
  inheritAttrs: false,
  props: __spreadProps(__spreadValues(__spreadValues(__spreadValues({}, useFieldProps), useMaskProps), useFormProps), {
    modelValue: { required: false },
    shadowText: String,
    type: {
      type: String,
      default: "text"
    },
    debounce: [String, Number],
    autogrow: Boolean,
    inputClass: [Array, String, Object],
    inputStyle: [Array, String, Object]
  }),
  emits: [
    ...useFieldEmits,
    "paste",
    "change"
  ],
  setup(props, { emit, attrs }) {
    const temp = {};
    let emitCachedValue = NaN, typedNumber, stopValueWatcher, emitTimer, emitValueFn;
    const inputRef = ref(null);
    const nameProp = useFormInputNameAttr(props);
    const {
      innerValue,
      hasMask,
      moveCursorForPaste,
      updateMaskValue,
      onMaskedKeydown
    } = useMask(props, emit, emitValue, inputRef);
    const formDomProps = useFileFormDomProps(props, true);
    const hasValue = computed(() => fieldValueIsFilled(innerValue.value));
    const onComposition = useKeyComposition(onInput);
    const state = useFieldState();
    const isTextarea = computed(() => props.type === "textarea" || props.autogrow === true);
    const isTypeText = computed(() => isTextarea.value === true || ["text", "search", "url", "tel", "password"].includes(props.type));
    const onEvents = computed(() => {
      const evt = __spreadProps(__spreadValues({}, state.splitAttrs.listeners.value), {
        onInput,
        onPaste,
        onChange,
        onBlur: onFinishEditing,
        onFocus: stop
      });
      evt.onCompositionstart = evt.onCompositionupdate = evt.onCompositionend = onComposition;
      if (hasMask.value === true) {
        evt.onKeydown = onMaskedKeydown;
      }
      if (props.autogrow === true) {
        evt.onAnimationend = adjustHeight;
      }
      return evt;
    });
    const inputAttrs = computed(() => {
      const attrs2 = __spreadProps(__spreadValues({
        tabindex: 0,
        "data-autofocus": props.autofocus === true || void 0,
        rows: props.type === "textarea" ? 6 : void 0,
        "aria-label": props.label,
        name: nameProp.value
      }, state.splitAttrs.attributes.value), {
        id: state.targetUid.value,
        maxlength: props.maxlength,
        disabled: props.disable === true,
        readonly: props.readonly === true
      });
      if (isTextarea.value === false) {
        attrs2.type = props.type;
      }
      if (props.autogrow === true) {
        attrs2.rows = 1;
      }
      return attrs2;
    });
    watch(() => props.type, () => {
      if (inputRef.value) {
        inputRef.value.value = props.modelValue;
      }
    });
    watch(() => props.modelValue, (v) => {
      if (hasMask.value === true) {
        if (stopValueWatcher === true) {
          stopValueWatcher = false;
          if (String(v) === emitCachedValue) {
            return;
          }
        }
        updateMaskValue(v);
      } else if (innerValue.value !== v) {
        innerValue.value = v;
        if (props.type === "number" && temp.hasOwnProperty("value") === true) {
          if (typedNumber === true) {
            typedNumber = false;
          } else {
            delete temp.value;
          }
        }
      }
      props.autogrow === true && nextTick(adjustHeight);
    });
    watch(() => props.autogrow, (val) => {
      if (val === true) {
        nextTick(adjustHeight);
      } else if (inputRef.value !== null && attrs.rows > 0) {
        inputRef.value.style.height = "auto";
      }
    });
    watch(() => props.dense, () => {
      props.autogrow === true && nextTick(adjustHeight);
    });
    function focus() {
      addFocusFn(() => {
        const el = document.activeElement;
        if (inputRef.value !== null && inputRef.value !== el && (el === null || el.id !== state.targetUid.value)) {
          inputRef.value.focus({ preventScroll: true });
        }
      });
    }
    function select() {
      inputRef.value !== null && inputRef.value.select();
    }
    function onPaste(e) {
      if (hasMask.value === true && props.reverseFillMask !== true) {
        const inp = e.target;
        moveCursorForPaste(inp, inp.selectionStart, inp.selectionEnd);
      }
      emit("paste", e);
    }
    function onInput(e) {
      if (!e || !e.target) {
        return;
      }
      if (props.type === "file") {
        emit("update:modelValue", e.target.files);
        return;
      }
      const val = e.target.value;
      if (e.target.qComposing === true) {
        temp.value = val;
        return;
      }
      if (hasMask.value === true) {
        updateMaskValue(val, false, e.inputType);
      } else {
        emitValue(val);
        if (isTypeText.value === true && e.target === document.activeElement) {
          const { selectionStart, selectionEnd } = e.target;
          if (selectionStart !== void 0 && selectionEnd !== void 0) {
            nextTick(() => {
              if (e.target === document.activeElement && val.indexOf(e.target.value) === 0) {
                e.target.setSelectionRange(selectionStart, selectionEnd);
              }
            });
          }
        }
      }
      props.autogrow === true && adjustHeight();
    }
    function emitValue(val, stopWatcher) {
      emitValueFn = () => {
        if (props.type !== "number" && temp.hasOwnProperty("value") === true) {
          delete temp.value;
        }
        if (props.modelValue !== val && emitCachedValue !== val) {
          emitCachedValue = val;
          stopWatcher === true && (stopValueWatcher = true);
          emit("update:modelValue", val);
          nextTick(() => {
            emitCachedValue === val && (emitCachedValue = NaN);
          });
        }
        emitValueFn = void 0;
      };
      if (props.type === "number") {
        typedNumber = true;
        temp.value = val;
      }
      if (props.debounce !== void 0) {
        clearTimeout(emitTimer);
        temp.value = val;
        emitTimer = setTimeout(emitValueFn, props.debounce);
      } else {
        emitValueFn();
      }
    }
    function adjustHeight() {
      const inp = inputRef.value;
      if (inp !== null) {
        const parentStyle = inp.parentNode.style;
        const { overflow } = inp.style;
        parentStyle.marginBottom = inp.scrollHeight - 1 + "px";
        inp.style.height = "1px";
        inp.style.overflow = "hidden";
        inp.style.height = inp.scrollHeight + "px";
        inp.style.overflow = overflow;
        parentStyle.marginBottom = "";
      }
    }
    function onChange(e) {
      onComposition(e);
      clearTimeout(emitTimer);
      emitValueFn !== void 0 && emitValueFn();
      emit("change", e.target.value);
    }
    function onFinishEditing(e) {
      e !== void 0 && stop(e);
      clearTimeout(emitTimer);
      emitValueFn !== void 0 && emitValueFn();
      typedNumber = false;
      stopValueWatcher = false;
      delete temp.value;
      props.type !== "file" && setTimeout(() => {
        if (inputRef.value !== null) {
          inputRef.value.value = innerValue.value !== void 0 ? innerValue.value : "";
        }
      });
    }
    function getCurValue() {
      return temp.hasOwnProperty("value") === true ? temp.value : innerValue.value !== void 0 ? innerValue.value : "";
    }
    onBeforeUnmount(() => {
      onFinishEditing();
    });
    onMounted(() => {
      props.autogrow === true && adjustHeight();
    });
    Object.assign(state, {
      innerValue,
      fieldClass: computed(() => `q-${isTextarea.value === true ? "textarea" : "input"}` + (props.autogrow === true ? " q-textarea--autogrow" : "")),
      hasShadow: computed(() => props.type !== "file" && typeof props.shadowText === "string" && props.shadowText.length > 0),
      inputRef,
      emitValue,
      hasValue,
      floatingLabel: computed(() => hasValue.value === true || fieldValueIsFilled(props.displayValue)),
      getControl: () => {
        return h(isTextarea.value === true ? "textarea" : "input", __spreadValues(__spreadValues(__spreadValues({
          ref: inputRef,
          class: [
            "q-field__native q-placeholder",
            props.inputClass
          ],
          style: props.inputStyle
        }, inputAttrs.value), onEvents.value), props.type !== "file" ? { value: getCurValue() } : formDomProps.value));
      },
      getShadowControl: () => {
        return h("div", {
          class: "q-field__native q-field__shadow absolute-bottom no-pointer-events" + (isTextarea.value === true ? "" : " text-no-wrap")
        }, [
          h("span", { class: "invisible" }, getCurValue()),
          h("span", props.shadowText)
        ]);
      }
    });
    const renderFn = useField(state);
    const vm = getCurrentInstance();
    Object.assign(vm.proxy, {
      focus,
      select,
      getNativeElement: () => inputRef.value
    });
    return renderFn;
  }
});
const defaultCfg = {
  threshold: 0,
  root: null,
  rootMargin: "0px"
};
function update(el, ctx, value) {
  let handler, cfg, changed;
  if (typeof value === "function") {
    handler = value;
    cfg = defaultCfg;
    changed = ctx.cfg === void 0;
  } else {
    handler = value.handler;
    cfg = Object.assign({}, defaultCfg, value.cfg);
    changed = ctx.cfg === void 0 || isDeepEqual(ctx.cfg, cfg) === false;
  }
  if (ctx.handler !== handler) {
    ctx.handler = handler;
  }
  if (changed === true) {
    ctx.cfg = cfg;
    ctx.observer !== void 0 && ctx.observer.unobserve(el);
    ctx.observer = new IntersectionObserver(([entry]) => {
      if (typeof ctx.handler === "function") {
        if (entry.rootBounds === null && document.body.contains(el) === true) {
          ctx.observer.unobserve(el);
          ctx.observer.observe(el);
          return;
        }
        const res = ctx.handler(entry, ctx.observer);
        if (res === false || ctx.once === true && entry.isIntersecting === true) {
          destroy(el);
        }
      }
    }, cfg);
    ctx.observer.observe(el);
  }
}
function destroy(el) {
  const ctx = el.__qvisible;
  if (ctx !== void 0) {
    ctx.observer !== void 0 && ctx.observer.unobserve(el);
    delete el.__qvisible;
  }
}
var Intersection = createDirective({
  name: "intersection",
  mounted(el, { modifiers, value }) {
    const ctx = {
      once: modifiers.once === true
    };
    update(el, ctx, value);
    el.__qvisible = ctx;
  },
  updated(el, binding) {
    const ctx = el.__qvisible;
    ctx !== void 0 && update(el, ctx, binding.value);
  },
  beforeUnmount: destroy
});
const versions = [
  {
    id: uid(),
    ver: "\u0412\u043E\u0439\u0434\u0435\u0442 \u0432 \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0443\u044E \u0432\u0435\u0440\u0441\u0438\u044E",
    children: [
      {
        id: uid(),
        head: "\u0418\u0441\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u043D\u044B\u0435 \u043E\u0448\u0438\u0431\u043A\u0438",
        icon: "alert",
        model: false,
        children: [{ label: "ERR-2514", text: "\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u0438 \u0412\u041A" }]
      }
    ]
  },
  {
    id: "fuck",
    ver: "5.5.5957.274",
    children: [
      {
        id: uid(),
        head: "\u0424\u0443\u043D\u043A\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u044B\u0435 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F",
        icon: "briefcase-outline",
        model: false,
        children: [
          {
            id: uid(),
            label: "\u041B\u0438\u0441\u0442 \u043E\u0437\u043D\u0430\u043A\u043E\u043C\u043B\u0435\u043D\u0438\u044F",
            text: "\u0422\u0435\u043F\u0435\u0440\u044C \u0432 \u0437\u0430\u0434\u0430\u043D\u0438\u044F\u0445 \u043E\u0442\u043E\u0431\u0440\u0430\u0436\u0430\u0435\u0442\u0441\u044F \u043B\u0438\u0441\u0442 \u043E\u0437\u043D\u0430\u043A\u043E\u043C\u043B\u0435\u043D\u0438\u044F \u0441 \u043F\u043E\u0434\u0447\u0438\u043D\u0451\u043D\u043D\u044B\u043C\u0438 \u0437\u0430\u0434\u0430\u043D\u0438\u044F\u043C\u0438 \u0438 \u0433\u0440\u0443\u043F\u043F\u0430\u043C\u0438 \u0437\u0430\u0434\u0430\u043D\u0438\u0439.",
            children: []
          },
          {
            id: uid(),
            label: "\u0420\u0430\u0437\u0434\u0435\u043B\u0438\u0442\u0435\u043B\u0438 \u0440\u0430\u0437\u0440\u044F\u0434\u043E\u0432 \u0447\u0438\u0441\u043B\u0430",
            text: "\u0412 \u042D\u0423 \u0427\u0438\u0441\u043B\u043E \u0442\u0435\u043F\u0435\u0440\u044C \u043E\u0442\u043E\u0431\u0440\u0430\u0436\u0430\u044E\u0442\u0441\u044F \u0441\u0438\u0441\u0442\u0435\u043C\u043D\u044B\u0435 \u0440\u0430\u0437\u0434\u0435\u043B\u0438\u0442\u0435\u043B\u0438 \u0440\u0430\u0437\u0440\u044F\u0434\u043E\u0432 \u0447\u0438\u0441\u043B\u0430.",
            children: []
          },
          {
            id: uid(),
            label: "\u0421\u043F\u043E\u0441\u043E\u0431 \u0443\u0434\u0430\u043B\u0435\u043D\u0438\u044F \u043A\u0430\u0440\u0442\u043E\u0447\u0435\u043A",
            text: "\u0422\u0435\u043F\u0435\u0440\u044C \u043F\u0440\u0438 \u0443\u0434\u0430\u043B\u0435\u043D\u0438\u0438 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438 \u0432\u0441\u0435\u0433\u0434\u0430 \u0443\u043A\u0430\u0437\u044B\u0432\u0430\u0435\u0442\u0441\u044F \u0441\u043F\u043E\u0441\u043E\u0431 \u0443\u0434\u0430\u043B\u0435\u043D\u0438\u044F: \u0432 \u043A\u043E\u0440\u0437\u0438\u043D\u0443 \u0438\u043B\u0438 \u0431\u0435\u0437\u0432\u043E\u0437\u0432\u0440\u0430\u0442\u043D\u043E.",
            children: []
          },
          {
            id: uid(),
            label: "\u041A\u043E\u043D\u0441\u0442\u0440\u0443\u043A\u0442\u043E\u0440 \u0441\u043F\u0440\u0430\u0432\u043E\u0447\u043D\u0438\u043A\u043E\u0432",
            text: "\u041F\u0435\u0440\u0435\u0440\u0430\u0431\u043E\u0442\u0430\u043D \u0438\u043D\u0442\u0435\u0440\u0444\u0435\u0439\u0441 \u043A\u043E\u043D\u0441\u0442\u0440\u0443\u043A\u0442\u043E\u0440\u0430 \u0441\u043F\u0440\u0430\u0432\u043E\u0447\u043D\u0438\u043A\u043E\u0432.",
            children: []
          },
          {
            id: uid(),
            label: "\u0418\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u043D\u0438\u0435 \u043E\u0431\u043B\u0430\u0447\u043D\u043E\u0439 \u043F\u043E\u0434\u043F\u0438\u0441\u0438",
            text: "\u0418\u0437\u043C\u0435\u043D\u0451\u043D \u0434\u0438\u0430\u043B\u043E\u0433 \u043F\u043E\u0434\u043F\u0438\u0441\u0430\u043D\u0438\u044F \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u043E\u0432 \u0438 \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u0430 \u0432\u043E\u0437\u043C\u043E\u0436\u043D\u043E\u0441\u0442\u044C \u043F\u043E\u0434\u043F\u0438\u0441\u0430\u0442\u044C \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438 \u043E\u0431\u043B\u0430\u0447\u043D\u043E\u0439 \u043F\u043E\u0434\u043F\u0438\u0441\u044C\u044E.",
            children: []
          },
          {
            id: uid(),
            label: "\u0418\u0437\u043C\u0435\u043D\u0438\u043B\u0441\u044F \u0434\u0438\u0430\u043B\u043E\u0433 \u043F\u043E\u0434\u043F\u0438\u0441\u0430\u043D\u0438\u044F",
            text: "\u0414\u0438\u0430\u043B\u043E\u0433 \u043F\u043E\u0434\u043F\u0438\u0441\u0430\u043D\u0438\u044F \u043F\u0435\u0440\u0435\u0440\u0430\u0431\u043E\u0442\u0430\u043D, \u0442\u0430\u043A\u0436\u0435 \u0438\u0437\u043C\u0435\u043D\u0438\u043B\u0441\u044F \u0430\u043B\u0433\u043E\u0440\u0438\u0442\u043C \u0432\u044B\u0431\u043E\u0440\u0430 \u0441\u0435\u0440\u0442\u0438\u0444\u0438\u043A\u0430\u0442\u043E\u0432 \u0432 \u0434\u0438\u0430\u043B\u043E\u0433\u0435.",
            children: []
          },
          {
            id: uid(),
            label: "\u0423\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u043F\u043E\u0434\u043F\u0438\u0441\u0430\u043D\u0438\u0435\u043C \u0447\u0435\u0440\u0435\u0437 API",
            text: "\u0414\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u0430 \u0432\u043E\u0437\u043C\u043E\u0436\u043D\u043E\u0441\u0442\u044C \u0443\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u044F \u0434\u0438\u0430\u043B\u043E\u0433\u043E\u043C \u043F\u043E\u0434\u043F\u0438\u0441\u0430\u043D\u0438\u044F \u0447\u0435\u0440\u0435\u0437 API.",
            children: []
          }
        ]
      },
      {
        id: uid(),
        head: "\u0418\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F \u0432 \u0431\u0438\u0431\u043B\u0438\u043E\u0442\u0435\u043A\u0430\u0445 \u044D\u043B\u0435\u043C\u0435\u043D\u0442\u043E\u0432 \u0443\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u044F",
        icon: "bookshelf",
        model: false,
        children: [
          {
            id: uid(),
            label: "\u041B\u0438\u0441\u0442 \u043E\u0437\u043D\u0430\u043A\u043E\u043C\u043B\u0435\u043D\u0438\u044F",
            text: "\u041D\u043E\u0432\u044B\u0439 \u044D\u043B\u0435\u043C\u0435\u043D\u0442 \u0443\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u044F, \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u044B\u0439 \u0432 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0430\u0445 \u0442\u0438\u043F\u0430 \u0414\u043E\u043A\u0443\u043C\u0435\u043D\u0442. \u042D\u0423 \u0434\u043E\u0431\u0430\u0432\u043B\u044F\u0435\u0442 \u0432\u043E\u0437\u043C\u043E\u0436\u043D\u043E\u0441\u0442\u044C \u0440\u0430\u0431\u043E\u0442\u044B \u0441 \u043B\u0438\u0441\u0442\u043E\u043C \u0441\u043E\u0433\u043B\u0430\u0441\u043E\u0432\u0430\u043D\u0438\u044F \u0432 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0430\u0445.",
            children: []
          },
          {
            id: uid(),
            label: "\u041A\u043E\u043D\u0442\u0440\u043E\u043B \u0442\u0430\u0431\u043B\u0438\u0447\u043D\u044B\u0445 \u0434\u0430\u043D\u043D\u044B\u0445",
            text: "\u042D\u043B\u0435\u043C\u0435\u043D\u0442 \u0443\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u044F \u043E\u0442\u043E\u0431\u0440\u0430\u0436\u0430\u0435\u0442 \u0434\u0430\u043D\u043D\u044B\u0435 \u0432 \u0432\u0438\u0434\u0435 \u0442\u0430\u0431\u043B\u0438\u0446\u044B \u043D\u0430 \u043E\u0441\u043D\u043E\u0432\u0435 \u043F\u0440\u043E\u0433\u0440\u0430\u043C\u043C\u043D\u043E \u0441\u0444\u043E\u0440\u043C\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u043E\u0439 \u043C\u043E\u0434\u0435\u043B\u0438.",
            children: []
          },
          {
            id: uid(),
            label: '\u041D\u043E\u0432\u044B\u0435 \u0441\u0432\u043E\u0439\u0441\u0442\u0432\u0430 \u042D\u0423 "\u0424\u0430\u0439\u043B"',
            text: '\u0414\u043B\u044F \u044D\u043B\u0435\u043C\u0435\u043D\u0442\u0430 \u0443\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u044F "\u0424\u0430\u0439\u043B" \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u044B \u043D\u043E\u0432\u044B\u0435 \u0441\u0432\u043E\u0439\u0441\u0442\u0432\u0430: \u041E\u0442\u043E\u0431\u0440\u0430\u0436\u0430\u0442\u044C \u043C\u0435\u0442\u043A\u0443 \u0431\u0435\u0437 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u044F, \u0421\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435 \u043F\u0440\u0438 \u043F\u0443\u0441\u0442\u043E\u043C \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0438, \u0414\u043E\u0441\u0442\u0443\u043F\u043D\u044B\u0435 \u0440\u0430\u0441\u0448\u0438\u0440\u0435\u043D\u0438\u044F, \u041F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0442\u044C \u043A\u043E\u043D\u0442\u0435\u043A\u0441\u0442\u043D\u043E\u0435 \u043C\u0435\u043D\u044E.',
            children: []
          },
          {
            id: uid(),
            label: "\u0427\u0438\u0441\u043B\u043E",
            text: "\u0414\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u043E \u043D\u043E\u0432\u043E\u0435 \u0441\u0432\u043E\u0439\u0441\u0442\u0432\u043E \u0418\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u044C \u0441\u0438\u0441\u0442\u0435\u043C\u043D\u044B\u0435 \u0440\u0430\u0437\u0434\u0435\u043B\u0438\u0442\u0435\u043B\u0438, \u0440\u0435\u0433\u0443\u043B\u0438\u0440\u0443\u044E\u0449\u0435\u0435 \u043E\u0442\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435 \u0440\u0430\u0437\u0434\u0435\u043B\u0438\u0442\u0435\u043B\u0435\u0439 \u0447\u0438\u0441\u043B\u0430. \u0421\u0432\u043E\u0439\u0441\u0442\u0432\u043E \u043F\u043E \u0443\u043C\u043E\u043B\u0447\u0430\u043D\u0438\u044E \u0430\u043A\u0442\u0438\u0432\u043D\u043E, \u0442.\u0435. \u0440\u0430\u0437\u0434\u0435\u043B\u0438\u0442\u0435\u043B\u0438 \u043E\u0442\u043E\u0431\u0440\u0430\u0436\u0430\u044E\u0442\u0441\u044F.",
            children: []
          }
        ]
      },
      {
        id: uid(),
        head: "\u041E\u043F\u0442\u0438\u043C\u0438\u0437\u0430\u0446\u0438\u0438",
        icon: "rocket-launch",
        model: false,
        children: [
          {
            id: uid(),
            label: '\u0424\u0443\u043D\u043A\u0446\u0438\u044F "\u041E\u0431\u0449\u0438\u0435 \u0441\u043F\u0440\u0430\u0432\u043E\u0447\u043D\u0438\u043A\u0438"',
            text: "\u0422\u0435\u043F\u0435\u0440\u044C \u0441\u043F\u0440\u0430\u0432\u043E\u0447\u043D\u0438\u043A\u0438 \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u044E\u0442\u0441\u044F \u0432 \u043E\u0431\u0449\u0435\u043C \u0440\u0435\u0436\u0438\u043C\u0435 \u0434\u043B\u044F \u0432\u0441\u0435\u0445 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0435\u0439, \u0431\u043B\u0430\u0433\u043E\u0434\u0430\u0440\u044F \u0447\u0435\u043C\u0443 \u0441\u0435\u0440\u0432\u0435\u0440 Docsvision \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0435\u0442 \u043C\u0435\u043D\u044C\u0448\u0435 \u043F\u0430\u043C\u044F\u0442\u0438.",
            children: []
          }
        ]
      },
      {
        id: uid(),
        head: "\u0420\u0430\u0437\u0440\u0430\u0431\u043E\u0442\u043A\u0430",
        icon: "application-braces-outline",
        model: false,
        children: [
          {
            id: uid(),
            label: "\u0418\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F \u0432 API",
            text: "\u0414\u043E\u0431\u0430\u0432\u043B\u0435\u043D REST Web-API, \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u044B\u0439 \u043D\u0430 \u0441\u0442\u043E\u0440\u043E\u043D\u0435 \u043A\u043B\u0438\u0435\u043D\u0442\u0430 Web-\u043A\u043B\u0438\u0435\u043D\u0442\u0430. \u0418\u0437\u043C\u0435\u043D\u0435\u043D\u044B \u043A\u043E\u043C\u043F\u043E\u043D\u0435\u043D\u0442\u044B FileSignCreateDialog, FileSignSelectCertificateDialog. \u0418\u0437\u043C\u0435\u043D\u0435\u043D \u0441\u0435\u0440\u0432\u0438\u0441 $DocumentCardController.",
            show: false,
            more: "<ul><li>\u0411\u044B\u043B \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D REST Web-API, \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u044B\u0439 \u043D\u0430 \u0441\u0442\u043E\u0440\u043E\u043D\u0435 \u043A\u043B\u0438\u0435\u043D\u0442\u0430 Web-\u043A\u043B\u0438\u0435\u043D\u0442\u0430, \u043A\u043E\u0442\u043E\u0440\u044B\u0439 \u043C\u043E\u0436\u0435\u0442 \u0432\u044B\u0437\u044B\u0432\u0430\u0442\u044C \u0444\u0443\u043D\u043A\u0446\u0438\u0438 Docsvision API. REST API \u043F\u0440\u0435\u0434\u043D\u0430\u0437\u043D\u0430\u0447\u0430\u0435\u0442\u0441\u044F \u0434\u043B\u044F \u0440\u0430\u0431\u043E\u0442\u044B \u0438\u0437 \u043A\u043B\u0438\u0435\u043D\u0442\u0441\u043A\u0438\u0445 \u0441\u043A\u0440\u0438\u043F\u0442\u043E\u0432.</li> <li>\u0412\u043D\u0443\u0442\u0440\u0435\u043D\u043D\u0438\u0435 \u043A\u043E\u043C\u043F\u043E\u043D\u0435\u043D\u0442\u044B FileSignCreateDialog, FileSignSelectCertificateDialog \u0438 \u0441\u0432\u044F\u0437\u0430\u043D\u043D\u044B\u0435 \u0441 \u043D\u0438\u043C\u0438 \u0437\u0430\u043C\u0435\u043D\u0435\u043D\u044B \u043D\u0430 SignatureDialog.</li> <li>\u0421\u0435\u0440\u0432\u0438\u0441 $DocumentCardController \u0437\u0430\u043C\u0435\u043D\u0451\u043D \u043D\u0430 $SignatureController.</li> <li>\u0412\u043E \u0432\u043D\u0443\u0442\u0440\u0435\u043D\u043D\u0435\u043C \u043A\u043B\u0430\u0441\u0441\u0435 FileSign \u0443\u0434\u0430\u043B\u0435\u043D\u0430 \u0447\u0430\u0441\u0442\u044C \u043C\u0435\u0442\u043E\u0434\u043E\u0432.</li></ul>",
            children: []
          }
        ]
      },
      {
        id: uid(),
        head: "\u041D\u043E\u0432\u044B\u0435 \u043F\u0440\u0438\u043C\u0435\u0440\u044B \u0432 \u0440\u0435\u043F\u043E\u0437\u0438\u0442\u043E\u0440\u0438\u0438 \u043D\u0430 github",
        icon: "github",
        model: false,
        children: [
          {
            id: uid(),
            label: "Github",
            text: "\u0412 \u0440\u0435\u043F\u043E\u0437\u0438\u0442\u043E\u0440\u0438\u0439 WebClient-Samples \u043D\u0430 GitHub \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u044B \u043D\u043E\u0432\u044B\u0435 \u043F\u0440\u0438\u043C\u0435\u0440\u044B",
            show: false,
            more: "<ul><li>\u041F\u0440\u0438\u043C\u0435\u043D\u0438\u0442\u044C \u0433\u0440\u0443\u043F\u043F\u0438\u0440\u043E\u0432\u043A\u0443 \u043A\u043D\u043E\u043F\u043A\u043E\u0439 \u0432 \u044F\u0447\u0435\u0439\u043A\u0435.</li> <li>\u0420\u0430\u0441\u0448\u0438\u0440\u0438\u0442\u044C \u043A\u043E\u043D\u0442\u0435\u043A\u0441\u0442\u043D\u043E\u0435 \u043C\u0435\u043D\u044E.</li> <li>\u0418\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u0435 \u044D\u043A\u0441\u043F\u043E\u0440\u0442\u0430 \u0432 Excel.</li> <li>\u0420\u0430\u0441\u0448\u0438\u0440\u0435\u043D\u0438\u0435 \u0441\u0435\u0440\u0432\u0435\u0440\u043D\u044B\u0445 \u0432\u044B\u0437\u043E\u0432\u043E\u0432</li></ul>",
            children: []
          }
        ]
      },
      {
        id: uid(),
        head: "\u0418\u0441\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u043D\u044B\u0435 \u043E\u0448\u0438\u0431\u043A\u0438",
        icon: "alert",
        model: false,
        children: [
          {
            id: uid(),
            label: "ERR-2464",
            text: "\u042D\u0423 \u0417\u0430\u043F\u0438\u0441\u0438 \u0441\u043F\u0440\u0430\u0432\u043E\u0447\u043D\u0438\u043A\u0430 \u0441\u043E\u0442\u0440\u0443\u0434\u043D\u0438\u043A\u043E\u0432. \u041F\u0440\u0438 \u043F\u043E\u0438\u0441\u043A\u0435 \u0441\u043E\u0442\u0440\u0443\u0434\u043D\u0438\u043A\u0430 \u0432\u043E\u0437\u043D\u0438\u043A\u0430\u0435\u0442 \u043E\u0448\u0438\u0431\u043A\u0430 SQLFailure.",
            children: []
          },
          {
            id: uid(),
            label: "ERR-958",
            text: "\u0412 \u043F\u0440\u0435\u0432\u044C\u044E \u043E\u0442\u043E\u0431\u0440\u0430\u0436\u0430\u0435\u0442\u0441\u044F \u0441\u043E\u0434\u0435\u0440\u0436\u0438\u043C\u043E\u0435 \u0444\u0430\u0439\u043B\u0430 \u0435\u0441\u043B\u0438 \u0443 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F \u0437\u0430\u043F\u0440\u0435\u0449\u0435\u043D\u043E \u0447\u0442\u0435\u043D\u0438\u0435 \u0444\u0430\u0439\u043B\u0430 \u043F\u043E \u0440\u043E\u043B\u0435\u0432\u043E\u0439.",
            children: []
          },
          {
            id: uid(),
            label: "ERR-2440",
            text: '\u041B\u043E\u043C\u0430\u0435\u0442\u0441\u044F \u0440\u0430\u0437\u043C\u0435\u0442\u043A\u0430 \u043E\u043A\u043D\u0430 \u043F\u043E\u0438\u0441\u043A\u0430 \u0443 \u043F\u0430\u043F\u043A\u0438 "\u041F\u043E\u0438\u0441\u043A \u043A\u0432\u0430\u0440\u0442\u0430\u043B\u044C\u043D\u044B\u0445 \u0446\u0435\u043B\u0435\u0439".',
            children: []
          },
          {
            id: uid(),
            label: "ERR-896",
            text: "\u041D\u0435\u0442 \u0432\u043E\u0437\u043C\u043E\u0436\u043D\u043E\u0441\u0442\u0438 \u043F\u0435\u0440\u0435\u043E\u043F\u0440\u0435\u0434\u0435\u043B\u0438\u0442\u044C \u043E\u0431\u0440\u0430\u0431\u043E\u0442\u0447\u0438\u043A LifeCycle \u0432 InitializeContainer \u0441\u0435\u0440\u0432\u0435\u0440\u043D\u043E\u0433\u043E \u0440\u0430\u0441\u0448\u0438\u0440\u0435\u043D\u0438\u044F.",
            children: []
          },
          {
            id: uid(),
            label: "ERR-2346",
            text: "\u041E\u0442\u0441\u0443\u0442\u0441\u0442\u0432\u0438\u0435 \u0438\u043A\u043E\u043D\u043A\u0438 (\u0440\u0435\u0448\u0435\u043D\u0438\u044F) \u043F\u0440\u0438 \u0434\u0435\u043B\u0435\u0433\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0438 \u0441 \u0432\u043E\u0437\u0432\u0440\u0430\u0442\u043E\u043C.",
            children: []
          },
          {
            id: uid(),
            label: "ERR-2390",
            text: "\u041A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0439 \u043E\u0442 \u0434\u0435\u043B\u0435\u0433\u0430\u0442\u0430 \u043E\u0442\u043E\u0431\u0440\u0430\u0436\u0430\u0435\u0442\u0441\u044F \u043D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u043E \u0432 \u0445\u043E\u0434\u0435 \u0441\u043E\u0433\u043B\u0430\u0441\u043E\u0432\u0430\u043D\u0438\u044F.",
            children: []
          },
          {
            id: uid(),
            label: "ERR-2279",
            text: "\u0418\u0433\u043D\u043E\u0440\u0438\u0440\u0443\u0435\u0442\u0441\u044F \u043F\u0440\u043E\u043F\u0443\u0441\u043A \u044D\u0442\u0430\u043F\u043E\u0432 \u043F\u043E\u0441\u043B\u0435 \u0437\u0430\u043F\u0443\u0441\u043A\u0430 \u0441\u043E\u0433\u043B\u0430\u0441\u043E\u0432\u0430\u043D\u0438\u044F.",
            children: []
          },
          {
            id: uid(),
            label: "ERR-0004",
            text: "\u041E\u0448\u0438\u0431\u043A\u0430 \u043A\u043E\u043D\u0442\u0440\u043E\u043B\u0430 \u0444\u0430\u0439\u043B\u0430 \u0441\u043E\u0433\u043B\u0430\u0441\u043E\u0432\u0430\u043D\u0438\u044F.",
            children: []
          },
          {
            id: uid(),
            label: "ERR-2336",
            text: "\u041D\u0435 \u043A\u043E\u043F\u0438\u0440\u0443\u044E\u0442\u0441\u044F \u043E\u043F\u0435\u0440\u0430\u0446\u0438\u0438 \u043F\u0440\u0438 \u043A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0438 \u0440\u0430\u0437\u043C\u0435\u0442\u043E\u043A.",
            children: []
          },
          {
            id: uid(),
            label: "ERR-2183",
            text: "\u0412 \u0437\u0430\u0434\u0430\u043D\u0438\u044F\u0445 \u043D\u0435 \u043E\u0442\u043E\u0431\u0440\u0430\u0436\u0430\u0435\u0442\u0441\u044F \u0441\u0441\u044B\u043B\u043A\u0430 \u043D\u0430 \u043E\u0441\u043D\u043E\u0432\u043D\u043E\u0439 \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442 \u0435\u0441\u043B\u0438 \u0437\u0430\u0434\u0430\u043D\u0438\u044F \u0441\u043E\u0437\u0434\u0430\u043D\u044B \u0438\u0437 \u0434\u0440\u0443\u0433\u043E\u0433\u043E \u0437\u0430\u0434\u0430\u043D\u0438\u044F \u041A\u0421.",
            children: []
          },
          {
            id: uid(),
            label: "ERR-2281",
            text: "\u0415\u0441\u043B\u0438 \u043E\u0444\u043B\u0430\u0439\u043D \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0438 \u043D\u0435 \u0443\u0431\u0438\u0440\u0430\u044E\u0442\u0441\u044F \u0438\u0437 \u0441\u043F\u0438\u0441\u043A\u0430 \u0437\u0430\u0434\u0430\u0447 \u043D\u0430 \u043F\u0435\u0440\u0435\u0441\u0447\u0435\u0442 \u0432 childrener-e, \u0442\u043E \u0443 \u043E\u043D\u043B\u0430\u0439\u043D \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0435\u0439 \u043F\u0440\u0435\u0441\u0442\u0430\u044E\u0442 \u0440\u0430\u0431\u043E\u0442\u0430\u0442\u044C \u0441\u0447\u0435\u0442\u0447\u0438\u043A\u0438 \u0432 \u043F\u0430\u043F\u043A\u0435.",
            children: []
          },
          {
            id: uid(),
            label: "ERR-2222",
            text: "\u0422\u0435\u043A\u0441\u0442 \u043C\u0435\u0442\u043A\u0438 \u042D\u0423 \u043F\u0435\u0440\u0435\u043D\u043E\u0441\u0438\u0442\u0441\u044F \u043D\u0430 \u043D\u043E\u0432\u0443\u044E \u0441\u0442\u0440\u043E\u043A\u0443 \u0441\u043F\u0440\u0430\u0432\u0430 \u043E\u0442 \u043C\u0435\u0442\u043A\u0438.",
            children: []
          }
        ]
      }
    ]
  },
  {
    id: uid(),
    ver: "5.5.5957.250",
    children: [
      {
        id: uid(),
        head: "\u0424\u0443\u043D\u043A\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u044B\u0435 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F",
        icon: "briefcase-outline",
        model: false,
        children: [
          {
            id: uid(),
            label: "\u0421\u0435\u0440\u0442\u0438\u0444\u0438\u043A\u0430\u0442 \u042D\u041F \u0441\u043E\u0442\u0440\u0443\u0434\u043D\u0438\u043A\u0430",
            text: "\u041F\u043E\u044F\u0432\u0438\u043B\u0430\u0441\u044C \u0432\u043E\u0437\u043C\u043E\u0436\u043D\u043E\u0441\u0442\u044C \u0434\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0441\u0435\u0440\u0442\u0438\u0444\u0438\u043A\u0430\u0442 \u0434\u043B\u044F \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F \u0432 \u0441\u043F\u0440\u0430\u0432\u043E\u0447\u043D\u0438\u043A \u0441\u043E\u0442\u0440\u0443\u0434\u043D\u0438\u043A\u043E\u0432.",
            children: []
          },
          {
            id: uid(),
            label: "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430 \u043F\u043E\u0434\u043F\u0438\u0441\u0435\u0439 \u0432 \u043F\u0440\u043E\u0444\u0438\u043B\u0435 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F",
            text: "\u0412 \u043F\u0440\u043E\u0444\u0438\u043B\u044C \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u0430 \u043D\u043E\u0432\u0430\u044F \u0432\u043A\u043B\u0430\u0434\u043A\u0430 \u041F\u043E\u0434\u043F\u0438\u0441\u044C.",
            children: []
          },
          {
            id: uid(),
            label: "\u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435 \u043F\u043E \u043C\u0435\u0441\u0442\u0443",
            text: "\u041F\u0435\u0440\u0435\u0440\u0430\u0431\u043E\u0442\u0430\u043D \u0440\u0435\u0436\u0438\u043C \u0440\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u044F \u043F\u043E \u043C\u0435\u0441\u0442\u0443. \u0422\u0435\u043F\u0435\u0440\u044C \u0432\u0441\u0435 \u042D\u0423 \u0432 \u0440\u0435\u0436\u0438\u043C\u0435 \u0440\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u044F \u043F\u043E \u043C\u0435\u0441\u0442\u0443 \u0438\u0437\u043C\u0435\u043D\u044F\u044E\u0442\u0441\u044F \u043F\u0440\u044F\u043C\u043E \u0432 \u0437\u0430\u043D\u0438\u043C\u0430\u0435\u043C\u044B\u0445 \u043E\u0431\u043B\u0430\u0441\u0442\u044F\u0445. \u041C\u0430\u043B\u0435\u043D\u044C\u043A\u043E\u0435 \u0432\u0441\u043F\u043B\u044B\u0432\u0430\u044E\u0449\u0435\u0435 \u043E\u043A\u043D\u043E \u0440\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u044F \u043F\u043E\u044F\u0432\u043B\u044F\u0435\u0442\u0441\u044F \u0442\u043E\u043B\u044C\u043A\u043E \u0434\u043B\u044F \u042D\u0423 \u0422\u0435\u043A\u0441\u0442.",
            children: []
          }
        ]
      },
      {
        id: uid(),
        head: "\u0418\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F \u0432 \u0431\u0438\u0431\u043B\u0438\u043E\u0442\u0435\u043A\u0430\u0445 \u044D\u043B\u0435\u043C\u0435\u043D\u0442\u043E\u0432 \u0443\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u044F",
        icon: "bookshelf",
        model: false,
        children: [
          {
            id: uid(),
            label: "\u0421\u0442\u0440\u043E\u043A\u0430 \u043A\u043E\u043D\u0441\u0442\u0440\u0443\u043A\u0442\u043E\u0440\u0430 \u0441\u043F\u0440\u0430\u0432\u043E\u0447\u043D\u0438\u043A\u043E\u0432",
            text: '\u0414\u043B\u044F \u042D\u0423 "\u0421\u0442\u0440\u043E\u043A\u0430 \u043A\u043E\u043D\u0441\u0442\u0440\u0443\u043A\u0442\u043E\u0440\u0430 \u0441\u043F\u0440\u0430\u0432\u043E\u0447\u043D\u0438\u043A\u043E\u0432" \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u043E \u043D\u043E\u0432\u043E\u0435 \u0441\u0432\u043E\u0439\u0441\u0442\u0432\u043E \u0420\u0430\u0437\u0440\u0435\u0448\u0438\u0442\u044C \u043F\u043E\u0438\u0441\u043A \u0443\u0437\u043B\u0430, \u0434\u043E\u0431\u0430\u0432\u043B\u044F\u044E\u0449\u0435\u0435 \u0432\u043E\u0437\u043C\u043E\u0436\u043D\u043E\u0441\u0442\u044C \u043F\u043E\u0438\u0441\u043A\u0430 \u043F\u043E \u0443\u0437\u043B\u0430\u043C \u0441\u043F\u0440\u0430\u0432\u043E\u0447\u043D\u0438\u043A\u0430.',
            children: []
          },
          {
            id: uid(),
            label: "\u0421\u043F\u0438\u0441\u043E\u043A \u0444\u0430\u0439\u043B\u043E\u0432",
            text: "\u0414\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u043E \u043D\u043E\u0432\u043E\u0435 \u0441\u0432\u043E\u0439\u0441\u0442\u0432\u043E, \u043F\u043E\u0437\u0432\u043E\u043B\u044F\u044E\u0449\u0435\u0435 \u0441\u043A\u0440\u044B\u0442\u044C \u043A\u043D\u043E\u043F\u043A\u0443 \u043F\u043E\u0434\u043F\u0438\u0441\u0438 \u0432 \u0421\u043F\u0438\u0441\u043A\u0435 \u0444\u0430\u0439\u043B\u043E\u0432, \u043D\u0430\u043F\u0440\u0438\u043C\u0435\u0440, \u0435\u0441\u043B\u0438 \u0432 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0443 \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D \u042D\u0423 \u041A\u043D\u043E\u043F\u043A\u0430 \u043F\u043E\u0434\u043F\u0438\u0441\u0430\u043D\u0438\u044F.",
            children: []
          },
          {
            id: uid(),
            label: "\u041A\u043D\u043E\u043F\u043A\u0430 \u043F\u043E\u0434\u043F\u0438\u0441\u0430\u043D\u0438\u044F",
            text: '\u041D\u043E\u0432\u044B\u0439 \u044D\u043B\u0435\u043C\u0435\u043D\u0442 \u0443\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u044F, \u043A\u043E\u0442\u043E\u0440\u044B\u0439 \u043C\u043E\u0436\u0435\u0442 \u0431\u044B\u0442\u044C \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0443 \u0442\u0438\u043F\u0430 "\u0414\u043E\u043A\u0443\u043C\u0435\u043D\u0442". \u042D\u0423 \u043F\u0440\u0435\u0434\u0441\u0442\u0430\u0432\u043B\u044F\u0435\u0442 \u0441\u043E\u0431\u043E\u0439 \u043A\u043D\u043E\u043F\u043A\u0443, \u043F\u043E\u0437\u0432\u043E\u043B\u044F\u044E\u0449\u0443\u044E \u043F\u043E\u0434\u043F\u0438\u0441\u0430\u0442\u044C \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0443 \u0431\u0435\u0437 \u0444\u0430\u0439\u043B\u043E\u0432 (\u043F\u043E\u0434\u043F\u0438\u0441\u0430\u0442\u044C \u0442\u043E\u043B\u044C\u043A\u043E \u0430\u0442\u0440\u0438\u0431\u0443\u0442\u044B \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438).',
            children: []
          },
          {
            id: uid(),
            label: "CertificateSettings",
            text: "\u041D\u043E\u0432\u044B\u0439 \u044D\u043B\u0435\u043C\u0435\u043D\u0442 \u0443\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u044F, \u043E\u0442\u0432\u0435\u0447\u0430\u044E\u0449\u0438\u0439 \u0437\u0430 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0443 \u0441\u0435\u0440\u0442\u0438\u0444\u0438\u043A\u0430\u0442\u043E\u0432 \u0432 \u043F\u0440\u043E\u0444\u0438\u043B\u0435 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F.",
            children: []
          }
        ]
      },
      {
        id: uid(),
        head: "\u041E\u043F\u0442\u0438\u043C\u0438\u0437\u0430\u0446\u0438\u0438",
        icon: "rocket-launch",
        model: false,
        children: [
          {
            id: uid(),
            label: "\u041A\u043E\u043D\u0441\u043E\u043B\u044C \u0431\u0440\u0430\u0443\u0437\u0435\u0440\u0430",
            text: "\u0421\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u044F \u043E\u0431 \u043E\u0442\u043C\u0435\u043D\u0435 \u043E\u0431\u0435\u0449\u0430\u043D\u0438\u044F (promise) \u0431\u043E\u043B\u044C\u0448\u0435 \u043D\u0435 \u0432\u044B\u0432\u043E\u0434\u044F\u0442\u0441\u044F \u0432 \u043A\u043E\u043D\u0441\u043E\u043B\u044C \u0431\u0440\u0430\u0443\u0437\u0435\u0440\u0430. \u041F\u0440\u0438 \u043E\u0442\u043C\u0435\u043D\u0435 \u0441\u043E\u0431\u044B\u0442\u0438\u044F \u043E\u0431\u0440\u0430\u0431\u043E\u0442\u0447\u0438\u043A\u043E\u043C, \u0432 \u043A\u043E\u043D\u0441\u043E\u043B\u0438 \u0432\u044B\u0432\u043E\u0434\u0438\u0442\u0441\u044F \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435 \u043E \u0442\u043E\u043C, \u043A\u0430\u043A\u043E\u0439 \u043E\u0431\u0440\u0430\u0431\u043E\u0442\u0447\u0438\u043A \u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0435\u043D\u0435\u043D \u0437\u0430 \u043E\u0442\u043C\u0435\u043D\u0443 \u043A\u043E\u043D\u043A\u0440\u0435\u0442\u043D\u043E\u0433\u043E \u0441\u043E\u0431\u044B\u0442\u0438\u044F.",
            children: []
          }
        ]
      },
      {
        id: uid(),
        head: "\u041D\u043E\u0432\u044B\u0435 \u043F\u0440\u0438\u043C\u0435\u0440\u044B \u0432 \u0440\u0435\u043F\u043E\u0437\u0438\u0442\u043E\u0440\u0438\u0438 \u043D\u0430 github",
        icon: "github",
        model: false,
        children: [
          {
            id: uid(),
            label: "Github",
            text: "\u0412 \u0440\u0435\u043F\u043E\u0437\u0438\u0442\u043E\u0440\u0438\u0439 WebClient-Samples \u043D\u0430 GitHub \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u044B \u043D\u043E\u0432\u044B\u0435 \u043F\u0440\u0438\u043C\u0435\u0440\u044B.",
            show: false,
            more: "<ul><li>\u041E\u0442\u043E\u0431\u0440\u0430\u0437\u0438\u0442\u044C \u043A\u043E\u043B\u0438\u0447\u0435\u0441\u0442\u0432\u043E \u043D\u0435\u043F\u0440\u043E\u0447\u0438\u0442\u0430\u043D\u043D\u044B\u0445 \u043A\u0430\u0440\u0442\u043E\u0447\u0435\u043A.</li> <li>\u0418\u0437\u043C\u0435\u043D\u0438\u0442\u044C \u0446\u0432\u0435\u0442 \u0441\u0442\u0440\u043E\u043A\u0438 \u043F\u043E \u043A\u043D\u043E\u043F\u043A\u0435.</li></ul>",
            children: []
          }
        ]
      },
      {
        id: uid(),
        head: "\u0418\u0441\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u043D\u044B\u0435 \u043E\u0448\u0438\u0431\u043A\u0438",
        icon: "alert",
        model: false,
        children: [
          {
            id: uid(),
            label: "ERR-2174",
            text: "\u041A\u0430\u043B\u0435\u043D\u0434\u0430\u0440\u044C \u043F\u043E \u0443\u043C\u043E\u043B\u0447\u0430\u043D\u0438\u044E \u043D\u0435 \u0443\u0447\u0438\u0442\u044B\u0432\u0430\u0435\u0442\u0441\u044F \u043F\u0440\u0438 \u0440\u0430\u0441\u0447\u0451\u0442\u0435 \u0441\u0440\u043E\u043A\u043E\u0432.",
            children: []
          },
          {
            id: uid(),
            label: "ERR-1630",
            text: "\u041E\u0448\u0438\u0431\u043E\u0447\u043D\u043E \u0441\u0440\u0430\u0431\u0430\u0442\u044B\u0432\u0430\u0435\u0442 \u0437\u0430\u043F\u0440\u0435\u0442 \u043D\u0430 \u0441\u043E\u0437\u0434\u0430\u043D\u0438\u044F \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438 \u043F\u0440\u0438 \u0441\u043E\u0437\u0434\u0430\u043D\u0438\u0438 \u0441\u0432\u044F\u0437\u0430\u043D\u043D\u043E\u0439 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438.",
            children: []
          },
          {
            id: uid(),
            label: "ERR-1840",
            text: '\u041D\u0435 \u043E\u0442\u043A\u0440\u044B\u0432\u0430\u0435\u0442\u0441\u044F xlsx \u0444\u0430\u0439\u043B \u0432 "\u0445\u043E\u0434 \u0441\u043E\u0433\u043B\u0430\u0441\u043E\u0432\u0430\u043D\u0438\u044F".',
            children: []
          },
          {
            id: uid(),
            label: "ERR-1276",
            text: "\u041F\u0440\u0438 \u043A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0438 \u0440\u0430\u0437\u043C\u0435\u0442\u043A\u0438 \u0432 \u0434\u0440\u0443\u0433\u043E\u0435 \u0440\u0435\u0448\u0435\u043D\u0438\u0435 \u0447\u0430\u0441\u0442\u0438\u0447\u043D\u043E \u0441\u0431\u0440\u0430\u0441\u044B\u0432\u0430\u044E\u0442\u0441\u044F \u043E\u043F\u0435\u0440\u0430\u0446\u0438\u0438 \u0440\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u044F.",
            children: []
          },
          {
            id: uid(),
            label: "ERR-1757",
            text: "\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u043F\u043E\u0438\u0441\u043A\u0435 \u0441\u043E\u0442\u0440\u0443\u0434\u043D\u0438\u043A\u0430 \u0432 \u043A\u043E\u043D\u0442\u0440\u043E\u043B\u0435 StaffDirectoryItems, \u0435\u0441\u043B\u0438 \u0432 \u0438\u043C\u0435\u043D\u0438 \u043E\u0440\u0433\u0430\u043D\u0438\u0437\u0430\u0446\u0438\u0438 \u043F\u0440\u0438\u0441\u0443\u0442\u0441\u0442\u0432\u0443\u0435\u0442 \u0441\u0438\u043C\u0432\u043E\u043B &.",
            children: []
          },
          {
            id: uid(),
            label: "ERR-1857",
            text: "\u041D\u0435 \u0434\u043E\u0431\u0430\u0432\u043B\u044F\u044E\u0442\u0441\u044F \u0441\u0442\u0430\u0440\u044B\u0435 \u0433\u0440\u0443\u043F\u043F\u043E\u0432\u044B\u0435 \u043E\u043F\u0435\u0440\u0430\u0446\u0438\u0438 \u0432 \u043D\u043E\u0432\u044B\u0439 \u0433\u0440\u0438\u0434.",
            children: []
          },
          {
            id: uid(),
            label: "ERR-2094",
            text: "\u041D\u0435 \u043E\u0442\u043E\u0431\u0440\u0430\u0436\u0430\u0435\u0442\u0441\u044F \u0430\u0440\u0445\u0438\u0432\u043D\u043E\u0435 \u0437\u0430\u0434\u0430\u043D\u0438\u0435 \u0432 \u0442\u0430\u0431\u043B\u0438\u0446\u0435 \u0438\u0441\u043F\u043E\u043B\u043D\u0435\u043D\u0438\u044F \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438 \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u0430.",
            children: []
          },
          {
            id: uid(),
            label: "ERR-2111",
            text: "\u041D\u0435\u0442 \u0432\u043E\u0437\u043C\u043E\u0436\u043D\u043E\u0441\u0442\u0438 \u043F\u0440\u043E\u043F\u0443\u0441\u043A\u0430\u0442\u044C \u0432\u0441\u0435 \u0432\u043D\u0435\u0448\u043D\u0438\u0435 \u0440\u0435\u0441\u0443\u0440\u0441\u044B \u043F\u0440\u0438 \u043A\u043E\u043D\u0432\u0435\u0440\u0442\u0430\u0446\u0438\u0438 \u0444\u0430\u0439\u043B\u043E\u0432 \u043F\u0440\u0438 \u043F\u0440\u0435\u0434\u043F\u0440\u043E\u0441\u043C\u043E\u0442\u0440\u0435.",
            children: []
          },
          {
            id: uid(),
            label: "ERR-2102",
            id: uid(),
            text: "IFileConvertationService \u0434\u043E\u043B\u0436\u0435\u043D \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u0442\u044C \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u043D\u0438\u0435 \u043A\u043B\u0438\u0435\u043D\u0442\u0441\u043A\u0438\u0445 \u043A\u043E\u043D\u0432\u0435\u0440\u0442\u0435\u0440\u043E\u0432.",
            children: []
          },
          {
            id: uid(),
            label: "ERR-2060",
            text: "\u0412 \u0441\u043F\u0440\u0430\u0432\u043E\u0447\u043D\u0438\u043A\u0435 \u0441\u043E\u0442\u0440\u0443\u0434\u043D\u0438\u043A\u043E\u0432 \u043D\u0435 \u043E\u0442\u043E\u0431\u0440\u0430\u0436\u0430\u044E\u0442\u0441\u044F \u043A\u043E\u043B\u043E\u043D\u043A\u0438 \u0424\u0418\u041E, \u0424\u0430\u043C\u0438\u043B\u0438\u044F, \u0418\u043C\u044F, \u041E\u0442\u0447\u0435\u0441\u0442\u0432\u043E.",
            children: []
          },
          {
            id: uid(),
            label: "ERR-2095",
            text: "\u041A\u043E\u0440\u0435\u043D\u044C WebFrame. \u041D\u0435 \u0440\u0430\u0431\u043E\u0442\u0430\u0435\u0442 \u0443\u0441\u043B\u043E\u0432\u0438\u0435 \u0440\u043E\u043B\u0438 \u0434\u043B\u044F \u043E\u0442\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u044F \u0440\u0430\u0437\u043C\u0435\u0442\u043A\u0438.",
            children: []
          },
          {
            id: uid(),
            label: "ERR-2030",
            text: 'Uncaught TypeError: Cannot read properties of null (reading "textContent") \u043F\u0440\u0438 \u043D\u0430\u043B\u0438\u0447\u0438\u0438 \u0444\u0430\u0439\u043B\u0430, \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u043D\u043E\u0433\u043E \u0434\u043B\u044F \u043F\u0440\u0435\u0434\u043F\u0440\u043E\u0441\u043C\u043E\u0442\u0440\u0430 \u0441\u0440\u0435\u0434\u0438 \u043E\u0441\u043D\u043E\u0432\u043D\u044B\u0445 \u0444\u0430\u0439\u043B\u043E\u0432 \u0432 \u0437\u0430\u0434\u0430\u043D\u0438\u0438 \u043D\u0430 \u0441\u043E\u0433\u043B\u0430\u0441\u043E\u0432\u0430\u043D\u0438\u0435.',
            children: []
          },
          {
            id: uid(),
            label: "ERR-1829",
            text: "\u041D\u0435 \u043E\u0442\u043E\u0431\u0440\u0430\u0436\u0430\u0435\u0442\u0441\u044F \u0437\u0430\u0434\u0430\u043D\u0438\u0435 \u0432 \u0442\u0430\u0431\u043B\u0438\u0446\u0435 \u0438\u0441\u043F\u043E\u043B\u043D\u0435\u043D\u0438\u044F \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u0430, \u0435\u0441\u043B\u0438 \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442 \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D \u0432 \u0430\u0440\u0445\u0438\u0432.",
            children: []
          },
          {
            id: uid(),
            label: "ERR-2086",
            text: "\u041F\u0440\u0435\u0434\u043F\u0440\u043E\u0441\u043C\u043E\u0442\u0440 \u0440\u0430\u0437\u043D\u044B\u0445 \u0432\u0435\u0440\u0441\u0438\u0439 \u0444\u0430\u0439\u043B\u0430 \u0432 FileChildren \u043F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0435\u0442 \u0442\u043E\u043B\u044C\u043A\u043E \u043F\u0435\u0440\u0432\u0443\u044E \u0432\u0435\u0440\u0441\u0438\u044E \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u0430.",
            children: []
          }
        ]
      }
    ]
  },
  {
    id: uid(),
    ver: "5.5.5957.226",
    children: [
      {
        id: uid(),
        head: "\u0424\u0443\u043D\u043A\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u044B\u0435 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F",
        icon: "briefcase-outline",
        model: false,
        children: [
          {
            id: uid(),
            label: "\u0418\u043A\u043E\u043D\u043A\u0438",
            text: "\u0414\u043E\u0431\u0430\u0432\u043B\u0435\u043D \u0440\u044F\u0434 \u0438\u043A\u043E\u043D\u043E\u043A.",
            show: false,
            more: "\u0414\u043B\u044F \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0438\u0445 \u044D\u043B\u0435\u043C\u0435\u043D\u0442\u043E\u0432 \u0443\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u044F \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u044B \u0438\u043A\u043E\u043D\u043A\u0438: <ul><li>\u0417\u0430\u043F\u0438\u0441\u0438 \u0441\u043F\u0440\u0430\u0432\u043E\u0447\u043D\u0438\u043A\u0430 \u0441\u043E\u0442\u0440\u0443\u0434\u043D\u0438\u043A\u043E\u0432,</li> <li>\u041F\u0430\u0440\u0442\u043D\u0435\u0440,</li> <li>\u041F\u043E\u0434\u0440\u0430\u0437\u0434\u0435\u043B\u0435\u043D\u0438\u0435 \u043A\u043E\u043D\u0442\u0440\u0430\u0433\u0435\u043D\u0442\u0430,</li> <li>\u0414\u0430\u0442\u0430/\u0432\u0440\u0435\u043C\u044F,</li> <li>\u0421\u0442\u0440\u043E\u043A\u0430 \u043A\u043E\u043D\u0441\u0442\u0440\u0443\u043A\u0442\u043E\u0440\u0430 \u0441\u043F\u0440\u0430\u0432\u043E\u0447\u043D\u0438\u043A\u043E\u0432,</li> <li>\u041D\u0443\u043C\u0435\u0440\u0430\u0442\u043E\u0440,</li> <li>\u0414\u0435\u043B\u043E,</li></ul> \u041D\u0430\u043B\u0438\u0447\u0438\u0435 \u0438\u043B\u0438 \u043E\u0442\u0441\u0443\u0442\u0441\u0442\u0432\u0438\u0435 \u0438\u043A\u043E\u043D\u043A\u0438 \u0443 \u044D\u0442\u0438\u0445 \u042D\u0423 \u0440\u0435\u0433\u0443\u043B\u0438\u0440\u0443\u0435\u0442\u0441\u044F \u0441\u0432\u043E\u0439\u0441\u0442\u0432\u043E\u043C \u041F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0442\u044C \u0438\u043A\u043E\u043D\u043A\u0443. \u0418\u043A\u043E\u043D\u043A\u0438 \u043E\u0442\u043E\u0431\u0440\u0430\u0436\u0430\u044E\u0442\u0441\u044F \u0432\u043E \u0432\u0441\u0435\u0445 \u0440\u0435\u0436\u0438\u043C\u0430\u0445 \u0440\u0430\u0437\u043C\u0435\u0442\u043E\u043A.",
            children: []
          },
          {
            id: uid(),
            label: "\u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435 \u0440\u0430\u0437\u043C\u0435\u0442\u043A\u0438 WebFrame",
            text: "\u0422\u0435\u043F\u0435\u0440\u044C \u0440\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435 \u0440\u0430\u0437\u043C\u0435\u0442\u043A\u0438 WebFrame \u0432\u043A\u043B\u044E\u0447\u0435\u043D\u043E \u043F\u043E \u0443\u043C\u043E\u043B\u0447\u0430\u043D\u0438\u044E \u0438 \u0431\u043E\u043B\u044C\u0448\u0435 \u043D\u0435 \u044F\u0432\u043B\u044F\u0435\u0442\u0441\u044F \u044D\u043A\u0441\u043F\u0435\u0440\u0438\u043C\u0435\u043D\u0442\u0430\u043B\u044C\u043D\u043E\u0439 \u0444\u0443\u043D\u043A\u0446\u0438\u0435\u0439.",
            children: []
          },
          {
            id: uid(),
            label: "\u041E\u043F\u0440\u043E\u0441 \u043F\u043E \u0440\u0430\u0431\u043E\u0442\u0435 Web-\u043A\u043B\u0438\u0435\u043D\u0442\u0430",
            text: "\u0422\u0435\u043F\u0435\u0440\u044C \u0447\u0435\u0440\u0435\u0437 \u0442\u0440\u0438 \u043C\u0435\u0441\u044F\u0446\u0430 \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u043D\u0438\u044F \u043F\u043E\u0441\u043B\u0435 \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u044F \u043F\u0440\u0435\u0434\u043B\u0430\u0433\u0430\u0435\u0442\u0441\u044F \u043F\u0440\u043E\u0439\u0442\u0438 \u043E\u043F\u0440\u043E\u0441 \u043F\u043E \u0440\u0430\u0431\u043E\u0442\u0435 \u0441 Web-\u043A\u043B\u0438\u0435\u043D\u0442\u043E\u043C.",
            children: []
          },
          {
            id: uid(),
            label: "\u0424\u0438\u043B\u044C\u0442\u0440\u0430\u0446\u0438\u044F \u043F\u043E \u0432\u044B\u0447\u0438\u0441\u043B\u044F\u0435\u043C\u044B\u043C \u0441\u0442\u043E\u043B\u0431\u0446\u0430\u043C",
            text: "\u0424\u0438\u043B\u044C\u0442\u0440\u0430\u0446\u0438\u044F \u043F\u043E \u0432\u044B\u0447\u0438\u0441\u043B\u044F\u0435\u043C\u044B\u043C \u0441\u0442\u043E\u043B\u0431\u0446\u0430\u043C \u0442\u0435\u043F\u0435\u0440\u044C \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u0430 \u0432\u043E \u0432\u0441\u0435\u0445 \u043F\u0440\u0435\u0434\u0441\u0442\u0430\u0432\u043B\u0435\u043D\u0438\u044F\u0445.",
            children: []
          }
        ]
      },
      {
        id: uid(),
        head: "\u0418\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F \u0432 \u0431\u0438\u0431\u043B\u0438\u043E\u0442\u0435\u043A\u0430\u0445 \u044D\u043B\u0435\u043C\u0435\u043D\u0442\u043E\u0432 \u0443\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u044F",
        icon: "bookshelf",
        model: false,
        children: [
          {
            id: uid(),
            label: "\u0418\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F \u0440\u0430\u0437\u043C\u0435\u0442\u043A\u0438 WebFrame",
            text: "\u0414\u043E\u0431\u0430\u0432\u043B\u0435\u043D \u0440\u044F\u0434 \u0441\u0432\u043E\u0439\u0441\u0442\u0432 \u0434\u043B\u044F \u044D\u043B\u0435\u043C\u0435\u043D\u0442\u043E\u0432 \u0440\u0430\u0437\u043C\u0435\u0442\u043A\u0438.",
            show: false,
            more: "<ul><li>\u0414\u043B\u044F \u042D\u0423 \u041A\u043E\u043D\u0442\u0435\u0439\u043D\u0435\u0440 \u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043A\u0430 \u041F\u0430\u043D\u0435\u043B\u044C \u043D\u0430\u0432\u0438\u0433\u0430\u0446\u0438\u0438 \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u043E \u0441\u0432\u043E\u0439\u0441\u0442\u0432\u043E \u0412\u0438\u0434\u0438\u043C\u043E\u0441\u0442\u044C, \u043F\u043E\u0437\u0432\u043E\u043B\u044F\u044E\u0449\u0435\u0435 \u0441\u043A\u0440\u044B\u0442\u044C \u042D\u0423.</li> <li>\u0414\u043B\u044F \u044D\u043B\u0435\u043C\u0435\u043D\u0442\u0430 \u041A\u043E\u043D\u0442\u0435\u0439\u043D\u0435\u0440 \u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043A\u0430 \u0442\u0430\u043A\u0436\u0435 \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u043E \u0441\u0432\u043E\u0439\u0441\u0442\u0432\u043E \u0412\u044B\u0441\u043E\u0442\u0430 \u0432 \u043F\u0438\u043A\u0441\u0435\u043B\u044F\u0445, \u043F\u043E\u0437\u0432\u043E\u043B\u044F\u044E\u0449\u0435\u0435 \u0443\u043A\u0430\u0437\u0430\u0442\u044C \u0432\u044B\u0441\u043E\u0442\u0443 \u044D\u043B\u0435\u043C\u0435\u043D\u0442\u0430 \u0443\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u044F</li> <li>\u0414\u043B\u044F \u042D\u0423 layouts:page$ctrl/webFrame/webFrameContent.adoc#bg \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u043E \u0441\u0432\u043E\u0439\u0441\u0442\u0432\u043E, \u043F\u043E\u0437\u0432\u043E\u043B\u044F\u044E\u0449\u0435\u0435 \u0437\u0430\u0434\u0430\u0442\u044C \u0444\u043E\u043D \u0434\u043B\u044F \u0433\u043B\u0430\u0432\u043D\u043E\u0439 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u044B \u0438/\u0438\u043B\u0438 \u043F\u0430\u043F\u043E\u043A.</li> <li>\u0424\u043E\u043D \u0442\u0430\u043A\u0436\u0435 \u043C\u043E\u0436\u043D\u043E \u0437\u0430\u0434\u0430\u0442\u044C \u0432 \u043B\u043E\u043A\u0430\u0446\u0438\u044F\u0445 \u041F\u0430\u043F\u043A\u0430, \u041F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0435 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438, \u0420\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u044B \u043F\u043E\u0438\u0441\u043A\u0430, \u0413\u043B\u0430\u0432\u043D\u0430\u044F \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0430 \u0432 \u0441\u0432\u043E\u0439\u0441\u0442\u0432\u0435 \u0424\u043E\u043D \u0434\u043B\u044F \u044D\u043B\u0435\u043C\u0435\u043D\u0442\u0430 \u0440\u0430\u0437\u043C\u0435\u0442\u043A\u0438 root.</li> <li>\u0414\u043B\u044F \u042D\u0423 \u041B\u043E\u0433\u043E\u0442\u0438\u043F \u043A\u043E\u043C\u043F\u0430\u043D\u0438\u0438 \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u043E \u043D\u043E\u0432\u043E\u0435 \u0441\u0432\u043E\u0439\u0441\u0442\u0432\u043E \u0412\u0438\u0434\u0438\u043C\u043E\u0441\u0442\u044C, \u043F\u043E\u0437\u0432\u043E\u043B\u044F\u044E\u0449\u0435\u0435 \u0441\u043A\u0440\u044B\u0442\u044C \u042D\u0423.</li> <li>\u0422\u0430\u043A\u0436\u0435 \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u043E \u0441\u0432\u043E\u0439\u0441\u0442\u0432\u043E \u041E\u0442\u043E\u0431\u0440\u0430\u0436\u0430\u0442\u044C\u0441\u044F \u0432\u0441\u0435\u0433\u0434\u0430, \u043F\u043E\u0437\u0432\u043E\u043B\u044F\u044E\u0449\u0435\u0435 \u043E\u0442\u043E\u0431\u0440\u0430\u0436\u0430\u0442\u044C \u042D\u0423 \u0432\u0441\u0435\u0433\u0434\u0430.</li></ul> \u0420\u0430\u0437\u043C\u0435\u0442\u043A\u0430 WebFrame \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u0430 \u0434\u043B\u044F \u0440\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u044F \u0432\u0441\u0435\u0433\u0434\u0430 \u0441 \u043D\u0435\u043A\u043E\u0442\u043E\u0440\u044B\u043C\u0438 \u043E\u0433\u0440\u0430\u043D\u0438\u0447\u0435\u043D\u0438\u044F\u043C\u0438.",
            children: []
          },
          {
            id: uid(),
            label: '\u0421\u0432\u043E\u0439\u0441\u0442\u0432\u043E "\u0422\u0435\u0433" \u0434\u043B\u044F \u044D\u043B\u0435\u043C\u0435\u043D\u0442\u043E\u0432 \u0443\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u044F',
            text: "\u0414\u043B\u044F \u043A\u0430\u0436\u0434\u043E\u0433\u043E \u042D\u0423 \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u043E \u043D\u043E\u0432\u043E\u0435 \u0441\u0432\u043E\u0439\u0441\u0442\u0432\u043E Tag / \u0422\u0435\u0433. \u0422\u0435\u0433\u2009\u2014\u2009\u043F\u0440\u043E\u0441\u0442\u043E\u0435 \u0442\u0435\u043A\u0441\u0442\u043E\u0432\u043E\u0435 \u0441\u0432\u043E\u0439\u0441\u0442\u0432\u043E, \u043F\u043E\u0437\u0432\u043E\u043B\u044F\u044E\u0449\u0435\u0435 \u0434\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0441\u043A\u0440\u0438\u043F\u0442 \u0434\u043B\u044F \u042D\u0423 \u0432 \u043F\u0440\u043E\u0433\u0440\u0430\u043C\u043C\u0435 \u041A\u043E\u043D\u0441\u0442\u0440\u0443\u043A\u0442\u043E\u0440 Web-\u0440\u0430\u0437\u043C\u0435\u0442\u043E\u043A.",
            children: []
          }
        ]
      },
      {
        id: uid(),
        head: "\u0418\u0441\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u043D\u044B\u0435 \u043E\u0448\u0438\u0431\u043A\u0438",
        icon: "alert",
        model: false,
        children: [
          {
            id: uid(),
            label: "ERR-2085",
            text: '\u0421\u0442\u0430\u0440\u044B\u0439 \u0433\u0440\u0438\u0434. \u041D\u0435 \u0440\u0430\u0431\u043E\u0442\u0430\u0435\u0442 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430 \u0433\u0440\u0443\u043F\u043F\u0438\u0440\u043E\u0432\u043A\u0438 \u043F\u0440\u0435\u0434\u0441\u0442\u0430\u0432\u043B\u0435\u043D\u0438\u044F "\u043F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0442\u044C \u0440\u0430\u0441\u043A\u0440\u044B\u0442\u043E\u0439".',
            children: []
          },
          {
            id: uid(),
            label: "ERR-2028",
            text: "\u0422\u0435\u043A\u0441\u0442 \u043E\u0434\u043D\u043E\u0433\u043E \u0441\u043E\u0442\u0440\u0443\u0434\u043D\u0438\u043A\u0430 \u043D\u0430\u043A\u043B\u0430\u0434\u044B\u0432\u0430\u0435\u0442\u0441\u044F \u043D\u0430 \u0442\u0435\u043A\u0441\u0442 \u0434\u0440\u0443\u0433\u043E\u0433\u043E \u043F\u0440\u0438 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0435 \u044D\u0442\u0430\u043F\u0430 \u0441\u043E\u0433\u043B\u0430\u0441\u043E\u0432\u0430\u043D\u0438\u0435, \u0435\u0441\u043B\u0438 \u043D\u0430\u0441\u0442\u0440\u043E\u0435\u043D\u043E \u0441\u043E\u0431\u0441\u0442\u0432\u0435\u043D\u043D\u043E\u0435 \u043E\u0442\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435 \u0441\u043E\u0442\u0440\u0443\u0434\u043D\u0438\u043A\u043E\u0432.",
            children: []
          },
          {
            id: uid(),
            label: "ERR-2073",
            text: "\u041D\u0435\u0432\u0435\u0440\u043D\u0430\u044F \u0441\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u043A\u0430 \u043F\u0430\u043F\u043E\u043A \u0432 \u0431\u043E\u043A\u043E\u0432\u043E\u043C \u043C\u0435\u043D\u044E. \u041F\u0430\u043F\u043A\u0438 \u0441 \u0432\u043B\u043E\u0436\u0435\u043D\u0438\u044F\u043C\u0438 \u0438\u043C\u0435\u044E\u0442 \u043F\u0440\u0438\u043E\u0440\u0438\u0442\u0435\u0442 \u043F\u0440\u0438 \u0441\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u043A\u0435.",
            children: []
          },
          {
            id: uid(),
            label: "ERR-2036",
            text: "\u041D\u0435 \u043F\u0440\u043E\u0438\u0441\u0445\u043E\u0434\u0438\u0442 \u0432\u044B\u0440\u0430\u0432\u043D\u0438\u0432\u0430\u043D\u0438\u0435 \u0442\u0435\u043A\u0441\u0442\u0430 \u043F\u043E \u043F\u0440\u0430\u0432\u043E\u043C\u0443 \u043A\u0440\u0430\u044E.",
            children: []
          },
          {
            id: uid(),
            label: "ERR-2003",
            text: "\u0412 \u044D\u0442\u0430\u043F\u0435 \u043D\u0435\u0432\u043E\u0437\u043C\u043E\u0436\u043D\u043E \u0438\u0437\u043C\u0435\u043D\u044F\u0442\u044C \u043F\u0430\u0440\u0430\u043C\u0435\u0442\u0440\u044B \u0435\u0441\u043B\u0438 \u0441\u043E\u0433\u043B\u0430\u0441\u0443\u044E\u0449\u0438\u0435 \u0432\u044B\u0447\u0438\u0441\u043B\u044F\u044E\u0442\u0441\u044F \u0447\u0435\u0440\u0435\u0437 \u0431\u0438\u0437\u043D\u0435\u0441-\u043F\u0440\u043E\u0446\u0435\u0441\u0441..",
            children: []
          },
          {
            id: uid(),
            label: "ERR-1997",
            text: "\u0412 \u0441\u043E\u0437\u0434\u0430\u043D\u043D\u044B\u0445 \u0432\u0440\u0443\u0447\u043D\u0443\u044E \u044D\u0442\u0430\u043F\u0430\u0445 \u043D\u0435\u0442 \u0432\u043E\u0437\u043C\u043E\u0436\u043D\u043E\u0441\u0442\u0438 \u0432\u044B\u043F\u043E\u043B\u043D\u044F\u0442\u044C \u043F\u043E\u0434\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u043F\u0440\u043E\u0441\u0442\u043E\u0439 \u043F\u043E\u0434\u043F\u0438\u0441\u044C\u044E.",
            children: []
          },
          {
            id: uid(),
            label: "ERR-1829",
            text: '\u041D\u0435 \u043E\u0442\u043E\u0431\u0440\u0430\u0436\u0430\u0435\u0442\u0441\u044F \u0441\u043E\u0434\u0435\u0440\u0436\u0438\u043C\u043E\u0435 \u0432\u043A\u043B\u0430\u0434\u043A\u0438 "\u0418\u0441\u043F\u043E\u043B\u043D\u0435\u043D\u0438\u0435" \u0432 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0435 \u0440\u0435\u0437\u043E\u043B\u044E\u0446\u0438\u0438 \u043F\u043E\u0441\u043B\u0435 \u0430\u0440\u0445\u0438\u0432\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u044F \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438.',
            children: []
          },
          {
            id: uid(),
            label: "ERR-1842",
            text: "\u041D\u0435 \u0440\u0430\u0431\u043E\u0442\u0430\u0435\u0442 \u0433\u0440\u0443\u043F\u043F\u0438\u0440\u043E\u0432\u043A\u0430 \u0432 \u043D\u043E\u0432\u043E\u043C \u0433\u0440\u0438\u0434\u0435 \u0434\u043B\u044F \u0447\u0438\u0441\u043B\u043E\u0432\u044B\u0445 \u043A\u043E\u043B\u043E\u043D\u043E\u043A.",
            children: []
          },
          {
            id: uid(),
            label: "ERR-1880",
            text: "\u0412 \u043A\u043E\u043D\u0442\u0440\u043E\u043B\u0435 StaffDirectoryItems \u043D\u0435 \u043E\u0447\u0438\u0449\u0430\u0435\u0442\u0441\u044F \u043F\u0440\u0435\u0434\u044B\u0434\u0443\u0449\u0435\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435.",
            children: []
          },
          {
            id: uid(),
            label: "ERR-1863",
            text: "\u041D\u0435 \u0441\u043E\u0445\u0440\u0430\u043D\u044F\u044E\u0442\u0441\u044F \u0434\u0430\u043D\u043D\u044B\u0435 \u044D\u043B\u0435\u043C\u0435\u043D\u0442\u0430 \u0443\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u044F \u0417\u0430\u043F\u0438\u0441\u0438 \u0441\u043F\u0440\u0430\u0432\u043E\u0447\u043D\u0438\u043A\u0430 \u0441\u043E\u0442\u0440\u0443\u0434\u043D\u0438\u043A\u043E\u0432, \u0435\u0441\u043B\u0438 \u043D\u0435\u0441\u043A\u043E\u043B\u044C\u043A\u043E \u044D\u043B\u0435\u043C\u0435\u043D\u0442\u043E\u0432 \u0434\u0430\u043D\u043D\u043E\u0433\u043E \u0442\u0438\u043F\u0430 \u0431\u044B\u043B\u0438 \u0441\u0432\u044F\u0437\u0430\u043D\u044B \u0441 \u043E\u0434\u043D\u043E\u0439 \u0441\u0435\u043A\u0446\u0438\u0435\u0439 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438.",
            children: []
          },
          {
            id: uid(),
            label: "ERR-1804",
            text: "\u0421\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u043A\u0430 \u0444\u0430\u0439\u043B\u043E\u0432 \u0438\u0437 \u043D\u0435\u0441\u043A\u043E\u043B\u044C\u043A\u0438\u0445 \u0438\u0441\u0442\u043E\u0447\u043D\u0438\u043A\u043E\u0432 \u0432 \u043F\u0440\u0435\u0434\u0435\u043B\u0430\u0445 \u043E\u0434\u043D\u043E\u0439 \u0432\u0435\u0431-\u0441\u0442\u0440\u0430\u043D\u0438\u0446\u044B.",
            children: []
          },
          {
            id: uid(),
            label: "ERR-1808",
            text: "\u0412 \u0441\u043E\u0431\u044B\u0442\u0438\u0438 cardSaved \u043D\u0435 \u043F\u0435\u0440\u0435\u0434\u0430\u044E\u0442\u0441\u044F bindings.",
            children: []
          },
          {
            id: uid(),
            label: "ERR-1630",
            text: "\u0417\u0430\u043F\u0440\u0435\u0442 \u0441\u043E\u0437\u0434\u0430\u043D\u0438\u044F \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438.",
            children: []
          },
          {
            id: uid(),
            label: "ERR-1572",
            text: "\u0418\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u0435 \u0444\u043E\u0440\u043C\u0430\u0442\u0430 \u0434\u0430\u0442\u044B \u0432 \u0432\u0438\u0434\u0436\u0435\u0442\u0435 \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0445 \u043A\u0430\u0440\u0442\u043E\u0447\u0435\u043A.",
            children: []
          },
          {
            id: uid(),
            label: "ERR-1566",
            id: uid(),
            text: "\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0433\u0435\u043D\u0435\u0440\u0430\u0446\u0438\u0438 \u043D\u043E\u043C\u0435\u0440\u0430 \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u0430 : Internal Server Error.",
            children: []
          }
        ]
      }
    ]
  },
  {
    id: uid(),
    ver: "5.5.5957.195",
    children: [
      {
        id: uid(),
        head: "\u0424\u0443\u043D\u043A\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u044B\u0435 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F",
        icon: "briefcase-outline",
        model: false,
        children: [
          {
            id: uid(),
            label: "\u0421\u0432\u043E\u0439\u0441\u0442\u0432\u043E \u043F\u0440\u043E\u0437\u0440\u0430\u0447\u043D\u043E\u0441\u0442\u044C",
            text: "\u0414\u043B\u044F \u0440\u044F\u0434\u0430 \u042D\u0423 \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u043E \u0441\u0432\u043E\u0439\u0441\u0442\u0432\u043E \u043F\u0440\u043E\u0437\u0440\u0430\u0447\u043D\u043E\u0441\u0442\u044C",
            show: false,
            more: "\u0414\u043B\u044F \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0438\u0445 \u042D\u0423 \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u043E \u0441\u0432\u043E\u0439\u0441\u0442\u0432\u043E \u043F\u0440\u043E\u0437\u0440\u0430\u0447\u043D\u043E\u0441\u0442\u044C: <ul> <li>\u0412\u0438\u0434\u0436\u0435\u0442 / \u041A\u0430\u0440\u0442\u043E\u0447\u043A\u0438 \u043F\u0430\u043F\u043A\u0438</li> <li>\u0412\u0438\u0434\u0436\u0435\u0442 / \u041F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0435 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438</li> <li>\u0412\u0438\u0434\u0436\u0435\u0442 / \u0413\u0440\u0443\u043F\u043F\u0430 \u043F\u0430\u043F\u043E\u043A</li> <li>\u0412\u0438\u0434\u0436\u0435\u0442 / \u0418\u0437\u0432\u0435\u0441\u0442\u043D\u0430\u044F \u043F\u0430\u043F\u043A\u0430</li></ul> \u0412\u044B\u0441\u043E\u0442\u0430 \u0432\u0438\u0434\u0436\u0435\u0442\u043E\u0432 \u0440\u0435\u0433\u0443\u043B\u0438\u0440\u0443\u0435\u0442\u0441\u044F \u0432\u044B\u0441\u043E\u0442\u043E\u0439 \u042D\u0423 \u0411\u043B\u043E\u043A.",
            children: []
          },
          {
            id: uid(),
            label: "\u0418\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u044C REST \u0432\u0441\u0435\u0433\u0434\u0430",
            text: "\u0423\u043F\u0440\u0430\u0437\u0434\u043D\u0435\u043D\u0430 \u0432\u043E\u0437\u043C\u043E\u0436\u043D\u043E\u0441\u0442\u044C \u043F\u0435\u0440\u0435\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u044F \u0442\u0440\u0430\u043D\u0441\u043F\u043E\u0440\u0442\u0430 \u0441 REST \u043D\u0430 COM. \u0422\u0435\u043F\u0435\u0440\u044C \u0432\u0441\u0435\u0433\u0434\u0430 \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0435\u0442\u0441\u044F REST.",
            children: []
          },
          {
            id: uid(),
            label: "\u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u043E\u0435 \u0440\u0435\u0437\u0435\u0440\u0432\u043D\u043E\u0435 \u043A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435",
            id: uid(),
            text: "\u0422\u0435\u043F\u0435\u0440\u044C \u043F\u0440\u0438 \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u0438 \u043F\u0440\u043E\u0438\u0441\u0445\u043E\u0434\u0438\u0442 \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u043E\u0435 \u0440\u0435\u0437\u0435\u0440\u0432\u043D\u043E\u0435 \u043A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435 \u0444\u0430\u0439\u043B\u043E\u0432 WebClient.xml WebClientServerExtension.xml, \u0435\u0441\u043B\u0438 \u043F\u0440\u0438 \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u0438 \u0432\u043A\u043B\u044E\u0447\u0435\u043D \u0441\u043E\u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0443\u044E\u0449\u0438\u0439 \u0444\u043B\u0430\u0433.",
            children: []
          },
          {
            id: uid(),
            label: "\u0421\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u0435 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u043E\u0432 \u043F\u043E\u043B\u043D\u043E\u0442\u0435\u043A\u0441\u0442\u043E\u0432\u043E\u0433\u043E \u043F\u043E\u0438\u0441\u043A\u0430",
            text: "\u0420\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u044B \u043F\u043E\u043B\u043D\u043E\u0442\u0435\u043A\u0441\u0442\u043E\u0432\u043E\u0433\u043E \u043F\u043E\u0438\u0441\u043A\u0430 \u0442\u0435\u043F\u0435\u0440\u044C \u0441\u043E\u0445\u0440\u0430\u043D\u044F\u044E\u0442\u0441\u044F \u043F\u0440\u0438 \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u0438 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u044B \u043F\u0440\u0435\u0434\u0441\u0442\u0430\u0432\u043B\u0435\u043D\u0438\u044F.",
            children: []
          }
        ]
      },
      {
        id: uid(),
        head: "\u0418\u0441\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u043D\u044B\u0435 \u043E\u0448\u0438\u0431\u043A\u0438",
        icon: "alert",
        model: false,
        children: [
          {
            id: uid(),
            label: "ERR-1795",
            text: "\u041F\u0440\u0438 \u0440\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0438 \u0447\u0435\u0440\u0435\u0437 WebDav \u0432\u0440\u0435\u043C\u0435\u043D\u043D\u044B\u0439 \u0444\u0430\u0439\u043B \u043F\u0438\u0448\u0435\u0442\u0441\u044F \u043F\u0440\u044F\u043C\u043E \u043D\u0430 \u0434\u0438\u0441\u043A C..",
            children: []
          },
          {
            id: uid(),
            label: "ERR-1694",
            text: 'FilePicker. \u0415\u0441\u0442\u044C \u0432\u043E\u0437\u043C\u043E\u0436\u043D\u043E\u0441\u0442\u044C \u0443\u0434\u0430\u043B\u0438\u0442\u044C \u0444\u0430\u0439\u043B \u0434\u0430\u0436\u0435 \u0435\u0441\u043B\u0438 \u0443\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D \u0440\u0435\u0436\u0438\u043C \u0440\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u044F "\u0411\u0435\u0437 \u0440\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u044F".',
            children: []
          },
          {
            id: uid(),
            label: "ERR-1639",
            id: uid(),
            text: "\u041E\u0448\u0438\u0431\u043A\u0430 internal Server Error \u043F\u0440\u0438 \u043E\u0442\u043C\u0435\u043D\u0435 \u0441\u043E\u0437\u0434\u0430\u043D\u0438\u044F \u0437\u0430\u0434\u0430\u043D\u0438\u044F \u043D\u0430 \u0438\u0441\u043F\u043E\u043B\u043D\u0435\u043D\u0438\u0435.",
            children: []
          },
          {
            id: uid(),
            label: "ERR-1673",
            text: "\u0412 \u043E\u043A\u043D\u0435 \u043F\u0430\u0440\u0430\u043C\u0435\u0442\u0440\u043E\u0432 \u043F\u043E\u0438\u0441\u043A\u0430 \u0432 \u043F\u043E\u043B\u0435 \u0442\u0435\u043A\u0443\u0449\u0435\u0435 \u0432\u0440\u0435\u043C\u044F \u043E\u0442\u043E\u0431\u0440\u0430\u0436\u0430\u0435\u0442\u0441\u044F \u0432\u0440\u0435\u043C\u044F \u0440\u0430\u0437\u043C\u0435\u0442\u043A\u0438 \u0438\u0437 \u043A\u044D\u0448\u0430.",
            children: []
          },
          {
            id: uid(),
            label: "ERR-1682",
            text: "\u0412 \u0438\u0441\u0442\u043E\u0440\u0438\u044E \u0434\u043E\u0431\u0430\u0432\u043B\u044F\u0435\u0442\u0441\u044F \u0437\u0430\u043F\u0438\u0441\u044C \u043E\u0431 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u0438 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u044F \u0432 \u043A\u043E\u043D\u0442\u0440\u043E\u043B\u0435 Dropdown \u043F\u0440\u0438 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u0438 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438, \u0442\u043E\u0433\u0434\u0430 \u043A\u0430\u043A \u0444\u0430\u043A\u0442\u0438\u0447\u0435\u0441\u043A\u0438 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435 \u043D\u0435 \u043C\u0435\u043D\u044F\u043B\u043E\u0441\u044C..",
            children: []
          },
          {
            id: uid(),
            label: "ERR-1746",
            text: "\u0424\u043E\u0440\u043C\u0430 \u043F\u0440\u043E\u0441\u043C\u043E\u0442\u0440\u0430. \u041E\u0442\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435 \u0444\u043B\u0430\u0433\u043E\u0432 \u043D\u0435 \u043E\u0442\u0446\u0435\u043D\u0442\u0440\u0438\u0440\u043E\u0432\u0430\u043D\u043E \u043F\u043E \u043C\u0435\u0442\u043A\u0435..",
            children: []
          },
          {
            id: uid(),
            label: "ERR-1050",
            text: "\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u043E\u0442\u043A\u0440\u044B\u0442\u0438\u0438 \u043C\u043E\u0434\u0430\u043B\u044C\u043D\u043E\u0433\u043E \u043E\u043A\u043D\u0430 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u043F\u0440\u0430\u0432 \u0434\u043E\u0441\u0442\u0443\u043F\u0430 \u0432 \u0441\u043F\u0440\u0430\u0432\u043E\u0447\u043D\u0438\u043A\u0435 \u0441\u043E\u0442\u0440\u0443\u0434\u043D\u0438\u043A\u043E\u0432.",
            children: []
          },
          {
            id: uid(),
            label: "WebC-10823",
            text: '"\u0420\u0435\u0436\u0438\u043C \u043E\u0442\u043B\u043E\u0436\u0435\u043D\u043D\u044B\u0445 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u0439 \u0443\u0436\u0435 \u0432\u043A\u043B\u044E\u0447\u0435\u043D." \u043F\u0440\u0438 \u0443\u0441\u0442\u0430\u043D\u043E\u0432\u043A\u0435 \u0444\u043B\u0430\u0433\u0430.',
            children: []
          },
          {
            id: uid(),
            label: "ERR-1669",
            text: "\u041D\u0435 \u0434\u043E\u0431\u0430\u0432\u043B\u044F\u0435\u0442\u0441\u044F \u0441\u0441\u044B\u043B\u043A\u0430 \u043D\u0430 \u0444\u0430\u0439\u043B \u0432 \u043A\u043E\u043D\u0442\u0440\u043E\u043B\u0435 PartnersDepartment.",
            children: []
          },
          {
            id: uid(),
            label: "ERR-1360",
            text: '\u043F\u043E\u0441\u043B\u0435 \u0443\u0434\u0430\u043B\u0435\u043D\u0438\u044F \u0441\u0441\u044B\u043B\u043A\u0438 \u0438 \u043F\u043E\u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0435\u043C \u0432\u044B\u0431\u043E\u0440\u0435 "\u043F\u0443\u0441\u0442\u043E\u0439 \u0441\u0441\u044B\u043B\u043A\u0438" \u0434\u043E\u0431\u0430\u0432\u043B\u044F\u0435\u0442\u0441\u044F \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435 \u0443\u0434\u0430\u043B\u0435\u043D\u043D\u043E\u0439 \u0441\u0441\u044B\u043B\u043A\u0438.',
            children: []
          },
          {
            id: uid(),
            label: "ERR-1532",
            text: "\u041E\u0442\u043A\u043B\u044E\u0447\u0435\u043D\u043D\u044B\u0435 \u043F\u0430\u043F\u043A\u0438 \u0438\u0437 \u0431\u043E\u043A\u043E\u0432\u043E\u0439 \u043F\u0430\u043D\u0435\u043B\u0438 \u043F\u0440\u043E\u0434\u043E\u043B\u0436\u0430\u044E\u0442 \u043E\u0442\u043E\u0431\u0440\u0430\u0436\u0430\u0442\u044C\u0441\u044F \u0432 \u043F\u0430\u043D\u0435\u043B\u0438 \u043F\u043E\u0441\u043B\u0435 \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u044F \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u044B.",
            children: []
          },
          {
            id: uid(),
            label: "ERR-1352",
            text: "\u042D\u041F \u043D\u0430\u043A\u043B\u0430\u0434\u044B\u0432\u0430\u0435\u0442\u0441\u044F \u0432\u0435\u0440\u0442\u0438\u043A\u0430\u043B\u044C\u043D\u043E.",
            children: []
          },
          {
            id: uid(),
            label: "ERR-1051",
            text: "\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u043E\u0442\u043A\u0440\u044B\u0442\u0438\u0438 \u043C\u043E\u0434\u0430\u043B\u044C\u043D\u043E\u0433\u043E \u043E\u043A\u043D\u0430 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u043F\u0440\u0430\u0432 \u0434\u043E\u0441\u0442\u0443\u043F\u0430 \u0432 \u0441\u043F\u0440\u0430\u0432\u043E\u0447\u043D\u0438\u043A\u0435 \u0441\u043E\u0442\u0440\u0443\u0434\u043D\u0438\u043A\u043E\u0432.",
            children: []
          },
          {
            id: uid(),
            label: "ERR-1529",
            text: "\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u043F\u043E\u043F\u044B\u0442\u043A\u0435 \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u0438\u044F \u0444\u0430\u0439\u043B\u0430 \u0447\u0435\u0440\u0435\u0437 \u043A\u043E\u043D\u0442\u0440\u043E\u043B FilePicker.",
            children: []
          },
          {
            id: uid(),
            label: "ERR-1260",
            text: "\u041D\u0435\u043B\u044C\u0437\u044F \u0441\u043E\u0437\u0434\u0430\u0442\u044C \u0441\u043E\u0442\u0440\u0443\u0434\u043D\u0438\u043A\u0430 \u0438\u043B\u0438 \u043E\u0442\u0440\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u043F\u043E\u043B\u044F \u0443 \u0443\u0436\u0435 \u0441\u043E\u0437\u0434\u0430\u043D\u043D\u043E\u0433\u043E \u0432 \u0421\u043F\u0440\u0430\u0432\u043E\u0447\u043D\u0438\u043A\u0435 \u0441\u043E\u0442\u0440\u0443\u0434\u043D\u0438\u043A\u043E\u0432.",
            children: []
          }
        ]
      }
    ]
  },
  {
    id: uid(),
    ver: "5.5.5957.174",
    children: [
      {
        id: uid(),
        head: "\u0424\u0443\u043D\u043A\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u044B\u0435 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F",
        icon: "briefcase-outline",
        model: false,
        children: [
          {
            id: uid(),
            label: "\u0412\u044B\u0432\u043E\u0434 \u043A\u0440\u0430\u0442\u043A\u043E\u0439 \u0438\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u0438 \u043E \u0441\u043E\u0442\u0440\u0443\u0434\u043D\u0438\u043A\u0435",
            text: "\u0422\u0435\u043F\u0435\u0440\u044C \u043F\u043E\u0441\u043C\u043E\u0442\u0440\u0435\u0442\u044C \u043A\u0440\u0430\u0442\u043A\u0443\u044E \u0438\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u044E \u043E \u0441\u043E\u0442\u0440\u0443\u0434\u043D\u0438\u043A\u0435 \u043C\u043E\u0436\u043D\u043E \u043F\u0440\u044F\u043C\u043E \u0438\u0437 \u044D\u043B\u0435\u043C\u0435\u043D\u0442\u0430 \u0443\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u044F, \u0441\u043C. \u043F\u043E\u0434\u0440\u043E\u0431\u043D\u0435\u0435.",
            children: []
          },
          {
            id: uid(),
            label: "\u041D\u043E\u0432\u044B\u0439 \u0433\u0440\u0438\u0434",
            text: "\u041D\u043E\u0432\u044B\u0439 \u0433\u0440\u0438\u0434, \u0440\u0430\u043D\u0435\u0435 \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u044B\u0439 \u043A\u0430\u043A \u044D\u043A\u0441\u043F\u0435\u0440\u0438\u043C\u0435\u043D\u0442\u0430\u043B\u044C\u043D\u0430\u044F \u0444\u0443\u043D\u043A\u0446\u0438\u044F \u0442\u0435\u043F\u0435\u0440\u044C \u0434\u043E\u0441\u0442\u0443\u043F\u0435\u043D \u0434\u043B\u044F \u0432\u0441\u0435\u0445 \u043D\u0430 \u043A\u043E\u043C\u043F\u044C\u044E\u0442\u0435\u0440\u0430\u0445 \u0438 \u043F\u043B\u0430\u043D\u0448\u0435\u0442\u0430\u0445.",
            children: []
          },
          {
            id: uid(),
            label: "\u0410\u0433\u0440\u0435\u0433\u0430\u0446\u0438\u044F \u043A\u0430\u0440\u0442\u043E\u0447\u0435\u043A \u0432 \u043F\u0440\u0435\u0434\u0441\u0442\u0430\u0432\u043B\u0435\u043D\u0438\u044F\u0445",
            text: "\u041F\u0440\u0438 \u0443\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u043D\u043E\u043C \u0438 \u0441\u043A\u043E\u043D\u0444\u0438\u0433\u0443\u0440\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u043E\u043C \u043F\u043E\u043B\u043D\u043E\u0442\u0435\u043A\u0441\u0442\u043E\u0432\u043E\u043C \u043F\u043E\u0438\u0441\u043A\u0435 Elasticsearch, \u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u0441\u044F \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u043E\u0439 \u0444\u0443\u043D\u043A\u0446\u0438\u044F \u0430\u0433\u0440\u0435\u0433\u0430\u0446\u0438\u0438 \u043A\u0430\u0440\u0442\u043E\u0447\u0435\u043A \u0432 \u043F\u0440\u0435\u0434\u0441\u0442\u0430\u0432\u043B\u0435\u043D\u0438\u0438.",
            children: []
          },
          {
            id: uid(),
            label: "\u0420\u0430\u0437\u0432\u0435\u0440\u043D\u0443\u0442\u044C \u043E\u043A\u043D\u043E \u043D\u0430 \u0432\u0435\u0441\u044C \u044D\u043A\u0440\u0430\u043D",
            text: "\u0414\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u0430 \u0432\u043E\u0437\u043C\u043E\u0436\u043D\u043E\u0441\u0442\u044C \u0440\u0430\u0437\u0432\u043E\u0440\u0430\u0447\u0438\u0432\u0430\u0442\u044C \u043E\u043A\u043D\u0430 \u043D\u0430 \u0432\u0435\u0441\u044C \u044D\u043A\u0440\u0430\u043D.",
            show: false,
            more: "\u0414\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u0430 \u0432\u043E\u0437\u043C\u043E\u0436\u043D\u043E\u0441\u0442\u044C \u0440\u0430\u0437\u0432\u043E\u0440\u0430\u0447\u0438\u0432\u0430\u0442\u044C \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0438\u0435 \u043E\u043A\u043D\u0430 \u043D\u0430 \u0432\u0435\u0441\u044C \u044D\u043A\u0440\u0430\u043D: <ul><li>\u041E\u043A\u043D\u043E \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u0438\u044F \u0441\u0441\u044B\u043B\u043E\u043A.</li> <li>\u041E\u043A\u043D\u043E \u0432\u044B\u0431\u043E\u0440\u0430 \u043F\u0430\u043F\u043A\u0438.</li> <li>\u041E\u043A\u043D\u043E \u043A\u043E\u043D\u0441\u0442\u0440\u0443\u043A\u0442\u043E\u0440\u0430 \u0441\u043F\u0440\u0430\u0432\u043E\u0447\u043D\u0438\u043A\u043E\u0432.</li> <li>\u0421\u043F\u0440\u0430\u0432\u043E\u0447\u043D\u0438\u043A \u043A\u043E\u043D\u0442\u0440\u0430\u0433\u0435\u043D\u0442\u043E\u0432.</li> <li>\u0421\u043F\u0440\u0430\u0432\u043E\u0447\u043D\u0438\u043A \u0441\u043E\u0442\u0440\u0443\u0434\u043D\u0438\u043A\u043E\u0432.</li> <li>\u0421\u043F\u0440\u0430\u0432\u043E\u0447\u043D\u0438\u043A \u043D\u043E\u043C\u0435\u043D\u043A\u043B\u0430\u0442\u0443\u0440\u044B \u0434\u0435\u043B.</li> <li>\u041B\u0438\u0441\u0442 \u0441\u043E\u0433\u043B\u0430\u0441\u043E\u0432\u0430\u043D\u0438\u044F.</li> <li>\u0414\u0435\u0440\u0435\u0432\u043E \u0438\u0441\u043F\u043E\u043B\u043D\u0435\u043D\u0438\u044F.</li> <li>\u041E\u043A\u043D\u043E \u0430\u0442\u0440\u0438\u0431\u0443\u0442\u0438\u0432\u043D\u043E\u0433\u043E \u043F\u043E\u0438\u0441\u043A\u0430.</li> <li>\u0425\u043E\u0434 \u0441\u043E\u0433\u043B\u0430\u0441\u043E\u0432\u0430\u043D\u0438\u044F.</li></ul> \u0427\u0442\u043E\u0431\u044B \u0440\u0430\u0437\u0432\u0435\u0440\u043D\u0443\u0442\u044C \u043E\u043A\u043D\u043E \u043D\u0430 \u0432\u0435\u0441\u044C \u044D\u043A\u0440\u0430\u043D, \u043D\u0430\u0436\u043C\u0438\u0442\u0435 \u043D\u0430 \u043A\u043D\u043E\u043F\u043A\u0443 \u0432 \u043F\u0440\u0430\u0432\u043E\u043C \u0432\u0435\u0440\u0445\u043D\u0435\u043C \u0443\u0433\u043B\u0443 \u043E\u043A\u043D\u0430.",
            children: []
          }
        ]
      },
      {
        id: uid(),
        head: "\u0418\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F \u0432 \u0431\u0438\u0431\u043B\u0438\u043E\u0442\u0435\u043A\u0430\u0445 \u044D\u043B\u0435\u043C\u0435\u043D\u0442\u043E\u0432 \u0443\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u044F",
        icon: "bookshelf",
        model: false,
        children: [
          {
            id: uid(),
            label: "\u042D\u043B\u0435\u043C\u0435\u043D\u0442\u044B \u0443\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u044F \u043D\u043E\u0432\u043E\u0433\u043E \u0433\u0440\u0438\u0434\u0430",
            text: "\u0412 \u043B\u043E\u043A\u0430\u0446\u0438\u0438 \u041A\u0430\u0440\u0442\u043E\u0447\u043A\u0438 \u043F\u0430\u043F\u043A\u0438 \u0438\u0437\u043C\u0435\u043D\u0451\u043D \u043E\u0441\u043D\u043E\u0432\u043D\u043E\u0439 \u044D\u043B\u0435\u043C\u0435\u043D\u0442 \u043D\u043E\u0432\u043E\u0433\u043E \u0433\u0440\u0438\u0434\u0430\u2009\u2014\u2009\u041A\u0430\u0440\u0442\u043E\u0447\u043A\u0438 \u043F\u0430\u043F\u043A\u0438. \u042D\u0423 \u041A\u0430\u0440\u0442\u043E\u0447\u043A\u0438 \u043F\u0430\u043F\u043A\u0438 \u0441\u043E\u0434\u0435\u0440\u0436\u0438\u0442 \u0434\u0432\u0430 \u0432\u0441\u0442\u0440\u043E\u0435\u043D\u043D\u044B\u0445 \u044D\u043B\u0435\u043C\u0435\u043D\u0442\u0430: \u0422\u0443\u043B\u0431\u0430\u0440 \u043F\u0430\u043F\u043A\u0438 \u0438 \u0423\u0437\u0435\u043B \u0434\u043B\u044F \u0433\u0440\u0443\u043F\u043F\u043E\u0432\u044B\u0445 \u043E\u043F\u0435\u0440\u0430\u0446\u0438\u0439.",
            children: []
          },
          {
            id: uid(),
            label: "\u041D\u043E\u0432\u044B\u0435 \u0433\u0440\u0443\u043F\u043F\u043E\u0432\u044B\u0435 \u043E\u043F\u0435\u0440\u0430\u0446\u0438\u0438",
            text: "\u0414\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u044B \u043D\u043E\u0432\u044B\u0435 \u0433\u0440\u0443\u043F\u043F\u043E\u0432\u044B\u0435 \u043E\u043F\u0435\u0440\u0430\u0446\u0438\u0438.",
            show: false,
            more: "<ul><li>\u041F\u0440\u043E\u0447\u0438\u0442\u0430\u0442\u044C\u2009\u2014\u2009\u043F\u043E\u0437\u0432\u043E\u043B\u044F\u0435\u0442 \u043F\u0440\u043E\u0447\u0438\u0442\u0430\u0442\u044C \u0441\u0440\u0430\u0437\u0443 \u0433\u0440\u0443\u043F\u043F\u0443 \u043A\u0430\u0440\u0442\u043E\u0447\u0435\u043A.</li> <li>\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0443\u2009\u2014\u2009\u043F\u043E\u0437\u0432\u043E\u043B\u044F\u0435\u0442 \u043E\u043A\u043E\u043D\u0447\u0430\u0442\u0435\u043B\u044C\u043D\u043E \u0443\u0434\u0430\u043B\u0438\u0442\u044C \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0443.</li> <li>\u0421\u043A\u0430\u0447\u0430\u0442\u044C \u0444\u0430\u0439\u043B\u044B \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438\u2009\u2014\u2009\u043F\u043E\u0437\u0432\u043E\u043B\u044F\u0435\u0442 \u0441\u043A\u0430\u0447\u0430\u0442\u044C \u043E\u0441\u043D\u043E\u0432\u043D\u044B\u0435 \u0438\u043B\u0438 \u0434\u043E\u043F\u043E\u043B\u043D\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u0435 \u0444\u0430\u0439\u043B\u044B, \u0430 \u0442\u0430\u043A\u0436\u0435 \u0444\u0430\u0439\u043B\u044B \u043F\u043E\u0434\u043F\u0438\u0441\u0438 \u0438\u0437 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438.</li></ul>",
            children: []
          },
          {
            id: uid(),
            label: "\u0422\u0430\u0431\u043B\u0438\u0446\u0430 \u0438\u0441\u043F\u043E\u043B\u043D\u0435\u043D\u0438\u044F \u0437\u0430\u0434\u0430\u043D\u0438\u0439",
            text: "\u0412 \u044D\u043B\u0435\u043C\u0435\u043D\u0442 \u0443\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u044F \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u043E \u043D\u043E\u0432\u043E\u0435 \u0441\u0432\u043E\u0439\u0441\u0442\u0432\u043E \u0421\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u043A\u0430, \u043F\u043E\u0437\u0432\u043E\u043B\u044F\u044E\u0449\u0435\u0435 \u0437\u0430\u0434\u0430\u0442\u044C \u0441\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u043A\u0443 \u043F\u043E \u0443\u043C\u043E\u043B\u0447\u0430\u043D\u0438\u044E.",
            children: []
          },
          {
            id: uid(),
            label: "\u0418\u0437\u0431\u0440\u0430\u043D\u043D\u043E\u0435",
            text: "\u0414\u043E\u0431\u0430\u0432\u043B\u0435\u043D \u043D\u043E\u0432\u044B\u0439 \u044D\u043B\u0435\u043C\u0435\u043D\u0442 \u0443\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u044F \u0418\u0437\u0431\u0440\u0430\u043D\u043D\u043E\u0435, \u043F\u043E\u0437\u0432\u043E\u043B\u044F\u044E\u0449\u0438\u0439 \u0434\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0443 \u0432 \u043F\u0430\u043F\u043A\u0443 \u0418\u0437\u0431\u0440\u0430\u043D\u043D\u043E\u0435.",
            children: []
          }
        ]
      },
      {
        id: uid(),
        head: "\u0418\u0441\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u043D\u044B\u0435 \u043E\u0448\u0438\u0431\u043A\u0438",
        icon: "alert",
        model: false,
        children: [
          {
            id: uid(),
            label: "ERR-1356",
            text: "TextArea HtmlEditor \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0438\u0439 Scroll.",
            children: []
          },
          {
            id: uid(),
            label: "ERR-1421",
            text: '\u041E\u0448\u0438\u0431\u043A\u0430 "NullReferenceException" \u0432 StaffDirectoryItems.',
            children: []
          },
          {
            id: uid(),
            label: "ERR-1286",
            text: "\u041F\u0440\u0438 \u043E\u0442\u043C\u0435\u043D\u0435 \u0441\u043E\u0433\u043B\u0430\u0441\u043E\u0432\u0430\u043D\u0438\u044F \u0432 \u0438\u0441\u0442\u043E\u0440\u0438\u0438 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438 \u043D\u0435\u0442 \u0441\u043E\u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0443\u044E\u0449\u0435\u0439 \u0437\u0430\u043F\u0438\u0441\u0438.",
            children: []
          },
          {
            id: uid(),
            label: "WebC-11062",
            text: "\u0411\u043B\u043E\u043A \u0441 \u0444\u0430\u0439\u043B\u043E\u043C \u043E\u0442\u0447\u0435\u0442\u0430 \u043F\u043E \u0443\u043C\u043E\u043B\u0447\u0430\u043D\u0438\u044E \u043E\u0442\u043E\u0431\u0440\u0430\u0436\u0430\u0435\u0442\u0441\u044F \u0441\u0432\u0451\u0440\u043D\u0443\u0442\u044B\u043C.",
            children: []
          },
          {
            id: uid(),
            label: "ERR-1218",
            text: "\u041F\u043E\u0441\u043B\u0435 \u0441\u043E\u0437\u0434\u0430\u043D\u0438\u044F \u043D\u043E\u0432\u043E\u0439 \u0432\u0435\u0440\u0441\u0438\u0438 \u0444\u0430\u0439\u043B\u0430 \u0434\u043E \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u044F \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u044B \u043F\u043E \u0443\u043C\u043E\u043B\u0447\u0430\u043D\u0438\u044E \u043E\u0442\u043E\u0431\u0440\u0430\u0436\u0430\u0435\u0442\u0441\u044F \u0441\u0442\u0430\u0440\u0430\u044F \u0432\u0435\u0440\u0441\u0438\u044F \u0444\u0430\u0439\u043B\u0430.",
            children: []
          },
          {
            id: uid(),
            label: "ERR-1230",
            text: "\u041D\u0435 \u0441\u043E\u0445\u0440\u0430\u043D\u044F\u044E\u0442\u0441\u044F \u0434\u0430\u043D\u043D\u044B\u0435 \u0432 \u043A\u043E\u043D\u0442\u0440\u043E\u043B\u0435 \u043F\u043E\u0441\u043B\u0435 \u043F\u0435\u0440\u0435\u0445\u043E\u0434\u0430 \u0441 Web-\u043A\u043B\u0438\u0435\u043D\u0442\u0430 14 \u043D\u0430 Web-\u043A\u043B\u0438\u0435\u043D\u0442 16.",
            children: []
          },
          {
            id: uid(),
            label: "ERR-1314",
            text: "\u041D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u043D\u0430\u044F \u0434\u043B\u044F \u0432\u044B\u0431\u043E\u0440\u0430 \u043E\u0440\u0433\u0430\u043D\u0438\u0437\u0430\u0446\u0438\u044F, \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u0430 \u0432 StaffDirectoryItems.",
            children: []
          },
          {
            id: uid(),
            label: "ERR-1261",
            text: '\u0412 \u0438\u0441\u0442\u043E\u0440\u0438\u0438 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438 \u043D\u0435 \u0444\u0438\u043A\u0441\u0438\u0440\u0443\u0435\u0442\u0441\u044F \u043E\u043F\u0435\u0440\u0430\u0446\u0438\u044F "\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u0441\u043E\u0433\u043B\u0430\u0441\u043E\u0432\u0430\u043D\u0438\u0435".',
            children: []
          },
          {
            id: uid(),
            label: "ERR-1290",
            text: "\u0412 \u043F\u043E\u043B\u0435 \u0430\u0442\u0440\u0438\u0431\u0443\u0442\u0438\u0432\u043D\u043E\u0433\u043E \u043F\u043E\u0438\u0441\u043A\u0430 \u0410\u0432\u0442\u043E\u0440 = \u042F \u043E\u0442\u043E\u0431\u0440\u0430\u0436\u0430\u0435\u0442\u0441\u044F \u043D\u0435 \u0442\u0435\u043A\u0443\u0449\u0438\u0439 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C, \u0430 \u043F\u0440\u0435\u0434\u044B\u0434\u0443\u0449\u0438\u0439 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C \u043F\u043E\u0434 \u043A\u043E\u0442\u043E\u0440\u044B\u043C \u0431\u044B\u043B \u043B\u043E\u0433\u0438\u043D \u0432 Web-\u043A\u043B\u0438\u0435\u043D\u0442\u0435.",
            children: []
          },
          {
            id: uid(),
            label: "ERR-1070",
            text: "\u0421\u043E\u0437\u0434\u0430\u0435\u0442\u0441\u044F \u043B\u0438\u0448\u043D\u044F\u044F \u0441\u0435\u0441\u0441\u0438\u044F \u0443\u0447\u0451\u0442\u043D\u043E\u0439 \u0437\u0430\u043F\u0438\u0441\u0438 \u043F\u0443\u043B\u0430 \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0439 Web-\u043A\u043B\u0438\u0435\u043D\u0442\u0430 \u043F\u0440\u0438 \u0430\u0443\u0442\u0435\u043D\u0442\u0438\u0444\u0438\u043A\u0430\u0446\u0438\u0438 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F \u0438 \u043F\u0440\u0438 \u0437\u0430\u043F\u0443\u0441\u043A\u0435 \u041A\u043E\u043D\u0441\u0442\u0440\u0443\u043A\u0442\u043E\u0440\u0430 Web-\u0440\u0430\u0437\u043C\u0435\u0442\u043E\u043A.",
            children: []
          },
          {
            id: uid(),
            label: "ERR-1069",
            text: "\u041F\u0440\u0438 \u0437\u0430\u043A\u0440\u044B\u0442\u0438\u0438 \u043A\u043E\u043D\u0441\u0442\u0440\u0443\u043A\u0442\u043E\u0440\u0430 Web-\u0440\u0430\u0437\u043C\u0435\u0442\u043E\u043A \u043D\u0435 \u043E\u0441\u0432\u043E\u0431\u043E\u0436\u0434\u0430\u0435\u0442\u0441\u044F \u043B\u0438\u0446\u0435\u043D\u0437\u0438\u044F.",
            children: []
          },
          {
            id: uid(),
            label: "ERR-1259",
            text: "\u041F\u0430\u0440\u0430\u043C\u0435\u0442\u0440\u0438\u0447\u0435\u0441\u043A\u0438\u0439 \u043F\u043E\u0438\u0441\u043A. \u041D\u0435 \u0432\u043E\u0437\u0432\u0440\u0430\u0449\u0430\u044E\u0442\u0441\u044F \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0435 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u044B \u043F\u043E\u0438\u0441\u043A\u0430 \u043F\u043E\u0441\u043B\u0435 \u0432\u043E\u0437\u0432\u0440\u0430\u0442\u0430 \u043D\u0430\u0437\u0430\u0434 \u0438\u0437 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438.",
            children: []
          },
          {
            id: uid(),
            label: "ERR-0001",
            text: "\u0412 \u043E\u043A\u043D\u0435 \u043F\u043E\u0438\u0441\u043A\u0430 \u043D\u0435\u043B\u044C\u0437\u044F \u0431\u044B\u043B\u043E \u0432\u044B\u0431\u0440\u0430\u0442\u044C \u0441\u043E\u0442\u0440\u0443\u0434\u043D\u0438\u043A\u0430 \u0441 \u0444\u043B\u0430\u0433\u043E\u043C \u041D\u0435 \u043F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0442\u044C \u043F\u0440\u0438 \u0432\u044B\u0431\u043E\u0440\u0435.",
            children: []
          },
          {
            id: uid(),
            label: "ERR-1217",
            text: "\u041F\u043E\u0441\u043B\u0435 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F \u0444\u0430\u0439\u043B\u0430 \u043D\u0435 \u043E\u0431\u043D\u043E\u0432\u043B\u044F\u0435\u0442\u0441\u044F \u0432\u0435\u0440\u0441\u0438\u044F.",
            children: []
          },
          {
            id: uid(),
            label: "ERR-1216",
            text: "\u041F\u043E\u0441\u043B\u0435 \u0440\u0430\u0437\u0432\u043E\u0440\u0430\u0447\u0438\u0432\u0430\u043D\u0438\u044F \u0441\u0432\u043E\u0440\u0430\u0447\u0438\u0432\u0430\u043D\u0438\u044F \u043F\u0430\u043F\u043A\u0438 \u0432 \u0431\u043E\u043A\u043E\u0432\u043E\u043C \u043C\u0435\u043D\u044E \u0441\u0447\u0435\u0442\u0447\u0438\u043A \u043D\u0435\u043F\u0440\u043E\u0447\u0438\u0442\u0430\u043D\u043D\u044B\u0445 \u0441\u0431\u0438\u0432\u0430\u0435\u0442\u0441\u044F \u043D\u0430 \u043F\u0440\u0435\u0434\u044B\u0434\u0443\u0449\u0435\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435.",
            children: []
          }
        ]
      }
    ]
  },
  {
    id: uid(),
    ver: "5.5.5957.141",
    children: [
      {
        id: uid(),
        head: "\u0424\u0443\u043D\u043A\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u044B\u0435 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F",
        icon: "briefcase-outline",
        model: false,
        children: [
          {
            id: uid(),
            label: '\u0414\u043E\u0440\u0430\u0431\u043E\u0442\u0430\u043D \u044D\u043B\u0435\u043C\u0435\u043D\u0442 \u0443\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u044F "\u0422\u0435\u043A\u0441\u0442"',
            text: "\u042D\u043B\u0435\u043C\u0435\u043D\u0442 \u0443\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u044F \u0422\u0435\u043A\u0441\u0442 \u0434\u043E\u0440\u0430\u0431\u043E\u0442\u0430\u043D: \u043F\u043E\u044F\u0432\u0438\u043B\u0430\u0441\u044C \u0432\u043E\u0437\u043C\u043E\u0436\u043D\u043E\u0441\u0442\u044C \u0432\u0441\u0442\u0430\u0432\u0438\u0442\u044C \u0442\u0435\u043A\u0441\u0442 \u0431\u0435\u0437 \u0444\u043E\u0440\u043C\u0430\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u044F \u0438 \u0438\u0437\u043C\u0435\u043D\u0438\u0442\u044C \u0440\u0430\u0437\u043C\u0435\u0440 \u0448\u0440\u0438\u0444\u0442\u0430. \u0422\u0430\u043A\u0436\u0435 \u0443\u043B\u0443\u0447\u0448\u0435\u043D\u0430 \u0440\u0430\u0431\u043E\u0442\u0430 \u0441 \u0432\u0441\u0442\u0430\u0432\u043B\u044F\u0435\u043C\u044B\u043C\u0438 \u0432 \u042D\u0423 \u0442\u0430\u0431\u043B\u0438\u0446\u0430\u043C\u0438 \u0438 \u0432\u0441\u0442\u0430\u0432\u043B\u044F\u0435\u043C\u044B\u043C \u0442\u0435\u043A\u0441\u0442\u043E\u043C."
          },
          {
            id: uid(),
            label: "\u0418\u0437\u043C\u0435\u043D\u0435\u043D\u0430 \u0441\u0442\u0440\u043E\u043A\u0430 \u043F\u043E\u0438\u0441\u043A\u0430",
            text: '\u0412\u043D\u0435\u0448\u043D\u0438\u0439 \u0432\u0438\u0434 \u0441\u0442\u0440\u043E\u043A\u0438 \u043F\u043E\u0438\u0441\u043A\u0430 \u0431\u044B\u043B \u043F\u0435\u0440\u0435\u0440\u0430\u0431\u043E\u0442\u0430\u043D. \u0414\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u0430 \u043A\u043D\u043E\u043F\u043A\u0430 "\u041D\u0430\u0439\u0442\u0438", \u0438\u043D\u0430\u0447\u0435 \u043E\u0444\u043E\u0440\u043C\u043B\u0435\u043D \u0432\u044B\u0431\u043E\u0440 \u043E\u0431\u043B\u0430\u0441\u0442\u0438 \u043F\u043E\u0438\u0441\u043A\u0430.'
          },
          {
            id: uid(),
            label: "\u0421\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u043A\u0430 \u0432 \u0422\u0430\u0431\u043B\u0438\u0446\u0435 \u0438\u0441\u043F\u043E\u043B\u043D\u0435\u043D\u0438\u044F \u0437\u0430\u0434\u0430\u043D\u0438\u0439",
            text: "\u0412 \u0442\u0430\u0431\u043B\u0438\u0446\u0435 \u0438\u0441\u043F\u043E\u043B\u043D\u0435\u043D\u0438\u044F \u0437\u0430\u0434\u0430\u043D\u0438\u0439 \u0442\u0435\u043F\u0435\u0440\u044C \u043C\u043E\u0436\u043D\u043E \u0441\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u0437\u0430\u0434\u0430\u043D\u0438\u044F \u043D\u0430\u0436\u0430\u0442\u0438\u0435\u043C \u043D\u0430 \u0441\u0442\u043E\u043B\u0431\u0435\u0446."
          },
          {
            id: uid(),
            label: "\u0418\u0437\u0431\u0440\u0430\u043D\u043D\u044B\u0435 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438",
            text: "\u0414\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u0430 \u0432\u043E\u0437\u043C\u043E\u0436\u043D\u043E\u0441\u0442\u044C \u0434\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0443 \u0432 \u0438\u0437\u0431\u0440\u0430\u043D\u043D\u043E\u0435."
          },
          {
            id: uid(),
            label: "\u041D\u043E\u0432\u044B\u0439 \u0444\u043E\u0440\u043C\u0430\u0442 \u044D\u043A\u0441\u043F\u043E\u0440\u0442\u0430 \u0440\u0435\u0448\u0435\u043D\u0438\u044F",
            text: "\u0420\u0435\u0448\u0435\u043D\u0438\u044F \u0445\u0440\u0430\u043D\u044F\u0442\u0441\u044F \u0432 \u043D\u043E\u0432\u043E\u043C \u0432\u0438\u0434\u0435. \u041F\u043E\u044F\u0432\u0438\u043B\u0441\u044F \u0434\u043E\u043F\u043E\u043B\u043D\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u0439 \u0444\u043E\u0440\u043C\u0430\u0442 \u0445\u0440\u0430\u043D\u0435\u043D\u0438\u044F \u0438 \u044D\u043A\u0441\u043F\u043E\u0440\u0442\u0430 \u0440\u0435\u0448\u0435\u043D\u0438\u0439. \u0422\u0435\u043F\u0435\u0440\u044C \u0440\u0435\u0448\u0435\u043D\u0438\u0435 \u043C\u043E\u0436\u043D\u043E \u044D\u043A\u0441\u043F\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u043D\u0435 \u043E\u0434\u043D\u0438\u043C \u0444\u0430\u0439\u043B\u043E\u043C, \u0430 \u043F\u0430\u043A\u0435\u0442\u043E\u043C (\u043F\u0430\u043F\u043A\u043E\u0439). \u041F\u043E\u0434\u0440\u043E\u0431\u043D\u0435\u0435 \u0441\u043C. \u042D\u043A\u0441\u043F\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u0420\u0435\u0448\u0435\u043D\u0438\u0435 \u0438 \u0418\u043C\u043F\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u0420\u0435\u0448\u0435\u043D\u0438\u0435."
          },
          {
            id: uid(),
            label: "\u041E\u0442\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u043E\u0432 \u043F\u043E\u0438\u0441\u043A\u0430",
            text: "\u0422\u0435\u043F\u0435\u0440\u044C \u043F\u043E\u043B\u043D\u043E\u0442\u0435\u043A\u0441\u0442\u043E\u0432\u043E\u0433\u043E \u043F\u043E\u0438\u0441\u043A\u0430 \u043E\u0442\u043E\u0431\u0440\u0430\u0436\u0430\u044E\u0442\u0441\u044F \u043A\u0430\u043A \u043E\u0442\u0434\u0435\u043B\u044C\u043D\u0430\u044F \u043F\u0430\u043F\u043A\u0430 \u0441 \u043F\u0440\u0435\u0434\u0441\u0442\u0430\u0432\u043B\u0435\u043D\u0438\u0435\u043C \u0420\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u044B \u043F\u043E\u0438\u0441\u043A\u0430 \u0438 \u0444\u0443\u043D\u043A\u0446\u0438\u044F\u043C\u0438 \u043D\u043E\u0432\u043E\u0433\u043E \u0433\u0440\u0438\u0434\u0430."
          }
        ]
      },
      {
        id: uid(),
        head: "\u0418\u0441\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u043D\u044B\u0435 \u043E\u0448\u0438\u0431\u043A\u0438",
        icon: "alert",
        model: false,
        children: [
          {
            id: uid(),
            label: "ERR-1229",
            text: "\u0421\u0435\u0441\u0441\u0438\u044F \u0441\u043E \u0441\u0447\u0451\u0442\u0447\u0438\u043A\u0430\u043C\u0438 \u043F\u0440\u043E\u0434\u043E\u043B\u0436\u0430\u0435\u0442 \u0431\u044B\u0442\u044C \u0430\u043A\u0442\u0438\u0432\u043D\u043E\u0439 \u043F\u043E\u0441\u043B\u0435 \u0437\u0430\u043A\u0440\u044B\u0442\u0438\u044F \u043E\u0441\u043D\u043E\u0432\u043D\u043E\u0439 \u0441\u0435\u0441\u0441\u0438\u0438 \u043F\u043E \u0442\u0430\u0439\u043C\u0430\u0443\u0442\u0443 \u0435\u0449\u0435 \u043A\u0430\u043A\u043E\u0435-\u0442\u043E \u0432\u0440\u0435\u043C\u044F."
          },
          {
            id: uid(),
            label: "ERR-1208",
            text: "\u0417\u0430\u0432\u0438\u0441\u0430\u043D\u0438\u0435 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u044F \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438 \u043F\u0440\u0438 \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u043D\u0438\u0438 args.cancel() \u0432 \u0441\u043A\u0440\u0438\u043F\u0442\u0435 \u0441\u043E\u0431\u044B\u0442\u0438\u044F \xABOn preparing card save\xBB."
          },
          {
            id: uid(),
            label: "ERR-1222",
            text: '\u041E\u0442\u043E\u0431\u0440\u0430\u0436\u0430\u0435\u0442\u0441\u044F \u043F\u0443\u0441\u0442\u0430\u044F \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0430 \u043F\u0440\u0438 \u043D\u0430\u0436\u0430\u0442\u0438\u0438 \u043A\u043D\u043E\u043F\u043A\u0438 "\u041D\u0430\u0437\u0430\u0434" \u0438\u0437 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438, \u0435\u0441\u043B\u0438 \u043F\u0435\u0440\u0435\u0434 \u044D\u0442\u0438\u043C \u043F\u0435\u0440\u0435\u043A\u043B\u044E\u0447\u0430\u0442\u044C \u0444\u0430\u0439\u043B\u044B \u0432 filePreview.'
          },
          {
            id: uid(),
            label: "ERR-0002",
            text: "\u041D\u0435 \u0441\u043E\u0445\u0440\u0430\u043D\u044F\u0435\u0442\u0441\u044F \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435 \u043D\u0443\u043C\u0435\u0440\u0430\u0442\u043E\u0440\u0430."
          },
          {
            id: uid(),
            label: "ERR-1206",
            text: "\u041E\u0442\u0441\u0443\u0442\u0441\u0442\u0432\u0443\u0435\u0442 \u043A\u043E\u043D\u0442\u0440\u043E\u043B\u043B\u0435\u0440 EmployeesController, \u0431\u0435\u0437 \u043A\u043E\u0442\u043E\u0440\u043E\u0433\u043E \u043D\u0435\u0432\u043E\u0437\u043C\u043E\u0436\u043D\u0430 \u0440\u0430\u0431\u043E\u0442\u0430 EmployeesAutoComplete."
          },
          {
            id: uid(),
            label: "ERR-1184",
            text: "\u041F\u0440\u0438 \u0441\u043E\u0437\u0434\u0430\u043D\u0438\u0438 \u0437\u0430\u0434\u0430\u043D\u0438\u044F \u043F\u043E \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0435 \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u0430 \u0432 \u043F\u0440\u0435\u0434\u043F\u0440\u043E\u0441\u043C\u043E\u0442\u0440\u0435 \u043E\u0442\u043E\u0431\u0440\u0430\u0436\u0430\u0435\u0442\u0441\u044F \u043F\u043E \u0443\u043C\u043E\u043B\u0447\u0430\u043D\u0438\u044E \u0434\u043E\u043F\u043E\u043B\u043D\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u0439 \u0444\u0430\u0439\u043B, \u0430 \u043D\u0435 \u043E\u0441\u043D\u043E\u0432\u043D\u043E\u0439."
          },
          {
            id: uid(),
            label: "ERR-1184",
            text: "\u041F\u0440\u0438 \u0441\u043E\u0437\u0434\u0430\u043D\u0438\u0438 \u0437\u0430\u0434\u0430\u043D\u0438\u044F \u043F\u043E \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0435 \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u0430 \u0432 \u043F\u0440\u0435\u0434\u043F\u0440\u043E\u0441\u043C\u043E\u0442\u0440\u0435 \u043E\u0442\u043E\u0431\u0440\u0430\u0436\u0430\u0435\u0442\u0441\u044F \u043F\u043E \u0443\u043C\u043E\u043B\u0447\u0430\u043D\u0438\u044E \u0434\u043E\u043F\u043E\u043B\u043D\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u0439 \u0444\u0430\u0439\u043B, \u0430 \u043D\u0435 \u043E\u0441\u043D\u043E\u0432\u043D\u043E\u0439."
          },
          {
            id: uid(),
            label: "ERR-1159",
            text: "\u041D\u043E\u0432\u044B\u0439 \u0433\u0440\u0438\u0434. \u041F\u0440\u0438 \u043E\u0442\u043A\u0440\u044B\u0442\u0438\u0438 \u043D\u0435\u043F\u0440\u043E\u0447\u0438\u0442\u0430\u043D\u043D\u043E\u0439 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438 \u0441\u0447\u0435\u0442\u0447\u0438\u043A \u0432 \u043F\u0430\u043F\u043A\u0435 \u043D\u0435 \u0443\u043C\u0435\u043D\u044C\u0448\u0430\u0435\u0442\u0441\u044F."
          },
          {
            id: uid(),
            label: "ERR-0003",
            text: "\u041F\u0440\u0430\u0432\u043A\u0430 \u0434\u043B\u044F \u0441\u0446\u0435\u043D\u0430\u0440\u0438\u044F \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u043E\u0433\u043E \u043E\u0431\u044A\u0435\u0434\u0438\u043D\u0435\u043D\u0438\u044F \u0432\u0435\u0440\u0441\u0438\u0439."
          },
          {
            id: uid(),
            label: "ERR-283",
            text: "\u041D\u0435 \u0440\u0430\u0431\u043E\u0442\u0430\u0435\u0442 \u043F\u0440\u043E\u043A\u0440\u0443\u0442\u043A\u0430 \u0432 \u0431\u043E\u043A\u043E\u0432\u043E\u043C \u043C\u0435\u043D\u044E \u043D\u0430 ios."
          },
          {
            id: uid(),
            label: "ERR-1001",
            text: "\u041D\u0435\u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u043E\u0435 \u043E\u0442\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435 \u043A\u043E\u0434\u0438\u0440\u043E\u0432\u043A\u0438 \u0444\u0430\u0439\u043B\u0430 \u043F\u0440\u0438 \u043F\u0440\u0435\u0434\u043F\u0440\u043E\u0441\u043C\u043E\u0442\u0440\u0435."
          },
          {
            id: uid(),
            label: "ERR-947",
            text: "\u0415\u0441\u043B\u0438 \u0432 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0435 \u043D\u0435\u0442 \u0444\u0430\u0439\u043B\u0430, \u0442\u043E \u0432 \u043F\u0440\u0435\u0432\u044C\u044E \u0444\u0430\u0439\u043B\u0430 \u043E\u0442\u043E\u0431\u0440\u0430\u0436\u0430\u0435\u0442\u0441\u044F \u0444\u0430\u0439\u043B \u0438\u0437 \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0435\u0439 \u043E\u0442\u043A\u0440\u044B\u0442\u043E\u0439 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438."
          },
          {
            id: uid(),
            label: "ERR-1055",
            text: "\u0412\u043C\u0435\u0441\u0442\u043E \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u043E\u0432 \u043F\u043E\u0438\u0441\u043A\u0430 \u043E\u0442\u043E\u0431\u0440\u0430\u0436\u0430\u0435\u0442\u0441\u044F \u043F\u0443\u0441\u0442\u0430\u044F \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0430."
          },
          {
            id: uid(),
            label: "ERR-961",
            text: "\u041D\u0435 \u0432\u0441\u043F\u043B\u044B\u0432\u0430\u0435\u0442 \u043E\u043A\u043D\u043E \u0441 \u0438\u0437\u0431\u0440\u0430\u043D\u043D\u044B\u043C\u0438 \u0441\u043E\u0442\u0440\u0443\u0434\u043D\u0438\u043A\u0430\u043C\u0438 \u043F\u0440\u0438 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u0438 \u0444\u043E\u043A\u0443\u0441\u0430 StaffDirectoryItems."
          },
          {
            id: uid(),
            label: "ERR-909",
            text: "\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u044B\u0439 \u043F\u043E\u0440\u044F\u0434\u043E\u043A \u044D\u0442\u0430\u043F\u043E\u0432 \u0432 \u0445\u043E\u0434\u0435 \u0441\u043E\u0433\u043B\u0430\u0441\u043E\u0432\u0430\u043D\u0438\u044F."
          }
        ]
      }
    ]
  },
  {
    id: uid(),
    ver: "5.5.5957.117",
    children: [
      {
        id: uid(),
        head: "\u0424\u0443\u043D\u043A\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u044B\u0435 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F",
        icon: "briefcase-outline",
        model: false,
        children: [
          {
            id: uid(),
            label: "\u041D\u043E\u0432\u044B\u0435 \u0433\u0440\u0443\u043F\u043F\u043E\u0432\u044B\u0435 \u043E\u043F\u0435\u0440\u0430\u0446\u0438\u0438",
            text: "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044E \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u0430 \u0440\u0430\u0431\u043E\u0442\u0430 \u0441 \u043D\u043E\u0432\u044B\u043C\u0438 \u0433\u0440\u0443\u043F\u043F\u043E\u0432\u044B\u043C\u0438 \u043E\u043F\u0435\u0440\u0430\u0446\u0438\u044F\u043C\u0438.",
            show: false,
            more: "<ul><li>\u041F\u0440\u043E\u0447\u0438\u0442\u0430\u0442\u044C\u2009\u2014\u2009\u043F\u043E\u0437\u0432\u043E\u043B\u044F\u0435\u0442 \u043F\u0440\u043E\u0447\u0438\u0442\u0430\u0442\u044C \u0441\u0440\u0430\u0437\u0443 \u0433\u0440\u0443\u043F\u043F\u0443 \u043A\u0430\u0440\u0442\u043E\u0447\u0435\u043A.</li> <li>\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0443\u2009\u2014\u2009\u043F\u043E\u0437\u0432\u043E\u043B\u044F\u0435\u0442 \u0443\u0434\u0430\u043B\u0438\u0442\u044C \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0443 \u0432 \u043A\u043E\u0440\u0437\u0438\u043D\u0443 \u0438\u043B\u0438 \u043F\u0435\u0440\u043C\u0430\u043D\u0435\u043D\u0442\u043D\u043E.</li> <li>\u0421\u043A\u0430\u0447\u0430\u0442\u044C \u0444\u0430\u0439\u043B\u044B \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438\u2009\u2014\u2009\u043F\u043E\u0437\u0432\u043E\u043B\u044F\u0435\u0442 \u0441\u043A\u0430\u0447\u0430\u0442\u044C \u043E\u0441\u043D\u043E\u0432\u043D\u044B\u0435 \u0438\u043B\u0438 \u0434\u043E\u043F\u043E\u043B\u043D\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u0435 \u0444\u0430\u0439\u043B\u044B, \u0430 \u0442\u0430\u043A\u0436\u0435 \u0444\u0430\u0439\u043B\u044B \u043F\u043E\u0434\u043F\u0438\u0441\u0438 \u0438\u0437 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438.</li></ul>"
          },
          {
            id: uid(),
            label: "\u041E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0443 \u043F\u043E email",
            text: "\u0414\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u0430 \u0432\u043E\u0437\u043C\u043E\u0436\u043D\u043E\u0441\u0442\u044C \u043E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0443 \u043F\u043E \u044D\u043B\u0435\u043A\u0442\u0440\u043E\u043D\u043D\u043E\u0439 \u043F\u043E\u0447\u0442\u0435."
          },
          {
            id: uid(),
            label: "\u041F\u043E\u043B\u044F \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438 \u0441 \u0440\u0435\u0436\u0438\u043C\u043E\u043C \u043F\u0440\u0435\u0434\u043F\u0440\u043E\u0441\u043C\u043E\u0442\u0440\u0430",
            text: "\u0422\u0435\u043F\u0435\u0440\u044C, \u0435\u0441\u043B\u0438 \u0432 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0435 \u043E\u0442\u043E\u0431\u0440\u0430\u0436\u0430\u0435\u0442\u0441\u044F \u043F\u0440\u0435\u0434\u0432\u0430\u0440\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u0439 \u043F\u0440\u043E\u0441\u043C\u043E\u0442\u0440 \u0444\u0430\u0439\u043B\u0430, \u043F\u043E\u043B\u044F \u043B\u044E\u0431\u043E\u0439 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438 \u0423\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u0430\u043C\u0438 (\u043F\u0443\u0441\u0442\u043E\u0435 \u043F\u0440\u043E\u0441\u0442\u0440\u0430\u043D\u0441\u0442\u0432\u043E \u043F\u043E \u043E\u0431\u0435 \u0441\u0442\u043E\u0440\u043E\u043D\u044B \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438) \u0441\u043E\u0441\u0442\u0430\u0432\u043B\u044F\u044E\u0442 5 px."
          }
        ]
      },
      {
        id: uid(),
        head: "\u0418\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F \u0432 \u0431\u0438\u0431\u043B\u0438\u043E\u0442\u0435\u043A\u0430\u0445 \u044D\u043B\u0435\u043C\u0435\u043D\u0442\u043E\u0432 \u0443\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u044F",
        icon: "bookshelf",
        model: false,
        children: [
          {
            id: uid(),
            label: '\u041D\u043E\u0432\u043E\u0435 \u0441\u0432\u043E\u0439\u0441\u0442\u0432\u043E \u042D\u0423 "\u0414\u0430\u043D\u043D\u044B\u0435 \u043F\u0430\u043F\u043A\u0438"',
            text: "\u0414\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u043E \u043D\u043E\u0432\u043E\u0435 \u0441\u0432\u043E\u0439\u0441\u0442\u0432\u043E \u0412\u044B\u0431\u043E\u0440 \u043F\u0440\u0435\u0434\u0441\u0442\u0430\u0432\u043B\u0435\u043D\u0438\u044F \u0434\u043B\u044F \u0440\u0435\u0436\u0438\u043C\u0430 \u0421\u0438\u0441\u0442\u0435\u043C\u043D\u0430\u044F \u043F\u0430\u043F\u043A\u0430, \u043F\u043E\u0437\u0432\u043E\u043B\u044F\u044E\u0449\u0435\u0435 \u043E\u0433\u0440\u0430\u043D\u0438\u0447\u0438\u0442\u044C \u0432\u044B\u0431\u043E\u0440 \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u044B\u0445 \u043F\u0440\u0435\u0434\u0441\u0442\u0430\u0432\u043B\u0435\u043D\u0438\u0439 \u0432 \u043F\u0430\u043F\u043A\u0435. \u041F\u043E\u0434\u0440\u043E\u0431\u043D\u0435\u0435 \u0441\u043C. \u0414\u0430\u043D\u043D\u044B\u0435 \u043F\u0430\u043F\u043A\u0438."
          },
          {
            id: uid(),
            label: "\u042D\u043B\u0435\u043C\u0435\u043D\u0442 \u0443\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u044F SignatureButton",
            text: "\u0414\u043B\u044F \u0440\u0430\u0431\u043E\u0442\u044B \u0441 \u043F\u043E\u0434\u043F\u0438\u0441\u044C\u044E."
          },
          {
            id: uid(),
            label: '\u041C\u0430\u043A\u0441\u0438\u043C\u0430\u043B\u044C\u043D\u0430\u044F \u0432\u044B\u0441\u043E\u0442\u0430 \u0434\u043B\u044F \u042D\u0423 "\u0411\u043B\u043E\u043A"',
            text: "\u0414\u043B\u044F \u044D\u043B\u0435\u043C\u0435\u043D\u0442\u0430 \u0443\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u044F \u0411\u043B\u043E\u043A \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u043E \u0441\u0432\u043E\u0439\u0441\u0442\u0432\u043E \u041C\u0430\u043A\u0441\u0438\u043C\u0430\u043B\u044C\u043D\u0430\u044F \u0432\u044B\u0441\u043E\u0442\u0430, \u043F\u043E\u0437\u0432\u043E\u043B\u044F\u044E\u0449\u0435\u0435 \u043E\u0433\u0440\u0430\u043D\u0438\u0447\u0438\u0442\u044C \u043C\u0430\u043A\u0441\u0438\u043C\u0430\u043B\u044C\u043D\u0443\u044E \u0432\u044B\u0441\u043E\u0442\u0443 \u0431\u043B\u043E\u043A\u0430. \u041F\u0440\u0438 \u043F\u0440\u0435\u0432\u044B\u0448\u0435\u043D\u0438\u0438 \u043C\u0430\u043A\u0441\u0438\u043C\u0430\u043B\u044C\u043D\u043E\u0439 \u0432\u044B\u0441\u043E\u0442\u044B, \u0443 \u0431\u043B\u043E\u043A\u0430 \u043F\u043E\u044F\u0432\u043B\u044F\u0435\u0442\u0441\u044F \u043F\u043E\u043B\u043E\u0441\u0430 \u043F\u0440\u043E\u043A\u0440\u0443\u0442\u043A\u0438 \u043D\u043E\u0432\u043E\u0433\u043E \u0433\u0440\u0438\u0434\u0430."
          },
          {
            id: uid(),
            label: "\u042D\u043B\u0435\u043C\u0435\u043D\u0442 \u0443\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u044F emailButton",
            text: "\u0414\u043E\u0431\u0430\u0432\u043B\u0435\u043D \u044D\u043B\u0435\u043C\u0435\u043D\u0442 \u0443\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u044F \u041A\u043D\u043E\u043F\u043A\u0430 \u043E\u0442\u043F\u0440\u0430\u0432\u043A\u0438 \u043F\u0438\u0441\u044C\u043C\u043E\u043C, \u043F\u043E\u0437\u0432\u043E\u043B\u044F\u044E\u0449\u0438\u0439 \u043E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0443 \u043F\u043E \u044D\u043B\u0435\u043A\u0442\u0440\u043E\u043D\u043D\u043E\u0439 \u043F\u043E\u0447\u0442\u0435."
          },
          {
            id: uid(),
            label: "\u0423\u0441\u0442\u0430\u0440\u0435\u0432\u0448\u0438\u0435 \u044D\u043B\u0435\u043C\u0435\u043D\u0442\u044B \u0443\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u044F",
            text: '\u042D\u043B\u0435\u043C\u0435\u043D\u0442\u044B \u0443\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u044F "\u0421\u043E\u0442\u0440\u0443\u0434\u043D\u0438\u043A\u0438" \u0438 "\u0421\u043E\u0442\u0440\u0443\u0434\u043D\u0438\u043A" \u0442\u0435\u043F\u0435\u0440\u044C \u0441\u0447\u0438\u0442\u0430\u044E\u0442\u0441\u044F \u0443\u0441\u0442\u0430\u0440\u0435\u0432\u0448\u0438\u043C\u0438 \u0438 \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u043D\u044B \u0434\u043B\u044F \u0432\u044B\u0431\u043E\u0440\u0430 \u0432 \u0431\u0438\u0431\u043B\u0438\u043E\u0442\u0435\u043A\u0435 \u042D\u0423 \u043F\u0440\u0438 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0435 \u0440\u0430\u0437\u043C\u0435\u0442\u043E\u043A. \u0423\u0436\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u044E\u0449\u0438\u0435 \u0440\u0430\u0437\u043C\u0435\u0442\u043A\u0438 \u0441 \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u043D\u0438\u0435\u043C \u044D\u0442\u0438\u0445 \u042D\u0423 \u0440\u0430\u0431\u043E\u0442\u0430\u044E\u0442 \u043A\u0430\u043A \u0440\u0430\u043D\u044C\u0448\u0435.'
          }
        ]
      },
      {
        id: uid(),
        head: "\u0418\u0441\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u043D\u044B\u0435 \u043E\u0448\u0438\u0431\u043A\u0438",
        icon: "alert",
        model: false,
        children: [
          {
            id: uid(),
            label: "ERR-1022",
            text: '\u041A\u043E\u043D\u0442\u0440\u043E\u043B\u044B Employee \u0438 MultipleEmployees. \u041F\u0440\u0438 \u043F\u043E\u0432\u0442\u043E\u0440\u043D\u043E\u043C \u043A\u043B\u0438\u043A\u0435 \u043F\u043E "\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u044C \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0435" \u0441\u043F\u0438\u0441\u043E\u043A \u043D\u0435 \u0440\u0430\u0441\u043A\u0440\u044B\u0432\u0430\u0435\u0442\u0441\u044F.'
          },
          {
            id: uid(),
            label: "ERR-1026",
            text: "\u041E\u0442\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435 \u043A\u043E\u043D\u0442\u0440\u043E\u043B\u0430 FilePicker \u0432 \u0442\u0430\u0431\u043B\u0438\u0446\u0435 - \u043E\u0442\u0441\u0443\u0442\u0441\u0442\u0432\u0443\u0435\u0442 \u043A\u043D\u043E\u043F\u043A\u0430 \u0443\u0434\u0430\u043B\u0435\u043D\u0438\u044F \u0444\u0430\u0439\u043B\u0430."
          },
          {
            id: uid(),
            label: "ERR-906",
            text: "\u041F\u0440\u0438 \u043E\u0442\u043C\u0435\u043D\u0435 \u043F\u043E\u0438\u0441\u043A\u0430 \u043F\u043E \u0430\u0442\u0440\u0438\u0431\u0443\u0442\u0430\u043C \u043F\u0440\u043E\u0438\u0441\u0445\u043E\u0434\u0438\u0442 \u0434\u043E\u043B\u0433\u0430\u044F \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0430 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u044B \u0438 \u043F\u0435\u0440\u0435\u043D\u0430\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u043D\u0430 \u043F\u0440\u0435\u0434\u044B\u0434\u0443\u0449\u0443\u044E \u043F\u0430\u043F\u043A\u0443."
          },
          {
            id: uid(),
            label: "ERR-901",
            text: "\u041D\u0435 \u043F\u0440\u0438\u043C\u0435\u043D\u044F\u0435\u0442\u0441\u044F \u0441\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u043A\u0430 \u0432 \u043F\u043E\u0438\u0441\u043A\u043E\u0432\u044B\u0445 \u043F\u0430\u043F\u043A\u0430\u0445 \u0432 \u0441\u0442\u0430\u0440\u043E\u043C \u0433\u0440\u0438\u0434\u0435."
          },
          {
            id: uid(),
            label: "ERR-988",
            text: "\u041F\u0440\u043E\u0431\u043B\u0435\u043C\u044B \u0441 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u0435\u043C \u043A\u0430\u0440\u0442\u043E\u0447\u0435\u043A \u0437\u0430\u0434\u0430\u043D\u0438\u044F \u0432 \u0440\u0430\u0437\u043C\u0435\u0442\u043A\u0435 \u043F\u0440\u043E\u0441\u043C\u043E\u0442\u0440\u0430."
          },
          {
            id: uid(),
            label: "ERR-921",
            text: "\u041F\u043E\u0441\u043B\u0435 \u0443\u0445\u043E\u0434\u0430 \u0441\u0435\u0441\u0441\u0438\u0438 \u0432 \u043E\u0444\u043B\u0430\u0439\u043D, \u0432\u0442\u043E\u0440\u0430\u044F \u0441\u0435\u0441\u0441\u0438\u044F Web-\u043A\u043B\u0438\u0435\u043D\u0442\u0430 \u043F\u0440\u043E\u0434\u043E\u043B\u0436\u0430\u0435\u0442 \u043E\u0441\u0442\u0430\u0432\u0430\u0442\u044C\u0441\u044F \u0430\u043A\u0442\u0438\u0432\u043D\u043E\u0439 \u0438 \u0432\u044B\u043F\u043E\u043B\u043D\u044F\u0435\u0442 \u0440\u0430\u0441\u0447\u0451\u0442 \u0441\u0447\u0435\u0442\u0447\u0438\u043A\u043E\u0432."
          },
          {
            id: uid(),
            label: "ERR-919",
            text: "\u041D\u0435\u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u0430 \u0440\u0430\u0431\u043E\u0442\u0430 \u0438\u043D\u0441\u0442\u0430\u043B\u043B\u044F\u0442\u043E\u0440\u0430 \u043F\u0440\u0438 \u043E\u0442\u0434\u0435\u043B\u044C\u043D\u043E\u0439 \u0443\u0441\u0442\u0430\u043D\u043E\u0432\u043A\u0435 \u043A\u043E\u043D\u0441\u0442\u0440\u0443\u043A\u0442\u043E\u0440\u0430 Web-\u0440\u0430\u0437\u043C\u0435\u0442\u043E\u043A \u043E\u0442 \u0441\u0435\u0440\u0432\u0435\u0440\u0430 Web-\u043A\u043B\u0438\u0435\u043D\u0442\u0430."
          },
          {
            id: uid(),
            label: "WebC-10940",
            text: "\u0418\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u0435 \u043A\u043E\u043D\u0442\u0440\u043E\u043B\u0430 \u0432\u0432\u043E\u0434\u0430 \u043A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u044F \u043F\u0440\u0438 \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u0438\u0438 \u0437\u0430\u0434\u0430\u043D\u0438\u044F \u043D\u0430 \u0441\u043E\u0433\u043B\u0430\u0441\u043E\u0432\u0430\u043D\u0438\u0435 \u0441 TextBox \u043D\u0430 TextArea."
          },
          {
            id: uid(),
            label: "ERR-804",
            text: "\u041F\u043E\u0441\u043B\u0435 \u044D\u043A\u0441\u043F\u043E\u0440\u0442\u0430 \u043F\u0440\u0435\u0434\u0441\u0442\u0430\u0432\u043B\u0435\u043D\u0438\u044F \u0438\u0437 Web-\u043A\u043B\u0438\u0435\u043D\u0442\u0430 \u0432 Excel \u0432 \u043A\u043E\u043D\u0435\u0446 \u0441\u0442\u0440\u043E\u043A \u044D\u043A\u0441\u043F\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u043E\u0433\u043E \u0444\u0430\u0439\u043B\u0430 \u0434\u043E\u0431\u0430\u0432\u043B\u044F\u0435\u0442\u0441\u044F \u043F\u0440\u043E\u0431\u0435\u043B."
          },
          {
            id: uid(),
            label: "WebC-11191",
            text: "\u041D\u0435 \u043E\u0442\u043E\u0431\u0440\u0430\u0436\u0430\u0435\u0442\u0441\u044F \u043A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0439 \u043A \u0440\u0435\u0448\u0435\u043D\u0438\u044E \u0432 \u0437\u0430\u0434\u0430\u043D\u0438\u0438 \u0438 \u0432 \u043A\u043E\u043D\u0442\u0440\u043E\u043B\u0435 \u0425\u043E\u0434 \u0441\u043E\u0433\u043B\u0430\u0441\u043E\u0432\u0430\u043D\u0438\u044F \u0441\u0432\u044F\u0437\u0430\u043D\u043D\u043E\u0433\u043E \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u0430."
          },
          {
            id: uid(),
            label: "WebC-11132",
            text: '\u041D\u0435 \u0437\u0430\u043F\u043E\u043B\u043D\u044F\u0435\u0442\u0441\u044F \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435 \u0432 \u043A\u043E\u043D\u0442\u0440\u043E\u043B\u0435 "\u0417\u0430\u043F\u0438\u0441\u0438 \u0441\u043F\u0440\u0430\u0432\u043E\u0447\u043D\u0438\u043A\u0430 \u0441\u043E\u0442\u0440\u0443\u0434\u043D\u0438\u043A\u043E\u0432" \u0441 \u0440\u0435\u0436\u0438\u043C\u043E\u043C \u0440\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u044F \u043F\u043E \u043C\u0435\u0441\u0442\u0443.'
          },
          {
            id: uid(),
            label: "WebC-11130",
            text: "\u041D\u0435 \u0440\u0430\u0431\u043E\u0442\u0430\u044E\u0442 \u0443\u0441\u043B\u043E\u0432\u0438\u044F \u0432\u044B\u0431\u043E\u0440\u0430 \u043F\u043E \u0432\u0438\u0434\u0443 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438 \u0432 \u0434\u0438\u0430\u043B\u043E\u0433\u0435 \u0434\u0435\u043B\u0435\u0433\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u044F."
          },
          {
            id: uid(),
            label: "WebC-11022",
            text: "\u041A\u043E\u043D\u0442\u0440\u043E\u043B \u0412\u044B\u0431\u043E\u0440 \u043F\u0430\u043F\u043A\u0438. \u041D\u0435\u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u0430\u044F \u0440\u0430\u0431\u043E\u0442\u0430 \u043A\u043E\u043D\u0442\u0440\u043E\u043B\u0430."
          },
          {
            id: uid(),
            label: "WebC-11046",
            text: '\u0415\u0441\u043B\u0438 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0443 \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u0430 \u043F\u043E\u0434\u043F\u0438\u0441\u0430\u0442\u044C \u043F\u0440\u043E\u0441\u0442\u043E\u0439 \u043F\u043E\u0434\u043F\u0438\u0441\u044C\u044E, \u0442\u043E \u0443 \u043F\u043E\u0434\u043F\u0438\u0441\u0438 \u0434\u043E\u0431\u0430\u0432\u043B\u044F\u0435\u0442\u0441\u044F \u043B\u0438\u0448\u043D\u0435\u0435 \u043F\u043E\u043B\u0435 "\u0417\u0430 \u043A\u043E\u0433\u043E" \u0438 \u0444\u0430\u043C\u0438\u043B\u0438\u044F \u043F\u043E\u0434\u043F\u0438\u0441\u0430\u043D\u0442\u0430.'
          },
          {
            id: uid(),
            label: "WebC-10974",
            text: "\u0421\u043F\u0440\u0430\u0432\u043E\u0447\u043D\u0438\u043A \u0441\u043E\u0442\u0440\u0443\u0434\u043D\u0438\u043A\u043E\u0432. \u0412 \u0434\u043E\u043B\u0436\u043D\u043E\u0441\u0442\u0438 \u043E\u0442\u043E\u0431\u0440\u0430\u0436\u0430\u044E\u0442\u0441\u044F \u0441\u043E\u0442\u0440\u0443\u0434\u043D\u0438\u043A\u0438 \u0438\u0437 \u0440\u0430\u043D\u0435\u0435 \u0432\u044B\u0431\u0440\u0430\u043D\u043D\u043E\u0439 \u0434\u043E\u043B\u0436\u043D\u043E\u0441\u0442\u0438."
          }
        ]
      }
    ]
  }
];
const s = (e) => e.replace(/[-\\^$*+?.()|[\]{}]/g, "\\$&"), a = (e, i) => {
  if (!i.query || i.query instanceof String && !i.query.trim())
    return e;
  const r = ((e2) => {
    let t;
    if (e2.query instanceof RegExp)
      return new RegExp(String.raw`(${e2.query.source})`, "g" + (e2.caseSensitive ? "" : "i"));
    if (e2.splitBySpace) {
      const i2 = e2.query.trim().replace(/\s+/g, " ");
      t = String.raw`(${i2.split(/\s/).map(s).join("|")})`;
    } else
      t = String.raw`(${s(e2.query)})`;
    return new RegExp(String.raw`${t}`, "g" + (e2.caseSensitive ? "" : "i"));
  })({ query: i.query, splitBySpace: i.splitBySpace, caseSensitive: i.caseSensitive });
  return e.split(r).map((e2) => r.test(e2) ? h(i.highlightTag, { class: i.highlightClass, style: i.highlightStyle }, e2) : e2);
};
var l = defineComponent({ name: "VueWordHighlighter", props: { query: { type: [String, Object], required: true, default: "" }, caseSensitive: { type: Boolean, default: false }, splitBySpace: { type: Boolean, default: false }, highlightClass: { type: [Object, String, Array], default: "" }, highlightStyle: { type: [Object, String, Array], default: "" }, highlightTag: { type: String, default: "mark" }, wrapperTag: { type: String, default: "span" }, wrapperClass: { type: [Object, String, Array], default: "" }, textToHighlight: { type: String, default: "" } }, emits: ["matches"], setup: (i, r) => () => {
  const s2 = i.textToHighlight ? i.textToHighlight : ((t) => {
    if (t && t.default) {
      const i2 = t.default();
      let r2;
      return r2 = i2[0].children, typeof r2 == "string" ? r2 : "";
    }
    return "";
  })(r.slots), l2 = a(s2, { query: i.query, splitBySpace: i.splitBySpace, caseSensitive: i.caseSensitive, highlightTag: i.highlightTag, highlightClass: i.highlightClass, highlightStyle: i.highlightStyle });
  var g;
  return r.emit("matches", typeof (g = l2) == "string" ? [] : g.filter((e) => typeof e != "string").map((t) => typeof t == "string" ? t : t.children)), h(i.wrapperTag, { class: i.wrapperClass }, l2);
} });
const useItems = defineStore({
  id: "items",
  state: () => ({
    versions: []
  }),
  getters: {},
  actions: {
    setVersions(payload) {
      this.versions = payload;
    },
    expandBlock(version2) {
      let opened = version2.children.filter((item) => item.model);
      if (opened.length < version2.children.length / 2) {
        version2.children.map((item) => item.model = true);
      } else
        version2.children.map((item) => item.model = false);
    },
    toggleModel(item) {
      item.model = !item.model;
    },
    expandAll() {
      this.versions = this.versions.map((item) => {
        var _a;
        return {
          id: item.id,
          ver: item.ver,
          children: (_a = item.children) == null ? void 0 : _a.map((el) => {
            return {
              id: el.id,
              head: el.head,
              label: el.label,
              icon: el.icon,
              model: true,
              children: el.children
            };
          })
        };
      });
    },
    toggleMore(item) {
      item.show = !item.show;
      console.log(item);
    },
    toggleAll() {
      this.versions = this.versions.map((item) => {
        var _a;
        return {
          id: item.id,
          ver: item.ver,
          children: (_a = item.children) == null ? void 0 : _a.map((el) => {
            return {
              id: el.id,
              head: el.head,
              label: el.label,
              icon: el.icon,
              model: !el.model,
              children: el.children
            };
          })
        };
      });
    }
  }
});
var SvgIcon_vue_vue_type_style_index_0_lang = "";
var _export_sfc = (sfc, props) => {
  const target2 = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target2[key] = val;
  }
  return target2;
};
const _sfc_main$2 = defineComponent({
  name: "SvgIcon",
  props: {
    prefix: {
      type: String,
      default: "icon"
    },
    name: {
      type: String,
      required: true
    },
    color: {
      type: String,
      default: "#333"
    },
    spin: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const symbolId = computed(() => `#${props.prefix}-${props.name}`);
    return { symbolId };
  }
});
const _hoisted_1$1 = {
  "aria-hidden": "true",
  class: "q-icon"
};
const _hoisted_2$1 = ["href", "fill"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("svg", _hoisted_1$1, [
    createBaseVNode("use", {
      href: _ctx.symbolId,
      fill: _ctx.color
    }, null, 8, _hoisted_2$1)
  ]);
}
var SvgIcon = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render]]);
var Version_vue_vue_type_style_index_0_scoped_true_lang = "";
const _withScopeId = (n) => (pushScopeId("data-v-36c8277c"), n = n(), popScopeId(), n);
const _hoisted_1 = { class: "grid" };
const _hoisted_2 = { class: "left" };
const _hoisted_3 = {
  key: 0,
  class: "notfound"
};
const _hoisted_4 = ["id"];
const _hoisted_5 = { class: "row items-center" };
const _hoisted_6 = { class: "row items-center q-pr-sm" };
const _hoisted_7 = {
  key: 0,
  class: "date q-mr-lg"
};
const _hoisted_8 = /* @__PURE__ */ createTextVNode("Shif-Click - \u0440\u0430\u0441\u043F\u0430\u0445\u043D\u0443\u0442\u044C \u0432\u0441\u0435");
const _hoisted_9 = { class: "smallgrid" };
const _hoisted_10 = { class: "label" };
const _hoisted_11 = { class: "text" };
const _hoisted_12 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("br", null, null, -1));
const _hoisted_13 = ["id"];
const _hoisted_14 = ["innerHTML"];
const _hoisted_15 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("div", null, "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras sed accumsan ligula, vitae feugiat nibh. Cras auctor iaculis feugiat. Mauris est tortor, dignissim eu ipsum at, dapibus condimentum neque. Fusce posuere bibendum maximus.", -1));
const _hoisted_16 = { class: "side" };
const _hoisted_17 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("br", null, null, -1));
const _hoisted_18 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("div", { class: "sod" }, "\u0421\u043E\u0434\u0435\u0440\u0436\u0430\u043D\u0438\u0435", -1));
const _hoisted_19 = { class: "mylist" };
const _hoisted_20 = ["onClick"];
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  name: "Version",
  setup(__props) {
    const inView = ref([]);
    const add2 = (e) => {
      remove2(e);
      inView.value.push(e);
    };
    const remove2 = (e) => {
      let index2;
      while ((index2 = inView.value.indexOf(e)) > -1) {
        inView.value.splice(index2, 1);
      }
    };
    const intersection = (entry) => {
      if (entry.isIntersecting === true) {
        add2(entry.target.id);
      } else {
        remove2(entry.target.id);
      }
    };
    const intersectionObject = {
      handler: intersection,
      cfg: {
        rootMargin: "-120px"
      }
    };
    const myitems = useItems();
    myitems.setVersions(versions);
    const { getScrollTarget: getScrollTarget2, setVerticalScrollPosition: setVerticalScrollPosition2 } = scroll;
    const filter = ref("");
    const handleScroll = (e) => {
      const ele = document.getElementById(e);
      const target2 = getScrollTarget2(ele);
      const offset = ele.offsetTop - 75;
      const duration = 300;
      setVerticalScrollPosition2(target2, offset, duration);
    };
    const filterByLabel = (array, searchTerm) => {
      return array.reduce((prev, curr) => {
        var _a, _b;
        const children = curr.children ? filterByLabel(curr.children, searchTerm) : void 0;
        return ((_a = curr.label) == null ? void 0 : _a.toLowerCase().includes(searchTerm.toLowerCase())) || ((_b = curr.text) == null ? void 0 : _b.toLowerCase().includes(searchTerm.toLowerCase())) || (children == null ? void 0 : children.length) > 0 ? [...prev, __spreadProps(__spreadValues({}, curr), { children })] : prev;
      }, []);
    };
    const filtered = computed(() => {
      if (filter.value !== "") {
        return filterByLabel(myitems.versions, filter.value);
      }
      return myitems.versions;
    });
    watchEffect(() => {
      if (filter.value.length > 1) {
        myitems.expandAll();
      }
    });
    const handleClick = (e, version2) => {
      if (e.shiftKey) {
        myitems.toggleAll();
      } else
        myitems.expandBlock(version2);
    };
    const setId = (id, label) => {
      return id + label;
    };
    const more = (id, label) => {
      let el = document.getElementById(id + label);
      el == null ? void 0 : el.classList.toggle("hid");
    };
    const calcClass = (e) => {
      if (inView.value.some((el) => el === e)) {
        return "visib";
      } else
        return "";
    };
    const showIcon = (icon) => {
      return "img:/_/img/" + icon + ".svg";
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createBaseVNode("div", _hoisted_2, [
          unref(filtered).length === 0 ? (openBlock(), createElementBlock("div", _hoisted_3, "\u041D\u0438\u0447\u0435\u0433\u043E \u043D\u0435\u0442. \u041F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u0438\u0437\u043C\u0435\u043D\u0438\u0442\u044C \u0437\u0430\u043F\u0440\u043E\u0441.")) : (openBlock(true), createElementBlock(Fragment, { key: 1 }, renderList(unref(filtered), (version2, index2) => {
            return openBlock(), createElementBlock(Fragment, {
              key: version2.id
            }, [
              createBaseVNode("div", {
                class: "version",
                id: version2.ver
              }, [
                createBaseVNode("div", _hoisted_5, [
                  index2 !== 0 ? (openBlock(), createBlock(QBtn, {
                    key: 0,
                    class: "q-mr-md",
                    dense: "",
                    unelevated: "",
                    color: "accent"
                  }, {
                    default: withCtx(() => [
                      createVNode(SvgIcon, {
                        name: "source-branch",
                        color: "white"
                      })
                    ]),
                    _: 1
                  })) : createCommentVNode("", true),
                  createBaseVNode("div", {
                    class: normalizeClass({ link: index2 !== 0 })
                  }, toDisplayString(version2.ver), 3)
                ]),
                createBaseVNode("div", _hoisted_6, [
                  index2 !== 0 ? (openBlock(), createElementBlock("div", _hoisted_7, "23.07.2022")) : createCommentVNode("", true),
                  filter.value.length < 1 ? (openBlock(), createBlock(QBtn, {
                    key: 1,
                    dense: "",
                    flat: "",
                    round: "",
                    color: "accent",
                    onClick: ($event) => handleClick($event, version2)
                  }, {
                    default: withCtx(() => [
                      createVNode(QTooltip, {
                        anchor: "top middle",
                        self: "bottom middle"
                      }, {
                        default: withCtx(() => [
                          _hoisted_8
                        ]),
                        _: 1
                      }),
                      createVNode(SvgIcon, { name: "unfold-more-horizontal" })
                    ]),
                    _: 2
                  }, 1032, ["onClick"])) : createCommentVNode("", true)
                ])
              ], 8, _hoisted_4),
              withDirectives((openBlock(), createBlock(QList, {
                id: version2.ver
              }, {
                default: withCtx(() => [
                  (openBlock(true), createElementBlock(Fragment, null, renderList(version2.children, (item) => {
                    return openBlock(), createBlock(QExpansionItem, {
                      key: item.id,
                      label: item.head,
                      "header-class": "hd",
                      icon: showIcon(item.icon),
                      "expand-separator": "",
                      "expand-icon": "img:/_/img/chevron-down.svg",
                      "model-value": item.model,
                      onClick: ($event) => unref(myitems).toggleModel(item)
                    }, {
                      default: withCtx(() => [
                        (openBlock(true), createElementBlock(Fragment, null, renderList(item.children, (el) => {
                          return openBlock(), createBlock(QCardSection, {
                            key: el.label
                          }, {
                            default: withCtx(() => [
                              createBaseVNode("div", _hoisted_9, [
                                createBaseVNode("div", _hoisted_10, [
                                  (openBlock(), createBlock(resolveDynamicComponent(unref(l)), { query: filter.value }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(el.label), 1)
                                    ]),
                                    _: 2
                                  }, 1032, ["query"]))
                                ]),
                                createBaseVNode("div", _hoisted_11, [
                                  (openBlock(), createBlock(resolveDynamicComponent(unref(l)), { query: filter.value }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(el.text), 1)
                                    ]),
                                    _: 2
                                  }, 1032, ["query"])),
                                  _hoisted_12,
                                  el.more ? (openBlock(), createBlock(QBtn, {
                                    key: 0,
                                    unelevated: "",
                                    color: "accent",
                                    label: "\u0415\u0449\u0435",
                                    size: "xs",
                                    onClick: ($event) => more(item.id, el.label)
                                  }, null, 8, ["onClick"])) : createCommentVNode("", true)
                                ])
                              ]),
                              el.more ? (openBlock(), createElementBlock("div", {
                                key: 0,
                                class: "more hid",
                                id: setId(item.id, el.label)
                              }, [
                                createBaseVNode("div", {
                                  innerHTML: el.more
                                }, null, 8, _hoisted_14),
                                _hoisted_15
                              ], 8, _hoisted_13)) : createCommentVNode("", true)
                            ]),
                            _: 2
                          }, 1024);
                        }), 128))
                      ]),
                      _: 2
                    }, 1032, ["label", "icon", "model-value", "onClick"]);
                  }), 128))
                ]),
                _: 2
              }, 1032, ["id"])), [
                [Intersection, intersectionObject]
              ])
            ], 64);
          }), 128))
        ]),
        createBaseVNode("div", _hoisted_16, [
          createVNode(QInput, {
            dense: "",
            debounce: "300",
            placeholder: "\u0424\u0438\u043B\u044C\u0442\u0440",
            autofocus: "",
            color: "primary",
            modelValue: filter.value,
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => filter.value = $event),
            clearable: "",
            "clear-icon": "img:/_/img/close-circle-outline.svg",
            onClear: _cache[1] || (_cache[1] = ($event) => filter.value = "")
          }, {
            prepend: withCtx(() => [
              createVNode(SvgIcon, {
                class: "magnify",
                name: "magnify"
              })
            ]),
            _: 1
          }, 8, ["modelValue"]),
          _hoisted_17,
          _hoisted_18,
          createBaseVNode("div", _hoisted_19, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(unref(filtered), (item) => {
              return openBlock(), createElementBlock("div", {
                class: normalizeClass(["empt", calcClass(item.ver)]),
                onClick: ($event) => handleScroll(item.ver),
                key: item.ver
              }, toDisplayString(item.ver), 11, _hoisted_20);
            }), 128))
          ])
        ])
      ]);
    };
  }
});
var Version = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-36c8277c"]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  name: "App",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createBlock(Version);
    };
  }
});
const pinia = createPinia();
const app = createApp(_sfc_main);
app.use(Quasar, {
  plugins: {},
  supportTS: {
    tsCheckerConfig: {
      eslint: {
        enabled: true,
        files: "./src/**/*.{ts,tsx,js,jsx,vue}"
      }
    }
  }
});
app.use(pinia);
app.mount("#app");
