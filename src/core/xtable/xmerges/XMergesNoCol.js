import { XMergesNo } from './XMergesNo';
import { Snapshot } from '../snapshot/Snapshot';

class XMergesNoCol {

  constructor({
    snapshot = new Snapshot(),
  }) {
    this.nos = [];
    this.snapshot = snapshot;
  }

  removeCol(ci) {
    let { snapshot } = this;
    let oldValue;
    let action = {
      undo: () => {
        this.nos.splice(ci, 0, oldValue);
        this.syncNo();
      },
      redo: () => {
        this.nos.splice(ci, 1);
        this.syncNo();
      },
    };
    snapshot.addAction(action);
    action.redo();
  }

  getNo(ci) {
    if (this.nos[ci]) { return this.nos[ci]; }
    this.nos[ci] = new XMergesNo(ci);
    return this.nos[ci];
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

  insertColAfter(ci) {
    let { snapshot } = this;
    let action = {
      undo: () => {
        const next = ci + 1;
        this.nos.splice(next, 1);
        this.syncNo();
      },
      redo: () => {
        const next = ci + 1;
        this.nos.splice(next, 0, new XMergesNo());
        this.syncNo();
      },
    };
    snapshot.addAction(action);
    action.redo();
  }

  insertColBefore(ci) {
    let { snapshot } = this;
    let action = {
      undo: () => {
        this.nos.splice(ci, 1);
        this.syncNo();
      },
      redo: () => {
        this.nos.splice(ci, 0, new XMergesNo());
        this.syncNo();
      },
    };
    snapshot.addAction(action);
    action.redo();
  }

}

export {
  XMergesNoCol,
};
