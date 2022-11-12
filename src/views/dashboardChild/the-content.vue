<template>
  <div class="content">
    <div class="left">
      <div class="l_top">
        <button class="btn" @click="getSource">{{ text }}</button>
        <div class="time">{{ time }}</div>
      </div>
      <div class="l_bottom">
        <div class="table"></div>
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
import { ref, reactive } from "vue";
import saveVideo from "@/util/saveVideo";
const { ipcRenderer } = window.require("electron");

let text = ref("录制");
let time = ref("00:00:00");
const stream = ref(null);
const videoBuffer = reactive([]);
let record = ref();

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
    mimeType: "video/webm;codecs=vp9",
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
      saveVideo(blob);
    };

    // 出错
    record.value.onerror = (err) => {
      console.error(err);
    };
  }
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
  flex: 3;
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
  background-color: lightblue;
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

table {
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);

  border: 1px solid black;
}

.right {
  display: flex;
  align-items: center;
  flex: 5;
  background-color: #cdcbcd;
}

.show {
  width: 100%;
  /* height: 80%; */
  /* background-color: rgb(59, 64, 64); */
}

video {
  width: 100%;
  height: 100%;
}
</style>
