const fs = require('fs');
const path = require('path');

const actionsPath = path.join(__dirname, 'src/app/admin/(authenticated)/hr/actions.ts');
let content = fs.readFileSync(actionsPath, 'utf8');

const newAction = `
export async function updateAdvanceDate(id: number, new_date: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase
    .from('cash_advances')
    .update({ date: new_date })
    .eq('id', id);

  if (error) {
    console.error('Error updating advance date:', error);
    return { error: error.message };
  }

  revalidatePath('/admin/hr');
  return { success: true };
}
`;

fs.writeFileSync(actionsPath, content + newAction);
console.log("Added updateAdvanceDate to actions.ts");
