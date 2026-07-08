import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Example of fetching the connection status
  const { data: services, error } = await supabase.from('services').select('*').limit(3);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard Overview</h1>
        <button className="btn-primary flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-lg">
          <i className="bi bi-plus-circle mr-2"></i> New Vehicle
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-1">Today's Revenue</p>
            <h3 className="text-2xl font-bold text-white">$450.00</h3>
          </div>
          <div className="bg-green-500/20 p-3 rounded-xl border border-green-500/30">
            <i className="bi bi-cash-stack text-2xl text-green-400"></i>
          </div>
        </div>
        
        <div className="glass-card flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-1">Vehicles Washed</p>
            <h3 className="text-2xl font-bold text-white">12</h3>
          </div>
          <div className="bg-blue-500/20 p-3 rounded-xl border border-blue-500/30">
            <i className="bi bi-car-front-fill text-2xl text-blue-400"></i>
          </div>
        </div>

        <div className="glass-card flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-1">Active Staff</p>
            <h3 className="text-2xl font-bold text-white">5</h3>
          </div>
          <div className="bg-purple-500/20 p-3 rounded-xl border border-purple-500/30">
            <i className="bi bi-people-fill text-2xl text-purple-400"></i>
          </div>
        </div>

        <div className="glass-card flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-1">Database Status</p>
            <h3 className="text-lg font-bold text-green-400 flex items-center mt-1">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 mr-2 animate-pulse"></span>
              {error ? "Disconnected" : "Connected"}
            </h3>
          </div>
          <div className="bg-gray-700/50 p-3 rounded-xl border border-gray-600/50">
            <i className="bi bi-database text-2xl text-gray-300"></i>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card lg:col-span-2">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <i className="bi bi-activity mr-2 text-blue-400"></i> Recent Activity
          </h2>
          
          <div className="table-responsive w-full overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--glass-border)]">
                  <th className="pb-3 text-gray-400 font-medium">Time</th>
                  <th className="pb-3 text-gray-400 font-medium">Vehicle</th>
                  <th className="pb-3 text-gray-400 font-medium">Service</th>
                  <th className="pb-3 text-gray-400 font-medium">Status</th>
                  <th className="pb-3 text-gray-400 font-medium text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[var(--glass-border)] hover:bg-white/5 transition-colors">
                  <td className="py-4 text-gray-300">10:45 AM</td>
                  <td className="py-4 font-medium text-white">ABC 1234</td>
                  <td className="py-4 text-gray-300">Premium Wash</td>
                  <td className="py-4"><span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-500/30">Completed</span></td>
                  <td className="py-4 text-right font-medium text-white">$45.00</td>
                </tr>
                <tr className="border-b border-[var(--glass-border)] hover:bg-white/5 transition-colors">
                  <td className="py-4 text-gray-300">11:15 AM</td>
                  <td className="py-4 font-medium text-white">XYZ 9876</td>
                  <td className="py-4 text-gray-300">Basic Wash</td>
                  <td className="py-4"><span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full border border-yellow-500/30">In Progress</span></td>
                  <td className="py-4 text-right font-medium text-white">$25.00</td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-4 text-gray-300">11:30 AM</td>
                  <td className="py-4 font-medium text-white">DEF 4567</td>
                  <td className="py-4 text-gray-300">Interior Detailing</td>
                  <td className="py-4"><span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full border border-blue-500/30">Waiting</span></td>
                  <td className="py-4 text-right font-medium text-white">$85.00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-card">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <i className="bi bi-list-stars mr-2 text-yellow-400"></i> Supabase Services
          </h2>
          <p className="text-sm text-gray-400 mb-4">Live data from your new Supabase database.</p>
          
          <ul className="space-y-3">
            {services && services.length > 0 ? (
              services.map((service) => (
                <li key={service.service_id} className="p-3 bg-black/20 rounded-lg border border-white/5 flex justify-between items-center">
                  <span className="text-white">{service.service_name}</span>
                  <span className="text-blue-400 font-bold">${service.price}</span>
                </li>
              ))
            ) : (
              <li className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20 text-yellow-200 text-sm">
                No services found. Add some data to the Services table in Supabase!
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
