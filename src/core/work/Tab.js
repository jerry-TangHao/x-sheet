import { Widget } from '../../libs/Widget';
import { cssPrefix } from '../../const/Constant';

let number = 1;

class Tab extends Widget {

  constructor(name = `Sheet${number}`) {
    super(`${cssPrefix}-sheet-tab`);
    number += 1;
    this.setName(name);
  }

  setName(name) {
    this.name = name;
    this.text(this.name);
  }

}

export { Tab };
