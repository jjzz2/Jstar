//异步请求useRequest
//以url作为基点来进行撰写
import { useEffect, useState } from "react";

const useLocaleStorage = (key, initialValue) => {
  const initValue = window.localStorage.getItem(key);
  const [value, setValues] = useState(initValue ? initValue : initialValue);
  window.localStorage.setItem(key, value);
  const setValue = (e) => {
    setValues(e.target.value);
  };
  window.localStorage.setItem(key, value);
  return [value, setValue];
};
