import React, { useEffect, useState } from "react";
import InformationCircleIcon from "@heroicons/react/24/outline/InformationCircleIcon";

function SelectBox({
  labelTitle,
  labelDescription,
  value, // <- controlled value (opsional)
  defaultValue, // <- initial value (fallback)
  containerStyle = "",
  placeholder = "Pilih...",
  labelStyle = "",
  options = [],
  updateType,
  updateFormValue,
  disabled = false,
}) {
  const [inner, setInner] = useState(value ?? defaultValue ?? "");

  // Sinkron saat value/defaultValue berubah (mis. setelah fetch profil)
  useEffect(() => {
    setInner(value ?? defaultValue ?? "");
  }, [value, defaultValue]);

  const onChange = (newVal) => {
    setInner(newVal);
    updateFormValue?.({ updateType, value: newVal });
  };

  return (
    <div className={`form-control w-full ${containerStyle}`}>
      <label className={`label ${labelStyle}`}>
        <span className="label-text flex items-center gap-2">
          {labelTitle}
          {labelDescription ? (
            <span className="tooltip tooltip-right" data-tip={labelDescription}>
              <InformationCircleIcon className="w-4 h-4" />
            </span>
          ) : null}
        </span>
      </label>

      <select
        className="select select-bordered w-full dark:bg-[#01043c]"
        value={inner}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((o, i) => (
          <option key={i} value={o.value ?? o.name}>
            {o.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SelectBox;
