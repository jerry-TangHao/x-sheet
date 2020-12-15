import { ELContextMenu } from '../../../../../component/contextmenu/ELContextMenu';
import { cssPrefix, Constant } from '../../../../../const/Constant';
import { ColorArray } from '../../../../../component/colorpicker/colorarray/ColorArray';
import { h } from '../../../../../lib/Element';
import { ColorItem } from '../../../../../component/colorpicker/colorarray/ColorItem';
import { ELContextMenuDivider } from '../../../../../component/contextmenu/ELContextMenuDivider';
import { Icon } from '../../Icon';
import { PlainUtils } from '../../../../../utils/PlainUtils';

import { FillColorContextMenuItem } from './FillColorContextMenuItem';
import { ColorPicker } from '../../../../../component/colorpicker/ColorPicker';
import { XEvent } from '../../../../../lib/XEvent';

class FillColorContextMenu extends ELContextMenu {

  constructor(options = {}) {
    super(`${cssPrefix}-font-color-context-menu`, PlainUtils.mergeDeep({
      onUpdate: () => {},
    }, options));
    this.colorPicker = new ColorPicker({
      selectCb: (color) => {
        const item = new ColorItem({ color });
        this.customizeColorArray.add(item);
        this.customizeColorArray.setActiveByColor(color);
        this.colorArray.setActiveByColor(null);
        this.options.onUpdate(color);
        this.close();
      },
    });
    // 重置
    this.reset = new FillColorContextMenuItem('重置', new Icon('clear-color'));
    // 颜色筛选
    this.array = new FillColorContextMenuItem();
    this.array.removeClass('hover');
    this.colorArray = new ColorArray({
      selectCb: (item) => {
        const { color } = item.options;
        if (color) this.options.onUpdate(color);
        this.customizeColorArray.setActiveByColor(null);
        this.close();
      },
    });
    this.array.children(this.colorArray);
    // 历史选中
    this.title = h('div', `${cssPrefix}-font-color-context-menu-color-title`);
    this.title.text('自定义');
    this.plus = new Icon('plus');
    this.customizeColorArray = new ColorArray({
      colors: [
        new ColorItem({ icon: this.plus }),
      ],
      selectCb: (item) => {
        const { color } = item.options;
        if (color) {
          this.options.onUpdate(color);
          this.colorArray.setActiveByColor(null);
          this.close();
        } else {
          this.colorPicker.open(this.customizeColorArray.activeColor);
        }
      },
    });
    this.customize = new FillColorContextMenuItem();
    this.customize.removeClass('hover');
    this.customize.children(this.title);
    this.customize.children(this.customizeColorArray);
    // 菜单元素追加子节点
    this.addItem(this.reset);
    this.addItem(this.array);
    this.addItem(new ELContextMenuDivider());
    this.addItem(this.customize);
    this.bind();
  }

  unbind() {
    XEvent.bind(this.reset);
  }

  bind() {
    XEvent.bind(this.reset, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
      this.options.onUpdate(null);
      this.customizeColorArray.setActiveByColor(null);
      this.colorArray.setActiveByColor(null);
    });
  }

  setActiveByColor(color) {
    this.customizeColorArray.setActiveByColor(color);
    this.colorArray.setActiveByColor(color);
  }

  destroy() {
    super.destroy();
    this.unbind();
  }

}

export { FillColorContextMenu };
