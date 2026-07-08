import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import PaymentsView from './PaymentsView';

export const revalidate = 0; // Disable static caching so it always loads fresh data

export default async function PaymentsPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Fetch payments with joined service names
  const { data: payments } = await supabase
    .from('payments')
    .select('*, services(service_name)')
    .order('date_time', { ascending: false });

  return <PaymentsView payments={payments || []} />;
}
