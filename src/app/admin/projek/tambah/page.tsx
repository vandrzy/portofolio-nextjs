"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ProjekForm, { ProjekData } from "@/components/admin/ProjekForm";

export default function AdminTambahProjekPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (formData: ProjekData) => {
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/projek", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal menyimpan data projek");
      }

      router.push("/admin/projek");
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
          href="/admin/projek"
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
          <span>Kembali ke Manajemen Projek</span>
        </Link>
        <h2 className="font-poppins font-bold text-2xl text-[#202224]">
          Tambah Projek Baru
        </h2>
        <p className="text-sm text-[#575757]">
          Isi form di bawah ini untuk menambahkan projek baru ke portofolio.
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl font-poppins max-w-2xl">
          {errorMsg}
        </div>
      )}

      {/* Form Component */}
      <ProjekForm isSubmitting={isSubmitting} onSubmit={handleSubmit} />
    </div>
  );
}
