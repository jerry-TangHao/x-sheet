import { ELContextMenuItem } from '../../contextmenu/ELContextMenuItem';
import { Constant, cssPrefix } from '../../../const/Constant';
import { h } from '../../../lib/Element';
import { SearchInput } from '../../form/input/SearchInput';
import { w } from '../../../lib/Widget';
import { XEvent } from '../../../lib/XEvent';
import { SheetUtils } from '../../../utils/SheetUtils';

/**
 * ValueFilter
 */
class ValueFilter extends ELContextMenuItem {

  /**
   * ValueFilter
   */
  constructor() {
    super(`${cssPrefix}-filter-data-menu-item ${cssPrefix}-value-filter`);
    this.filterExp = null;
    this.items = [];
    this.filters = [];
    this.status = true;
    this.value = SheetUtils.EMPTY;
    // 值过滤标题
    this.titleEle = h('div', `${cssPrefix}-value-filter-title`);
    this.titleTextEle = h('span', `${cssPrefix}-value-filter-title-text`);
    this.titleIconEle = h('span', `${cssPrefix}-value-filter-title-icon`);
    this.titleTextEle.text('按值过滤');
    this.titleEle.children(this.titleIconEle);
    this.titleEle.children(this.titleTextEle);
    this.children(this.titleEle);
    // 操作按钮
    this.optionBoxEle = h('div', `${cssPrefix}-value-filter-option-box`);
    this.selectEle = h('div', `${cssPrefix}-value-filter-option-select`);
    this.flagEle = h('div', `${cssPrefix}-value-filter-option-flag`);
    this.clearEle = h('div', `${cssPrefix}-value-filter-option-clear`);
    this.clearEle.text('清空');
    this.flagEle.html('&nbsp;-&nbsp;');
    this.selectEle.text('全选');
    this.optionBoxEle.children(this.selectEle);
    this.optionBoxEle.children(this.flagEle);
    this.optionBoxEle.children(this.clearEle);
    this.children(this.optionBoxEle);
    // 搜索框
    this.searchBoxEle = h('div', `${cssPrefix}-value-filter-input-box`);
    this.searchInput = new SearchInput();
    this.searchBoxEle.children(this.searchInput);
    this.children(this.searchBoxEle);
    // 条目盒子
    this.itemsBox = h('div', `${cssPrefix}-value-filter-items-box`);
    this.children(this.itemsBox);
    // 事件处理
    this.hide();
    this.bind();
    this.removeClass('hover');
  }

  /**
   * 卸载事件
   */
  unbind() {
    const { titleEle, selectEle, clearEle, searchInput } = this;
    XEvent.unbind(clearEle);
    XEvent.unbind(titleEle);
    XEvent.unbind(selectEle);
    XEvent.unbind(searchInput);
  }

  /**
   * 绑定事件
   */
  bind() {
    const { titleEle, itemsBox, selectEle, clearEle, searchInput } = this;
    const clazz = `${cssPrefix}-value-filter-item`;
    XEvent.bind(selectEle, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
      this.selectAll();
    });
    XEvent.bind(titleEle, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
      if (this.status) {
        this.hide();
      } else {
        this.show();
      }
    });
    XEvent.bind(itemsBox, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      const { items } = this;
      const { target } = e;
      const ele = w(target).closestClass(clazz);
      if (ele) {
        const index = ele.attr(`${cssPrefix}-value-filter-item-index`);
        const item = items[index];
        item.setStatus(!item.status);
      }
    });
    XEvent.bind(clearEle, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
      this.clearAll();
    });
    XEvent.bind(searchInput, Constant.FORM_EVENT_TYPE.SEARCH_INPUT_CHANGE, (e) => {
      const { detail } = e;
      const { value } = detail;
      if (!SheetUtils.isBlank(value)) {
        this.filterExp = new RegExp(`.?${value}.?`);
      } else {
        this.filterExp = null;
      }
      this.value = value;
      this.filterItems();
    });
  }

  /**
   * 添加单项
   * @param valueItem
   */
  addItem(valueItem) {
    valueItem.setIndex(this.items.length);
    this.items.push(valueItem);
    this.itemsBox.children(valueItem);
  }

  /**
   * 过滤筛选项
   */
  filterItems() {
    const { filterExp, items, itemsBox } = this;
    const filters = [];
    itemsBox.empty();
    if (filterExp) {
      // 筛选符合条件的元素
      items.forEach((item) => {
        const { text } = item;
        if (filterExp.test(text)) {
          filters.push(item);
        }
      });
      // 显示筛选内容
      filters.forEach((item) => {
        itemsBox.children(item);
      });
    } else {
      items.forEach((item) => {
        itemsBox.children(item);
      });
    }
    this.filters = filters;
  }

  /**
   * 设置搜索值
   * @param value
   */
  setValue(value) {
    const { searchInput } = this;
    if (SheetUtils.isBlank(value)) {
      value = SheetUtils.EMPTY;
    }
    searchInput.setValue(value);
  }

  /**
   * 获取搜索值
   */
  getValue() {
    return this.value;
  }

  /**
   * 获取选中的项目
   */
  getSelectItems() {
    const { items, filters } = this;
    const selectItems = [];
    if (filters.length > 0) {
      filters.forEach((item) => {
        if (item.status) {
          selectItems.push(item);
        }
      });
    } else {
      items.forEach((item) => {
        if (item.status) {
          selectItems.push(item);
        }
      });
    }
    return selectItems;
  }

  /**
   * 显示控件
   */
  show() {
    this.titleIconEle.addClass('active');
    this.status = true;
    this.optionBoxEle.show();
    this.searchBoxEle.show();
    this.itemsBox.show();
    return this;
  }

  /**
   * 隐藏控件
   */
  hide() {
    this.titleIconEle.removeClass('active');
    this.status = false;
    this.optionBoxEle.hide();
    this.searchBoxEle.hide();
    this.itemsBox.hide();
    return this;
  }

  /**
   * 选中所有子项
   */
  selectAll() {
    const { items } = this;
    items.forEach((item) => {
      item.setStatus(true);
    });
  }

  /**
   * 清除所有子项
   */
  clearAll() {
    const { items } = this;
    items.forEach((item) => {
      item.setStatus(false);
    });
  }

  /**
   * 清空内容
   */
  emptyAll() {
    this.itemsBox.empty();
    this.items = [];
  }

  /**
   * 是否符合筛选条件
   * @param items
   */
  qualified(items) {

  }

  /**
   * 销毁组件
   */
  destroy() {
    super.destroy();
    this.unbind();
    this.searchInput.destroy();
  }

}

export {
  ValueFilter,
};
