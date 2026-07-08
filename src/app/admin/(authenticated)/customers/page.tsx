import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export const revalidate = 0; // Disable static caching so it always loads fresh data

export default async function CustomersPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Fetch customers
  const { data: customers } = await supabase
    .from('customers')
    .select('*')
    .order('created_date', { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-2">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <i className="bi bi-people-fill text-blue-500 mr-2"></i> Customers & Memberships
        </h2>
        <button className="btn-primary bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors shadow-lg">
          <i className="bi bi-plus-circle mr-2"></i> New Customer
        </button>
      </div>

      <div className="glass-card p-0 overflow-hidden border border-gray-700/50 shadow-2xl">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-black/40">
              <tr className="border-b border-[var(--glass-border)]">
                <th className="p-4 text-gray-300 font-medium">Customer ID</th>
                <th className="p-4 text-gray-300 font-medium">Name</th>
                <th className="p-4 text-gray-300 font-medium">Phone</th>
                <th className="p-4 text-gray-300 font-medium">Plate Number</th>
                <th className="p-4 text-gray-300 font-medium">Membership ID</th>
                <th className="p-4 text-gray-300 font-medium">Total Washes</th>
                <th className="p-4 text-gray-300 font-medium">Loyalty Progress</th>
                <th className="p-4 text-gray-300 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(!customers || customers.length === 0) ? (
                <tr>
                  <td colSpan={8} className="text-center text-gray-500 py-10">No customers registered yet.</td>
                </tr>
              ) : (
                customers.map(item => {
                  let washesUntilFree = 5 - (item.total_visits % 6);
                  if (washesUntilFree === 5 && item.total_visits > 0) {
                    washesUntilFree = 0; // The 6th wash was just used
                  }

                  return (
                    <tr key={item.customer_id} className="border-b border-[var(--glass-border)] hover:bg-white/5 transition-colors">
                      <td className="p-4 text-gray-400 text-sm font-mono">
                        #{item.customer_id.split('-')[0]}...
                      </td>
                      <td className="p-4 font-bold text-white">{item.full_name}</td>
                      <td className="p-4 text-gray-300">{item.phone_number || '-'}</td>
                      <td className="p-4 font-medium text-gray-200">
                        {item.primary_vehicle_plate ? (
                          <span className="px-2 py-1 bg-gray-800 border border-gray-600 rounded-md">
                            {item.primary_vehicle_plate}
                          </span>
                        ) : '-'}
                      </td>
                      <td className="p-4">
                        {item.membership_id ? (
                          <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-500/30">
                            {item.membership_id}
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-gray-600/30 text-gray-400 text-xs rounded-full border border-gray-600/30">
                            None
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-sm font-bold rounded-full border border-blue-500/30">
                          {item.total_visits}
                        </span>
                      </td>
                      <td className="p-4">
                        {item.total_visits % 6 === 5 ? (
                          <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-bold rounded border border-yellow-500/50 flex items-center w-max">
                            <i className="bi bi-star-fill mr-1"></i> Next Wash FREE!
                          </span>
                        ) : (
                          <span className="text-gray-400 text-sm">
                            <b className="text-gray-200">{washesUntilFree}</b> washes to free wash
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button className="px-2 py-1 border border-blue-500 text-blue-400 rounded hover:bg-blue-500 hover:text-white transition-colors text-sm" title="Edit">
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button className="px-2 py-1 border border-red-500 text-red-400 rounded hover:bg-red-500 hover:text-white transition-colors text-sm" title="Delete">
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
