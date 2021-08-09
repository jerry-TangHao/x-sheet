import { cssPrefix } from '../../../const/Constant';
import { SheetUtils } from '../../../utils/SheetUtils';
import { Layer } from '../../Layer';

class HorizontalCenter extends Layer {

  constructor(options) {
    super(`${cssPrefix}-horizontal-center`);
    this.options = SheetUtils.copy({
      style: {},
    }, options);
    this.css(this.options.style);
  }
}

export { HorizontalCenter };
