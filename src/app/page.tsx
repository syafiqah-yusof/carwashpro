import Link from 'next/link';
import PromoCarousel from './(portal)/components/PromoCarousel';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-950 flex flex-col font-sans">
      {/* Header */}
      <header className="fixed w-full top-0 z-50 bg-black/50 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <i className="bi bi-droplet-fill text-white text-xl"></i>
            </div>
            <h1 className="text-xl font-bold text-white tracking-wider">AKC <span className="text-cyan-400">WASH</span></h1>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
            <a href="#services" className="hover:text-white transition-colors">Services</a>
            <a href="#vip" className="hover:text-white transition-colors">VIP Program</a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/portal/login" className="text-sm font-bold text-white hover:text-cyan-400 transition-colors hidden sm:block">
              Login
            </Link>
            <Link href="/portal/register" className="bg-white text-black px-5 py-2.5 rounded-full font-bold text-sm hover:bg-gray-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.3)]">
              Join VIP
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden flex-1 flex flex-col justify-center">
        {/* Abstract Background Effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px]"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-cyan-400 text-sm font-semibold mb-8 backdrop-blur-md">
            <i className="bi bi-stars"></i> Premium Auto Detailing
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-8 leading-tight">
            Your Car Deserves <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
              The Royal Treatment
            </span>
          </h1>
          
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Experience the ultimate clean with our premium detailing services. 
            Track your wash live, book appointments online, and earn free washes with our VIP program.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/portal/register" className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl text-lg transition-all shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:shadow-[0_0_40px_rgba(6,182,212,0.6)] hover:-translate-y-1 flex items-center justify-center">
              Become a VIP Member <i className="bi bi-arrow-right ml-2"></i>
            </Link>
            <Link href="/portal/login" className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-xl text-lg transition-all flex items-center justify-center backdrop-blur-sm">
              <i className="bi bi-car-front mr-2"></i> Track My Car
            </Link>
          </div>
        </div>
      </section>

      {/* Promotions Section */}
      <section className="py-12 bg-slate-900/50 border-t border-white/5 relative z-10">
        <div className="max-w-4xl mx-auto px-6">
          <PromoCarousel />
        </div>
      </section>

      {/* Features Grid */}
      <section id="services" className="py-24 bg-black/40 border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-8 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
              <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6 border border-blue-500/30">
                <i className="bi bi-phone text-2xl text-blue-400"></i>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Live Tracking</h3>
              <p className="text-gray-400 leading-relaxed">Relax in our lounge while you monitor your car's progress from foam to finish directly on your phone.</p>
            </div>
            
            <div className="glass-card p-8 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-colors relative overflow-hidden">
              <div id="vip" className="absolute top-0 right-0 p-4">
                <span className="bg-yellow-500/20 text-yellow-500 text-xs font-bold px-3 py-1 rounded-full border border-yellow-500/30">POPULAR</span>
              </div>
              <div className="w-14 h-14 bg-yellow-500/20 rounded-xl flex items-center justify-center mb-6 border border-yellow-500/30">
                <i className="bi bi-star-fill text-2xl text-yellow-400"></i>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">VIP Loyalty Rewards</h3>
              <p className="text-gray-400 leading-relaxed">Join our free VIP program today. Get your 6th wash absolutely free, plus exclusive birthday discounts.</p>
            </div>
            
            <div className="glass-card p-8 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
              <div className="w-14 h-14 bg-cyan-500/20 rounded-xl flex items-center justify-center mb-6 border border-cyan-500/30">
                <i className="bi bi-calendar-check text-2xl text-cyan-400"></i>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Easy Booking</h3>
              <p className="text-gray-400 leading-relaxed">Skip the line by booking your detailing appointments online. Upload payment receipts instantly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/60 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded flex items-center justify-center">
              <i className="bi bi-droplet-fill text-white text-sm"></i>
            </div>
            <span className="text-lg font-bold text-white tracking-wider">AKC <span className="text-cyan-400">WASH</span></span>
          </div>
          <p className="text-gray-500 text-sm">© {new Date().getFullYear()} AKC Car Wash. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/admin/login" className="text-gray-600 hover:text-gray-400 text-sm transition-colors">
              Staff Portal
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
