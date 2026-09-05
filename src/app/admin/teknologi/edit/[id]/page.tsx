"use client";

import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import TeknologiForm from "@/components/admin/TeknologiForm";

// Initial Mock Data to simulate fetching by id/code
const MOCK_TECHNOLOGIES: Record<string, string> = {
  "1": "Next.js",
  "2": "React.js",
  "3": "TypeScript",
  "4": "Tailwind CSS",
  "5": "Node.js",
  "6": "PostgreSQL",
  "7": "Docker",
  "8": "GraphQL",
};

export default function EditTeknologiPage() {
  const router = useRouter();
  const params = useParams();
  const id = (params?.id as string) || "";

  // Get initial technology name (fallback or mock fetch)
  const initialNama = MOCK_TECHNOLOGIES[id] || `Teknologi ${id}`;

  const handleSubmit = (nama: string) => {
    // UI Mock Handler - ready for API integration (e.g. PUT/PATCH /api/teknologi/:id)
    console.log(`Memperbarui teknologi (ID/Code: ${id}):`, { nama });
    alert(`Teknologi "${nama}" (ID: ${id}) berhasil diperbarui!`);
    router.push("/admin/teknologi");
  };

  return (
    <div className="space-y-6">
      {/* Header & Back Link */}
      <div className="space-y-2">

        <h2 className="font-poppins font-bold text-2xl text-[#202224]">
          Edit Teknologi
        </h2>
        <p className="text-sm text-[#575757]">
          Ubah informasi nama teknologi di bawah ini.
        </p>
      </div>

      {/* Form Card Container */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-xs">
        <TeknologiForm
          initialNama={initialNama}
          isEdit={true}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
