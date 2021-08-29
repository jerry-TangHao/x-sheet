/* global document MouseEvent CustomEvent window NodeList HTMLCollection DocumentFragment */
import { SheetUtils } from '../utils/SheetUtils';

/**
 * Element
 */
class Element {

  /**
   * 包装元素
   */
  static wrapElement(object) {
    if ([
      SheetUtils.isArray(object),
      object instanceof HTMLCollection,
      object instanceof NodeList,
    ].includes(true)) {
      let elements = [];
      for (let i = 0; i < object.length; i++) {
        const item = object[i];
        if (item instanceof Element) {
          elements.push(item);
        } else {
          elements.push(new Element(item));
        }
      }
      return elements;
    }
    return new Element(object);
  }

  static createText(text) {
    return new Element(document.createTextNode(text));
  }

  /**
   * 驼峰转连字符
   * @param value
   * @returns {string|null}
   */
  static hyphenateRE(value) {
    if (value) {
      return value.replace(/([A-Z])/g, '-$1').toLowerCase();
    }
    return null;
  }

  /**
   * Element
   * @param tag
   * @param className
   */
  constructor(tag, className = '') {
    if (typeof tag === 'string') {
      this.el = document.createElement(tag);
      if (className) {
        this.el.className = className;
      }
    } else {
      this.el = tag;
    }
    this.map = {};
  }

  /**
   * 数据绑定
   * @param key
   * @param value
   * @returns {Element|*}
   */
  data(key, value) {
    if (value !== undefined) {
      this.map[key] = value;
      return this;
    }
    return this.map[key];
  }

  /**
   * 空参数时返回子元素,
   * 有参数时插入子节点
   * @param args
   * @returns {*[]|Element}
   */
  children(...args) {
    if (arguments.length === 0) {
      return Element.wrapElement(this.el.children);
    }
    args.forEach(ele => this.append(ele));
    return this;
  }

  /**
   * 空参数时返回子节点,
   * 有参数时插入子节点
   * @param args
   * @returns {*[]|Element}
   */
  childrenNodes(...args) {
    if (arguments.length === 0) {
      return Element.wrapElement(this.el.childNodes);
    }
    args.forEach(ele => this.append(ele));
    return this;
  }

  /**
   * 将目标节点添加到当前元素中
   * @param ele
   */
  childrenNodesAppend(ele) {
    if (!this.isTextNode()) {
      ele.childrenNodes().forEach(i => this.append(i));
    }
    return this;
  }

  /**
   * 将目标节点添加到当前元素中
   * @param ele
   */
  childrenNodesPrepend(ele) {
    if (!this.isTextNode()) {
      ele.childrenNodes().forEach(i => this.prepend(i));
    }
    return this;
  }

  /**
   * 在当前元素中插入指定节点
   * @param ele
   */
  append(ele) {
    if (!this.isTextNode()) {
      if (ele && ele.el) {
        this.el.append(ele.el);
      }
    }
    return this;
  }

  /**
   * 在当前元素中插入指定节点
   * @param ele
   */
  prepend(ele) {
    if (!this.isTextNode()) {
      if (ele && ele.el) {
        this.el.prepend(ele.el);
      }
    }
    return this;
  }

  /**
   * 元素定位
   * @param value
   * @returns {{top: *, left: *, width: *, height: *}|Element}
   */
  offset(value) {
    if (value !== undefined) {
      Object.keys(value).forEach((k) => {
        this.css(k, `${value[k]}px`);
      });
      return this;
    }
    const { offsetTop, offsetLeft } = this.el;
    const { offsetHeight, offsetWidth } = this.el;
    return {
      top: offsetTop,
      left: offsetLeft,
      height: offsetHeight,
      width: offsetWidth,
    };
  }

  /**
   * 获取当前元素的父节点
   * @returns {Element}
   */
  parent() {
    return this.el.parentNode
      ? new Element(this.el.parentNode) : null;
  }

  /**
   * 添加Class名称
   * @param name
   * @returns {Element}
   */
  addClass(name) {
    if (!this.isTextNode()) {
      this.el.classList.add(name);
    }
    return this;
  }

  /**
   * 是否具有指定Class名称
   * @param name
   * @returns {boolean}
   */
  hasClass(name) {
    if (!this.isTextNode()) {
      return this.el.classList.contains(name);
    }
    return false;
  }

  /**
   * 是否有子元素
   * @returns {boolean}
   */
  hasChildElement() {
    return this.children().length > 0;
  }

  /**
   * 是否有子节点
   * @returns {boolean}
   */
  hasChild() {
    return this.childrenNodes().length > 0;
  }

  /**
   * 删除Class名称
   * @param name
   * @returns {Element}
   */
  removeClass(name) {
    if (!this.isTextNode()) {
      this.el.classList.remove(name);
    }
    return this;
  }

  /**
   * 获取元素坐标信息
   * getBoundingClientRect
   * @returns {DOMRect}
   */
  box() {
    if (!this.isTextNode()) {
      return this.el.getBoundingClientRect();
    }
    return null;
  }

  /**
   * 获取当前第一个子元素
   * @returns {*}
   */
  first() {
    if (!this.isTextNode()) {
      return Element.wrapElement(this.el.firstChild);
    }
    return null;
  }

  /**
   * 获取最后一个子元素
   * @returns {*}
   */
  last() {
    if (!this.isTextNode()) {
      return Element.wrapElement(this.el.lastChild);
    }
    return null;
  }

  /**
   * 获取第一个文本节点
   */
  firstTextNode() {
    if (this.isTextNode()) {
      return this;
    }
    let find = null;
    let handle = (elem) => {
      if (elem.hasChild()) {
        elem.childrenNodes().forEach((elem) => {
          if (find === null) {
            handle(elem);
          }
        });
      }
      if (find === null) {
        if (elem.isTextNode()) {
          find = elem;
        }
      }
    };
    handle(this);
    return find;
  }

  /**
   * 获取最后一个文本节点
   */
  lastTextNode() {
    if (this.isTextNode()) {
      return this;
    }
    let find = null;
    let handle = (elem) => {
      if (elem.hasChild()) {
        elem.childrenNodes().reverse().forEach((elem) => {
          if (find === null) {
            handle(elem);
          }
        });
      }
      if (find === null) {
        if (elem.isTextNode()) {
          find = elem;
        }
      }
    };
    handle(this);
    return find;
  }

  /**
   * 删除当前元素下的子元素
   * @param target
   * @returns {boolean|ActiveX.IXMLDOMNode|*}
   */
  remove(target = null) {
    if (target) {
      if (!this.isTextNode()) {
        this.el.removeChild(target.el || target);
      }
    } else {
      const parent = this.parent();
      if (parent) {
        this.parent().remove(this);
      }
    }
    return this;
  }

  /**
   * 当前元素是否包含指定节点
   * @param ele
   * @returns {boolean|*}
   */
  contains(ele) {
    if (this.isTextNode()) {
      return false;
    }
    return this.el.contains(ele.el);
  }

  /**
   * 获取当前元素的上一个元素
   * @returns {*}
   */
  prev() {
    return this.el.previousSibling
      ? Element.wrapElement(this.el.previousSibling) : null;
  }

  /**
   * 获取当前元素的下一个元素
   * @returns {*}
   */
  next() {
    return this.el.nextSibling
      ? Element.wrapElement(this.el.nextSibling) : null;
  }

  /**
   * 设置元素的激活状态
   * @param flag
   * @param cls
   * @returns {Element}
   */
  active(flag = true, cls = 'active') {
    if (!this.isTextNode()) {
      if (flag) this.addClass(cls);
      else this.removeClass(cls);
    }
    return this;
  }

  /**
   * 设置元素文本
   * @param text
   * @returns {string|Element}
   */
  text(text) {
    if (this.isTextNode()) {
      return this.nodeValue();
    }
    if (text !== undefined) {
      this.el.innerText = text;
      return this;
    }
    return this.el.innerText;
  }

  /**
   * 设置元素html内容
   * @param html
   * @returns {Element|*}
   */
  html(html) {
    if (this.isTextNode()) {
      return this.nodeValue();
    }
    if (html !== undefined) {
      this.el.innerHTML = html;
      return this;
    }
    return this.el.innerHTML;
  }

  /**
   * 当前元素设置焦点
   */
  focus() {
    if (!this.isTextNode()) {
      this.el.focus();
    }
    return this;
  }

  /**
   * 移除焦点
   */
  blur() {
    if (!this.isTextNode()) {
      this.el.blur();
    }
    return this;
  }

  /**
   * 删除元素属性
   * @param key
   * @returns {Element}
   */
  removeAttr(key) {
    if (!this.isTextNode()) {
      this.el.removeAttribute(key);
    }
    return this;
  }

  /**
   * 添加style
   * @param style
   */
  style(style) {
    if (!this.isTextNode()) {
      this.attr('style', style);
    }
    return this;
  }

  /**
   * 添加元素属性
   * @param key
   * @param value
   * @returns {string|Element}
   */
  attr(key, value) {
    if (!this.isTextNode()) {
      if (value !== undefined) {
        if (this.el.setAttribute) {
          this.el.setAttribute(key, value);
        }
      } else {
        if (typeof key === 'string') {
          if (this.el.setAttribute) {
            return this.el.getAttribute(key);
          }
          return null;
        }
        if (this.el.setAttribute) {
          Object.keys(key).forEach((k) => {
            this.el.setAttribute(k, key[k]);
          });
        }
      }
    }
    return this;
  }

  /**
   * 设置元素Value
   * @param v
   * @returns {Element|*}
   */
  val(v) {
    if (!this.isTextNode()) {
      if (v !== undefined) {
        this.el.value = v;
        return this;
      }
      return this.el.value;
    }
    if (v === undefined) {
      return this.nodeValue();
    }
    return this;
  }

  /**
   * 获取原始节点
   * @returns {*}
   */
  get() {
    return this.el;
  }

  /**
   * 删除元素style属性
   * @param keys
   * @returns {Element}
   */
  cssRemoveKeys(...keys) {
    if (!this.isTextNode()) {
      if (this.el.style) {
        keys.forEach((k) => {
          if (this.el.style) {
            this.el.style.removeProperty(Element.hyphenateRE(k));
          }
        });
      }
    }
    return this;
  }

  /**
   * 删除元素style属性
   * @param key
   * @param value
   * @returns {Element}
   */
  cssRemoveVal(key, value) {
    if (!this.isTextNode()) {
      if (this.el.style) {
        const property = Element.hyphenateRE(key);
        const propertyValue = this.el.style.getPropertyValue(property);
        const newValue = propertyValue.replace(value, '');
        this.css(key, newValue);
      }
    }
    return this;
  }

  /**
   * 设置元素属性
   * @param name
   * @param value
   * @returns {Element|*}
   */
  css(name, value) {
    if (!this.isTextNode()) {
      if (this.el.style) {
        if (value === undefined && typeof name !== 'string') {
          Object.keys(name).forEach((key) => {
            const property = Element.hyphenateRE(key);
            this.el.style.setProperty(property, name[key]);
          });
          return this;
        }
        if (value !== undefined) {
          const property = Element.hyphenateRE(name);
          this.el.style.setProperty(property, value);
          return this;
        }
        const property = Element.hyphenateRE(name);
        return this.el.style.getPropertyValue(property);
      }
    }
    return null;
  }

  /**
   * 获取元素计算完成的样式
   * @returns {CSSStyleDeclaration}
   */
  computedStyle() {
    if (!this.isTextNode()) {
      return window.getComputedStyle(this.el, null);
    }
    return null;
  }

  /**
   * 显示
   * @returns {Element}
   */
  show() {
    if (!this.isTextNode()) {
      const style = this.computedStyle();
      if (style && style.display !== 'block') {
        this.css('display', 'block');
      }
    }
    return this;
  }

  /**
   * 隐藏
   * @returns {Element}
   */
  hide() {
    if (!this.isTextNode()) {
      const style = this.computedStyle();
      if (style && style.display !== 'none') {
        this.css('display', 'none');
      }
    }
    return this;
  }

  /**
   * 事件触发
   * @param type
   * @param message
   */
  trigger(type, message) {
    if (!this.isTextNode()) {
      switch (type) {
        case 'click': {
          const evt = new MouseEvent(type, {
            detail: message,
            bubbles: true,
            cancelable: false,
          });
          evt.initEvent('click', true, true);
          this.el.dispatchEvent(evt);
          break;
        }
        default: {
          const evt = new CustomEvent(type, {
            detail: message,
            bubbles: true,
            cancelable: false,
          });
          this.el.dispatchEvent(evt);
          break;
        }
      }
    }
  }

  /**
   * 查找子元素
   * @param select
   * @returns {[]|Element}
   */
  find(select) {
    if (!this.isTextNode()) {
      const result = this.el.querySelectorAll(select);
      if (result && result.length === 1) {
        return new Element(result[0]);
      }
      const array = [];
      if (result) {
        for (const item of result) {
          array.push(new Element(item));
        }
      }
      return array;
    }
    return [];
  }

  /**
   * 查找子元素
   * @param select
   * @returns {[]|Element}
   */
  finds(select) {
    if (!this.isTextNode()) {
      const result = this.el.querySelectorAll(select);
      const array = [];
      if (result) {
        for (const item of result) {
          array.push(new Element(item));
        }
      }
      return array;
    }
    return [];
  }

  /**
   * 获取当前元素的兄弟节点
   * @returns {[]}
   */
  sibling() {
    let sibling = this.el;
    const result = [];
    // eslint-disable-next-line no-cond-assign
    while ((sibling = sibling.previousElementSibling) !== null) result.push(new Element(sibling));
    sibling = this.el;
    // eslint-disable-next-line no-cond-assign
    while ((sibling = sibling.nextElementSibling) !== null) result.push(new Element(sibling));
    return result;
  }

  /**
   * 节点名称
   * @returns {string}
   */
  tagName() {
    return this.el.nodeName.toLocaleLowerCase();
  }

  /**
   * 节点内容
   * @returns {string}
   */
  nodeValue() {
    return this.el.nodeValue;
  }

  /**
   * 节点类型
   * @returns {number}
   */
  nodeType() {
    return this.el.nodeType;
  }

  /**
   * 在当前元素之后插入新元素
   * @param ele
   */
  after(ele) {
    if (this.el && ele && ele.el) {
      this.el.after(ele.el);
    }
    return this;
  }

  /**
   * 在当前元素之前插入新元素
   * @param ele
   */
  before(ele) {
    if (this.el && ele && ele.el) {
      this.el.before(ele.el);
    }
    return this;
  }

  /**
   * 复制
   */
  clone() {
    return new Element(this.el.cloneNode(true));
  }

  /**
   * 清空元素中的所有内容
   */
  empty() {
    if (!this.isTextNode()) {
      this.html('');
    }
    return this;
  }

  /**
   * 相等比较
   * @param other
   * @returns {boolean}
   */
  equals(other) {
    return this.el === other.el;
  }

  /**
   * 获取当前元素在父元素中的索引
   * @returns {number}
   */
  index() {
    let parent = this.parent();
    let index = -1;
    parent.childrenNodes()
      .forEach((v, i) => {
        if (v.equals(this)) {
          index = i;
        }
      });
    return index;
  }

  /**
   * 比较dom是否相同
   * @param ele
   * @returns {boolean}
   */
  is(ele) {
    return this.el === ele.el;
  }

  /**
   * 是否文本节点
   * @returns {boolean}
   */
  isTextNode() {
    return this.tagName() === '#text';
  }

  /**
   * 是否换行节点
   * @returns {boolean}
   */
  isBreakNode() {
    return this.tagName() === 'br';
  }

  /**
   * 是否文档碎片
   * @returns {boolean}
   */
  isDocumentFragment() {
    return this.el instanceof DocumentFragment;
  }

}

const h = (tag, className = '') => new Element(tag, className);

const TextNode = text => Element.createText(text);

export {
  Element,
  TextNode,
  h,
};
