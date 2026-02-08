import Footer from "@/components/Footer";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <>
      <div className="min-h-screen bg-[#fbf8f1] text-neutral-900">
        <main className="mx-auto w-full max-w-6xl px-6 py-12 lg:px-10">{children}</main>
      </div>
      <Footer />
    </>
  );
}
