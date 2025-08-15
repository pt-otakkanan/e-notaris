import { useEffect } from "react";
import { MODAL_BODY_TYPES } from "../utils/globalConstantUtil";
import { useSelector, useDispatch } from "react-redux";
import { closeModal } from "../features/common/modalSlice";
import AddLeadModalBody from "../features/leads/components/AddLeadModalBody";
import ConfirmationModalBody from "../features/common/components/ConfirmationModalBody";
import UserDetailModalBody from "../features/users/components/UserModalDetailBody";
import NotarisActivityDetailModalBody from "../features/notarisactivities/components/NotarisActivityDetailModalBody";
import DeedDetailModalBody from "../features/deeds/components/DeedDetailModalBody";
import DeedAddRequirementModalBody from "../features/deeds/components/DeedAddRequirementModalBody";

function ModalLayout() {
  const { isOpen, bodyType, size, extraObject, title } = useSelector(
    (state) => state.modal
  );
  const dispatch = useDispatch();

  const close = (e) => {
    dispatch(closeModal(e));
  };

  return (
    <>
      {/* The button to open modal */}

      {/* Put this part before </body> tag */}
      <div className={`modal ${isOpen ? "modal-open" : ""}`}>
        <div className={`modal-box  ${size === "lg" ? "max-w-5xl" : ""}`}>
          <button
            className="btn btn-sm btn-circle absolute right-2 top-2"
            onClick={() => close()}
          >
            ✕
          </button>
          <h3 className="font-semibold text-2xl pb-6 text-center">{title}</h3>

          {/* Loading modal body according to different modal type */}
          {
            {
              [MODAL_BODY_TYPES.LEAD_ADD_NEW]: (
                <AddLeadModalBody
                  closeModal={close}
                  extraObject={extraObject}
                />
              ),
              [MODAL_BODY_TYPES.CONFIRMATION]: (
                <ConfirmationModalBody
                  extraObject={extraObject}
                  closeModal={close}
                />
              ),

              [MODAL_BODY_TYPES.DEED_DETAIL]: (
                <DeedDetailModalBody
                  extraObject={extraObject}
                  closeModal={close}
                />
              ),
              [MODAL_BODY_TYPES.DEED_ADD_REQUIREMENT]: (
                <DeedAddRequirementModalBody
                  extraObject={extraObject}
                  closeModal={close}
                />
              ),

              [MODAL_BODY_TYPES.USER_DETAIL]: (
                <UserDetailModalBody
                  extraObject={extraObject}
                  closeModal={close}
                />
              ),

              [MODAL_BODY_TYPES.NOTARIS_ACTIVITY_DETAIL]: (
                <NotarisActivityDetailModalBody
                  extraObject={extraObject}
                  closeModal={close}
                />
              ),

              [MODAL_BODY_TYPES.DEFAULT]: <div></div>,
            }[bodyType]
          }
        </div>
      </div>
    </>
  );
}

export default ModalLayout;
