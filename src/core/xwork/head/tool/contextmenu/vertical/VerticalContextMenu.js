import { ELContextMenu } from '../../../../../../module/contextmenu/ELContextMenu';
import { cssPrefix, Constant } from '../../../../../../const/Constant';
import { SheetUtils } from '../../../../../../utils/SheetUtils';
import { h } from '../../../../../../lib/Element';
import { VerticalContextMenuItem } from './VerticalContextMenuItem';
import { VerticalIcon1 } from '../icon/vertical/VerticalIcon1';
import { VerticalIcon2 } from '../icon/vertical/VerticalIcon2';
import { VerticalIcon3 } from '../icon/vertical/VerticalIcon3';
import { XEvent } from '../../../../../../lib/XEvent';
import { BaseFont } from '../../../../../../draw/font/BaseFont';

class VerticalContextMenu extends ELContextMenu {

  constructor(options = {}) {
    super(`${cssPrefix}-vertical-type-context-menu`, SheetUtils.copy({
      onUpdate: () => {},
    }, options));
    this.verticalIcon1 = new VerticalIcon1();
    this.verticalIcon2 = new VerticalIcon2();
    this.verticalIcon3 = new VerticalIcon3();
    const div2 = h('div', `${cssPrefix}-vertical-type-context-menu-type-icon-line`);
    div2.children(this.verticalIcon1);
    div2.children(this.verticalIcon2);
    div2.children(this.verticalIcon3);
    this.verticalIcons = new VerticalContextMenuItem();
    this.verticalIcons.removeClass('hover');
    this.verticalIcons.children(div2);
    this.addItem(this.verticalIcons);
    this.bind();
  }

  unbind() {
    XEvent.unbind(this.verticalIcon1, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN);
    XEvent.unbind(this.verticalIcon2, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN);
    XEvent.unbind(this.verticalIcon3, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN);
  }

  bind() {
    XEvent.bind(this.verticalIcon1, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      this.options.onUpdate(BaseFont.VERTICAL_ALIGN.top);
      e.stopPropagation();
      e.preventDefault();
    });
    XEvent.bind(this.verticalIcon2, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      this.options.onUpdate(BaseFont.VERTICAL_ALIGN.center);
      e.stopPropagation();
      e.preventDefault();
    });
    XEvent.bind(this.verticalIcon3, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      this.options.onUpdate(BaseFont.VERTICAL_ALIGN.bottom);
      e.stopPropagation();
      e.preventDefault();
    });
  }

  destroy() {
    super.destroy();
    this.unbind();
  }

}

export { VerticalContextMenu };
