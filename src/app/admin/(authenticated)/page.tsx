import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import Link from 'next/link';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // 1. Fetch available services
  const { data: services, error: servicesError } = await supabase.from('services').select('*').limit(3);

  // 2. Fetch today's payments
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const { data: todaysPayments, error: paymentsError } = await supabase
    .from('payments')
    .select('amount, status, date_time, vehicle_plate, service_id, payment_method')
    .gte('date_time', today.toISOString())
    .lt('date_time', tomorrow.toISOString())
    .order('date_time', { ascending: false });

  // Fetch today's completed jobs
  const { data: todaysJobs, error: jobsError } = await supabase
    .from('vehicle_jobs')
    .select('vehicle_job_id')
    .gte('completion_time', today.toISOString())
    .lt('completion_time', tomorrow.toISOString())
    .eq('status', 'Completed');

  // 3. Fetch recent 5 payments for activity feed
  const { data: recentPayments } = await supabase
    .from('payments')
    .select('payment_id, amount, status, date_time, vehicle_plate, services(service_name)')
    .order('date_time', { ascending: false })
    .limit(5);

  // 4. Fetch active staff
  const { count: staffCount, error: staffError } = await supabase
    .from('employees')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'Active');

  const error = servicesError || paymentsError || staffError || jobsError;

  // Calculate metrics
  const revenue = todaysPayments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;
  const washCount = todaysJobs?.length || 0;
  const activeStaff = staffCount || 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard Overview</h1>
        <Link href="/admin/workflow" className="btn-primary flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-lg">
          <i className="bi bi-arrow-right-circle mr-2"></i> Go to Workflow
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-1">Today's Revenue</p>
            <h3 className="text-2xl font-bold text-white">RM {revenue.toFixed(2)}</h3>
          </div>
          <div className="bg-green-500/20 p-3 rounded-xl border border-green-500/30">
            <i className="bi bi-cash-stack text-2xl text-green-400"></i>
          </div>
        </div>
        
        <div className="glass-card flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-1">Vehicles Washed</p>
            <h3 className="text-2xl font-bold text-white">{washCount}</h3>
          </div>
          <div className="bg-blue-500/20 p-3 rounded-xl border border-blue-500/30">
            <i className="bi bi-car-front-fill text-2xl text-blue-400"></i>
          </div>
        </div>

        <div className="glass-card flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-1">Active Staff</p>
            <h3 className="text-2xl font-bold text-white">{activeStaff}</h3>
          </div>
          <div className="bg-purple-500/20 p-3 rounded-xl border border-purple-500/30">
            <i className="bi bi-people-fill text-2xl text-purple-400"></i>
          </div>
        </div>

        <div className="glass-card flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-1">Database Status</p>
            <h3 className={`text-lg font-bold flex items-center mt-1 ${error ? 'text-red-400' : 'text-green-400'}`}>
              <span className={`w-2.5 h-2.5 rounded-full mr-2 animate-pulse ${error ? 'bg-red-500' : 'bg-green-500'}`}></span>
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
                {recentPayments && recentPayments.length > 0 ? (
                  recentPayments.map((payment) => {
                    const time = new Date(payment.date_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    // @ts-ignore
                    const serviceName = payment.services?.service_name || "Unknown Service";
                    
                    let statusColor = "bg-gray-500/20 text-gray-400 border-gray-500/30";
                    if (payment.status === 'Completed') statusColor = "bg-green-500/20 text-green-400 border-green-500/30";
                    if (payment.status === 'Pending') statusColor = "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
                    if (payment.status === 'Verified') statusColor = "bg-blue-500/20 text-blue-400 border-blue-500/30";
                    
                    return (
                      <tr key={payment.payment_id} className="border-b border-[var(--glass-border)] hover:bg-white/5 transition-colors">
                        <td className="py-4 text-gray-300">{time}</td>
                        <td className="py-4 font-medium text-white">{payment.vehicle_plate || "N/A"}</td>
                        <td className="py-4 text-gray-300">{serviceName}</td>
                        <td className="py-4"><span className={`px-2 py-1 text-xs rounded-full border ${statusColor}`}>{payment.status || "Unknown"}</span></td>
                        <td className="py-4 text-right font-medium text-white">RM {(payment.amount || 0).toFixed(2)}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500 italic">No recent payments found today.</td>
                  </tr>
                )}
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
                  <span className="text-blue-400 font-bold">RM {service.price}</span>
                </li>
              ))
            ) : (
              <li className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20 text-yellow-200 text-sm">
                No services found. Run the CSV migration to add them!
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
