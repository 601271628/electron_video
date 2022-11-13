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
            <div @click="handlerPlay(item)" class="play">播放</div>
            <div @click="handlerOpendir(item)" class="openDir">
              打开文件目录
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="right">
      <div class="show">
        <video class="preview" v-if="videoUrl == ''"></video>
        <video :src="videoUrl" controls v-else></video>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
import saveVideo from "@/util/saveVideo";
import getDirectoryFile from "@/util/getDirectoryFile";
import { computed } from "@vue/reactivity";
const { ipcRenderer } = window.require("electron");

let text = ref("录制");
const timeCount = ref(0);
const stream = ref(null);
let record = ref();
const files = reactive([]);
let timer = null;
let videoUrl = ref("");

// 初始化文获取文件
onMounted(() => {
  initDirectoryFile();
});

// 点击播放
const handlerPlay = (filename) => {
  // 设置视频显示路径
  videoUrl.value = `http://localhost:3006/${filename}`;
};

// 打开目录
const handlerOpendir = (filename) => {
  ipcRenderer.send("open-dir", filename);
};

// 时间格式转
const time = computed(() => {
  let h = Math.floor(timeCount.value / 3600);
  let m = Math.floor((timeCount.value - h * 3600) / 60);
  let s = timeCount.value - 60 * m - 3600 * h;
  h = h < 10 ? "0" + h : h;
  m = m < 10 ? "0" + m : m;
  s = s < 10 ? "0" + s : s;
  return `${h}:${m}:${s}`;
});

// 开始录制
const getSource = () => {
  if (text.value == "结束") {
    text.value = "录制";
    // 时间
    timeCount.value = 0;
    clearInterval(timer);
    // 悬浮小球结束计时
    ipcRenderer.send("stop_comp_time");
    // 停止
    return stopRecord();
  }

  text.value = "结束";
  // 计时
  timer = setInterval(() => {
    timeCount.value++;
  }, 1000);
  // 悬浮小球计时
  ipcRenderer.send("start_comp_time");
  // 显示替换
  videoUrl.value = "";
  // 监听屏幕 得到屏幕流
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
  const video = document.querySelector(".preview");
  video.srcObject = stream.value;
  video.onloadedmetadata = () => video.play();
}

// 录屏
function MediaRecord() {
  record.value = new MediaRecorder(stream.value, {
    //webm类型一定要加codecs=vp8,opus，否则会导致录制时候时而可以用时而不能用
    mimeType: "video/webm;codecs=vp8,opus",
    audioBitsPerSecond: 128000, //音频码率
    videoBitsPerSecond: 250000000, //视频码率
  });

  if (record.value) {
    let videoBuffer = [];
    // 开始
    record.value.start(1000);

    // start到stop记录的数据
    record.value.ondataavailable = function (e) {
      if (e.data.size > 0) {
        console.info("视频数据可用");
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
          alert(`成功保存`);
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

// 定时器清除
onBeforeUnmount(() => {
  clearInterval(timer);
});
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
  border: none;
  font-size: 20px;
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
.play,
.openDir {
  cursor: pointer;
}
</style>
