import { Widget } from '../../../../libs/Widget';
import { cssPrefix } from '../../../../const/Constant';

class XScreenZone extends Widget {

  constructor(className) {
    super(`${cssPrefix}-x-screen-zone ${className}`);
  }

}

export {
  XScreenZone,
};
