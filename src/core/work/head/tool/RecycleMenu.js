import { Constant, cssPrefix } from '../../../../const/Constant';
import { Icon } from './Icon';
import { Item } from './base/Item';
import { XEvent } from '../../../../lib/XEvent';
import { Throttle } from '../../../../lib/Throttle';

class RecycleMenu extends Item {

  constructor(headMenu) {
    super(`${cssPrefix}-tools-recycle-menu`);
    const throttle = new Throttle();
    this.calculate = () => {
      throttle.action(() => {
        let maxWidth = headMenu.getRootBox().width - this.box().width;
        let nodes = headMenu.childrenNodes();
        let total = 0;
        for (let node of nodes) {
          total += node.box().width;
          if (total > maxWidth && !node.equals(this)) {
            // TODO ...
          }
        }
      });
    };
    this.icon = new Icon('recycle-menu');
    this.childrenNodes(this.icon);
    this.bind();
  }

  bind() {
    super.bind();
    XEvent.bind(window, Constant.SYSTEM_EVENT_TYPE.RESIZE, this.calculate);
  }

  destroy() {
    super.destroy();
    XEvent.unbind(window, Constant.SYSTEM_EVENT_TYPE.RESIZE, this.calculate);
  }

}

export { RecycleMenu };
