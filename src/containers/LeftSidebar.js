import routes from "../routes/sidebar";
import { NavLink, Routes, Link, useLocation } from "react-router-dom";
import SidebarSubmenu from "./SidebarSubmenu";
import XMarkIcon from "@heroicons/react/24/outline/XMarkIcon";
import { useDispatch } from "react-redux";

function LeftSidebar() {
  const location = useLocation();

  const dispatch = useDispatch();

  const close = (e) => {
    document.getElementById("left-sidebar-drawer").click();
  };

  return (
    <div className="drawer-side z-30">
      <label htmlFor="left-sidebar-drawer" className="drawer-overlay"></label>
      <ul className="menu pt-2 w-[270px] bg-[#0256c4] dark:bg-[#0b0255] min-h-full text-base-content">
        <button
          className="btn btn-ghost bg-base-200 btn-circle z-50 top-0 right-0 mt-4 mr-2 absolute lg:hidden"
          onClick={() => close()}
        >
          <XMarkIcon className="h-5 inline-block w-5" />
        </button>

        <li className="mb-5 font-semibold text-xl bg-transparent hover:bg-transparent">
          <Link
            to={"/app/dashboard"}
            className="bg-transparent hover:bg-transparent"
          >
            <img
              className="mask mask-squircle w-10 dark:hidden"
              src="/logo-light.png"
              alt="Logo E-Notaris Light"
            />
            <img
              className="mask mask-squircle w-10 hidden dark:block"
              src="/logo-dark.png"
              alt="Logo E-Notaris Dark"
            />
            <span className="text-white">E-Notaris</span>
          </Link>{" "}
        </li>
        {routes.map((route, k) => {
          return (
            <li className="mb-3 rounded-[10px] " key={k}>
              {route.submenu ? (
                <SidebarSubmenu {...route} />
              ) : (
                <NavLink
                  end
                  to={route.path}
                  className={({ isActive }) =>
                    `${
                      isActive
                        ? "font-normal text-[#002d6a] bg-[#f5fefd]"
                        : "font-semibold text-white"
                    } hover:text-[#0256c4]`
                  }
                >
                  {route.icon} {route.name}
                </NavLink>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default LeftSidebar;
