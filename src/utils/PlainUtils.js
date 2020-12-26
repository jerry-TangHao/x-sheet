/* global navigator document window */

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
  Un: 14,
};

class PlainUtils {

  static isWindows() {
    return /windows|win32/i.test(navigator.userAgent);
  }

  static isMac() {
    return /macintosh|mac os x/i.test(navigator.userAgent);
  }

  static isNotEmptyObject(object) {
    return !PlainUtils.isEmptyObject(object);
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

  static isNotUnDef(e) {
    return !this.isUnDef(e);
  }

  static isNumber(e) {
    return /^(-?\d+.\d+)$|^(-?\d+)$/.test(e);
  }

  static isFraction(e) {
    return /^\d+\/\d+$/.test(e);
  }

  static isFunction(e) {
    const type = PlainUtils.type(e);
    return type === DATA_TYPE.Function;
  }

  static isArray(e) {
    return PlainUtils.type(e) === DATA_TYPE.Array;
  }

  static isBlank(s) {
    if (PlainUtils.isUnDef(s)) {
      return true;
    }
    return s.toString().trim() === '';
  }

  static isPlainObject(obj) {
    if (PlainUtils.isUnDef(obj)) {
      return false;
    }
    return Object.getPrototypeOf(obj) === Object.getPrototypeOf({});
  }

  static isString(obj) {
    return PlainUtils.type(obj) === DATA_TYPE.String;
  }

  static isChildType(obj, parent) {
    return obj instanceof parent;
  }

  static mergeDeep(object = {}, ...sources) {
    if (PlainUtils.isUnDef(object)) {
      return {};
    }
    if (PlainUtils.isUnDef(sources) || sources.length === 0) {
      return object;
    }
    sources.forEach((source) => {
      if (PlainUtils.isUnDef(source)) return;
      Object.keys(source).forEach((key) => {
        const v = source[key];
        if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') {
          object[key] = v;
        } else if (typeof v !== 'function' && !Array.isArray(v) && PlainUtils.isPlainObject(v)) {
          object[key] = object[key] || {};
          PlainUtils.mergeDeep(object[key], v);
        } else {
          object[key] = v;
        }
      });
    });
    return object;
  }

  static toLowCase(str) {
    return str.toLowerCase();
  }

  static type(arg) {
    const type = Object.prototype.toString.call(arg);
    switch (type) {
      case '[object Null]':
        return DATA_TYPE.Null;
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
      default:
        return DATA_TYPE.Un;
    }
  }

  static cloneDeep(object) {
    const json = JSON.stringify(object);
    return JSON.parse(json);
  }

  static copyProp(t, s) {
    return Object.assign(t, s);
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
    if (PlainUtils.isNumber(val)) return parseFloat(val);
    return 0;
  }

  static parseInt(val) {
    if (PlainUtils.isNumber(val)) return parseInt(val, 10);
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
    return [PlainUtils.indexAt(x), parseInt(y, 10) - 1];
  }

  static xy2expr(x, y) {
    return `${PlainUtils.stringAt(x)}${y + 1}`;
  }

  static expr2expr(src, xn, yn) {
    const [x, y] = PlainUtils.expr2xy(src);
    return PlainUtils.xy2expr(x + xn, y + yn);
  }

  static minIf(v, min) {
    if (v < min) return min;
    return v;
  }

  static keepLastIndex(obj) {
    if (window.getSelection) {
      obj.focus();
      const range = window.getSelection();
      range.selectAllChildren(obj);
      range.collapseToEnd();
    } else if (document.selection) {
      const range = document.selection.createRange();
      range.moveToElementText(obj);
      range.collapse(false);
      range.select();
    }
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
    if (explorer.indexOf('Safari') >= 0) {
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

}
PlainUtils.EMPTY = '';
PlainUtils.Nul = null;
PlainUtils.Undef = undefined;
PlainUtils.noop = () => {};

export {
  PlainUtils,
};
