import Sidebar from "@/components/layout/sidebar";
import { Toaster } from "sonner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex text-slate-100">
      <div className="fixed inset-0 -z-1 bg-[#050509]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>

        {/* The Mesh Gradient Blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/30 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/30 rounded-full blur-[120px] animate-pulse delay-700"></div>
        <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse delay-1000"></div>
        <img
          src="/logo/DevDynamo.svg"
          itemType="svg"
          alt="DevDynamo"
          className="opacity-5 logosvg "
        />
      </div>
      <Sidebar/>
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-6 md:p-8 lg:p-10 pt-2">
          {children}
          <Toaster richColors position="top-right" />
        </main>
      </div>
    </div>
  );
}
