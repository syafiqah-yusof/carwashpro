import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import InventoryView from './InventoryView';

export const revalidate = 0;

export default async function InventoryPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // We are catching the error in case the inventory table isn't created yet
  const { data: inventoryItems, error } = await supabase
    .from('inventory')
    .select('*')
    .order('item_name', { ascending: true });

  return <InventoryView items={inventoryItems || []} tableError={!!error} />;
}
