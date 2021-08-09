const cssPrefix = 'x-sheet';
const XSheetVersion = `${cssPrefix} 1.0.0-develop`;
const Constant = {};
Constant.WORK_BODY_EVENT_TYPE = {
  CHANGE_ACTIVE: 'changeactive',
  REMOVE_SHEET: 'removesheet',
};
Constant.SYSTEM_EVENT_TYPE = {
  MOUSE_MOVE: 'mousemove',
  MOUSE_DOWN: 'mousedown',
  CONTEXT_MENU: 'contextmenu',
  SCROLL: 'scroll',
  RESIZE: 'resize',
  MOUSE_UP: 'mouseup',
  INPUT: 'input',
  KEY_DOWN: 'keydown',
  KEY_UP: 'keyup',
  MOUSE_OVER: 'mouseover',
  MOUSE_LEAVE: 'mouseleave',
  MOUSE_WHEEL: 'wheel',
  MOUSE_ENTER: 'mouseenter',
  CLICK: 'click',
  FOCUS: 'focus',
  DRAG_START: 'dragstart',
  CHANGE: 'change',
  VISIBILITY_CHANGE: 'visibilitychange',
};
Constant.TABLE_EVENT_TYPE = {
  RENDER: 'render',
  SNAPSHOT_CHANGE: 'snapshotchange',
  CHANGE_ROW_HEIGHT: 'changerowheight',
  CHANGE_COL_WIDTH: 'changecolwidth',
  SCALE_CHANGE: 'scalechange',
  EDIT_START: 'editstart',
  EDIT_INPUT: 'editinput',
  EDIT_FINISH: 'editfinish',
  REMOVE_ROW: 'removerow',
  REMOVE_COL: 'removecol',
  ADD_NEW_ROW: 'addnewrow',
  ADD_NEW_COL: 'addnewcol',
  FIXED_CHANGE: 'fixedchange',
  FIXED_COL_CHANGE: 'fixedcolchange',
  FIXED_ROW_CHANGE: 'fixedrowchange',
  SELECT_OVER: 'selectover',
  SELECT_DOWN: 'selectdown',
  SELECT_CHANGE: 'selectchange',
  DATA_CHANGE: 'datachange',
  RESIZE_CHANGE: 'resizechange',
};
Constant.FORM_EVENT_TYPE = {
  SEARCH_INPUT_CHANGE: 'searchinputchange',
  PLAIN_INPUT_CHANGE: 'plaininputchange',
  FORM_SELECT_CHANGE: 'formselectchange',
};
export {
  XSheetVersion,
  Constant,
  cssPrefix,
};
