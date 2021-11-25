import { Item } from './Item';
import { cssPrefix } from '../../../../../const/Constant';
import { h } from '../../../../../lib/Element';
import { Icon } from '../Icon';

class DropDownItem extends Item {

  constructor(className) {
    super(`${cssPrefix}-tools-drop-down-item ${className}`);
    this.drop = h('div', `${cssPrefix}-tools-drop-down-item-mark`);
    this.title = h('div', `${cssPrefix}-tools-drop-down-item-title`);
    this.drop.childrenNodes(new Icon('arrow-down'));
    this.childrenNodes(this.title);
    this.childrenNodes(this.drop);
  }

  setTitle(text) {
    this.title.text(text);
  }

  setIcon(icon) {
    this.title.html('');
    this.title.childrenNodes(icon);
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
