import { Widget } from '../../../../lib/Widget';
import { cssPrefix, Constant } from '../../../../const/Constant';
import { SheetUtils } from '../../../../utils/SheetUtils';
import { XEvent } from '../../../../lib/XEvent';
import { TabContextMenu } from './contextmenu/TabContextMenu';
import { ElPopUp } from '../../../../module/elpopup/ElPopUp';
import { Element } from '../../../../lib/Element';
import { SlideTabBar } from '../../../../lib/slidebar/SlideTabBar';
import { Alert } from '../../../../module/alert/Alert';

const settings = {
  showMenu: true,
  showAdd: true,
  onAdd(tab) { return tab; },
  onSwitch(tab) { return tab; },
};

/**
 * XWorkTabView
 */
class XWorkTabView extends Widget {

  _reloadSlideTabBar() {
    if (this.slideTabBar) {
      this.slideTabBar.destroy();
    }
    this.slideTabBar = new SlideTabBar({
      onSlideTabDragEnd: () => {
        const items = this.slideTabBar.getSlideTabItems().map((item) => item.primeval());
        const activeTab = this.tabList[this.activeIndex];
        this.tabList.sort((a, b) => {
          let ai = items.indexOf(a.el);
          let bi = items.indexOf(b.el);
          return ai > bi ? 1 : -1;
        });
        this.activeIndex = this.tabList.indexOf(activeTab);
        console.log(this.activeIndex);
        this.options.onSort();
      },
      onSlideTabChangeName: (el) => {
        const tab = this.tabList.find((tab) => tab.el === el);
        if (tab) {
          const name = Element.wrapElement(tab.el).text();
          tab.setName(name);
        }
      },
      slideTabActiveClassName: 'active',
      slideTabRootContainer: this.el,
      slideTabBarClassName: `${cssPrefix}-sheet-tab-tabs`,
      slideTabItemClassName: `${cssPrefix}-sheet-tab`,
    });
  }

  /**
   * XWorkTabView
   * @param options
   */
  constructor(options) {
    super(`${cssPrefix}-slide-tab-container`);
    this.tabList = [];
    this.options = SheetUtils.copy({
      onSwitch: () => {},
      onAdded: () => {},
      onRemove: () => {},
      onSort: () => {},
    }, settings, options);
  }

  /**
   * 初始化
   */
  onAttach() {
    this.activeIndex = -1;
    this.left = null;
    this.tabList = [];
    this.last = new Widget(`${cssPrefix}-slide-tab-last-btn`);
    this.next = new Widget(`${cssPrefix}-slide-tab-next-btn`);
    this.tabs = new Widget(`${cssPrefix}-sheet-tab-tabs`);
    this.add = new Widget(`${cssPrefix}-slide-tab-add-btn`);
    this.content = new Widget(`${cssPrefix}-slide-tab-content`);
    this.content.attach(this.tabs);
    super.attach(this.last);
    super.attach(this.next);
    super.attach(this.content);
    if (this.options.showAdd) {
      super.attach(this.add);
    }
    this.contextMenu = new TabContextMenu({
      onUpdate: (name, type) => {
        const { tab } = this.contextMenu;
        switch (type) {
          case 1: {
            if (this.getTabSize() > 1) {
              this.options.onRemove(tab);
            } else {
              new Alert({
                message: '需要保留一个Sheet',
              }).parentWidget(this).open();
            }
            break;
          }
          case 2: {
            new Alert({
              message: '开发人员正在努力施工中....',
            }).parentWidget(this).open();
            break;
          }
          case 3: {
            this.setTabEditorByTab(tab);
            break;
          }
          case 4: {
            new Alert({
              message: '开发人员正在努力施工中....',
            }).parentWidget(this).open();
            break;
          }
          case 5: {
            new Alert({
              message: '开发人员正在努力施工中....',
            }).parentWidget(this).open();
            break;
          }
        }
      },
    }).parentWidget(this);
    this.bind();
    this._reloadSlideTabBar();
  }

  /**
   * 解绑事件处理
   */
  unbind() {
    const { next, last, add } = this;
    XEvent.unbind(next);
    XEvent.unbind(last);
    if (add) {
      XEvent.unbind(add);
    }
  }

  /**
   * 绑定事件处理
   */
  bind() {
    const { next, last, add } = this;
    XEvent.bind(next, Constant.SYSTEM_EVENT_TYPE.CLICK, () => {
      this.slideTabBar.getScrollbar().scrollX(this.slideTabBar.getScrollbar().getScrollX() + 50);
    });
    XEvent.bind(last, Constant.SYSTEM_EVENT_TYPE.CLICK, () => {
      this.slideTabBar.getScrollbar().scrollX(this.slideTabBar.getScrollbar().getScrollX() - 50);
    });
    if (add) {
      XEvent.bind(add, Constant.SYSTEM_EVENT_TYPE.CLICK, () => {
        this.options.onAdded();
      });
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
    this._reloadSlideTabBar();
    this.slideTabBar.getScrollbar().scrollXMax();
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
    return this.tabList.findIndex((item) => item === tab);
  }

  /**
   * 获取tab数量
   */
  getTabSize() {
    return this.tabList.length;
  }

  /**
   * 获取当前激活的tab
   * @returns {*}
   */
  getActiveTab() {
    return this.tabList[this.activeIndex];
  }

  /**
   * 获取指定编号的tab
   * @param index
   */
  getTabByIndex(index) {
    return this.tabList[index];
  }

  /**
   * 设置tab启用编辑
   * @param index
   * @param callback
   */
  setTabEditorByIndex(index, callback) {
    const tab = this.tabList[index];
    this.setTabEditorByTab(tab);
  }

  /**
   * 设置tab启用编辑
   * @param tab
   * @param callback
   */
  setTabEditorByTab(tab, callback) {
    if (tab) {
      this.slideTabBar.editorByElement(tab.el, () => {
        const name = Element.wrapElement(tab.el).text();
        tab.setName(name);
        if (callback) {
          callback(name, tab);
        }
      });
    }
  }

  /**
   * 获取所有tab
   * @returns {XWorkTab[]|[]}
   */
  getTabs() {
    return SheetUtils.newArray(this.tabList);
  }

  /**
   * 销毁当前组件
   */
  destroy() {
    super.destroy();
    this.unbind();
    this.tabList.forEach((tab) => tab.destroy());
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
    this._reloadSlideTabBar();
  }
}

export { XWorkTabView };
