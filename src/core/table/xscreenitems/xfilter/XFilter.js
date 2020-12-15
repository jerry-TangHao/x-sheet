import { XSelectItem } from '../xselect/XSelectItem';
import { PlainUtils } from '../../../../utils/PlainUtils';
import { RectRange } from '../../tablebase/RectRange';
import { Widget } from '../../../../lib/Widget';
import { Constant, cssPrefix } from '../../../../const/Constant';
import { XEvent } from '../../../../lib/XEvent';
import { ColsIterator } from '../../iterator/ColsIterator';
import { RowsIterator } from '../../iterator/RowsIterator';
import { Alert } from '../../../../component/alert/Alert';
import { XScreenCssBorderItem } from '../../xscreen/item/viewborder/XScreenCssBorderItem';
import darkFilter from '../../../../../assets/svg/filter-dark.svg';
import { XTableMousePointer } from '../../XTableMousePointer';
import { XIcon } from '../../xicon/XIcon';
import { Mask } from '../../../../component/mask/Mask';
import { XDraw } from '../../../../canvas/XDraw';
import { FilterData } from '../../../../component/filterdata/FilterData';
import { ElPopUp } from '../../../../component/elpopup/ElPopUp';
import { ValueItem } from '../../../../component/filterdata/valuefilter/ValueItem';

/**
 * XFilter
 */
class XFilter extends XScreenCssBorderItem {

  /**
   * XFilter
   * @param table
   */
  constructor(table) {
    super({ table });
    this.selectRange = null;
    this.activeIcon = null;
    this.icons = [];
    this.display = false;
    this.mask = new Mask().setRoot(table);
    this.filter = new FilterData({
      el: this.mask,
      ok: ({
        valueFilterItems, valueFilterValue, ifFilterType, ifFilterValue,
      }) => {
        const { activeIcon } = this;
        activeIcon.valueFilterItems = valueFilterItems;
        activeIcon.valueFilterValue = valueFilterValue;
        activeIcon.ifFilterType = ifFilterType;
        activeIcon.ifFilterValue = ifFilterValue;
        this.filterFoldRow();
      },
    });
    this.flt = new Widget(`${cssPrefix}-x-filter ${cssPrefix}-x-filter-lt`);
    this.ft = new Widget(`${cssPrefix}-x-filter ${cssPrefix}-x-filter-t`);
    this.fbr = new Widget(`${cssPrefix}-x-filter ${cssPrefix}-x-filter-br`);
    this.fl = new Widget(`${cssPrefix}-x-filter ${cssPrefix}-x-filter-l`);
    this.blt.children(this.flt);
    this.bl.children(this.fl);
    this.bt.children(this.ft);
    this.bbr.children(this.fbr);
    this.setBorderColor('#0071cf');
    this.bind();
  }

  /**
   * 元素添加监听
   */
  onAdd() {
    super.onAdd();
  }

  /**
   * 卸载绑定事件
   */
  unbind() {
    const { table } = this;
    XEvent.unbind(table);
  }

  /**
   * 绑定事件监听
   */
  bind() {
    const { table } = this;
    XEvent.bind(table, Constant.TABLE_EVENT_TYPE.RESIZE_CHANGE, () => {
      if (this.display) {
        this.xFilterOffset();
      }
    });
    XEvent.bind(table, Constant.SYSTEM_EVENT_TYPE.SCROLL, () => {
      if (this.display) {
        ElPopUp.closeAll();
        this.xFilterOffset();
      }
    });
    XEvent.bind(table, Constant.TABLE_EVENT_TYPE.RENDER, () => {
      if (this.display) {
        this.xFilterOffset();
      }
    });
  }

  /**
   * 创建过滤小图标
   */
  createFilterIcon() {
    const { table, selectRange, icons } = this;
    if (selectRange) {
      const { top } = selectRange.brink();
      const { xIconBuilder } = table;
      const style = table.getXTableStyle();
      const { fixedCellIcon } = style;
      const { mousePointer } = table;
      top.each((ri, ci) => {
        const icon = xIconBuilder.build({
          image: darkFilter,
          offset: {
            x: -2,
            y: -2,
          },
          height: 18,
          width: 18,
          vertical: XIcon.ICON_VERTICAL.BOTTOM,
        });
        const item = { ri, ci, icon };
        icon.setOnDown((event) => {
          const { native } = event;
          this.activeIcon = item;
          this.filterOpen();
          native.stopPropagation();
        });
        icon.setOnEnter((event) => {
          const { position } = event;
          const cssHeight = XDraw.styleTransformCssPx(position.height);
          const cssWidth = XDraw.styleTransformCssPx(position.width);
          const cssLeft = XDraw.styleTransformCssPx(position.x);
          const cssTop = XDraw.styleTransformCssPx(position.y);
          this.mask.setLeft(cssLeft)
            .setTop(cssTop)
            .setWidth(cssWidth)
            .setHeight(cssHeight)
            .open();
        });
        icon.setOnMove(() => {
          mousePointer.set(XTableMousePointer.KEYS.pointer, XFilter);
        });
        icon.setOnLeave(() => {
          this.mask.close();
          mousePointer.free(XFilter);
        });
        fixedCellIcon.addOrNewCell(ri, ci, icon);
        icons.push(item);
      });
      table.render();
    }
  }

  /**
   * 清除过滤小图标
   */
  clearFilterIcon() {
    const { table, selectRange } = this;
    if (selectRange) {
      const style = table.getXTableStyle();
      const { fixedCellIcon } = style;
      this.icons.forEach((item) => {
        const { ri, ci, icon } = item;
        fixedCellIcon.remove(ri, ci, icon);
      });
      this.icons = [];
      table.render();
    }
  }

  /**
   * 处理元素的
   * 显示,大小,位置
   */
  offsetHandle() {
    const { selectRange } = this;
    if (selectRange) {
      this.setDisplay(selectRange);
      this.setSizer(selectRange);
      this.setLocal(selectRange);
    }
  }

  /**
   * 处理元素的边框
   * 是否显示
   */
  borderHandle() {
    const { selectRange, display } = this;
    if (selectRange && display) {
      this.hideBorder();
      this.showBorder(selectRange);
    }
  }

  /**
   * 处理过滤器的
   * 视图区域
   */
  xFilterHandle() {
    const { table } = this;
    const {
      xScreen, cols, rows,
    } = table;

    const xSelect = xScreen.findType(XSelectItem);
    const { selectRange } = xSelect;
    const cells = table.getTableCells();
    const merges = table.getTableMerges();

    if (selectRange) {
      let targetRange = selectRange.clone();
      const { sri, sci, eri, eci } = targetRange;
      const rowLen = rows.len - 1;
      const colLen = cols.len - 1;
      const merge = merges.getFirstIncludes(sri, sci) || RectRange.EMPTY;
      // 排除多选单元格
      if (targetRange.multiple() && !merge.equals(targetRange)) {
        this.selectRange = targetRange;
        return;
      }
      // 向右走
      ColsIterator.getInstance()
        .setBegin(eci + 1)
        .setEnd(colLen)
        .setLoop((i) => {
          const cell = cells.getCellOrMergeCell(sri, i);
          if (PlainUtils.isUnDef(cell) || PlainUtils.isBlank(cell.text)) {
            return false;
          }
          targetRange = targetRange.union(new RectRange(sri, i, sri, i));
          return true;
        })
        .execute();
      // 向左走
      ColsIterator.getInstance()
        .setBegin(sci - 1)
        .setEnd(0)
        .setLoop((i) => {
          const cell = cells.getCellOrMergeCell(sri, i);
          if (PlainUtils.isUnDef(cell) || PlainUtils.isBlank(cell.text)) {
            return false;
          }
          targetRange = targetRange.union(new RectRange(sri, i, sri, i));
          return true;
        })
        .execute();
      // 向下走
      RowsIterator.getInstance()
        .setBegin(eri + 1)
        .setEnd(rowLen)
        .setLoop((i) => {
          const cell = cells.getCellOrMergeCell(i, sci);
          if (PlainUtils.isUnDef(cell) || PlainUtils.isBlank(cell.text)) {
            return false;
          }
          targetRange = targetRange.union(new RectRange(i, sci, i, sci));
          return true;
        })
        .execute();
      // 向上走
      RowsIterator.getInstance()
        .setBegin(sri - 1)
        .setEnd(0)
        .setLoop((i) => {
          const cell = cells.getCellOrMergeCell(i, sci);
          if (PlainUtils.isUnDef(cell) || PlainUtils.isBlank(cell.text)) {
            return false;
          }
          targetRange = targetRange.union(new RectRange(i, sci, i, sci));
          return true;
        })
        .execute();
      // 向右扫描
      ColsIterator.getInstance()
        .setBegin(targetRange.eci + 1)
        .setEnd(colLen)
        .setLoop((i) => {
          const { sri, eri } = targetRange;
          let emptyCol = true;
          RowsIterator.getInstance()
            .setBegin(sri)
            .setEnd(eri)
            .setLoop((j) => {
              const cell = cells.getCellOrMergeCell(j, i);
              if (!PlainUtils.isUnDef(cell) && !PlainUtils.isBlank(cell.text)) {
                targetRange = targetRange.union(new RectRange(j, i, j, i));
                emptyCol = false;
              }
            })
            .execute();
          return !emptyCol;
        })
        .execute();
      // 向左扫描
      ColsIterator.getInstance()
        .setBegin(targetRange.sci - 1)
        .setEnd(0)
        .setLoop((i) => {
          const { sri, eri } = targetRange;
          let emptyCol = true;
          RowsIterator.getInstance()
            .setBegin(sri)
            .setEnd(eri)
            .setLoop((j) => {
              const cell = cells.getCellOrMergeCell(j, i);
              if (!PlainUtils.isUnDef(cell) && !PlainUtils.isBlank(cell.text)) {
                targetRange = targetRange.union(new RectRange(j, i, j, i));
                emptyCol = false;
              }
            })
            .execute();
          return !emptyCol;
        })
        .execute();
      // 向下扫描
      RowsIterator.getInstance()
        .setBegin(targetRange.eri + 1)
        .setEnd(rowLen)
        .setLoop((i) => {
          const { sci, eci } = targetRange;
          let emptyRow = true;
          ColsIterator.getInstance()
            .setBegin(sci)
            .setEnd(eci)
            .setLoop((j) => {
              const cell = cells.getCellOrMergeCell(i, j);
              if (!PlainUtils.isUnDef(cell) && !PlainUtils.isBlank(cell.text)) {
                targetRange = targetRange.union(new RectRange(i, j, i, j));
                emptyRow = false;
              }
            })
            .execute();
          return !emptyRow;
        })
        .execute();
      // 向上扫描
      RowsIterator.getInstance()
        .setBegin(targetRange.sri - 1)
        .setEnd(0)
        .setLoop((i) => {
          const { sci, eci } = targetRange;
          let emptyRow = true;
          ColsIterator.getInstance()
            .setBegin(sci)
            .setEnd(eci)
            .setLoop((j) => {
              const cell = cells.getCellOrMergeCell(i, j);
              if (!PlainUtils.isUnDef(cell) && !PlainUtils.isBlank(cell.text)) {
                targetRange = targetRange.union(new RectRange(i, j, i, j));
                emptyRow = false;
              }
            })
            .execute();
          return !emptyRow;
        })
        .execute();
      this.selectRange = targetRange;

    } else {
      this.selectRange = null;
    }
  }

  /**
   * 处理元素的基本属性
   * 和边框
   */
  xFilterOffset() {
    this.offsetHandle();
    this.borderHandle();
  }

  /**
   * 打开过滤面板
   */
  filterOpen() {
    const { selectRange, table, filter, activeIcon } = this;
    const { valueFilter, ifFilter } = filter;
    const cells = table.getTableCells();
    // 筛选条件
    const { valueFilterValue, ifFilterType, ifFilterValue, valueFilterItems } = activeIcon;
    // 筛选范围
    const { ri: sri, ci: sci } = activeIcon;
    const { eri } = selectRange;
    const eci = sci;
    // 筛选数据
    const items = new Set();
    new RectRange(sri, sci, eri, eci).each((ri, ci) => {
      const cell = cells.getCellOrMergeCell(ri, ci);
      if (cell && !PlainUtils.isBlank(cell.text)) {
        items.add(cell.text.trim());
      }
    });
    // 值筛选
    valueFilter.emptyAll();
    if (valueFilterItems) {
      items.forEach((item) => {
        const valueItem = new ValueItem({
          text: item,
        });
        if (valueFilterItems.find(item => valueItem.equals(item))) {
          valueItem.setStatus(true);
        } else {
          valueItem.setStatus(false);
        }
        valueFilter.addItem(valueItem);
      });
    } else {
      items.forEach((item) => {
        const valueItem = new ValueItem({
          text: item,
        });
        valueItem.setStatus(true);
        valueFilter.addItem(valueItem);
      });
    }
    valueFilter.setValue(valueFilterValue);
    // 条件筛选
    ifFilter.setType(ifFilterType);
    ifFilter.setValue(ifFilterValue);
    // 关闭其他面板
    ElPopUp.closeAll();
    // 打开面板
    filter.open();
  }

  /**
   * 过滤折叠行
   */
  filterFoldRow() {}

  /**
   * 隐藏过滤器
   */
  hideFilter() {
    this.display = false;
    this.clearFilterIcon();
    this.hide();
  }

  /**
   * 显示过滤器
   */
  openFilter() {
    const { table } = this;
    const cells = table.getTableCells();
    this.xFilterHandle();
    const { selectRange } = this;
    if (selectRange) {
      if (cells.emptyRectRange(selectRange)) {
        new Alert({
          message: '不能为空数据区创建过滤器, 请选择非空区域',
        }).open();
      } else {
        this.display = true;
        this.createFilterIcon();
        this.show();
        this.xFilterOffset();
      }
    }
  }

  /**
   * 销毁过滤器
   */
  destroy() {
    super.destroy();
    this.unbind();
  }

}

export {
  XFilter,
};
