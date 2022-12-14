import { BrowserWindow, ipcMain, screen } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import { BALL_WIDTH, BALL_HEIGHT } from "@/util/screenReactive";

const winConfig = {
  show: false,
  frame: false,
  focusable: true,
  resizable: false,
  skipTaskbar: true, //不显示再任务栏中
  transparent: true, //设置透明
  hasShadow: false, //不显示阴影
  alwaysOnTop: true, //窗口是否总是显示在其他窗口之前\
  webPreferences: {
    devTools: false,
    nodeIntegration: true,
    contextIsolation: false,
  },
};

class Ball {
  constructor(confInfo) {
    this.conf = Object.assign({}, confInfo, winConfig);
    // 窗口
    this.win = new BrowserWindow(this.conf);

    // 根据生产、使用环境加载  WEBPACK_DEV_SERVER\BABEL_ENV:"development"
    if (process.env.WEBPACK_DEV_SERVER_URL) {
      // 开发
      this.win.loadURL(`${process.env.WEBPACK_DEV_SERVER_URL}/#/ball`);
    } else {
      // 生产
      createProtocol("app");
      this.win.loadURL(`file://${__dirname}/index.html/#/ball`);
      // this.win.loadURL("app://./index.html/#/ball");
    }
  }

  //  打开
  show() {
    this.win.once("ready-to-show", () => {
      let WINDOW_WIDTH = screen.getPrimaryDisplay().bounds.width;
      this.win.setPosition(WINDOW_WIDTH - BALL_WIDTH - 100, 100);
      this.win.show();
      // 监听
      this.listenIpc();
    });
  }

  // 关闭
  close() {
    if (this.win && this.win.isVisible) {
      this.win.close();
      this.win = null;
    }
  }

  listenIpc() {
    // drag
    ipcMain.on("drag-ball", (e, pos) => {
      this.win.setPosition(pos.x, pos.y);
      // 不知道为啥
      this.win.setSize(BALL_WIDTH, BALL_HEIGHT);
    });
  }
}

export default Ball;
