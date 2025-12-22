"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, PlusCircle } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import DoctorNavbar from "@/components/ui/navbardr";
import { patientService } from "@/services/patient.service";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

export default function PatientListPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 100,
    totalPages: 0
  });

  const tabs = [
    { label: "Daftar Pasien", value: "daftar-pasien", href: "/dashboard/dokter/pasien/daftar-pasien" },
    { label: "Daftar Antrian", value: "daftar-antrian", href: "/dashboard/dokter/pasien/antrian" },
    { label: "Rekam Medis", value: "rekam-medis", href: "/dashboard/dokter/pasien/rekam-medis" },
  ];

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const response = await patientService.getPatients(1, 100, searchQuery);

      if (response.success && response.data) {
        setPatients(response.data.patients || []);
        setPagination(response.data.pagination || {
          total: 0,
          page: 1,
          limit: 100,
          totalPages: 0
        });
      } else {
        setPatients([]);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Gagal mengambil data pasien",
        variant: "destructive",
      });
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [searchQuery]);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return "-";
    }
  };

  const calculateAge = (dateOfBirth: string) => {
    try {
      const today = new Date();
      const birthDate = new Date(dateOfBirth);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    } catch {
      return "-";
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPatients();
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

        <div className="flex items-start gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 w-80">
            <h2 className="text-lg font-bold text-pink-900 mb-4">Daftar Pasien</h2>
            <form onSubmit={handleSearch}>
              <div className="flex items-center gap-2 mb-4">
                <Search className="w-5 h-5 text-pink-400" />
                <Input
                  placeholder="Cari pasien..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 border border-pink-200"
                />
              </div>
              <Button type="submit" className="w-full bg-pink-600 text-white hover:bg-pink-700">
                Cari
              </Button>
            </form>
          </div>

          <div className="flex-1 overflow-x-auto rounded-lg shadow-md bg-white border border-pink-100">
            <table className="min-w-full divide-y divide-pink-200 text-pink-900">
              <thead className="bg-pink-100">
                <tr>
                  {[
                    "NO. PASIEN",
                    "NAMA",
                    "J/K",
                    "TGL. LAHIR (UMUR)",
                    "TGL. KUNJUNGAN",
                    "TINDAKAN",
                   
                  ].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-semibold text-sm">
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
                ) : patients.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-pink-600">
                      Tidak ada data pasien
                    </td>
                  </tr>
                ) : (
                  patients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-pink-50">
                      <td className="px-4 py-3">{patient.patientNumber || "-"}</td>
                      <td className="px-4 py-3 font-medium">{patient.fullName || "-"}</td>
                      <td className="px-4 py-3">
                        {patient.gender === "L" ? "Pria" : "Wanita"}
                      </td>
                      <td className="px-4 py-3">
                        {patient.dateOfBirth
                          ? `${formatDate(patient.dateOfBirth)} (${calculateAge(patient.dateOfBirth)})`
                          : "-"}
                      </td>
                      <td className="px-4 py-3">
                        {patient.lastVisit ? formatDate(patient.lastVisit) : "-"}
                      </td>
                      <td className="px-4 py-3">
                        {patient.chiefComplaint && patient.chiefComplaint.trim() !== ""
                          ? patient.chiefComplaint
                          : "-"}
                      </td>         
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
