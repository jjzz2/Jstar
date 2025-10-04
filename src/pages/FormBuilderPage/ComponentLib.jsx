import React from 'react';
import { Card, Space, Typography } from 'antd';
import { 
  FileTextOutlined,
  EditOutlined,
  CheckSquareOutlined,
  InfoCircleOutlined,
  FontSizeOutlined,
  AlignLeftOutlined
} from '@ant-design/icons';
import { COMPONENT_GROUPS, COMPONENT_CONFIGS } from '../../store/formBuilderSlice';

const { Title, Text } = Typography;

const ComponentLib = ({ onAddComponent }) => {
  const getComponentIcon = (type) => {
    const iconMap = {
      questionInfo: <InfoCircleOutlined />,
      questionTitle: <FontSizeOutlined />,
      questionParagraph: <AlignLeftOutlined />,
      questionInput: <EditOutlined />,
      questionTextarea: <EditOutlined />,
      questionRadio: <CheckSquareOutlined />,
      questionCheckbox: <CheckSquareOutlined />,
    };
    return iconMap[type] || <FileTextOutlined />;
  };

  const handleDragStart = (e, type) => {
    e.dataTransfer.setData('componentType', type);
  };

  const handleClick = (type) => {
    onAddComponent(type);
  };

  return (
    <div style={{ padding: '16px' }}>
      {COMPONENT_GROUPS.map(group => (
        <div key={group.groupId} style={{ marginBottom: '24px' }}>
          <Title level={5} style={{ marginBottom: '12px' }}>
            {group.groupName}
          </Title>
          
          <Space direction="vertical" style={{ width: '100%' }} size="small">
            {group.components.map(type => {
              const config = COMPONENT_CONFIGS[type];
              return (
                <Card
                  key={type}
                  size="small"
                  hoverable
                  draggable
                  onDragStart={(e) => handleDragStart(e, type)}
                  onClick={() => handleClick(type)}
                  style={{ 
                    cursor: 'pointer',
                    border: '1px solid #d9d9d9'
                  }}
                  bodyStyle={{ padding: '8px 12px' }}
                >
                  <Space>
                    {getComponentIcon(type)}
                    <Text style={{ fontSize: '13px' }}>
                      {config.title}
                    </Text>
                  </Space>
                </Card>
              );
            })}
          </Space>
        </div>
      ))}
      
      <div style={{ 
        padding: '16px', 
        background: '#f9f9f9', 
        borderRadius: '6px',
        marginTop: '16px'
      }}>
        <Text type="secondary" style={{ fontSize: '12px' }}>
          💡 提示：点击或拖拽组件到画布中添加
        </Text>
      </div>
    </div>
  );
};

export default ComponentLib;
