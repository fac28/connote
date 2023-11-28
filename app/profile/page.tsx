import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types/supabase';
import AccountForm from './account-form';
import CheckedPoems from '@/components/CheckedPoems';

export default async function Account() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <>
      <h1 className='headingPurple font-playfair'>Profile</h1>
      <AccountForm session={session} />;
      <CheckedPoems />
    </>
  );
}
