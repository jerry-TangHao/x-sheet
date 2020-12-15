import { cssPrefix } from '../../../const/Constant';
import { PlainUtils } from '../../../utils/PlainUtils';
import { Layer } from '../../Layer';

class HorizontalCenterElement extends Layer {

  constructor(element, options) {
    super(`${cssPrefix}-horizontal-center-element`);
    this.options = PlainUtils.mergeDeep({
      style: {},
    }, options);
    this.css(this.options.style);
  }
}

export { HorizontalCenterElement };
