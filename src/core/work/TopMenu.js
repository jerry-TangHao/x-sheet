import { Widget } from '../../lib/Widget';
import { cssPrefix, Constant } from '../../const/Constant';
import { Undo } from './tools/Undo';
import { Redo } from './tools/Redo';
import { PaintFormat } from './tools/PaintFormat';
import { ClearFormat } from './tools/ClearFormat';
import { Format } from './tools/Format';
import { Font } from './tools/Font';
import { FontSize } from './tools/FontSize';
import { FontBold } from './tools/FontBold';
import { FontItalic } from './tools/FontItalic';
import { UnderLine } from './tools/UnderLine';
import { FontStrike } from './tools/FontStrike';
import { FontColor } from './tools/FontColor';
import { FillColor } from './tools/FillColor';
import { Border } from './tools/Border';
import { Merge } from './tools/Merge';
import { HorizontalAlign } from './tools/HorizontalAlign';
import { VerticalAlign } from './tools/VerticalAlign';
import { TextWrapping } from './tools/TextWrapping';
import { Fixed } from './tools/Fixed';
import { Filter } from './tools/Filter';
import { Functions } from './tools/Functions';
import { XEvent } from '../../lib/XEvent';
import { ElPopUp } from '../../component/elpopup/ElPopUp';
import { LINE_TYPE } from '../../canvas/Line';
import { Icon } from './tools/Icon';
import { Cell } from '../table/tablecell/Cell';
import { PlainUtils } from '../../utils/PlainUtils';
import { Scale } from './tools/Scale';
import { BaseFont } from '../../canvas/font/BaseFont';
import { XSelectItem } from '../table/xscreenitems/xselect/XSelectItem';
import { XDraw } from '../../canvas/XDraw';
import { Alert } from '../../component/alert/Alert';
import { XFilter } from '../table/xscreenitems/xfilter/XFilter';
import { XCopyStyle } from '../table/xscreenitems/xcopystyle/XCopyStyle';
import { Confirm } from '../../component/confirm/Confirm';
import { FontAngle } from './tools/FontAngle';
import { Divider } from './tools/base/Divider';

class TopMenu extends Widget {

  constructor(workTop) {
    super(`${cssPrefix}-tools-menu`);

    this.workTop = workTop;
    const { body } = this.workTop.work;
    const { sheetView } = body;

    // tools
    this.undo = new Undo();
    this.redo = new Redo();
    this.scale = new Scale({
      contextMenu: {
        onUpdate: (value) => {
          this.scale.setTitle(`${value}%`);
          const { body } = this.workTop.work;
          body.setScale(value / 100);
        },
      },
    });
    this.paintFormat = new PaintFormat();
    this.clearFormat = new ClearFormat();
    this.format = new Format({
      contextMenu: {
        onUpdate: (format, title) => {
          const sheet = sheetView.getActiveSheet();
          const { table } = sheet;
          const {
            xScreen,
          } = table;
          const operateCellsHelper = table.getOperateCellsHelper();
          const { tableDataSnapshot } = table;
          const xSelect = xScreen.findType(XSelectItem);
          const { selectRange } = xSelect;
          this.format.setTitle(title);
          if (selectRange) {
            tableDataSnapshot.begin();
            const { cellDataProxy } = tableDataSnapshot;
            operateCellsHelper.getCellOrNewCellByViewRange({
              rectRange: selectRange,
              callback: (r, c, origin) => {
                const cell = origin.clone();
                cell.format = format;
                cellDataProxy.setCell(r, c, cell);
              },
            });
            tableDataSnapshot.end();
            table.render();
          }
        },
      },
    });
    this.font = new Font({
      contextMenu: {
        onUpdate: (type) => {
          const sheet = sheetView.getActiveSheet();
          const { table } = sheet;
          const {
            xScreen,
          } = table;
          const operateCellsHelper = table.getOperateCellsHelper();
          const { tableDataSnapshot } = table;
          const xSelect = xScreen.findType(XSelectItem);
          const { selectRange } = xSelect;
          this.font.setTitle(type);
          if (selectRange) {
            tableDataSnapshot.begin();
            const { cellDataProxy } = tableDataSnapshot;
            operateCellsHelper.getCellOrNewCellByViewRange({
              rectRange: selectRange,
              callback: (r, c, origin) => {
                const cell = origin.clone();
                cell.fontAttr.name = type;
                cellDataProxy.setCell(r, c, cell);
              },
            });
            tableDataSnapshot.end();
            table.render();
          }
        },
      },
    });
    this.dprFontSize = new FontSize({
      contextMenu: {
        onUpdate: (size) => {
          const sheet = sheetView.getActiveSheet();
          const { table } = sheet;
          const { xScreen } = table;
          const operateCellsHelper = table.getOperateCellsHelper();
          const { tableDataSnapshot } = table;
          const xSelect = xScreen.findType(XSelectItem);
          const { selectRange } = xSelect;
          this.dprFontSize.setTitle(size);
          if (selectRange) {
            tableDataSnapshot.begin();
            const { cellDataProxy } = tableDataSnapshot;
            operateCellsHelper.getCellOrNewCellByViewRange({
              rectRange: selectRange,
              callback: (r, c, origin) => {
                const cell = origin.clone();
                cell.fontAttr.size = size;
                cellDataProxy.setCell(r, c, cell);
              },
            });
            tableDataSnapshot.end();
            table.render();
          }
        },
      },
    });
    this.fontColor = new FontColor({
      contextMenu: {
        onUpdate: (color) => {
          const sheet = sheetView.getActiveSheet();
          const { table } = sheet;
          const {
            xScreen,
          } = table;
          const operateCellsHelper = table.getOperateCellsHelper();
          const { tableDataSnapshot } = table;
          const xSelect = xScreen.findType(XSelectItem);
          const { selectRange } = xSelect;
          this.fontColor.setColor(color);
          if (selectRange) {
            tableDataSnapshot.begin();
            const { cellDataProxy } = tableDataSnapshot;
            operateCellsHelper.getCellOrNewCellByViewRange({
              rectRange: selectRange,
              callback: (r, c, origin) => {
                const cell = origin.clone();
                cell.fontAttr.color = color;
                cellDataProxy.setCell(r, c, cell);
              },
            });
            tableDataSnapshot.end();
            table.render();
          }
        },
      },
    });
    this.fillColor = new FillColor({
      contextMenu: {
        onUpdate: (color) => {
          const sheet = sheetView.getActiveSheet();
          const { table } = sheet;
          const {
            xScreen,
          } = table;
          const operateCellsHelper = table.getOperateCellsHelper();
          const { tableDataSnapshot } = table;
          const xSelect = xScreen.findType(XSelectItem);
          const { selectRange } = xSelect;
          this.fillColor.setColor(color);
          if (selectRange) {
            tableDataSnapshot.begin();
            const { cellDataProxy } = tableDataSnapshot;
            operateCellsHelper.getCellOrNewCellByViewRange({
              rectRange: selectRange,
              callback: (r, c, origin) => {
                const cell = origin.clone();
                cell.background = color;
                cellDataProxy.setCell(r, c, cell);
              },
            });
            tableDataSnapshot.end();
            table.render();
          }
        },
      },
    });
    this.border = new Border({
      contextMenu: {
        onUpdate: (borderType, color, lineType) => {
          const sheet = sheetView.getActiveSheet();
          const { table } = sheet;
          const { xScreen } = table;
          const operateCellsHelper = table.getOperateCellsHelper();
          const xTableStyle = table.getXTableStyle();
          const { tableDataSnapshot } = table;
          const xSelect = xScreen.findType(XSelectItem);
          const { selectRange } = xSelect;
          if (selectRange) {
            tableDataSnapshot.begin();
            const { cellDataProxy } = tableDataSnapshot;
            const rect = selectRange;
            let widthType = XDraw.LINE_WIDTH_TYPE.low;
            let type = LINE_TYPE.SOLID_LINE;
            switch (lineType) {
              case 'line1':
                widthType = XDraw.LINE_WIDTH_TYPE.low;
                type = LINE_TYPE.SOLID_LINE;
                break;
              case 'line2':
                widthType = XDraw.LINE_WIDTH_TYPE.medium;
                type = LINE_TYPE.SOLID_LINE;
                break;
              case 'line3':
                widthType = XDraw.LINE_WIDTH_TYPE.high;
                type = LINE_TYPE.SOLID_LINE;
                break;
              case 'line4':
                type = LINE_TYPE.DOTTED_LINE;
                break;
              case 'line5':
                type = LINE_TYPE.POINT_LINE;
                break;
              case 'line6':
                type = LINE_TYPE.DOUBLE_LINE;
                break;
            }
            const angleCells = [];
            switch (borderType) {
              case 'border1':
                operateCellsHelper.getCellOrNewCellByViewRange({
                  rectRange: rect,
                  callback: (ri, ci, cell) => {
                    const newCell = cell.clone();
                    if (xTableStyle.hasAngleCell(ri)) {
                      if (xTableStyle.isAngleBarCell(ri, ci)) {
                        angleCells.push({ ri, ci, newCell });
                        return;
                      }
                    }
                    const { borderAttr } = newCell;
                    borderAttr.setAllDisplay(true);
                    borderAttr.setAllColor(color);
                    borderAttr.setAllWidthType(widthType);
                    borderAttr.setAllType(type);
                    cellDataProxy.setCell(ri, ci, newCell);
                  },
                });
                angleCells.forEach((options) => {
                  const { ri, ci, newCell } = options;
                  const { borderAttr } = newCell;
                  borderAttr.setAllDisplay(true);
                  borderAttr.setAllColor(color);
                  borderAttr.setAllWidthType(widthType);
                  borderAttr.setAllType(type);
                  cellDataProxy.setCell(ri, ci, newCell);
                });
                break;
              case 'border2':
                operateCellsHelper.getCellOrNewCellByViewRange({
                  rectRange: rect,
                  callback: (ri, ci, cell) => {
                    const newCell = cell.clone();
                    if (xTableStyle.hasAngleCell(ri)) {
                      if (xTableStyle.isAngleBarCell(ri, ci)) {
                        angleCells.push({ ri, ci, newCell });
                        return;
                      }
                    }
                    const { borderAttr } = newCell;
                    if (ri !== rect.sri) {
                      borderAttr.setTDisplay(true);
                      borderAttr.setTColor(color);
                      borderAttr.setTWidthType(widthType);
                      borderAttr.setTType(type);
                    }
                    if (ri !== rect.eri) {
                      borderAttr.setBDisplay(true);
                      borderAttr.setBColor(color);
                      borderAttr.setBWidthType(widthType);
                      borderAttr.setBType(type);
                    }
                    if (ci !== rect.sci) {
                      borderAttr.setLDisplay(true);
                      borderAttr.setLColor(color);
                      borderAttr.setLWidthType(widthType);
                      borderAttr.setLType(type);
                    }
                    if (ci !== rect.eci) {
                      borderAttr.setRDisplay(true);
                      borderAttr.setRColor(color);
                      borderAttr.setRWidthType(widthType);
                      borderAttr.setRType(type);
                    }
                    cellDataProxy.setCell(ri, ci, newCell);
                  },
                });
                angleCells.forEach((options) => {
                  const { ri, ci, newCell } = options;
                  const { borderAttr } = newCell;
                  if (ri !== rect.sri) {
                    borderAttr.setTDisplay(true);
                    borderAttr.setTColor(color);
                    borderAttr.setTWidthType(widthType);
                    borderAttr.setTType(type);
                  }
                  if (ri !== rect.eri) {
                    borderAttr.setBDisplay(true);
                    borderAttr.setBColor(color);
                    borderAttr.setBWidthType(widthType);
                    borderAttr.setBType(type);
                  }
                  if (ci !== rect.sci) {
                    borderAttr.setLDisplay(true);
                    borderAttr.setLColor(color);
                    borderAttr.setLWidthType(widthType);
                    borderAttr.setLType(type);
                  }
                  if (ci !== rect.eci) {
                    borderAttr.setRDisplay(true);
                    borderAttr.setRColor(color);
                    borderAttr.setRWidthType(widthType);
                    borderAttr.setRType(type);
                  }
                  cellDataProxy.setCell(ri, ci, newCell);
                });
                break;
              case 'border3':
                operateCellsHelper.getCellOrNewCellByViewRange({
                  rectRange: rect,
                  callback: (ri, ci, cell) => {
                    const newCell = cell.clone();
                    if (xTableStyle.hasAngleCell(ri)) {
                      if (xTableStyle.isAngleBarCell(ri, ci)) {
                        angleCells.push({ ri, ci, newCell });
                        return;
                      }
                    }
                    const { borderAttr } = newCell;
                    if (ri !== rect.sri) {
                      borderAttr.setTDisplay(true);
                      borderAttr.setTColor(color);
                      borderAttr.setTWidthType(widthType);
                      borderAttr.setTType(type);
                    }
                    if (ri !== rect.eri) {
                      borderAttr.setBDisplay(true);
                      borderAttr.setBColor(color);
                      borderAttr.setBWidthType(widthType);
                      borderAttr.setBType(type);
                    }
                  },
                });
                angleCells.forEach((options) => {
                  const { ri, newCell } = options;
                  const { borderAttr } = newCell;
                  if (ri !== rect.sri) {
                    borderAttr.setTDisplay(true);
                    borderAttr.setTColor(color);
                    borderAttr.setTWidthType(widthType);
                    borderAttr.setTType(type);
                  }
                  if (ri !== rect.eri) {
                    borderAttr.setBDisplay(true);
                    borderAttr.setBColor(color);
                    borderAttr.setBWidthType(widthType);
                    borderAttr.setBType(type);
                  }
                });
                break;
              case 'border4':
                operateCellsHelper.getCellOrNewCellByViewRange({
                  rectRange: rect,
                  callback: (ri, ci, cell) => {
                    const newCell = cell.clone();
                    if (xTableStyle.hasAngleCell(ri)) {
                      if (xTableStyle.isAngleBarCell(ri, ci)) {
                        angleCells.push({ ri, ci, newCell });
                        return;
                      }
                    }
                    const { borderAttr } = newCell;
                    if (ci !== rect.sci) {
                      borderAttr.setLDisplay(true);
                      borderAttr.setLColor(color);
                      borderAttr.setLWidthType(widthType);
                      borderAttr.setLType(type);
                    }
                    if (ci !== rect.eci) {
                      borderAttr.setRDisplay(true);
                      borderAttr.setRColor(color);
                      borderAttr.setRWidthType(widthType);
                      borderAttr.setRType(type);
                    }
                    cellDataProxy.setCell(ri, ci, newCell);
                  },
                });
                angleCells.forEach((options) => {
                  const { ri, ci, newCell } = options;
                  const { borderAttr } = newCell;
                  if (ci !== rect.sci) {
                    borderAttr.setLDisplay(true);
                    borderAttr.setLColor(color);
                    borderAttr.setLWidthType(widthType);
                    borderAttr.setLType(type);
                  }
                  if (ci !== rect.eci) {
                    borderAttr.setRDisplay(true);
                    borderAttr.setRColor(color);
                    borderAttr.setRWidthType(widthType);
                    borderAttr.setRType(type);
                  }
                  cellDataProxy.setCell(ri, ci, newCell);
                });
                break;
              case 'border5':
                operateCellsHelper.getCellOrNewCellByViewRange({
                  rectRange: rect,
                  callback: (ri, ci, cell) => {
                    const newCell = cell.clone();
                    if (xTableStyle.hasAngleCell(ri)) {
                      if (xTableStyle.isAngleBarCell(ri, ci)) {
                        angleCells.push({ ri, ci, newCell });
                        return;
                      }
                    }
                    const { borderAttr } = newCell;
                    if (ri === rect.sri) {
                      borderAttr.setTDisplay(true);
                      borderAttr.setTColor(color);
                      borderAttr.setTWidthType(widthType);
                      borderAttr.setTType(type);
                    }
                    if (ri === rect.eri) {
                      borderAttr.setBDisplay(true);
                      borderAttr.setBColor(color);
                      borderAttr.setBWidthType(widthType);
                      borderAttr.setBType(type);
                    }
                    if (ci === rect.sci) {
                      borderAttr.setLDisplay(true);
                      borderAttr.setLColor(color);
                      borderAttr.setLWidthType(widthType);
                      borderAttr.setLType(type);
                    }
                    if (ci === rect.eci) {
                      borderAttr.setRDisplay(true);
                      borderAttr.setRColor(color);
                      borderAttr.setRWidthType(widthType);
                      borderAttr.setRType(type);
                    }
                    cellDataProxy.setCell(ri, ci, newCell);
                  },
                });
                angleCells.forEach((options) => {
                  const { ri, ci, newCell } = options;
                  const { borderAttr } = newCell;
                  if (ri === rect.sri) {
                    borderAttr.setTDisplay(true);
                    borderAttr.setTColor(color);
                    borderAttr.setTWidthType(widthType);
                    borderAttr.setTType(type);
                  }
                  if (ri === rect.eri) {
                    borderAttr.setBDisplay(true);
                    borderAttr.setBColor(color);
                    borderAttr.setBWidthType(widthType);
                    borderAttr.setBType(type);
                  }
                  if (ci === rect.sci) {
                    borderAttr.setLDisplay(true);
                    borderAttr.setLColor(color);
                    borderAttr.setLWidthType(widthType);
                    borderAttr.setLType(type);
                  }
                  if (ci === rect.eci) {
                    borderAttr.setRDisplay(true);
                    borderAttr.setRColor(color);
                    borderAttr.setRWidthType(widthType);
                    borderAttr.setRType(type);
                  }
                  cellDataProxy.setCell(ri, ci, newCell);
                });
                break;
              case 'border6':
                operateCellsHelper.getCellOrNewCellByViewRange({
                  rectRange: rect,
                  callback: (ri, ci, cell) => {
                    const newCell = cell.clone();
                    if (xTableStyle.hasAngleCell(ri)) {
                      if (xTableStyle.isAngleBarCell(ri, ci)) {
                        angleCells.push({ ri, ci, newCell });
                        return;
                      }
                    }
                    const { borderAttr } = newCell;
                    if (ci === rect.sci) {
                      borderAttr.setLDisplay(true);
                      borderAttr.setLColor(color);
                      borderAttr.setLWidthType(widthType);
                      borderAttr.setLType(type);
                    }
                    cellDataProxy.setCell(ri, ci, newCell);
                  },
                });
                angleCells.forEach((options) => {
                  const { ri, ci, newCell } = options;
                  const { borderAttr } = newCell;
                  if (ci === rect.sci) {
                    borderAttr.setLDisplay(true);
                    borderAttr.setLColor(color);
                    borderAttr.setLWidthType(widthType);
                    borderAttr.setLType(type);
                  }
                  cellDataProxy.setCell(ri, ci, newCell);
                });
                break;
              case 'border7':
                operateCellsHelper.getCellOrNewCellByViewRange({
                  rectRange: rect,
                  callback: (ri, ci, cell) => {
                    const newCell = cell.clone();
                    if (xTableStyle.hasAngleCell(ri)) {
                      if (xTableStyle.isAngleBarCell(ri, ci)) {
                        angleCells.push({ ri, ci, newCell });
                        return;
                      }
                    }
                    const { borderAttr } = newCell;
                    if (ri === rect.sri) {
                      borderAttr.setTDisplay(true);
                      borderAttr.setTColor(color);
                      borderAttr.setTWidthType(widthType);
                      borderAttr.setTType(type);
                    }
                    cellDataProxy.setCell(ri, ci, newCell);
                  },
                });
                angleCells.forEach((options) => {
                  const { ri, ci, newCell } = options;
                  const { borderAttr } = newCell;
                  if (ri === rect.sri) {
                    borderAttr.setTDisplay(true);
                    borderAttr.setTColor(color);
                    borderAttr.setTWidthType(widthType);
                    borderAttr.setTType(type);
                  }
                  cellDataProxy.setCell(ri, ci, newCell);
                });
                break;
              case 'border8':
                operateCellsHelper.getCellOrNewCellByViewRange({
                  rectRange: rect,
                  callback: (ri, ci, cell) => {
                    const newCell = cell.clone();
                    if (xTableStyle.hasAngleCell(ri)) {
                      if (xTableStyle.isAngleBarCell(ri, ci)) {
                        angleCells.push({ ri, ci, newCell });
                        return;
                      }
                    }
                    const { borderAttr } = newCell;
                    if (ci === rect.eci) {
                      borderAttr.setRDisplay(true);
                      borderAttr.setRColor(color);
                      borderAttr.setRWidthType(widthType);
                      borderAttr.setRType(type);
                    }
                    cellDataProxy.setCell(ri, ci, newCell);
                  },
                });
                angleCells.forEach((options) => {
                  const { ri, ci, newCell } = options;
                  const { borderAttr } = newCell;
                  if (ci === rect.eci) {
                    borderAttr.setRDisplay(true);
                    borderAttr.setRColor(color);
                    borderAttr.setRWidthType(widthType);
                    borderAttr.setRType(type);
                  }
                  cellDataProxy.setCell(ri, ci, newCell);
                });
                break;
              case 'border9':
                operateCellsHelper.getCellOrNewCellByViewRange({
                  rectRange: rect,
                  callback: (ri, ci, cell) => {
                    const newCell = cell.clone();
                    if (xTableStyle.hasAngleCell(ri)) {
                      if (xTableStyle.isAngleBarCell(ri, ci)) {
                        angleCells.push({ ri, ci, newCell });
                        return;
                      }
                    }
                    const { borderAttr } = newCell;
                    if (ri === rect.eri) {
                      borderAttr.setBDisplay(true);
                      borderAttr.setBColor(color);
                      borderAttr.setBWidthType(widthType);
                      borderAttr.setBType(type);
                    }
                    cellDataProxy.setCell(ri, ci, newCell);
                  },
                });
                angleCells.forEach((options) => {
                  const { ri, ci, newCell } = options;
                  const { borderAttr } = newCell;
                  if (ri === rect.eri) {
                    borderAttr.setBDisplay(true);
                    borderAttr.setBColor(color);
                    borderAttr.setBWidthType(widthType);
                    borderAttr.setBType(type);
                  }
                  cellDataProxy.setCell(ri, ci, newCell);
                });
                break;
              case 'border10':
                operateCellsHelper.getCellOrNewCellByViewRange({
                  rectRange: rect,
                  callback: (ri, ci, cell) => {
                    const newCell = cell.clone();
                    if (xTableStyle.hasAngleCell(ri)) {
                      if (xTableStyle.isAngleBarCell(ri, ci)) {
                        angleCells.push({ ri, ci, newCell });
                        return;
                      }
                    }
                    const { borderAttr } = newCell;
                    borderAttr.setAllDisplay(false);
                    cellDataProxy.setCell(ri, ci, newCell);
                  },
                });
                angleCells.forEach((options) => {
                  const { ri, ci, newCell } = options;
                  const { borderAttr } = newCell;
                  borderAttr.setAllDisplay(false);
                  cellDataProxy.setCell(ri, ci, newCell);
                });
                break;
            }
            tableDataSnapshot.end();
            table.render();
          }
        },
      },
    });
    this.fontBold = new FontBold();
    this.fontItalic = new FontItalic();
    this.underLine = new UnderLine();
    this.fontStrike = new FontStrike();
    this.merge = new Merge();
    this.horizontalAlign = new HorizontalAlign({
      contextMenu: {
        onUpdate: (type) => {
          const sheet = sheetView.getActiveSheet();
          const { table } = sheet;
          const {
            xScreen,
          } = table;
          const operateCellsHelper = table.getOperateCellsHelper();
          const { tableDataSnapshot } = table;
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
          if (selectRange) {
            tableDataSnapshot.begin();
            const { cellDataProxy } = tableDataSnapshot;
            operateCellsHelper.getCellOrNewCellByViewRange({
              rectRange: selectRange,
              callback: (r, c, origin) => {
                const cell = origin.clone();
                cell.fontAttr.align = type;
                cellDataProxy.setCell(r, c, cell);
              },
            });
            tableDataSnapshot.end();
            table.render();
          }
        },
      },
    });
    this.verticalAlign = new VerticalAlign({
      contextMenu: {
        onUpdate: (type) => {
          const sheet = sheetView.getActiveSheet();
          const { table } = sheet;
          const {
            xScreen,
          } = table;
          const operateCellsHelper = table.getOperateCellsHelper();
          const { tableDataSnapshot } = table;
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
          if (selectRange) {
            tableDataSnapshot.begin();
            const { cellDataProxy } = tableDataSnapshot;
            operateCellsHelper.getCellOrNewCellByViewRange({
              rectRange: selectRange,
              callback: (r, c, origin) => {
                const cell = origin.clone();
                cell.fontAttr.verticalAlign = type;
                cellDataProxy.setCell(r, c, cell);
              },
            });
            tableDataSnapshot.end();
            table.render();
          }
        },
      },
    });
    this.textWrapping = new TextWrapping({
      contextMenu: {
        onUpdate: (type) => {
          const sheet = sheetView.getActiveSheet();
          const { table } = sheet;
          const {
            xScreen,
          } = table;
          const operateCellsHelper = table.getOperateCellsHelper();
          const { tableDataSnapshot } = table;
          const xSelect = xScreen.findType(XSelectItem);
          const { selectRange } = xSelect;
          let icon;
          switch (type) {
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
          if (selectRange) {
            tableDataSnapshot.begin();
            const { cellDataProxy } = tableDataSnapshot;
            operateCellsHelper.getCellOrNewCellByViewRange({
              rectRange: selectRange,
              callback: (r, c, origin) => {
                const cell = origin.clone();
                cell.fontAttr.textWrap = type;
                cellDataProxy.setCell(r, c, cell);
              },
            });
            tableDataSnapshot.end();
            table.render();
          }
        },
      },
    });
    this.fixed = new Fixed({
      contextMenu: {
        onUpdate: (type) => {
          const sheet = sheetView.getActiveSheet();
          const { table } = sheet;
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
                  new Alert({ message: '无法在当前区域内冻结单元格, 请重新选择冻结区域' }).open();
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
                  new Alert({ message: '无法在当前区域内冻结单元格, 请重新选择冻结区域' }).open();
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
        },
      },
    });
    this.filter = new Filter();
    this.functions = new Functions();
    this.fontAngle = new FontAngle({
      contextMenu: {
        onUpdateAngle: (angle) => {
          const sheet = sheetView.getActiveSheet();
          const { table } = sheet;
          const { xScreen } = table;
          const operateCellsHelper = table.getOperateCellsHelper();
          const { tableDataSnapshot } = table;
          const xSelect = xScreen.findType(XSelectItem);
          const { selectRange } = xSelect;
          if (selectRange) {
            tableDataSnapshot.begin();
            const { cellDataProxy } = tableDataSnapshot;
            operateCellsHelper.getCellOrNewCellByViewRange({
              rectRange: selectRange,
              callback: (r, c, origin) => {
                const cell = origin.clone();
                if (angle === 0) {
                  cell.fontAttr.angle = angle;
                  cell.fontAttr.direction = BaseFont.TEXT_DIRECTION.HORIZONTAL;
                } else {
                  cell.borderAttr.updateMaxIndex();
                  cell.fontAttr.angle = angle;
                  cell.fontAttr.direction = BaseFont.TEXT_DIRECTION.ANGLE;
                }
                cellDataProxy.setCell(r, c, cell);
              },
            });
            tableDataSnapshot.end();
            table.render();
          }
        },
        onUpdateType: (type) => {
          const sheet = sheetView.getActiveSheet();
          const { table } = sheet;
          const { xScreen } = table;
          const operateCellsHelper = table.getOperateCellsHelper();
          const { tableDataSnapshot } = table;
          const xSelect = xScreen.findType(XSelectItem);
          const { selectRange } = xSelect;
          if (selectRange) {
            tableDataSnapshot.begin();
            const { cellDataProxy } = tableDataSnapshot;
            operateCellsHelper.getCellOrNewCellByViewRange({
              rectRange: selectRange,
              callback: (r, c, origin) => {
                const cell = origin.clone();
                cell.fontAttr.angle = 0;
                cell.fontAttr.direction = type;
                cellDataProxy.setCell(r, c, cell);
              },
            });
            tableDataSnapshot.end();
            table.render();
          }
        },
      },
    });
    this.children(this.undo);
    this.children(this.redo);
    this.children(new Divider());
    this.children(this.scale);
    this.children(this.paintFormat);
    this.children(this.clearFormat);
    this.children(this.format);
    this.children(new Divider());
    this.children(this.font);
    this.children(this.dprFontSize);
    this.children(new Divider());
    this.children(this.fontBold);
    this.children(this.fontItalic);
    this.children(this.underLine);
    this.children(this.fontStrike);
    this.children(this.fontColor);
    this.children(new Divider());
    this.children(this.fillColor);
    this.children(this.border);
    this.children(this.merge);
    this.children(new Divider());
    this.children(this.horizontalAlign);
    this.children(this.verticalAlign);
    this.children(this.textWrapping);
    this.children(this.fontAngle);
    this.children(new Divider());
    this.children(this.fixed);
    this.children(this.filter);
    this.children(this.functions);
  }

  onAttach() {
    this.bind();
  }

  unbind() {
    const { body } = this.workTop.work;
    XEvent.bind(body);
    XEvent.bind(this.scale);
    XEvent.bind(this.undo);
    XEvent.bind(this.redo);
    XEvent.bind(this.paintFormat);
    XEvent.bind(this.clearFormat);
    XEvent.bind(this.format);
    XEvent.bind(this.font);
    XEvent.bind(this.dprFontSize);
    XEvent.bind(this.fontBold);
    XEvent.bind(this.fontItalic);
    XEvent.bind(this.underLine);
    XEvent.bind(this.fontStrike);
    XEvent.bind(this.fontColor);
    XEvent.bind(this.fillColor);
    XEvent.bind(this.border);
    XEvent.bind(this.merge);
    XEvent.bind(this.horizontalAlign);
    XEvent.bind(this.verticalAlign);
    XEvent.bind(this.textWrapping);
    XEvent.bind(this.fixed);
    XEvent.bind(this.filter);
  }

  bind() {
    const { body } = this.workTop.work;
    const { sheetView } = body;
    XEvent.bind(body, Constant.WORK_BODY_EVENT_TYPE.CHANGE_ACTIVE, () => {
      this.setStatus();
    });
    XEvent.bind(body, Constant.TABLE_EVENT_TYPE.SELECT_DOWN, () => {
      this.setFormatStatus();
      this.setFontStatus();
      this.setFontSizeStatus();
      this.setFontBoldStatus();
      this.setFontItalicStatus();
      this.setUnderLineStatus();
      this.setFontStrikeStatus();
      this.setFontColorStatus();
      this.setFillColorStatus();
      this.setHorizontalAlignStatus();
      this.setVerticalAlignStatus();
      this.setTextWrappingStatus();
      this.setFontAngleStatus();
    });
    XEvent.bind(body, Constant.TABLE_EVENT_TYPE.DATA_CHANGE, () => {
      this.setStatus();
    });
    XEvent.bind(body, Constant.TABLE_EVENT_TYPE.FIXED_CHANGE, () => {
      this.setFixedStatus();
    });
    XEvent.bind(this.scale, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      const { scale } = this;
      const { scaleContextMenu } = scale;
      const { elPopUp } = scaleContextMenu;
      ElPopUp.closeAll([elPopUp]);
      if (scaleContextMenu.isClose()) {
        scaleContextMenu.open();
      } else {
        scaleContextMenu.close();
      }
      e.stopPropagation();
      e.preventDefault();
    });
    XEvent.bind(this.undo, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
      const sheet = sheetView.getActiveSheet();
      const { table } = sheet;
      const { tableDataSnapshot } = table;
      if (tableDataSnapshot.canBack()) tableDataSnapshot.back();
    });
    XEvent.bind(this.redo, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
      const sheet = sheetView.getActiveSheet();
      const { table } = sheet;
      const { tableDataSnapshot } = table;
      if (tableDataSnapshot.canGo()) tableDataSnapshot.go();
    });
    XEvent.bind(this.paintFormat, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
      const sheet = sheetView.getActiveSheet();
      const { table } = sheet;
      const { xScreen } = table;
      const xSelect = xScreen.findType(XSelectItem);
      const { selectRange } = xSelect;
      if (PlainUtils.isUnDef(selectRange)) {
        return;
      }
      const { cellMergeCopyHelper } = table;
      const { tableDataSnapshot } = table;
      const xCopyStyle = xScreen.findType(XCopyStyle);
      const callback = () => {
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
        tableDataSnapshot.begin();
        cellMergeCopyHelper.copyMergeContent({
          originViewRange,
          targetViewRange,
        });
        cellMergeCopyHelper.copyStylesContent({
          originViewRange,
          targetViewRange,
        });
        tableDataSnapshot.end();
        table.render();
        // 删除事件监听
        XEvent.unbind(table, Constant.TABLE_EVENT_TYPE.SELECT_OVER, callback);
      };
      if (this.paintFormat.includeSheet(sheet)) {
        xCopyStyle.hideCopyStyle();
        this.paintFormat.active(false);
        this.paintFormat.removeSheet(sheet);
        XEvent.unbind(table, Constant.TABLE_EVENT_TYPE.SELECT_OVER, callback);
      } else {
        xCopyStyle.showCopyStyle();
        this.paintFormat.active(true);
        this.paintFormat.addSheet(sheet);
        XEvent.bind(table, Constant.TABLE_EVENT_TYPE.SELECT_OVER, callback);
      }
    });
    XEvent.bind(this.clearFormat, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
      const sheet = sheetView.getActiveSheet();
      const { table } = sheet;
      const {
        xScreen,
      } = table;
      const operateCellsHelper = table.getOperateCellsHelper();
      const { tableDataSnapshot } = table;
      const xSelect = xScreen.findType(XSelectItem);
      const { selectRange } = xSelect;
      if (selectRange) {
        tableDataSnapshot.begin();
        const { cellDataProxy } = tableDataSnapshot;
        operateCellsHelper.getCellOrNewCellByViewRange({
          rectRange: selectRange,
          callback: (r, c, origin) => {
            const { text } = origin;
            cellDataProxy.setCell(r, c, new Cell({ text }));
          },
        });
        tableDataSnapshot.end();
        table.render();
      }
    });
    XEvent.bind(this.format, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      const { format } = this;
      const { formatContextMenu } = format;
      const { elPopUp } = formatContextMenu;
      ElPopUp.closeAll([elPopUp]);
      if (formatContextMenu.isClose()) {
        formatContextMenu.open();
      } else {
        formatContextMenu.close();
      }
      e.stopPropagation();
      e.preventDefault();
    });
    XEvent.bind(this.font, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      const { font } = this;
      const { fontContextMenu } = font;
      const { elPopUp } = fontContextMenu;
      ElPopUp.closeAll([elPopUp]);
      if (fontContextMenu.isClose()) {
        fontContextMenu.open();
      } else {
        fontContextMenu.close();
      }
      e.stopPropagation();
      e.preventDefault();
    });
    XEvent.bind(this.dprFontSize, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      const { dprFontSize } = this;
      const { fontSizeContextMenu } = dprFontSize;
      const { elPopUp } = fontSizeContextMenu;
      ElPopUp.closeAll([elPopUp]);
      if (fontSizeContextMenu.isClose()) {
        fontSizeContextMenu.open();
      } else {
        fontSizeContextMenu.close();
      }
      e.stopPropagation();
      e.preventDefault();
    });
    XEvent.bind(this.fontBold, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
      const sheet = sheetView.getActiveSheet();
      const { table } = sheet;
      const {
        xScreen,
      } = table;
      const operateCellsHelper = table.getOperateCellsHelper();
      const cells = table.getTableCells();
      const { tableDataSnapshot } = table;
      const xSelect = xScreen.findType(XSelectItem);
      const { selectRange } = xSelect;
      if (selectRange) {
        const firstCell = cells.getCellOrNew(selectRange.sri, selectRange.sci);
        const bold = !firstCell.fontAttr.bold;
        tableDataSnapshot.begin();
        const { cellDataProxy } = tableDataSnapshot;
        operateCellsHelper.getCellOrNewCellByViewRange({
          rectRange: selectRange,
          callback: (r, c, origin) => {
            const cell = origin.clone();
            cell.fontAttr.bold = bold;
            cellDataProxy.setCell(r, c, cell);
          },
        });
        tableDataSnapshot.end();
        table.render();
      }
    });
    XEvent.bind(this.fontItalic, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
      const sheet = sheetView.getActiveSheet();
      const { table } = sheet;
      const {
        xScreen,
      } = table;
      const operateCellsHelper = table.getOperateCellsHelper();
      const cells = table.getTableCells();
      const { tableDataSnapshot } = table;
      const xSelect = xScreen.findType(XSelectItem);
      const { selectRange } = xSelect;
      if (selectRange) {
        const firstCell = cells.getCellOrNew(selectRange.sri, selectRange.sci);
        const italic = !firstCell.fontAttr.italic;
        tableDataSnapshot.begin();
        const { cellDataProxy } = tableDataSnapshot;
        operateCellsHelper.getCellOrNewCellByViewRange({
          rectRange: selectRange,
          callback: (r, c, origin) => {
            const cell = origin.clone();
            cell.fontAttr.italic = italic;
            cellDataProxy.setCell(r, c, cell);
          },
        });
        tableDataSnapshot.end();
        table.render();
      }
    });
    XEvent.bind(this.underLine, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
      const sheet = sheetView.getActiveSheet();
      const { table } = sheet;
      const {
        xScreen,
      } = table;
      const operateCellsHelper = table.getOperateCellsHelper();
      const cells = table.getTableCells();
      const { tableDataSnapshot } = table;
      const xSelect = xScreen.findType(XSelectItem);
      const { selectRange } = xSelect;
      if (selectRange) {
        const firstCell = cells.getCellOrNew(selectRange.sri, selectRange.sci);
        const underline = !firstCell.fontAttr.underline;
        tableDataSnapshot.begin();
        const { cellDataProxy } = tableDataSnapshot;
        operateCellsHelper.getCellOrNewCellByViewRange({
          rectRange: selectRange,
          callback: (r, c, origin) => {
            const cell = origin.clone();
            cell.fontAttr.underline = underline;
            cellDataProxy.setCell(r, c, cell);
          },
        });
        tableDataSnapshot.end();
        table.render();
      }
    });
    XEvent.bind(this.fontStrike, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
      const sheet = sheetView.getActiveSheet();
      const { table } = sheet;
      const {
        xScreen,
      } = table;
      const operateCellsHelper = table.getOperateCellsHelper();
      const cells = table.getTableCells();
      const { tableDataSnapshot } = table;
      const xSelect = xScreen.findType(XSelectItem);
      const { selectRange } = xSelect;
      if (selectRange) {
        const firstCell = cells.getCellOrNew(selectRange.sri, selectRange.sci);
        const strikethrough = !firstCell.fontAttr.strikethrough;
        tableDataSnapshot.begin();
        const { cellDataProxy } = tableDataSnapshot;
        operateCellsHelper.getCellOrNewCellByViewRange({
          rectRange: selectRange,
          callback: (r, c, origin) => {
            const cell = origin.clone();
            cell.fontAttr.strikethrough = strikethrough;
            cellDataProxy.setCell(r, c, cell);
          },
        });
        tableDataSnapshot.end();
        table.render();
      }
    });
    XEvent.bind(this.fontColor, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      const { fontColor } = this;
      const { fontColorContextMenu } = fontColor;
      const { elPopUp } = fontColorContextMenu;
      ElPopUp.closeAll([elPopUp]);
      if (fontColorContextMenu.isClose()) {
        fontColorContextMenu.open();
      } else {
        fontColorContextMenu.close();
      }
      e.stopPropagation();
      e.preventDefault();
    });
    XEvent.bind(this.fillColor, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      const { fillColor } = this;
      const { fillColorContextMenu } = fillColor;
      const { elPopUp } = fillColorContextMenu;
      ElPopUp.closeAll([elPopUp]);
      if (fillColorContextMenu.isClose()) {
        fillColorContextMenu.open();
      } else {
        fillColorContextMenu.close();
      }
      e.stopPropagation();
      e.preventDefault();
    });
    XEvent.bind(this.border, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      const { border } = this;
      const { borderTypeContextMenu } = border;
      const { elPopUp } = borderTypeContextMenu;
      ElPopUp.closeAll([elPopUp]);
      if (borderTypeContextMenu.isClose()) {
        borderTypeContextMenu.open();
      } else {
        borderTypeContextMenu.close();
      }
      e.stopPropagation();
      e.preventDefault();
    });
    XEvent.bind(this.merge, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      const sheet = sheetView.getActiveSheet();
      const { table } = sheet;
      const {
        xScreen,
      } = table;
      const merges = table.getTableMerges();
      const cells = table.getTableCells();
      const { tableDataSnapshot } = table;
      const xSelect = xScreen.findType(XSelectItem);
      const { selectRange } = xSelect;
      if (selectRange) {
        const merge = selectRange.clone();
        const find = merges.getFirstIncludes(merge.sri, merge.sci);
        const { mergeDataProxy } = tableDataSnapshot;
        if (PlainUtils.isNotUnDef(find) && merge.equals(find)) {
          tableDataSnapshot.begin();
          mergeDataProxy.deleteMerge(find);
          tableDataSnapshot.end();
          table.render();
        } else if (merge.multiple()) {
          if (cells.emptyRectRange(merge)) {
            tableDataSnapshot.begin();
            mergeDataProxy.addMerge(merge);
            tableDataSnapshot.end();
            table.render();
          } else {
            new Confirm({
              message: '非空单元格合并将使用左上角单元格内容',
              ok: () => {
                tableDataSnapshot.begin();
                mergeDataProxy.addMerge(merge);
                tableDataSnapshot.end();
                table.render();
              },
            }).open();
          }
        }
      }
      e.stopPropagation();
      e.preventDefault();
    });
    XEvent.bind(this.horizontalAlign, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      const { horizontalAlign } = this;
      const { horizontalContextMenu } = horizontalAlign;
      const { elPopUp } = horizontalContextMenu;
      ElPopUp.closeAll([elPopUp]);
      if (horizontalContextMenu.isClose()) {
        horizontalContextMenu.open();
      } else {
        horizontalContextMenu.close();
      }
      e.stopPropagation();
      e.preventDefault();
    });
    XEvent.bind(this.verticalAlign, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      const { verticalAlign } = this;
      const { verticalContextMenu } = verticalAlign;
      const { elPopUp } = verticalContextMenu;
      ElPopUp.closeAll([elPopUp]);
      if (verticalContextMenu.isClose()) {
        verticalContextMenu.open();
      } else {
        verticalContextMenu.close();
      }
      e.stopPropagation();
      e.preventDefault();
    });
    XEvent.bind(this.textWrapping, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      const { textWrapping } = this;
      const { textWrappingContextMenu } = textWrapping;
      const { elPopUp } = textWrappingContextMenu;
      ElPopUp.closeAll([elPopUp]);
      if (textWrappingContextMenu.isClose()) {
        textWrappingContextMenu.open();
      } else {
        textWrappingContextMenu.close();
      }
      e.stopPropagation();
      e.preventDefault();
    });
    XEvent.bind(this.fixed, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      const { fixed } = this;
      const { fixedContextMenu } = fixed;
      const { elPopUp } = fixedContextMenu;
      ElPopUp.closeAll([elPopUp]);
      if (fixedContextMenu.isClose()) {
        fixedContextMenu.open();
      } else {
        fixedContextMenu.close();
      }
      e.stopPropagation();
      e.preventDefault();
    });
    XEvent.bind(this.filter, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
      const sheet = sheetView.getActiveSheet();
      const { table } = sheet;
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
    XEvent.bind(this.fontAngle, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      const { fontAngle } = this;
      const { fontAngleContextMenu } = fontAngle;
      const { elPopUp } = fontAngleContextMenu;
      ElPopUp.closeAll([elPopUp]);
      if (fontAngleContextMenu.isClose()) {
        fontAngleContextMenu.open();
      } else {
        fontAngleContextMenu.close();
      }
      e.stopPropagation();
      e.preventDefault();
    });
  }

  setHorizontalAlignStatus() {
    const { body } = this.workTop.work;
    const { sheetView } = body;
    const sheet = sheetView.getActiveSheet();
    const { table } = sheet;
    const { xScreen } = table;
    const cells = table.getTableCells();
    const xSelect = xScreen.findType(XSelectItem);
    const { selectRange } = xSelect;
    let icon = new Icon('align-left');
    if (selectRange) {
      const firstCell = cells.getCellOrNew(selectRange.sri, selectRange.sci);
      switch (firstCell.fontAttr.align) {
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
    }
    this.horizontalAlign.setIcon(icon);
  }

  setVerticalAlignStatus() {
    const { body } = this.workTop.work;
    const { sheetView } = body;
    const sheet = sheetView.getActiveSheet();
    const { table } = sheet;
    const { xScreen } = table;
    const cells = table.getTableCells();
    const xSelect = xScreen.findType(XSelectItem);
    const { selectRange } = xSelect;
    let icon = new Icon('align-middle');
    if (selectRange) {
      const firstCell = cells.getCellOrNew(selectRange.sri, selectRange.sci);
      switch (firstCell.fontAttr.verticalAlign) {
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
    }
    this.verticalAlign.setIcon(icon);
  }

  setTextWrappingStatus() {
    const { body } = this.workTop.work;
    const { sheetView } = body;
    const sheet = sheetView.getActiveSheet();
    const { table } = sheet;
    const { xScreen } = table;
    const cells = table.getTableCells();
    const xSelect = xScreen.findType(XSelectItem);
    const { selectRange } = xSelect;
    let icon = new Icon('text-wrap');
    if (selectRange) {
      const firstCell = cells.getCellOrNew(selectRange.sri, selectRange.sci);
      switch (firstCell.fontAttr.textWrap) {
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
    }
    this.textWrapping.setIcon(icon);
  }

  setUndoStatus() {
    const { body } = this.workTop.work;
    const { sheetView } = body;
    const sheet = sheetView.getActiveSheet();
    const { table } = sheet;
    const { tableDataSnapshot } = table;
    this.undo.active(tableDataSnapshot.canBack());
  }

  setRedoStatus() {
    const { body } = this.workTop.work;
    const { sheetView } = body;
    const sheet = sheetView.getActiveSheet();
    const { table } = sheet;
    const { tableDataSnapshot } = table;
    this.redo.active(tableDataSnapshot.canGo());
  }

  setScaleStatus() {
    const { body } = this.workTop.work;
    const { sheetView } = body;
    const sheet = sheetView.getActiveSheet();
    const { table } = sheet;
    const { scale } = table;
    const value = scale.goto(100);
    this.scale.setTitle(`${value}%`);
  }

  setPaintFormatStatus() {
    const { body } = this.workTop.work;
    const { sheetView } = body;
    const sheet = sheetView.getActiveSheet();
    this.paintFormat.active(this.paintFormat.includeSheet(sheet));
  }

  setFormatStatus() {
    const { body } = this.workTop.work;
    const { sheetView } = body;
    const sheet = sheetView.getActiveSheet();
    const { table } = sheet;
    const { xScreen } = table;
    const cells = table.getTableCells();
    const xSelect = xScreen.findType(XSelectItem);
    const { selectRange } = xSelect;
    let text = '常规';
    let format = 'default';
    if (selectRange) {
      const firstCell = cells.getCellOrNew(selectRange.sri, selectRange.sci);
      // eslint-disable-next-line prefer-destructuring
      format = firstCell.format;
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
    }
    this.format.setTitle(text);
    this.format.formatContextMenu.setActiveByType(format);
  }

  setFontStatus() {
    const { body } = this.workTop.work;
    const { sheetView } = body;
    const sheet = sheetView.getActiveSheet();
    const { table } = sheet;
    const { xScreen } = table;
    const cells = table.getTableCells();
    const xSelect = xScreen.findType(XSelectItem);
    const { selectRange } = xSelect;
    let name = 'Arial';
    if (selectRange) {
      const firstCell = cells.getCellOrNew(selectRange.sri, selectRange.sci);
      // eslint-disable-next-line prefer-destructuring
      name = firstCell.fontAttr.name;
    }
    this.font.setTitle(name);
    this.font.fontContextMenu.setActiveByType(name);
  }

  setStatus() {
    this.setUndoStatus();
    this.setRedoStatus();
    this.setScaleStatus();
    this.setPaintFormatStatus();
    this.setFormatStatus();
    this.setFontStatus();
    this.setFontSizeStatus();
    this.setFontBoldStatus();
    this.setFontItalicStatus();
    this.setUnderLineStatus();
    this.setFontStrikeStatus();
    this.setFontColorStatus();
    this.setFillColorStatus();
    this.setHorizontalAlignStatus();
    this.setVerticalAlignStatus();
    this.setTextWrappingStatus();
    this.setFixedStatus();
    this.setFilterStatus();
    this.setFontAngleStatus();
  }

  setFixedStatus() {
    const { body } = this.workTop.work;
    const { fixed } = this;
    const { sheetView } = body;
    const sheet = sheetView.getActiveSheet();
    const { table } = sheet;
    fixed.setFixedRowStatus(table.xFixedView.hasFixedTop());
    fixed.setFixedColStatus(table.xFixedView.hasFixedLeft());
  }

  setFilterStatus() {
    const { body } = this.workTop.work;
    const { sheetView } = body;
    const sheet = sheetView.getActiveSheet();
    const { table } = sheet;
    const { xScreen } = table;
    const filter = xScreen.findType(XFilter);
    this.filter.active(filter.display);
  }

  setUnderLineStatus() {
    const { body } = this.workTop.work;
    const { sheetView } = body;
    const sheet = sheetView.getActiveSheet();
    const { table } = sheet;
    const { xScreen } = table;
    const cells = table.getTableCells();
    const xSelect = xScreen.findType(XSelectItem);
    const { selectRange } = xSelect;
    let underline = false;
    if (selectRange) {
      const firstCell = cells.getCellOrNew(selectRange.sri, selectRange.sci);
      // eslint-disable-next-line prefer-destructuring
      underline = firstCell.fontAttr.underline;
    }
    this.underLine.active(underline);
  }

  setFontSizeStatus() {
    const { body } = this.workTop.work;
    const { sheetView } = body;
    const sheet = sheetView.getActiveSheet();
    const { table } = sheet;
    const { xScreen } = table;
    const cells = table.getTableCells();
    const xSelect = xScreen.findType(XSelectItem);
    const { selectRange } = xSelect;
    let size = '12';
    if (selectRange) {
      const firstCell = cells.getCellOrNew(selectRange.sri, selectRange.sci);
      // eslint-disable-next-line prefer-destructuring
      size = firstCell.fontAttr.size;
    }
    this.dprFontSize.setTitle(size);
  }

  setFontBoldStatus() {
    const { body } = this.workTop.work;
    const { sheetView } = body;
    const sheet = sheetView.getActiveSheet();
    const { table } = sheet;
    const { xScreen } = table;
    const cells = table.getTableCells();
    const xSelect = xScreen.findType(XSelectItem);
    const { selectRange } = xSelect;
    let bold = false;
    if (selectRange) {
      const firstCell = cells.getCellOrNew(selectRange.sri, selectRange.sci);
      // eslint-disable-next-line prefer-destructuring
      bold = firstCell.fontAttr.bold;
    }
    this.fontBold.active(bold);
  }

  setFontStrikeStatus() {
    const { body } = this.workTop.work;
    const { sheetView } = body;
    const sheet = sheetView.getActiveSheet();
    const { table } = sheet;
    const { xScreen } = table;
    const cells = table.getTableCells();
    const xSelect = xScreen.findType(XSelectItem);
    const { selectRange } = xSelect;
    let strikethrough = false;
    if (selectRange) {
      const firstCell = cells.getCellOrNew(selectRange.sri, selectRange.sci);
      // eslint-disable-next-line prefer-destructuring
      strikethrough = firstCell.fontAttr.strikethrough;
    }
    this.fontStrike.active(strikethrough);
  }

  setFontColorStatus() {
    const { body } = this.workTop.work;
    const { sheetView } = body;
    const sheet = sheetView.getActiveSheet();
    const { table } = sheet;
    const { xScreen } = table;
    const cells = table.getTableCells();
    const xSelect = xScreen.findType(XSelectItem);
    const { selectRange } = xSelect;
    let color = 'rgb(0, 0, 0)';
    if (selectRange) {
      const firstCell = cells.getCellOrNew(selectRange.sri, selectRange.sci);
      // eslint-disable-next-line prefer-destructuring
      color = firstCell.fontAttr.color;
    }
    this.fontColor.setColor(color);
    this.fontColor.fontColorContextMenu.setActiveByColor(color);
  }

  setFillColorStatus() {
    const { body } = this.workTop.work;
    const { sheetView } = body;
    const sheet = sheetView.getActiveSheet();
    const { table } = sheet;
    const { xScreen } = table;
    const cells = table.getTableCells();
    const xSelect = xScreen.findType(XSelectItem);
    const { selectRange } = xSelect;
    let color = 'rgb(255, 255, 255)';
    if (selectRange) {
      const firstCell = cells.getCellOrNew(selectRange.sri, selectRange.sci);
      // eslint-disable-next-line prefer-destructuring
      if (firstCell.background) {
        color = firstCell.background;
      }
    }
    this.fillColor.setColor(color);
    this.fillColor.fillColorContextMenu.setActiveByColor(color);
  }

  setFontItalicStatus() {
    const { body } = this.workTop.work;
    const { sheetView } = body;
    const sheet = sheetView.getActiveSheet();
    const { table } = sheet;
    const { xScreen } = table;
    const cells = table.getTableCells();
    const xSelect = xScreen.findType(XSelectItem);
    const { selectRange } = xSelect;
    let italic = false;
    if (selectRange) {
      const firstCell = cells.getCellOrNew(selectRange.sri, selectRange.sci);
      // eslint-disable-next-line prefer-destructuring
      italic = firstCell.fontAttr.italic;
    }
    this.fontItalic.active(italic);
  }

  setFontAngleStatus() {
    const { body } = this.workTop.work;
    const { sheetView } = body;
    const sheet = sheetView.getActiveSheet();
    const { table } = sheet;
    const { xScreen } = table;
    const cells = table.getTableCells();
    const xSelect = xScreen.findType(XSelectItem);
    const { selectRange } = xSelect;
    let angle = 0;
    if (selectRange) {
      const firstCell = cells.getCellOrNew(selectRange.sri, selectRange.sci);
      // eslint-disable-next-line prefer-destructuring
      angle = firstCell.fontAttr.angle;
    }
    this.fontAngle.setValue(angle);
  }

  destroy() {
    super.destroy();
    this.unbind();
  }

}

export { TopMenu };
