"use strict";

import { app, screen, ipcMain, desktopCapturer, shell } from "electron";

// 启动页
import Lanhch from "./wins/launch";
// 主显示页面
import Main from "./wins/main";

// 设计稿的大小
import {
  WINDOW_WIDTH,
  WINDOW_HEIGHT,
  LUNCH_WIDTH,
  LUNCH_HEIGHT,
  MAIN_WIDTH,
  MAIN_HEIGHT,
} from "./util/screenReactive";

// 本地服务器
import { httpServer } from "@/util/server";

// 全局路径
import { PATH } from "@/util/pathConfig";
const path = require("path");

function createWindow() {
  // 获取屏幕的分辨率（宽高）
  let rect = screen.getPrimaryDisplay().bounds;
  let l_width = (rect.width * LUNCH_WIDTH) / WINDOW_WIDTH;
  let l_height = (rect.height * LUNCH_HEIGHT) / WINDOW_HEIGHT;
  let m_width = (rect.width * MAIN_WIDTH) / WINDOW_WIDTH;
  let m_height = (rect.height * MAIN_HEIGHT) / WINDOW_HEIGHT;

  // 启动窗口
  const launchPage = new Lanhch({
    width: l_width,
    height: l_height,
  });
  launchPage.show();

  // 启动窗口打开成功
  launchPage.win.on("show", () => {
    console.log("启动页:", process.env.WEBPACK_DEV_SERVER_URL);

    // 主页面窗口
    let Mainwindow = new Main({
      width: m_width,
      height: m_height,
    });
    Mainwindow.show();
    // 主页面窗口打开成功 关闭启动页
    Mainwindow.win.on("show", () => {
      console.log("主页面:", process.env.WEBPACK_DEV_SERVER_URL + "dashboard");
      launchPage.close();
    });
  });
}

// 启动本地服务器（播放视频）
httpServer();

// 监听获取屏幕
ipcMain.on("send-desktop", async (event) => {
  console.log("监听屏幕");
  let sources = await desktopCapturer.getSources({
    types: ["window", "screen"],
  });
  // 主进程发送 (scources[0]是在整个桌面)
  event.reply("reply-desktop", sources[0]);
});

// 监听打开文件夹
ipcMain.on("open-dir", async (event, filename) => {
  console.log("打开文件夹");
  let fullPath = path.join(PATH, filename);
  shell.showItemInFolder(fullPath);
});

app.on("ready", () => {
  createWindow();
});

// mac
// app.on("activate", () => {
//   if (BrowserWindow.getAllWindows().length === 0) createWindow();
// });

// app.on("window-all-closed", () => {
//   if (process.platform !== "darwin") {
//     app.quit();
//   }
// });
// protocol.registerSchemesAsPrivileged([
//   { scheme: "app", privileges: { secure: true, standard: true } },
// ]);
