"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { User, Upload } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import DoctorNavbar from "@/components/ui/navbardr";
import SettingsSidebar from "@/components/ui/SettingsSidebar";
import { userService } from "@/services/user.service";

export default function SettingsAccountInfo() {
  const [activeMenu, setActiveMenu] = useState("informasi-akun");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    accountType: "Dokter",
    specialization: "",
    strNumber: "",
    status: "Aktif",
    education: "",
    experience: "",
    sipStartDate: "",
    sipEndDate: "",
    profilePhoto: ""
  });

  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);
  const [confirmSaveOpen, setConfirmSaveOpen] = useState(false);
  const [successSaveOpen, setSuccessSaveOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [successDeleteOpen, setSuccessDeleteOpen] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await userService.getProfile();
      if (response.success && response.data) {
        const data = response.data;
        setProfileData({
          name: data.fullName || "",
          email: data.email || "",
          phone: data.phone || "",
          accountType: "Dokter",
          specialization: data.specialization || "",
          strNumber: data.sipNumber || "",
          status: data.isActive ? "Aktif" : "Tidak Aktif",
          education: data.education || "",
          experience: data.experience || "",
          sipStartDate: data.sipStartDate ? data.sipStartDate.split('T')[0] : "",
          sipEndDate: data.sipEndDate ? data.sipEndDate.split('T')[0] : "",
          profilePhoto: data.profilePhoto || ""
        });
        setPreviewPhoto(data.profilePhoto || null);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size <= 2 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onload = () => setPreviewPhoto(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      alert("File terlalu besar! Maksimal 2MB.");
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const updateData = {
        fullName: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
        specialization: profileData.specialization,
        sipNumber: profileData.strNumber,
        education: profileData.education,
        experience: profileData.experience,
        sipStartDate: profileData.sipStartDate,
        sipEndDate: profileData.sipEndDate,
        profilePhoto: previewPhoto || profileData.profilePhoto
      };
      
      const response = await userService.updateProfile(updateData);
      if (response.success) {
        setConfirmSaveOpen(false);
        setSuccessSaveOpen(true);
        await loadProfile();
      } else {
        alert('Gagal menyimpan perubahan');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Terjadi kesalahan saat menyimpan');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      setConfirmDeleteOpen(false);
      
      const response = await userService.deleteAccount();
      
      if (response.success) {
        setSuccessDeleteOpen(true);
        
        setTimeout(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
          window.location.href = '/';
        }, 2000);
      } else {
        alert('Gagal menghapus akun');
        setDeleting(false);
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Terjadi kesalahan saat menghapus akun');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF5F7] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-pink-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF5F7]">
      <DoctorNavbar />
      <div className="pt-6 px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <SettingsSidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />

          <div className="lg:col-span-3">
            <Card className="shadow-lg">
              <CardHeader className="bg-pink-100">
                <h2 className="text-xl font-bold text-pink-900">Informasi Akun</h2>
                <p className="text-sm text-pink-600">Update data dan profil akun Anda</p>
              </CardHeader>

              <CardContent className="p-6">
                <div className="flex items-start gap-6 mb-6 mt-6">
                  <div className="relative">
                    <div className="w-28 h-28 rounded-full overflow-hidden border border-pink-200">
                      {previewPhoto ? (
                        <img src={previewPhoto} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-pink-100">
                          <User className="w-16 h-16 text-pink-400" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-pink-900 mb-1">Foto Profil</h3>
                    <p className="text-sm text-pink-600 mb-2">Format: JPG, PNG. Maksimal 2MB</p>
                    <div className="flex gap-2">
                      <label className="flex items-center gap-1 bg-pink-600 hover:bg-pink-700 text-white px-3 py-1 rounded-md cursor-pointer">
                        <Upload className="w-4 h-4" /> Ubah Foto
                        <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                      </label>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-pink-300 text-pink-700"
                        onClick={() => setPreviewPhoto(null)}
                      >
                        Hapus Foto
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-4">
                  <div>
                    <Label className="text-pink-900 font-semibold mb-1">Nama Lengkap</Label>
                    <Input
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="border-pink-300"
                    />
                  </div>
                  <div>
                    <Label className="text-pink-900 font-semibold mb-1">Email</Label>
                    <Input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className="border-pink-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-4">
                  <div>
                    <Label className="text-pink-900 font-semibold mb-1">Nomor Telepon</Label>
                    <Input
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      className="border-pink-300"
                    />
                  </div>
                  <div>
                    <Label className="text-pink-900 font-semibold mb-1">Jenis Akun</Label>
                    <Input
                      value={profileData.accountType}
                      readOnly
                      className="border-pink-300 bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-4">
                  <div>
                    <Label className="text-pink-900 font-semibold mb-1">Spesialisasi</Label>
                    <Input
                      value={profileData.specialization}
                      onChange={(e) => setProfileData({ ...profileData, specialization: e.target.value })}
                      className="border-pink-300"
                    />
                  </div>
                  <div>
                    <Label className="text-pink-900 font-semibold mb-1">Nomor STR</Label>
                    <Input
                      value={profileData.strNumber}
                      onChange={(e) => setProfileData({ ...profileData, strNumber: e.target.value })}
                      className="border-pink-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-4">
                  <div>
                    <Label className="text-pink-900 font-semibold mb-1">Pendidikan</Label>
                    <Input
                      value={profileData.education}
                      onChange={(e) => setProfileData({ ...profileData, education: e.target.value })}
                      className="border-pink-300"
                    />
                  </div>
                  <div>
                    <Label className="text-pink-900 font-semibold mb-1">Pengalaman</Label>
                    <Input
                      value={profileData.experience}
                      onChange={(e) => setProfileData({ ...profileData, experience: e.target.value })}
                      className="border-pink-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-4">
                  <div>
                    <Label className="text-pink-900 font-semibold mb-1">Tanggal Mulai SIP</Label>
                    <Input
                      type="date"
                      value={profileData.sipStartDate}
                      onChange={(e) => setProfileData({ ...profileData, sipStartDate: e.target.value })}
                      className="border-pink-300"
                    />
                  </div>
                  <div>
                    <Label className="text-pink-900 font-semibold mb-1">Tanggal Berakhir SIP</Label>
                    <Input
                      type="date"
                      value={profileData.sipEndDate}
                      onChange={(e) => setProfileData({ ...profileData, sipEndDate: e.target.value })}
                      className="border-pink-300"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <Label className="text-pink-900 font-semibold mb-1">Status Akun</Label>
                  <Input
                    value={profileData.status}
                    readOnly
                    className="border-pink-300 bg-gray-100 cursor-not-allowed"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-pink-200">
                  <Button
                    variant="outline"
                    className="border-pink-300 text-pink-700 hover:bg-pink-50 px-8"
                    onClick={() => setConfirmDeleteOpen(true)}
                    disabled={deleting}
                  >
                    {deleting ? 'Menghapus...' : 'Hapus Akun'}
                  </Button>
                  <Button
                    className="bg-pink-600 hover:bg-pink-700 text-white px-8"
                    onClick={() => setConfirmSaveOpen(true)}
                    disabled={saving}
                  >
                    {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <p className="text-center text-sm text-pink-600 mt-8">
          © 2025 RosyDental. Platform untuk klinik gigi modern
        </p>
      </div>

      <Dialog open={confirmSaveOpen} onOpenChange={setConfirmSaveOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-pink-900">
              Anda yakin ingin menyimpan perubahan?
            </DialogTitle>
          </DialogHeader>
          <div className="flex gap-3 justify-center pt-4">
            <Button variant="outline" onClick={() => setConfirmSaveOpen(false)} className="px-8 border-pink-300 text-pink-700">
              Batal
            </Button>
            <Button
              className="bg-pink-600 hover:bg-pink-700 text-white px-8"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Menyimpan...' : 'Ya, Simpan'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={successSaveOpen} onOpenChange={setSuccessSaveOpen}>
        <DialogContent className="max-w-md text-center p-6">
          <h3 className="text-xl font-bold text-pink-700 mb-4">Perubahan berhasil disimpan!</h3>
          <Button className="bg-pink-600 hover:bg-pink-700 text-white px-8" onClick={() => setSuccessSaveOpen(false)}>
            Tutup
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-red-900 font-bold text-lg">
              Hapus Akun Permanen?
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-center text-gray-700 mb-2">
              Tindakan ini tidak dapat dibatalkan!
            </p>
            <p className="text-center text-sm text-gray-600">
              Semua data akun Anda akan dihapus secara permanen dari sistem.
            </p>
          </div>
          <div className="flex gap-3 justify-center pt-2">
            <Button 
              variant="outline" 
              onClick={() => setConfirmDeleteOpen(false)} 
              className="px-8 border-gray-300 text-gray-700"
              disabled={deleting}
            >
              Batal
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white px-8"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? 'Menghapus...' : 'Ya, Hapus Akun'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={successDeleteOpen} onOpenChange={() => {}}>
        <DialogContent className="max-w-md text-center p-6">
          <div className="mb-4">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h3 className="text-xl font-bold text-red-700 mb-2">Akun Berhasil Dihapus!</h3>
          <p className="text-sm text-gray-600 mb-4">Anda akan dialihkan ke halaman utama...</p>
        </DialogContent>
      </Dialog>
    </div>
  );
}