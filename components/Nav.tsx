'use client';
import React from 'react';
import {
  Navbar,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
} from '@nextui-org/react';
import { useState, useEffect } from 'react';
import { Session } from '@supabase/auth-helpers-nextjs';
import { useTheme as useNextTheme } from 'next-themes';
import { Switch } from '@nextui-org/react';
import { usePathname } from 'next/navigation';
import Logo from './NavComponents/Logo';
import RenderNavLinks from './NavComponents/renderNavLinks';

export default function Nav({ session }: { session: Session | null }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { setTheme } = useNextTheme();
  const [currentPathname, setCurrentPathname] = useState('');
  const pathname = usePathname();

  useEffect(() => {
    setCurrentPathname(pathname);
  }, [pathname]);

  return (
    <Navbar
      className={'blue'}
      isBordered
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      style={{ maxWidth: '100vw' }}
    >
      <NavbarContent className='sm:hidden pr-3' justify='start'>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        />
      </NavbarContent>

      <NavbarContent className='sm:hidden' justify='center'>
        <Logo />
      </NavbarContent>

      <NavbarContent className='hidden sm:flex gap-4' justify='center'>
        <Logo />

        <RenderNavLinks currentPathname={currentPathname} />

        <NavbarItem>
          <Switch
            size='sm'
            onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')}
          />
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify='end'>
        <NavbarItem>
          {session ? (
            <form action='/signout' method='post'>
              <button className='btn'>Logout</button>
            </form>
          ) : (
            <Button as={Link} className='btn' href='/account' variant='flat'>
              Login
            </Button>
          )}
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu className='mt-1'>
        <Switch
          size='sm'
          onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')}
        />
        <RenderNavLinks currentPathname={currentPathname} />
      </NavbarMenu>
    </Navbar>
  );
}
