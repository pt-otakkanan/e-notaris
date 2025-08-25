// src/components/Input/SelectBox.jsx
import React, { useEffect, useMemo, useState } from "react";
import InformationCircleIcon from "@heroicons/react/24/outline/InformationCircleIcon";

function SelectBoxSearch({
  labelTitle,
  labelDescription,
  value,
  defaultValue,
  containerStyle = "",
  placeholder = "Pilih...",
  labelStyle = "",
  options = [], // [{ value, label }]
  updateType,
  updateFormValue,
  disabled = false,
  searchable = false, // ⬅️ aktifkan pencarian
  onSearch, // ⬅️ optional: remote search handler(term)
  searchDebounce = 300, // ⬅️ debounce ms
}) {
  const [inner, setInner] = useState(value ?? defaultValue ?? "");
  const [term, setTerm] = useState("");

  // sinkron value dari parent
  useEffect(() => {
    setInner(value ?? defaultValue ?? "");
  }, [value, defaultValue]);

  // debounce untuk onSearch (remote)
  useEffect(() => {
    if (!searchable || !onSearch) return;
    const id = setTimeout(() => onSearch(term), searchDebounce);
    return () => clearTimeout(id);
  }, [term, onSearch, searchable, searchDebounce]);

  // daftar option yang ditampilkan
  const filtered = useMemo(() => {
    if (!searchable || onSearch) return options; // remote mode: tampilkan apa adanya
    const t = term.trim().toLowerCase();
    if (!t) return options;
    return options.filter((o) =>
      String(o.label ?? o.name ?? "")
        .toLowerCase()
        .includes(t)
    );
  }, [options, term, searchable, onSearch]);

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

      {searchable && (
        <input
          className="input input-bordered w-full mb-2"
          placeholder="Cari..."
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          disabled={disabled}
        />
      )}

      <select
        className="select select-bordered w-full"
        value={inner}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {filtered.map((o, i) => (
          <option key={o.value ?? i} value={o.value ?? o.name}>
            {o.label ?? o.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SelectBoxSearch;
