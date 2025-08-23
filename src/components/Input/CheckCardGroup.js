import React, { useState, useEffect } from "react";

/**
 * CheckCardGroup (single-select)
 * "Checkbox look, radio behavior" — pilih salah satu opsi.
 *
 * Props:
 * - labelTitle?: string
 * - labelDescription?: string
 * - containerStyle?: string
 * - options: Array<{ name: string, value: string, description?: string, icon?: React.ReactNode }>
 * - defaultValue?: string
 * - updateType: string
 * - updateFormValue: ({ updateType, value }) => void
 * - allowUnselect?: boolean
 */
function CheckCardGroup({
  labelTitle,
  labelDescription,
  containerStyle = "",
  options = [],
  defaultValue = "",
  updateType,
  updateFormValue,
  allowUnselect = false,
}) {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const selectValue = (newValue) => {
    const next = allowUnselect && value === newValue ? "" : newValue;
    setValue(next);
    updateFormValue({ updateType, value: next });
  };

  return (
    <div className={`w-full ${containerStyle}`}>
      {(labelTitle || labelDescription) && (
        <div className="mb-2">
          {labelTitle && (
            <label className="label p-0">
              <span className="label-text font-medium">{labelTitle}</span>
            </label>
          )}
          {labelDescription && <p className="text-sm ">{labelDescription}</p>}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map((opt, idx) => {
          const val = opt.value != null ? opt.value : opt.name;
          const active = value === val;
          return (
            <button
              type="button"
              key={idx}
              onClick={() => selectValue(val)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  selectValue(val);
                }
              }}
              className={[
                "text-left rounded-xl border p-4 cursor-pointer transition",
                "focus:outline-none focus:ring-2",
                active
                  ? "border-white bg-[#96696d] ring-1 ring-[#efe0e1] text-white"
                  : "text-black border-white hover:border-base-200",
              ].join(" ")}
              aria-pressed={active}
            >
              <div className="flex items-start gap-3">
                {opt.icon && <div className="mt-1">{opt.icon}</div>}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{opt.name}</span>
                    <span
                      className={[
                        "inline-block w-2.5 h-2.5 rounded-full",
                        active ? "bg-neutral" : "bg-base-300",
                      ].join(" ")}
                      aria-hidden
                    />
                  </div>
                  {opt.description && (
                    <div className="text-sm opacity-80 mt-1">
                      {opt.description}
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* hidden input (opsional) */}
      <input type="hidden" name={updateType} value={value} />
    </div>
  );
}

export default CheckCardGroup;
