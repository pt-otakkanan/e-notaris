import React, { useEffect, useMemo, useRef, useState } from "react";

function FileInput({
  labelTitle,
  labelStyle = "",
  containerStyle = "",
  accept = ".jpg,.jpeg,.png",
  required = false,
  maxSizeMB = 2, // ⬅️ batas ukuran (default 2MB)
  updateFormValue, // ({ updateType, value: { file, previewUrl } })
  updateType,
  defaultFile = null,
  defaultPreviewUrl = "",
}) {
  const inputRef = useRef(null);

  const [file, setFile] = useState(defaultFile);
  const [previewUrl, setPreviewUrl] = useState(defaultPreviewUrl);
  const [error, setError] = useState(""); // ⬅️ pesan error ukuran/format

  // Sinkronkan URL server saat belum ada file lokal
  useEffect(() => {
    if (!file && defaultPreviewUrl !== previewUrl) {
      setPreviewUrl(defaultPreviewUrl || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultPreviewUrl]);

  const isImage = useMemo(() => {
    if (file) return file.type?.startsWith("image/");
    if (!previewUrl) return false;
    return /\.(png|jpe?g|webp|gif)$/i.test(previewUrl);
  }, [file, previewUrl]);

  const isPdf = useMemo(() => {
    if (file) return file.type === "application/pdf";
    if (!previewUrl) return false;
    return /\.pdf($|\?)/i.test(previewUrl);
  }, [file, previewUrl]);

  const fileName = useMemo(() => {
    if (file?.name) return file.name;
    if (previewUrl) {
      try {
        const clean = previewUrl.split("?")[0];
        return clean.split("/").pop() || "file";
      } catch {
        return "file";
      }
    }
    return "";
  }, [file, previewUrl]);

  const emitChange = (f, url) => {
    updateFormValue?.({
      updateType,
      value: { file: f || null, previewUrl: url || "" },
    });
  };

  const revokeBlob = () => {
    if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
  };

  const handlePick = () => inputRef.current?.click();

  const handleChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;

    // Validasi ukuran (MB)
    const sizeMB = f.size / 1024 / 1024;
    if (sizeMB > maxSizeMB) {
      setError(
        `Ukuran file melebihi batas ${maxSizeMB}MB (ukuran sekarang ${sizeMB.toFixed(
          2
        )}MB).`
      );
      // reset input agar bisa pilih file sama lagi
      e.target.value = "";
      return;
    }
    setError("");

    // Bersihkan preview sebelumnya jika blob
    revokeBlob();

    setFile(f);

    if (f.type.startsWith("image/") || f.type === "application/pdf") {
      const url = URL.createObjectURL(f);
      setPreviewUrl(url);
      emitChange(f, url);
    } else {
      setPreviewUrl("");
      emitChange(f, "");
    }
  };

  const handleRemove = () => {
    revokeBlob();
    setFile(null);
    setPreviewUrl("");
    setError("");
    if (inputRef.current) inputRef.current.value = "";
    emitChange(null, "");
  };

  const handlePreviewPDFLocal = () => {
    if (!file) return;
    const url = previewUrl || URL.createObjectURL(file);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handlePreviewRemote = () => {
    if (!previewUrl) return;
    window.open(previewUrl, "_blank", "noopener,noreferrer");
  };

  const hasLocalFile = !!file;
  const hasRemoteUrl = !file && !!previewUrl;

  return (
    <div className={`form-control w-full ${containerStyle}`}>
      <label className="label">
        <span className={"label-text text-base-content " + labelStyle}>
          {labelTitle}
          {required ? <span className="ml-1 text-red-500">*</span> : null}
        </span>
      </label>

      {/* 1) FILE LOKAL */}
      {hasLocalFile && (
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
                  {fileName}
                </p>
                <p className="text-xs text-base-content/70">
                  {(file.size / 1024 / 1024).toFixed(2)} MB (maks {maxSizeMB}MB)
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRemove}
              className="btn btn-ghost btn-sm btn-circle"
              aria-label="Remove file"
            >
              ✕
            </button>
          </div>

          {isImage && previewUrl && (
            <div className="mt-3">
              <img
                src={previewUrl}
                alt="Preview (local)"
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
            {isPdf && (
              <button
                type="button"
                onClick={handlePreviewPDFLocal}
                className="btn btn-outline btn-sm"
              >
                Preview PDF
              </button>
            )}
          </div>

          {error && <p className="mt-2 text-xs text-red-600">{error}</p>}

          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleChange}
            className="hidden"
          />
        </div>
      )}

      {/* 2) FILE DARI SERVER */}
      {!hasLocalFile && hasRemoteUrl && (
        <div className="border border-base-300 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-medium text-base-content">
                {fileName}
              </p>
              <p className="text-xs text-base-content/70">
                Sumber: Server (maks {maxSizeMB}MB bila ganti)
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handlePick}
                className="btn btn-outline btn-sm"
              >
                Ganti File
              </button>
              <a
                href={previewUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline btn-sm"
              >
                Lihat
              </a>
            </div>
          </div>

          {isImage && (
            <div className="mt-3">
              <img
                src={previewUrl}
                alt="Preview (server)"
                className="max-w-full h-32 object-cover rounded border"
              />
            </div>
          )}

          {error && <p className="mt-2 text-xs text-red-600">{error}</p>}

          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleChange}
            className="hidden"
          />
        </div>
      )}

      {/* 3) BELUM ADA FILE */}
      {!hasLocalFile && !hasRemoteUrl && (
        <div className="border-2 border-dashed border-base-300 rounded-lg p-6 text-center hover:border-[#96696d] dark:hover:border-[#92bbcc] transition-colors">
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
                {accept.toUpperCase()} (Maks {maxSizeMB}MB)
              </p>
            </div>
          </button>
          {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
        </div>
      )}
    </div>
  );
}

export default FileInput;
