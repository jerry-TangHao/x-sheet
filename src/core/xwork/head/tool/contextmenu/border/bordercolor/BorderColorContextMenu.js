import { ELContextMenu } from '../../../../../../../module/contextmenu/ELContextMenu';
import { cssPrefix, Constant } from '../../../../../../../const/Constant';
import { SheetUtils } from '../../../../../../../utils/SheetUtils';
import { ColorPicker } from '../../../../../../../module/colorpicker/ColorPicker';
import { ColorItem } from '../../../../../../../module/colorpicker/colorarray/ColorItem';
import { Icon } from '../../../Icon';
import { ColorArray } from '../../../../../../../module/colorpicker/colorarray/ColorArray';
import { ELContextMenuDivider } from '../../../../../../../module/contextmenu/ELContextMenuDivider';
import { BorderColorContextMenuItem } from './BorderColorContextMenuItem';
import { h } from '../../../../../../../lib/Element';
import { XEvent } from '../../../../../../../lib/XEvent';

class BorderColorContextMenu extends ELContextMenu {

  constructor(options = {}) {
    super(`${cssPrefix}-border-color-context-menu`, SheetUtils.copy({
      onUpdate: () => {},
    }, options));
    this.colorPicker = new ColorPicker({
      selectCb: (color) => {
        this.options.onUpdate(color);
        if (this.addCustomizeColor(color)) {
          this.customizeColorArray.setActiveByColor(color);
        } else {
          this.defaultColorArray.setActiveByColor(color);
        }
        this.close();
      },
    }).parentWidget(this);
    // 重置
    this.resetColorButton = new BorderColorContextMenuItem('重置', new Icon('clear-color'));
    // 颜色筛选
    this.defaultColorArrayItem = new BorderColorContextMenuItem();
    this.defaultColorArrayItem.removeClass('hover');
    this.defaultColorArray = new ColorArray({
      selectCb: (item) => {
        const { color } = item.options;
        if (color) {
          this.options.onUpdate(color);
        }
        this.customizeColorArray.setActiveByColor(null);
        this.close();
      },
    });
    this.defaultColorArrayItem.childrenNodes(this.defaultColorArray);
    // 历史选中
    this.customizeColorArray = new ColorArray({
      colors: [
        new ColorItem({ icon: this.plus }),
      ],
      selectCb: (item) => {
        const { color } = item.options;
        if (color) {
          this.options.onUpdate(color);
          this.defaultColorArray.setActiveByColor(null);
          this.close();
        } else {
          const activeColor = this.customizeColorArray.activeColor
            || this.defaultColorArray.activeColor;
          this.colorPicker.open(activeColor);
        }
      },
    });
    this.plus = new Icon('plus');
    this.customizeColorArrayItem = new BorderColorContextMenuItem();
    this.customizeColorTitle = h('div', `${cssPrefix}-border-color-context-menu-color-title`);
    this.customizeColorTitle.text('自定义');
    this.customizeColorArrayItem.removeClass('hover');
    this.customizeColorArrayItem.childrenNodes(this.customizeColorTitle);
    this.customizeColorArrayItem.childrenNodes(this.customizeColorArray);
    // 菜单元素追加子节点
    this.addItem(this.resetColorButton);
    this.addItem(this.defaultColorArrayItem);
    this.addItem(new ELContextMenuDivider());
    this.addItem(this.customizeColorArrayItem);
    this.bind();
  }

  unbind() {
    XEvent.unbind(this.resetColorButton);
  }

  bind() {
    XEvent.bind(this.resetColorButton, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
      this.options.onUpdate('rgb(0,0,0)');
      this.customizeColorArray.setActiveByColor(null);
      this.defaultColorArray.setActiveByColor(null);
    });
  }

  setActiveByColor(color) {
    this.customizeColorArray.setActiveByColor(color);
    this.defaultColorArray.setActiveByColor(color);
  }

  clearCustomizeColor() {
    this.customizeColorArray.clear();
    this.customizeColorArray.add(new ColorItem({ icon: this.plus }));
  }

  addCustomizeColor(color) {
    const result = this.defaultColorArray.findItemByColor(color);
    if (!result) {
      this.customizeColorArray.add(new ColorItem({ color }));
      return true;
    }
    return false;
  }

  destroy() {
    super.destroy();
    this.unbind();
  }

}

export { BorderColorContextMenu };
