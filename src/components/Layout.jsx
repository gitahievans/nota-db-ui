/* eslint-disable no-unused-vars */
import { useState } from "react";
import {
  AppShell,
  Group,
  Burger,
  UnstyledButton,
  Text,
  rem,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconHome2,
  IconSearch,
  IconFiles,
  IconInfoCircle,
  IconFileText,
  IconUpload,
} from "@tabler/icons-react";
import { NavLink } from "react-router-dom";

export function Layout({ children }) {
  const [opened, { toggle }] = useDisclosure();

  const navigationItems = [
    // { icon: IconHome2, label: "Home", link: "/" },
    // { icon: IconFiles, label: "Documents", link: "/documents" },
    // { icon: IconSearch, label: "Search", link: "/search" },
    { icon: IconUpload, label: "Upload New", link: "/upload" },
    // { icon: IconInfoCircle, label: "About", link: "/about" },
  ];

  const NavButton = ({ icon: Icon, label, link }) => (
    <div className="flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer transition-colors duration-300 hover:bg-orange-100">
      <Icon size={20} stroke={1.5} className="text-orange-600" />
      <Text size="sm" fw={500} className="text-gray-700 hover:text-orange-700">
        {label}
      </Text>
    </div>
  );

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { desktop: true, mobile: !opened },
      }}
      padding="md"
      className="bg-gray-50"
    >
      <AppShell.Header className="border-b border-gray-200 bg-orange-50">
        <div className="flex items-center justify-between border h-full">
          {/* <Burger
            opened={opened}
            onClick={toggle}
            hiddenFrom="sm"
            size="sm"
            className="text-orange-600"
          /> */}
          <div className="flex items-center justify-between w-full">
            <Group gap={rem(8)} className="flex items-center">
              <IconFileText
                size={30}
                stroke={1.5}
                className="text-orange-600"
              />
              <p className="text-xl font-bold text-orange-600">Nota DB</p>
            </Group>

            <div className="flex items-center gap-2">
              {navigationItems.map((item) => (
                <NavLink key={item.label} to={item.link}>
                  <NavButton key={item.label} {...item} />
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </AppShell.Header>

      <AppShell.Main className="bg-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">{children}</div>
      </AppShell.Main>
    </AppShell>
  );
}
