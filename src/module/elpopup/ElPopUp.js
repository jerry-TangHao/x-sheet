/* global window document */
import { Widget } from '../../lib/Widget';
import { Constant, cssPrefix } from '../../const/Constant';
import { SheetUtils } from '../../utils/SheetUtils';
import { XEvent } from '../../lib/XEvent';

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
    instances.push(this);
    this.options = SheetUtils.copy({
      el: SheetUtils.Nul,
      autoWidth: false,
      autoHeight: false,
      position: ElPopUp.POPUP_POSTION.TB,
    }, options);
    this.direction = SheetUtils.Undef;
    this.status = false;
    this.location = 0;
    this.spaces = 0;
    this.elPopUpDownHandle = () => {
      this.close();
    };
    this.bind();
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
    const elem = options.el;
    const root = this.getRootWidget();
    const rootBox = root.box();
    const elemBox = elem.box();
    const winWidth = window.innerWidth;
    const winHeight = window.innerHeight;
    this.direction = SheetUtils.Undef;
    this.spaces = 0;
    this.location = 0;
    switch (position) {
      case ElPopUp.POPUP_POSTION.LR: {
        const left = elemBox.left - rootBox.left;
        const width = elemBox.width;
        const lDiff = left;
        const rDiff = winWidth - (left + width);
        if (lDiff > rDiff) {
          this.direction = 'left';
          this.spaces = lDiff;
          this.location = left;
        } else {
          this.direction = 'right';
          this.spaces = rDiff;
          this.location = left + width;
        }
        break;
      }
      case ElPopUp.POPUP_POSTION.TB: {
        const top = elemBox.top - rootBox.top;
        const height = elemBox.height;
        const tDiff = top;
        const bDiff = winHeight - (top + height);
        if (tDiff > bDiff) {
          this.direction = 'top';
          this.spaces = tDiff;
          this.location = top;
        } else {
          this.direction = 'bottom';
          this.spaces = bDiff;
          this.location = top + height;
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
   * 设置显示位置
   */
  mousePopUpLocation(mouse) {
    const mLeft = mouse.pageX;
    const mlTop = mouse.pageY;
    const winHeight = window.innerHeight;
    const winWidth = window.innerWidth;
    const box = this.box();
    const rightDiff = winWidth - (mLeft + box.width);
    const bottomDIff = winHeight - (mlTop + box.height);
    if (rightDiff < 0) {
      this.css('left', `${mLeft - box.width}px`);
    } else {
      this.css('left', `${mLeft}px`);
    }
    if (bottomDIff < 0) {
      this.css('top', `${mlTop - box.height}px`);
    } else {
      this.css('top', `${mlTop}px`);
    }
  }

  /**
   * 显示弹框
   */
  open() {
    const root = this.getRootWidget();
    if (this.status === false && root) {
      this.status = true;
      root.childrenNodes(this);
    }
    this.elPopUpPosition();
    this.elPopUpAutosize();
    this.elPopUpLocation();
  }

  /**
   * 关闭弹框
   */
  close() {
    const root = this.getRootWidget();
    if (this.status === true && root) {
      this.status = false;
      root.remove(this);
    }
  }

  /**
   * 显示弹框
   * @param mouse
   */
  openByMouse(mouse) {
    const root = this.getRootWidget();
    if (this.status === false && root) {
      this.status = true;
      root.childrenNodes(this);
    }
    this.mousePopUpLocation(mouse);
    this.elPopUpAutosize();
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

}

ElPopUp.POPUP_POSTION = {
  TB: Symbol('上下位置'),
  LR: Symbol('左右位置'),
};

export {
  ElPopUp,
};
