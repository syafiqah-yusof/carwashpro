"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function loginCustomer(prevState: any, formData: FormData) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const vehiclePlate = formData.get("vehiclePlate") as string;
  const password = formData.get("password") as string;

  if (!vehiclePlate || !password) {
    return { error: "Please enter both Plate Number and Password." };
  }

  // Call secure RPC function
  const { data: customerId, error } = await supabase
    .rpc("login_customer", {
      plate: vehiclePlate,
      entered_password: password
    });

  if (error) {
    console.error("Supabase RPC Error:", error);
  }

  if (error || !customerId) {
    return { error: "Invalid Plate Number or Password." };
  }

  // Set auth cookie for customer
  cookieStore.set("customer_id", customerId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
  });

  return { success: true };
}
