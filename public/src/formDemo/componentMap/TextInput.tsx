const TextInput = ({ label, value, onChange, onBlur, error, touched }) => {
  return (
    <div className={"form-field"}>
      <label>{label}</label>
      <input
        type={"text"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
      />
      {touched && error && <div className={"error-message"}>{error}</div>}
    </div>
  );
};
export default TextInput;
