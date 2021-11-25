/* global navigator document window self */
function S4() {
  // eslint-disable-next-line no-bitwise
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

const alphabets = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

const DATA_TYPE = {
  String: 1,
  Boolean: 2,
  Number: 3,
  Object: 4,
  Array: 5,
  Function: 6,
  Null: 7,
  Undefined: 8,
  Promise: 9,
  GeneratorFunction: 10,
  AsyncFunction: 11,
  BigInt: 12,
  Symbol: 13,
  DedicatedWorkerGlobalScope: 14,
  Date: 15,
  RegExp: 16,
  Un: 0,
};

class SheetUtils {

  static isWindows() {
    return /windows|win32/i.test(navigator.userAgent);
  }

  static isMac() {
    return /macintosh|mac os x/i.test(navigator.userAgent);
  }

  static isNotEmptyObject(object) {
    return !SheetUtils.isEmptyObject(object);
  }

  static isEmptyObject(object) {
    // eslint-disable-next-line no-restricted-syntax
    for (const key in object) {
      // eslint-disable-next-line no-prototype-builtins
      if (object.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  }

  static isUnDef(e) {
    return e === undefined || e === null;
  }

  static isDef(e) {
    return !this.isUnDef(e);
  }

  static isNumber(e) {
    return /^(-?\d+.\d+)$|^(-?\d+)$/.test(e);
  }

  static isFraction(e) {
    return /^\d+\/\d+$/.test(e);
  }

  static isDate(e) {
    return SheetUtils.type(e) === DATA_TYPE.Date;
  }

  static isFunction(e) {
    const type = SheetUtils.type(e);
    return type === DATA_TYPE.Function;
  }

  static isArray(e) {
    return SheetUtils.type(e) === DATA_TYPE.Array;
  }

  static isObject(e) {
    return SheetUtils.type(e) === DATA_TYPE.Object;
  }

  static isRegExp(e) {
    return SheetUtils.type(e) === DATA_TYPE.EX;
  }

  static isLikeArray(e) {
    if (SheetUtils.isUnDef(e)) {
      return false;
    }
    return typeof e.length === 'number';
  }

  static isBlank(s) {
    if (SheetUtils.isUnDef(s)) {
      return true;
    }
    return s.toString().trim() === '';
  }

  static isPlainObject(obj) {
    if (SheetUtils.isUnDef(obj)) {
      return false;
    }
    return Object.getPrototypeOf(obj) === Object.getPrototypeOf({});
  }

  static isString(obj) {
    return SheetUtils.type(obj) === DATA_TYPE.String;
  }

  static isChildType(obj, parent) {
    return obj instanceof parent;
  }

  static toLowCase(str) {
    return str.toLowerCase();
  }

  static type(arg) {
    const type = Object.prototype.toString.call(arg);
    switch (type) {
      case '[object Null]':
        return DATA_TYPE.Null;
      case '[object Object]':
        return DATA_TYPE.Object;
      case '[object Undefined]':
        return DATA_TYPE.Undefined;
      case '[object String]':
        return DATA_TYPE.String;
      case '[object Boolean]':
        return DATA_TYPE.Boolean;
      case '[object Number]':
        return DATA_TYPE.Number;
      case '[object Function]':
        return DATA_TYPE.Function;
      case '[object Array]':
        return DATA_TYPE.Array;
      case '[object Promise]':
        return DATA_TYPE.Promise;
      case '[object GeneratorFunction]':
        return DATA_TYPE.GeneratorFunction;
      case '[object AsyncFunction]':
        return DATA_TYPE.AsyncFunction;
      case '[object BigInt]':
        return DATA_TYPE.BigInt;
      case '[object Symbol]':
        return DATA_TYPE.Symbol;
      case '[object Date]':
        return DATA_TYPE.Date;
      case '[object DedicatedWorkerGlobalScope]':
        return DATA_TYPE.DedicatedWorkerGlobalScope;
      default:
        return DATA_TYPE.Un;
    }
  }

  static copy(object = {}, ...sources) {
    if (SheetUtils.isUnDef(object)) {
      return {};
    }
    if (SheetUtils.isUnDef(sources) || sources.length === 0) {
      return object;
    }
    sources.forEach((source) => {
      if (SheetUtils.isUnDef(source)) return;
      Object.keys(source).forEach((key) => {
        const v = source[key];
        if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') {
          object[key] = v;
        } else if (typeof v !== 'function' && !Array.isArray(v) && SheetUtils.isPlainObject(v)) {
          object[key] = object[key] || {};
          SheetUtils.copy(object[key], v);
        } else {
          object[key] = v;
        }
      });
    });
    return object;
  }

  static cloneDeep(object) {
    const json = JSON.stringify(object);
    return JSON.parse(json);
  }

  static extends(target, ...src) {
    for (let i = 0, len = src.length; i < len; i++) {
      const item = src[i];
      for (let key in item) {
        if (item.hasOwnProperty(key)) {
          const value = item[key];
          if (SheetUtils.isDef(value)) {
            target[key] = value;
          }
        }
      }
    }
    return target;
  }

  static sum(objOrAry, cb = value => value) {
    let total = 0;
    let size = 0;
    Object.keys(objOrAry).forEach((key) => {
      total += cb(objOrAry[key], key);
      size += 1;
    });
    return [total, size];
  }

  static parseFloat(val) {
    if (SheetUtils.isNumber(val)) return parseFloat(val);
    return 0;
  }

  static parseInt(val) {
    if (SheetUtils.isNumber(val)) return parseInt(val, 10);
    return 0;
  }

  static stringAt(index) {
    let str = '';
    let idx = index;
    while (idx >= alphabets.length) {
      idx /= alphabets.length;
      idx -= 1;
      str += alphabets[parseInt(idx, 10) % alphabets.length];
    }
    const last = index % alphabets.length;
    str += alphabets[last];
    return str;
  }

  static indexAt(str) {
    let ret = 0;
    for (let i = 0; i < str.length - 1; i += 1) {
      const idx = str.charCodeAt(i) - 65;
      const expoNet = str.length - 1 - i;
      ret += (alphabets.length ** expoNet) + (alphabets.length * idx);
    }
    ret += str.charCodeAt(str.length - 1) - 65;
    return ret;
  }

  static expr2xy(src) {
    let x = '';
    let y = '';
    for (let i = 0; i < src.length; i += 1) {
      if (src.charAt(i) >= '0' && src.charAt(i) <= '9') {
        y += src.charAt(i);
      } else {
        x += src.charAt(i);
      }
    }
    return [SheetUtils.indexAt(x), parseInt(y, 10) - 1];
  }

  static xy2expr(x, y) {
    return `${SheetUtils.stringAt(x)}${y + 1}`;
  }

  static expr2expr(src, xn, yn) {
    const [x, y] = SheetUtils.expr2xy(src);
    return SheetUtils.xy2expr(x + xn, y + yn);
  }

  static minIf(v, min) {
    if (v < min) return min;
    return v;
  }

  static keepLastIndex(obj) {
    const range = window.getSelection();
    range.selectAllChildren(obj);
    range.collapseToEnd();
  }

  static trim(s) {
    if (this.isBlank(s)) return '';
    return s.trim();
  }

  static now() {
    return Date.now().toString();
  }

  static viewPort() {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }

  static exitFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }

  static fullScreen(element) {
    if (element.el) {
      element = element.el;
    }
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    }
  }

  static isFull() {
    return !!(document.webkitIsFullScreen || document.mozFullScreen
      || document.msFullscreenElement || document.fullscreenElement);
  }

  static uuid() {
    return (`${S4() + S4()}${S4()}${S4()}${S4()}${S4()}${S4()}${S4()}`);
  }

  static equals(one, tow) {
    function diffValue(oneValue, towValue) {
      const oneType = SheetUtils.type(oneValue);
      const towType = SheetUtils.type(towValue);
      if (oneType !== towType) {
        return false;
      }
      if (SheetUtils.isArray(oneValue)) {
        return diffArrays(oneValue, towValue);
      }
      if (SheetUtils.isObject(oneValue)) {
        return diffObject(oneValue, towValue);
      }
      if (SheetUtils.isDate(oneValue)) {
        return oneValue.getTime() === towValue.getTime();
      }
      if (SheetUtils.isRegExp(oneValue)) {
        return oneValue.toString() === towValue.toString();
      }
      return oneValue === towValue;
    }
    function diffArrays(one, tow) {
      if (one.length !== tow.length) {
        return false;
      }
      for (let i = 0, len = one.length; i < len; i++) {
        const oneValue = one[i];
        const towValue = tow[i];
        if (!diffValue(oneValue, towValue)) {
          return false;
        }
      }
      return true;
    }
    function diffObject(one, tow) {
      const oneKeys = Object.keys(one);
      const towKeys = Object.keys(tow);
      if (oneKeys.length !== towKeys.length) {
        return false;
      }
      for (const key of oneKeys) {
        if (!towKeys.includes(key)) {
          return false;
        }
        const oneValue = one[key];
        const towValue = tow[key];
        if (!diffValue(oneValue, towValue)) {
          return false;
        }
      }
      return true;
    }
    return diffValue(one, tow);
  }

  static toFixed(num, fixed) {
    if (num.toString().indexOf('.') > -1) {
      return num.toFixed(fixed);
    }
    return num;
  }

  static getExplorerInfo() {
    const explorer = window.navigator.userAgent.toLowerCase();
    // firefox
    if (explorer.indexOf('firefox') >= 0) {
      const ver = explorer.match(/firefox\/([\d.]+)/)[1];
      return { type: 'Firefox', version: ver };
    }
    // Chrome
    if (explorer.indexOf('chrome') >= 0) {
      const ver = explorer.match(/chrome\/([\d.]+)/)[1];
      return { type: 'Chrome', version: ver };
    }
    // Opera
    if (explorer.indexOf('opera') >= 0) {
      const ver = explorer.match(/opera.([\d.]+)/)[1];
      return { type: 'Opera', version: ver };
    }
    // Safari
    if (explorer.indexOf('safari') >= 0) {
      const ver = explorer.match(/version\/([\d.]+)/)[1];
      return { type: 'Safari', version: ver };
    }
    // ie
    if (explorer.indexOf('msie') >= 0) {
      const ver = explorer.match(/msie ([\d.]+)/)[1];
      return { type: 'IE', version: ver };
    }
    // undefined
    return undefined;
  }

  static arrayLast(array) {
    return array[array.length - 1];
  }

  static arrayHead(array) {
    return array[0];
  }

  static blankClear(value) {
    if (SheetUtils.isString(value)) {
      return value.replace(/\s*/g, SheetUtils.EMPTY);
    }
    return value;
  }

  static safeValue(value, defaultValue = '') {
    return SheetUtils.isUnDef(value) ? defaultValue : value;
  }

  static inWorker() {
    // eslint-disable-next-line no-restricted-globals
    const type = SheetUtils.type(self);
    return type === DATA_TYPE.DedicatedWorkerGlobalScope;
  }

  static if(condition, establish, otherwise) {
    return condition ? establish() : otherwise();
  }

  static slice(likeArray) {
    return Array.prototype.slice.call(likeArray);
  }

  static clearBlank(str) {
    return str ? str.replace(/\s/g, '') : str;
  }

  static clearHideCode(str) {
    let result = '';
    for (let i = 0; i < str.length; i++) {
      let value = str.charAt(i);
      // 过滤掉 &#xFEFF; 隐藏字符串
      // 服了 ！！！！！
      let code = encodeURI(value);
      if (code !== '%EF%BB%BF') {
        result += value;
      }
    }
    return result;
  }

}

SheetUtils.EMPTY = '';
SheetUtils.Nul = null;
SheetUtils.Undef = undefined;
SheetUtils.noop = () => {};
SheetUtils.DATA_TYPE = DATA_TYPE;

export {
  SheetUtils,
};
