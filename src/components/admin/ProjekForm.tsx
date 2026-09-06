"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export interface ProjekData {
  judul: string;
  deskripsi: string;
  link: string;
  tags: string[];
}

interface ProjekFormProps {
  initialData?: ProjekData;
  isEdit?: boolean;
  isSubmitting?: boolean;
  onSubmit: (data: ProjekData) => void;
}

export default function ProjekForm({
  initialData,
  isEdit = false,
  isSubmitting = false,
  onSubmit,
}: ProjekFormProps) {
  const [judul, setJudul] = useState(initialData?.judul || "");
  const [deskripsi, setDeskripsi] = useState(initialData?.deskripsi || "");
  const [link, setLink] = useState(initialData?.link || "");
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (initialData) {
      setJudul(initialData.judul || "");
      setDeskripsi(initialData.deskripsi || "");
      setLink(initialData.link || "");
      setTags(initialData.tags || []);
    }
  }, [initialData]);

  const handleAddTag = (e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e) e.preventDefault();
    if (tags.length >= 5) return;
    const trimmedTag = tagInput.trim();
    if (!trimmedTag) return;
    if (!tags.some((t) => t.toLowerCase() === trimmedTag.toLowerCase())) {
      setTags([...tags, trimmedTag]);
    }
    setTagInput("");
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (indexToRemove: number) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!judul.trim() || !deskripsi.trim() || isSubmitting) return;
    onSubmit({
      judul: judul.trim(),
      deskripsi: deskripsi.trim(),
      link: link.trim(),
      tags,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-xs">
      {/* Form Judul */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label
            htmlFor="judul"
            className="block text-xs font-semibold font-poppins text-[#202224]"
          >
            Judul Projek <span className="text-red-500">*</span>
          </label>
          <span className="text-[11px] text-gray-400 font-inter">
            {judul.length}/35 karakter
          </span>
        </div>
        <input
          id="judul"
          type="text"
          required
          maxLength={35}
          value={judul}
          onChange={(e) => setJudul(e.target.value)}
          placeholder="Masukkan judul projek (maks. 35 karakter)"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#026c99] text-sm text-[#202224] placeholder-gray-400 transition-colors bg-white"
        />
      </div>

      {/* Form Deskripsi */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label
            htmlFor="deskripsi"
            className="block text-xs font-semibold font-poppins text-[#202224]"
          >
            Deskripsi Projek <span className="text-red-500">*</span>
          </label>
          <span className="text-[11px] text-gray-400 font-inter">
            {deskripsi.length}/130 karakter
          </span>
        </div>
        <textarea
          id="deskripsi"
          required
          maxLength={130}
          rows={4}
          value={deskripsi}
          onChange={(e) => setDeskripsi(e.target.value)}
          placeholder="Masukkan deskripsi projek singkat (maks. 130 karakter)"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#026c99] text-sm text-[#202224] placeholder-gray-400 transition-colors bg-white resize-none"
        />
      </div>

      {/* Form Link (CTA "Lihat") */}
      <div className="space-y-2">
        <label
          htmlFor="link"
          className="block text-xs font-semibold font-poppins text-[#202224]"
        >
          Link Projek (Tombol CTA "Lihat")
        </label>
        <input
          id="link"
          type="url"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="https://example.com/demo"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#026c99] text-sm text-[#202224] placeholder-gray-400 transition-colors bg-white"
        />
      </div>

      {/* Form Tag (Sistem Input Dinamis) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label
            htmlFor="tagInput"
            className="block text-xs font-semibold font-poppins text-[#202224]"
          >
            Tag Projek
          </label>
          <span className="text-[11px] text-gray-400 font-inter">
            {tags.length}/5 tag
          </span>
        </div>
        <div className="flex items-center gap-2">
          <input
            id="tagInput"
            type="text"
            disabled={tags.length >= 5 || isSubmitting}
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            placeholder={
              tags.length >= 5
                ? "Maksimal 5 tag telah tercapai"
                : "Ketik nama tag (misal: Next.js, Tailwind)..."
            }
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#026c99] text-sm text-[#202224] placeholder-gray-400 transition-colors bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <button
            type="button"
            onClick={handleAddTag}
            disabled={tags.length >= 5 || !tagInput.trim() || isSubmitting}
            className="px-5 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#202224] font-poppins font-medium text-sm transition-all cursor-pointer shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Tambah
          </button>
        </div>

        {/* Dynamic Tag Pills Container */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#026c99]/10 text-[#026c99] font-medium text-xs border border-[#026c99]/20"
              >
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTag(index)}
                  disabled={isSubmitting}
                  className="hover:bg-[#026c99]/20 p-0.5 rounded-full text-[#026c99] transition-colors cursor-pointer disabled:opacity-50"
                  title="Hapus tag"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
        <Link
          href="/admin/projek"
          className="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-[#575757] font-poppins font-medium text-sm transition-all"
        >
          Batal
        </Link>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[#026c99] hover:bg-[#02577c] text-white font-poppins font-medium text-sm transition-all shadow-2xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting
            ? "Menyimpan..."
            : isEdit
            ? "Simpan Perubahan"
            : "Simpan"}
        </button>
      </div>
    </form>
  );
}

