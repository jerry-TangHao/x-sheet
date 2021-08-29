import { ELContextMenu } from '../../../../../../../module/contextmenu/ELContextMenu';
import { cssPrefix, Constant } from '../../../../../../../const/Constant';
import { SheetUtils } from '../../../../../../../utils/SheetUtils';
import { BorderTypeContextMenuItem } from './BorderTypeContextMenuItem';
import { ELContextMenuDivider } from '../../../../../../../module/contextmenu/ELContextMenuDivider';
import { h } from '../../../../../../../lib/Element';
import { BorderIcon1 } from '../../icon/border/BorderIcon1';
import { BorderIcon2 } from '../../icon/border/BorderIcon2';
import { BorderIcon3 } from '../../icon/border/BorderIcon3';
import { BorderIcon4 } from '../../icon/border/BorderIcon4';
import { BorderIcon5 } from '../../icon/border/BorderIcon5';
import { BorderIcon6 } from '../../icon/border/BorderIcon6';
import { BorderIcon7 } from '../../icon/border/BorderIcon7';
import { BorderIcon8 } from '../../icon/border/BorderIcon8';
import { BorderIcon9 } from '../../icon/border/BorderIcon9';
import { BorderIcon10 } from '../../icon/border/BorderIcon10';
import { BorderColor } from '../../icon/border/BorderColor';
import { BorderType } from '../../icon/border/BorderType';
import { XEvent } from '../../../../../../../lib/XEvent';
import { BorderColorContextMenu } from '../bordercolor/BorderColorContextMenu';
import { LineTypeContextMenu } from '../linetype/LineTypeContextMenu';
import { LINE_TYPE } from '../../../../../../../draw/Line';
import { ElPopUp } from '../../../../../../../module/elpopup/ElPopUp';

class BorderTypeContextMenu extends ELContextMenu {

  constructor(options = {}) {
    super(`${cssPrefix}-border-type-context-menu`, SheetUtils.copy({
      onUpdate: () => {},
    }, options));
    this.type = LINE_TYPE.SOLID_LINE;
    this.color = 'rgb(0,0,0)';
    // 边框样式
    this.borderIcon1 = new BorderIcon1();
    this.borderIcon2 = new BorderIcon2();
    this.borderIcon3 = new BorderIcon3();
    this.borderIcon4 = new BorderIcon4();
    this.borderIcon5 = new BorderIcon5();
    const div1 = h('div', `${cssPrefix}-border-type-context-menu-type-icon-line`);
    div1.childrenNodes(this.borderIcon1);
    div1.childrenNodes(this.borderIcon2);
    div1.childrenNodes(this.borderIcon3);
    div1.childrenNodes(this.borderIcon4);
    div1.childrenNodes(this.borderIcon5);
    this.borderIcon6 = new BorderIcon6();
    this.borderIcon7 = new BorderIcon7();
    this.borderIcon8 = new BorderIcon8();
    this.borderIcon9 = new BorderIcon9();
    this.borderIcon10 = new BorderIcon10();
    const div2 = h('div', `${cssPrefix}-border-type-context-menu-type-icon-line`);
    div2.childrenNodes(this.borderIcon6);
    div2.childrenNodes(this.borderIcon7);
    div2.childrenNodes(this.borderIcon8);
    div2.childrenNodes(this.borderIcon9);
    div2.childrenNodes(this.borderIcon10);
    this.borderIcons = new BorderTypeContextMenuItem();
    this.borderIcons.removeClass('hover');
    this.borderIcons.childrenNodes(div1);
    this.borderIcons.childrenNodes(div2);
    // 子菜单
    this.borderColor = new BorderColor();
    this.borderType = new BorderType();
    const div3 = h('div', `${cssPrefix}-border-type-context-menu-type-icon-line`);
    div3.childrenNodes(this.borderColor);
    div3.childrenNodes(this.borderType);
    this.borderColorAndType = new BorderTypeContextMenuItem();
    this.borderColorAndType.removeClass('hover');
    this.borderColorAndType.childrenNodes(div3);
    // 追加子菜单
    this.addItem(this.borderIcons);
    this.addItem(new ELContextMenuDivider());
    this.addItem(this.borderColorAndType);
    // 边框颜色菜单
    this.borderColorContextMenu = new BorderColorContextMenu(SheetUtils.copy({
      el: this.borderColor,
    }, {
      onUpdate: (color) => {
        this.color = color;
        this.borderColor.setColor(color);
      },
    })).parentWidget(this);
    // 边框类型
    this.lineTypeContextMenu = new LineTypeContextMenu(SheetUtils.copy({
      el: this.borderType,
    }, {
      onUpdate: (type) => {
        this.type = type;
      },
    })).parentWidget(this);
    // 添加事件
    this.bind();
  }

  unbind() {
    XEvent.unbind(this.borderColor, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN);
    XEvent.unbind(this.borderType, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN);
    XEvent.unbind(this.borderIcon1, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN);
    XEvent.unbind(this.borderIcon2, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN);
    XEvent.unbind(this.borderIcon3, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN);
    XEvent.unbind(this.borderIcon4, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN);
    XEvent.unbind(this.borderIcon5, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN);
    XEvent.unbind(this.borderIcon6, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN);
    XEvent.unbind(this.borderIcon7, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN);
    XEvent.unbind(this.borderIcon8, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN);
    XEvent.unbind(this.borderIcon9, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN);
    XEvent.unbind(this.borderIcon10, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN);
  }

  bind() {
    XEvent.bind(this.borderColor, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      const { borderColorContextMenu } = this;
      const { elPopUp } = borderColorContextMenu;
      ElPopUp.closeAll([elPopUp, this.elPopUp]);
      if (borderColorContextMenu.isClose()) {
        borderColorContextMenu.open();
      } else {
        borderColorContextMenu.close();
      }
      e.stopPropagation();
      e.preventDefault();
    });
    XEvent.bind(this.borderType, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      const { lineTypeContextMenu } = this;
      const { elPopUp } = lineTypeContextMenu;
      ElPopUp.closeAll([elPopUp, this.elPopUp]);
      if (lineTypeContextMenu.isClose()) {
        lineTypeContextMenu.open();
      } else {
        lineTypeContextMenu.close();
      }
      e.stopPropagation();
      e.preventDefault();
    });
    XEvent.bind(this.borderIcon1, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      this.options.onUpdate('border1', this.color, this.type);
      e.stopPropagation();
      e.preventDefault();
    });
    XEvent.bind(this.borderIcon2, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      this.options.onUpdate('border2', this.color, this.type);
      e.stopPropagation();
      e.preventDefault();
    });
    XEvent.bind(this.borderIcon3, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      this.options.onUpdate('border3', this.color, this.type);
      e.stopPropagation();
      e.preventDefault();
    });
    XEvent.bind(this.borderIcon4, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      this.options.onUpdate('border4', this.color, this.type);
      e.stopPropagation();
      e.preventDefault();
    });
    XEvent.bind(this.borderIcon5, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      this.options.onUpdate('border5', this.color, this.type);
      e.stopPropagation();
      e.preventDefault();
    });
    XEvent.bind(this.borderIcon6, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      this.options.onUpdate('border6', this.color, this.type);
      e.stopPropagation();
      e.preventDefault();
    });
    XEvent.bind(this.borderIcon7, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      this.options.onUpdate('border7', this.color, this.type);
      e.stopPropagation();
      e.preventDefault();
    });
    XEvent.bind(this.borderIcon8, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      this.options.onUpdate('border8', this.color, this.type);
      e.stopPropagation();
      e.preventDefault();
    });
    XEvent.bind(this.borderIcon9, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      this.options.onUpdate('border9', this.color, this.type);
      e.stopPropagation();
      e.preventDefault();
    });
    XEvent.bind(this.borderIcon10, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      this.options.onUpdate('border10', this.color, this.type);
      e.stopPropagation();
      e.preventDefault();
    });
  }

  destroy() {
    super.destroy();
    this.unbind();
  }

}

export { BorderTypeContextMenu };
