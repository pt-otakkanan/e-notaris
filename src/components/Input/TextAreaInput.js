import { memo } from "react";

function TextAreaInput({
  labelTitle,
  labelStyle = "",
  containerStyle = "",
  value = "", // <— terima value dari parent
  placeholder = "",
  updateFormValue,
  updateType,
}) {
  const onChange = (e) => {
    updateFormValue({ updateType, value: e.target.value });
  };

  return (
    <div className={`form-control w-full ${containerStyle}`}>
      <label className="label">
        <span className={"label-text text-base-content " + labelStyle}>
          {labelTitle}
        </span>
      </label>
      <textarea
        className="textarea textarea-bordered w-full"
        placeholder={placeholder}
        value={value ?? ""} // <— hindari uncontrolled saat undefined/null
        onChange={onChange}
      />
    </div>
  );
}

export default memo(TextAreaInput);
