import { ELContextMenu } from '../../../../../../module/contextmenu/ELContextMenu';
import { cssPrefix, Constant } from '../../../../../../const/Constant';
import { SheetUtils } from '../../../../../../utils/SheetUtils';
import { h } from '../../../../../../lib/Element';
import { HorizontalIcon1 } from '../icon/horizontal/HorizontalIcon1';
import { HorizontalIcon2 } from '../icon/horizontal/HorizontalIcon2';
import { HorizontalIcon3 } from '../icon/horizontal/HorizontalIcon3';
import { HorizontalContextMenuItem } from './HorizontalContextMenuItem';
import { XEvent } from '../../../../../../lib/XEvent';
import { BaseFont } from '../../../../../../draw/font/BaseFont';

class HorizontalContextMenu extends ELContextMenu {

  constructor(options = {}) {
    super(`${cssPrefix}-horizontal-type-context-menu`, SheetUtils.copy({
      onUpdate: () => {},
    }, options));
    this.horizontalIcon1 = new HorizontalIcon1();
    this.horizontalIcon2 = new HorizontalIcon2();
    this.horizontalIcon3 = new HorizontalIcon3();
    const div2 = h('div', `${cssPrefix}-horizontal-type-context-menu-type-icon-line`);
    div2.children(this.horizontalIcon1);
    div2.children(this.horizontalIcon2);
    div2.children(this.horizontalIcon3);
    this.horizontalIcons = new HorizontalContextMenuItem();
    this.horizontalIcons.removeClass('hover');
    this.horizontalIcons.children(div2);
    this.addItem(this.horizontalIcons);
    this.bind();
  }

  unbind() {
    XEvent.unbind(this.horizontalIcon1, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN);
    XEvent.unbind(this.horizontalIcon2, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN);
    XEvent.unbind(this.horizontalIcon3, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN);
  }

  bind() {
    XEvent.bind(this.horizontalIcon1, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      this.options.onUpdate(BaseFont.ALIGN.left);
      e.stopPropagation();
      e.preventDefault();
    });
    XEvent.bind(this.horizontalIcon2, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      this.options.onUpdate(BaseFont.ALIGN.center);
      e.stopPropagation();
      e.preventDefault();
    });
    XEvent.bind(this.horizontalIcon3, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      this.options.onUpdate(BaseFont.ALIGN.right);
      e.stopPropagation();
      e.preventDefault();
    });
  }

  destroy() {
    super.destroy();
    this.unbind();
  }

}

export { HorizontalContextMenu };
