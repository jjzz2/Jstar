import { useEditorStore } from '../state/editorStore';

export class IframeBridge {
  constructor() {
    this.store = useEditorStore();
    this.initListener();
    this.notifyReady();
  }

  initListener() {
    window.addEventListener('message', async (event) => {
      // 可以在这里加 origin 校验
      const { id, action, method, args } = event.data;
      
      if (action === 'callMethod') {
        try {
          const result = await this.executeMethod(method, args);
          this.sendResponse(id, method, result);
        } catch (error) {
          this.sendError(id, method, error.message);
        }
      }
    });
    
    // 监听 Store 变化，主动推送内容变更
    this.store.$subscribe((mutation, state) => {
        // 这里可以加防抖
        this.emitEvent('contentChanged', state.doc);
    });
  }

  async executeMethod(method, args = []) {
    switch (method) {
      case 'getContent':
        // 返回纯 JS 对象
        return JSON.parse(JSON.stringify(this.store.doc));
      
      case 'setContent':
        const [content] = args;
        // 假设 content 是符合 DocNode 结构的 JSON 对象
        if (content) {
            this.store.setDoc(content);
        }
        return true;

      case 'focus':
        // 简单的聚焦实现，聚焦到第一个可编辑块
        const firstBlock = document.querySelector('[contenteditable]');
        if (firstBlock) firstBlock.focus();
        return true;

      case 'blur':
        if (document.activeElement) document.activeElement.blur();
        return true;

      default:
        throw new Error(`Method ${method} not implemented`);
    }
  }

  sendResponse(id, method, result) {
    window.parent.postMessage({
      id,
      action: 'methodResult',
      method,
      result
    }, '*');
  }

  sendError(id, method, error) {
    window.parent.postMessage({
      id,
      action: 'methodResult',
      method,
      error
    }, '*');
  }

  emitEvent(eventName, payload) {
      window.parent.postMessage({
          action: 'eventEmit',
          event: eventName,
          payload
      }, '*');
  }

  notifyReady() {
    // 兼容旧版和新版协议
    this.emitEvent('editorReady', true);
  }
}
