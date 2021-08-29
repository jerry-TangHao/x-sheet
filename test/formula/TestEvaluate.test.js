import { Evaluate, Functions } from '../../src/formula/Compiler.js';

// 注册函数
Functions.register("SUM", (...args) => {
  return args.reduce((a, b) => a + b);
});
Functions.register("TEST", (number) => {
  return number
});

// 运行公式
const evaluateExprs = {
  case1: 'SUM(1,2,3) + 3',
  case2: '2 * (1 + 2)',
  case3: '{1, 2 + 3}',
  case4: '{1, {2 > 1, 4 * (1+2), 6, SUM(1, 1) / 2}, 2 + 3}',
  case5: '{}',
  case6: '2^2',
  case7: '{TEST(10) + 1}',
  case8: '{SUM(10,2) / 6, {}, A3}',
  case9: '1+3',
};

// 公式运行
Object.keys(evaluateExprs).forEach((key) => {
  const expr = evaluateExprs[key];
  console.log(`==========${expr}==========`)
  console.log(Evaluate(expr));
});
