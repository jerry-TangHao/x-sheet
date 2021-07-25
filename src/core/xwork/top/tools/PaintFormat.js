import { Item } from './base/Item';
import { cssPrefix } from '../../../../const/Constant';
import { Icon } from './Icon';

class PaintFormat extends Item {

  constructor() {
    super(`${cssPrefix}-tools-point-format`);
    this.icon = new Icon('point-format');
    this.sheets = [];
    this.children(this.icon);
  }

  addSheet(sheet) {
    this.sheets.push(sheet);
  }

  removeSheet(sheet) {
    for (let i = 0; i < this.sheets.length; i += 1) {
      if (this.sheets[i] === sheet) {
        this.sheets.splice(i, 1);
        return;
      }
    }
  }

  includeSheet(sheet) {
    for (let i = 0; i < this.sheets.length; i += 1) {
      if (this.sheets[i] === sheet) {
        return true;
      }
    }
    return false;
  }

}

export { PaintFormat };
