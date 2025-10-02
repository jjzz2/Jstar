import React from 'react';
import { List, Typography, Space, Button } from 'antd';
import { 
  EyeOutlined, 
  EyeInvisibleOutlined,
  LockOutlined,
  UnlockOutlined,
  DeleteOutlined,
  CopyOutlined
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { 
  changeSelectedId, 
  removeSelectedComponent,
  toggleComponentLocked,
  copySelectedComponent,
  pasteCopiedComponent
} from '../../store/formBuilderSlice';

const { Text } = Typography;

const Layers = () => {
  const dispatch = useDispatch();
  const { componentList, selectedId } = useSelector(state => state.formBuilder);

  const handleSelect = (fe_id) => {
    dispatch(changeSelectedId(fe_id));
  };

  const handleDelete = (fe_id) => {
    dispatch(changeSelectedId(fe_id));
    dispatch(removeSelectedComponent());
  };

  const handleToggleLock = (fe_id) => {
    dispatch(toggleComponentLocked({ fe_id }));
  };

  const handleCopy = (fe_id) => {
    dispatch(changeSelectedId(fe_id));
    dispatch(copySelectedComponent());
  };

  const handlePaste = () => {
    dispatch(pasteCopiedComponent());
  };

  const getComponentIcon = (type) => {
    const iconMap = {
      questionInfo: 'ℹ️',
      questionTitle: '📝',
      questionParagraph: '📄',
      questionInput: '✏️',
      questionTextarea: '📝',
      questionRadio: '🔘',
      questionCheckbox: '☑️',
    };
    return iconMap[type] || '📄';
  };

  return (
    <div style={{ padding: '16px' }}>
      <div style={{ marginBottom: '16px' }}>
        <Space>
          <Button 
            size="small" 
            onClick={handlePaste}
            disabled={componentList.length === 0}
          >
            <CopyOutlined />
            粘贴
          </Button>
        </Space>
      </div>

      {componentList.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '32px 16px',
          color: '#999'
        }}>
          <Text type="secondary">
            暂无组件
          </Text>
        </div>
      ) : (
        <List
          size="small"
          dataSource={componentList}
          renderItem={(component, index) => (
            <List.Item
              key={component.fe_id}
              style={{
                padding: '8px 12px',
                cursor: 'pointer',
                background: selectedId === component.fe_id ? '#e6f7ff' : 'transparent',
                border: selectedId === component.fe_id ? '1px solid #1890ff' : '1px solid transparent',
                borderRadius: '4px',
                marginBottom: '4px'
              }}
              onClick={() => handleSelect(component.fe_id)}
              actions={[
                <Button
                  key="lock"
                  type="text"
                  size="small"
                  icon={component.isLocked ? <LockOutlined /> : <UnlockOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleLock(component.fe_id);
                  }}
                />,
                <Button
                  key="copy"
                  type="text"
                  size="small"
                  icon={<CopyOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopy(component.fe_id);
                  }}
                />,
                <Button
                  key="delete"
                  type="text"
                  size="small"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(component.fe_id);
                  }}
                />
              ]}
            >
              <List.Item.Meta
                avatar={
                  <span style={{ fontSize: '16px' }}>
                    {getComponentIcon(component.type)}
                  </span>
                }
                title={
                  <Text style={{ fontSize: '13px' }}>
                    {component.title}
                  </Text>
                }
                description={
                  <Text type="secondary" style={{ fontSize: '11px' }}>
                    {index + 1}. {component.type}
                  </Text>
                }
              />
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default Layers;
