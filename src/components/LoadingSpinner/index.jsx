import React from 'react';
import { Spin } from 'antd';
import styles from './styles.module.css';

const LoadingSpinner = ({ 
  size = 'large', 
  tip = '加载中...', 
  spinning = true,
  children,
  className = ''
}) => {
  if (children) {
    return (
      <Spin 
        size={size} 
        tip={tip} 
        spinning={spinning}
        className={`${styles.spinner} ${className}`}
      >
        {children}
      </Spin>
    );
  }

  return (
    <div className={`${styles.centerSpinner} ${className}`}>
      <Spin size={size} tip={tip} />
    </div>
  );
};

export default LoadingSpinner;


