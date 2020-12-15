import { RowsIterator } from '../iterator/RowsIterator';

class XLineOptimizeJoin {

  static htJoin(line) {
    for (let i = 1; i < line.length;) {
      const item = line[i];
      const last = line[i - 1];
      const ck1 = item.borderAttr.top.equal(last.borderAttr.top);
      const ck2 = item.col - last.col === 1;
      const ck3 = item.row === last.row;
      if (ck1 && ck2 && ck3) {
        last.ex = item.ex;
        last.col = item.col;
        line.splice(i, 1);
      } else {
        i += 1;
      }
    }
    return line;
  }

  static hbJoin(line) {
    for (let i = 1; i < line.length;) {
      const item = line[i];
      const last = line[i - 1];
      const ck1 = item.borderAttr.bottom.equal(last.borderAttr.bottom);
      const ck2 = item.col - last.col === 1;
      const ck3 = item.row === last.row;
      if (ck1 && ck2 && ck3) {
        last.ex = item.ex;
        last.col = item.col;
        line.splice(i, 1);
      } else {
        i += 1;
      }
    }
    return line;
  }

  static vlJoin(line) {
    for (let i = 1; i < line.length;) {
      const item = line[i];
      const last = line[i - 1];
      const nextRow = RowsIterator.getInstance()
        .setBegin(last.row)
        .setEnd(item.row)
        .nextRow();
      const ck1 = item.borderAttr.left.equal(last.borderAttr.left);
      const ck2 = item.row === nextRow;
      const ck3 = item.col === last.col;
      if (ck1 && ck2 && ck3) {
        last.ey = item.ey;
        last.row = item.row;
        line.splice(i, 1);
      } else {
        i += 1;
      }
    }
    return line;
  }

  static vrJoin(line) {
    for (let i = 1; i < line.length;) {
      const item = line[i];
      const last = line[i - 1];
      const nextRow = RowsIterator.getInstance()
        .setBegin(last.row)
        .setEnd(item.row)
        .nextRow();
      const ck1 = item.borderAttr.right.equal(last.borderAttr.right);
      const ck2 = item.row === nextRow;
      const ck3 = item.col === last.col;
      if (ck1 && ck2 && ck3) {
        last.ey = item.ey;
        last.row = item.row;
        line.splice(i, 1);
      } else {
        i += 1;
      }
    }
    return line;
  }

}

export {
  XLineOptimizeJoin,
};
