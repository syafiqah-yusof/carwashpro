import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import AppointmentsClient from './AppointmentsClient';

export const revalidate = 0;

export default async function AppointmentsPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Fetch appointments with customer details
  const { data: appointments } = await supabase
    .from('appointments')
    .select(`
      *,
      customers (full_name)
    `)
    .order('appointment_date', { ascending: false })
    .order('appointment_time', { ascending: true });

  return <AppointmentsClient appointments={appointments || []} />;
}
