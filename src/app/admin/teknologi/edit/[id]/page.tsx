"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import TeknologiForm from "@/components/admin/TeknologiForm";

export default function EditTeknologiPage() {
  const router = useRouter();
  const params = useParams();
  const id = (params?.id as string) || "";

  const [initialNama, setInitialNama] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchTeknologiDetail = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/teknologi?shortcode=${encodeURIComponent(id)}`);
        const data = await res.json();

        if (res.ok && data.data && data.data.length > 0) {
          setInitialNama(data.data[0].nama);
        } else {
          setErrorMsg("Data teknologi tidak ditemukan.");
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Gagal mengambil detail teknologi";
        setErrorMsg(msg);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeknologiDetail();
  }, [id]);

  const handleSubmit = async (nama: string) => {
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch(`/api/teknologi?shortcode=${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nama, shortCode: id }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal memperbarui data teknologi");
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
          Edit Teknologi
        </h2>
        <p className="text-sm text-[#575757]">
          Ubah informasi nama teknologi di bawah ini.
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl font-poppins">
          {errorMsg}
        </div>
      )}

      {/* Form Card Container */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-xs">
        {isLoading ? (
          <div className="py-8 text-center text-gray-400 text-sm font-poppins">
            Memuat data teknologi...
          </div>
        ) : (
          <TeknologiForm
            initialNama={initialNama}
            isEdit={true}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
}
