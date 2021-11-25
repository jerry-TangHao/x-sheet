## **x-sheet for pc browser**

###### `高性能 web javaScript 电子表格 `

![输入图片说明](https://images.gitee.com/uploads/images/2020/0710/212501_7fdc3522_1908036.png "screencapture-file-Users-jerry-Desktop-JavaScript-x-sheet-dist-calendar-2019-html-2020-07-10-21_20_41.png")

------------

![输入图片说明](https://images.gitee.com/uploads/images/2020/0710/212512_f08f4d45_1908036.png "screencapture-file-Users-jerry-Desktop-JavaScript-x-sheet-dist-calendar-2020-html-2020-07-10-21_21_33.png")

------------

![输入图片说明](https://images.gitee.com/uploads/images/2020/0710/212523_e06dde68_1908036.png "screencapture-file-Users-jerry-Desktop-JavaScript-x-sheet-dist-projecttimetable-html-2020-07-10-21_22_08.png")

------------

![输入图片说明](https://images.gitee.com/uploads/images/2020/0710/212535_6bb89054_1908036.png "screencapture-file-Users-jerry-Desktop-JavaScript-x-sheet-dist-purchaseorder-html-2020-07-10-21_22_36.png")

------------

![输入图片说明](https://images.gitee.com/uploads/images/2020/0710/212545_4a26a186_1908036.png "screencapture-file-Users-jerry-Desktop-JavaScript-x-sheet-dist-travel-html-2020-07-10-21_23_01.png")

------------

## 功能
  - 撤销 & 反撤销
  - 格式刷
  - 清空格式
  - 文本格式
  - 字体设置
  - 字体大小
  - 字体加粗
  - 斜体字
  - 下划线
  - 删除线
  - 文字颜色
  - 单元格颜色
  - 单元格边框
  - 字体倾斜
  - 边框倾斜
  - 背景倾斜
  - 合并单元格
  - 水平对齐
  - 自动换行
  - 冻结单元格
  - 单元格函数 **(处理中)** 
  - 行高和列宽设置
  - 复制, 剪切, 粘贴 **(处理中)** 
  - 自动填充
  - 插入行, 列 **(处理中)** 
  - 删除行, 列 **(处理中)** 
  - 隐藏行, 列 **(处理中)** 
  - 支持多个sheet表
  - 打印 **(处理中)** 
  - 数据验证 **(处理中)** 
  - 导出XLSX
  - 导入XLSX **(处理中)** 
  - 导出CVS **(处理中)** 
  - 导入CVS **(处理中)** 
  - 导入图片 **(处理中)** 
  - 数据筛选 **(处理中)** 


## **初始化**
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>X-XWorkSheet</title>
            <link href="XSheet.css" rel="stylesheet">
            <style>
                * {
                    padding: 0;
                    margin: 0;
                }
        
                html, body {
                    height: 100%;
                    display: block;
                }
            </style>
            <script src="XSheet.js" type="text/javascript"></script>
        </head>
        <body id="demo">
            <script>
              const dome = document.getElementById('demo');
              const xSheet = new XSheet(demo);
            </script>
        </body>
    </html>
    
## **支持的浏览器**
    Modern browsers(chrome, firefox).
       
## **LICENSE**
    MOZILLA PUBLIC LICENSE
