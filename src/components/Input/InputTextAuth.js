import { color } from "chart.js/helpers";
import { useState } from "react";

function InputTextAuth({
  labelTitle,
  labelStyle,
  type,
  containerStyle,
  defaultValue,
  placeholder,
  updateFormValue,
  updateType,
  disabled,
}) {
  const [value, setValue] = useState(defaultValue);

  const updateInputValue = (val) => {
    setValue(val);
    updateFormValue({ updateType, value: val });
  };

  return (
    <div className={`form-control w-full ${containerStyle}`}>
      <label className="label text-black text-bold">
        <span className={"text-base-content" + labelStyle}>{labelTitle}</span>
      </label>
      <input
        type={type || "text"}
        value={value}
        placeholder={placeholder || ""}
        onChange={(e) => updateInputValue(e.target.value)}
        className="input input-bordered w-full bg-[#96696d] text-base-content text-white"
        disabled={disabled}
      />
    </div>
  );
}

export default InputTextAuth;
