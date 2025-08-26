import { useId } from "react";

function InputText({
  labelTitle,
  labelStyle = "",
  type = "text",
  containerStyle = "",
  value = "", // <-- controlled
  placeholder = "",
  updateFormValue,
  updateType,
  disabled = false,
  isLoading = false,
  className = "input input-bordered w-full",
}) {
  const id = useId();

  return (
    <div className={`form-control w-full ${containerStyle}`}>
      {labelTitle && (
        <label className="label" htmlFor={id}>
          <span className={`label-text text-base-content ${labelStyle}`}>
            {labelTitle}
          </span>
        </label>
      )}

      <input
        id={id}
        type={type}
        value={value ?? ""} // <-- pakai prop value, bukan state internal
        placeholder={placeholder}
        onChange={(e) =>
          updateFormValue?.({ updateType, value: e.target.value })
        }
        className={className}
        disabled={disabled || isLoading}
      />
    </div>
  );
}

export default InputText;
