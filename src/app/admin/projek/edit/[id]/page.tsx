"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ProjekForm, { ProjekData } from "@/components/admin/ProjekForm";

interface EditProjekPageProps {
  params: Promise<{
    id: string;
  }>;
}

// Initial Mock Dataset matching project list
const MOCK_PROJECT_DETAILS: Record<string, ProjekData> = {
  "1": {
    judul: "Sistem Manajemen Konten (CMS)",
    deskripsi: "Platform CMS internal untuk kelola artikel, halaman, dan repositori asset digital.",
    link: "https://example.com/cms-demo",
    tags: ["Next.js", "TypeScript", "Tailwind CSS"],
  },
  "2": {
    judul: "Aplikasi E-Commerce Minimalis",
    deskripsi: "Aplikasi toko online modern dengan sistem keranjang belanja dan checkout cepat.",
    link: "https://example.com/ecommerce",
    tags: ["React", "Tailwind", "Node.js"],
  },
};

export default function AdminEditProjekPage({ params }: EditProjekPageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [initialData, setInitialData] = useState<ProjekData | null>(null);

  useEffect(() => {
    const id = resolvedParams.id;
    if (MOCK_PROJECT_DETAILS[id]) {
      setInitialData(MOCK_PROJECT_DETAILS[id]);
    } else {
      // Fallback mock data if ID is not in predefined detail dictionary
      setInitialData({
        judul: `Projek contoh #${id}`,
        deskripsi: `Deskripsi rinci mengenai karya projek ke-${id}.`,
        link: `https://example.com/projek-${id}`,
        tags: ["React", "Web App"],
      });
    }
  }, [resolvedParams.id]);

  const handleSubmit = (data: ProjekData) => {
    // UI Mock Handler - ready for API integration
    console.log(`Update Projek ID ${resolvedParams.id}:`, data);
    alert(`Perubahan pada projek "${data.judul}" berhasil disimpan!`);
    router.push("/admin/projek");
  };

  if (!initialData) {
    return (
      <div className="p-8 text-center text-gray-400 font-poppins text-sm">
        Memuat data projek...
      </div>
    );
  }

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
          Edit Projek
        </h2>
        <p className="text-sm text-[#575757]">
          Perbarui informasi projek di bawah ini.
        </p>
      </div>

      {/* Form Component */}
      <ProjekForm
        initialData={initialData}
        isEdit={true}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
