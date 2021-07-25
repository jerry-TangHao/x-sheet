import { Item } from './Item';
import { cssPrefix } from '../../../../../const/Constant';
import { h } from '../../../../../libs/Element';
import { Icon } from '../Icon';

class DropDownItem extends Item {

  constructor(className) {
    super(`${cssPrefix}-tools-drop-down-item ${className}`);
    this.drop = h('div', `${cssPrefix}-tools-drop-down-item-mark`);
    this.title = h('div', `${cssPrefix}-tools-drop-down-item-title`);
    this.drop.children(new Icon('arrow-down'));
    this.children(this.title);
    this.children(this.drop);
  }

  setTitle(text) {
    this.title.text(text);
  }

  setIcon(icon) {
    this.title.html('');
    this.title.children(icon);
  }

  setWidth(px) {
    this.title.css('width', `${px}px`);
  }

  setEllipsis() {
    this.title.css('overflow', 'hidden');
    this.title.css('text-overflow', 'ellipsis');
    this.title.css('white-space', 'nowrap');
  }

  removeEllipsis() {
    this.title.cssRemoveKeys('overflow');
    this.title.cssRemoveKeys('text-overflow');
    this.title.cssRemoveKeys('white-space');
  }

}

export { DropDownItem };
