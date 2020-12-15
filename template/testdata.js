/* global window */

const testData = {
  name: '测试',
  tableConfig: {
    table: {},
    rows: {
      data: [],
    },
    cols: {
      data: [],
    },
    merges: {
      data: [],
    },
    data: [
      [{
        ID: '1584265551097',
        text: '竖排文字',
        format: 'default',
        background: null,
        fontAttr: {
          align: 'left',
          verticalAlign: 'top',
          textWrap: 2,
          strikethrough: false,
          underline: false,
          color: 'rgb(0,0,0)',
          name: 'Arial',
          size: 14,
          bold: false,
          italic: false,
          direction: 'vertical',
        },
        borderAttr: {
          time: '1584265551097',
          left: {
            display: false,
            width: 1,
            color: '#000000',
          },
          top: {
            display: false,
            width: 1,
            color: '#000000',
          },
          right: {
            display: false,
            width: 1,
            color: '#000000',
          },
          bottom: {
            display: false,
            width: 1,
            color: '#000000',
          },
        },
      }],
      [{
        ID: '1584265551097',
        text: 'Canvas Context API',
        format: 'default',
        background: null,
        fontAttr: {
          align: 'right',
          verticalAlign: 'bottom',
          textWrap: 1,
          strikethrough: false,
          underline: false,
          color: 'rgb(0,0,0)',
          name: 'Arial',
          size: 14,
          bold: false,
          italic: false,
          angle: 90,
          direction: 'angle',
        },
        borderAttr: {
          time: '1584265551097',
          left: {
            display: false,
            width: 1,
            color: '#000000',
          },
          top: {
            display: false,
            width: 1,
            color: '#000000',
          },
          right: {
            display: false,
            width: 1,
            color: '#000000',
          },
          bottom: {
            display: false,
            width: 1,
            color: '#000000',
          },
        },
      }],
    ],
  },
};

window.testData = testData;

export { testData };
