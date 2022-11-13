"use strict";

import { app, ipcMain, desktopCapturer, shell } from "electron";

// 启动页
import Lanhch from "@/wins/launch";
// 主显示页面
import Main from "@/wins/main";
// 悬浮小球
import Ball from "@/wins/ball";

// 设计稿的大小
import {
  LUNCH_WIDTH,
  LUNCH_HEIGHT,
  MAIN_WIDTH,
  MAIN_HEIGHT,
  BALL_WIDTH,
  BALL_HEIGHT,
} from "@/util/screenReactive";

// 本地服务器
import { httpServer } from "@/util/server";

// 全局路径
import { PATH } from "@/util/pathConfig";
const path = require("path");

// 系统托盘
import setTray from "@/wins/tray";

let Mainwindow = null;
let ball = null;

function createWindow() {
  // 启动窗口
  const launchPage = new Lanhch({
    width: LUNCH_WIDTH,
    height: LUNCH_HEIGHT,
  });
  launchPage.show();

  // 启动窗口打开成功
  launchPage.win.on("show", () => {
    console.log("启动页:", process.env.WEBPACK_DEV_SERVER_URL);

    // 主页面窗口
    Mainwindow = new Main({
      width: MAIN_WIDTH,
      height: MAIN_HEIGHT,
    });
    // setTimeout(() => {
    Mainwindow.show();
    // 主页面窗口打开成功 关闭启动页
    Mainwindow.win.on("show", () => {
      console.log(
        "主页面:",
        process.env.WEBPACK_DEV_SERVER_URL + "/#/dashboard"
      );
      launchPage.close();
    });

    // 悬浮小球
    ball = new Ball({
      width: BALL_WIDTH,
      height: BALL_HEIGHT,
    });
    ball.show();
    ball.win.on("show", () => {
      console.log("小球:", process.env.WEBPACK_DEV_SERVER_URL + "/#/ball");
    });
    // }, 1500);

    // 托盘图标
    setTray(Mainwindow);
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

// 监听转发给小球计时
ipcMain.on("start_comp_time", (event) => {
  ball.win.webContents.send("start_comp_time");
});
ipcMain.on("stop_comp_time", (event) => {
  ball.win.webContents.send("stop_comp_time");
});

// 双击小球显示
ipcMain.on("mainWindow-show", (event) => {
  if (Mainwindow.win.isMinimized()) Mainwindow.win.show();
});

app.on("ready", () => {
  createWindow();
});

// 不可多开
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
}

// mac
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
