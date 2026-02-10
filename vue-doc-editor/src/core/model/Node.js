import { v4 as uuidv4 } from 'uuid';

export class DocNode {
  constructor(type = 'paragraph', content = '', children = [], attributes = {}) {
    this.id = uuidv4();
    this.type = type; // 'doc', 'paragraph', 'heading', 'image'
    this.content = content; // Text content
    this.children = children; // Child nodes
    this.attributes = attributes; // styles, metadata
  }

  static create(type, content = '', children = []) {
    return new DocNode(type, content, children);
  }
  
  clone() {
     const clone = new DocNode(this.type, this.content, this.children.map(c => c.clone()), {...this.attributes});
     clone.id = this.id; // Keep ID for tracking
     return clone;
  }
}
