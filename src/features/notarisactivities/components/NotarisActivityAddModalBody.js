import {
  useEffect,
  useMemo,
  useState,
  useCallback,
  useMemo as useMemo2,
} from "react";
import { useDispatch } from "react-redux";
import SelectBoxSearch from "../../../components/Input/SelectBoxSearch";
import { showNotification } from "../../../features/common/headerSlice";
import NotarisActivityService from "../../../services/notarisActivity.service";
import DeedService from "../../../services/deed.service";

export default function NotarisActivityAddModalBody({
  extraObject = {},
  closeModal,
}) {
  const dispatch = useDispatch();
  const { onCreated } = extraObject || {};

  // ====== state ======
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Deeds
  const [deedOptions, setDeedOptions] = useState([]);
  const [needSecondClient, setNeedSecondClient] = useState(false);

  // Clients (penghadap)
  const [clientOptions, setClientOptions] = useState([]);

  // Form
  const [form, setForm] = useState({
    deedId: "",
    penghadap1Id: "",
    penghadap2Id: "",
  });

  const updateFormValue = ({ updateType, value }) => {
    setForm((prev) => {
      // jika P1 berubah dan sama dengan P2 → reset P2
      if (
        updateType === "penghadap1Id" &&
        String(value) === String(prev.penghadap2Id)
      ) {
        return { ...prev, penghadap1Id: value, penghadap2Id: "" };
      }
      return { ...prev, [updateType]: value };
    });
  };

  // opsi P2 tidak boleh sama dg P1
  const p2Options = useMemo(
    () =>
      clientOptions.filter(
        (o) => String(o.value) !== String(form.penghadap1Id)
      ),
    [clientOptions, form.penghadap1Id]
  );

  // ====== load deeds on mount ======
  useEffect(() => {
    (async () => {
      try {
        // ambil banyak sekalian (ubah jika perlu)
        const res = await DeedService.list({
          page: 1,
          per_page: 100,
          search: "",
        });
        const arr = Array.isArray(res?.data) ? res.data : [];
        setDeedOptions(arr.map((d) => ({ value: d.id, label: d.name })));
      } catch {
        dispatch(
          showNotification({ message: "Gagal memuat daftar akta.", status: 0 })
        );
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ====== load clients pertama kali ======
  useEffect(() => {
    (async () => {
      try {
        const res = await NotarisActivityService.listClients({ search: "" });
        setClientOptions(Array.isArray(res?.data) ? res.data : []);
      } catch {
        dispatch(
          showNotification({ message: "Gagal memuat penghadap.", status: 0 })
        );
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ====== saat deed dipilih → cek is_double_client ======
  useEffect(() => {
    (async () => {
      if (!form.deedId) {
        setNeedSecondClient(false);
        return;
      }
      try {
        const res = await DeedService.detail(form.deedId);
        const needTwo = !!res?.data?.is_double_client;
        setNeedSecondClient(needTwo);
        if (!needTwo) {
          setForm((p) => ({ ...p, penghadap2Id: "" }));
        }
      } catch {
        setNeedSecondClient(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.deedId]);

  const fetchClients = useCallback(async (term = "") => {
    try {
      const res = await NotarisActivityService.listClients({ search: term });
      setClientOptions(Array.isArray(res?.data) ? res.data : []);
    } catch {
      /* ignore */
    }
  }, []);

  // 2) a debounced wrapper so we don't hammer the API while typing
  const searchClients = useMemo2(() => {
    let tid;
    return (term = "") => {
      clearTimeout(tid);
      tid = setTimeout(() => fetchClients(term), 300);
    };
  }, [fetchClients]);

  useEffect(() => {
    if (form.penghadap1Id && needSecondClient) {
      // kosongkan pilihan P2 & tarik ulang kandidat
      setForm((p) => ({ ...p, penghadap2Id: "" }));
      fetchClients(""); // initial list untuk dropdown P2
    }
  }, [form.penghadap1Id, needSecondClient, fetchClients]);

  // ====== validate + submit ======
  const validate = () => {
    if (!form.deedId) return "Jenis akta wajib dipilih.";
    if (!form.penghadap1Id) return "Penghadap 1 wajib dipilih.";
    if (needSecondClient && !form.penghadap2Id)
      return "Akta ini memerlukan Penghadap 2.";
    if (
      form.penghadap1Id &&
      form.penghadap2Id &&
      String(form.penghadap1Id) === String(form.penghadap2Id)
    )
      return "Penghadap 1 dan Penghadap 2 tidak boleh sama.";
    return null;
  };

  const handleSave = async () => {
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    setError("");

    try {
      setSaving(true);
      const payload = {
        deed_id: Number(form.deedId),
        first_client_id: Number(form.penghadap1Id),
        ...(needSecondClient && form.penghadap2Id
          ? { second_client_id: Number(form.penghadap2Id) }
          : {}),
      };

      await NotarisActivityService.create(payload);

      dispatch(
        showNotification({ message: "Aktivitas berhasil dibuat", status: 1 })
      );
      if (typeof onCreated === "function") onCreated();
      closeModal();
    } catch (err) {
      const status = err?.response?.status;
      let msg =
        err?.response?.data?.message || "Gagal membuat aktivitas notaris.";
      const errors = err?.response?.data?.data || err?.response?.data?.errors;
      if (status === 422 && errors && typeof errors === "object") {
        const firstKey = Object.keys(errors)[0];
        const firstMsg = Array.isArray(errors[firstKey])
          ? errors[firstKey][0]
          : String(errors[firstKey]);
        if (firstMsg) msg = firstMsg;
      }
      dispatch(showNotification({ message: msg, status: 0 }));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Jenis Akta */}
      <SelectBoxSearch
        labelTitle={
          <>
            Jenis Akta <span className="text-red-500">*</span>
          </>
        }
        placeholder="Pilih jenis akta…"
        value={form.deedId}
        updateType="deedId"
        updateFormValue={updateFormValue}
        options={deedOptions} // [{value,label}]
      />

      {/* Penghadap 1 */}
      <SelectBoxSearch
        labelTitle={
          <>
            Penghadap 1 <span className="text-red-500">*</span>
          </>
        }
        placeholder="Pilih penghadap 1…"
        value={form.penghadap1Id}
        updateType="penghadap1Id"
        updateFormValue={updateFormValue}
        options={clientOptions}
        searchable
        onSearch={searchClients}
      />

      {/* Penghadap 2 */}
      <SelectBoxSearch
        key={`${needSecondClient}-${form.penghadap1Id}`}
        labelTitle={
          needSecondClient ? (
            <>
              Penghadap 2 <span className="text-red-500">*</span>
            </>
          ) : (
            "Penghadap 2 (opsional)"
          )
        }
        placeholder={
          form.penghadap1Id
            ? needSecondClient
              ? "Pilih penghadap 2…"
              : "Tidak diperlukan"
            : "Pilih Penghadap 1 dulu"
        }
        value={form.penghadap2Id}
        updateType="penghadap2Id"
        updateFormValue={updateFormValue}
        options={p2Options}
        disabled={!form.penghadap1Id || !needSecondClient}
        searchable
        onSearch={searchClients}
      />

      {error ? (
        <div className="alert alert-warning my-2 py-2 text-sm">{error}</div>
      ) : null}

      <div className="flex justify-end gap-2 pt-2">
        <button className="btn" onClick={closeModal} disabled={saving}>
          Tutup
        </button>
        <button
          className={`btn btn-primary ${saving ? "loading" : ""}`}
          onClick={handleSave}
          disabled={saving}
        >
          Simpan
        </button>
      </div>
    </div>
  );
}
