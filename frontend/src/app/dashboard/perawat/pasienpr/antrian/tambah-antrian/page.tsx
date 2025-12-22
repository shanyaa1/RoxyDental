"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Users } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import DoctorNavbar from "@/components/ui/navbarpr";
import { useToast } from "@/hooks/use-toast";
import { visitService, CreateVisitData } from "@/services/visit.service";

interface FormData {
  fullName: string;
  gender: "L" | "P";
  phone: string;
  dateOfBirth: string;
  address: string;
  visitDate: string;
  visitTime: string;
  chiefComplaint: string;
  notes: string;
}

export default function TambahAntrianPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    gender: "L",
    phone: "",
    dateOfBirth: "",
    address: "",
    visitDate: "",
    visitTime: "",
    chiefComplaint: "",
    notes: "",
  });

  const validateForm = (): boolean => {
    if (!formData.fullName.trim()) {
      toast({
        title: "Error Validasi",
        description: "Nama pasien harus diisi",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.phone.trim()) {
      toast({
        title: "Error Validasi",
        description: "No. telepon harus diisi",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.dateOfBirth) {
      toast({
        title: "Error Validasi",
        description: "Tanggal lahir harus diisi",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.visitDate) {
      toast({
        title: "Error Validasi",
        description: "Tanggal kunjungan harus diisi",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.visitTime) {
      toast({
        title: "Error Validasi",
        description: "Jam kunjungan harus diisi",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const [hoursStr, minutesStr] = formData.visitTime.split(":");
      const hours = parseInt(hoursStr || "0", 10);
      const minutes = parseInt(minutesStr || "0", 10);

      const visitDateParts = formData.visitDate.split("-");
      const year = parseInt(visitDateParts[0], 10);
      const month = parseInt(visitDateParts[1], 10) - 1;
      const day = parseInt(visitDateParts[2], 10);

      const visitDateTime = new Date(year, month, day, hours, minutes, 0, 0);

      const payload: CreateVisitData = {
        patient: {
          fullName: formData.fullName.trim(),
          dateOfBirth: formData.dateOfBirth,
          gender: formData.gender,
          phone: formData.phone.trim(),
          address: formData.address.trim() || undefined,
        },
        visit: {
          visitDate: visitDateTime.toISOString(),
          chiefComplaint: formData.chiefComplaint.trim() || undefined,
          notes: formData.notes.trim() || undefined,
        },
      };

      await visitService.createVisitAsNurse(payload);

      toast({
        title: "Berhasil",
        description: "Data antrian berhasil ditambahkan",
        duration: 3000,
      });

      router.push("/dashboard/perawat/pasienpr/antrian");
    } catch (error: any) {
      console.error("Error saat menambah antrian:", error);

      let errorMessage = "Gagal menambahkan antrian";
      if (error?.response?.data) {
        errorMessage =
          error.response.data.message ||
          error.response.data.error ||
          errorMessage;
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/perawat/pasienpr/antrian");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-50 to-rose-50">
      <DoctorNavbar />

      <div className="flex flex-col items-center py-12 px-4">
        <div className="w-24 h-24 rounded-full bg-linear-to-br from-pink-500 to-rose-600 shadow-2xl flex items-center justify-center mb-6">
          <Users className="text-white" size={48} strokeWidth={2.5} />
        </div>

        <h1 className="text-4xl font-bold text-pink-900 mb-10">
          Tambah Daftar Antrian
        </h1>

        <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden border-2 border-pink-100">
          <div className="bg-linear-to-r from-pink-500 via-rose-500 to-pink-600 text-white px-8 py-6">
            <h2 className="font-bold text-2xl flex items-center gap-3">
              <Users size={28} />
              Informasi Pasien
            </h2>
            <p className="text-sm opacity-95 mt-2">
              Nomor pasien dan nomor antrian akan dibuat otomatis oleh sistem.
              Pastikan data pasien yang dimasukkan sudah benar.
            </p>
          </div>

          <form className="p-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="text-pink-900 text-sm font-bold block mb-2">
                Nama Pasien <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                placeholder="Masukkan nama pasien"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    fullName: e.target.value,
                  }))
                }
                className="border-2 border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-300 text-base"
                maxLength={100}
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="text-pink-900 text-sm font-bold block mb-2">
                  Tanggal Lahir <span className="text-red-500">*</span>
                </label>
                <Input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      dateOfBirth: e.target.value,
                    }))
                  }
                  className="border-2 border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-300 text-base"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="text-pink-900 text-sm font-bold block mb-2">
                  Jenis Kelamin <span className="text-red-500">*</span>
                </label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      gender: value as "L" | "P",
                    }))
                  }
                  disabled={loading}
                >
                  <SelectTrigger className="border-2 border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-300">
                    <SelectValue placeholder="Pilih jenis kelamin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="L">Pria</SelectItem>
                    <SelectItem value="P">Wanita</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-pink-900 text-sm font-bold block mb-2">
                No. Telepon <span className="text-red-500">*</span>
              </label>
              <Input
                type="tel"
                placeholder="08xxxxxxxxxx"
                value={formData.phone}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    phone: e.target.value,
                  }))
                }
                className="border-2 border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-300 text-base"
                maxLength={15}
                disabled={loading}
              />
            </div>

            <div>
              <label className="text-pink-900 text-sm font-bold block mb-2">
                Alamat
              </label>
              <Input
                type="text"
                placeholder="Opsional"
                value={formData.address}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    address: e.target.value,
                  }))
                }
                className="border-2 border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-300 text-base"
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="text-pink-900 text-sm font-bold block mb-2">
                  Tanggal Kunjungan <span className="text-red-500">*</span>
                </label>
                <Input
                  type="date"
                  value={formData.visitDate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      visitDate: e.target.value,
                    }))
                  }
                  className="border-2 border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-300 text-base"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="text-pink-900 text-sm font-bold block mb-2">
                  Jam Kunjungan <span className="text-red-500">*</span>
                </label>
                <Input
                  type="time"
                  value={formData.visitTime}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      visitTime: e.target.value,
                    }))
                  }
                  className="border-2 border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-300 text-base"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="text-pink-900 text-sm font-bold block mb-2">
                Tindakan / Keluhan Utama
              </label>
              <Input
                type="text"
                placeholder="Contoh: Scaling, Filling, Cabut gigi, dsb."
                value={formData.chiefComplaint}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    chiefComplaint: e.target.value,
                  }))
                }
                className="border-2 border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-300 text-base"
                disabled={loading}
              />
            </div>

            <div>
              <label className="text-pink-900 text-sm font-bold block mb-2">
                Catatan Tambahan
              </label>
              <Input
                type="text"
                placeholder="Opsional"
                value={formData.notes}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    notes: e.target.value,
                  }))
                }
                className="border-2 border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-300 text-base"
                disabled={loading}
              />
            </div>

            <div className="mt-8 border-t-2 border-pink-100 bg-pink-50/80">
              <div className="flex justify-center gap-4 py-4">
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 sm:h-11 px-6 sm:px-8 border-2 border-pink-500 
                             bg-white text-pink-700 font-semibold 
                             rounded-full text-sm sm:text-base
                             hover:bg-pink-50 hover:border-pink-600 transition-all"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Batal
                </Button>

                <Button
                  type="submit"
                  className="h-10 sm:h-11 px-6 sm:px-8 
                             bg-linear-to-r from-pink-600 to-rose-600 
                             hover:from-pink-700 hover:to-rose-700
                             text-white font-semibold rounded-full 
                             text-sm sm:text-base shadow-md hover:shadow-lg
                             transition-all"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      Menyimpan...
                    </div>
                  ) : (
                    "Daftar Sekarang"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}