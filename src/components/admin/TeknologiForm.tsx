"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface TeknologiFormProps {
  initialNama?: string;
  isEdit?: boolean;
  onSubmit: (nama: string) => void;
}

export default function TeknologiForm({
  initialNama = "",
  isEdit = false,
  onSubmit,
}: TeknologiFormProps) {
  const [nama, setNama] = useState(initialNama);

  useEffect(() => {
    setNama(initialNama);
  }, [initialNama]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim()) return;
    onSubmit(nama);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label
            htmlFor="nama"
            className="block text-xs font-semibold font-poppins text-[#202224]"
          >
            Nama Teknologi <span className="text-red-500">*</span>
          </label>
          <span className="text-[11px] text-gray-400 font-inter">
            {nama.length}/20 karakter
          </span>
        </div>
        <input
          id="nama"
          type="text"
          required
          maxLength={20}
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          placeholder="Masukkan nama teknologi"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#026c99] text-sm text-[#202224] placeholder-gray-400 transition-colors bg-white"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 pt-2">

        <Link
          href="/admin/teknologi"
          className="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-[#575757] font-poppins font-medium text-sm transition-all"
        >
          Batal
        </Link>
        <button
          type="submit"
          className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[#026c99] hover:bg-[#02577c] text-white font-poppins font-medium text-sm transition-all shadow-2xs cursor-pointer"
        >
          {isEdit ? "Simpan Perubahan" : "Simpan"}
        </button>
      </div>
    </form>
  );
}
