import { cssPrefix } from '../../const/Constant';
import { SheetUtils } from '../../utils/SheetUtils';
import { Layer } from '../Layer';

class HorizontalLayer extends Layer {

  constructor(options) {
    super(`${cssPrefix}-horizontal-layer`);
    this.options = SheetUtils.copy({
      style: {},
    }, options);
    this.css(this.options.style);
  }
}

export { HorizontalLayer };
