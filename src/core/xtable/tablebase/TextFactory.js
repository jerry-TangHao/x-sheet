import { ScaleAdapter } from './Scale';
import { DrawTextBuilder } from '../../../draw/font/text/build/DrawTextBuilder';
import { BaseFont } from '../../../draw/font/BaseFont';
import { Cell } from '../tablecell/Cell';
import { RichDrawTextBuilder } from '../../../draw/font/rich/build/RichDrawTextBuilder';

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

  setCol(col) {
    this.col = col;
  }

  setRow(row) {
    this.row = row;
  }

  build() {
    let { rect, overflow, row, col } = this;
    let { cell, draw, scaleAdapter, table } = this;
    let { fontAttr, ruler, contentType } = cell;
    let size = scaleAdapter.goto(fontAttr.size);
    let padding = scaleAdapter.goto(fontAttr.padding);
    let builder = null;
    switch (contentType) {
      case Cell.TYPE.STRING:
      case Cell.TYPE.NUMBER:
      case Cell.TYPE.DATE_TIME: {
        let formatText = cell.getFormatText();
        builder = new DrawTextBuilder({
          text: `${formatText}`, attr: fontAttr, draw, rect, overflow,
        });
        break;
      }
      case Cell.TYPE.RICH_TEXT: {
        let computeText = cell.getComputeText();
        let result = computeText.plain((font) => {
          font.size = scaleAdapter.goto(font.size);
          return font;
        });
        builder = new RichDrawTextBuilder({
          rich: result, draw, overflow, rect, attr: fontAttr,
        });
        break;
      }
    }
    if (builder != null) {
      builder.setPadding(padding);
      builder.setSize(size);
      if (table.isAngleBarCell(row, col)) {
        builder.setDirection(BaseFont.TEXT_DIRECTION.ANGLE_BAR);
      }
      const buildFont = builder.buildFont();
      const buildRuler = builder.buildRuler();
      const equals = buildRuler.equals(ruler);
      const diffRuler = equals ? ruler : buildRuler;
      cell.setRuler(diffRuler);
      buildFont.setRuler(diffRuler);
      return buildFont;
    }
    return null;
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

  setOverFlow(overflow) {
    this.overflow = overflow;
  }

}

class TextFactory {

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

export { TextFactory };
