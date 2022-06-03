import { Listen } from '../../lib/Listen';

class TaskManage {

  constructor() {
    this.sleepTasks = [];
    this.activeTasks = [];
    this.listen = new Listen();
  }

  removeTask(task) {
    task.destroy();
    this.sleepTasks = this.sleepTasks.filter(item => item !== task);
    this.activeTasks = this.activeTasks.filter(item => item !== task);
    return this;
  }

  registerTask(task) {
    let index;
    task.execute = new Proxy(task.execute, {
      apply: (target, that, argumentsList) => {
        this.sleepTasks.splice(index, 1);
        this.activeTasks.push(task);
        index = this.activeTasks.length - 1;
        this.listen.execute('taskbegin', task);
        return target.apply(that, argumentsList)
          .then((result) => {
            this.activeTasks.splice(index, 1);
            this.sleepTasks.push(task);
            index = this.sleepTasks.length - 1;
            this.listen.execute('taskend', task);
            if (this.activeTasks.length === 0) {
              this.listen.execute('taskfinish', task);
            }
            return result;
          });
      },
    });
    this.sleepTasks.push(task);
    index = this.sleepTasks.length - 1;
    return this;
  }

  destroy() {
    this.sleepTasks = [];
    this.activeTasks = [];
    this.listen.clear();
  }

}

const taskManage = new TaskManage();

export {
  taskManage as TaskManage,
};
