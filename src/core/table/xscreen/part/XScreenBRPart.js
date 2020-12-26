import { XScreenPart } from './XScreenPart';
import { cssPrefix } from '../../../../const/Constant';

class XScreenBRPart extends XScreenPart {

  constructor(className = '') {
    super(`${cssPrefix}-x-screen-br-part ${className}`);
  }

}

export {
  XScreenBRPart,
};
