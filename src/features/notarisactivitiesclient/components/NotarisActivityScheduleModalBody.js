import moment from "moment";
import CalendarIcon from "@heroicons/react/24/outline/CalendarIcon";
import ClockIcon from "@heroicons/react/24/outline/ClockIcon";
import MapPinIcon from "@heroicons/react/24/outline/MapPinIcon";
import DocumentTextIcon from "@heroicons/react/24/outline/DocumentTextIcon";
import CheckCircleIcon from "@heroicons/react/24/outline/CheckCircleIcon";
import ExclamationTriangleIcon from "@heroicons/react/24/outline/ExclamationTriangleIcon";

export default function NotarisActivityScheduleModalBody({
  extraObject = {},
  closeModal,
}) {
  const { activity = {}, schedule = {} } = extraObject || {};

  const { scheduledDate, location, notes, status = "confirmed" } = schedule;

  const hasSchedule = scheduledDate;
  const scheduleDateTime = hasSchedule ? moment(scheduledDate) : null;
  const isUpcoming = scheduleDateTime?.isAfter(moment());
  const isPast = scheduleDateTime?.isBefore(moment());
  const isToday = scheduleDateTime?.isSame(moment(), "day");

  const getStatusInfo = () => {
    if (!hasSchedule) {
      return {
        icon: ExclamationTriangleIcon,
        text: "Belum Dijadwalkan",
        className: "text-gray-500",
        bgClass: "bg-gray-100",
      };
    }

    if (isPast) {
      return {
        icon: CheckCircleIcon,
        text: "Selesai",
        className: "text-green-600",
        bgClass: "bg-green-50",
      };
    }

    if (isToday) {
      return {
        icon: ClockIcon,
        text: "Hari Ini",
        className: "text-orange-600",
        bgClass: "bg-orange-50",
      };
    }

    return {
      icon: CalendarIcon,
      text: "Akan Datang",
      className: "text-blue-600",
      bgClass: "bg-blue-50",
    };
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  return (
    <div className="space-y-6">
      {/* Header Info Aktivitas */}
      <div className="bg-base-200 p-4 rounded-lg">
        <h4 className="font-semibold mb-3 flex items-center gap-2">
          <DocumentTextIcon className="w-5 h-5" />
          Informasi Aktivitas
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-gray-600">Kode:</span>
            <span className="ml-2 font-mono font-semibold">
              {activity.kode}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Jenis Akta:</span>
            <span className="ml-2">{activity.jenis_akta}</span>
          </div>
          <div>
            <span className="text-gray-600">Penghadap 1:</span>
            <span className="ml-2">{activity.penghadap1}</span>
          </div>
          <div>
            <span className="text-gray-600">Penghadap 2:</span>
            <span className="ml-2">{activity.penghadap2}</span>
          </div>
        </div>
      </div>

      {/* Status Jadwal */}
      <div className={`p-4 rounded-lg ${statusInfo.bgClass}`}>
        <div className="flex items-center gap-3">
          <StatusIcon className={`w-6 h-6 ${statusInfo.className}`} />
          <div>
            <h4 className={`font-semibold ${statusInfo.className}`}>
              Status: {statusInfo.text}
            </h4>
            {hasSchedule && (
              <p className="text-sm text-gray-600 mt-1">
                {isPast && "Pertemuan telah selesai"}
                {isToday && "Pertemuan dijadwalkan hari ini"}
                {isUpcoming && `Pertemuan dalam ${scheduleDateTime.fromNow()}`}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Detail Jadwal */}
      {hasSchedule ? (
        <div className="space-y-4">
          <h4 className="font-semibold text-lg">Detail Penjadwalan</h4>

          {/* Tanggal dan Waktu */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-start gap-4">
              <CalendarIcon className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h5 className="font-medium text-gray-900">Tanggal & Waktu</h5>
                <div className="mt-1 space-y-1">
                  <p className="text-lg font-semibold text-gray-800">
                    {scheduleDateTime.format("dddd, DD MMMM YYYY")}
                  </p>
                  <p className="text-blue-600 font-medium">
                    {scheduleDateTime.format("HH:mm")} WIB
                  </p>
                  {isUpcoming && (
                    <p className="text-sm text-gray-500">
                      {scheduleDateTime.fromNow()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Lokasi */}
          {location && (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-start gap-4">
                <MapPinIcon className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <h5 className="font-medium text-gray-900">
                    Lokasi Pertemuan
                  </h5>
                  <p className="mt-1 text-gray-700">{location}</p>
                </div>
              </div>
            </div>
          )}

          {/* Catatan */}
          {notes && (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-start gap-4">
                <DocumentTextIcon className="w-6 h-6 text-purple-600 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <h5 className="font-medium text-gray-900">
                    Catatan Tambahan
                  </h5>
                  <p className="mt-1 text-gray-700 whitespace-pre-wrap">
                    {notes}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Reminder untuk pertemuan */}
          {isUpcoming && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h5 className="font-medium text-yellow-800">
                    Persiapan Pertemuan
                  </h5>
                  <div className="mt-2 text-sm text-yellow-700">
                    <ul className="list-disc list-inside space-y-1">
                      <li>Pastikan membawa semua dokumen yang diperlukan</li>
                      <li>Datang 10-15 menit sebelum waktu yang dijadwalkan</li>
                      <li>Bawa identitas asli (KTP/SIM/Paspor)</li>
                      {location && (
                        <li>Pastikan lokasi pertemuan: {location}</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Belum ada jadwal */
        <div className="text-center py-8">
          <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-600 mb-2">
            Belum Ada Jadwal
          </h4>
          <p className="text-gray-500">
            Aktivitas ini belum dijadwalkan oleh notaris.
            <br />
            Anda akan mendapat notifikasi ketika jadwal tersedia.
          </p>
        </div>
      )}

      {/* Button Close */}
      <div className="flex justify-end pt-4">
        <button className="btn btn-primary" onClick={closeModal}>
          Tutup
        </button>
      </div>
    </div>
  );
}
