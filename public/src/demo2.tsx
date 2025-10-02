//手写modal
import { useState } from "react";

const Modal = ({ children, onClose, isVisible }) => {
  const [isModalVisible, setIsModalVisible] = useState(isVisible);

  function handleClick() {
    setIsModalVisible(!isModalVisible);
    onClose();
  }

  return (
    <div>
      (isVisible&&
      <div className="overlay" onClick={handleClick}>
        <div className={"main"} onClick={(e) => e.stopPropagation()}>
          模态框
        </div>
        <button onClick={handleClick}>关闭</button>
        {children}
      </div>
      )
    </div>
  );
};
