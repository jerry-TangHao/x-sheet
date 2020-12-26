import { ScaleAdapter } from './Scale';
import { XDraw } from '../../../canvas/XDraw';
import { BaseFont } from '../../../canvas/font/BaseFont';
import XTableFormat from '../XTableFormat';
import { DrawFontBuilder } from '../../../canvas/font/build/DrawFontBuilder';

class TextBuilder {

  constructor({
    scaleAdapter, table,
  }) {
    this.scaleAdapter = scaleAdapter;
    this.rect = null;
    this.draw = null;
    this.cell = null;
    this.row = -1;
    this.col = -1;
    this.table = table;
    this.overflow = null;
  }

  setRect(rect) {
    this.rect = rect;
  }

  setDraw(draw) {
    this.draw = draw;
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
    const { rect, overflow, row, col, cell, draw, scaleAdapter, table } = this;
    const { format, text, fontAttr, ruler } = cell;
    const size = XDraw.srcTransformStylePx(scaleAdapter.goto(fontAttr.size));
    const padding = XDraw.srcTransformStylePx(scaleAdapter.goto(fontAttr.padding));
    const builder = new DrawFontBuilder({
      text: XTableFormat(format, text), draw, overflow, rect, attr: fontAttr,
    });
    builder.setSize(size);
    builder.setPadding(padding);
    if (table.isAngleBarCell(row, col)) {
      builder.setDirection(BaseFont.TEXT_DIRECTION.ANGLE_BAR);
    }
    const buildRuler = builder.buildRuler();
    const buildFont = builder.buildFont();
    buildFont.setRuler(buildRuler.equals(ruler) ? ruler : buildRuler);
    cell.setRuler(buildFont.ruler);
    return buildFont;
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

export { Text };
