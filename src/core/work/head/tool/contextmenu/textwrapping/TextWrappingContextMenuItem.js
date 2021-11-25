import { ELContextMenuItem } from '../../../../../../module/contextmenu/ELContextMenuItem';
import { cssPrefix } from '../../../../../../const/Constant';

class TextWrappingContextMenuItem extends ELContextMenuItem {
  constructor() {
    super(`${cssPrefix}-text-wrapping-context-menu-item`);
  }
}

export { TextWrappingContextMenuItem };
