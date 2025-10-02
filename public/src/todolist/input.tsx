// Input.tsx
import { useState } from "react";
import React from "react";
interface InputProps {
  addTodoItem: (title: string) => void; // 修改为 addTodoItem,与父组件的属性名称保持一致。
}

const Input = (props: InputProps) => {
  const { addTodoItem } = props; // 使用 addTodoItem
  const [newTitle, setNewTitle] = useState("");

  const handleClick = () => {
    if (newTitle.trim()) {
      addTodoItem(newTitle); // 调用父组件的 addTodoItem 方法
      setNewTitle(""); // 清空输入框
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(e.target.value);
  };

  return (
    <div>
      <input
        value={newTitle}
        onChange={handleChange}
        placeholder="请输入标题"
      />
      <button onClick={handleClick}>添加</button>
    </div>
  );
};

export default Input;
