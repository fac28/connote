import { Ovo, Potta_One, Playfair_Display } from 'next/font/google';
import './globals.css';
import Providers from '../components/next/providers';
import Nav from '../components/Nav';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types/supabase';
import { Metadata } from 'next';
import Head from 'next/head';

export const ovo = Ovo({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-ovo',
  display: 'swap',
});

export const potta = Potta_One({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-potta',
  display: 'swap',
});

export const playfair = Playfair_Display({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-play',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Connote',
  description: 'Engage with poetry',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();
  [supabase];

  return (
    <html lang='en' className={ovo.className}>
      <link rel='icon' href='/favicon.png' />
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </Head>

      <body>
        <Providers>
          <div className='min-h-screen'>
            <Nav session={session} />
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
