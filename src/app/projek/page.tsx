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
            className="group rounded-3xl bg-white border border-gray-100 overflow-hidden hover:border-[#026c99]/30 transition-all hover:shadow-lg flex flex-col justify-between"
          >
            {/* Card Preview Banner / Accent */}
            <div className="h-44 bg-gradient-to-br from-[#026c99]/15 via-[#026c99]/5 to-gray-50 border-b border-gray-100 p-6 flex flex-col justify-between group-hover:from-[#026c99]/20 transition-colors">
              <div className="flex justify-between items-start">
                <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-xs text-[#026c99] text-xs font-semibold font-poppins shadow-2xs">
                  {project.category}
                </span>
              </div>
              <div className="text-[#026c99] font-poppins font-bold text-2xl tracking-wide opacity-80 group-hover:opacity-100 transition-opacity">
                {project.title.split(" ")[0]} App
              </div>
            </div>

            {/* Card Content */}
            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <h2 className="font-poppins font-bold text-xl text-[#202224] group-hover:text-[#026c99] transition-colors">
                  {project.title}
                </h2>
                <p className="text-sm text-[#575757] leading-relaxed">
                  {project.description}
                </p>
              </div>

              <div className="space-y-4 pt-4 border-t border-gray-100">
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
                <div className="flex items-center space-x-4 pt-2">
                  <a
                    href={project.demoUrl}
                    className="px-4 py-2 rounded-lg bg-[#026c99] hover:bg-[#02577c] text-white font-poppins font-medium text-xs transition-all shadow-2xs"
                  >
                    Demo Langsung
                  </a>
                  <a
                    href={project.githubUrl}
                    className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-[#202224] font-poppins font-medium text-xs transition-all"
                  >
                    Source Code
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
