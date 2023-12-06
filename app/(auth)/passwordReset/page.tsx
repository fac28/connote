'use client';
// import { useState, useEffect, useRef } from 'react';
// import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
// import { Input } from '@nextui-org/react';

// const supabase = createClientComponentClient();

// const PasswordReset: React.FC = () => {
//   const [newPassword, setNewPassword] = useState('');
//   const newPasswordRef = useRef<string | null>(null);

//   const handlePasswordRecovery = async (password: string) => {
//     try {
//       const { data, error } = await supabase.auth.updateUser({
//         password,
//       });

//       if (data) {
//         alert('Password updated successfully!');
//       }

//       if (error) {
//         alert('There was an error updating your password.');
//       }
//     } catch (error) {
//       console.error('An unexpected error occurred:', error);
//       alert('An unexpected error occurred');
//     }
//   };

//   const onAuthStateChange = async (event: string, session: any) => {
//     if (event === 'PASSWORD_RECOVERY') {
//       if (newPasswordRef.current) {
//         await handlePasswordRecovery(newPasswordRef.current);
//       } else {
//         alert('Password cannot be empty.');
//       }
//     }
//   };

//   useEffect(() => {
//     supabase.auth.onAuthStateChange(onAuthStateChange);
//   }, []);

//   useEffect(() => {
//     newPasswordRef.current = newPassword;
//   }, [newPassword]);

//   const handleResetClick = () => {
//     if (newPassword) {
//       handlePasswordRecovery(newPassword);
//     } else {
//       alert('Password cannot be empty.');
//     }
//   };

//   return (
//     <div>
//       <h2 className='sub-heading'>Reset password</h2>
//       <form className='flex flex-col items-center mt-10 gap-10'>
//         <p className='mt-2 text-sm italic'>Enter your new password</p>
//         <div className='flex flex-col items-center gap-1'>
//           <Input
//             size='md'
//             type='password'
//             onChange={(e) => setNewPassword(e.target.value)}
//             value={newPassword}
//             label='Password'
//             labelPlacement='inside'
//             isRequired
//           />
//         </div>

//         <button className='button' onClick={handleResetClick}>
//           Reset Password
//         </button>
//       </form>
//     </div>
//   );
// };

// export default PasswordReset;
// PasswordReset component
import { useState, useEffect, useRef } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Input } from '@nextui-org/react';

const supabase = createClientComponentClient();

const PasswordReset: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');

  const handlePasswordRecovery = async (password: string, token: string) => {
    try {
      // Create a new object with the properties expected by updateUser
      const updateData = {
        password,
        // Include other properties from UserAttributes if needed
      };

      const { data, error } = await supabase.auth.updateUser(updateData, {
        // Pass additional options if needed
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
    const url = new URL(window.location.href);
    const token = url.searchParams.get('token');
    const type = url.searchParams.get('type');

    if (type === 'recovery' && token) {
      handlePasswordRecovery(newPassword, token);
    }
  }, [newPassword]);

  const handleResetClick = () => {
    if (newPassword) {
      handlePasswordRecovery(newPassword, ''); // Pass an empty string for token
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
