import { SetStateAction, useState } from "react";

// 高级组件：封装表单验证逻辑
function withValidation(Component: any) {
  return function WrappedComponent(props: any) {
    const [error, setError] = useState("");

    const validate = (value: any) => {
      if (!value) {
        setError("输入不能为空");
      } else if (value.length < 3) {
        setError("用户名长度不能少于3个字符");
      } else {
        setError("");
      }
    };

    return (
      <div>
        <Component {...props} validate={validate} error={error} />
      </div>
    );
  };
}

// 普通表单组件：用户名输入框
//在function处进行解构
// @ts-ignore
function UsernameInput({ validate, error }) {
  const [username, setUsername] = useState("");

  const handleChange = (e: { target: { value: SetStateAction<string> } }) => {
    setUsername(e.target.value);
    validate(e.target.value); // 触发验证
  };

  return (
    <div>
      <input
        type="text"
        value={username}
        onChange={handleChange}
        placeholder="请输入用户名"
      />
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
}

// 使用 HOC 封装组件，来完成其的校验规则，正常可以使用form的onSubmit来完成
const ValidatedUsernameInput = withValidation(UsernameInput);

function App() {
  return (
    <div>
      <h1>表单验证示例</h1>
      <ValidatedUsernameInput />
    </div>
  );
}

export default App;
