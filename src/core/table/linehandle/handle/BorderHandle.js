import { LineOptimizeJoin } from '../LineOptimizeJoin';
import { LineIteratorItem } from '../LineIteratorItem';
import { LineIteratorFilter } from '../LineIteratorFilter';
import { BBorderRequire } from '../filter/borderrequire/BBorderRequire';
import { BMergeNullEdge } from '../filter/mergenulledge/BMergeNullEdge';
import { TBorderRequire } from '../filter/borderrequire/TBorderRequire';
import { BBorderPriority } from '../filter/borderpriority/BBorderPriority';
import { TBorderPriority } from '../filter/borderpriority/TBorderPriority';
import { TMergeNullEdge } from '../filter/mergenulledge/TMergeNullEdge';
import { RBorderRequire } from '../filter/borderrequire/RBorderRequire';
import { RContentOutRange } from '../filter/contentoutrange/RContentOutRange';
import { RBorderPriority } from '../filter/borderpriority/RBorderPriority';
import { RMergeNullEdge } from '../filter/mergenulledge/RMergeNullEdge';
import { LBorderRequire } from '../filter/borderrequire/LBorderRequire';
import { LBorderPriority } from '../filter/borderpriority/LBorderPriority';
import { LMergeNullEdge } from '../filter/mergenulledge/LMergeNullEdge';
import { LContentOutRange } from '../filter/contentoutrange/LContentOutRange';
import { RAngleBarIgnore } from '../filter/anglebarignore/RAngleBarIgnore';
import { LAngleBarIgnore } from '../filter/anglebarignore/LAngleBarIgnore';
import { TAngleBarIgnore } from '../filter/anglebarignore/TAngleBarIgnore';
import { BAngleBarIgnore } from '../filter/anglebarignore/BAngleBarIgnore';

class BorderHandle {

  constructor({
    table, bx = 0, by = 0, optimize = true,
  }) {
    this.optimize = optimize;
    this.bx = bx;
    this.by = by;
    this.table = table;
    this.lLine = [];
    this.tLine = [];
    this.rLine = [];
    this.bLine = [];
  }

  getRItem() {
    const { table, bx, by, optimize } = this;
    const { cols, rows, cells, xIteratorBuilder } = table;
    const rCols = [];
    const optimizeJoin = new LineOptimizeJoin(xIteratorBuilder);
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
          new RBorderRequire(table),
          new RBorderPriority(table),
          new RMergeNullEdge(table),
          new RAngleBarIgnore(table),
          new RContentOutRange(table),
        ],
      }),
      exec: ({ row, col }) => {
        const height = rows.getHeight(row);
        const cell = cells.getCell(row, col);
        const item = rCols[col];
        const { borderAttr } = cell;
        item.ey += height;
        const { sx, sy, ex, ey, rLine } = item;
        rLine.push({
          sx, sy, ex, ey, row, col, borderAttr,
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
            if (optimize) {
              rLine = rLine.concat(optimizeJoin.vrJoin(item.rLine));
            } else {
              rLine = rLine.concat(item.rLine);
            }
          }
        }
        this.rLine = rLine;
      },
    });
  }

  getLItem() {
    const { table, bx, by, optimize } = this;
    const { rows, cells, xIteratorBuilder } = table;
    const lCols = [];
    const optimizeJoin = new LineOptimizeJoin(xIteratorBuilder);
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
          new LBorderRequire(table),
          new LBorderPriority(table),
          new LMergeNullEdge(table),
          new LAngleBarIgnore(table),
          new LContentOutRange(table),
        ],
      }),
      exec: ({ row, col }) => {
        const item = lCols[col];
        const cell = cells.getCell(row, col);
        const height = rows.getHeight(row);
        const { borderAttr } = cell;
        item.ey += height;
        const { sx, sy, ex, ey, lLine } = item;
        lLine.push({
          sx, sy, ex, ey, row, col, borderAttr,
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
            if (optimize) {
              lLine = lLine.concat(optimizeJoin.vlJoin(item.lLine));
            } else {
              lLine = lLine.concat(item.lLine);
            }
          }
        }
        this.lLine = lLine;
      },
    });
  }

  getTItem() {
    const { table, bx, by, optimize } = this;
    const { cols, cells } = table;
    const tLine = [];
    const tRow = {};
    const optimizeJoin = new LineOptimizeJoin();
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
          new TBorderRequire(table),
          new TBorderPriority(table),
          new TAngleBarIgnore(table),
          new TMergeNullEdge(table),
        ],
      }),
      exec: ({ row, col }) => {
        const width = cols.getWidth(col);
        const cell = cells.getCell(row, col);
        const { borderAttr } = cell;
        tRow.ex += width;
        const { sx, sy, ex, ey } = tRow;
        tLine.push({
          sx, sy, ex, ey, row, col, borderAttr,
        });
        tRow.sx = tRow.ex;
      },
      jump: ({ col }) => {
        const width = cols.getWidth(col);
        tRow.sx = tRow.ex + width;
        tRow.ex = tRow.sx;
      },
      complete: () => {
        this.tLine = optimize
          ? optimizeJoin.htJoin(tLine)
          : tLine;
      },
    });
  }

  getBItem() {
    const { table, bx, by, optimize } = this;
    const { cols, rows, cells } = table;
    const bLine = [];
    const bRow = {};
    const optimizeJoin = new LineOptimizeJoin();
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
          new BBorderRequire(table),
          new BBorderPriority(table),
          new BAngleBarIgnore(table),
          new BMergeNullEdge(table),
        ],
      }),
      exec: ({ row, col }) => {
        const width = cols.getWidth(col);
        const cell = cells.getCell(row, col);
        const { borderAttr } = cell;
        bRow.ex += width;
        const { sx, sy, ex, ey } = bRow;
        bLine.push({
          sx, sy, ex, ey, row, col, tilting: false, borderAttr,
        });
        bRow.sx = bRow.ex;
      },
      jump: ({ col }) => {
        const width = cols.getWidth(col);
        bRow.sx = bRow.ex + width;
        bRow.ex = bRow.sx;
      },
      complete: () => {
        this.bLine = optimize
          ? optimizeJoin.hbJoin(bLine)
          : bLine;
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
  BorderHandle,
};
