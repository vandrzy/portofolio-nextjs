"use client";

import { useRouter } from "next/navigation";
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
      {/* Header */}
      <div>
        <h2 className="font-poppins font-bold text-xl text-[#202224]">
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
