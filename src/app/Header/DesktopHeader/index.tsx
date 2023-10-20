"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { NetworkSwitch } from "../../Connect";
import { Discord } from "../../icons/Discord";
import { DriftLogo } from "../../icons/DriftLogo";
import { Instagram } from "../../icons/Instagram";
import Twitter from "../../icons/Twitter";
import "./header.css";

export type NavItem = {
  name?: string;
  icon?: React.ReactNode;
  link: string;
  subItems?: NavItem[];
};

export const leftNavItems: NavItem[] = [
  {
    name: "Prints",
    link: "",
  },
  {
    name: "Gallery",
    link: "",
  },
  {
    name: "Publications",
    link: "",
  },
  {
    name: "Apps",
    link: "",
    subItems: [
      {
        name: "WMVG Migration",
        link: "",
      },
      {
        name: "First Day Out",
        link: "",
      },
    ],
  },
  {
    name: "Vault",
    link: "",
  },
];

export const rightNavItems: NavItem[] = [
  {
    name: "About",
    link: "",
  },
  {
    name: "Contact",
    link: "",
  },
  {
    icon: <Instagram size={22} />,
    link: "",
  },
  {
    icon: <Twitter size={18} />,
    link: "",
  },
  {
    icon: <Discord size={22} />,
    link: "",
  },
];

export const Header = () => {
  const [loaded, setLoaded] = useState(false);
  const { address } = useAccount();

  useEffect(() => {
    setLoaded(true);
  }, [address]);

  return (
    <div className="flex items-center justify-center pt-[3.62rem] pb-16 max-w-screen-xl mx-auto relative">
      <div className="flex space-x-6 justify-between items-center absolute left-[0.7rem]">
        {leftNavItems.map((item) => {
          return (
            <NavbarItem
              key={item.name}
              item={item}
            />
          );
        })}
      </div>
      <Link
        href="/"
        className="py-1"
      >
        <DriftLogo />
      </Link>
      <div className="flex space-x-6 justify-between items-center absolute right-4">
        {rightNavItems.map((item, index) => {
          return (
            <NavbarItem
              key={item.name || "" + index}
              item={item}
            />
          );
        })}
        {address && loaded && (
          <div className="flex space-x-2">
            <NetworkSwitch />
          </div>
        )}
      </div>
    </div>
  );
};

const NavbarItem = ({ item }: { item: NavItem }) => {
  return (
    <a
      key={item.name}
      href={item.link}
      className="uppercase font-sans text-xs tracking-[0.09em]"
    >
      {item.name ? item.name : <div className="w-[1.2rem]">{item.icon}</div>}
    </a>
  );
};
