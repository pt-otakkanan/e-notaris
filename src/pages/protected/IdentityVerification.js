import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../features/common/headerSlice";
import IdentityVerification from "../../features/identityverifications";

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Identity Verification" }));
  }, []);

  return <IdentityVerification />;
}

export default InternalPage;
