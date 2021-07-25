class LineIteratorFilter {

  constructor({
    logic, stack,
  }) {
    this.active = null;
    this.logic = logic;
    this.stack = stack;
  }

  run({
    row, col, x, y,
  }) {
    const { logic, stack } = this;
    let result = LineIteratorFilter.RETURN_TYPE.EXEC;
    let active = null;
    switch (logic) {
      case LineIteratorFilter.FILTER_LOGIC.AND: {
        result = LineIteratorFilter.RETURN_TYPE.EXEC;
        for (let i = 0; i < stack.length; i += 1) {
          const filter = stack[i];
          const returnValue = filter.run({ row, col, x, y });
          if (returnValue !== LineIteratorFilter.RETURN_TYPE.EXEC) {
            result = LineIteratorFilter.RETURN_TYPE.JUMP;
            active = filter;
            break;
          }
        }
        break;
      }
      case LineIteratorFilter.FILTER_LOGIC.OR: {
        result = LineIteratorFilter.RETURN_TYPE.JUMP;
        for (let i = 0; i < stack.length; i += 1) {
          const filter = stack[i];
          const returnValue = filter.run({ row, col, x, y });
          if (returnValue === LineIteratorFilter.RETURN_TYPE.EXEC) {
            result = LineIteratorFilter.RETURN_TYPE.EXEC;
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

LineIteratorFilter.RETURN_TYPE = {
  EXEC: 1,
  JUMP: 2,
};
LineIteratorFilter.FILTER_LOGIC = {
  AND: 1,
  OR: 2,
};
LineIteratorFilter.EMPTY = new LineIteratorFilter({
  logic: LineIteratorFilter.FILTER_LOGIC.AND,
  stack: [],
});

export {
  LineIteratorFilter,
};
