import { XScreenPart } from './XScreenPart';
import { cssPrefix } from '../../../../const/Constant';

class XScreenLPart extends XScreenPart {

  constructor(className = '') {
    super(`${cssPrefix}-x-screen-l-part ${className}`);
  }

}

export {
  XScreenLPart,
};
