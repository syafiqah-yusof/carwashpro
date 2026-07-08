"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function logoutCustomer() {
  const cookieStore = await cookies();
  cookieStore.delete("customer_id");
  redirect("/portal/login");
}

export async function updateCustomerProfile(prevState: any, formData: FormData) {
  const cookieStore = await cookies();
  const customerId = cookieStore.get("customer_id")?.value;

  if (!customerId) {
    return { error: "Not logged in" };
  }

  const fullName = formData.get("fullName") as string;
  const phoneNumber = formData.get("phoneNumber") as string;
  const oldPassword = formData.get("oldPassword") as string;
  const newPassword = formData.get("newPassword") as string;

  if (!fullName || !oldPassword) {
    return { error: "Name and Current Password are required." };
  }

  const supabase = createClient(cookieStore);

  // Use RPC to securely verify old password and update profile
  const { data: success, error } = await supabase
    .rpc("update_customer_profile", {
      c_id: customerId,
      p_name: fullName,
      p_phone: phoneNumber || null,
      p_old_pin: oldPassword,
      p_new_pin: newPassword || null
    });

  if (error || !success) {
    console.error("Update Profile Error:", error);
    return { error: "Invalid Current Password or unable to update." };
  }

  return { success: true };
}

export async function uploadReceipt(prevState: any, formData: FormData) {
  const cookieStore = await cookies();
  const customerId = cookieStore.get("customer_id")?.value;

  if (!customerId) {
    return { error: "Not logged in" };
  }

  const supabase = createClient(cookieStore);
  const file = formData.get("receiptFile") as File;
  
  if (!file || file.size === 0) {
    return { error: "Please select an image file." };
  }

  try {
    // 1. Upload to Supabase Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${customerId}-${Date.now()}.${fileExt}`;
    
    // We assume the user has a "receipts" bucket.
    // Note: If RLS blocks this, the user needs to add a Storage policy.
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('receipts')
      .upload(fileName, file);

    if (uploadError) {
      console.error("Storage Upload Error:", uploadError);
      return { error: "Failed to upload image. Please ensure the receipts bucket is public and allows inserts." };
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('receipts')
      .getPublicUrl(fileName);

    // 2. Fetch customer plate
    const { data: customer } = await supabase.rpc('get_customer_profile', { c_id: customerId }).single();
    
    // 3. Insert into payments via RPC (to bypass RLS)
    const { error: dbError } = await supabase.rpc('submit_receipt', {
      c_id: customerId,
      p_plate: (customer as any)?.primary_vehicle_plate || 'Unknown',
      p_url: publicUrl
    });

    if (dbError) {
      console.error("Submit Receipt Error:", dbError);
      return { error: "Receipt uploaded, but failed to link to your account." };
    }

    return { success: true };
  } catch (err) {
    console.error(err);
    return { error: "An unexpected error occurred during upload." };
  }
}
