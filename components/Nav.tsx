'use client';
import React from 'react';
import {
  Navbar,
  NavbarBrand,
  NavbarMenuToggle,
  NavbarMenuItem,
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

const menuLinks = {
  Profile: '/profile',
  'Poem Library': '/poemLibrary',
} as { [key: string]: string };

export default function Nav({ session }: { session: Session | null }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { setTheme } = useNextTheme();
  const [currentPathname, setCurrentPathname] = useState('');
  const pathname = usePathname();

  useEffect(() => {
    setCurrentPathname(pathname);
  }, [pathname]);

  const menuItems = ['SwitchTheme', 'Profile', 'Poem Library'];
  // const currentPathname =
  //   typeof window !== 'undefined' ? window.location.pathname : '';

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
        <NavbarBrand>
          <Link href='/'>
            <p className='logo'>Connote</p>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className='hidden sm:flex gap-4' justify='center'>
        <NavbarBrand>
          <Link href='/'>
            <p className='logo'>Connote</p>
          </Link>
        </NavbarBrand>

        {Object.keys(menuLinks).map((item, index) => (
          <NavbarItem key={`${item}-${index}`}>
            <div
              className={`w-full ${
                currentPathname === menuLinks[item] ? `font-bold` : ``
              }`}
            >
              <Link color='foreground' href={menuLinks[item]} size='lg'>
                {item}
              </Link>
            </div>
          </NavbarItem>
        ))}

        <NavbarItem>
          <Switch
            defaultSelected
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
              Account
            </Button>
          )}
        </NavbarItem>
      </NavbarContent>

      {/* <NavbarMenu className='mt-1'>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            {item === 'SwitchTheme' ? (
              <Switch
                defaultSelected
                size='sm'
                onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')}
              />
            ) : (
              <Link
                className='w-full'
                color={
                  index === 2
                    ? 'warning'
                    : index === menuItems.length - 1
                      ? 'danger'
                      : 'foreground'
                }
                href='#'
                size='lg'
              >
                {item}
              </Link>
            )}
          </NavbarMenuItem>
        ))}
      </NavbarMenu> */}

      <NavbarMenu className='mt-1'>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            {item === 'SwitchTheme' ? (
              <Switch
                defaultSelected
                size='sm'
                onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')}
              />
            ) : (
              <Link
                className='w-full'
                color={
                  menuLinks[item] === currentPathname ? 'warning' : 'foreground'
                }
                href={menuLinks[item]}
                size='lg'
              >
                {item}
              </Link>
            )}
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
