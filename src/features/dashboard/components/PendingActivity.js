function PendingActivity({}) {
  return (
    <div className="stats bg-base-100 shadow">
      <div className="stat">
        <div className="stat-title">Aktivitas Terbaru</div>
        <div className="stat-actions">
          <button className="btn btn-lg bg-yellow-300">Dalam Proses</button>
        </div>
      </div>

      <div className="stat">
        <div className="stat-actions">
          <button className="mt-7 btn btn-lg inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 inset-ring inset-ring-red-600/10">
            Ditolak
          </button>
        </div>
      </div>
    </div>
  );
}

export default PendingActivity;
