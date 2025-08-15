import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../features/common/headerSlice";
import Deeds from "../../features/deeds";

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Deeds" }));
  }, []);

  return <Deeds />;
}

export default InternalPage;
