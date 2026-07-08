const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://brnrleenumjzdommqkbm.supabase.co';
const SUPABASE_SERVICE_ROLE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJybnJsZWVudW1qemRvbW1xa2JtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzQ4MjMyMCwiZXhwIjoyMDk5MDU4MzIwfQ.VcQHyimopiznaQ3VgBvEZJY0iCf34BSlSsVtc6hyJQM';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

const tablesToMigrate = [
  { file: 'Customers.csv', table: 'customers' },
  { file: 'Services.csv', table: 'services' },
  { file: 'Employees.csv', table: 'employees' },
  { file: 'Payments.csv', table: 'payments' },
  { file: 'Attendances.csv', table: 'attendance' },
  { file: 'Payrolls.csv', table: 'payroll' },
  { file: 'CashAdvances.csv', table: 'cash_advances' },
  { file: 'VehicleJobs.csv', table: 'vehicle_jobs' }
];

const csvDirectory = 'C:\\Users\\vivobook15\\Documents\\Car Wash pro';

const columnMappings = {
  employees: {
    EmployeeId: 'legacy_id',
    FullName: 'full_name',
    Phone: 'contact_number',
    Position: 'position',
    DailyRate: 'daily_rate',
    JoinDate: 'join_date',
    Status: 'status',
    MealAllowance: 'meal_allowance'
  },
  payments: {
    PaymentId: 'legacy_id',
    DateTime: 'date_time',
    CustomerName: 'customer_name',
    VehiclePlate: 'vehicle_plate',
    VehicleType: 'vehicle_type',
    ServiceId: 'legacy_service_id',
    Amount: 'amount',
    PaymentMethod: 'payment_method',
    Status: 'status',
    Notes: 'notes',
    CustomerId: 'legacy_customer_id',
    ReceiptUrl: 'receipt_url'
  },
  attendance: {
    EmployeeId: 'legacy_employee_id',
    CheckIn: 'check_in_time',
    CheckOut: 'check_out_time',
    Status: 'status',
    MealAdvance: 'meal_advance',
    DailyAdvance: 'daily_advance'
  },
  payroll: {
    EmployeeId: 'legacy_employee_id',
    Month: 'month',
    DaysWorked: 'days_worked',
    AdvanceSalary: 'advance_salary',
    FinalSalary: 'final_salary',
    MealAdvanceTotal: 'meal_advance_total',
    BaseSalary: 'base_salary',
    DailyAdvanceTotal: 'daily_advance_total',
    Status: 'status',
    CommissionTotal: 'commission_total'
  },
  cash_advances: {
    EmployeeId: 'legacy_employee_id',
    Date: 'date',
    Amount: 'amount',
    Description: 'description'
  },
  vehicle_jobs: {
    VehiclePlate: 'vehicle_plate',
    Status: 'status',
    ArrivalTime: 'arrival_time',
    CompletionTime: 'completion_time',
    Notes: 'notes',
    CustomerId: 'legacy_customer_id',
    PaymentId: 'legacy_payment_id'
  },
  customers: {
    CustomerId: 'legacy_id',
    MembershipId: 'membership_id',
    FullName: 'full_name',
    Phone: 'phone_number',
    VehiclePlate: 'primary_vehicle_plate',
    RewardPoints: 'reward_points',
    TotalVisits: 'total_visits',
    Pin: 'pin'
  },
  services: {
    ServiceId: 'legacy_id',
    ServiceName: 'service_name',
    Price: 'price',
    DurationMinutes: 'duration_minutes'
  }
};

function cleanValue(val) {
  if (!val) return null;
  val = val.trim();
  if (val.toUpperCase() === 'NULL') return null;
  if (val === '') return null;
  if (val.match(/^[0-9]+:[0-9.]+$/)) return null; 
  return val;
}

async function run() {
  console.log("========================================");
  console.log("Starting Automated Supabase Migration...");
  console.log("========================================\n");

  for (const { file, table } of tablesToMigrate) {
    const filePath = path.join(csvDirectory, file);
    
    // Skip if already uploaded (e.g. Payments and VehicleJobs)
    if (table === 'payments' || table === 'vehicle_jobs') {
       console.log(`✅ Skipping ${file} because it already uploaded successfully!`);
       continue;
    }

    if (fs.existsSync(filePath)) {
      console.log(`📄 Found ${file}! Processing...`);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      
      try {
        const records = parse(fileContent, {
          columns: true,
          skip_empty_lines: true,
          trim: true,
          bom: true
        });

        const mapping = columnMappings[table];
        
        let cleanRecords = records.map(rec => {
          // If the row is totally empty (e.g. trailing commas in Excel), skip it
          const isRowEmpty = Object.values(rec).every(v => cleanValue(v) === null);
          if (isRowEmpty) return null;

          const clean = {};
          
          for (const rawKey in rec) {
            const destKey = mapping[rawKey];
            if (destKey) {
              clean[destKey] = cleanValue(rec[rawKey]);
            }
          }

          // --- DEFAULTS FOR NOT NULL CONSTRAINTS ---
          if (table === 'employees') {
            if (!clean['position']) clean['position'] = 'Staff';
            if (!clean['join_date']) clean['join_date'] = '2026-07-08';
            if (!clean['daily_rate']) clean['daily_rate'] = 0;
            if (!clean['full_name']) clean['full_name'] = 'Unknown Employee';
          }
          if (table === 'attendance') {
            if (clean['check_in_time'] && !clean['date']) {
               const d = new Date(clean['check_in_time']);
               if (!isNaN(d)) clean['date'] = d.toISOString().split('T')[0];
            }
            if (!clean['date']) clean['date'] = '2026-07-08'; // Hard fallback
          }
          if (table === 'payroll') {
            if (!clean['month']) clean['month'] = 7;
            if (!clean['year']) clean['year'] = 2026;
            if (!clean['base_salary']) clean['base_salary'] = 0;
            if (!clean['days_worked']) clean['days_worked'] = 0;
            if (!clean['final_salary']) clean['final_salary'] = 0;
          }
          if (table === 'cash_advances') {
            if (!clean['date']) clean['date'] = '2026-07-08';
            if (!clean['amount']) clean['amount'] = 0;
          }
          if (table === 'customers') {
            if (!clean['full_name']) clean['full_name'] = 'Unknown Customer';
          }
          if (table === 'services') {
            if (!clean['service_name']) clean['service_name'] = 'Custom Service';
            if (!clean['price']) clean['price'] = 0;
            if (!clean['duration_minutes']) clean['duration_minutes'] = 30;
          }

          return clean;
        });

        // Remove the null rows we skipped
        cleanRecords = cleanRecords.filter(r => r !== null);

        const chunkSize = 500;
        let successCount = 0;
        
        for (let i = 0; i < cleanRecords.length; i += chunkSize) {
          const chunk = cleanRecords.slice(i, i + chunkSize);
          const { error } = await supabase.from(table).insert(chunk);
          
          if (error) {
            console.error(`   ❌ ERROR inserting rows into ${table}:`, error.message);
          } else {
            successCount += chunk.length;
          }
        }
        
        console.log(`   ✅ Successfully uploaded ${successCount} rows to ${table}!\n`);
      } catch (err) {
        console.error(`   ❌ Failed to parse ${file}:`, err.message);
      }
    }
  }

  console.log("🎉 Migration Script Finished!");
  console.log("   IMPORTANT: Go to Supabase SQL Editor and run the 'Magic Linker SQL' from Step 3 to reconnect the data!");
}

run();
