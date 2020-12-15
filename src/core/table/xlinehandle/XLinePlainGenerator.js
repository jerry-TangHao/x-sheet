import { XLineIteratorLoop } from './XLineIteratorLoop';
import { LineGrid } from './linegrids/LineGrid';
import { LineBorder } from './lineborder/LineBorder';
import { AngleBar } from './anglebar/AngleBar';
import { LineIndex } from './lineindex/LineIndex';
import { AngleBarLOut } from './anglebarout/AngleBarLOut';
import { AngleBarROut } from './anglebarout/AngleBarROut';

class XLinePlainGenerator {

  static run({
    optimize = true,
    scrollView,
    foldOnOff,
    table,
    by = 0,
    bx = 0,
    getHeight = ri => table.rows.getHeight(ri),
    getWidth = ci => table.cols.getWidth(ci),
    model = XLinePlainGenerator.MODEL.ALL,
  }) {
    switch (model) {
      case XLinePlainGenerator.MODEL.BORDER: {
        const bLine = new LineBorder({
          table, bx, by, optimize,
        });
        const aLine = new AngleBar({
          table, bx, by,
        });
        const xIterator = new XLineIteratorLoop({
          items: bLine.getItems().concat(aLine.getItems()),
          view: scrollView,
          table,
          foldOnOff,
        });
        xIterator.run();
        const bResult = bLine.getResult();
        const aResult = aLine.getResult();
        return {
          bResult, aResult,
        };
      }
      case XLinePlainGenerator.MODEL.ALL: {
        const bLine = new LineBorder({
          table, bx, by, optimize,
        });
        const gLine = new LineGrid({
          table, bx, by, getWidth, getHeight,
        });
        const aLine = new AngleBar({
          table, bx, by,
        });
        const xIterator = new XLineIteratorLoop({
          items: bLine.getItems().concat(gLine.getItems()).concat(aLine.getItems()),
          foldOnOff,
          table,
          view: scrollView,
        });
        xIterator.run();
        const gResult = gLine.getResult();
        const bResult = bLine.getResult();
        const aResult = aLine.getResult();
        return {
          gResult, bResult, aResult,
        };
      }
      case XLinePlainGenerator.MODEL.INDEX: {
        const iLine = new LineIndex({
          bx, by, getWidth, getHeight,
        });
        const xIterator = new XLineIteratorLoop({
          items: iLine.getItems(),
          foldOnOff,
          table,
          view: scrollView,
        });
        xIterator.run();
        const iResult = iLine.getResult();
        return {
          iResult,
        };
      }
      case XLinePlainGenerator.MODEL.GRID: {
        const gLine = new LineGrid({
          table, bx, by, getWidth, getHeight,
        });
        const xIterator = new XLineIteratorLoop({
          items: gLine.getItems(),
          foldOnOff,
          table,
          view: scrollView,
        });
        xIterator.run();
        const gResult = gLine.getResult();
        return {
          gResult,
        };
      }
      case XLinePlainGenerator.MODEL.OUT_ANGLE_BAR_L: {
        const alLine = new AngleBarLOut({
          table, bx, by,
        });
        const xIterator = new XLineIteratorLoop({
          items: alLine.getItems(),
          foldOnOff,
          table,
          view: scrollView,
        });
        xIterator.run();
        const alResult = alLine.getResult();
        return {
          alResult,
        };
      }
      case XLinePlainGenerator.MODEL.OUT_ANGLE_BAR_R: {
        const arLine = new AngleBarROut({
          table, bx, by,
        });
        const xIterator = new XLineIteratorLoop({
          items: arLine.getItems(),
          foldOnOff,
          table,
          view: scrollView,
        });
        xIterator.run();
        const arResult = arLine.getResult();
        return {
          arResult,
        };
      }
    }
    return null;
  }

}

XLinePlainGenerator.MODEL = {
  BORDER: 1,
  ALL: 3,
  GRID: 2,
  INDEX: 4,
  OUT_ANGLE_BAR_L: 5,
  OUT_ANGLE_BAR_R: 6,
};

export {
  XLinePlainGenerator,
};
