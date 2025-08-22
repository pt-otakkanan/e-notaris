import HeartIcon from "@heroicons/react/24/outline/HeartIcon";
import BoltIcon from "@heroicons/react/24/outline/BoltIcon";

function PageStats({}) {
  return (
    <div className="stats bg-base-100 shadow">
      <div className="stat">
        {/* <div className="stat-figure invisible md:visible">
          <HeartIcon className="w-8 h-8" />
        </div> */}
        <div className="stat-title">Verifikasi Pengguna</div>
        <div className="stat-value">25.6K</div>
        <div className="stat-actions flex justify-end">
          <button className="btn btn-xs inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 inset-ring inset-ring-green-600/20">
            Disetujui
          </button>
        </div>
      </div>
    </div>
  );
}

export default PageStats;
