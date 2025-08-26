import { themeChange } from "theme-change";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import BellIcon from "@heroicons/react/24/outline/BellIcon";
import Bars3Icon from "@heroicons/react/24/outline/Bars3Icon";
import MoonIcon from "@heroicons/react/24/outline/MoonIcon";
import SunIcon from "@heroicons/react/24/outline/SunIcon";
import { openRightDrawer } from "../features/common/rightDrawerSlice";
import { RIGHT_DRAWER_TYPES } from "../utils/globalConstantUtil";
import AuthService from "../services/auth.service";
import { Link, useNavigate } from "react-router-dom";

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { noOfNotifications, pageTitle } = useSelector((state) => state.header);
  const [currentTheme, setCurrentTheme] = useState(
    localStorage.getItem("theme")
  );

  useEffect(() => {
    themeChange(false);
    if (currentTheme === null) {
      if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      ) {
        setCurrentTheme("dark");
      } else {
        setCurrentTheme("light");
      }
    }
    // 👆 false parameter is required for react project
  }, []);

  // Opening right sidebar for notification
  const openNotification = () => {
    dispatch(
      openRightDrawer({
        header: "Notifications",
        bodyType: RIGHT_DRAWER_TYPES.NOTIFICATION,
      })
    );
  };

  async function logoutUser(e) {
    e?.preventDefault();
    const lastEmail = localStorage.getItem("user_email") || "";
    await AuthService.logout(); // revoke token di server + bersihkan storage
    navigate("/login", {
      replace: true,
      state: {
        email: lastEmail,
        flash: { type: "success", message: "Anda berhasil logout." },
      },
    });
  }

  return (
    // navbar fixed  flex-none justify-between bg-base-300  z-10 shadow-md

    <>
      <div className="navbar sticky top-0 bg-base-100 dark:bg-[#0b0255] z-10 shadow-md ">
        {/* Menu toogle for mobile view or small screen */}
        <div className="flex-1">
          <label
            htmlFor="left-sidebar-drawer"
            className="btn btn-primary drawer-button lg:hidden"
          >
            <Bars3Icon className="h-5 inline-block w-5" />
          </label>
          <h1 className="text-2xl font-semibold ml-2 dark:text-white">
            Dashboard
          </h1>
        </div>

        <div className="flex-none ">
          {/* Multiple theme selection, uncomment this if you want to enable multiple themes selection, 
                also includes corporate and retro themes in tailwind.config file */}

          {/* <select className="select select-sm mr-4" data-choose-theme>
                    <option disabled selected>Theme</option>
                    <option value="light">Default</option>
                    <option value="dark">Dark</option>
                    <option value="corporate">Corporate</option>
                    <option value="retro">Retro</option>
                </select> */}

          {/* Light and dark theme selection toogle **/}
          <label className="swap btn-circle btn-ghost ">
            <input type="checkbox" />
            <SunIcon
              data-set-theme="light"
              data-act-class="ACTIVECLASS"
              className={
                "fill-current w-6 h-6 " +
                (currentTheme === "dark" ? "swap-on" : "swap-off")
              }
            />
            <MoonIcon
              data-set-theme="dark"
              data-act-class="ACTIVECLASS"
              className={
                "fill-current w-6 h-6 text-white " +
                (currentTheme === "light" ? "swap-on" : "swap-off")
              }
            />
          </label>

          {/* Notification icon */}
          <button
            className="btn btn-ghost ml-4 btn-circle dark:text-white"
            onClick={() => openNotification()}
          >
            <div className="indicator">
              <BellIcon className="h-6 w-6" />
              {noOfNotifications > 0 ? (
                <span className="indicator-item badge bg-[#0256c4] text-white dark:bg-[#6da0e2] dark:text-[#0b0255] badge-sm">
                  {noOfNotifications}
                </span>
              ) : null}
            </div>
          </button>

          {/* Profile icon, opening menu on click */}
          <div className="dropdown dropdown-end ml-4">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-9 rounded-full">
                {/* Gambar default untuk light mode */}
                <img
                  src="/profile-black.png"
                  alt="profile"
                  className="block dark:hidden"
                />
                {/* Gambar khusus untuk dark mode */}
                <img
                  src="/profile-white.png"
                  alt="profile"
                  className="hidden dark:block"
                />
              </div>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 dark:bg-[#0b0255] rounded-box w-52"
            >
              <li className="justify-between">
                <Link to={"/app/settings-profile"}>Profile Settings</Link>
              </li>
              <li className="">
                <Link to={"/app/settings-billing"}>Bill History</Link>
              </li>
              <div className="divider mt-0 mb-0"></div>
              <li>
                {/* gunakan button agar tidak ikut behavior <a> */}
                <button type="button" onClick={logoutUser}>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
