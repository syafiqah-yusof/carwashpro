"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function registerCustomer(prevState: any, formData: FormData) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const fullName = formData.get("fullName") as string;
  const vehiclePlate = formData.get("vehiclePlate") as string;
  const phoneNumber = formData.get("phoneNumber") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!fullName || !vehiclePlate || !password || !confirmPassword) {
    return { error: "Please fill in all mandatory fields." };
  }

  if (password !== confirmPassword) {
    // Basic validation
    return { error: "Passwords do not match." };
  }

  // Check if plate already exists
  const { data: existing } = await supabase
    .from("customers")
    .select("customer_id")
    .eq("primary_vehicle_plate", vehiclePlate)
    .single();

  if (existing) {
    return { error: "A customer with this plate number is already registered." };
  }

  // Insert customer into Supabase using secure RPC
  const { error } = await supabase.rpc('register_customer', {
    p_name: fullName,
    p_plate: vehiclePlate,
    p_phone: phoneNumber || null,
    p_pin: password,
    p_membership_id: `VIP-${Math.floor(1000 + Math.random() * 9000)}`
  });

  if (error) {
    console.error("Register Error:", error);
    return { error: "Failed to register. Please try again." };
  }

  // Redirect to login page on success
  redirect("/portal/login?registered=true");
}
