import { LineIteratorFilter } from '../../LineIteratorFilter';

class OAngleBarRequire {

  constructor(table) {
    this.table = table;
  }

  run({
    row, col,
  }) {
    const { table } = this;
    const main = table.isAngleBarCell(row, col);
    // 四个方位
    const top = table.isAngleBarCell(row - 1, col);
    const left = table.isAngleBarCell(row, col - 1);
    const right = table.isAngleBarCell(row, col + 1);
    const bottom = table.isAngleBarCell(row + 1, col);
    const around = top || left || right || bottom;
    // 四个方位角
    const topLeft = table.isAngleBarCell(row - 1, col - 1);
    const topRight = table.isAngleBarCell(row - 1, col + 1);
    const bottomLeft = table.isAngleBarCell(row + 1, col - 1);
    const bottomRight = table.isAngleBarCell(row + 1, col + 1);
    const included = topLeft || topRight || bottomLeft || bottomRight;
    // 周围是否存在旋转单元格
    return main || around || included
      ? LineIteratorFilter.RETURN_TYPE.EXEC
      : LineIteratorFilter.RETURN_TYPE.JUMP;
  }

}

export {
  OAngleBarRequire,
};
