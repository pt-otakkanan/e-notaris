import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../features/common/headerSlice";
import { Link } from "react-router-dom";
import TemplatePointers from "../../features/user/components/TemplatePointers";
import LandingPoints from "../../features/user/components/LandingPoints";

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "" }));
  }, []);

  return (
    <div className="hero h-4/5 bg-white shadow rounded-2xl dark:bg-[#0b0255]">
      {/* <image
        src="bg-texture.png"
        alt="Background Texture"
        className="rounded-full"
      ></image> */}
      {/* Paperclip
      <div className="mt-0">
        <img src="/paperclip.png" alt="Paperclip" className="w-12 h-auto" />
      </div> */}
      <LandingPoints />
      <div className="flex justify-center mt-44">
        <Link to="/app/dashboard">
          <button className="btn bg-[#0256c4] dark:bg-[#01043c] dark:hover:bg-[#3b3b3b] dark:hover:text-[#efe0e1] text-[white] btn-outline rounded-full">
            Mulai Sekarang
          </button>
        </Link>
      </div>
    </div>
  );
}

export default InternalPage;
