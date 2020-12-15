import { cssPrefix } from '../../const/Constant';
import { PlainUtils } from '../../utils/PlainUtils';
import { Layer } from '../Layer';

class VerticalLayer extends Layer {

  constructor(options) {
    super(`${cssPrefix}-vertical-layer`);
    this.options = PlainUtils.mergeDeep({
      style: {},
    }, options);
    this.css(this.options.style);
  }
}

export { VerticalLayer };
