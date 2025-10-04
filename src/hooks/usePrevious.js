import { useRef, useEffect } from 'react';

/**
 * 获取前一个值的自定义hook
 */
const usePrevious = (value) => {
  const ref = useRef();
  
  useEffect(() => {
    ref.current = value;
  });
  
  return ref.current;
};

export default usePrevious;
