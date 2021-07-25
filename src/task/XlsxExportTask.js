import { BaseTask } from './base/BaseTask';
import Worker from './worker/xlsxexport.worker';

class XlsxExportTask extends BaseTask {

  constructor() {
    super();
    this.notice = null;
    this.worker = null;
  }

  async execute(workOptions, sheetList, dpr, unit, dpi) {
    return new Promise((resolve) => {
      this.resetTask();
      this.notice = resolve;
      const { workerFinish } = this;
      const finish = workerFinish.bind(this);
      this.worker = new Worker();
      this.worker.addEventListener('message', finish);
      this.worker.postMessage({ workOptions, sheetList, dpr, unit, dpi });
    });
  }

  resetTask() {
    if (this.worker) {
      this.worker.terminate();
    }
    this.notice = null;
    this.worker = null;
  }

  workerFinish(event) {
    this.notice(event);
  }

  destroy() {
    this.resetTask();
  }

}

export {
  XlsxExportTask,
};
