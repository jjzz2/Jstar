//手写todoList
import { useState } from "react";
import { Button, Input } from "antd";

export const Inputs = (props:any) => {
  const { addToList } = props;

  function addToListHandler() {
    addToList(title);
  }

  const [title, setTitle] = useState("");
  return (
    <div>
      <Input onChange={(e) => setTitle(e.target.value)}></Input>
      <Button onClick={addToListHandler}>提交</Button>
    </div>
  );
};
export const ListItems = (props:any) => {
  const { listItem } = props;
  const { title } = listItem;
  return <div>{title}</div>;
};
const MyTodoList = (props) => {
  //1.以终为始
  const [list, setList] = useState([
    { title: "xxx" },
    { title: "xxx" },
    { title: "xxx" },
  ]);

  function add(title) {
    setList([...list, { title: title }]);
  }

  return (
    <div>
      <Inputs addToList={add}></Inputs>
      {list.map((item) => (
        <ListItems listItem={item} key={item.title}></ListItems>
      ))}
    </div>
  );
};
export default MyTodoList;
