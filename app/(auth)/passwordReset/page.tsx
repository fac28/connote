'use client';
import { useState, useEffect, useRef } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Input } from '@nextui-org/react';
import { useLocation } from 'react-router-dom';

const supabase: any = createClientComponentClient();

const PasswordReset: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const newPasswordRef = useRef<string | null>(null);
  const location = useLocation();

  const getResetTokenFromURL = () => {
    const queryParams = new URLSearchParams(location.search);
    return queryParams.get('token'); // Assuming the URL parameter is named 'token'
  };

  // const handlePasswordRecovery = async (password: string) => {
  //   try {
  //     const { data, error } = await supabase.auth.updateUser({
  //       password,
  //     });

  //     if (data) {
  //       alert('Password updated successfully!');
  //     }

  //     if (error) {
  //       alert('There was an error updating your password.');
  //     }
  //   } catch (error) {
  //     console.error('An unexpected error occurred:', error);
  //     alert('An unexpected error occurred');
  //   }
  // };

  const handlePasswordRecovery = async (newPassword: string) => {
    const token = getResetTokenFromURL();

    if (!token) {
      alert(
        'Token is missing. Please make sure you have accessed this page through a valid link.'
      );
      return;
    }

    try {
      // Use the token and the new password to reset the password
      const { error } = await supabase.auth.api.updateUserWithToken(token, {
        password: newPassword,
      });

      if (error) {
        console.error('Error resetting password:', error);
        alert('There was an error resetting your password.');
      } else {
        alert('Password reset successfully!');
        // Redirect the user to the login page or another appropriate page
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
      alert('An unexpected error occurred');
    }
  };

  // const handlePasswordRecovery = async (password: string) => {
  //   try {
  //     // Retrieve the current user from the session
  //     const { data, error } = await supabase.auth.getSession();

  //     if (error || !data) {
  //       console.error('Error getting user session:', error);
  //       alert('An error occurred. Please try again.');
  //       return;
  //     }

  //     const user = data?.session?.user;

  //     if (!user) {
  //       console.error('User not found in session data.');
  //       alert('An error occurred. Please try again.');
  //       return;
  //     }

  //     // Update the user's password
  //     const updateResult = await supabase.auth.updateUser({
  //       password,
  //     });

  //     if (updateResult.error) {
  //       console.error('Error updating password:', updateResult.error);
  //       alert('There was an error updating your password.');
  //     } else {
  //       alert('Password updated successfully!');
  //     }
  //   } catch (error) {
  //     console.error('An unexpected error occurred:', error);
  //     alert('An unexpected error occurred');
  //   }
  // };

  const onAuthStateChange = async (event: string, session: any) => {
    if (event === 'PASSWORD_RECOVERY') {
      if (newPasswordRef.current) {
        await handlePasswordRecovery(newPasswordRef.current);
      } else {
        alert('Password cannot be empty.');
      }
    }
  };

  useEffect(() => {
    supabase.auth.onAuthStateChange(onAuthStateChange);
  }, []);

  useEffect(() => {
    newPasswordRef.current = newPassword;
  }, [newPassword]);

  const handleResetClick = () => {
    if (newPassword) {
      handlePasswordRecovery(newPassword);
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
