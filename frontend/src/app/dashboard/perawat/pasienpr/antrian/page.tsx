"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import DoctorNavbar from "@/components/ui/navbarpr";
import {
  visitService,
  Visit,
  VisitStatusType,
} from "@/services/visit.service";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

export default function QueuePage() {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [queues, setQueues] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(false);

  const tabs = [
    {
      label: "Daftar Pasien",
      value: "daftar-pasien",
      href: "/dashboard/perawat/pasienpr/daftar-pasien",
    },
    {
      label: "Daftar Antrian",
      value: "daftar-antrian",
      href: "/dashboard/perawat/pasienpr/antrian",
    },
    {
      label: "Rekam Medis",
      value: "rekam-medis",
      href: "/dashboard/perawat/pasienpr/rekam-medis",
    },
  ];

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const data = await visitService.getNurseQueue(searchQuery);
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
  }, []);

  useEffect(() => {
    const interval = setInterval(fetchQueue, 10000);
    return () => clearInterval(interval);
  }, [searchQuery]);

  const handleStatusChange = async (
    visitId: string,
    newStatus: VisitStatusType
  ) => {
    try {
      await visitService.updateVisitStatus(visitId, newStatus);
      toast({
        title: "Berhasil",
        description: "Status berhasil diubah",
      });
      fetchQueue();
    } catch (error: any) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description:
          error?.response?.data?.message || "Gagal mengubah status",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: VisitStatusType) => {
    switch (status) {
      case "WAITING":
        return "bg-yellow-100 text-yellow-800 border border-yellow-300";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800 border border-blue-300";
      case "COMPLETED":
        return "bg-green-100 text-green-800 border border-green-300";
      case "CANCELLED":
      default:
        return "bg-gray-100 text-gray-800";
    }
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

        <div className="mb-4 w-full flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 w-full max-w-sm">
            <Search className="w-5 h-5 text-pink-400" />
            <Input
              placeholder="Cari antrian..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 py-2 rounded-lg border border-pink-200"
            />
          </div>

          <Button
            className="bg-pink-600 text-white hover:bg-pink-700"
            onClick={() =>
              router.push("/dashboard/perawat/pasienpr/antrian/tambah-antrian")
            }
          >
            + Tambah Antrian
          </Button>
        </div>

        <div className="overflow-x-auto rounded-lg shadow-md bg-white border border-pink-100">
          <table className="min-w-full divide-y divide-pink-200 text-pink-900">
            <thead className="bg-pink-100">
              <tr>
                {[
                  "NO. ANTRIAN",
                  "NO. PASIEN",
                  "NAMA PASIEN",
                  "JAM",
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
                  <td colSpan={6} className="text-center py-8">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600" />
                    </div>
                  </td>
                </tr>
              ) : queues.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-4 text-center text-pink-600"
                  >
                    Tidak ada antrian
                  </td>
                </tr>
              ) : (
                queues.map((q) => (
                  <tr key={q.id} className="hover:bg-pink-50">
                    <td className="px-4 py-3">{q.queueNumber}</td>
                    <td className="px-4 py-3">
                      {q.patient?.patientNumber || "-"}
                    </td>
                    <td className="px-4 py-3">
                      {q.patient?.fullName || "-"}
                    </td>
                    <td className="px-4 py-3">{formatTime(q.visitDate)}</td>
                    <td className="px-4 py-3">{q.chiefComplaint || "-"}</td>
                    <td className="px-4 py-3">
                      <select
                        value={q.status}
                        onChange={(e) =>
                          handleStatusChange(
                            q.id,
                            e.target.value as VisitStatusType
                          )
                        }
                        className={`px-3 py-1 rounded-lg text-sm ${getStatusColor(
                          q.status as VisitStatusType
                        )}`}
                      >
                        <option value="WAITING">Menunggu</option>
                        <option value="IN_PROGRESS">Sedang Dilayani</option>
                        <option value="COMPLETED">Selesai</option>
                        <option value="CANCELLED">Dibatalkan</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="h-10" />
    </div>
  );
}