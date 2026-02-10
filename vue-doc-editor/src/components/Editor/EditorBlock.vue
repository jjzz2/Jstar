<template>
  <div 
    class="editor-block" 
    :class="node.type"
    :data-id="node.id"
  >
    <!-- Text Content -->
    <!-- We use contenteditable for text nodes -->
    <!-- Note: Real rich text editors need complex Selection handling here. -->
    <!-- For this demo, we rely on @input to capture text changes. -->
    <div 
        v-if="isTextNode" 
        contenteditable="true"
        @input="onInput"
        @keydown.enter.prevent="onEnter"
        class="block-content"
    >
        {{ node.content }}
    </div>

    <!-- Recursive Children -->
    <div v-if="node.children && node.children.length" class="block-children">
      <EditorBlock 
        v-for="(child, index) in node.children" 
        :key="child.id" 
        :node="child"
        :parent-id="node.id"
        :index="index"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useEditorStore } from '../../core/state/editorStore';
import { DocNode } from '../../core/model/Node';

const props = defineProps({
  node: Object,
  parentId: String,
  index: Number
});

const store = useEditorStore();

const isTextNode = computed(() => ['paragraph', 'heading'].includes(props.node.type));

const onInput = (e) => {
  store.updateNodeContent(props.node.id, e.target.innerText);
};

const onEnter = (e) => {
    // Example shortcut: Enter creates a new paragraph below
    if (props.parentId) {
        const newNode = new DocNode('paragraph', '...');
        store.insertNode(props.parentId, props.index + 1, newNode);
    }
};
</script>

<style scoped>
.editor-block {
  margin: 10px 0;
  position: relative;
}
.heading {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}
.paragraph {
  font-size: 16px;
  line-height: 1.6;
  color: #555;
}
.block-content {
    min-height: 24px;
    padding: 4px 8px;
    border-radius: 4px;
    transition: background 0.2s;
}
.block-content:focus {
    outline: none;
    background-color: #eef2ff;
    border-left: 3px solid #646cff;
}
</style>
