"use client";
import { approveAppointment, rejectAppointment } from "./actions";

export default function AppointmentsClient({ appointments }: { appointments: any[] }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Appointments</h2>
      </div>

      <div className="glass-card shadow-2xl overflow-hidden border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/40 text-gray-400 text-sm uppercase tracking-wider border-b border-[var(--glass-border)]">
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Time</th>
                <th className="p-4 font-semibold">Customer</th>
                <th className="p-4 font-semibold">Plate</th>
                <th className="p-4 font-semibold">Notes / Service</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--glass-border)]">
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500">
                    No appointments found.
                  </td>
                </tr>
              ) : (
                appointments.map(app => (
                  <tr key={app.appointment_id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 text-white font-medium">{new Date(app.appointment_date).toLocaleDateString()}</td>
                    <td className="p-4 text-gray-300">
                      {app.status === 'Pending' ? (
                        <input 
                          type="time" 
                          id={`time-${app.appointment_id}`}
                          defaultValue={app.appointment_time || ''}
                          className="bg-gray-800 border border-gray-600 rounded p-1 text-sm text-white focus:outline-none focus:border-cyan-500"
                        />
                      ) : (
                        app.appointment_time || 'Anytime'
                      )}
                    </td>
                    <td className="p-4 text-gray-300">{app.customers?.full_name || 'Unknown'}</td>
                    <td className="p-4 text-gray-300">{app.vehicle_plate}</td>
                    <td className="p-4 text-gray-300 max-w-xs truncate">{app.service_notes || '-'}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        app.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/50' : 
                        app.status === 'Approved' ? 'bg-green-500/20 text-green-500 border border-green-500/50' : 
                        'bg-red-500/20 text-red-500 border border-red-500/50'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      {app.status === 'Pending' && (
                        <>
                          <button 
                            onClick={async () => {
                              const timeVal = (document.getElementById(`time-${app.appointment_id}`) as HTMLInputElement)?.value;
                              await approveAppointment(app.appointment_id, timeVal);
                            }}
                            className="bg-green-600/30 text-green-400 border border-green-500/50 hover:bg-green-600 hover:text-white px-3 py-1 rounded text-sm transition-colors"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => rejectAppointment(app.appointment_id)}
                            className="bg-red-600/30 text-red-400 border border-red-500/50 hover:bg-red-600 hover:text-white px-3 py-1 rounded text-sm transition-colors"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
