import { cssPrefix } from '../../../const/Constant';
import { PlainUtils } from '../../../utils/PlainUtils';
import { Layer } from '../../Layer';

class VerticalCenterElement extends Layer {

  constructor(options) {
    super(`${cssPrefix}-vertical-center-element`);
    this.options = PlainUtils.mergeDeep({
      style: {},
    }, options);
    this.css(this.options.style);
  }
}

export { VerticalCenterElement };
