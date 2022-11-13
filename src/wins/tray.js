const { Menu, Tray, app, nativeImage } = require("electron");
const path = require("path");

export default function (Mainwindow) {
  // 解开了asar文件 发现../src/assets/images/logo.ico找不到 就使用__dirname（/安装路径/app.asar）下的favicon .ico代替
  let iconSrc = path.join(__dirname, "favicon .ico");
  console.log(iconSrc);
  console.log(__dirname);
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    console.log("asfasfasfaf");
    iconSrc = path.join(__dirname, "../src/assets/images/logo.ico");
  }

  const ningImage = nativeImage.createFromPath(iconSrc);
  let tray = new Tray(ningImage);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "打开主窗口",
      click: () => {
        if (Mainwindow.win.isMinimized()) Mainwindow.win.show();
      },
    },
    {
      label: "最小化",
      click: () => {
        if (Mainwindow.win.isVisible()) Mainwindow.win.minimize();
      },
    },
    {
      label: "退出",
      click: () => {
        app.quit();
      },
    },
  ]);

  // 提示
  tray.setToolTip("小录同学");

  // 右键菜单
  tray.setContextMenu(contextMenu);

  // 最小化则打开
  tray.on("click", () => {
    if (Mainwindow.win.isMinimized()) Mainwindow.win.show();
  });
}
