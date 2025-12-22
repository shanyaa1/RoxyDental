"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Activity, Sparkles } from "lucide-react";

interface Props {
  onClose: () => void;
}

export default function PredictionModal({ onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl border-none rounded-2xl overflow-hidden">

        {/* HEADER */}
        <CardHeader className="bg-linear-to-r from-pink-500 to-rose-500 text-white">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="w-5 h-5" />
            Prediksi AI
          </CardTitle>
        </CardHeader>

        {/* CONTENT (SCROLLABLE) */}
        <CardContent className="bg-white p-6 max-h-[70vh] overflow-y-auto space-y-6">

          {/* ===== Prediksi Kunjungan ===== */}
          <section className="bg-green-50 border border-green-200 rounded-xl p-4 mt-5">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-green-900">
                Prediksi Kunjungan Pasien
              </h3>
            </div>

            <div className="flex justify-between text-sm text-gray-700 mb-2">
              <span>Minggu Depan</span>
              <span className="font-semibold">~15 pasien</span>
            </div>

            {/* Progress */}
            <div className="w-full bg-green-200 rounded-full h-3">
              <div
                className="bg-green-600 h-3 rounded-full transition-all"
                style={{ width: "75%" }}
              />
            </div>

            <p className="text-xs text-green-700 mt-2">
              Prediksi menunjukkan peningkatan <b>15%</b> dibanding bulan lalu
            </p>
          </section>

          {/* BUTTON */}
          <Button
            onClick={onClose}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white rounded-lg"
          >
            Tutup
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
