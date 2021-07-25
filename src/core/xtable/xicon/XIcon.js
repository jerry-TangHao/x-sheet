/* global Image console */
import { PlainUtils } from '../../../utils/PlainUtils';
import { XDraw } from '../../../canvas/XDraw';
import { Rect } from '../../../canvas/Rect';
import { XIconOffset } from './XIconOffset';
import { Crop } from '../../../canvas/Crop';

/**
 * XIcon
 * @author jerry
 * @date 2020/10/20
 */
class XIcon {

  /**
   * 多图标初始化
   * @param icons
   * @returns {[]}
   */
  static newInstances(icons = []) {
    const instances = [];
    for (let i = 0; i < icons.length; i += 1) {
      const icon = icons[i];
      instances.push(new XIcon(icon));
    }
    return instances;
  }

  /**
   * XIcon
   * @param vertical
   * @param horizontal
   * @param type
   * @param image
   * @param focus
   * @param height
   * @param width
   * @param color
   * @param offset
   * @param onDraw
   * @param onLeave
   * @param onMove
   * @param onDown
   * @param onEnter
   */
  constructor({
    vertical = XIcon.ICON_VERTICAL.CENTER,
    horizontal = XIcon.ICON_HORIZONTAL.RIGHT,
    type = XIcon.ICON_TYPE.image,
    image = PlainUtils.Nul,
    focus = null,
    height = 16,
    width = 16,
    color = 'rgb(255,255,255)',
    offset = { x: 0, y: 0 },
    onDraw = () => {},
    onLeave = () => {},
    onMove = () => {},
    onDown = () => {},
    onEnter = () => {},
  }) {
    this.vertical = vertical;
    this.horizontal = horizontal;
    this.width = width;
    this.height = height;
    this.type = type;
    this.image = image;
    this.color = color;
    this.focus = focus;
    this.offset = new XIconOffset(offset);
    this.onLeave = onLeave;
    this.onMove = onMove;
    this.onDraw = onDraw;
    this.onDown = onDown;
    this.onEnter = onEnter;
    this.rect = null;
  }

  /**
   * 计算绘制坐标
   * @param rect
   * @returns {{x: number, y: number}}
   */
  position(rect) {
    // 图标信息
    const iconHorizontal = this.horizontal;
    const iconVertical = this.vertical;
    const iconOffsetX = XDraw.stylePx(this.offset.x);
    const iconOffsetY = XDraw.stylePx(this.offset.y);
    const iconWidth = XDraw.stylePx(this.width);
    const iconHeight = XDraw.stylePx(this.height);
    // 矩形位置
    const rectX = rect.x;
    const rectY = rect.y;
    const rectWidth = rect.width;
    const rectHeight = rect.height;
    // 计算位置
    let px = 0;
    let py = 0;
    switch (iconHorizontal) {
      case XIcon.ICON_HORIZONTAL.CENTER:
        px = (rectX + rectWidth / 2) - (iconWidth / 2);
        break;
      case XIcon.ICON_HORIZONTAL.LEFT:
        px = rectX;
        break;
      case XIcon.ICON_HORIZONTAL.RIGHT:
        px = rectX + rectWidth - iconWidth;
        break;
    }
    switch (iconVertical) {
      case XIcon.ICON_VERTICAL.CENTER:
        py = (rectY + rectHeight / 2) - (iconHeight / 2);
        break;
      case XIcon.ICON_VERTICAL.TOP:
        py = rectY;
        break;
      case XIcon.ICON_VERTICAL.BOTTOM:
        py = rectY + rectHeight - iconHeight;
        break;
    }
    px += iconOffsetX;
    py += iconOffsetY;
    return new Rect({
      x: px, y: py, width: iconWidth, height: iconHeight,
    });
  }

  /**
   * 加载图片信息
   * @param async
   * @param sync
   */
  loadImage({
    load, sync,
  }) {
    const { image, type } = this;
    switch (type) {
      case XIcon.ICON_TYPE.image:
        if (image instanceof Image) {
          sync(image);
        } else {
          const loadImg = new Image();
          loadImg.src = image;
          if (loadImg.complete) {
            this.image = loadImg;
            sync(this.image);
          } else {
            loadImg.onload = () => {
              this.image = loadImg;
              load(loadImg);
            };
            loadImg.onerror = () => {
              // eslint-disable-next-line no-console
              console.error(`图片加载失败${image}`);
            };
          }
        }
        break;
      case XIcon.ICON_TYPE.draw:
        sync();
        break;
    }
  }

  /**
   * 绘制小图标
   * @param rect
   * @param draw
   */
  drawIcon({
    rect, draw,
  }) {
    const { type } = this;
    this.rect = rect;
    switch (type) {
      case XIcon.ICON_TYPE.image:
        this.drawImage({
          rect, draw,
        });
        break;
      case XIcon.ICON_TYPE.draw:
        this.drawCustom({
          rect, draw,
        });
        break;
    }
  }

  /**
   * 自定义绘制
   * @param rect
   * @param icon
   * @param draw
   */
  drawCustom({
    rect, draw,
  }) {
    this.onDraw({
      rect, draw,
    });
  }

  /**
   * 绘制图片
   * @param rect
   * @param icon
   * @param draw
   */
  drawImage({
    rect, draw,
  }) {
    const image = this.image;
    const color = this.color;
    const positionRect = this.position(rect);
    const {
      x, y, width, height,
    } = positionRect;
    const include = rect.includeRect(positionRect);
    const crop = new Crop({
      rect, draw,
    });
    if (include === false) {
      crop.open();
    }
    if (color) {
      draw.attr({ fillStyle: color });
      draw.fillRect(x, y, width, height);
    }
    draw.drawImage(image, 0, 0, image.width, image.height, x, y, width, height);
    if (include === false) {
      crop.close();
    }
  }

  /**
   * 事件处理
   * @param type
   * @param x
   * @param y
   * @param native
   */
  eventHandle({
    type, x, y, native,
  }) {
    const { rect, focus } = this;
    if (rect) {
      const position = this.position(rect);
      const location = position.inRectPosition(rect);
      const { activate } = focus;
      switch (type) {
        case XIcon.ICON_EVENT_TYPE.MOUSE_DOWN:
          if (location.includePoint(x, y)) {
            focus.setActivate(this);
            this.onDown({
              native, position,
            });
          }
          break;
        case XIcon.ICON_EVENT_TYPE.MOUSE_MOVE:
          if (location.includePoint(x, y)) {
            if (activate !== this) {
              this.onEnter({
                native, position,
              });
            }
            focus.setActivate(this);
            this.onMove({
              native, position,
            });
          } else if (activate) {
            focus.setActivate(null);
            this.onLeave({
              native, position,
            });
          }
          break;
      }
    }
  }

  /**
   * 绘制回调
   * @param callback
   */
  setOnDraw(callback) {
    this.onDraw = callback;
  }

  /**
   * 按下回调
   * @param callback
   */
  setOnDown(callback) {
    this.onDown = callback;
  }

  /**
   * 移动回调
   * @param callback
   */
  setOnMove(callback) {
    this.onMove = callback;
  }

  /**
   * 进入回调
   * @param callback
   */
  setOnEnter(callback) {
    this.onEnter = callback;
  }

  /**
   * 离开回调
   * @param callback
   */
  setOnLeave(callback) {
    this.onLeave = callback;
  }

  /**
   * 设置焦点元素
   * @param focus
   */
  setFocus(focus) {
    this.focus = focus;
  }

}
XIcon.ICON_HORIZONTAL = {
  LEFT: 0,
  RIGHT: 1,
  CENTER: 2,
};
XIcon.ICON_VERTICAL = {
  TOP: 3,
  BOTTOM: 4,
  CENTER: 5,
};
XIcon.ICON_TYPE = {
  image: 1,
  custom: 2,
};
XIcon.ICON_EVENT_TYPE = {
  MOUSE_DOWN: 1,
  MOUSE_MOVE: 2,
};

export { XIcon };
