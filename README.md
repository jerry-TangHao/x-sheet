## **X-Sheet For Pc Browser**

###### `高性能 Web JavaScript 电子表格 `

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

## **初始化**
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>X-Sheet</title>
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
        <body id="dome">
            <script>
              const dome = document.getElementById('dome');
              const xSheet = new XSheet(dome, {
                workConfig: {
                  body: {
                    sheets: [{}],
                  },
                },
              });
            </script>
        </body>
    </html>
    
## **支持的浏览器**
    Modern browsers(chrome, firefox).
       
## **LICENSE**
    MOZILLA PUBLIC LICENSE
