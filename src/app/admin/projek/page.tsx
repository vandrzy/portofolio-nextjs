"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Pagination from "@/components/admin/Pagination";
import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal";

interface Project {
  id: string;
  shortCode: string;
  judul: string;
  deskripsi: string;
  link: string;
  tags: string[];
  tanggalUpdate: string;
}

export default function AdminProjekPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const itemsPerPage = 5;

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
      });
      if (searchTerm.trim()) {
        queryParams.set("judul", searchTerm.trim());
      }

      const res = await fetch(`/api/projek?${queryParams.toString()}`);
      const result = await res.json();

      if (res.ok && result.success) {
        setProjects(result.data || []);
        setTotalPages(result.totalPages || 1);
        setTotalItems(result.total || 0);
      } else {
        throw new Error(result.message || "Gagal mengambil data projek");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan saat memuat data";
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchTerm, itemsPerPage]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleOpenDeleteModal = (item: Project) => {
    setDeleteTarget(item);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      const identifier = deleteTarget.shortCode || deleteTarget.id;
      const res = await fetch(`/api/projek?shortcode=${encodeURIComponent(identifier)}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Gagal menghapus projek");
      }

      setDeleteTarget(null);
      fetchProjects();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan";
      alert(`Gagal menghapus: ${msg}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Description */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-poppins font-bold text-xl text-[#202224]">
            Manajemen Projek
          </h2>
          <p className="text-sm text-[#575757]">
            Kelola daftar projek dan portofolio karya yang ditampilkan.
          </p>
        </div>

        {/* Button Tambah */}
        <Link
          href="/admin/projek/tambah"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#026c99] hover:bg-[#02577c] text-white font-poppins font-medium text-sm transition-all shadow-2xs shrink-0"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>Tambah Projek</span>
        </Link>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl font-poppins">
          {errorMsg}
        </div>
      )}

      {/* Card Wrapper */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 shadow-xs space-y-4">
        {/* Search Bar */}
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Cari berdasarkan judul..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#026c99] text-sm text-[#202224] placeholder-gray-400 transition-colors"
          />
        </div>

        {/* Table Container with Horizontal Scroll for Mobile */}
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-left text-sm text-[#575757]">
            <thead className="bg-gray-50/80 font-poppins text-xs uppercase font-semibold text-[#202224] border-b border-gray-100">
              <tr>
                <th scope="col" className="px-5 py-3.5">
                  Judul
                </th>
                <th scope="col" className="px-5 py-3.5">
                  Tanggal Update
                </th>
                <th scope="col" className="px-5 py-3.5 text-right">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-inter">
              {isLoading ? (
                <tr>
                  <td colSpan={3} className="px-5 py-8 text-center text-gray-400 font-poppins text-sm">
                    Memuat data projek...
                  </td>
                </tr>
              ) : projects.length > 0 ? (
                projects.map((item) => (
                  <tr key={item.id || item.shortCode} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4 font-semibold text-[#202224] whitespace-nowrap">
                      {item.judul}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-xs text-gray-500">
                      {formatDate(item.tanggalUpdate)}
                    </td>
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        {/* Edit Button */}
                        <Link
                          href={`/admin/projek/edit/${item.shortCode || item.id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-medium text-[#202224] hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer"
                        >
                          <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          <span>Edit</span>
                        </Link>
                        {/* Hapus Button */}
                        <button
                          onClick={() => handleOpenDeleteModal(item)}
                          disabled={isDeleting}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 border border-red-100 text-xs font-medium text-red-600 hover:bg-red-100 transition-all cursor-pointer disabled:opacity-50"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          <span>Hapus</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-5 py-8 text-center text-gray-400 font-poppins text-sm">
                    Tidak ada data projek ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Component */}
        {!isLoading && totalItems > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={(page) => setCurrentPage(page)}
          />
        )}
      </div>

      {/* Modal Konfirmasi Hapus */}
      <DeleteConfirmModal
        isOpen={Boolean(deleteTarget)}
        itemName={deleteTarget?.judul}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
