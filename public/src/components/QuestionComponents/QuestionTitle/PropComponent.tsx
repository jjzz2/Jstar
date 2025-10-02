import React, { FC, useEffect } from "react";
import { Form, Input, Select, Checkbox } from "antd";
import { QuestionTitlePropsType } from "./interface";

const PropComponent: FC<QuestionTitlePropsType> = (
  props: QuestionTitlePropsType
) => {
  const { text, level, isCenter, onChange, disabled } = props;
  const [form] = Form.useForm();
  //标题的属性：居中，文本，大小
  useEffect(() => {
    form.setFieldsValue({
      text,
      level,
      isCenter,
    });
  }, [text, level, isCenter]);

  //只是规定了改变prop属性时会触发onChange函数
  function handleValueChange() {
    if (onChange) {
      onChange(form.getFieldsValue());
    }
  }

  //实际上属性会反馈到题目本身组件上
  return (
    <Form
      form={form}
      layout="vertical"
      onValuesChange={handleValueChange}
      initialValues={{ text, level, isCenter }}
      disabled={disabled}
    >
      <Form.Item
        label="标题内容"
        name="text"
        rules={[{ required: true, message: "请输入标题内容" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item label="层级" name="level">
        <Select
          options={[
            { value: 1, text: 1 },
            { value: 2, text: 2 },
            { value: 3, text: 3 },
          ]}
        ></Select>
      </Form.Item>
      <Form.Item name="isCenter" valuePropName="checked">
        <Checkbox>居中显示</Checkbox>
      </Form.Item>
    </Form>
  );
};

export default PropComponent;
