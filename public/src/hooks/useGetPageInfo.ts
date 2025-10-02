import { useSelector } from "react-redux";
import type { StateType } from "../store";
import type { PageInfoType } from "../store/pageInfoReducer";

function useGetPageInfo() {
  //从redux中获取各种数据。
  const pageInfo = useSelector<StateType>(
    (state) => state.pageInfo
  ) as PageInfoType;
  return pageInfo;
}

export default useGetPageInfo;
