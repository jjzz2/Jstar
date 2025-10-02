import React from 'react';
import { Form, Input, Button, Typography } from 'antd';
import { useDispatch } from 'react-redux';
import { changePageInfo } from '../../store/formBuilderSlice';

const { Title, Text } = Typography;
const { TextArea } = Input;

const PageSettings = ({ pageInfo }) => {
  const dispatch = useDispatch();

  const handlePageInfoChange = (changedValues) => {
    dispatch(changePageInfo(changedValues));
  };

  return (
    <div style={{ padding: '16px' }}>
      <Title level={5} style={{ marginBottom: '16px' }}>
        页面设置
      </Title>

      <Form
        layout="vertical"
        initialValues={pageInfo}
        onValuesChange={handlePageInfoChange}
        size="small"
      >
        <Form.Item 
          label="表单标题" 
          name="title"
          rules={[{ required: true, message: '请输入表单标题' }]}
        >
          <Input placeholder="请输入表单标题" />
        </Form.Item>

        <Form.Item label="表单描述" name="desc">
          <TextArea 
            rows={3}
            placeholder="请输入表单描述（可选）"
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" size="small" block>
            保存设置
          </Button>
        </Form.Item>
      </Form>

      <div style={{ 
        marginTop: '24px',
        padding: '12px',
        background: '#f9f9f9',
        borderRadius: '6px'
      }}>
        <Text type="secondary" style={{ fontSize: '12px' }}>
          💡 提示：修改页面设置后记得保存表单
        </Text>
      </div>
    </div>
  );
};

export default PageSettings;
