"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import TeknologiForm from "@/components/admin/TeknologiForm";

export default function TambahTeknologiPage() {
  const router = useRouter();

  const handleSubmit = (nama: string) => {
    // UI Mock Handler - ready for API integration (e.g. POST /api/teknologi)
    console.log("Menambahkan teknologi baru:", { nama });
    alert(`Teknologi "${nama}" berhasil disimpan!`);
    router.push("/admin/teknologi");
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

      {/* Form Card Container */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-xs">
        <TeknologiForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
