import { Widget } from '../../../../lib/Widget';
import { cssPrefix } from '../../../../const/Constant';

class XScreenZone extends Widget {

  constructor(className) {
    super(`${cssPrefix}-x-screen-zone ${className}`);
  }

}

export {
  XScreenZone,
};
