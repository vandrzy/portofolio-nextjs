import Link from "next/link";

export default function Home() {
  const skills = [
    "Next.js",
    "React",
    "TypeScript",
    "Tailwind CSS",
    "Node.js",
    "PostgreSQL",
    "REST API",
    "Git",
  ];

  const featuredProjects = [
    {
      title: "Sistem Manajemen Konten (CMS)",
      description: "Platform CMS headless responsif dengan fitur autentikasi, manajemen artikel, dan dashboard analitik.",
      tags: ["Next.js", "TypeScript", "Tailwind CSS"],
    },
    {
      title: "Aplikasi E-Commerce Minimalis",
      description: "Toko online modern dengan sistem keranjang belanja interaktif dan integrasi payment gateway.",
      tags: ["React", "Node.js", "PostgreSQL"],
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 space-y-20">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="flex-1 space-y-6 text-center md:text-left">
          <div className="inline-block px-3.5 py-1 rounded-full bg-[#026c99]/10 text-[#026c99] text-xs font-semibold font-poppins">
            👋 Halo, Selamat Datang!
          </div>
          <h1 className="font-poppins font-bold text-4xl sm:text-5xl lg:text-6xl text-[#202224] leading-tight">
            Developing <span className="text-[#026c99]">Modern & Clean</span> Web Applications
          </h1>
          <p className="text-lg text-[#575757] max-w-xl font-inter leading-relaxed">
            Saya seorang Full-Stack Developer yang fokus menciptakan pengalaman web yang cepat, responsif, dan berestetika tinggi.
          </p>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
            <Link
              href="/projek"
              className="px-6 py-3 rounded-xl bg-[#026c99] hover:bg-[#02577c] text-white font-poppins font-semibold text-sm transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              Lihat Projek Saya →
            </Link>
          </div>
        </div>

        {/* Hero Avatar / Graphic Accent */}
        <div className="w-full max-w-sm md:w-80 h-80 rounded-3xl bg-gradient-to-tr from-[#026c99]/20 via-[#026c99]/5 to-transparent border border-[#026c99]/10 p-4 flex items-center justify-center relative">
          <div className="w-full h-full rounded-2xl bg-white shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
            <div className="w-12 h-12 rounded-xl bg-[#026c99] text-white flex items-center justify-center font-bold text-xl font-poppins">
              &lt;/&gt;
            </div>
            <div className="space-y-2">
              <div className="h-2.5 w-24 bg-[#026c99]/20 rounded-full" />
              <div className="h-2 w-full bg-gray-100 rounded-full" />
              <div className="h-2 w-4/5 bg-gray-100 rounded-full" />
            </div>
            <div className="pt-4 border-t border-gray-50 flex items-center justify-between text-xs text-[#575757]">
              <span>Status</span>
              <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Tersedia untuk Projek
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="space-y-6">
        <div className="text-center md:text-left">
          <h2 className="font-poppins font-bold text-2xl text-[#202224]">
            Keahlian & Teknologi
          </h2>
          <p className="text-sm text-[#575757]">
            Teknologi yang biasa saya gunakan dalam membangun aplikasi web.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {skills.map((skill) => (
            <span
              key={skill}
              className="px-4 py-2 rounded-xl bg-white border border-gray-100 text-[#202224] text-sm font-poppins font-medium shadow-xs hover:border-[#026c99]/30 transition-colors"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>

      {/* Featured Projects Preview Section */}
      <section className="space-y-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-poppins font-bold text-2xl text-[#202224]">
              Projek Unggulan
            </h2>
            <p className="text-sm text-[#575757]">
              Cuplikan dari beberapa karya yang telah dikerjakan.
            </p>
          </div>
          <Link
            href="/projek"
            className="text-sm font-poppins font-semibold text-[#026c99] hover:underline"
          >
            Lihat Semua →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredProjects.map((project, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white border border-gray-100 hover:border-[#026c99]/30 transition-all hover:shadow-md space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <h3 className="font-poppins font-semibold text-lg text-[#202224]">
                  {project.title}
                </h3>
                <p className="text-sm text-[#575757] leading-relaxed">
                  {project.description}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2.5 py-1 rounded-md bg-gray-100 text-[#575757] font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
