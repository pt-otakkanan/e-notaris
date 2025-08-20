import { Link } from "react-router-dom";
import moment from "moment";
import InputText from "../../../components/Input/InputText";

export default function DeedAddRequirementModalBody({
  extraObject = {},
  closeModal,
}) {
  return (
    <div className="space-y-4">
      <div>
        <InputText
          type="Nama Dokumen"
          labelTitle="Nama Dokumen"
          labelStyle="after:content-['*'] after:ml-1 after:text-red-500"
          defaultValue=""
          updateFormValue=""
          updateType="text"
        />
      </div>

      <div>
        <InputText
          type="Jenis Dokumen"
          labelTitle="Jenis Dokumen"
          labelStyle="after:content-['*'] after:ml-1 after:text-red-500"
          defaultValue=""
          updateFormValue=""
          updateType="text"
        />
      </div>

      <div className="flex justify-end pt-2">
        <button className="btn" onClick={closeModal}>
          Tutup
        </button>
        <button className="btn btn-primary ms-2" onClick={closeModal}>
          Simpan
        </button>
      </div>
    </div>
  );
}
