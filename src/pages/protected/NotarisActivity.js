import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../features/common/headerSlice";
import NotarisActivities from "../../features/notarisactivities";

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Notaris Activities" }));
  }, []);

  return <NotarisActivities />;
}

export default InternalPage;
