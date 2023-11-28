import React from 'react';
import { NavbarItem, Link } from '@nextui-org/react';

interface RenderNavLinksProps {
  currentPathname: string;
}

const menuLinks = {
  Profile: '/profile',
  'Poem Library': '/poemLibrary',
} as { [key: string]: string };

const RenderNavLinks: React.FC<RenderNavLinksProps> = ({ currentPathname }) => {
  return (
    <>
      {Object.keys(menuLinks).map((item, index) => (
        <NavbarItem key={`${item}-${index}`}>
          <div
            className={`w-full ${
              currentPathname === menuLinks[item] ? 'font-bold' : ''
            }`}
          >
            <Link color='foreground' href={menuLinks[item]} size='lg'>
              {item}
            </Link>
          </div>
        </NavbarItem>
      ))}
    </>
  );
};

export default RenderNavLinks;
