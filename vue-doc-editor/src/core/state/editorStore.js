import { defineStore } from 'pinia';
import { DocNode } from '../model/Node';
import { HistoryManager } from '../history/HistoryManager';

export const useEditorStore = defineStore('editor', {
  state: () => ({
    // Initialize with a root doc and some default content
    doc: new DocNode('doc', '', [
        new DocNode('heading', '欢迎使用 Vue 文档编辑器'),
        new DocNode('paragraph', '这是一个基于 Vue 3 + Pinia 构建的简单文档编辑器。'),
        new DocNode('paragraph', '核心架构完全遵循 MVC 模式：State (Pinia) -> View (Vue Components) -> Dispatch (Actions).'),
        new DocNode('paragraph', '你可以尝试修改这些文字，然后使用上方的撤销/重做按钮。')
    ]),
    selection: null, // { nodeId, offset }
    history: new HistoryManager(),
    plugins: []
  }),

  actions: {
    // --- Command Dispatchers ---
    
    setDoc(newDoc) {
        // Replace entire document (e.g. from load)
        this.doc = newDoc;
        this.history = new HistoryManager(); // Reset history on new doc load
    },

    updateNodeContent(nodeId, newContent) {
      this.saveHistory();
      const node = this.findNode(this.doc, nodeId);
      if (node) {
        node.content = newContent;
      }
    },
    
    insertNode(parentId, index, newNode) {
        this.saveHistory();
        const parent = this.findNode(this.doc, parentId);
        if(parent) {
            parent.children.splice(index, 0, newNode);
        }
    },

    deleteNode(nodeId) {
        this.saveHistory();
        // Special case: cannot delete root
        if (nodeId === this.doc.id) return;
        this.doc = this.deleteNodeRecursive(this.doc, nodeId);
    },

    // --- History Management ---

    saveHistory() {
      // Serialize current state to JSON string or object for snapshot
      // In production, use Immer patches for efficiency
      const snapshot = JSON.stringify(this.doc); 
      this.history.push(snapshot);
    },

    undo() {
      const currentSnapshot = JSON.stringify(this.doc);
      const prevSnapshot = this.history.undo(currentSnapshot);
      if (prevSnapshot) {
        this.doc = this.deserialize(prevSnapshot);
      }
    },

    redo() {
      const currentSnapshot = JSON.stringify(this.doc);
      const nextSnapshot = this.history.redo(currentSnapshot);
      if (nextSnapshot) {
        this.doc = this.deserialize(nextSnapshot);
      }
    },

    // --- Helpers ---
    
    findNode(root, id) {
      if (root.id === id) return root;
      if (root.children) {
        for (const child of root.children) {
          const found = this.findNode(child, id);
          if (found) return found;
        }
      }
      return null;
    },
    
    deleteNodeRecursive(root, id) {
        // Create a new copy of children without the target
        if(root.children) {
            root.children = root.children.filter(c => c.id !== id);
            root.children.forEach(c => this.deleteNodeRecursive(c, id));
        }
        return root;
    },

    deserialize(jsonString) {
        // Ideally we should revive this into DocNode instances
        // For simplicity, we assume plain objects work with our components
        // or we map them back to classes if needed.
        return JSON.parse(jsonString);
    }
  }
});
