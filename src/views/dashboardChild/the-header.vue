<template>
  <div class="header" v-drag="handlerDrag" @dblclick="scale">
    <div class="left">
      <!-- <img src="../assets/images/logo.png" /> -->
      <div class="img"></div>
      <div>lcx</div>
    </div>
    <div class="right">
      <div @click="minisize">
        <img src="@/assets/images/mini.png" />
      </div>
      <div @click="scale">
        <img src="@/assets/images/max.png" />
      </div>
      <div @click="close">
        <img src="@/assets/images/del.png" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
// 这里要写window.require
const { ipcRenderer } = window.require("electron");
let isMaxsize = ref(true);

const handlerDrag = (pos) => {
  ipcRenderer.send("drag", pos);
};

const minisize = () => {
  ipcRenderer.send("minisize");
};
const scale = () => {
  ipcRenderer.send(isMaxsize.value ? "maxisize" : "restore");
  isMaxsize.value = !isMaxsize.value;
};
const close = () => {
  ipcRenderer.send("close");
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  height: 40px;
  width: 100%;
  background-color: black;
  color: white;
}
.left,
.right {
  display: flex;
  align-items: center;
}
.left .img {
  width: 30px;
  height: 30px;
  background: url("../../assets/images/logo.png") no-repeat;
  color: white;
  background-size: contain;
  margin: 0 10px;
}
.right div {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 20px;
  background-color: rgb(87, 83, 83);
  margin: 0 3px;
  border-radius: 6px;
}

.right div:hover {
  background-color: rgb(69, 67, 67);
}

.right div img {
  text-align: center;
  width: 14px;
  height: 14px;
}
</style>
