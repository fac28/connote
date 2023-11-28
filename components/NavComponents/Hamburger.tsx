import { NavbarContent, NavbarMenuToggle } from '@nextui-org/react';

type children = {
  isMenuOpen: boolean;
};

export default function Hamburger({ isMenuOpen }: children) {
  return (
    <NavbarContent className='sm:hidden pr-3' justify='start'>
      <NavbarMenuToggle aria-label={isMenuOpen ? 'Close menu' : 'Open menu'} />
    </NavbarContent>
  );
}
