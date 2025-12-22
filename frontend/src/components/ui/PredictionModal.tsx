"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, TrendingUp, Users, X, AlertTriangle } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { aiService, PredictionData } from "@/services/ai.service";

interface Props {
  onClose: () => void;
}

export default function PredictionModal({ onClose }: Props) {
  const [data, setData] = useState<PredictionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPrediction();
  }, []);

  const fetchPrediction = async () => {
    try {
      const response = await aiService.getPrediction();
      
      if (response.status === "success" || response.status === "warning") {
        setData(response.data);
        if (response.data.length === 0 && response.message) {
          setError(response.message);
        }
      } else {
        setError(response.message || "Gagal memuat prediksi");
      }
    } catch (err: any) {
      console.error('Prediction fetch error:', err);
      setError(
        err.response?.data?.message || 
        err.message || 
        "Tidak dapat terhubung ke layanan prediksi"
      );
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);

  if (loading) {
    return (
      <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div className="bg-white px-8 py-6 rounded-2xl shadow-2xl flex items-center gap-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-600"></div>
          <span className="text-gray-700">Memuat prediksi...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
        <Card className="w-full max-w-md rounded-2xl shadow-2xl">
          <CardHeader className="bg-red-500 text-white">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Prediksi Tidak Tersedia
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-900 font-semibold text-sm mb-2">
                Langkah Troubleshooting:
              </p>
              <ol className="text-blue-800 text-xs space-y-1 list-decimal list-inside">
                <li>Pastikan AI Service berjalan di terminal terpisah</li>
                <li>Jalankan: <code className="bg-blue-100 px-1 rounded">cd roxydental-ai && uvicorn api:app --reload</code></li>
                <li>Pastikan minimal 5 minggu data transaksi tersedia</li>
                <li>Cek koneksi database di file .env</li>
              </ol>
            </div>

            <Button 
              onClick={onClose} 
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              Tutup
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
        <Card className="w-full max-w-md rounded-2xl shadow-2xl">
          <CardHeader className="bg-yellow-500 text-white">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Data Belum Tersedia
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <p className="text-gray-700">
              Data transaksi belum mencukupi untuk membuat prediksi. 
              Minimal 5 minggu data historis diperlukan.
            </p>
            <Button onClick={onClose} className="w-full bg-yellow-600 hover:bg-yellow-700 text-white">
              Tutup
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalRevenue = data.reduce((a, c) => a + c.revenue, 0);
  const avgRevenue = totalRevenue / data.length;
  const totalPatients = data.reduce((a, c) => a + c.patients, 0);

  return (
    <div className="fixed inset-0 z-9999 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl relative pointer-events-auto rounded-2xl shadow-2xl">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-200 z-10 bg-black/20 rounded-full p-1 backdrop-blur-sm"
        >
          <X className="w-5 h-5" />
        </button>

        <CardHeader className="bg-linear-to-r from-pink-500 to-rose-500 text-white rounded-t-2xl">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Prediksi Kinerja Klinik
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(d) =>
                    new Date(d).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "short",
                    })
                  }
                />
                <YAxis
                  yAxisId="left"
                  tickFormatter={(v) => `Rp ${v / 1_000_000}jt`}
                />
                <YAxis yAxisId="right" orientation="right" />

                <Tooltip
                  formatter={(value, name) => {
                    const safeValue = typeof value === "number" ? value : 0;
                    return [
                      name === "Revenue (Rp)"
                        ? formatCurrency(safeValue)
                        : safeValue,
                      name === "Revenue (Rp)" ? "Pendapatan" : "Pasien",
                    ];
                  }}
                />

                <Legend />

                <Line
                  yAxisId="left"
                  dataKey="revenue"
                  stroke="#E91E63"
                  strokeWidth={3}
                  name="Revenue (Rp)"
                />
                <Line
                  yAxisId="right"
                  dataKey="patients"
                  stroke="#10B981"
                  strokeWidth={3}
                  name="Jumlah Pasien"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-50 p-4 rounded-lg border">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-purple-700" />
                <p className="font-semibold text-purple-900">
                  Estimasi Pendapatan
                </p>
              </div>
              <p className="text-lg font-bold text-purple-700">
                {formatCurrency(totalRevenue)}
              </p>
              <p className="text-xs text-gray-500">
                Rata-rata {formatCurrency(avgRevenue)} / minggu
              </p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-4 h-4 text-green-700" />
                <p className="font-semibold text-green-900">
                  Estimasi Pasien
                </p>
              </div>
              <p className="text-lg font-bold text-green-700">
                {Math.round(totalPatients)} orang
              </p>
              <p className="text-xs text-gray-500">
                ~{Math.round(totalPatients / data.length)} pasien / minggu
              </p>
            </div>
          </div>

          <Button
            onClick={onClose}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white"
          >
            Tutup
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}