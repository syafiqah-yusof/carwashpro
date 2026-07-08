import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/portal/profile" className="glass-card flex flex-col items-center justify-center p-6 hover:bg-white/5 transition-colors group cursor-pointer border border-white/10">
            <i className="bi bi-person-lines-fill text-4xl text-blue-500 mb-2 group-hover:scale-110 transition-transform"></i>
            <h4 className="text-white font-bold">Edit Profile</h4>
            <p className="text-gray-400 text-sm text-center mt-1">Update your personal details</p>
          </Link>
          <Link href="/portal/history" className="glass-card flex flex-col items-center justify-center p-6 hover:bg-white/5 transition-colors group cursor-pointer border border-white/10">
            <i className="bi bi-clock-history text-4xl text-cyan-500 mb-2 group-hover:scale-110 transition-transform"></i>
            <h4 className="text-white font-bold">Wash History</h4>
            <p className="text-gray-400 text-sm text-center mt-1">View your past visits</p>
          </Link>
        </div>

      </div>
    </div>
  );
}
