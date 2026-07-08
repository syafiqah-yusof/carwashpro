import Navbar from "@/components/Navbar";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 pb-8">
        <main role="main">
          {children}
        </main>
      </div>
      <footer className="border-t border-[var(--glass-border)] text-[var(--text-secondary)] mt-auto py-4 text-center">
        <div className="container mx-auto px-4">
          &copy; {new Date().getFullYear()} - AKC Car Wash & Detailing
        </div>
      </footer>
    </>
  );
}
