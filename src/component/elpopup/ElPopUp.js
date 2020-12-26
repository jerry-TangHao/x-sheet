/* global window document */
import { Widget } from '../../lib/Widget';
import { Constant, cssPrefix } from '../../const/Constant';
import { h } from '../../lib/Element';
import { PlainUtils } from '../../utils/PlainUtils';
import { XEvent } from '../../lib/XEvent';

let root = PlainUtils.Nul;
let instances = [];

/**
 * ElPopUp
 * @author jerry
 * @date 2020/10/19
 */
class ElPopUp extends Widget {

  /**
   * ElPopUp
   * @param options
   */
  constructor(options) {
    super(`${cssPrefix}-el-pop-up`);
    this.options = PlainUtils.mergeDeep({
      el: PlainUtils.Nul,
      autoWidth: false,
      autoHeight: false,
      position: ElPopUp.POPUP_POSTION.TB,
    }, options);
    this.direction = PlainUtils.Undef;
    this.status = false;
    this.location = 0;
    this.spaces = 0;
    this.elPopUpDownHandle = () => {
      this.close();
    };
    instances.push(this);
    this.bind();
  }

  /**
   * 显示弹框
   */
  open() {
    if (this.status === false && root) {
      root.children(this);
      this.status = true;
    }
    this.elPopUpPosition();
    this.elPopUpAutosize();
    this.elPopUpLocation();
  }

  /**
   * 关闭弹框
   */
  close() {
    if (this.status === true && root) {
      root.remove(this);
      this.status = false;
    }
  }

  /**
   * 卸载事件
   */
  unbind() {
    XEvent.unbind(this);
    XEvent.unbind(document, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, this.elPopUpDownHandle);
  }

  /**
   * 绑定事件
   */
  bind() {
    XEvent.bind(this, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      e.stopPropagation();
    });
    XEvent.bind(document, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, this.elPopUpDownHandle);
  }

  /**
   * 计算显示的大小
   */
  elPopUpAutosize() {
    const { options, direction, spaces } = this;
    const { autoWidth, autoHeight } = options;
    if (autoWidth) {
      this.css('width', 'initial');
      this.css('overflow-x', 'initial');
      const box = this.box();
      const { width } = box;
      switch (direction) {
        case 'left':
        case 'right':
          if (width > spaces) {
            this.css('overflow-x', 'auto');
            this.css('width', `${spaces}px`);
          }
          break;
      }
    }
    if (autoHeight) {
      this.css('height', 'initial');
      this.css('overflow-y', 'initial');
      const box = this.box();
      const { height } = box;
      switch (direction) {
        case 'top':
        case 'bottom':
          if (height > spaces) {
            this.css('overflow-y', 'auto');
            this.css('height', `${spaces}px`);
          }
          break;
      }
    }
  }

  /**
   * 计算显示的位置
   */
  elPopUpPosition() {
    const { options } = this;
    const { position } = options;
    const { el } = options;
    const elBox = el.box();
    const winWidth = window.innerWidth;
    const winHeight = window.innerHeight;
    this.direction = PlainUtils.Undef;
    this.spaces = 0;
    this.location = 0;
    switch (position) {
      case ElPopUp.POPUP_POSTION.LR: {
        const width = elBox.width;
        const elLeft = elBox.left;
        const leftDiff = elLeft;
        const rightDiff = winWidth - (elLeft + width);
        if (leftDiff > rightDiff) {
          this.direction = 'left';
          this.spaces = leftDiff;
          this.location = elLeft;
        } else {
          this.direction = 'right';
          this.spaces = rightDiff;
          this.location = elLeft + width;
        }
        break;
      }
      case ElPopUp.POPUP_POSTION.TB: {
        const height = elBox.height;
        const elTop = elBox.top;
        const topDiff = elTop;
        const bottomDIff = winHeight - (elTop + height);
        if (topDiff > bottomDIff) {
          this.direction = 'top';
          this.spaces = topDiff;
          this.location = elTop;
        } else {
          this.direction = 'bottom';
          this.spaces = bottomDIff;
          this.location = elTop + height;
        }
        break;
      }
    }
  }

  /**
   * 设置显示位置
   */
  elPopUpLocation() {
    const { direction, location, options } = this;
    const { el } = options;
    const box = this.box();
    const elBox = el.box();
    const elLeft = elBox.left;
    const elTop = elBox.top;
    const { width, height } = box;
    switch (direction) {
      case 'left':
        this.css('top', `${elTop}px`);
        this.css('left', `${location - width}px`);
        break;
      case 'right':
        this.css('top', `${elTop}px`);
        this.css('left', `${location}px`);
        break;
      case 'top':
        this.css('left', `${elLeft}px`);
        this.css('top', `${location - height}px`);
        break;
      case 'bottom':
        this.css('left', `${elLeft}px`);
        this.css('top', `${location}px`);
        break;
    }
  }

  /**
   * 设置环绕元素
   * @param el
   */
  setEL(el) {
    this.options.el = el;
  }

  /**
   * 销毁组件
   */
  destroy() {
    super.destroy();
    this.unbind();
  }

  /**
   * 删除实例
   * @param instance
   */
  static removeInstance(instance) {
    const filter = [];
    instances.forEach((item) => {
      if (item !== instance) {
        filter.push(item);
      }
    });
    instances = filter;
  }

  /**
   * 关闭所有实例
   * @param filter
   */
  static closeAll(filter = []) {
    instances.forEach((item) => {
      if (filter.indexOf(item) === -1) {
        item.close();
      }
    });
  }

  /**
   * 设置根节点
   * @param element
   */
  static setRoot(element) {
    if (element.el) {
      element = h(element.el);
    } else {
      element = h(element);
    }
    root = element;
  }

}
ElPopUp.POPUP_POSTION = {
  TB: Symbol('上下位置'),
  LR: Symbol('左右位置'),
};

export {
  ElPopUp,
};
