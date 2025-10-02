// 4. 手写一个 Tab 组件
// 要求：实现一个简单的标签页切换功能。
//虚拟列表的核心思想:通过获取ref值来得到当前高度并且进行相减

import { useRef, useState } from "react";

type InfiniteScrollProps = {
  loadMore: () => Promise<any[]>; // 加载数据函数
  hasMore: boolean; // 是否还有更多数据
  data: any[];
  renderItem: (item: any, index: number) => React.ReactNode;
  threshold?: number; // 距底部多少触发加载
  loadingText?: string;
  noMoreText?: string;
};
const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
  loadMore,
  hasMore,
  data,
  renderItem,
  threshold = 100,
  loadingText = "加载中...",
  noMoreText = "没有更多数据了",
}) => {
  //1.获取其是否正在在加载的值
  //1.无限滚动需要的是ref值
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;
    const { scrollTop, scrollHeight, offsetHeight } = container;
    if (scrollTop + offsetHeight >= scrollHeight - threshold) {
      setLoading(true);
      loadMore().then(() => setLoading(true));
    }
  };
};

export default InfiniteScroll;
