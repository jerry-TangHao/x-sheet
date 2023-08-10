import { Widget } from '../../../lib/Widget';
import { cssPrefix, Constant } from '../../../const/Constant';
import { Undo } from './tool/Undo';
import { Redo } from './tool/Redo';
import { PaintFormat } from './tool/PaintFormat';
import { ClearFormat } from './tool/ClearFormat';
import { Format } from './tool/Format';
import { Font } from './tool/Font';
import { FontSize } from './tool/FontSize';
import { FontBold } from './tool/FontBold';
import { FontItalic } from './tool/FontItalic';
import { Border } from './tool/Border';
import { Merge } from './tool/Merge';
import { UnderLine } from './tool/UnderLine';
import { VerticalAlign } from './tool/VerticalAlign';
import { TextWrapping } from './tool/TextWrapping';
import { FontStrike } from './tool/FontStrike';
import { FontColor } from './tool/FontColor';
import { FillColor } from './tool/FillColor';
import { HorizontalAlign } from './tool/HorizontalAlign';
import { Fixed } from './tool/Fixed';
import { Filter } from './tool/Filter';
import { Functions } from './tool/Functions';
import { XEvent } from '../../../lib/XEvent';
import { ElPopUp } from '../../../module/elpopup/ElPopUp';
import { Icon } from './tool/Icon';
import { SheetUtils } from '../../../utils/SheetUtils';
import { Scale } from './tool/Scale';
import { BaseFont } from '../../../draw/font/BaseFont';
import { XSelectItem } from '../../table/screenitems/xselect/XSelectItem';
import { Alert } from '../../../module/alert/Alert';
import { XFilter } from '../../table/screenitems/xfilter/XFilter';
import { XCopyStyle } from '../../table/screenitems/xcopystyle/XCopyStyle';
import { FontAngle } from './tool/FontAngle';
import { Divider } from './tool/base/Divider';
import { BaseEdit } from '../../table/tableedit/BaseEdit';
import { RecycleMenu } from './tool/RecycleMenu';

class XWorkHeadMenuScroll {
  constructor(headMenu) {
    this.headMenu = headMenu;
    this.value = 0;
    this.reset = () => {
      let minValue = this.headMenu.box().width - this.headMenu.content.box().width;
      if (minValue >= 0) {
        this.headMenu.content.css('transform', `translateX(${this.value = 0}px)`);
      }
    };
    this.bind();
  }

  bind() {
    XEvent.bind(this.headMenu, Constant.SYSTEM_EVENT_TYPE.MOUSE_WHEEL, (event) => {
      let maxValue = 0;
      let minValue = this.headMenu.box().width - this.headMenu.content.box().width;
      if (minValue < 0) {
        this.value += (event.wheelDelta > 0 ? 20 : -20);
        if (this.value < minValue) {
          this.value = minValue;
        } else if (this.value > maxValue) {
          this.value = maxValue;
        }
        this.headMenu.content.css('transform', `translateX(${this.value}px)`);
      }
    });
    XEvent.bind(window, Constant.SYSTEM_EVENT_TYPE.RESIZE, this.reset);
  }

  unbind() {
    XEvent.unbind(this.headMenu, Constant.SYSTEM_EVENT_TYPE.SCROLL);
    XEvent.unbind(window, Constant.SYSTEM_EVENT_TYPE.RESIZE, this.reset);
  }
}

class XWorkHeadMenu extends Widget {

  constructor(workTop, options = {
    shrinkMode: 'scroll',
  }) {
    super(`${cssPrefix}-tools-menu`);
    this.content = new Widget(`${cssPrefix}-tools-menu-content`, 'div');
    this.workTop = workTop;
    this.options = options;
    this.resize = () => {
      ElPopUp.closeAll();
    };
    console.log(this.options.shrinkMode);
    if (this.options.shrinkMode === 'scroll') {
      this.scroll = new XWorkHeadMenuScroll(this);
    }
  }

  unbind() {
    const { body } = this.workTop.work;
    XEvent.unbind(body);
    XEvent.unbind(this.scale);
    XEvent.unbind(this.undo);
    XEvent.unbind(this.redo);
    XEvent.unbind(this.paintFormat);
    XEvent.unbind(this.clearFormat);
    XEvent.unbind(this.format);
    XEvent.unbind(this.font);
    XEvent.unbind(this.dprFontSize);
    XEvent.unbind(this.fontBold);
    XEvent.unbind(this.fontItalic);
    XEvent.unbind(this.underLine);
    XEvent.unbind(this.fontStrike);
    XEvent.unbind(this.fontColor);
    XEvent.unbind(this.fillColor);
    XEvent.unbind(this.border);
    XEvent.unbind(this.merge);
    XEvent.unbind(this.horizontalAlign);
    XEvent.unbind(this.verticalAlign);
    XEvent.unbind(this.textWrapping);
    XEvent.unbind(this.fixed);
    XEvent.unbind(this.filter);
    XEvent.unbind(this.recycleMenu);
    XEvent.unbind(window, Constant.WORK_BODY_EVENT_TYPE.RESIZE, this.resize);
    if (this.scroll) {
      this.scroll.unbind();
    }
  }

  onAttach() {
    const { workTop } = this;
    const { work } = workTop;
    const { body } = work;
    const { sheetView } = body;

    // 普通小工具
    this.undo = new Undo();
    this.redo = new Redo();
    this.paintFormat = new PaintFormat();
    this.clearFormat = new ClearFormat();
    this.fontBold = new FontBold();
    this.fontItalic = new FontItalic();
    this.underLine = new UnderLine();
    this.fontStrike = new FontStrike();
    this.filter = new Filter();
    this.merge = new Merge();
    this.functions = new Functions();

    // 上下文菜单小工具
    this.scale = new Scale({
      contextMenu: {
        onUpdate: (value) => {
          const sheet = sheetView.getActiveSheet();
          const { table } = sheet;
          if (table.isProtection()) {
            return;
          }
          this.scale.setTitle(`${value}%`);
          const { body } = this.workTop.work;
          body.setScale(value / 100);
        },
      },
    });
    this.format = new Format({
      contextMenu: {
        onUpdate: (format, contentType, title) => {
          const sheet = sheetView.getActiveSheet();
          const { table } = sheet;
          const { xScreen } = table;
          const helper = table.getDataCellsHelper();
          const xSelect = xScreen.findType(XSelectItem);
          const { selectRange } = xSelect;
          this.format.setTitle(title);
          helper.setCellFormat({
            selectRange, format, contentType,
          });
        },
      },
    });
    this.font = new Font({
      contextMenu: {
        onUpdate: (name) => {
          const sheet = sheetView.getActiveSheet();
          const { table } = sheet;
          const { edit } = table;
          const helper = table.getDataCellsHelper();
          this.font.setTitle(name);
          if (edit.mode === BaseEdit.MODE.SHOW) {
            edit.fontFamily(name);
          } else {
            const { xScreen } = table;
            const xSelect = xScreen.findType(XSelectItem);
            const { selectRange } = xSelect;
            helper.setStyleFontName({ selectRange, name });
          }
        },
      },
    });
    this.dprFontSize = new FontSize({
      contextMenu: {
        onUpdate: (size) => {
          const sheet = sheetView.getActiveSheet();
          const { table } = sheet;
          const { edit } = table;
          this.dprFontSize.setTitle(size);
          const helper = table.getDataCellsHelper();
          if (edit.mode === BaseEdit.MODE.SHOW) {
            edit.fontSize(size);
          } else {
            const { xScreen } = table;
            const xSelect = xScreen.findType(XSelectItem);
            const { selectRange } = xSelect;
            helper.setStyleFontSize({ selectRange, size });
          }
        },
      },
    });
    this.fillColor = new FillColor({
      contextMenu: {
        onUpdate: (background) => {
          const sheet = sheetView.getActiveSheet();
          const { table } = sheet;
          const helper = table.getDataCellsHelper();
          const { xScreen } = table;
          const xSelect = xScreen.findType(XSelectItem);
          const { selectRange } = xSelect;
          this.fillColor.setColor(background);
          helper.setStyleBackground({ selectRange, background });
        },
      },
    });
    this.fontColor = new FontColor({
      contextMenu: {
        onUpdate: (color) => {
          const sheet = sheetView.getActiveSheet();
          const { table } = sheet;
          const { edit } = table;
          this.fontColor.setColor(color);
          if (edit.mode === BaseEdit.MODE.SHOW) {
            edit.fontColor(color);
          } else {
            const { xScreen } = table;
            const helper = table.getDataCellsHelper();
            const xSelect = xScreen.findType(XSelectItem);
            const { selectRange } = xSelect;
            helper.setStyleFontColor({ selectRange, color });
          }
        },
      },
    });
    this.fixed = new Fixed({
      contextMenu: {
        onUpdate: (type) => {
          const sheet = sheetView.getActiveSheet();
          const { table } = sheet;
          if (!table.isProtection()) {
            const { xScreen } = table;
            const xSelect = xScreen.findType(XSelectItem);
            const { selectRange } = xSelect;
            switch (type) {
              case 'ROW': {
                if (this.fixed.rowStatus) {
                  table.setFixedRow(-1);
                } else if (selectRange) {
                  const scrollView = table.getScrollView();
                  const { sri } = selectRange;
                  if (sri < scrollView.eri - 2 && sri >= scrollView.sri) {
                    table.setFixedRow(sri);
                  } else {
                    new Alert({
                      message: '无法在当前区域内冻结单元格, 请重新选择冻结区域',
                    }).parentWidget(this).open();
                  }
                }
                break;
              }
              case 'COL': {
                if (this.fixed.colStatus) {
                  table.setFixedCol(-1);
                } else if (selectRange) {
                  const scrollView = table.getScrollView();
                  const { sci } = selectRange;
                  if (sci < scrollView.eci - 2 && sci >= scrollView.sci) {
                    table.setFixedCol(sci);
                  } else {
                    new Alert({
                      message: '无法在当前区域内冻结单元格, 请重新选择冻结区域',
                    }).parentWidget(this).open();
                  }
                }
                break;
              }
              case 'ROW1': {
                table.setFixedRow(0, 0);
                break;
              }
              case 'ROW2': {
                table.setFixedRow(1, 0);
                break;
              }
              case 'COL1': {
                table.setFixedCol(0, 0);
                break;
              }
              case 'COL2': {
                table.setFixedCol(1, 0);
              }
            }
          }
        },
      },
    });
    this.border = new Border({
      contextMenu: {
        onUpdate: (borderType, lineColor, lineType) => {
          const sheet = sheetView.getActiveSheet();
          const { table } = sheet;
          const { xScreen } = table;
          const helper = table.getDataCellsHelper();
          const xSelect = xScreen.findType(XSelectItem);
          const { selectRange } = xSelect;
          helper.setStyleBorder({
            selectRange, borderType, lineType, lineColor,
          });
        },
      },
    });
    this.horizontalAlign = new HorizontalAlign({
      contextMenu: {
        onUpdate: (type) => {
          const sheet = sheetView.getActiveSheet();
          const { table } = sheet;
          const { xScreen } = table;
          const helper = table.getDataCellsHelper();
          const xSelect = xScreen.findType(XSelectItem);
          const { selectRange } = xSelect;
          switch (type) {
            case BaseFont.ALIGN.left:
              this.horizontalAlign.setIcon(new Icon('align-left'));
              break;
            case BaseFont.ALIGN.center:
              this.horizontalAlign.setIcon(new Icon('align-center'));
              break;
            case BaseFont.ALIGN.right:
              this.horizontalAlign.setIcon(new Icon('align-right'));
              break;
            default: break;
          }
          helper.setStyleAlign({
            selectRange, type,
          });
        },
      },
    });
    this.verticalAlign = new VerticalAlign({
      contextMenu: {
        onUpdate: (type) => {
          const sheet = sheetView.getActiveSheet();
          const { table } = sheet;
          const { xScreen } = table;
          const helper = table.getDataCellsHelper();
          const xSelect = xScreen.findType(XSelectItem);
          const { selectRange } = xSelect;
          switch (type) {
            case BaseFont.VERTICAL_ALIGN.top:
              this.verticalAlign.setIcon(new Icon('align-top'));
              break;
            case BaseFont.VERTICAL_ALIGN.center:
              this.verticalAlign.setIcon(new Icon('align-middle'));
              break;
            case BaseFont.VERTICAL_ALIGN.bottom:
              this.verticalAlign.setIcon(new Icon('align-bottom'));
              break;
            default: break;
          }
          helper.setStyleVerticalAlign({
            selectRange, type,
          });
        },
      },
    });
    this.fontAngle = new FontAngle({
      contextMenu: {
        onUpdateAngle: (number) => {
          const sheet = sheetView.getActiveSheet();
          const { table } = sheet;
          const { xScreen } = table;
          const helper = table.getDataCellsHelper();
          const xSelect = xScreen.findType(XSelectItem);
          const { selectRange } = xSelect;
          helper.setStyleAngleNumber({ selectRange, number });
        },
        onUpdateType: (type) => {
          const sheet = sheetView.getActiveSheet();
          const { table } = sheet;
          const { xScreen } = table;
          const helper = table.getDataCellsHelper();
          const xSelect = xScreen.findType(XSelectItem);
          const { selectRange } = xSelect;
          helper.setStyleAngleType({ selectRange, type });
        },
      },
    });
    this.textWrapping = new TextWrapping({
      contextMenu: {
        onUpdate: (type) => {
          const sheet = sheetView.getActiveSheet();
          const { table } = sheet;
          const helper = table.getDataCellsHelper();
          const { xScreen } = table;
          const xSelect = xScreen.findType(XSelectItem);
          const { selectRange } = xSelect;
          switch (type) {
            case BaseFont.TEXT_WRAP.TRUNCATE:
              this.textWrapping.setIcon(new Icon('truncate'));
              break;
            case BaseFont.TEXT_WRAP.WORD_WRAP:
              this.textWrapping.setIcon(new Icon('text-wrap'));
              break;
            case BaseFont.TEXT_WRAP.OVER_FLOW:
              this.textWrapping.setIcon(new Icon('overflow'));
              break;
          }
          helper.setStyleWrapping({ selectRange, type });
        },
      },
    });
    this.recycleMenu = new RecycleMenu(this, {
      enable: this.options.shrinkMode === 'recycle',
    });

    // 追加到菜单中
    super.attach(this.content);
    this.attach(this.undo);
    this.attach(this.redo);
    this.attach(new Divider());
    this.attach(this.scale);
    this.attach(this.paintFormat);
    this.attach(this.clearFormat);
    this.attach(this.format);
    this.attach(new Divider());
    this.attach(this.font);
    this.attach(this.dprFontSize);
    this.attach(new Divider());
    this.attach(this.fontBold);
    this.attach(this.fontItalic);
    this.attach(this.underLine);
    this.attach(this.fontStrike);
    this.attach(this.fontColor);
    this.attach(new Divider());
    this.attach(this.fillColor);
    this.attach(this.border);
    this.attach(this.merge);
    this.attach(new Divider());
    this.attach(this.horizontalAlign);
    this.attach(this.verticalAlign);
    this.attach(this.textWrapping);
    this.attach(this.fontAngle);
    this.attach(new Divider());
    this.attach(this.fixed);
    this.attach(this.filter);
    this.attach(this.functions);
    this.attach(this.recycleMenu);
    this.bind();
  }

  bind() {
    const { body } = this.workTop.work;
    const { sheetView } = body;

    // 样式复制回调
    const paintFormatCallback = () => {
      const sheet = sheetView.getActiveSheet();
      const { table } = sheet;
      const { cellMergeCopyHelper } = table;
      const { xScreen } = table;
      const { snapshot } = table;
      const xSelect = xScreen.findType(XSelectItem);
      const xCopyStyle = xScreen.findType(XCopyStyle);
      xCopyStyle.hideCopyStyle();
      // 清除复制
      this.paintFormat.active(false);
      this.paintFormat.removeSheet(sheet);
      // 复制区域
      const originViewRange = xCopyStyle.selectRange.clone();
      const targetViewRange = xSelect.selectRange.clone();
      const [orSize, ocSize] = originViewRange.size();
      const [trSize, tcSize] = targetViewRange.size();
      const rSize = orSize > trSize ? orSize : trSize;
      const cSize = ocSize > tcSize ? ocSize : tcSize;
      targetViewRange.eri = targetViewRange.sri + (rSize - 1);
      targetViewRange.eci = targetViewRange.sci + (cSize - 1);
      // 开始复制
      snapshot.open();
      cellMergeCopyHelper.copyMergeContent({
        originViewRange,
        targetViewRange,
      });
      cellMergeCopyHelper.copyStylesContent({
        originViewRange,
        targetViewRange,
      });
      snapshot.close({
        type: Constant.TABLE_EVENT_TYPE.DATA_CHANGE,
      });
      table.render();
      // 删除事件监听
      XEvent.unbind(table, Constant.TABLE_EVENT_TYPE.SELECT_OVER, paintFormatCallback);
    };

    // 菜单状态更新
    XEvent.bind(body, Constant.TABLE_EVENT_TYPE.SNAPSHOT_CHANGE, () => {
      this.setAllStatus();
    });
    XEvent.bind(body, Constant.TABLE_EVENT_TYPE.FIXED_CHANGE, () => {
      this.setFixedStatus();
    });
    XEvent.bind(body, Constant.TABLE_EVENT_TYPE.SELECT_DOWN, () => {
      this.setAllStatus();
    });
    XEvent.bind(body, Constant.WORK_BODY_EVENT_TYPE.CHANGE_ACTIVE, () => {
      this.setAllStatus();
    });

    // 普通工具栏
    XEvent.bind(this.paintFormat, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
      const sheet = sheetView.getActiveSheet();
      const { table } = sheet;
      table.hideEditor();
      if (table.isProtection()) {
        return;
      }
      const { xScreen } = table;
      const xSelect = xScreen.findType(XSelectItem);
      const { selectRange } = xSelect;
      if (SheetUtils.isUnDef(selectRange)) {
        return;
      }
      const xCopyStyle = xScreen.findType(XCopyStyle);
      if (this.paintFormat.includeSheet(sheet)) {
        xCopyStyle.hideCopyStyle();
        this.paintFormat.active(false);
        this.paintFormat.removeSheet(sheet);
        XEvent.unbind(table, Constant.TABLE_EVENT_TYPE.SELECT_OVER, paintFormatCallback);
      } else {
        xCopyStyle.showCopyStyle();
        this.paintFormat.active(true);
        this.paintFormat.addSheet(sheet);
        XEvent.bind(table, Constant.TABLE_EVENT_TYPE.SELECT_OVER, paintFormatCallback);
      }
    });
    XEvent.bind(this.clearFormat, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
      const sheet = sheetView.getActiveSheet();
      const { table } = sheet;
      table.hideEditor();
      if (table.isProtection()) {
        return;
      }
      const operateCellsHelper = table.getOperateCellsHelper();
      const cells = table.getTableCells();
      const { xScreen } = table;
      const { snapshot } = table;
      const xSelect = xScreen.findType(XSelectItem);
      const { selectRange } = xSelect;
      if (selectRange) {
        snapshot.open();
        operateCellsHelper.getCellOrNewCellByViewRange({
          rectRange: selectRange,
          callback: (r, c, origin) => {
            const clone = origin.clone();
            clone.fontAttr.reset();
            clone.richText.reset();
            cells.setCell(r, c, clone);
          },
        });
        snapshot.close({
          type: Constant.TABLE_EVENT_TYPE.DATA_CHANGE,
        });
        table.render();
      }
    });
    XEvent.bind(this.filter, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
      const sheet = sheetView.getActiveSheet();
      const { table } = sheet;
      table.hideEditor();
      if (table.isProtection()) {
        return;
      }
      const { xScreen } = table;
      const filter = xScreen.findType(XFilter);
      if (filter.display) {
        filter.hideFilter();
        this.filter.active(filter.display);
      } else {
        filter.openFilter();
        this.filter.active(filter.display);
      }
    });
    XEvent.bind(this.undo, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
      const sheet = sheetView.getActiveSheet();
      const { table } = sheet;
      const { snapshot } = table;
      table.hideEditor();
      if (snapshot.canUndo()) snapshot.undo();
    });
    XEvent.bind(this.redo, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
      const sheet = sheetView.getActiveSheet();
      const { table } = sheet;
      const { snapshot } = table;
      table.hideEditor();
      if (snapshot.canRedo()) snapshot.redo();
    });
    XEvent.bind(this.merge, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
      const sheet = sheetView.getActiveSheet();
      const { table } = sheet;
      const helper = table.getDataCellsHelper();
      const { xScreen } = table;
      const xSelect = xScreen.findType(XSelectItem);
      const { selectRange } = xSelect;
      table.hideEditor();
      helper.setStyleMerge({ selectRange });
    });
    XEvent.bind(this.fontBold, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
      const sheet = sheetView.getActiveSheet();
      const { table } = sheet;
      const { edit } = table;
      const helper = table.getDataCellsHelper();
      if (edit.mode === BaseEdit.MODE.SHOW) {
        edit.fontBold();
      } else {
        const { xScreen } = table;
        const xSelect = xScreen.findType(XSelectItem);
        const { selectRange } = xSelect;
        helper.setStyleBold({ selectRange, bold: !this.fontBold.hasClass('active') });
      }
    });
    XEvent.bind(this.fontItalic, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
      const sheet = sheetView.getActiveSheet();
      const { table } = sheet;
      const { edit } = table;
      const helper = table.getDataCellsHelper();
      if (edit.mode === BaseEdit.MODE.SHOW) {
        edit.fontItalic();
      } else {
        const { xScreen } = table;
        const xSelect = xScreen.findType(XSelectItem);
        const { selectRange } = xSelect;
        helper.setStyleItalic({ selectRange, italic: !this.fontItalic.hasClass('active') });
      }
    });
    XEvent.bind(this.underLine, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
      const sheet = sheetView.getActiveSheet();
      const { table } = sheet;
      const { xScreen } = table;
      const { edit } = table;
      const helper = table.getDataCellsHelper();
      if (edit.mode === BaseEdit.MODE.SHOW) {
        edit.underLine();
      } else {
        const xSelect = xScreen.findType(XSelectItem);
        const { selectRange } = xSelect;
        helper.setStyleUnderLine({
          selectRange,
          underline: !this.underLine.hasClass('active'),
        });
      }
    });
    XEvent.bind(this.fontStrike, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
      const sheet = sheetView.getActiveSheet();
      const { table } = sheet;
      const { xScreen } = table;
      const { edit } = table;
      const helper = table.getDataCellsHelper();
      if (edit.mode === BaseEdit.MODE.SHOW) {
        edit.strikeLine();
      } else {
        const xSelect = xScreen.findType(XSelectItem);
        const { selectRange } = xSelect;
        helper.setStyleStrikeLine({
          selectRange,
          strikethrough: !this.fontStrike.hasClass('active'),
        });
      }
    });

    // 上下文菜单工具栏
    XEvent.bind(this.dprFontSize, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      const { dprFontSize, recycleMenu } = this;
      const { fontSizeContextMenu } = dprFontSize;
      const { recycleContextMenu } = recycleMenu;
      ElPopUp.closeAll([
        fontSizeContextMenu.elPopUp,
        recycleContextMenu.elPopUp,
      ]);
      if (fontSizeContextMenu.isClose()) {
        fontSizeContextMenu.open();
      } else {
        fontSizeContextMenu.close();
      }
      e.stopPropagation();
      e.preventDefault();
    });
    XEvent.bind(this.font, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      const { font, recycleMenu } = this;
      const { fontContextMenu } = font;
      const { recycleContextMenu } = recycleMenu;
      ElPopUp.closeAll([
        fontContextMenu.elPopUp,
        recycleContextMenu.elPopUp,
      ]);
      if (fontContextMenu.isClose()) {
        fontContextMenu.open();
      } else {
        fontContextMenu.close();
      }
      e.stopPropagation();
      e.preventDefault();
    });
    XEvent.bind(this.fontColor, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      const { fontColor, recycleMenu } = this;
      const { fontColorContextMenu } = fontColor;
      const { recycleContextMenu } = recycleMenu;
      ElPopUp.closeAll([
        fontColorContextMenu.elPopUp,
        recycleContextMenu.elPopUp,
      ]);
      if (fontColorContextMenu.isClose()) {
        fontColorContextMenu.open();
      } else {
        fontColorContextMenu.close();
      }
      e.stopPropagation();
      e.preventDefault();
    });
    XEvent.bind(this.fillColor, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      const sheet = sheetView.getActiveSheet();
      const { table } = sheet;
      table.hideEditor();
      const { fillColor, recycleMenu } = this;
      const { recycleContextMenu } = recycleMenu;
      const { fillColorContextMenu } = fillColor;
      ElPopUp.closeAll([
        fillColorContextMenu.elPopUp,
        recycleContextMenu.elPopUp,
      ]);
      if (fillColorContextMenu.isClose()) {
        fillColorContextMenu.open();
      } else {
        fillColorContextMenu.close();
      }
      e.stopPropagation();
      e.preventDefault();
    });
    XEvent.bind(this.scale, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      const sheet = sheetView.getActiveSheet();
      const { table } = sheet;
      table.hideEditor();
      const { scale, recycleMenu } = this;
      const { recycleContextMenu } = recycleMenu;
      const { scaleContextMenu } = scale;
      ElPopUp.closeAll([
        scaleContextMenu.elPopUp,
        recycleContextMenu.elPopUp,
      ]);
      if (scaleContextMenu.isClose()) {
        scaleContextMenu.open();
      } else {
        scaleContextMenu.close();
      }
      e.stopPropagation();
      e.preventDefault();
    });
    XEvent.bind(this.format, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      const sheet = sheetView.getActiveSheet();
      const { table } = sheet;
      table.hideEditor();
      const { format, recycleMenu } = this;
      const { recycleContextMenu } = recycleMenu;
      const { formatContextMenu } = format;
      ElPopUp.closeAll([
        formatContextMenu.elPopUp,
        recycleContextMenu.elPopUp,
      ]);
      if (formatContextMenu.isClose()) {
        formatContextMenu.open();
      } else {
        formatContextMenu.close();
      }
      e.stopPropagation();
      e.preventDefault();
    });
    XEvent.bind(this.border, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      const sheet = sheetView.getActiveSheet();
      const { table } = sheet;
      table.hideEditor();
      const { border, recycleMenu } = this;
      const { recycleContextMenu } = recycleMenu;
      const { borderTypeContextMenu } = border;
      ElPopUp.closeAll([
        recycleContextMenu.elPopUp,
        borderTypeContextMenu.elPopUp,
      ]);
      if (borderTypeContextMenu.isClose()) {
        borderTypeContextMenu.open();
      } else {
        borderTypeContextMenu.close();
      }
      e.stopPropagation();
      e.preventDefault();
    });
    XEvent.bind(this.textWrapping, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      const sheet = sheetView.getActiveSheet();
      const { table } = sheet;
      table.hideEditor();
      const { textWrapping, recycleMenu } = this;
      const { recycleContextMenu } = recycleMenu;
      const { textWrappingContextMenu } = textWrapping;
      ElPopUp.closeAll([
        recycleContextMenu.elPopUp,
        textWrappingContextMenu.elPopUp,
      ]);
      if (textWrappingContextMenu.isClose()) {
        textWrappingContextMenu.open();
      } else {
        textWrappingContextMenu.close();
      }
      e.stopPropagation();
      e.preventDefault();
    });
    XEvent.bind(this.horizontalAlign, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      const sheet = sheetView.getActiveSheet();
      const { table } = sheet;
      table.hideEditor();
      const { horizontalAlign, recycleMenu } = this;
      const { recycleContextMenu } = recycleMenu;
      const { horizontalContextMenu } = horizontalAlign;
      ElPopUp.closeAll([
        recycleContextMenu.elPopUp,
        horizontalContextMenu.elPopUp,
      ]);
      if (horizontalContextMenu.isClose()) {
        horizontalContextMenu.open();
      } else {
        horizontalContextMenu.close();
      }
      e.stopPropagation();
      e.preventDefault();
    });
    XEvent.bind(this.verticalAlign, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      const sheet = sheetView.getActiveSheet();
      const { table } = sheet;
      table.hideEditor();
      const { verticalAlign, recycleMenu } = this;
      const { recycleContextMenu } = recycleMenu;
      const { verticalContextMenu } = verticalAlign;
      ElPopUp.closeAll([
        recycleContextMenu.elPopUp,
        verticalContextMenu.elPopUp,
      ]);
      if (verticalContextMenu.isClose()) {
        verticalContextMenu.open();
      } else {
        verticalContextMenu.close();
      }
      e.stopPropagation();
      e.preventDefault();
    });
    XEvent.bind(this.fixed, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      const sheet = sheetView.getActiveSheet();
      const { table } = sheet;
      table.hideEditor();
      const { fixed, recycleMenu } = this;
      const { recycleContextMenu } = recycleMenu;
      const { fixedContextMenu } = fixed;
      ElPopUp.closeAll([
        recycleContextMenu.elPopUp,
        fixedContextMenu.elPopUp,
      ]);
      if (fixedContextMenu.isClose()) {
        fixedContextMenu.open();
      } else {
        fixedContextMenu.close();
      }
      e.stopPropagation();
      e.preventDefault();
    });
    XEvent.bind(this.fontAngle, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      const sheet = sheetView.getActiveSheet();
      const { table } = sheet;
      table.hideEditor();
      const { fontAngle, recycleMenu } = this;
      const { recycleContextMenu } = recycleMenu;
      const { fontAngleContextMenu } = fontAngle;
      ElPopUp.closeAll([
        recycleContextMenu.elPopUp,
        fontAngleContextMenu.elPopUp,
      ]);
      if (fontAngleContextMenu.isClose()) {
        fontAngleContextMenu.open();
      } else {
        fontAngleContextMenu.close();
      }
      e.stopPropagation();
      e.preventDefault();
    });
    XEvent.bind(this.recycleMenu, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      const { recycleMenu } = this;
      const { recycleContextMenu } = recycleMenu;
      const { elPopUp } = recycleContextMenu;
      ElPopUp.closeAll([elPopUp]);
      if (recycleContextMenu.isClose()) {
        recycleContextMenu.open();
      } else {
        recycleContextMenu.close();
      }
      e.stopPropagation();
      e.preventDefault();
    });

    // resize
    XEvent.bind(window, Constant.SYSTEM_EVENT_TYPE.RESIZE, this.resize);
  }

  attach(widget) {
    this.content.attach(widget);
  }

  setAllStatus() {
    this.setHorizontalAlignStatus();
    this.setVerticalAlignStatus();
    this.setTextWrappingStatus();
    this.setUndoStatus();
    this.setRedoStatus();
    this.setScaleStatus();
    this.setPaintFormatStatus();
    this.setFormatStatus();
    this.setFontStatus();
    this.setFixedStatus();
    this.setUnderLineStatus();
    this.setFontSizeStatus();
    this.setFilterStatus();
    this.setFontBoldStatus();
    this.setFontStrikeStatus();
    this.setFontAngleStatus();
    this.setFontItalicStatus();
    this.setBorderStatus();
    this.setFillColorStatus();
    this.setFontColorStatus();
  }

  setPaintFormatStatus() {
    let { body } = this.workTop.work;
    let { sheetView } = body;
    let sheet = sheetView.getActiveSheet();
    this.paintFormat.active(this.paintFormat.includeSheet(sheet));
  }

  setFilterStatus() {
    let { body } = this.workTop.work;
    let { sheetView } = body;
    let sheet = sheetView.getActiveSheet();
    let { table } = sheet;
    let { xScreen } = table;
    let filter = xScreen.findType(XFilter);
    this.filter.active(filter.display);
  }

  setUnderLineStatus() {
    let { body } = this.workTop.work;
    let { sheetView } = body;
    let sheet = sheetView.getActiveSheet();
    let { table } = sheet;
    let { xScreen } = table;
    let helper = table.getDataCellsHelper();
    let xSelect = xScreen.findType(XSelectItem);
    let { selectRange } = xSelect;
    let underline = helper.hasStyleUnderLine({ selectRange });
    this.underLine.active(underline);
  }

  setFontSizeStatus() {
    let { body } = this.workTop.work;
    let { sheetView } = body;
    let sheet = sheetView.getActiveSheet();
    let { table } = sheet;
    let { xScreen } = table;
    let helper = table.getDataCellsHelper();
    let xSelect = xScreen.findType(XSelectItem);
    let { selectRange } = xSelect;
    let size = helper.getStyleFontSize({ selectRange });
    this.dprFontSize.setTitle(size);
  }

  setFontBoldStatus() {
    let { body } = this.workTop.work;
    let { sheetView } = body;
    let sheet = sheetView.getActiveSheet();
    let { table } = sheet;
    let { xScreen } = table;
    let helper = table.getDataCellsHelper();
    let xSelect = xScreen.findType(XSelectItem);
    let { selectRange } = xSelect;
    let bold = helper.hasStyleBold({ selectRange });
    this.fontBold.active(bold);
  }

  setFontStrikeStatus() {
    let { body } = this.workTop.work;
    let { sheetView } = body;
    let sheet = sheetView.getActiveSheet();
    let { table } = sheet;
    let { xScreen } = table;
    let helper = table.getDataCellsHelper();
    let xSelect = xScreen.findType(XSelectItem);
    let { selectRange } = xSelect;
    let strikethrough = helper.hasStyleStrikeLine({ selectRange });
    this.fontStrike.active(strikethrough);
  }

  setFontStatus() {
    let { body } = this.workTop.work;
    let { sheetView } = body;
    let sheet = sheetView.getActiveSheet();
    let { table } = sheet;
    let { xScreen } = table;
    let helper = table.getDataCellsHelper();
    let xSelect = xScreen.findType(XSelectItem);
    let { selectRange } = xSelect;
    let name = helper.getStyleFontName({ selectRange });
    this.font.setTitle(name);
    this.font.fontContextMenu.setActiveByType(name);
  }

  setScaleStatus() {
    let { body } = this.workTop.work;
    let { sheetView } = body;
    let sheet = sheetView.getActiveSheet();
    let { table } = sheet;
    let { scale } = table;
    let value = scale.goto(100);
    this.scale.setTitle(`${value}%`);
  }

  setFixedStatus() {
    let { body } = this.workTop.work;
    let { fixed } = this;
    let { sheetView } = body;
    let sheet = sheetView.getActiveSheet();
    let { table } = sheet;
    fixed.setFixedRowStatus(table.xFixedView.hasFixedTop());
    fixed.setFixedColStatus(table.xFixedView.hasFixedLeft());
  }

  setUndoStatus() {
    let { body } = this.workTop.work;
    let { sheetView } = body;
    let sheet = sheetView.getActiveSheet();
    let { table } = sheet;
    let { snapshot } = table;
    this.undo.active(snapshot.canUndo());
  }

  setRedoStatus() {
    let { body } = this.workTop.work;
    let { sheetView } = body;
    let sheet = sheetView.getActiveSheet();
    let { table } = sheet;
    let { snapshot } = table;
    this.redo.active(snapshot.canRedo());
  }

  setFormatStatus() {
    let { body } = this.workTop.work;
    let { sheetView } = body;
    let sheet = sheetView.getActiveSheet();
    let { table } = sheet;
    let { xScreen } = table;
    let helper = table.getDataCellsHelper();
    let xSelect = xScreen.findType(XSelectItem);
    let { selectRange } = xSelect;
    let format = helper.getCellFormat({ selectRange });
    let text = '常规';
    switch (format) {
      case 'default':
        text = '常规';
        break;
      case 'text':
        text = '文本';
        break;
      case 'number':
        text = '数字';
        break;
      case 'percentage':
        text = '百分比';
        break;
      case 'fraction':
        text = '分数';
        break;
      case 'ENotation':
        text = '科学计数';
        break;
      case 'rmb':
        text = '人民币';
        break;
      case 'hk':
        text = '港币';
        break;
      case 'dollar':
        text = '美元';
        break;
      case 'date1':
      case 'date2':
      case 'date3':
      case 'date4':
      case 'date5':
        text = '日期';
        break;
      case 'time':
        text = '时间';
        break;
      default: break;
    }
    this.format.setTitle(text);
    this.format.formatContextMenu.setActiveByType(format);
  }

  setFontItalicStatus() {
    let { body } = this.workTop.work;
    let { sheetView } = body;
    let sheet = sheetView.getActiveSheet();
    let { table } = sheet;
    let { xScreen } = table;
    let helper = table.getDataCellsHelper();
    let xSelect = xScreen.findType(XSelectItem);
    let { selectRange } = xSelect;
    let italic = helper.hasStyleItalic({ selectRange });
    this.fontItalic.active(italic);
  }

  setFontAngleStatus() {
    let { body } = this.workTop.work;
    let { sheetView } = body;
    let sheet = sheetView.getActiveSheet();
    let { table } = sheet;
    let { xScreen } = table;
    let helper = table.getDataCellsHelper();
    let xSelect = xScreen.findType(XSelectItem);
    let { selectRange } = xSelect;
    let angle = helper.getStyleAngle({ selectRange });
    this.fontAngle.setValue(angle);
  }

  setBorderStatus() {
    let { body } = this.workTop.work;
    let { sheetView } = body;
    let sheet = sheetView.getActiveSheet();
    let { table } = sheet;
    let { xScreen } = table;
    let helper = table.getDataCellsHelper();
    let xSelect = xScreen.findType(XSelectItem);
    let { selectRange } = xSelect;
    let {
      leftColor,
      topColor,
      rightColor,
      bottomColor,
    } = helper.getStyleBorder({ selectRange });
    this.border.borderTypeContextMenu.borderColorContextMenu.clearCustomizeColor();
    this.border.borderTypeContextMenu.borderColorContextMenu.addCustomizeColor(leftColor);
    this.border.borderTypeContextMenu.borderColorContextMenu.addCustomizeColor(topColor);
    this.border.borderTypeContextMenu.borderColorContextMenu.addCustomizeColor(rightColor);
    this.border.borderTypeContextMenu.borderColorContextMenu.addCustomizeColor(bottomColor);
  }

  setFillColorStatus() {
    let { body } = this.workTop.work;
    let { sheetView } = body;
    let sheet = sheetView.getActiveSheet();
    let { table } = sheet;
    let { xScreen } = table;
    let helper = table.getDataCellsHelper();
    let xSelect = xScreen.findType(XSelectItem);
    let { selectRange } = xSelect;
    let color = helper.getStyleBackground({ selectRange });
    this.fillColor.setColor(color);
    this.fillColor.fillColorContextMenu.clearCustomizeColor();
    this.fillColor.fillColorContextMenu.addCustomizeColor(color);
    this.fillColor.fillColorContextMenu.setActiveByColor(color);
  }

  setFontColorStatus() {
    let { body } = this.workTop.work;
    let { sheetView } = body;
    let sheet = sheetView.getActiveSheet();
    let { table } = sheet;
    let { xScreen } = table;
    let helper = table.getDataCellsHelper();
    let xSelect = xScreen.findType(XSelectItem);
    let { selectRange } = xSelect;
    let color = helper.getStyleColor({ selectRange });
    this.fontColor.setColor(color);
    this.fontColor.fontColorContextMenu.clearCustomizeColor();
    this.fontColor.fontColorContextMenu.addCustomizeColor(color);
    this.fontColor.fontColorContextMenu.setActiveByColor(color);
  }

  setHorizontalAlignStatus() {
    let { body } = this.workTop.work;
    let { sheetView } = body;
    let sheet = sheetView.getActiveSheet();
    let { table } = sheet;
    let { xScreen } = table;
    let helper = table.getDataCellsHelper();
    let xSelect = xScreen.findType(XSelectItem);
    let { selectRange } = xSelect;
    let icon = new Icon('align-left');
    let align = helper.getStyleAlign({ selectRange });
    switch (align) {
      case BaseFont.ALIGN.left:
        icon = new Icon('align-left');
        break;
      case BaseFont.ALIGN.center:
        icon = new Icon('align-center');
        break;
      case BaseFont.ALIGN.right:
        icon = new Icon('align-right');
        break;
      default: break;
    }
    this.horizontalAlign.setIcon(icon);
  }

  setVerticalAlignStatus() {
    let { body } = this.workTop.work;
    let { sheetView } = body;
    let sheet = sheetView.getActiveSheet();
    let { table } = sheet;
    let { xScreen } = table;
    let helper = table.getDataCellsHelper();
    let xSelect = xScreen.findType(XSelectItem);
    let { selectRange } = xSelect;
    let icon = new Icon('align-middle');
    let verticalAlign = helper.getStyleVerticalAlign({ selectRange });
    switch (verticalAlign) {
      case BaseFont.VERTICAL_ALIGN.top:
        icon = new Icon('align-top');
        break;
      case BaseFont.VERTICAL_ALIGN.center:
        icon = new Icon('align-middle');
        break;
      case BaseFont.VERTICAL_ALIGN.bottom:
        icon = new Icon('align-bottom');
        break;
      default: break;
    }
    this.verticalAlign.setIcon(icon);
  }

  setTextWrappingStatus() {
    let { body } = this.workTop.work;
    let { sheetView } = body;
    let sheet = sheetView.getActiveSheet();
    let { table } = sheet;
    let { xScreen } = table;
    let xSelect = xScreen.findType(XSelectItem);
    let helper = table.getDataCellsHelper();
    let { selectRange } = xSelect;
    let icon = new Icon('text-wrap');
    let wrapping = helper.getStyleWrapping({ selectRange });
    switch (wrapping) {
      case BaseFont.TEXT_WRAP.TRUNCATE:
        icon = new Icon('truncate');
        break;
      case BaseFont.TEXT_WRAP.WORD_WRAP:
        icon = new Icon('text-wrap');
        break;
      case BaseFont.TEXT_WRAP.OVER_FLOW:
        icon = new Icon('overflow');
        break;
    }
    this.textWrapping.setIcon(icon);
  }

  destroy() {
    super.destroy();
    this.unbind();
  }
}

export { XWorkHeadMenu };
