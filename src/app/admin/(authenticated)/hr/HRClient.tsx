"use client";
import { useState, useActionState, useEffect } from "react";
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { checkInEmployee, generatePayroll, requestCashAdvance, quickCheckIn, updateAdvanceDate } from './actions';

export default function HRClient({
  tab, employees, attendance, advances, payroll
}: {
  tab: string;
  employees: any[];
  attendance: any[];
  advances: any[];
  payroll: any[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentMonth = searchParams.get('month') || String(new Date().getMonth() + 1);
  const currentYear = searchParams.get('year') || String(new Date().getFullYear());
  const currentEmployee = searchParams.get('employee') || 'all';

  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [isAdvanceOpen, setIsAdvanceOpen] = useState(false);
  const [isPayrollModalOpen, setIsPayrollModalOpen] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [checkInDate, setCheckInDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedEmpId, setSelectedEmpId] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const [checkInState, checkInAction, isCheckingIn] = useActionState(checkInEmployee, null);
  const [advanceState, advanceAction, isAdvancing] = useActionState(requestCashAdvance, null);

  useEffect(() => {
    if (checkInState?.success) setIsCheckInOpen(false);
  }, [checkInState]);

  useEffect(() => {
    if (advanceState?.success) setIsAdvanceOpen(false);
  }, [advanceState]);

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'all') params.delete(key);
    else params.set(key, value);
    router.push(`/admin/hr?${params.toString()}`);
  };

  const handleGeneratePayroll = async () => {
    setIsGenerating(true);
    await generatePayroll(Number(currentMonth), Number(currentYear));
    setIsGenerating(false);
  };

  const tabs = [
    { id: 'employees', label: 'Employees', icon: 'bi-people-fill' },
    { id: 'attendance', label: 'Attendance', icon: 'bi-calendar-check' },
    { id: 'advances', label: 'Cash Advances', icon: 'bi-cash-coin' },
    { id: 'payroll', label: 'Payroll', icon: 'bi-receipt-cutoff' },
  ];

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const years = [2024, 2025, 2026, 2027];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <i className="bi bi-person-badge text-purple-400 mr-2"></i> HR & Staff Management
        </h2>
        <div className="flex gap-2 flex-wrap">
          {tab === 'attendance' && (
            <button onClick={() => setIsCheckInOpen(true)} className="btn-primary bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors shadow-lg">
              <i className="bi bi-check2-circle mr-2"></i> Record Attendance
            </button>
          )}
          {tab === 'advances' && (
            <button onClick={() => setIsAdvanceOpen(true)} className="btn-primary bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors shadow-lg">
              <i className="bi bi-cash mr-2"></i> Request Advance
            </button>
          )}
          {tab === 'payroll' && (
            <button 
              onClick={handleGeneratePayroll} 
              disabled={isGenerating}
              className="btn-primary bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors shadow-lg disabled:opacity-50"
            >
              <i className={`bi ${isGenerating ? 'bi-hourglass-split' : 'bi-calculator'} mr-2`}></i> 
              {isGenerating ? 'Generating...' : `Generate ${months[Number(currentMonth)-1]} Payroll`}
            </button>
          )}
          {tab === 'employees' && (
            <button className="btn-primary bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors shadow-lg">
              <i className="bi bi-person-plus mr-2"></i> Add Employee
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-gray-700 overflow-x-auto pb-1">
        {tabs.map((t) => {
          const params = new URLSearchParams(searchParams.toString());
          params.set('tab', t.id);
          return (
            <Link
              key={t.id}
              href={`/admin/hr?${params.toString()}`}
              className={`px-4 py-2 font-medium whitespace-nowrap rounded-t-lg transition-colors flex items-center ${
                tab === t.id
                  ? 'bg-purple-600/20 text-purple-400 border-b-2 border-purple-500'
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border-b-2 border-transparent'
              }`}
            >
              <i className={`bi ${t.icon} mr-2`}></i> {t.label}
            </Link>
          );
        })}
      </div>

      {/* Filters (Show for everything except Employee list) */}
      {tab !== 'employees' && (
        <div className="glass-card p-4 mb-4 flex flex-wrap gap-4 items-center">
          <span className="text-gray-300 font-medium mr-2"><i className="bi bi-funnel mr-1"></i> Filters:</span>
          
          <select 
            value={currentMonth}
            onChange={(e) => handleFilterChange('month', e.target.value)}
            className="bg-gray-800 border border-gray-600 text-white rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {months.map((m, i) => (
              <option key={i+1} value={i+1}>{m}</option>
            ))}
          </select>
          
          <select 
            value={currentYear}
            onChange={(e) => handleFilterChange('year', e.target.value)}
            className="bg-gray-800 border border-gray-600 text-white rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>

          <select 
            value={currentEmployee}
            onChange={(e) => handleFilterChange('employee', e.target.value)}
            className="bg-gray-800 border border-gray-600 text-white rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-500 max-w-[200px]"
          >
            <option value="all">All Employees</option>
            {employees.map(emp => (
              <option key={emp.employee_id} value={emp.employee_id}>{emp.full_name}</option>
            ))}
          </select>
        </div>
      )}

      {/* Content */}
      <div className="glass-card p-0 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto w-full">
          {tab === 'employees' && (
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-center bg-black/30 p-4 border-b border-[var(--glass-border)] gap-4">
                <h3 className="text-xl font-bold text-white">Staff List</h3>
                <div className="flex items-center gap-2 bg-gray-800/50 p-2 rounded-lg border border-gray-700">
                  <label className="text-sm text-gray-400">Quick Check-in Date:</label>
                  <input 
                    type="date" 
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="bg-gray-900 border border-gray-600 text-white rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500" 
                  />
                </div>
              </div>
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead className="bg-black/30 border-b border-[var(--glass-border)]">
                  <tr>
                    <th className="p-4 text-gray-300 font-medium">Name</th>
                    <th className="p-4 text-gray-300 font-medium">Position</th>
                    <th className="p-4 text-gray-300 font-medium">Contact</th>
                    <th className="p-4 text-gray-300 font-medium">Daily Rate</th>
                    <th className="p-4 text-gray-300 font-medium">Status</th>
                    <th className="p-4 text-gray-300 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.length === 0 ? (
                    <tr><td colSpan={6} className="text-center text-gray-500 py-10">No employees found.</td></tr>
                  ) : (
                    employees.map(item => (
                      <tr key={item.employee_id} className="border-b border-[var(--glass-border)] hover:bg-white/5 transition-colors">
                        <td className="p-4 font-bold text-white">{item.full_name}</td>
                        <td className="p-4 text-gray-300">{item.position}</td>
                        <td className="p-4 text-gray-300">{item.contact_number || '-'}</td>
                        <td className="p-4 text-green-400 font-bold">RM {(Number(item.daily_rate) || 0).toFixed(2)}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 text-xs rounded-full border ${item.status === 'Active' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}>
                            {item.status || 'Unknown'}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button 
                            onClick={async (e) => {
                              const btn = e.currentTarget;
                              btn.innerHTML = '<i class="bi bi-hourglass-split"></i>';
                              await quickCheckIn(item.employee_id, checkInDate);
                              btn.innerHTML = '<i class="bi bi-check-circle mr-1"></i> Checked In';
                              btn.className = 'px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded text-sm';
                            }}
                            className="px-3 py-1 bg-cyan-600 hover:bg-cyan-700 text-white rounded text-sm transition-colors shadow-lg"
                          >
                            <i className="bi bi-person-check mr-1"></i> Check In {checkInDate === new Date().toISOString().split('T')[0] ? 'Today' : checkInDate}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'attendance' && (
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead className="bg-black/30 border-b border-[var(--glass-border)]">
                <tr>
                  <th className="p-4 text-gray-300 font-medium">Date</th>
                  <th className="p-4 text-gray-300 font-medium">Employee</th>
                  <th className="p-4 text-gray-300 font-medium">Check In</th>
                  <th className="p-4 text-gray-300 font-medium">Advances</th>
                  <th className="p-4 text-gray-300 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {attendance.length === 0 ? (
                  <tr><td colSpan={5} className="text-center text-gray-500 py-10">No attendance records found for this filter.</td></tr>
                ) : (
                  attendance.map(item => (
                    <tr key={item.attendance_id} className="border-b border-[var(--glass-border)] hover:bg-white/5 transition-colors">
                      <td className="p-4 text-gray-300">{new Date(item.date).toLocaleDateString()}</td>
                      <td className="p-4 font-medium text-white">{item.employees?.full_name || 'Unknown'}</td>
                      <td className="p-4 text-gray-300">{item.check_in_time ? item.check_in_time : '-'}</td>
                      <td className="p-4 text-gray-300">
                        {item.daily_advance > 0 && <span className="text-cyan-400 text-sm block">Daily: RM{item.daily_advance}</span>}
                        {item.meal_advance > 0 && <span className="text-yellow-400 text-sm block">Meal: RM{item.meal_advance}</span>}
                        {(!item.daily_advance && !item.meal_advance) && '-'}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 text-xs rounded-full border ${item.status === 'Present' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}>
                          {item.status || 'Present'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {tab === 'advances' && (
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead className="bg-black/30 border-b border-[var(--glass-border)]">
                <tr>
                  <th className="p-4 text-gray-300 font-medium">Date</th>
                  <th className="p-4 text-gray-300 font-medium">Employee</th>
                  <th className="p-4 text-gray-300 font-medium">Amount</th>
                  <th className="p-4 text-gray-300 font-medium">Type</th>
                  <th className="p-4 text-gray-300 font-medium">Description</th>
                </tr>
              </thead>
              <tbody>
                {advances.length === 0 ? (
                  <tr><td colSpan={5} className="text-center text-gray-500 py-10">No cash advances found for this filter.</td></tr>
                ) : (
                  advances.map(item => (
                    <tr key={item.id} className="border-b border-[var(--glass-border)] hover:bg-white/5 transition-colors">
                      <td className="p-4 text-gray-300">
                        <div className="flex flex-col gap-1 w-36">
                          <input 
                            type="date" 
                            id={`adv-date-${item.id}`}
                            defaultValue={new Date(item.date).toISOString().split('T')[0]}
                            className="bg-gray-800 border border-gray-600 rounded focus:border-cyan-500 focus:outline-none text-gray-300 text-xs p-1"
                          />
                          <button 
                            onClick={async (e) => {
                              const btn = e.currentTarget;
                              btn.innerHTML = 'Saving...';
                              const val = (document.getElementById(`adv-date-${item.id}`) as HTMLInputElement).value;
                              const res = await updateAdvanceDate(item.id, val);
                              if (res?.error) {
                                alert(res.error);
                                btn.innerHTML = 'Save Date';
                              } else {
                                btn.innerHTML = 'Saved!';
                                setTimeout(() => { btn.innerHTML = 'Save Date'; }, 2000);
                              }
                            }}
                            className="bg-cyan-600/30 text-cyan-400 hover:bg-cyan-600 hover:text-white border border-cyan-500/50 transition-colors text-xs px-2 py-1 rounded"
                          >
                            Save Date
                          </button>
                        </div>
                      </td>
                      <td className="p-4 font-medium text-white">{item.employees?.full_name || item.employee_name || 'Unknown'}</td>
                      <td className="p-4 text-yellow-400 font-bold">RM {(item.amount || 0).toFixed(2)}</td>
                      <td className="p-4 text-gray-300">{item.record_type || 'Cash Advance'}</td>
                      <td className="p-4 text-gray-300">{item.description || '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {tab === 'payroll' && (
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead className="bg-black/30 border-b border-[var(--glass-border)]">
                <tr>
                  <th className="p-4 text-gray-300 font-medium">Month/Year</th>
                  <th className="p-4 text-gray-300 font-medium">Employee</th>
                  <th className="p-4 text-gray-300 font-medium">Days Worked</th>
                  <th className="p-4 text-gray-300 font-medium">Base Salary</th>
                  <th className="p-4 text-gray-300 font-medium">Total Deductions</th>
                  <th className="p-4 text-gray-300 font-medium text-right">Net Pay</th>
                  <th className="p-4 text-gray-300 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {payroll.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center text-gray-500 py-10">
                      No payroll records generated for {months[Number(currentMonth)-1]} {currentYear}. <br/>
                      <button onClick={handleGeneratePayroll} className="mt-4 text-green-400 underline hover:text-green-300">Click Generate Payroll above to calculate it.</button>
                    </td>
                  </tr>
                ) : (
                  payroll.map(item => {
                    const totalDeductions = (Number(item.advance_salary) || 0) + (Number(item.daily_advance_total) || 0) + (Number(item.meal_advance_total) || 0);
                    return (
                      <tr key={item.payroll_id} className="border-b border-[var(--glass-border)] hover:bg-white/5 transition-colors">
                        <td className="p-4 text-gray-300">{item.month}/{item.year}</td>
                        <td className="p-4 font-medium text-white">{item.employees?.full_name || 'Unknown'}</td>
                        <td className="p-4 text-gray-300 font-bold">{item.days_worked}</td>
                        <td className="p-4 text-gray-300">RM {(Number(item.base_salary) || 0).toFixed(2)}</td>
                        <td className="p-4 text-red-400">- RM {totalDeductions.toFixed(2)}</td>
                        <td className="p-4 text-green-400 font-bold text-right text-lg">RM {(Number(item.final_salary) || 0).toFixed(2)}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 text-xs rounded-full border ${item.status === 'Paid' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'}`}>
                            {item.status || 'Draft'}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modals */}
      {isCheckInOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="glass-card w-full max-w-md shadow-2xl border border-gray-600">
            <h5 className="text-xl font-bold text-white mb-4 border-b border-gray-700 pb-3">Record Attendance</h5>
            <form action={checkInAction} className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm mb-1">Date</label>
                <input type="date" name="date" required defaultValue={new Date().toISOString().split('T')[0]} className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1">Employee</label>
                <select name="employee_id" required className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500">
                  <option value="">Select Employee</option>
                  {employees.filter(e => e.status === 'Active').map(e => (
                    <option key={e.employee_id} value={e.employee_id}>{e.full_name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm mb-1">Check In Time</label>
                  <input type="time" name="check_in_time" defaultValue="09:00" className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm mb-1">Status</label>
                  <select name="status" className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500">
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                    <option value="Half-Day">Half-Day</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm mb-1">Daily Advance (RM)</label>
                  <input type="number" name="daily_advance" defaultValue="0" className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm mb-1">Meal Advance (RM)</label>
                  <input type="number" name="meal_advance" defaultValue="0" className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                </div>
              </div>
              
              {checkInState?.error && <p className="text-red-400 text-sm p-2 bg-red-500/10 rounded">{checkInState.error}</p>}

              <div className="flex justify-end gap-3 border-t border-gray-700 pt-4 mt-6">
                <button type="button" onClick={() => setIsCheckInOpen(false)} className="px-4 py-2 border border-gray-500 text-gray-300 rounded hover:bg-gray-800 transition-colors">Cancel</button>
                <button type="submit" disabled={isCheckingIn} className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700 transition-colors">{isCheckingIn ? 'Saving...' : 'Save Record'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isAdvanceOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="glass-card w-full max-w-md shadow-2xl border border-gray-600">
            <h5 className="text-xl font-bold text-white mb-4 border-b border-gray-700 pb-3">Request Special Advance</h5>
            <form action={advanceAction} className="space-y-4">
              <p className="text-sm text-yellow-400 mb-2 bg-yellow-500/10 p-2 rounded">
                Note: 15th-of-month advances are strictly checked against eligibility rules (Minimum 10 days worked).
              </p>
              <div>
                <label className="block text-gray-300 text-sm mb-1">Date</label>
                <input type="date" name="date" required defaultValue={new Date().toISOString().split('T')[0]} className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500" />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1">Employee</label>
                <select name="employee_id" required className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500">
                  <option value="">Select Employee</option>
                  {employees.filter(e => e.status === 'Active').map(e => (
                    <option key={e.employee_id} value={e.employee_id}>{e.full_name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1">Amount (RM)</label>
                <input type="number" name="amount" required placeholder="0.00" className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500" />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1">Description / Reason</label>
                <input type="text" name="description" placeholder="e.g. Mid-month 15th request" className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500" />
              </div>

              {advanceState?.error && <p className="text-red-400 text-sm p-2 bg-red-500/10 rounded font-medium border border-red-500/20"><i className="bi bi-x-circle mr-1"></i> {advanceState.error}</p>}

              <div className="flex justify-end gap-3 border-t border-gray-700 pt-4 mt-6">
                <button type="button" onClick={() => setIsAdvanceOpen(false)} className="px-4 py-2 border border-gray-500 text-gray-300 rounded hover:bg-gray-800 transition-colors">Cancel</button>
                <button type="submit" disabled={isAdvancing} className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors">{isAdvancing ? 'Processing...' : 'Submit Request'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
