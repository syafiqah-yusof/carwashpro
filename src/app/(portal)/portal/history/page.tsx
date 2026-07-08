import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import HistoryView from './HistoryView';

export default async function HistoryPage() {
  const cookieStore = await cookies();
  const customerId = cookieStore.get('customer_id')?.value;

  if (!customerId) {
    redirect('/portal/login');
  }

  const supabase = createClient(cookieStore);

  // Fetch past payments (history) securely using RPC to bypass RLS
  const { data: history, error } = await supabase
    .rpc('get_customer_history', { c_id: customerId });

  if (error) {
    console.error("Fetch History Error:", error);
  }

  return <HistoryView history={history || []} />;
}
