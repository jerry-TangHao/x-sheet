import { Compile, Instruct } from './Compiler';
import { SheetUtils } from '../utils/SheetUtils';

/**
 * Formula
 */
class Formula {

  /**
   * Formula
   * @param expr
   */
  constructor({
    expr = SheetUtils.EMPTY,
  } = {}) {
    this.expr = expr;
    this.content = SheetUtils.Nul;
    this.instruct = SheetUtils.Nul;
  }

  /**
   * 计算公式
   * @return {string}
   */
  getValue() {
    let { expr } = this;
    let { content } = this;
    let { instruct } = this;
    if (!content) {
      if (!instruct) {
        instruct = Compile(expr);
      }
      content = Instruct(instruct);
    }
    this.content = content;
    this.instruct = instruct;
    return content;
  }

  /**
   * 有效的表达式
   * @return {boolean}
   */
  hasExpr() {
    let { expr } = this;
    return !SheetUtils.isBlank(expr);
  }

  /**
   * 获取表达式
   * @return {string}
   */
  getExpr() {
    return this.expr;
  }

  /**
   * 设置表达式
   * @param expr
   */
  setExpr(expr) {
    this.expr = expr;
    this.content = SheetUtils.Nul;
    this.instruct = SheetUtils.Nul;
  }

}

export {
  Formula,
};
