import { useState, useEffect } from "react";

export default function InputSelect({
  labelTitle,
  labelStyle,
  containerStyle,
  options = [],
  defaultValue = "",
  placeholder = "Pilih salah satu…",
  updateFormValue = () => {},
  updateType,
  disabled = false,
  required = false,
}) {
  const [value, setValue] = useState(defaultValue ?? "");

  useEffect(() => {
    // sinkron kalau defaultValue berubah dari parent
    setValue(defaultValue ?? "");
  }, [defaultValue]);

  const onChange = (val) => {
    setValue(val);
    updateFormValue({ updateType, value: val });
  };

  return (
    <div className={`form-control w-full ${containerStyle || ""}`}>
      <label className="label">
        <span className={"label-text text-base-content " + (labelStyle || "")}>
          {labelTitle}
          {required ? <span className="text-red-500 ml-1">*</span> : null}
        </span>
      </label>

      <select
        className="select select-bordered w-full"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
