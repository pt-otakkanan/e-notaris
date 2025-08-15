import React, { useMemo, useRef, useState } from "react";

function FileInput({
  labelTitle,
  labelStyle = "",
  containerStyle = "",
  accept = ".pdf,.jpg,.jpeg,.png",
  required = false,
  updateFormValue, // (payload) => void
  updateType, // string key
  defaultFile = null, // optional: File | null
  defaultPreviewUrl = "", // optional: string (jika ada url awal)
}) {
  const inputRef = useRef(null);

  const [file, setFile] = useState(defaultFile);
  const [previewUrl, setPreviewUrl] = useState(defaultPreviewUrl);

  const isImage = useMemo(() => file?.type?.startsWith("image/"), [file]);

  const sizeInMB = useMemo(
    () => (file ? (file.size / 1024 / 1024).toFixed(2) : "0.00"),
    [file]
  );

  const emitChange = (f, url) => {
    // kirim ke parent dalam format konsisten
    if (typeof updateFormValue === "function") {
      updateFormValue({
        updateType,
        value: { file: f || null, previewUrl: url || "" },
      });
    }
  };

  const handlePick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;

    setFile(f);

    // bikin preview untuk image & pdf (pdf di-preview via window.open)
    if (f.type.startsWith("image/")) {
      const url = URL.createObjectURL(f);
      setPreviewUrl(url);
      emitChange(f, url);
    } else {
      setPreviewUrl(""); // non-image tidak auto-preview
      emitChange(f, "");
    }
  };

  const handleRemove = () => {
    setFile(null);
    setPreviewUrl("");
    if (inputRef.current) inputRef.current.value = "";
    emitChange(null, "");
  };

  const handlePreviewPDF = () => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    window.open(url, "_blank");
  };

  return (
    <div className={`form-control w-full ${containerStyle}`}>
      {/* Label */}
      <label className="label">
        <span className={"label-text text-base-content " + labelStyle}>
          {labelTitle}
        </span>
      </label>

      {/* Area kosong (belum ada file) */}
      {!file ? (
        <div className="border-2 border-dashed border-base-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleChange}
            className="hidden"
          />
          <button type="button" className="cursor-pointer" onClick={handlePick}>
            <div className="flex flex-col items-center">
              <svg
                className="w-8 h-8 mb-2 text-base-content/50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className="text-sm text-base-content/70">
                Klik untuk upload file
              </p>
              <p className="text-xs text-base-content/50 mt-1">
                PDF, JPG, JPEG, PNG (Max 5MB)
              </p>
            </div>
          </button>
        </div>
      ) : (
        // Area saat sudah ada file
        <div className="border border-base-300 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                {isImage ? (
                  <svg
                    className="w-8 h-8 text-success"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-8 h-8 text-error"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-base-content">
                  {file.name}
                </p>
                <p className="text-xs text-base-content/70">{sizeInMB} MB</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRemove}
              className="btn btn-ghost btn-sm btn-circle"
              aria-label="Remove file"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Preview image */}
          {previewUrl && isImage && (
            <div className="mt-3">
              <img
                src={previewUrl}
                alt="Preview"
                className="max-w-full h-32 object-cover rounded border"
              />
            </div>
          )}

          <div className="flex gap-2 mt-3">
            <button
              type="button"
              onClick={handlePick}
              className="btn btn-outline btn-sm"
            >
              Ganti File
            </button>

            {file.type === "application/pdf" && (
              <button
                type="button"
                onClick={handlePreviewPDF}
                className="btn btn-outline btn-sm"
              >
                Preview PDF
              </button>
            )}
          </div>

          {/* hidden input */}
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleChange}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
}

export default FileInput;
