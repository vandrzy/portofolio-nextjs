import Link from "next/link";
import Image from "next/image";
import { getTeknologiSheet } from "@/lib/google-sheets";

export const revalidate = 60;

async function getTeknologiList(): Promise<string[]> {
  const fallbackSkills = [
    "Next.js",
    "React",
    "TypeScript",
    "Tailwind CSS",
    "Node.js",
    "PostgreSQL",
    "REST API",
    "Git",
  ];

  try {
    const sheet = await getTeknologiSheet();
    const rows = await sheet.getRows();
    const items = rows
      .slice()
      .reverse()
      .map((row) => row.get("nama") as string)
      .filter(Boolean);
    return items.length > 0 ? items : fallbackSkills;
  } catch (error) {
    console.error("Gagal mengambil data teknologi untuk beranda:", error);
    return fallbackSkills;
  }
}

export default async function Home() {
  const skills = await getTeknologiList();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 space-y-16">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="flex-1 space-y-6 text-center md:text-left">
          <div className="space-y-2">
            <span className="font-poppins font-bold text-3xl sm:text-4xl text-[#202224] block">
              Hi,
            </span>
            <h1 className="font-poppins font-bold text-5xl sm:text-6xl lg:text-7xl text-[#202224] leading-tight">
              Saya <span className="text-[#026c99]">Vandy Rizky Septiawan</span>
            </h1>
          </div>
          <p className="text-lg text-[#575757] max-w-xl font-inter leading-relaxed">
            Junior Full-Stack Developer & UI/UX Enthusiast. Suka membangun aplikasi web modern, mengeksplorasi teknologi baru,
          </p>
          <div className="pt-2">
            <Link
              href="/projek"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#026c99] hover:bg-[#02577c] text-white font-poppins font-semibold text-sm transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              Lihat Projek Saya
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </Link>
          </div>
        </div>

        {/* Hero Image Section */}
        <div className="w-full max-w-sm md:w-80 h-80 rounded-3xl bg-gradient-to-tr from-[#026c99]/20 via-[#026c99]/5 to-transparent border border-[#026c99]/10 p-4 flex items-center justify-center relative">
          <div className="w-full h-full rounded-2xl overflow-hidden shadow-sm border border-gray-100 relative">
            <Image
              src="/images/hero-profile.png"
              alt="Foto Profil Vandy Rizky Septiawan"
              fill
              sizes="(max-width: 768px) 100vw, 320px"
              className="object-cover object-center"
              priority
            />
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="space-y-6 pt-6 border-t border-gray-100">
        <div className="text-center md:text-left">
          <h2 className="font-poppins font-bold text-2xl text-[#202224]">
            Keahlian &amp; Teknologi
          </h2>
          <p className="text-sm text-[#575757]">
            Teknologi yang biasa saya gunakan.
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
    </div>
  );
}
