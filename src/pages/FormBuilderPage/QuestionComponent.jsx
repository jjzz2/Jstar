import React from 'react';
import { Input, Typography, Radio, Checkbox, Space } from 'antd';
import { COMPONENT_TYPES } from '../../store/formBuilderSlice';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const QuestionComponent = ({ component, isSelected }) => {
  const { type, props } = component;

  const renderComponent = () => {
    switch (type) {
      case COMPONENT_TYPES.QUESTION_INPUT:
        return (
          <div>
            <Title level={5} style={{ marginBottom: '8px' }}>
              {props.title}
            </Title>
            <Input placeholder={props.placeholder} disabled />
          </div>
        );

      case COMPONENT_TYPES.QUESTION_TITLE:
        return (
          <Title 
            level={props.level} 
            style={{ 
              textAlign: props.isCenter ? 'center' : 'left',
              marginBottom: '8px'
            }}
          >
            {props.text}
          </Title>
        );

      case COMPONENT_TYPES.QUESTION_PARAGRAPH:
        return (
          <Paragraph 
            style={{ 
              textAlign: props.isCenter ? 'center' : 'left',
              marginBottom: '8px'
            }}
          >
            {props.text}
          </Paragraph>
        );

      case COMPONENT_TYPES.QUESTION_INFO:
        return (
          <div style={{ 
            background: '#f6f8fa', 
            padding: '16px', 
            borderRadius: '6px',
            border: '1px solid #d0d7de'
          }}>
            <Title level={5} style={{ marginBottom: '8px' }}>
              {props.title}
            </Title>
            <Text type="secondary">{props.desc}</Text>
          </div>
        );

      case COMPONENT_TYPES.QUESTION_TEXTAREA:
        return (
          <div>
            <Title level={5} style={{ marginBottom: '8px' }}>
              {props.title}
            </Title>
            <TextArea 
              placeholder={props.placeholder} 
              rows={3} 
              disabled 
            />
          </div>
        );

      case COMPONENT_TYPES.QUESTION_RADIO:
        return (
          <div>
            <Title level={5} style={{ marginBottom: '12px' }}>
              {props.title}
            </Title>
            <Radio.Group disabled>
              <Space direction="vertical">
                {props.options?.map((option, index) => (
                  <Radio key={index} value={option.value}>
                    {option.text}
                  </Radio>
                ))}
              </Space>
            </Radio.Group>
          </div>
        );

      case COMPONENT_TYPES.QUESTION_CHECKBOX:
        return (
          <div>
            <Title level={5} style={{ marginBottom: '12px' }}>
              {props.title}
            </Title>
            <Checkbox.Group disabled>
              <Space direction="vertical">
                {props.list?.map((item, index) => (
                  <Checkbox key={index} value={item.value}>
                    {item.text}
                  </Checkbox>
                ))}
              </Space>
            </Checkbox.Group>
          </div>
        );

      default:
        return (
          <div style={{ 
            padding: '16px', 
            border: '1px dashed #d9d9d9',
            borderRadius: '4px',
            textAlign: 'center',
            color: '#999'
          }}>
            未知组件类型: {type}
          </div>
        );
    }
  };

  return (
    <div style={{
      opacity: component.isHidden ? 0.5 : 1,
      pointerEvents: component.isLocked ? 'none' : 'auto'
    }}>
      {renderComponent()}
    </div>
  );
};

export default QuestionComponent;
