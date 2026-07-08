import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import PaymentsView from './PaymentsView';

export const revalidate = 0; // Disable static caching so it always loads fresh data

export default async function PaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; year?: string }>;
}) {
  const params = await searchParams;
  const month = params.month || String(new Date().getMonth() + 1);
  const year = params.year || String(new Date().getFullYear());

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const startDate = `${year}-${month.padStart(2, '0')}-01T00:00:00.000Z`;
  // Get last day of the month by rolling over to day 0 of next month
  const endDateObj = new Date(Number(year), Number(month), 0, 23, 59, 59, 999);
  const endDate = endDateObj.toISOString();

  // Fetch payments with joined service names
  const { data: payments } = await supabase
    .from('payments')
    .select('*, services(service_name)')
    .gte('date_time', startDate)
    .lte('date_time', endDate)
    .order('date_time', { ascending: false });

  return <PaymentsView payments={payments || []} />;
}
