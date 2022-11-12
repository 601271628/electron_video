<template>
  <div class="content">
    <div class="left">
      <div class="l_top">
        <button class="btn" @click="getSource">{{ text }}</button>
        <div class="time">{{ time }}</div>
      </div>
      <div class="l_bottom">
        <div class="table">
          <div class="title">文件目录</div>
          <div class="tr" v-for="(item, index) of files" :key="index">
            <div>{{ item }}</div>
            <div>播放</div>
            <div>打开文件目录</div>
          </div>
        </div>
      </div>
    </div>
    <div class="right">
      <div class="show">
        <video src=""></video>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import saveVideo from "@/util/saveVideo";
import getDirectoryFile from "@/util/getDirectoryFile";
const { ipcRenderer } = window.require("electron");

let text = ref("录制");
let time = ref("00:00:00");
const stream = ref(null);
const videoBuffer = reactive([]);
let record = ref();
const files = reactive([]);

onMounted(() => {
  // 初始化文获取文件
  initDirectoryFile();
  console.log(files);
});

const getSource = () => {
  if (text.value == "结束") {
    text.value = "录制";
    return stopRecord();
  }
  text.value = "结束";

  ipcRenderer.send("send-desktop");

  ipcRenderer.once("reply-desktop", async (e, source) => {
    let sourceId = source.id;

    // 获取屏幕liu
    stream.value = await getScreenStream(sourceId);
    // 视频预览
    preview();
    // 录屏
    MediaRecord();

    // 停止 触发录屏的 ondataavailable
    // 内部调用 saveVideo 保存blob为本地
  });
};

// 获取屏幕
async function getScreenStream(sourceId) {
  // 获取屏幕
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      mandatory: {
        chromeMediaSource: "desktop",
        chromeMediaSourceId: sourceId,
      },
    },
  });

  return stream;
}

// 视频预览
function preview() {
  const video = document.querySelector("video");
  console.log(stream.value);
  video.srcObject = stream.value;
  video.onloadedmetadata = () => video.play();
}

// 录屏
function MediaRecord() {
  record.value = new MediaRecorder(stream.value, {
    mimeType: "video/webm", //;codecs=vp9"
    audioBitsPerSecond: 128000, //音频码率
    videoBitsPerSecond: 250000000, //视频码率
  });

  console.log(record.value);

  if (record.value) {
    // 开始
    record.value.start(1000);

    // start到stop记录的数据
    record.value.ondataavailable = function (e) {
      if (e.data.size > 0) {
        console.info("视频数据可用", e);
        videoBuffer.push(e.data);
      }
    };

    // stop时保存内容
    record.value.onstop = () => {
      let blob = new Blob(videoBuffer, {
        type: "video/webm",
      });

      // 保存视频文件
      saveVideo(blob).then(
        () => {
          alert("保存成功");
          initDirectoryFile();
        },
        (err) => {
          console.error("保存失败", err);
        }
      );
    };

    // 出错
    record.value.onerror = (err) => {
      console.error(err);
    };
  }
}

// 获取文件目录
function initDirectoryFile() {
  files.length = 0;
  files.push(...getDirectoryFile());
}

// 停止
const stopRecord = () => {
  // 视频显示停止
  if (stream.value) {
    for (let track of stream.value.getTracks()) {
      track.stop();
    }
  }
  // 记录停止
  record.value && record.value.state !== "inactive" && record.value.stop();
};
</script>

<style scoped>
.content {
  display: flex;
  width: 100%;
  height: calc(100vh - 40px);
}
.left {
  flex: 2;
  display: flex;
  flex-direction: column;
}
.l_top {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 3;
  width: 100%;
}
.l_bottom {
  position: relative;
  flex: 7;
  width: 100%;
}
.btn {
  width: 100px;
  height: 100px;
  background-color: rgb(230, 37, 37);
  border-radius: 50px;
  text-align: center;
  line-height: 100px;
  margin-bottom: 10px;
  color: white;
}
.time {
  font-size: 20px;
  color: red;
}

.right {
  display: flex;
  align-items: center;
  flex: 3;
  background-color: #cdcbcd;
}

.show {
  width: 100%;
}

video {
  width: 100%;
  height: 100%;
}

.title {
  position: sticky;
  top: 0;
  background-color: rgb(174, 174, 174);
  padding: 10px 0;
  color: black;
  font-weight: bolder;
  text-align: center;
}
.table {
  width: 90%;
  height: 90%;
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);
  border: 1px solid rgb(154, 150, 150);
  overflow: auto;
}

.tr {
  display: flex;
  width: 90%;
  padding: 10px 0;
  margin: 0 10px;
  border-bottom: 1px solid gray;
}
.tr div {
  text-align: center;
}
.tr div:nth-child(1) {
  width: 50%;
  min-width: 170px;
}
.tr div:nth-child(2) {
  width: 20%;
  min-width: 60px;
}
.tr div:nth-child(3) {
  min-width: 96px;
}
</style>
