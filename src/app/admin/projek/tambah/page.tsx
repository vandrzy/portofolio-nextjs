"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import ProjekForm, { ProjekData } from "@/components/admin/ProjekForm";

export default function AdminTambahProjekPage() {
  const router = useRouter();

  const handleSubmit = (data: ProjekData) => {
    // UI Mock Handler - ready for API integration
    console.log("Tambah Projek Data:", data);
    alert(`Projek "${data.judul}" berhasil disimpan!`);
    router.push("/admin/projek");
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

      {/* Form Component */}
      <ProjekForm onSubmit={handleSubmit} />
    </div>
  );
}
