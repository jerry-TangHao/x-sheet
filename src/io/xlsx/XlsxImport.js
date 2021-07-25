/* global FileReader */
import { Workbook } from 'exceljs';
import { ColorPicker } from '../../module/colorpicker/ColorPicker';
import { BaseFont } from '../../canvas/font/BaseFont';
import { XDraw } from '../../canvas/XDraw';
import { LINE_TYPE } from '../../canvas/Line';
import { PlainUtils } from '../../utils/PlainUtils';
import { ColorArray } from '../../module/colorpicker/colorarray/ColorArray';
import { HexRgb, Theme, ThemeXml } from './XlsxTheme';
import { WideUnit } from '../../core/xtable/tableunit/WideUnit';
import { HeightUnit } from '../../core/xtable/tableunit/HeightUnit';
import { Cell } from '../../core/xtable/tablecell/Cell';

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
      const xTable = { showGrid: views[0].showGridLines, background: '#ffffff' };
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
        cells.forEach((cell) => {
          // 单元格基本属性
          const { value = '', address = '', style = {} } = cell;
          const { richText } = value;
          const { border, fill, font, alignment } = style;
          // 读取列编号
          const colNo = address.replace(number, '');
          const colIndex = PlainUtils.indexAt(colNo);
          // 创建新的XCell;
          const xCell = {
            background: null,
            text: value,
            fontAttr: {},
            borderAttr: {
              top: {},
              right: {},
              left: {},
              bottom: {},
            },
          };
          // 字体属性
          if (font) {
            const { name, bold, size, italic, underline, strike, color } = font;
            xCell.fontAttr.name = name;
            xCell.fontAttr.size = this.fontSize(size || 12);
            xCell.fontAttr.italic = italic;
            xCell.fontAttr.bold = bold;
            xCell.fontAttr.underline = underline;
            xCell.fontAttr.strikethrough = strike;
            if (color) {
              const { theme, tint, argb } = color;
              if (PlainUtils.isNotUnDef(argb)) {
                const rgb = HexRgb(argb);
                xCell.fontAttr.color = ColorPicker.parseHexToRgb(rgb, ColorArray.BLACK);
              } else if (PlainUtils.isNotUnDef(theme)) {
                xCell.fontAttr.color = themeXlsx.setTheme(theme).setTint(tint).getThemeRgb();
              }
            }
          }
          // 富文本
          if (richText) {
            const richFonts = { fonts: [] };
            for (let i = 0, len = richText.length; i < len; i++) {
              const item = richText[i];
              const { font, text } = item;
              const richFont = { text };
              if (font) {
                const { size, name, italic, bold } = font;
                const { underline, strike, color } = font;
                richFont.size = this.fontSize(size || 12);
                richFont.bold = bold;
                richFont.name = name;
                richFont.italic = italic;
                richFont.underline = underline;
                richFont.strikethrough = strike;
                if (color) {
                  const { theme, tint, argb } = color;
                  if (PlainUtils.isNotUnDef(argb)) {
                    const rgb = HexRgb(argb);
                    richFont.color = ColorPicker.parseHexToRgb(rgb, ColorArray.BLACK);
                  } else if (PlainUtils.isNotUnDef(theme)) {
                    richFont.color = themeXlsx.setTheme(theme).setTint(tint).getThemeRgb();
                  }
                }
                richFonts.fonts.push(richFont);
              } else {
                richFonts.fonts.push(richFont);
              }
            }
            xCell.text = richFonts;
            xCell.contentType = Cell.CONTENT_TYPE.RICH_TEXT;
          } else {
            const type = PlainUtils.type(value);
            switch (type) {
              case PlainUtils.DATA_TYPE.Number:
                xCell.contentType = Cell.CONTENT_TYPE.NUMBER;
                break;
              case PlainUtils.DATA_TYPE.Date:
                xCell.contentType = Cell.CONTENT_TYPE.DATE;
                break;
              case PlainUtils.DATA_TYPE.String:
                xCell.contentType = Cell.CONTENT_TYPE.STRING;
                break;
            }
          }
          // 背景颜色
          if (fill) {
            const { fgColor } = fill;
            if (PlainUtils.isNotUnDef(fgColor)) {
              const { theme, tint, argb } = fgColor;
              if (PlainUtils.isNotUnDef(argb)) {
                const rgb = HexRgb(argb);
                xCell.background = ColorPicker.parseHexToRgb(rgb);
              } else if (PlainUtils.isNotUnDef(theme)) {
                xCell.background = themeXlsx.setTheme(theme).setTint(tint).getThemeRgb();
              }
            }
          }
          // 对齐方式
          if (alignment) {
            const { textRotation, wrapText } = alignment;
            const { vertical, horizontal } = alignment;
            xCell.fontAttr.align = horizontal;
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
          // 单元格边框
          if (border) {
            if (border.right) {
              const { style, color } = border.right;
              const { widthType, type } = this.borderType(style);
              xCell.borderAttr.right.widthType = widthType;
              xCell.borderAttr.right.type = type;
              xCell.borderAttr.right.display = true;
              if (color) {
                const { theme, tint, argb } = color;
                if (PlainUtils.isNotUnDef(argb)) {
                  const rgb = HexRgb(argb);
                  xCell.borderAttr.right.color = ColorPicker.parseHexToRgb(rgb, ColorArray.BLACK);
                } else if (PlainUtils.isNotUnDef(theme)) {
                  xCell.borderAttr.right.color = themeXlsx.setTheme(theme).setTint(tint)
                    .getThemeRgb();
                }
              }
            }
            if (border.top) {
              const { style, color } = border.top;
              const { widthType, type } = this.borderType(style);
              xCell.borderAttr.top.display = true;
              xCell.borderAttr.top.type = type;
              xCell.borderAttr.top.widthType = widthType;
              if (color) {
                const { theme, tint, argb } = color;
                if (PlainUtils.isNotUnDef(argb)) {
                  const rgb = HexRgb(argb);
                  xCell.borderAttr.top.color = ColorPicker.parseHexToRgb(rgb, ColorArray.BLACK);
                } else if (PlainUtils.isNotUnDef(theme)) {
                  xCell.borderAttr.top.color = themeXlsx.setTheme(theme).setTint(tint)
                    .getThemeRgb();
                }
              }
            }
            if (border.left) {
              const { style, color } = border.left;
              const { widthType, type } = this.borderType(style);
              xCell.borderAttr.left.display = true;
              xCell.borderAttr.left.type = type;
              xCell.borderAttr.left.widthType = widthType;
              if (color) {
                const { theme, tint, argb } = color;
                if (PlainUtils.isNotUnDef(argb)) {
                  const rgb = HexRgb(argb);
                  xCell.borderAttr.left.color = ColorPicker.parseHexToRgb(rgb, ColorArray.BLACK);
                } else if (PlainUtils.isNotUnDef(theme)) {
                  xCell.borderAttr.left.color = themeXlsx.setTheme(theme).setTint(tint)
                    .getThemeRgb();
                }
              }
            }
            if (border.bottom) {
              const { style, color } = border.bottom;
              const { widthType, type } = this.borderType(style);
              xCell.borderAttr.bottom.display = true;
              xCell.borderAttr.bottom.type = type;
              xCell.borderAttr.bottom.widthType = widthType;
              if (color) {
                const { theme, tint, argb } = color;
                if (PlainUtils.isNotUnDef(argb)) {
                  const rgb = HexRgb(argb);
                  xCell.borderAttr.bottom.color = ColorPicker.parseHexToRgb(rgb, ColorArray.BLACK);
                } else if (PlainUtils.isNotUnDef(theme)) {
                  xCell.borderAttr.bottom.color = themeXlsx.setTheme(theme).setTint(tint)
                    .getThemeRgb();
                }
              }
            }
          }
          // 添加单元格
          item[colIndex] = xCell;
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
      sheets.push({
        name,
        tableConfig: {
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
