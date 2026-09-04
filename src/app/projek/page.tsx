import Link from "next/link";

export default function ProjekPage() {
  const projects = [
    {
      id: 1,
      title: "Sistem Manajemen Konten (CMS)",
      category: "Web Application",
      description:
        "Platform CMS headless responsif dengan fitur autentikasi pengguna, manajemen konten artikel, media uploader, dan dashboard analitik interaktif.",
      tags: ["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL"],
      demoUrl: "#",
      githubUrl: "#",
    },
    {
      id: 2,
      title: "Aplikasi E-Commerce Minimalis",
      category: "Full Stack",
      description:
        "Toko online modern dengan sistem keranjang belanja interaktif, filter produk instan, pencarian, dan integrasi payment gateway.",
      tags: ["React", "Node.js", "Express", "Tailwind CSS"],
      demoUrl: "#",
      githubUrl: "#",
    },
    {
      id: 3,
      title: "Dashboard Tracking Task & Project",
      category: "Productivity Tool",
      description:
        "Aplikasi produktivitas berbasis Kanban board untuk kolaborasi tim kecil dalam melacak progres tugas harian dan manajemen deadline.",
      tags: ["Next.js", "Tailwind CSS", "Zustand"],
      demoUrl: "#",
      githubUrl: "#",
    },
    {
      id: 4,
      title: "Portal Berita & Artikel Tekno",
      category: "Frontend Design",
      description:
        "Desain antarmuka portal berita dengan pembacaan cepat, fitur dark mode (Opsional), dan tata letak responsif yang nyaman dibaca.",
      tags: ["Next.js", "Tailwind CSS"],
      demoUrl: "#",
      githubUrl: "#",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-12">
      {/* Header Section */}
      <div className="space-y-4 text-center md:text-left">
        <h1 className="font-poppins font-bold text-3xl sm:text-4xl text-[#202224]">
          Daftar <span className="text-[#026c99]">Projek</span>
        </h1>
        <p className="text-base text-[#575757] max-w-2xl font-inter">
          Kumpulan hasil karya, eksplorasi teknologi, dan aplikasi yang telah saya kembangkan.
        </p>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((project) => (
          <div
            key={project.id}
            className="group rounded-3xl bg-white border border-gray-100 p-6 md:p-8 hover:border-[#026c99]/30 transition-all hover:shadow-lg flex flex-col justify-between h-full"
          >
            {/* Card Content */}
            <div className="space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <h2 className="font-poppins font-bold text-xl text-[#202224] group-hover:text-[#026c99] transition-colors">
                  {project.title}
                </h2>
                <p className="text-sm text-[#575757] leading-relaxed">
                  {project.description}
                </p>
              </div>

              <div className="space-y-4 pt-4 border-t border-gray-100 mt-auto">
                {/* Tech Tags */}
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2.5 py-1 rounded-md bg-gray-50 text-[#575757] border border-gray-100 font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="pt-1">
                  <a
                    href={project.demoUrl}
                    className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-[#026c99] hover:bg-[#02577c] text-white font-poppins font-medium text-xs transition-all shadow-2xs"
                  >
                    Lihat
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
