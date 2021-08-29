/* global document */
import { Widget } from '../../lib/Widget';
import { cssPrefix, Constant } from '../../const/Constant';
import { h } from '../../lib/Element';
import { SheetUtils } from '../../utils/SheetUtils';

import { XEvent } from '../../lib/XEvent';

class ScrollBarX extends Widget {

  constructor(option) {
    super(`${cssPrefix}-scroll-bar-x`);
    this.option = SheetUtils.copy({
      style: {},
      last: () => 0,
      next: () => 0,
      scroll: to => to,
    }, option);
    this.lastBut = h('div', `${cssPrefix}-scroll-bar-x-last-but`);
    this.nextBut = h('div', `${cssPrefix}-scroll-bar-x-next-but`);
    this.content = h('div', `${cssPrefix}-scroll-bar-x-content`);
    this.block = h('div', `${cssPrefix}-scroll-bar-x-block`);
    this.content.childrenNodes(this.block);
    this.childrenNodes(...[
      this.lastBut,
      this.nextBut,
      this.content,
    ]);
    this.blockLeft = 0;
    this.maxBlockLeft = 0;
    this.blockWidth = 0;
    this.minBlockWidth = 20;
    this.scrollTo = 0;
    this.contentWidth = 0;
    this.viewPortWidth = 0;
    this.isHide = true;
    this.css(this.option.style);
  }

  unbind() {
    XEvent.unbind(this.nextBut);
    XEvent.unbind(this.lastBut);
    XEvent.unbind(this.block);
    XEvent.unbind(this);
  }

  bind() {
    XEvent.bind(this, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
      XEvent.mouseHold(document, () => {});
    });
    XEvent.bind(this.block, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (evt1) => {
      if (evt1.button !== 0) return;
      const downEventXy = this.eventXy(evt1, this.block);
      XEvent.mouseMoveUp(h(document), (evt2) => {
        // 计算移动的距离
        const moveEventXy = this.eventXy(evt2, this.content);
        let left = moveEventXy.x - downEventXy.x;
        if (left < 0) left = 0;
        if (left > this.maxBlockLeft) left = this.maxBlockLeft;
        // 计算滑动的距离
        left = this.computeScrollTo(left);
        this.scrollMove(left);
      });
    });
    XEvent.bind(this.nextBut, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
      XEvent.mouseHold(document, () => {
        this.option.next();
      });
    });
    XEvent.bind(this.lastBut, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
      XEvent.mouseHold(document, () => {
        this.option.last();
      });
    });
  }

  onAttach() {
    this.bind();
  }

  setSize(viewPortWidth, contentWidth) {
    if (viewPortWidth < contentWidth) {
      this.isHide = false;
      this.show();
      // 计算滑块宽度
      const contentBox = this.content.box();
      const blockWidth = viewPortWidth / contentWidth * contentBox.width;
      this.blockWidth = blockWidth < this.minBlockWidth ? this.minBlockWidth : blockWidth;
      this.viewPortWidth = viewPortWidth;
      this.contentWidth = contentWidth;
      this.maxBlockLeft = contentBox.width - this.blockWidth;
      this.block.css('width', `${this.blockWidth}px`);
      // 计算滑块位置
      const blockLeft = (this.scrollTo / (contentWidth - viewPortWidth)) * this.maxBlockLeft;
      this.blockLeft = blockLeft > this.maxBlockLeft ? this.maxBlockLeft : blockLeft;
      this.scrollTo = this.computeScrollTo(this.blockLeft);
      this.block.css('left', `${this.blockLeft}px`);
    } else {
      this.isHide = true;
      this.hide();
      this.option.scroll(0);
    }
  }

  scrollMove(move) {
    this.setLocal(move);
    this.option.scroll(this.scrollTo);
  }

  setLocal(move) {
    let to = move;
    const maxTo = this.contentWidth - this.viewPortWidth;
    if (to > maxTo) to = maxTo; else if (to < 0) to = 0;
    const blockLeft = (to / (this.contentWidth - this.viewPortWidth)) * this.maxBlockLeft;
    this.blockLeft = blockLeft > this.maxBlockLeft ? this.maxBlockLeft : blockLeft;
    if (this.isHide === false) {
      this.scrollTo = to;
      this.block.css('left', `${this.blockLeft}px`);
    }
  }

  computeScrollTo(move) {
    return (move / this.maxBlockLeft) * (this.contentWidth - this.viewPortWidth);
  }

  destroy() {
    super.destroy();
    this.unbind();
  }

}

export { ScrollBarX };
