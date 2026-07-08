const fs = require('fs');
const path = require('path');

const actionsPath = path.join(__dirname, 'src/app/admin/(authenticated)/hr/actions.ts');
let content = fs.readFileSync(actionsPath, 'utf8');

const newAction = `
export async function quickCheckIn(employee_id: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const date = new Date().toISOString().split('T')[0];
  const check_in_time = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

  const { error } = await supabase.from('attendance').upsert({
    employee_id,
    date,
    check_in_time,
    daily_advance: 0,
    meal_advance: 0,
    status: 'Present'
  }, { onConflict: 'employee_id, date' });

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin/hr');
  return { success: true };
}
`;

fs.writeFileSync(actionsPath, content + newAction);
console.log("Added quickCheckIn to actions.ts");
