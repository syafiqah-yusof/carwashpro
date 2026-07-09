"use client";

import { useState, useActionState, useEffect } from "react";
import { addVehicleJob, checkInAppointment } from "./actions";

type Customer = { customer_id: string; full_name: string; primary_vehicle_plate: string; phone_number: string; };
type Appointment = { appointment_id: number; customer_id: string; vehicle_plate: string; appointment_date: string; appointment_time: string; service_notes: string; customers?: Customer; };

export default function NewArrivalModal({ customers, appointments }: { customers: Customer[], appointments: Appointment[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState<'walkin' | 'appointments'>('walkin');
  const [searchPlate, setSearchPlate] = useState('');
  
  const [plateInput, setPlateInput] = useState('');
  
  const [addState, formAction, isAdding] = useActionState(addVehicleJob, null);

  useEffect(() => {
    if (addState?.success) {
      setIsOpen(false);
      setSearchPlate('');
      setPlateInput('');
    }
  }, [addState]);

  const handleCheckInAppt = async (appt: Appointment) => {
    const res = await checkInAppointment(appt.appointment_id, appt.vehicle_plate, appt.customer_id, appt.service_notes);
    if (res.error) {
      alert(res.error);
    } else {
      setIsOpen(false);
    }
  };

  const filteredCustomers = customers.filter(c => c.primary_vehicle_plate?.toLowerCase().includes(searchPlate.toLowerCase()) || c.full_name?.toLowerCase().includes(searchPlate.toLowerCase()));

  return (
    <>
      <button 
        onClick={() => { setIsOpen(true); setPlateInput(''); setSearchPlate(''); }}
        className="btn-primary flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-lg"
      >
        <i className="bi bi-car-front-fill mr-2"></i> New Arrival
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass-card w-full max-w-xl shadow-2xl border border-gray-600 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-3 shrink-0">
              <h5 className="text-xl font-bold text-white flex items-center">
                <i className="bi bi-car-front-fill text-blue-400 mr-2"></i> Register Arrival
              </h5>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <div className="flex gap-2 mb-4 border-b border-gray-700 pb-2 shrink-0">
              <button 
                onClick={() => setTab('walkin')} 
                className={`px-4 py-2 rounded font-medium transition-colors ${tab === 'walkin' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
              >
                Walk-in Entry
              </button>
              <button 
                onClick={() => setTab('appointments')} 
                className={`px-4 py-2 rounded font-medium transition-colors flex items-center ${tab === 'appointments' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
              >
                Today's Appointments
                {appointments.length > 0 && <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{appointments.length}</span>}
              </button>
            </div>

            <div className="flex-1 overflow-auto p-1">
              {tab === 'walkin' ? (
                <form action={formAction} className="space-y-4">
                  <div className="bg-blue-500/10 border border-blue-500/30 p-3 rounded-lg mb-4">
                    <label className="block text-gray-300 font-semibold mb-1 text-sm">Search Existing Customer (Optional)</label>
                    <input 
                      type="text" 
                      placeholder="Search by plate or name..." 
                      value={searchPlate}
                      onChange={(e) => setSearchPlate(e.target.value)}
                      className="w-full bg-gray-800/50 border border-gray-600 rounded text-white px-3 py-2 focus:border-blue-500 text-sm mb-2"
                    />
                    {searchPlate && (
                      <div className="max-h-32 overflow-y-auto bg-gray-900 border border-gray-700 rounded p-1 space-y-1">
                        {filteredCustomers.length === 0 ? <p className="text-gray-500 text-xs text-center py-2">No matching customers found.</p> : null}
                        {filteredCustomers.map(c => (
                          <label key={c.customer_id} className="flex items-center gap-2 p-2 hover:bg-gray-800 rounded cursor-pointer border border-transparent hover:border-gray-700">
                            <input 
                              type="radio" 
                              name="customer_id" 
                              value={c.customer_id} 
                              className="accent-blue-500" 
                              onChange={() => setPlateInput(c.primary_vehicle_plate || '')}
                            />
                            <div className="flex-1">
                              <p className="text-white text-sm font-bold">{c.primary_vehicle_plate} <i className="bi bi-star-fill text-yellow-500 text-xs"></i></p>
                              <p className="text-gray-400 text-xs">{c.full_name} • {c.phone_number}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-300 font-semibold mb-1">Vehicle Plate <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      name="vehicle_plate" 
                      value={plateInput}
                      onChange={(e) => setPlateInput(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg text-white px-3 py-2 uppercase focus:border-blue-500 focus:outline-none" 
                      placeholder="e.g. VFC 1234" 
                    />
                    <p className="text-xs text-gray-500 mt-1">If you selected a customer above, this will override their primary plate.</p>
                  </div>

                  <div>
                    <label className="block text-gray-300 font-semibold mb-1">Notes / Service Type</label>
                    <input type="text" name="notes" className="w-full bg-gray-800 border border-gray-600 rounded-lg text-white px-3 py-2 focus:border-blue-500 focus:outline-none" placeholder="e.g. Wash & Vacuum" />
                  </div>

                  {addState?.error && (
                    <div className="text-red-400 bg-red-500/20 border border-red-500/50 p-2 rounded text-sm">
                      <i className="bi bi-exclamation-triangle mr-1"></i> {addState.error}
                    </div>
                  )}

                  <div className="pt-2 flex justify-end gap-2">
                    <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 border border-gray-600 text-gray-300 rounded hover:bg-gray-800 transition-colors">
                      Cancel
                    </button>
                    <button type="submit" disabled={isAdding} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition-colors disabled:opacity-50">
                      {isAdding ? 'Adding...' : 'Add to Waiting List'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-3">
                  {appointments.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 border border-dashed border-gray-700 rounded-lg">
                      <i className="bi bi-calendar-x text-3xl mb-2 block"></i>
                      <p>No more pending appointments for today.</p>
                    </div>
                  ) : (
                    appointments.map(appt => (
                      <div key={appt.appointment_id} className="bg-gray-800/80 border border-gray-700 rounded-lg p-4 shadow-md flex items-center justify-between gap-4">
                        <div>
                          <h5 className="text-white font-bold text-lg mb-1">{appt.vehicle_plate}</h5>
                          <p className="text-gray-400 text-sm"><i className="bi bi-person mr-1"></i> {appt.customers?.full_name}</p>
                          <p className="text-gray-400 text-sm mt-1">
                            <i className="bi bi-clock mr-1 text-blue-400"></i> {appt.appointment_time || 'No specific time'}
                          </p>
                          {appt.service_notes && (
                            <p className="text-gray-300 text-sm mt-2 italic bg-gray-900/50 p-2 rounded border border-gray-700">
                              "{appt.service_notes}"
                            </p>
                          )}
                        </div>
                        <button 
                          onClick={async (e) => {
                            const btn = e.currentTarget;
                            btn.disabled = true;
                            btn.innerHTML = '<i class="bi bi-hourglass-split"></i>';
                            await handleCheckInAppt(appt);
                          }}
                          className="px-4 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg shadow-lg hover:-translate-y-1 transition-all flex items-center shrink-0"
                        >
                          <i className="bi bi-box-arrow-in-right mr-2"></i> Arrived
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
