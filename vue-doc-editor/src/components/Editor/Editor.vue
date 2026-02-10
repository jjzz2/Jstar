<template>
  <div class="editor-container">
    <header class="editor-header">
        <h1>Vue Doc Editor</h1>
        <div class="toolbar">
            <button @click="store.undo" title="Undo">↩ 撤销</button>
            <button @click="store.redo" title="Redo">↪ 重做</button>
            <div class="separator"></div>
            <button @click="addHeading">H1 标题</button>
            <button @click="addParagraph">¶ 段落</button>
            <div class="separator"></div>
            <button @click="exportJSON" class="primary">💾 导出 JSON</button>
        </div>
    </header>

    <div class="editor-canvas">
      <!-- Start rendering from root -->
      <EditorBlock :node="store.doc" />
    </div>
  </div>
</template>

<script setup>
import { useEditorStore } from '../../core/state/editorStore';
import EditorBlock from './EditorBlock.vue';
import { DocNode } from '../../core/model/Node';

const store = useEditorStore();

const addParagraph = () => {
    const newNode = new DocNode('paragraph', '新段落');
    store.insertNode(store.doc.id, store.doc.children.length, newNode);
};

const addHeading = () => {
    const newNode = new DocNode('heading', '新标题');
    store.insertNode(store.doc.id, store.doc.children.length, newNode);
};

const exportJSON = () => {
    console.log(JSON.stringify(store.doc, null, 2));
    alert('文档模型已导出到控制台 (F12)');
};
</script>

<style scoped>
.editor-container {
    max-width: 900px;
    margin: 20px auto;
    background: white;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    height: 80vh;
}

.editor-header {
    padding: 15px 20px;
    border-bottom: 1px solid #eee;
    background: #fcfcfc;
    border-radius: 8px 8px 0 0;
}

h1 {
    font-size: 18px;
    margin: 0 0 10px 0;
    color: #333;
}

.toolbar {
    display: flex;
    gap: 8px;
    align-items: center;
}

.separator {
    width: 1px;
    height: 20px;
    background: #ddd;
    margin: 0 5px;
}

button {
    padding: 6px 12px;
    border: 1px solid #ddd;
    background: white;
    border-radius: 4px;
    cursor: pointer;
    font-size: 13px;
    transition: all 0.2s;
}

button:hover {
    background: #f5f5f5;
    border-color: #ccc;
}

button.primary {
    background: #646cff;
    color: white;
    border-color: #646cff;
}

button.primary:hover {
    background: #535bf2;
}

.editor-canvas {
    flex: 1;
    overflow-y: auto;
    padding: 40px;
}
</style>
