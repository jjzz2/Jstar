import React from 'react';
import { Spin } from 'antd';
import { useSelector } from 'react-redux';
import styles from './styles.module.css';

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
      className={styles.spinner}
      tip="加载中..."
    />
  );
};

export default GlobalSpinner;

