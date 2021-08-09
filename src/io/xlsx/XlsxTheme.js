/**
 * http://ciintelligence.blogspot.com/2012/02/converting-excel-theme-color-and-tint.html
 */
import * as tXml from 'txml';
import { ColorPicker } from '../../module/colorpicker/ColorPicker';
import { XDraw } from '../../draw/XDraw';
import { SheetUtils } from '../../utils/SheetUtils';
import { ColorArray } from '../../module/colorpicker/colorarray/ColorArray';

function HexRgb(argb) {
  if (argb) {
    if (argb.startsWith('#')) {
      if (argb.length === 9) {
        return `#${argb.substring(3)}`;
      }
    } else if (argb.length === 8) {
      return argb.substring(2);
    }
  }
  return argb;
}

class HlsColor {

  constructor(a = 0, h = 0, l = 0, s = 0) {
    this.a = a;
    this.h = h;
    this.l = l;
    this.s = s;
  }

  rgbToHls(rgbColor) {
    const hlsColor = new HlsColor();
    const r = rgbColor.r / 255;
    const g = rgbColor.g / 255;
    const b = rgbColor.b / 255;
    const a = rgbColor.a / 255;
    const min = Math.min(r, Math.min(g, b));
    const max = Math.max(r, Math.max(g, b));
    const delta = max - min;
    if (max === min) {
      hlsColor.h = 0;
      hlsColor.s = 0;
      hlsColor.l = max;
      return hlsColor;
    }
    hlsColor.l = (min + max) / 2;
    if (hlsColor.l < 0.5) {
      hlsColor.s = delta / (max + min);
    } else {
      hlsColor.s = delta / (2.0 - max - min);
    }
    if (r === max) hlsColor.h = (g - b) / delta;
    if (g === max) hlsColor.h = 2.0 + (b - r) / delta;
    if (b === max) hlsColor.h = 4.0 + (r - g) / delta;
    hlsColor.h *= 60;
    if (hlsColor.h < 0) hlsColor.h += 360;
    hlsColor.a = a;
    return hlsColor;
  }

}

class RgbColor {

  constructor(r = 0, g = 0, b = 0, a = 0) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  setColor(t1, t2, t3) {
    if (t3 < 0) t3 += 1.0;
    if (t3 > 1) t3 -= 1.0;
    let color;
    if (6.0 * t3 < 1) {
      color = t2 + (t1 - t2) * 6.0 * t3;
    } else if (2.0 * t3 < 1) {
      color = t1;
    } else if (3.0 * t3 < 2) {
      color = t2 + (t1 - t2) * ((2.0 / 3.0) - t3) * 6.0;
    } else {
      color = t2;
    }
    return color;
  }

  hlsToRgb(hlsColor) {
    if (hlsColor.s === 0) {
      return new RgbColor(hlsColor.l * 255, hlsColor.l * 255, hlsColor.l * 255, hlsColor.a * 255);
    }
    let t1;
    if (hlsColor.l < 0.5) {
      t1 = hlsColor.l * (1.0 + hlsColor.s);
    } else {
      t1 = hlsColor.l + hlsColor.s - (hlsColor.l * hlsColor.s);
    }
    const t2 = 2.0 * hlsColor.l - t1;
    const h = hlsColor.h / 360;
    const tR = h + (1.0 / 3.0);
    const r = this.setColor(t1, t2, tR);
    const g = this.setColor(t1, t2, h);
    const tB = h - (1.0 / 3.0);
    const b = this.setColor(t1, t2, tB);
    return new RgbColor(r * 255, g * 255, b * 255, hlsColor.a * 255);
  }

}

class Theme {

  constructor(theme = 0, tint = 0, colorPallate = []) {
    this.cacheTheme = {};
    this.tint = tint;
    this.theme = theme;
    this.colorPallate = colorPallate;
  }

  setColorPallate(list) {
    this.colorPallate = list;
    this.cacheTheme = {};
    return this;
  }

  setTint(tint = 0) {
    this.tint = tint;
    return this;
  }

  getThemeRgb() {
    const key = `${this.theme}+${this.tint}`;
    if (this.cacheTheme[key]) {
      return this.cacheTheme[key];
    }
    const hex = this.colorPallate[this.theme];
    if (SheetUtils.isUnDef(hex)) {
      return ColorArray.BLACK;
    }
    const rgb = ColorPicker.hexToRgb(hex);
    const rgbColor = new RgbColor(rgb.r, rgb.g, rgb.b);
    const hlsColor = new HlsColor().rgbToHls(rgbColor);
    hlsColor.l = this.lumValue(this.tint, hlsColor.l * 255) / 255;
    const result = new RgbColor().hlsToRgb(hlsColor);
    const r = XDraw.trunc(result.r);
    const g = XDraw.trunc(result.g);
    const b = XDraw.trunc(result.b);
    const final = `rgb(${r},${g},${b})`;
    this.cacheTheme[key] = final;
    return final;
  }

  lumValue(tint, lum) {
    if (tint == null) {
      return lum;
    }
    let value;
    if (tint < 0) {
      value = lum * (1.0 + tint);
    } else {
      value = lum * (1.0 - tint) + (255 - 255 * (1.0 - tint));
    }
    return value;
  }

  setTheme(theme = 0) {
    this.theme = theme;
    return this;
  }
}

class ThemeXml {

  constructor(xml) {
    this.nods = tXml.parse(xml) || [];
  }

  getThemeList() {
    const { nods } = this;
    const theme = nods.find(node => node.tagName === 'a:theme');
    const themeElements = theme.children.find(child => child.tagName === 'a:themeElements');
    const clrScheme = themeElements.children.find(child => child.tagName === 'a:clrScheme');
    const array = [];
    const sort = [
      'a:lt1', 'a:dk1', 'a:lt2', 'a:dk2', 'a:accent1', 'a:accent2', 'a:accent3', 'a:accent4', 'a:accent5', 'a:accent6',
    ];
    clrScheme.children.forEach((item) => {
      const { tagName } = item;
      if (sort.indexOf(tagName) === -1) {
        return;
      }
      const sysClr = item.children.find(child => child.tagName === 'a:sysClr');
      if (sysClr) {
        const { attributes } = sysClr;
        if (attributes) {
          const { lastClr } = attributes;
          if (lastClr) {
            array.push({
              key: tagName, val: lastClr,
            });
          }
        }
      } else {
        const srgbClr = item.children.find(child => child.tagName === 'a:srgbClr');
        if (srgbClr) {
          const { attributes } = srgbClr;
          if (attributes) {
            const { val } = attributes;
            if (val) {
              array.push({
                key: tagName, val,
              });
            }
          }
        }
      }
    });
    array.sort((a, b) => {
      const key1 = a.key;
      const key2 = b.key;
      return sort.indexOf(key1) - sort.indexOf(key2);
    });
    return array.map(item => item.val);
  }
}

export {
  Theme, ThemeXml, HexRgb,
};
