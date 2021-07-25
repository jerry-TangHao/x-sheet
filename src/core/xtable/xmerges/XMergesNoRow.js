import { XMergesNo } from './XMergesNo';
import { Snapshot } from '../snapshot/Snapshot';

class XMergesNoRow {

  constructor({
    snapshot = new Snapshot(),
  }) {
    this.nos = [];
    this.snapshot = snapshot;
  }

  removeRow(ri) {
    let { snapshot } = this;
    let oldValue;
    let action = {
      undo: () => {
        this.nos.splice(ri, 0, oldValue);
        this.syncNo();
      },
      redo: () => {
        oldValue = this.nos.splice(ri, 1);
        this.syncNo();
      },
    };
    snapshot.addAction(action);
    action.redo();
  }

  getNo(no) {
    if (this.nos[no]) { return this.nos[no]; }
    this.nos[no] = new XMergesNo(no);
    return this.nos[no];
  }

  syncNo() {
    const { nos } = this;
    for (let i = 0, len = nos.length; i < len; i++) {
      let item = nos[i];
      if (item) {
        item.setNo(i);
      }
    }
  }

  insertRowAfter(ri) {
    let { snapshot } = this;
    let action = {
      undo: () => {
        const next = ri + 1;
        this.nos.splice(next, 1);
        this.syncNo();
      },
      redo: () => {
        const next = ri + 1;
        this.nos.splice(next, 0, new XMergesNo());
        this.syncNo();
      },
    };
    snapshot.addAction(action);
    action.redo();
  }

  insertRowBefore(ri) {
    let { snapshot } = this;
    let action = {
      undo: () => {
        this.nos.splice(ri, 1);
        this.syncNo();
      },
      redo: () => {
        this.nos.splice(ri, 0, new XMergesNo());
        this.syncNo();
      },
    };
    snapshot.addAction(action);
    action.redo();
  }

}

export {
  XMergesNoRow,
};
