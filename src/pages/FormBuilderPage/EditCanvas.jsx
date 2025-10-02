import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeSelectedId } from '../../store/formBuilderSlice';
import QuestionComponent from './QuestionComponent';

const EditCanvas = () => {
  const dispatch = useDispatch();
  const { componentList, selectedId } = useSelector(state => state.formBuilder);

  const handleCanvasClick = () => {
    dispatch(changeSelectedId(''));
  };

  const handleComponentClick = (e, fe_id) => {
    e.stopPropagation();
    dispatch(changeSelectedId(fe_id));
  };

  return (
    <div 
      style={{ 
        minHeight: '400px',
        padding: '24px',
        position: 'relative'
      }}
      onClick={handleCanvasClick}
    >
      {componentList.length === 0 ? (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '300px',
          color: '#999',
          border: '2px dashed #d9d9d9',
          borderRadius: '8px',
          background: '#fafafa'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
          <div style={{ fontSize: '16px', marginBottom: '8px' }}>拖拽组件到这里</div>
          <div style={{ fontSize: '12px' }}>从左侧组件库选择组件开始构建表单</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {componentList.map(component => (
            <div
              key={component.fe_id}
              onClick={(e) => handleComponentClick(e, component.fe_id)}
              style={{
                position: 'relative',
                border: selectedId === component.fe_id 
                  ? '2px solid #1890ff' 
                  : '2px solid transparent',
                borderRadius: '6px',
                padding: '8px',
                cursor: 'pointer',
                background: selectedId === component.fe_id ? '#f0f8ff' : 'transparent',
                transition: 'all 0.2s ease'
              }}
            >
              <QuestionComponent 
                component={component}
                isSelected={selectedId === component.fe_id}
              />
              
              {selectedId === component.fe_id && (
                <div style={{
                  position: 'absolute',
                  top: '-8px',
                  left: '-8px',
                  background: '#1890ff',
                  color: '#fff',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: 'bold'
                }}>
                  选中
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EditCanvas;
