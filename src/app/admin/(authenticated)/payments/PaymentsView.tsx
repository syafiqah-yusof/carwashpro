"use client";
import { useState, useActionState, useEffect } from "react";
import { updatePaymentStatus, addPaymentSummary, updatePaymentDate } from "./actions";
import { useRouter, useSearchParams } from 'next/navigation';

export default function PaymentsView({ payments }: { payments: any[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(Number(searchParams.get('month')) || new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(Number(searchParams.get('year')) || new Date().getFullYear());
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);

  const [summaryState, summaryAction, isSummaryPending] = useActionState(addPaymentSummary, null);

  useEffect(() => {
    if (summaryState?.success) setIsModalOpen(false);
  }, [summaryState]);

  const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];
  
  const currentYear = new Date().getFullYear();
  const years = [currentYear - 2, currentYear - 1, currentYear];

  const totalAmount = payments.reduce((acc, curr) => acc + Number(curr.amount), 0);

  const handleUpdateStatus = async (paymentId: number, status: string) => {
    await updatePaymentStatus(paymentId, status);
  };

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
          
          <button 
            onClick={() => {
              const params = new URLSearchParams(searchParams.toString());
              params.set('month', selectedMonth.toString());
              params.set('year', selectedYear.toString());
              router.push(`/admin/payments?${params.toString()}`);
            }}
            className="px-4 py-1.5 border border-cyan-500 text-cyan-500 rounded-md hover:bg-cyan-500 hover:text-black transition-colors font-medium"
          >
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
                payments.map(item => {
                  let statusColor = "bg-gray-500/20 text-gray-400 border-gray-500/30";
                  if (item.status === 'Completed') statusColor = "bg-green-500/20 text-green-400 border-green-500/30";
                  if (item.status === 'Pending') statusColor = "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
                  if (item.status === 'Verified') statusColor = "bg-blue-500/20 text-blue-400 border-blue-500/30";
                  if (item.status === 'Failed') statusColor = "bg-red-500/20 text-red-400 border-red-500/30";

                  return (
                    <tr key={item.payment_id} className="border-b border-[var(--glass-border)] hover:bg-white/5 transition-colors">
                      <td className="p-4 text-gray-300">
                        <div className="flex flex-col gap-1">
                          <input 
                            type="datetime-local" 
                            id={`date-${item.payment_id}`}
                            defaultValue={new Date(new Date(item.date_time).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)}
                            className="bg-gray-800 border border-gray-600 rounded focus:border-blue-500 focus:outline-none text-gray-300 text-xs p-1"
                          />
                          <button 
                            onClick={async (e) => {
                              const btn = e.currentTarget;
                              btn.innerHTML = 'Saving...';
                              const val = (document.getElementById(`date-${item.payment_id}`) as HTMLInputElement).value;
                              // Convert back to UTC for Supabase
                              const utcDate = new Date(val).toISOString();
                              const res = await updatePaymentDate(item.payment_id, utcDate);
                              if (res.error) {
                                alert(res.error);
                                btn.innerHTML = 'Save Date';
                              } else {
                                btn.innerHTML = 'Saved!';
                                setTimeout(() => { btn.innerHTML = 'Save Date'; }, 2000);
                              }
                            }}
                            className="bg-blue-600/30 text-blue-400 hover:bg-blue-600 hover:text-white border border-blue-500/50 transition-colors text-xs px-2 py-1 rounded"
                          >
                            Save Date
                          </button>
                        </div>
                      </td>
                      <td className="p-4 font-medium text-white">{item.vehicle_plate || '-'}</td>
                      <td className="p-4 text-gray-300">
                        {item.notes ? (
                          <span title={item.notes}>{item.notes.length > 30 ? item.notes.substring(0, 30) + "..." : item.notes}</span>
                        ) : (
                          item.services?.service_name || "Custom"
                        )}
                      </td>
                      <td className="p-4 text-green-400 font-bold">RM {Number(item.amount).toFixed(2)}</td>
                      <td className="p-4 text-gray-300">{item.payment_method}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 text-xs rounded-full border ${statusColor}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="p-4 flex gap-2">
                        {item.receipt_url && (
                          <button 
                            onClick={() => setReceiptUrl(item.receipt_url)}
                            className="px-2 py-1 border border-blue-500 text-blue-400 rounded hover:bg-blue-500 hover:text-white transition-colors text-sm"
                          >
                            <i className="bi bi-file-earmark-image mr-1"></i> View Receipt
                          </button>
                        )}
                        {item.status === 'Pending' && (
                          <>
                            <button 
                              onClick={() => handleUpdateStatus(item.payment_id, 'Completed')}
                              className="px-2 py-1 border border-green-500 text-green-400 rounded hover:bg-green-500 hover:text-white transition-colors text-sm"
                            >
                              <i className="bi bi-check-lg"></i> Approve
                            </button>
                            <button 
                              onClick={() => handleUpdateStatus(item.payment_id, 'Failed')}
                              className="px-2 py-1 border border-red-500 text-red-400 rounded hover:bg-red-500 hover:text-white transition-colors text-sm"
                            >
                              <i className="bi bi-x-lg"></i> Reject
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
            {payments.length > 0 && (
              <tfoot>
                <tr className="bg-black/20 text-lg">
                  <td colSpan={3} className="p-4 text-right font-bold text-white">Total Displayed:</td>
                  <td className="p-4 text-green-400 font-bold border-t border-[var(--glass-border)]">
                    RM {totalAmount.toFixed(2)}
                  </td>
                  <td colSpan={3} className="p-4 border-t border-[var(--glass-border)]"></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {/* Receipt Modal */}
      {receiptUrl && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="glass-card w-full max-w-3xl shadow-2xl border border-gray-600 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-3 shrink-0">
              <h5 className="text-xl font-bold text-white flex items-center">
                <i className="bi bi-receipt text-blue-400 mr-2"></i> Payment Receipt
              </h5>
              <button onClick={() => setReceiptUrl(null)} className="text-gray-400 hover:text-white">
                <i className="bi bi-x-lg text-2xl"></i>
              </button>
            </div>
            <div className="flex-1 overflow-auto flex justify-center items-center bg-black/50 rounded-lg p-2">
              <img src={receiptUrl} alt="Receipt" className="max-w-full max-h-full object-contain rounded" />
            </div>
          </div>
        </div>
      )}

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
            
            <form action={summaryAction}>
              <p className="text-gray-400 text-sm mb-4">Use this to quickly record total income for the day if you don't have individual transaction details.</p>
              
              <div className="mb-4">
                <label className="block text-gray-300 mb-1">Date</label>
                <input type="date" name="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-full bg-gray-800 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-300 mb-1">Total Amount (RM)</label>
                <input type="number" name="total_amount" step="0.01" placeholder="0.00" className="w-full bg-gray-800 border border-gray-600 text-green-400 text-xl font-bold rounded-md px-3 py-2 text-right focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-300 mb-1">Primary Payment Method</label>
                <select name="primary_method" className="w-full bg-gray-800 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="Cash">Cash</option>
                  <option value="QR">QR Pay</option>
                  <option value="Card">Card</option>
                  <option value="Mixed">Mixed</option>
                </select>
              </div>

              {summaryState?.error && (
                <div className="text-red-400 text-sm mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded">
                  <i className="bi bi-x-circle mr-1"></i> {summaryState.error}
                </div>
              )}
              
              <div className="flex justify-end gap-3 border-t border-gray-700 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-gray-500 text-gray-300 rounded-md hover:bg-gray-800 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isSummaryPending} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium">
                  {isSummaryPending ? 'Saving...' : 'Save Income'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
