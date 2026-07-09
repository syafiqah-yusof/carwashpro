"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function addVehicleJob(prevState: any, formData: FormData) {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    let plate = formData.get("vehicle_plate") as string;
    const customerId = formData.get("customer_id") as string || null;
    const notes = formData.get("notes") as string || '';

    if (!plate && !customerId) {
      return { error: "Please provide a vehicle plate." };
    }

    if (!plate && customerId) {
      // Fetch primary plate if they only selected a customer
      const { data: customer } = await supabase.from('customers').select('primary_vehicle_plate').eq('customer_id', customerId).single();
      plate = customer?.primary_vehicle_plate || '';
    }

    if (!plate) return { error: "Vehicle plate is required." };

    plate = plate.trim().toUpperCase();

    const { error } = await supabase.from('vehicle_jobs').insert([{
      vehicle_plate: plate,
      customer_id: customerId || null,
      notes: notes,
      status: 'Waiting',
      arrival_time: new Date().toISOString()
    }]);

    if (error) {
      console.error("Insert Job Error:", error);
      return { error: "Database error while adding vehicle." };
    }

    revalidatePath("/admin/workflow");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Unknown error occurred" };
  }
}

export async function checkInAppointment(appointmentId: number, plate: string, customerId: string, notes: string) {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    // 1. Insert into vehicle_jobs
    const { error: jobError } = await supabase.from('vehicle_jobs').insert([{
      vehicle_plate: plate,
      customer_id: customerId || null,
      notes: notes || 'Booked Appt',
      status: 'Waiting',
      arrival_time: new Date().toISOString()
    }]);

    if (jobError) throw jobError;

    // 2. Update appointment status
    const { error: apptError } = await supabase.from('appointments').update({
      status: 'Arrived'
    }).eq('appointment_id', appointmentId);

    if (apptError) throw apptError;

    revalidatePath("/admin/workflow");
    return { success: true };
  } catch (err: any) {
    console.error("Check-in Error:", err);
    return { error: err.message || "Unknown error occurred" };
  }
}

export async function updateJobStatus(jobId: string, newStatus: string) {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    // Fetch the current job to check its status and customer_id
    const { data: job, error: jobFetchError } = await supabase
      .from('vehicle_jobs')
      .select('status, customer_id')
      .eq('vehicle_job_id', jobId)
      .single();

    if (jobFetchError) throw jobFetchError;

    const updateData: any = { status: newStatus };
    if (newStatus === 'Ready' || newStatus === 'Completed') {
      updateData.completion_time = new Date().toISOString();
    }

    const { error } = await supabase
      .from('vehicle_jobs')
      .update(updateData)
      .eq('vehicle_job_id', jobId);

    if (error) throw error;

    // Increment total_washes if transitioning to Completed and it wasn't already Completed
    if (newStatus === 'Completed' && job.status !== 'Completed' && job.customer_id) {
      const { data: cust } = await supabase
        .from('customers')
        .select('total_washes')
        .eq('customer_id', job.customer_id)
        .single();
        
      if (cust) {
        await supabase
          .from('customers')
          .update({ total_washes: (cust.total_washes || 0) + 1 })
          .eq('customer_id', job.customer_id);
      }
    }

    revalidatePath("/admin/workflow");
    revalidatePath("/admin/customers");
    return { success: true };
  } catch (err: any) {
    console.error("Update Status Error:", err);
    return { error: err.message || "Unknown error occurred" };
  }
}
