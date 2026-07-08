const { createClient } = require('@supabase/supabase-js');

// Using your exact same project URL and Service Role Key
const SUPABASE_URL = 'https://brnrleenumjzdommqkbm.supabase.co';
const SUPABASE_SERVICE_ROLE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJybnJsZWVudW1qemRvbW1xa2JtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzQ4MjMyMCwiZXhwIjoyMDk5MDU4MzIwfQ.VcQHyimopiznaQ3VgBvEZJY0iCf34BSlSsVtc6hyJQM';

// The auth.admin API REQUIRES the Service Role key to bypass permissions
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createAdminUser() {
  console.log("========================================");
  console.log("Creating Admin User...");
  console.log("========================================\n");

  const email = "admin@akccarwash.com";
  const password = "AdminPassword123!";

  // Create the user and automatically confirm their email
  const { data, error } = await supabase.auth.admin.createUser({
    email: email,
    password: password,
    email_confirm: true,
    user_metadata: { role: 'admin' }
  });

  if (error) {
    console.error("❌ Failed to create admin:", error.message);
  } else {
    console.log("✅ Admin user created successfully!");
    console.log("\nHere are your login credentials:");
    console.log("----------------------------------------");
    console.log(`Email    : ${email}`);
    console.log(`Password : ${password}`);
    console.log("----------------------------------------");
    console.log("\nYou can now log in at: http://localhost:3000/admin");
  }
}

createAdminUser();
