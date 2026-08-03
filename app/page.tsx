import Link from "next/link";
import Image from "next/image";
import { LanguageSelector } from "./components/LanguageProvider";
export default function Home() {
    const tools = [
    {
      title: "📄 Resume Builder",
      description: "Create professional resumes and download them instantly in PDF format.",
      link: "/resume-builder",
    },
    {
      title: "✍️ Letter Writer",
      description: "Create ready-to-use letters for jobs, schools, banks and more.",
      link: "/letter-writer",
    },
    {
      title: "📑 PDF Tools",
      description: "Merge, compress and organize PDF documents with ease.",
      link: "/pdf-tools",
    },
    {
      title: "👤 Biodata Maker",
      description: "Create personal and marriage biodata instantly.",
      link: "/biodata-maker",
    },
    {
      title: "🔳 QR Generator",
      description: "Generate QR codes for links and contact details.",
      link: "/qr-generator",
    },
    {
      title: "📘 Cover Page Generator",
      description: "Create professional cover pages for assignments, projects and reports.",
      link: "/cover-page-generator",
    },
    ];

  return (
    <main className="min-h-screen bg-white">

      {/* Navbar */}
      <nav className="flex items-center px-8 py-3 border-b border-gray-200 bg-white">

      <div className="flex items-center gap-1">
        <Image src="/docsprinthub-logo.png" alt="DocSprintHub logo" width={38} height={38} className="h-9 w-9 rounded-lg" priority />
        <h1 className="text-4xl font-bold tracking-tight">
         DocSprint<span className="text-blue-600">Hub</span>
        </h1>
      </div>
      
      <div className="hidden md:flex gap-7 text-lg font-semibold text-gray-700 ml-16">
      <a href="#" className="font-bold text-gray-900 border-b-2 border-blue-600 pb-1">  Home    </a>
      <Link href="/resume-builder" className="hover:text-blue-600 transition">
      Resume Builder
      </Link>
      <a href="#" className="hover:text-blue-600 transition">Letter Writer</a>
      <Link href="/pdf-tools" className="hover:text-blue-600 transition">PDF Tools</Link>
      <a href="#" className="hover:text-blue-600 transition">Contact</a>
      </div>

      <button className="ml-auto bg-blue-600 text-white font-semibold px-7 py-3 rounded-xl shadow-md hover:bg-blue-700 hover:shadow-lg transition duration-300">
      Get Started
      </button>

      </nav>

      {/* Hero Section */}
    
      <section className="text-center py-6 px-6 bg-gradient-to-b from-blue-50 to-white">

        <h2 className="text-5xl font-bold text-gray-900">
        Professional Document & PDF Tools
        </h2>

        <p className="mt-5 text-xl font italic text-gray-600 max-w-3xl mx-auto">
          Create, Edit & Manage Documents, PDFs and More — All in One Place.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Link href="/pdf-tools">
            <button className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl shadow-md hover:bg-blue-700 transition">
              Explore Tools
            </button>
          </Link>

        <Link href="/resume-builder">
          <button className="bg-blue-600 text-white font-semibold px-6 py-4 rounded-xl shadow-md hover:bg-blue-700 hover:shadow-lg transition duration-300">
            Resume Builder
          </button>
        </Link>
        </div>
      </section>

      {/* Quick Highlights */}
      <section className="max-w-5xl mx-auto py-8 px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">

          <div className="p-4 rounded-xl bg-blue-50">
            <h3 className="font-semibold">Free to Start</h3>
          </div>

          <div className="p-4 rounded-xl bg-blue-50">
            <h3 className="font-semibold">Hindi & English</h3>
          </div>

          <div className="p-4 rounded-xl bg-blue-50">
            <h3 className="font-semibold">Mobile Friendly</h3>
          </div>

          <div className="p-4 rounded-xl bg-blue-50">
            <h3 className="font-semibold">Easy to Use</h3>
          </div>

        </div>
      </section>

      {/* Popular Tools */}
      <section className="max-w-6xl mx-auto px-10 pb-10">
        <h2 className="text-4xl font-bold text-center mb-5">
        Popular Tools
        </h2>

        <div className="grid md:grid-cols-3 gap-5">

            {tools.map((tool) => (
            <Link key={tool.title} href={tool.link}>
            <div className="bg-white border border-black rounded-2xl p-6 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
              >
            <h3>{tool.title}</h3>
            <p>{tool.description}</p>
             </div>
            </Link>
            ))}

        </div>
      </section>

      {/* Why Choose */}
      <section className="bg-slate-50 pt-8 pb-8">

        <div className="max-w-5xl mx-auto px-6 text-center">

          <h3 className="text-3xl font-bold mb-4">
            Why Choose DocSprintHub?
          </h3>

          <div className="grid md:grid-cols-3 gap-6">

            <div>✅ Fast & Easy</div>
            <div>✅ Free Tools</div>
            <div>✅ Mobile Friendly</div>
            <div>✅ Secure Processing</div>
            <div>✅ Hindi & English Documents</div>
            <div>✅ No Technical Skills Needed</div>

          </div>

        </div>

      </section>

    <footer className="bg-slate-900 text-white py-8 mt-08">

    <div className="max-w-6xl mx-auto px-6">

    <div className="grid md:grid-cols-3 gap-30">

      {/* Brand */}
      <div className="flex h-full flex-col">
        <div>
          <h3 className="text-3xl font-bold">
            DocSprint<span className="text-blue-400">Hub</span>
          </h3>

          <p className="mt-3 text-gray-400 text-base">
           Your Complete Document Hub
            </p>
        </div>
        <div className="mt-auto pt-6 md:pt-0"><LanguageSelector /></div>
      </div>

      {/* Tools */}
      <div>
        <h4 className="font-semibold mb-4">Tools</h4>

        <div className="flex flex-col gap-2 text-gray-200">
          <a href="#">Resume Builder</a>
          <a href="#">Letter Writer</a>
          <a href="#">Biodata Maker</a>
          <Link href="/pdf-tools">PDF Tools</Link>
        </div>
      </div>

      {/* Company */}
      <div>
        <h4 className="font-semibold mb-4">Company</h4>

        <div className="flex flex-col gap-2 text-gray-200">
          <a href="#">About</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms & Conditions</a>
          <a href="#">Contact</a>
        </div>
      </div>

    </div>

    <div className="border-t border-slate-700 mt-4 pt-6">
      <p className="text-center text-gray-100 text-sm">
        © {new Date().getFullYear()} DocSprintHub. All Rights Reserved.
      </p>
    </div>

  </div>

</footer>

    </main>
  );
}
