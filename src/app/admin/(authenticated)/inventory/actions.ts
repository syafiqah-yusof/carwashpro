"use server";

import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function addInventoryItem(prevState: any, formData: FormData) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const item_name = formData.get("item_name") as string;
  const category = formData.get("category") as string;
  const quantity = Number(formData.get("quantity"));
  const min_threshold = Number(formData.get("min_threshold"));
  const unit = formData.get("unit") as string;

  if (!item_name || !category) {
    return { error: "Item name and category are required." };
  }

  const { error } = await supabase.from('inventory').insert([{
    item_name,
    category,
    quantity,
    min_threshold,
    unit,
    last_restocked: new Date().toISOString()
  }]);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin/inventory');
  return { success: true };
}
