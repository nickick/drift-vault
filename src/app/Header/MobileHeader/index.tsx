"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { NetworkSwitch } from "@/app/Connect";
import { DriftLogo } from "@/app/icons/DriftLogo";
import Twitter from "@/app/icons/Twitter";
import { Sling as Hamburger } from "hamburger-react";
import "./header.css";

type NavItem = {
  name?: string;
  icon?: React.ReactNode;
  link: string;
  subItems?: NavItem[];
};

const rightNavItems: NavItem[] = [
  {
    icon: <Twitter size={22} />,
    link: "",
  },
];

export const MobileHeader = () => {
  const [loaded, setLoaded] = useState(false);
  const { address } = useAccount();

  useEffect(() => {
    setLoaded(true);
  }, [address]);

  return (
    <div className="flex items-center justify-center pt-[3.62rem] pb-16 max-w-screen-xl mx-auto relative">
      <div className="flex space-x-6 items-center absolute left-4">
        <Hamburger />
      </div>
      <Link
        href="/"
        className="py-1"
      >
        <DriftLogo />
      </Link>
      <div className="flex space-x-6 items-center absolute right-4">
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
