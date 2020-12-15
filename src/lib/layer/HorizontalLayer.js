import { cssPrefix } from '../../const/Constant';
import { PlainUtils } from '../../utils/PlainUtils';
import { Layer } from '../Layer';

class HorizontalLayer extends Layer {

  constructor(options) {
    super(`${cssPrefix}-horizontal-layer`);
    this.options = PlainUtils.mergeDeep({
      style: {},
    }, options);
    this.css(this.options.style);
  }
}

export { HorizontalLayer };
