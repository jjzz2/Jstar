// 、Form 表单组件
// 组件名称： <Form />
import { useState } from "react";

interface FormProps {
  onSubmit: (formData: { [key: string]: string }) => void;
}

const Form = (props: FormProps) => {
  const { onSubmit } = props;
  //一般正确的方式都是使用一个对象来对物体实现描述
  const [data, setData] = useState({
    name: "",
    email: "",
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };
  const handleClick = (data) => {
    onSubmit(data);
    setData({
      name: "",
      email: "",
    });
  };
  return (
    <div>
      <input value={data.name} onChange={(e) => setData(e.target.value)} />
      <input value={data.email} onChange={(e) => setData(e.target.value)} />
      <button onClick={handleClick}>提交</button>
    </div>
  );
};
