import { TaskManage } from './TaskManage';

class BaseTask {

  constructor() {
    TaskManage.registerTask(this);
  }

  async execute() {
    throw new TypeError('child impl');
  }

  destroy() {
    throw new TypeError('child impl');
  }

}

export {
  BaseTask,
};
