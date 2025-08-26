import { useEffect, useMemo, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import SelectBoxSearch from "../../../components/Input/SelectBoxSearch";
import InputTextAuth from "../../../components/Input/InputTextAuth";
import { showNotification } from "../../../features/common/headerSlice";
import NotarisActivityService from "../../../services/notarisActivity.service";
import DeedService from "../../../services/deed.service";

export default function NotarisActivityEditModalBody({
  extraObject = {},
  closeModal,
}) {
  const dispatch = useDispatch();

  // extraObject bisa berupa ID atau full row data
  const activityId =
    typeof extraObject === "number" ? extraObject : extraObject?.id;
  const { onUpdated } = extraObject || {};

  // State
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Activity data
  const [activity, setActivity] = useState(null);

  // Options
  const [deedOptions, setDeedOptions] = useState([]);
  const [clientOptions, setClientOptions] = useState([]);
  const [needSecondClient, setNeedSecondClient] = useState(false);

  // Form
  const [form, setForm] = useState({
    name: "",
    deedId: "",
    penghadap1Id: "",
    penghadap2Id: "",
  });

  const updateFormValue = ({ updateType, value }) => {
    setForm((prev) => {
      // Jika P1 berubah dan sama dengan P2 → reset P2
      if (
        updateType === "penghadap1Id" &&
        String(value) === String(prev.penghadap2Id)
      ) {
        return { ...prev, penghadap1Id: value, penghadap2Id: "" };
      }
      return { ...prev, [updateType]: value };
    });
  };

  // Opsi P2 tidak boleh sama dengan P1
  const p2Options = useMemo(
    () =>
      clientOptions.filter(
        (o) => String(o.value) !== String(form.penghadap1Id)
      ),
    [clientOptions, form.penghadap1Id]
  );

  // Load activity detail
  useEffect(() => {
    if (!activityId) {
      setError("ID aktivitas tidak ditemukan");
      setLoading(false);
      return;
    }

    const loadActivityDetail = async () => {
      try {
        setLoading(true);
        const res = await NotarisActivityService.detail(activityId);
        const data = res?.data;

        if (!data) {
          setError("Data aktivitas tidak ditemukan");
          return;
        }

        setActivity(data);

        // Set form values dari data yang ada
        setForm({
          name: data.name || "",
          deedId: data.deed_id || data.deed?.id || "",
          penghadap1Id: data.first_client_id || data.first_client?.id || "",
          penghadap2Id: data.second_client_id || data.second_client?.id || "",
        });

        // Set need second client berdasarkan deed
        if (data.deed?.is_double_client !== undefined) {
          setNeedSecondClient(!!data.deed.is_double_client);
        }
      } catch (err) {
        console.error("Error loading activity:", err);
        setError("Gagal memuat data aktivitas");
      } finally {
        setLoading(false);
      }
    };

    loadActivityDetail();
  }, [activityId]);

  // Load deed options
  useEffect(() => {
    const loadDeeds = async () => {
      try {
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
    };

    loadDeeds();
  }, [dispatch]);

  // Load client options
  useEffect(() => {
    const loadClients = async () => {
      try {
        const res = await NotarisActivityService.listClients({ search: "" });
        setClientOptions(Array.isArray(res?.data) ? res.data : []);
      } catch {
        dispatch(
          showNotification({ message: "Gagal memuat penghadap.", status: 0 })
        );
      }
    };

    loadClients();
  }, [dispatch]);

  // Check deed requirements when deed changes
  useEffect(() => {
    const checkDeedRequirements = async () => {
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
    };

    // Only check if deed actually changed from initial load
    if (
      form.deedId &&
      activity?.deed?.id &&
      String(form.deedId) !== String(activity.deed.id)
    ) {
      checkDeedRequirements();
    }
  }, [form.deedId, activity?.deed?.id]);

  const fetchClients = useCallback(async (term = "") => {
    try {
      const res = await NotarisActivityService.listClients({ search: term });
      setClientOptions(Array.isArray(res?.data) ? res.data : []);
    } catch {
      // Ignore search errors
    }
  }, []);

  const searchClients = useMemo(() => {
    let timeout;
    return (term = "") => {
      clearTimeout(timeout);
      timeout = setTimeout(() => fetchClients(term), 300);
    };
  }, [fetchClients]);

  // Validation
  const validate = () => {
    if (!form.name?.trim()) return "Nama aktivitas wajib diisi.";
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
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");

    try {
      setSaving(true);
      const payload = {
        name: form.name.trim(),
        deed_id: Number(form.deedId),
        first_client_id: Number(form.penghadap1Id),
        ...(needSecondClient && form.penghadap2Id
          ? { second_client_id: Number(form.penghadap2Id) }
          : { second_client_id: null }),
      };

      await NotarisActivityService.update(activityId, payload);

      dispatch(
        showNotification({
          message: "Aktivitas berhasil diperbarui",
          status: 1,
        })
      );

      if (typeof onUpdated === "function") onUpdated();
      closeModal();
    } catch (err) {
      const status = err?.response?.status;
      let msg = err?.response?.data?.message || "Gagal memperbarui aktivitas.";
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

  if (loading) {
    return (
      <div className="space-y-5">
        <div className="p-6 text-center">
          <span className="loading loading-spinner loading-md"></span>
          <div className="mt-2">Memuat data aktivitas...</div>
        </div>
      </div>
    );
  }

  if (error && !activity) {
    return (
      <div className="space-y-5">
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
        <div className="flex justify-end">
          <button className="btn" onClick={closeModal}>
            Tutup
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header dengan info aktivitas */}
      {activity && (
        <div className="bg-base-200 rounded-lg p-3">
          <div className="text-xs opacity-70">Kode Aktivitas</div>
          <div className="font-semibold">{activity.tracking_code}</div>
          {activity.created_at && (
            <div className="text-xs opacity-70 mt-1">
              Dibuat:{" "}
              {new Date(activity.created_at).toLocaleDateString("id-ID")}
            </div>
          )}
        </div>
      )}

      {/* Form Fields */}
      <InputTextAuth
        type="text"
        defaultValue={form.name}
        updateType="name"
        containerStyle="mt-4"
        labelTitle={
          <>
            Nama Aktivitas <span className="text-red-500">*</span>
          </>
        }
        updateFormValue={updateFormValue}
      />

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
        options={deedOptions}
      />

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

      {error && (
        <div className="alert alert-warning my-2 py-2 text-sm">{error}</div>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <button className="btn" onClick={closeModal} disabled={saving}>
          Tutup
        </button>
        <button
          className={`btn btn-primary ${saving ? "loading" : ""}`}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </div>
    </div>
  );
}
