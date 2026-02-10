export class HistoryManager {
  constructor(limit = 50) {
    this.undoStack = [];
    this.redoStack = [];
    this.limit = limit;
  }

  push(stateSnapshot) {
    this.undoStack.push(stateSnapshot);
    if (this.undoStack.length > this.limit) {
      this.undoStack.shift();
    }
    this.redoStack = []; // Clear redo on new action
  }

  undo(currentState) {
    if (this.undoStack.length === 0) return null;
    const previousState = this.undoStack.pop();
    this.redoStack.push(currentState);
    return previousState;
  }

  redo(currentState) {
    if (this.redoStack.length === 0) return null;
    const nextState = this.redoStack.pop();
    this.undoStack.push(currentState);
    return nextState;
  }
}
