import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import NewArrivalModal from './NewArrivalModal';
import WorkflowStatusButton from './WorkflowStatusButton';

export const revalidate = 0; // Disable static caching so it always loads fresh data

export default async function WorkflowPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Fetch jobs with customer info for WhatsApp
  const { data: jobs } = await supabase.from('vehicle_jobs').select('*, customers(full_name, phone_number)').order('arrival_time', { ascending: true });
  
  // Fetch all customers for Walk-In search
  const { data: customers } = await supabase.from('customers').select('*').order('full_name', { ascending: true });

  // Fetch today's approved appointments for one-click check-in
  const today = new Date().toISOString().split('T')[0];
  const { data: appointments } = await supabase
    .from('appointments')
    .select('*, customers(full_name, phone_number, primary_vehicle_plate)')
    .eq('appointment_date', today)
    .eq('status', 'Approved')
    .order('appointment_time', { ascending: true });

  const waiting = jobs?.filter(j => j.status === 'Waiting') || [];
  const washing = jobs?.filter(j => j.status === 'Washing') || [];
  const ready = jobs?.filter(j => j.status === 'Ready') || [];
  const completed = jobs?.filter(j => j.status === 'Completed') || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Vehicle Workflow Kanban</h2>
        <NewArrivalModal customers={customers || []} appointments={appointments || []} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 min-h-[70vh]">
        
        {/* Waiting Column */}
        <div className="glass-card flex flex-col p-4 border-t-4 border-t-red-500">
          <h5 className="text-center font-bold text-white mb-4">
            <i className="bi bi-pause-circle text-red-500 mr-2"></i> 
            Waiting ({waiting.length})
          </h5>
          <div className="flex-1 space-y-3">
            {waiting.map(job => (
              <div key={job.vehicle_job_id} className="bg-gray-800/80 border border-gray-700/50 rounded-lg p-3 shadow-md hover:-translate-y-1 transition-transform">
                <h5 className="text-white font-bold mb-1 flex items-center justify-between">
                  {job.vehicle_plate}
                  {job.customer_id && <i className="bi bi-star-fill text-yellow-400 text-sm" title="Member"></i>}
                </h5>
                <p className="text-gray-400 text-sm mb-3">
                  <i className="bi bi-clock mr-1"></i> 
                  {new Date(job.arrival_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  {job.notes && <><br /><i className="italic text-gray-500">{job.notes}</i></>}
                </p>
                <WorkflowStatusButton 
                  jobId={job.vehicle_job_id} 
                  targetStatus="Washing" 
                  label="Start Washing" 
                  iconClass="bi bi-arrow-right ml-1" 
                  className="w-full py-1.5 rounded-md border border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black transition-colors text-sm font-medium" 
                />
              </div>
            ))}
          </div>
        </div>

        {/* Washing Column */}
        <div className="glass-card flex flex-col p-4 border-t-4 border-t-yellow-500">
          <h5 className="text-center font-bold text-white mb-4">
            <i className="bi bi-droplet-half text-yellow-500 mr-2"></i> 
            Washing ({washing.length})
          </h5>
          <div className="flex-1 space-y-3">
            {washing.map(job => (
              <div key={job.vehicle_job_id} className="bg-gray-800/80 border-l-4 border-l-yellow-500 rounded-lg p-3 shadow-md hover:-translate-y-1 transition-transform">
                <h5 className="text-white font-bold mb-1 flex items-center justify-between">
                  {job.vehicle_plate}
                  {job.customer_id && <i className="bi bi-star-fill text-yellow-400 text-sm"></i>}
                </h5>
                <p className="text-gray-400 text-sm mb-3">
                  <i className="bi bi-clock mr-1"></i> 
                  {new Date(job.arrival_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </p>
                <div className="flex flex-col space-y-2">
                  <WorkflowStatusButton 
                    jobId={job.vehicle_job_id} 
                    targetStatus="Ready" 
                    label="Mark Ready" 
                    iconClass="bi bi-arrow-right ml-1" 
                    className="w-full py-1.5 rounded-md border border-cyan-500 text-cyan-500 hover:bg-cyan-500 hover:text-black transition-colors text-sm font-medium" 
                  />
                  <button className="w-full py-1.5 rounded-md border border-gray-600 text-gray-300 hover:bg-gray-700 transition-colors text-sm font-medium">
                    <i className="bi bi-people-fill text-yellow-500 mr-1"></i> Assign Polishers
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ready Column */}
        <div className="glass-card flex flex-col p-4 border-t-4 border-t-cyan-500">
          <h5 className="text-center font-bold text-white mb-4">
            <i className="bi bi-car-front text-cyan-500 mr-2"></i> 
            Ready ({ready.length})
          </h5>
          <div className="flex-1 space-y-3">
            {ready.map(job => (
              <div key={job.vehicle_job_id} className="bg-gray-800/80 border-l-4 border-l-cyan-500 rounded-lg p-3 shadow-md hover:-translate-y-1 transition-transform">
                <h5 className="text-white font-bold mb-1 flex items-center justify-between">
                  {job.vehicle_plate}
                  {job.customer_id && <i className="bi bi-star-fill text-yellow-400 text-sm"></i>}
                </h5>
                <p className="text-gray-400 text-sm mb-3">
                  <i className="bi bi-check2-circle text-green-500 mr-1"></i> 
                  Ready at {job.completion_time ? new Date(job.completion_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '...'}
                </p>
                <div className="flex flex-col gap-2">
                  <WorkflowStatusButton 
                    jobId={job.vehicle_job_id} 
                    targetStatus="Completed" 
                    label="Complete / Paid" 
                    iconClass="bi bi-check-lg ml-1" 
                    className="w-full py-1.5 rounded-md bg-green-600 hover:bg-green-500 text-white transition-colors text-sm font-medium" 
                  />
                  
                  {job.customers?.phone_number && (
                    <a 
                      href={`https://wa.me/${job.customers.phone_number.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${job.customers.full_name},\n\nYour car (${job.vehicle_plate}) is shining and ready for pickup at AKC Car Wash!`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-1.5 rounded-md bg-[#25D366] hover:bg-[#1DA851] text-white transition-colors text-sm font-medium flex justify-center items-center shadow-lg"
                    >
                      <i className="bi bi-whatsapp mr-1"></i> Notify Customer
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Completed Column */}
        <div className="glass-card flex flex-col p-4 border-t-4 border-t-green-500">
          <h5 className="text-center font-bold text-white mb-4">
            <i className="bi bi-check-circle-fill text-green-500 mr-2"></i> 
            Completed Today ({completed.length})
          </h5>
          <div className="flex-1 space-y-3">
            {completed.map(job => (
              <div key={job.vehicle_job_id} className="bg-gray-800/80 border border-gray-700 opacity-75 rounded-lg p-3 shadow-md">
                <h5 className="text-white font-bold mb-1">
                  {job.vehicle_plate}
                </h5>
                <p className="text-gray-400 text-sm">
                  Done at {job.completion_time ? new Date(job.completion_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '...'}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
