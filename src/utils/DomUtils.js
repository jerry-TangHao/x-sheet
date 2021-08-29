import { SheetUtils } from './SheetUtils';

/**
 * DomUtils
 */
class DomUtils {

  /**
   * 像素值转数字值
   * @param value
   * @returns {*|number|number}
   */
  static pxToNumber(value) {
    value = value.replace('px', '');
    return SheetUtils.parseInt(value);
  }

  /**
   * 获取所有兄弟节点
   * @param element
   * @returns {*[]}
   */
  static prev(element) {
    let find = [];
    while (element.prev()) {
      find.push(element.prev());
      element = element.prev();
    }
    return find;
  }

  /**
   * 获取所有兄弟节点
   * @param element
   * @returns {*[]}
   */
  static next(element) {
    let find = [];
    while (element.next()) {
      find.push(element.next());
      element = element.next();
    }
    return find;
  }

  /**
   * 删除元素指定的
   * css属性包括子元素
   * @param element
   * @param key
   * @param value
   */
  static cssRemoveVal(element, key, value) {
    const nodes = element
      .cssRemoveVal(key, value)
      .children();
    nodes.forEach((item) => {
      this.cssRemoveVal(item, key, value);
    });
  }

  /**
   * 删除元素指定的
   * css属性包括子元素
   * @param element
   * @param key
   */
  static cssRemoveKeys(element, key) {
    const nodes = element
      .cssRemoveKeys(key)
      .children();
    nodes.forEach((item) => {
      this.cssRemoveKeys(item, key);
    });
  }

}

export {
  DomUtils,
};
