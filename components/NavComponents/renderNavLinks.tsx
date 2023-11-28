import React from 'react';
import { NavbarItem, Link } from '@nextui-org/react';

interface RenderNavLinksProps {
  currentPathname: string;
  selectedColour:
    | 'warning'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'foreground';
  selectedWeight: string;
}

const menuLinks = {
  Profile: '/profile',
  'Poem Library': '/poemLibrary',
} as { [key: string]: string };

const RenderNavLinks: React.FC<RenderNavLinksProps> = ({
  currentPathname,
  selectedColour,
  selectedWeight,
}) => {
  return (
    <>
      {Object.keys(menuLinks).map((item, index) => (
        <NavbarItem key={`${item}-${index}`}>
          <div
            className={`w-full ${
              currentPathname === menuLinks[item] ? selectedWeight : ''
            }`}
          >
            <Link
              color={
                menuLinks[item] === currentPathname
                  ? selectedColour
                  : 'foreground'
              }
              href={menuLinks[item]}
              size='lg'
            >
              {item}
            </Link>
          </div>
        </NavbarItem>
      ))}
    </>
  );
};

export default RenderNavLinks;
