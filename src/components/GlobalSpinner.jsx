import React from 'react';
import { Spin } from 'antd';
import { useSelector } from 'react-redux';

const GlobalSpinner = () => {
  const { loading: authLoading } = useSelector(state => state.auth);
  const { status: docsStatus } = useSelector(state => state.docs);
  const { loading: formBuilderLoading } = useSelector(state => state.formBuilder);

  // Show spinner if any async operation is in progress
  const isLoading = authLoading || docsStatus === 'loading' || formBuilderLoading;

  if (!isLoading) return null;

  return (
    <Spin
      size="large"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(255, 255, 255, 0.8)',
        zIndex: 9999,
      }}
      tip="加载中..."
    />
  );
};

export default GlobalSpinner;
