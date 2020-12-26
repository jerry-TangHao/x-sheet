import { cssPrefix } from '../../const/Constant';
import { PlainUtils } from '../../utils/PlainUtils';
import { Layer } from '../Layer';

class LayerBar extends Layer {

  constructor(options) {
    super(`${cssPrefix}-layer-bar`);
    this.options = PlainUtils.mergeDeep({
      style: {},
    }, options);
    this.css(this.options.style);
  }
}

export { LayerBar };
