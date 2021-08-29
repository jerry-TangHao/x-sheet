/* global document */
import { Widget } from '../../lib/Widget';
import { h } from '../../lib/Element';
import { cssPrefix } from '../../const/Constant';

class Mask extends Widget {

  constructor() {
    super(`${cssPrefix}-mask`);
    this.root = h(document.body);
    this.status = false;
    this.css('position', 'absolute');
    this.css('background', 'rgba(0,0,0,0.3)');
  }

  setLeft(left) {
    this.offset({ left });
    return this;
  }

  setTop(top) {
    this.offset({ top });
    return this;
  }

  setHeight(height) {
    this.offset({ height });
    return this;
  }

  setWidth(width) {
    this.offset({ width });
    return this;
  }

  setOpacity(val) {
    this.css('opacity', val);
    return this;
  }

  open() {
    if (this.status === false) {
      this.root.childrenNodes(this);
      this.status = true;
    }
    return this;
  }

  close() {
    if (this.status === true) {
      this.root.remove(this);
      this.status = false;
    }
    return this;
  }

  setRoot(element) {
    if (element.el) {
      element = h(element.el);
    } else {
      element = h(element);
    }
    this.root = element;
    return this;
  }

}

export {
  Mask,
};
