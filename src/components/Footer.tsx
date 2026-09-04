import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-[#fcfcfc] py-8 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-[#575757]">
          &copy; {new Date().getFullYear()}
        </p>
        <div className="flex space-x-6 text-xs font-poppins">
          <Link href="/" className="text-[#575757] hover:text-[#026c99] transition-colors">
            Beranda
          </Link>
          <Link href="/projek" className="text-[#575757] hover:text-[#026c99] transition-colors">
            Projek
          </Link>
        </div>
      </div>
    </footer>
  );
}
