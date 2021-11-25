import { LineIteratorItem } from '../LineIteratorItem';
import { LineIteratorFilter } from '../LineIteratorFilter';
import { AngleBarExist } from '../filter/anglebarexist/AngleBarExist';
import { BMergeNullEdge } from '../filter/mergenulledge/BMergeNullEdge';
import { BBorderPriority } from '../filter/borderpriority/BBorderPriority';
import { TBorderPriority } from '../filter/borderpriority/TBorderPriority';
import { TMergeNullEdge } from '../filter/mergenulledge/TMergeNullEdge';
import { RBorderPriority } from '../filter/borderpriority/RBorderPriority';
import { RMergeNullEdge } from '../filter/mergenulledge/RMergeNullEdge';
import { LBorderPriority } from '../filter/borderpriority/LBorderPriority';
import { LMergeNullEdge } from '../filter/mergenulledge/LMergeNullEdge';
import { BBorderRequire } from '../filter/borderrequire/BBorderRequire';
import { TBorderRequire } from '../filter/borderrequire/TBorderRequire';
import { RAngleBarRequire } from '../filter/anglebarrequire/RAngleBarRequire';
import { RBorderRequire } from '../filter/borderrequire/RBorderRequire';
import { LAngleBarRequire } from '../filter/anglebarrequire/LAngleBarRequire';
import { LBorderRequire } from '../filter/borderrequire/LBorderRequire';
import { OAngleBarRequire } from '../filter/anglebarrequire/OAngleBarRequire';
import { Rect } from '../../../../draw/Rect';
import { Sdist } from '../../../../draw/Sdist';

class AngleHandle {

  constructor({
    table, bx = 0, by = 0,
  }) {
    this.table = table;
    this.bx = bx;
    this.by = by;
    this.lLine = [];
    this.tLine = [];
    this.rLine = [];
    this.bLine = [];
  }

  static bOffset({
    table, sx, ex, row, col,
  }) {
    const { cells, cols, rows } = table;
    let osx = sx;
    let oex = ex;
    let left = cells.getCell(row + 1, col - 1);
    let bottom = cells.getCell(row + 1, col);
    let right = cells.getCell(row + 1, col + 1);
    if (left) {
      const { fontAttr } = left;
      const sdist = new Sdist({
        rect: new Rect({
          width: cols.getWidth(col - 1),
          height: rows.getHeight(row + 1),
        }),
        angle: fontAttr.angle,
      });
      const lSdist = sdist.getLeft();
      const rSdist = sdist.getRight();
      if (lSdist) {
        osx = sx + lSdist;
      } else if (rSdist) {
        osx = sx - rSdist;
      }
    }
    if (bottom) {
      const { fontAttr } = bottom;
      const sdist = new Sdist({
        rect: new Rect({
          width: cols.getWidth(col),
          height: rows.getHeight(row + 1),
        }),
        angle: fontAttr.angle,
      });
      const lSdist = sdist.getLeft();
      const rSdist = sdist.getRight();
      if (lSdist) {
        osx = sx + lSdist;
        oex = ex + lSdist;
      } else if (rSdist) {
        osx = sx - rSdist;
        oex = ex - rSdist;
      }
    }
    if (right) {
      const { fontAttr } = right;
      const sdist = new Sdist({
        rect: new Rect({
          width: cols.getWidth(col + 1),
          height: rows.getHeight(row + 1),
        }),
        angle: fontAttr.angle,
      });
      const lSdist = sdist.getLeft();
      const rSdist = sdist.getRight();
      if (lSdist) {
        oex = ex + lSdist;
      } else if (rSdist) {
        oex = ex - rSdist;
      }
    }
    return { osx, oex };
  }

  static tOffset({
    table, sx, ex, row, col,
  }) {
    const { cells, cols, rows } = table;
    let osx = sx;
    let oex = ex;
    let last = cells.getCell(row, col - 1);
    let main = cells.getCell(row, col);
    let next = cells.getCell(row, col + 1);
    if (last) {
      const { fontAttr } = last;
      const sdist = new Sdist({
        rect: new Rect({
          width: cols.getWidth(col - 1),
          height: rows.getHeight(row),
        }),
        angle: fontAttr.angle,
      });
      const lSdist = sdist.getLeft();
      const rSdist = sdist.getRight();
      if (lSdist) {
        osx = sx + lSdist;
      } else if (rSdist) {
        osx = sx - rSdist;
      }
    }
    if (main) {
      const { fontAttr } = main;
      const sdist = new Sdist({
        rect: new Rect({
          width: cols.getWidth(col),
          height: rows.getHeight(row),
        }),
        angle: fontAttr.angle,
      });
      const lSdist = sdist.getLeft();
      const rSdist = sdist.getRight();
      if (lSdist) {
        osx = sx + lSdist;
        oex = ex + lSdist;
      } else if (rSdist) {
        osx = sx - rSdist;
        oex = ex - rSdist;
      }
    }
    if (next) {
      const { fontAttr } = next;
      const sdist = new Sdist({
        rect: new Rect({
          width: cols.getWidth(col + 1),
          height: rows.getHeight(row),
        }),
        angle: fontAttr.angle,
      });
      const lSdist = sdist.getLeft();
      const rSdist = sdist.getRight();
      if (lSdist) {
        oex = ex + lSdist;
      } else if (rSdist) {
        oex = ex - rSdist;
      }
    }
    return { osx, oex };
  }

  static lOffset({
    table, sx, row, col,
  }) {
    const { cells, cols, rows } = table;
    let osx = sx;
    let last = cells.getCell(row, col - 1);
    let main = cells.getCell(row, col);
    if (last) {
      const { fontAttr } = last;
      const sdist = new Sdist({
        rect: new Rect({
          width: cols.getWidth(col - 1),
          height: rows.getHeight(row),
        }),
        angle: fontAttr.angle,
      });
      const lSdist = sdist.getLeft();
      const rSdist = sdist.getRight();
      if (lSdist) {
        osx = sx + lSdist;
      } else if (rSdist) {
        osx = sx - rSdist;
      }
    }
    if (main) {
      const { fontAttr } = main;
      const sdist = new Sdist({
        rect: new Rect({
          width: cols.getWidth(col),
          height: rows.getHeight(row),
        }),
        angle: fontAttr.angle,
      });
      const lSdist = sdist.getLeft();
      const rSdist = sdist.getRight();
      if (lSdist) {
        osx = sx + lSdist;
      } else if (rSdist) {
        osx = sx - rSdist;
      }
    }
    return { osx };
  }

  static rOffset({
    table, sx, row, col,
  }) {
    const { cells, cols, rows } = table;
    let osx = sx;
    let main = cells.getCell(row, col);
    let next = cells.getCell(row, col + 1);
    if (main) {
      const { fontAttr } = main;
      const sdist = new Sdist({
        rect: new Rect({
          width: cols.getWidth(col),
          height: rows.getHeight(row),
        }),
        angle: fontAttr.angle,
      });
      const lSdist = sdist.getLeft();
      const rSdist = sdist.getRight();
      if (lSdist) {
        osx = sx + lSdist;
      } else if (rSdist) {
        osx = sx - rSdist;
      }
    }
    if (next) {
      const { fontAttr } = next;
      const sdist = new Sdist({
        rect: new Rect({
          width: cols.getWidth(col + 1),
          height: rows.getHeight(row),
        }),
        angle: fontAttr.angle,
      });
      const lSdist = sdist.getLeft();
      const rSdist = sdist.getRight();
      if (lSdist) {
        osx = sx + lSdist;
      } else if (rSdist) {
        osx = sx - rSdist;
      }
    }
    return { osx };
  }

  getRItem() {
    const { bx, by, table } = this;
    const { cols, rows, cells } = table;
    const rCols = [];
    return new LineIteratorItem({
      newCol: ({ col, x }) => {
        const width = cols.getWidth(col);
        const sx = bx + x + width;
        const sy = by;
        const ex = sx;
        const ey = sy;
        const rLine = [];
        rCols[col] = { sx, sy, ex, ey, rLine };
      },
      filter: new LineIteratorFilter({
        logic: LineIteratorFilter.FILTER_LOGIC.AND,
        stack: [
          new AngleBarExist(table),
          new RAngleBarRequire(table),
          new RBorderRequire(table),
          new RBorderPriority(table),
          new RMergeNullEdge(table),
        ],
      }),
      exec: ({ row, col }) => {
        const height = rows.getHeight(row);
        const cell = cells.getCell(row, col);
        const item = rCols[col];
        const { borderAttr } = cell;
        item.ey += height;
        const { sx, sy, ex, ey, rLine } = item;
        const { osx } = AngleHandle.rOffset({
          table, sx, ex, row, col,
        });
        rLine.push({
          sx: osx, sy, ex, ey, row, col, borderAttr,
        });
        item.sy = item.ey;
      },
      jump: ({ row, col }) => {
        const height = rows.getHeight(row);
        const item = rCols[col];
        item.sy = item.ey + height;
        item.ey = item.sy;
      },
      complete: () => {
        let rLine = [];
        for (let idx = 0; idx < rCols.length; idx++) {
          const item = rCols[idx];
          if (item) {
            rLine = rLine.concat(item.rLine);
          }
        }
        this.rLine = rLine;
      },
    });
  }

  getLItem() {
    const { bx, by, table } = this;
    const { rows, cells } = table;
    const lCols = [];
    return new LineIteratorItem({
      newCol: ({ col, x }) => {
        const sx = bx + x;
        const sy = by;
        const ex = sx;
        const ey = sy;
        const lLine = [];
        lCols[col] = { sx, sy, ex, ey, lLine };
      },
      filter: new LineIteratorFilter({
        logic: LineIteratorFilter.FILTER_LOGIC.AND,
        stack: [
          new AngleBarExist(table),
          new LAngleBarRequire(table),
          new LBorderRequire(table),
          new LBorderPriority(table),
          new LMergeNullEdge(table),
        ],
      }),
      exec: ({ row, col }) => {
        const item = lCols[col];
        const cell = cells.getCell(row, col);
        const height = rows.getHeight(row);
        const { borderAttr } = cell;
        item.ey += height;
        const { sx, sy, ex, ey, lLine } = item;
        const { osx } = AngleHandle.lOffset({
          table, sx, ex, row, col,
        });
        lLine.push({
          sx: osx, sy, ex, ey, row, col, borderAttr,
        });
        item.sy = item.ey;
      },
      jump: ({ row, col }) => {
        const height = rows.getHeight(row);
        const item = lCols[col];
        item.sy = item.ey + height;
        item.ey = item.sy;
      },
      complete: () => {
        let lLine = [];
        for (let idx = 0; idx < lCols.length; idx++) {
          const item = lCols[idx];
          if (item) {
            lLine = lLine.concat(item.lLine);
          }
        }
        this.lLine = lLine;
      },
    });
  }

  getBItem() {
    const { bx, by, table } = this;
    const { cols, rows, cells } = table;
    const bLine = [];
    const bRow = {};
    return new LineIteratorItem({
      newRow: ({ row, y }) => {
        const height = rows.getHeight(row);
        bRow.sx = bx;
        bRow.sy = by + y + height;
        bRow.ex = bRow.sx;
        bRow.ey = bRow.sy;
      },
      filter: new LineIteratorFilter({
        logic: LineIteratorFilter.FILTER_LOGIC.AND,
        stack: [
          new AngleBarExist(table),
          new OAngleBarRequire(table),
          new BBorderRequire(table),
          new BBorderPriority(table),
          new BMergeNullEdge(table),
        ],
      }),
      exec: ({ row, col }) => {
        const width = cols.getWidth(col);
        const cell = cells.getCell(row, col);
        const { borderAttr } = cell;
        bRow.ex += width;
        const { sx, sy, ex, ey } = bRow;
        const { osx, oex } = AngleHandle.bOffset({
          table, sx, ex, row, col,
        });
        bLine.push({
          sx: osx, sy, ex: oex, ey, row, col, borderAttr,
        });
        bRow.sx = bRow.ex;
      },
      jump: ({ col }) => {
        const width = cols.getWidth(col);
        bRow.sx = bRow.ex + width;
        bRow.ex = bRow.sx;
      },
      complete: () => {
        this.bLine = bLine;
      },
    });
  }

  getTItem() {
    const { table, bx, by } = this;
    const { cols, cells } = table;
    const tLine = [];
    const tRow = {};
    return new LineIteratorItem({
      newRow: ({ y }) => {
        tRow.sx = bx;
        tRow.sy = by + y;
        tRow.ex = tRow.sx;
        tRow.ey = tRow.sy;
      },
      filter: new LineIteratorFilter({
        logic: LineIteratorFilter.FILTER_LOGIC.AND,
        stack: [
          new AngleBarExist(table),
          new OAngleBarRequire(table),
          new TBorderRequire(table),
          new TBorderPriority(table),
          new TMergeNullEdge(table),
        ],
      }),
      exec: ({ row, col }) => {
        const width = cols.getWidth(col);
        const cell = cells.getCell(row, col);
        const { borderAttr } = cell;
        tRow.ex += width;
        const { sx, sy, ex, ey } = tRow;
        const { osx, oex } = AngleHandle.tOffset({
          table, sx, ex, row, col,
        });
        tLine.push({
          sx: osx, sy, ex: oex, ey, row, col, borderAttr,
        });
        tRow.sx = tRow.ex;
      },
      jump: ({ col }) => {
        const width = cols.getWidth(col);
        tRow.sx = tRow.ex + width;
        tRow.ex = tRow.sx;
      },
      complete: () => {
        this.tLine = tLine;
      },
    });
  }

  getItems() {
    return [
      this.getTItem(),
      this.getBItem(),
      this.getLItem(),
      this.getRItem(),
    ];
  }

  getResult() {
    const { rLine, bLine, lLine, tLine } = this;
    return {
      rLine, bLine, lLine, tLine,
    };
  }

}

export {
  AngleHandle,
};
