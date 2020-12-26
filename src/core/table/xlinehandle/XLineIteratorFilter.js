class XLineIteratorFilter {

  constructor({
    logic, stack,
  }) {
    this.stack = stack;
    this.logic = logic;
    this.active = null;
  }

  getActive() {
    return this.active;
  }

  run({
    row, col,
  }) {
    const { logic, stack } = this;
    let result = XLineIteratorFilter.RETURN_TYPE.EXEC;
    let active = null;
    switch (logic) {
      case XLineIteratorFilter.FILTER_LOGIC.AND: {
        result = XLineIteratorFilter.RETURN_TYPE.EXEC;
        for (let i = 0; i < stack.length; i += 1) {
          const filter = stack[i];
          const returnValue = filter.run({ row, col });
          if (returnValue !== XLineIteratorFilter.RETURN_TYPE.EXEC) {
            result = XLineIteratorFilter.RETURN_TYPE.JUMP;
            active = filter;
            break;
          }
        }
        break;
      }
      case XLineIteratorFilter.FILTER_LOGIC.OR: {
        result = XLineIteratorFilter.RETURN_TYPE.JUMP;
        for (let i = 0; i < stack.length; i += 1) {
          const filter = stack[i];
          const returnValue = filter.run({ row, col });
          if (returnValue === XLineIteratorFilter.RETURN_TYPE.EXEC) {
            result = XLineIteratorFilter.RETURN_TYPE.EXEC;
            active = filter;
            break;
          }
        }
        break;
      }
    }
    this.active = active;
    return result;
  }

}
XLineIteratorFilter.RETURN_TYPE = {
  EXEC: 1,
  JUMP: 2,
};
XLineIteratorFilter.FILTER_LOGIC = {
  AND: 1,
  OR: 2,
};
XLineIteratorFilter.EMPTY = new XLineIteratorFilter({
  logic: XLineIteratorFilter.FILTER_LOGIC.AND,
  stack: [],
});

export {
  XLineIteratorFilter,
};
