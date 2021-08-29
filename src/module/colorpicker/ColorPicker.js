/* global document */
import { h } from '../../lib/Element';
import { cssPrefix, Constant } from '../../const/Constant';
import { Widget } from '../../lib/Widget';
import { DragPanel } from '../dragpanel/DragPanel';
import { XEvent } from '../../lib/XEvent';
import { SheetUtils } from '../../utils/SheetUtils';

class ColorPicker extends Widget {

  constructor(options) {
    super(`${cssPrefix}-color-picker`);
    this.options = SheetUtils.copy({
      selectCb: () => {},
    }, options);
    // 拖拽组件
    this.dragPanel = new DragPanel().parentWidget(this);
    this.color = [360, 0, 100];
    // 头部
    this.preViewColorPoint = h('div', `${cssPrefix}-color-picker-pre-view-color-point`);
    this.colorValueTips = h('div', `${cssPrefix}-color-picker-color-value-tips`);
    this.colorValueTips.text('十六进制颜色值');
    this.colorInput = h('input', `${cssPrefix}-color-picker-color-input`);
    this.top = h('div', `${cssPrefix}-color-picker-top`);
    this.top.childrenNodes(this.preViewColorPoint);
    this.top.childrenNodes(this.colorValueTips);
    this.top.childrenNodes(this.colorInput);
    // 中间部分
    this.selectColorPoint = h('div', `${cssPrefix}-color-picker-select-color-point`);
    this.selectColorArea1 = h('div', `${cssPrefix}-color-picker-select-color-area area1`);
    this.selectColorArea2 = h('div', `${cssPrefix}-color-picker-select-color-area area2`);
    this.selectColorArea3 = h('div', `${cssPrefix}-color-picker-select-color-area area3`);
    this.center = h('div', `${cssPrefix}-color-picker-center`);
    this.center.childrenNodes(this.selectColorArea1);
    this.center.childrenNodes(this.selectColorArea2);
    this.center.childrenNodes(this.selectColorArea3);
    this.center.childrenNodes(this.selectColorPoint);
    // 底部
    this.colorHuxTips = h('div', `${cssPrefix}-color-picker-color-hux-tips`);
    this.colorBar = h('div', `${cssPrefix}-color-picker-color-bar`);
    this.colorBarPoint = h('div', `${cssPrefix}-color-picker-bar-point`);
    this.bottom = h('div', `${cssPrefix}-color-picker-bottom`);
    this.colorHuxTips.text('HUE');
    this.colorBar.childrenNodes(this.colorBarPoint);
    this.bottom.childrenNodes(this.colorHuxTips);
    this.bottom.childrenNodes(this.colorBar);
    // 按钮
    this.cancelButton = h('div', `${cssPrefix}-color-picker-button cancel`);
    this.selectButton = h('div', `${cssPrefix}-color-picker-button select`);
    this.buttons = h('div', `${cssPrefix}-color-picker-buttons`);
    this.cancelButton.text('取消');
    this.selectButton.text('确定');
    this.buttons.childrenNodes(this.selectButton);
    this.buttons.childrenNodes(this.cancelButton);
    this.childrenNodes(this.top);
    this.childrenNodes(this.center);
    this.childrenNodes(this.bottom);
    this.childrenNodes(this.buttons);
    this.dragPanel.childrenNodes(this);
    this.dragPanel.css('background', '#ffffff');
    this.bind();
  }

  unbind() {
    const { selectColorPoint } = this;
    const { colorBarPoint } = this;
    const {
      colorInput, cancelButton, selectButton,
    } = this;
    XEvent.unbind(colorInput);
    XEvent.unbind(colorInput);
    XEvent.unbind(colorBarPoint);
    XEvent.unbind(selectColorPoint);
    XEvent.unbind(cancelButton);
    XEvent.unbind(selectButton);
  }

  bind() {
    const { selectColorPoint, center } = this;
    const { colorBarPoint, colorBar } = this;
    const {
      colorInput, cancelButton, selectButton,
    } = this;
    XEvent.bind(colorInput, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e1) => {
      e1.stopPropagation();
    });
    XEvent.bind(colorInput, Constant.SYSTEM_EVENT_TYPE.CHANGE, () => {
      const value = colorInput.val();
      if (value) {
        this.hexColor(value);
      }
    });
    XEvent.bind(colorBarPoint, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e1) => {
      const xy = this.eventXy(e1, colorBar);
      const colorBarBox = colorBar.box();
      if (xy.x < 0) xy.x = 0;
      if (xy.x > colorBarBox.width) xy.x = colorBarBox.width;
      this.downHue(xy.x, colorBarBox.width);
      XEvent.mouseMoveUp(h(document), (e2) => {
        const xy = this.eventXy(e2, colorBar);
        const colorBarBox = colorBar.box();
        if (xy.x < 0) xy.x = 0;
        if (xy.x > colorBarBox.width) xy.x = colorBarBox.width;
        this.moveHue(xy.x, colorBarBox.width);
      });
      e1.stopPropagation();
    });
    XEvent.bind(selectColorPoint, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e1) => {
      const xy = this.eventXy(e1, center);
      const centerBox = center.box();
      if (xy.x < 0) xy.x = 0;
      if (xy.x > centerBox.width) xy.x = centerBox.width;
      if (xy.y < 0) xy.y = 0;
      if (xy.y > centerBox.height) xy.y = centerBox.height;
      this.downSelect(xy.x, xy.y, centerBox.width, centerBox.height);
      XEvent.mouseMoveUp(h(document), (e2) => {
        const xy = this.eventXy(e2, center);
        if (xy.x < 0) xy.x = 0;
        if (xy.x > centerBox.width) xy.x = centerBox.width;
        if (xy.y < 0) xy.y = 0;
        if (xy.y > centerBox.height) xy.y = centerBox.height;
        this.moveSelect(xy.x, xy.y, centerBox.width, centerBox.height);
      });
      e1.stopPropagation();
    });
    XEvent.bind(cancelButton, Constant.SYSTEM_EVENT_TYPE.CLICK, () => {
      this.close();
    });
    XEvent.bind(selectButton, Constant.SYSTEM_EVENT_TYPE.CLICK, () => {
      const { color } = this;
      const hsb = ColorPicker.fixHsx({
        h: parseInt(color[0], 10),
        s: parseInt(color[1], 10),
        x: parseInt(color[2], 10),
      });
      const rgb = ColorPicker.hsbToRgb(hsb);
      this.options.selectCb(`rgb(${rgb.r},${rgb.g},${rgb.b})`);
      this.close();
    });
  }

  open(hex) {
    const { dragPanel } = this;
    dragPanel.open();
    if (hex) {
      if (ColorPicker.isRgb(hex)) {
        const rgb = ColorPicker.parseRgb(hex);
        // eslint-disable-next-line no-param-reassign
        hex = ColorPicker.rgbToHex(rgb);
      }
      this.hexColor(hex);
    } else {
      this.change();
    }
    return this;
  }

  close() {
    const { dragPanel } = this;
    dragPanel.close();
    return this;
  }

  sliderPosition(hsb) {
    // hue 滑块位置
    const { colorBar, colorBarPoint } = this;
    const colorBarPointBox = colorBarPoint.box();
    const colorBarBox = colorBar.box();
    let colorBarPointLeft = parseInt(colorBarBox.width - colorBarBox.width * hsb.h / 360, 10);
    colorBarPointLeft -= colorBarPointBox.width / 2;
    colorBarPoint.offset({
      left: colorBarPointLeft,
    });
    // select color 滑块位置
    const { center, selectColorPoint } = this;
    const selectColorPointBox = selectColorPoint.box();
    const centerBox = center.box();
    let selectColorPointLeft = parseInt(centerBox.width * hsb.s / 100, 10);
    let selectColorPointTop = parseInt(centerBox.height * (100 - hsb.x) / 100, 10);
    selectColorPointLeft -= selectColorPointBox.width / 2;
    selectColorPointTop -= selectColorPointBox.height / 2;
    selectColorPoint.offset({
      left: selectColorPointLeft,
      top: selectColorPointTop,
    });
  }

  hueChange() {
    const { color } = this;
    const hsb = ColorPicker.fixHsx({
      h: parseInt(color[0], 10),
      s: parseInt(color[1], 10),
      x: parseInt(color[2], 10),
    });
    const {
      colorBarPoint, selectColorPoint, preViewColorPoint, selectColorArea1, colorInput,
    } = this;
    const colorValue = ColorPicker.hsbToHex(hsb);
    const areaColorValue = ColorPicker.hsbToHex({ h: hsb.h, s: 100, x: 100 });
    selectColorPoint.css('backgroundColor', `#${colorValue}`);
    preViewColorPoint.css('backgroundColor', `#${colorValue}`);
    colorBarPoint.css('backgroundColor', `#${areaColorValue}`);
    selectColorArea1.css('backgroundColor', `#${areaColorValue}`);
    colorInput.val(`#${colorValue}`);
    this.sliderPosition(hsb);
  }

  selectChange() {
    const { color } = this;
    const hsb = ColorPicker.fixHsx({
      h: parseInt(color[0], 10),
      s: parseInt(color[1], 10),
      x: parseInt(color[2], 10),
    });
    const { preViewColorPoint, selectColorPoint, colorInput } = this;
    const colorValue = ColorPicker.hsbToHex(hsb);
    selectColorPoint.css('backgroundColor', `#${colorValue}`);
    preViewColorPoint.css('backgroundColor', `#${colorValue}`);
    colorInput.val(`#${colorValue}`);
    this.sliderPosition(hsb);
  }

  change() {
    this.hueChange();
    this.selectChange();
  }

  downSelect(x, y, width, height) {
    const { color } = this;
    color[1] = parseInt(100 * x / width, 10);
    color[2] = parseInt(100 * (height - y) / height, 10);
    this.selectChange();
  }

  moveSelect(x, y, width, height) {
    const { color } = this;
    color[1] = parseInt(100 * (Math.max(0, Math.min(width, x))) / width, 10);
    color[2] = parseInt(100 * (height - Math.max(0, Math.min(height, y))) / height, 10);
    this.selectChange();
  }

  downHue(x, width) {
    const { color } = this;
    color[0] = parseInt(360 * (width - x) / width, 10);
    this.hueChange();
  }

  moveHue(x, width) {
    const { color } = this;
    color[0] = parseInt(360 * (width - Math.max(0, Math.min(width, x))) / width, 10);
    this.hueChange();
  }

  hexColor(hex) {
    const { color } = this;
    const result = ColorPicker.hexToHsb(ColorPicker.fixHex(hex));
    color[0] = result.h;
    color[1] = result.s;
    color[2] = result.x;
    this.change();
  }

  destroy() {
    super.destroy();
    this.unbind();
    this.dragPanel.destroy();
  }

  static fixHex(hex) {
    const len = 6 - hex.length;
    if (len > 0) {
      const o = [];
      for (let i = 0; i < len; i += 1) {
        o.push('0');
      }
      o.push(hex);
      // eslint-disable-next-line no-param-reassign
      hex = o.join('');
    }
    return hex;
  }

  static fixHsx(hsx) {
    return {
      h: Math.min(360, Math.max(0, hsx.h)),
      s: Math.min(100, Math.max(0, hsx.s)),
      x: Math.min(100, Math.max(0, hsx.x)),
    };
  }

  static isRgb(rgb) {
    return rgb.startsWith('rgb');
  }

  static isHex(hex) {
    return hex.startsWith('#');
  }

  static isDark(rgb) {
    if (SheetUtils.isString(rgb)) {
      if (this.isHex(rgb)) {
        const v = ColorPicker.hexToRgb(rgb);
        rgb = `rgb(${v.r}, ${v.g}, ${v.b})`;
      }
      const result = ColorPicker.parseRgb(rgb);
      const { r, g, b } = result;
      return (r * 0.299) + (g * 0.578) + (b * 0.114) >= 192;
    }
    return false;
  }

  static hexToRgb(hex) {
    // eslint-disable-next-line no-redeclare,no-param-reassign
    hex = parseInt(((hex.indexOf('#') > -1) ? hex.substring(1) : hex), 16);
    // eslint-disable-next-line no-bitwise
    return { r: hex >> 16, g: (hex & 0x00FF00) >> 8, b: (hex & 0x0000FF) };
  }

  static hexToHsb(hex) {
    return this.rgbToHsb(this.hexToRgb(hex));
  }

  static rgbToHsb(rgb) {
    const hsb = { h: 0, s: 0, x: 0 };
    const min = Math.min(rgb.r, rgb.g, rgb.b);
    const max = Math.max(rgb.r, rgb.g, rgb.b);
    const delta = max - min;
    hsb.x = max;
    hsb.s = max !== 0 ? 255 * delta / max : 0;
    if (hsb.s !== 0) {
      if (rgb.r === max) hsb.h = (rgb.g - rgb.b) / delta;
      else if (rgb.g === max) hsb.h = 2 + (rgb.b - rgb.r) / delta;
      else hsb.h = 4 + (rgb.r - rgb.g) / delta;
    } else hsb.h = -1;
    hsb.h *= 60;
    if (hsb.h < 0) hsb.h += 360;
    hsb.s *= 100 / 255;
    hsb.x *= 100 / 255;
    return hsb;
  }

  static hsbToRgb(hsb) {
    const rgb = {};
    let { h } = hsb;
    const s = hsb.s * 255 / 100;
    const v = hsb.x * 255 / 100;
    if (s === 0) {
      rgb.r = v;
      rgb.g = v;
      rgb.b = v;
    } else {
      const t1 = v;
      const t2 = (255 - s) * v / 255;
      const t3 = (t1 - t2) * (h % 60) / 60;
      if (h === 360) h = 0;
      if (h < 60) {
        rgb.r = t1;
        rgb.b = t2;
        rgb.g = t2 + t3;
      } else if (h < 120) {
        rgb.g = t1;
        rgb.b = t2;
        rgb.r = t1 - t3;
      } else if (h < 180) {
        rgb.g = t1;
        rgb.r = t2;
        rgb.b = t2 + t3;
      } else if (h < 240) {
        rgb.b = t1;
        rgb.r = t2;
        rgb.g = t1 - t3;
      } else if (h < 300) {
        rgb.b = t1;
        rgb.g = t2;
        rgb.r = t2 + t3;
      } else if (h < 360) {
        rgb.r = t1;
        rgb.g = t2;
        rgb.b = t1 - t3;
      } else {
        rgb.r = 0;
        rgb.g = 0;
        rgb.b = 0;
      }
    }
    return { r: Math.round(rgb.r), g: Math.round(rgb.g), b: Math.round(rgb.b) };
  }

  static rgbToHex(rgb) {
    const hex = [
      rgb.r.toString(16),
      rgb.g.toString(16),
      rgb.b.toString(16),
    ];
    hex.forEach((val, nr) => {
      if (val.length === 1) {
        hex[nr] = `0${val}`;
      }
    });
    return hex.join('');
  }

  static hsbToHex(hsb) {
    return this.rgbToHex(this.hsbToRgb(hsb));
  }

  static parseRgb(rgb) {
    const rxp = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/;
    const result = rgb.match(rxp);
    return {
      r: parseInt(result[1], 10),
      g: parseInt(result[2], 10),
      b: parseInt(result[3], 10),
    };
  }

  static parseRgbToHex(rgb, defaultValue = null) {
    if (rgb) {
      if (this.isHex(rgb)) {
        return rgb.substring(1);
      }
      const value = this.parseRgb(rgb);
      return this.rgbToHex(value);
    }
    return defaultValue;
  }

  static parseHexToRgb(hex, defaultValue = null) {
    if (hex) {
      const rgb = ColorPicker.hexToRgb(hex);
      return `rgb(${rgb.r},${rgb.g},${rgb.b})`;
    }
    return defaultValue;
  }

}

export { ColorPicker };
