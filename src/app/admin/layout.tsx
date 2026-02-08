
interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <>
      <div className="min-h-screen bg-background text-text">
        <main className="mx-auto w-full max-w-6xl px-6 pb-12 pt-20 lg:px-10">{children}</main>
      </div>
    </>
  );
}
