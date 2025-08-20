import { Link } from "react-router-dom";
import moment from "moment";
import InputText from "../../../components/Input/InputText";
import TextAreaInput from "../../../components/Input/TextAreaInput";

export default function DeedAddModalBody({ extraObject = {}, closeModal }) {
  return (
    <div className="space-y-4">
      <div>
        <InputText
          type="Nama Dokumen"
          labelTitle="Nama"
          labelStyle="after:content-['*'] after:ml-1 after:text-red-500"
          defaultValue=""
          updateFormValue=""
          updateType="text"
        />
        <TextAreaInput
          labelTitle="Deskripsi"
          defaultValue=""
          updateFormValue=""
        />
        <InputText
          type="number"
          labelTitle="Jumlah Penghadap"
          labelStyle="after:content-['*'] after:ml-1 after:text-red-500"
          defaultValue=""
          updateFormValue=""
          updateType="number"
        />
      </div>

      <div className="flex justify-end pt-2">
        <button className="btn" onClick={closeModal}>
          Tutup
        </button>
      </div>
    </div>
  );
}
