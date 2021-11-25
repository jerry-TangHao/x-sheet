import { RectRange } from '../../tablebase/RectRange';
import { BaseCellsHelper } from '../base/BaseCellsHelper';
import { SheetUtils } from '../../../../utils/SheetUtils';

class CopyMerge {

  constructor({
    targetViewRange,
    originViewRange,
    merge = () => {},
    master = () => {},
    onCopy = () => {},
    xIteratorBuilder,
  }) {
    this.targetViewRange = targetViewRange;
    this.originViewRange = originViewRange;
    this.master = master;
    this.merge = merge;
    this.onCopy = onCopy;
    this.xIteratorBuilder = xIteratorBuilder;
  }

  copyStartRow() {
    const { originViewRange } = this;
    return originViewRange.sri;
  }

  copyEndRow() {
    const { originViewRange } = this;
    return originViewRange.eri;
  }

  nextCopyRow(row) {
    const endRow = this.copyEndRow();
    if (row >= endRow) {
      return this.copyStartRow();
    }
    return row + 1;
  }

  copyStartCol() {
    const { originViewRange } = this;
    return originViewRange.sci;
  }

  copyEndCol() {
    const { originViewRange } = this;
    return originViewRange.eci;
  }

  nextCopyCol(col) {
    const endCol = this.copyEndCol();
    if (col >= endCol) {
      return this.copyStartCol();
    }
    return col + 1;
  }

  pasteStartRow() {
    const { targetViewRange } = this;
    return targetViewRange.sri;
  }

  pasteEndRow() {
    const { targetViewRange } = this;
    return targetViewRange.eri;
  }

  pasteStartCol() {
    const { targetViewRange } = this;
    return targetViewRange.sci;
  }

  pasteEndCol() {
    const { targetViewRange } = this;
    return targetViewRange.eci;
  }

  executeCopy() {
    let ori = this.copyStartRow();
    this.xIteratorBuilder.getRowIterator()
      .setBegin(this.pasteStartRow())
      .setEnd(this.pasteEndRow())
      .setLoop((tri) => {
        let oci = this.copyStartCol();
        this.xIteratorBuilder.getColIterator()
          .setBegin(this.pasteStartCol())
          .setEnd(this.pasteEndCol())
          .setLoop((tci) => {
            const merge = this.merge(ori, oci);
            if (merge && this.master(ori, oci, merge)) {
              this.onCopy(tri, tci, merge);
            }
          })
          .setNext(() => {
            oci = this.nextCopyCol(oci);
          })
          .execute();
      })
      .setNext(() => {
        ori = this.nextCopyRow(ori);
      })
      .foldOnOff(false)
      .execute();
  }

}

class CopyCellIN {

  constructor({
    targetViewRange,
    originViewRange,
    onCopy = () => {},
    xIteratorBuilder,
  }) {
    this.targetViewRange = targetViewRange;
    this.originViewRange = originViewRange;
    this.onCopy = onCopy;
    this.xIteratorBuilder = xIteratorBuilder;
  }

  copyStartRow() {
    const { originViewRange } = this;
    const { sri, eri } = originViewRange;
    return this.xIteratorBuilder.getRowIterator()
      .setBegin(sri - 1)
      .setEnd(eri)
      .nextRow();
  }

  copyEndRow() {
    const { originViewRange } = this;
    const { sri, eri } = originViewRange;
    return this.xIteratorBuilder.getRowIterator()
      .setBegin(eri + 1)
      .setEnd(sri)
      .nextRow();
  }

  nextCopyRow(row) {
    const endRow = this.copyEndRow();
    if (row >= endRow) {
      return this.copyStartRow();
    }
    return this.xIteratorBuilder.getRowIterator()
      .setBegin(row)
      .setEnd(endRow)
      .nextRow();
  }

  copyStartCol() {
    const { originViewRange } = this;
    return originViewRange.sci;
  }

  copyEndCol() {
    const { originViewRange } = this;
    return originViewRange.eci;
  }

  nextCopyCol(col) {
    const endCol = this.copyEndCol();
    if (col >= endCol) {
      return this.copyStartCol();
    }
    return col + 1;
  }

  pasteStartRow() {
    const { targetViewRange } = this;
    return targetViewRange.sri;
  }

  pasteEndRow() {
    const { targetViewRange } = this;
    return targetViewRange.eri;
  }

  pasteStartCol() {
    const { targetViewRange } = this;
    return targetViewRange.sci;
  }

  pasteEndCol() {
    const { targetViewRange } = this;
    return targetViewRange.eci;
  }

  executeCopy() {
    let ori = this.copyStartRow();
    this.xIteratorBuilder.getRowIterator()
      .setBegin(this.pasteStartRow())
      .setEnd(this.pasteEndRow())
      .setLoop((tri) => {
        let oci = this.copyStartCol();
        this.xIteratorBuilder.getColIterator()
          .setBegin(this.pasteStartCol())
          .setEnd(this.pasteEndCol())
          .setLoop((tci) => {
            this.onCopy(tri, tci, ori, oci);
          })
          .setNext(() => {
            oci = this.nextCopyCol(oci);
          })
          .execute();
      })
      .setNext(() => {
        ori = this.nextCopyRow(ori);
      })
      .execute();
  }

}

class Serialize {

  constructor({
    originViewRange,
    direction,
    getStartIndex,
    onSerialize,
    xIteratorBuilder,
  }) {
    this.originViewRange = originViewRange;
    this.direction = direction;
    this.getStartIndex = getStartIndex;
    this.onSerialize = onSerialize;
    this.xIteratorBuilder = xIteratorBuilder;
  }

  serializeRight() {
    const { originViewRange, onSerialize, getStartIndex } = this;
    const { sri, sci, eri, eci } = originViewRange;
    let ret = true;
    this.xIteratorBuilder.getRowIterator()
      .setBegin(sri)
      .setEnd(eri)
      .setLoop((ri) => {
        let start = SheetUtils.Nul;
        this.xIteratorBuilder.getColIterator()
          .setBegin(sci)
          .setEnd(eci)
          .setLoop((ci) => {
            if (start === SheetUtils.Nul) {
              const index = getStartIndex(ri, ci);
              if (!SheetUtils.isNumber(index)) {
                ret = false;
              } else {
                start = parseInt(index, 10);
              }
            } else {
              start += 1;
              onSerialize(ri, ci, start);
            }
            return ret;
          })
          .execute();
        return ret;
      })
      .execute();
  }

  serializeBottom() {
    const { originViewRange, onSerialize, getStartIndex } = this;
    const { sri, sci, eri, eci } = originViewRange;
    let ret = true;
    this.xIteratorBuilder.getColIterator()
      .setBegin(sci)
      .setEnd(eci)
      .setLoop((ci) => {
        let start = SheetUtils.Nul;
        this.xIteratorBuilder.getRowIterator()
          .setBegin(sri)
          .setEnd(eri)
          .setLoop((ri) => {
            if (start === SheetUtils.Nul) {
              const index = getStartIndex(ri, ci);
              if (!SheetUtils.isNumber(index)) {
                ret = false;
              } else {
                start = parseInt(index, 10);
              }
            } else {
              start += 1;
              onSerialize(ri, ci, start);
            }
            return ret;
          })
          .execute();
        return ret;
      })
      .execute();
  }

  serializeTop() {
    const { originViewRange, onSerialize, getStartIndex } = this;
    const { sri, sci, eri, eci } = originViewRange;
    let ret = true;
    this.xIteratorBuilder.getColIterator()
      .setBegin(sci)
      .setEnd(eci)
      .setLoop((ci) => {
        let start = SheetUtils.Nul;
        this.xIteratorBuilder.getRowIterator()
          .setBegin(eri)
          .setEnd(sri)
          .setLoop((ri) => {
            if (start === SheetUtils.Nul) {
              const index = getStartIndex(ri, ci);
              if (!SheetUtils.isNumber(index)) {
                ret = false;
              } else {
                start = parseInt(index, 10);
              }
            } else {
              start -= 1;
              onSerialize(ri, ci, start);
            }
            return ret;
          })
          .execute();
        return ret;
      })
      .execute();
  }

  serializeLeft() {
    const { originViewRange, onSerialize, getStartIndex } = this;
    const { sri, sci, eri, eci } = originViewRange;
    let ret = true;
    this.xIteratorBuilder.getRowIterator()
      .setBegin(sri)
      .setEnd(eri)
      .setLoop((ri) => {
        let start = SheetUtils.Nul;
        this.xIteratorBuilder.getColIterator()
          .setBegin(eci)
          .setEnd(sci)
          .setLoop((ci) => {
            if (start === SheetUtils.Nul) {
              const index = getStartIndex(ri, ci);
              if (!SheetUtils.isNumber(index)) {
                ret = false;
              } else {
                start = parseInt(index, 10);
              }
            } else {
              start -= 1;
              onSerialize(ri, ci, start);
            }
          })
          .execute();
        return ret;
      })
      .execute();
  }

  executeSerialize() {
    const { direction } = this;
    switch (direction) {
      case Serialize.SERIALIZE_DIRECTION.LEFT:
        this.serializeLeft();
        break;
      case Serialize.SERIALIZE_DIRECTION.TOP:
        this.serializeTop();
        break;
      case Serialize.SERIALIZE_DIRECTION.RIGHT:
        this.serializeRight();
        break;
      case Serialize.SERIALIZE_DIRECTION.BOTTOM:
        this.serializeBottom();
        break;
    }
  }

}
Serialize.SERIALIZE_DIRECTION = {
  RIGHT: 3,
  BOTTOM: 4,
  TOP: 1,
  LEFT: 2,
};

class CellMergeCopyHelper extends BaseCellsHelper {

  constructor(table) {
    super();
    this.table = table;
  }

  getStyleTable() {
    return this.table.xTableStyle;
  }

  getXTableAreaView() {
    return this.table.xTableAreaView;
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

  getMerges() {
    return this.table.getTableMerges();
  }

  getXIteratorBuilder() {
    return this.table.xIteratorBuilder;
  }

  copyCellINContent({
    originViewRange, targetViewRange,
  }) {
    const { table } = this;
    const { xIteratorBuilder } = table;
    const cells = this.getCells();
    const copy = new CopyCellIN({
      originViewRange,
      targetViewRange,
      xIteratorBuilder,
      onCopy: (tri, tci, ori, oci) => {
        const src = cells.getCell(ori, oci);
        if (src) {
          const target = src.clone();
          cells.setCellOrNew(tri, tci, target);
        }
      },
    });
    copy.executeCopy();
  }

  copyMergeContent({
    originViewRange, targetViewRange,
  }) {
    const { table } = this;
    const { xIteratorBuilder } = table;
    const merges = this.getMerges();
    const copy = new CopyMerge({
      originViewRange,
      targetViewRange,
      xIteratorBuilder,
      merge: (ri, ci) => merges.getFirstInclude(ri, ci),
      master: (ri, ci, m) => m.sri === ri && m.sci === ci,
      onCopy: (ri, ci, m) => {
        let [rSize, cSize] = m.size();
        cSize -= 1;
        rSize -= 1;
        const newMerge = new RectRange(ri, ci, ri + rSize, ci + cSize);
        const hasFold = xIteratorBuilder.getRowIterator()
          .setBegin(newMerge.sri)
          .setEnd(newMerge.eri)
          .hasFold();
        if (hasFold) {
          return;
        }
        newMerge.each(xIteratorBuilder, (ri, ci) => {
          const merge = merges.getFirstInclude(ri, ci);
          if (merge) {
            merges.delete(merge);
          }
        });
        merges.add(newMerge);
      },
    });
    copy.executeCopy();
  }

  copyStylesContent({
    originViewRange, targetViewRange,
  }) {
    const { table } = this;
    const { xIteratorBuilder } = table;
    const cells = this.getCells();
    const copy = new CopyCellIN({
      originViewRange,
      targetViewRange,
      xIteratorBuilder,
      onCopy: (tri, tci, ori, oci) => {
        const src = cells.getCell(ori, oci);
        if (src) {
          const target = cells.getCellOrNew(tri, tci);
          const clone = src.clone();
          clone.text = target.text;
          cells.setCellOrNew(tri, tci, clone);
        }
      },
    });
    copy.executeCopy();
  }

  serializeContent({
    originViewRange, direction,
  }) {
    const { table } = this;
    const { xIteratorBuilder } = table;
    const cells = this.getCells();
    const serialize = new Serialize({
      originViewRange,
      direction,
      xIteratorBuilder,
      getStartIndex: (ri, ci) => {
        const cell = cells.getCell(ri, ci);
        if (cell) {
          return cell.text;
        }
        return SheetUtils.Nul;
      },
      onSerialize: (ri, ci, index) => {
        const cell = cells.getCellOrNew(ri, ci);
        const clone = cell.clone();
        clone.text = index;
        cells.setCellOrNew(ri, ci, clone);
      },
    });
    serialize.executeSerialize();
  }

}

export {
  CellMergeCopyHelper,
  CopyMerge,
  Serialize,
  CopyCellIN,
};
