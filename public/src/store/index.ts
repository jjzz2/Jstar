import { configureStore } from "@reduxjs/toolkit";
import undoable, { excludeAction, StateWithHistory } from "redux-undo";
import userReducer, { UserStateType } from "./userReducer";
import componentsReducer, { ComponentsStateType } from "./componentsReducer";
import pageInfoReducer, { PageInfoType } from "./pageInfoReducer";

export type StateType = {
  user: UserStateType;
  // components: ComponentsStateType
  // ，StateWithHistory 会将你的 ComponentsStateType 包装成一个具有历史记录的结构。这个结构包含：
  // past: 存放历史的组件状态，最多可以回退到 20 步（根据你的 limit: 20 配置）。这些状态是先前的 components 状态。
  // present: 当前的组件状态，表示最新的 components 数据。在你的代码中，它包含了最新的 componentList、selectedId 和 copiedComponent
  // future: 存储已经被重做的状态，表示那些曾经被撤销并重新应用的状态。
  components: StateWithHistory<ComponentsStateType>; // 增加了 undo
  pageInfo: PageInfoType;
};

export default configureStore({
  reducer: {
    user: userReducer,

    // // 没有 undo
    // components: componentsReducer,

    // 增加了 undo
    components: undoable(componentsReducer, {
      limit: 20, // 限制 undo 20 步
      filter: excludeAction([
        "components/resetComponents",
        "components/changeSelectedId",
        "components/selectPrevComponent",
        "components/selectNextComponent",
      ]),
    }),

    pageInfo: pageInfoReducer,
  },
});
