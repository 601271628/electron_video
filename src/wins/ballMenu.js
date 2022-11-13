const { Menu } = require("electron");

export default function (ball) {
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "本次不显示",
      click: () => {
        ball.win.close();
      },
    },
  ]);

  //图标的上下文菜单
  //   ball.setContextMenu(contextMenu);
}
