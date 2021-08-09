import { Widget } from '../../../lib/Widget';
import { cssPrefix } from '../../../const/Constant';
import { h } from '../../../lib/Element';
import { SheetUtils } from '../../../utils/SheetUtils';

class ValueItem extends Widget {

  constructor({
    text = SheetUtils.EMPTY,
    index = -1,
    status = false,
  }) {
    super(`${cssPrefix}-value-filter-item`);
    this.text = text;
    this.status = status;
    this.index = index;
    this.iconEle = h('div', `${cssPrefix}-value-filter-item-icon`);
    this.textEle = h('div', `${cssPrefix}-value-filter-item-text`);
    this.textEle.text(text);
    this.attr('title', text);
    this.children(this.iconEle);
    this.children(this.textEle);
    this.setIndex(index);
    this.setStatus(status);
  }

  setStatus(status) {
    this.status = status;
    if (this.status) {
      this.iconEle.css('opacity', 1);
    } else {
      this.iconEle.css('opacity', 0);
    }
  }

  setIndex(index) {
    this.index = index;
    this.attr(`${cssPrefix}-value-filter-item-index`, `${this.index}`);
  }

  equals(item) {
    return this.text === item.text;
  }

}

export {
  ValueItem,
};
