import { cssPrefix } from '../../const/Constant';
import { SheetUtils } from '../../utils/SheetUtils';
import { Layer } from '../Layer';

class HorizontalLayerElement extends Layer {

  constructor(options) {
    super(`${cssPrefix}-horizontal-layer-element`);
    this.options = SheetUtils.copy({
      style: {
        flexGrow: '0',
      },
    }, options);
    this.css(this.options.style);
  }
}

export { HorizontalLayerElement };
