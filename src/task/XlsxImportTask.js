import { BaseTask } from './base/BaseTask';
import Worker from './worker/xlsximport.worker';

class XlsxImportTask extends BaseTask {

  constructor() {
    super();
    this.worker = null;
    this.notice = null;
  }

  async execute(file, dpr, unit, dpi) {
    return new Promise((resolve) => {
      this.resetTask();
      this.notice = resolve;
      const { workerFinish } = this;
      const finish = workerFinish.bind(this);
      this.worker = new Worker();
      this.worker.addEventListener('message', finish);
      this.worker.postMessage({ file, dpr, unit, dpi });
    });
  }

  resetTask() {
    if (this.worker) {
      this.worker.terminate();
    }
    this.worker = null;
    this.notice = null;
  }

  workerFinish(event) {
    this.notice(event);
  }

  destroy() {
    this.resetTask();
  }

}

export {
  XlsxImportTask,
};
