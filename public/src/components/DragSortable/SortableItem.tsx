import React, { FC } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type PropsType = {
  id: string;
  children: JSX.Element;
};
//使用useSortable这个钩子函数，并且
const SortableItem: FC<PropsType> = ({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  //伴随着动画，例如：缩放，平移等等操作。
  //使用transition来控制其的动画过渡。
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  //获取实际的domRef操控拖住啊
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
};

export default SortableItem;
