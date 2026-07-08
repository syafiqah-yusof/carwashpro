const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://brnrleenumjzdommqkbm.supabase.co';
const SUPABASE_SERVICE_ROLE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJybnJsZWVudW1qemRvbW1xa2JtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzQ4MjMyMCwiZXhwIjoyMDk5MDU4MzIwfQ.VcQHyimopiznaQ3VgBvEZJY0iCf34BSlSsVtc6hyJQM';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

async function dumpSchema() {
  // Query information_schema.columns
  const { data, error } = await supabase.rpc('get_schema_info');
  // Wait, RPC might not exist. I'll just query the tables directly if possible.
  // Actually, I can't query information_schema directly via JS client.
  // Instead, I'll just do a select limit 1 on expected tables to see what columns exist.
  
  const tables = ['employees', 'attendance', 'payroll', 'cash_advances', 'payments', 'services', 'customers', 'inventory'];
  
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('*').limit(1);
    if (error) {
      console.log(`Table ${table} error: ${error.message}`);
    } else if (data) {
      console.log(`Table ${table} columns:`, data.length > 0 ? Object.keys(data[0]).join(', ') : 'Empty table, columns not retrieved (unless data inserted)');
    }
  }
}
dumpSchema();
