import { SheetUtils } from '../../../utils/SheetUtils';

class RectRange {

  /**
   * RectRange
   * @param {int} sri 起始行
   * @param {int} sci 起始列
   * @param {int} eri 结束行
   * @param {int} eci 结束列
   * @param {int} w 宽度
   * @param {int} h 高度
   */
  constructor(sri, sci, eri, eci, w = 0, h = 0) {
    this.sri = sri;
    this.sci = sci;
    this.eri = eri;
    this.eci = eci;
    this.w = w;
    this.h = h;
  }

  /**
   * 循环过滤指定的行列
   * @param {XIteratorBuilder} iteratorBuilder 迭代器
   * @param {Function} cb 回调函数
   * @param {Function} rowFilter 过滤使用的回调函数
   */
  each(iteratorBuilder, cb, rowFilter = () => true) {
    const {
      sri, sci, eri, eci,
    } = this;
    let ret = false;
    iteratorBuilder.getRowIterator()
      .setBegin(sri)
      .setEnd(eri)
      .setLoop((i) => {
        if (rowFilter(i)) {
          iteratorBuilder.getColIterator()
            .setBegin(sci)
            .setEnd(eci)
            .setLoop((j) => {
              ret = cb(i, j);
              return ret;
            })
            .execute();
        }
        return ret;
      })
      .execute();
  }

  /**
   * 设置区域
   * @param {int} sri 起始行
   * @param {int} sci 起始列
   * @param {int} eri 结束行
   * @param {int} eci 结束列
   */
  set(sri, sci, eri, eci) {
    this.sri = sri;
    this.sci = sci;
    this.eri = eri;
    this.eci = eci;
  }

  /**
   * 判断是否跨多个单元格
   * @returns {boolean}
   */
  multiple() {
    return this.eri - this.sri > 0 || this.eci - this.sci > 0;
  }

  /**
   * 判断当前的区域是否包含指定的行和列
   * 参数支持 ri, ci 和 A10 两种形式
   * @param {[int, int] | String} args 行索引,列索引 或者 字符串
   * @returns {boolean}
   */
  includes(...args) {
    let [ri, ci] = [0, 0];
    if (args.length === 1) {
      [ci, ri] = SheetUtils.expr2xy(args[0]);
    } else if (args.length === 2) {
      [ri, ci] = args;
    }
    const {
      sri, sci, eri, eci,
    } = this;
    return sri <= ri && ri <= eri && sci <= ci && ci <= eci;
  }

  /**
   * 判断当前的区域是否包含指定的区域
   * @param {RectRange} other 区域
   * @returns {boolean}
   */
  contains(other) {
    return this.sri <= other.sri
      && this.sci <= other.sci
      && this.eri >= other.eri
      && this.eci >= other.eci;
  }

  /**
   * 判断当前的区域是否被指定的区域包含
   * @param {RectRange} other 区域
   * @returns {boolean}
   */
  within(other) {
    return this.sri >= other.sri
      && this.sci >= other.sci
      && this.eri <= other.eri
      && this.eci <= other.eci;
  }

  /**
   * 判断当前的区域和指定的区域不发生重合
   * @param {RectRange} other 区域
   * @returns {boolean}
   */
  disjoint(other) {
    return this.sri > other.eri
      || this.sci > other.eci
      || other.sri > this.eri
      || other.sci > this.eci;
  }

  /**
   * 判断当前的区域和指定的区域发生重合
   * @param {RectRange} other 区域
   * @returns {boolean}
   */
  intersects(other) {
    return this.sri <= other.eri
      && this.sci <= other.eci
      && other.sri <= this.eri
      && other.sci <= this.eci;
  }

  /**
   * 返回当前区域和指定区域合并后的新区域
   * @param {RectRange} other 区域
   * @returns {RectRange}
   */
  union(other) {
    const {
      sri, sci, eri, eci,
    } = this;
    return new RectRange(
      other.sri < sri ? other.sri : sri,
      other.sci < sci ? other.sci : sci,
      other.eri > eri ? other.eri : eri,
      other.eci > eci ? other.eci : eci,
    );
  }

  /**
   * 返回当前区域和指定区域合重合的新区域
   * @param {RectRange} other
   * @returns {RectRange}
   */
  coincide(other) {
    const {
      sri, sci, eri, eci,
    } = this;
    if (this.disjoint(other)) {
      return RectRange.EMPTY;
    }
    return new RectRange(
      other.sri > sri ? other.sri : sri,
      other.sci > sci ? other.sci : sci,
      other.eri < eri ? other.eri : eri,
      other.eci < eci ? other.eci : eci,
    );
  }

  /**
   * 当前区域和指定区域重合
   * 返回当前区域和指定区域不重合的部分
   * @param {RectRange} other 区域
   * @returns {Array}
   */
  coincideDifference(other) {
    if (this.coincide(other).equals(RectRange.EMPTY)) {
      return [];
    }
    return this.difference(other);
  }

  /**
   * 返回当前区域和指定区域不重合的部分
   * @param {RectRange} other 区域
   * @returns {Array}
   */
  difference(other) {
    const ret = [];
    const addRet = (sri, sci, eri, eci) => {
      ret.push(new RectRange(sri, sci, eri, eci));
    };
    const {
      sri, sci, eri, eci,
    } = this;
    const dsr = other.sri - sri;
    const dsc = other.sci - sci;
    const der = eri - other.eri;
    const dec = eci - other.eci;
    if (dsr > 0) {
      addRet(sri, sci, other.sri - 1, eci);
      if (der > 0) {
        addRet(other.eri + 1, sci, eri, eci);
        if (dsc > 0) {
          addRet(other.sri, sci, other.eri, other.sci - 1);
        }
        if (dec > 0) {
          addRet(other.sri, other.eci + 1, other.eri, eci);
        }
      } else {
        if (dsc > 0) {
          addRet(other.sri, sci, eri, other.sci - 1);
        }
        if (dec > 0) {
          addRet(other.sri, other.eci + 1, eri, eci);
        }
      }
    } else if (der > 0) {
      addRet(other.eri + 1, sci, eri, eci);
      if (dsc > 0) {
        addRet(sri, sci, other.eri, other.sci - 1);
      }
      if (dec > 0) {
        addRet(sri, other.eci + 1, other.eri, eci);
      }
    }
    if (dsc > 0) {
      addRet(sri, sci, eri, other.sci - 1);
      if (dec > 0) {
        addRet(sri, other.eri + 1, eri, eci);
        if (dsr > 0) {
          addRet(sri, other.sci, other.sri - 1, other.eci);
        }
        if (der > 0) {
          addRet(other.sri + 1, other.sci, eri, other.eci);
        }
      } else {
        if (dsr > 0) {
          addRet(sri, other.sci, other.sri - 1, eci);
        }
        if (der > 0) {
          addRet(other.sri + 1, other.sci, eri, eci);
        }
      }
    } else if (dec > 0) {
      addRet(sri, other.eci + 1, eri, eci);
      if (dsr > 0) {
        addRet(sri, sci, other.sri - 1, other.eci);
      }
      if (der > 0) {
        addRet(other.eri + 1, sci, eri, other.eci);
      }
    }
    return ret;
  }

  /**
   * 当前区域跨的行列数
   * @returns {number[]}
   */
  size() {
    return [
      this.eri - this.sri + 1,
      this.eci - this.sci + 1,
    ];
  }

  /**
   * 返回边缘区域
   * @returns {{top: RectRange, left: RectRange, bottom: RectRange, right: RectRange}}
   */
  brink() {
    const { sri, eri, sci, eci } = this;
    const top = new RectRange(sri, sci, sri, eci);
    const bottom = new RectRange(eri, sci, eri, eci);
    const right = new RectRange(sri, eci, eri, eci);
    const left = new RectRange(sri, sci, eri, sci);
    return { top, right, bottom, left };
  }

  /**
   * 方位点
   * @returns {{rb: RectRange, rt: RectRange, lb: RectRange, lt: RectRange}}
   */
  point() {
    const { sri, eri, sci, eci } = this;
    const lt = new RectRange(sri, sci, sri, sci);
    const rt = new RectRange(sri, eci, sri, eci);
    const lb = new RectRange(eri, sci, eri, sci);
    const rb = new RectRange(eri, eci, eri, eci);
    return { lt, rt, lb, rb };
  }

  /**
   * equals
   * @param {RectRange} other 区域
   * @returns {boolean}
   */
  equals(other) {
    return this.eri === other.eri
      && this.eci === other.eci
      && this.sri === other.sri
      && this.sci === other.sci;
  }

  /**
   * 克隆
   * @returns {RectRange}
   */
  clone() {
    const {
      sri, sci, eri, eci, w, h,
    } = this;
    return new RectRange(sri, sci, eri, eci, w, h);
  }

  toString() {
    const {
      sri, sci, eri, eci,
    } = this;
    let ref = SheetUtils.xy2expr(sci, sri);
    if (this.multiple()) {
      ref = `${ref}:${SheetUtils.xy2expr(eci, eri)}`;
    }
    return ref;
  }

  /**
   * 将 B1:B8 或者 B1 参数转换成新的区域
   * @param {String} ref 行列字符串
   * @returns {RectRange}
   */
  static valueOf(ref) {
    const refs = ref.split(':');
    const [sci, sri] = SheetUtils.expr2xy(refs[0]);
    let [eri, eci] = [sri, sci];
    if (refs.length > 1) {
      [eci, eri] = SheetUtils.expr2xy(refs[1]);
    }
    return new RectRange(sri, sci, eri, eci);
  }
}

RectRange.EMPTY = new RectRange(-1, -1, -1, -1);

export { RectRange };
