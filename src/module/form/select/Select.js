import { Widget } from '../../../lib/Widget';
import { Constant, cssPrefix } from '../../../const/Constant';
import { XEvent } from '../../../lib/XEvent';
import { h } from '../../../lib/Element';
import { ELContextMenuDivider } from '../../contextmenu/ELContextMenuDivider';
import { SelectContextMenu } from './SelectContextMenu';
import { SelectContextMenuItem } from './SelectContextMenuItem';
import { SheetUtils } from '../../../utils/SheetUtils';

/**
 * Select
 */
class Select extends Widget {

  /**
   * Select
   */
  constructor() {
    super(`${cssPrefix}-form-select`);
    this.selectValue = SheetUtils.Nul;
    // 文本和图标
    this.selectText = h('div', `${cssPrefix}-form-select-text`);
    this.selectIcon = h('div', `${cssPrefix}-form-select-icon`);
    this.children(this.selectText);
    this.children(this.selectIcon);
    // 上下文菜单
    this.contextMenu = new SelectContextMenu({
      el: this,
      onUpdate: (item) => {
        const { value } = item;
        this.setSelect(value);
      },
    });
    this.bind();
  }

  /**
   * 卸载事件
   */
  unbind() {
    XEvent.unbind(this);
  }

  /**
   * 绑定事件
   */
  bind() {
    XEvent.bind(this, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      if (this.contextMenu.isClose()) {
        this.contextMenu.open();
      } else {
        this.contextMenu.close();
      }
      e.stopPropagation();
    });
  }

  /**
   * 获取当前选择的值
   * @returns {null}
   */
  getValue() {
    return this.selectValue;
  }

  /**
   * 设置选择的值
   * @param value
   */
  setSelect(value) {
    const { contextMenu, selectText } = this;
    const { items } = contextMenu;
    const find = items.find(item => item.value && item.value === value);
    if (find) {
      selectText.html(`&nbsp;${find.text}`);
      this.selectValue = find.value;
      this.trigger(Constant.FORM_EVENT_TYPE.FORM_SELECT_CHANGE, {
        item: find,
      });
    }
  }

  /**
   * 添加新的选项
   * @param text
   * @param value
   */
  addValue({
    text, value,
  }) {
    const item = new SelectContextMenuItem({ text, value });
    this.contextMenu.addItem(item);
  }

  /**
   * 获取分隔线
   */
  addDivider() {
    const item = new ELContextMenuDivider();
    this.contextMenu.addItem(item);
  }

  /**
   * 组件销毁
   */
  destroy() {
    super.destroy();
    this.unbind();
    this.contextMenu.close();
    this.contextMenu.destroy();
  }

}

export {
  Select,
};
