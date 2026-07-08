"use client";
import { useState, useActionState, useEffect } from "react";
import { addExpense } from "./actions";
import { useRouter, useSearchParams } from 'next/navigation';

export default function ExpensesClient({ expenses, error }: { expenses: any[], error: string | null }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentMonth = searchParams.get('month') || String(new Date().getMonth() + 1);
  const currentYear = searchParams.get('year') || String(new Date().getFullYear());

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
  
  const [state, action, isPending] = useActionState(addExpense, null);

  useEffect(() => {
    if (state?.success) setIsModalOpen(false);
  }, [state]);

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    router.push(`/admin/expenses?${params.toString()}`);
  };

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const currentY = new Date().getFullYear();
  const years = [currentY - 2, currentY - 1, currentY];

  const totalAmount = expenses.reduce((acc, curr) => acc + Number(curr.amount), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-2">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <i className="bi bi-wallet2 text-purple-400 mr-2"></i> Expenses Tracker
        </h2>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn-primary bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors shadow-lg"
          >
            <i className="bi bi-plus-circle mr-2"></i> Add Expense
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-400 p-4 rounded-lg flex items-start gap-3">
          <i className="bi bi-exclamation-triangle-fill text-xl mt-0.5"></i>
          <div>
            <h4 className="font-bold">Database Error</h4>
            <p className="text-sm">{error}</p>
            {error.includes('does not exist') && (
              <p className="text-sm mt-2 font-medium text-white">
                Please ask the developer or run the `expenses_tables.sql` script in Supabase to create the table!
              </p>
            )}
          </div>
        </div>
      )}

      <div className="glass-card p-4">
        <div className="flex flex-wrap items-center gap-4">
          <label className="text-white font-medium">Select Month:</label>
          <select 
            value={currentMonth}
            onChange={(e) => handleFilterChange('month', e.target.value)}
            className="bg-gray-800 border border-gray-600 text-white rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {months.map((m, i) => (
              <option key={i+1} value={i+1}>{m}</option>
            ))}
          </select>
          
          <select 
            value={currentYear}
            onChange={(e) => handleFilterChange('year', e.target.value)}
            className="bg-gray-800 border border-gray-600 text-white rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="glass-card p-0 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead className="bg-black/30">
              <tr className="border-b border-[var(--glass-border)]">
                <th className="p-4 text-gray-300 font-medium">Date</th>
                <th className="p-4 text-gray-300 font-medium">Category</th>
                <th className="p-4 text-gray-300 font-medium">Description</th>
                <th className="p-4 text-gray-300 font-medium">Amount</th>
                <th className="p-4 text-gray-300 font-medium text-right">Receipt</th>
              </tr>
            </thead>
            <tbody>
              {expenses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center text-gray-500 py-8">No expenses found for {months[Number(currentMonth)-1]} {currentYear}.</td>
                </tr>
              ) : (
                expenses.map(item => (
                  <tr key={item.expense_id} className="border-b border-[var(--glass-border)] hover:bg-white/5 transition-colors">
                    <td className="p-4 text-gray-300">{new Date(item.date).toLocaleDateString()}</td>
                    <td className="p-4 font-medium text-white">
                      <span className="px-2 py-1 text-xs rounded-full border bg-purple-500/20 text-purple-400 border-purple-500/30">
                        {item.category}
                      </span>
                    </td>
                    <td className="p-4 text-gray-300">{item.description || '-'}</td>
                    <td className="p-4 text-yellow-400 font-bold text-lg">RM {Number(item.amount).toFixed(2)}</td>
                    <td className="p-4 text-right">
                      {item.receipt_url ? (
                        <button 
                          onClick={() => setReceiptUrl(item.receipt_url)}
                          className="px-2 py-1 border border-blue-500 text-blue-400 rounded hover:bg-blue-500 hover:text-white transition-colors text-sm"
                        >
                          <i className="bi bi-file-earmark-image mr-1"></i> View Receipt
                        </button>
                      ) : (
                        <span className="text-gray-500 text-sm">No receipt</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {expenses.length > 0 && (
              <tfoot>
                <tr className="bg-black/20 text-lg">
                  <td colSpan={3} className="p-4 text-right font-bold text-white">Total Expenses:</td>
                  <td colSpan={2} className="p-4 text-yellow-400 font-bold border-t border-[var(--glass-border)]">
                    RM {totalAmount.toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {/* Add Expense Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass-card w-full max-w-md shadow-2xl border border-gray-600">
            <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-3">
              <h5 className="text-xl font-bold text-white flex items-center">
                <i className="bi bi-wallet2 text-purple-500 mr-2"></i> Add Expense
              </h5>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            
            <form action={action} className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-1 text-sm">Date</label>
                <input type="date" name="date" required defaultValue={new Date().toISOString().split('T')[0]} className="w-full bg-gray-800 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>

              <div>
                <label className="block text-gray-300 mb-1 text-sm">Category</label>
                <select name="category" required className="w-full bg-gray-800 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option value="Utilities">Utilities</option>
                  <option value="Rent">Rent</option>
                  <option value="Supplies">Supplies</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-gray-300 mb-1 text-sm">Amount (RM)</label>
                <input type="number" name="amount" step="0.01" required placeholder="0.00" className="w-full bg-gray-800 border border-gray-600 text-yellow-400 text-xl font-bold rounded-md px-3 py-2 text-right focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>

              <div>
                <label className="block text-gray-300 mb-1 text-sm">Description (Optional)</label>
                <input type="text" name="description" placeholder="e.g. Electric Bill July" className="w-full bg-gray-800 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>

              <div>
                <label className="block text-gray-300 mb-1 text-sm">Upload Receipt (Image)</label>
                <input type="file" name="receipt" accept="image/*" className="w-full text-gray-300 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-500/20 file:text-purple-400 hover:file:bg-purple-500/30" />
              </div>
              
              {state?.error && (
                <div className="text-red-400 text-sm p-3 bg-red-500/10 border border-red-500/30 rounded">
                  <i className="bi bi-x-circle mr-1"></i> {state.error}
                </div>
              )}
              
              <div className="flex justify-end gap-3 border-t border-gray-700 pt-4 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-gray-500 text-gray-300 rounded-md hover:bg-gray-800 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isPending} className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors font-medium">
                  {isPending ? 'Saving...' : 'Save Expense'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Receipt Modal */}
      {receiptUrl && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="glass-card w-full max-w-3xl shadow-2xl border border-gray-600 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-3 shrink-0">
              <h5 className="text-xl font-bold text-white flex items-center">
                <i className="bi bi-receipt text-blue-400 mr-2"></i> Expense Receipt
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
    </div>
  );
}
