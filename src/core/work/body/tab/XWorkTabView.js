import { Widget } from '../../../../lib/Widget';
import { cssPrefix, Constant } from '../../../../const/Constant';
import { SheetUtils } from '../../../../utils/SheetUtils';
import { XEvent } from '../../../../lib/XEvent';
import { TabContextMenu } from './contextmenu/TabContextMenu';
import { ElPopUp } from '../../../../module/elpopup/ElPopUp';

const settings = {
  showMenu: true,
  onAdd(tab) { return tab; },
  onSwitch(tab) { return tab; },
};

/**
 * XWorkTabView
 */
class XWorkTabView extends Widget {

  /**
   * XWorkTabView
   * @param options
   */
  constructor(options) {
    super(`${cssPrefix}-sheet-switch-tab`);
    this.options = SheetUtils.copy({
      onSwitch: () => {},
      onAdded: () => {},
      onRemove: () => {},
    }, settings, options);
  }

  /**
   * 初始化
   */
  onAttach() {
    this.activeIndex = -1;
    this.left = null;
    this.tabList = [];
    this.last = new Widget(`${cssPrefix}-switch-tab-last-btn`);
    this.next = new Widget(`${cssPrefix}-switch-tab-next-btn`);
    this.tabs = new Widget(`${cssPrefix}-sheet-tab-tabs`);
    this.plus = new Widget(`${cssPrefix}-sheet-tab-plus`);
    this.content = new Widget(`${cssPrefix}-sheet-tab-content`);
    this.content.attach(this.tabs);
    super.attach(this.last);
    super.attach(this.next);
    super.attach(this.content);
    super.attach(this.plus);
    this.contextMenu = new TabContextMenu({
      onUpdate: (name, type) => {
        const { tab } = this.contextMenu;
        switch (type) {
          case 1: {
            this.options.onRemove(tab);
            break;
          }
          case 2: {
            break;
          }
          case 3: {
            break;
          }
          case 4: {
            break;
          }
          case 5: {
            break;
          }
        }
      },
    }).parentWidget(this);
    this.bind();
  }

  /**
   * 解绑事件处理
   */
  unbind() {
    const { next, last, plus } = this;
    XEvent.unbind(next);
    XEvent.unbind(last);
    XEvent.unbind(plus);
  }

  /**
   * 绑定事件处理
   */
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
      this.options.onAdded();
      this.offsetLast();
    });
  }

  /**
   * 移动到最后一个tab
   */
  offsetLast() {
    const maxWidth = this.content.offset().width;
    const current = this.tabs.offset().width;
    if (current > maxWidth) {
      this.left = -(current - maxWidth);
      this.tabs.css('marginLeft', `${this.left}px`);
    }
  }

  /**
   * 添加一个新的tab
   */
  attach(tab) {
    this.tabs.attach(tab);
    this.tabList.push(tab);
    tab.setRClick((event) => {
      if (this.options.showMenu) {
        const { contextMenu } = this;
        const { elPopUp } = contextMenu;
        elPopUp.setEL(tab);
        ElPopUp.closeAll([elPopUp]);
        contextMenu.open();
        contextMenu.setTab(tab);
        event.stopPropagation();
        event.preventDefault();
      }
    });
    tab.setLClick((event) => {
      this.setActive(tab);
      this.options.onSwitch(tab, event);
    });
    tab.onAttach();
  }

  /**
   * 激活指定索引的tab
   * @param index
   * @returns {*}
   */
  setActiveByIndex(index = 0) {
    const { tabList } = this;
    const tab = tabList[index];
    this.setActive(tab);
    return tab;
  }

  /**
   * 激活指定tab
   * @param tab
   * @returns {*}
   */
  setActive(tab) {
    if (tab) {
      this.activeIndex = this.getIndexByTab(tab);
      tab.addClass('active');
      tab.sibling().forEach((item) => {
        item.removeClass('active');
      });
    }
  }

  /**
   * 获取最后一个索引
   * @returns {number}
   */
  getLastIndex() {
    return this.tabList.length - 1;
  }

  /**
   * 获取tab的索引
   * @param tab
   * @returns {number}
   */
  getIndexByTab(tab) {
    return this.tabList.findIndex(item => item === tab);
  }

  /**
   * 获取当前激活的tab
   * @returns {*}
   */
  getActiveTab() {
    return this.tabList[this.activeIndex];
  }

  /**
   * 销毁当前组件
   */
  destroy() {
    super.destroy();
    this.unbind();
    this.contextMenu.destroy();
  }

  /**
   * 获取sheet数量
   * @returns {number}
   */
  getTabCount() {
    return this.tabList.length;
  }

  /**
   * 删除指定索引的tab
   * @param index
   */
  removeByIndex(index) {
    const { activeIndex, tabList } = this;
    const remove = tabList[index];
    tabList.splice(index, 1);
    if (remove) {
      remove.destroy();
    }
    const length = this.getTabCount() - 1;
    if (activeIndex >= length) {
      this.activeIndex = length;
    }
    const active = this.getActiveTab();
    this.setActive(active);
  }
}

export { XWorkTabView };
