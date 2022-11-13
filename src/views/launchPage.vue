<template>
  <div class="launch">
    <!-- <h1 class="animate__animated animate__bounce">启动中...</h1> -->
    <h1>启动中...</h1>
  </div>
</template>

<script>
// import "animate.css";
export default {
  name: "launch",
};
</script>

<style scoped>
.launch {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: black;
  color: white;
}
</style>
