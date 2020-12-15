import { cssPrefix } from '../../../../const/Constant';
import { XScreenZone } from './XScreenZone';

class XScreenLTZone extends XScreenZone {

  constructor(xScreen) {
    super(`${cssPrefix}-x-screen-lt-zone`);
    this.xScreen = xScreen;
  }

}

export {
  XScreenLTZone,
};
