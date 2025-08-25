import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteUserById } from "../../users/userSlice";
import { showNotification } from "../../common/headerSlice";
export default function UserDeleteModalBody({ extraObject = {}, closeModal }) {
  const dispatch = useDispatch();
  const { id, name, email } = extraObject || {};
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const onConfirmDelete = async () => {
    if (!id) {
      setErr("ID pengguna tidak valid.");
      return;
    }
    setErr("");
    setLoading(true);
    try {
      await dispatch(deleteUserById(id)).unwrap(); // panggil API DELETE /admin/user/{id}
      dispatch(
        showNotification({ message: "Pengguna berhasil dihapus", status: 1 })
      );
      closeModal();
    } catch (e) {
      const msg =
        e?.message ||
        e?.error ||
        e?.data?.message ||
        "Gagal menghapus pengguna. Coba lagi.";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <p className="text-lg mt-6 text-center">
        Hapus pengguna <span className="font-semibold">{name || "-"}</span>
        {email ? (
          <>
            {" "}
            (<span className="opacity-70">{email}</span>)
          </>
        ) : null}
        ?
        <br />
        <span className="text-error">
          Semua yang berhubungan dengan pengguna ini akan dihapus.
        </span>
      </p>

      {err ? (
        <div className="alert alert-error mt-6">
          <span>{err}</span>
        </div>
      ) : null}

      <div className="modal-action mt-10">
        <button
          className="btn btn-outline w-28"
          onClick={closeModal}
          disabled={loading}
        >
          Batalkan
        </button>
        <button
          className={`btn hover:text-black text-white bg-[#96696d] w-36`}
          onClick={onConfirmDelete}
          disabled={loading}
        >
          {loading ? "Menghapus..." : "Hapus"}
        </button>
      </div>
    </>
  );
}
