"use server";

import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function checkInEmployee(prevState: any, formData: FormData) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const employee_id = formData.get("employee_id") as string;
  const date = formData.get("date") as string;
  const check_in_time = formData.get("check_in_time") as string;
  const daily_advance = Number(formData.get("daily_advance")) || 0;
  const meal_advance = Number(formData.get("meal_advance")) || 0;
  const status = formData.get("status") as string;

  if (!employee_id || !date) {
    return { error: "Employee and date are required." };
  }

  // Upsert attendance
  const { error } = await supabase.from('attendance').upsert({
    employee_id,
    date,
    check_in_time: check_in_time || null,
    daily_advance,
    meal_advance,
    status
  }, { onConflict: 'employee_id, date' });

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin/hr');
  return { success: true };
}

export async function generatePayroll(month: number, year: number) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // 1. Get all employees
  const { data: employees } = await supabase.from('employees').select('*');
  if (!employees) return { error: "No employees found" };

  // 2. Fetch all attendance for this month
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const endDate = new Date(year, month, 0).toISOString().split('T')[0]; // Last day of month

  const { data: attendance } = await supabase
    .from('attendance')
    .select('*')
    .gte('date', startDate)
    .lte('date', endDate);

  const att = attendance || [];

  // 3. For each employee, calculate totals
  const payrolls = employees.map(emp => {
    const empAtt = att.filter(a => a.employee_id === emp.employee_id);
    
    // Days worked = Present status or has check in time
    const daysWorked = empAtt.filter(a => a.status === 'Present').length;
    
    const dailyAdvTotal = empAtt.reduce((sum, a) => sum + (Number(a.daily_advance) || 0), 0);
    const mealAdvTotal = empAtt.reduce((sum, a) => sum + (Number(a.meal_advance) || 0), 0);
    
    const baseSalary = daysWorked * (Number(emp.daily_rate) || 0);
    const finalSalary = baseSalary - dailyAdvTotal - mealAdvTotal;

    return {
      employee_id: emp.employee_id,
      month: String(month),
      year: String(year),
      base_salary: baseSalary,
      days_worked: daysWorked,
      daily_advance_total: dailyAdvTotal,
      meal_advance_total: mealAdvTotal,
      final_salary: finalSalary,
      status: 'Draft',
      generated_date: new Date().toISOString()
    };
  });

  // 4. Delete existing payroll for this month/year to prevent duplicates
  await supabase
    .from('payroll')
    .delete()
    .eq('month', String(month))
    .eq('year', String(year));

  // 5. Insert new payrolls
  const { error } = await supabase.from('payroll').insert(payrolls);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin/hr');
  return { success: true };
}

export async function requestCashAdvance(prevState: any, formData: FormData) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const employee_id = formData.get("employee_id") as string;
  const date = formData.get("date") as string;
  const amount = Number(formData.get("amount"));
  const description = formData.get("description") as string;

  if (!employee_id || !amount) {
    return { error: "Employee and Amount are required." };
  }

  // 15th Check Eligibility
  const day = new Date(date).getDate();
  if (day === 15) {
    const month = new Date(date).getMonth() + 1;
    const year = new Date(date).getFullYear();
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const endDate = date;

    const { data: att } = await supabase
      .from('attendance')
      .select('status, daily_advance, meal_advance')
      .eq('employee_id', employee_id)
      .gte('date', startDate)
      .lte('date', endDate);

    const empAtt = att || [];
    const daysWorked = empAtt.filter(a => a.status === 'Present').length;

    if (daysWorked < 10) {
      return { error: `Employee is not eligible for advance. Only ${daysWorked} days worked this month (minimum 10 required).` };
    }

    const { data: emp } = await supabase.from('employees').select('daily_rate').eq('employee_id', employee_id).single();
    const dailyRate = Number(emp?.daily_rate || 0);

    const baseSalarySoFar = daysWorked * dailyRate;
    const currentAdvances = empAtt.reduce((sum, a) => sum + (Number(a.daily_advance) || 0) + (Number(a.meal_advance) || 0), 0);
    const maxAdvance = baseSalarySoFar - currentAdvances;

    if (amount > maxAdvance) {
      return { error: `Advance exceeds maximum allowed limit. Maximum eligible advance is RM ${maxAdvance.toFixed(2)}.` };
    }
  }

  const { error } = await supabase.from('cash_advances').insert({
    employee_id,
    date,
    amount,
    description,
    record_type: 'Cash Advance'
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin/hr');
  return { success: true };
}

export async function quickCheckIn(employee_id: string, dateStr: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const date = dateStr || new Date().toISOString().split('T')[0];
  const check_in_time = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

  const { error } = await supabase.from('attendance').upsert({
    employee_id,
    date,
    check_in_time,
    daily_advance: 0,
    meal_advance: 0,
    status: 'Present'
  }, { onConflict: 'employee_id, date' });

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin/hr');
  return { success: true };
}
