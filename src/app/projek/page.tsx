import { getProjekSheet } from "@/lib/google-sheets";

export const revalidate = 60;

interface ProjectItem {
  id: string;
  shortCode: string;
  judul: string;
  deskripsi: string;
  link: string;
  tags: string[];
}

const FALLBACK_PROJECTS: ProjectItem[] = [
  {
    id: "1",
    shortCode: "cms",
    judul: "Sistem Manajemen Konten (CMS)",
    deskripsi:
      "Platform CMS headless responsif dengan fitur autentikasi pengguna, manajemen konten artikel, media uploader, dan dashboard analitik interaktif.",
    link: "#",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL"],
  },
  {
    id: "2",
    shortCode: "ecommerce",
    judul: "Aplikasi E-Commerce Minimalis",
    deskripsi:
      "Toko online modern dengan sistem keranjang belanja interaktif, filter produk instan, pencarian, dan integrasi payment gateway.",
    link: "#",
    tags: ["React", "Node.js", "Express", "Tailwind CSS"],
  },
  {
    id: "3",
    shortCode: "task-tracking",
    judul: "Dashboard Tracking Task & Project",
    deskripsi:
      "Aplikasi produktivitas berbasis Kanban board untuk kolaborasi tim kecil dalam melacak progres tugas harian dan manajemen deadline.",
    link: "#",
    tags: ["Next.js", "Tailwind CSS", "Zustand"],
  },
  {
    id: "4",
    shortCode: "portal-berita",
    judul: "Portal Berita & Artikel Tekno",
    deskripsi:
      "Desain antarmuka portal berita dengan pembacaan cepat, fitur dark mode, dan tata letak responsif yang nyaman dibaca.",
    link: "#",
    tags: ["Next.js", "Tailwind CSS"],
  },
];

async function getProjekList(): Promise<ProjectItem[]> {
  try {
    const sheet = await getProjekSheet();
    const rows = await sheet.getRows();

    const projects: { item: ProjectItem; time: number }[] = rows.map((row) => {
      const rawTags = row.get("tags");
      let parsedTags: string[] = [];
      if (rawTags) {
        try {
          const parsed = JSON.parse(rawTags);
          if (Array.isArray(parsed)) parsedTags = parsed.map(String);
        } catch {
          parsedTags = String(rawTags).split(",").map((t) => t.trim()).filter(Boolean);
        }
      }

      const tanggalUpdate = row.get("tanggal update") || "";
      const time = Date.parse(tanggalUpdate) || 0;

      return {
        item: {
          id: row.get("id") || "",
          shortCode: row.get("shortCode") || "",
          judul: row.get("judul") || "",
          deskripsi: row.get("deskripsi") || "",
          link: row.get("link") || "#",
          tags: parsedTags,
        },
        time,
      };
    });

    projects.reverse();
    projects.sort((a, b) => b.time - a.time);

    const sortedList = projects.map((p) => p.item);
    return sortedList.length > 0 ? sortedList : FALLBACK_PROJECTS;
  } catch (error) {
    console.error("Gagal mengambil data projek dari Google Sheets:", error);
    return FALLBACK_PROJECTS;
  }
}

export default async function ProjekPage() {
  const projects = await getProjekList();

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        {projects.map((project) => (
          <div
            key={project.id || project.shortCode}
            className="group rounded-3xl bg-white border border-gray-100 p-6 md:p-8 hover:border-[#026c99]/30 transition-all hover:shadow-lg flex flex-col justify-between h-full"
          >
            {/* Top Content */}
            <div className="space-y-3">
              <h2 className="font-poppins font-bold text-xl text-[#202224] group-hover:text-[#026c99] transition-colors">
                {project.judul}
              </h2>
              <p className="text-sm text-[#575757] leading-relaxed">
                {project.deskripsi}
              </p>
            </div>

            {/* Bottom Content (Tech Tags + CTA) */}
            <div className="space-y-4 pt-4 border-t border-gray-100 mt-6">
              {/* Tech Tags */}
              {project.tags && project.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2.5 py-1 rounded-md bg-gray-50 text-[#575757] border border-gray-100 font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="pt-1">
                <a
                  href={project.link || "#"}
                  target={project.link && project.link.startsWith("http") ? "_blank" : "_self"}
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-[#026c99] hover:bg-[#02577c] text-white font-poppins font-medium text-xs transition-all shadow-2xs"
                >
                  Lihat
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
