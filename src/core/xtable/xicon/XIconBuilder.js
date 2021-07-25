import { XIcon } from './XIcon';
import { XIconFocus } from './XIconFocus';

/**
 * XIconBuilder
 */
class XIconBuilder {

  /**
   * 图标事件处理
   * @param type
   * @param native
   * @param staticIcons
   * @param fixedIcons
   * @param sx
   * @param sy
   * @param fx
   * @param fy
   */
  xIconsEvent({
    type,
    native,
    sx,
    sy,
    fx,
    fy,
    staticIcons = [],
    fixedIcons = [],
  }) {
    if (staticIcons.length + fixedIcons.length === 0) {
      this.clearFocus();
    } else {
      staticIcons.forEach((icon) => {
        icon.eventHandle({
          type, x: sx, y: sy, native,
        });
      });
      fixedIcons.forEach((icon) => {
        icon.eventHandle({
          type, x: fx, y: fy, native,
        });
      });
    }
  }

  /**
   * 清空焦点元素
   */
  clearFocus() {
    const { focus } = this;
    const { activate } = focus;
    if (activate) {
      focus.setActivate(null);
      activate.onLeave();
    }
  }

  /**
   * XIconBuilder
   * @param focus
   */
  constructor({
    focus = new XIconFocus(),
  } = {}) {
    this.focus = focus;
  }

  /**
   * 构建小图标
   * @param options
   * @returns {XIcon}
   */
  build(options = {}) {
    const { focus } = this;
    const xIcon = new XIcon(options);
    xIcon.setFocus(focus);
    return xIcon;
  }

}

export {
  XIconBuilder,
};
