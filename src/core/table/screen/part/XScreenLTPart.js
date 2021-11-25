import { XScreenPart } from './XScreenPart';
import { cssPrefix } from '../../../../const/Constant';

class XScreenLTPart extends XScreenPart {

  constructor(className = '') {
    super(`${cssPrefix}-x-screen-lt-part ${className}`);
  }

}

export {
  XScreenLTPart,
};
