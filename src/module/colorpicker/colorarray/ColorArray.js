import { Widget } from '../../../lib/Widget';
import { cssPrefix, Constant } from '../../../const/Constant';
import { ColorItem } from './ColorItem';
import { SheetUtils } from '../../../utils/SheetUtils';
import { XEvent } from '../../../lib/XEvent';

class ColorArray extends Widget {

  constructor(options) {
    super(`${cssPrefix}-color-array`);
    this.options = SheetUtils.copy({
      colors: [
        new ColorItem({ color: 'rgb(0, 0, 0)' }),
        new ColorItem({ color: 'rgb(67, 67, 67)' }),
        new ColorItem({ color: 'rgb(102, 102, 102)' }),
        new ColorItem({ color: 'rgb(153, 153, 153)' }),
        new ColorItem({ color: 'rgb(183, 183, 183)' }),
        new ColorItem({ color: 'rgb(204, 204, 204)' }),
        new ColorItem({ color: 'rgb(217, 217, 217)' }),
        new ColorItem({ color: 'rgb(239, 239, 239)' }),
        new ColorItem({ color: 'rgb(255, 255, 255)' }),

        new ColorItem({ color: 'rgb(152, 0, 0)' }),
        new ColorItem({ color: 'rgb(255, 0, 0)' }),
        new ColorItem({ color: 'rgb(255, 153, 0)' }),
        new ColorItem({ color: 'rgb(255, 255, 0)' }),
        new ColorItem({ color: 'rgb(0, 255, 0)' }),
        new ColorItem({ color: 'rgb(0, 255, 255)' }),
        new ColorItem({ color: 'rgb(74, 134, 232)' }),
        new ColorItem({ color: 'rgb(0, 0, 255)' }),
        new ColorItem({ color: 'rgb(153, 0, 255)' }),
        new ColorItem({ color: 'rgb(255, 0, 255)' }),

        new ColorItem({ color: 'rgb(230, 184, 175)' }),
        new ColorItem({ color: 'rgb(244, 204, 204)' }),
        new ColorItem({ color: 'rgb(252, 229, 205)' }),
        new ColorItem({ color: 'rgb(255, 242, 204)' }),
        new ColorItem({ color: 'rgb(217, 234, 211)' }),
        new ColorItem({ color: 'rgb(208, 224, 227)' }),
        new ColorItem({ color: 'rgb(201, 218, 248)' }),
        new ColorItem({ color: 'rgb(207, 226, 243)' }),
        new ColorItem({ color: 'rgb(217, 210, 233)' }),
        new ColorItem({ color: 'rgb(234, 209, 220)' }),

        new ColorItem({ color: 'rgb(221, 126, 107)' }),
        new ColorItem({ color: 'rgb(234, 153, 153)' }),
        new ColorItem({ color: 'rgb(249, 203, 156)' }),
        new ColorItem({ color: 'rgb(255, 229, 153)' }),
        new ColorItem({ color: 'rgb(182, 215, 168)' }),
        new ColorItem({ color: 'rgb(162, 196, 201)' }),
        new ColorItem({ color: 'rgb(164, 194, 244)' }),
        new ColorItem({ color: 'rgb(159, 197, 232)' }),
        new ColorItem({ color: 'rgb(180, 167, 214)' }),
        new ColorItem({ color: 'rgb(213, 166, 189)' }),

        new ColorItem({ color: 'rgb(204, 65, 37)' }),
        new ColorItem({ color: 'rgb(224, 102, 102)' }),
        new ColorItem({ color: 'rgb(246, 178, 107)' }),
        new ColorItem({ color: 'rgb(255, 217, 102)' }),
        new ColorItem({ color: 'rgb(147, 196, 125)' }),
        new ColorItem({ color: 'rgb(118, 165, 175)' }),
        new ColorItem({ color: 'rgb(109, 158, 235)' }),
        new ColorItem({ color: 'rgb(111, 168, 220)' }),
        new ColorItem({ color: 'rgb(142, 124, 195)' }),
        new ColorItem({ color: 'rgb(194, 123, 160)' }),

        new ColorItem({ color: 'rgb(166, 28, 0)' }),
        new ColorItem({ color: 'rgb(204, 0, 0)' }),
        new ColorItem({ color: 'rgb(230, 145, 56)' }),
        new ColorItem({ color: 'rgb(241, 194, 50)' }),
        new ColorItem({ color: 'rgb(106, 168, 79)' }),
        new ColorItem({ color: 'rgb(69, 129, 142)' }),
        new ColorItem({ color: 'rgb(60, 120, 216)' }),
        new ColorItem({ color: 'rgb(61, 133, 198)' }),
        new ColorItem({ color: 'rgb(103, 78, 167)' }),
        new ColorItem({ color: 'rgb(166, 77, 121)' }),

        new ColorItem({ color: 'rgb(133, 32, 12)' }),
        new ColorItem({ color: 'rgb(153, 0, 0)' }),
        new ColorItem({ color: 'rgb(180, 95, 6)' }),
        new ColorItem({ color: 'rgb(191, 144, 0)' }),
        new ColorItem({ color: 'rgb(56, 118, 29)' }),
        new ColorItem({ color: 'rgb(19, 79, 92)' }),
        new ColorItem({ color: 'rgb(17, 85, 204)' }),
        new ColorItem({ color: 'rgb(11, 83, 148)' }),
        new ColorItem({ color: 'rgb(53, 28, 117)' }),
        new ColorItem({ color: 'rgb(116, 27, 71)' }),

        new ColorItem({ color: 'rgb(91, 15, 0)' }),
        new ColorItem({ color: 'rgb(102, 0, 0)' }),
        new ColorItem({ color: 'rgb(120, 63, 4)' }),
        new ColorItem({ color: 'rgb(127, 96, 0)' }),
        new ColorItem({ color: 'rgb(39, 78, 19)' }),
        new ColorItem({ color: 'rgb(12, 52, 61)' }),
        new ColorItem({ color: 'rgb(28, 69, 135)' }),
        new ColorItem({ color: 'rgb(7, 55, 99)' }),
        new ColorItem({ color: 'rgb(32, 18, 77)' }),
        new ColorItem({ color: 'rgb(76, 17, 48)' }),
      ],
      selectCb: () => {},
    }, options);
    this.colors = [];
    this.activeColor = null;
    this.options.colors.forEach((item) => {
      this.add(item);
    });
    if (this.colors.length > 0) {
      this.setActiveByColor(this.colors[0].options.color);
    }
  }

  add(item) {
    const find = this.colors.findIndex(color => color.color === item.color);
    if (find === -1) {
      const { colors } = this;
      colors.push(item);
      this.childrenNodes(item);
      this.bind(item);
    }
  }

  unbind() {
    this.colors.forEach((item) => {
      XEvent.unbind(item);
    });
  }

  bind(item) {
    XEvent.bind(item, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
      this.options.selectCb(item);
      if (item.options.color) {
        this.setActiveByColor(item.options.color);
      }
    });
  }

  findItemByColor(color) {
    color = SheetUtils.blankClear(color);
    return this.colors.find(item => item.color === color);
  }

  setActiveByColor(color) {
    color = SheetUtils.blankClear(color);
    this.colors.forEach((item) => {
      if (item.color === color) {
        item.setActive(true);
        this.activeColor = item.color;
      } else {
        item.setActive(false);
      }
    });
  }

  clear() {
    this.unbind();
    this.colors = [];
    this.empty();
  }

  destroy() {
    super.destroy();
    this.unbind();
  }

}

ColorArray.BLACK = 'rgb(0, 0, 0)';
ColorArray.NULL = null;
ColorArray.WHITE = 'rgb(255, 255, 255)';

export {
  ColorArray,
};
