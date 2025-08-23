import TitleCard from "../../../components/Cards/TitleCard";

const userSourceData = [
  {
    code: "FB-001",
    deeds: "Akta Jual Beli",
    client1: "John Doe",
    client2: "Jane Doe",
    status: 100,
  },
  {
    code: "GA-002",
    deeds: "Akta Hibah",
    client1: "Alice Smith",
    client2: "Bob Johnson",
    status: 75,
  },
  {
    code: "IA-003",
    deeds: "Akta Waris",
    client1: "Charlie Brown",
    client2: "David Wilson",
    status: 50,
  },
  {
    code: "AF-004",
    deeds: "Akta Pendirian",
    client1: "Eve Davis",
    client2: "Frank Miller",
    status: 25,
  },
  {
    code: "OR-005",
    deeds: "Akta Perjanjian",
    client1: "Grace Lee",
    client2: "Henry Taylor",
    status: 0,
  },
];

function getStatusInfo(status) {
  if (status === 100) {
    return {
      label: "Disetujui",
      className:
        "inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 inset-ring inset-ring-green-600/20",
    };
  } else if (status === 0) {
    return {
      label: "Ditolak",
      className:
        "inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 inset-ring inset-ring-red-600/10",
    };
  } else {
    return {
      label: "Menunggu",
      className:
        "inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 inset-ring inset-ring-yellow-600/20",
    };
  }
}

function RecentActivity() {
  return (
    <TitleCard title={"Aktivitas Terkini"}>
      <div className="bg-base-100 shadow"></div>

      {/** Table Data */}
      <div className="overflow-x-auto">
        <table className="table w-full ">
          <thead>
            <tr>
              <th className="normal-case text-lg text-black bg-[#efe0e1]">
                Nomor
              </th>
              <th className="normal-case text-lg text-black bg-[#efe0e1]">
                Kode
              </th>
              <th className="normal-case text-lg text-black bg-[#efe0e1]">
                Jenis Akta
              </th>
              <th className="normal-case text-lg text-black bg-[#efe0e1]">
                Penghadap 1
              </th>
              <th className="normal-case text-lg text-black bg-[#efe0e1]">
                Penghadap 2
              </th>
              <th className="normal-case text-lg text-black bg-[#efe0e1]">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {userSourceData.map((u, k) => {
              const statusInfo = getStatusInfo(u.status);

              return (
                <tr key={k}>
                  <th>{k + 1}</th>
                  <td>{u.code}</td>
                  <td>{u.deeds}</td>
                  <td>{u.client1}</td>
                  <td>{u.client2}</td>
                  <td>
                    <span className={statusInfo.className}>
                      {statusInfo.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end mt-5">
        <button className="mt-5 btn bg-[#efe0e1] w-full">Lihat Detail</button>
      </div>
    </TitleCard>
  );
}

export default RecentActivity;
