import React from 'react';
import { NavbarItem, Link } from '@nextui-org/react';

interface RenderNavLinksProps {
  currentPathname: string;
  selectedColour: string;
}

const menuLinks = {
  Profile: '/profile',
  'Poem Library': '/poemLibrary',
} as { [key: string]: string };

const RenderNavLinks: React.FC<RenderNavLinksProps> = ({
  currentPathname,
  selectedColour,
}) => {
  return (
    <>
      {Object.keys(menuLinks).map((item, index) => (
        <NavbarItem key={`${item}-${index}`}>
          <div
            className={`w-full ${
              currentPathname === menuLinks[item] ? selectedColour : ''
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
