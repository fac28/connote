'use client';
import { useState, useEffect, useMemo, useRef } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const supabase = createClientComponentClient();

const PasswordReset: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const newPasswordRef = useRef<string | null>(null);

  const handlePasswordRecovery = async () => {
    try {
      const currentNewPassword = newPasswordRef.current;

      if (!currentNewPassword) {
        alert('Password cannot be empty.');
        return;
      }

      const { data, error } = await supabase.auth.updateUser({
        password: currentNewPassword,
      });

      if (data) {
        alert('Password updated successfully!');
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
    newPasswordRef.current = newPassword;
  }, [newPassword]);

  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        await handlePasswordRecovery();
      }
    });
  }, []);

  return (
    <div>
      <h1>Password Reset Page</h1>
      <p>Enter your new password:</p>
      <input
        type='password'
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <button onClick={handlePasswordRecovery}>Reset Password</button>
    </div>
  );
};

export default PasswordReset;
