
## vue3 + js + electron@21.2.1
## vue add electron-builder
## vue内部使用ipcRenderer 必须window.require
- const { ipcRenderer } = window.require("electron");



## 白屏：首先改为路由哈希模式 然后就是加载路径的问题
- this.win.loadURL(`file://${__dirname}/index.html/#/launchPage`);   使用files才额能获取到媒体流
  // this.win.loadURL("app://./index.html/#/launchPage");


## 改进：移动 + 声音 + 进度 + 小球隐藏 + serve多开报错