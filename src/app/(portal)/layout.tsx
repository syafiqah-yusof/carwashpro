import { cookies } from 'next/headers';
import LogoutButton from './components/LogoutButton';
import Link from 'next/link';

export default async function PortalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const isLoggedIn = !!cookieStore.get('customer_id')?.value;

  return (
    <>
      {/* Simple header for customer portal */}
      <header className="p-4 flex justify-between items-center border-b border-white/10 bg-black/40 backdrop-blur-md relative z-10">
        <Link href="/portal/status" className="flex items-center space-x-2 text-white font-bold text-xl hover:opacity-80 transition-opacity">
          <img src="/akc-logo.png" alt="AKC Logo" className="h-10 rounded-lg object-cover" />
          <span className="hidden sm:inline">AKC Portal</span>
        </Link>
        
        {isLoggedIn && <LogoutButton />}
      </header>
      <main role="main" className="flex-1 pb-10">
        {children}
      </main>
      <footer className="text-gray-500 mt-auto py-4 text-center text-sm">
        <div className="container mx-auto px-4">
          &copy; {new Date().getFullYear()} - AKC Car Wash & Detailing Customer Portal
        </div>
      </footer>
    </>
  );
}
