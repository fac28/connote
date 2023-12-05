'use client';
// LoginForm.tsx
import React, { useState, FormEvent } from 'react';
import { Input } from '@nextui-org/react';

interface LoginFormProps {
  handleSubmit: (
    e: FormEvent<HTMLFormElement>,
    email: string,
    password: string
  ) => Promise<void>;
  isLoading: boolean;
  handleForgotPassword: (email: string) => Promise<void>; // Add email parameter
}

const LoginForm: React.FC<LoginFormProps> = ({
  handleSubmit,
  isLoading,
  handleForgotPassword,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (showForgotPassword) {
      // Check if email is provided before calling handleForgotPassword
      if (email.trim()) {
        await handleForgotPassword(email);
        setShowForgotPassword(false);
      }
    } else {
      await handleSubmit(e, email, password);
    }
  };

  return (
    <form
      className='flex flex-col items-center mt-10 gap-10'
      onSubmit={handleFormSubmit}
    >
      <p className='mt-2 text-sm italic'>
        {' '}
        {showForgotPassword
          ? 'Please enter your email.'
          : 'Please log in to your account.'}
      </p>
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
      {!showForgotPassword && (
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
      )}
      <button disabled={isLoading} className='button' type='submit'>
        {showForgotPassword ? 'Send Reset Email' : 'Login'}
      </button>
      {!showForgotPassword && (
        <p className='mt-2 text-sm'>
          <button className='link' onClick={() => setShowForgotPassword(true)}>
            Forgot Password?
          </button>
        </p>
      )}
    </form>
  );
};

export default LoginForm;
