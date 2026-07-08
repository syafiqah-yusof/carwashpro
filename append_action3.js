const fs = require('fs');
const path = require('path');

const actionsPath = path.join(__dirname, 'src/app/admin/(authenticated)/payments/actions.ts');
let content = fs.readFileSync(actionsPath, 'utf8');

const newAction = `
export async function updatePaymentDate(payment_id: number, new_date: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase
    .from('payments')
    .update({ date_time: new_date })
    .eq('payment_id', payment_id);

  if (error) {
    console.error('Error updating payment date:', error);
    return { error: error.message };
  }

  revalidatePath('/admin/payments');
  return { success: true };
}
`;

fs.writeFileSync(actionsPath, content + newAction);
console.log("Added updatePaymentDate to actions.ts");
