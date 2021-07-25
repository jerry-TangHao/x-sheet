import { Widget } from '../../../../libs/Widget';
import { cssPrefix } from '../../../../const/Constant';
import { h } from '../../../../libs/Element';

class Icon extends Widget {

  constructor(className = '') {
    super(`${cssPrefix}-icon`);
    this.iconNameEl = h('div', `${cssPrefix}-icon-img ${className}`);
    this.children(this.iconNameEl);
  }

  setWidth(width) {
    this.iconNameEl.css('width', `${width}px`);
  }

  setHeight(height) {
    this.iconNameEl.css('height', `${height}px`);
  }

}

export { Icon };
