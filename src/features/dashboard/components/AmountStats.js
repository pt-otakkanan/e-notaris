function AmountStats({}) {
  return (
    <div className="stats bg-base-100 dark:bg-[#0b0255] shadow">
      <div className="stat relative">
        <div className="absolute top-5 right-5">
          <button className="btn btn-xs inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 inset-ring inset-ring-green-600/20">
            Disetujui
          </button>
        </div>
        <div className="stat-title text-[#0256c4] dark:text-gray-300">
          Verifikasi Pengguna
        </div>
        <div className="stat-value text-[#0256c4] dark:text-slate-300">
          25.6K
        </div>
        <div className="stat-actions flex justify-end">
          <button className="btn btn-xs inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 inset-ring inset-ring-red-600/10">
            Lihat Detail
          </button>
        </div>
      </div>

      <div className="stat relative">
        <div className="absolute top-5 right-5">
          <button className="btn btn-xs inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 inset-ring inset-ring-yellow-600/20">
            Menunggu
          </button>
        </div>
        <div className="stat-value text-[#0256c4] dark:text-slate-300 mt-6">
          25,600
        </div>
        <div className="stat-actions flex justify-end">
          <button className="btn btn-xs inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 inset-ring inset-ring-red-600/10">
            Lihat Detail
          </button>
        </div>
      </div>

      <div className="stat relative">
        <div className="stat-value text-[#0256c4] dark:text-slate-300 mt-6">
          5,600
        </div>
        <div className="absolute top-5 right-5">
          <button className="btn btn-xs inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 inset-ring inset-ring-red-600/10">
            Ditolak
          </button>
        </div>
        <div className="stat-actions flex justify-end">
          <button className="btn btn-xs inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 inset-ring inset-ring-red-600/10">
            Lihat Detail
          </button>
        </div>
      </div>
    </div>
  );
}

export default AmountStats;
