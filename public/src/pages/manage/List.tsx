import React, { FC, useEffect, useState, useRef, useMemo } from "react";
import { Typography, Spin, Empty } from "antd";
import { useTitle, useDebounceFn, useRequest } from "ahooks";
import { useSearchParams } from "react-router-dom";
import { getQuestionListService } from "../../services/question";
import QuestionCard from "../../components/QuestionCard";
import ListSearch from "../../components/ListSearch";
import { LIST_PAGE_SIZE, LIST_SEARCH_PARAM_KEY } from "../../constant/index";
import styles from "./common.module.scss";
import { useDispatch } from "react-redux";

const { Title } = Typography;
const List: FC = () => {
  useTitle("小慕问卷");
  //设置翻页
  //该项目使用getBoundingReat实现翻页的功能。
  const [started, setStarted] = useState(false);
  const [page, setPage] = useState(1);
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  //设置为正负或者
  const haveMoreData = total > list.length ? true : false;
  //获取当前路径
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get(LIST_SEARCH_PARAM_KEY) || "";
  //重置
  useEffect(() => {
    setStarted(false);
    setPage(1);
    setList([]);
    setTotal(0);
  }, [keyword]);
  //这里是实现无限滚动
  const { run: load, loading } = useRequest(
    async () => {
      //获取数据，也可以使用封装的钩子函数来实现
      const data = await getQuestionListService({
        page,
        pageSize: LIST_PAGE_SIZE,
        keyword,
      });
      return data;
    },
    {
      manual: true,
      onSuccess(result) {
        const { list: l = [], total = 0 } = result;
        setList(list.concat(l));
        setTotal(total);
        setPage(page + 1);
      },
    }
  );
  //使用useRef控制触发加载
  const containerRef = useRef<HTMLDivElement>(null);
  //useDebounceFn返回run对象并最后返回tryLoadMore函数。
  const { run: tryLoadMore } = useDebounceFn(
    () => {
      const element = containerRef.current;
      if (element == null) return;
      //使用element.getBoundingClientRect属性计算bottom属性值并且与document.body.clientHeight比较大小并且最后取出值。
      const domRect = element.getBoundingClientRect();
      if (domRect == null) return;
      const { bottom } = domRect;
      if (bottom <= document.body.clientHeight) {
        //触发load函数来完成其的加载
        load();
        setStarted(true);
      }
    },
    {
      wait: 1000,
    }
  );
  useEffect(() => {
    tryLoadMore();
  }, [searchParams]);
  useEffect(() => {
    if (haveMoreData) {
      //监听滚动事件。
      window.addEventListener("scroll", tryLoadMore);
    }
    return () => {
      window.removeEventListener("scroll", tryLoadMore);
    };
  }, [searchParams, haveMoreData]);
  const LoadMoreContentElem = useMemo(() => {
    if (!started || loading) return <Spin></Spin>;
    if (total === 0) return <Empty description={"暂无数据"}></Empty>;
    if (!haveMoreData) return <span>没有更多了</span>;
    return <span>开始加载</span>;
  }, [started, loading, haveMoreData]);
  return (
    <>
      <div className={styles.header}>
        <div className={styles.left}>
          <Title level={3}>我的问卷</Title>
        </div>
        <div className={styles.right}>
          <ListSearch></ListSearch>
        </div>
      </div>
      <div className={styles.content}>
        {list.length > 0 &&
          list.map((q: any) => {
            const { _id } = q;
            return <QuestionCard key={_id} {...q} />;
          })}
      </div>
      <div className={styles.footer}>
        <div ref={containerRef}>{LoadMoreContentElem}</div>
      </div>
    </>
  );
};

export default List;
