import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export const revalidate = 0;

export default async function InventoryPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Fetch inventory
  const { data: inventory } = await supabase
    .from('inventory_items')
    .select('*')
    .order('item_name', { ascending: true });

  const lowStockItems = inventory?.filter(i => Number(i.quantity_in_stock) <= Number(i.minimum_threshold)) || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <i className="bi bi-boxes text-purple-500 mr-2"></i> Inventory Management
        </h2>
        <button className="btn-primary bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors shadow-lg">
          <i className="bi bi-plus-lg mr-2"></i> Add New Item
        </button>
      </div>

      {lowStockItems.length > 0 && (
        <div className="bg-red-500/20 border border-red-500/50 p-4 rounded-lg shadow-lg">
          <h5 className="text-red-400 font-bold mb-2 flex items-center">
            <i className="bi bi-exclamation-triangle-fill mr-2"></i> Low Stock Alert!
          </h5>
          <ul className="list-disc list-inside text-red-300">
            {lowStockItems.map(item => (
              <li key={item.inventory_item_id}>
                <strong className="text-white">{item.item_name}</strong>: Only {item.quantity_in_stock} {item.unit} left (Threshold: {item.minimum_threshold}).
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="glass-card p-0 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-black/30 border-b border-[var(--glass-border)]">
              <tr>
                <th className="p-4 text-gray-300 font-medium">Item Name</th>
                <th className="p-4 text-gray-300 font-medium">Category</th>
                <th className="p-4 text-gray-300 font-medium">Stock</th>
                <th className="p-4 text-gray-300 font-medium">Unit Cost</th>
                <th className="p-4 text-gray-300 font-medium">Supplier</th>
                <th className="p-4 text-gray-300 font-medium">Last Restock</th>
                <th className="p-4 text-gray-300 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(!inventory || inventory.length === 0) ? (
                <tr>
                  <td colSpan={7} className="text-center text-gray-500 py-10">No inventory items found. Add one to get started!</td>
                </tr>
              ) : (
                inventory.map(item => {
                  const isLowStock = Number(item.quantity_in_stock) <= Number(item.minimum_threshold);

                  return (
                    <tr key={item.inventory_item_id} className="border-b border-[var(--glass-border)] hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <strong className="text-white block">{item.item_name}</strong>
                        <small className="text-gray-400">Min: {item.minimum_threshold} {item.unit}</small>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-md">
                          {item.category || 'Uncategorized'}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`text-lg ${isLowStock ? 'text-red-400 font-bold' : 'text-green-400'}`}>
                          {item.quantity_in_stock} <small className="text-gray-400">{item.unit}</small>
                        </span>
                      </td>
                      <td className="p-4 text-gray-300">
                        ${Number(item.unit_cost).toFixed(2)}
                      </td>
                      <td className="p-4 text-gray-300">
                        {item.supplier_name || '-'}
                      </td>
                      <td className="p-4 text-gray-400">
                        {new Date(item.last_restocked).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button className="px-2 py-1 border border-green-500 text-green-400 rounded hover:bg-green-500 hover:text-white transition-colors" title="Restock">
                            <i className="bi bi-box-arrow-in-down"></i>
                          </button>
                          <button className="px-2 py-1 border border-yellow-500 text-yellow-500 rounded hover:bg-yellow-500 hover:text-black transition-colors" title="Consume/Use">
                            <i className="bi bi-box-arrow-up"></i>
                          </button>
                          <button className="px-2 py-1 border border-blue-500 text-blue-400 rounded hover:bg-blue-500 hover:text-white transition-colors" title="Edit">
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button className="px-2 py-1 border border-red-500 text-red-400 rounded hover:bg-red-500 hover:text-white transition-colors" title="Delete">
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
