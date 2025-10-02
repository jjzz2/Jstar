import ListItem from "./listItem";
import React from "react";
const List = (props: any) => {
  const { items, deleteItem, toggleCompletion } = props;

  return (
    <div>
      {items &&
        items.map((item) => {
          return (
            <ListItem
              key={item.id}
              id={item.id}
              title={item.title}
              deleteItem={deleteItem}
              toggleCompletion={toggleCompletion}
              completed={item.completed}
            />
          );
        })}
    </div>
  );
};

export default List;
