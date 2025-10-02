const SelectInput = ({
  label,
  value,
  options,
  onChange,
  onBlur,
  error,
  touched,
}) => {
  return (
    <div className={"form-field"}>
      <label>{label}</label>
      <select
        value={value}
        onChange={(error) => error.target.value}
        onBlur={onBlur}
      >
        {options.map((option) => {
          return <option key={option.value}>{option.label}</option>;
        })}
      </select>
      {touched && error && <div className="error-message">{error}</div>}
    </div>
  );
};
export default SelectInput;
