"use client";
import React from "react";
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
} from "@nextui-org/react";

export default function Nav() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const menuItems = ["Profile", "Poem of the day", "Poem Library"];

  return (
    <Navbar isBordered isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent className="sm:hidden pr-3" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        />
      </NavbarContent>

      <NavbarContent className="sm:hidden" justify="center">
        <NavbarBrand>
          <p className="font-bold text-inherit">Connote</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarBrand>
          <p className="font-bold text-inherit ">Connote</p>
        </NavbarBrand>
        <NavbarItem>
          <Link color="foreground" href="/account">
            Profile
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link color="foreground" href="/poemOfTheDay" aria-current="page">
            Poem of the day
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="/poemLibrary">
            Poem Library
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          <Button as={Link} color="warning" href="/signup" variant="flat">
            Login / Sign Up
          </Button>
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu className="mt-1">
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              className="w-full"
              color={
                index === 2
                  ? "warning"
                  : index === menuItems.length - 1
                  ? "danger"
                  : "foreground"
              }
              href="#"
              size="lg"
            >
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
