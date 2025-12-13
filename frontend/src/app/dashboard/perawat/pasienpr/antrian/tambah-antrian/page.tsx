"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users } from "lucide-react";
import { visitService, CreateVisitData } from "@/services/visit.service";
import { useToast } from "@/hooks/use-toast";
import DoctorNavbar from "@/components/ui/navbarpr";

interface FormData {
  fullName: string;
  gender: "L" | "P";
  phone: string;
  visitTime: string;
  serviceCategory: string;
  status: string;
}

export default function TambahAntrianPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const [queueNumber, setQueueNumber] = useState<string>("");
  const [patientId, setPatientId] = useState<string>("");

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    gender: "L",
    phone: "",
    visitTime: "",
    serviceCategory: "",
    status: "WAITING"
  });

  useEffect(() => {
    generateQueueNumbers();
  }, []);

  const generateQueueNumbers = (): void => {
    const randomQueue = Math.floor(Math.random() * 100) + 1;
    const randomId = `008-${String(Math.floor(Math.random() * 10000) + 900000).slice(-6)}`;
    
    setQueueNumber(String(randomQueue));
    setPatientId(randomId);
  };

  const validateForm = (): boolean => {
    if (!formData.fullName.trim()) {
      toast({
        title: "Error Validasi",
        description: "Nama Pasien harus diisi",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.phone.trim()) {
      toast({
        title: "Error Validasi",
        description: "No. Telepon harus diisi",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.visitTime) {
      toast({
        title: "Error Validasi",
        description: "Jam kunjungan harus diisi",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const today = new Date();
      const [hours, minutes] = formData.visitTime.split(':');
      
      const visitDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        parseInt(hours, 10) || 0,
        parseInt(minutes, 10) || 0,
        0,
        0
      );

      const defaultDateOfBirth = new Date(2000, 0, 1);
      const dateOfBirthStr = defaultDateOfBirth.toISOString().split('T')[0];

      const payload: CreateVisitData = {
        patient: {
          fullName: formData.fullName.trim(),
          dateOfBirth: dateOfBirthStr,
          gender: formData.gender,
          phone: formData.phone.trim()
        },
        visit: {
          visitDate: visitDate.toISOString(),
          chiefComplaint: formData.serviceCategory || undefined
        }
      };

      await visitService.createVisit(payload);

      toast({
        title: "Berhasil",
        description: "Data antrian berhasil ditambahkan",
        duration: 3000
      });

      setTimeout(() => {
        router.push("/dashboard/perawat/pasienpr/antrian");
      }, 500);

    } catch (error: any) {
      console.error('Error saat menambah antrian:', error);

      let errorMessage = "Gagal menambahkan antrian";

      if (error.response?.data) {
        errorMessage = error.response.data.message || 
                      error.response.data.error || 
                      errorMessage;
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
        duration: 5000
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = (): void => {
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
              Pastikan semua informasi yang dimasukkan sudah benar
            </p>
          </div>

          <form className="p-8 space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-pink-900 text-sm font-bold block mb-2">
                  No. Antrian
                </label>
                <Input
                  type="text"
                  value={queueNumber}
                  readOnly
                  disabled
                  className="bg-pink-50 border-2 border-pink-200 text-pink-900 font-bold text-lg cursor-not-allowed"
                />
              </div>

              <div>
                <label className="text-pink-900 text-sm font-bold block mb-2">
                  No. ID
                </label>
                <Input
                  type="text"
                  value={patientId}
                  readOnly
                  disabled
                  className="bg-pink-50 border-2 border-pink-200 text-pink-900 font-bold text-lg cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="text-pink-900 text-sm font-bold block mb-2">
                Nama Pasien <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                placeholder="Masukkan Nama Pasien"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="border-2 border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-300 text-base"
                maxLength={100}
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-pink-900 text-sm font-bold block mb-2">
                  Jam <span className="text-red-500">*</span>
                </label>
                <Input
                  type="time"
                  value={formData.visitTime}
                  onChange={(e) => setFormData({ ...formData, visitTime: e.target.value })}
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
                  onValueChange={(value) => setFormData({ ...formData, gender: value as "L" | "P" })}
                  disabled={loading}
                >
                  <SelectTrigger className="border-2 border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-300">
                    <SelectValue />
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
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="border-2 border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-300 text-base"
                maxLength={15}
                disabled={loading}
              />
            </div>

            <div>
              <label className="text-pink-900 text-sm font-bold block mb-2">
                Tindakan
              </label>
              <Select 
                value={formData.serviceCategory} 
                onValueChange={(value) => setFormData({ ...formData, serviceCategory: value })}
                disabled={loading}
              >
                <SelectTrigger className="border-2 border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-300">
                  <SelectValue placeholder="Pilih Tindakan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CONSULTATION">Konsultasi</SelectItem>
                  <SelectItem value="SCALING">Scaling</SelectItem>
                  <SelectItem value="FILLING">Tambal Gigi</SelectItem>
                  <SelectItem value="EXTRACTION">Cabut Gigi</SelectItem>
                  <SelectItem value="WHITENING">Pemutihan</SelectItem>
                  <SelectItem value="ORTHODONTIC">Orthodontic</SelectItem>
                  <SelectItem value="OTHER">Lainnya</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-pink-900 text-sm font-bold block mb-2">
                Status
              </label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => setFormData({ ...formData, status: value })}
                disabled={loading}
              >
                <SelectTrigger className="border-2 border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WAITING">Menunggu</SelectItem>
                  <SelectItem value="IN_PROGRESS">Sedang Dilayani</SelectItem>
                  <SelectItem value="COMPLETED">Selesai</SelectItem>
                </SelectContent>
              </Select>
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