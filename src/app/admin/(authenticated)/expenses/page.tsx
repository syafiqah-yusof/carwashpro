import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import ExpensesClient from './ExpensesClient';

export const revalidate = 0;

export default async function ExpensesPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string, year?: string }>;
}) {
  const params = await searchParams;
  const month = params.month || String(new Date().getMonth() + 1);
  const year = params.year || String(new Date().getFullYear());

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const startDate = `${year}-${month.padStart(2, '0')}-01`;
  const endDate = new Date(Number(year), Number(month), 0).toISOString().split('T')[0];

  // Safely fetch expenses. If table doesn't exist yet, this will fail gracefully or we handle it in Client.
  const { data: expenses, error } = await supabase
    .from('expenses')
    .select('*')
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: false });

  return (
    <ExpensesClient 
      expenses={expenses || []}
      error={error ? error.message : null}
    />
  );
}
