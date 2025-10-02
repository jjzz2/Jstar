import { useSelector } from "react-redux";
import { StateType } from "../store";
import { ComponentsStateType } from "../store/componentsReducer";

//todo 核心在这个钩子函数上
//通过react-undo的api实现其的撤销，获取组件等操作
function useGetComponentInfo() {
  // redux store
  const components = useSelector<StateType>(
    //通过undo这个api来获取其的present组件来进行其的下一步操作。
    (state) => state.components.present
  ) as ComponentsStateType;
  const { componentList = [], selectedId, copiedComponent } = components;

  const selectedComponent = componentList.find((c) => c.fe_id === selectedId);

  return {
    componentList,
    selectedId,
    selectedComponent,
    copiedComponent,
  };
}

export default useGetComponentInfo;
