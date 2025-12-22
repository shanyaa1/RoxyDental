"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import DoctorNavbar from "@/components/ui/navbardr";
import { visitService, Visit } from "@/services/visit.service";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { authService } from "@/services/auth.service";

export default function QueuePage() {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [queues, setQueues] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(false);
  const [doctor, setDoctor] = useState<any | null>(null); // dokter yang login

  const tabs = [
    {
      label: "Daftar Pasien",
      value: "daftar-pasien",
      href: "/dashboard/dokter/pasien/daftar-pasien",
    },
    {
      label: "Daftar Antrian",
      value: "daftar-antrian",
      href: "/dashboard/dokter/pasien/antrian",
    },
    {
      label: "Rekam Medis",
      value: "rekam-medis",
      href: "/dashboard/dokter/pasien/rekam-medis",
    },
  ];

  // Ambil user yang sedang login (role: DOKTER)
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser && currentUser.role === "DOKTER") {
      setDoctor(currentUser);
    }
  }, []);

  const fetchQueue = async () => {
    setLoading(true);
    try {
      // ambil antrian khusus dokter
      const data = await visitService.getDoctorQueue(searchQuery);
      setQueues(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error("Error fetching queue:", error);
      toast({
        title: "Error",
        description:
          error?.response?.data?.message || "Gagal mengambil data antrian",
        variant: "destructive",
      });
      setQueues([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 10000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const getStatusBadge = (status: string) => {
    const statusMap: any = {
      WAITING: { label: "Menunggu", class: "bg-yellow-100 text-yellow-800" },
      IN_PROGRESS: {
        label: "Sedang Dilayani",
        class: "bg-blue-100 text-blue-800",
      },
      COMPLETED: { label: "Selesai", class: "bg-green-100 text-green-800" },
      CANCELLED: { label: "Dibatalkan", class: "bg-red-100 text-red-800" },
    };
    return statusMap[status] || {
      label: status,
      class: "bg-gray-100 text-gray-800",
    };
  };

  const formatTime = (date: string) => {
    try {
      return new Date(date).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "-";
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF5F7]">
      <DoctorNavbar />

      <div className="pt-6 px-6 max-w-7xl mx-auto space-y-6">
        {/* Tabs */}
        <div className="flex gap-4 mb-4">
          {tabs.map((tab) => {
            const isActive = pathname.includes(tab.value);
            return (
              <Link
                key={tab.value}
                href={tab.href}
                className={`px-4 py-2 rounded-full font-medium transition ${
                  isActive
                    ? "bg-pink-600 text-white shadow-md"
                    : "bg-white border border-pink-200 text-pink-600 hover:bg-pink-50"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>

        <h1 className="text-2xl font-bold text-pink-900">Daftar Antrian</h1>

        {/* Search */}
        <div className="mb-4 w-full max-w-sm">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-pink-400" />
            <Input
              placeholder="Cari antrian..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 py-2 rounded-lg border border-pink-200"
            />
          </div>
        </div>

        {/* Tabel Antrian */}
        <div className="overflow-x-auto rounded-lg shadow-md bg-white border border-pink-100">
          <table className="min-w-full divide-y divide-pink-200 text-pink-900">
            <thead className="bg-pink-100">
              <tr>
                {[
                  "NO. ANTRIAN",
                  "NO. PASIEN",
                  "NAMA PASIEN",
                  "JAM KUNJUNGAN",
                  "DOKTER",
                  "TINDAKAN",
                  "STATUS",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left font-semibold text-sm"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-pink-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-8">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600" />
                    </div>
                  </td>
                </tr>
              ) : queues.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-4 text-center text-pink-600"
                  >
                    Tidak ada antrian
                  </td>
                </tr>
              ) : (
                queues.map((queue, idx) => {
                  const statusInfo = getStatusBadge(queue.status);
                  return (
                    <tr key={idx} className="hover:bg-pink-50">
                      <td className="px-4 py-2">{queue.queueNumber}</td>
                      <td className="px-4 py-2">
                        {queue.patient?.patientNumber || "-"}
                      </td>
                      <td className="px-4 py-2 font-medium">
                        {queue.patient?.fullName || "-"}
                      </td>
                      <td className="px-4 py-2">
                        {formatTime(queue.visitDate)}
                      </td>
                      {/* dokter di kunjungan, fallback ke dokter yang sedang login */}
                      <td className="px-4 py-2">
                        {queue.doctor?.fullName || doctor?.fullName || "-"}
                      </td>
                      <td className="px-4 py-2">
                        {queue.chiefComplaint || "-"}
                      </td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.class}`}
                        >
                          {statusInfo.label}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
