"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import ProjekForm, { ProjekData } from "@/components/admin/ProjekForm";

export default function AdminEditProjekPage() {
  const router = useRouter();
  const params = useParams();
  const id = (params?.id as string) || "";

  const [initialData, setInitialData] = useState<ProjekData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchProjekDetail = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/projek?shortcode=${encodeURIComponent(id)}`);
        const result = await res.json();

        if (res.ok && result.data && result.data.length > 0) {
          const item = result.data[0];
          setInitialData({
            judul: item.judul || "",
            deskripsi: item.deskripsi || "",
            link: item.link || "",
            tags: item.tags || [],
          });
        } else {
          setErrorMsg("Data projek tidak ditemukan.");
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Gagal mengambil detail projek";
        setErrorMsg(msg);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjekDetail();
  }, [id]);

  const handleSubmit = async (formData: ProjekData) => {
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch(`/api/projek?shortcode=${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, shortCode: id }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal memperbarui data projek");
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
          Edit Projek
        </h2>
        <p className="text-sm text-[#575757]">
          Perbarui informasi projek di bawah ini.
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl font-poppins max-w-2xl">
          {errorMsg}
        </div>
      )}

      {isLoading ? (
        <div className="p-8 text-center text-gray-400 font-poppins text-sm">
          Memuat data projek...
        </div>
      ) : initialData ? (
        <ProjekForm
          initialData={initialData}
          isEdit={true}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
        />
      ) : null}
    </div>
  );
}
