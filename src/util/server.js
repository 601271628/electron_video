import { PATH } from "@/util/pathConfig";

const path = require("path");
const http = require("http");
const fs = require("fs");

export const httpServer = () => {
  const server = http.createServer((req, res) => {
    if (req.url !== "/favicon.ico") {
      let vedioPath = path.join(PATH, req.url);
      console.log(vedioPath);
      fs.readFile(vedioPath, (err, result) => {
        if (err) {
          req.writeHeader({});
          return res.end(
            JSON.stringify({
              status: 404,
              messgae: "资源不存在",
            })
          );
        }
        res.end(result);
      });
    }
  });

  server.listen(3006, () => {
    console.log("http://localhost:3006 本地服务器启动");
  });
};
