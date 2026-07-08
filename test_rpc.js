const { createClient } = require('@supabase/supabase-js');
const SUPABASE_URL = 'https://brnrleenumjzdommqkbm.supabase.co';
const SUPABASE_SERVICE_ROLE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJybnJsZWVudW1qemRvbW1xa2JtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzQ4MjMyMCwiZXhwIjoyMDk5MDU4MzIwfQ.VcQHyimopiznaQ3VgBvEZJY0iCf34BSlSsVtc6hyJQM';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

async function check() {
  const { data, error } = await supabase.rpc('execute_sql', { sql: 'SELECT 1' });
  console.log(error || data);
}

check();
