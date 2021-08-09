import { Compile } from '../../src/formula/Compiler.js';

// 测试公式
const compileExprs = {
  case1: '1,{}',
  case2: 'SUM(1)'
}

// 公式编译
Object.keys(compileExprs).forEach((key) => {
  const expr = compileExprs[key];
  console.log(`==========${expr}==========`)
  console.log(Compile(expr));
});
