"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface ProcedureData {
  name: string;
  code: string;
  quantity: number;
  salePrice: number;
  modalPrice: number;
  avgComm: string; // tetap string
}

interface Props {
  onClose: () => void;
  handleSave: (data: ProcedureData) => void;
}

export default function AddProcedure({ onClose, handleSave }: Props) {
  const [form, setForm] = useState<ProcedureData>({
    name: "",
    code: "",
    quantity: 0,
    salePrice: 0,
    modalPrice: 0,
    avgComm: "0", // default string
  });

  const update = (key: keyof ProcedureData, value: string | number) =>
    setForm({ ...form, [key]: value });

  // perhitungan dengan konversi string ke number untuk avgComm
  const totalPenjualan = form.quantity * form.salePrice;
  const totalModal = form.quantity * form.modalPrice;
  const totalKomisi = Math.round((totalPenjualan * Number(form.avgComm)) / 100);
  const totalBayar = totalPenjualan - totalKomisi;

  const handleSubmit = () => {
    if (!form.name.trim()) {
      alert("Nama prosedur harus diisi!");
      return;
    }
    handleSave(form);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto rounded-xl shadow-lg h-[85vh] overflow-y-auto">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-1 text-gray-800">
          Tambah Prosedur
        </h2>
        <p className="text-gray-500 mb-5 text-sm">
          Masukkan detail prosedur sesuai kebutuhan.
        </p>

        {/* Nama Prosedur */}
        <label className="block mb-4 text-sm">
          <span className="font-medium text-gray-700">Nama Prosedur *</span>
          <input
            className="w-full mt-1 p-2 border rounded-lg bg-gray-50"
            placeholder="Contoh: Rontgen Cephalometric - Solo"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
          />
        </label>

        {/* Kode */}
        <label className="block mb-4 text-sm">
          <span className="font-medium text-gray-700">Kode *</span>
          <input
            className="w-full mt-1 p-2 border rounded-lg bg-gray-50"
            placeholder="Contoh: AE001"
            value={form.code}
            onChange={(e) => update("code", e.target.value)}
          />
        </label>

        {/* GRID INPUT */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <label>
            <span className="font-medium text-gray-700">Kuantitas</span>
            <input
              type="number"
              min="0"
              className="w-full mt-1 p-2 border rounded-lg bg-gray-50"
              value={form.quantity}
              onChange={(e) => update("quantity", Number(e.target.value))}
            />
          </label>

          <label>
            <span className="font-medium text-gray-700">Harga Jual (AVG)</span>
            <input
              type="number"
              min="0"
              className="w-full mt-1 p-2 border rounded-lg bg-gray-50"
              value={form.salePrice}
              onChange={(e) => update("salePrice", Number(e.target.value))}
            />
          </label>

          <label>
            <span className="font-medium text-gray-700">Harga Modal (AVG)</span>
            <input
              type="number"
              min="0"
              className="w-full mt-1 p-2 border rounded-lg bg-gray-50"
              value={form.modalPrice}
              onChange={(e) => update("modalPrice", Number(e.target.value))}
            />
          </label>

          <label>
            <span className="font-medium text-gray-700">Komisi (AVG) %</span>
            <input
              type="number"
              min="0"
              max="100"
              className="w-full mt-1 p-2 border rounded-lg bg-gray-50"
              value={form.avgComm}
              onChange={(e) => update("avgComm", e.target.value)} // tetap string
            />
          </label>
        </div>

        {/* Info Box */}
        <div className="p-4 bg-pink-50 border border-pink-200 rounded-lg text-sm mb-5">
          <p className="font-semibold text-pink-900 mb-2">Preview Perhitungan</p>
          <p className="text-pink-700">
            Total Penjualan: <b>Rp {totalPenjualan.toLocaleString("id-ID")}</b>
          </p>
          <p className="text-pink-700">
            Total Modal: <b>Rp {totalModal.toLocaleString("id-ID")}</b>
          </p>
          <p className="text-pink-700">
            Total Komisi: <b>Rp {totalKomisi.toLocaleString("id-ID")}</b>
          </p>
          <p className="text-pink-700">
            Total Bayar: <b>Rp {totalBayar.toLocaleString("id-ID")}</b>
          </p>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-2">
          <button
            className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-100 text-sm"
            onClick={onClose}
          >
            Batal
          </button>

          <button
            className="px-4 py-2 rounded-lg bg-pink-600 text-white hover:bg-pink-700 text-sm"
            onClick={handleSubmit}
          >
            Simpan
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
