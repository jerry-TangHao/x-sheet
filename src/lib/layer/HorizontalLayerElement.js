import { cssPrefix } from '../../const/Constant';
import { PlainUtils } from '../../utils/PlainUtils';
import { Layer } from '../Layer';

class HorizontalLayerElement extends Layer {

  constructor(options) {
    super(`${cssPrefix}-horizontal-layer-element`);
    this.options = PlainUtils.mergeDeep({
      style: {
        flexGrow: '0',
      },
    }, options);
    this.css(this.options.style);
  }
}

export { HorizontalLayerElement };
