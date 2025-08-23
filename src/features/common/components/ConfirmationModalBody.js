import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { CONFIRMATION_MODAL_CLOSE_TYPES } from "../../../utils/globalConstantUtil";
import { deleteLead } from "../../leads/leadSlice";
import { showNotification } from "../headerSlice";
import TextAreaInput from "../../../components/Input/TextAreaInput";

function ConfirmationModalBody({ extraObject, closeModal }) {
  const dispatch = useDispatch();
  const { message, type, _id, index } = extraObject;

  const [reason, setReason] = useState("");

  const updateFormValue = ({ updateType, value }) => {
    if (updateType === "REASON") {
      setReason(value);
    }
  };

  const proceedWithYes = async () => {
    if (type === CONFIRMATION_MODAL_CLOSE_TYPES.LEAD_DELETE) {
      dispatch(deleteLead({ index, reason }));
      dispatch(showNotification({ message: "Lead Deleted!", status: 1 }));
    }

    if (type === "IDV_APPROVE") {
      dispatch(
        showNotification({ message: "Aktivitas disetujui!", status: 1 })
      );
    }

    if (type === "IDV_REJECT") {
      dispatch(
        showNotification({
          message: `Aktivitas Berhasil Ditolak!`,
          status: 1,
        })
      );
    }

    closeModal();
  };

  return (
    <>
      <p className="text-xl mt-8 text-center">{message}</p>

      {/* hanya tampilkan textarea kalau REJECT */}
      {type === "IDV_REJECT" && (
        <TextAreaInput
          labelTitle="Alasan Penolakan"
          labelStyle="font-medium"
          containerStyle="mt-6"
          defaultValue=""
          placeholder="Masukkan alasan penolakan"
          updateType="REASON"
          updateFormValue={updateFormValue}
        />
      )}

      <div className="modal-action mt-12">
        <button className="btn btn-outline w-28" onClick={closeModal}>
          Batalkan
        </button>

        <button
          className="btn hover:text-black text-white bg-[#96696d] w-36"
          // hanya disable kalau reject tapi belum isi alasan
          disabled={type === "IDV_REJECT" && !reason.trim()}
          onClick={proceedWithYes}
        >
          Kirim
        </button>
      </div>
    </>
  );
}

export default ConfirmationModalBody;
