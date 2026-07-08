import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export const revalidate = 0;

export default async function HRPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Fetch employees
  const { data: employees } = await supabase
    .from('employees')
    .select('*')
    .order('full_name', { ascending: true });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <i className="bi bi-people-fill text-purple-400 mr-2"></i> HR & Employees
        </h2>
        <div className="flex gap-2">
          <button className="btn-primary bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors shadow-lg">
            <i className="bi bi-calendar-check mr-2"></i> Attendance
          </button>
          <button className="btn-primary bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors shadow-lg">
            <i className="bi bi-person-plus mr-2"></i> Add Employee
          </button>
        </div>
      </div>

      <div className="glass-card p-0 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-black/30 border-b border-[var(--glass-border)]">
              <tr>
                <th className="p-4 text-gray-300 font-medium">ID</th>
                <th className="p-4 text-gray-300 font-medium">Name</th>
                <th className="p-4 text-gray-300 font-medium">Position</th>
                <th className="p-4 text-gray-300 font-medium">Daily Rate</th>
                <th className="p-4 text-gray-300 font-medium">Join Date</th>
                <th className="p-4 text-gray-300 font-medium">Status</th>
                <th className="p-4 text-gray-300 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(!employees || employees.length === 0) ? (
                <tr>
                  <td colSpan={7} className="text-center text-gray-500 py-10">No employees found.</td>
                </tr>
              ) : (
                employees.map(item => {
                  const isActive = item.status === 'Active';
                  return (
                    <tr key={item.employee_id} className="border-b border-[var(--glass-border)] hover:bg-white/5 transition-colors">
                      <td className="p-4 text-gray-400 text-sm font-mono">
                        #{item.employee_id.split('-')[0]}...
                      </td>
                      <td className="p-4 font-bold text-white">{item.full_name}</td>
                      <td className="p-4 text-gray-300">{item.position}</td>
                      <td className="p-4 text-gray-300 font-medium">
                        ${Number(item.daily_rate).toFixed(2)}
                      </td>
                      <td className="p-4 text-gray-400">
                        {new Date(item.join_date).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 text-xs rounded-full border ${
                          item.status === 'Active' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                          item.status === 'Resigned' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                          'bg-gray-500/20 text-gray-400 border-gray-500/30'
                        }`}>
                          {item.status || 'Unknown'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button 
                            className={`px-3 py-1 border rounded text-sm transition-colors flex items-center ${isActive ? 'border-green-500 text-green-400 hover:bg-green-500 hover:text-white' : 'border-gray-600 text-gray-500 cursor-not-allowed'}`}
                            disabled={!isActive}
                            title="Check In"
                          >
                            <i className="bi bi-check2-circle mr-1"></i> In
                          </button>
                          
                          <div className="flex items-center">
                            <input 
                              type="number" 
                              placeholder="Amt" 
                              className="w-16 bg-gray-800 border border-gray-600 text-white rounded-l-md px-2 py-1 text-sm focus:outline-none focus:border-cyan-500" 
                              disabled={!isActive}
                            />
                            <button 
                              className={`px-3 py-1 border border-l-0 rounded-r-md text-sm transition-colors flex items-center ${isActive ? 'border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black' : 'border-gray-600 text-gray-500 bg-gray-800/50 cursor-not-allowed'}`}
                              disabled={!isActive}
                              title="Advance"
                            >
                              Advance
                            </button>
                          </div>
                          
                          <button className="px-2 py-1 border border-yellow-500 text-yellow-500 rounded hover:bg-yellow-500 hover:text-black transition-colors text-sm" title="Edit">
                            <i className="bi bi-pencil"></i>
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
