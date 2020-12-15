import { cssPrefix, Constant } from '../../../../../const/Constant';
import { ELContextMenu } from '../../../../../component/contextmenu/ELContextMenu';
import { FormatContextMenuItem } from './FormatContextMenuItem';
import { ELContextMenuDivider } from '../../../../../component/contextmenu/ELContextMenuDivider';
import { PlainUtils } from '../../../../../utils/PlainUtils';
import { XEvent } from '../../../../../lib/XEvent';

class FormatContextMenu extends ELContextMenu {

  constructor(options = {}) {
    super(`${cssPrefix}-format-context-menu`, PlainUtils.mergeDeep({
      onUpdate: () => {},
    }, options));
    this.items = [
      new FormatContextMenuItem('常规', '').data('type', 'default'),
      new FormatContextMenuItem('文本', '').data('type', 'text'),
      new ELContextMenuDivider(),
      new FormatContextMenuItem('数值', '0.59').data('type', 'number'),
      new FormatContextMenuItem('百分比', '90.00%').data('type', 'percentage'),
      new FormatContextMenuItem('分数', '1/2').data('type', 'fraction'),
      new FormatContextMenuItem('科学计数', '9.50e-01').data('type', 'ENotation'),
      new ELContextMenuDivider(),
      new FormatContextMenuItem('人民币', '￥5.00').data('type', 'rmb'),
      new FormatContextMenuItem('港币', 'HK5.00').data('type', 'hk'),
      new FormatContextMenuItem('美元', '$5.00').data('type', 'dollar'),
      new ELContextMenuDivider(),
      new FormatContextMenuItem('日期', '2018/4/18').data('type', 'date1'),
      new FormatContextMenuItem('日期', '4月18日').data('type', 'date2'),
      new FormatContextMenuItem('日期', '2018年4月').data('type', 'date3'),
      new FormatContextMenuItem('日期', '2018年4月18日').data('type', 'date4'),
      new FormatContextMenuItem('日期', '2018/4/18 14:30:30').data('type', 'date5'),
      new FormatContextMenuItem('时间', '14:30:30').data('type', 'time'),
    ];
    this.items.forEach((item) => {
      this.addItem(item);
    });
    this.init();
    this.bind();
  }

  init() {
    const { options, items } = this;
    const { el } = options;
    const first = items[0];
    el.setTitle(first.title);
    first.setActive();
  }

  update(format, title) {
    const { options } = this;
    options.onUpdate(format, title);
    this.close();
  }

  unbind() {
    this.items.forEach((item) => {
      if (item instanceof FormatContextMenuItem && item.data('type')) {
        XEvent.unbind(item, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN);
      }
    });
  }

  bind() {
    this.items.forEach((item) => {
      if (item instanceof FormatContextMenuItem && item.data('type')) {
        XEvent.bind(item, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
          this.update(item.data('type'), item.title);
          item.setActive();
        });
      }
    });
  }

  setActiveByType(type) {
    this.items.forEach((item) => {
      if (item.data('type') === type) {
        item.setActive();
      }
    });
  }

  destroy() {
    super.destroy();
    this.unbind();
  }

}

export { FormatContextMenu };
