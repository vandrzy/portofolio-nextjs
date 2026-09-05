"use client";

import { useState } from "react";
import Link from "next/link";
import Pagination from "@/components/admin/Pagination";

interface Project {
  id: string;
  judul: string;
  updatedAt: string;
}

// Initial Mock Data
const INITIAL_PROJECTS: Project[] = [
  { id: "1", judul: "Sistem Manajemen Konten (CMS)", updatedAt: "2026-09-03" },
  { id: "2", judul: "Aplikasi E-Commerce Minimalis", updatedAt: "2026-08-30" },
  { id: "3", judul: "Dashboard Tracking Task & Project", updatedAt: "2026-08-22" },
  { id: "4", judul: "Portal Berita & Artikel Tekno", updatedAt: "2026-08-18" },
  { id: "5", judul: "API Payment Gateway Integrator", updatedAt: "2026-08-12" },
  { id: "6", judul: "Mobile Fitness Tracking App", updatedAt: "2026-08-08" },
  { id: "7", judul: "Landing Page Event Conference", updatedAt: "2026-08-02" },
];

export default function AdminProjekPage() {
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter data based on search term (search by judul)
  const filteredData = projects.filter((item) =>
    item.judul.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // reset to page 1 on search
  };

  const handleDelete = (id: string, judul: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus projek "${judul}"?`)) {
      setProjects((prev) => prev.filter((item) => item.id !== id));
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
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#026c99] hover:bg-[#02577c] text-white font-poppins font-medium text-sm transition-all shadow-2xs cursor-pointer shrink-0"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>Tambah Projek</span>
        </Link>
      </div>

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
              {paginatedData.length > 0 ? (
                paginatedData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4 font-semibold text-[#202224] whitespace-nowrap">
                      {item.judul}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-xs text-gray-500">
                      {item.updatedAt}
                    </td>
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        {/* Edit Button */}
                        <Link
                          href={`/admin/projek/edit/${item.id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-medium text-[#202224] hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer"
                        >
                          <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          <span>Edit</span>
                        </Link>
                        {/* Hapus Button */}
                        <button
                          onClick={() => handleDelete(item.id, item.judul)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 border border-red-100 text-xs font-medium text-red-600 hover:bg-red-100 transition-all cursor-pointer"
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
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredData.length}
          itemsPerPage={itemsPerPage}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
}
