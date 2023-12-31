'use client';
import React from 'react';
import { useState, useEffect, useMemo } from 'react';
import LoginForm from '@/components/supabase/LoginForm';
import AuthForm from '@/components/supabase/AuthForm';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { Tabs, Tab } from '@nextui-org/react';

const LogIn = () => {
  const router = useRouter();
  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const supabase = useMemo(() => createClientComponentClient(), []);

  const checkSession = async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    if (sessionData?.session?.user?.id) {
      router.push('/poemLibrary');
    }
  };

  useEffect(() => {
    checkSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    email: string,
    password: string
  ): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setFormError('');
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setFormError(error.message);
      setIsLoading(false);
    } else {
      window.location.reload();
    }
  };

  const handleSubmitSign = async (
    e: React.FormEvent<HTMLFormElement>,
    email: string,
    username: string,
    password: string
  ): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    const {
      data: { user },
      error,
    } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/account`,
      },
    });

    if (user) {
      const { error: insertError } = await supabase
        .from('profiles')
        .update([{ id: user.id, username: username }])
        .eq('id', user.id);

      if (insertError) {
        console.error('Error inserting profile:', insertError);
      }
    }

    if (error) {
      console.error('Sign-up error:', error);
      setFormError(error.message);
      setIsLoading(false);
    }
    if (!error) {
      router.push('/verify');
    }
  };
  const handleForgotPassword = async (email: string) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${location.origin}/passwordReset`,
      });

      if (error) {
        console.error('Error sending password reset email:', error);
        setFormError('Error sending password reset email');
      } else {
        setFormError('Password reset email sent. Check your inbox.');
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
      setFormError('An unexpected error occurred');
    }
  };

  return (
    <div className='flex flex-col items-center pt-4'>
      <Tabs aria-label='Options' color='warning' variant='solid'>
        <Tab key='login' title='Login'>
          <div className='text-center mt-10'>
            <h2 className='sub-heading'>Log In</h2>
            <LoginForm
              handleSubmit={handleSubmit}
              isLoading={isLoading}
              handleForgotPassword={handleForgotPassword}
            />
            {formError && <div>{formError}</div>}
          </div>
        </Tab>
        <Tab key='signup' title='Sign Up'>
          <div className='text-center mt-10'>
            <h2 className='sub-heading'>Sign up</h2>
            <p className='mt-2 text-sm italic'>Please create an account</p>
            <AuthForm handleSubmit={handleSubmitSign} isLoading={isLoading} />
            {formError && <div>{formError}</div>}
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};

export default LogIn;
