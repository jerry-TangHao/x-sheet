/* global FileReader */
import { Workbook } from 'exceljs';
import { ColorPicker } from '../../module/colorpicker/ColorPicker';
import { BaseFont } from '../../draw/font/BaseFont';
import { XDraw } from '../../draw/XDraw';
import { LINE_TYPE } from '../../draw/Line';
import { SheetUtils } from '../../utils/SheetUtils';
import { ColorArray } from '../../module/colorpicker/colorarray/ColorArray';
import { HexRgb, Theme, ThemeXml } from './XlsxTheme';
import { XlsxIndexedColor } from './XlsxIndexedColor';
import { WideUnit } from '../../core/table/tableunit/WideUnit';
import { Cell } from '../../core/table/tablecell/Cell';
import { HeightUnit } from '../../core/table/tableunit/HeightUnit';

/**
 * XLSX 文件导入
 */
class XlsxImport {

  /**
   * XlsxImport
   */
  constructor({
    xlsx, dpr, unit, dpi,
  }) {
    this.xlsx = xlsx;
    XDraw.refresh(dpr);
    this.heightUnit = new HeightUnit({
      dpi,
    });
    this.wideUnit = new WideUnit({
      unit,
    });
  }

  /**
   * 导入XLSX文件
   * @returns {Promise<{}>}
   */
  async import() {
    const xWorkConfig = {
      created: '',
      creator: '',
      modified: '',
      lastModifiedBy: '',
      body: {},
    };
    // 文件转换
    const buffer = await this.buffer();
    // 读取xlsx文件
    const workbook = new Workbook();
    await workbook.xlsx.load(buffer);
    // work文件属性
    xWorkConfig.created = workbook.created;
    xWorkConfig.creator = workbook.creator;
    xWorkConfig.modified = workbook.modified;
    xWorkConfig.lastModifiedBy = workbook.lastModifiedBy;
    // 读取sheet表
    const sheets = [];
    const { model } = workbook;
    const { themes, worksheets } = model;
    worksheets.forEach((worksheet, idx) => {
      const { merges = [], cols = [], rows = [], name, views = [] } = worksheet;
      const xData = [];
      const xRows = { data: [], len: 100 };
      const xMerge = { merges };
      const xCols = { data: [], len: 25 };
      const xTable = { showGrid: views && views.length && views[0].showGridLines, background: '#ffffff' };
      const xFixedView = {
        fxTop: -1,
        fxLeft: -1,
      };
      // 主题颜色
      const themeXlsx = new Theme();
      const themeXml = themes[`theme${idx + 1}`];
      if (themeXml) {
        const xml = new ThemeXml(themeXml);
        const themeList = xml.getThemeList();
        themeXlsx.setColorPallate(themeList);
      }
      // 读取列宽
      const lastIndex = cols.length - 1;
      cols.forEach((col, idx) => {
        const { min, max, width } = col;
        if (width) {
          const colWidth = this.colWidth(width);
          if (min === max || lastIndex === idx) {
            xCols.data[min - 1] = {
              width: colWidth,
            };
          } else {
            for (let i = min; i <= max; i++) {
              xCols.data[i - 1] = {
                width: colWidth,
              };
            }
          }
        }
      });
      let maxCol = 0;
      // 读取行高
      rows.forEach((row) => {
        const { cells, height, number } = row;
        const rowIndex = number - 1;
        if (height) {
          xRows.data[rowIndex] = {
            height: this.rowHeight(height),
          };
        }
        // 读取数据
        const item = [];
        cells.forEach((cell, col) => {
          // 单元格基本属性
          const { value = '', address = '', style = {} } = cell;
          const { richText } = value;
          const { border, fill, font, alignment } = style;
          // 读取列编号
          const colNo = address.replace(number, '');
          const colIndex = SheetUtils.indexAt(colNo);
          // 创建新的XCell;
          const xCell = {
            background: null,
            text: value,
            fontAttr: {},
            borderAttr: {
              right: {},
              top: {},
              left: {},
              bottom: {},
            },
          };
          // 字体属性
          if (SheetUtils.isDef(font)) {
            const { name, bold, size, italic, strike, color } = font;
            xCell.fontAttr.italic = italic;
            xCell.fontAttr.name = name;
            xCell.fontAttr.size = this.fontSize(size || 13);
            xCell.fontAttr.bold = bold;
            xCell.fontAttr.underline = this.fontUnderline(font);
            xCell.fontAttr.strikethrough = strike;
            if (SheetUtils.isDef(color)) {
              const { theme, tint, argb, indexed } = color;
              if (SheetUtils.isDef(argb)) {
                const rgb = HexRgb(argb);
                xCell.fontAttr.color = ColorPicker.parseHexToRgb(rgb, ColorArray.BLACK);
              } else if (SheetUtils.isDef(theme)) {
                xCell.fontAttr.color = themeXlsx.setTheme(theme).setTint(tint).getThemeRgb();
              } else if (SheetUtils.isDef(indexed)) {
                const color = XlsxIndexedColor[indexed];
                if (SheetUtils.isDef(color)) {
                  xCell.fontAttr.color = ColorPicker.parseHexToRgb(color);
                }
              }
            }
          }
          // 富文本
          if (SheetUtils.isDef(richText)) {
            const rich = [];
            for (let i = 0, len = richText.length; i < len; i++) {
              const item = richText[i];
              const { font, text } = item;
              const richFont = { text };
              if (SheetUtils.isDef(font)) {
                const { size, name, italic, bold, strike, color } = font;
                richFont.size = this.fontSize(size || 13);
                richFont.bold = bold;
                richFont.name = name;
                richFont.italic = italic;
                richFont.underline = this.fontUnderline(font);
                richFont.strikethrough = strike;
                if (SheetUtils.isDef(color)) {
                  const { theme, tint, argb, indexed } = color;
                  if (SheetUtils.isDef(argb)) {
                    const rgb = HexRgb(argb);
                    richFont.color = ColorPicker.parseHexToRgb(rgb, ColorArray.BLACK);
                  } else if (SheetUtils.isDef(theme)) {
                    richFont.color = themeXlsx.setTheme(theme).setTint(tint).getThemeRgb();
                  } else if (SheetUtils.isDef(indexed)) {
                    const color = XlsxIndexedColor[indexed];
                    if (SheetUtils.isDef(color)) {
                      richFont.color = ColorPicker.parseHexToRgb(color);
                    }
                  }
                }
                rich.push(richFont);
              } else {
                rich.push(richFont);
              }
            }
            xCell.richText = { rich };
            xCell.contentType = Cell.TYPE.RICH_TEXT;
          } else {
            const type = SheetUtils.type(value);
            switch (type) {
              case SheetUtils.DATA_TYPE.Date:
                xCell.format = 'date1';
                xCell.contentType = Cell.TYPE.DATE_TIME;
                break;
              case SheetUtils.DATA_TYPE.Number:
                xCell.contentType = Cell.TYPE.NUMBER;
                break;
              case SheetUtils.DATA_TYPE.String:
                xCell.contentType = Cell.TYPE.STRING;
                break;
            }
          }
          // 单元格边框
          if (SheetUtils.isDef(border)) {
            if (border.right) {
              const { style, color } = border.right;
              const { widthType, type } = this.borderType(style);
              xCell.borderAttr.right.widthType = widthType;
              xCell.borderAttr.right.type = type;
              xCell.borderAttr.right.display = true;
              if (SheetUtils.isDef(color)) {
                const { theme, tint, argb, indexed } = color;
                if (SheetUtils.isDef(argb)) {
                  const rgb = HexRgb(argb);
                  xCell.borderAttr.right.color = ColorPicker.parseHexToRgb(rgb, ColorArray.BLACK);
                } else if (SheetUtils.isDef(theme)) {
                  xCell.borderAttr.right.color = themeXlsx.setTheme(theme).setTint(tint)
                    .getThemeRgb();
                } else if (SheetUtils.isDef(indexed)) {
                  const color = XlsxIndexedColor[indexed];
                  if (SheetUtils.isDef(color)) {
                    xCell.borderAttr.right.color = ColorPicker.parseHexToRgb(color);
                  }
                }
              }
            }
            if (border.top) {
              const { style, color } = border.top;
              const { widthType, type } = this.borderType(style);
              xCell.borderAttr.top.display = true;
              xCell.borderAttr.top.type = type;
              xCell.borderAttr.top.widthType = widthType;
              if (SheetUtils.isDef(color)) {
                const { theme, tint, argb, indexed } = color;
                if (SheetUtils.isDef(argb)) {
                  const rgb = HexRgb(argb);
                  xCell.borderAttr.top.color = ColorPicker.parseHexToRgb(rgb, ColorArray.BLACK);
                } else if (SheetUtils.isDef(theme)) {
                  xCell.borderAttr.top.color = themeXlsx.setTheme(theme).setTint(tint)
                    .getThemeRgb();
                } else if (SheetUtils.isDef(indexed)) {
                  const color = XlsxIndexedColor[indexed];
                  if (SheetUtils.isDef(color)) {
                    xCell.borderAttr.top.color = ColorPicker.parseHexToRgb(color);
                  }
                }
              }
            }
            if (border.left) {
              const { style, color } = border.left;
              const { widthType, type } = this.borderType(style);
              xCell.borderAttr.left.display = true;
              xCell.borderAttr.left.type = type;
              xCell.borderAttr.left.widthType = widthType;
              if (SheetUtils.isDef(color)) {
                const { theme, tint, argb, indexed } = color;
                if (SheetUtils.isDef(argb)) {
                  const rgb = HexRgb(argb);
                  xCell.borderAttr.left.color = ColorPicker.parseHexToRgb(rgb, ColorArray.BLACK);
                } else if (SheetUtils.isDef(theme)) {
                  xCell.borderAttr.left.color = themeXlsx.setTheme(theme).setTint(tint)
                    .getThemeRgb();
                } else if (SheetUtils.isDef(indexed)) {
                  const color = XlsxIndexedColor[indexed];
                  if (SheetUtils.isDef(color)) {
                    xCell.borderAttr.left.color = ColorPicker.parseHexToRgb(color);
                  }
                }
              }
            }
            if (border.bottom) {
              const { style, color } = border.bottom;
              const { widthType, type } = this.borderType(style);
              xCell.borderAttr.bottom.display = true;
              xCell.borderAttr.bottom.type = type;
              xCell.borderAttr.bottom.widthType = widthType;
              if (SheetUtils.isDef(color)) {
                const { theme, tint, argb, indexed } = color;
                if (SheetUtils.isDef(argb)) {
                  const rgb = HexRgb(argb);
                  xCell.borderAttr.bottom.color = ColorPicker.parseHexToRgb(rgb, ColorArray.BLACK);
                } else if (SheetUtils.isDef(theme)) {
                  xCell.borderAttr.bottom.color = themeXlsx.setTheme(theme).setTint(tint)
                    .getThemeRgb();
                } else if (SheetUtils.isDef(indexed)) {
                  const color = XlsxIndexedColor[indexed];
                  if (SheetUtils.isDef(color)) {
                    xCell.borderAttr.bottom.color = ColorPicker.parseHexToRgb(color);
                  }
                }
              }
            }
          }
          // 背景颜色
          if (SheetUtils.isDef(fill)) {
            const { fgColor } = fill;
            if (SheetUtils.isDef(fgColor)) {
              const { theme, tint, argb, indexed } = fgColor;
              if (SheetUtils.isDef(argb)) {
                const rgb = HexRgb(argb);
                xCell.background = ColorPicker.parseHexToRgb(rgb);
              } else if (SheetUtils.isDef(theme)) {
                xCell.background = themeXlsx.setTheme(theme).setTint(tint).getThemeRgb();
              } else if (SheetUtils.isDef(indexed)) {
                const color = XlsxIndexedColor[indexed];
                if (SheetUtils.isDef(color)) {
                  xCell.background = ColorPicker.parseHexToRgb(color);
                }
              }
            }
          }
          // 对齐方式
          if (SheetUtils.isDef(alignment)) {
            const { textRotation, wrapText } = alignment;
            const { vertical, horizontal } = alignment;
            switch (horizontal) {
              case 'left': {
                xCell.fontAttr.align = 'left';
                break;
              }
              case 'center': {
                xCell.fontAttr.align = 'center';
                break;
              }
              case 'right': {
                xCell.fontAttr.align = 'right';
                break;
              }
              case 'fill': {
                xCell.fontAttr.align = 'center';
                break;
              }
              case 'justify': {
                xCell.fontAttr.align = 'left';
                break;
              }
              case 'centerContinuous': {
                xCell.fontAttr.align = 'center';
                break;
              }
              case 'distributed': {
                xCell.fontAttr.align = 'left';
                break;
              }
            }
            xCell.fontAttr.verticalAlign = vertical;
            xCell.fontAttr.direction = BaseFont.TEXT_DIRECTION.HORIZONTAL;
            // 自动换行
            if (wrapText) {
              xCell.fontAttr.textWrap = BaseFont.TEXT_WRAP.WORD_WRAP;
            } else {
              xCell.fontAttr.textWrap = BaseFont.TEXT_WRAP.OVER_FLOW;
            }
            // 垂直旋转
            if (textRotation === 'vertical') {
              xCell.fontAttr.direction = BaseFont.TEXT_DIRECTION.VERTICAL;
            } else if (textRotation) {
              xCell.fontAttr.direction = BaseFont.TEXT_DIRECTION.ANGLE;
              xCell.fontAttr.angle = alignment.textRotation;
            }
          }
          // 添加单元格
          item[colIndex] = xCell;
          // 标记最大列数
          maxCol = Math.max(col, maxCol);
        });
        // 添加新行
        xData[rowIndex] = item;
      });
      // 添加sheet表
      if (xCols.data.length > xCols.len) {
        xCols.len = xCols.data.length;
      }
      if (xRows.data.length > xRows.len) {
        xRows.len = xRows.data.length;
      }
      if (maxCol > xCols.len) {
        xCols.len = maxCol + 1;
      }
      if (xData.length > xRows.len) {
        xRows.len = xData.length;
      }
      if (views.length > 0) {
        if (views[0].ySplit) {
          xFixedView.fxTop = views[0].ySplit - 1;
        }
        if (views[0].xSplit) {
          xFixedView.fxLeft = views[0].xSplit - 1;
        }
      }
      sheets.push({
        name,
        tableConfig: {
          xFixedView,
          table: xTable,
          cols: xCols,
          rows: xRows,
          data: xData,
          merge: xMerge,
        },
      });
    });
    // 返回配置信息
    xWorkConfig.body.sheets = sheets;
    return xWorkConfig;
  }

  /**
   * 文件转换Buffer
   * @returns {Promise<ArrayBuffer>}
   */
  async buffer() {
    return new Promise((resolve) => {
      let reader = new FileReader();
      reader.readAsArrayBuffer(this.xlsx);
      reader.addEventListener('load', () => {
        resolve(reader.result);
      });
    });
  }

  /**
   * 字体大小转换
   * @param value
   */
  fontSize(value) {
    const pixel = this.heightUnit.getPixel(value);
    const fontSize = XDraw.srcPx(pixel);
    return XDraw.ceil(fontSize);
  }

  /**
   * 列宽转换
   * @param value
   */
  colWidth(value) {
    return this.wideUnit.getWidePixel(value);
  }

  /**
   * 行高转换
   * @param value
   */
  rowHeight(value) {
    const pixel = this.heightUnit.getPixel(value);
    return XDraw.srcPx(pixel);
  }

  /**
   * 字体下划线
   * @param font
   * @returns {boolean}
   */
  fontUnderline(font) {
    // true, false, 'none', 'single', 'double', 'singleAccounting', 'doubleAccounting'
    switch (font.underline) {
      case true:
      case 'single':
      case 'double':
      case 'singleAccounting':
      case 'doubleAccounting': {
        return true;
      }
    }
    return false;
  }

  /**
   * 边框类型转换
   * @param style
   */
  borderType(style) {
    switch (style) {
      case 'thin':
        return {
          widthType: XDraw.LINE_WIDTH_TYPE.low,
          type: LINE_TYPE.SOLID_LINE,
        };
      case 'medium':
        return {
          widthType: XDraw.LINE_WIDTH_TYPE.medium,
          type: LINE_TYPE.SOLID_LINE,
        };
      case 'thick':
        return {
          widthType: XDraw.LINE_WIDTH_TYPE.high,
          type: LINE_TYPE.SOLID_LINE,
        };
      case 'dashDot':
        return {
          widthType: XDraw.LINE_WIDTH_TYPE.low,
          type: LINE_TYPE.POINT_LINE,
        };
      case 'dotted':
        return {
          widthType: XDraw.LINE_WIDTH_TYPE.low,
          type: LINE_TYPE.DOTTED_LINE,
        };
      case 'double':
        return {
          widthType: XDraw.LINE_WIDTH_TYPE.low,
          type: LINE_TYPE.DOUBLE_LINE,
        };
    }
    return 'thick';
  }

}

export {
  XlsxImport,
};
