import { PlainUtils } from '../../utils/PlainUtils';
import { Rows } from './tablebase/Rows';
import { Cols } from './tablebase/Cols';
import { SCROLL_TYPE } from './tablebase/Scroll';
import { Widget } from '../../lib/Widget';
import { cssPrefix } from '../../const/Constant';
import { XDraw } from '../../canvas/XDraw';
import { Line } from '../../canvas/Line';
import { Grid } from '../../canvas/Grid';
import { Crop } from '../../canvas/Crop';
import { Rect } from '../../canvas/Rect';
import { Box } from '../../canvas/Box';
import { RectRange } from './tablebase/RectRange';
import { Cells } from './tablecell/Cells';
import { Scale, ScaleAdapter } from './tablebase/Scale';
import { Code } from './tablebase/Code';
import { Text } from './tablebase/Text';
import { STYLE_BREAK_LOOP, StyleCellsHelper } from './helper/StyleCellsHelper';
import { TEXT_BREAK_LOOP, TextCellsHelper } from './helper/TextCellsHelper';
import { XTableHistoryAreaView } from './XTableHistoryAreaView';
import { OperateCellsHelper } from './helper/OperateCellsHelper';
import { BaseFont } from '../../canvas/font/BaseFont';
import { VIEW_MODE, XTableScrollView } from './XTableScrollView';
import { XFixedMeasure } from './tablebase/XFixedMeasure';
import { FixedCellIcon } from './cellicon/FixedCellIcon';
import { StaticCellIcon } from './cellicon/StaticCellIcon';
import { XLinePlainGenerator } from './xlinehandle/XLinePlainGenerator';
import { LBorderShow } from './xlinehandle/linefilters/borderdisplay/LBorderShow';
import { XLineIteratorFilter } from './xlinehandle/XLineIteratorFilter';
import { RBorderShow } from './xlinehandle/linefilters/borderdisplay/RBorderShow';
import { TBorderShow } from './xlinehandle/linefilters/borderdisplay/TBorderShow';
import { BBorderShow } from './xlinehandle/linefilters/borderdisplay/BBorderShow';
import { XMerges } from './xmerges/XMerges';
import { XTableDataItems } from './XTableDataItems';
import { Path } from '../../canvas/Path';
import { Point } from '../../canvas/Point';
import { RTCosKit, RTSinKit } from '../../canvas/RTFunction';

const RENDER_MODE = {
  SCROLL: Symbol('scroll'),
  RENDER: Symbol('render'),
  SCALE: Symbol('scale'),
};

//  ============================== 表格细节元素绘制 =============================

class XTableFrozenFullRect {

  constructor(table) {
    this.table = table;
  }

  draw() {
    const dx = 0;
    const dy = 0;
    const { table } = this;
    const { draw } = table;
    const { indexGrid } = table;
    const { index } = table;
    const indexHeight = index.getHeight();
    const indexWidth = index.getWidth();
    draw.save();
    draw.offset(dx, dy);
    // 绘制背景
    draw.attr({
      fillStyle: '#f4f5f8',
    });
    draw.fillRect(0, 0, index.getWidth(), indexHeight);
    draw.offset(0, 0);
    // 绘制边框
    indexGrid.horizonLine(0, indexHeight, indexWidth, indexHeight);
    indexGrid.verticalLine(indexWidth, dy, indexWidth, indexHeight);
    draw.restore();
  }

  render() {
    const { table } = this;
    const renderMode = table.getRenderMode();
    if (renderMode === RENDER_MODE.RENDER || renderMode === RENDER_MODE.SCALE) {
      this.draw();
    }
  }

}

class XTableFixedBar {

  constructor(table, {
    width, height, background, buttonColor,
  }) {
    this.table = table;
    this.height = height;
    this.width = width;
    this.background = background;
    this.buttonColor = buttonColor;
  }

  drawBar() {
    const {
      table, height, width, background,
    } = this;
    const {
      xFixedView, draw, index, xFixedMeasure,
    } = table;
    if (xFixedView.hasFixedTop()) {
      const rpxHeight = XDraw.srcTransformStylePx(height);
      const width = table.visualWidth();
      const x = index.getWidth();
      const y = xFixedMeasure.getHeight() + index.getHeight() - rpxHeight / 2;
      draw.attr({ fillStyle: background });
      draw.fillRect(x, y, width, rpxHeight);
    }
    if (xFixedView.hasFixedLeft()) {
      const height = table.visualHeight();
      const rpxWidth = XDraw.srcTransformStylePx(width);
      const x = xFixedMeasure.getWidth() + index.getWidth() - rpxWidth / 2;
      const y = index.getHeight();
      draw.attr({ fillStyle: background });
      draw.fillRect(x, y, rpxWidth, height);
    }
  }

  drawButton() {
    const {
      table, height, width, buttonColor,
    } = this;
    const {
      xFixedView, draw, index, xFixedMeasure,
    } = table;
    if (xFixedView.hasFixedTop()) {
      const rpxHeight = XDraw.srcTransformStylePx(height);
      const width = index.getWidth();
      const x = 0;
      const y = xFixedMeasure.getHeight() + index.getHeight() - rpxHeight / 2;
      draw.attr({ fillStyle: buttonColor });
      draw.fillRect(x, y, width, rpxHeight);
    }
    if (xFixedView.hasFixedLeft()) {
      const height = index.getHeight();
      const rpxWidth = XDraw.srcTransformStylePx(width);
      const x = xFixedMeasure.getWidth() + index.getWidth() - rpxWidth / 2;
      const y = 0;
      draw.attr({ fillStyle: buttonColor });
      draw.fillRect(x, y, rpxWidth, height);
    }
  }

  render() {
    this.drawBar();
    this.drawButton();
  }

}

// =============================== 表格绘制抽象类 ==============================

class XTableUI {

  /**
   * XTableUI
   * @param table
   */
  constructor(table) {
    this.table = table;
    this.width = null;
    this.height = null;
    this.x = null;
    this.y = null;
    this.drawX = null;
    this.drawY = null;
    this.mapOriginX = null;
    this.mapOriginY = null;
    this.mapTargetX = null;
    this.mapTargetY = null;
    this.mapWidth = null;
    this.mapHeight = null;
    this.fullScrollView = null;
    this.scrollView = null;
    this.borderView = null;
    this.borderX = null;
    this.borderY = null;
    this.viewMode = null;
  }

  /**
   * 完整的滚动区域
   * @returns {RectRange}
   */
  getFullScrollView() {
    throw new TypeError('getFullScrollView child impl');
  }

  /**
   * 滚动区域
   * 网格和背景颜色的绘制区域
   * @returns {RectRange}
   */
  getScrollView() {
    throw new TypeError('getScrollView child impl');
  }

  /**
   * 边框&网格绘制区域
   * @returns {RectRange}
   */
  getLineView() {
    if (PlainUtils.isNotUnDef(this.borderView)) {
      return this.borderView.clone();
    }
    const { table } = this;
    const { cols, rows } = table;
    const renderMode = table.getRenderMode();
    const viewMode = this.getViewMode();
    const scrollView = this.getScrollView();
    if (viewMode === VIEW_MODE.CHANGE_ADD && renderMode === RENDER_MODE.SCROLL) {
      const { scroll } = table;
      switch (scroll.type) {
        case SCROLL_TYPE.V_TOP: {
          scrollView.eri += 1;
          scrollView.h = rows.rectRangeSumHeight(scrollView);
          break;
        }
        case SCROLL_TYPE.V_BOTTOM: {
          scrollView.sri -= 1;
          scrollView.h = rows.rectRangeSumHeight(scrollView);
          break;
        }
        case SCROLL_TYPE.H_RIGHT: {
          scrollView.sci -= 1;
          scrollView.w = cols.rectRangeSumWidth(scrollView);
          break;
        }
        case SCROLL_TYPE.H_LEFT: {
          scrollView.eci += 1;
          scrollView.w = cols.rectRangeSumWidth(scrollView);
          break;
        }
      }
    }
    this.borderView = scrollView;
    return scrollView.clone();
  }

  /**
   * 绘制贴图的目标X坐标
   */
  getMapTargetX() {
    if (PlainUtils.isNumber(this.mapTargetX)) {
      return this.mapTargetX;
    }
    const { table } = this;
    const { xTableAreaView } = table;
    const { scroll } = table;
    const x = this.getX();
    let mapTargetX = 0;
    switch (scroll.type) {
      case SCROLL_TYPE.H_LEFT: {
        const enterView = xTableAreaView.getEnterView();
        mapTargetX = enterView.w;
        break;
      }
      case SCROLL_TYPE.H_RIGHT: {
        mapTargetX = 0;
        break;
      }
    }
    mapTargetX = x + mapTargetX;
    this.mapTargetX = mapTargetX;
    return mapTargetX;
  }

  /**
   * 绘制贴图的目标X坐标
   */
  getMapTargetY() {
    if (PlainUtils.isNumber(this.mapTargetY)) {
      return this.mapTargetY;
    }
    const { table } = this;
    const { xTableAreaView } = table;
    const { scroll } = table;
    const y = this.getY();
    let mapTargetY = 0;
    switch (scroll.type) {
      case SCROLL_TYPE.V_TOP: {
        const enterView = xTableAreaView.getEnterView();
        mapTargetY = enterView.h;
        break;
      }
      case SCROLL_TYPE.V_BOTTOM: {
        mapTargetY = 0;
        break;
      }
    }
    mapTargetY = y + mapTargetY;
    this.mapTargetY = mapTargetY;
    return mapTargetY;
  }

  /**
   * 绘制贴图的原始X坐标
   */
  getMapOriginX() {
    if (PlainUtils.isNumber(this.mapOriginX)) {
      return this.mapOriginX;
    }
    const { table } = this;
    const { xTableAreaView } = table;
    const { scroll } = table;
    const x = this.getX();
    let mapOriginX = 0;
    switch (scroll.type) {
      case SCROLL_TYPE.H_LEFT: {
        mapOriginX = 0;
        break;
      }
      case SCROLL_TYPE.H_RIGHT: {
        const leaveView = xTableAreaView.getLeaveView();
        mapOriginX = leaveView.w;
        break;
      }
    }
    mapOriginX = x + mapOriginX;
    this.mapOriginX = mapOriginX;
    return mapOriginX;
  }

  /**
   * 绘制贴图的原始Y坐标
   */
  getMapOriginY() {
    if (PlainUtils.isNumber(this.mapOriginY)) {
      return this.mapOriginY;
    }
    const { table } = this;
    const { xTableAreaView } = table;
    const { scroll } = table;
    const y = this.getY();
    let mapOriginY = 0;
    switch (scroll.type) {
      case SCROLL_TYPE.V_TOP: {
        mapOriginY = 0;
        break;
      }
      case SCROLL_TYPE.V_BOTTOM: {
        const leaveView = xTableAreaView.getLeaveView();
        mapOriginY = leaveView.h;
        break;
      }
    }
    mapOriginY = y + mapOriginY;
    this.mapOriginY = mapOriginY;
    return mapOriginY;
  }

  /**
   * 绘制边框&网格的X坐标
   */
  getLineX() {
    if (PlainUtils.isNumber(this.borderX)) {
      return this.borderX;
    }
    const { table } = this;
    const x = this.getX();
    if (table.getRenderMode() === RENDER_MODE.RENDER) {
      this.borderX = x;
      return x;
    }
    if (table.getRenderMode() === RENDER_MODE.SCALE) {
      this.borderX = x;
      return x;
    }
    if (this.getViewMode() === VIEW_MODE.BOUND_OUT) {
      this.borderX = x;
      return x;
    }
    if (this.getViewMode() === VIEW_MODE.CHANGE_NOT) {
      this.borderX = x;
      return x;
    }
    const { scroll } = table;
    let borderX = 0;
    switch (scroll.type) {
      case SCROLL_TYPE.H_RIGHT: {
        const borderView = this.getLineView();
        const fullScrollView = this.getFullScrollView();
        borderX = fullScrollView.w - borderView.w;
        break;
      }
      case SCROLL_TYPE.H_LEFT: {
        borderX = 0;
        break;
      }
    }
    borderX = x + borderX;
    this.borderX = borderX;
    return borderX;
  }

  /**
   * 绘制边框 & 网格的Y坐标
   */
  getLineY() {
    if (PlainUtils.isNumber(this.borderY)) {
      return this.borderY;
    }
    const { table } = this;
    const y = this.getY();
    if (table.getRenderMode() === RENDER_MODE.RENDER) {
      this.borderY = y;
      return y;
    }
    if (table.getRenderMode() === RENDER_MODE.SCALE) {
      this.borderY = y;
      return y;
    }
    if (this.getViewMode() === VIEW_MODE.BOUND_OUT) {
      this.borderY = y;
      return y;
    }
    if (this.getViewMode() === VIEW_MODE.CHANGE_NOT) {
      this.borderY = y;
      return y;
    }
    const { scroll } = table;
    let borderY = 0;
    switch (scroll.type) {
      case SCROLL_TYPE.V_BOTTOM: {
        const borderView = this.getLineView();
        const fullScrollView = this.getFullScrollView();
        borderY = fullScrollView.h - borderView.h;
        break;
      }
      case SCROLL_TYPE.V_TOP: {
        borderY = 0;
        break;
      }
    }
    borderY = y + borderY;
    this.borderY = borderY;
    return borderY;
  }

  /**
   * 绘制区域高度
   * @returns {number}
   */
  getHeight() {
    throw new TypeError('getHeight child impl');
  }

  /**
   * 绘制区域宽度
   * @returns {number}
   */
  getWidth() {
    throw new TypeError('getWidth child impl');
  }

  /**
   * 绘制内容的X坐标
   */
  getDrawX() {
    if (PlainUtils.isNumber(this.drawX)) {
      return this.drawX;
    }
    const { table } = this;
    const x = this.getX();
    if (table.getRenderMode() === RENDER_MODE.RENDER) {
      this.drawX = x;
      return x;
    }
    if (table.getRenderMode() === RENDER_MODE.SCALE) {
      this.drawX = x;
      return x;
    }
    if (this.getViewMode() === VIEW_MODE.BOUND_OUT) {
      this.drawX = x;
      return x;
    }
    if (this.getViewMode() === VIEW_MODE.CHANGE_NOT) {
      this.drawX = x;
      return x;
    }
    const { scroll } = table;
    const scrollView = this.getScrollView();
    const fullScrollView = this.getFullScrollView();
    let drawX = 0;
    switch (scroll.type) {
      case SCROLL_TYPE.H_RIGHT: {
        drawX = fullScrollView.w - scrollView.w;
        break;
      }
      case SCROLL_TYPE.H_LEFT: {
        drawX = 0;
        break;
      }
    }
    drawX = x + drawX;
    this.drawX = drawX;
    return drawX;
  }

  /**
   * 绘制内容的Y坐标
   */
  getDrawY() {
    if (PlainUtils.isNumber(this.drawY)) {
      return this.drawY;
    }
    const { table } = this;
    const y = this.getY();
    if (table.getRenderMode() === RENDER_MODE.RENDER) {
      this.drawY = y;
      return y;
    }
    if (table.getRenderMode() === RENDER_MODE.SCALE) {
      this.drawY = y;
      return y;
    }
    if (this.getViewMode() === VIEW_MODE.BOUND_OUT) {
      this.drawY = y;
      return y;
    }
    if (this.getViewMode() === VIEW_MODE.CHANGE_NOT) {
      this.drawY = y;
      return y;
    }
    const { scroll } = table;
    const scrollView = this.getScrollView();
    const fullScrollView = this.getFullScrollView();
    let drawY = 0;
    switch (scroll.type) {
      case SCROLL_TYPE.V_BOTTOM: {
        drawY = fullScrollView.h - scrollView.h;
        break;
      }
      case SCROLL_TYPE.V_TOP: {
        drawY = 0;
        break;
      }
    }
    drawY = y + drawY;
    this.drawY = drawY;
    return drawY;
  }

  /**
   * 绘制区域的X坐标
   * @returns {number}
   */
  getX() {
    throw new TypeError('getX child impl');
  }

  /**
   * 绘制区域Y坐标
   * @returns {number}
   */
  getY() {
    throw new TypeError('getY child impl');
  }

  /**
   * 视图模式
   * @return {symbol}
   */
  getViewMode() {
    throw new TypeError('getViewMode child impl');
  }

  /**
   * 重置变量区
   */
  reset() {
    this.width = null;
    this.height = null;
    this.x = null;
    this.y = null;
    this.drawX = null;
    this.drawY = null;
    this.mapOriginX = null;
    this.mapOriginY = null;
    this.mapTargetX = null;
    this.mapTargetY = null;
    this.mapWidth = null;
    this.mapHeight = null;
    this.fullScrollView = null;
    this.scrollView = null;
    this.borderView = null;
    this.borderX = null;
    this.borderY = null;
    this.viewMode = null;
  }

  /**
   * 绘制贴图的高度
   * @returns {number}
   */
  getMapHeight() {
    if (PlainUtils.isNumber(this.mapHeight)) {
      return this.mapHeight;
    }
    const { table } = this;
    const { xTableAreaView } = table;
    const { scroll } = table;
    let mapHeight = this.getHeight();
    switch (scroll.type) {
      case SCROLL_TYPE.V_BOTTOM: {
        const leaveView = xTableAreaView.getLeaveView();
        mapHeight -= leaveView.h;
        break;
      }
      case SCROLL_TYPE.V_TOP: {
        const enterView = xTableAreaView.getEnterView();
        mapHeight -= enterView.h;
        break;
      }
    }
    this.mapHeight = mapHeight;
    return mapHeight;
  }

  /**
   * 绘制贴图的宽度
   * @returns {number}
   */
  getMapWidth() {
    if (PlainUtils.isNumber(this.mapWidth)) {
      return this.mapWidth;
    }
    const { table } = this;
    const { xTableAreaView } = table;
    const { scroll } = table;
    let mapWidth = this.getWidth();
    switch (scroll.type) {
      case SCROLL_TYPE.H_RIGHT: {
        const leaveView = xTableAreaView.getLeaveView();
        mapWidth -= leaveView.w;
        break;
      }
      case SCROLL_TYPE.H_LEFT: {
        const enterView = xTableAreaView.getEnterView();
        mapWidth -= enterView.w;
        break;
      }
    }
    this.mapWidth = mapWidth;
    return mapWidth;
  }

  /**
   * 清空重新绘制区域
   */
  drawClear() {
    const { table } = this;
    const {
      scroll, draw, settings,
    } = table;
    const viewMode = this.getViewMode();
    const renderMode = table.getRenderMode();
    const dx = this.getDrawX();
    const dy = this.getDrawY();
    draw.attr({
      fillStyle: settings.table.background,
    });
    if (renderMode === RENDER_MODE.SCROLL) {
      switch (viewMode) {
        case VIEW_MODE.CHANGE_NOT:
        case VIEW_MODE.STATIC:
        case VIEW_MODE.BOUND_OUT: {
          const height = this.getHeight();
          const width = this.getWidth();
          draw.fillRect(dx, dy, width, height);
          break;
        }
        case VIEW_MODE.CHANGE_ADD: {
          switch (scroll.type) {
            case SCROLL_TYPE.V_BOTTOM: {
              const fullScrollView = this.getFullScrollView();
              const scrollView = this.getScrollView();
              const height = table.visualHeight() - (fullScrollView.h - scrollView.h);
              const width = this.getWidth();
              draw.fillRect(dx, dy, width, height);
              break;
            }
            case SCROLL_TYPE.V_TOP: {
              const scrollView = this.getScrollView();
              const height = scrollView.h;
              const width = this.getWidth();
              draw.fillRect(dx, dy, width, height);
              break;
            }
            case SCROLL_TYPE.H_LEFT: {
              const scrollView = this.getScrollView();
              const height = this.getHeight();
              const width = scrollView.w;
              draw.fillRect(dx, dy, width, height);
              break;
            }
            case SCROLL_TYPE.H_RIGHT: {
              const fullScrollView = this.getFullScrollView();
              const scrollView = this.getScrollView();
              const height = this.getHeight();
              const width = table.visualWidth() - (fullScrollView.w - scrollView.w);
              draw.fillRect(dx, dy, width, height);
              break;
            }
          }
          break;
        }
      }
    } else if (RENDER_MODE.RENDER) {
      const height = this.getHeight();
      const width = this.getWidth();
      draw.fillRect(dx, dy, width, height);
    }
  }

  /**
   * 绘制贴图
   */
  drawMap() {
    const { table } = this;
    const renderMode = table.getRenderMode();
    const viewMode = this.getViewMode();
    if (viewMode === VIEW_MODE.CHANGE_ADD && renderMode === RENDER_MODE.SCROLL) {
      const { draw } = table;
      const mapWidth = this.getMapWidth();
      const mapHeight = this.getMapHeight();
      const ox = this.getMapOriginX();
      const oy = this.getMapOriginY();
      const tx = this.getMapTargetX();
      const ty = this.getMapTargetY();
      draw.copyImage(ox, oy, mapWidth, mapHeight,
        tx, ty, mapWidth, mapHeight);
    }
  }

}

class XTableContentUI extends XTableUI {

  /**
   * 加载绘制静态小图标
   * @param rect
   * @param ri
   * @param ci
   * @param view
   */
  drawStaticXIcon(rect, ri, ci, view) {
    const { table } = this;
    const { draw, staticCellIcon } = table;
    const icons = staticCellIcon.getIcon(ri, ci);
    if (icons) {
      const x = this.getX();
      const y = this.getY();
      rect.x += x;
      rect.y += y;
      for (let i = 0; i < icons.length; i += 1) {
        const icon = icons[i];
        icon.loadImage({
          load: () => {
            if (view.equals(this.getFullScrollView())) {
              icon.drawIcon({
                rect,
                draw,
              });
            }
          },
          sync: () => {
            icon.drawIcon({
              rect,
              draw,
            });
          },
        });
      }
    }
  }

  /**
   * 加载绘制固定小图标
   * @param rect
   * @param ri
   * @param ci
   * @param view
   */
  drawFixedXIcon(rect, ri, ci, view) {
    const { table } = this;
    const { draw, fixedCellIcon } = table;
    const icons = fixedCellIcon.getIcon(ri, ci);
    if (icons) {
      const x = this.getX();
      const y = this.getY();
      rect.x += x;
      rect.y += y;
      for (let i = 0; i < icons.length; i += 1) {
        const icon = icons[i];
        icon.loadImage({
          load: () => {
            if (view.equals(this.getFullScrollView())) {
              icon.drawIcon({
                rect,
                draw,
              });
            }
          },
          sync: () => {
            icon.drawIcon({
              rect,
              draw,
            });
          },
        });
      }
    }
  }

  /**
   * 加载绘制单元格小图标
   * @param rect
   * @param cell
   * @param view
   */
  drawCellXIcon(rect, cell, view) {
    const { table } = this;
    const { icons } = cell;
    const { draw } = table;
    const x = this.getX();
    const y = this.getY();
    rect.x += x;
    rect.y += y;
    for (let i = 0; i < icons.length; i += 1) {
      const icon = icons[i];
      icon.loadImage({
        load: () => {
          if (view.equals(this.getFullScrollView())) {
            icon.drawIcon({
              rect,
              draw,
            });
          }
        },
        sync: () => {
          icon.drawIcon({
            rect,
            draw,
          });
        },
      });
    }
  }

  /**
   * 绘制单元格图标
   */
  drawXIcon() {
    const { table } = this;
    const { styleCellsHelper } = table;
    const scrollView = this.getFullScrollView();
    styleCellsHelper.getCellByViewRange({
      view: scrollView,
      cellsINCallback: (row, col, cell, rect) => {
        const staticRect = rect.clone();
        const cellRect = rect.clone();
        this.drawStaticXIcon(staticRect, row, col, scrollView);
        this.drawCellXIcon(cellRect, cell, scrollView);
      },
      loopINCallback: (row, col, rect) => {
        const fixedRect = rect.clone();
        this.drawFixedXIcon(fixedRect, row, col, scrollView);
      },
      mergeCallback: (row, col, cell, rect, merge) => {
        const { sri, sci } = merge;
        const staticRect = rect.clone();
        const cellRect = rect.clone();
        this.drawStaticXIcon(staticRect, sri, sci, scrollView);
        this.drawCellXIcon(cellRect, cell, scrollView);
      },
    });
  }

  /**
   * 绘制越界文本
   */
  drawBoundOutXFont() {
    const scrollView = this.getScrollView();
    const drawX = this.getDrawX();
    const drawY = this.getDrawY();
    const { table } = this;
    const { draw, cols, textCellsHelper, textFont } = table;
    // 左边区域
    const lView = scrollView.clone();
    lView.sci = 0;
    lView.eci = scrollView.sci - 1;
    if (lView.eci > -1) {
      let max;
      draw.offset(drawX, drawY);
      textCellsHelper.getCellByViewRange({
        reverseCols: true,
        view: lView,
        newCol: (col) => {
          max += cols.getWidth(col);
        },
        newRow: () => {
          max = 0;
        },
        cellsINCallback: (row, col, cell, rect, overflow) => {
          const { text } = cell;
          if (PlainUtils.isBlank(text)) {
            return TEXT_BREAK_LOOP.CONTINUE;
          }
          const { fontAttr } = cell;
          const { align, textWrap, direction } = fontAttr;
          const allowTextAlign = align === BaseFont.ALIGN.left || align === BaseFont.ALIGN.center;
          const allowTextWrap = textWrap === BaseFont.TEXT_WRAP.OVER_FLOW;
          const allowDirection = direction === BaseFont.TEXT_DIRECTION.ANGLE;
          if (allowTextAlign && (allowTextWrap || allowDirection)) {
            const size = table.getCellContentBoundOutWidth(row, col);
            if (size === 0 || size > max) {
              const builder = textFont.getBuilder();
              builder.setDraw(draw);
              builder.setRect(rect);
              builder.setCell(cell);
              builder.setRow(row);
              builder.setCol(col);
              builder.setOverFlow(overflow);
              const font = builder.build();
              const result = font.drawingFont();
              cell.setContentWidth(result.width);
              cell.setLeftSdistWidth(result.leftSdist);
              cell.setRightSdistWidth(result.rightSdist);
            }
          }
          return table.hasAngleCell(row)
            ? TEXT_BREAK_LOOP.CONTINUE
            : TEXT_BREAK_LOOP.ROW;
        },
        mergeCallback: row => (table.hasAngleCell(row)
          ? TEXT_BREAK_LOOP.CONTINUE
          : TEXT_BREAK_LOOP.ROW),
      });
      draw.offset(0, 0);
    }
    // 右边区域
    const rView = scrollView.clone();
    rView.sci = scrollView.eci + 1;
    rView.eci = cols.len - 1;
    if (rView.sci < cols.len) {
      let max;
      draw.offset(drawX + scrollView.w, drawY);
      textCellsHelper.getCellByViewRange({
        startX: scrollView.w,
        view: rView,
        newCol: (col) => {
          max += cols.getWidth(col);
        },
        newRow: () => {
          max = 0;
        },
        cellsINCallback: (row, col, cell, rect, overflow) => {
          const { text } = cell;
          if (PlainUtils.isBlank(text)) {
            return TEXT_BREAK_LOOP.CONTINUE;
          }
          const { fontAttr } = cell;
          const { align, textWrap, direction } = fontAttr;
          const allowTextAlign = align === BaseFont.ALIGN.right || align === BaseFont.ALIGN.center;
          const allowDirection = direction === BaseFont.TEXT_DIRECTION.ANGLE;
          const allowTextWrap = textWrap === BaseFont.TEXT_WRAP.OVER_FLOW;
          if (allowTextAlign && (allowTextWrap || allowDirection)) {
            const size = table.getCellContentBoundOutWidth(row, col);
            if (size === 0 || size > max) {
              const builder = textFont.getBuilder();
              builder.setDraw(draw);
              builder.setRect(rect);
              builder.setCell(cell);
              builder.setRow(row);
              builder.setCol(col);
              builder.setOverFlow(overflow);
              const font = builder.build();
              const result = font.drawingFont();
              cell.setContentWidth(result.width);
              cell.setLeftSdistWidth(result.leftSdist);
              cell.setRightSdistWidth(result.rightSdist);
            }
          }
          return table.hasAngleCell(row)
            ? TEXT_BREAK_LOOP.CONTINUE
            : TEXT_BREAK_LOOP.ROW;
        },
        mergeCallback: row => (table.hasAngleCell(row)
          ? TEXT_BREAK_LOOP.CONTINUE
          : TEXT_BREAK_LOOP.ROW),
      });
      draw.offset(0, 0);
    }
  }

  /**
   * 绘制越界边框
   */
  drawBoundOutGridBorder() {
    const scrollView = this.getScrollView();
    const drawX = this.getDrawX();
    const drawY = this.getDrawY();
    const { table } = this;
    const { draw, cols, line } = table;
    // 左边区域
    const lView = scrollView.clone();
    lView.sci = 0;
    lView.eci = scrollView.sci - 1;
    if (lView.eci > -1) {
      const offset = cols.rectRangeSumWidth(lView);
      const { alResult } = XLinePlainGenerator.run({
        scrollView: lView,
        foldOnOff: true,
        table,
        model: XLinePlainGenerator.MODEL.OUT_ANGLE_BAR_L,
      });
      draw.offset(drawX - offset, drawY);
      alResult.tLine.forEach((item) => {
        const { borderAttr, row, col } = item;
        const { top } = borderAttr;
        const { color, widthType, type } = top;
        line.setType(type);
        line.setWidthType(widthType);
        line.setColor(color);
        line.tiltingLine(item.sx, item.sy, item.ex, item.ey, row, col, 'top');
      });
      alResult.lLine.forEach((item) => {
        const { borderAttr, row, col } = item;
        const { left } = borderAttr;
        const { color, widthType, type } = left;
        line.setType(type);
        line.setWidthType(widthType);
        line.setColor(color);
        line.tiltingLine(item.sx, item.sy, item.ex, item.ey, row, col, 'left');
      });
      alResult.rLine.forEach((item) => {
        const { borderAttr, row, col } = item;
        const { right } = borderAttr;
        const { color, widthType, type } = right;
        line.setType(type);
        line.setWidthType(widthType);
        line.setColor(color);
        line.tiltingLine(item.sx, item.sy, item.ex, item.ey, row, col, 'right');
      });
      alResult.bLine.forEach((item) => {
        const { borderAttr, row, col } = item;
        const { bottom } = borderAttr;
        const { color, widthType, type } = bottom;
        line.setType(type);
        line.setWidthType(widthType);
        line.setColor(color);
        line.tiltingLine(item.sx, item.sy, item.ex, item.ey, row, col, 'bottom');
      });
      draw.offset(0, 0);
    }
    // 右边区域
    const rView = scrollView.clone();
    rView.sci = scrollView.eci + 1;
    rView.eci = cols.len - 1;
    if (rView.sci < cols.len) {
      const offset = scrollView.w;
      const { arResult } = XLinePlainGenerator.run({
        scrollView: rView,
        foldOnOff: true,
        table,
        model: XLinePlainGenerator.MODEL.OUT_ANGLE_BAR_R,
      });
      draw.offset(drawX + offset, drawY);
      arResult.tLine.forEach((item) => {
        const { borderAttr, row, col } = item;
        const { top } = borderAttr;
        const { color, widthType, type } = top;
        line.setType(type);
        line.setWidthType(widthType);
        line.setColor(color);
        line.tiltingLine(item.sx, item.sy, item.ex, item.ey, row, col, 'top');
      });
      arResult.lLine.forEach((item) => {
        const { borderAttr, row, col } = item;
        const { left } = borderAttr;
        const { color, widthType, type } = left;
        line.setType(type);
        line.setWidthType(widthType);
        line.setColor(color);
        line.tiltingLine(item.sx, item.sy, item.ex, item.ey, row, col, 'left');
      });
      arResult.rLine.forEach((item) => {
        const { borderAttr, row, col } = item;
        const { right } = borderAttr;
        const { color, widthType, type } = right;
        line.setType(type);
        line.setWidthType(widthType);
        line.setColor(color);
        line.tiltingLine(item.sx, item.sy, item.ex, item.ey, row, col, 'right');
      });
      arResult.bLine.forEach((item) => {
        const { borderAttr, row, col } = item;
        const { bottom } = borderAttr;
        const { color, widthType, type } = bottom;
        line.setType(type);
        line.setWidthType(widthType);
        line.setColor(color);
        line.tiltingLine(item.sx, item.sy, item.ex, item.ey, row, col, 'bottom');
      });
      draw.offset(0, 0);
    }
  }

  /**
   * 绘制越界背景
   */
  drawBoundOutBackground() {
    const scrollView = this.getScrollView();
    const drawX = this.getDrawX();
    const drawY = this.getDrawY();
    const { table } = this;
    const { draw, cols, styleCellsHelper } = table;
    // 左边区域
    const lView = scrollView.clone();
    lView.sci = 0;
    lView.eci = scrollView.sci - 1;
    if (lView.eci > -1) {
      let max = 0;
      draw.offset(drawX, drawY);
      styleCellsHelper.getCellByViewRange({
        reverseCols: true,
        view: lView,
        newCol: (col) => {
          max += cols.getWidth(col);
        },
        newRow: () => {
          max = 0;
        },
        cellsINCallback: (row, col, cell, rect) => {
          if (table.hasAngleCell(row)) {
            if (table.isAngleBarCell(row, col)) {
              const size = table.getCellStyleBoundOutWidth(row, col);
              const { fontAttr } = cell;
              const { angle } = fontAttr;
              if (size > max && angle > 0) {
                const { background } = cell;
                const box = new Box({
                  draw, background,
                });
                const offset = table.getSdistWidth(row, col);
                const { x, y, width, height } = rect;
                const tl = new Point(x + offset, y);
                const tr = new Point(x + width + offset, y);
                const br = new Point(x + width, y + height);
                const bl = new Point(x, y + height);
                const path = new Path({
                  points: [tl, tr, br, bl],
                });
                box.setPath({ path });
                box.render();
              }
            }
            return STYLE_BREAK_LOOP.CONTINUE;
          }
          return STYLE_BREAK_LOOP.ROW;
        },
        mergeCallback: row => (table.hasAngleCell(row)
          ? STYLE_BREAK_LOOP.CONTINUE
          : STYLE_BREAK_LOOP.ROW),
      });
      draw.offset(0, 0);
    }
    // 右边区域
    const rView = scrollView.clone();
    rView.sci = scrollView.eci + 1;
    rView.eci = cols.len - 1;
    if (rView.sci < cols.len) {
      let max = 0;
      draw.offset(drawX + scrollView.w, drawY);
      styleCellsHelper.getCellByViewRange({
        view: rView,
        newCol: (col) => {
          max += cols.getWidth(col);
        },
        newRow: () => {
          max = 0;
        },
        cellsINCallback: (row, col, cell, rect) => {
          if (table.hasAngleCell(row)) {
            if (table.isAngleBarCell(row, col)) {
              const size = table.getCellStyleBoundOutWidth(row, col);
              const { fontAttr } = cell;
              const { angle } = fontAttr;
              if (size > max && angle < 0) {
                const { background } = cell;
                const box = new Box({
                  draw, background,
                });
                const offset = -table.getSdistWidth(row, col);
                const { x, y, width, height } = rect;
                const tl = new Point(x + offset, y);
                const tr = new Point(x + width + offset, y);
                const br = new Point(x + width, y + height);
                const bl = new Point(x, y + height);
                const path = new Path({
                  points: [tl, tr, br, bl],
                });
                box.setPath({ path });
                box.render();
              }
            }
            return STYLE_BREAK_LOOP.CONTINUE;
          }
          return STYLE_BREAK_LOOP.ROW;
        },
        mergeCallback: row => (table.hasAngleCell(row)
          ? STYLE_BREAK_LOOP.CONTINUE
          : STYLE_BREAK_LOOP.ROW),
      });
      draw.offset(0, 0);
    }
  }

  /**
   * 绘制单元格文本
   */
  drawXFont() {
    const scrollView = this.getScrollView();
    const drawX = this.getDrawX();
    const drawY = this.getDrawY();
    const { table } = this;
    const {
      draw, textCellsHelper, textFont,
    } = table;
    draw.offset(drawX, drawY);
    textCellsHelper.getCellByViewRange({
      view: scrollView,
      cellsINCallback: (row, col, cell, rect, overflow) => {
        const builder = textFont.getBuilder();
        builder.setDraw(draw);
        builder.setCell(cell);
        builder.setRect(rect);
        builder.setRow(row);
        builder.setCol(col);
        builder.setOverFlow(overflow);
        const font = builder.build();
        const result = font.drawingFont();
        cell.setContentWidth(result.width);
        cell.setLeftSdistWidth(result.leftSdist);
        cell.setRightSdistWidth(result.rightSdist);
      },
      mergeCallback: (row, col, cell, rect) => {
        const builder = textFont.getBuilder();
        builder.setDraw(draw);
        builder.setRect(rect);
        builder.setCell(cell);
        builder.setRow(row);
        builder.setCol(col);
        builder.setOverFlow(rect);
        const font = builder.build();
        const result = font.drawingFont();
        cell.setContentWidth(result.width);
        cell.setLeftSdistWidth(result.leftSdist);
        cell.setRightSdistWidth(result.rightSdist);
      },
    });
    draw.offset(0, 0);
  }

  /**
   * 绘制边框
   */
  drawGridBorder() {
    const borderView = this.getLineView();
    const borderX = this.getLineX();
    const borderY = this.getLineY();
    const { table } = this;
    const { settings, draw, grid, line, optimizeEnable } = table;
    draw.offset(borderX, borderY);
    const { gResult, bResult, aResult } = XLinePlainGenerator.run({
      scrollView: borderView,
      foldOnOff: true,
      optimize: optimizeEnable,
      table,
      model: settings.table.showGrid
        ? XLinePlainGenerator.MODEL.ALL
        : XLinePlainGenerator.MODEL.BORDER,
    });
    // 网格
    if (gResult) {
      gResult.bLine.forEach((item) => {
        grid.horizonLine(item.sx, item.sy, item.ex, item.ey);
      });
      gResult.rLine.forEach((item) => {
        grid.verticalLine(item.sx, item.sy, item.ex, item.ey);
      });
    }
    // 边框
    bResult.tLine.forEach((item) => {
      const { borderAttr, row, col } = item;
      const { top } = borderAttr;
      const { color, widthType, type } = top;
      line.setType(type);
      line.setWidthType(widthType);
      line.setColor(color);
      line.horizonLine(item.sx, item.sy, item.ex, item.ey, row, col, 'top');
    });
    bResult.lLine.forEach((item) => {
      const { borderAttr, row, col } = item;
      const { left } = borderAttr;
      const { color, widthType, type } = left;
      line.setType(type);
      line.setWidthType(widthType);
      line.setColor(color);
      line.verticalLine(item.sx, item.sy, item.ex, item.ey, row, col, 'left');
    });
    bResult.rLine.forEach((item) => {
      const { borderAttr, row, col } = item;
      const { right } = borderAttr;
      const { color, widthType, type } = right;
      line.setType(type);
      line.setWidthType(widthType);
      line.setColor(color);
      line.verticalLine(item.sx, item.sy, item.ex, item.ey, row, col, 'right');
    });
    bResult.bLine.forEach((item) => {
      const { borderAttr, row, col } = item;
      const { bottom } = borderAttr;
      const { color, widthType, type } = bottom;
      line.setType(type);
      line.setWidthType(widthType);
      line.setColor(color);
      line.horizonLine(item.sx, item.sy, item.ex, item.ey, row, col, 'bottom');
    });
    // 旋转
    aResult.tLine.forEach((item) => {
      const { borderAttr, row, col } = item;
      const { top } = borderAttr;
      const { color, widthType, type } = top;
      line.setType(type);
      line.setWidthType(widthType);
      line.setColor(color);
      line.tiltingLine(item.sx, item.sy, item.ex, item.ey, row, col, 'top');
    });
    aResult.lLine.forEach((item) => {
      const { borderAttr, row, col } = item;
      const { left } = borderAttr;
      const { color, widthType, type } = left;
      line.setType(type);
      line.setWidthType(widthType);
      line.setColor(color);
      line.tiltingLine(item.sx, item.sy, item.ex, item.ey, row, col, 'left');
    });
    aResult.rLine.forEach((item) => {
      const { borderAttr, row, col } = item;
      const { right } = borderAttr;
      const { color, widthType, type } = right;
      line.setType(type);
      line.setWidthType(widthType);
      line.setColor(color);
      line.tiltingLine(item.sx, item.sy, item.ex, item.ey, row, col, 'right');
    });
    aResult.bLine.forEach((item) => {
      const { borderAttr, row, col } = item;
      const { bottom } = borderAttr;
      const { color, widthType, type } = bottom;
      line.setType(type);
      line.setWidthType(widthType);
      line.setColor(color);
      line.tiltingLine(item.sx, item.sy, item.ex, item.ey, row, col, 'bottom');
    });
    draw.offset(0, 0);
  }

  /**
   * 绘制背景
   */
  drawBackground() {
    const scrollView = this.getScrollView();
    const { table } = this;
    const drawX = this.getDrawX();
    const drawY = this.getDrawY();
    const {
      draw, styleCellsHelper,
    } = table;
    draw.offset(drawX, drawY);
    styleCellsHelper.getCellByViewRange({
      view: scrollView,
      cellsINCallback: (row, col, cell, rect) => {
        if (table.hasAngleCell(row)) {
          if (table.isAngleBarCell(row, col)) {
            return;
          }
        }
        const { background } = cell;
        const box = new Box({
          draw, background, rect,
        });
        box.render();
      },
      mergeCallback: (row, col, cell, rect) => {
        const { background } = cell;
        const box = new Box({
          draw, rect, background,
        });
        box.render();
      },
    });
    styleCellsHelper.getCellByViewRange({
      view: scrollView,
      cellsINCallback: (row, col, cell, rect) => {
        if (table.hasAngleCell(row)) {
          if (table.isAngleBarCell(row, col)) {
            const { background } = cell;
            const box = new Box({
              draw, background,
            });
            const { fontAttr } = cell;
            const { angle } = fontAttr;
            const offset = angle > 0
              ? table.getSdistWidth(row, col)
              : -table.getSdistWidth(row, col);
            const { x, y, width, height } = rect;
            const tl = new Point(x + offset, y);
            const tr = new Point(x + width + offset, y);
            const br = new Point(x + width, y + height);
            const bl = new Point(x, y + height);
            const path = new Path({
              points: [tl, tr, br, bl],
            });
            box.setPath({ path });
            box.render();
          }
        }
      },
    });
    draw.offset(0, 0);
  }

  /**
   * 渲染界面
   */
  render() {
    const { table } = this;
    const renderMode = table.getRenderMode();
    const viewMode = this.getViewMode();
    if (viewMode === VIEW_MODE.STATIC && renderMode === RENDER_MODE.SCROLL) {
      return;
    }
    // 渲染贴图
    this.drawMap();
    // 清空画布
    this.drawClear();
    // 裁剪界面
    const scrollView = this.getScrollView();
    const x = this.getDrawX();
    const y = this.getDrawY();
    const width = scrollView.w;
    const height = scrollView.h;
    const { draw } = table;
    const crop = new Crop({
      rect: new Rect({
        x,
        y,
        width,
        height,
      }),
      draw,
    });
    crop.open();
    // 绘制背景
    this.drawBackground();
    this.drawBoundOutBackground();
    // 绘制文字
    this.drawXFont();
    this.drawBoundOutXFont();
    // 绘制边框
    this.drawGridBorder();
    this.drawBoundOutGridBorder();
    // 绘制小图标
    this.drawXIcon();
    crop.close();
  }

}

class XTableIndexUI extends XTableUI {

  /**
   * 绘制网格
   */
  drawGridBorder() {
    throw new TypeError('drawGrid child impl');
  }

  /**
   * 绘制背景颜色
   */
  drawColor() {
    throw new TypeError('drawColor child impl');
  }

  /**
   * 绘制文字
   */
  drawFont() {
    throw new TypeError('drawFont child impl');
  }

  /**
   * 渲染界面
   */
  render() {
    const { table } = this;
    const renderMode = table.getRenderMode();
    const viewMode = this.getViewMode();
    if (viewMode === VIEW_MODE.STATIC && renderMode === RENDER_MODE.SCROLL) {
      return;
    }
    this.drawMap();
    this.drawClear();
    this.drawColor();
    this.drawFont();
    this.drawGridBorder();
  }

}

class XTableLeftIndexUI extends XTableIndexUI {

  /**
   * 绘制网格
   */
  drawGridBorder() {
    const borderView = this.getLineView();
    const borderX = this.getLineX();
    const borderY = this.getLineY();
    const { table } = this;
    const { draw, indexGrid } = table;
    const { iResult } = XLinePlainGenerator.run({
      scrollView: borderView,
      foldOnOff: false,
      model: XLinePlainGenerator.MODEL.INDEX,
      table,
      getWidth: () => table.index.getWidth(),
    });
    draw.offset(borderX, borderY);
    iResult.bLine.forEach((item) => {
      indexGrid.horizonLine(item.sx, item.sy, item.ex, item.ey);
    });
    iResult.rLine.forEach((item) => {
      indexGrid.verticalLine(item.sx, item.sy, item.ex, item.ey);
    });
    draw.offset(0, 0);
  }

  /**
   * 绘制背景
   */
  drawColor() {
    const dx = this.getDrawX();
    const dy = this.getDrawY();
    const scrollView = this.getScrollView();
    const height = scrollView.h;
    const width = this.getWidth();
    const { table } = this;
    const {
      draw, index,
    } = table;
    draw.offset(dx, dy);
    draw.attr({
      fillStyle: index.getBackground(),
    });
    draw.fillRect(0, 0, width, height);
    draw.offset(0, 0);
  }

  /**
   *  绘制文字
   */
  drawFont() {
    const dx = this.getDrawX();
    const dy = this.getDrawY();
    const scrollView = this.getScrollView();
    const width = this.getWidth();
    const { table } = this;
    const {
      draw, rows, index,
    } = table;
    const { sri, eri } = scrollView;
    draw.offset(dx, dy);
    draw.attr({
      textAlign: 'center',
      textBaseline: 'middle',
      font: `${index.getSize()}px Arial`,
      fillStyle: index.getColor(),
    });
    rows.eachHeight(sri, eri, (i, ch, y) => {
      draw.fillText(i + 1, width / 2, y + (ch / 2));
    });
    draw.offset(0, 0);
  }

}

class XTableTopIndexUI extends XTableIndexUI {

  /**
   * 绘制网格
   */
  drawGridBorder() {
    const borderView = this.getLineView();
    const borderX = this.getLineX();
    const borderY = this.getLineY();
    const { table } = this;
    const { draw, indexGrid } = table;
    const { iResult } = XLinePlainGenerator.run({
      scrollView: borderView,
      foldOnOff: false,
      model: XLinePlainGenerator.MODEL.INDEX,
      table,
      getHeight: () => table.index.getHeight(),
    });
    draw.offset(borderX, borderY);
    iResult.bLine.forEach((item) => {
      indexGrid.horizonLine(item.sx, item.sy, item.ex, item.ey);
    });
    iResult.rLine.forEach((item) => {
      indexGrid.verticalLine(item.sx, item.sy, item.ex, item.ey);
    });
    draw.offset(0, 0);
  }

  /**
   * 绘制背景
   */
  drawColor() {
    const { table } = this;
    const {
      draw, index,
    } = table;
    const scrollView = this.getScrollView();
    const dx = this.getDrawX();
    const dy = this.getDrawY();
    const height = this.getHeight();
    const width = scrollView.w;
    draw.offset(dx, dy);
    draw.attr({
      fillStyle: index.getBackground(),
    });
    draw.fillRect(0, 0, width, height);
    draw.offset(0, 0);
  }

  /**
   *  绘制文字
   */
  drawFont() {
    const dx = this.getDrawX();
    const dy = this.getDrawY();
    const scrollView = this.getScrollView();
    const height = this.getHeight();
    const { table } = this;
    const {
      draw, cols, index,
    } = table;
    const { sci, eci } = scrollView;
    draw.offset(dx, dy);
    draw.attr({
      textAlign: 'center',
      textBaseline: 'middle',
      font: `${index.getSize()}px Arial`,
      fillStyle: index.getColor(),
    });
    cols.eachWidth(sci, eci, (i, cw, x) => {
      draw.fillText(PlainUtils.stringAt(i), x + (cw / 2), height / 2);
    });
    draw.offset(0, 0);
  }

}

// ============================ 表格冻结区域内容绘制 =============================

class XTableFrozenLeftIndex extends XTableLeftIndexUI {

  getWidth() {
    if (PlainUtils.isNumber(this.width)) {
      return this.width;
    }
    const { table } = this;
    const { index } = table;
    const width = index.getWidth();
    this.width = width;
    return width;
  }

  getHeight() {
    if (PlainUtils.isNumber(this.height)) {
      return this.height;
    }
    const { table } = this;
    const { xFixedMeasure } = table;
    const height = xFixedMeasure.getHeight();
    this.height = height;
    return height;
  }

  getX() {
    if (PlainUtils.isNumber(this.x)) {
      return this.x;
    }
    const x = 0;
    this.x = x;
    return x;
  }

  getY() {
    if (PlainUtils.isNumber(this.y)) {
      return this.y;
    }
    const { table } = this;
    const { index } = table;
    const y = index.getHeight();
    this.y = y;
    return y;
  }

  getScrollView() {
    if (PlainUtils.isNotUnDef(this.scrollView)) {
      return this.scrollView.clone();
    }
    const { table } = this;
    const {
      rows, cols, xFixedView,
    } = table;
    const fixedView = xFixedView.getFixedView();
    const view = new RectRange(fixedView.sri, 0, fixedView.eri, 0);
    view.w = cols.rectRangeSumWidth(view);
    view.h = rows.rectRangeSumHeight(view);
    this.scrollView = view;
    return view.clone();
  }

  getFullScrollView() {
    if (PlainUtils.isNotUnDef(this.fullScrollView)) {
      return this.fullScrollView.clone();
    }
    const fullScrollView = this.getScrollView();
    this.fullScrollView = fullScrollView;
    return fullScrollView.clone();
  }

  getViewMode() {
    this.viewMode = VIEW_MODE.STATIC;
    return VIEW_MODE.STATIC;
  }

  render() {
    const { table } = this;
    const renderMode = table.getRenderMode();
    if (renderMode === RENDER_MODE.RENDER || renderMode === RENDER_MODE.SCALE) {
      super.render();
    }
  }

}

class XTableFrozenContent extends XTableContentUI {

  getWidth() {
    if (PlainUtils.isNumber(this.width)) {
      return this.width;
    }
    const { table } = this;
    const { xFixedMeasure } = table;
    const width = xFixedMeasure.getWidth();
    this.width = width;
    return width;
  }

  getHeight() {
    if (PlainUtils.isNumber(this.height)) {
      return this.height;
    }
    const { table } = this;
    const { xFixedMeasure } = table;
    const height = xFixedMeasure.getHeight();
    this.height = height;
    return height;
  }

  getX() {
    if (PlainUtils.isNumber(this.x)) {
      return this.x;
    }
    const { table } = this;
    const { index } = table;
    const x = index.getWidth();
    this.x = x;
    return x;
  }

  getY() {
    if (PlainUtils.isNumber(this.y)) {
      return this.y;
    }
    const { table } = this;
    const { index } = table;
    const y = index.getHeight();
    this.y = y;
    return y;
  }

  getScrollView() {
    if (PlainUtils.isNotUnDef(this.scrollView)) {
      return this.scrollView.clone();
    }
    const { table } = this;
    const {
      rows, cols, xFixedView,
    } = table;
    const view = xFixedView.getFixedView();
    view.w = cols.rectRangeSumWidth(view);
    view.h = rows.rectRangeSumHeight(view);
    this.scrollView = view;
    return view.clone();
  }

  getFullScrollView() {
    if (PlainUtils.isNotUnDef(this.fullScrollView)) {
      return this.fullScrollView.clone();
    }
    const fullScrollView = this.getScrollView();
    this.fullScrollView = fullScrollView;
    return fullScrollView.clone();
  }

  getViewMode() {
    this.viewMode = VIEW_MODE.STATIC;
    return VIEW_MODE.STATIC;
  }

  render() {
    const { table } = this;
    const renderMode = table.getRenderMode();
    if (renderMode === RENDER_MODE.RENDER || renderMode === RENDER_MODE.SCALE) {
      super.render();
    }
  }

}

class XTableFrozenTopIndex extends XTableTopIndexUI {

  getWidth() {
    if (PlainUtils.isNumber(this.width)) {
      return this.width;
    }
    const { table } = this;
    const { xFixedMeasure } = table;
    const width = xFixedMeasure.getWidth();
    this.width = width;
    return width;
  }

  getHeight() {
    if (PlainUtils.isNumber(this.height)) {
      return this.height;
    }
    const { table } = this;
    const { index } = table;
    const height = index.getHeight();
    this.height = height;
    return height;
  }

  getX() {
    if (PlainUtils.isNumber(this.x)) {
      return this.x;
    }
    const { table } = this;
    const { index } = table;
    const x = index.getWidth();
    this.x = x;
    return x;
  }

  getY() {
    if (PlainUtils.isNumber(this.y)) {
      return this.y;
    }
    const y = 0;
    this.y = y;
    return y;
  }

  getScrollView() {
    if (PlainUtils.isNotUnDef(this.scrollView)) {
      return this.scrollView.clone();
    }
    const { table } = this;
    const {
      rows, cols, xFixedView,
    } = table;
    const fixedView = xFixedView.getFixedView();
    const view = new RectRange(0, fixedView.sci, 0, fixedView.eci);
    view.w = cols.rectRangeSumWidth(view);
    view.h = rows.rectRangeSumHeight(view);
    this.scrollView = view;
    return view.clone();
  }

  getFullScrollView() {
    if (PlainUtils.isNotUnDef(this.fullScrollView)) {
      return this.fullScrollView.clone();
    }
    const fullScrollView = this.getScrollView();
    this.fullScrollView = fullScrollView;
    return fullScrollView.clone();
  }

  getViewMode() {
    this.viewMode = VIEW_MODE.STATIC;
    return VIEW_MODE.STATIC;
  }

  render() {
    const { table } = this;
    const renderMode = table.getRenderMode();
    if (renderMode === RENDER_MODE.RENDER || renderMode === RENDER_MODE.SCALE) {
      super.render();
    }
  }

}

// ============================ 表格动态区域内容绘制 =============================

class XTableLeftIndex extends XTableLeftIndexUI {

  getWidth() {
    if (PlainUtils.isNumber(this.width)) {
      return this.width;
    }
    const { table } = this;
    const { index } = table;
    const width = index.getWidth();
    this.width = width;
    return width;
  }

  getHeight() {
    if (PlainUtils.isNumber(this.height)) {
      return this.height;
    }
    const { table } = this;
    const { xTop } = table;
    const { index } = table;
    const height = table.visualHeight() - (index.getHeight() + xTop.getHeight());
    this.height = height;
    return height;
  }

  getX() {
    if (PlainUtils.isNumber(this.x)) {
      return this.x;
    }
    const x = 0;
    this.x = x;
    return x;
  }

  getY() {
    if (PlainUtils.isNumber(this.y)) {
      return this.y;
    }
    const { table } = this;
    const { xTop } = table;
    const { index } = table;
    const y = index.getHeight() + xTop.getHeight();
    this.y = y;
    return y;
  }

  getScrollView() {
    if (PlainUtils.isNotUnDef(this.scrollView)) {
      return this.scrollView.clone();
    }
    const { table } = this;
    const { xTableAreaView } = table;
    const { index } = table;
    const renderMode = table.getRenderMode();
    const scrollView = xTableAreaView.getScrollView();
    const enterView = xTableAreaView.getScrollEnterView();
    const view = PlainUtils.isNotUnDef(enterView) && renderMode === RENDER_MODE.SCROLL
      ? enterView
      : scrollView;
    view.sci = 0;
    view.eci = 0;
    view.w = index.getWidth();
    this.scrollView = view;
    return view.clone();
  }

  getFullScrollView() {
    if (PlainUtils.isNotUnDef(this.fullScrollView)) {
      return this.fullScrollView.clone();
    }
    const { table } = this;
    const { index } = table;
    const { xTableAreaView } = table;
    const scrollView = xTableAreaView.getScrollView();
    scrollView.sci = 0;
    scrollView.eci = 0;
    scrollView.w = index.getWidth();
    this.fullScrollView = scrollView;
    return scrollView.clone();
  }

  getViewMode() {
    if (PlainUtils.isNotUnDef(this.viewMode)) {
      return this.viewMode;
    }
    const { table } = this;
    const { xTableAreaView } = table;
    const { cols } = table;
    const lastScrollView = xTableAreaView.getLastScrollView();
    const scrollView = xTableAreaView.getScrollView();
    if (PlainUtils.isNotUnDef(lastScrollView)) {
      lastScrollView.sci = 0;
      lastScrollView.eci = 0;
      lastScrollView.w = cols.sectionSumWidth(lastScrollView.sci, lastScrollView.eci);
    }
    scrollView.sci = 0;
    scrollView.eci = 0;
    scrollView.w = cols.sectionSumWidth(scrollView.sci, scrollView.eci);
    const viewMode = XTableScrollView.viewMode(lastScrollView, scrollView);
    this.viewMode = viewMode;
    return viewMode;
  }

}

class XTableLeft extends XTableContentUI {

  getWidth() {
    if (PlainUtils.isNumber(this.width)) {
      return this.width;
    }
    const { table } = this;
    const { xFixedMeasure } = table;
    const width = xFixedMeasure.getWidth();
    this.width = width;
    return width;
  }

  getHeight() {
    if (PlainUtils.isNumber(this.height)) {
      return this.height;
    }
    const { table } = this;
    const { xTop } = table;
    const { index } = table;
    const height = table.visualHeight() - (index.getHeight() + xTop.getHeight());
    this.height = height;
    return height;
  }

  getX() {
    if (PlainUtils.isNumber(this.x)) {
      return this.x;
    }
    const { table } = this;
    const { index } = table;
    const x = index.getWidth();
    this.x = x;
    return x;
  }

  getY() {
    if (PlainUtils.isNumber(this.y)) {
      return this.y;
    }
    const { table } = this;
    const { xTop } = table;
    const { index } = table;
    const y = index.getHeight() + xTop.getHeight();
    this.y = y;
    return y;
  }

  getScrollView() {
    if (PlainUtils.isNotUnDef(this.scrollView)) {
      return this.scrollView.clone();
    }
    const { table } = this;
    const { xFixedView } = table;
    const { cols } = table;
    const { xTableAreaView } = table;
    const renderMode = table.getRenderMode();
    const fixedView = xFixedView.getFixedView();
    const scrollView = xTableAreaView.getScrollView();
    const enterView = xTableAreaView.getScrollEnterView();
    const view = PlainUtils.isNotUnDef(enterView) && renderMode === RENDER_MODE.SCROLL
      ? enterView
      : scrollView;
    view.sci = fixedView.sci;
    view.eci = fixedView.eci;
    view.w = cols.sectionSumWidth(view.sci, view.eci);
    this.scrollView = view;
    return view.clone();
  }

  getFullScrollView() {
    if (PlainUtils.isNotUnDef(this.fullScrollView)) {
      return this.fullScrollView.clone();
    }
    const { table } = this;
    const { xFixedView } = table;
    const { cols } = table;
    const { xTableAreaView } = table;
    const fixedView = xFixedView.getFixedView();
    const scrollView = xTableAreaView.getScrollView();
    scrollView.sci = fixedView.sci;
    scrollView.eci = fixedView.eci;
    scrollView.w = cols.sectionSumWidth(scrollView.sci, scrollView.eci);
    this.fullScrollView = scrollView;
    return scrollView.clone();
  }

  getViewMode() {
    if (PlainUtils.isNotUnDef(this.viewMode)) {
      return this.viewMode;
    }
    const { table } = this;
    const { xTableAreaView } = table;
    const { cols } = table;
    const { xFixedView } = table;
    const fixedView = xFixedView.getFixedView();
    const lastScrollView = xTableAreaView.getLastScrollView();
    const scrollView = xTableAreaView.getScrollView();
    if (PlainUtils.isNotUnDef(lastScrollView)) {
      lastScrollView.sci = fixedView.sci;
      lastScrollView.eci = fixedView.eci;
      lastScrollView.w = cols.sectionSumWidth(lastScrollView.sci, lastScrollView.eci);
    }
    scrollView.sci = fixedView.sci;
    scrollView.eci = fixedView.eci;
    scrollView.w = cols.sectionSumWidth(scrollView.sci, scrollView.eci);
    const viewMode = XTableScrollView.viewMode(lastScrollView, scrollView);
    this.viewMode = viewMode;
    return viewMode;
  }

}

class XTableTopIndex extends XTableTopIndexUI {

  getWidth() {
    if (PlainUtils.isNumber(this.width)) {
      return this.width;
    }
    const { table } = this;
    const { xLeft } = table;
    const { index } = table;
    const width = table.visualWidth() - (index.getWidth() + xLeft.getWidth());
    this.width = width;
    return width;
  }

  getHeight() {
    if (PlainUtils.isNumber(this.height)) {
      return this.height;
    }
    const { table } = this;
    const { index } = table;
    const height = index.getHeight();
    this.height = height;
    return height;
  }

  getX() {
    if (PlainUtils.isNumber(this.x)) {
      return this.x;
    }
    const { table } = this;
    const { xLeft } = table;
    const { index } = table;
    const x = index.getWidth() + xLeft.getWidth();
    this.x = x;
    return x;
  }

  getY() {
    if (PlainUtils.isNumber(this.y)) {
      return this.y;
    }
    const y = 0;
    this.y = y;
    return y;
  }

  getScrollView() {
    if (PlainUtils.isNotUnDef(this.scrollView)) {
      return this.scrollView.clone();
    }
    const { table } = this;
    const { index } = table;
    const { xTableAreaView } = table;
    const renderMode = table.getRenderMode();
    const scrollView = xTableAreaView.getScrollView();
    const enterView = xTableAreaView.getScrollEnterView();
    const view = PlainUtils.isNotUnDef(enterView) && renderMode === RENDER_MODE.SCROLL
      ? enterView
      : scrollView;
    view.sri = 0;
    view.eri = 0;
    view.h = index.getHeight();
    this.scrollView = view;
    return view.clone();
  }

  getFullScrollView() {
    if (PlainUtils.isNotUnDef(this.fullScrollView)) {
      return this.fullScrollView.clone();
    }
    const { table } = this;
    const { index } = table;
    const { xTableAreaView } = table;
    const scrollView = xTableAreaView.getScrollView();
    scrollView.sri = 0;
    scrollView.eri = 0;
    scrollView.h = index.getHeight();
    this.fullScrollView = scrollView;
    return scrollView.clone();
  }

  getViewMode() {
    if (PlainUtils.isNotUnDef(this.viewMode)) {
      return this.viewMode;
    }
    const { table } = this;
    const { xTableAreaView } = table;
    const { rows } = table;
    const lastScrollView = xTableAreaView.getLastScrollView();
    const scrollView = xTableAreaView.getScrollView();
    if (PlainUtils.isNotUnDef(lastScrollView)) {
      lastScrollView.sri = 0;
      lastScrollView.eri = 0;
      lastScrollView.h = rows.sectionSumHeight(lastScrollView.sri, lastScrollView.eri);
    }
    scrollView.sri = 0;
    scrollView.eri = 0;
    scrollView.h = rows.sectionSumHeight(scrollView.sri, scrollView.eri);
    const viewMode = XTableScrollView.viewMode(lastScrollView, scrollView);
    this.viewMode = viewMode;
    return viewMode;
  }

}

class XTableTop extends XTableContentUI {

  getWidth() {
    if (PlainUtils.isNumber(this.width)) {
      return this.width;
    }
    const { table } = this;
    const { xLeft } = table;
    const { index } = table;
    const width = table.visualWidth() - (index.getWidth() + xLeft.getWidth());
    this.width = width;
    return width;
  }

  getHeight() {
    if (PlainUtils.isNumber(this.height)) {
      return this.height;
    }
    const { table } = this;
    const { xFixedMeasure } = table;
    const height = xFixedMeasure.getHeight();
    this.height = height;
    return height;
  }

  getX() {
    if (PlainUtils.isNumber(this.x)) {
      return this.x;
    }
    const { table } = this;
    const { xLeft } = table;
    const { index } = table;
    const x = index.getWidth() + xLeft.getWidth();
    this.x = x;
    return x;
  }

  getY() {
    if (PlainUtils.isNumber(this.y)) {
      return this.y;
    }
    const { table } = this;
    const { index } = table;
    const y = index.getHeight();
    this.y = y;
    return y;
  }

  getScrollView() {
    if (PlainUtils.isNotUnDef(this.scrollView)) {
      return this.scrollView.clone();
    }
    const { table } = this;
    const { xFixedView } = table;
    const { rows } = table;
    const { xTableAreaView } = table;
    const renderMode = table.getRenderMode();
    const fixedView = xFixedView.getFixedView();
    const scrollView = xTableAreaView.getScrollView();
    const enterView = xTableAreaView.getScrollEnterView();
    const view = PlainUtils.isNotUnDef(enterView) && renderMode === RENDER_MODE.SCROLL
      ? enterView
      : scrollView;
    view.sri = fixedView.sri;
    view.eri = fixedView.eri;
    view.h = rows.sectionSumHeight(view.sri, view.eri);
    this.scrollView = view;
    return view.clone();
  }

  getFullScrollView() {
    if (PlainUtils.isNotUnDef(this.fullScrollView)) {
      return this.fullScrollView.clone();
    }
    const { table } = this;
    const { xFixedView } = table;
    const { rows } = table;
    const { xTableAreaView } = table;
    const fixedView = xFixedView.getFixedView();
    const scrollView = xTableAreaView.getScrollView();
    scrollView.sri = fixedView.sri;
    scrollView.eri = fixedView.eri;
    scrollView.h = rows.sectionSumHeight(scrollView.sri, scrollView.eri);
    this.fullScrollView = scrollView;
    return scrollView.clone();
  }

  getViewMode() {
    if (PlainUtils.isNotUnDef(this.viewMode)) {
      return this.viewMode;
    }
    const { table } = this;
    const { xTableAreaView } = table;
    const { rows } = table;
    const { xFixedView } = table;
    const fixedView = xFixedView.getFixedView();
    const lastScrollView = xTableAreaView.getLastScrollView();
    const scrollView = xTableAreaView.getScrollView();
    if (PlainUtils.isNotUnDef(lastScrollView)) {
      lastScrollView.sri = fixedView.sri;
      lastScrollView.eri = fixedView.eri;
      lastScrollView.h = rows.sectionSumHeight(lastScrollView.sci, lastScrollView.eci);
    }
    scrollView.sri = fixedView.sri;
    scrollView.eri = fixedView.eri;
    scrollView.h = rows.sectionSumHeight(scrollView.sci, scrollView.eci);
    const viewMode = XTableScrollView.viewMode(lastScrollView, scrollView);
    this.viewMode = viewMode;
    return viewMode;
  }

}

class XTableContent extends XTableContentUI {

  getWidth() {
    if (PlainUtils.isNumber(this.width)) {
      return this.width;
    }
    const { table } = this;
    const { index } = table;
    const { xLeft } = table;
    const width = table.visualWidth() - (index.getWidth() + xLeft.getWidth());
    this.width = width;
    return width;
  }

  getHeight() {
    if (PlainUtils.isNumber(this.height)) {
      return this.height;
    }
    const { table } = this;
    const { xTop } = table;
    const { index } = table;
    const height = table.visualHeight() - (index.getHeight() + xTop.getHeight());
    this.height = height;
    return height;
  }

  getX() {
    if (PlainUtils.isNumber(this.x)) {
      return this.x;
    }
    const { table } = this;
    const { xLeft } = table;
    const { index } = table;
    const x = index.getWidth() + xLeft.getWidth();
    this.x = x;
    return x;
  }

  getY() {
    if (PlainUtils.isNumber(this.y)) {
      return this.y;
    }
    const { table } = this;
    const { xTop } = table;
    const { index } = table;
    const y = index.getHeight() + xTop.getHeight();
    this.y = y;
    return y;
  }

  getScrollView() {
    if (PlainUtils.isNotUnDef(this.scrollView)) {
      return this.scrollView.clone();
    }
    const { table } = this;
    const { xTableAreaView } = table;
    const renderMode = table.getRenderMode();
    const scrollView = xTableAreaView.getScrollView();
    const enterView = xTableAreaView.getScrollEnterView();
    const view = PlainUtils.isNotUnDef(enterView) && renderMode === RENDER_MODE.SCROLL
      ? enterView
      : scrollView;
    this.scrollView = view;
    return view.clone();
  }

  getFullScrollView() {
    if (PlainUtils.isNotUnDef(this.fullScrollView)) {
      return this.fullScrollView.clone();
    }
    const { table } = this;
    const { xTableAreaView } = table;
    const scrollView = xTableAreaView.getScrollView();
    this.fullScrollView = scrollView;
    return scrollView.clone();
  }

  getViewMode() {
    if (PlainUtils.isNotUnDef(this.viewMode)) {
      return this.viewMode;
    }
    const { table } = this;
    const { xTableAreaView } = table;
    const lastScrollView = xTableAreaView.getLastScrollView();
    const scrollView = xTableAreaView.getScrollView();
    const viewMode = XTableScrollView.viewMode(lastScrollView, scrollView);
    this.viewMode = viewMode;
    return viewMode;
  }

}

// =============================== XTableStyle ==============================

class XTableStyle extends Widget {

  /**
   * xTableScrollView
   * @param xTableScrollView
   * @param settings
   * @param xFixedView
   * @param xIteratorBuilder
   * @param scroll
   */
  constructor({
    xTableScrollView,
    settings,
    xFixedView,
    xIteratorBuilder,
    scroll,
  }) {
    super(`${cssPrefix}-table-canvas`, 'canvas');
    // 表格设置
    this.settings = settings;
    // 冻结的视图
    this.xFixedView = xFixedView;
    // 滚动的坐标
    this.scroll = scroll;
    // 渲染模式
    this.renderMode = RENDER_MODE.RENDER;
    // 线段优化
    this.optimizeEnable = true;
    // 迭代器
    this.xIteratorBuilder = xIteratorBuilder;
    // 表格数据配置
    this.xTableData = new XTableDataItems(this.settings.data);
    this.scale = new Scale();
    this.index = new Code({
      scaleAdapter: new ScaleAdapter({
        goto: v => XDraw.srcTransformStylePx(this.scale.goto(v)),
      }),
      ...this.settings.index,
    });
    this.rows = new Rows({
      scaleAdapter: new ScaleAdapter({
        goto: v => XDraw.srcTransformStylePx(this.scale.goto(v)),
      }),
      xIteratorBuilder: this.xIteratorBuilder,
      ...this.settings.rows,
    });
    this.cols = new Cols({
      scaleAdapter: new ScaleAdapter({
        goto: v => XDraw.srcTransformStylePx(this.scale.goto(v)),
        back: v => this.scale.back(v),
      }),
      xIteratorBuilder: this.xIteratorBuilder,
      ...this.settings.cols,
    });
    this.cells = new Cells({
      onChange: (ri) => {
        const row = this.rows.getOrNew(ri);
        row.reCkHasAngle = true;
      },
      table: this,
      xTableData: this.xTableData,
      xIteratorBuilder: this.xIteratorBuilder,
    });
    this.merges = new XMerges({
      ...settings.merge,
      xIteratorBuilder: this.xIteratorBuilder,
      xTableData: this.xTableData,
    });
    // 固定区域测量
    this.xFixedMeasure = new XFixedMeasure({
      fixedView: this.xFixedView,
      cols: this.cols,
      rows: this.rows,
    });
    // 静态单元格图标
    this.staticCellIcon = new StaticCellIcon({
      data: [],
      cells: this.cells,
      rows: this.rows,
      cols: this.cols,
    });
    // 固定单元格图标
    this.fixedCellIcon = new FixedCellIcon({
      data: [],
      cells: this.cells,
      rows: this.rows,
      cols: this.cols,
    });
    // 表格视图区域
    this.xTableAreaView = new XTableHistoryAreaView({
      xTableScrollView,
      scroll: this.scroll,
      rows: this.rows,
      cols: this.cols,
    });
    // 单元格辅助类
    this.operateCellsHelper = new OperateCellsHelper(this);
    this.textCellsHelper = new TextCellsHelper(this);
    this.styleCellsHelper = new StyleCellsHelper(this);
    // 边框过滤器
    const lBorderFilter = new XLineIteratorFilter({
      logic: XLineIteratorFilter.FILTER_LOGIC.AND,
      stack: [
        new LBorderShow({ cells: this.cells }),
      ],
    });
    const rBorderFilter = new XLineIteratorFilter({
      logic: XLineIteratorFilter.FILTER_LOGIC.AND,
      stack: [
        new RBorderShow({ cells: this.cells }),
      ],
    });
    const tBorderFilter = new XLineIteratorFilter({
      logic: XLineIteratorFilter.FILTER_LOGIC.AND,
      stack: [
        new TBorderShow({ cells: this.cells }),
      ],
    });
    const bBorderFilter = new XLineIteratorFilter({
      logic: XLineIteratorFilter.FILTER_LOGIC.AND,
      stack: [
        new BBorderShow({ cells: this.cells }),
      ],
    });
    // 绘制资源
    this.draw = new XDraw(this.el);
    this.line = new Line(this.draw, {
      bottomShow: (row, col) => {
        const result = bBorderFilter.run({
          row,
          col,
        });
        return result === XLineIteratorFilter.RETURN_TYPE.EXEC;
      },
      topShow: (row, col) => {
        const result = tBorderFilter.run({
          row,
          col,
        });
        return result === XLineIteratorFilter.RETURN_TYPE.EXEC;
      },
      leftShow: (row, col) => {
        const result = lBorderFilter.run({
          row,
          col,
        });
        return result === XLineIteratorFilter.RETURN_TYPE.EXEC;
      },
      rightShow: (row, col) => {
        const result = rBorderFilter.run({
          row,
          col,
        });
        return result === XLineIteratorFilter.RETURN_TYPE.EXEC;
      },
      iFMerge: (row, col) => PlainUtils.isNotEmptyObject(this.merges.getFirstIncludes(row, col)),
      iFMergeFirstRow: (row, col) => this.merges.getFirstIncludes(row, col).sri === row,
      iFMergeLastRow: (row, col) => this.merges.getFirstIncludes(row, col).eri === row,
      iFMergeFirstCol: (row, col) => this.merges.getFirstIncludes(row, col).sci === col,
      iFMergeLastCol: (row, col) => this.merges.getFirstIncludes(row, col).eci === col,
    });
    this.indexGrid = new Grid(this.draw, {
      color: this.index.getGridColor(),
    });
    this.grid = new Grid(this.draw, {
      color: this.settings.table.gridColor,
    });
    this.textFont = new Text({
      scaleAdapter: new ScaleAdapter({
        goto: v => this.scale.goto(v),
      }),
      table: this,
    });
    // 冻结内容
    this.xLeftFrozenIndex = new XTableFrozenLeftIndex(this);
    this.xTopFrozenIndex = new XTableFrozenTopIndex(this);
    this.xTableFrozenContent = new XTableFrozenContent(this);
    // 动态内容
    this.xLeftIndex = new XTableLeftIndex(this);
    this.xTopIndex = new XTableTopIndex(this);
    this.xLeft = new XTableLeft(this);
    this.xTop = new XTableTop(this);
    this.xContent = new XTableContent(this);
    // 细节内容
    this.xTableFrozenFullRect = new XTableFrozenFullRect(this);
    this.xTableFixedBar = new XTableFixedBar(this, settings.xFixedBar);
  }

  /**
   * 获取单元格越界的宽度
   * @param ri
   * @param ci
   * @returns {number}
   */
  getCellContentBoundOutWidth(ri, ci) {
    const { cells } = this;
    const cell = cells.getCell(ri, ci);
    if (!cell) {
      return 0;
    }
    const { cols } = this;
    const { contentWidth, fontAttr } = cell;
    const { align } = fontAttr;
    let boundOutWidth = 0;
    const colWidth = cols.getWidth(ci);
    switch (align) {
      case BaseFont.ALIGN.right:
      case BaseFont.ALIGN.left: {
        boundOutWidth = contentWidth;
        break;
      }
      case BaseFont.ALIGN.center: {
        if (this.isAngleBarCell(ri, ci)) {
          boundOutWidth = contentWidth;
        } else {
          boundOutWidth = colWidth + ((contentWidth - colWidth) / 2);
        }
        break;
      }
    }
    return boundOutWidth;
  }

  /**
   * 获取单元格越界的宽度
   * @param ri
   * @param ci
   * @returns {number}
   */
  getCellStyleBoundOutWidth(ri, ci) {
    const { cells } = this;
    const cell = cells.getCell(ri, ci);
    if (!cell) {
      return 0;
    }
    const { cols } = this;
    let boundOutWidth = 0;
    const colWidth = cols.getWidth(ci);
    if (this.hasAngleCell(ri)) {
      if (this.isAngleBarCell(ri, ci)) {
        const offset = this.getSdistWidth(ri, ci);
        boundOutWidth = colWidth + offset;
      }
    } else {
      boundOutWidth = colWidth;
    }
    return boundOutWidth;
  }

  /**
   * 获取单元格斜率宽度
   * @param row
   * @param col
   */
  getSdistWidth(row, col) {
    const { cells } = this;
    const cell = cells.getCell(row, col);
    if (PlainUtils.isUnDef(cell)) {
      return 0;
    }
    if (cell.leftSdistWidth > 0) {
      return cell.leftSdistWidth;
    }
    if (cell.rightSdistWidth > 0) {
      return cell.rightSdistWidth;
    }
    const { rows } = this;
    const { fontAttr } = cell;
    const { angle } = fontAttr;
    const tilt = RTSinKit.tilt({
      inverse: rows.getHeight(row),
      angle,
    });
    return RTCosKit.nearby({
      tilt,
      angle,
    });
  }

  /**
   * 渲染模式
   */
  getRenderMode() {
    const { renderMode } = this;
    return renderMode;
  }

  /**
   * 画布宽度
   * @returns {null|*}
   */
  visualWidth() {
    return this.el.width;
  }

  /**
   * 画布高度
   * @returns {null|*}
   */
  visualHeight() {
    return this.el.height;
  }

  /**
   * 重置变量区
   */
  reset() {
    const { xTableAreaView } = this;
    const { xLeftFrozenIndex } = this;
    const { xTopFrozenIndex } = this;
    const { xTableFrozenContent } = this;
    const { xLeftIndex } = this;
    const { xTopIndex } = this;
    const { xLeft } = this;
    const { xTop } = this;
    const { xContent } = this;
    xTableAreaView.reset();
    xLeftFrozenIndex.reset();
    xTopFrozenIndex.reset();
    xTableFrozenContent.reset();
    xLeftIndex.reset();
    xTopIndex.reset();
    xLeft.reset();
    xTop.reset();
    xContent.reset();
  }

  /**
   * 界面缩放
   * @param val
   */
  setScale(val = 1) {
    // 清空画布
    this.draw.attr({
      fillStyle: this.settings.table.background,
    });
    this.draw.fullRect();
    // 调整缩放级别
    this.scale.setValue(val);
    // 重新渲染界面
    this.renderMode = RENDER_MODE.SCALE;
    this.resize();
    this.renderMode = RENDER_MODE.RENDER;
  }

  /**
   * 重置界面大小
   */
  resize() {
    const {
      draw, xTableAreaView,
    } = this;
    const box = this.parent()
      .box();
    draw.resize(box.width, box.height);
    xTableAreaView.undo();
    this.reset();
    this.render();
  }

  /**
   * 渲染优化
   */
  optimize() {
    const { styleCellsHelper } = this;
    const { xTableAreaView } = this;
    const scrollView = xTableAreaView.getScrollView();
    let enable = true;
    styleCellsHelper.getCellByViewRange({
      view: scrollView,
      cellsINCallback: (row, col, cell) => {
        const { borderAttr } = cell;
        if (borderAttr.hasDouble()) {
          enable = false;
          return STYLE_BREAK_LOOP.RETURN;
        }
        return STYLE_BREAK_LOOP.CONTINUE;
      },
      mergeCallback: (row, col, cell) => {
        const { borderAttr } = cell;
        if (borderAttr.hasDouble()) {
          enable = false;
          return STYLE_BREAK_LOOP.RETURN;
        }
        return STYLE_BREAK_LOOP.CONTINUE;
      },
    });
    this.optimizeEnable = enable;
  }

  /**
   * 渲染静态界面
   */
  render() {
    const { xFixedView } = this;
    const { xTableFrozenFullRect } = this;
    const { xTableFixedBar } = this;
    const { xLeftFrozenIndex } = this;
    const { xTopFrozenIndex } = this;
    const { xTableFrozenContent } = this;
    const { xLeftIndex } = this;
    const { xTopIndex } = this;
    const { xLeft } = this;
    const { xTop } = this;
    const { xContent } = this;
    this.optimize();
    xTableFrozenFullRect.render();
    if (xFixedView.hasFixedLeft() && xFixedView.hasFixedTop()) {
      xTableFrozenContent.render();
    }
    if (xFixedView.hasFixedTop()) {
      xLeftFrozenIndex.render();
      xTop.render();
    }
    if (xFixedView.hasFixedLeft()) {
      xTopFrozenIndex.render();
      xLeft.render();
    }
    xLeftIndex.render();
    xTopIndex.render();
    xContent.render();
    xTableFixedBar.render();
  }

  /**
   * 渲染滚动界面
   */
  scrolling() {
    const {
      xTableAreaView,
    } = this;
    this.reset();
    this.renderMode = RENDER_MODE.SCROLL;
    this.render();
    xTableAreaView.record();
    this.renderMode = RENDER_MODE.RENDER;
    this.reset();
  }

  /**
   * 当前行是否存在旋转单元格
   * @param row
   * @returns {boolean}
   */
  hasAngleCell(row) {
    const { rows } = this;
    const rowObject = rows.getOrNew(row);
    if (rowObject.reCkHasAngle === false) {
      return rowObject.hasAngelCell;
    }
    const { cols, cells } = this;
    const { len } = cols;
    let hasAngelCell = false;
    for (let i = 0; i < len; i += 1) {
      const cell = cells.getCell(row, i);
      if (cell) {
        const { fontAttr } = cell;
        const { direction } = fontAttr;
        if (direction === BaseFont.TEXT_DIRECTION.ANGLE) {
          hasAngelCell = true;
          break;
        }
      }
    }
    rowObject.setReCkHasAngle(false);
    rowObject.setHasAngelCell(hasAngelCell);
    return hasAngelCell;
  }

  /**
   * 单元格是否旋转
   * @returns {boolean|boolean|*}
   */
  isAngleBarCell(row, col) {
    const { cells, merges } = this;
    const merge = merges.getFirstIncludes(row, col);
    if (PlainUtils.isNotUnDef(merge)) {
      return false;
    }
    const cell = cells.getCell(row, col);
    if (PlainUtils.isUnDef(cell)) {
      return false;
    }
    const { fontAttr, borderAttr } = cell;
    if (fontAttr.direction !== BaseFont.TEXT_DIRECTION.ANGLE) {
      return false;
    }
    const lessZero = fontAttr.angle < 0 && fontAttr.angle > -90;
    const moreZero = fontAttr.angle > 0 && fontAttr.angle < 90;
    return (lessZero || moreZero) && borderAttr.isDisplay();
  }

}

export {
  XTableStyle,
};
