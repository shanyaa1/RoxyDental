"use client"; // HARUS di paling atas

import React, { useState } from "react";
import Logo from "@/components/logo";
import { FaUser, FaClipboardList, FaCalendarAlt, FaChartLine, FaLock, FaClock } from "react-icons/fa";

export default function LandingPagePro() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    { icon: <FaUser className="w-12 h-12 sm:w-14 sm:h-14 text-pink-500" />, title: "Manajemen Pasien", desc: "Akses dan kelola data pasien lengkap dengan riwayat kunjungan." },
    { icon: <FaClipboardList className="w-12 h-12 sm:w-14 sm:h-14 text-pink-500" />, title: "Rekam Medis Elektronik", desc: "Catat dan akses rekam medis dengan cepat dan aman." },
    { icon: <FaCalendarAlt className="w-12 h-12 sm:w-14 sm:h-14 text-pink-500" />, title: "Jadwal Tenaga Medis", desc: "Atur jadwal dokter dan perawat secara terintegrasi." },
    { icon: <FaChartLine className="w-12 h-12 sm:w-14 sm:h-14 text-pink-500" />, title: "Laporan Keuangan", desc: "Pantau transaksi, komisi, dan laporan secara otomatis." },
    { icon: <FaLock className="w-12 h-12 sm:w-14 sm:h-14 text-pink-500" />, title: "Keamanan Terjamin", desc: "Akses hanya untuk pegawai dengan login aman dan hak akses bertingkat." },
    { icon: <FaClock className="w-12 h-12 sm:w-14 sm:h-14 text-pink-500" />, title: "Monitoring Real-time", desc: "Pantau semua aktivitas klinik dan antrian pasien secara live." },
  ];

  const benefits = [
    { value: "100%", label: "Digital" },
    { value: "24/7", label: "Akses Data" },
    { value: "99%", label: "Keamanan & Uptime" }
  ];

  return (
    <div className="flex flex-col min-h-screen font-sans bg-gradient-to-b from-pink-50 to-white">
      
      {/* Navbar */}
      <nav className="w-full bg-white/95 backdrop-blur-md shadow-md z-50 sticky top-0">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            <Logo />
            <div className="hidden md:flex space-x-10 font-medium text-gray-700">
              {["Beranda", "Fitur", "Kontak"].map((item, idx) => (
                <a key={idx} href={`#${item.toLowerCase()}`} className="hover:text-pink-600 transition-colors">{item}</a>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <button className="hidden md:block bg-gradient-to-r from-pink-500 to-pink-600 text-white px-6 py-3 rounded-full hover:shadow-xl transition-all font-semibold text-sm md:text-base">
                Login 
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-pink-50 transition-colors"
              >
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-pink-100">
              <div className="flex flex-col space-y-3">
                {["Beranda", "Fitur", "Keunggulan", "Kontak"].map((item, idx) => (
                  <a
                    key={idx}
                    href={`#${item.toLowerCase()}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-gray-700 hover:text-pink-600 transition-colors font-medium py-2 px-4 rounded-lg hover:bg-pink-50"
                  >
                    {item}
                  </a>
                ))}
                <button className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-6 py-3 rounded-full hover:shadow-lg font-semibold mt-2">
                  Login 
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow">

        {/* Hero */}
        <section id="home" className="pt-28 md:pt-32 pb-20 px-6 lg:px-8">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-center md:text-left">
              <div className="inline-block px-4 py-2 bg-pink-100 text-pink-600 rounded-full text-sm font-semibold mb-4">
                PoloClinic Hub
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Aplikasi Klinik <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-pink-600">Polo</span><br /> Efisien & Profesional
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-xl">
                Digitalisasi penuh untuk semua pegawai Klinik Polo. Mudah, aman, dan terorganisir.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mt-6 items-start">
                <button className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-8 py-4 rounded-full hover:shadow-2xl transition-all duration-300 font-semibold text-base md:text-lg transform hover:scale-105">
                  Login 
                </button>
                <span className="text-xs sm:text-sm text-gray-500 mt-2 md:mt-0">Hanya untuk pegawai Klinik Polo.</span>
              </div>
            </div>
            <div className="relative max-w-md mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-pink-600 rounded-3xl transform rotate-6 opacity-20"></div>
              <div className="relative bg-gradient-to-br from-pink-100 to-pink-200 rounded-3xl p-8 flex items-center justify-center shadow-lg">
                <svg className="w-full h-full" viewBox="0 0 200 200" fill="none">
                  <rect x="40" y="40" width="120" height="90" rx="8" fill="white" opacity="0.9"/>
                  <circle cx="100" cy="85" r="15" fill="url(#grad)"/>
                  <defs>
                    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: "#f9a8d4" }} />
                      <stop offset="100%" style={{ stopColor: "#db2777" }} />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-16 md:py-24 px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">Fitur Unggulan</h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">Solusi digital untuk kelola klinik lebih efisien dan profesional.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {features.map((f, i) => (
              <div key={i} className="bg-gradient-to-br from-pink-50 to-white p-8 rounded-2xl hover:shadow-xl transition-all duration-300 border border-pink-100 hover:border-pink-300 transform hover:-translate-y-2 text-left">
                <div className="mb-4">{f.icon}</div>
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm sm:text-base text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-16 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <Logo />
            <p className="mt-4 text-gray-400 text-sm sm:text-base leading-relaxed">
              PoloClinic Hub, aplikasi manajemen klinik khusus pegawai. Efisien, aman, dan modern.
            </p>
          </div>
          <div>
            <h4 className="text-lg sm:text-xl font-semibold mb-4">Fitur Cepat</h4>
            <ul className="space-y-2 text-gray-400 text-sm sm:text-base">
              <li className="hover:text-pink-400 transition-colors cursor-pointer">Manajemen Pasien</li>
              <li className="hover:text-pink-400 transition-colors cursor-pointer">Rekam Medis</li>
              <li className="hover:text-pink-400 transition-colors cursor-pointer">Jadwal Tenaga Medis</li>
              <li className="hover:text-pink-400 transition-colors cursor-pointer">Laporan Keuangan</li>
              <li className="hover:text-pink-400 transition-colors cursor-pointer">Monitoring Real-time</li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg sm:text-xl font-semibold mb-4">Kontak</h4>
            <ul className="space-y-2 text-gray-400 text-sm sm:text-base">
              <li>📍 Jl. Klinik No.12, Jakarta</li>
              <li>📞 (021) 1234-5678</li>
              <li>✉️ info@poloclinic.com</li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg sm:text-xl font-semibold mb-4">Newsletter</h4>
            <p className="text-gray-400 text-sm sm:text-base mb-4">Dapatkan info terbaru seputar PoloClinic Hub.</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input type="email" placeholder="Email Anda" className="px-4 py-2 sm:px-5 sm:py-3 rounded-full w-full text-gray-900 focus:outline-none"/>
              <button className="bg-pink-500 hover:bg-pink-600 px-6 py-2 sm:px-8 sm:py-3 rounded-full text-white font-semibold transition-all">Subscribe</button>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-12 pt-6 text-center text-gray-400 text-sm sm:text-base">
          &copy; 2025 PoloClinic Hub. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
