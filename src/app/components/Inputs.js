"use client";


const ExportInput = ({ type, value, onChange, ...rest }) => {
  const handleChange = (e) => {
    const newValue = e.target.value;
    onChange({ type, value: newValue }); // Send back both type and new value
  };

  return (
    <input
      type={type}
      value={value}
      onChange={handleChange}
      {...rest} // optional props like placeholder, className
    />
  );
};

const ExportSelect = ({ value, onChange, options = [], ...rest }) => {
  const handleChange = (e) => {
    const newValue = e.target.value;
    onChange({ type, value: newValue }); // Return both type and selected value
  };

  return (
    <select value={value} onChange={handleChange} {...rest}>
      {options.map((option, index) => (
        <option key={index} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export {ExportInput, ExportSelect};
