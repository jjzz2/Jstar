<script setup>
import { onMounted } from 'vue';
import Editor from './components/Editor/Editor.vue'
import { IframeBridge } from './core/bridge/IframeBridge';

onMounted(() => {
  // 初始化 Iframe 通信桥接
  new IframeBridge();
});
</script>

<template>
  <Editor />
</template>

<style>
/* Global reset or basic styles */
body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  background-color: #f0f2f5;
}
</style>
