function DashboardStats({ title, icon, value, description, colorIndex }) {
  const COLORS = ["primary", "primary"];

  const getDescStyle = () => {
    if (description.includes("↗︎"))
      return "font-bold text-green-700 dark:text-green-300";
    else if (description.includes("↙"))
      return "font-bold text-rose-500 dark:text-red-400";
    else return "";
  };

  return (
    <div className="stats shadow bg-gradient">
      <div className="stat">
        <div className={`stat-figure dark:text-slate-300 text-white`}>
          {icon}
        </div>
        <div className="stat-title text-white dark:text-slate-300">{title}</div>
        <div className={`stat-value text-white dark:text-slate-300`}>
          {value}
        </div>
        <div className={"stat-desc text-white " + getDescStyle()}>
          {description}
        </div>
      </div>
    </div>
  );
}

export default DashboardStats;
