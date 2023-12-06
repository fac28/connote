'use client';

import { useState, useEffect, useRef } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Input } from '@nextui-org/react';
import { useRouter } from 'next/navigation';

const supabase = createClientComponentClient();

const PasswordReset: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');

  const handlePasswordRecovery = async (password: string, token: string) => {
    try {
      const updateData = {
        password,
      };

      const { data, error } = await supabase.auth.updateUser(updateData, {});

      if (data) {
        const router = useRouter();
        alert('Password updated successfully!');
        router.push('/poemLibrary');
      }

      if (error) {
        alert('There was an error updating your password.');
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
      alert('An unexpected error occurred');
    }
  };

  useEffect(() => {
    const url = new URL(window.location.href);
    const token = url.searchParams.get('token');
    const type = url.searchParams.get('type');

    if (type === 'recovery' && token) {
      handlePasswordRecovery(newPassword, token);
    }
  }, [newPassword]);

  const handleResetClick = () => {
    if (newPassword) {
      handlePasswordRecovery(newPassword, '');
    } else {
      alert('Password cannot be empty.');
    }
  };

  return (
    <div>
      <h2 className='sub-heading'>Reset password</h2>
      <form className='flex flex-col items-center mt-10 gap-10'>
        <p className='mt-2 text-sm italic'>Enter your new password</p>
        <div className='flex flex-col items-center gap-1'>
          <Input
            size='md'
            type='password'
            onChange={(e) => setNewPassword(e.target.value)}
            value={newPassword}
            label='Password'
            labelPlacement='inside'
            isRequired
          />
        </div>

        <button className='button' onClick={handleResetClick}>
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default PasswordReset;
