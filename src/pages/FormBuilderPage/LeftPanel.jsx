import React from 'react';
import { Tabs, Card, Space, Typography } from 'antd';
import { 
  AppstoreOutlined, 
  BarsOutlined,
  FileTextOutlined,
  EditOutlined,
  CheckSquareOutlined
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { addComponent } from '../../store/formBuilderSlice';
import { COMPONENT_GROUPS, COMPONENT_CONFIGS } from '../../store/formBuilderSlice';
import ComponentLib from './ComponentLib';
import Layers from './Layers';

const { Title, Text } = Typography;

const LeftPanel = () => {
  const dispatch = useDispatch();
  const { componentList } = useSelector(state => state.formBuilder);

  const handleAddComponent = (type) => {
    dispatch(addComponent({ type }));
  };

  const tabsItems = [
    {
      key: 'componentLib',
      label: (
        <span>
          <AppstoreOutlined />
          组件库
        </span>
      ),
      children: <ComponentLib onAddComponent={handleAddComponent} />,
    },
    {
      key: 'layers',
      label: (
        <span>
          <BarsOutlined />
          图层 ({componentList.length})
        </span>
      ),
      children: <Layers />,
    },
  ];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '16px', borderBottom: '1px solid #f0f0f0' }}>
        <Title level={5} style={{ margin: 0 }}>
          组件库
        </Title>
        <Text type="secondary" style={{ fontSize: '12px' }}>
          拖拽组件到画布中
        </Text>
      </div>
      
      <div style={{ flex: 1, overflow: 'auto' }}>
        <Tabs 
          defaultActiveKey="componentLib" 
          items={tabsItems}
          style={{ height: '100%' }}
          tabBarStyle={{ margin: 0, padding: '0 16px' }}
        />
      </div>
    </div>
  );
};

export default LeftPanel;
