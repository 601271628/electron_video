<template>
  <div class="ball" v-drag="handlerDrag" @dblclick="mainWindowShow">
    <span class="text">
      {{ time }}
    </span>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeUnmount } from "vue";
const { ipcRenderer } = window.require("electron");

let timeCount = ref(0);
const time = computed(() => {
  let h = Math.floor(timeCount.value / 3600);
  let m = Math.floor((timeCount.value - h * 3600) / 60);
  let s = timeCount.value - 60 * m - 3600 * h;
  h = h < 10 ? "0" + h : h;
  m = m < 10 ? "0" + m : m;
  s = s < 10 ? "0" + s : s;
  return `${h}:${m}:${s}`;
});
let timer = null;

// 开始计时
ipcRenderer.on("start_comp_time", () => {
  timer && clearInterval(timer);
  timer = setInterval(() => {
    timeCount.value++;
  }, 1000);
});
// 结束计时
ipcRenderer.on("stop_comp_time", () => {
  timeCount.value = 0;
  clearInterval(timer);
});
// 拖拽
const handlerDrag = (pos) => {
  ipcRenderer.send("drag-ball", pos);
};

const mainWindowShow = () => {
  ipcRenderer.send("mainWindow-show");
};

onBeforeUnmount(() => {
  clearInterval(timer);
});
</script>
<style scoped>
.ball {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  width: 70px;
  height: 70px;
  font-size: 15px;
  border-radius: 50%;
  background-color: rgb(112, 193, 224);
  border: 1px solid #fff;
}
.text {
  cursor: default;
  user-select: none;
}
</style>
