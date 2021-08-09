import { ELContextMenu } from '../../../../../../module/contextmenu/ELContextMenu';
import { cssPrefix, Constant } from '../../../../../../const/Constant';
import { SheetUtils } from '../../../../../../utils/SheetUtils';
import { TextWrappingIcon1 } from '../icon/textwrapping/TextWrappingIcon1';
import { TextWrappingIcon2 } from '../icon/textwrapping/TextWrappingIcon2';
import { TextWrappingIcon3 } from '../icon/textwrapping/TextWrappingIcon3';
import { h } from '../../../../../../lib/Element';
import { TextWrappingContextMenuItem } from './TextWrappingContextMenuItem';
import { XEvent } from '../../../../../../lib/XEvent';
import { BaseFont } from '../../../../../../draw/font/BaseFont';

class TextWrappingContextMenu extends ELContextMenu {

  constructor(options = {}) {
    super(`${cssPrefix}-text-wrapping-context-menu`, SheetUtils.copy({
      onUpdate: () => {},
    }, options));
    this.textWrappingIcon1 = new TextWrappingIcon1();
    this.textWrappingIcon2 = new TextWrappingIcon2();
    this.textWrappingIcon3 = new TextWrappingIcon3();
    const div2 = h('div', `${cssPrefix}-text-wrapping-context-menu-type-icon-line`);
    div2.children(this.textWrappingIcon1);
    div2.children(this.textWrappingIcon2);
    div2.children(this.textWrappingIcon3);
    this.textWrappingIcons = new TextWrappingContextMenuItem();
    this.textWrappingIcons.removeClass('hover');
    this.textWrappingIcons.children(div2);
    this.addItem(this.textWrappingIcons);
    this.bind();
  }

  unbind() {
    XEvent.unbind(this.textWrappingIcon1, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN);
    XEvent.unbind(this.textWrappingIcon2, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN);
    XEvent.unbind(this.textWrappingIcon3, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN);
  }

  bind() {
    XEvent.bind(this.textWrappingIcon1, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      this.options.onUpdate(BaseFont.TEXT_WRAP.TRUNCATE);
      e.stopPropagation();
      e.preventDefault();
    });
    XEvent.bind(this.textWrappingIcon2, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      this.options.onUpdate(BaseFont.TEXT_WRAP.OVER_FLOW);
      e.stopPropagation();
      e.preventDefault();
    });
    XEvent.bind(this.textWrappingIcon3, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      this.options.onUpdate(BaseFont.TEXT_WRAP.WORD_WRAP);
      e.stopPropagation();
      e.preventDefault();
    });
  }

  destroy() {
    super.destroy();
    this.unbind();
  }

}

export { TextWrappingContextMenu };
