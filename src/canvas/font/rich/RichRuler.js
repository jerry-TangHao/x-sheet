import { BaseRuler } from '../BaseRuler';
import { PlainUtils } from '../../../utils/PlainUtils';

class RichRuler extends BaseRuler {

  constructor({
    draw, rich,
  }) {
    super({ draw });
    this.rich = rich;
  }

  richHasBreak() {
    for (let i = 0, len = this.rich.length; i < len; i++) {
      const item = this.rich[i];
      if (item.text.indexOf('\n') > -1) {
        return true;
      }
    }
    return false;
  }

  isBlank() {
    if (PlainUtils.isUnDef(this.rich)) {
      return true;
    }
    for (let i = 0, len = this.rich.length; i < len; i++) {
      const item = this.rich[i];
      if (item.text) {
        return false;
      }
    }
    return true;
  }

  textBreak(text) {
    return text.split(/\n/);
  }

}

export {
  RichRuler,
};
