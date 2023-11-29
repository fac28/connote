'use client';
import React from 'react';
import {
  Navbar,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarContent,
} from '@nextui-org/react';
import { useState, useEffect } from 'react';
import { useTheme as useNextTheme } from 'next-themes';
import { Switch } from '@nextui-org/react';
import { usePathname } from 'next/navigation';
import RenderNavLinks from './NavComponents/renderNavLinks';
import { Progress } from '@nextui-org/react';
import { useSearchParams } from 'next/navigation';

export default function ProgressNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { setTheme } = useNextTheme();
  const pathname = usePathname();
  const [promptNumber, setPromptNumber] = useState(0);
  const searchParams = useSearchParams();

  useEffect(() => {
    const x = `${searchParams}`;
    const indexOfFirstEquals = x.indexOf('=');
    const valueAfterFirstEquals = x.substring(indexOfFirstEquals + 1);
    setPromptNumber(Number(valueAfterFirstEquals));
  }, [pathname, searchParams]);

  return (
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
        <Progress
          size='sm'
          aria-label='Loading...'
          value={(promptNumber + 1) * 33}
          color='warning'
        />
      </NavbarContent>

      {/* Navlinks */}
      <NavbarMenu className='mt-1'>
        <Switch
          size='sm'
          onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')}
        />
        <RenderNavLinks
          currentPathname={pathname}
          selectedWeight=''
          selectedColour='warning'
        />
      </NavbarMenu>
    </Navbar>
  );
}
