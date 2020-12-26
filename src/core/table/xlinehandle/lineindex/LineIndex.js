import { XLineIteratorItem } from '../XLineIteratorItem';
import { XLineIteratorFilter } from '../XLineIteratorFilter';

class LineIndex {

  constructor({
    getWidth, getHeight, bx = 0, by = 0,
  }) {
    this.getHeight = getHeight;
    this.getWidth = getWidth;
    this.bx = bx;
    this.by = by;
    this.bLine = [];
    this.rLine = [];
  }

  getBItem() {
    const { bx, by, getWidth, getHeight } = this;
    const bRow = {};
    const bLine = [];
    return new XLineIteratorItem({
      newRow: ({ row, y }) => {
        const height = getHeight(row);
        bRow.sx = bx;
        bRow.sy = by + y + height;
        bRow.ex = bRow.sx;
        bRow.ey = bRow.sy;
        bRow.breakpoint = false;
      },
      endRow: () => {
        if (bRow.breakpoint) {
          const { sx, sy, ex, ey } = bRow;
          bLine.push({ sx, sy, ex, ey });
        }
      },
      filter: new XLineIteratorFilter({
        logic: XLineIteratorFilter.FILTER_LOGIC.AND,
        stack: [],
      }),
      exec: ({ col }) => {
        const width = getWidth(col);
        bRow.breakpoint = true;
        bRow.ex += width;
      },
      jump: ({ col }) => {
        if (bRow.breakpoint) {
          const { sx, sy, ex, ey } = bRow;
          bRow.breakpoint = false;
          bLine.push({ sx, sy, ex, ey });
        }
        const width = getWidth(col);
        bRow.sx = bRow.ex + width;
        bRow.ex = bRow.sx;
      },
      complete: () => {
        this.bLine = bLine;
      },
    });
  }

  getRItem() {
    const { bx, by, getWidth, getHeight } = this;
    const rCols = [];
    const rLine = [];
    return new XLineIteratorItem({
      newCol: ({ col, x }) => {
        const width = getWidth(col);
        const sx = bx + x + width;
        const sy = by;
        const ex = sx;
        const ey = sy;
        const breakpoint = false;
        rCols[col] = { sx, sy, ex, ey, breakpoint };
      },
      endCol: ({ col }) => {
        const item = rCols[col];
        if (item.breakpoint) {
          const { sx, sy, ex, ey } = item;
          rLine.push({ sx, sy, ex, ey });
        }
      },
      filter: new XLineIteratorFilter({
        logic: XLineIteratorFilter.FILTER_LOGIC.AND,
        stack: [],
      }),
      exec: ({ row, col }) => {
        const item = rCols[col];
        const height = getHeight(row);
        item.breakpoint = true;
        item.ey += height;
      },
      jump: ({ row, col }) => {
        const item = rCols[col];
        const height = getHeight(row);
        if (item.breakpoint) {
          const { sx, sy, ex, ey } = item;
          item.breakpoint = false;
          rLine.push({ sx, sy, ex, ey });
        }
        item.sy = item.ey + height;
        item.ey = item.sy;
      },
      complete: () => {
        this.rLine = rLine;
      },
    });
  }

  getItems() {
    return [
      this.getBItem(),
      this.getRItem(),
    ];
  }

  getResult() {
    const { bLine, rLine } = this;
    return {
      bLine, rLine,
    };
  }

}

export {
  LineIndex,
};
