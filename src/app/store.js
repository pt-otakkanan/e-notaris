import { configureStore } from "@reduxjs/toolkit";
import headerSlice from "../features/common/headerSlice";
import modalSlice from "../features/common/modalSlice";
import rightDrawerSlice from "../features/common/rightDrawerSlice";
import leadsSlice from "../features/leads/leadSlice";
import userSlice from "../features/users/userSlice";
import identityVerificationSlice from "../features/identityverifications/identityVerificationSlice";

import notarisActivitiesSlice from "../features/notarisactivities/notarisActivitiesSlice";
import notarisActivitiesClientSlice from "../features/notarisactivitiesclient/notarisActivitiesSlice";
import deedSlice from "../features/deeds/deedSlice";

const combinedReducer = {
  header: headerSlice,
  rightDrawer: rightDrawerSlice,
  modal: modalSlice,
  lead: leadsSlice,
  user: userSlice,
  identityVerification: identityVerificationSlice,
  notarisActivities: notarisActivitiesSlice,
  notarisActivitiesClient: notarisActivitiesClientSlice,
  deed: deedSlice,
};

export default configureStore({ reducer: combinedReducer });
