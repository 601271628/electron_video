const { Menu, Tray, app } = require("electron");
const path = require("path");

export default function (Mainwindow) {
  const iconSrc = path.join(__dirname, "../src/assets/images/icon.png");
  let tray = new Tray(iconSrc);
  const contextMenu = Menu.buildFromTemplate([
    { label: "Item2", type: "radio" },
    { label: "Item3", type: "radio", checked: true },
    {
      label: "退出",
      click: () => {
        app.quit();
      },
    },
  ]);

  // 提示
  tray.setToolTip("e小录");

  // 右键菜单
  tray.setContextMenu(contextMenu);

  // 最小化则打开
  tray.on("click", () => {
    if (Mainwindow.win.isMinimized()) Mainwindow.win.show();
  });
}
