import { NavbarBrand } from '@nextui-org/react';
import Link from 'next/link';

export default function Logo() {
  return (
    <NavbarBrand>
      <Link href='/'>
        <p className='logo'>Connote</p>
      </Link>
    </NavbarBrand>
  );
}
