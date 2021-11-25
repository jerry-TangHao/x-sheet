import { cssPrefix } from '../../../const/Constant';
import { SheetUtils } from '../../../utils/SheetUtils';
import { Layer } from '../../Layer';

class VerticalCenter extends Layer {
  constructor(options) {
    super(`${cssPrefix}-vertical-center`);
    this.options = SheetUtils.copy({
      style: {},
    }, options);
    this.css(this.options.style);
  }
}

export { VerticalCenter };
