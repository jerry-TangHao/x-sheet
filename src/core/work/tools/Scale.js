import { DropDownItem } from './base/DropDownItem';
import { cssPrefix } from '../../../const/Constant';
import { ScaleContextMenu } from './contextmenu/scale/ScaleContextMenu';

class Scale extends DropDownItem {

  constructor(options = { contextMenu: {} }) {
    super(`${cssPrefix}-tools-scale`);
    this.options = options;
    this.setTitle('100%');
    this.setWidth(50);
    this.setEllipsis();
    this.scaleContextMenu = new ScaleContextMenu({
      el: this,
      ...this.options.contextMenu,
    });
  }

  destroy() {
    super.destroy();
    this.scaleContextMenu.destroy();
  }

}

export {
  Scale,
};
