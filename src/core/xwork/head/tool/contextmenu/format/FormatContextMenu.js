import { cssPrefix, Constant } from '../../../../../../const/Constant';
import { ELContextMenu } from '../../../../../../module/contextmenu/ELContextMenu';
import { FormatContextMenuItem } from './FormatContextMenuItem';
import { ELContextMenuDivider } from '../../../../../../module/contextmenu/ELContextMenuDivider';
import { SheetUtils } from '../../../../../../utils/SheetUtils';
import { XEvent } from '../../../../../../lib/XEvent';
import { Cell } from '../../../../../xtable/tablecell/Cell';

class FormatContextMenu extends ELContextMenu {

  constructor(options = {}) {
    super(`${cssPrefix}-format-context-menu`, SheetUtils.copy({
      onUpdate: () => {},
    }, options));
    this.items = [
      new FormatContextMenuItem('常规', '').data('format', 'default').data('type', Cell.TYPE.STRING),
      new FormatContextMenuItem('文本', '').data('format', 'text').data('type', Cell.TYPE.STRING),
      new ELContextMenuDivider(),
      new FormatContextMenuItem('小数', '0.59').data('format', 'decimal').data('type', Cell.TYPE.NUMBER),
      new FormatContextMenuItem('数值', '100').data('format', 'number').data('type', Cell.TYPE.NUMBER),
      new FormatContextMenuItem('百分比', '90.00%').data('format', 'percentage').data('type', Cell.TYPE.NUMBER),
      new FormatContextMenuItem('分数', '1/2').data('format', 'fraction').data('type', Cell.TYPE.NUMBER),
      new FormatContextMenuItem('科学计数', '9.50e-01').data('format', 'eNotation').data('type', Cell.TYPE.NUMBER),
      new ELContextMenuDivider(),
      new FormatContextMenuItem('人民币', '￥5.00').data('format', 'rmb').data('type', Cell.TYPE.NUMBER),
      new FormatContextMenuItem('港币', 'HK5.00').data('format', 'hk').data('type', Cell.TYPE.NUMBER),
      new FormatContextMenuItem('美元', '$5.00').data('format', 'dollar').data('type', Cell.TYPE.NUMBER),
      new ELContextMenuDivider(),
      new FormatContextMenuItem('日期', '2018/4/18').data('format', 'date1').data('type', Cell.TYPE.DATE_TIME),
      new FormatContextMenuItem('日期', '4月18日').data('format', 'date2').data('type', Cell.TYPE.DATE_TIME),
      new FormatContextMenuItem('日期', '2018年4月').data('format', 'date3').data('type', Cell.TYPE.DATE_TIME),
      new FormatContextMenuItem('日期', '2018年4月18日').data('format', 'date4').data('type', Cell.TYPE.DATE_TIME),
      new FormatContextMenuItem('日期', '2018/4/18 14:30:30').data('format', 'date5').data('type', Cell.TYPE.DATE_TIME),
      new FormatContextMenuItem('时间', '14:30:30').data('format', 'time').data('type', Cell.TYPE.DATE_TIME),
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
      if (item instanceof FormatContextMenuItem && item.data('format')) {
        XEvent.unbind(item, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN);
      }
    });
  }

  bind() {
    this.items.forEach((item) => {
      if (item instanceof FormatContextMenuItem && item.data('format')) {
        XEvent.bind(item, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
          this.update(item.data('format'), item.data('type'), item.title);
          item.setActive();
        });
      }
    });
  }

  setActiveByType(type) {
    this.items.forEach((item) => {
      if (item.data('format') === type) {
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
