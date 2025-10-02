import React from 'react';
import { Form, Input, InputNumber, Switch, Button, Space, Typography, Divider } from 'antd';
import { useDispatch } from 'react-redux';
import { changeComponentProps, changeComponentTitle } from '../../store/formBuilderSlice';
import { COMPONENT_TYPES } from '../../store/formBuilderSlice';

const { Title, Text } = Typography;
const { TextArea } = Input;

const PropComponent = ({ component }) => {
  const dispatch = useDispatch();
  const { fe_id, type, props, title } = component;

  const handlePropsChange = (changedValues) => {
    dispatch(changeComponentProps({ 
      fe_id, 
      newProps: changedValues 
    }));
  };

  const handleTitleChange = (newTitle) => {
    dispatch(changeComponentTitle({ fe_id, title: newTitle }));
  };

  const renderPropsForm = () => {
    switch (type) {
      case COMPONENT_TYPES.QUESTION_INPUT:
        return (
          <Form
            layout="vertical"
            initialValues={props}
            onValuesChange={handlePropsChange}
            size="small"
          >
            <Form.Item label="标题" name="title">
              <Input 
                placeholder="请输入标题"
                onChange={(e) => handleTitleChange(e.target.value)}
              />
            </Form.Item>
            <Form.Item label="占位符" name="placeholder">
              <Input placeholder="请输入占位符" />
            </Form.Item>
          </Form>
        );

      case COMPONENT_TYPES.QUESTION_TITLE:
        return (
          <Form
            layout="vertical"
            initialValues={props}
            onValuesChange={handlePropsChange}
            size="small"
          >
            <Form.Item label="标题文本" name="text">
              <Input 
                placeholder="请输入标题"
                onChange={(e) => handleTitleChange(e.target.value)}
              />
            </Form.Item>
            <Form.Item label="标题级别" name="level">
              <InputNumber min={1} max={6} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label="居中显示" name="isCenter" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Form>
        );

      case COMPONENT_TYPES.QUESTION_PARAGRAPH:
        return (
          <Form
            layout="vertical"
            initialValues={props}
            onValuesChange={handlePropsChange}
            size="small"
          >
            <Form.Item label="段落文本" name="text">
              <TextArea 
                rows={3}
                placeholder="请输入段落内容"
                onChange={(e) => handleTitleChange(e.target.value)}
              />
            </Form.Item>
            <Form.Item label="居中显示" name="isCenter" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Form>
        );

      case COMPONENT_TYPES.QUESTION_INFO:
        return (
          <Form
            layout="vertical"
            initialValues={props}
            onValuesChange={handlePropsChange}
            size="small"
          >
            <Form.Item label="信息标题" name="title">
              <Input 
                placeholder="请输入信息标题"
                onChange={(e) => handleTitleChange(e.target.value)}
              />
            </Form.Item>
            <Form.Item label="信息描述" name="desc">
              <TextArea 
                rows={3}
                placeholder="请输入信息描述"
              />
            </Form.Item>
          </Form>
        );

      case COMPONENT_TYPES.QUESTION_TEXTAREA:
        return (
          <Form
            layout="vertical"
            initialValues={props}
            onValuesChange={handlePropsChange}
            size="small"
          >
            <Form.Item label="标题" name="title">
              <Input 
                placeholder="请输入标题"
                onChange={(e) => handleTitleChange(e.target.value)}
              />
            </Form.Item>
            <Form.Item label="占位符" name="placeholder">
              <Input placeholder="请输入占位符" />
            </Form.Item>
          </Form>
        );

      case COMPONENT_TYPES.QUESTION_RADIO:
        return (
          <Form
            layout="vertical"
            initialValues={props}
            onValuesChange={handlePropsChange}
            size="small"
          >
            <Form.Item label="标题" name="title">
              <Input 
                placeholder="请输入标题"
                onChange={(e) => handleTitleChange(e.target.value)}
              />
            </Form.Item>
            <Form.Item label="选项">
              <Text type="secondary" style={{ fontSize: '12px' }}>
                选项配置功能待开发
              </Text>
            </Form.Item>
          </Form>
        );

      case COMPONENT_TYPES.QUESTION_CHECKBOX:
        return (
          <Form
            layout="vertical"
            initialValues={props}
            onValuesChange={handlePropsChange}
            size="small"
          >
            <Form.Item label="标题" name="title">
              <Input 
                placeholder="请输入标题"
                onChange={(e) => handleTitleChange(e.target.value)}
              />
            </Form.Item>
            <Form.Item label="选项">
              <Text type="secondary" style={{ fontSize: '12px' }}>
                选项配置功能待开发
              </Text>
            </Form.Item>
          </Form>
        );

      default:
        return (
          <div style={{ textAlign: 'center', color: '#999' }}>
            暂不支持此组件的属性编辑
          </div>
        );
    }
  };

  return (
    <div style={{ padding: '16px' }}>
      <div style={{ marginBottom: '16px' }}>
        <Title level={5} style={{ marginBottom: '4px' }}>
          {title}
        </Title>
        <Text type="secondary" style={{ fontSize: '12px' }}>
          {type}
        </Text>
      </div>

      <Divider style={{ margin: '12px 0' }} />

      {renderPropsForm()}
    </div>
  );
};

export default PropComponent;
