import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import HRClient from './HRClient';

export const revalidate = 0;

export default async function HRPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string, month?: string, year?: string, employee?: string }>;
}) {
  const params = await searchParams;
  const tab = params.tab || 'employees';
  const month = params.month || String(new Date().getMonth() + 1);
  const year = params.year || String(new Date().getFullYear());
  const employeeId = params.employee;

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Fetch all employees for the filters and Employees tab
  const { data: allEmployees } = await supabase.from('employees').select('*').order('full_name', { ascending: true });
  const employees = allEmployees || [];

  let attendance = [];
  let advances = [];
  let payroll = [];

  // Helper to get date ranges for the selected month/year
  const startDate = `${year}-${month.padStart(2, '0')}-01`;
  const endDate = new Date(Number(year), Number(month), 0).toISOString().split('T')[0];

  if (tab === 'attendance') {
    let query = supabase.from('attendance')
      .select('*, employees(full_name)')
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false });
    
    if (employeeId) query = query.eq('employee_id', employeeId);
    
    const { data } = await query;
    attendance = data || [];
  } else if (tab === 'advances') {
    let query = supabase.from('cash_advances')
      .select('*, employees(full_name)')
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false });
    
    if (employeeId) query = query.eq('employee_id', employeeId);
    
    const { data } = await query;
    advances = data || [];
  } else if (tab === 'payroll') {
    let query = supabase.from('payroll')
      .select('*, employees(full_name)')
      .eq('month', month)
      .eq('year', year)
      .order('generated_date', { ascending: false });

    if (employeeId) query = query.eq('employee_id', employeeId);
    
    const { data } = await query;
    payroll = data || [];
  }

  return (
    <HRClient 
      tab={tab}
      employees={employees}
      attendance={attendance}
      advances={advances}
      payroll={payroll}
    />
  );
}
