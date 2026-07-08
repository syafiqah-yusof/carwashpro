"use client";
import { useState, useActionState, useEffect } from "react";
import { addInventoryItem } from "./actions";

export default function InventoryView({ items, tableError }: { items: any[], tableError: boolean }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(addInventoryItem, null);

  useEffect(() => {
    if (state?.success) {
      setIsModalOpen(false);
    }
  }, [state?.success]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <i className="bi bi-box-seam text-blue-400 mr-2"></i> Inventory Manager
        </h2>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn-primary bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors shadow-lg"
          >
            <i className="bi bi-plus-circle mr-2"></i> Add Item
          </button>
        </div>
      </div>

      {tableError && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-lg flex items-center">
          <i className="bi bi-exclamation-triangle-fill text-xl mr-3"></i>
          <div>
            <strong>Missing Database Table:</strong> The Inventory table has not been created in Supabase yet. Please run the SQL command provided to create the table.
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="glass-card flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-1">Total Items</p>
            <h3 className="text-2xl font-bold text-white">{items.length}</h3>
          </div>
          <div className="bg-blue-500/20 p-3 rounded-xl border border-blue-500/30">
            <i className="bi bi-boxes text-2xl text-blue-400"></i>
          </div>
        </div>
        <div className="glass-card flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-1">Low Stock Alerts</p>
            <h3 className="text-2xl font-bold text-red-400">
              {items.filter(i => i.quantity <= i.min_threshold).length}
            </h3>
          </div>
          <div className="bg-red-500/20 p-3 rounded-xl border border-red-500/30">
            <i className="bi bi-exclamation-circle text-2xl text-red-400"></i>
          </div>
        </div>
      </div>

      <div className="glass-card p-0 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-black/30 border-b border-[var(--glass-border)]">
              <tr>
                <th className="p-4 text-gray-300 font-medium">Item Name</th>
                <th className="p-4 text-gray-300 font-medium">Category</th>
                <th className="p-4 text-gray-300 font-medium">Quantity</th>
                <th className="p-4 text-gray-300 font-medium">Status</th>
                <th className="p-4 text-gray-300 font-medium">Last Restocked</th>
                <th className="p-4 text-gray-300 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {!tableError && items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center text-gray-500 py-10">No inventory items found. Add your first item!</td>
                </tr>
              ) : (
                items.map(item => {
                  const isLowStock = item.quantity <= item.min_threshold;
                  return (
                    <tr key={item.id} className="border-b border-[var(--glass-border)] hover:bg-white/5 transition-colors">
                      <td className="p-4 font-bold text-white">{item.item_name}</td>
                      <td className="p-4 text-gray-300">{item.category}</td>
                      <td className={`p-4 font-medium ${isLowStock ? 'text-red-400' : 'text-gray-300'}`}>
                        {item.quantity} <span className="text-sm text-gray-500">{item.unit}</span>
                      </td>
                      <td className="p-4">
                        {isLowStock ? (
                          <span className="px-2 py-1 text-xs rounded-full border bg-red-500/20 text-red-400 border-red-500/30">
                            Low Stock (Min: {item.min_threshold})
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs rounded-full border bg-green-500/20 text-green-400 border-green-500/30">
                            In Stock
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-gray-400 text-sm">
                        {item.last_restocked ? new Date(item.last_restocked).toLocaleDateString() : '-'}
                      </td>
                      <td className="p-4 flex gap-2">
                        <button className="px-3 py-1 border border-cyan-500 text-cyan-400 rounded hover:bg-cyan-500 hover:text-black transition-colors text-sm">
                          <i className="bi bi-plus-lg mr-1"></i> Stock
                        </button>
                        <button className="px-2 py-1 border border-yellow-500 text-yellow-500 rounded hover:bg-yellow-500 hover:text-black transition-colors text-sm">
                          <i className="bi bi-pencil"></i>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Item Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="glass-card w-full max-w-md shadow-2xl border border-gray-600">
            <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-3">
              <h5 className="text-xl font-bold text-white flex items-center">
                <i className="bi bi-box-seam text-blue-400 mr-2"></i> Add Inventory Item
              </h5>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            
            <form action={formAction}>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-1 text-sm">Item Name</label>
                  <input type="text" name="item_name" required placeholder="e.g. Premium Carnauba Wax" className="w-full bg-gray-800 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-1 text-sm">Category</label>
                  <select name="category" className="w-full bg-gray-800 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="Shampoo & Soap">Shampoo & Soap</option>
                    <option value="Wax & Polish">Wax & Polish</option>
                    <option value="Cleaning Supplies">Cleaning Supplies</option>
                    <option value="Equipment">Equipment</option>
                    <option value="Uniforms">Uniforms</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-1 text-sm">Initial Quantity</label>
                    <input type="number" name="quantity" defaultValue={0} required className="w-full bg-gray-800 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1 text-sm">Unit (e.g. Bottles, Liters)</label>
                    <input type="text" name="unit" placeholder="Bottles" required className="w-full bg-gray-800 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 mb-1 text-sm">Minimum Threshold Alert</label>
                  <input type="number" name="min_threshold" defaultValue={5} className="w-full bg-gray-800 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <p className="text-xs text-gray-500 mt-1">Triggers a red warning if stock falls to this number or below.</p>
                </div>
              </div>

              {state?.error && (
                <div className="mt-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg flex items-center">
                  <i className="bi bi-exclamation-circle mr-2"></i>
                  {state.error}
                </div>
              )}
              
              <div className="flex justify-end gap-3 border-t border-gray-700 pt-4 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-gray-500 text-gray-300 rounded-md hover:bg-gray-800 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isPending} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium flex items-center">
                  {isPending ? "Saving..." : "Save Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
