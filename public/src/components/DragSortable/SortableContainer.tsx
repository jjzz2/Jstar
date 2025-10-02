import React, { FC } from "react";
import {
  DndContext,
  closestCenter,
  MouseSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  // arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

type PropsType = {
  children: JSX.Element | JSX.Element[];
  items: Array<{ id: string; [key: string]: any }>;
  onDragEnd: (oldIndex: number, newIndex: number) => void;
};
//首先封装sortableContainer，然后将其进行区分。
const SortableContainer: FC<PropsType> = (props: PropsType) => {
  const { children, items, onDragEnd } = props;
  //设置传感器在其中使用
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8, // 8px
      },
    })
  );

  //重点在handleDragend中
  //子组件只负责处理其拖拽之后的交互
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over == null) return;

    if (active.id !== over.id) {
      const oldIndex = items.findIndex((c) => c.fe_id === active.id);
      const newIndex = items.findIndex((c) => c.fe_id === over.id);
      //根据传入的参数来修改函数，具体的逻辑在父组件实现，子组件只给你这个函数
      onDragEnd(oldIndex, newIndex);
    }
  }

  //高阶组件。内部封装了DndContext和SortableContext组件来保证平衡。
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
    </DndContext>
  );
};

export default SortableContainer;
// DndContext 负责拖拽的 生命周期管理。
//一个管 事件，一个管 顺序关系。
// SortableContext 负责指定 可排序元素及顺序管理。