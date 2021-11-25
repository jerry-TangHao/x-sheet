import { cssPrefix } from '../../const/Constant';
import { SheetUtils } from '../../utils/SheetUtils';
import { Layer } from '../Layer';

class VerticalLayer extends Layer {

  constructor(options) {
    super(`${cssPrefix}-vertical-layer`);
    this.options = SheetUtils.copy({
      style: {},
    }, options);
    this.css(this.options.style);
  }
}

export { VerticalLayer };
