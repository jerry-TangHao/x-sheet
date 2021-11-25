import { Compile, Evaluate, Functions } from '../../src/formula/Compiler';

test('compiler formula expr', () => {
  [{
    'formula': 'IF(COUNTIF(A$2:A2 C3:C5,A4)>1,"重复","不重复")',
    'instruct': 'OPush A$2\r\nOPush A2\r\nuni\r\nOPush C3\r\nOPush C5\r\nuni\r\ncommon\r\nOPush A4\r\ninvoke COUNTIF 2\r\nNPush 1\r\nifge\r\nSPush 重复\r\nSPush 不重复\r\ninvoke IF 3'
  }, {
    'formula': 'IF(SUM(A3:B3:C3:D4,F5)<>1,"YES", "NO")',
    'instruct': 'OPush A3\r\nOPush B3\r\nuni\r\nOPush C3\r\nuni\r\nOPush D4\r\nuni\r\nOPush F5\r\ninvoke SUM 2\r\nNPush 1\r\nifne\r\nSPush YES\r\nSPush NO\r\ninvoke IF 3'
  }, {
    'formula': 'DATEDIF(A2,TODAY(),"y")',
    'instruct': 'OPush A2\r\ninvoke TODAY 0\r\nSPush y\r\ninvoke DATEDIF 3'
  }, {
    'formula': 'TEXT(MID(A2,7,8),"0-00-00")',
    'instruct': 'OPush A2\r\nNPush 7\r\nNPush 8\r\ninvoke MID 3\r\nSPush 0-00-00\r\ninvoke TEXT 2'
  }, {
    'formula': 'SUMPRODUCT((B$2:B$7>B2)/COUNTIF(B$2:B$7,B$2:B$7))+1',
    'instruct': 'OPush B$2\r\nOPush B$7\r\nuni\r\nOPush B2\r\nifge\r\nOPush B$2\r\nOPush B$7\r\nuni\r\nOPush B$2\r\nOPush B$7\r\nuni\r\ninvoke COUNTIF 2\r\ndiv\r\ninvoke SUMPRODUCT 1\r\nNPush 1\r\nadd'
  }, {
    'formula': 'AVERAGEIF(B2:B7,"男",C2:C7)',
    'instruct': 'OPush B2\r\nOPush B7\r\nuni\r\nSPush 男\r\nOPush C2\r\nOPush C7\r\nuni\r\ninvoke AVERAGEIF 3'
  }, {
    'formula': 'AVERAGEIFS(D2:D7,C2:C7,"男",B2:B7,"销售")',
    'instruct': 'OPush D2\r\nOPush D7\r\nuni\r\nOPush C2\r\nOPush C7\r\nuni\r\nSPush 男\r\nOPush B2\r\nOPush B7\r\nuni\r\nSPush 销售\r\ninvoke AVERAGEIFS 5'
  }, {
    'formula': 'INDEX(A:A,1+MATCH(COUNTIF(C$1:C1,A$2:A$10)))&""',
    'instruct': 'OPush A\r\nOPush A\r\nuni\r\nNPush 1\r\nOPush C$1\r\nOPush C1\r\nuni\r\nOPush A$2\r\nOPush A$10\r\nuni\r\ninvoke COUNTIF 2\r\ninvoke MATCH 1\r\nadd\r\ninvoke INDEX 2\r\nSPush \r\nlink'
  }, {
    'formula': 'LOOKUP(MID(A2,3,2),{"01","02","03"},{"1班","2班","3班"})',
    'instruct': 'OPush A2\r\nNPush 3\r\nNPush 2\r\ninvoke MID 3\r\nSPush 01\r\nSPush 02\r\nSPush 03\r\nnewarray 3\r\nSPush 1班\r\nSPush 2班\r\nSPush 3班\r\nnewarray 3\r\ninvoke LOOKUP 3'
  }, {
    'formula': '6+1',
    'instruct': 'NPush 6\r\nNPush 1\r\nadd'
  }, {
    'formula': '{6+1,7,9,3}',
    'instruct': 'NPush 6\r\nNPush 1\r\nadd\r\nNPush 7\r\nNPush 9\r\nNPush 3\r\nnewarray 4'
  }, {
    'formula': '{SUM(LEN(B2:B4))}',
    'instruct': 'OPush B2\r\nOPush B4\r\nuni\r\ninvoke LEN 1\r\ninvoke SUM 1\r\nnewarray 1'
  }, {
    'formula': 'IF(IF(MAX($AN6:$AP6)<0,MIN($AN6:$AP6),MAX($AN6:$AP6))=AN6,"NO",TEXT(COLUMN(A1),"[DBnum1]")&"班")',
    'instruct': 'OPush $AN6\r\nOPush $AP6\r\nuni\r\ninvoke MAX 1\r\nNPush 0\r\nifgt\r\nOPush $AN6\r\nOPush $AP6\r\nuni\r\ninvoke MIN 1\r\nOPush $AN6\r\nOPush $AP6\r\nuni\r\ninvoke MAX 1\r\ninvoke IF 3\r\nOPush AN6\r\nifeq\r\nSPush NO\r\nOPush A1\r\ninvoke COLUMN 1\r\nSPush [DBnum1]\r\ninvoke TEXT 2\r\nSPush 班\r\nlink\r\ninvoke IF 3'
  }, {
    'formula': 'IF(IF(MAX($AN6:$AP6)>0,MAX($AN6:$AP6),MIN($AN6:$AP6))=AN6,"NO",CHOOSE(COLUMN(A1),"一班","二班","三班"))',
    'instruct': 'OPush $AN6\r\nOPush $AP6\r\nuni\r\ninvoke MAX 1\r\nNPush 0\r\nifge\r\nOPush $AN6\r\nOPush $AP6\r\nuni\r\ninvoke MAX 1\r\nOPush $AN6\r\nOPush $AP6\r\nuni\r\ninvoke MIN 1\r\ninvoke IF 3\r\nOPush AN6\r\nifeq\r\nSPush NO\r\nOPush A1\r\ninvoke COLUMN 1\r\nSPush 一班\r\nSPush 二班\r\nSPush 三班\r\ninvoke CHOOSE 4\r\ninvoke IF 3'
  }, {
    'formula': 'SUM(OFFSET(B2,0,0,MATCH(F2,A2:A13,0)))',
    'instruct': 'OPush B2\r\nNPush 0\r\nNPush 0\r\nOPush F2\r\nOPush A2\r\nOPush A13\r\nuni\r\nNPush 0\r\ninvoke MATCH 3\r\ninvoke OFFSET 4\r\ninvoke SUM 1'
  }, {
    'formula': 'A6+A1',
    'instruct': 'OPush A6\r\nOPush A1\r\nadd'
  }, {
    'formula': '3+(4+1)',
    'instruct': 'NPush 3\r\nNPush 4\r\nNPush 1\r\nadd\r\nadd'
  }, {
    'formula': '{9,3}',
    'instruct': 'NPush 9\r\nNPush 3\r\nnewarray 2'
  }, {
    'formula': 'SUM({9,3}, 1)',
    'instruct': 'NPush 9\r\nNPush 3\r\nnewarray 2\r\nNPush 1\r\ninvoke SUM 2'
  }, {
    'formula': 'Sheet2!A3+10',
    'instruct': 'OPush Sheet2\r\nOPush A3\r\nrel\r\nNPush 10\r\nadd'
  }, {
    'formula': '2^2',
    'instruct': 'NPush 2\r\nNPush 2\r\npower'
  }, {
    'formula': 'INDEX(A:A,SMALL(IF(ISNUMBER(FIND($B$1,$A$1:$A$6)),ROW($A$1:$A$6),100),ROW(A1)))&""',
    'instruct': 'OPush A\r\nOPush A\r\nuni\r\nOPush $B$1\r\nOPush $A$1\r\nOPush $A$6\r\nuni\r\ninvoke FIND 2\r\ninvoke ISNUMBER 1\r\nOPush $A$1\r\nOPush $A$6\r\nuni\r\ninvoke ROW 1\r\nNPush 100\r\ninvoke IF 3\r\nOPush A1\r\ninvoke ROW 1\r\ninvoke SMALL 2\r\ninvoke INDEX 2\r\nSPush \r\nlink'
  }, {
    'formula': 'LOOKUP(99,FIND(B$2,TEXT(COUNTIF(C$1:C1,A$1:A$7),";;"&A$1:A$7&REPT(B$2,A$1:A$7=""))),A$1:A$7)&""',
    'instruct': 'NPush 99\r\nOPush B$2\r\nOPush C$1\r\nOPush C1\r\nuni\r\nOPush A$1\r\nOPush A$7\r\nuni\r\ninvoke COUNTIF 2\r\nSPush ;;\r\nOPush A$1\r\nOPush A$7\r\nuni\r\nlink\r\nOPush B$2\r\nOPush A$1\r\nOPush A$7\r\nuni\r\nSPush \r\nifeq\r\ninvoke REPT 2\r\nlink\r\ninvoke TEXT 2\r\ninvoke FIND 2\r\nOPush A$1\r\nOPush A$7\r\nuni\r\ninvoke LOOKUP 3\r\nSPush \r\nlink'
  }, {
    'formula': '{1+1}',
    'instruct': 'NPush 1\r\nNPush 1\r\nadd\r\nnewarray 1'
  }, {
    'formula': '{1 + 2}',
    'instruct': 'NPush 1\r\nNPush 2\r\nadd\r\nnewarray 1'
  }, {
    'formula': 'SUM(1,2,3) + 3',
    'instruct': 'NPush 1\r\nNPush 2\r\nNPush 3\r\ninvoke SUM 3\r\nNPush 3\r\nadd'
  }, {
    'formula': '{1, {2>1, 4, 6, SUM(1,1)}, 2 + 3}',
    'instruct': 'NPush 1\r\nNPush 2\r\nNPush 1\r\nifge\r\nNPush 4\r\nNPush 6\r\nNPush 1\r\nNPush 1\r\ninvoke SUM 2\r\nnewarray 4\r\nNPush 2\r\nNPush 3\r\nadd\r\nnewarray 3'
  }, {
    'formula': '{1, {2 > 1, 4 * (1+2), 6, SUM(1, 1) / 2}, 2 + 3}',
    'instruct': 'NPush 1\r\nNPush 2\r\nNPush 1\r\nifge\r\nNPush 4\r\nNPush 1\r\nNPush 2\r\nadd\r\nmul\r\nNPush 6\r\nNPush 1\r\nNPush 1\r\ninvoke SUM 2\r\nNPush 2\r\ndiv\r\nnewarray 4\r\nNPush 2\r\nNPush 3\r\nadd\r\nnewarray 3'
  }].forEach(expr => {
    expect(Compile(expr.formula))
      .toEqual(expr.instruct);
  });
});

test('evaluate formula expr', () => {
  Functions.register('SUM', (...args) => {
    return args.reduce((a, b) => a + b);
  });
  [{
    formula: 'SUM(1,2,3) + 3',
    value: 9,
  }, {
    formula: '2 * (1 + 2)',
    value: 6,
  }, {
    formula: '{1, 2 + 3}',
    value: [1, 5],
  }, {
    formula: '{1, {2 > 1, 4 * (1+2), 6, SUM(1, 1) / 2}, 2 + 3}',
    value: [1, [true, 12, 6, 1], 5],
  }, {
    formula: '{}',
    value: []
  }, {
    formula: '2^2',
    value: Math.pow(2, 2)
  }, {
    formula: '{1 + 1}',
    value: [2],
  }, {
    formula: '{SUM(10,2) / 6, {}, 8}',
    value: [2, [], 8],
  }, {
    formula: '1+3',
    value: 4,
  }].forEach((expr) => {
    expect(Evaluate(expr.formula))
      .toEqual(expr.value);
  });
});

test('compiler formula syntax', () => {
  [{
    formula: '1,{}',
    type: 'done',
  }, {
    formula: 'SUM(1)',
    type: 'done',
  }, {
    formula: 'SUM(1),{',
    type: 'error',
  }].forEach(expr => {
    switch (expr.type) {
      case 'done': {
        expect(() => {
          Compile(expr.formula)
        }).not.toThrow()
        break;
      }
      case 'error': {
        expect(() => {
          Compile(expr.formula)
        }).toThrow();
        break;
      }
    }
  });
});
