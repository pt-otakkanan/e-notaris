// src/features/common/ConfirmationModalBody.jsx
import React, { useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import TextAreaInput from "../../../components/Input/TextAreaInput";
import { showNotification } from "../headerSlice";
// (opsional) kalau masih dipakai untuk tipe lain:
// import { CONFIRMATION_MODAL_CLOSE_TYPES } from "../../../utils/globalConstantUtil";
// import { deleteLead } from "../../leads/leadSlice";

export default function ConfirmationModalBody({
  extraObject = {},
  closeModal,
}) {
  const dispatch = useDispatch();

  const {
    message = "",
    type = "", // "IDV_APPROVE" | "IDV_REJECT" | (opsional tipe lain)
    onConfirm, // function(optional) - dipanggil saat klik "Kirim"
    warning,
  } = extraObject;

  const needReason = useMemo(() => type === "IDV_REJECT", [type]);

  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const updateFormValue = ({ updateType, value }) => {
    if (updateType === "REASON") setReason(value);
  };

  const handleSubmit = async () => {
    // validasi alasan saat reject
    if (needReason && !reason.trim()) {
      dispatch(
        showNotification({ message: "Mohon isi alasan penolakan.", status: 0 })
      );
      return;
    }

    try {
      setSubmitting(true);

      if (typeof onConfirm === "function") {
        // untuk REJECT, kirimkan alasan ke onConfirm
        await onConfirm(needReason ? reason.trim() : undefined);
      } else {
        // fallback jika tidak ada onConfirm
        dispatch(
          showNotification({
            message: "Aksi tidak terhubung dengan handler.",
            status: 0,
          })
        );
        return;
      }

      closeModal();
    } catch (e) {
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        "Gagal memproses permintaan.";
      dispatch(showNotification({ message: msg, status: 0 }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <p className="text-xl mt-8 text-center">{message}</p>
      {warning ? (
        <p className="mt-3 text-sm text-error text-center">{warning}</p>
      ) : null}

      {needReason && (
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
        <button
          className="btn btn-outline w-28"
          onClick={closeModal}
          disabled={submitting}
        >
          Batalkan
        </button>

        <button
          className={`btn hover:text-black text-white bg-[#0256c4]  w-36`}
          disabled={submitting || (needReason && !reason.trim())}
          onClick={handleSubmit}
        >
          Kirim
        </button>
      </div>
    </>
  );
}
