import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { clear } from "@testing-library/user-event/dist/clear";
import { clearTimeout } from "node:timers";

const useRequest = () => {
  const [isLoading, setisLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [data, setData] = useState(null);
  const [refresh, setRefresh] = useState(0);
  const Request = async () => {
    setisLoading(true);
    try {
      let result = await axios.post("xxx");
      setisLoading(false);
      setIsSuccess(true);
      setData(result);
    } catch (err) {
      setisLoading(false);
      setIsSuccess(false);
      setData(null);
    }
  };
  const refreshRequest = () => {
    Request();
    setRefresh(refresh + 1);
  };
  return {
    isLoading,
    isSuccess,
    data,
    Request,
    refreshRequest,
    refresh,
  };
};
//1.useDebounce
const useDebounce = (value, delay) => {
  const [debounceValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    let timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(timer);
  }, [debounceValue]);
  return {
    debounceValue,
  };
};
//2.usePrevios
//也可以先写一个ref然后使用ref获得value值，最后来返回。
const usePrevios = (value) => {
  const ref = useRef(value);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
};

const useForm = (initialValues) => {
  const [formData, setFormData] = useState(initialValues);

  // 更新字段
  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value, // 动态更新字段值
    });
  };

  // 重置表单
  const resetForm = () => {
    setFormData(initialValues);
  };

  // 批量更新表单
  const setForm = (newValues) => {
    setFormData({
      ...formData,
      ...newValues, // 合并新的值
    });
  };

  return [formData, handleChange, resetForm, setForm];
};
