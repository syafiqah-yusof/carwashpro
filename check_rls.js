const { createClient } = require('@supabase/supabase-js');
const SUPABASE_URL = 'https://brnrleenumjzdommqkbm.supabase.co';
const SUPABASE_SERVICE_ROLE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJybnJsZWVudW1qemRvbW1xa2JtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNjE5OTkxMSwiZXhwIjoyMDUxNzc1OTExfQ.D6oM6hBtef-uT_1b1x_c6zK6rUrtmI91m6p1ZrtU1w8';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

async function checkRLS() {
  const { data, error } = await supabase.from('employees').select('*').limit(2);
  console.log("Service Role Fetch Data:", data?.length);

  const anonClient = createClient(SUPABASE_URL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJybnJsZWVudW1qemRvbW1xa2JtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYxOTk5MTEsImV4cCI6MjA1MTc3NTkxMX0.Tz4aG-Kx9Wj3Bw2s9P15u7BvI9R5522e8P1r2336l7o');
  const { data: anonData, error: anonError } = await anonClient.from('employees').select('*').limit(2);
  console.log("Anon Fetch Data:", anonData?.length, "Error:", anonError);
}

checkRLS();
