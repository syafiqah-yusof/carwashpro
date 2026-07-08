"use client";
import { useState } from "react";

export default function PaymentsView({ payments }: { payments: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];
  
  const currentYear = new Date().getFullYear();
  const years = [currentYear - 2, currentYear - 1, currentYear];

  const totalAmount = payments.reduce((acc, curr) => acc + Number(curr.amount), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-2">
        <h2 className="text-2xl font-bold text-white">Payments for {months[selectedMonth - 1]} {selectedYear}</h2>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn-primary bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
          >
            <i className="bi bi-calendar-plus mr-2"></i> Quick Daily Summary
          </button>
          <button className="btn-primary bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors">
            <i className="bi bi-plus-circle mr-2"></i> New Payment
          </button>
        </div>
      </div>

      <div className="glass-card p-4">
        <div className="flex flex-wrap items-center gap-4">
          <label className="text-white font-medium">Select Month:</label>
          <select 
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="bg-gray-800 border border-gray-600 text-white rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {months.map((m, i) => (
              <option key={i+1} value={i+1}>{m}</option>
            ))}
          </select>
          
          <select 
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="bg-gray-800 border border-gray-600 text-white rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          
          <button className="px-4 py-1.5 border border-cyan-500 text-cyan-500 rounded-md hover:bg-cyan-500 hover:text-black transition-colors font-medium">
            View
          </button>
        </div>
      </div>

      <div className="glass-card p-0 overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead className="bg-black/30">
              <tr className="border-b border-[var(--glass-border)]">
                <th className="p-4 text-gray-300 font-medium">Date</th>
                <th className="p-4 text-gray-300 font-medium">Plate No</th>
                <th className="p-4 text-gray-300 font-medium">Service / Notes</th>
                <th className="p-4 text-gray-300 font-medium">Amount</th>
                <th className="p-4 text-gray-300 font-medium">Method</th>
                <th className="p-4 text-gray-300 font-medium">Status</th>
                <th className="p-4 text-gray-300 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center text-gray-500 py-8">No payments found for this month.</td>
                </tr>
              ) : (
                payments.map(item => (
                  <tr key={item.payment_id} className="border-b border-[var(--glass-border)] hover:bg-white/5 transition-colors">
                    <td className="p-4 text-gray-300">{new Date(item.date_time).toLocaleString()}</td>
                    <td className="p-4 font-medium text-white">{item.vehicle_plate || '-'}</td>
                    <td className="p-4 text-gray-300">
                      {item.notes ? (
                        <span title={item.notes}>{item.notes.length > 30 ? item.notes.substring(0, 30) + "..." : item.notes}</span>
                      ) : (
                        item.services?.service_name || "Custom"
                      )}
                    </td>
                    <td className="p-4 text-green-400 font-bold">${Number(item.amount).toFixed(2)}</td>
                    <td className="p-4 text-gray-300">{item.payment_method}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-500/30">
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4 flex gap-2">
                      <button className="px-2 py-1 border border-cyan-500 text-cyan-500 rounded hover:bg-cyan-500 hover:text-black transition-colors text-sm">
                        <i className="bi bi-pencil-square mr-1"></i> Edit
                      </button>
                      <button className="px-2 py-1 border border-gray-400 text-gray-300 rounded hover:bg-gray-400 hover:text-black transition-colors text-sm">
                        <i className="bi bi-receipt mr-1"></i> Receipt
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {payments.length > 0 && (
              <tfoot>
                <tr className="bg-black/20 text-lg">
                  <td colSpan={3} className="p-4 text-right font-bold text-white">Total Displayed:</td>
                  <td className="p-4 text-green-400 font-bold border-t border-[var(--glass-border)]">
                    ${totalAmount.toFixed(2)}
                  </td>
                  <td colSpan={3} className="p-4 border-t border-[var(--glass-border)]"></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {/* Quick Daily Summary Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass-card w-full max-w-md shadow-2xl border border-gray-600">
            <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-3">
              <h5 className="text-xl font-bold text-white flex items-center">
                <i className="bi bi-cash-stack text-green-500 mr-2"></i> Quick Daily Summary
              </h5>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            
            <form>
              <p className="text-gray-400 text-sm mb-4">Use this to quickly record total income for the day if you don't have individual transaction details.</p>
              
              <div className="mb-4">
                <label className="block text-gray-300 mb-1">Date</label>
                <input type="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-full bg-gray-800 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-300 mb-1">Total Amount ($)</label>
                <input type="number" step="0.01" placeholder="0.00" className="w-full bg-gray-800 border border-gray-600 text-green-400 text-xl font-bold rounded-md px-3 py-2 text-right focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-300 mb-1">Primary Payment Method</label>
                <select className="w-full bg-gray-800 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="Cash">Cash</option>
                  <option value="QR">QR Pay</option>
                  <option value="Card">Card</option>
                  <option value="Mixed">Mixed</option>
                </select>
              </div>
              
              <div className="flex justify-end gap-3 border-t border-gray-700 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-gray-500 text-gray-300 rounded-md hover:bg-gray-800 transition-colors">
                  Cancel
                </button>
                <button type="button" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium">
                  Save Income
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
