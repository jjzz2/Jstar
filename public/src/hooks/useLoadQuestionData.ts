import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useRequest } from "ahooks";
import { useDispatch } from "react-redux";
import { getQuestionService } from "../services/question";
import { resetComponents } from "../store/componentsReducer";
import { resetPageInfo } from "../store/pageInfoReducer";

function useLoadQuestionData() {
  const { id = "" } = useParams();
  const dispatch = useDispatch();

  // ajax 加载
  const { data, loading, error, run } = useRequest(
    async (id: string) => {
      if (!id) throw new Error("没有问卷 id");
      const data = await getQuestionService(id);
      return data;
    },
    {
      manual: true,
    }
  );

  // 根据获取的 data 设置 redux store
  useEffect(() => {
    if (!data) return;

    const {
      title = "",
      desc = "",
      js = "",
      css = "",
      isPublished = false,
      componentList = [],
    } = data;

    // 获取默认的 selectedId
    let selectedId = "";
    if (componentList.length > 0) {
      selectedId = componentList[0].fe_id; // 默认选中第一个组件
    }

    // 把 componentList 存储到 Redux store 中
    dispatch(
      resetComponents({ componentList, selectedId, copiedComponent: null })
    );

    // 把 pageInfo 存储到 redux store
    //存储的是这个页面的整体资源
    dispatch(resetPageInfo({ title, desc, js, css, isPublished }));
  }, [data]);

  // 判断 id 变化，执行 ajax 加载问卷数据
  useEffect(() => {
    run(id);
  }, [id]);

  return { loading, error };
}

export default useLoadQuestionData;
//可以自己想想，如何将自己的实习经历进行一个串联，并且最后进行一个输出。
//然后进行一个内容的输出。
