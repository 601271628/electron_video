const fs = window.require("fs");
const path = require("path");
import { PATH } from "@/util/pathConfig";

export default function () {
  let checkDir = fs.existsSync(PATH);

  if (!checkDir) {
    return [];
  }
  // 读取文件夹文件
  const fileNmaes = fs.readdirSync(PATH);

  // 遍历文佳 拼接路径
  const files = fileNmaes.filter((filename) => {
    const filePath = path.join(PATH, filename);
    // 如果是文件就保留
    return fs.statSync(filePath).isFile();
  });

  return files;
}
