/* global document CustomEvent window */
import { PlainUtils } from '../utils/PlainUtils';

/**
 * Element
 */
class Element {

  /**
   * 包装元素
   */
  static wrap(args) {
    if (PlainUtils.isArray(args)) {
      const elements = [];
      args.forEach((item) => {
        if (item instanceof Element) {
          elements.push(item);
        } else {
          elements.push(new Element(item));
        }
      });
      return elements;
    }
    return new Element(args);
  }

  /**
   * Element
   * @param tag
   * @param className
   */
  constructor(tag, className = '') {
    if (typeof tag === 'string') {
      this.el = document.createElement(tag);
      this.el.className = className;
    } else {
      this.el = tag;
    }
    this.el.data = [];
  }

  /**
   * 空参数时返回子节点, 有参数时插入子节点
   * @param args
   * @returns {Element|NodeListOf<ChildNode>|ActiveX.IXMLDOMNodeList}
   */
  children(...args) {
    if (arguments.length === 0) {
      return Element.wrap(this.el.childNodes);
    }
    args.forEach(ele => this.append(ele));
    return this;
  }

  /**
   * 在当前元素中插入指定节点
   * @param ele
   */
  append(ele) {
    this.el.appendChild(ele.el);
  }

  /**
   * 删除Class名称
   * @param name
   * @returns {Element}
   */
  removeClass(name) {
    this.el.classList.remove(name);
    return this;
  }

  /**
   * 添加Class名称
   * @param name
   * @returns {Element}
   */
  addClass(name) {
    this.el.classList.add(name);
    return this;
  }

  /**
   * 是否具有指定Class名称
   * @param name
   * @returns {boolean}
   */
  hasClass(name) {
    return this.el.classList.contains(name);
  }

  /**
   * 数据绑定
   * @param key
   * @param value
   * @returns {Element|*}
   */
  data(key, value) {
    if (value !== undefined) {
      this.el.data[key] = value;
      return this;
    }
    return this.el.data[key];
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
    const {
      offsetTop, offsetLeft, offsetHeight, offsetWidth,
    } = this.el;
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
    return Element.wrap(this.el.parentNode);
  }

  /**
   * 获取元素坐标信息
   * getBoundingClientRect
   * @returns {DOMRect}
   */
  box() {
    return this.el.getBoundingClientRect();
  }

  /**
   * 获取当前第一个子元素
   * @returns {*}
   */
  first() {
    return Element.wrap(this.el.firstChild);
  }

  /**
   * 获取最后一个子元素
   * @returns {*}
   */
  last() {
    return Element.wrap(this.el.lastChild);
  }

  /**
   * 删除当前元素下的子元素
   * @param ele
   * @returns {boolean|ActiveX.IXMLDOMNode|*}
   */
  remove(ele) {
    this.el.removeChild(ele.el || ele);
    return this;
  }

  /**
   * 当前元素是否包含指定节点
   * @param ele
   * @returns {boolean|*}
   */
  contains(ele) {
    return this.el.contains(ele.el);
  }

  /**
   * 获取当前元素的上一个元素
   * @returns {*}
   */
  prev() {
    return Element.wrap(this.el.previousSibling);
  }

  /**
   * 获取当前元素的下一个元素
   * @returns {*}
   */
  next() {
    return Element.wrap(this.el.nextSibling);
  }

  /**
   * 设置元素的激活状态
   * @param flag
   * @param cls
   * @returns {Element}
   */
  active(flag = true, cls = 'active') {
    if (flag) this.addClass(cls);
    else this.removeClass(cls);
    return this;
  }

  /**
   * 设置元素文本
   * @param text
   * @returns {string|Element}
   */
  text(text) {
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
    this.el.focus();
  }

  /**
   * 删除元素属性
   * @param key
   * @returns {Element}
   */
  removeAttr(key) {
    this.el.removeAttribute(key);
    return this;
  }

  /**
   * 添加元素属性
   * @param key
   * @param value
   * @returns {string|Element}
   */
  attr(key, value) {
    if (value !== undefined) {
      this.el.setAttribute(key, value);
    } else {
      if (typeof key === 'string') {
        return this.el.getAttribute(key);
      }
      Object.keys(key).forEach((k) => {
        this.el.setAttribute(k, key[k]);
      });
    }
    return this;
  }

  /**
   * 设置元素Value
   * @param v
   * @returns {Element|*}
   */
  val(v) {
    if (v !== undefined) {
      this.el.value = v;
      return this;
    }
    return this.el.value;
  }

  /**
   * 删除元素style属性
   * @param keys
   * @returns {Element}
   */
  cssRemoveKeys(...keys) {
    keys.forEach(k => this.el.style.removeProperty(k));
    return this;
  }

  /**
   * 设置元素属性
   * @param name
   * @param value
   * @returns {Element|*}
   */
  css(name, value) {
    if (value === undefined && typeof name !== 'string') {
      Object.keys(name).forEach((k) => {
        this.el.style[k] = name[k];
      });
      return this;
    }
    if (value !== undefined) {
      this.el.style[name] = value;
      return this;
    }
    return this.el.style[name];
  }

  /**
   * 获取元素计算完成的样式
   * @returns {CSSStyleDeclaration}
   */
  computedStyle() {
    return window.getComputedStyle(this.el, null);
  }

  /**
   * 显示
   * @returns {Element}
   */
  show() {
    const style = this.computedStyle();
    if (style && style.display !== 'block') {
      this.css('display', 'block');
    }
    return this;
  }

  /**
   * 隐藏
   * @returns {Element}
   */
  hide() {
    const style = this.computedStyle();
    if (style && style.display !== 'none') {
      this.css('display', 'none');
    }
    return this;
  }

  /**
   * 事件触发
   * @param type
   * @param message
   */
  trigger(type, message) {
    const event = new CustomEvent(type, {
      detail: message,
      bubbles: true,
      cancelable: false,
    });
    this.el.dispatchEvent(event);
  }

  /**
   * 查找子元素
   * @param select
   * @returns {[]|Element}
   */
  find(select) {
    const result = this.el.querySelectorAll(select);
    if (result && result.length === 1) {
      return new Element(result[0]);
    }
    const eleArray = [];
    if (result) {
      // eslint-disable-next-line no-restricted-syntax
      for (const item of result) {
        eleArray.push(new Element(item));
      }
    }
    return eleArray;
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
   * 比较dom是否相同
   * @param ele
   * @returns {boolean}
   */
  is(ele) {
    return this.el === ele.el;
  }

  /**
   * 在当前元素之后插入新元素
   * @param ele
   */
  after(ele) {
    this.el.after(ele.el);
  }

  /**
   * 在当前元素之前插入新元素
   * @param ele
   */
  before(ele) {
    this.el.before(ele.el);
  }

  /**
   * 清空元素中的所有内容
   */
  empty() {
    this.html('');
  }

}

const h = (tag, className = '') => new Element(tag, className);

export {
  Element,
  h,
};
