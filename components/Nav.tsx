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
import { Progress } from '@nextui-org/react';
import { useSearchParams } from 'next/navigation';

export default function Nav({ session }: { session: Session | null }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { setTheme } = useNextTheme();
  const [currentPathname, setCurrentPathname] = useState('');
  const pathname = usePathname();
  const [isPromptOrResponsePage, setIsPromptOrResponsePage] = useState(false);
  const [progress, setProgress] = useState(0);
  const searchParams = useSearchParams();
  const [promptNumber, setPromptNumber] = useState(0);
  const promptNumberValue = Number(searchParams.get('prompt'));

  useEffect(() => {
    setCurrentPathname(pathname);

    const promptOrResponseRegex = /^\/\d+\/(prompts|responses)/;
    setIsPromptOrResponsePage(promptOrResponseRegex.test(pathname));
  }, [pathname]);

  return isPromptOrResponsePage ? (
    <Navbar
      className={'blue'}
      isBordered
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      style={{ maxWidth: '100vw' }}
    >
      {/* Hamburger, Progressbar */}
      <NavbarContent className='pr-3' justify='start'>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        />
        <Progress size='sm' aria-label='Loading...' value={progress} />
      </NavbarContent>

      {/* Navlinks */}
      <NavbarMenu className='mt-1'>
        <Switch
          size='sm'
          onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')}
        />
        <RenderNavLinks currentPathname={currentPathname} />
      </NavbarMenu>
    </Navbar>
  ) : (
    <Navbar
      className={'blue'}
      isBordered
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      style={{ maxWidth: '100vw' }}
    >
      {/* Mobile: Hamburger */}
      <NavbarContent className='sm:hidden pr-3' justify='start'>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        />
      </NavbarContent>

      {/* Mobile: Logo */}
      <NavbarContent className='sm:hidden' justify='center'>
        <Logo />
      </NavbarContent>

      {/* Desktop: Logo, Links, Switch */}
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

      {/* Both: Signout button */}
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

      {/* Mobile: Switch, Links */}
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
