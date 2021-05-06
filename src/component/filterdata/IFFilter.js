import { ELContextMenuItem } from '../contextmenu/ELContextMenuItem';
import { Constant, cssPrefix } from '../../const/Constant';
import { h } from '../../libs/Element';
import { Select } from '../form/select/Select';
import { XEvent } from '../../libs/XEvent';
import { PlainInput } from '../form/input/PlainInput';
import { PlainUtils } from '../../utils/PlainUtils';

/**
 * IFFilter
 */
class IFFilter extends ELContextMenuItem {

  /**
   * IFFilter
   */
  constructor() {
    super(`${cssPrefix}-filter-data-menu-item ${cssPrefix}-if-filter`);
    this.status = false;
    this.type = IFFilter.IF_TYPE.NOT;
    this.value = PlainUtils.EMPTY;
    // 标题
    this.titleEle = h('div', `${cssPrefix}-if-filter-title`);
    this.titleTextEle = h('span', `${cssPrefix}-if-filter-title-text`);
    this.titleIconEle = h('span', `${cssPrefix}-if-filter-title-icon`);
    this.titleTextEle.text('条件过滤');
    this.titleEle.children(this.titleIconEle);
    this.titleEle.children(this.titleTextEle);
    this.children(this.titleEle);
    // 条件类型
    this.selectEleBox = h('div', `${cssPrefix}-if-filter-select-box`);
    this.selectEle = new Select();
    this.selectEleBox.children(this.selectEle);
    this.children(this.selectEleBox);
    // 条件值
    this.valueInputEleBox = h('div', `${cssPrefix}-if-filter-value-input-box`);
    this.valueInput = new PlainInput();
    this.valueInputEleBox.children(this.valueInput);
    this.children(this.valueInputEleBox);
    // 搜索类型
    this.selectEle.addValue({ text: '无', value: IFFilter.IF_TYPE.NOT });
    this.selectEle.addDivider();
    this.selectEle.addValue({ text: '为空', value: IFFilter.IF_TYPE.CT_EMPTY });
    this.selectEle.addValue({ text: '不为空', value: IFFilter.IF_TYPE.CT_NOT_EMPTY });
    this.selectEle.addDivider();
    this.selectEle.addValue({ text: '文本包含', value: IFFilter.IF_TYPE.STR_INCLUDE });
    this.selectEle.addValue({ text: '文本不包含', value: IFFilter.IF_TYPE.STR_NOT_INCLUDE });
    this.selectEle.addValue({ text: '文本开头', value: IFFilter.IF_TYPE.STR_START });
    this.selectEle.addValue({ text: '文本结尾', value: IFFilter.IF_TYPE.STR_END });
    this.selectEle.addValue({ text: '文本相符', value: IFFilter.IF_TYPE.STR_EQ });
    this.selectEle.addDivider();
    this.selectEle.addValue({ text: '日期为', value: IFFilter.IF_TYPE.DAT_EQ });
    this.selectEle.addValue({ text: '日期超前', value: IFFilter.IF_TYPE.DAT_BEFORE });
    this.selectEle.addValue({ text: '日期滞后', value: IFFilter.IF_TYPE.DAT_AFTER });
    this.selectEle.addDivider();
    this.selectEle.addValue({ text: '数字大于', value: IFFilter.IF_TYPE.NUM_BEFORE });
    this.selectEle.addValue({ text: '数字大于等于', value: IFFilter.IF_TYPE.NUM_BEFORE_EQ });
    this.selectEle.addValue({ text: '数字小于', value: IFFilter.IF_TYPE.NUM_AFTER });
    this.selectEle.addValue({ text: '数字小于等于', value: IFFilter.IF_TYPE.NUM_AFTER_EQ });
    this.selectEle.addValue({ text: '数字等于', value: IFFilter.IF_TYPE.NUM_EQ });
    this.selectEle.addValue({ text: '数字不等于', value: IFFilter.IF_TYPE.NUM_NOT_EQ });
    this.removeClass('hover');
    this.bind();
    this.hide();
    this.selectEle.setSelect(IFFilter.IF_TYPE.NOT);
  }

  /**
   * 设置筛选条件
   * @param value
   */
  setValue(value) {
    if (PlainUtils.isBlank(value)) {
      value = PlainUtils.EMPTY;
    }
    this.valueInput.setValue(value);
  }

  /**
   * 绑定事件
   * 处理程序
   */
  bind() {
    const { titleEle, selectEle, valueInput } = this;
    XEvent.bind(selectEle, Constant.FORM_EVENT_TYPE.FORM_SELECT_CHANGE, (e) => {
      const { detail } = e;
      const { item } = detail;
      const { value } = item;
      this.type = value;
      this.switchInput();
    });
    XEvent.bind(valueInput, Constant.FORM_EVENT_TYPE.PLAIN_INPUT_CHANGE, (e) => {
      const { detail } = e;
      const { value } = detail;
      this.value = value;
    });
    XEvent.bind(titleEle, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
      if (this.status) {
        this.hide();
      } else {
        this.show();
      }
    });
  }

  /**
   * 卸载事件
   * 处理程序
   */
  unbind() {
    const { titleEle, selectEle } = this;
    XEvent.unbind(titleEle);
    XEvent.unbind(selectEle);
  }

  /**
   * 设置条件类型
   * @param type
   */
  setType(type) {
    if (PlainUtils.isBlank(type)) {
      type = IFFilter.IF_TYPE.NOT;
    }
    this.selectEle.setSelect(type);
  }

  /**
   * 切换值输入
   */
  switchInput() {
    const { type, valueInputEleBox } = this;
    valueInputEleBox.hide();
    switch (type) {
      case IFFilter.IF_TYPE.STR_NOT_INCLUDE:
      case IFFilter.IF_TYPE.STR_INCLUDE:
      case IFFilter.IF_TYPE.STR_EQ:
      case IFFilter.IF_TYPE.STR_START:
      case IFFilter.IF_TYPE.STR_END:
      case IFFilter.IF_TYPE.DAT_EQ:
      case IFFilter.IF_TYPE.DAT_BEFORE:
      case IFFilter.IF_TYPE.DAT_AFTER:
      case IFFilter.IF_TYPE.NUM_BEFORE:
      case IFFilter.IF_TYPE.NUM_BEFORE_EQ:
      case IFFilter.IF_TYPE.NUM_AFTER:
      case IFFilter.IF_TYPE.NUM_AFTER_EQ:
      case IFFilter.IF_TYPE.NUM_EQ:
      case IFFilter.IF_TYPE.NUM_NOT_EQ:
        valueInputEleBox.show();
        break;
      default:
        valueInputEleBox.hide();
    }
  }

  /**
   * 获取条件类型
   */
  getType() {
    return this.type;
  }

  /**
   * 获取筛选条件
   */
  getValue() {
    return this.value;
  }

  /**
   * 隐藏条件搜索
   * @returns {IFFilter}
   */
  hide() {
    this.titleIconEle.removeClass('active');
    this.status = false;
    this.selectEleBox.hide();
    this.valueInputEleBox.hide();
    return this;
  }

  /**
   * 显示条件搜索
   * @returns {IFFilter}
   */
  show() {
    const { type } = this;
    this.titleIconEle.addClass('active');
    this.status = true;
    this.selectEleBox.show();
    this.setType(type);
    return this;
  }

  /**
   * 是否符合筛选条件
   * @param type
   * @param value
   */
  qualified(type, value) {
    switch (type) {
      case IFFilter.IF_TYPE.NOT: {
        break;
      }
      case IFFilter.IF_TYPE.CT_NOT_EMPTY: {
        break;
      }
      case IFFilter.IF_TYPE.CT_EMPTY: {
        break;
      }
      case IFFilter.IF_TYPE.STR_NOT_INCLUDE: {
        break;
      }
      case IFFilter.IF_TYPE.STR_INCLUDE: {
        break;
      }
      case IFFilter.IF_TYPE.STR_EQ: {
        break;
      }
      case IFFilter.IF_TYPE.STR_START: {
        break;
      }
      case IFFilter.IF_TYPE.STR_END: {
        break;
      }
      case IFFilter.IF_TYPE.DAT_EQ: {
        break;
      }
      case IFFilter.IF_TYPE.DAT_BEFORE: {
        break;
      }
      case IFFilter.IF_TYPE.DAT_AFTER: {
        break;
      }
      case IFFilter.IF_TYPE.NUM_BEFORE: {
        break;
      }
      case IFFilter.IF_TYPE.NUM_BEFORE_EQ: {
        break;
      }
      case IFFilter.IF_TYPE.NUM_AFTER: {
        break;
      }
      case IFFilter.IF_TYPE.NUM_AFTER_EQ: {
        break;
      }
      case IFFilter.IF_TYPE.NUM_EQ: {
        break;
      }
      case IFFilter.IF_TYPE.NUM_NOT_EQ: {
        break;
      }
    }
  }

  /**
   * 销毁组件
   */
  destroy() {
    super.destroy();
    this.unbind();
    this.selectEle.destroy();
  }

}
IFFilter.IF_TYPE = {
  NOT: 1,
  CT_NOT_EMPTY: 2,
  CT_EMPTY: 3,
  STR_NOT_INCLUDE: 4,
  STR_INCLUDE: 5,
  STR_EQ: 6,
  STR_START: 7,
  STR_END: 8,
  DAT_EQ: 9,
  DAT_BEFORE: 10,
  DAT_AFTER: 11,
  NUM_BEFORE: 12,
  NUM_BEFORE_EQ: 13,
  NUM_AFTER: 14,
  NUM_AFTER_EQ: 15,
  NUM_EQ: 16,
  NUM_NOT_EQ: 17,
};

export {
  IFFilter,
};
