import { Compile } from '../../src/formula/Compiler.js';

// 测试公式
const compileExprs = {
   case1: 'IF(COUNTIF(A$2:A2 C3:C5,A4)>1,"重复","不重复")',
   case2: 'IF(SUM(A3:B3:C3:D4,F5)<>1,"YES", "NO")',
   case3: 'DATEDIF(A2,TODAY(),"y")',
   case4: 'TEXT(MID(A2,7,8),"0-00-00")',
   case5: 'SUMPRODUCT((B$2:B$7>B2)/COUNTIF(B$2:B$7,B$2:B$7))+1',
   case6: 'AVERAGEIF(B2:B7,"男",C2:C7)',
   case7: 'AVERAGEIFS(D2:D7,C2:C7,"男",B2:B7,"销售")',
   case8: 'INDEX(A:A,1+MATCH(COUNTIF(C$1:C1,A$2:A$10)))&""',
   case9: 'LOOKUP(MID(A2,3,2),{"01","02","03"},{"1班","2班","3班"})',
  case10: '6+1',
  case11: '{6+1,7,9,3}',
  case12: '{SUM(LEN(B2:B4))}',
  case13: 'IF(IF(MAX($AN6:$AP6)<0,MIN($AN6:$AP6),MAX($AN6:$AP6))=AN6,"NO",TEXT(COLUMN(A1),"[DBnum1]")&"班")',
  case14: 'IF(IF(MAX($AN6:$AP6)>0,MAX($AN6:$AP6),MIN($AN6:$AP6))=AN6,"NO",CHOOSE(COLUMN(A1),"一班","二班","三班"))',
  case15: 'SUM(OFFSET(B2,0,0,MATCH(F2,A2:A13,0)))',
  case16: 'A6+A1',
  case17: '3+(4+1)',
  case18: '{9,3}',
  case19: 'SUM({9,3}, 1)',
  case20: 'Sheet2!A3+10',
  case21: '2^2',
  case22: 'INDEX(A:A,SMALL(IF(ISNUMBER(FIND($B$1,$A$1:$A$6)),ROW($A$1:$A$6),100),ROW(A1)))&""',
  case23: 'LOOKUP(99,FIND(B$2,TEXT(COUNTIF(C$1:C1,A$1:A$7),";;"&A$1:A$7&REPT(B$2,A$1:A$7=""))),A$1:A$7)&""',
  case24: '{1+1}',
  case25: '{1 + 2}',
  case26: 'SUM(1,2,3) + 3',
  case27: '{1, {2>1, 4, 6, SUM(1,1)}, 2 + 3}',
  case28: '{1, {2 > 1, 4 * (1+2), 6, SUM(1, 1) / 2}, 2 + 3}',
}

// 公式编译
Object.keys(compileExprs).forEach((key) => {
  const expr = compileExprs[key];
  console.log(`==========${expr}==========`)
  console.log(Compile(expr));
});
