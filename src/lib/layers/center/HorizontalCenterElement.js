import { cssPrefix } from '../../../const/Constant';
import { SheetUtils } from '../../../utils/SheetUtils';
import { Layer } from '../../Layer';

class HorizontalCenterElement extends Layer {

  constructor(element, options) {
    super(`${cssPrefix}-horizontal-center-element`);
    this.options = SheetUtils.copy({
      style: {},
    }, options);
    this.css(this.options.style);
  }
}

export { HorizontalCenterElement };
