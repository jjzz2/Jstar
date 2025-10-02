import { useKeyPress } from "ahooks";
import { useDispatch } from "react-redux";
import { ActionCreators as UndoActionCreators } from "redux-undo";
import {
  removeSelectedComponent,
  copySelectedComponent,
  pasteCopiedComponent,
  selectPrevComponent,
  selectNextComponent,
} from "../store/componentsReducer";

/**
 * 判断 activeElem 是否合法
 */
//将其的事件放至钩子函数中执行
// 这个函数isActiveElementValid()
// 是一个用于判断当前激活元素是否“允许继续执行某些行为”的工具函数，
// 通常用于控制键盘事件、快捷键、拖拽行为等是否应该触发。
function isActiveElementValid() {
  const activeElem = document.activeElement;
  // // 没有增加 dnd-kit 之前
  // if (activeElem === document.body) return true // 光标没有 focus 到 input

  // 增加了 dnd-kit 以后
  if (activeElem === document.body) return true;
  if (activeElem?.matches('div[role="button"]')) return true;

  return false;
}

//更新鼠标事件
//使用useKePress来进行监听，但是我觉得应该是使用dom来监听事件
function useBindCanvasKeyPress() {
  const dispatch = useDispatch();

  // 删除组件
  useKeyPress(["backspace", "delete"], () => {
    if (!isActiveElementValid()) return;
    dispatch(removeSelectedComponent());
  });

  // 复制
  useKeyPress(["ctrl.c"], () => {
    if (!isActiveElementValid()) return;
    dispatch(copySelectedComponent());
  });

  // 粘贴
  useKeyPress(["ctrl.v"], () => {
    if (!isActiveElementValid()) return;
    dispatch(pasteCopiedComponent());
  });

  // 选中上一个
  useKeyPress("uparrow", () => {
    if (!isActiveElementValid()) return;
    dispatch(selectPrevComponent());
  });

  // 选中下一个
  useKeyPress("downarrow", () => {
    if (!isActiveElementValid()) return;
    dispatch(selectNextComponent());
  });

  // 撤销
  //直接使用一个组件库来完成的
  useKeyPress(
    ["ctrl.z"],
    () => {
      if (!isActiveElementValid()) return;
      dispatch(UndoActionCreators.undo());
    },
    {
      exactMatch: true, // 严格匹配
    }
  );

  // 重做
  useKeyPress(["ctrl.shift.z"], () => {
    if (!isActiveElementValid()) return;
    dispatch(UndoActionCreators.redo());
  });
}

export default useBindCanvasKeyPress;
