"use server";

import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function addExpense(prevState: any, formData: FormData) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const date = formData.get("date") as string;
  const category = formData.get("category") as string;
  const amount = Number(formData.get("amount"));
  const description = formData.get("description") as string;
  const file = formData.get("receipt") as File | null;

  if (!date || !category || !amount) {
    return { error: "Date, Category, and Amount are required." };
  }

  let receipt_url = null;

  if (file && file.size > 0) {
    // Check if the receipts bucket exists, if not, user needs to create it in Supabase
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('receipts')
      .upload(fileName, file);

    if (uploadError) {
      return { error: `Failed to upload receipt. Please ensure a 'receipts' bucket exists and is public in Supabase Storage. Details: ${uploadError.message}` };
    }

    const { data: publicUrlData } = supabase.storage
      .from('receipts')
      .getPublicUrl(fileName);

    receipt_url = publicUrlData.publicUrl;
  }

  const { error } = await supabase.from('expenses').insert({
    date,
    category,
    amount,
    description,
    receipt_url
  });

  if (error) {
    // Provide a helpful hint if the table is missing
    if (error.code === '42P01') {
      return { error: "The 'expenses' table does not exist in the database. Please run the provided SQL script to create it." };
    }
    return { error: error.message };
  }

  revalidatePath('/admin/expenses');
  return { success: true };
}
