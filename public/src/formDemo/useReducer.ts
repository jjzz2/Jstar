const initialState = { values: {}, errors: {}, touched: {} };

function formReducer(state, action) {
  switch (action.type) {
    // 更新字段值并触发校验
    case "UPDATE_FIELD": {
      const { field, value } = action.payload;
      const newValues = { ...state.values, [field]: value };
      return {
        ...state,
        values: newValues,
        errors: { ...state.errors, [field]: validateField(field, newValues) },
      };
    }

    // 提交时验证全部字段
    case "VALIDATE_ALL": {
      const errors = Object.keys(state.values).reduce(
        (acc, field) => ({
          ...acc,
          [field]: validateField(field, state.values),
        }),
        {}
      );
      // 标记所有字段为 touched 以显示错误信息
      const touched = Object.keys(state.touched).reduce(
        (acc, field) => ({
          ...acc,
          [field]: true,
        }),
        {}
      );
      return { ...state, errors, touched };
    }

    case "SET_TOUCHED":
      return {
        ...state,
        touched: { ...state.touched, [action.payload.field]: true },
      };
    default:
      return state;
  }
}

// 验证单个字段规则
function validateField(field, values, formConfig) {
  const fieldConfig = formConfig.find((f) => f.id === field);
  for (const rule of fieldConfig.rules || []) {
    const error = rule.validator(values[field], values);
    if (error) return error;
  }
  return "";
}

export default formReducer;
