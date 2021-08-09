import { CommonOutRange } from './CommonOutRange';
import { SheetUtils } from '../../../../../utils/SheetUtils';
import { BaseFont } from '../../../../../draw/font/BaseFont';
import { LineIteratorFilter } from '../../LineIteratorFilter';

class LContentOutRange extends CommonOutRange {

  run({
    row, col,
  }) {
    const { table } = this;
    const { merges } = table;
    const lastMerge = merges.getFirstIncludes(row, col - 1);
    const masterMerge = merges.getFirstIncludes(row, col);
    if (masterMerge || lastMerge) {
      return LineIteratorFilter.RETURN_TYPE.EXEC;
    }
    return this.master({ row, col }) && this.right({ row, col }) && this.left({ row, col })
      ? LineIteratorFilter.RETURN_TYPE.EXEC
      : LineIteratorFilter.RETURN_TYPE.JUMP;
  }

  master({
    row, col,
  }) {
    const { table } = this;
    const { cells, cols } = table;
    const last = cells.getCell(row, col - 1);
    const master = cells.getCell(row, col);

    // 是否是空单元格
    if (SheetUtils.isUnDef(master) || master.isEmpty()) {
      return true;
    }
    // 文字属性检查
    const { fontAttr } = master;
    const { direction } = fontAttr;
    // 是否旋转文本
    if (direction === BaseFont.TEXT_DIRECTION.ANGLE) {
      const { angle } = fontAttr;
      if (table.isAngleBarCell(row, col)) {
        return angle > 0;
      }
      if (angle === 90 || angle === -90) {
        return true;
      }
    } else {
      const { textWrap } = fontAttr;
      if (textWrap !== BaseFont.TEXT_WRAP.OVER_FLOW) {
        return true;
      }
    }
    // 对其方式检查
    const { align } = fontAttr;
    if (align !== BaseFont.ALIGN.right && align !== BaseFont.ALIGN.center) {
      return true;
    }
    // 文本是否越界
    const width = table.getCellContentBoundOutWidth(row, col);
    const maxWidth = cols.getWidth(col);
    if (width > maxWidth) {
      // 只有next单元格是空时
      // 才允许不绘制边框
      if (SheetUtils.isUnDef(last) || last.isEmpty()) {
        return false;
      }
    }
    return true;
  }

  left({
    row, col,
  }) {
    const { table } = this;
    const { cells, cols, merges, xIteratorBuilder } = table;
    const master = cells.getCell(row, col);
    let find = true;
    let leftWidth = cols.getWidth(col - 1);

    // 左方向越界检查
    if (table.hasAngleCell(row)) {
      xIteratorBuilder.getColIterator()
        .setBegin(col - 1)
        .setEnd(0)
        .setLoop((i) => {
          // 是否是合并单元格
          const merge = merges.getFirstIncludes(row, i);
          if (SheetUtils.isNotUnDef(merge)) {
            return false;
          }
          // 是否是空单元格
          const cell = cells.getCell(row, i);
          if (SheetUtils.isUnDef(cell)) {
            return true;
          }
          // 是否是空文本
          if (cell.isEmpty()) {
            return true;
          }
          // 检查文本属性
          const { fontAttr } = cell;
          const { direction } = fontAttr;
          // 是否旋转文本
          if (direction === BaseFont.TEXT_DIRECTION.ANGLE) {
            const { angle } = fontAttr;
            // 忽略反方向旋转的angleBar单元格
            if (table.isAngleBarCell(row, i)) {
              if (angle < 0) {
                return true;
              }
            } else {
              // 旋转方向忽略正负90度
              if (angle === 90 || angle === -90) {
                return true;
              }
              // 检查对其方式
              const { align } = fontAttr;
              if (align !== BaseFont.ALIGN.left && align !== BaseFont.ALIGN.center) {
                return true;
              }
            }
          } else {
            // 检查裁剪类型
            const { textWrap } = fontAttr;
            if (textWrap !== BaseFont.TEXT_WRAP.OVER_FLOW) {
              return true;
            }
            // 检查对其方式
            const { align } = fontAttr;
            if (align !== BaseFont.ALIGN.left && align !== BaseFont.ALIGN.center) {
              return true;
            }
          }
          // 文本是否越界
          const width = table.getCellContentBoundOutWidth(row, i);
          if (width > leftWidth) {
            find = false;
            return false;
          }
          return true;
        })
        .setNext((i) => {
          leftWidth += cols.getWidth(i);
        })
        .execute();
    } else {
      xIteratorBuilder.getColIterator()
        .setBegin(col - 1)
        .setEnd(0)
        .setLoop((i) => {
          // 是否是合并单元格
          const merge = merges.getFirstIncludes(row, i);
          if (SheetUtils.isNotUnDef(merge)) {
            return false;
          }
          // 是否是空单元格
          const cell = cells.getCell(row, i);
          if (SheetUtils.isUnDef(cell)) {
            return true;
          }
          // 是否是空文本
          if (cell.isEmpty()) {
            return true;
          }
          // 检查文本类型
          const { fontAttr } = cell;
          const { textWrap } = fontAttr;
          // 检查裁剪类型
          if (textWrap !== BaseFont.TEXT_WRAP.OVER_FLOW) {
            return false;
          }
          // 检查对其方式
          const { align } = fontAttr;
          if (align !== BaseFont.ALIGN.left && align !== BaseFont.ALIGN.center) {
            return false;
          }
          // 文本是否越界
          const width = table.getCellContentBoundOutWidth(row, i);
          if (width > leftWidth) {
            // 只有master单元格为
            // 空时才允许不绘制边框
            if (SheetUtils.isUnDef(master) || master.isEmpty()) {
              find = false;
            }
          }
          return false;
        })
        .setNext((i) => {
          leftWidth += cols.getWidth(i);
        })
        .execute();
    }
    return find;
  }

  right({
    row, col,
  }) {
    const { table } = this;
    const { cells, cols, merges, xIteratorBuilder } = table;
    const { len } = cols;
    const last = cells.getCell(row, col - 1);
    const master = cells.getCell(row, col);
    let find = true;
    let rightWidth = cols.getWidth(col + 1) + cols.getWidth(col);

    // 右方向越界检查
    if (table.hasAngleCell(row)) {
      xIteratorBuilder.getColIterator()
        .setBegin(col + 1)
        .setEnd(len)
        .setLoop((j) => {
          // 合并单元格检查
          const merge = merges.getFirstIncludes(row, j);
          if (SheetUtils.isNotUnDef(merge)) {
            return false;
          }
          // 空单元格检查
          const cell = cells.getCell(row, j);
          if (SheetUtils.isUnDef(cell)) {
            return true;
          }
          // 空文本单检查
          if (cell.isEmpty()) {
            return true;
          }
          // 文本属性检查
          const { fontAttr } = cell;
          const { direction } = fontAttr;
          // 文本旋转方向
          if (direction === BaseFont.TEXT_DIRECTION.ANGLE) {
            const { angle } = fontAttr;
            // 忽略反方向旋转的angleBar单元格
            if (table.isAngleBarCell(row, j)) {
              if (angle > 0) {
                return true;
              }
            } else {
              // 旋转方向忽略正负90度
              if (angle === 90 || angle === -90) {
                return true;
              }
              // 检查对其方式
              const { align } = fontAttr;
              if (align !== BaseFont.ALIGN.right && align !== BaseFont.ALIGN.center) {
                return true;
              }
            }
          } else {
            // 检查文本裁剪类型
            const { textWrap } = fontAttr;
            if (textWrap !== BaseFont.TEXT_WRAP.OVER_FLOW) {
              return true;
            }
            // 检查文本对齐方式
            const { align } = fontAttr;
            if (align !== BaseFont.ALIGN.right && align !== BaseFont.ALIGN.center) {
              return true;
            }
          }
          // 检查文本是否越界
          const width = table.getCellContentBoundOutWidth(row, j);
          if (width > rightWidth) {
            find = false;
            return false;
          }
          return true;
        })
        .setNext((j) => {
          rightWidth += cols.getWidth(j);
        })
        .execute();
    } else {
      xIteratorBuilder.getColIterator()
        .setBegin(col + 1)
        .setEnd(len)
        .setLoop((j) => {
          // 合并单元格检查
          const merge = merges.getFirstIncludes(row, j);
          if (SheetUtils.isNotUnDef(merge)) {
            return false;
          }
          // 空单元格检查
          const cell = cells.getCell(row, j);
          if (SheetUtils.isUnDef(cell)) {
            return true;
          }
          // 空文本单检查
          if (cell.isEmpty()) {
            return true;
          }
          // 文本属性检查
          const { fontAttr } = cell;
          const { textWrap } = fontAttr;
          // 裁剪类型检查
          if (textWrap !== BaseFont.TEXT_WRAP.OVER_FLOW) {
            return false;
          }
          // 文本对齐方式检查
          const { align } = fontAttr;
          if (align !== BaseFont.ALIGN.right && align !== BaseFont.ALIGN.center) {
            return false;
          }
          // 文本越界检查
          const width = table.getCellContentBoundOutWidth(row, j);
          if (width > rightWidth) {
            // 只有master单元格和
            // last单元格都是空时
            // 才允许不绘制边框
            const masterBlank = SheetUtils.isUnDef(master) || master.isEmpty();
            const nextBlank = SheetUtils.isUnDef(last) || last.isEmpty();
            if (masterBlank && nextBlank) {
              find = false;
            }
          }
          return false;
        })
        .setNext((j) => {
          rightWidth += cols.getWidth(j);
        })
        .execute();
    }
    return find;
  }

}

export {
  LContentOutRange,
};
