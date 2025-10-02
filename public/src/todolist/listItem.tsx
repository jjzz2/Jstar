import { useState } from "react";
import React from "react";
const ListItem = (props: any) => {
  const { id, title, deleteItem, toggleCompletion, completed } = props;
  const [finished, setFinished] = useState(completed);

  const handleDelete = () => {
    deleteItem(id); // 删除项时传递 ID 或其他标识
  };

  const handleComplete = () => {
    setFinished(!finished); // 切换完成状态
    toggleCompletion(id); // 通知父组件更新完成状态
  };

  return (
    <div>
      <div>{finished ? "已完成" : "未完成"}</div>
      <div>{title}</div>
      <button onClick={handleComplete}>
        {finished ? "标记为未完成" : "标记为完成"}
      </button>
      <button onClick={handleDelete}>删除</button>
    </div>
  );
};

export default ListItem;
