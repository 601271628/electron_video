<template>
  <div id="dashboard">
    <!-- 头部 -->
    <the-header></the-header>
    <!-- 内容 -->
    <the-content></the-content>
  </div>
</template>

<script setup>
import theHeader from "./dashboardChild/the-header.vue";
import theContent from "./dashboardChild/the-content.vue";
</script>

<style scoped>
#dashboard {
  width: 100%;
}
</style>
