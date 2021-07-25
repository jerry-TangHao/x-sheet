import { BaseTask } from './base/BaseTask';
import Worker from './worker/sumtotal.worker';

/**
 * 对用户筛选区域做数据统计
 */
class SumTotalTask extends BaseTask {

  /**
   * TotalTask
   */
  constructor() {
    super();
    this.workers = [];
    this.finish = 0;
    this.result = [];
    this.group = 50000;
    this.notice = null;
  }

  /**
   * 统计数据
   * @param range
   * @param data
   * @returns {Promise<void>}
   */
  async execute(range, data) {
    return new Promise((resolve) => {
      this.resetTask();
      this.notice = resolve;
      const { sri, eri, sci, eci } = range;
      const rowGroup = [];
      // 拆分数据
      let count = 1;
      let begin = sri;
      for (let i = sri; i <= eri; i++) {
        if (count % this.group === 0) {
          const item = data.split(begin, i, sci, eci);
          rowGroup.push(item);
          count = 1;
          begin = i + 1;
        } else {
          count++;
        }
      }
      if (count > 1) {
        const item = data.split(begin, eri, sci, eci);
        rowGroup.push(item);
      }
      // 创建worker
      let { length } = rowGroup;
      for (let i = 0; i < length; i++) {
        const group = rowGroup[i];
        this.createWorker(group);
      }
    });
  }

  /**
   * 重置状态
   */
  resetTask() {
    let { length } = this.workers;
    for (let i = 0; i < length; i++) {
      const item = this.workers[i];
      item.terminate();
    }
    this.workers = [];
    this.finish = 0;
    this.result = [];
    this.notice = null;
  }

  /**
   * 创建工作线程
   * @param data
   */
  createWorker(data) {
    const { workers, workerFinish } = this;
    const worker = new Worker();
    const finish = workerFinish.bind(this);
    workers.push(worker);
    worker.addEventListener('message', finish);
    worker.postMessage(data);
  }

  /**
   * 完成通知
   */
  workerFinish(event) {
    this.result.push(event.data);
    this.finish++;
    if (this.finish === this.workers.length) {
      let resultNumber = 0;
      let resultTotal = 0;
      let { length } = this.result;
      for (let i = 0; i < length; i++) {
        const { total, number } = this.result[i];
        resultTotal += total;
        resultNumber += number;
      }
      this.notice({
        number: resultNumber,
        total: resultTotal,
        avg: resultNumber > 0 ? resultTotal / resultNumber : 0,
      });
    }
  }

  /**
   * 销毁
   */
  destroy() {
    let { length } = this.workers;
    for (let i = 0; i < length; i++) {
      const item = this.workers[i];
      item.terminate();
    }
    this.workers = [];
  }

}

export {
  SumTotalTask,
};
