const fs = require('fs');
const path = require('path');

const actionsPath = path.join(__dirname, 'src/app/admin/(authenticated)/payments/actions.ts');
let content = fs.readFileSync(actionsPath, 'utf8');

const newAction = `
export async function addPaymentSummary(prevState: any, formData: FormData) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const date = formData.get("date") as string;
  const total_amount = Number(formData.get("total_amount"));
  const primary_method = formData.get("primary_method") as string;

  if (!date || !total_amount) {
    return { error: "Date and Total Amount are required." };
  }

  const { error } = await supabase.from('payment_summaries').insert({
    date,
    total_amount,
    primary_method
  });

  if (error) {
    if (error.code === '42P01') {
      return { error: "The 'payment_summaries' table does not exist. Please run the SQL script." };
    }
    return { error: error.message };
  }

  revalidatePath('/admin/payments');
  return { success: true };
}
`;

fs.writeFileSync(actionsPath, content + newAction);
console.log("Added addPaymentSummary to actions.ts");
