import { app, BrowserWindow, ipcMain } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import { MAIN_WIDTH, MAIN_HEIGHT } from "@/util/screenReactive";
// import path from "path";

const winConfig = {
  show: false,
  frame: false,
  focusable: true,
  resizable: true,
  minWidth: 800,
  minHeight: 600,
  webPreferences: {
    devTools: true,
    nodeIntegration: true,
    contextIsolation: false,
    // 这是
    // preload: path.join(__dirname, "./preload.js"),
  },
};

class Dashboard {
  constructor(confInfo) {
    this.conf = Object.assign({}, confInfo, winConfig);
    // 窗口
    this.win = new BrowserWindow(this.conf);

    // 根据生产、使用环境加载  WEBPACK_DEV_SERVER\BABEL_ENV:"development"
    if (process.env.WEBPACK_DEV_SERVER_URL) {
      // 开发
      this.win.loadURL(`${process.env.WEBPACK_DEV_SERVER_URL}dashboard`);
    } else {
      // 生产
      createProtocol("app");
      this.win.loadURL("app://./index.html/dashboard");
    }
  }

  //  打开
  show() {
    this.win.once("ready-to-show", () => {
      this.win.show();
    });

    this.listenIpc();
  }

  // 关闭
  close() {
    if (this.win && this.win.isVisible) {
      this.win.close();
      this.win = null;
    }
  }

  // ipcMain监听最大最小化
  listenIpc() {
    // drag
    ipcMain.on("drag", (e, pos) => {
      this.win.setPosition(pos.x, pos.y);
      // 不知道为啥
      this.win.setSize(MAIN_WIDTH, MAIN_HEIGHT);
    });
    // 最小
    ipcMain.on("minisize", () => {
      this.win.minimize();
    });
    // 最大
    ipcMain.on("maxisize", () => {
      this.win.maximize();
    });
    // 最大化还原
    ipcMain.on("restore", () => {
      this.win.restore();
    });
    // 关闭
    ipcMain.on("close", () => {
      app.quit();
    });
  }
}

export default Dashboard;
