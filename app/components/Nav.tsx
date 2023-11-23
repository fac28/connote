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
    <Navbar
      className={"blue"}
      isBordered
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent className="sm:hidden pr-3" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        />
      </NavbarContent>

      <NavbarContent className="sm:hidden" justify="center">
        <NavbarBrand>
          <p className="logo">Connote</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarBrand>
          <p className="logo">Connote</p>
        </NavbarBrand>
        <NavbarItem>
          <Link color="foreground" href="/profile">
            Profile
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link className="red-400" href="/poemOfTheDay" aria-current="page">
            Poem of the day
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link className="text-connote_Orange" href="/poemLibrary">
            Poem Library
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          {/* {session.user ? (
            <form action="/signout" method="post">
              <Button className="btn" type="submit" variant="flat">
                Logout
              </Button>
            </form>
          ) : ( */}
          <Button as={Link} className="btn" href="/login" variant="flat">
            Login / Signup
          </Button>
          {/* )} */}
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
