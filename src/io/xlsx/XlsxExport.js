/* global Blob */
import { Workbook } from 'exceljs';
import { XDraw } from '../../draw/XDraw';
import { ColorPicker } from '../../module/colorpicker/ColorPicker';
import { BaseFont } from '../../draw/font/BaseFont';
import { SheetUtils } from '../../utils/SheetUtils';
import { Cell } from '../../core/table/tablecell/Cell';
import { LINE_TYPE } from '../../draw/Line';
import { SelectFile } from '../../lib/SelectFile';
import { HeightUnit } from '../../core/table/tableunit/HeightUnit';
import { WideUnit } from '../../core/table/tableunit/WideUnit';
import { Rows } from '../../core/table/tablerow/Rows';
import { Cols } from '../../core/table/tablecol/Cols';
import { Merges } from '../../core/table/merges/Merges';
import { Cells } from '../../core/table/tablecell/Cells';

function next(i, step = 1) {
  return i + step;
}

function last(i, step = 1) {
  return i - step;
}

/**
 * XLSX 文件导出
 */
class XlsxExport {

  /**
   * XlsxExport
   * @param workOptions
   * @param sheetList
   * @param dpr
   * @param unit
   * @param dpi
   */
  constructor({
    workOptions, sheetList, dpr, unit, dpi,
  }) {
    XDraw.refresh(dpr);
    this.workOptions = workOptions;
    this.sheetList = sheetList;
    this.heightUnit = new HeightUnit({
      dpi,
    });
    this.wideUnit = new WideUnit({
      unit,
    });
  }

  /**
   * 导出XLSX文件
   * @returns {Promise<Blob>}
   */
  async export() {
    const { workOptions, sheetList } = this;
    // exceljs 在内存中构建xlsx文件
    // 使得导出时数据量过大就会
    // 占用大量内存,导致浏览器崩溃
    // 暂无处理方法, 再想想办法
    // TODO .....
    // .....
    // 创建工作薄
    const workbook = new Workbook();
    workbook.created = workOptions.created;
    workbook.creator = workOptions.creator;
    workbook.modified = workOptions.modified;
    workbook.lastModifiedBy = workOptions.lastModifiedBy;
    // 添加工作表
    sheetList.forEach((sheet) => {
      const { name, tableConfig } = sheet;
      const { table, merge } = tableConfig;
      const { rows, cols, data } = tableConfig;
      // 初始化配置数据
      const xMerges = new Merges({
        ...merge,
      });
      const xCells = new Cells({
        data,
      });
      const xCols = new Cols(cols);
      const xRows = new Rows(rows);
      // 创建工作表
      const worksheet = workbook.addWorksheet(name);
      // 默认宽高
      worksheet.defaultRowHeight = this.rowHeight(xRows.getOriginDefaultHeight());
      worksheet.defaultColWidth = this.colWidth(xCols.getOriginDefaultWidth());
      // 是否显示网格
      worksheet.views = [{
        showGridLines: table.showGrid,
      }];
      // 处理列宽
      const sheetColumns = [];
      xCols.eachWidth(0, last(xCols.len), (col) => {
        const srcWidth = xCols.getOriginWidth(col);
        const colWidth = this.colWidth(srcWidth);
        sheetColumns.push({
          width: colWidth,
        });
      });
      worksheet.columns = sheetColumns;
      // 处理数据
      let row = 0;
      while (xCells.getLength() > 0 && row < xRows.len) {
        let items = xCells.shift();
        let col = 0;
        if (items) {
          const origin = xRows.getOriginHeight(row);
          const height = this.rowHeight(origin);
          const workRow = worksheet.getRow(next(row));
          workRow.height = height;
          while (items.length > 0 && col < xCols.len) {
            const config = items.shift();
            if (config) {
              const cell = Cells.wrapCell(config);
              const { contentType, background } = cell;
              const { text, fontAttr, borderAttr } = cell;
              const { top, right, left, bottom } = borderAttr;
              const workCell = workRow.getCell(next(col));
              // 单元格文本
              if (text) {
                switch (contentType) {
                  case Cell.TYPE.NUMBER:
                    workCell.value = SheetUtils.parseFloat(text);
                    break;
                  case Cell.TYPE.STRING:
                    workCell.value = text;
                    break;
                }
              }
              // 字体样式
              workCell.font = {
                name: fontAttr.name,
                color: {
                  argb: ColorPicker.parseRgbToHex(fontAttr.color),
                },
                size: this.fontSize(fontAttr.size),
                italic: fontAttr.italic,
                bold: fontAttr.bold,
                underline: fontAttr.underline,
                strike: fontAttr.strikethrough,
              };
              // 对齐方式
              workCell.alignment = {
                vertical: fontAttr.verticalAlign,
                horizontal: fontAttr.align,
                wrapText: fontAttr.textWrap === BaseFont.TEXT_WRAP.WORD_WRAP,
              };
              switch (fontAttr.direction) {
                case BaseFont.TEXT_DIRECTION.VERTICAL:
                  workCell.alignment.textRotation = 'vertical';
                  break;
                case BaseFont.TEXT_DIRECTION.ANGLE:
                case BaseFont.TEXT_DIRECTION.ANGLE_BAR:
                  workCell.alignment.textRotation = fontAttr.angle;
                  break;
              }
              // 单元格背景
              if (background) {
                workCell.fill = {
                  type: 'pattern',
                  pattern: 'solid',
                  fgColor: { argb: ColorPicker.parseRgbToHex(background) },
                };
              }
              // 单元格边框
              workCell.border = {
                top: {}, left: {}, right: {}, bottom: {},
              };
              if (top.display) {
                const { widthType, type, color } = borderAttr.top;
                workCell.border.top.style = this.borderType(widthType, type);
                workCell.border.top.color = {
                  argb: ColorPicker.parseRgbToHex(color),
                };
              }
              if (right.display) {
                const { widthType, type, color } = borderAttr.right;
                workCell.border.right.style = this.borderType(widthType, type);
                workCell.border.right.color = {
                  argb: ColorPicker.parseRgbToHex(color),
                };
              }
              if (left.display) {
                const { widthType, type, color } = borderAttr.left;
                workCell.border.left.style = this.borderType(widthType, type);
                workCell.border.left.color = {
                  argb: ColorPicker.parseRgbToHex(color),
                };
              }
              if (bottom.display) {
                const { widthType, type, color } = borderAttr.bottom;
                workCell.border.bottom.style = this.borderType(widthType, type);
                workCell.border.bottom.color = {
                  argb: ColorPicker.parseRgbToHex(color),
                };
              }
            }
            col++;
          }
        }
        row++;
      }
      // 处理合并
      xMerges.getAll().forEach((xMergeRange) => {
        const { sri, sci, eri, eci } = xMergeRange;
        worksheet.mergeCells(
          next(sri), next(sci), next(eri), next(eci),
        );
      });
    });
    // 返回文件信息
    const data = await workbook.xlsx.writeBuffer();
    return new Blob([data], {
      type: SelectFile.ACCEPT.XLSX,
    });
  }

  /**
   * 字体大小转换
   * @param value
   */
  fontSize(value) {
    const pixel = XDraw.stylePx(value);
    return this.heightUnit.getPoint(pixel);
  }

  /**
   * 行高转换
   * @param value
   */
  rowHeight(value) {
    const pixel = XDraw.stylePx(value);
    return this.heightUnit.getPoint(pixel);
  }

  /**
   * 列宽转换
   * @param value
   */
  colWidth(value) {
    return XDraw.dpr() > 1
      ? this.wideUnit.getPixelNumber(value + 5)
      : this.wideUnit.getPixelNumber(value - 5);
  }

  /**
   * 边框类型转换
   * @param value
   * @param type
   * @returns {string}
   */
  borderType(value, type) {
    switch (type) {
      case LINE_TYPE.SOLID_LINE: {
        switch (value) {
          case XDraw.LINE_WIDTH_TYPE.low:
            return 'thin';
          case XDraw.LINE_WIDTH_TYPE.medium:
            return 'medium';
          case XDraw.LINE_WIDTH_TYPE.high:
            return 'thick';
        }
        break;
      }
      case LINE_TYPE.POINT_LINE:
        return 'dashDot';
      case LINE_TYPE.DOTTED_LINE: {
        return 'dotted';
      }
      case LINE_TYPE.DOUBLE_LINE:
        return 'double';
    }
    return 'thick';
  }

}

export {
  XlsxExport,
};
