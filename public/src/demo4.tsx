//实现一个下拉选择组件
import { useEffect, useState } from "react";
import { itemsEqual } from "@dnd-kit/sortable/dist/utilities";
import { set } from "husky";
import { number } from "prop-types";

const Myselect = ({ options = [] }) => {
  if (!options) return null;
  const [onselect, setOnselect] = useState(false);
  const [InputValue, setInputValue] = useState("");
  const handleClick = (item) => {
    setOnselect(true);
    setInputValue(item.value);
  };
  return (
    <div>
      <input value={InputValue} />
      {options.map((item) => {
        return <div onClick={handleClick}>{item.label}</div>;
      })}
    </div>
  );
};

//到tabs了
interface tabProps {
  index: number;
  content: string;
  label: string;
}

interface tabsProps {
  tabs: tabProps[];
}

import React, { useState } from "react";
import { useForm } from "antd/es/form/Form";

type TabItem = {
  label: string;
  content: React.ReactNode;
};

type TabsProps = {
  tabs: TabItem[];
};

const Tabs = (props: TabsProps) => {
  const { tabs } = props;
  const [activeIndex, setActiveIndex] = useState(0);

  const handleClick = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <div>
      {/* tab headers */}
      <div style={{ display: "flex" }}>
        {tabs.map((item, index) => (
          <div
            key={index}
            onClick={() => handleClick(index)}
            style={{
              padding: "8px 16px",
              cursor: "pointer",
              fontWeight: activeIndex === index ? "bold" : "normal",
              borderBottom: activeIndex === index ? "2px solid blue" : "none",
            }}
          >
            {item.label}
          </div>
        ))}
      </div>

      {/* active tab content */}
      <div style={{ padding: "16px" }}>{tabs[activeIndex].content}</div>
    </div>
  );
};

function useForm(initialValues) {
  const [formData, setFormData] = useState(initialValues);

  // 更新某个字段
  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // 批量更新
  const setForm = (newValues) => {
    setFormData((prev) => ({
      ...prev,
      ...newValues,
    }));
  };

  // 重置为初始值
  const resetForm = () => {
    setFormData(initialValues);
  };

  return [formData, handleChange, resetForm, setForm];
}

function FormComponent() {
  const [form, handleChange, resetForm, setForm] = useForm({
    username: "",
    password: "",
  });

  const handleSubmit = () => {
    console.log("提交表单：", form);
  };

  return (
    <div>
      {Object.entries(form).map(([field, value]) => (
        <div key={field} style={{ marginBottom: "10px" }}>
          <label>{field}</label>
          <input
            value={value}
            onChange={(e) => handleChange(field, e.target.value)}
            style={{ marginLeft: "8px" }}
          />
        </div>
      ))}

      <button onClick={handleSubmit}>提交</button>
      <button onClick={resetForm} style={{ marginLeft: "10px" }}>
        重置
      </button>
      <button
        onClick={() => setForm({ username: "预设用户" })}
        style={{ marginLeft: "10px" }}
      >
        填充用户名
      </button>
    </div>
  );
}
