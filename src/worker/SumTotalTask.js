import { BaseTask } from './base/BaseTask';

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
    this.group = 1000;
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
    const worker = new Worker(new URL('./task/sumtotal.worker.js', import.meta.url));
    workers.push(worker);
    worker.postMessage(data);
    worker.addEventListener('message', (event) => {
      worker.terminate();
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
      let splitGroup =  this.splitGroup(range);
      this.resetTask();
      this.notice = resolve;
      if (splitGroup.length > 0) {
        for (let i = 0; i < splitGroup.length; i++) {
          let group = splitGroup[i];
          let data = items.slice(group.sri, group.eri + 1)
              .map(items => items.slice(group.sci, group.eci + 1));
          this.createWorker(data);
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
   * 拆分数据组
   * @param range
   * @returns {Array<{sri: number, eri: number, sci: number, eci: number}>}
   */
  splitGroup(range) {
    let group = this.group;
    let record = [];
    let checkPoint = range.sri;
    for (let index = range.sri, split = 0; index <= range.eri; index ++, split ++) {
      if (split > 0 && split % group === 0) {
        record.push({
          sri: checkPoint,
          eri: index - 1,
          sci: range.sci,
          eci: range.eci,
        });
        checkPoint = index;
        split = 0;
      }
    }
    if (checkPoint == range.sri) {
      record.push({
        sri: range.sri,
        eri: range.eri,
        sci: range.sci,
        eci: range.eci,
      })
    } else if (checkPoint < range.eri) {
      record.push({
        sri: checkPoint,
        eri: range.eri,
        sci: range.sci,
        eci: range.eci,
      });
    }
    return record;
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
