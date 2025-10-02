import { useState } from "react";
import Input from "./input";
import List from "./List";
import React from "react";
const TodoList = () => {
  // 初始待办事项列表
  const [todoItems, setTodoItems] = useState([
    { id: 1, title: "标题1", completed: false },
    { id: 2, title: "标题2", completed: false },
    { id: 3, title: "标题3", completed: false },
  ]);

  // 添加待办事项
  const addTodoItem = (title: string) => {
    const newId =
      todoItems.length > 0
        ? Math.max(...todoItems.map((item) => item.id)) + 1
        : 1;
    setTodoItems([...todoItems, { id: newId, title, completed: false }]);
  };

  // 删除待办事项
  const deleteTodoItem = (id: number) => {
    setTodoItems(todoItems.filter((item) => item.id !== id));
  };

  // 切换待办事项完成状态
  const toggleTodoCompletion = (id: number) => {
    setTodoItems(
      todoItems.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  return (
    <>
      <div>
        <Input addTodoItem={addTodoItem} />
        <List
          items={todoItems}
          deleteItem={deleteTodoItem}
          toggleCompletion={toggleTodoCompletion}
        />
      </div>
    </>
  );
};

export default TodoList;
