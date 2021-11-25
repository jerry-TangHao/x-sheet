import { RectRange } from '../tablebase/RectRange';
import { Snapshot } from '../snapshot/Snapshot';
import { RangeTree } from '../tablebase/RangeTree';
import { RtreeUtils } from '../../../utils/RtreeUtils';

/**
 * Merges
 */
class Merges extends RangeTree {

  /**
     * Merges 合并区域管理
     */
  constructor({
    snapshot = new Snapshot(),
    merges = [],
  } = {}) {
    super({ snapshot });
    merges.map(merge => RectRange.valueOf(merge)).forEach(view => this.add(view));
  }

  /**
   * 获取矩形的json数据
   */
  getData() {
    return {
      merges: this.getAll().map(range => range.toString()),
    };
  }

  /**
   * 删除行号
   * @param ri
   * @param number
   */
  removeRow(ri, number) {
    let { rTree, snapshot } = this;
    let footRange = new RectRange(ri, 0, RangeTree.MAX_ROW, RangeTree.MAX_COL);
    let fullRange = this.getFullRowRange(ri, number);
    let fullBbox = RtreeUtils.rangeToBbox(fullRange);
    let footBbox = RtreeUtils.rangeToBbox(footRange);
    let divers = [];
    let search = [];
    let mergeAction = {
      undo: () => {
        let { length } = divers;
        for (let i = 0; i < length; i++) {
          const item = divers[i];
          rTree.remove(item);
        }
        rTree.load(search);
      },
      redo: () => {
        divers = [];
        search = rTree.search(footBbox);
        let { length } = search;
        for (let i = 0; i < length; i++) {
          const item = search[i];
          const clone = { ...item };
          rTree.remove(item);
          if (clone.minY < fullBbox.minY) {
            if (clone.maxY < fullBbox.maxY) {
              let diffMax = clone.maxY - fullBbox.minY;
              diffMax += 1;
              clone.oldMax = clone.maxY;
              clone.maxY -= diffMax;
              clone.style = 'oddValue';
              if (clone.maxX !== clone.minX || clone.maxY !== clone.minY) {
                divers.push(clone);
              }
              continue;
            }
            if (clone.maxY > fullBbox.maxY) {
              let diffMax = fullBbox.maxY - footBbox.minY;
              diffMax += 1;
              clone.oldMax = clone.maxY;
              clone.maxY -= diffMax;
              clone.style = 'oddValue';
              if (clone.maxX !== clone.minX || clone.maxY !== clone.minY) {
                divers.push(clone);
              }
              continue;
            }
            if (clone.maxY === fullBbox.maxY) {
              let diffMax = fullBbox.maxY - footBbox.minY;
              diffMax += 1;
              clone.oldMax = clone.maxY;
              clone.maxY -= diffMax;
              clone.style = 'oddValue';
              if (clone.maxX !== clone.minX || clone.maxY !== clone.minY) {
                divers.push(clone);
              }
              continue;
            }
          }
          if (clone.minY > fullBbox.minY) {
            if (clone.minY < fullBbox.maxY) {
              if (clone.maxY > fullBbox.maxY) {
                let diffMin = clone.minY - fullBbox.minY;
                let diffMax = fullBbox.maxY - clone.minY;
                diffMax += diffMin + 1;
                clone.oldMax = clone.maxY;
                clone.oldMin = clone.minY;
                clone.maxY -= diffMax;
                clone.minY -= diffMin;
                clone.style = 'evenValue';
                if (clone.maxX !== clone.minX || clone.maxY !== clone.minY) {
                  divers.push(clone);
                }
                continue;
              }
            }
            if (clone.minY > fullBbox.maxY) {
              let diffValue = fullBbox.maxY - fullBbox.minY;
              diffValue += 1;
              clone.oldMax = clone.maxY;
              clone.oldMin = clone.minY;
              clone.maxY -= diffValue;
              clone.minY -= diffValue;
              clone.style = 'evenValue';
              if (clone.maxX !== clone.minX || clone.maxY !== clone.minY) {
                divers.push(clone);
              }
              continue;
            }
          }
          if (clone.minY === fullBbox.minY) {
            if (clone.maxY > fullBbox.maxY) {
              let diffMax = fullBbox.maxY - clone.minY;
              diffMax += 1;
              clone.oldMax = clone.maxY;
              clone.maxY -= diffMax;
              clone.style = 'oddValue';
              if (clone.maxX !== clone.minX || clone.maxY !== clone.minY) {
                divers.push(clone);
              }
            }
          }
        }
        rTree.load(divers);
      },
    };
    snapshot.addAction(mergeAction);
    mergeAction.redo();
  }

  /**
   * 删除列号
   * @param ci
   * @param number
   */
  removeCol(ci, number) {
    let { rTree, snapshot } = this;
    let footRange = new RectRange(0, ci, RangeTree.MAX_ROW, RangeTree.MAX_COL);
    let fullRange = this.getFullColRange(ci, number);
    let fullBbox = RtreeUtils.rangeToBbox(fullRange);
    let footBbox = RtreeUtils.rangeToBbox(footRange);
    let divers = [];
    let search = [];
    let mergeAction = {
      undo: () => {
        let { length } = divers;
        for (let i = 0; i < length; i++) {
          const item = divers[i];
          rTree.remove(item);
        }
        rTree.load(search);
      },
      redo: () => {
        divers = [];
        search = rTree.search(footBbox);
        let { length } = search;
        for (let i = 0; i < length; i++) {
          const item = search[i];
          const clone = { ...item };
          rTree.remove(item);
          if (clone.minX < fullBbox.minX) {
            if (clone.maxX < fullBbox.maxX) {
              let diffMax = clone.maxX - fullBbox.minX;
              diffMax += 1;
              clone.oldMax = clone.maxX;
              clone.maxX -= diffMax;
              clone.style = 'oddValue';
              if (clone.maxX !== clone.minX || clone.maxY !== clone.minY) {
                divers.push(clone);
              }
              continue;
            }
            if (clone.maxX > fullBbox.maxX) {
              let diffMax = fullBbox.maxX - footBbox.minX;
              diffMax += 1;
              clone.oldMax = clone.maxX;
              clone.maxX -= diffMax;
              clone.style = 'oddValue';
              if (clone.maxX !== clone.minX || clone.maxY !== clone.minY) {
                divers.push(clone);
              }
              continue;
            }
            if (clone.maxX === fullBbox.maxX) {
              let diffMax = fullBbox.maxX - footBbox.minX;
              diffMax += 1;
              clone.oldMax = clone.maxX;
              clone.maxX -= diffMax;
              clone.style = 'oddValue';
              if (clone.maxX !== clone.minX || clone.maxY !== clone.minY) {
                divers.push(clone);
              }
              continue;
            }
          }
          if (clone.minX > fullBbox.minX) {
            if (clone.minX < fullBbox.maxX) {
              if (clone.maxX > fullBbox.maxX) {
                let diffMin = clone.minX - fullBbox.minX;
                let diffMax = fullBbox.maxX - clone.minX;
                diffMax += diffMin + 1;
                clone.oldMax = clone.maxX;
                clone.oldMin = clone.minX;
                clone.maxX -= diffMax;
                clone.minX -= diffMin;
                clone.style = 'evenValue';
                if (clone.maxX !== clone.minX || clone.maxY !== clone.minY) {
                  divers.push(clone);
                }
                continue;
              }
            }
            if (clone.minX > fullBbox.maxX) {
              let diffValue = fullBbox.maxX - fullBbox.minX;
              diffValue += 1;
              clone.oldMax = clone.maxX;
              clone.oldMin = clone.minX;
              clone.maxX -= diffValue;
              clone.minX -= diffValue;
              clone.style = 'evenValue';
              if (clone.maxX !== clone.minX || clone.maxY !== clone.minY) {
                divers.push(clone);
              }
              continue;
            }
          }
          if (clone.minX === fullBbox.minX) {
            if (clone.maxX > fullBbox.maxX) {
              let diffMax = fullBbox.maxX - clone.minX;
              diffMax += 1;
              clone.oldMax = clone.maxX;
              clone.maxX -= diffMax;
              clone.style = 'oddValue';
              if (clone.maxX !== clone.minX || clone.maxY !== clone.minY) {
                divers.push(clone);
              }
            }
          }
        }
        rTree.load(divers);
      },
    };
    snapshot.addAction(mergeAction);
    mergeAction.redo();
  }

  /**
   * 插入新列时调整区域大小和位置
   * @param ci
   * @param number
   */
  insertColAfter(ci, number) {
    const { snapshot } = this;
    const mergeAction = {
      undo: () => {
        this.colAfterShrink(ci, number);
      },
      redo: () => {
        this.colAfterExpand(ci, number);
      },
    };
    snapshot.addAction(mergeAction);
    mergeAction.redo();
  }

  /**
   * 插入新列时调整区域大小和位置
   * @param ci
   * @param number
   */
  insertColBefore(ci, number) {
    const { snapshot } = this;
    const mergeAction = {
      undo: () => {
        this.colBeforeShrink(ci, number);
      },
      redo: () => {
        this.colBeforeExpand(ci, number);
      },
    };
    snapshot.addAction(mergeAction);
    mergeAction.redo();
  }

  /**
   * 插入新行时调整区域大小和位置
   * @param ri
   * @param number
   */
  insertRowAfter(ri, number) {
    const { snapshot } = this;
    const mergeAction = {
      undo: () => {
        this.rowAfterShrink(ri, number);
      },
      redo: () => {
        this.rowAfterExpand(ri, number);
      },
    };
    snapshot.addAction(mergeAction);
    mergeAction.redo();
  }

  /**
   * 插入新行时调整区域大小和位置
   * @param ri
   * @param number
   */
  insertRowBefore(ri, number) {
    const { snapshot } = this;
    const mergeAction = {
      undo: () => {
        this.rowBeforeShrink(ri, number);
      },
      redo: () => {
        this.rowBeforeExpand(ri, number);
      },
    };
    snapshot.addAction(mergeAction);
    mergeAction.redo();
  }

}

export {
  Merges,
};
