'use client';
import { useCallback, useEffect, useState } from 'react';
import { Input } from '@nextui-org/react';
import {
  Session,
  createClientComponentClient,
} from '@supabase/auth-helpers-nextjs';

export default function AccountForm({ session }: { session: Session | null }) {
  const supabase = createClientComponentClient<any>();
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);
  const user = session?.user;

  const getProfile = useCallback(async () => {
    try {
      setLoading(true);

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`username`)
        .eq('id', user?.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
      }
    } catch (error) {
      alert('Error loading user data!');
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    getProfile();
  }, [user, getProfile]);

  async function updateProfile({ username }: { username: string | null }) {
    try {
      setLoading(true);

      const { error } = await supabase.from('profiles').upsert({
        id: user?.id as string,

        username,

        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      alert('Profile updated!');
    } catch (error) {
      alert('Error updating the data!');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className=' flex flex-col items-center gap-4 mt-4'>
      <div className='profileForm bg-white rounded-xl'>
        <Input
          size='sm'
          label='Email'
          id='email'
          type='text'
          value={session?.user.email}
          isReadOnly
          labelPlacement='inside'
        />
      </div>
      <div className='profileForm'>
        <Input
          size='sm'
          label='Username'
          id='username'
          type='text'
          value={username || ''}
          onChange={(e) => setUsername(e.target.value)}
          labelPlacement='inside'
        />
      </div>
      <div>
        <button
          className=' text-xs bg-connote_orange hover:opacity-80 active:scale-95 rounded-xl text-white p-1 duration-150'
          onClick={() => updateProfile({ username })}
          disabled={loading}
        >
          {loading ? 'Loading ...' : 'Update'}
        </button>
      </div>

      <div>
        <form action='/signout' method='post'>
          <button
            className='bg-connote_orange hover:opacity-80 active:scale-95 rounded-xl text-white p-2 duration-150'
            type='submit'
          >
            Logout
          </button>
        </form>
      </div>
    </div>
  );
}
