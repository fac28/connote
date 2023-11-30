'use client';
import { useState, FormEvent } from 'react';
import { Input } from '@nextui-org/react';

interface AuthFormProps {
  handleSubmit: (
    e: FormEvent<HTMLFormElement>,
    email: string,
    username: string,
    password: string
  ) => Promise<void>;
  isLoading: boolean;
}

const AuthForm: React.FC<AuthFormProps> = ({ handleSubmit, isLoading }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // Add error message state

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check if password and confirm password match
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match'); // Update error message
      return;
    }

    // Continue with form submission
    await handleSubmit(e, email, username, password);
  };

  return (
    <form
      className='flex flex-col items-center mt-10 gap-10'
      onSubmit={handleFormSubmit}
    >
      <div className='flex flex-col items-center gap-1'>
        <Input
          size='md'
          label='Email'
          type='email'
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          isRequired
          labelPlacement='inside'
        />
      </div>
      <div className='flex flex-col items-center gap-1'>
        <Input
          size='md'
          type='text'
          onChange={(e) => setUsername(e.target.value)}
          value={username}
          isRequired
          label='Username'
          labelPlacement='inside'
        />
      </div>
      <div className='flex flex-col items-center gap-1'>
        <Input
          size='md'
          type='password'
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          label='Password'
          labelPlacement='inside'
          isRequired
        />
      </div>
      <div className='flex flex-col items-center gap-1'>
        <Input
          size='md'
          type='password'
          onChange={(e) => setConfirmPassword(e.target.value)}
          value={confirmPassword}
          label='Confirm Password'
          labelPlacement='inside'
          isRequired
        />
      </div>
      {errorMessage && <p className='text-red-500'>{errorMessage}</p>}{' '}
      {/* Display error message */}
      <button disabled={isLoading} className='button'>
        Create account
      </button>
    </form>
  );
};

export default AuthForm;
