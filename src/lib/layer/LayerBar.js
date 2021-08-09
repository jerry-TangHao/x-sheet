import { cssPrefix } from '../../const/Constant';
import { SheetUtils } from '../../utils/SheetUtils';
import { Layer } from '../Layer';

class LayerBar extends Layer {

  constructor(options) {
    super(`${cssPrefix}-layer-bar`);
    this.options = SheetUtils.copy({
      style: {},
    }, options);
    this.css(this.options.style);
  }
}

export { LayerBar };
