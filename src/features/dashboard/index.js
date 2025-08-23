import DashboardStats from "./components/DashboardStats";
import AmountStats from "./components/AmountStats";
import PageStats from "./components/PageStats";

import UserGroupIcon from "@heroicons/react/24/outline/UserGroupIcon";
import UsersIcon from "@heroicons/react/24/outline/UsersIcon";
import CircleStackIcon from "@heroicons/react/24/outline/CircleStackIcon";
import CreditCardIcon from "@heroicons/react/24/outline/CreditCardIcon";
import DashboardTopBar from "./components/DashboardTopBar";
import { useDispatch } from "react-redux";
import { showNotification } from "../common/headerSlice";
import { useState } from "react";
import PendingActivity from "./components/PendingActivity";
import RecentActivity from "./components/RecentActivity";

const statsData = [
  {
    title: "Total Notaris",
    value: "34.7k",
    icon: <UserGroupIcon className="w-8 h-8 text-[#96696d]" />,
    description: "↗︎ 2300 (22%)",
  },
  {
    title: "Total Penghadap",
    value: "34,545",
    icon: <UserGroupIcon className="w-8 h-8 text-[#96696d]" />,
    description: "Current month",
  },
  {
    title: "Total Akta",
    value: "450",
    icon: <CircleStackIcon className="w-8 h-8 text-[#96696d]" />,
    description: "50 in hot leads",
  },
  {
    title: "Total Aktivitas Notaris",
    value: "5.6k",
    icon: <UsersIcon className="w-8 h-8 text-[#96696d]" />,
    description: "↗︎ 300 (18%)",
  },
];

function Dashboard() {
  const dispatch = useDispatch();

  const updateDashboardPeriod = (newRange) => {
    // Dashboard range changed, write code to refresh your values
    dispatch(
      showNotification({
        message: `Period updated to ${newRange.startDate} to ${newRange.endDate}`,
        status: 1,
      })
    );
  };

  return (
    <>
      {/** ---------------------- Select Period Content ------------------------- */}
      <DashboardTopBar updateDashboardPeriod={updateDashboardPeriod} />

      {/** ---------------------- Different stats content 1 ------------------------- */}
      <div className="grid lg:grid-cols-4 mt-2 md:grid-cols-2 grid-cols-1 gap-6">
        {statsData.map((d, k) => {
          return <DashboardStats key={k} {...d} colorIndex={k} />;
        })}
      </div>

      {/** ---------------------- Different stats content ------------------------- */}

      <div className="grid mt-5 grid-cols-1">
        <AmountStats />
      </div>

      {/** ---------------------- User source channels table  ------------------------- */}

      <div className="grid mt-0 grid-cols-1 gap-6">
        <RecentActivity />
      </div>
    </>
  );
}

export default Dashboard;
