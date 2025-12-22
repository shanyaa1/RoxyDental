"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { FaLock, FaCheckCircle } from "react-icons/fa";
import { HiEye, HiEyeOff } from "react-icons/hi";
import api from "@/lib/api";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const email = searchParams.get("email");
  const token = searchParams.get("token");

  useEffect(() => {
    if (!email || !token) {
      setError("Link reset password tidak valid");
    }
  }, [email, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password minimal 6 karakter");
      return;
    }

    if (password !== confirmPassword) {
      setError("Password tidak cocok");
      return;
    }

    setLoading(true);

    try {
      await api.post('/auth/reset-password', {
        email,
        token,
        newPassword: password
      });
      setSuccess(true);
      
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal reset password");
    } finally {
      setLoading(false);
    }
  };

  if (!email || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-pink-100 via-pink-200 to-pink-300">
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl max-w-md">
          <h3 className="font-bold text-lg mb-2">Link Tidak Valid</h3>
          <p className="text-sm mb-4">Link reset password tidak valid atau sudah kadaluarsa.</p>
          <button
            onClick={() => router.push("/forgot-password")}
            className="w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Kirim Ulang Link
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-pink-100 via-pink-200 to-pink-300">
        <div className="text-center max-w-md">
          <div className="mx-auto mb-6 w-[110px] h-[110px] flex items-center justify-center rounded-full text-white text-4xl shadow-xl bg-linear-to-br from-green-400 via-green-500 to-green-600 animate-pulse">
            <FaCheckCircle />
          </div>
          <h2 className="text-2xl font-bold text-green-600 mb-2">Password Berhasil Direset</h2>
          <p className="text-green-500 mb-4">Anda akan diarahkan ke halaman login...</p>
          <button
            onClick={() => router.push("/login")}
            className="py-3 px-8 text-white font-bold rounded-xl shadow-lg bg-linear-to-br from-green-400 to-green-600 hover:scale-105 transition-all"
          >
            Login Sekarang
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen text-center overflow-hidden font-poppins bg-linear-to-br from-pink-100 via-pink-200 to-pink-300">

      <div className="absolute -top-20 left-[-100px] w-[260px] h-[260px] bg-pink-200/30 rounded-full blur-[60px] animate-float-slow"></div>
      <div className="absolute bottom-[-120px] right-[-100px] w-[300px] h-[300px] bg-pink-300/30 rounded-full blur-[60px] animate-float-slow delay-2000"></div>

      <div className="w-full max-w-[400px] transition-all duration-700 opacity-100 translate-y-0">
        <div className="mx-auto mb-6 w-[90px] h-[90px] flex items-center justify-center rounded-full shadow-lg animate-pulse drop-shadow-sm overflow-hidden bg-linear-to-br from-pink-400 via-pink-500 to-pink-600">
          <FaLock className="text-white text-3xl" />
        </div>

        <h2 className="text-2xl font-bold text-pink-600 drop-shadow-sm mb-2">Reset Password</h2>
        <p className="text-pink-500 text-sm opacity-80 mb-6">
          Masukkan password baru untuk akun <strong>{email}</strong>
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="text-left bg-white/40 backdrop-blur-md p-6 rounded-2xl shadow-xl space-y-4">
          <div>
            <label className="text-pink-500 text-sm font-medium">Password Baru</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="
                  w-full py-3 px-4 pr-12
                  rounded-xl
                  outline-none
                  bg-white
                  border border-slate-300
                  text-slate-800
                  placeholder:text-slate-400
                  focus:border-slate-400
                  focus:ring-2
                  focus:ring-slate-200
                  transition-all
                "
                placeholder="Min. 6 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-pink-400 hover:text-pink-600"
              >
                {showPassword ? <HiEyeOff size={22} /> : <HiEye size={22} />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-pink-500 text-sm font-medium">Konfirmasi Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="
                  w-full py-3 px-4 pr-12
                  rounded-xl
                  outline-none
                  bg-white
                  border border-slate-300
                  text-slate-800
                  placeholder:text-slate-400
                  focus:border-slate-400
                  focus:ring-2
                  focus:ring-slate-200
                  transition-all
                "
                placeholder="Ulangi password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-pink-400 hover:text-pink-600"
              >
                {showConfirmPassword ? <HiEyeOff size={22} /> : <HiEye size={22} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-white font-bold rounded-xl shadow-lg bg-linear-to-br from-pink-400 via-pink-500 to-pink-600 hover:from-pink-500 hover:to-pink-400 hover:scale-105 transition-all duration-300 drop-shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Memproses..." : "Reset Password"}
          </button>
        </form>

        <button
          onClick={() => router.push("/login")}
          className="mt-5 text-pink-600 font-semibold text-sm hover:underline drop-shadow-sm"
        >
          Kembali ke Login
        </button>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}