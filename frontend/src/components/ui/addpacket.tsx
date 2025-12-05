"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface PacketData {
  name: string;
  sku: string;
  quantity: number;
  salePrice: number;
  avgComm: string;
}

interface Props {
  onClose: () => void;
  handleSave: (data: PacketData) => void;
}

export default function AddPacket({ onClose, handleSave }: Props) {
  const [form, setForm] = useState<PacketData>({
    name: "",
    sku: "",
    quantity: 1,
    salePrice: 0,
    avgComm: "0.00",
  });

  const update = (key: keyof PacketData, value: string | number) =>
    setForm({ ...form, [key]: value });

  const totalPenjualan = form.quantity * form.salePrice;
  const totalKomisi = Math.round(
    (totalPenjualan * parseFloat(form.avgComm || "0")) / 100
  );

  const handleSubmit = () => {
    if (!form.name.trim()) {
      alert("Nama paket harus diisi!");
      return;
    }
    handleSave(form);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto rounded-xl shadow-lg p-6 h-[85vh] overflow-y-auto">
      <CardContent>
        <h2 className="text-xl font-semibold mb-2 text-gray-800">
          Tambah Data Keuangan
        </h2>
        <p className="text-gray-600 mb-6 text-sm">
          Tambahkan data keuangan baru ke dalam sistem
        </p>

        {/* Tipe Data Keuangan - fiksi */}
        <label className="block mb-4 text-sm">
          <span className="font-medium text-gray-700">Tipe Data Keuangan *</span>
          <input
            type="text"
            value="Komisi Paket"
            disabled
            className="w-full mt-1 p-2 border rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
          />
        </label>

        {/* Nama Paket */}
        <label className="block mb-4 text-sm">
          <span className="font-medium text-gray-700">Nama Paket *</span>
          <input
            className="w-full mt-1 p-2 border rounded-lg bg-gray-50"
            placeholder="Contoh: Paket Basic Dental Care"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
          />
        </label>

        {/* SKU */}
        <label className="block mb-4 text-sm">
          <span className="font-medium text-gray-700">SKU *</span>
          <input
            className="w-full mt-1 p-2 border rounded-lg bg-gray-50"
            placeholder="Contoh: PKT001"
            value={form.sku}
            onChange={(e) => update("sku", e.target.value)}
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

          <label className="col-span-2">
            <span className="font-medium text-gray-700">Komisi (AVG) %</span>
            <input
              type="number"
              step="0.01"
              min="0"
              max="100"
              className="w-full mt-1 p-2 border rounded-lg bg-gray-50"
              value={form.avgComm}
              onChange={(e) => update("avgComm", e.target.value)}
            />
          </label>
        </div>

        {/* Info Box */}
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-sm">
          <p className="font-semibold text-green-900 mb-2">Preview Perhitungan:</p>
          <p className="text-green-700">
            Total Penjualan: Rp {totalPenjualan.toLocaleString("id-ID")}
          </p>
          <p className="text-green-700">
            Total Komisi: Rp {totalKomisi.toLocaleString("id-ID")}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
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
