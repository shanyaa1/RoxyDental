"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface FinanceData {
  tipe: string;
  nama: string;
  prosedur: string;
  potongan: number;
  bhpHarga: number;
  bhpKomisi: number;
  farmasiHarga: number;
  farmasiKomisi: number;
  paketHarga: number;
  paketKomisi: number;
  labHarga: number;
  labKomisi: number;
}

interface Props {
  onClose: () => void;
  handleSave: (data: FinanceData) => void;
}

export default function AddFinanceData({ onClose, handleSave }: Props) {
  const [form, setForm] = useState<FinanceData>({
    tipe: "Komisi Tenaga Medis",
    nama: "",
    prosedur: "",
    potongan: 0,
    bhpHarga: 0,
    bhpKomisi: 0,
    farmasiHarga: 0,
    farmasiKomisi: 0,
    paketHarga: 0,
    paketKomisi: 0,
    labHarga: 0,
    labKomisi: 0,
  });

  const update = (key: keyof FinanceData, value: string | number) =>
    setForm({ ...form, [key]: value });

  return (
    <Card className="w-full max-w-3xl mx-auto rounded-xl shadow-lg p-6 h-[85vh] overflow-y-auto">
      <CardContent>
        <h2 className="text-xl font-semibold mb-2 text-gray-800">Tambah Data Keuangan</h2>
        <p className="text-gray-600 mb-6 text-sm">Tambahkan data keuangan baru ke dalam sistem</p>

        {/* Tipe */}
        <div className="block mb-4 text-sm">
          <span className="font-medium text-gray-700">Tipe Data Keuangan *</span>
          <div className="w-full mt-1 p-2 border rounded-lg bg-gray-100 text-gray-700">
            {form.tipe}
          </div>
        </div>

        {/* Nama Tenaga Medis */}
        <label className="block mb-4 text-sm">
          <span className="font-medium text-gray-700">Nama Tenaga Medis *</span>
          <input
            className="w-full mt-1 p-2 border rounded-lg bg-gray-50"
            placeholder="Contoh: drg. Azril"
            value={form.nama}
            onChange={(e) => update("nama", e.target.value)}
          />
        </label>

        {/* Prosedur */}
        <label className="block mb-4 text-sm">
          <span className="font-medium text-gray-700">Prosedur</span>
          <input
            className="w-full mt-1 p-2 border rounded-lg bg-gray-50"
            placeholder="Contoh: Scaling Gigi"
            value={form.prosedur}
            onChange={(e) => update("prosedur", e.target.value)}
          />
        </label>

        {/* GRID INPUT */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <label>
            <span className="font-medium">Potongan Awal</span>
            <input
              type="number"
              className="w-full mt-1 p-2 border rounded-lg bg-gray-50"
              value={form.potongan}
              onChange={(e) => update("potongan", Number(e.target.value))}
            />
          </label>

          <label>
            <span className="font-medium">Harga Modal (BHP)</span>
            <input
              type="number"
              className="w-full mt-1 p-2 border rounded-lg bg-gray-50"
              value={form.bhpHarga}
              onChange={(e) => update("bhpHarga", Number(e.target.value))}
            />
          </label>

          <label>
            <span className="font-medium">Komisi (BHP) %</span>
            <input
              type="number"
              className="w-full mt-1 p-2 border rounded-lg bg-gray-50"
              value={form.bhpKomisi}
              onChange={(e) => update("bhpKomisi", Number(e.target.value))}
            />
          </label>

          <label>
            <span className="font-medium">Harga Modal (Farmasi)</span>
            <input
              type="number"
              className="w-full mt-1 p-2 border rounded-lg bg-gray-50"
              value={form.farmasiHarga}
              onChange={(e) => update("farmasiHarga", Number(e.target.value))}
            />
          </label>

          <label>
            <span className="font-medium">Komisi (Farmasi) %</span>
            <input
              type="number"
              className="w-full mt-1 p-2 border rounded-lg bg-gray-50"
              value={form.farmasiKomisi}
              onChange={(e) => update("farmasiKomisi", Number(e.target.value))}
            />
          </label>

          <label>
            <span className="font-medium">Paket</span>
            <input
              type="number"
              className="w-full mt-1 p-2 border rounded-lg bg-gray-50"
              value={form.paketHarga}
              onChange={(e) => update("paketHarga", Number(e.target.value))}
            />
          </label>

          <label>
            <span className="font-medium">Komisi (Paket) %</span>
            <input
              type="number"
              className="w-full mt-1 p-2 border rounded-lg bg-gray-50"
              value={form.paketKomisi}
              onChange={(e) => update("paketKomisi", Number(e.target.value))}
            />
          </label>

          <label>
            <span className="font-medium">LAB</span>
            <input
              type="number"
              className="w-full mt-1 p-2 border rounded-lg bg-gray-50"
              value={form.labHarga}
              onChange={(e) => update("labHarga", Number(e.target.value))}
            />
          </label>

          <label>
            <span className="font-medium">Komisi (LAB) %</span>
            <input
              type="number"
              className="w-full mt-1 p-2 border rounded-lg bg-gray-50"
              value={form.labKomisi}
              onChange={(e) => update("labKomisi", Number(e.target.value))}
            />
          </label>
        </div>

        {/* BUTTONS */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-100 text-sm"
            onClick={onClose}
          >
            Batal
          </button>

          <button
            className="px-4 py-2 rounded-lg bg-pink-600 text-white hover:bg-pink-700 text-sm"
            onClick={() => handleSave(form)}
          >
            Simpan
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
