import { Widget } from '../../../../libs/Widget';
import { cssPrefix } from '../../../../const/Constant';
import { PlainUtils } from '../../../../utils/PlainUtils';

let number = 0;
let include = [];

class XWorkTab extends Widget {

  constructor(name) {
    super(`${cssPrefix}-sheet-tab`);
    this.name = '';
    this.setName(this.getCheckName(name));
  }

  getName() {
    number += 1;
    return `Sheet${number}`;
  }

  setName(name) {
    this.name = name;
    this.text(this.name);
  }

  getCheckName(name) {
    if (PlainUtils.isUnDef(name)) {
      name = this.getName();
    }
    while (include.indexOf(name) > -1) {
      name = this.getName();
    }
    include.push(name);
    return name;
  }

}

export { XWorkTab };
