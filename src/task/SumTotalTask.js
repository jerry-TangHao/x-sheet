import { BaseTask } from './base/BaseTask';
import SumTotalWorker from './worker/sumtotal.worker';
import SplitDataWorker from './worker/splitdata.worker';

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
    this.group = 10000;
    this.notice = null;
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
    const { workers } = this;
    const worker = new SumTotalWorker();
    workers.push(worker);
    worker.postMessage(data);
    worker.addEventListener('message', (event) => {
      this.finish++;
      this.workerFinish(event.data);
    });
  }

  /**
   * 完成通知
   */
  workerFinish(data) {
    this.result.push(data);
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
   * 统计数据
   * @param range
   * @param items
   * @returns {Promise<void>}
   */
  async execute(range, items) {
    return new Promise(async (resolve) => {
      this.resetTask();
      this.notice = resolve;
      let data = await this.splitData(range, items);
      const { length } = data;
      if (length) {
        for (let i = 0; i < length; i++) {
          this.createWorker(data[i]);
        }
      } else {
        this.workerFinish({
          total: 0,
          number: 0,
        });
      }
    });
  }

  /**
   * 拆分数据
   * @param range
   * @param items
   * @returns {Promise<void>}
   */
  async splitData(range, items) {
    return new Promise((resolve) => {
      const { workers, group } = this;
      const worker = new SplitDataWorker();
      workers.push(worker);
      worker.postMessage({
        range, items, group,
      });
      worker.addEventListener('message', (event) => {
        this.finish++;
        resolve(event.data);
      });
    });
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
