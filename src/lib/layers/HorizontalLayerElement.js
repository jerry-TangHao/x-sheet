import { cssPrefix } from '../../const/Constant';
import { Layer } from '../Layer';
import { SheetUtils } from '../../utils/SheetUtils';

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
