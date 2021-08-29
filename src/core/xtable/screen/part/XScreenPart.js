import { Widget } from '../../../../lib/Widget';
import { cssPrefix } from '../../../../const/Constant';

class XScreenPart extends Widget {

  constructor(className) {
    super(`${cssPrefix}-x-screen-part ${className}`);
    this.xScreenZone = null;
  }

  onAttach(xScreenZone) {
    this.xScreenZone = xScreenZone;
  }

}

export {
  XScreenPart,
};
