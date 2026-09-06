"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import TeknologiForm from "@/components/admin/TeknologiForm";

export default function TambahTeknologiPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (nama: string) => {
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/teknologi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nama }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal menyimpan data teknologi");
      }

      router.push("/admin/teknologi");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan";
      setErrorMsg(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Back Link */}
      <div className="space-y-2">
        <Link
          href="/admin/teknologi"
          className="inline-flex items-center gap-1.5 text-xs text-[#575757] hover:text-[#026c99] transition-colors font-medium"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span>Kembali ke Manajemen Teknologi</span>
        </Link>
        <h2 className="font-poppins font-bold text-2xl text-[#202224]">
          Tambah Teknologi Baru
        </h2>
        <p className="text-sm text-[#575757]">
          Isi form di bawah ini untuk menambahkan keahlian atau teknologi baru.
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl font-poppins">
          {errorMsg}
        </div>
      )}

      {/* Form Card Container */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-xs">
        <TeknologiForm isSubmitting={isSubmitting} onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
