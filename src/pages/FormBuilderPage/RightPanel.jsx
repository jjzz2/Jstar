import React from 'react';
import { Tabs, Typography, Empty } from 'antd';
import { SettingOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import PropComponent from './PropComponent';
import PageSettings from './PageSettings';

const { Title } = Typography;

const RightPanel = () => {
  const { selectedId, componentList, pageInfo } = useSelector(state => state.formBuilder);
  
  const selectedComponent = componentList.find(c => c.fe_id === selectedId);

  const tabsItems = [
    {
      key: 'properties',
      label: (
        <span>
          <SettingOutlined />
          属性
        </span>
      ),
      children: selectedComponent ? (
        <PropComponent component={selectedComponent} />
      ) : (
        <Empty 
          description="请选择一个组件"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ),
    },
    {
      key: 'pageSettings',
      label: (
        <span>
          <InfoCircleOutlined />
          页面设置
        </span>
      ),
      children: <PageSettings pageInfo={pageInfo} />,
    },
  ];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '16px', borderBottom: '1px solid #f0f0f0' }}>
        <Title level={5} style={{ margin: 0 }}>
          {selectedComponent ? '组件属性' : '页面设置'}
        </Title>
      </div>
      
      <div style={{ flex: 1, overflow: 'auto' }}>
        <Tabs 
          defaultActiveKey="properties"
          items={tabsItems}
          style={{ height: '100%' }}
          tabBarStyle={{ margin: 0, padding: '0 16px' }}
        />
      </div>
    </div>
  );
};

export default RightPanel;
