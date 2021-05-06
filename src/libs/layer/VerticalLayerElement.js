import { cssPrefix } from '../../const/Constant';
import { PlainUtils } from '../../utils/PlainUtils';
import { Layer } from '../Layer';

class VerticalLayerElement extends Layer {
  constructor(options) {
    super(`${cssPrefix}-vertical-layer-element`);
    this.options = PlainUtils.copy({
      style: {
        flexGrow: '0',
      },
    }, options);
    this.css(this.options.style);
  }
}

export { VerticalLayerElement };
