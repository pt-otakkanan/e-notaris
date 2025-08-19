import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../features/common/headerSlice";
import NotarisActivities from "../../features/notarisactivitiesclient";

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Notaris Activities Admin" }));
  }, []);

  return <NotarisActivities />;
}

export default InternalPage;
