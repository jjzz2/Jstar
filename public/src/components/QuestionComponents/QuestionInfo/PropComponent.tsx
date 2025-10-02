import React, { FC, useEffect } from "react";
import { Form, Input } from "antd";
import { QuestionInfoPropsType } from "./interface";

const { TextArea } = Input;
//其的prop属性和Input是一致的.
const PropComponent: FC<QuestionInfoPropsType> = (
  props: QuestionInfoPropsType
) => {
  const { title, desc, onChange, disabled } = props;
  const [form] = Form.useForm();
  //只要title,desc发生变化，那么就进行变化
  useEffect(() => {
    form.setFieldsValue({ title, desc });
  }, [title, desc]);

  function handleValuesChange() {
    if (onChange) {
      //直接封装方法来获取其的价值
      onChange(form.getFieldsValue());
    }
  }

  //注意：原本的form是onValuesChange
  return (
    <Form
      layout="vertical"
      initialValues={{ title, desc }}
      onValuesChange={handleValuesChange}
      disabled={disabled}
      form={form}
    >
      <Form.Item
        label="标题"
        name="title"
        rules={[{ required: true, message: "请输入问卷标题" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item label="描述" name="desc">
        <TextArea />
      </Form.Item>
    </Form>
  );
};

export default PropComponent;
