import { cssPrefix } from '../../../const/Constant';
import { SheetUtils } from '../../../utils/SheetUtils';
import { Layer } from '../../Layer';

class VerticalCenterElement extends Layer {

  constructor(options) {
    super(`${cssPrefix}-vertical-center-element`);
    this.options = SheetUtils.copy({
      style: {},
    }, options);
    this.css(this.options.style);
  }
}

export { VerticalCenterElement };
