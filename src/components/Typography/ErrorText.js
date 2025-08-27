function ErrorText({ styleClass = "", children, onClose }) {
  if (!children) return null;

  return (
    <div className={`mb-6 relative ${styleClass}`}>
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm text-center relative">
        {children}
        {onClose && (
          <button
            type="button"
            className="absolute right-2 top-1 text-red-700 font-bold"
            onClick={onClose}
            aria-label="Tutup"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

export default ErrorText;
