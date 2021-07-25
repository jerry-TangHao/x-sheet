/**
 * 数据快照
 */
import { Listen } from '../../../libs/Listen';

class Snapshot {

  /**
   * Snapshot
   */
  constructor() {
    // 撤销
    this.undoStack = [];
    // 反撤销
    this.redoStack = [];
    // 当前记录层
    this.layer = {
      event: '',
      data: [],
    };
    // 启用记录
    this.apply = false;
    // 数据监听
    this.listen = new Listen();
  }

  /**
   * 撤销
   */
  undo() {
    const layer = this.undoStack.pop();
    for (let i = 0, len = layer.data.length; i < len; i++) {
      const action = layer.data[i];
      action.undo();
    }
    this.redoStack.push(layer);
    this.listen.execute('change', layer.event);
  }

  /**
   * 反撤销
   */
  redo() {
    const layer = this.redoStack.pop();
    for (let i = 0, len = layer.data.length; i < len; i++) {
      const action = layer.data[i];
      action.redo();
    }
    this.undoStack.push(layer);
    this.listen.execute('change', layer.event);
  }

  /**
   * 打开快照
   */
  open() {
    this.layer = {
      event: '',
      data: [],
    };
    this.apply = true;
  }

  /**
   * 关闭快照
   */
  close(event) {
    if (this.layer.data.length) {
      this.layer.event = event;
      this.undoStack.push(this.layer);
    }
    this.layer = {
      event: '',
      data: [],
    };
    this.apply = false;
    this.listen.execute('change', event);
  }

  /**
   * 能否反撤销
   * @returns {boolean}
   */
  canRedo() {
    return this.redoStack.length > 0;
  }

  /**
   * 能否撤销
   * @returns {boolean}
   */
  canUndo() {
    return this.undoStack.length > 0;
  }

  /**
   * 添加动作
   * @param action
   */
  addAction(action = {
    undo: () => {},
    redo: () => {},
  }) {
    if (this.apply) {
      this.layer.data.push(action);
    }
  }
}

export {
  Snapshot,
};
