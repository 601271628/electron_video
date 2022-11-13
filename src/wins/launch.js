import { BrowserWindow } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";

const winConfig = {
  show: false,
  frame: false,
  focusable: true,
  resizeable: false,
  webPreferences: {
    devTools: true,
    nodeIntegration: true,
    contextIsolation: false,
  },
};

class lanucn {
  constructor(confInfo) {
    // 这里的配置没有宽高 + 使用外部传入的
    this.conf = Object.assign({}, confInfo, winConfig);
    // 创建窗口
    this.win = new BrowserWindow(this.conf);

    // 根据生产、使用环境加载  WEBPACK_DEV_SERVER\BABEL_ENV:"development"
    if (process.env.WEBPACK_DEV_SERVER_URL) {
      // 开发
      this.win.loadURL(`${process.env.WEBPACK_DEV_SERVER_URL}`);
    } else {
      // 生产
      createProtocol("app");
      this.win.loadURL(`file://${__dirname}/index.html/#/`);
      // this.win.loadURL("app://./index.html/#/launchPage");
    }
  }

  //  打开
  show() {
    this.win.once("ready-to-show", () => {
      this.win.show();
    });
  }

  // 关闭
  close() {
    if (this.win && this.win.isVisible) {
      this.win.close();
      this.win = null;
    }
  }
}

export default lanucn;
