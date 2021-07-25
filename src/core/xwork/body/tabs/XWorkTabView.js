import { Widget } from '../../../../libs/Widget';
import { cssPrefix, Constant } from '../../../../const/Constant';
import { h } from '../../../../libs/Element';
import { PlainUtils } from '../../../../utils/PlainUtils';
import { XEvent } from '../../../../libs/XEvent';

const settings = {
  onAdd(tab) { return tab; },
  onSwitch(tab) { return tab; },
};

class XWorkTabView extends Widget {

  constructor(options) {
    super(`${cssPrefix}-sheet-switch-tab`);
    this.last = h('div', `${cssPrefix}-switch-tab-last-btn`);
    this.next = h('div', `${cssPrefix}-switch-tab-next-btn`);
    this.content = h('div', `${cssPrefix}-sheet-tab-content`);
    this.tabs = h('div', `${cssPrefix}-sheet-tab-tabs`);
    this.plus = h('div', `${cssPrefix}-sheet-tab-plus`);
    this.content.children(this.tabs);
    this.children(...[
      this.last,
      this.next,
      this.content,
      this.plus,
    ]);
    this.options = PlainUtils.copy({}, settings, options);
    this.left = null;
    this.tabList = [];
  }

  onAttach() {
    this.bind();
  }

  offsetSizeLeft() {
    const maxWidth = this.content.offset().width;
    const current = this.tabs.offset().width;
    if (current > maxWidth) {
      this.left = -(current - maxWidth);
      this.tabs.css('marginLeft', `${this.left}px`);
    }
  }

  unbind() {
    const { next, last, plus } = this;
    XEvent.unbind(next);
    XEvent.unbind(last);
    XEvent.unbind(plus);
  }

  bind() {
    const { next, last, plus } = this;
    XEvent.bind(next, Constant.SYSTEM_EVENT_TYPE.CLICK, () => {
      const maxWidth = this.content.offset().width;
      const current = this.tabs.offset().width;
      const min = -(current - maxWidth);
      let left = this.left || 0;
      left -= 30;
      if (left < min) left = min;
      this.left = left;
      this.tabs.css('marginLeft', `${this.left}px`);
    });
    XEvent.bind(last, Constant.SYSTEM_EVENT_TYPE.CLICK, () => {
      let left = this.left || 0;
      left += 30;
      if (left > 0) left = 0;
      this.left = left;
      this.tabs.css('marginLeft', `${this.left}px`);
    });
    XEvent.bind(plus, Constant.SYSTEM_EVENT_TYPE.CLICK, () => {
      this.options.onAdd();
      this.offsetSizeLeft();
    });
  }

  attach(tab) {
    this.tabList.push(tab);
    this.tabs.children(tab);
    tab.onAttach();
    XEvent.bind(tab, Constant.SYSTEM_EVENT_TYPE.CLICK, () => {
      this.setActive(tab);
      this.options.onSwitch(tab);
    });
  }

  setActiveTab(index) {
    const { tabList } = this;
    if (tabList[index]) {
      this.setActive(tabList[index]);
      return tabList[index];
    }
    return null;
  }

  setActive(tab) {
    tab.addClass('active');
    tab.sibling().forEach((item) => {
      item.removeClass('active');
    });
  }

  getLastIndex() {
    return this.tabList.length - 1;
  }

  destroy() {
    super.destroy();
    this.unbind();
  }

}

export { XWorkTabView };
