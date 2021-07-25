import { Constant, cssPrefix } from '../../../../const/Constant';
import { DropInputItem } from './base/DropInputItem';
import { XEvent } from '../../../../libs/XEvent';
import { FontAngleValueContextMenu } from './contextmenu/fontanglevalue/FontAngleValueContextMenu';
import { PlainUtils } from '../../../../utils/PlainUtils';

class FontAngleValue extends DropInputItem {

  constructor({
    onChange = () => {},
  }) {
    super(`${cssPrefix}-tools-angle-value`);
    this.onChange = onChange;
    this.value = 0;
    this.fontAngleValueContextMenu = new FontAngleValueContextMenu({
      onUpdate: (item) => {
        const { angleValue } = item;
        this.setValue(angleValue);
        this.onChange(angleValue);
      },
      el: this,
    });
    this.input.val(this.value);
    this.input.attr('type', 'number');
    this.bind();
  }

  unbind() {
    const { icon } = this;
    XEvent.unbind(icon);
  }

  bind() {
    const { fontAngleValueContextMenu, icon, input } = this;
    XEvent.bind(icon, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
      if (fontAngleValueContextMenu.isClose()) {
        fontAngleValueContextMenu.open();
      } else {
        fontAngleValueContextMenu.close();
      }
    });
    XEvent.bind(input, Constant.SYSTEM_EVENT_TYPE.CHANGE, () => {
      const target = PlainUtils.parseInt(input.val());
      this.value = target;
      this.onChange(target);
    });
  }

  setValue(value) {
    this.value = value;
    return super.setValue(value);
  }

  destroy() {
    super.destroy();
    this.unbind();
    this.fontAngleValueContextMenu.destroy();
  }

}

export {
  FontAngleValue,
};
