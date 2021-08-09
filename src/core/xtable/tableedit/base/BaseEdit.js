import { Widget } from '../../../../lib/Widget';
import { Constant, cssPrefix } from '../../../../const/Constant';
import { BaseFont } from '../../../../draw/font/BaseFont';
import { XDraw } from '../../../../draw/XDraw';
import { Throttle } from '../../../../lib/Throttle';

/**
 * BaseEdit
 */
class BaseEdit extends Widget {

  /**
   * BaseEdit
   * @param table
   */
  constructor(table) {
    super(`${cssPrefix}-table-edit`);
    this.table = table;
    this.mode = BaseEdit.MODE.HIDE;
    this.selectRange = null;
    this.activeCell = null;
    this.throttle = new Throttle({
      time: 100,
    });
    this.attr('contenteditable', true);
  }

  /**
   * 编辑器定位
   */
  local() {
    const { table, activeCell } = this;
    const { xHeightLight, yHeightLight } = table;
    const { fontAttr } = activeCell;
    const { align } = fontAttr;
    const left = xHeightLight.getLeft() + table.getIndexWidth();
    const top = yHeightLight.getTop() + table.getIndexHeight();
    const height = yHeightLight.getHeight();
    const width = xHeightLight.getWidth();
    switch (align) {
      case BaseFont.ALIGN.left: {
        this.cssRemoveKeys('right');
        const maxHeight = table.visualHeight() - top;
        const maxWidth = table.visualWidth() - left;
        this.css({
          left: `${left}px`,
          top: `${top}px`,
          'min-width': `${XDraw.offsetToLineInside(Math.min(width, maxWidth))}px`,
          'min-height': `${XDraw.offsetToLineInside(Math.min(height, maxHeight))}px`,
          'max-width': `${XDraw.offsetToLineInside(maxWidth)}px`,
          'max-height': `${XDraw.offsetToLineInside(maxHeight)}px`,
        });
        break;
      }
      case BaseFont.ALIGN.center: {
        this.cssRemoveKeys('right');
        const box = this.box();
        const maxHeight = table.visualHeight() - top;
        if (box.width > width) {
          const maxWidth = (table.visualWidth() - (left + width)) * 2 + width;
          const realWidth = Math.min(box.width, maxWidth);
          const realLeft = left - (realWidth / 2 - width / 2);
          this.css({
            left: `${realLeft}px`,
            top: `${top}px`,
            'min-width': `${XDraw.offsetToLineInside(Math.min(width, maxWidth))}px`,
            'min-height': `${XDraw.offsetToLineInside(Math.min(height, maxHeight))}px`,
            'max-width': `${XDraw.offsetToLineInside(maxWidth)}px`,
            'max-height': `${XDraw.offsetToLineInside(maxHeight)}px`,
          });
        } else {
          const maxWidth = table.visualWidth() - left;
          this.css({
            left: `${left}px`,
            top: `${top}px`,
            'min-width': `${XDraw.offsetToLineInside(Math.min(width, maxWidth))}px`,
            'min-height': `${XDraw.offsetToLineInside(Math.min(height, maxHeight))}px`,
            'max-width': `${XDraw.offsetToLineInside(maxWidth)}px`,
            'max-height': `${XDraw.offsetToLineInside(maxHeight)}px`,
          });
        }
        break;
      }
      case BaseFont.ALIGN.right: {
        this.cssRemoveKeys('left');
        const maxWidth = (left + width) - table.getIndexWidth();
        const right = table.visualWidth() - (left + width);
        const maxHeight = table.visualHeight() - top;
        this.css({
          right: `${right}px`,
          top: `${top}px`,
          'min-width': `${XDraw.offsetToLineInside(Math.min(width, maxWidth))}px`,
          'min-height': `${XDraw.offsetToLineInside(Math.min(height, maxHeight))}px`,
          'max-width': `${XDraw.offsetToLineInside(maxWidth)}px`,
          'max-height': `${XDraw.offsetToLineInside(maxHeight)}px`,
        });
        break;
      }
    }
  }

  /**
   * 打开编辑器
   * @returns {BaseEdit}
   */
  open(event) {
    const { table } = this;
    this.mode = BaseEdit.MODE.SHOW;
    this.show();
    this.local();
    table.trigger(Constant.TABLE_EVENT_TYPE.EDIT_START, event);
    return this;
  }

  /**
   * 关闭编辑器
   * @returns {BaseEdit}
   */
  close(event) {
    const { table } = this;
    this.mode = BaseEdit.MODE.HIDE;
    this.hide();
    table.trigger(Constant.TABLE_EVENT_TYPE.EDIT_FINISH, event);
    return this;
  }

}

BaseEdit.MODE = {
  SHOW: Symbol('显示'),
  HIDE: Symbol('隐藏'),
};

export {
  BaseEdit,
};
