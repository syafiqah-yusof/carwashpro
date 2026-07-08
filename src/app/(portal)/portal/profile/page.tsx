import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import ProfileForm from './ProfileForm';

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const customerId = cookieStore.get('customer_id')?.value;

  if (!customerId) {
    redirect('/portal/login');
  }

  const supabase = createClient(cookieStore);

  const { data: customer, error } = await supabase
    .rpc('get_customer_profile', { c_id: customerId })
    .single();

  if (error || !customer) {
    redirect('/portal/login');
  }

  return <ProfileForm customer={customer} />;
}
