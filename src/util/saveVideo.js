const fs = window.require("fs");
const path = require("path");
const PATH = path.join(__dirname, "../../data_video");

function createFile(path) {
  let checkDir = fs.existsSync(path);
  // 不存在 返回创建结果
  if (!checkDir) {
    const createSuccess = fs.mkdirSync(path, { recursive: true });
    return createSuccess;
  }
  //   存在
  return true;
}

function downToLcal(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(blob);

    reader.onload = () => {
      // blob => arrayBuffer
      let arrayBuffer = reader.result;
      let buffer = Buffer.from(arrayBuffer);

      // 写入(视频使用buffer | string)
      let localPath = path.join(PATH, `/${+new Date()}.webm`);
      fs.writeFile(localPath, buffer, (_, err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    };
  });
}

export default function (blob) {
  if (createFile(PATH)) {
    return downToLcal(blob);
  } else {
    alert("存放文件夹 -- 找不到/创建失败");
  }
}
