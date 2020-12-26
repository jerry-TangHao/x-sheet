import { XEvent } from './XEvent';

class Clipboard {

  constructor({
    target = document.body,
    filter = () => false,
    paste = () => {},
  } = {}) {
    this.target = target;
    this.filter = filter;
    this.paste = paste;
    this.bind();
  }

  bind() {
    const { target, paste, filter } = this;
    XEvent.bind(target, "paste", (e) => {
      if (filter()) {
        paste(e);
      }
    });
  }

}

export {
  Clipboard
}
