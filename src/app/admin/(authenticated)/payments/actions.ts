"use server";

import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function updatePaymentStatus(paymentId: number, status: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase
    .from('payments')
    .update({ status })
    .eq('payment_id', paymentId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin/payments');
  return { success: true };
}

export async function addPaymentSummary(prevState: any, formData: FormData) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const date = formData.get("date") as string;
  const total_amount = Number(formData.get("total_amount"));
  const primary_method = formData.get("primary_method") as string;

  if (!date || !total_amount) {
    return { error: "Date and Total Amount are required." };
  }

  const { error } = await supabase.from('payment_summaries').insert({
    date,
    total_amount,
    primary_method
  });

  if (error) {
    if (error.code === '42P01') {
      return { error: "The 'payment_summaries' table does not exist. Please run the SQL script." };
    }
    return { error: error.message };
  }

  revalidatePath('/admin/payments');
  return { success: true };
}

export async function updatePaymentDate(payment_id: number, new_date: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase
    .from('payments')
    .update({ date_time: new_date })
    .eq('payment_id', payment_id);

  if (error) {
    console.error('Error updating payment date:', error);
    return { error: error.message };
  }

  revalidatePath('/admin/payments');
  return { success: true };
}
