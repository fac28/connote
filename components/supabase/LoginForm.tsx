'use client';
import { useState, FormEvent } from 'react';
import { Input } from '@nextui-org/react';

interface LoginFormProps {
  handleSubmit: (
    e: FormEvent<HTMLFormElement>,
    email: string,
    password: string
  ) => Promise<void>;
  isLoading: boolean;
}

useState;
const LoginForm: React.FC<LoginFormProps> = ({ handleSubmit, isLoading }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  return (
    <form
      className='flex flex-col items-center mt-10 gap-10'
      onSubmit={(e) => handleSubmit(e, email, password)}
    >
      <div className='flex flex-col items-center gap-1'>
        <Input
          size='md'
          label='email'
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
          type='password'
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          label='Password'
          labelPlacement='inside'
          isRequired
        />
      </div>
      <button disabled={isLoading} className='button'>
        Login
      </button>
    </form>
  );
};

export default LoginForm;
