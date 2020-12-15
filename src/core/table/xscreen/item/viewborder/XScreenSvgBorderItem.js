import { cssPrefix } from '../../../../../const/Constant';
import { XScreenStyleBorderItem } from './XScreenStyleBorderItem';

const SVG = `
  <svg class="${cssPrefix}-copy-style-svg" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <line class="${cssPrefix}-copy-style-stroked ${cssPrefix}-copy-style-stroked-top" x1="0" y1="0" x2="100%" y2="0"/>
    <line class="${cssPrefix}-copy-style-stroked ${cssPrefix}-copy-style-stroked-left" x1="0" y1="0" x2="0" y2="100%"/>
    <line class="${cssPrefix}-copy-style-stroked ${cssPrefix}-copy-style-stroked-bottom" x1="0" y1="100%" x2="100%" y2="100%"/>
    <line class="${cssPrefix}-copy-style-stroked ${cssPrefix}-copy-style-stroked-right" x1="100%" y1="0" x2="100%" y2="100%"/>
  </svg>
`;

class XScreenSvgBorderItem extends XScreenStyleBorderItem {

  constructor({ table }) {
    super({ table }, `${cssPrefix}-part-border-svg`);
    this.blt.html(SVG);
    this.bl.html(SVG);
    this.bt.html(SVG);
    this.bbr.html(SVG);
  }

}

export {
  XScreenSvgBorderItem,
};
