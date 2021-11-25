import { BaseCellsHelper } from '../base/BaseCellsHelper';
import { Cell } from '../../tablecell/Cell';
import { BaseFont } from '../../../../draw/font/BaseFont';
import { ColorArray } from '../../../../module/colorpicker/colorarray/ColorArray';
import { Constant } from '../../../../const/Constant';
import { LINE_TYPE } from '../../../../draw/Line';
import { XDraw } from '../../../../draw/XDraw';

class DateCellsHelper extends BaseCellsHelper {

  constructor(table) {
    super();
    this.table = table;
  }

  getXTableAreaView() {
    return this.table.xTableAreaView;
  }

  getMerges() {
    return this.table.getTableMerges();
  }

  getStyleTable() {
    return this.table.getXTableStyle();
  }

  getRows() {
    return this.table.rows;
  }

  getCols() {
    return this.table.cols;
  }

  getCells() {
    return this.table.getTableCells();
  }

  getXIteratorBuilder() {
    return this.table.xIteratorBuilder;
  }

  // ================================= get style ===================================

  getCellFormat({
    selectRange,
  } = {}) {
    if (selectRange) {
      const cells = this.getCells();
      const cell = cells.getCellOrNew(selectRange.sri, selectRange.sci);
      if (cell) {
        return cell.format;
      }
    }
    return 'default';
  }

  hasStyleUnderLine({
    selectRange,
  } = {}) {
    if (selectRange) {
      const cells = this.getCells();
      const cell = cells.getCellOrNew(selectRange.sri, selectRange.sci);
      if (cell) {
        switch (cell.contentType) {
          case Cell.TYPE.NUMBER:
          case Cell.TYPE.STRING:
          case Cell.TYPE.DATE_TIME: {
            return cell.fontAttr.underline;
          }
          case Cell.TYPE.RICH_TEXT: {
            let underline = cell.richText.hasLength();
            cell.richText.each((i) => {
              if (!i.underline) {
                underline = false;
                return false;
              }
              return true;
            });
            return underline;
          }
        }
      }
    }
    return false;
  }

  hasStyleStrikeLine({
    selectRange,
  } = {}) {
    if (selectRange) {
      const cells = this.getCells();
      const cell = cells.getCellOrNew(selectRange.sri, selectRange.sci);
      if (cell) {
        switch (cell.contentType) {
          case Cell.TYPE.NUMBER:
          case Cell.TYPE.STRING:
          case Cell.TYPE.DATE_TIME: {
            return cell.fontAttr.strikethrough;
          }
          case Cell.TYPE.RICH_TEXT: {
            let strikethrough = cell.richText.hasLength();
            cell.richText.each((i) => {
              if (!i.strikethrough) {
                strikethrough = false;
                return false;
              }
              return true;
            });
            return strikethrough;
          }
        }
      }
    }
    return false;
  }

  hasStyleBold({
    selectRange,
  } = {}) {
    if (selectRange) {
      const cells = this.getCells();
      const cell = cells.getCellOrNew(selectRange.sri, selectRange.sci);
      if (cell) {
        switch (cell.contentType) {
          case Cell.TYPE.NUMBER:
          case Cell.TYPE.STRING:
          case Cell.TYPE.DATE_TIME: {
            return cell.fontAttr.bold;
          }
          case Cell.TYPE.RICH_TEXT: {
            let bold = cell.richText.hasLength();
            cell.richText.each((i) => {
              if (!i.bold) {
                bold = false;
                return false;
              }
              return true;
            });
            return bold;
          }
        }
      }
    }
    return false;
  }

  hasStyleItalic({
    selectRange,
  } = {}) {
    if (selectRange) {
      const cells = this.getCells();
      const cell = cells.getCellOrNew(selectRange.sri, selectRange.sci);
      if (cell) {
        switch (cell.contentType) {
          case Cell.TYPE.NUMBER:
          case Cell.TYPE.STRING:
          case Cell.TYPE.DATE_TIME: {
            return cell.fontAttr.italic;
          }
          case Cell.TYPE.RICH_TEXT: {
            let italic = cell.richText.hasLength();
            cell.richText.each((i) => {
              if (!i.italic) {
                italic = false;
                return false;
              }
              return true;
            });
            return italic;
          }
        }
      }
    }
    return false;
  }

  getStyleVerticalAlign({
    selectRange,
  } = {}) {
    if (selectRange) {
      const cells = this.getCells();
      const cell = cells.getCellOrNew(selectRange.sri, selectRange.sci);
      if (cell) {
        return cell.fontAttr.verticalAlign;
      }
    }
    return BaseFont.VERTICAL_ALIGN.center;
  }

  getStyleAlign({
    selectRange,
  } = {}) {
    if (selectRange) {
      const cells = this.getCells();
      const cell = cells.getCellOrNew(selectRange.sri, selectRange.sci);
      if (cell) {
        return cell.fontAttr.align;
      }
    }
    return BaseFont.ALIGN.left;
  }

  getStyleColor({
    selectRange,
  } = {}) {
    if (selectRange) {
      const cells = this.getCells();
      const cell = cells.getCellOrNew(selectRange.sri, selectRange.sci);
      if (cell) {
        switch (cell.contentType) {
          case Cell.TYPE.NUMBER:
          case Cell.TYPE.STRING:
          case Cell.TYPE.DATE_TIME: {
            return cell.fontAttr.color;
          }
          case Cell.TYPE.RICH_TEXT: {
            const first = cell.richText.getRich()[0];
            if (first) {
              return first.color;
            }
          }
        }
      }
    }
    return ColorArray.BLACK;
  }

  getStyleFontName({
    selectRange,
  } = {}) {
    if (selectRange) {
      const cells = this.getCells();
      const cell = cells.getCellOrNew(selectRange.sri, selectRange.sci);
      if (cell) {
        switch (cell.contentType) {
          case Cell.TYPE.NUMBER:
          case Cell.TYPE.STRING:
          case Cell.TYPE.DATE_TIME: {
            return cell.fontAttr.name;
          }
          case Cell.TYPE.RICH_TEXT: {
            const first = cell.richText.getRich()[0];
            if (first) {
              return first.name;
            }
          }
        }
      }
    }
    return 'Arial';
  }

  getStyleFontSize({
    selectRange,
  } = {}) {
    if (selectRange) {
      const cells = this.getCells();
      const cell = cells.getCellOrNew(selectRange.sri, selectRange.sci);
      if (cell) {
        switch (cell.contentType) {
          case Cell.TYPE.NUMBER:
          case Cell.TYPE.STRING:
          case Cell.TYPE.DATE_TIME: {
            return cell.fontAttr.size;
          }
          case Cell.TYPE.RICH_TEXT: {
            const first = cell.richText.getRich()[0];
            if (first) {
              return first.size;
            }
          }
        }
      }
    }
    return 13;
  }

  getStyleBackground({
    selectRange,
  } = {}) {
    if (selectRange) {
      const cells = this.getCells();
      const cell = cells.getCellOrNew(selectRange.sri, selectRange.sci);
      if (cell) {
        return cell.background;
      }
    }
    return ColorArray.WHITE;
  }

  getStyleWrapping({
    selectRange,
  } = {}) {
    if (selectRange) {
      const cells = this.getCells();
      const cell = cells.getCellOrNew(selectRange.sri, selectRange.sci);
      if (cell) {
        return cell.fontAttr.textWrap;
      }
    }
    return BaseFont.TEXT_WRAP.TRUNCATE;
  }

  getStyleAngle({
    selectRange,
  } = {}) {
    if (selectRange) {
      const cells = this.getCells();
      const cell = cells.getCellOrNew(selectRange.sri, selectRange.sci);
      if (cell) {
        return cell.fontAttr.angle;
      }
    }
    return 0;
  }

  getStyleBorder({
    selectRange,
  } = {}) {
    let topColor = ColorArray.BLACK;
    let leftColor = ColorArray.BLACK;
    let rightColor = ColorArray.BLACK;
    let bottomColor = ColorArray.BLACK;
    if (selectRange) {
      if (selectRange) {
        const cells = this.getCells();
        const cell = cells.getCellOrNew(selectRange.sri, selectRange.sci);
        if (cell) {
          const firstCell = cells.getCellOrNew(selectRange.sri, selectRange.sci);
          const { borderAttr } = firstCell;
          const { left, bottom, top, right } = borderAttr;
          leftColor = left.color;
          topColor = top.color;
          rightColor = right.color;
          bottomColor = bottom.color;
        }
      }
    }
    return {
      topColor, leftColor, rightColor, bottomColor,
    };
  }

  // ================================ set style ====================================

  setStyleUnderLine({
    selectRange,
    underline,
  } = {}) {
    const { table } = this;
    const { snapshot } = table;
    if (table.isProtection()) {
      return;
    }
    if (selectRange) {
      const cells = this.getCells();
      const operateCellsHelper = table.getOperateCellsHelper();
      snapshot.open();
      operateCellsHelper.getCellOrNewCellByViewRange({
        rectRange: selectRange,
        callback: (r, c, origin) => {
          const cell = origin.clone();
          switch (cell.contentType) {
            case Cell.TYPE.NUMBER:
            case Cell.TYPE.STRING:
            case Cell.TYPE.DATE_TIME: {
              cell.setUnderLine(underline);
              break;
            }
            case Cell.TYPE.RICH_TEXT: {
              cell.setRichUnderLine(underline);
              break;
            }
          }
          cells.setCell(r, c, cell);
        },
      });
      snapshot.close({
        type: Constant.TABLE_EVENT_TYPE.DATA_CHANGE,
      });
      table.render();
    }
  }

  setStyleStrikeLine({
    selectRange,
    strikethrough,
  } = {}) {
    const { table } = this;
    const { snapshot } = table;
    if (table.isProtection()) {
      return;
    }
    if (selectRange) {
      const cells = this.getCells();
      const operateCellsHelper = table.getOperateCellsHelper();
      snapshot.open();
      operateCellsHelper.getCellOrNewCellByViewRange({
        rectRange: selectRange,
        callback: (r, c, origin) => {
          const cell = origin.clone();
          switch (cell.contentType) {
            case Cell.TYPE.NUMBER:
            case Cell.TYPE.STRING:
            case Cell.TYPE.DATE_TIME: {
              cell.setStrikeLine(strikethrough);
              break;
            }
            case Cell.TYPE.RICH_TEXT: {
              cell.setRichStrikeLine(strikethrough);
              break;
            }
          }
          cells.setCell(r, c, cell);
        },
      });
      snapshot.close({
        type: Constant.TABLE_EVENT_TYPE.DATA_CHANGE,
      });
      table.render();
    }
  }

  setStyleFontName({
    selectRange,
    name,
  } = {}) {
    const { table } = this;
    const { snapshot } = table;
    if (table.isProtection()) {
      return;
    }
    if (selectRange) {
      const cells = this.getCells();
      const operateCellsHelper = table.getOperateCellsHelper();
      snapshot.open();
      operateCellsHelper.getCellOrNewCellByViewRange({
        rectRange: selectRange,
        callback: (r, c, origin) => {
          const cell = origin.clone();
          switch (cell.contentType) {
            case Cell.TYPE.NUMBER:
            case Cell.TYPE.STRING:
            case Cell.TYPE.DATE_TIME: {
              cell.setFontName(name);
              break;
            }
            case Cell.TYPE.RICH_TEXT: {
              cell.setRichFontName(name);
              break;
            }
          }
          cells.setCell(r, c, cell);
        },
      });
      snapshot.close({
        type: Constant.TABLE_EVENT_TYPE.DATA_CHANGE,
      });
      table.render();
    }
  }

  setStyleFontColor({
    selectRange,
    color,
  } = {}) {
    const { table } = this;
    const { snapshot } = table;
    if (table.isProtection()) {
      return;
    }
    if (selectRange) {
      const cells = this.getCells();
      const operateCellsHelper = table.getOperateCellsHelper();
      snapshot.open();
      operateCellsHelper.getCellOrNewCellByViewRange({
        rectRange: selectRange,
        callback: (r, c, origin) => {
          const cell = origin.clone();
          switch (cell.contentType) {
            case Cell.TYPE.NUMBER:
            case Cell.TYPE.STRING:
            case Cell.TYPE.DATE_TIME: {
              cell.setFontColor(color);
              break;
            }
            case Cell.TYPE.RICH_TEXT: {
              cell.setRichFontColor(color);
              break;
            }
          }
          cells.setCell(r, c, cell);
        },
      });
      snapshot.close({
        type: Constant.TABLE_EVENT_TYPE.DATA_CHANGE,
      });
      table.render();
    }
  }

  setStyleFontSize({
    selectRange,
    size,
  } = {}) {
    const { table } = this;
    const { snapshot } = table;
    if (table.isProtection()) {
      return;
    }
    if (selectRange) {
      const cells = this.getCells();
      const operateCellsHelper = table.getOperateCellsHelper();
      snapshot.open();
      operateCellsHelper.getCellOrNewCellByViewRange({
        rectRange: selectRange,
        callback: (r, c, origin) => {
          const cell = origin.clone();
          switch (cell.contentType) {
            case Cell.TYPE.NUMBER:
            case Cell.TYPE.STRING:
            case Cell.TYPE.DATE_TIME: {
              cell.setFontSize(size);
              break;
            }
            case Cell.TYPE.RICH_TEXT: {
              cell.setRichFontSize(size);
              break;
            }
          }
          cells.setCell(r, c, cell);
        },
      });
      snapshot.close({
        type: Constant.TABLE_EVENT_TYPE.DATA_CHANGE,
      });
      table.render();
    }
  }

  setStyleBold({
    selectRange,
    bold,
  }) {
    const { table } = this;
    const { snapshot } = table;
    if (table.isProtection()) {
      return;
    }
    if (selectRange) {
      const cells = this.getCells();
      const operateCellsHelper = table.getOperateCellsHelper();
      snapshot.open();
      operateCellsHelper.getCellOrNewCellByViewRange({
        rectRange: selectRange,
        callback: (r, c, origin) => {
          const cell = origin.clone();
          switch (cell.contentType) {
            case Cell.TYPE.NUMBER:
            case Cell.TYPE.STRING:
            case Cell.TYPE.DATE_TIME: {
              cell.setFontBold(bold);
              break;
            }
            case Cell.TYPE.RICH_TEXT: {
              cell.setRichFontBold(bold);
              break;
            }
          }
          cells.setCell(r, c, cell);
        },
      });
      snapshot.close({
        type: Constant.TABLE_EVENT_TYPE.DATA_CHANGE,
      });
      table.render();
    }
  }

  setStyleItalic({
    selectRange,
    italic,
  }) {
    const { table } = this;
    const { snapshot } = table;
    if (table.isProtection()) {
      return;
    }
    if (selectRange) {
      const cells = this.getCells();
      const operateCellsHelper = table.getOperateCellsHelper();
      snapshot.open();
      operateCellsHelper.getCellOrNewCellByViewRange({
        rectRange: selectRange,
        callback: (r, c, origin) => {
          const cell = origin.clone();
          switch (cell.contentType) {
            case Cell.TYPE.NUMBER:
            case Cell.TYPE.STRING:
            case Cell.TYPE.DATE_TIME: {
              cell.setFontItalic(italic);
              break;
            }
            case Cell.TYPE.RICH_TEXT: {
              cell.setRichFontItalic(italic);
              break;
            }
          }
          cells.setCell(r, c, cell);
        },
      });
      snapshot.close({
        type: Constant.TABLE_EVENT_TYPE.DATA_CHANGE,
      });
      table.render();
    }
  }

  setStyleBorder({
    selectRange,
    lineColor,
    lineType,
    borderType,
  } = {}) {
    let { table } = this;
    let { snapshot } = table;
    if (table.isProtection()) {
      return;
    }
    if (selectRange) {
      let cells = this.getCells();
      let operateCellsHelper = table.getOperateCellsHelper();
      let type = LINE_TYPE.SOLID_LINE;
      let widthType = XDraw.LINE_WIDTH_TYPE.low;
      let clearEdgeBorder = (ri, ci) => {
        // 上下边
        if (ri === selectRange.sri) {
          const src = ri - 1;
          const edgeCell = cells.getCell(src, ci);
          if (edgeCell) {
            const newCell = edgeCell.clone();
            const { borderAttr } = newCell;
            borderAttr.setBDisplay(false);
            cells.setCell(src, ci, newCell);
          }
        } else if (ri === selectRange.eri) {
          const src = ri + 1;
          const edgeCell = cells.getCell(src, ci);
          if (edgeCell) {
            const newCell = edgeCell.clone();
            const { borderAttr } = newCell;
            borderAttr.setTDisplay(false);
            cells.setCell(src, ci, newCell);
          }
        }
        // 左右边
        if (ci === selectRange.sci) {
          const src = ci - 1;
          const edgeCell = cells.getCell(ri, src);
          if (edgeCell) {
            const newCell = edgeCell.clone();
            const { borderAttr } = newCell;
            borderAttr.setRDisplay(false);
            cells.setCell(ri, src, newCell);
          }
        } else if (ci === selectRange.eci) {
          const src = ci + 1;
          const edgeCell = cells.getCell(ri, src);
          if (edgeCell) {
            const newCell = edgeCell.clone();
            const { borderAttr } = newCell;
            borderAttr.setLDisplay(false);
            cells.setCell(ri, src, newCell);
          }
        }
      };
      snapshot.open();
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
      switch (borderType) {
        case 'border1':
          operateCellsHelper.getCellOrNewCellByViewRange({
            rectRange: selectRange,
            callback: (ri, ci, cell) => {
              const newCell = cell.clone();
              const { borderAttr } = newCell;
              borderAttr.setAllDisplay(true);
              borderAttr.setAllColor(lineColor);
              borderAttr.setAllWidthType(widthType);
              borderAttr.setAllType(type);
              cells.setCell(ri, ci, newCell);
            },
          });
          break;
        case 'border2':
          operateCellsHelper.getCellOrNewCellByViewRange({
            rectRange: selectRange,
            callback: (ri, ci, cell) => {
              const newCell = cell.clone();
              const { borderAttr } = newCell;
              if (ri !== selectRange.sri) {
                borderAttr.setTDisplay(true);
                borderAttr.setTColor(lineColor);
                borderAttr.setTWidthType(widthType);
                borderAttr.setTType(type);
              }
              if (ri !== selectRange.eri) {
                borderAttr.setBDisplay(true);
                borderAttr.setBColor(lineColor);
                borderAttr.setBWidthType(widthType);
                borderAttr.setBType(type);
              }
              if (ci !== selectRange.sci) {
                borderAttr.setLDisplay(true);
                borderAttr.setLColor(lineColor);
                borderAttr.setLWidthType(widthType);
                borderAttr.setLType(type);
              }
              if (ci !== selectRange.eci) {
                borderAttr.setRDisplay(true);
                borderAttr.setRColor(lineColor);
                borderAttr.setRWidthType(widthType);
                borderAttr.setRType(type);
              }
              cells.setCell(ri, ci, newCell);
            },
          });
          break;
        case 'border3':
          operateCellsHelper.getCellOrNewCellByViewRange({
            rectRange: selectRange,
            callback: (ri, ci, cell) => {
              const newCell = cell.clone();
              const { borderAttr } = newCell;
              if (ri !== selectRange.sri) {
                borderAttr.setTDisplay(true);
                borderAttr.setTColor(lineColor);
                borderAttr.setTWidthType(widthType);
                borderAttr.setTType(type);
              }
              if (ri !== selectRange.eri) {
                borderAttr.setBDisplay(true);
                borderAttr.setBColor(lineColor);
                borderAttr.setBWidthType(widthType);
                borderAttr.setBType(type);
              }
            },
          });
          break;
        case 'border4':
          operateCellsHelper.getCellOrNewCellByViewRange({
            rectRange: selectRange,
            callback: (ri, ci, cell) => {
              const newCell = cell.clone();
              const { borderAttr } = newCell;
              if (ci !== selectRange.sci) {
                borderAttr.setLDisplay(true);
                borderAttr.setLColor(lineColor);
                borderAttr.setLWidthType(widthType);
                borderAttr.setLType(type);
              }
              if (ci !== selectRange.eci) {
                borderAttr.setRDisplay(true);
                borderAttr.setRColor(lineColor);
                borderAttr.setRWidthType(widthType);
                borderAttr.setRType(type);
              }
              cells.setCell(ri, ci, newCell);
            },
          });
          break;
        case 'border5':
          operateCellsHelper.getCellOrNewCellByViewRange({
            rectRange: selectRange,
            callback: (ri, ci, cell) => {
              const newCell = cell.clone();
              const { borderAttr } = newCell;
              if (ri === selectRange.sri) {
                borderAttr.setTDisplay(true);
                borderAttr.setTColor(lineColor);
                borderAttr.setTWidthType(widthType);
                borderAttr.setTType(type);
              }
              if (ri === selectRange.eri) {
                borderAttr.setBDisplay(true);
                borderAttr.setBColor(lineColor);
                borderAttr.setBWidthType(widthType);
                borderAttr.setBType(type);
              }
              if (ci === selectRange.sci) {
                borderAttr.setLDisplay(true);
                borderAttr.setLColor(lineColor);
                borderAttr.setLWidthType(widthType);
                borderAttr.setLType(type);
              }
              if (ci === selectRange.eci) {
                borderAttr.setRDisplay(true);
                borderAttr.setRColor(lineColor);
                borderAttr.setRWidthType(widthType);
                borderAttr.setRType(type);
              }
              cells.setCell(ri, ci, newCell);
            },
          });
          break;
        case 'border6':
          operateCellsHelper.getCellOrNewCellByViewRange({
            rectRange: selectRange,
            callback: (ri, ci, cell) => {
              const newCell = cell.clone();
              const { borderAttr } = newCell;
              if (ci === selectRange.sci) {
                borderAttr.setLDisplay(true);
                borderAttr.setLColor(lineColor);
                borderAttr.setLWidthType(widthType);
                borderAttr.setLType(type);
              }
              cells.setCell(ri, ci, newCell);
            },
          });
          break;
        case 'border7':
          operateCellsHelper.getCellOrNewCellByViewRange({
            rectRange: selectRange,
            callback: (ri, ci, cell) => {
              const newCell = cell.clone();
              const { borderAttr } = newCell;
              if (ri === selectRange.sri) {
                borderAttr.setTDisplay(true);
                borderAttr.setTColor(lineColor);
                borderAttr.setTWidthType(widthType);
                borderAttr.setTType(type);
              }
              cells.setCell(ri, ci, newCell);
            },
          });
          break;
        case 'border8':
          operateCellsHelper.getCellOrNewCellByViewRange({
            rectRange: selectRange,
            callback: (ri, ci, cell) => {
              const newCell = cell.clone();
              const { borderAttr } = newCell;
              if (ci === selectRange.eci) {
                borderAttr.setRDisplay(true);
                borderAttr.setRColor(lineColor);
                borderAttr.setRWidthType(widthType);
                borderAttr.setRType(type);
              }
              cells.setCell(ri, ci, newCell);
            },
          });
          break;
        case 'border9':
          operateCellsHelper.getCellOrNewCellByViewRange({
            rectRange: selectRange,
            callback: (ri, ci, cell) => {
              const newCell = cell.clone();
              const { borderAttr } = newCell;
              if (ri === selectRange.eri) {
                borderAttr.setBDisplay(true);
                borderAttr.setBColor(lineColor);
                borderAttr.setBWidthType(widthType);
                borderAttr.setBType(type);
              }
              cells.setCell(ri, ci, newCell);
            },
          });
          break;
        case 'border10':
          operateCellsHelper.getCellOrNewCellByViewRange({
            rectRange: selectRange,
            callback: (ri, ci, cell) => {
              const newCell = cell.clone();
              clearEdgeBorder(ri, ci);
              const { borderAttr } = newCell;
              borderAttr.setAllDisplay(false);
              cells.setCell(ri, ci, newCell);
            },
          });
          break;
      }
      snapshot.close({
        type: Constant.TABLE_EVENT_TYPE.DATA_CHANGE,
      });
      table.render();
    }
  }

  setStyleMerge({
    selectRange,
  } = {}) {
    const { table } = this;
    const { snapshot } = table;
    if (table.isProtection()) {
      return;
    }
    if (selectRange) {
      const merges = table.getTableMerges();
      const cells = table.getTableCells();
      if (selectRange) {
        const merge = selectRange.clone();
        if (!merge.multiple()) {
          return;
        }
        const intersects = merges.getIntersects(merge);
        if (intersects.length) {
          const hasEqual = intersects.find(item => item.equals(merge));
          if (hasEqual) {
            snapshot.open();
            merges.batchDelete(intersects);
            snapshot.close({
              type: Constant.TABLE_EVENT_TYPE.DATA_CHANGE,
            });
            table.render();
          } else {
            snapshot.open();
            merges.batchDelete(intersects);
            cells.clear(merge, {
              ignoreCorner: true,
            });
            merges.add(merge);
            snapshot.close({
              type: Constant.TABLE_EVENT_TYPE.DATA_CHANGE,
            });
            table.render();
          }
        } else {
          snapshot.open();
          cells.clear(merge, {
            ignoreCorner: true,
          });
          merges.add(merge);
          snapshot.close({
            type: Constant.TABLE_EVENT_TYPE.DATA_CHANGE,
          });
          table.render();
        }
      }
    }
  }

  setStyleBackground({
    selectRange,
    background,
  } = {}) {
    const { table } = this;
    const { snapshot } = table;
    if (table.isProtection()) {
      return;
    }
    if (selectRange) {
      const operateCellsHelper = table.getOperateCellsHelper();
      const cells = this.getCells();
      snapshot.open();
      operateCellsHelper.getCellOrNewCellByViewRange({
        rectRange: selectRange,
        callback: (r, c, origin) => {
          const cell = origin.clone();
          cell.setBackground(background);
          cells.setCell(r, c, cell);
        },
      });
      snapshot.close({
        type: Constant.TABLE_EVENT_TYPE.DATA_CHANGE,
      });
      table.render();
    }
  }

  setStyleAlign({
    selectRange,
    type,
  } = {}) {
    const { table } = this;
    const { snapshot } = table;
    if (table.isProtection()) {
      return;
    }
    if (selectRange) {
      const cells = this.getCells();
      const operateCellsHelper = table.getOperateCellsHelper();
      snapshot.open();
      operateCellsHelper.getCellOrNewCellByViewRange({
        rectRange: selectRange,
        callback: (r, c, origin) => {
          const cell = origin.clone();
          cell.setFontAlign(type);
          cells.setCell(r, c, cell);
        },
      });
      snapshot.close({
        type: Constant.TABLE_EVENT_TYPE.DATA_CHANGE,
      });
      table.render();
    }
  }

  setStyleVerticalAlign({
    selectRange,
    type,
  } = {}) {
    const { table } = this;
    const { snapshot } = table;
    if (table.isProtection()) {
      return;
    }
    if (selectRange) {
      const operateCellsHelper = table.getOperateCellsHelper();
      const cells = this.getCells();
      snapshot.open();
      operateCellsHelper.getCellOrNewCellByViewRange({
        rectRange: selectRange,
        callback: (r, c, origin) => {
          const cell = origin.clone();
          cell.setFontVerticalAlign(type);
          cells.setCell(r, c, cell);
        },
      });
      snapshot.close({
        type: Constant.TABLE_EVENT_TYPE.DATA_CHANGE,
      });
      table.render();
    }
  }

  setStyleAngleType({
    selectRange,
    type,
  }) {
    const { table } = this;
    const { snapshot } = table;
    if (table.isProtection()) {
      return;
    }
    if (selectRange) {
      const operateCellsHelper = table.getOperateCellsHelper();
      const cells = this.getCells();
      snapshot.open();
      operateCellsHelper.getCellOrNewCellByViewRange({
        rectRange: selectRange,
        callback: (r, c, origin) => {
          const cell = origin.clone();
          cell.setFontDirection(type);
          cells.setCell(r, c, cell);
        },
      });
      snapshot.close({
        type: Constant.TABLE_EVENT_TYPE.DATA_CHANGE,
      });
      table.render();
    }
  }

  setStyleAngleNumber({
    selectRange,
    number,
  }) {
    const { table } = this;
    const { snapshot } = table;
    if (table.isProtection()) {
      return;
    }
    if (selectRange) {
      const operateCellsHelper = table.getOperateCellsHelper();
      const cells = this.getCells();
      snapshot.open();
      operateCellsHelper.getCellOrNewCellByViewRange({
        rectRange: selectRange,
        callback: (r, c, origin) => {
          const cell = origin.clone();
          cell.setFontAngle(number);
          cells.setCell(r, c, cell);
        },
      });
      snapshot.close({
        type: Constant.TABLE_EVENT_TYPE.DATA_CHANGE,
      });
      table.render();
    }
  }

  setStyleWrapping({
    selectRange,
    type,
  }) {
    const { table } = this;
    const { snapshot } = table;
    if (table.isProtection()) {
      return;
    }
    if (selectRange) {
      const operateCellsHelper = table.getOperateCellsHelper();
      const cells = this.getCells();
      snapshot.open();
      operateCellsHelper.getCellOrNewCellByViewRange({
        rectRange: selectRange,
        callback: (r, c, origin) => {
          const cell = origin.clone();
          cell.setTextWrap(type);
          cells.setCell(r, c, cell);
        },
      });
      snapshot.close({
        type: Constant.TABLE_EVENT_TYPE.DATA_CHANGE,
      });
      table.render();
    }
  }

  setCellFormat({
    selectRange,
    format,
    contentType,
  } = {}) {
    const { table } = this;
    const { snapshot } = table;
    if (table.isProtection()) {
      return;
    }
    if (selectRange) {
      const cells = this.getCells();
      const operateCellsHelper = table.getOperateCellsHelper();
      snapshot.open();
      operateCellsHelper.getCellOrNewCellByViewRange({
        rectRange: selectRange,
        callback: (r, c, origin) => {
          const cell = origin.clone();
          cell.setFormat(format);
          cell.setContentType(contentType);
          cells.setCell(r, c, cell);
        },
      });
      snapshot.close({
        type: Constant.TABLE_EVENT_TYPE.DATA_CHANGE,
      });
      table.render();
    }
  }

}

export {
  DateCellsHelper,
};
