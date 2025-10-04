import { useState, useCallback } from 'react';

/**
 * 开关状态管理自定义hook
 */
const useToggle = (initialValue = false) => {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue(prev => !prev);
  }, []);

  const setTrue = useCallback(() => {
    setValue(true);
  }, []);

  const setFalse = useCallback(() => {
    setValue(false);
  }, []);

  const setToggle = useCallback((newValue) => {
    setValue(typeof newValue === 'function' ? newValue(value) : newValue);
  }, [value]);

  return [value, { toggle, setTrue, setFalse, setToggle }];
};

export default useToggle;
