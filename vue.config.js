module.exports = {
  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:3006",
        pathRewrite: { "^/api": "" }, // 路径重写
        changeOrigin: true, // 是否开启跨域
      },
    },
  },
};
