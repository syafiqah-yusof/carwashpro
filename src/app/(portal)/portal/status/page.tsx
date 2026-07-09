import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import PromoCarousel from '../components/PromoCarousel';

export default async function PortalStatusPage() {
  const cookieStore = await cookies();
  const customerId = cookieStore.get('customer_id')?.value;

  if (!customerId) {
    redirect('/portal/login');
  }

  const supabase = createClient(cookieStore);

  // Fetch customer securely using RPC to bypass RLS for their specific ID
  const { data, error } = await supabase
    .rpc('get_customer_profile', { c_id: customerId })
    .single();

  if (error || !data) {
    console.error("Status Page Error:", error);
    redirect('/portal/login');
  }

  const customer = data as any;

  // Calculate rewards logic
  const washesUntilFree = 5 - ((customer.total_visits || 0) % 6);
  const isFreeWashReady = (customer.total_visits || 0) > 0 && washesUntilFree === 5;

  // Check for active wash job
  const { data: activeJob } = await supabase
    .from('vehicle_jobs')
    .select('*')
    .eq('vehicle_plate', customer.primary_vehicle_plate)
    .in('status', ['Waiting', 'Washing', 'Ready'])
    .order('arrival_time', { ascending: false })
    .limit(1)
    .maybeSingle();

  return (
    <div className="flex justify-center mt-8 px-4">
      <div className="w-full max-w-2xl space-y-6">
        
        {/* Welcome Card */}
        <div className="glass-card shadow-2xl p-6 border border-white/10 animate-fade-in">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">
                Welcome back, {customer.full_name}
              </h2>
              <p className="text-gray-400">
                <i className="bi bi-car-front-fill mr-2"></i>
                Plate: <span className="text-white font-medium">{customer.primary_vehicle_plate}</span>
              </p>
            </div>
            {customer.membership_id && (
              <div className="bg-gradient-to-r from-yellow-500 to-amber-600 px-4 py-2 rounded-lg text-black font-bold shadow-lg flex flex-col items-center">
                <span className="text-xs uppercase tracking-wider opacity-80">VIP Member</span>
                <span>{customer.membership_id}</span>
              </div>
            )}
          </div>
        </div>

        {/* Promo Carousel */}
        <PromoCarousel />

        {/* Live Car Status Tracker */}
        {activeJob && (
          <div className="glass-card shadow-2xl p-6 border border-white/10 animate-fade-in border-t-4 border-t-cyan-500 bg-gradient-to-br from-black/80 to-cyan-900/20">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <i className="bi bi-broadcast text-cyan-400 mr-2 animate-pulse"></i> Live Wash Status
            </h3>
            <div className="relative">
              <div className="flex justify-between mb-2 relative z-10">
                <div className={`flex flex-col items-center ${activeJob.status === 'Waiting' || activeJob.status === 'Washing' || activeJob.status === 'Ready' ? 'text-white font-bold' : 'text-gray-500'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${activeJob.status === 'Waiting' || activeJob.status === 'Washing' || activeJob.status === 'Ready' ? 'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]' : 'bg-gray-700'}`}>1</div>
                  <span className="text-xs">Waiting</span>
                </div>
                <div className={`flex flex-col items-center ${activeJob.status === 'Washing' || activeJob.status === 'Ready' ? 'text-white font-bold' : 'text-gray-500'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${activeJob.status === 'Washing' || activeJob.status === 'Ready' ? 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.8)]' : 'bg-gray-700'}`}>2</div>
                  <span className="text-xs">Washing</span>
                </div>
                <div className={`flex flex-col items-center ${activeJob.status === 'Ready' ? 'text-white font-bold' : 'text-gray-500'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${activeJob.status === 'Ready' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]' : 'bg-gray-700'}`}>3</div>
                  <span className="text-xs">Ready!</span>
                </div>
              </div>
              <div className="absolute top-4 left-0 w-full h-1 bg-gray-700 -z-0">
                <div 
                  className="h-full transition-all duration-1000" 
                  style={{ 
                    width: activeJob.status === 'Ready' ? '100%' : activeJob.status === 'Washing' ? '50%' : '0%',
                    backgroundColor: activeJob.status === 'Ready' ? '#22c55e' : '#eab308'
                  }}
                ></div>
              </div>
            </div>
            
            <div className="mt-6 text-center bg-black/40 p-3 rounded-lg border border-gray-600">
              <p className="text-gray-300 text-sm">Current Status</p>
              <h4 className="text-2xl font-black tracking-wider uppercase bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                {activeJob.status}
              </h4>
              {activeJob.status === 'Ready' && (
                <p className="text-green-400 font-bold mt-1 animate-pulse"><i className="bi bi-key-fill"></i> Your car is ready for pickup!</p>
              )}
            </div>
          </div>
        )}

        {/* Loyalty Progress Card */}
        <div className="glass-card shadow-2xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <i className="bi bi-star-fill text-yellow-500 mr-2"></i> Loyalty Progress
          </h3>
          
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-300">Total Washes: <strong className="text-white text-lg">{customer.total_visits || 0}</strong></span>
            
            {isFreeWashReady ? (
              <span className="text-green-400 font-bold animate-pulse">Your next wash is FREE! 🎉</span>
            ) : (
              <span className="text-yellow-500 font-bold">{washesUntilFree} washes until free!</span>
            )}
          </div>

          <div className="flex gap-2 mt-4">
            {[1, 2, 3, 4, 5, 6].map((step) => {
              const isActive = isFreeWashReady ? true : step <= ((customer.total_visits || 0) % 6);
              const isGift = step === 6;
              return (
                <div key={step} className="flex-1 flex flex-col items-center">
                  <div className={`w-full h-2 rounded-full mb-2 ${isActive ? (isGift ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]' : 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.4)]') : 'bg-gray-700'}`}></div>
                  {isGift ? (
                    <i className={`bi bi-gift-fill ${isActive ? 'text-green-500' : 'text-gray-600'}`}></i>
                  ) : (
                    <i className={`bi bi-droplet-half ${isActive ? 'text-yellow-500' : 'text-gray-600'}`}></i>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Link href="/portal/booking" className="glass-card flex flex-col items-center justify-center p-6 hover:bg-white/5 transition-colors group cursor-pointer border border-white/10">
            <i className="bi bi-calendar-plus text-4xl text-purple-500 mb-2 group-hover:scale-110 transition-transform"></i>
            <h4 className="text-white font-bold text-center">Book Slot</h4>
            <p className="text-gray-400 text-sm text-center mt-1">Schedule visit</p>
          </Link>
          <Link href="/portal/upload-receipt" className="glass-card flex flex-col items-center justify-center p-6 hover:bg-white/5 transition-colors group cursor-pointer border border-white/10">
            <i className="bi bi-receipt text-4xl text-green-500 mb-2 group-hover:scale-110 transition-transform"></i>
            <h4 className="text-white font-bold text-center">Receipts</h4>
            <p className="text-gray-400 text-sm text-center mt-1">Submit payment</p>
          </Link>
          <Link href="/portal/profile" className="glass-card flex flex-col items-center justify-center p-6 hover:bg-white/5 transition-colors group cursor-pointer border border-white/10">
            <i className="bi bi-person-lines-fill text-4xl text-blue-500 mb-2 group-hover:scale-110 transition-transform"></i>
            <h4 className="text-white font-bold text-center">Edit Profile</h4>
            <p className="text-gray-400 text-sm text-center mt-1">Update details</p>
          </Link>
          <Link href="/portal/history" className="glass-card flex flex-col items-center justify-center p-6 hover:bg-white/5 transition-colors group cursor-pointer border border-white/10">
            <i className="bi bi-clock-history text-4xl text-cyan-500 mb-2 group-hover:scale-110 transition-transform"></i>
            <h4 className="text-white font-bold text-center">Wash History</h4>
            <p className="text-gray-400 text-sm text-center mt-1">View past visits</p>
          </Link>
          <Link href="/portal/review" className="col-span-2 glass-card flex flex-col items-center justify-center p-6 hover:bg-white/5 transition-colors group cursor-pointer border border-white/10 border-t-yellow-500 border-t-2">
            <i className="bi bi-star-fill text-4xl text-yellow-500 mb-2 group-hover:scale-110 transition-transform drop-shadow-[0_0_5px_rgba(234,179,8,0.5)]"></i>
            <h4 className="text-white font-bold text-center">Leave Feedback</h4>
            <p className="text-gray-400 text-sm text-center mt-1">Rate our service to help us improve</p>
          </Link>
        </div>

      </div>
    </div>
  );
}
