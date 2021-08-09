import { SheetUtils } from './SheetUtils';

class DomUtils {

  static pxToInt(value) {
    value = value.replace('px', '');
    return SheetUtils.parseInt(value);
  }

}

export {
  DomUtils,
};
