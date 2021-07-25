import { Widget } from '../../libs/Widget';
import { h } from '../../libs/Element';
import { cssPrefix } from '../../const/Constant';

class TaskProgress extends Widget {

  constructor(taskManage) {
    super(`${cssPrefix}-xwork-task-progress`);
    this.progress = h('div', `${cssPrefix}-xwork-task-progress-bar`);
    this.items = [];
    this.taskManage = taskManage;
    this.begin = () => this.show();
    this.end = () => {};
    this.finish = () => this.hide();
    this.children(this.progress);
    this.bind();
    this.hide();
  }

  unbind() {
    const { listen } = this.taskManage;
    listen.removeListen('taskbegin', this.begin);
    listen.removeListen('taskend', this.end);
    listen.removeListen('taskfinish', this.finish);
  }

  bind() {
    const { listen } = this.taskManage;
    listen.registerListen('taskbegin', this.begin);
    listen.registerListen('taskend', this.end);
    listen.registerListen('taskfinish', this.finish);
  }

  destroy() {
    super.destroy();
    this.unbind();
  }

}

export {
  TaskProgress,
};
