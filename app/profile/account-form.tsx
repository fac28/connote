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
  const [message, setMessage] = useState<string | null>(null);
  const user = session?.user;

  const getProfile = useCallback(async () => {
    try {
      setLoading(true);
      setMessage(null);

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
      setMessage('Error loading user data!');
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
      setMessage(null);

      const { error } = await supabase.from('profiles').upsert({
        id: user?.id as string,

        username,

        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      setMessage('Profile updated!');
    } catch (error) {
      setMessage('Sorry, that username is already taken.');
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
          className='button'
          onClick={() => updateProfile({ username })}
          disabled={loading}
        >
          {loading ? 'Loading ...' : 'Update'}
        </button>
      </div>
      {message && <div className='message'>{message}</div>}
    </div>
  );
}
