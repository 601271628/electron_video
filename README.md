
### vue3 + js + electron@21.2.1

### 打包工具 vue add electron-builder

### vue内部使用ipcRenderer 必须window.require
- const { ipcRenderer } = window.require("electron");

### 白屏：首先改为路由哈希模式 然后就是加载路径的问题
- this.win.loadURL(`file://${__dirname}/index.html/#/launchPage`);   使用files才额能获取到媒体流
  // this.win.loadURL("app://./index.html/#/launchPage");

### tray显示：
- 生产环境：打包__dirname指向app.asar/.... 使用app.asar替换
- 开发环境：__dirname指向的是dist_electron/

### vue.config.js
- 配置的图标路径 在打包过程就确定了 因此不受__dirname影响

### 使用
- 本地serve ： npm run electron:serve
- 打包为app ： npm run electron:build

### 改进：移动 + 声音 + 进度 + 小球隐藏 + serve多开报错
