import { cssPrefix } from '../../const/Constant';
import { SheetUtils } from '../../utils/SheetUtils';
import { Layer } from '../Layer';

class VerticalLayerElement extends Layer {
  constructor(options) {
    super(`${cssPrefix}-vertical-layer-element`);
    this.options = SheetUtils.copy({
      style: {
        flexGrow: '0',
      },
    }, options);
    this.css(this.options.style);
  }
}

export { VerticalLayerElement };
