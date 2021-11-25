import { cssPrefix } from '../../../../../const/Constant';
import { XScreenStyleBorderItem } from './XScreenStyleBorderItem';

class XScreenCssBorderItem extends XScreenStyleBorderItem {

  constructor({ table }) {
    super({ table }, `${cssPrefix}-part-border-css`);
    this.type = 'solid';
    this.color = 'rgb(66,166,66)';
    this.setBorderType(this.type);
  }

  setBorderType(type) {
    this.type = type;
    this.blt.addClass(type);
    this.bl.addClass(type);
    this.bt.addClass(type);
    this.bbr.addClass(type);
  }

  setBorderColor(color) {
    this.color = color;
    this.blt.css('border-color', color);
    this.bl.css('border-color', color);
    this.bt.css('border-color', color);
    this.bbr.css('border-color', color);
  }

}

export {
  XScreenCssBorderItem,
};
