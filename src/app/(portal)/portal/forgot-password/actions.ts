"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function resetPassword(prevState: any, formData: FormData) {
  const vehiclePlate = formData.get("vehiclePlate") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!vehiclePlate || !newPassword || !confirmPassword) {
    return { error: "Please fill in all fields." };
  }

  if (newPassword !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  if (newPassword.length < 4) {
    return { error: "Password must be at least 4 characters." };
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: success, error } = await supabase.rpc("reset_customer_password", {
    p_plate: vehiclePlate.trim().toUpperCase(),
    p_new_pin: newPassword,
  });

  if (error || !success) {
    console.error("Reset Password Error:", error);
    return { error: "Customer with this plate number not found." };
  }

  return { success: true };
}
