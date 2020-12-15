import { ScaleAdapter } from './Scale';
import { XDraw } from '../../../canvas/XDraw';
import { XFontBuilder } from '../../../canvas/font/XFontBuilder';
import { BaseFont } from '../../../canvas/font/BaseFont';
import XTableFormat from '../XTableFormat';

class TextBuilder {

  constructor({
    scaleAdapter, table,
  }) {
    this.scaleAdapter = scaleAdapter;
    this.rect = null;
    this.dw = null;
    this.cell = null;
    this.row = -1;
    this.col = -1;
    this.table = table;
    this.overflow = null;
  }

  setRect(rect) {
    this.rect = rect;
  }

  setDraw(dw) {
    this.dw = dw;
  }

  setCell(cell) {
    this.cell = cell;
  }

  setCol(col) {
    this.col = col;
  }

  setRow(row) {
    this.row = row;
  }

  setOverFlow(overflow) {
    this.overflow = overflow;
  }

  build() {
    const { rect, overflow, row, col, cell, dw, scaleAdapter, table } = this;
    const { format, text, fontAttr } = cell;
    const size = XDraw.srcTransformStylePx(scaleAdapter.goto(fontAttr.size));
    const padding = XDraw.srcTransformStylePx(scaleAdapter.goto(fontAttr.padding));
    const builder = new XFontBuilder({
      text: XTableFormat(format, text), dw, overflow, rect, attr: fontAttr,
    });
    builder.setSize(size);
    builder.setPadding(padding);
    if (table.isAngleBarCell(row, col)) {
      builder.setDirection(BaseFont.TEXT_DIRECTION.ANGLE_BAR);
    }
    return builder.build();
  }

}

class Text {

  constructor({
    scaleAdapter = new ScaleAdapter(),
    table,
  }) {
    this.scaleAdapter = scaleAdapter;
    this.table = table;
  }

  getBuilder() {
    const { scaleAdapter, table } = this;
    return new TextBuilder({
      scaleAdapter, table,
    });
  }

}

export {
  Text,
};
