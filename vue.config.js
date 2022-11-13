module.exports = {
  publicPath: "./",
  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:3006",
        pathRewrite: { "^/api": "" }, // 路径重写
        changeOrigin: true, // 是否开启跨域
      },
    },
  },

  pluginOptions: {
    electronBuilder: {
      // 配置后运行到dist_electron才不会标为index.js(bgc.js会找不到报错)
      chainWebpackMainProcess: (config) => {
        config.output.filename((file) => {
          if (file.chunk.name === "index") {
            return "background.js";
          } else {
            return "[name].js";
          }
        });
      },
      // 配置
      builderOptions: {
        productName: "eRecord", //项目名，也是生成的安装文件名，即aDemo.exe
        appId: "e.record.app",
        copyright: "Copyright © lcx 2022.11.13", //版权信息
        directories: {
          output: "./app_file", //输出文件路径
        },
        nsis: {
          oneClick: false, // 一键安装
          allowElevation: true,
          allowToChangeInstallationDirectory: true, // 更换安装目录
          installerIcon: "./src/assets/images/logo.ico",
          uninstallerIcon: "./src/assets/images/logo.ico",
          installerHeaderIcon: "./src/assets/images/logo.ico",
          createDesktopShortcut: true,
          createStartMenuShortcut: true,
          shortcutName: "小录同学",
        },
        win: {
          target: "nsis",
          icon: "./src/assets/images/icon.png",
        },
      },
    },
  },
};
