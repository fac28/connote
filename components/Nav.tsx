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
import { MoonIcon } from './MoonIcon';
import { SunIcon } from './SunIcon';
import Logo from './NavComponents/Logo';
import RenderNavLinks from './NavComponents/renderNavLinks';
import ProgressNav from './ProgressNav';

export default function Nav({ session }: { session: Session | null }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setTheme } = useNextTheme();
  const [currentPathname, setCurrentPathname] = useState('');
  const pathname = usePathname();
  const [isPromptOrResponsePage, setIsPromptOrResponsePage] = useState(false);
  const initialSwitchState = theme === 'dark';

  const toggleTheme = (isDarkTheme: any) => {
    setTheme(isDarkTheme ? 'dark' : 'light');
    if (isDarkTheme) {
      document.documentElement.classList.add('backgroundContainerDark');
      document.documentElement.classList.remove('backgroundContainer');
    } else {
      document.documentElement.classList.add('backgroundContainer');
      document.documentElement.classList.remove('backgroundContainerDark');
    }
  };

  useEffect(() => {
    // Set initial class on load
    toggleTheme(theme === 'dark');
  });

  useEffect(() => {
    setCurrentPathname(pathname);

    const promptOrResponseRegex = /^\/\d+\/(prompts|responses)/;
    setIsPromptOrResponsePage(promptOrResponseRegex.test(pathname));
  }, [pathname]);

  return isPromptOrResponsePage ? (
    <ProgressNav />
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
        <RenderNavLinks
          currentPathname={currentPathname}
          selectedWeight='font-bold'
          selectedColour='foreground'
        />
        <NavbarItem>
          <Switch
            defaultSelected={initialSwitchState}
            color='warning'
            size='sm'
            onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')}
            thumbIcon={({ isSelected, className }) =>
              isSelected ? (
                <MoonIcon className={className} />
              ) : (
                <SunIcon className={className} />
              )
            }
          />
        </NavbarItem>
      </NavbarContent>

      {/* Both: Signout button */}
      <NavbarContent justify='end'>
        <NavbarItem>
          {session ? (
            <form action='/signout' method='post'>
              <button className='btn hover:opacity-80 active:scale-95 rounded-xl text-white p-2 duration-150'>
                Logout
              </button>
            </form>
          ) : (
            <Button
              as={Link}
              className='btn hover:opacity-80 active:scale-95 rounded-xl text-white p-2 duration-150'
              href='/account'
              variant='flat'
            >
              Login
            </Button>
          )}
        </NavbarItem>
      </NavbarContent>

      {/* Mobile: Switch, Links */}
      <NavbarMenu className='mt-1'>
        <Switch
          defaultSelected={initialSwitchState}
          color='warning'
          size='sm'
          onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')}
          thumbIcon={({ isSelected, className }) =>
            isSelected ? (
              <MoonIcon className={className} />
            ) : (
              <SunIcon className={className} />
            )
          }
        />
        <RenderNavLinks
          currentPathname={currentPathname}
          selectedColour='warning'
          selectedWeight=''
        />
      </NavbarMenu>
    </Navbar>
  );
}
