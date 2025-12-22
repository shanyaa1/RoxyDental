"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DoctorNavbar from "@/components/ui/navbardr";
import { userService } from "@/services/user.service";
import { dashboardService } from "@/services/dashboard.service";
import {
  CreditCard,
  Briefcase,
  Clock,
  Phone,
  Mail,
  MapPin,
  Calendar,
  BadgeCheck,
  User
} from "lucide-react";

interface ProfileData {
  id: string;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  specialization?: string;
  education?: string;
  experience?: string;
  sipNumber?: string;
  sipStartDate?: string;
  sipEndDate?: string;
  profilePhoto?: string;
  isActive: boolean;
  createdAt: string;
}

interface ScheduleItem {
  day: string;
  start: string;
  end: string;
  location: string;
}

export default function MedicalStaffProfile() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [profileResponse, dashboardResponse] = await Promise.all([
        userService.getProfile(),
        dashboardService.getDoctorSummary()
      ]);

      if (profileResponse.success) {
        setProfileData(profileResponse.data);
      }

      if (dashboardResponse.success && dashboardResponse.data.schedules) {
        setSchedules(dashboardResponse.data.schedules);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#FFE6EE] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-pink-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  const formatDate = (date: string | null | undefined) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const calculateSipRemaining = () => {
    if (!profileData?.sipStartDate || !profileData?.sipEndDate) return null;

    const today = new Date();
    const end = new Date(profileData.sipEndDate);
    const start = new Date(profileData.sipStartDate);

    const totalDays = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const remainingDays = Math.floor((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (totalDays <= 0 || remainingDays < 0) {
      return {
        percentage: 0,
        years: 0,
        months: 0
      };
    }

    const percentage = (remainingDays / totalDays) * 100;
    const years = Math.floor(remainingDays / 365);
    const months = Math.floor((remainingDays % 365) / 30);

    return {
      percentage: Math.max(0, Math.min(100, percentage)),
      years,
      months
    };
  };

  const hasActiveSchedule = schedules.some(s => s.start !== '-' && s.end !== '-');
  const sipRemaining = calculateSipRemaining();
  
  let practiceStatus: 'ACTIVE' | 'INACTIVE' | 'EXPIRED' = 'INACTIVE';
  if (profileData?.sipNumber && profileData?.sipEndDate) {
    const endDate = new Date(profileData.sipEndDate);
    const today = new Date();
    
    if (endDate > today && hasActiveSchedule) {
      practiceStatus = 'ACTIVE';
    } else if (endDate <= today) {
      practiceStatus = 'EXPIRED';
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#FFE6EE]">
      <DoctorNavbar />

      <div className="px-10 py-10 w-full">
        <h1 className="text-3xl font-bold text-[#D6336C] mb-1">Profil Tenaga Medis</h1>
        <p className="text-[#E85A88] mb-6">
          Informasi Akun & Status Praktik Anda di Klinik Sehat
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="rounded-2xl overflow-hidden shadow-lg border-0 bg-white">
            <div className="bg-[#FF8FB3] px-6 py-5">
              <h2 className="text-white text-xl font-bold">INFORMASI PROFIL</h2>
            </div>

            <CardContent className="p-6">
              <div className="flex items-start gap-6 mb-8 mt-4">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl">
                    {profileData?.profilePhoto ? (
                      <img
                        src={profileData.profilePhoto}
                        alt={profileData.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <User className="w-16 h-16 text-gray-400" />
                      </div>
                    )}
                  </div>

                  <span className="absolute bottom-1 right-1 w-7 h-7 bg-green-500 rounded-full border-4 border-white flex items-center justify-center shadow-md">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                </div>

                <div className="flex-1 mt-2">
                  <h3 className="text-2xl font-bold text-[#C2185B] mb-1">
                    {profileData?.fullName || 'Nama Dokter'}
                  </h3>
                  <p className="text-[#EB5A88] mb-4">{profileData?.specialization || 'Dokter Gigi'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoItem label="ID Karyawan" value={profileData?.username || '-'} icon="id" />
                <InfoItem label="No. STR" value={profileData?.sipNumber || '-'} icon="badge" />
                <InfoItem label="No. SIP" value={profileData?.sipNumber || '-'} icon="badge" />
                <InfoItem label="Nomor Telepon" value={profileData?.phone || '-'} icon="phone" />
                <InfoItem label="Email" value={profileData?.email || '-'} icon="mail" />
                <InfoItem label="Lokasi Praktik" value="RoxyDental - Jakarta Pusat" icon="map" />
                <InfoItem 
                  label="Bergabung Sejak" 
                  value={formatDate(profileData?.createdAt)} 
                  icon="calendar" 
                />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl overflow-hidden shadow-lg border-0 bg-white">
            <div className="bg-[#F2C94C] px-6 py-5">
              <h2 className="text-yellow-900 text-xl font-bold">JADWAL & LISENSI</h2>
            </div>

            <CardContent className="p-6">
              <div className="bg-white rounded-xl p-4 mb-6 shadow-sm border border-t-0 border-yellow-100 mt-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-yellow-900 font-semibold">Status Praktik</span>
                  <div className={`flex items-center gap-2 px-4 py-1 rounded-full text-sm font-bold ${
                    practiceStatus === 'ACTIVE' 
                      ? 'bg-green-500 text-white' 
                      : practiceStatus === 'EXPIRED'
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-400 text-white'
                  }`}>
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    {practiceStatus === 'ACTIVE' ? 'AKTIF' : practiceStatus === 'EXPIRED' ? 'KADALUARSA' : 'TIDAK AKTIF'}
                  </div>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <p className="text-sm text-yellow-800 font-medium">
                    {practiceStatus === 'ACTIVE' 
                      ? 'Sedang Bertugas' 
                      : practiceStatus === 'EXPIRED'
                      ? 'SIP telah kadaluarsa, segera perbarui'
                      : 'Tidak Ada Jadwal Praktik'}
                  </p>
                </div>
              </div>

              {profileData?.sipStartDate && profileData?.sipEndDate && (
                <>
                  <div className="bg-white rounded-xl p-4 mb-6 shadow-sm border border-yellow-100">
                    <div className="flex items-start gap-3">
                      <Briefcase className="w-5 h-5 text-yellow-600 mt-1" />
                      <div className="flex-1">
                        <p className="text-yellow-900 font-semibold mb-1">Masa Berlaku SIP</p>
                        <p className="text-lg font-bold text-yellow-600">
                          {formatDate(profileData.sipStartDate)} - {formatDate(profileData.sipEndDate)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {sipRemaining && (
                    <div className="bg-white rounded-xl p-4 mb-6 shadow-sm border border-yellow-100">
                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-yellow-600 mt-1" />
                        <div className="flex-1">
                          <p className="text-yellow-900 font-semibold mb-2">Sisa Masa Berlaku</p>

                          <div className="bg-yellow-100 rounded-full h-3 overflow-hidden mb-2">
                            <div
                              className="bg-linear-to-r from-yellow-400 to-yellow-500 h-full rounded-full transition-all duration-500"
                              style={{ width: `${sipRemaining.percentage}%` }}
                            />
                          </div>

                          <p className="text-right text-yellow-900 font-bold">
                            {sipRemaining.years} tahun {sipRemaining.months} bulan
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {schedules.length > 0 && (
                <div className="bg-white rounded-xl p-4 mb-6 shadow-sm border border-yellow-100">
                  <p className="text-yellow-900 font-semibold mb-3">Jadwal Praktik Minggu Ini:</p>
                  <div className="space-y-2">
                    {schedules.map((schedule, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="font-medium text-yellow-900">{schedule.day}:</span>
                        <span className="text-yellow-700">{schedule.start} - {schedule.end}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button 
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2"
                onClick={() => window.location.href = '/dashboard/dokter/kalender'}
              >
                Lihat Jadwal Lengkap
              </Button>
            </CardContent>
          </Card>
        </div>

        <p className="text-center text-sm text-[#EB5A88] mt-8">
          © 2025 RoxyDental. Platform untuk klinik gigi modern
        </p>
      </div>
    </div>
  );
}

function InfoItem({ label, value, icon }: { label: string; value: string; icon: string }) {
  const iconMap: Record<string, React.ReactNode> = {
    id: <CreditCard className="w-5 h-5 text-pink-600" />,
    badge: <BadgeCheck className="w-5 h-5 text-pink-600" />,
    phone: <Phone className="w-5 h-5 text-pink-600" />,
    mail: <Mail className="w-5 h-5 text-pink-600" />,
    map: <MapPin className="w-5 h-5 text-pink-600" />,
    calendar: <Calendar className="w-5 h-5 text-pink-600" />,
  };

  return (
    <div className="flex items-center justify-between bg-pink-50 rounded-xl p-4 shadow-sm hover:shadow-md transition">
      <div>
        <p className="text-pink-400 text-xs font-semibold tracking-wide">{label}</p>
        <p className="text-[#C2185B] font-bold text-base mt-1">{value}</p>
      </div>

      <div className="w-10 h-10 rounded-full bg-pink-200 flex items-center justify-center shadow-lg">
        {iconMap[icon]}
      </div>
    </div>
  );
}