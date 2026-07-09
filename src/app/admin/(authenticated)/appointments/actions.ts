"use server";

import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function approveAppointment(id: number, time: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase
    .from('appointments')
    .update({ status: 'Approved', appointment_time: time || null })
    .eq('appointment_id', id);

  if (error) return { error: error.message };

  revalidatePath('/admin/appointments');
  return { success: true };
}

export async function rejectAppointment(id: number) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase
    .from('appointments')
    .update({ status: 'Rejected' })
    .eq('appointment_id', id);

  if (error) return { error: error.message };

  revalidatePath('/admin/appointments');
  return { success: true };
}
